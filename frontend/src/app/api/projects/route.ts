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
              order: 'asc'
            }
          },
          reports: {
            orderBy: {
              reportDate: 'desc'
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
          title: project.title,
          description: project.description,
          shortDescription: project.shortDescription,
          year: project.year,
          status: project.status,
          priority: project.priority,
          startDate: project.startDate,
          endDate: project.endDate,
          totalBudget: project.totalBudget,
          usedBudget: project.usedBudget,
          objectives: project.objectives,
          targetGroup: project.targetGroup,
          expectedResults: project.expectedResults,
          sponsor: project.sponsor,
          coordinator: project.coordinator,
          isActive: project.isActive,
          image: project.image,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
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
        { priority: 'desc' },
        { startDate: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    const formattedProjects = projects.map(project => ({
          id: project.id,
          code: project.code,
          title: project.title,
          description: project.description,
          shortDescription: project.shortDescription,
          year: project.year,
          status: project.status,
          priority: project.priority,
          startDate: project.startDate,
          endDate: project.endDate,
          totalBudget: project.totalBudget,
          usedBudget: project.usedBudget,
          objectives: project.objectives,
          targetGroup: project.targetGroup,
          expectedResults: project.expectedResults,
          sponsor: project.sponsor,
          coordinator: project.coordinator,
          isActive: project.isActive,
          image: project.image,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
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
      shortDescription,
      year,
      status = 'PLANNING',
      priority = 'MEDIUM',
      startDate,
      endDate,
      totalBudget,
      objectives,
      targetGroup,
      expectedResults,
      sponsor,
      coordinator,
      isActive = true,
      image
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

    const newProject = await prisma.project.create({
      data: {
        code,
        title,
        description,
        shortDescription,
        authorId: user.id, // Use the found user ID
        year: year ? parseInt(year) : new Date().getFullYear(),
        status: status.toUpperCase(),
        priority: priority.toUpperCase(),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : new Date(startDate),
        totalBudget: totalBudget ? parseFloat(totalBudget) : null,
        objectives,
        targetGroup,
        expectedResults,
        sponsor,
        coordinator,
        isActive: isActive !== false,
        image
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
        shortDescription: newProject.shortDescription,
        year: newProject.year,
        status: newProject.status,
        priority: newProject.priority,
        startDate: newProject.startDate,
        endDate: newProject.endDate,
        totalBudget: newProject.totalBudget,
        usedBudget: newProject.usedBudget,
        objectives: newProject.objectives,
        targetGroup: newProject.targetGroup,
        expectedResults: newProject.expectedResults,
        sponsor: newProject.sponsor,
        coordinator: newProject.coordinator,
        isActive: newProject.isActive,
        image: newProject.image,
        createdAt: newProject.createdAt,
        updatedAt: newProject.updatedAt,
        author: newProject.author
      },
      message: 'Project created successfully'
    });
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
      title,
      description,
      shortDescription,
      category,
      status,
      priority,
      startDate,
      endDate,
      progress,
      technologies,
      features,
      challenges,
      achievements,
      budget,
      sponsor,
      targetUsers,
      impact,
      githubUrl,
      demoUrl,
      images
    } = body;

    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (shortDescription) updateData.shortDescription = shortDescription;
    if (category) updateData.category = category;
    if (status) updateData.status = status.toUpperCase();
    if (priority) updateData.priority = priority.toUpperCase();
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (progress !== undefined) updateData.progress = parseInt(progress);
    if (technologies) updateData.technologies = JSON.stringify(technologies);
    if (features) updateData.features = JSON.stringify(features);
    if (challenges) updateData.challenges = JSON.stringify(challenges);
    if (achievements) updateData.achievements = JSON.stringify(achievements);
    if (budget !== undefined) updateData.budget = budget ? parseFloat(budget) : null;
    if (sponsor) updateData.sponsor = sponsor;
    if (targetUsers) updateData.targetUsers = targetUsers;
    if (impact) updateData.impact = impact;
    if (githubUrl) updateData.githubUrl = githubUrl;
    if (demoUrl) updateData.demoUrl = demoUrl;
    if (images) updateData.images = JSON.stringify(images);

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
        title: updatedProject.title,
        description: updatedProject.description,
        shortDescription: updatedProject.shortDescription,
        year: updatedProject.year,
        status: updatedProject.status,
        priority: updatedProject.priority,
        startDate: updatedProject.startDate,
        endDate: updatedProject.endDate,
        totalBudget: updatedProject.totalBudget,
        usedBudget: updatedProject.usedBudget,
        objectives: updatedProject.objectives,
        targetGroup: updatedProject.targetGroup,
        expectedResults: updatedProject.expectedResults,
        sponsor: updatedProject.sponsor,
        coordinator: updatedProject.coordinator,
        isActive: updatedProject.isActive,
        image: updatedProject.image,
        createdAt: updatedProject.createdAt,
        updatedAt: updatedProject.updatedAt,
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