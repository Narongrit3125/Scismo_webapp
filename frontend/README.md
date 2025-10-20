# 🎓 SMO WebNet - สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร

เว็บไซต์จัดการสโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร - ศูนย์กลางข่าวสาร กิจกรรม และโครงการต่างๆ

## ✨ Features

### 🌟 Public Features
- 📰 **ข่าวสารและประชาสัมพันธ์** - แสดงข่าวสารล่าสุดของสโมสรนิสิต
- 🎯 **กิจกรรม** - ติดตามกิจกรรมและโครงการต่างๆ
- 📊 **โครงการ** - ดูข้อมูลและความคืบหน้าของโครงการ
- 👥 **สมาชิก** - รายชื่อสมาชิกสโมสรนิสิต
- 👔 **คณะกรรมการ** - ข้อมูลคณะกรรมการบริหาร
- 📄 **เอกสาร** - ดาวน์โหลดเอกสารและข้อมูลต่างๆ
- 📖 **เกี่ยวกับเรา** - ประวัติและโครงสร้างองค์กร

### 🔐 Admin Features
- 📝 **จัดการข่าวสาร** - สร้าง แก้ไข ลบข่าวสาร
- 🎨 **จัดการกิจกรรม** - จัดการกิจกรรมและโครงการ
- 👤 **จัดการสมาชิก** - ระบบจัดการสมาชิก
- 🖼️ **แกลเลอรี่** - อัพโหลดและจัดการรูปภาพ
- 📋 **ฟอร์มออนไลน์** - สร้างและจัดการฟอร์มต่างๆ
- 💰 **ระบบบริจาค** - จัดการแคมเปญบริจาค
- 👥 **จัดการผู้ใช้งาน** - ระบบสิทธิ์การใช้งาน

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite/PostgreSQL (Prisma ORM)
- **Authentication**: NextAuth.js
- **State Management**: React Query
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Setup database
npx prisma generate
npx prisma migrate dev

# Run development server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## 🔑 Default Accounts (Development)

**Admin**: admin@smo.com / password123  
**Member**: member@smo.com / password123

## 📝 Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Lint code
```

## 🚀 Deployment

ดูรายละเอียดใน [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ by Naresuan Science Student Club**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📝 บทคัดย่อ

อ่านบทคัดย่อฉบับเต็มได้ที่ [`ABSTRACT.md`](./ABSTRACT.md)
