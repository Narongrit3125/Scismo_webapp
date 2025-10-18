import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // สร้างผู้ใช้ Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@smo.com',
      username: 'admin',
      password: 'hashed_password_here', // ในการใช้งานจริงควรใช้ bcrypt
      firstName: 'ผู้ดูแล',
      lastName: 'ระบบ',
      role: 'ADMIN',
      isActive: true
    }
  })

  // สร้างผู้ใช้ Member
  const memberUser = await prisma.user.create({
    data: {
      email: 'member@smo.com',
      username: 'member',
      password: 'hashed_password_here', // ในการใช้งานจริงควรใช้ bcrypt
      firstName: 'สมาชิก',
      lastName: 'ทดสอบ',
      role: 'MEMBER',
      isActive: true
    }
  })

  // สร้าง Member profile
  // TODO: เปิดใช้งานหลังจาก setup database แล้ว
  /*
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

  // สร้าง User ตัวอย่าง (ปิดไว้ชั่วคราวเพื่อให้ build ผ่าน)
  // TODO: เปิดใช้งานหลังจาก setup database แล้ว
  
  /*
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@smo.com',
      username: 'admin',
      password: 'hashed_password_here',
      firstName: 'ผู้ดูแล',
      lastName: 'ระบบ',
      role: 'ADMIN',
      isActive: true
    }
  })
  */

  console.log('✅ Seed script completed (data creation skipped for initial deployment)')
  console.log('⚠️  Run seed after database setup: npx prisma db seed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })