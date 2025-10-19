# 📊 Database Normalization Guide

## สรุปการเปลี่ยนแปลง

เราได้ทำการ **Database Normalization** เพื่อลด redundancy และปรับปรุงโครงสร้างฐานข้อมูล โดยสร้างตารางใหม่ 2 ตาราง:

### ✅ ตารางใหม่ที่เพิ่มเข้ามา:

#### 1. **Category** (หมวดหมู่)
```prisma
model Category {
  id          String       @id @default(cuid())
  name        String       // ชื่อหมวดหมู่
  slug        String       @unique
  type        CategoryType // NEWS, ACTIVITY, DOCUMENT, GALLERY
  description String?
  color       String?      // สีประจำหมวดหมู่
  icon        String?
  order       Int          @default(0)
  isActive    Boolean      @default(true)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

#### 2. **Tag** (แท็ก)
```prisma
model Tag {
  id         String   @id @default(cuid())
  name       String   @unique
  slug       String   @unique
  color      String?
  usageCount Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

#### 3. **Junction Tables** (ตารางเชื่อม many-to-many)
- `NewsTag` - เชื่อม News ↔ Tag
- `ActivityTag` - เชื่อม Activity ↔ Tag  
- `DocumentTag` - เชื่อม Document ↔ Tag

---

## 📝 การเปลี่ยนแปลงในแต่ละตาราง:

### 1. **News** (ข่าวสาร)
**เดิม:**
```prisma
category    String        // หมวดหมู่ (String)
tags        String?       // แท็ก (JSON array)
```

**ใหม่:**
```prisma
categoryId  String        @default("default")
category    Category?     @relation(fields: [categoryId], references: [id])
tags        NewsTag[]     // Many-to-many with Tag
```

---

### 2. **Activity** (กิจกรรม)
**เดิม:**
```prisma
category    String        // หมวดหมู่ (String)
tags        String?       // แท็ก (JSON array)
```

**ใหม่:**
```prisma
categoryId  String        @default("default")
category    Category?     @relation(fields: [categoryId], references: [id])
tags        ActivityTag[] // Many-to-many with Tag
```

---

### 3. **Document** (เอกสาร)
**เดิม:**
```prisma
category    String        // หมวดหมู่ (String)
tags        String?       // แท็ก (JSON array)
```

**ใหม่:**
```prisma
categoryId  String        @default("default")
category    Category?     @relation(fields: [categoryId], references: [id])
tags        DocumentTag[] // Many-to-many with Tag
```

---

### 4. **Gallery** (แกลเลอรี)
**เดิม:**
```prisma
category    String        // หมวดหมู่ (String)
```

**ใหม่:**
```prisma
categoryId  String        @default("default")
category    Category?     @relation(fields: [categoryId], references: [id])
```

---

## 🔧 การแก้ไข API Routes

### ⚠️ **ไฟล์ที่ต้องแก้ไข:**

1. `/api/news/route.ts`
2. `/api/activities/route.ts`
3. `/api/documents/route.ts`
4. `/api/gallery/route.ts`

### 📋 **วิธีการแก้ไข:**

#### ก่อนหน้า (Old):
```typescript
// GET - Query by category
whereCondition.category = {
  contains: searchCategory,
  mode: 'insensitive'
};

// Response
{
  category: news.category,
  tags: news.tags ? JSON.parse(news.tags) : []
}
```

#### หลังแก้ไข (New):
```typescript
// GET - Query by category
whereCondition.categoryId = searchCategoryId;

// Include category and tags in query
const news = await prisma.news.findMany({
  include: {
    category: true,
    tags: {
      include: {
        tag: true
      }
    }
  }
});

// Response
{
  categoryId: news.categoryId,
  category: news.category ? {
    id: news.category.id,
    name: news.category.name,
    slug: news.category.slug,
    color: news.category.color
  } : null,
  tags: news.tags.map(t => ({
    id: t.tag.id,
    name: t.tag.name,
    slug: t.tag.slug,
    color: t.tag.color
  }))
}
```

#### POST - สร้างข้อมูลใหม่:
```typescript
// Old
const newNews = await prisma.news.create({
  data: {
    category: category,
    tags: JSON.stringify(tags)
  }
});

// New
const newNews = await prisma.news.create({
  data: {
    categoryId: categoryId, // ต้องมี Category ID
    tags: {
      create: tagIds.map(tagId => ({
        tagId: tagId
      }))
    }
  },
  include: {
    category: true,
    tags: {
      include: { tag: true }
    }
  }
});
```

#### PUT - อัปเดตข้อมูล:
```typescript
// Old
if (category) updateData.category = category;
if (tags) updateData.tags = JSON.stringify(tags);

// New
if (categoryId) updateData.categoryId = categoryId;

// Update tags separately
if (tagIds) {
  // Delete existing tags
  await prisma.newsTag.deleteMany({
    where: { newsId: id }
  });
  
  // Create new tags
  await prisma.newsTag.createMany({
    data: tagIds.map(tagId => ({
      newsId: id,
      tagId: tagId
    }))
  });
}
```

---

## 🎯 ข้อดีของการ Normalize:

### ✅ **Category Normalization:**
1. **ไม่มีข้อมูลซ้ำซ้อน** - หมวดหมู่เก็บไว้ที่เดียว
2. **Validation** - ไม่สามารถสะกดผิดได้
3. **Centralized Management** - จัดการหมวดหมู่ได้ในที่เดียว
4. **ค้นหาง่ายขึ้น** - Query ด้วย ID แทน String
5. **เพิ่ม Metadata** - มีสี, ไอคอน, ลำดับการแสดงผล

### ✅ **Tag Normalization:**
1. **ไม่เก็บเป็น JSON** - Query ได้ง่ายขึ้น
2. **นับจำนวนการใช้** - รู้ว่า Tag ไหนนิยม
3. **Many-to-many** - เนื้อหาหนึ่งมีหลาย Tag ได้
4. **Tag Suggestions** - แนะนำ Tag ที่มีอยู่แล้ว
5. **ค้นหาแบบ Advanced** - ค้นหาตาม Tag ได้หลายอัน

---

## 🚀 API Routes ใหม่ที่ต้องสร้าง:

### 1. **Category API** - `/api/categories/route.ts`
```typescript
// GET /api/categories?type=NEWS
// POST /api/categories - สร้างหมวดหมู่ใหม่
// PUT /api/categories?id=xxx - แก้ไขหมวดหมู่
// DELETE /api/categories?id=xxx - ลบหมวดหมู่
```

### 2. **Tag API** - `/api/tags/route.ts`
```typescript
// GET /api/tags - ดึง Tag ทั้งหมด
// GET /api/tags?search=xxx - ค้นหา Tag
// POST /api/tags - สร้าง Tag ใหม่
// PUT /api/tags?id=xxx - แก้ไข Tag
// DELETE /api/tags?id=xxx - ลบ Tag
```

---

## 📊 Migration Steps (ถ้ามีข้อมูลเดิม):

### Step 1: สร้าง Default Categories
```typescript
const defaultCategories = [
  { name: 'ข่าวทั่วไป', slug: 'general-news', type: 'NEWS' },
  { name: 'กิจกรรม', slug: 'activities', type: 'ACTIVITY' },
  { name: 'เอกสาร', slug: 'documents', type: 'DOCUMENT' },
  { name: 'แกลเลอรี', slug: 'gallery', type: 'GALLERY' },
];

await prisma.category.createMany({ data: defaultCategories });
```

### Step 2: Migrate ข้อมูลเก่า (ถ้ามี)
```typescript
// ดึงข้อมูลเก่า
const oldNews = await prisma.$queryRaw`
  SELECT id, category FROM news WHERE category IS NOT NULL
`;

// สร้าง Category จาก String เก่า
const uniqueCategories = [...new Set(oldNews.map(n => n.category))];
for (const cat of uniqueCategories) {
  await prisma.category.upsert({
    where: { slug: slugify(cat) },
    create: { 
      name: cat, 
      slug: slugify(cat), 
      type: 'NEWS' 
    },
    update: {}
  });
}

// Update News ให้ใช้ categoryId
for (const news of oldNews) {
  const category = await prisma.category.findUnique({
    where: { slug: slugify(news.category) }
  });
  
  await prisma.news.update({
    where: { id: news.id },
    data: { categoryId: category.id }
  });
}
```

---

## ⚠️ สิ่งที่ต้องระวัง:

1. **Foreign Key Constraints** - ต้องมี Category ก่อนจึงจะสร้าง News/Activity/Document ได้
2. **Default Value** - ตอนนี้ใช้ `@default("default")` ชั่วคราว
3. **Migration** - ถ้ามีข้อมูลเดิมต้อง migrate ก่อน
4. **API Breaking Changes** - Frontend ต้องแก้ไขด้วย

---

## 📈 สถิติการปรับปรุง:

- **ตารางเดิม:** 10 tables
- **ตารางใหม่:** 13 tables (+3)
- **ฟิลด์ที่ลด:** ~15 fields (category, tags ใน 4 ตาราง)
- **Relations ที่เพิ่ม:** 7 relations
- **Normalization Level:** 3NF (Third Normal Form)

---

## 🎯 Next Steps:

1. ✅ สร้าง Category และ Tag API routes
2. ✅ แก้ไข News/Activity/Document/Gallery API routes
3. ✅ สร้างหน้าจัดการ Category ใน Admin
4. ✅ สร้างหน้าจัดการ Tag ใน Admin
5. ✅ แก้ไข Frontend components ให้ใช้ categoryId และ tags relation
6. ✅ Seed ข้อมูล Category และ Tag เริ่มต้น
7. ✅ Migrate ข้อมูลเก่า (ถ้ามี)

---

**📅 Last Updated:** October 19, 2025
