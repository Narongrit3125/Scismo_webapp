import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, year, totalBudget, objectives, coordinator } = body;

    // Get session to find user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found in database' 
      }, { status: 404 });
    }

    console.log('Creating project for user:', user.id, user.email);

    // Generate unique project code
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const yearSuffix = currentYear.toString().slice(-2); // Last 2 digits of year
    const randomCode = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const projectCode = `SC${yearSuffix}-${randomCode}`;

    // Create project
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        code: projectCode,
        authorId: user.id,
        academicYear: currentYear,
        status: 'PLANNING',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        budget: totalBudget ? parseFloat(totalBudget) : null,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      project: {
        id: newProject.id,
        title: newProject.title,
        description: newProject.description,
        academicYear: newProject.academicYear,
        status: newProject.status,
        budget: newProject.budget,
        createdAt: newProject.createdAt
      }
    });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
