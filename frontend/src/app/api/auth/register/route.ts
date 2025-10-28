import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      studentId,
      year,
      department,
      faculty
    } = body

    // Validation
    if (!firstName || !lastName || !email || !username || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'อีเมลหรือชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว' },
        { status: 400 }
      )
    }

    // Check if student ID already exists (if provided)
    if (studentId) {
      const existingStudent = await prisma.member.findUnique({
        where: { studentId: studentId }
      })

      if (existingStudent) {
        return NextResponse.json(
          { error: 'รหัสนักศึกษานี้มีอยู่ในระบบแล้ว' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        role: 'MEMBER',
        isActive: true
      }
    })

    // Create member profile
    await prisma.member.create({
      data: {
        userId: user.id,
        name: `${firstName} ${lastName}`,
        studentId: studentId || null,
        email: email,
        year: year ? parseInt(year) : 1,
        department,
        faculty,
        isActive: true
      }
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'สมัครสมาชิกสำเร็จ',
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' },
      { status: 500 }
    )
  }
}