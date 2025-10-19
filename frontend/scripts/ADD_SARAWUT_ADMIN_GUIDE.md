# เพิ่ม Admin User: ศราวุฒิ ปล้องสา

## ข้อมูลผู้ใช้

| รายการ | ข้อมูล |
|--------|--------|
| **ชื่อ-สกุล** | ศราวุฒิ ปล้องสา |
| **อีเมล** | sarawutp65@nu.ac.th |
| **Username** | sarawutp65 |
| **รหัสผ่าน** | 65314812 |
| **Role** | ADMIN |
| **Status** | Active |

## Password Hash (Bcrypt)
```
$2b$10$VW8FTfzzSkBhDrZB6g8kge6DixYEjayV5fULHnNNIp89VQZnadUDm
```

## วิธีเพิ่มผู้ใช้

### วิธีที่ 1: ใช้ SQL Script (แนะนำสำหรับ Production)

1. เข้า Vercel Dashboard → Storage → Postgres
2. เปิด Query Editor
3. รัน SQL จากไฟล์: `scripts/add-sarawut-admin.sql`

```sql
INSERT INTO "User" (
  "id",
  "email",
  "username",
  "password",
  "firstName",
  "lastName",
  "role",
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'sarawutp65@nu.ac.th',
  'sarawutp65',
  '$2b$10$VW8FTfzzSkBhDrZB6g8kge6DixYEjayV5fULHnNNIp89VQZnadUDm',
  'ศราวุฒิ',
  'ปล้องสา',
  'ADMIN',
  true,
  NOW(),
  NOW()
)
ON CONFLICT ("email") 
DO UPDATE SET
  "password" = EXCLUDED."password",
  "firstName" = EXCLUDED."firstName",
  "lastName" = EXCLUDED."lastName",
  "role" = 'ADMIN',
  "isActive" = true,
  "updatedAt" = NOW();
```

4. Verify ด้วย:
```sql
SELECT "id", "email", "username", "firstName", "lastName", "role", "isActive", "createdAt"
FROM "User"
WHERE "email" = 'sarawutp65@nu.ac.th';
```

### วิธีที่ 2: ใช้ Prisma Studio (แนะนำสำหรับ Development)

1. รัน Prisma Studio:
```bash
npx prisma studio
```

2. เปิดตาราง `User`
3. กด "Add record"
4. กรอกข้อมูล:
   - email: `sarawutp65@nu.ac.th`
   - username: `sarawutp65`
   - password: `$2b$10$VW8FTfzzSkBhDrZB6g8kge6DixYEjayV5fULHnNNIp89VQZnadUDm`
   - firstName: `ศราวุฒิ`
   - lastName: `ปล้องสา`
   - role: `ADMIN`
   - isActive: `true`
5. กด "Save 1 change"

### วิธีที่ 3: ใช้ TypeScript Script (ต้องมี DATABASE_URL)

1. ตั้งค่า DATABASE_URL ใน `.env`:
```bash
DATABASE_URL="postgresql://..."
```

2. รัน script:
```bash
npx tsx scripts/add-sarawut-admin.ts
```

### วิธีที่ 4: ใช้ API Route (ง่ายที่สุด)

สร้าง API route สำหรับเพิ่มผู้ใช้:

```typescript
// src/app/api/admin/setup-users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const hashedPassword = await bcrypt.hash('65314812', 10);
    
    const user = await prisma.user.upsert({
      where: { email: 'sarawutp65@nu.ac.th' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
      create: {
        email: 'sarawutp65@nu.ac.th',
        username: 'sarawutp65',
        password: hashedPassword,
        firstName: 'ศราวุฒิ',
        lastName: 'ปล้องสา',
        role: 'ADMIN',
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

จากนั้นเรียก:
```bash
curl -X POST https://your-domain.vercel.app/api/admin/setup-users
```

## การเข้าสู่ระบบ

หลังจากเพิ่มผู้ใช้แล้ว สามารถเข้าสู่ระบบได้ที่:

**URL**: https://your-domain.vercel.app/auth/signin

**ข้อมูลเข้าสู่ระบบ**:
- Email: `sarawutp65@nu.ac.th`
- Password: `65314812`

## สิทธิ์ Admin

ผู้ใช้จะมีสิทธิ์เข้าถึง:
- ✅ `/admin` - Admin Dashboard
- ✅ `/admin/projects` - จัดการโครงการ
- ✅ `/admin/activities` - จัดการกิจกรรม
- ✅ `/admin/news` - จัดการข่าวสาร
- ✅ `/admin/documents` - จัดการเอกสาร
- ✅ `/admin/members` - จัดการสมาชิก
- ✅ `/admin/staff` - จัดการเจ้าหน้าที่
- ✅ `/admin/users` - จัดการผู้ใช้งาน

## Troubleshooting

### ถ้าเข้าสู่ระบบไม่ได้

1. ตรวจสอบว่าผู้ใช้ถูกสร้างแล้ว:
```sql
SELECT * FROM "User" WHERE email = 'sarawutp65@nu.ac.th';
```

2. ตรวจสอบ `isActive` เป็น `true`
3. ตรวจสอบ `role` เป็น `ADMIN`
4. ลองรีเซ็ตรหัสผ่าน (ใช้ SQL UPDATE)

### ถ้าไม่มีสิทธิ์ Admin

อัปเดต role เป็น ADMIN:
```sql
UPDATE "User" 
SET "role" = 'ADMIN', "updatedAt" = NOW()
WHERE "email" = 'sarawutp65@nu.ac.th';
```

### ถ้าลืมรหัสผ่าน

รีเซ็ตรหัสผ่านเป็น 65314812:
```sql
UPDATE "User" 
SET 
  "password" = '$2b$10$VW8FTfzzSkBhDrZB6g8kge6DixYEjayV5fULHnNNIp89VQZnadUDm',
  "updatedAt" = NOW()
WHERE "email" = 'sarawutp65@nu.ac.th';
```

## Files Created

1. ✅ `scripts/add-sarawut-admin.ts` - TypeScript script
2. ✅ `scripts/add-sarawut-admin.sql` - SQL script
3. ✅ `scripts/generate-password-hash.ts` - Password hash generator
4. ✅ `scripts/setup-production-users.ts` - Updated with new user
5. ✅ `scripts/ADD_SARAWUT_ADMIN_GUIDE.md` - This guide

## Next Steps

1. 🔲 เลือกวิธีที่เหมาะสม (แนะนำ: SQL Script หรือ API Route)
2. 🔲 เพิ่มผู้ใช้ในฐานข้อมูล Production
3. 🔲 ทดสอบเข้าสู่ระบบ
4. 🔲 ทดสอบสิทธิ์ Admin
5. 🔲 แจ้งข้อมูลการเข้าสู่ระบบให้คุณศราวุฒิ

---

**สร้างเมื่อ**: January 2025  
**Password Hash Salt Rounds**: 10  
**Status**: ✅ Ready to deploy
