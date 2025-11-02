// Test API endpoints locally
async function testAPIs() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  console.log('🧪 Testing API Endpoints...\n');
  console.log(`Base URL: ${baseUrl}\n`);

  try {
    // Test Members API
    console.log('1️⃣ Testing GET /api/members');
    const membersResponse = await fetch(`${baseUrl}/api/members`);
    const membersData = await membersResponse.json();
    console.log('Status:', membersResponse.status);
    console.log('Response:', JSON.stringify(membersData, null, 2));
    
    // Check if academicYear is included
    if (membersData.data && membersData.data.length > 0) {
      const hasAcademicYear = membersData.data.every((m: any) => 'academicYear' in m);
      console.log(`✅ academicYear field present: ${hasAcademicYear}\n`);
    }

    // Test Documents API
    console.log('2️⃣ Testing GET /api/documents?public=true');
    const docsResponse = await fetch(`${baseUrl}/api/documents?public=true`);
    const docsData = await docsResponse.json();
    console.log('Status:', docsResponse.status);
    console.log('Response:', JSON.stringify(docsData, null, 2));
    
    // Check if uploadedBy is included
    if (docsData.data && docsData.data.length > 0) {
      const hasUploadedBy = docsData.data.every((d: any) => 'uploadedBy' in d);
      console.log(`✅ uploadedBy field present: ${hasUploadedBy}\n`);
    }

    console.log('✅ API Tests Complete!');
  } catch (error) {
    console.error('❌ Error testing APIs:', error);
    console.log('\n⚠️  Make sure the dev server is running: npm run dev');
  }
}

testAPIs();
