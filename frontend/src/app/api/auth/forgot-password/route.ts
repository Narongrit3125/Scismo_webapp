import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'กรุณากรอกอีเมล' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'หากอีเมลนี้มีอยู่ในระบบ คุณจะได้รับลิงก์รีเซ็ตรหัสผ่าน',
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { message: 'บัญชีนี้ถูกระงับการใช้งาน' },
        { status: 403 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    })

    // TODO: Send email with reset link
    // For now, just log it (in production, use email service like SendGrid, AWS SES, etc.)
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    console.log('🔐 Password Reset Link:', resetUrl)
    console.log('📧 Send to:', email)

    // In production, you would send an email here:
    // await sendPasswordResetEmail(email, resetUrl)

    return NextResponse.json({
      message: 'หากอีเมลนี้มีอยู่ในระบบ คุณจะได้รับลิงก์รีเซ็ตรหัสผ่าน',
      // For development only - remove in production
      ...(process.env.NODE_ENV === 'development' && {
        resetUrl,
        devNote: 'ในโหมด development - ใช้ลิงก์นี้เพื่อรีเซ็ตรหัสผ่าน',
      }),
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
