# การแก้ไขปัญหา Internal Server Error เมื่อลงกิจกรรม

## สรุปปัญหา
เมื่อพยายามสร้างกิจกรรมใหม่ในหน้าจัดการกิจกรรม (/admin/activities) เกิด Internal Server Error

## สาเหตุของปัญหา

1. **ค่า default ของ categoryId ไม่ถูกต้อง**
   - ฟอร์มมีค่า default เป็น `'default'` ซึ่งไม่ใช่ UUID ที่ถูกต้อง
   - Database schema กำหนดให้ `categoryId` เป็น foreign key ที่อ้างอิงไปยังตาราง `Category`
   - การส่งค่า `'default'` ทำให้เกิด foreign key constraint error

2. **Validation ไม่เข้มงวดพอ**
   - มีการตรวจสอบว่า categoryId ไม่เป็น `'default'` แต่ไม่ได้บังคับให้ต้องเลือกหมวดหมู่ที่ถูกต้อง
   - API route ไม่มีการ validate ว่า categoryId ที่ส่งมาต้องมีอยู่จริงในฐานข้อมูล

## การแก้ไข

### 1. แก้ไขไฟล์ `src/app/admin/activities/page.tsx`

#### เปลี่ยนค่า default ของ formData
```typescript
// เปลี่ยนจาก
categoryId: 'default',

// เป็น
categoryId: '',
```

#### เปลี่ยนค่า default ในฟังก์ชัน resetForm
```typescript
const resetForm = () => {
  setFormData({
    title: '',
    description: '',
    categoryId: '', // เปลี่ยนจาก 'default'
    type: 'WORKSHOP' as const,
    location: '',
    startDate: '',
    endDate: '',
    image: '',
    isPublic: true,
    projectId: ''
  });
  setImageFile(null);
  setImagePreview('');
};
```

#### ปรับปรุง validation
```typescript
// เปลี่ยนจาก
if (!formData.categoryId || formData.categoryId === 'default' || formData.categoryId === '') {
  alert('กรุณาเลือกหมวดหมู่');
  return;
}

// เป็น
if (!formData.categoryId || formData.categoryId.trim() === '') {
  alert('กรุณาเลือกหมวดหมู่');
  return;
}
```

#### เพิ่ม required attribute ให้กับ select box
```typescript
<label className="block text-sm font-medium text-gray-700 mb-2">
  หมวดหมู่ <span className="text-red-500">*</span>
</label>
<select
  required  // เพิ่ม required
  value={formData.categoryId}
  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
>
  <option value="">เลือกหมวดหมู่</option>
  {categories.map(cat => (
    <option key={cat.value} value={cat.value}>{cat.label}</option>
  ))}
</select>
```

### 2. แก้ไขไฟล์ `src/app/api/activities/route.ts`

#### ปรับปรุง validation ของ categoryId
```typescript
// เพิ่ม validation ให้เข้มงวดมากขึ้น
let resolvedCategoryId = categoryId || null;

if (!resolvedCategoryId) {
  return NextResponse.json(
    { success: false, error: 'Category is required. Please select a valid category.' },
    { status: 400 }
  );
}

const isUuid = (val: any) => typeof val === 'string' && /^[0-9a-fA-F\-]{36}$/.test(val);

if (resolvedCategoryId && !isUuid(resolvedCategoryId)) {
  // ถ้าไม่ใช่ UUID ให้ลองหาจาก slug หรือ name
  const foundCat = await prisma.category.findFirst({
    where: {
      OR: [
        { slug: resolvedCategoryId },
        { name: resolvedCategoryId }
      ]
    }
  });
  if (foundCat) {
    resolvedCategoryId = foundCat.id;
  } else {
    return NextResponse.json(
      { success: false, error: 'Invalid category. Please select a valid category from the list.' },
      { status: 400 }
    );
  }
} else if (resolvedCategoryId) {
  // ตรวจสอบว่า UUID นั้นมีอยู่จริงในฐานข้อมูล
  const catExists = await prisma.category.findUnique({
    where: { id: resolvedCategoryId }
  });
  if (!catExists) {
    return NextResponse.json(
      { success: false, error: 'Invalid category ID. Please select a valid category.' },
      { status: 400 }
    );
  }
}
```

#### แก้ไข createPayload
```typescript
const createPayload = {
  title,
  description,
  authorId: author.id,
  projectId: projectId || null,
  categoryId: resolvedCategoryId, // ไม่ใช้ || null เพราะ validate แล้ว
  type: type.toUpperCase() as any,
  startDate: new Date(startDate),
  endDate: endDate ? new Date(endDate) : null,
  location: location || null,
  isPublic,
  image: image || null,
  gallery: gallery || null,
  status: 'PLANNING' as any
};
```

### 3. สร้างสคริปต์เพิ่ม default categories

สร้างไฟล์ `scripts/add-default-categories.ts`:
```typescript
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
```

รันสคริปต์:
```bash
npx tsx scripts/add-default-categories.ts
```

## ผลลัพธ์

หลังจากแก้ไขแล้ว:
1. ✅ ฟอร์มจะบังคับให้เลือกหมวดหมู่ก่อนส่งข้อมูล (HTML5 validation)
2. ✅ JavaScript validation จะตรวจสอบว่ามีการเลือกหมวดหมู่แล้ว
3. ✅ API จะ validate ว่า categoryId ที่ส่งมาต้องมีอยู่จริงในฐานข้อมูล
4. ✅ แสดง error message ที่ชัดเจนหากมีปัญหา
5. ✅ ป้องกัน foreign key constraint error

## วิธีทดสอบ

1. เข้าสู่ระบบด้วยบัญชี Admin
2. ไปที่หน้า `/admin/activities`
3. คลิกปุ่ม "เพิ่มกิจกรรมใหม่"
4. กรอกข้อมูลต่างๆ และ**เลือกหมวดหมู่**
5. คลิก "บันทึก"
6. ✅ ควรสร้างกิจกรรมได้สำเร็จ

หากไม่เลือกหมวดหมู่:
- Browser จะแสดง validation message "Please select an item in the list"
- หรือ JavaScript alert "กรุณาเลือกหมวดหมู่"

## หมายเหตุ

- ตรวจสอบให้แน่ใจว่ามี categories ในฐานข้อมูลก่อนใช้งาน
- หากยังไม่มี ให้รันสคริปต์ `add-default-categories.ts`
- ในการใช้งานจริง ควรเพิ่ม error handling และ logging ที่ดีกว่านี้
