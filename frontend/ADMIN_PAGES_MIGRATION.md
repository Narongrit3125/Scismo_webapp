# Admin Pages Migration Guide

## ฟิลด์ที่ต้องลบออกจากหน้าจัดการ

### 1. Projects Admin (`/admin/projects/page.tsx`)
**ฟิลด์ที่ต้องลบ (12 ฟิลด์):**
- ❌ `shortDescription` - ใช้ description แทน
- ❌ `priority` - ลบออกแล้ว
- ❌ `totalBudget` - เปลี่ยนเป็น `budget` (ฟิลด์เดียว)
- ❌ `usedBudget` - ลบออกแล้ว
- ❌ `objectives` - ลบออกแล้ว
- ❌ `targetGroup` - ลบออกแล้ว
- ❌ `expectedResults` - ลบออกแล้ว
- ❌ `sponsor` - ลบออกแล้ว
- ❌ `coordinator` - ลบออกแล้ว
- ❌ `approvedBy` - ลบออกแล้ว
- ❌ `approvedDate` - ลบออกแล้ว

**ฟิลด์ที่ยังใช้:**
- ✅ `code`, `title`, `description`
- ✅ `year` → เปลี่ยนเป็น `academicYear`
- ✅ `status`, `startDate`, `endDate`
- ✅ `budget` (แทน totalBudget)
- ✅ `isActive`, `image`, `planFile`

---

### 2. Activities Admin (`/admin/activities/page.tsx`)
**ฟิลด์ที่ต้องเปลี่ยน:**
- ❌ `category: string` → ✅ `categoryId: string` (เก็บ ID แทนชื่อ)
- ❌ `tags: string[]` → ใช้ ActivityTag relation แทน (ไม่ส่งใน form)

**ฟิลด์ที่ต้องลบ (8 ฟิลด์):**
- ❌ `maxParticipants` - ลบออกแล้ว
- ❌ `currentParticipants` - ลบออกแล้ว
- ❌ `coordinator` - ลบออกแล้ว
- ❌ `requirements` - ลบออกแล้ว
- ❌ `budget` - ลบออกแล้ว
- ❌ `actualExpense` - ลบออกแล้ว
- ❌ `order` - ลบออกแล้ว

**ฟิลด์ที่เพิ่มใหม่:**
- ✅ `gallery` - เก็บรูปภาพหลายรูป

---

### 3. Documents Admin (`/admin/documents/page.tsx`)
**ฟิลด์ที่ต้องเปลี่ยน:**
- ❌ `category: string` → ✅ `categoryId: string` (เก็บ ID แทนชื่อ)
- ❌ `tags: string[]` → ใช้ DocumentTag relation แทน (ไม่ส่งใน form)

**ต้องสร้าง Category dropdown:**
ดึง categories จาก `/api/categories` แล้วให้เลือก categoryId

---

### 4. News Admin (`/admin/news/page.tsx`)
**ฟิลด์ที่ต้องเปลี่ยน:**
- ❌ `category: string` → ✅ `categoryId: string` (เก็บ ID แทนชื่อ)
- ❌ `tags: string[]` → ใช้ NewsTag relation แทน (ไม่ส่งใน form)

**ต้องสร้าง Category dropdown:**
ดึง categories จาก `/api/categories` แล้วให้เลือก categoryId

---

## แผนการแก้ไข

### Step 1: แก้ Projects Admin ✅
1. ลบ interface fields ที่ไม่ใช้
2. ลบ formData fields ที่ไม่ใช้
3. ลบ form inputs ใน modal
4. เปลี่ยน totalBudget → budget
5. เปลี่ยน year → academicYear

### Step 2: แก้ Activities Admin
1. เปลี่ยน category เป็น categoryId
2. สร้าง categories dropdown
3. ลบฟิลด์ที่ไม่ใช้ทั้งหมด
4. ลบ tags input (ใช้ relation)

### Step 3: แก้ Documents Admin
1. เปลี่ยน category เป็น categoryId
2. สร้าง categories dropdown
3. ลบ tags input

### Step 4: แก้ News Admin
1. เปลี่ยน category เป็น categoryId  
2. สร้าง categories dropdown
3. ลบ tags input

---

## ตัวอย่าง Category API Response

```typescript
// GET /api/categories
{
  "success": true,
  "data": [
    {
      "id": "cat_123",
      "name": "ทั่วไป",
      "type": "NEWS", // หรือ ACTIVITY, DOCUMENT
      "description": "ข่าวทั่วไป"
    }
  ]
}
```

## วิธีใช้ categoryId แทน category string

**เดิม (ผิด):**
```typescript
formData.category = "ทั่วไป" // string
```

**ใหม่ (ถูก):**
```typescript
formData.categoryId = "cat_123" // ID reference
```

**ใน Form:**
```tsx
<select value={formData.categoryId} onChange={...}>
  {categories.map(cat => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>
```
