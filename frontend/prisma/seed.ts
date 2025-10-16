import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // สร้างผู้ใช้ Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@smo.com',
      username: 'admin',
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
      firstName: 'สมาชิก',
      lastName: 'ทดสอบ',
      role: 'MEMBER',
      isActive: true
    }
  })

  // สร้าง Member profile
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

  // สร้าง Staff
  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@smo.com',
      username: 'staff',
      firstName: 'เจ้าหน้าที่',
      lastName: 'ทดสอบ',
      role: 'STAFF',
      isActive: true
    }
  })

  await prisma.staff.create({
    data: {
      userId: staffUser.id,
      employeeId: 'ST001',
      department: 'คณะเทคโนโลยีสารสนเทศ',
      position: 'อาจารย์ประจำ',
      phone: '044-224-629',
      office: 'ห้อง 301 อาคาร IT',
      bio: 'อาจารย์ประจำคณะเทคโนโลยีสารสนเทศ',
      expertise: JSON.stringify(['การเขียนโปรแกรม', 'ฐานข้อมูล', 'เว็บเทคโนโลยี']),
      isActive: true
    }
  })

  // สร้าง Positions
  await prisma.position.createMany({
    data: [
      {
        title: 'ประธานชมรม',
        description: 'รับผิดชอบการบริหารงานโดยรวมของชมรม',
        type: 'EXECUTIVE',
        level: 1,
        isActive: true
      },
      {
        title: 'รองประธานชมรม',
        description: 'ช่วยเหลือประธานในการบริหารงาน',
        type: 'EXECUTIVE',
        level: 2,
        isActive: true
      },
      {
        title: 'เลขานุการ',
        description: 'จัดทำเอกสารและประชุม',
        type: 'COMMITTEE',
        level: 3,
        isActive: true
      },
      {
        title: 'เหรัญญิก',
        description: 'จัดการด้านการเงิน',
        type: 'COMMITTEE',
        level: 3,
        isActive: true
      },
      {
        title: 'ประชาสัมพันธ์',
        description: 'จัดการด้านการประชาสัมพันธ์',
        type: 'COMMITTEE',
        level: 4,
        isActive: true
      }
    ]
  })

  // สร้าง Contact Info
  await prisma.contactInfo.createMany({
    data: [
      {
        type: 'address',
        label: 'ที่อยู่',
        value: 'ห้องชมรม SMO ชั้น 5 อาคารเทคโนโลยีสารสนเทศ มหาวิทยาลัยเทคโนโลยีสุรนารี',
        icon: 'MapPin',
        isActive: true,
        order: 1
      },
      {
        type: 'phone',
        label: 'โทรศัพท์',
        value: '044-224-629',
        icon: 'Phone',
        isActive: true,
        order: 2
      },
      {
        type: 'email',
        label: 'อีเมล',
        value: 'smo.club@sut.ac.th',
        icon: 'Mail',
        isActive: true,
        order: 3
      },
      {
        type: 'social',
        label: 'Facebook',
        value: 'https://facebook.com/smo.sut',
        icon: 'Facebook',
        isActive: true,
        order: 4
      }
    ]
  })

  console.log('✅ ข้อมูลเริ่มต้นถูกสร้างเรียบร้อยแล้ว!')
  console.log('🔑 บัญชีทดสอบ:')
  console.log('   Admin: admin@smo.com / password123')
  console.log('   Member: member@smo.com / password123')
  console.log('   Staff: staff@smo.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })