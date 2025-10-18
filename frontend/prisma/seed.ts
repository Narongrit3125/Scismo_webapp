import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed script is temporarily disabled for Vercel deployment')
  console.log('💡 Run seeds manually after database is set up')
  
  /* Temporarily disabled - uncomment after setting up database
  // Hash password สำหรับการใช้งาน
  const hashedPassword = await bcrypt.hash('SMO@2024', 10)

  // สร้างผู้ใช้ Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@smo.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'ผู้ดูแล',
      lastName: 'ระบบ',
      role: 'ADMIN',
      isActive: true
    }
  })

  console.log('✅ สร้าง Admin user:', adminUser.email)

  // สร้างผู้ใช้ Member
  const memberUser = await prisma.user.create({
    data: {
      email: 'member@smo.com',
      username: 'member',
      password: hashedPassword,
      firstName: 'สมาชิก',
      lastName: 'ทดสอบ',
      role: 'MEMBER',
      isActive: true
    }
  })

  console.log('✅ สร้าง Member user:', memberUser.email)

  // สร้าง Member profile - Uncomment after database setup
  await prisma.member.create({
    data: {
      userId: memberUser.id,
      studentId: '64123456',
      year: 3,
      department: 'เทคโนโลยีสารสนเทศ',
      faculty: 'คณะเทคโนโลยีสารสนเทศ',
      isActive: true,
      bio: 'สมาชิกทดสอบของชมรม SMO',
      skills: JSON.stringify(['JavaScript', 'Python', 'React']),
      interests: JSON.stringify(['เขียนโปรแกรม', 'การออกแบบ', 'เทคโนโลยี'])
    }
  })
  */

  console.log('✅ Seed script completed')
  console.log('💡 Uncomment user creation code after setting up PostgreSQL database')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })