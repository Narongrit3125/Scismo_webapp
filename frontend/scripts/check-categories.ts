import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking categories in database...\n')

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      isActive: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  if (categories.length === 0) {
    console.log('❌ No categories found in database!')
    console.log('💡 Run: npx tsx scripts/add-default-categories.ts')
  } else {
    console.log(`✅ Found ${categories.length} categories:\n`)
    categories.forEach(cat => {
      console.log(`📁 ${cat.name}`)
      console.log(`   ID: ${cat.id}`)
      console.log(`   Slug: ${cat.slug}`)
      console.log(`   Type: ${cat.type}`)
      console.log(`   Active: ${cat.isActive}`)
      console.log('')
    })
  }

  // Test API endpoint
  console.log('\n🧪 Testing API endpoint...')
  try {
    const apiCategories = await fetch('http://localhost:3000/api/categories')
      .then(res => res.json())
      .catch(err => ({ error: 'Cannot connect to API', details: err.message }))
    
    if (apiCategories.success) {
      console.log(`✅ API returns ${apiCategories.data.length} categories`)
    } else {
      console.log('❌ API error:', apiCategories)
    }
  } catch (error: any) {
    console.log('⚠️  Cannot test API (server may not be running):', error.message)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
