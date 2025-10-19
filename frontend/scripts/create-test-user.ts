import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🔐 Creating test users...\n')

  // Hash password: "password123"
  const hashedPassword = await bcrypt.hash('password123', 10)

  try {
    // สร้าง Admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@smo.com' },
      update: {
        password: hashedPassword,
        isActive: true
      },
      create: {
        email: 'admin@smo.com',
        username: 'admin',
        password: hashedPassword,
        firstName: 'ผู้ดูแล',
        lastName: 'ระบบ',
        role: 'ADMIN',
        isActive: true
      }
    })
    console.log('✅ Admin user created/updated:')
    console.log('   Email: admin@smo.com')
    console.log('   Password: password123')
    console.log(`   Role: ${admin.role}\n`)

    // สร้าง Member user
    const member = await prisma.user.upsert({
      where: { email: 'member@smo.com' },
      update: {
        password: hashedPassword,
        isActive: true
      },
      create: {
        email: 'member@smo.com',
        username: 'member',
        password: hashedPassword,
        firstName: 'สมาชิก',
        lastName: 'ทดสอบ',
        role: 'MEMBER',
        isActive: true
      }
    })
    console.log('✅ Member user created/updated:')
    console.log('   Email: member@smo.com')
    console.log('   Password: password123')
    console.log(`   Role: ${member.role}\n`)

    // สร้าง User ทั่วไป
    const user = await prisma.user.upsert({
      where: { email: 'user@smo.com' },
      update: {
        password: hashedPassword,
        isActive: true
      },
      create: {
        email: 'user@smo.com',
        username: 'user',
        password: hashedPassword,
        firstName: 'ผู้ใช้',
        lastName: 'ทั่วไป',
        role: 'MEMBER',
        isActive: true
      }
    })
    console.log('✅ Regular user created/updated:')
    console.log('   Email: user@smo.com')
    console.log('   Password: password123')
    console.log(`   Role: ${user.role}\n`)

    console.log('🎉 All test users created successfully!')
    console.log('\n📝 You can now login with:')
    console.log('   admin@smo.com / password123 (Admin)')
    console.log('   member@smo.com / password123 (Member)')
    console.log('   user@smo.com / password123 (User)')
  } catch (error) {
    console.error('❌ Error creating test users:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
