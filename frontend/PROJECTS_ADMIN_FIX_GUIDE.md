# คู่มือแก้ไขหน้า Admin Projects

## สรุปการเปลี่ยนแปลง

### 1. Interface Project - เปลี่ยนชื่อฟิลด์
```typescript
// ❌ เก่า (ผิด)
interface Project {
  shortDescription?: string;
  year: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  totalBudget?: number;
  usedBudget: number;
  objectives?: string;
  targetGroup?: string;
  expectedResults?: string;
  sponsor?: string;
  coordinator?: string;
}

// ✅ ใหม่ (ถูก)
interface Project {
  academicYear: number;
  semester?: number;
  budget?: number;
  // ลบฟิลด์ที่เหลือทั้งหมดออก
}
```

### 2. Form Data - เปลี่ยนฟิลด์
```typescript
// ❌ เก่า
const [formData, setFormData] = useState({
  year: new Date().getFullYear(),
  priority: 'MEDIUM',
  totalBudget: 0,
  objectives: '',
  coordinator: ''
});

// ✅ ใหม่
const [formData, setFormData] = useState({
  academicYear: new Date().getFullYear(),
  semester: 1,
  budget: 0
});
```

### 3. การแสดงผลใน Card
```tsx
{/* ❌ เก่า (ผิด) */}
<span>ปีการศึกษา: {project.year}</span>
<span>ผู้ประสานงาน: {project.coordinator || 'ไม่ระบุ'}</span>
<span>งบประมาณ: ฿{project.totalBudget?.toLocaleString()}</span>

{/* ✅ ใหม่ (ถูก) */}
<span>ปีการศึกษา: {project.academicYear}</span>
<span>งบประมาณ: ฿{project.budget?.toLocaleString() || 'ไม่ระบุ'}</span>
{/* ลบบรรทัด coordinator ออก */}
```

### 4. Progress Bar (ลบทั้งหมด)
```tsx
{/* ❌ เก่า - ลบทั้งหมด */}
{project.status === 'IN_PROGRESS' && (
  <div className="mt-4">
    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
      <span>งบประมาณที่ใช้</span>
      <span>{project.totalBudget ? Math.round((project.usedBudget / project.totalBudget) * 100) : 0}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-purple-500 h-2 rounded-full"
        style={{ width: `${project.totalBudget ? Math.round((project.usedBudget / project.totalBudget) * 100) : 0}%` }}
      ></div>
    </div>
  </div>
)}

{/* ✅ ใหม่ - เอาออกทั้งหมด เพราะไม่มี usedBudget แล้ว */}
```

### 5. Form Input ในModal (Add/Edit)

#### ลบ Input เหล่านี้ทั้งหมด:
- shortDescription input
- priority select
- objectives textarea
- targetGroup input
- expectedResults textarea
- sponsor input
- coordinator input

#### เปลี่ยน Input เหล่านี้:

```tsx
{/* ❌ เก่า */}
<input
  type="number"
  value={formData.year}
  onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
/>

{/* ✅ ใหม่ */}
<input
  type="number"
  value={formData.academicYear}
  onChange={(e) => setFormData({...formData, academicYear: parseInt(e.target.value)})}
/>
```

```tsx
{/* ❌ เก่า */}
<input
  type="number"
  value={formData.totalBudget}
  onChange={(e) => setFormData({...formData, totalBudget: parseFloat(e.target.value) || 0})}
/>

{/* ✅ ใหม่ */}
<input
  type="number"
  value={formData.budget}
  onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value) || 0})}
/>
```

## วิธีการแก้ไขด้วย VS Code

### Step 1: ใช้ Find & Replace (Ctrl+H)

1. **เปลี่ยน year → academicYear**
   - Find: `formData.year`
   - Replace: `formData.academicYear`
   - Find: `project.year`
   - Replace: `project.academicYear`

2. **เปลี่ยน totalBudget → budget**
   - Find: `formData.totalBudget`
   - Replace: `formData.budget`
   - Find: `project.totalBudget`
   - Replace: `project.budget`

3. **ลบ coordinator**
   - ค้นหา `coordinator` แล้วลบทุกบรรทัดที่มี

4. **ลบ priority**
   - ค้นหา `priority` แล้วลบทุกบรรทัดที่มี (ยกเว้น status select)

5. **ลบ objectives, targetGroup, expectedResults, sponsor**
   - ค้นหาแล้วลบทั้งหมด

### Step 2: ลบ Progress Bar Section
ค้นหา `งบประมาณที่ใช้` แล้วลบทั้ง section (บรรทัด 487-507 โดยประมาณ)

### Step 3: ลบ Form Inputs ที่ไม่ใช้
ใน Edit Modal ลบ input fields เหล่านี้:
- Priority select (บรรทัด 777-790)
- Coordinator input (บรรทัด 667-673)
- Objectives, targetGroup, expectedResults (ถ้ามี)

### Step 4: ตรวจสอบ API Call
ใน `handleCreateProject`:
```typescript
// ✅ ถูกต้อง
body: JSON.stringify({
  title: formData.title,
  description: formData.description,
  year: formData.academicYear,  // ส่ง year แต่ใช้จาก academicYear
  totalBudget: formData.budget, // ส่ง totalBudget แต่ใช้จาก budget
  startDate: new Date().toISOString(),
})
```

## สรุป Error ที่ต้องแก้

จากไฟล์ `src/app/admin/projects/page.tsx` มี error ประมาณ 25 จุด:

1. ❌ `project.year` → ✅ `project.academicYear` (3 จุด)
2. ❌ `project.coordinator` → ✅ ลบออก (3 จุด)
3. ❌ `project.totalBudget` → ✅ `project.budget` (5 จุด)
4. ❌ `project.usedBudget` → ✅ ลบออก (4 จุด)
5. ❌ `formData.year` → ✅ `formData.academicYear` (4 จุด)
6. ❌ `formData.totalBudget` → ✅ `formData.budget` (3 จุด)
7. ❌ `formData.priority` → ✅ ลบออก (2 จุด)
8. ❌ `formData.coordinator` → ✅ ลบออก (2 จุด)

## ต้องการให้ผมช่วยแก้ไขโดยตรงไหมครับ?

ผมสามารถ:
1. ✅ แก้ไขทีละส่วนโดยใช้ replace_string_in_file (ช้ากว่า แต่แม่นยำ)
2. ✅ สร้างไฟล์ใหม่ทั้งหมดที่แก้แล้ว (เร็วกว่า)
3. ✅ แนะนำให้คุณแก้ด้วย Find & Replace ใน VS Code (เร็วที่สุด)

แนวทางไหนที่คุณต้องการครับ?
