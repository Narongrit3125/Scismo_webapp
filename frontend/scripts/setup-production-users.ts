/**
 * Setup Production Users Script
 * 
 * This script creates admin, member, and regular users for production database.
 * Run this after deploying to Vercel with environment variables set.
 */

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🔐 Setting up production users...\n')

  const users = [
    {
      email: 'admin@smo.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN' as const,
    },
    {
      email: 'sarawutp65@nu.ac.th',
      password: '65314812',
      firstName: 'ศราวุฒิ',
      lastName: 'ปล้องสา',
      role: 'ADMIN' as const,
    },
    {
      email: 'member@smo.com',
      password: 'password123',
      firstName: 'Member',
      lastName: 'User',
      role: 'MEMBER' as const,
    },
    {
      email: 'user@smo.com',
      password: 'password123',
      firstName: 'Regular',
      lastName: 'User',
      role: 'MEMBER' as const,
    },
  ]

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        password: hashedPassword,
        isActive: true,
      },
      create: {
        email: userData.email,
        username: userData.email.split('@')[0],
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        isActive: true,
      },
    })

    console.log(`✅ ${userData.role} user created/updated:`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Password: ${userData.password}`)
    console.log(`   Role: ${user.role}\n`)
  }

  console.log('🎉 All production users created successfully!\n')
  console.log('📝 You can now login with:')
  console.log('   admin@smo.com / password123 (Admin)')
  console.log('   sarawutp65@nu.ac.th / 65314812 (Admin - ศราวุฒิ ปล้องสา)')
  console.log('   member@smo.com / password123 (Member)')
  console.log('   user@smo.com / password123 (User)')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
