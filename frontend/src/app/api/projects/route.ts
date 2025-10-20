import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const isActive = searchParams.get('isActive');
    const id = searchParams.get('id');
    
    // ถ้าต้องการข้อมูลโครงการเฉพาะ
    if (id) {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          activities: {
            include: {
              author: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            },
            orderBy: {
              startDate: 'asc'
            }
          }
        }
      });

      if (!project) {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: project.id,
          code: project.code,
          title: project.title,
          description: project.description,
          academicYear: project.academicYear,
          semester: project.semester,
          status: project.status,
          startDate: project.startDate,
          endDate: project.endDate,
          budget: project.budget,
          isActive: project.isActive,
          image: project.image,
          planFile: project.planFile,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          authorId: project.authorId,
          author: {
            firstName: project.author?.firstName || '',
            lastName: project.author?.lastName || '',
            email: project.author?.email || ''
          }
        }
      });
    }
    
    // สร้าง filter conditions
    const whereCondition: any = {};
    
    if (year) {
      whereCondition.year = parseInt(year);
    }
    
    if (status) {
      whereCondition.status = status.toUpperCase();
    }
    
    if (priority) {
      whereCondition.priority = priority.toUpperCase();
    }

    const projects = await prisma.project.findMany({
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
        { startDate: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    const formattedProjects = projects.map(project => ({
          id: project.id,
          code: project.code,
          title: project.title,
          description: project.description,
          academicYear: project.academicYear,
          semester: project.semester,
          status: project.status,
          startDate: project.startDate,
          endDate: project.endDate,
          budget: project.budget,
          isActive: project.isActive,
          image: project.image,
          planFile: project.planFile,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          authorId: project.authorId,
          author: {
            firstName: project.author?.firstName || '',
            lastName: project.author?.lastName || '',
            email: project.author?.email || ''
          }
    }));

    return NextResponse.json({
      success: true,
      data: formattedProjects,
      total: formattedProjects.length
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
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
      code,
      title,
      description,
      academicYear,
      semester,
      status = 'PLANNING',
      startDate,
      endDate,
      budget,
      isActive = true,
      image,
      planFile
    } = body;

    if (!code || !title || !description || !startDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get session to find user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Find user by email instead of using session.user.id
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found in database' 
      }, { status: 404 });
    }

    console.log('Found user for project creation:', user.id, user.email);

    if (isNaN(new Date(startDate).getTime()) || (endDate && isNaN(new Date(endDate).getTime()))) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format for startDate or endDate' },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(academicYear)) || parseInt(academicYear) < 2000 || parseInt(academicYear) > new Date().getFullYear() + 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid academic year' },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(semester)) || parseInt(semester) < 1 || parseInt(semester) > 3) {
      return NextResponse.json(
        { success: false, error: 'Invalid semester value' },
        { status: 400 }
      );
    }

    if (new Date(endDate) < new Date(startDate)) {
      return NextResponse.json(
        { success: false, error: 'End date cannot be earlier than start date' },
        { status: 400 }
      );
    }

    try {
      const newProject = await prisma.project.create({
        data: {
          code,
          title,
          description,
          authorId: user.id,
          academicYear: parseInt(academicYear),
          semester: parseInt(semester),
          status: status.toUpperCase(),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          budget: budget ? parseFloat(budget) : null,
          isActive: isActive !== false,
          image: image || null,
          planFile: planFile || null
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
          id: newProject.id,
          code: newProject.code,
          title: newProject.title,
          description: newProject.description,
          academicYear: newProject.academicYear,
          semester: newProject.semester,
          status: newProject.status,
          startDate: newProject.startDate,
          endDate: newProject.endDate,
          budget: newProject.budget,
          isActive: newProject.isActive,
          image: newProject.image,
          planFile: newProject.planFile,
          createdAt: newProject.createdAt
        }
      });
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project. Please try again later.';
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating project:', error);
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
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      code,
      title,
      description,
      academicYear,
      semester,
      status,
      startDate,
      endDate,
      budget,
      isActive,
      image,
      planFile
    } = body;

    const updateData: any = {};
    
    if (code) updateData.code = code;
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (academicYear !== undefined) updateData.academicYear = parseInt(academicYear);
    if (semester !== undefined) updateData.semester = parseInt(semester);
    if (status) updateData.status = status.toUpperCase();
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (budget !== undefined) updateData.budget = budget ? parseFloat(budget) : null;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (image !== undefined) updateData.image = image;
    if (planFile !== undefined) updateData.planFile = planFile;

    const updatedProject = await prisma.project.update({
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
        id: updatedProject.id,
        code: updatedProject.code,
        title: updatedProject.title,
        description: updatedProject.description,
        academicYear: updatedProject.academicYear,
        semester: updatedProject.semester,
        status: updatedProject.status,
        startDate: updatedProject.startDate,
        endDate: updatedProject.endDate,
        budget: updatedProject.budget,
        isActive: updatedProject.isActive,
        image: updatedProject.image,
        planFile: updatedProject.planFile,
        createdAt: updatedProject.createdAt,
        updatedAt: updatedProject.updatedAt,
        authorId: updatedProject.authorId,
        author: {
          firstName: updatedProject.author?.firstName || '',
          lastName: updatedProject.author?.lastName || '',
          email: updatedProject.author?.email || ''
        }
      },
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
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
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
