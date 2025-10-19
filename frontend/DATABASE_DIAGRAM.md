# Database Schema Visualization Guide

## 📊 DBML File Generated

ไฟล์ `database.dbml` ถูกสร้างจาก **Prisma Schema** โดยอัตโนมัติผ่าน `prisma-dbml-generator`

## 🚀 วิธีสร้างไฟล์ DBML

### วิธีที่ 1: ใช้ npm script (แนะนำ)
```bash
npm run generate-dbml
```

### วิธีที่ 2: ใช้ Prisma CLI โดยตรง
```bash
npx prisma generate
```

Generator จะ:
1. อ่าน Prisma schema (`prisma/schema.prisma`)
2. แปลงเป็น DBML format
3. สร้างไฟล์ `database.dbml` พร้อม:
   - ✅ Tables และ columns ทั้งหมด
   - ✅ Relationships (one-to-one, one-to-many)
   - ✅ Enums (Role, Status types)
   - ✅ Constraints (primary key, unique, not null)
   - ✅ Default values
   - ✅ Cascade delete rules

## 📈 วิธีแสดงผล ER Diagram

### วิธีที่ 1: ใช้ dbdiagram.io (แนะนำ)

1. ไปที่ https://dbdiagram.io/
2. คลิก **"Import"** หรือเปิด editor ใหม่
3. คัดลอกเนื้อหาจาก `database.dbml`
4. Paste ลงใน editor
5. Diagram จะถูกสร้างอัตโนมัติ ✨

**Features:**
- 🎨 แสดง ER Diagram แบบ Interactive
- 📤 Export เป็น PNG, SVG, PDF
- 🔗 แสดง Relationships ระหว่าง tables
- 💾 บันทึกและแชร์ diagram

### วิธีที่ 2: ใช้ VS Code Extension

1. ติดตั้ง extension: **"vscode-dbml"**
2. เปิดไฟล์ `database.dbml`
3. กด `Ctrl+Shift+P` (Windows) หรือ `Cmd+Shift+P` (Mac)
4. พิมพ์ "DBML: Preview"
5. Diagram จะแสดงใน preview pane

### วิธีที่ 3: ใช้ DBeaver หรือ DataGrip

Tools เหล่านี้สามารถ import DBML หรือแสดง ER Diagram โดยตรงจาก database connection

## 📋 โครงสร้าง Database

ไฟล์ DBML ประกอบด้วย **17 tables**:

### 👥 User Management
- `users` - ข้อมูลผู้ใช้งาน
- `members` - ข้อมูลสมาชิก
- `staff` - ข้อมูลเจ้าหน้าที่
- `positions` - ตำแหน่ง

### 📰 Content Management
- `news` - ข่าวสาร
- `activities` - กิจกรรม
- `contents` - เนื้อหาทั่วไป
- `gallery` - รูปภาพ
- `documents` - เอกสาร

### 📊 Project Management
- `projects` - โครงการ
- `project_reports` - รายงานโครงการ

### 💰 Donations
- `donation_campaigns` - แคมเปญบริจาค
- `donations` - การบริจาค

### 📝 Forms & Contact
- `forms` - ฟอร์ม
- `form_submissions` - การส่งฟอร์ม
- `contacts` - ข้อความติดต่อ
- `contact_info` - ข้อมูลติดต่อ

## 🔗 Relationships

ไฟล์ DBML แสดง relationships ทั้งหมด:

```dbml
Ref: members.userId > users.id
Ref: staff.userId > users.id
Ref: news.authorId > users.id
Ref: activities.authorId > users.id
Ref: activities.projectId > projects.id
Ref: projects.authorId > users.id
Ref: project_reports.projectId > projects.id
Ref: form_submissions.formId > forms.id
Ref: form_submissions.userId > users.id
Ref: donations.campaignId > donation_campaigns.id
Ref: donations.donorId > users.id
Ref: contacts.userId > users.id
```

## 🔧 Update DBML

ทุกครั้งที่มีการเปลี่ยนแปลง database schema:

### สำหรับการแก้ไข Prisma Schema:
```bash
# เมื่อแก้ไข prisma/schema.prisma แล้ว
npm run generate-dbml
```

### สำหรับการ Pull จาก Database:
```bash
# 1. Pull schema จาก database
npx prisma db pull

# 2. Generate DBML ใหม่
npm run generate-dbml
```

## ⚙️ Configuration

ใน `prisma/schema.prisma` มี generator สำหรับ DBML:

```prisma
generator dbml {
  provider   = "prisma-dbml-generator"
  output     = "../"
  outputName = "database.dbml"
}
```

**Options:**
- `output`: โฟลเดอร์ที่จะสร้างไฟล์ (relative to prisma folder)
- `outputName`: ชื่อไฟล์ DBML ที่ต้องการ

## 📚 เอกสารเพิ่มเติม

- [DBML Documentation](https://dbml.dbdiagram.io/)
- [dbdiagram.io Guide](https://dbdiagram.io/docs)
- [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)

## 💡 Tips

1. **Export Diagram**: ใช้ dbdiagram.io export เป็น PNG สำหรับเอกสาร
2. **Version Control**: Commit ไฟล์ `.dbml` เพื่อติดตามการเปลี่ยนแปลง schema
3. **Documentation**: ใช้ diagram ในเอกสารโปรเจคหรือ README
4. **Team Collaboration**: แชร์ URL จาก dbdiagram.io กับทีม

---

Generated: October 19, 2025
