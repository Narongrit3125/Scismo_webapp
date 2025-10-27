import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Testing activity creation with category...\n')

  // Get first category
  const category = await prisma.category.findFirst({
    where: { slug: 'activity' }
  })

  if (!category) {
    console.error('❌ No category found!')
    return
  }

  console.log('📁 Using category:')
  console.log(`   ID: ${category.id}`)
  console.log(`   Name: ${category.name}`)
  console.log(`   Slug: ${category.slug}`)

  // Get admin user
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!admin) {
    console.error('❌ No admin user found!')
    return
  }

  console.log(`\n👤 Using admin: ${admin.email}`)

  // Test data
  const testActivity = {
    title: 'กิจกรรมทดสอบ - ' + new Date().toISOString(),
    description: 'นี่คือกิจกรรมทดสอบเพื่อตรวจสอบการทำงานของระบบ',
    categoryId: category.id,
    type: 'WORKSHOP',
    startDate: new Date().toISOString(),
    location: 'ห้องประชุม',
    isPublic: true,
    authorEmail: admin.email
  }

  console.log('\n📝 Test activity data:')
  console.log(JSON.stringify(testActivity, null, 2))

  console.log('\n🔍 Testing API endpoint...')
  console.log('Note: Make sure dev server is running on http://localhost:3000')
  
  try {
    const response = await fetch('http://localhost:3000/api/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testActivity)
    })

    const result = await response.json()

    if (response.ok && result.success) {
      console.log('✅ Activity created successfully!')
      console.log(`   ID: ${result.data.id}`)
      console.log(`   Title: ${result.data.title}`)
      
      // Clean up - delete the test activity
      console.log('\n🧹 Cleaning up test activity...')
      await prisma.activity.delete({
        where: { id: result.data.id }
      })
      console.log('✅ Test activity deleted')
    } else {
      console.error('❌ Failed to create activity:')
      console.error(result)
    }
  } catch (error: any) {
    console.error('❌ Error testing API:', error.message)
    console.log('💡 Make sure the dev server is running: npm run dev')
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
