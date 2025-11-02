import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Checking database contents...\n');

    // Check members
    const membersCount = await prisma.member.count();
    console.log(`📊 Members table: ${membersCount} records`);
    
    if (membersCount > 0) {
      const sampleMembers = await prisma.member.findMany({
        take: 3,
        select: {
          id: true,
          name: true,
          studentId: true,
          academicYear: true,
          department: true,
          year: true,
          isActive: true
        }
      });
      console.log('\n📝 Sample members:');
      console.log(JSON.stringify(sampleMembers, null, 2));
    }

    // Check documents
    const documentsCount = await prisma.document.count();
    console.log(`\n📊 Documents table: ${documentsCount} records`);
    
    if (documentsCount > 0) {
      const sampleDocs = await prisma.document.findMany({
        take: 3,
        select: {
          id: true,
          title: true,
          type: true,
          uploadedBy: true,
          isPublic: true,
          createdAt: true
        }
      });
      console.log('\n📄 Sample documents:');
      console.log(JSON.stringify(sampleDocs, null, 2));
    }

    // Check users
    const usersCount = await prisma.user.count();
    console.log(`\n📊 Users table: ${usersCount} records`);

    console.log('\n✅ Database check complete!');
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
