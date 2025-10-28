import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcrypt';

// API สำหรับเพิ่มข้อมูลสมาชิกแบบง่าย (ไม่ต้องสร้าง User account)
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
      position,
      division,
      avatar
    } = body;

    // Validation
    if (!name || !studentId || !email || !department || !year) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ชื่อ, รหัสนิสิต, อีเมล, สาขา, ชั้นปี)' },
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

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'อีเมลนี้มีอยู่ในระบบแล้ว' },
        { status: 400 }
      );
    }

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Hash a temporary password
    const hashedPassword = await bcrypt.hash('temp_' + studentId, 10);

    // Create user account first (required for foreign key)
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        username: studentId,
        password: hashedPassword,
        role: 'MEMBER',
        isActive: true
      }
    });

    // Create member profile
    const newMember = await prisma.member.create({
      data: {
        userId: user.id,
        studentId,
        department,
        faculty: faculty || 'คณะวิทยาศาสตร์',
        year: parseInt(year),
        phone: phone || null,
        position: position || null,
        division: division || null,
        avatar: avatar || null,
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
      message: 'เพิ่มข้อมูลสมาชิกสำเร็จ',
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
