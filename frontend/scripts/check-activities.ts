import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkActivities() {
  try {
    console.log('🔍 Checking activities in database...\n');

    // Get all activities
    const allActivities = await prisma.activity.findMany({
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        status: true,
        isPublic: true,
        createdAt: true,
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    console.log(`📊 Total activities: ${allActivities.length}\n`);

    if (allActivities.length === 0) {
      console.log('❌ No activities found in database!');
      console.log('💡 You need to create activities in the admin panel first.\n');
      return;
    }

    // Show all activities
    console.log('📋 All Activities:');
    console.log('─'.repeat(100));
    allActivities.forEach((activity, index) => {
      const now = new Date();
      const startDate = new Date(activity.startDate);
      const isUpcoming = startDate >= now;
      
      console.log(`${index + 1}. ${activity.title}`);
      console.log(`   ID: ${activity.id}`);
      console.log(`   Start Date: ${startDate.toLocaleDateString('th-TH')} ${startDate.toLocaleTimeString('th-TH')}`);
      console.log(`   Status: ${activity.status}`);
      console.log(`   Public: ${activity.isPublic ? '✅ Yes' : '❌ No'}`);
      console.log(`   Upcoming: ${isUpcoming ? '✅ Yes' : '❌ No (Past event)'}`);
      const canShow = activity.status !== 'CANCELLED' && activity.status !== 'POSTPONED' && activity.isPublic && isUpcoming;
      console.log(`   Will show on homepage: ${canShow ? '✅ YES' : '❌ NO'}`);
      console.log('');
    });

    // Check upcoming activities (any status except CANCELLED/POSTPONED)
    const now = new Date();
    const upcomingActivities = allActivities.filter(a => 
      a.status !== 'CANCELLED' && 
      a.status !== 'POSTPONED' &&
      a.isPublic && 
      new Date(a.startDate) >= now
    );

    console.log('\n🎯 Activities that WILL show on homepage:');
    console.log('─'.repeat(100));
    if (upcomingActivities.length === 0) {
      console.log('❌ No upcoming public activities found!');
      console.log('\n💡 To show activities on homepage, they must be:');
      console.log('   1. Status ≠ CANCELLED or POSTPONED');
      console.log('   2. isPublic = true');
      console.log('   3. Start date >= today');
    } else {
      upcomingActivities.forEach((activity, index) => {
        console.log(`${index + 1}. ${activity.title} - ${new Date(activity.startDate).toLocaleDateString('th-TH')} [${activity.status}]`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkActivities();
