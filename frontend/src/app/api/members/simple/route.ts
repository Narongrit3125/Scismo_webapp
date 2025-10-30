import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// API สำหรับเพิ่มข้อมูลสมาชิก (ประวัติผู้ดำรงตำแหน่งในแต่ละปีการศึกษา)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name,
      studentId, 
      email,
      phone,
      department, 
      faculty,
      year,
      academicYear,
      position,
      division,
      avatar
    } = body;

    // Validation
    if (!name || !studentId || !department || !year || !academicYear) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ชื่อ, รหัสนิสิต, สาขา, ชั้นปี, ปีการศึกษา)' },
        { status: 400 }
      );
    }

    // Check if student ID already exists
    const existingMember = await prisma.member.findUnique({
      where: { studentId: studentId }
    });

    if (existingMember) {
      return NextResponse.json(
        { success: false, error: 'รหัสนิสิตนี้มีอยู่ในระบบแล้ว' },
        { status: 400 }
      );
    }

    // Create member record (without User account)
    const newMember = await prisma.member.create({
      data: {
        name,
        studentId,
        email: email || null,
        phone: phone || null,
        department,
        faculty: faculty || 'คณะวิทยาศาสตร์',
        year: parseInt(year),
        academicYear: parseInt(academicYear),
        position: position || null,
        division: division || null,
        avatar: avatar || null,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'เพิ่มข้อมูลสมาชิกสำเร็จ',
      data: {
        id: newMember.id,
        name: newMember.name,
        studentId: newMember.studentId,
        email: newMember.email,
        phone: newMember.phone,
        department: newMember.department,
        faculty: newMember.faculty,
        year: newMember.year,
        academicYear: newMember.academicYear,
        position: newMember.position,
        division: newMember.division,
        avatar: newMember.avatar,
        isActive: newMember.isActive,
        joinDate: newMember.joinDate
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลสมาชิก' },
      { status: 500 }
    );
  }
}
