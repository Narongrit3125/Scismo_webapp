import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Fixing activity categories...')

  // หา default category (ทั่วไป)
  const defaultCategory = await prisma.category.findFirst({
    where: {
      OR: [
        { slug: 'general' },
        { slug: 'activity' },
        { type: 'GENERAL' }
      ]
    }
  })

  if (!defaultCategory) {
    console.error('❌ Default category not found! Please run add-default-categories.ts first.')
    return
  }

  console.log(`✅ Found default category: ${defaultCategory.name} (${defaultCategory.id})`)

  // หากิจกรรมที่มี categoryId เป็น 'default'
  const activitiesWithInvalidCategory = await prisma.activity.findMany({
    where: {
      categoryId: 'default'
    },
    select: {
      id: true,
      title: true,
      categoryId: true
    }
  })

  console.log(`\n📋 Found ${activitiesWithInvalidCategory.length} activities with invalid categoryId`)

  if (activitiesWithInvalidCategory.length === 0) {
    console.log('✅ No activities need to be fixed!')
    return
  }

  // อัปเดตกิจกรรมทั้งหมด
  let fixedCount = 0
  for (const activity of activitiesWithInvalidCategory) {
    try {
      await prisma.activity.update({
        where: { id: activity.id },
        data: { categoryId: defaultCategory.id }
      })
      console.log(`✅ Fixed: "${activity.title}" (ID: ${activity.id})`)
      fixedCount++
    } catch (error) {
      console.error(`❌ Error fixing activity "${activity.title}":`, error)
    }
  }

  console.log(`\n🎉 Successfully fixed ${fixedCount} out of ${activitiesWithInvalidCategory.length} activities!`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
