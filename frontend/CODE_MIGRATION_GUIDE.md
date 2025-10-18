# คู่มือการอัปเดตโค้ดให้สอดคล้องกับ Schema ใหม่

## ✅ การเปลี่ยนแปลงที่ทำแล้ว

### 1. ไฟล์ Types (`src/types/index.ts`)
- ✅ เปลี่ยน Role จาก `'ADMIN' | 'EDITOR' | 'MEMBER' | 'STAFF'` เป็น `'ADMIN' | 'MEMBER' | 'USER'`
- ✅ เพิ่ม `password?: string` ใน User interface
- ✅ เพิ่ม `lastLoginAt?: string` ใน User interface

### 2. หน้า Admin Users (`src/app/admin/users/page.tsx`)
- ✅ แก้ไข role filter options
  - เปลี่ยนจาก: ADMIN, STAFF, MEMBER
  - เป็น: ADMIN, MEMBER, USER
- ✅ แก้ไข role display labels
  - ADMIN = "ผู้ดูแลระบบ"
  - MEMBER = "สมาชิกสโมสร"
  - USER = "ผู้ใช้งานทั่วไป"
- ✅ แก้ไข role select options ในฟอร์ม

---

## 📋 การเปลี่ยนแปลงที่ต้องทำเพิ่มเติม

### ไฟล์ที่ต้องตรวจสอบและแก้ไข:

#### 1. **API Routes**

##### `src/app/api/users/route.ts`
```typescript
// ต้องปรับ validation และ default role
// เปลี่ยนจาก: role: Role.MEMBER
// เป็น: role: Role.USER หรือ Role.MEMBER (ตามความเหมาะสม)
```

##### `src/app/api/auth/[...nextauth]/route.ts`
```typescript
// ตรวจสอบ session callback ให้ส่ง role ถูกต้อง
// และรองรับ USER, MEMBER, ADMIN เท่านั้น
```

#### 2. **Middleware & Authorization**

##### `middleware.ts` (ถ้ามี)
```typescript
// ตรวจสอบ role-based access control
// เปลี่ยนจาก: EDITOR, STAFF
// เป็น: MEMBER, USER (ตามความเหมาะสม)
```

#### 3. **Components**

##### หน้าต่างๆ ที่มีการแสดง Role:
- `src/app/profile/page.tsx`
- `src/components/Header.tsx`
- `src/components/UserMenu.tsx` (ถ้ามี)

ตรวจสอบและแก้ไขการแสดงผล role label ทั้งหมด

#### 4. **Database Seed/Migration**

##### `prisma/seed.ts` (ถ้ามี)
```typescript
// แก้ไข role ในข้อมูลตัวอย่าง
// จาก: EDITOR, STAFF
// เป็น: MEMBER, USER
```

---

## 🔍 วิธีค้นหาไฟล์ที่ต้องแก้

รันคำสั่งเหล่านี้เพื่อหาไฟล์ที่ยังมี EDITOR หรือ STAFF:

```bash
# PowerShell
cd frontend
Get-ChildItem -Recurse -Include *.ts,*.tsx | Select-String -Pattern "EDITOR|STAFF" | Select-Object Path,LineNumber,Line
```

หรือใช้ VS Code Search:
1. กด `Ctrl + Shift + F`
2. ค้นหา: `EDITOR|STAFF`
3. Include: `src/**/*.{ts,tsx}`
4. แก้ไขทีละไฟล์

---

## 📝 แนวทางการแก้ไข

### กฎการแปลง Role:

| Role เดิม | Role ใหม่ | คำอธิบาย |
|-----------|-----------|----------|
| **ADMIN** | **ADMIN** | ผู้ดูแลระบบ (ไม่เปลี่ยน) |
| **EDITOR** | **MEMBER** | เจ้าหน้าที่/ผู้จัดการเนื้อหา → สมาชิกสโมสร |
| **STAFF** | **MEMBER** | บุคลากร → สมาชิกสโมสร |
| **MEMBER** | **MEMBER** | สมาชิก (ไม่เปลี่ยน) |
| *(ใหม่)* | **USER** | ผู้ใช้งานทั่วไป (ที่ยังไม่ได้เป็นสมาชิก) |

### สิทธิ์การเข้าถึง (แนะนำ):

```typescript
// ตัวอย่างการกำหนดสิทธิ์
const permissions = {
  ADMIN: {
    canManageUsers: true,
    canManageContent: true,
    canManageActivities: true,
    canViewReports: true,
    canApprove: true
  },
  MEMBER: {
    canManageUsers: false,
    canManageContent: true,      // สมาชิกสามารถจัดการข่าวสาร/กิจกรรม
    canManageActivities: true,
    canViewReports: false,
    canApprove: false
  },
  USER: {
    canManageUsers: false,
    canManageContent: false,     // ผู้ใช้ทั่วไปแค่ดูเท่านั้น
    canManageActivities: false,
    canViewReports: false,
    canApprove: false
  }
};
```

---

## 🗄️ การ Migrate Database

### ขั้นตอนการ Migrate:

```bash
cd frontend

# 1. สร้าง migration script
npx prisma migrate dev --name update_user_roles

# 2. อัปเดต role ที่มีอยู่ในฐานข้อมูล
# สร้างไฟล์ SQL: prisma/migrations/[timestamp]_update_existing_roles/migration.sql
```

### SQL Script สำหรับอัปเดต Role เดิม:

```sql
-- อัปเดต EDITOR และ STAFF เป็น MEMBER
UPDATE "users" 
SET "role" = 'MEMBER' 
WHERE "role" IN ('EDITOR', 'STAFF');

-- ตรวจสอบผลลัพธ์
SELECT "role", COUNT(*) as count 
FROM "users" 
GROUP BY "role";
```

---

## ✅ Checklist การอัปเดต

- [x] ปรับ schema.prisma
- [x] ปรับ types/index.ts
- [x] ปรับ admin/users/page.tsx
- [ ] ปรับ API routes (/api/users, /api/auth)
- [ ] ปรับ middleware (ถ้ามี)
- [ ] ปรับ components ที่แสดง role
- [ ] สร้าง migration script
- [ ] รัน migration
- [ ] ทดสอบระบบ authentication
- [ ] ทดสอบระบบ authorization
- [ ] อัปเดต documentation

---

## 🧪 การทดสอบ

### ทดสอบหลังการแก้ไข:

1. **ทดสอบการสร้าง User ใหม่**
   - สร้าง USER, MEMBER, ADMIN
   - ตรวจสอบว่า role ถูกบันทึกถูกต้อง

2. **ทดสอบการ Login**
   - Login ด้วย user แต่ละ role
   - ตรวจสอบสิทธิ์การเข้าถึง

3. **ทดสอบการแสดงผล**
   - ตรวจสอบ role label แสดงถูกต้อง
   - ตรวจสอบสี badge ถูกต้อง

4. **ทดสอบ Authorization**
   - USER ไม่สามารถเข้า /admin
   - MEMBER สามารถจัดการเนื้อหา
   - ADMIN สามารถทำทุกอย่าง

---

## 📞 ติดต่อสอบถาม

หากพบปัญหาหรือข้อสงสัย:
1. ตรวจสอบ error logs
2. ตรวจสอบ database schema
3. ตรวจสอบ Prisma Client generation
4. ดูเอกสาร: `SCHEMA_CHANGES.md`

---

**อัปเดตล่าสุด:** 18 ตุลาคม 2568  
**สถานะ:** ⚠️ กำลังดำเนินการ (ยังไม่เสร็จสมบูรณ์)
