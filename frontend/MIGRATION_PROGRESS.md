# 🚧 Work in Progress: API Routes Migration

## สถานะปัจจุบัน

Database schema ได้ทำการ **Normalize** เสร็จสมบูรณ์แล้ว:
- ✅ สร้างตาราง `Category` และ `Tag`
- ✅ เปลี่ยน `category` (String) → `categoryId` + Category relation
- ✅ เปลี่ยน `tags` (JSON) → Tags many-to-many relation
- ✅ Push schema ไปยังฐานข้อมูล
- ✅ Generate Prisma Client

## ⚠️ ปัญหาที่เหลือ

TypeScript ยังไม่อัพเดต types ของ Prisma Client ทำให้ API routes compile error

### วิธีแก้:
1. Restart VS Code TypeScript server
2. หรือรัน: `npx prisma generate --no-engine`
3. แล้วลอง build อีกครั้ง

## 📝 API Routes ที่ต้องแก้ (กำลังดำเนินการ)

### ✅ กำลังแก้:
- [x] `/api/activities/route.ts` - เริ่มแก้แล้ว (50%)

### ⏳ รอแก้:
- [ ] `/api/news/route.ts`
- [ ] `/api/documents/route.ts`  
- [ ] `/api/gallery/route.ts`
- [ ] `/api/contacts/route.ts`

### 🆕 ต้องสร้างใหม่:
- [ ] `/api/categories/route.ts`
- [ ] `/api/tags/route.ts`

## 📋 TODO List

1. **แก้ไข Activities API** (50% เสร็จ)
   - [x] เพิ่ม category และ tags include
   - [x] แก้ไข response format
   - [ ] แก้ไข POST method
   - [ ] แก้ไข PUT method
   - [ ] ทดสอบการทำงาน

2. **แก้ไข News API**
   - [ ] เพิ่ม category และ tags include
   - [ ] แก้ไข response format
   - [ ] แก้ไข CRUD methods

3. **แก้ไข Documents API**
   - [ ] เพิ่ม category และ tags include
   - [ ] แก้ไข response format
   - [ ] แก้ไข CRUD methods

4. **แก้ไข Gallery API**
   - [ ] เพิ่ม category include
   - [ ] แก้ไข response format
   - [ ] แก้ไข CRUD methods

5. **สร้าง Categories API**
   - [ ] GET /api/categories
   - [ ] GET /api/categories?type=NEWS
   - [ ] POST /api/categories
   - [ ] PUT /api/categories
   - [ ] DELETE /api/categories

6. **สร้าง Tags API**
   - [ ] GET /api/tags
   - [ ] GET /api/tags?search=xxx
   - [ ] POST /api/tags
   - [ ] PUT /api/tags
   - [ ] DELETE /api/tags

7. **Seed ข้อมูลเริ่มต้น**
   - [ ] สร้าง default categories
   - [ ] สร้าง popular tags (optional)

8. **แก้ไข Frontend**
   - [ ] Components ที่แสดงหมวดหมู่
   - [ ] Forms ที่สร้าง/แก้ไขข้อมูล
   - [ ] แสดง Tags

## 🔄 คำสั่งที่ใช้

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Check database schema
npx prisma db pull --print

# Build project
npm run build
```

## 📊 Progress: 15% Complete

- Database Schema: ✅ 100%
- API Routes: 🚧 15%
- Frontend: ⏳ 0%
- Testing: ⏳ 0%

---

**Last Updated:** October 19, 2025  
**Next Step:** Fix TypeScript compilation errors in API routes
