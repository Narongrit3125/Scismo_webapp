# Prisma Schema Changes - ระบบ SMO Web Application

## การปรับปรุงครั้งล่าสุด (18 ต.ค. 2568)

### ✅ สรุปการเปลี่ยนแปลงหลัก

#### 1. **ระบบผู้ใช้งาน (User Management)**
- ปรับ Role จาก 4 ระดับ (ADMIN, EDITOR, MEMBER, STAFF) เป็น 3 ระดับ (ADMIN, MEMBER, USER)
- เพิ่ม field `password` สำหรับการ authentication
- เพิ่ม `lastLoginAt` สำหรับติดตามการเข้าใช้งาน
- เพิ่ม relation `formSubmissions` เพื่อเชื่อมโยงกับการส่งฟอร์ม

#### 2. **ข้อมูลสมาชิก (Member)**
- เปลี่ยน `studentId` จาก optional เป็น required และ unique
- เพิ่ม `division` (ฝ่ายงาน)
- เพิ่ม `address`, `emergencyContact`, `emergencyPhone` เพื่อความปลอดภัย

#### 3. **ข้อมูลบุคลากร (Staff)**
- เปลี่ยน `employeeId` เป็น `staffId` (required และ unique)
- เพิ่ม `startDate` สำหรับบันทึกวันที่เริ่มงาน

#### 4. **ตำแหน่ง (Position)**
- เพิ่ม `division` (ฝ่าย/แผนก)
- เพิ่ม `responsibilities` (หน้าที่ความรับผิดชอบ)
- เพิ่ม `updatedAt` สำหรับติดตามการแก้ไข
- เพิ่ม `COORDINATOR` ใน PositionType
- เปลี่ยน `VOLUNTEER` เป็น `MEMBER`

#### 5. **ข่าวสาร (News)**
- เพิ่ม `isPinned` สำหรับปักหมุดข่าวสำคัญ
- เพิ่ม `attachments` สำหรับไฟล์แนบ (JSON array)
- เพิ่ม indexes: `category`, `status`, `publishedAt` เพื่อเพิ่มประสิทธิภาพการค้นหา

#### 6. **กิจกรรม (Activity)**
- เพิ่ม `coordinator` (ผู้ประสานงาน)
- เพิ่ม `actualExpense` (ค่าใช้จ่ายจริง)
- เพิ่ม `gallery` (แกลเลอรีภาพกิจกรรม JSON array)
- เพิ่มประเภทกิจกรรม: `ACADEMIC`, `SPORT`, `ART_CULTURE`
- เพิ่มสถานะ: `POSTPONED` (เลื่อน)
- เพิ่ม indexes: `category`, `status`, `startDate`

#### 7. **โครงการ (Project)**
- เปลี่ยน `year` เป็น `academicYear` เพื่อความชัดเจน
- เพิ่ม `semester` (ภาคการศึกษา)
- เพิ่ม `approvedBudget` (งบประมาณที่ได้รับอนุมัติ)
- เพิ่ม `keyPerformance` (ตัวชี้วัดความสำเร็จ JSON array)
- เพิ่ม `approvedBy`, `approvedDate` สำหรับการอนุมัติ
- เพิ่มสถานะ: `PENDING_APPROVAL`, `CLOSED`
- เพิ่ม indexes: `academicYear`, `status`

#### 8. **รายงานโครงการ (ProjectReport)**
- เพิ่ม `reviewedBy`, `approvedBy` สำหรับการตรวจสอบและอนุมัติ
- เพิ่ม `remarks` (หมายเหตุ)
- เพิ่มประเภทรายงาน: `MONTHLY`, `QUARTERLY`
- เพิ่มสถานะ: `UNDER_REVIEW`, `REVISION`
- เพิ่ม indexes: `projectId`, `reportType`

#### 9. **เอกสาร (Document)**
- เพิ่ม `version` (เวอร์ชันเอกสาร)
- เพิ่ม enum `AccessLevel` (PUBLIC, MEMBER_ONLY, ADMIN_ONLY, RESTRICTED)
- เพิ่ม `accessLevel` field แทน `isPublic` เพียงอย่างเดียว
- เพิ่ม `approvedBy` (ผู้อนุมัติ)
- เพิ่ม `expiryDate` (วันหมดอายุ)
- เพิ่ม indexes: `category`, `isPublic`

#### 10. **แกลเลอรี (Gallery)**
- เพิ่ม enum `AlbumType` (ACTIVITY, EVENT, CEREMONY, ACHIEVEMENT, FACILITY, OTHER)
- เพิ่ม `coverImage` (รูปปกอัลบั้ม)
- เพิ่ม `uploadedBy` (ผู้อัปโหลด)
- เปลี่ยน `images` จาก optional เป็น required
- เปลี่ยน `date` เป็น `eventDate` เพื่อความชัดเจน
- เพิ่ม indexes: `category`, `eventDate`

#### 11. **ฟอร์ม (Form)**
- เพิ่ม `openDate`, `closeDate` สำหรับกำหนดช่วงเวลา
- เพิ่ม `maxSubmissions`, `currentSubmissions` สำหรับจำกัดจำนวน
- เพิ่ม `createdBy` (ผู้สร้าง)
- เพิ่มประเภทฟอร์ม: `EVALUATION`, `REQUEST`
- เพิ่มสถานะ: `DRAFT`
- เพิ่ม indexes: `type`, `status`

#### 12. **การส่งฟอร์ม (FormSubmission)**
- เพิ่ม `userId` เพื่อเชื่อมโยงกับผู้ใช้
- เพิ่ม `ipAddress` สำหรับบันทึก IP
- เพิ่ม `reviewedBy`, `reviewedAt`, `remarks` สำหรับการตรวจสอบ
- เพิ่มสถานะ: `PROCESSING`
- เพิ่ม indexes: `formId`, `status`

#### 13. **แคมเปญบริจาค (DonationCampaign)**
- เพิ่ม `purpose` (วัตถุประสงค์)
- เพิ่ม `approvedBy` (ผู้อนุมัติ)
- เพิ่ม `isPublic` สำหรับควบคุมการมองเห็น
- เพิ่มสถานะ: `CANCELLED`
- เพิ่ม index: `status`

#### 14. **การบริจาค (Donation)**
- เพิ่ม `donorEmail`, `donorPhone` สำหรับติดต่อผู้บริจาค
- เพิ่ม `paymentMethod`, `transactionId`, `receiptUrl` สำหรับระบบการเงิน
- เพิ่ม `verifiedBy`, `verifiedAt` สำหรับการตรวจสอบ
- เปลี่ยนสถานะเริ่มต้นเป็น `PENDING` (แทน `COMPLETED`)
- เพิ่มสถานะ: `VERIFIED`
- เพิ่ม indexes: `campaignId`, `status`

#### 15. **ข้อความติดต่อ (Contact)**
- เพิ่ม `assignedTo` (มอบหมายให้)
- เพิ่ม `repliedBy`, `repliedAt`, `reply` สำหรับการตอบกลับ
- เพิ่มสถานะ: `IN_PROGRESS`
- เพิ่ม indexes: `status`, `category`

#### 16. **ข้อมูลติดต่อ (ContactInfo)**
- เปลี่ยนจาก String type เป็น enum `ContactInfoType`
- เพิ่ม social media types: FACEBOOK, LINE, INSTAGRAM, TWITTER, YOUTUBE, TIKTOK
- เพิ่ม types อื่นๆ: ADDRESS, PHONE, EMAIL, FAX, WEBSITE
- เพิ่ม `createdAt`, `updatedAt` สำหรับติดตามการเปลี่ยนแปลง

---

## 📊 สถิติการเปลี่ยนแปลง

- **Models ทั้งหมด:** 16 models
- **Enums ทั้งหมด:** 15 enums
- **Indexes เพิ่มเติม:** 20+ indexes
- **Fields ใหม่:** 40+ fields
- **Relations:** ครบถ้วนและเชื่อมโยงถูกต้อง

---

## 🔧 การแก้ไขปัญหา

### ปัญหาที่พบและแก้ไข:

1. **DATABASE_URL ไม่ตรงกับ provider**
   - **ปัญหา:** .env มี `DATABASE_URL="file:./dev.db"` (SQLite) แต่ schema ใช้ PostgreSQL
   - **แก้ไข:** เปลี่ยนเป็น `postgresql://postgres:password@localhost:5432/smowebnet?schema=public`

2. **Validation ผ่านสำเร็จ ✅**
   ```bash
   npx prisma validate
   # Result: The schema at prisma\schema.prisma is valid 🚀
   ```

---

## 📝 การใช้งานต่อไป

### 1. สร้าง Migration
```bash
cd frontend
npx prisma migrate dev --name init_smo_system
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. เปิด Prisma Studio (ดูข้อมูล)
```bash
npx prisma studio
```

### 4. Reset Database (ถ้าจำเป็น)
```bash
npx prisma migrate reset
```

---

## ⚠️ หมายเหตุสำคัญ

1. **กรุณาแก้ไข DATABASE_URL** ใน `.env` ให้ตรงกับ database จริงของคุณ
2. **Backup ข้อมูล** ก่อนทำ migration ทุกครั้ง
3. **ตรวจสอบ Relations** ให้ครบถ้วนก่อน deploy
4. **ใช้ Indexes** อย่างเหมาะสมเพื่อประสิทธิภาพ

---

## 🎯 ฟีเจอร์ที่รองรับ

✅ ระบบจัดการผู้ใช้ 3 ระดับ (ADMIN, MEMBER, USER)  
✅ ระบบ Role-Based Access Control  
✅ จัดการสมาชิก คณะกรรมการ และเจ้าหน้าที่  
✅ จัดการข่าวสารและประกาศ (รองรับปักหมุด)  
✅ จัดการกิจกรรมและโครงการ (รองรับงบประมาณ)  
✅ ระบบรายงานโครงการแบบครบวงจร  
✅ จัดการเอกสารพร้อมควบคุมสิทธิ์  
✅ แกลเลอรีภาพกิจกรรม  
✅ ระบบฟอร์มออนไลน์  
✅ ระบบบริจาคและระดมทุน  
✅ ระบบติดต่อสอบถาม  
✅ รองรับ Newsletter และการแจ้งเตือน  

---

**วันที่อัปเดต:** 18 ตุลาคม 2568  
**เวอร์ชัน Schema:** 2.0  
**สถานะ:** ✅ พร้อมใช้งาน
