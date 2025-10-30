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
        where: { id }
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
          name: member.name,
          studentId: member.studentId,
          email: member.email,
          department: member.department,
          faculty: member.faculty,
          year: member.year,
          academicYear: member.academicYear,
          phone: member.phone,
          position: member.position,
          division: member.division,
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
      orderBy: [
        { year: 'desc' },
        { name: 'asc' }
      ]
    });

    const formattedMembers = members.map(member => ({
      id: member.id,
      name: member.name, // Get name directly from member table
      studentId: member.studentId,
      email: member.email, // Get email directly from member table
      department: member.department,
      faculty: member.faculty,
      year: member.year,
      academicYear: member.academicYear,
      phone: member.phone,
      position: member.position,
      division: member.division,
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
      name,
      studentId, 
      email,
      department, 
      faculty,
      year,
      phone,
      position,
      division,
      avatar
    } = body;

    if (!userId || !name || !department || !faculty || !year) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (userId, name, department, faculty, year)' },
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
        name,
        studentId,
        email: email || null,
        department,
        faculty,
        year: parseInt(year),
        phone,
        position,
        division,
        avatar,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newMember.id,
        name: newMember.name,
        studentId: newMember.studentId,
        email: newMember.email,
        department: newMember.department,
        faculty: newMember.faculty,
        year: newMember.year,
        academicYear: newMember.academicYear,
        phone: newMember.phone,
        position: newMember.position,
        division: newMember.division,
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
      division,
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
        ...(division && { division }),
        ...(avatar && { avatar }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedMember.id,
        name: updatedMember.name,
        studentId: updatedMember.studentId,
        email: updatedMember.email,
        department: updatedMember.department,
        faculty: updatedMember.faculty,
        year: updatedMember.year,
        academicYear: updatedMember.academicYear,
        phone: updatedMember.phone,
        position: updatedMember.position,
        division: updatedMember.division,
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