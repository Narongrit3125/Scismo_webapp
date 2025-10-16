import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const department = searchParams.get('department');
    const faculty = searchParams.get('faculty');
    const id = searchParams.get('id');
    
    // ถ้าต้องการข้อมูลสมาชิกคนเดียว
    if (id) {
      const member = await prisma.member.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      if (!member) {
        return NextResponse.json(
          { success: false, error: 'Member not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: member.id,
          studentId: member.studentId,
          firstName: member.user?.firstName,
          lastName: member.user?.lastName,
          email: member.user?.email,
          department: member.department,
          faculty: member.faculty,
          year: member.year,
          phone: member.phone,
          position: member.position,
          bio: member.bio,
          interests: member.interests ? JSON.parse(member.interests) : [],
          skills: member.skills ? JSON.parse(member.skills) : [],
          avatar: member.avatar,
          isActive: member.isActive,
          joinDate: member.joinDate
        }
      });
    }
    
    // สร้าง filter conditions
    const whereCondition: any = {};
    
    if (year) {
      whereCondition.year = parseInt(year);
    }
    
    if (department) {
      whereCondition.department = {
        contains: department,
        mode: 'insensitive'
      };
    }
    
    if (faculty) {
      whereCondition.faculty = {
        contains: faculty,
        mode: 'insensitive'
      };
    }

    const members = await prisma.member.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: [
        { year: 'desc' },
        { user: { firstName: 'asc' } }
      ]
    });

    const formattedMembers = members.map(member => ({
      id: member.id,
      studentId: member.studentId,
      firstName: member.user?.firstName,
      lastName: member.user?.lastName,
      email: member.user?.email,
      department: member.department,
      faculty: member.faculty,
      year: member.year,
      phone: member.phone,
      position: member.position,
      bio: member.bio,
      interests: member.interests ? JSON.parse(member.interests) : [],
      skills: member.skills ? JSON.parse(member.skills) : [],
      avatar: member.avatar,
      isActive: member.isActive,
      joinDate: member.joinDate
    }));

    return NextResponse.json({
      success: true,
      data: formattedMembers,
      total: formattedMembers.length
    });
  } catch (error) {
    console.error('Error fetching members:', error);
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
      userId,
      studentId, 
      department, 
      faculty,
      year,
      phone,
      position,
      bio,
      interests = [],
      skills = [],
      avatar
    } = body;

    if (!userId || !department || !faculty || !year) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if student ID already exists (if provided)
    if (studentId) {
      const existingMember = await prisma.member.findUnique({
        where: { studentId }
      });

      if (existingMember) {
        return NextResponse.json(
          { success: false, error: 'Student ID already exists' },
          { status: 400 }
        );
      }
    }

    const newMember = await prisma.member.create({
      data: {
        userId,
        studentId,
        department,
        faculty,
        year: parseInt(year),
        phone,
        position,
        bio,
        interests: JSON.stringify(interests),
        skills: JSON.stringify(skills),
        avatar,
        isActive: true
      },
      include: {
        user: {
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
        id: newMember.id,
        studentId: newMember.studentId,
        firstName: newMember.user?.firstName,
        lastName: newMember.user?.lastName,
        email: newMember.user?.email,
        department: newMember.department,
        faculty: newMember.faculty,
        year: newMember.year,
        phone: newMember.phone,
        position: newMember.position,
        bio: newMember.bio,
        interests: newMember.interests ? JSON.parse(newMember.interests) : [],
        skills: newMember.skills ? JSON.parse(newMember.skills) : [],
        avatar: newMember.avatar,
        isActive: newMember.isActive,
        joinDate: newMember.joinDate
      },
      message: 'Member created successfully'
    });
  } catch (error) {
    console.error('Error creating member:', error);
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
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      studentId,
      department, 
      faculty,
      year,
      phone,
      position,
      bio,
      interests,
      skills,
      avatar,
      isActive
    } = body;

    const updatedMember = await prisma.member.update({
      where: { id },
      data: {
        ...(studentId && { studentId }),
        ...(department && { department }),
        ...(faculty && { faculty }),
        ...(year && { year: parseInt(year) }),
        ...(phone && { phone }),
        ...(position && { position }),
        ...(bio && { bio }),
        ...(interests && { interests: JSON.stringify(interests) }),
        ...(skills && { skills: JSON.stringify(skills) }),
        ...(avatar && { avatar }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        user: {
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
        id: updatedMember.id,
        studentId: updatedMember.studentId,
        firstName: updatedMember.user?.firstName,
        lastName: updatedMember.user?.lastName,
        email: updatedMember.user?.email,
        department: updatedMember.department,
        faculty: updatedMember.faculty,
        year: updatedMember.year,
        phone: updatedMember.phone,
        position: updatedMember.position,
        bio: updatedMember.bio,
        interests: updatedMember.interests ? JSON.parse(updatedMember.interests) : [],
        skills: updatedMember.skills ? JSON.parse(updatedMember.skills) : [],
        avatar: updatedMember.avatar,
        isActive: updatedMember.isActive,
        joinDate: updatedMember.joinDate
      },
      message: 'Member updated successfully'
    });
  } catch (error) {
    console.error('Error updating member:', error);
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
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    await prisma.member.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}