/**
 * Add Sarawut Plongsa as Admin
 * 
 * This script adds ศราวุฒิ ปล้องสา as an admin user.
 */

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🔐 Adding ศราวุฒิ ปล้องสา as Admin...\n')

  const userData = {
    email: 'sarawutp65@nu.ac.th',
    password: '65314812',
    firstName: 'ศราวุฒิ',
    lastName: 'ปล้องสา',
    role: 'ADMIN' as const,
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10)

  const user = await prisma.user.upsert({
    where: { email: userData.email },
    update: {
      password: hashedPassword,
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isActive: true,
    },
    create: {
      email: userData.email,
      username: userData.email.split('@')[0], // sarawutp65
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      isActive: true,
    },
  })

  console.log('✅ Admin user created/updated successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 Email:', user.email)
  console.log('👤 Name:', `${user.firstName} ${user.lastName}`)
  console.log('🔑 Password:', userData.password)
  console.log('👑 Role:', user.role)
  console.log('📛 Username:', user.username)
  console.log('✓ Active:', user.isActive)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('🎉 คุณศราวุฒิ ปล้องสา สามารถเข้าสู่ระบบได้แล้ว!')
  console.log('   Email: sarawutp65@nu.ac.th')
  console.log('   Password: 65314812')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('\n✅ Database connection closed')
    process.exit(0)
  })
  .catch(async (e) => {
    console.error('\n❌ Error:', e.message)
    await prisma.$disconnect()
    process.exit(1)
  })
