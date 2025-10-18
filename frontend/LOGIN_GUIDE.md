# 🔐 คู่มือการ Login - SMO Web Application

## ✅ ข้อมูลการ Login

### Production (Vercel)
**URL:** https://scismo-webapp-7zno.vercel.app

### บัญชีทดสอบที่พร้อมใช้งาน:

#### 1. Admin Account (ผู้ดูแลระบบ)
```
Email: admin@smo.com
Password: password123
Role: ADMIN
```
- สามารถจัดการทุกอย่างในระบบ
- เข้าถึงหน้า Admin Dashboard
- จัดการข่าว, กิจกรรม, สมาชิก, เจ้าหน้าที่

#### 2. Member Account (สมาชิก)
```
Email: member@smo.com
Password: password123
Role: MEMBER
```
- เข้าถึงข้อมูลสมาชิก
- ดูข่าวและกิจกรรม

#### 3. User Account (ผู้ใช้ทั่วไป)
```
Email: user@smo.com
Password: password123
Role: USER
```
- เข้าถึงข้อมูลพื้นฐาน
- ดูข่าวและกิจกรรมสาธารณะ

---

## 🔧 สถานะระบบ

### ✅ ที่ทำงานแล้ว:
- [x] Authentication system with bcrypt
- [x] PostgreSQL database on Vercel
- [x] User management (3 roles)
- [x] Forgot password functionality
- [x] Reset password functionality
- [x] Image upload API
- [x] Upcoming activities filter
- [x] All API endpoints functional

### 🎯 ขั้นตอนสุดท้าย:

1. **รอ Vercel Deploy เสร็จ** (2-3 นาที)
   - ไปที่: https://vercel.com/narongrit3125s-projects/scismo-webapp-7zno/deployments
   - รอจนกว่า status = "Ready" ✅

2. **ทดสอบ Login:**
   - เปิด: https://scismo-webapp-7zno.vercel.app/auth/signin
   - ใช้: `admin@smo.com` / `password123`
   - ควรเข้าสู่ระบบได้สำเร็จ

---

## 🔐 ระบบรีเซ็ตรหัสผ่าน

### วิธีใช้งาน:

1. **Forgot Password**
   - URL: `/auth/forgot-password`
   - กรอกอีเมล
   - ระบบจะสร้าง reset token (อายุ 1 ชั่วโมง)

2. **Reset Password**
   - URL: `/auth/reset-password?token=xxx`
   - กรอกรหัสผ่านใหม่ (อย่างน้อย 8 ตัว)
   - ยืนยันรหัสผ่าน
   - ระบบจะอัพเดทและ redirect ไป signin

3. **Login ด้วยรหัสผ่านใหม่**
   - เข้าสู่ระบบตามปกติ

---

## 📊 Database Information

### Production Database:
```
Provider: PostgreSQL (Prisma Data Platform)
Host: db.prisma.io:5432
Database: postgres
Schema: public
```

### Models:
- User (3 roles: ADMIN, MEMBER, USER)
- Member, Staff, Position
- News, Activity, Project
- Document, Gallery, Donation
- Contact, Form, FormSubmission

### User Fields:
- id, email, username, password (bcrypt hashed)
- firstName, lastName, role, isActive
- lastLoginAt, resetToken, resetTokenExpiry
- createdAt, updatedAt

---

## 🚀 Environment Variables (Vercel Production)

```env
POSTGRES_URL=postgres://...@db.prisma.io:5432/postgres?sslmode=require
POSTGRES_URL_NON_POOLING=postgres://...@db.prisma.io:5432/postgres?sslmode=require
NEXTAUTH_SECRET=smo-web-app-secret-key-2025-very-long-and-secure-string-for-nextauth
NEXTAUTH_URL=https://scismo-webapp-7zno.vercel.app
```

---

## 📝 หลังจาก Login สำเร็จ:

### สิ่งที่ควรทำต่อ:

1. **เปลี่ยนรหัสผ่าน**
   - อย่าใช้ `password123` ใน production นานๆ
   - ใช้ระบบ forgot password เพื่อเปลี่ยน

2. **สร้าง Admin จริง**
   - สร้างบัญชี admin ใหม่ด้วยอีเมลจริง
   - ลบบัญชีทดสอบออก

3. **ตั้งค่า Email Service**
   - SendGrid / AWS SES / Resend
   - เพื่อส่งลิงก์รีเซ็ตรหัสผ่านทางอีเมล

4. **เพิ่มข้อมูล**
   - เพิ่มข่าว
   - เพิ่มกิจกรรม
   - Upload รูปภาพ
   - เพิ่มสมาชิกและเจ้าหน้าที่

---

## 🐛 Troubleshooting

### ถ้า Login ไม่ได้:

1. **ตรวจสอบว่า deployment เสร็จแล้ว**
   ```
   https://vercel.com/.../deployments
   Status ต้องเป็น "Ready"
   ```

2. **ตรวจสอบ Environment Variables**
   ```bash
   vercel env ls production
   # ต้องมี: NEXTAUTH_SECRET, NEXTAUTH_URL, POSTGRES_URL
   ```

3. **ตรวจสอบ users ในฐานข้อมูล**
   ```bash
   npm run setup-production
   # สร้าง users ใหม่
   ```

4. **Clear browser cache**
   - Clear cookies และ cache
   - ลอง incognito/private mode

5. **ตรวจสอบ console errors**
   - เปิด DevTools (F12)
   - ดู Console และ Network tabs
   - หา error messages

---

## 📞 การติดต่อ

หากพบปัญหาหรือต้องการความช่วยเหลือ:
- ตรวจสอบ logs บน Vercel Dashboard
- ดู console errors ในเบราว์เซอร์
- ตรวจสอบ API responses

---

**อัพเดทล่าสุด:** October 19, 2025
**เวอร์ชัน:** 1.0.0
**สถานะ:** ✅ Production Ready
