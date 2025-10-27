import { PrismaClient, CategoryType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adding default categories...')

  const categories: Array<{name: string, slug: string, type: CategoryType, color: string, description: string}> = [
    { name: 'ข่าวประชาสัมพันธ์', slug: 'news', type: 'NEWS' as CategoryType, color: '#3B82F6', description: 'ข่าวสารและประกาศทั่วไป' },
    { name: 'กิจกรรมสโมสร', slug: 'activity', type: 'ACTIVITY' as CategoryType, color: '#10B981', description: 'กิจกรรมและงานต่างๆ ของสโมสร' },
    { name: 'เอกสาร', slug: 'document', type: 'DOCUMENT' as CategoryType, color: '#F59E0B', description: 'เอกสารสำคัญและคู่มือต่างๆ' },
    { name: 'ทั่วไป', slug: 'general', type: 'GENERAL' as CategoryType, color: '#6B7280', description: 'หมวดหมู่ทั่วไป' }
  ]

  for (const category of categories) {
    try {
      const existing = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: category.slug },
            { name: category.name }
          ]
        }
      })

      if (existing) {
        console.log(`⏭️  Category "${category.name}" already exists, skipping...`)
        continue
      }

      const created = await prisma.category.create({
        data: category
      })

      console.log(`✅ Created category: ${created.name} (${created.slug})`)
    } catch (error) {
      console.error(`❌ Error creating category ${category.name}:`, error)
    }
  }

  console.log('✅ Default categories setup completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
