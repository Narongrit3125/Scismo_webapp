/**
 * Check Users in Production Database
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking users in database...\n')

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  })

  if (users.length === 0) {
    console.log('❌ No users found in database!\n')
    return
  }

  console.log(`✅ Found ${users.length} user(s):\n`)

  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email}`)
    console.log(`   Username: ${user.username}`)
    console.log(`   Name: ${user.firstName} ${user.lastName}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Active: ${user.isActive}`)
    console.log(`   Created: ${user.createdAt}`)
    console.log('')
  })
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
