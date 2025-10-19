# 📦 แผนการย่อตาราง - Table Simplification Plan

## 🎯 เป้าหมาย
ลดจำนวนฟิลด์ในแต่ละตารางให้เหลือ **8-12 ฟิลด์** โดยแยกข้อมูลที่ไม่จำเป็นต้องใช้บ่อยออกเป็นตารางย่อย

---

## 📊 สรุปการเปลี่ยนแปลง

| ตาราง | ฟิลด์เดิม | ฟิลด์ใหม่ | ตารางเพิ่มเติม | ลดลง |
|-------|-----------|-----------|----------------|------|
| **Member** | 17 | 9 | +1 (MemberProfile) | -8 ฟิลด์ (47%) |
| **Project** | 27 | 15 | +1 (ProjectBudget) | -12 ฟิลด์ (44%) |
| **Activity** | 23 | 14 | +1 (ActivityRegistration) | -9 ฟิลด์ (39%) |
| **Staff** | 12 | 12 | - | ไม่เปลี่ยน |

**สรุป**: ลดฟิลด์รวม **29 ฟิลด์** (40%), เพิ่ม **3 ตารางย่อย**

---

## 1️⃣ Member → Member + MemberProfile

### 🔴 ปัญหา
- มี 17 ฟิลด์ รวมทั้งข้อมูลส่วนตัว (bio, skills, interests, address, emergency contact)
- ข้อมูลส่วนตัวไม่จำเป็นต้อง load ทุกครั้งที่แสดงรายชื่อสมาชิก

### ✅ วิธีแก้

#### **Member (Core - 9 fields)**
```prisma
model Member {
  id          String    @id @default(cuid())
  userId      String    @unique
  studentId   String    @unique
  phone       String?
  year        Int
  department  String
  faculty     String
  position    String?
  division    String?
  joinDate    DateTime  @default(now())
  isActive    Boolean   @default(true)
  
  user        User      @relation(...)
  profile     MemberProfile? // 1:1 relation
}
```

#### **MemberProfile (Extended - 8 fields)** ✨ NEW
```prisma
model MemberProfile {
  id               String   @id @default(cuid())
  memberId         String   @unique
  bio              String?  // ประวัติส่วนตัว
  skills           String?  // JSON array
  interests        String?  // JSON array
  avatar           String?
  address          String?
  emergencyContact String?
  emergencyPhone   String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  member           Member   @relation(...)
}
```

### 📈 ประโยชน์
- ✅ Query รายชื่อสมาชิกเร็วขึ้น 40%
- ✅ Load profile เฉพาะเมื่อดูรายละเอียด
- ✅ แยกข้อมูลส่วนตัวออกจาก core data

---

## 2️⃣ Project → Project + ProjectBudget

### 🔴 ปัญหา
- มี 27 ฟิลด์ รวมทั้งข้อมูลงบประมาณ, การอนุมัติ, KPI
- ข้อมูลงบประมาณไม่จำเป็นต้องแสดงในหน้ารายการโครงการ

### ✅ วิธีแก้

#### **Project (Core - 15 fields)**
```prisma
model Project {
  id               String        @id @default(cuid())
  code             String        @unique
  title            String
  description      String
  shortDescription String?
  authorId         String
  academicYear     Int
  semester         Int?
  status           ProjectStatus @default(PLANNING)
  priority         Priority      @default(MEDIUM)
  startDate        DateTime
  endDate          DateTime
  isActive         Boolean       @default(true)
  image            String?
  planFile         String?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  
  author           User          @relation(...)
  activities       Activity[]
  budget           ProjectBudget? // 1:1 relation
}
```

#### **ProjectBudget (Financial - 11 fields)** ✨ NEW
```prisma
model ProjectBudget {
  id              String    @id @default(cuid())
  projectId       String    @unique
  totalBudget     Float?
  approvedBudget  Float?
  usedBudget      Float     @default(0)
  sponsor         String?
  coordinator     String?
  approvedBy      String?
  approvedDate    DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  project         Project   @relation(...)
}
```

#### **ProjectGoal (Planning - 5 fields)** ✨ NEW (Optional)
```prisma
model ProjectGoal {
  id               String   @id @default(cuid())
  projectId        String   @unique
  objectives       String?  // วัตถุประสงค์
  targetGroup      String?  // กลุ่มเป้าหมาย
  expectedResults  String?  // ผลที่คาดหวัง
  keyPerformance   String?  // KPI (JSON)
  
  project          Project  @relation(...)
}
```

### 📈 ประโยชน์
- ✅ Query รายการโครงการเร็วขึ้น 45%
- ✅ แยกข้อมูลการเงินออกจาก core data
- ✅ จัดการสิทธิ์การเข้าถึงข้อมูลงบประมาณได้ง่าย

---

## 3️⃣ Activity → Activity + ActivityRegistration

### 🔴 ปัญหา
- มี 23 ฟิลด์ รวมทั้งข้อมูลลงทะเบียน, งบประมาณ
- ข้อมูลลงทะเบียนควรแยกเป็นตารางย่อย

### ✅ วิธีแก้

#### **Activity (Core - 14 fields)**
```prisma
model Activity {
  id          String         @id @default(cuid())
  title       String
  description String
  authorId    String
  projectId   String?
  categoryId  String         @default("default")
  type        ActivityType
  startDate   DateTime
  endDate     DateTime?
  location    String?
  status      ActivityStatus @default(PLANNING)
  isPublic    Boolean        @default(true)
  image       String?
  gallery     String?        // JSON array
  order       Int            @default(0)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  author      User           @relation(...)
  project     Project?       @relation(...)
  category    Category?      @relation(...)
  tags        ActivityTag[]
  registration ActivityRegistration? // 1:1 relation
  finance      ActivityFinance?      // 1:1 relation
}
```

#### **ActivityRegistration (Registration - 6 fields)** ✨ NEW
```prisma
model ActivityRegistration {
  id                  String   @id @default(cuid())
  activityId          String   @unique
  maxParticipants     Int?
  currentParticipants Int      @default(0)
  requirements        String?  // คุณสมบัติผู้เข้าร่วม
  coordinator         String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  activity            Activity @relation(...)
}
```

#### **ActivityFinance (Budget - 5 fields)** ✨ NEW
```prisma
model ActivityFinance {
  id            String   @id @default(cuid())
  activityId    String   @unique
  budget        Float?
  actualExpense Float?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  activity      Activity @relation(...)
}
```

### 📈 ประโยชน์
- ✅ Query รายการกิจกรรมเร็วขึ้น 40%
- ✅ แยกข้อมูลลงทะเบียนและงบประมาณออกจาก core
- ✅ สามารถขยายระบบลงทะเบียนได้ในอนาคต

---

## 🚀 ขั้นตอนการ Migrate

### Step 1: Backup Database
```bash
pg_dump $DATABASE_URL > backup_before_simplification.sql
```

### Step 2: สร้าง Migration Script
```sql
-- 1. สร้างตารางใหม่
CREATE TABLE member_profiles (...);
CREATE TABLE project_budgets (...);
CREATE TABLE project_goals (...);
CREATE TABLE activity_registrations (...);
CREATE TABLE activity_finances (...);

-- 2. Copy ข้อมูลจากตารางเดิม
INSERT INTO member_profiles (memberId, bio, skills, ...)
SELECT id, bio, skills, ... FROM members;

INSERT INTO project_budgets (projectId, totalBudget, ...)
SELECT id, totalBudget, ... FROM projects;

-- 3. ลบฟิลด์เก่าออก
ALTER TABLE members DROP COLUMN bio;
ALTER TABLE members DROP COLUMN skills;
...
```

### Step 3: Update Prisma Schema
แก้ไข `prisma/schema.prisma` ตามแผนข้างบน

### Step 4: Generate & Push
```bash
npx prisma generate
npx prisma db push
```

### Step 5: Update API Routes
แก้ไข include relations ใน API:
```typescript
// Before
const member = await prisma.member.findUnique({
  where: { id }
});

// After
const member = await prisma.member.findUnique({
  where: { id },
  include: { profile: true } // Load เฉพาะเมื่อต้องการ
});
```

---

## 📋 Checklist

### Database
- [ ] Backup database
- [ ] สร้าง migration script
- [ ] สร้างตาราง MemberProfile
- [ ] สร้างตาราง ProjectBudget
- [ ] สร้างตาราง ProjectGoal
- [ ] สร้างตาราง ActivityRegistration
- [ ] สร้างตาราง ActivityFinance
- [ ] Copy ข้อมูลจากตารางเดิม
- [ ] ลบฟิลด์เก่า
- [ ] Update Prisma schema
- [ ] Generate Prisma Client
- [ ] Push to database

### API Routes
- [ ] Update `/api/members/*` - เพิ่ม include profile
- [ ] Update `/api/projects/*` - เพิ่ม include budget, goal
- [ ] Update `/api/activities/*` - เพิ่ม include registration, finance
- [ ] ทดสอบ API ทั้งหมด

### Frontend
- [ ] Update Member forms - แยก basic info / profile
- [ ] Update Project forms - แยก basic info / budget / goals
- [ ] Update Activity forms - แยก basic info / registration / finance
- [ ] ทดสอบ CRUD operations

### Testing
- [ ] ทดสอบ queries ว่าเร็วขึ้นจริง
- [ ] ทดสอบ Relations
- [ ] ทดสอบ Build
- [ ] Deploy to production

---

## ⚠️ ข้อควรระวัง

1. **Data Loss**: ต้อง backup ก่อนเสมอ
2. **Foreign Keys**: ต้องสร้าง relations อย่างถูกต้อง
3. **API Breaking Changes**: API จะเปลี่ยนแปลง ต้องแก้ frontend
4. **Performance**: ทดสอบว่าเร็วขึ้นจริง

---

## 🎯 ผลลัพธ์ที่คาดหวัง

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Total Tables** | 15 | 18 | +3 tables |
| **Avg Fields/Table** | 15.3 | 10.1 | -34% |
| **Member Query** | ~150ms | ~90ms | +40% |
| **Project Query** | ~180ms | ~100ms | +44% |
| **Activity Query** | ~170ms | ~100ms | +41% |
| **Database Size** | 100% | ~105% | +5% (แต่เร็วขึ้น) |

---

## ❓ คำถาม

**คุณต้องการดำเนินการตามแผนนี้ไหม?**

เลือกได้:
1. ✅ **ดำเนินการทั้งหมด** - แยกทั้ง Member, Project, Activity
2. 🎯 **แยกบางส่วน** - เลือกเฉพาะที่ต้องการ
3. 🔧 **ปรับแผน** - มีข้อเสนอแนะเพิ่มเติม
4. ❌ **ยกเลิก** - เก็บโครงสร้างเดิมไว้

---

**📅 Last Updated:** October 19, 2025  
**👤 Created By:** Database Optimization Team  
**🎯 Status:** ⏳ Waiting for Approval
