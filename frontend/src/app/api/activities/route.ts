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
          category: activity.category,
          type: activity.type,
          startDate: activity.startDate,
          endDate: activity.endDate,
          location: activity.location,
          maxParticipants: activity.maxParticipants,
          currentParticipants: activity.currentParticipants,
          status: activity.status,
          isPublic: activity.isPublic,
          requirements: activity.requirements,
          budget: activity.budget,
          order: activity.order,
          createdAt: activity.createdAt,
          updatedAt: activity.updatedAt,
          tags: activity.tags ? JSON.parse(activity.tags) : [],
          image: activity.image,
          author: {
            firstName: activity.author?.firstName || '',
            lastName: activity.author?.lastName || '',
            email: activity.author?.email || ''
          }
        }
      });
    }
    
    // สร้าง filter conditions
    const whereCondition: any = {};
    
    if (category) {
      whereCondition.category = {
        contains: category,
        mode: 'insensitive'
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
      ]
    });

    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      category: activity.category,
      type: activity.type,
      startDate: activity.startDate,
      endDate: activity.endDate,
      location: activity.location,
      maxParticipants: activity.maxParticipants,
      currentParticipants: activity.currentParticipants,
      status: activity.status,
      isPublic: activity.isPublic,
      requirements: activity.requirements,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      tags: activity.tags ? JSON.parse(activity.tags) : [],
      image: activity.image,
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
      category,
      type,
      startDate,
      endDate,
      location,
      maxParticipants,
      isPublic = true,
      requirements,
      budget,
      tags = [],
      image
    } = body;

    if (!title || !description || !category || !type || !startDate) {
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
        category,
        type: type.toUpperCase(),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        maxParticipants: maxParticipants && typeof maxParticipants === 'string' ? 
          parseInt(maxParticipants) : maxParticipants,
        isPublic,
        requirements,
        budget: budget && typeof budget === 'string' ? 
          parseFloat(budget) : budget,
        tags: JSON.stringify(tags),
        image,
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
        category: newActivity.category,
        type: newActivity.type,
        startDate: newActivity.startDate,
        endDate: newActivity.endDate,
        location: newActivity.location,
        maxParticipants: newActivity.maxParticipants,
        currentParticipants: newActivity.currentParticipants,
        status: newActivity.status,
        isPublic: newActivity.isPublic,
        requirements: newActivity.requirements,
        createdAt: newActivity.createdAt,
        tags: newActivity.tags ? JSON.parse(newActivity.tags) : [],
        image: newActivity.image,
        author: {
          firstName: newActivity.author?.firstName || '',
          lastName: newActivity.author?.lastName || '',
          email: newActivity.author?.email || ''
        }
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
      category,
      type,
      startDate,
      endDate,
      location,
      maxParticipants,
      currentParticipants,
      status,
      isPublic,
      requirements,
      tags,
      image
    } = body;

    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (type) updateData.type = type.toUpperCase();
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (location) updateData.location = location;
    if (maxParticipants) updateData.maxParticipants = parseInt(maxParticipants);
    if (currentParticipants !== undefined) updateData.currentParticipants = parseInt(currentParticipants);
    if (status) updateData.status = status.toUpperCase();
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (requirements) updateData.requirements = requirements;
    if (tags) updateData.tags = JSON.stringify(tags);
    if (image) updateData.image = image;

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
        category: updatedActivity.category,
        type: updatedActivity.type,
        startDate: updatedActivity.startDate,
        endDate: updatedActivity.endDate,
        location: updatedActivity.location,
        maxParticipants: updatedActivity.maxParticipants,
        currentParticipants: updatedActivity.currentParticipants,
        status: updatedActivity.status,
        isPublic: updatedActivity.isPublic,
        requirements: updatedActivity.requirements,
        createdAt: updatedActivity.createdAt,
        updatedAt: updatedActivity.updatedAt,
        tags: updatedActivity.tags ? JSON.parse(updatedActivity.tags) : [],
        image: updatedActivity.image,
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