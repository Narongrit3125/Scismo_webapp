/**
 * Generate Password Hash for Sarawut
 * 
 * Run this to get the bcrypt hash for password: 65314812
 * Then use the hash in your SQL insert or Prisma Studio
 */

import * as bcrypt from 'bcrypt'

async function generateHash() {
  const password = '65314812'
  const saltRounds = 10
  
  console.log('🔐 Generating password hash...\n')
  console.log('Password:', password)
  console.log('Salt rounds:', saltRounds)
  console.log('\nGenerating...\n')
  
  const hash = await bcrypt.hash(password, saltRounds)
  
  console.log('✅ Hash generated successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Hashed Password:')
  console.log(hash)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  // Verify the hash works
  const isValid = await bcrypt.compare(password, hash)
  console.log('✓ Verification:', isValid ? '✅ Valid' : '❌ Invalid')
  
  console.log('\n📋 Copy this hash and use it in:')
  console.log('1. SQL INSERT statement')
  console.log('2. Prisma Studio')
  console.log('3. Database admin panel (Vercel Postgres)')
  
  console.log('\n👤 User Details:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Name: ศราวุฒิ ปล้องสา')
  console.log('Email: sarawutp65@nu.ac.th')
  console.log('Username: sarawutp65')
  console.log('Password (plain):', password)
  console.log('Password (hash):', hash)
  console.log('Role: ADMIN')
}

generateHash()
  .then(() => {
    console.log('\n✅ Done!')
    process.exit(0)
  })
  .catch((e) => {
    console.error('\n❌ Error:', e)
    process.exit(1)
  })
