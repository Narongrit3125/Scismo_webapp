import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPasswordHash() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'naronglitj65@nu.ac.th' }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('👤 User:', user.email);
    console.log('🔑 Password hash:', user.password);
    console.log('📏 Hash length:', user.password.length);
    console.log('🔐 Is bcrypt hash?', user.password.startsWith('$2b$') || user.password.startsWith('$2a$'));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPasswordHash();
