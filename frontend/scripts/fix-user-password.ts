import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function fixUserPassword() {
  try {
    const email = 'naronglitj65@nu.ac.th';
    const newPassword = 'changeme123'; // Default password
    
    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Password updated successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 New password:', newPassword);
    console.log('🔐 Hash:', hashedPassword);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserPassword();
