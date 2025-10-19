import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const isPublic = searchParams.get('isPublic');
    const projectId = searchParams.get('projectId');
    const id = searchParams.get('id');
    const upcoming = searchParams.get('upcoming'); // กิจกรรมที่กำลังจะมาถึง
    const limit = searchParams.get('limit'); // จำกัดจำนวน
    
    // ถ้าต้องการข้อมูลกิจกรรมเฉพาะ
    if (id) {
      const activity = await prisma.activity.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          project: {
            select: {
              id: true,
              title: true,
              academicYear: true,
              status: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  color: true
                }
              }
            }
          }
        }
      });

      if (!activity) {
        return NextResponse.json(
          { success: false, error: 'Activity not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: activity.id,
          title: activity.title,
          description: activity.description,
          projectId: activity.projectId,
          categoryId: activity.categoryId,
          category: activity.category ? {
            id: activity.category.id,
            name: activity.category.name,
            slug: activity.category.slug
          } : { id: "default", name: "ทั่วไป", slug: "general" },
          type: activity.type,
          startDate: activity.startDate,
          endDate: activity.endDate,
          location: activity.location,
          status: activity.status,
          isPublic: activity.isPublic,
          createdAt: activity.createdAt,
          updatedAt: activity.updatedAt,
          tags: activity.tags?.map((t: any) => ({
            id: t.tag.id,
            name: t.tag.name,
            slug: t.tag.slug
          })) || [],
          image: activity.image,
          gallery: activity.gallery,
          author: activity.author ? {
            firstName: activity.author.firstName || '',
            lastName: activity.author.lastName || '',
            email: activity.author.email || ''
          } : { firstName: '', lastName: '', email: '' }
        }
      });
    }
    
    // สร้าง filter conditions
    const whereCondition: any = {};
    
    if (category) {
      whereCondition.category = {
        slug: {
          equals: category,
          mode: 'insensitive'
        }
      };
    }
    
    if (type) {
      whereCondition.type = type.toUpperCase();
    }
    
    if (status) {
      whereCondition.status = status.toUpperCase();
    }
    
    if (isPublic !== null) {
      whereCondition.isPublic = isPublic === 'true';
    } else {
      // Default: แสดงเฉพาะกิจกรรมสาธารณะ
      whereCondition.isPublic = true;
    }

    // Filter upcoming activities (กิจกรรมที่ยังไม่เริ่ม หรือกำลังดำเนินการ)
    if (upcoming === 'true') {
      whereCondition.startDate = {
        gte: new Date() // เริ่มวันนี้หรือหลังจากนี้
      };
      whereCondition.status = 'PUBLISHED'; // เฉพาะที่ published
    }

    const activities = await prisma.activity.findMany({
      where: whereCondition,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: [
        { startDate: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined // จำกัดจำนวนถ้ามี
    });

    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      categoryId: activity.categoryId,
      type: activity.type,
      startDate: activity.startDate,
      endDate: activity.endDate,
      location: activity.location,
      status: activity.status,
      isPublic: activity.isPublic,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      image: activity.image,
      gallery: activity.gallery,
      projectId: activity.projectId,
      authorId: activity.authorId,
      author: {
        firstName: activity.author?.firstName || '',
        lastName: activity.author?.lastName || '',
        email: activity.author?.email || ''
      }
    }));

    return NextResponse.json({
      success: true,
      data: formattedActivities,
      total: formattedActivities.length
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title,
      description,
      authorId,
      authorEmail,
      projectId,
      categoryId,
      type,
      startDate,
      endDate,
      location,
      isPublic = true,
      image,
      gallery
    } = body;

    if (!title || !description || !type || !startDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ค้นหา author จาก email หรือ ID
    let author;
    if (authorEmail) {
      author = await prisma.user.findUnique({
        where: { email: authorEmail }
      });
    } else if (authorId) {
      author = await prisma.user.findUnique({
        where: { id: authorId }
      });
    }

    // ถ้าไม่พบ ให้ใช้ admin user แทน
    if (!author) {
      author = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      });
    }

    if (!author) {
      return NextResponse.json(
        { success: false, error: 'No valid user found for activity creation' },
        { status: 400 }
      );
    }

    // ตรวจสอบ projectId หากมีการระบุ
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      });

      if (!project) {
        return NextResponse.json(
          { success: false, error: 'Invalid project ID' },
          { status: 400 }
        );
      }
    }

    const newActivity = await prisma.activity.create({
      data: {
        title,
        description,
        authorId: author.id,
        projectId: projectId || null,
        categoryId: categoryId || null,
        type: type.toUpperCase(),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location: location || null,
        isPublic,
        image: image || null,
        gallery: gallery || null,
        status: 'PLANNING'
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newActivity.id,
        title: newActivity.title,
        description: newActivity.description,
        categoryId: newActivity.categoryId,
        type: newActivity.type,
        startDate: newActivity.startDate,
        endDate: newActivity.endDate,
        location: newActivity.location,
        status: newActivity.status,
        isPublic: newActivity.isPublic,
        createdAt: newActivity.createdAt,
        updatedAt: newActivity.updatedAt,
        image: newActivity.image,
        gallery: newActivity.gallery,
        projectId: newActivity.projectId,
        authorId: newActivity.authorId,
        author: newActivity.author
      },
      message: 'Activity created successfully'
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      title,
      description,
      categoryId,
      type,
      startDate,
      endDate,
      location,
      status,
      isPublic,
      image,
      gallery,
      projectId
    } = body;

    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (type) updateData.type = type.toUpperCase();
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (location !== undefined) updateData.location = location;
    if (status) updateData.status = status.toUpperCase();
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (image !== undefined) updateData.image = image;
    if (gallery !== undefined) updateData.gallery = gallery;
    if (projectId !== undefined) updateData.projectId = projectId;

    const updatedActivity = await prisma.activity.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedActivity.id,
        title: updatedActivity.title,
        description: updatedActivity.description,
        categoryId: updatedActivity.categoryId,
        type: updatedActivity.type,
        startDate: updatedActivity.startDate,
        endDate: updatedActivity.endDate,
        location: updatedActivity.location,
        status: updatedActivity.status,
        isPublic: updatedActivity.isPublic,
        createdAt: updatedActivity.createdAt,
        updatedAt: updatedActivity.updatedAt,
        image: updatedActivity.image,
        gallery: updatedActivity.gallery,
        projectId: updatedActivity.projectId,
        authorId: updatedActivity.authorId,
        author: {
          firstName: updatedActivity.author?.firstName || '',
          lastName: updatedActivity.author?.lastName || '',
          email: updatedActivity.author?.email || ''
        }
      },
      message: 'Activity updated successfully'
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    await prisma.activity.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}