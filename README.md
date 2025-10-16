# เว็บแอปพลิเคชันเพื่อสนับสนุนงานสโมสรนิสิตคณะวิทยาศาสตร์ 🚀

เว็บไซต์ชมรม SMO (Science, Mathematics, and Organization) ที่พัฒนาด้วย **Next.js 15** full-stack framework

## 🌟 ภาพรวมโปรเจค

เว็บแอปพลิเคชันเพื่อสนับสนุนงานสโมสรนิสิตคณะวิทยาศาสตร์

### ✨ ฟีเจอร์หลัก

- 🏠 **หน้าแรก** - แสดงข้อมูลภาพรวมและข่าวสารล่าสุด
- 👥 **จัดการสมาชิก** - ระบบสมาชิกและตำแหน่งหน้าที่
- 📅 **กิจกรรม** - ปฏิทินและรายละเอียดกิจกรรม
- 📰 **ข่าวสาร** - ข่าวประชาสัมพันธ์และอัพเดต
- 🎯 **โครงการ** - แสดงผลงานและโครงการต่างๆ
- 👨‍💼 **เจ้าหน้าที่** - ข้อมูลเจ้าหน้าที่และผู้ดูแล
- 📚 **เอกสาร** - คลังเอกสารและแบบฟอร์ม
- 🖼️ **แกลเลอรี่** - รูปภาพกิจกรรมและอีเวนต์
- 💰 **การบริจาค** - ระบบรับบริจาคและแสดงผลการบริจาค
- 📞 **ติดต่อ** - ข้อมูลติดต่อและแบบฟอร์มส่งข้อความ

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and state management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Mock Data** - In-memory data for development (พร้อมอัพเกรดเป็น Database)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler

## 🚀 การติดตั้งและรันโปรเจค

### ข้อกำหนดระบบ
- Node.js 18+ 
- npm หรือ yarn

### 1. Clone โปรเจค
\`\`\`bash
git clone [repository-url]
cd smowebnet
\`\`\`

### 2. ติดตั้ง Dependencies
\`\`\`bash
cd frontend
npm install
\`\`\`

### 3. รันโปรเจค
\`\`\`bash
npm run dev
\`\`\`

เว็บไซต์จะเปิดที่ **http://localhost:3000**

## 📁 โครงสร้างโปรเจค

\`\`\`
frontend/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── page.tsx           # หน้าแรก
│   │   ├── about/             # เกี่ยวกับเรา
│   │   ├── activities/        # กิจกรรม
│   │   ├── members/           # สมาชิก
│   │   ├── news/              # ข่าวสาร
│   │   ├── projects/          # โครงการ
│   │   ├── staff/             # เจ้าหน้าที่
│   │   ├── documents/         # เอกสาร
│   │   └── api/               # API Routes
│   │       ├── users/
│   │       ├── content/
│   │       ├── news/
│   │       ├── activities/
│   │       ├── members/
│   │       ├── positions/
│   │       ├── staff/
│   │       ├── forms/
│   │       ├── gallery/
│   │       ├── donations/
│   │       ├── contacts/
│   │       ├── documents/
│   │       └── projects/
│   ├── components/            # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Card.tsx
│   │   └── Loading.tsx
│   ├── lib/                   # Utilities
│   │   ├── api.ts            # API client
│   │   └── query-provider.tsx
│   └── types/                 # TypeScript types
│       └── index.ts
├── public/                    # Static files
├── package.json
└── README.md
\`\`\`

## 🔗 API Endpoints

### หลักการ API
- **Base URL**: \`/api\`
- **Response Format**: \`{success: boolean, data: any, total?: number}\`
- **HTTP Methods**: GET, POST, PATCH

### รายการ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| \`/api/users\` | GET, POST | จัดการผู้ใช้งาน |
| \`/api/content\` | GET, POST | เนื้อหาทั่วไป |
| \`/api/news\` | GET, POST | ข่าวสารและประกาศ |
| \`/api/activities\` | GET, POST | กิจกรรมและอีเวนต์ |
| \`/api/members\` | GET, POST | ข้อมูลสมาชิก |
| \`/api/positions\` | GET, POST | ตำแหน่งและหน้าที่ |
| \`/api/staff\` | GET, POST | ข้อมูลเจ้าหน้าที่ |
| \`/api/forms\` | GET, POST | แบบฟอร์มต่างๆ |
| \`/api/gallery\` | GET, POST | แกลเลอรี่รูปภาพ |
| \`/api/donations\` | GET, POST | การบริจาคและทุน |
| \`/api/contacts\` | GET, POST, PATCH | ข้อมูลติดต่อ |
| \`/api/documents\` | GET, POST, PATCH | เอกสารและไฟล์ |
| \`/api/projects\` | GET, POST, PATCH | โครงการต่างๆ |

### ตัวอย่างการใช้งาน API

\`\`\`javascript
// ดึงข้อมูลข่าวสาร
fetch('/api/news')
  .then(res => res.json())
  .then(data => console.log(data.data));

// ดึงกิจกรรมตามประเภท
fetch('/api/activities?category=workshop')
  .then(res => res.json())
  .then(data => console.log(data.data));

// ส่งข้อความติดต่อ
fetch('/api/contacts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'ชื่อผู้ส่ง',
    email: 'email@example.com',
    subject: 'หัวข้อ',
    message: 'ข้อความ'
  })
});
\`\`\`

## 🎨 การปรับแต่ง UI/UX

### Tailwind CSS Classes ที่ใช้
- **Colors**: \`bg-blue-600\`, \`text-gray-800\`
- **Layout**: \`flex\`, \`grid\`, \`container\`, \`mx-auto\`
- **Responsive**: \`sm:\`, \`md:\`, \`lg:\`, \`xl:\`
- **Typography**: \`text-lg\`, \`font-semibold\`, \`leading-relaxed\`

### การแก้ไข Navbar
Navbar อยู่ที่ \`src/components/Header.tsx\` และใช้ dropdown menus สำหรับ:
- เกี่ยวกับเรา (ประวัติ, โครงสร้างองค์กร)
- กิจกรรม
- สมาชิก
- โครงการ

## 📦 การ Deploy

### Vercel (แนะนำ)
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Netlify
\`\`\`bash
npm run build
# Upload dist folder to Netlify
\`\`\`

### Docker
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 🔄 การอัพเกรดเป็น Database

ปัจจุบันใช้ Mock Data ในหน่วยความจำ สำหรับ Production แนะนำให้อัพเกรดเป็น:

### ตัวเลือก Database
1. **Prisma + PostgreSQL**
2. **MongoDB + Mongoose**  
3. **Supabase**
4. **PlanetScale**

### ขั้นตอนการอัพเกรด
1. เลือก Database provider
2. ติดตั้ง ORM (Prisma/Mongoose)
3. สร้าง Schema/Models
4. Migration data จาก Mock Data
5. อัพเดต API Routes ให้เชื่อมต่อ Database

## 🤝 การร่วมพัฒนา

1. Fork โปรเจค
2. สร้าง feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit การเปลี่ยนแปลง (\`git commit -m 'Add amazing feature'\`)
4. Push ไปยัง branch (\`git push origin feature/amazing-feature\`)
5. เปิด Pull Request

## 📝 License

โปรเจคนี้ใช้ MIT License - ดูรายละเอียดใน [LICENSE](LICENSE) file

## 📞 ติดต่อ

- **SMO Club**: smo.club@sut.ac.th
- **Website**: http://localhost:3000
- **Facebook**: @smo.sut

## 🎯 Roadmap

- [ ] เชื่อมต่อ Database จริง
- [ ] ระบบ Authentication
- [ ] Dashboard สำหรับ Admin
- [ ] ระบบ Upload ไฟล์
- [ ] PWA Support
- [ ] Dark Mode
- [ ] Multi-language Support

---

พัฒนาด้วย ❤️ โดยทีม SMO Club
