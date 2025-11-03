'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Newspaper, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  Filter,
  Calendar,
  User,
  Tag
} from 'lucide-react';

interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  image: string;
  status: string;
  priority: string;
  slug: string;
  viewCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AdminNews() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categoryId: 'default',
    image: '',
    status: 'DRAFT',
    priority: 'MEDIUM',
    slug: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Function to generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim() + '-' + Date.now(); // Add timestamp to ensure uniqueness
  };

  const categories = [
    { value: 'general', label: 'ทั่วไป' },
    { value: 'academic', label: 'วิชาการ' },
    { value: 'activity', label: 'กิจกรรม' },
    { value: 'achievement', label: 'ความสำเร็จ' },
    { value: 'announcement', label: 'ประกาศ' }
  ];

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchNews();
  }, [session, status, router]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news');
      const result = await response.json();
      
      if (result.success) {
        setNews(result.data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!session?.user?.id) {
        alert('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
        return;
      }
      
      let imageUrl = formData.image;
      
      // If user uploaded an image, upload it first
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Generate unique slug from title
      const slug = generateSlug(formData.title);
      
      const newsData = {
        ...formData,
        image: imageUrl,
        slug: slug,
        authorId: session.user.id
      };

      console.log('Session user:', session.user);
      console.log('Session full object:', session);
      console.log('Sending news data:', newsData);
      
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData),
      });

      const result = await response.json();
      console.log('API response:', result);
      console.log('Response status:', response.status);

      if (result.success) {
        await fetchNews();
        setShowCreateForm(false);
        resetForm();
      } else {
        console.error('API error:', result.error);
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating news:', error);
      alert('เกิดข้อผิดพลาดในการสร้างข่าว');
    }
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingNews) return;

    try {
      let imageUrl = formData.image;
      
      // If user uploaded a new image, upload it first
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Generate new slug if title has changed
      let updatedSlug = formData.slug;
      if (editingNews.title !== formData.title) {
        updatedSlug = generateSlug(formData.title);
      }
      
      const response = await fetch(`/api/news?id=${editingNews.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
          slug: updatedSlug
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchNews();
        setEditingNews(null);
        resetForm();
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating news:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดทข่าว');
    }
  };

  const handleDeleteNews = async (newsId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข่าวนี้?')) return;

    try {
      const response = await fetch(`/api/news?id=${newsId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchNews();
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('เกิดข้อผิดพลาดในการลบข่าว');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      categoryId: 'default',
      image: '',
      status: 'DRAFT',
      priority: 'MEDIUM',
      slug: ''
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'news');
    
    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.url; // Returns Vercel Blob Storage CDN URL
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const startEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      excerpt: newsItem.excerpt,
      content: newsItem.content,
      categoryId: newsItem.categoryId,
      image: newsItem.image,
      status: newsItem.status,
      priority: newsItem.priority,
      slug: newsItem.slug
    });
    setImageFile(null);
    setImagePreview(newsItem.image);
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.categoryId === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'PUBLISHED' && item.status === 'PUBLISHED') ||
                         (statusFilter === 'DRAFT' && item.status === 'DRAFT');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 via-red-600 to-rose-500 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-10">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => router.push('/admin')}
                className="bg-white bg-opacity-25 p-3 rounded-xl hover:bg-opacity-35 transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm"
              >
                <ArrowLeft className="w-6 h-6 text-white drop-shadow-sm" />
              </button>
              <div className="bg-white bg-opacity-25 p-4 rounded-xl shadow-lg backdrop-blur-sm">
                <Newspaper size={36} className="text-red-300 drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-4xl font-bold drop-shadow-md">จัดการข่าวสาร</h1>
                <p className="opacity-90 text-lg drop-shadow-sm">ข่าวทั้งหมด {filteredNews.length} ข่าว</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-50 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-3"
            >
              <Plus size={24} />
              <span>เพิ่มข่าวใหม่</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ค้นหาข่าว..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border-2 border-gray-400 rounded-lg px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="ALL">หมวดหมู่ทั้งหมด</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border-2 border-gray-400 rounded-lg px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="ALL">สถานะทั้งหมด</option>
                <option value="PUBLISHED">เผยแพร่แล้ว</option>
                <option value="DRAFT">ฉบับร่าง</option>
              </select>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredNews.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status === 'PUBLISHED' ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {categories.find(cat => cat.value === item.categoryId)?.label}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {item.author.firstName} {item.author.lastName}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(item.createdAt).toLocaleDateString('th-TH')}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="text-sm">{item.viewCount} ครั้ง</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNews(item.id)}
                      className="text-red-600 hover:text-red-900 p-2 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบข่าว</h3>
            <p className="text-gray-500">ยังไม่มีข่าวในระบบ หรือลองเปลี่ยนเงื่อนไขการค้นหา</p>
          </div>
        )}
      </div>

      {/* Create/Edit News Modal */}
      {(showCreateForm || editingNews) && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl px-8 py-6">
              <h3 className="text-2xl font-bold text-white">
                {editingNews ? 'แก้ไขข่าว' : 'เพิ่มข่าวใหม่'}
              </h3>
              <p className="text-purple-100 text-sm mt-1">
                {editingNews ? 'อัปเดตข้อมูลข่าวสาร' : 'สร้างข่าวสารใหม่สำหรับแสดงในเว็บไซต์'}
              </p>
            </div>
            
            <form onSubmit={editingNews ? handleUpdateNews : handleCreateNews} className="flex flex-col flex-1 min-h-0">
              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Basic Information Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-gray-900">ข้อมูลพื้นฐาน</h4>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        หัวข้อข่าว <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="ระบุหัวข้อข่าว"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        สรุปข่าว <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        placeholder="สรุปเนื้อหาข่าวโดยย่อ"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        เนื้อหา <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={8}
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        placeholder="เนื้อหาข่าวโดยละเอียด"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        หมวดหมู่
                      </label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Image Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-gray-900">รูปภาพประกอบ</h4>
                  </div>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                      />
                    </div>
                  )}
                  
                  {/* File Upload Area */}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-purple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-600">
                          <span className="font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG หรือ GIF (สูงสุด 10MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  
                  {/* URL Input */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      หรือใส่ URL รูปภาพ
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData({...formData, image: e.target.value});
                        if (e.target.value) {
                          setImagePreview(e.target.value);
                          setImageFile(null);
                        }
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Publishing Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-gray-900">การเผยแพร่</h4>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
                    <label className="flex items-center cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.status === 'PUBLISHED'}
                          onChange={(e) => setFormData({...formData, status: e.target.checked ? 'PUBLISHED' : 'DRAFT'})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </div>
                      <div className="ms-3">
                        <span className="text-sm font-semibold text-gray-900">เผยแพร่ทันที</span>
                        <p className="text-xs text-gray-600 mt-1">
                          {formData.status === 'PUBLISHED' ? 'ข่าวจะแสดงในเว็บไซต์ทันที' : 'บันทึกเป็นแบบร่างก่อน'}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 px-8 py-6 rounded-b-2xl border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingNews(null);
                    resetForm();
                  }}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all shadow-lg"
                >
                  {editingNews ? 'อัปเดตข่าว' : 'สร้างข่าว'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
