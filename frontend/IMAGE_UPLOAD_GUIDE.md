# 📸 คู่มือการ Upload รูปภาพ

## API Endpoint
`POST /api/upload/image`

## วิธีใช้งาน

### 1. การ Upload รูปจาก Form

```typescript
const handleImageUpload = async (file: File, type: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type); // 'news', 'activity', 'gallery', 'general'

  const response = await fetch('/api/upload/image', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  if (result.success) {
    return result.filePath; // /uploads/news/image_1234567890.jpg
  }
  throw new Error(result.error);
};
```

### 2. ตัวอย่างการใช้งานในหน้า Admin

```tsx
// ในหน้า admin/news/page.tsx
const [image, setImage] = useState('');
const [uploading, setUploading] = useState(false);

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  try {
    const imagePath = await handleImageUpload(file, 'news');
    setImage(imagePath); // บันทึก path ลงใน state
    alert('อัพโหลดรูปสำเร็จ!');
  } catch (error) {
    alert('อัพโหลดรูปล้มเหลว');
  } finally {
    setUploading(false);
  }
};

// ส่งไปกับ API
const createNews = async () => {
  await fetch('/api/news', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      content,
      image: image, // ส่ง path ที่ได้จาก upload
      ...
    })
  });
};
```

## ประเภทไฟล์ที่รองรับ
- ✅ JPG/JPEG
- ✅ PNG
- ✅ GIF
- ✅ WebP

## ขนาดไฟล์สูงสุด
- **5 MB** ต่อไฟล์

## โฟลเดอร์จัดเก็บ
- `public/uploads/news/` - รูปข่าว
- `public/uploads/activity/` - รูปกิจกรรม
- `public/uploads/gallery/` - รูปแกลเลอรี่
- `public/uploads/general/` - รูปทั่วไป

## Response Format

### สำเร็จ (200)
```json
{
  "success": true,
  "filePath": "/uploads/news/article_1234567890.jpg",
  "fileName": "article.jpg",
  "size": 245678,
  "type": "image/jpeg",
  "url": "/uploads/news/article_1234567890.jpg"
}
```

### ล้มเหลว (400/500)
```json
{
  "success": false,
  "error": "Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed.",
  "details": "..."
}
```

## Tips
1. ✅ **Upload รูปก่อน** แล้วค่อยสร้างข่าว/กิจกรรม
2. ✅ **เก็บ path ที่ได้** ไว้ใช้ต่อ
3. ✅ **ตรวจสอบ success** ก่อนดำเนินการต่อ
4. ✅ **แสดง loading state** ขณะ upload

## ตัวอย่าง Component

```tsx
<div>
  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    disabled={uploading}
  />
  {uploading && <span>กำลังอัพโหลด...</span>}
  {image && (
    <img 
      src={image} 
      alt="Preview" 
      className="w-32 h-32 object-cover rounded"
    />
  )}
</div>
```
