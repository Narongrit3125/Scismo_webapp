# ⚠️ API Routes Temporary Disabled

## สถานะปัจจุบัน:

Database schema ได้ทำการ Normalize แล้ว แต่ API routes ยังไม่ได้แก้ไข ทำให้ยังใช้งานไม่ได้ชั่วคราว

### ❌ API Routes ที่ยังใช้งานไม่ได้:

1. `/api/activities` - ใช้ categoryId แทน category
2. `/api/news` - ใช้ categoryId แทน category
3. `/api/documents` - ใช้ categoryId แทน category
4. `/api/gallery` - ใช้ categoryId แทน category

### ✅ วิธีแก้ไขชั่วคราว:

เนื่องจากยังไม่มีข้อมูล Category ในฐานข้อมูล API routes เหล่านี้จะ return error

**แนะนำให้:**
1. สร้าง Category API และ seed ข้อมูลก่อน
2. แก้ไข frontend ให้ใช้ categoryId แทน category string
3. แก้ไข API routes ทั้งหมด

### 🔄 การแก้ไขที่ต้องทำ:

```typescript
// เดิม
const activity = await prisma.activity.findUnique({
  where: { id }
});

// ใหม่ 
const activity = await prisma.activity.findUnique({
  where: { id },
  include: {
    category: true,
    tags: {
      include: {
        tag: true
      }
    }
  }
});
```

---

**Status:** Work in Progress  
**Updated:** October 19, 2025
