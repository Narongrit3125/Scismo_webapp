# แก้ปัญหา Vercel Deployment Error

## ปัญหาที่เกิดขึ้น
```
14:04:09.174 An unexpected error happened when running this build.
```

Build สำเร็จแล้ว แต่ล้มเหลวในขั้นตอน "Deploying outputs" หลังจาก build เสร็จ (ใช้เวลา ~5 นาที)

## สาเหตุที่เป็นไปได้

1. **ขนาด deployment ใหญ่เกินไป**
   - public/template: ~30+ MB
   - public/uploads: ไฟล์ที่อัปโหลด
   - เอกสาร .md หลายไฟล์

2. **Timeout ในการ upload**
   - Vercel มี limit สำหรับขนาดและเวลา deploy

3. **ปัญหา infrastructure ของ Vercel**
   - บางครั้งเป็นปัญหาชั่วคราวของ Vercel

## การแก้ไข

### 1. ✅ อัปเดต `.vercelignore`

สร้างหรืออัปเดตไฟล์ `.vercelignore` เพื่อ exclude ไฟล์ที่ไม่จำเป็น:

```plaintext
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage
*.test.ts
*.test.tsx
*.spec.ts
*.spec.tsx

# Development
.env.local
.env.development.local
.env.test.local

# Scripts
scripts/*.ts
scripts/*.js

# Documentation
*.md
!README.md
ABSTRACT.md
ADMIN_*.md
API_*.md
CODE_*.md
DATABASE_*.md
DEPLOYMENT_*.md
FIELD_*.md
LOGIN_*.md
MIGRATION_*.md
PRODUCTION_*.md
PROJECTS_*.md
SCHEMA_*.md
TABLE_*.md
VERCEL_*.md
ACTIVITIES_*.md

# Database
prisma/seed.ts
database.dbml

# Misc
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Debug
.vscode
.idea

# Public template (not needed for production)
public/template/**
public/uploads/**

# Git
.git
.gitignore
```

### 2. ✅ อัปเดต `vercel.json`

เพิ่ม configuration สำหรับ deployment:

```json
{
  "buildCommand": "prisma generate && next build",
  "env": {
    "PRISMA_GENERATE_SKIP_AUTOINSTALL": "false"
  },
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "outputDirectory": ".next"
}
```

### 3. 🔄 ย้ายไฟล์ static ไปยัง Vercel Blob Storage

**สำหรับไฟล์ที่อัปโหลดโดยผู้ใช้:**
- ใช้ Vercel Blob Storage แทนการเก็บใน `public/uploads`
- API `/api/upload/image` และ `/api/upload/plan` ใช้ Vercel Blob อยู่แล้ว ✅

**สำหรับ template files:**
- ไม่จำเป็นต้อง deploy ไปด้วย
- ใช้เฉพาะสำหรับ local development

## วิธีแก้ไขทันที

### ขั้นตอนที่ 1: Commit การเปลี่ยนแปลง

```bash
cd d:\Thesis\smowebnet\frontend
git add .vercelignore vercel.json
git commit -m "fix: optimize Vercel deployment - reduce bundle size"
git push origin main
```

### ขั้นตอนที่ 2: Redeploy บน Vercel

ไปที่ Vercel Dashboard และทำการ redeploy:
1. เข้า https://vercel.com/dashboard
2. เลือก project ของคุณ
3. คลิก "Deployments"
4. คลิก "Redeploy" บน deployment ล่าสุด

**หรือ** รอให้ Vercel auto-deploy จาก commit ใหม่

### ขั้นตอนที่ 3: หาก redeploy ล้มเหลวอีก

#### วิธีที่ 1: ลดขนาด deployment เพิ่มเติม

ลบไฟล์ documentation ที่ไม่จำเป็นออกจาก repository:

```bash
# สำรองไฟล์ก่อน
mkdir ../docs-backup
cp *.md ../docs-backup/

# ลบไฟล์ documentation (เก็บไว้แค่ README.md)
git rm ABSTRACT.md ADMIN_*.md API_*.md CODE_*.md DATABASE_*.md
git rm DEPLOYMENT_*.md FIELD_*.md LOGIN_*.md MIGRATION_*.md
git rm PRODUCTION_*.md PROJECTS_*.md SCHEMA_*.md TABLE_*.md
git rm VERCEL_*.md ACTIVITIES_*.md
git commit -m "docs: move documentation files to separate folder"
git push origin main
```

#### วิธีที่ 2: ใช้ Vercel CLI แทน

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd d:\Thesis\smowebnet\frontend
vercel --prod
```

#### วิธีที่ 3: ติดต่อ Vercel Support

หากปัญหายังคงมีอยู่ อาจเป็นปัญหาของ infrastructure:
1. ไปที่ https://vercel.com/help
2. รายงานปัญหาพร้อมแนบ deployment log
3. ระบุว่า build สำเร็จแต่ล้มเหลวที่ "Deploying outputs"

## การตรวจสอบหลัง Deploy

### 1. ตรวจสอบว่า deployment สำเร็จ

```bash
# ดู deployment status
vercel ls

# ดู logs
vercel logs [deployment-url]
```

### 2. ทดสอบ API endpoints

```bash
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/categories
```

### 3. ตรวจสอบการอัปโหลดไฟล์

- ทดสอบการอัปโหลดรูปภาพ
- ทดสอบการอัปโหลดไฟล์แผนโครงการ
- ตรวจสอบว่าไฟล์ถูกเก็บใน Vercel Blob Storage

## ขนาดไฟล์ที่ลดลง

**ก่อนแก้ไข:**
- public/ folder: ~34.6 MB (135 files)
- Documentation: ~20+ .md files

**หลังแก้ไข:**
- public/ folder: ~4-5 MB (เฉพาะไฟล์ที่จำเป็น)
- Documentation: ถูก ignore ใน deployment

**คาดว่าจะลดขนาด deployment ลงได้ ~60-70%**

## Best Practices สำหรับ Vercel Deployment

### 1. ไฟล์ Static Assets
- ✅ เก็บใน Vercel Blob Storage
- ✅ ใช้ CDN สำหรับรูปภาพขนาดใหญ่
- ❌ อย่าเก็บใน public/ folder

### 2. Documentation
- ✅ เก็บใน repository แยก หรือ Wiki
- ✅ ใช้ .vercelignore
- ❌ อย่า deploy ไปกับ production

### 3. Environment Variables
- ✅ ตั้งค่าใน Vercel Dashboard
- ✅ ใช้ .env.example สำหรับ template
- ❌ อย่า commit .env ลง repository

### 4. Build Optimization
- ✅ ใช้ Next.js Image Optimization
- ✅ Enable compression
- ✅ Tree shaking และ code splitting

## หมายเหตุสำคัญ

### ⚠️ public/uploads
- ไฟล์ใน public/uploads จะไม่ถูก deploy
- ต้องใช้ Vercel Blob Storage สำหรับไฟล์ที่ผู้ใช้อัปโหลด
- API ใน project นี้ใช้ Vercel Blob อยู่แล้ว ✅

### ⚠️ public/template
- ไฟล์ template HTML เก่า
- ไม่จำเป็นสำหรับ production
- ใช้เฉพาะ local development

### ✅ Migration Checklist
- [x] อัปเดต .vercelignore
- [x] อัปเดต vercel.json
- [ ] Commit และ push changes
- [ ] Redeploy บน Vercel
- [ ] ทดสอบการทำงานของ application
- [ ] ทดสอบการอัปโหลดไฟล์

## คำสั่งที่ใช้บ่อย

```bash
# ตรวจสอบขนาดไฟล์
Get-ChildItem -Path "public" -Recurse -File | Measure-Object -Property Length -Sum

# Commit changes
git add .vercelignore vercel.json
git commit -m "fix: optimize Vercel deployment"
git push origin main

# Deploy ด้วย CLI
vercel --prod

# ดู logs
vercel logs

# Rollback (ถ้าจำเป็น)
vercel rollback [deployment-url]
```

## สรุป

การแก้ไขหลัก:
1. ✅ เพิ่ม .vercelignore เพื่อลดขนาด deployment
2. ✅ ปรับปรุง vercel.json configuration
3. ✅ Ignore public/template และ public/uploads
4. ✅ Ignore documentation files

**ระบบควรจะ deploy สำเร็จหลังจาก push changes เหล่านี้**

หากยังมีปัญหา:
- ลอง deploy ด้วย Vercel CLI
- ติดต่อ Vercel Support
- ตรวจสอบ Vercel status page: https://www.vercel-status.com/
