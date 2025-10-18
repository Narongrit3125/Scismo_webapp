# 📸 คู่มือระบบ Upload รูปภาพ - Vercel Blob Storage

## ⚠️ ทำไมรูปภาพหายหลังจาก Deploy?

### 🔴 ปัญหาเดิม:
Vercel เป็น **Serverless Platform** ซึ่งหมายความว่า:
- ไฟล์ที่ upload ไปยัง `public/uploads/` จะ**ถูกลบทิ้ง**ทุกครั้งที่มีการ deploy ใหม่
- ระบบไฟล์ไม่ถาวร (ephemeral filesystem)
- รูปภาพจะหายเมื่อออกจากระบบแล้วกลับเข้ามาใหม่

### ✅ วิธีแก้ไข:
ใช้ **Vercel Blob Storage** - Cloud Storage ที่เก็บไฟล์ถาวร

---

## 🎯 ระบบใหม่: Vercel Blob Storage

### ข้อดี:
- ✅ **ไฟล์ถาวร** - รูปไม่หายแม้ redeploy หลายครั้ง
- ✅ **CDN Global** - โหลดรูปเร็วทั่วโลก
- ✅ **Scalable** - รองรับไฟล์ได้เยอะมาก
- ✅ **ฟรี 500 GB bandwidth/เดือน**
- ✅ **ใช้งานง่าย** - API คล้าย file system

---

## 🔧 ขั้นตอนการตั้งค่า

### 1. สร้าง Blob Store บน Vercel:

1. เข้า https://vercel.com/dashboard
2. เลือกโปรเจกต์ **scismo-webapp-7zno**
3. ไปที่แท็บ **Storage**
4. คลิก **Create Database** → เลือก **Blob**
5. ตั้งชื่อ: `smo-images`
6. เลือก region ที่ใกล้ที่สุด
7. คลิก **Create**

### 2. Connect กับ Project:

Vercel จะเพิ่ม Environment Variable อัตโนมัติ:
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX
```

**เสร็จแล้ว!** ไม่ต้องตั้งค่าอะไรเพิ่ม

---

## 📡 วิธีใช้งาน API

### Upload รูปภาพ

**Endpoint:** `POST /api/upload/image`

**Parameters:**
- `file` - ไฟล์รูปภาพ (File object)
- `type` - ประเภท: `news`, `activities`, `gallery`

**ตัวอย่างโค้ด:**
```typescript
const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'news'); // หรือ 'activities', 'gallery'

  const response = await fetch('/api/upload/image', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('URL รูปภาพ:', data.url);
    // บันทึก data.url ลงฐานข้อมูล
  }
}
```

**Response (สำเร็จ):**
```json
{
  "success": true,
  "filePath": "https://xxxxx.public.blob.vercel-storage.com/news/image_1697xxx.jpg",
  "fileName": "news/image_1697xxx.jpg",
  "size": 123456,
  "type": "image/jpeg",
  "url": "https://xxxxx.public.blob.vercel-storage.com/news/image_1697xxx.jpg"
}
```

**Response (ผิดพลาด):**
```json
{
  "success": false,
  "error": "File size exceeds 5MB limit"
}
```

---

## 💾 บันทึกลงฐานข้อมูล

ใช้ `url` จาก response:

```typescript
// สร้างข่าวพร้อมรูป
await prisma.news.create({
  data: {
    title: "ข่าวใหม่",
    content: "เนื้อหาข่าว...",
    image: data.url, // <-- URL จาก Vercel Blob
    category: "academic",
    slug: "news-slug",
    authorId: userId,
  }
});

// สร้างกิจกรรมพร้อมรูป
await prisma.activity.create({
  data: {
    title: "กิจกรรมใหม่",
    description: "รายละเอียด...",
    image: data.url, // <-- URL จาก Vercel Blob
    startDate: new Date(),
    authorId: userId,
  }
});
```

---

## 🎨 แสดงรูปใน Frontend

```tsx
// HTML img tag
<img 
  src={news.image} 
  alt={news.title}
  className="w-full h-48 object-cover"
/>

// Next.js Image component (แนะนำ)
import Image from 'next/image'

<Image 
  src={news.image}
  alt={news.title}
  width={800}
  height={400}
  className="object-cover"
/>
```

---

## 📋 ข้อจำกัดและกฎ

### ประเภทไฟล์ที่รองรับ:
- ✅ `image/jpeg` (.jpg, .jpeg)
- ✅ `image/png` (.png)
- ✅ `image/gif` (.gif)
- ✅ `image/webp` (.webp)

### ขนาดไฟล์:
- **สูงสุด 5 MB** ต่อไฟล์

### การตั้งชื่อไฟล์:
- ลบอักขระพิเศษออกอัตโนมัติ
- เพิ่ม timestamp เพื่อป้องกันชื่อซ้ำ
- จัดเก็บในโฟลเดอร์ตามประเภท

---

## 💡 ตัวอย่างการใช้งานจริง

### Admin Form พร้อม Image Upload:

```typescript
'use client'

import { useState } from 'react'

export default function NewsForm() {
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState('')

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'news')

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (data.success) {
        setImageUrl(data.url)
        alert('✅ อัพโหลดสำเร็จ!')
      } else {
        alert('❌ เกิดข้อผิดพลาด: ' + data.error)
        setPreview('')
      }
    } catch (error) {
      alert('❌ ไม่สามารถอัพโหลดได้')
      setPreview('')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    
    const response = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.get('title'),
        content: formData.get('content'),
        image: imageUrl, // <-- Vercel Blob URL
        category: formData.get('category'),
      }),
    })

    if (response.ok) {
      alert('✅ บันทึกข่าวสำเร็จ!')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">หัวข้อข่าว</label>
        <input 
          type="text" 
          name="title"
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-2">รูปภาพปก</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploading}
          className="w-full border p-2 rounded"
        />
        
        {uploading && (
          <p className="text-blue-600 mt-2">⏳ กำลังอัพโหลด...</p>
        )}
        
        {preview && (
          <img 
            src={preview} 
            alt="Preview" 
            className="mt-4 w-full h-48 object-cover rounded"
          />
        )}
      </div>

      <div>
        <label className="block mb-2">เนื้อหา</label>
        <textarea 
          name="content"
          rows={5}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <button 
        type="submit"
        disabled={!imageUrl}
        className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
      >
        บันทึกข่าว
      </button>
    </form>
  )
}
```

---

## 📊 Storage Limits (Free Tier)

- ✅ **500 GB bandwidth** ต่อเดือน
- ✅ **Unlimited storage** พื้นที่ไม่จำกัด
- ✅ **ใช้งานได้ทันที** ไม่ต้องใส่บัตร

---

## 🔐 Security Features

- ✅ Validate ประเภทไฟล์
- ✅ Validate ขนาดไฟล์
- ✅ Sanitize ชื่อไฟล์
- ✅ Public CDN access
- ✅ HTTPS เท่านั้น

---

## 🚨 Troubleshooting

### รูปยังหายอยู่?
1. ✅ ตรวจสอบว่าสร้าง Blob Store แล้ว
2. ✅ ตรวจสอบ `BLOB_READ_WRITE_TOKEN` ใน Environment Variables
3. ✅ Redeploy โปรเจกต์หลังตั้งค่า Blob

### Upload ไม่สำเร็จ?
1. ✅ ตรวจสอบขนาดไฟล์ (ต้องไม่เกิน 5MB)
2. ✅ ตรวจสอบประเภทไฟล์ (ต้องเป็นรูปภาพ)
3. ✅ ดู Console สำหรับ error messages

### URL ใช้งานไม่ได้?
- URL ต้องเป็น `https://xxxxx.public.blob.vercel-storage.com/...`
- ตรวจสอบว่าบันทึก `data.url` ลงฐานข้อมูลถูกต้อง

---

## ✅ สรุป

| ระบบเดิม | ระบบใหม่ (Vercel Blob) |
|----------|------------------------|
| ❌ รูปหายเมื่อ redeploy | ✅ รูปถาวร |
| ❌ ไม่มี CDN | ✅ CDN Global |
| ❌ จำกัดพื้นที่ | ✅ Unlimited storage |
| ❌ โหลดช้า | ✅ โหลดเร็ว |

---

**สร้างเมื่อ:** October 19, 2025  
**Version:** 2.0.0  
**Status:** ✅ Production Ready
