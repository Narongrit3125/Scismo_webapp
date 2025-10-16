'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Edit, Trash2, Eye, Grid, List, Image as ImageIcon, Calendar, X } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  images: string[];
  date: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminGalleryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    images: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    if (status === 'authenticated') {
      fetchGalleries();
    }
  }, [status, router]);

  const fetchGalleries = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);
      
      const response = await fetch(`/api/gallery?${params}`);
      if (response.ok) {
        const data = await response.json();
        // รองรับทั้ง array โดยตรง หรือ object ที่มี property data/galleries
        const galleriesData = Array.isArray(data) ? data : (data.data || data.galleries || []);
        setGalleries(galleriesData);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
      setGalleries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchGalleries();
    }
  }, [searchTerm, categoryFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const images = formData.images.split(',').map(url => url.trim()).filter(url => url);
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: JSON.stringify(images)
        })
      });
      if (response.ok) {
        fetchGalleries();
        setShowAddModal(false);
        resetForm();
        alert('สร้างอัลบั้มสำเร็จ!');
      }
    } catch (error) {
      console.error('Error creating gallery:', error);
      alert('เกิดข้อผิดพลาด');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGallery) return;
    try {
      const images = formData.images.split(',').map(url => url.trim()).filter(url => url);
      const response = await fetch(`/api/gallery?id=${selectedGallery.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: JSON.stringify(images)
        })
      });
      if (response.ok) {
        fetchGalleries();
        setShowEditModal(false);
        setSelectedGallery(null);
        resetForm();
        alert('แก้ไขอัลบั้มสำเร็จ!');
      }
    } catch (error) {
      console.error('Error updating gallery:', error);
      alert('เกิดข้อผิดพลาด');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบอัลบั้มนี้?')) return;
    try {
      const response = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchGalleries();
        alert('ลบอัลบั้มสำเร็จ!');
      }
    } catch (error) {
      console.error('Error deleting gallery:', error);
      alert('เกิดข้อผิดพลาด');
    }
  };

  const handleEdit = (gallery: GalleryItem) => {
    setSelectedGallery(gallery);
    setFormData({
      title: gallery.title,
      description: gallery.description || '',
      category: gallery.category,
      images: gallery.images.join(', '),
      date: new Date(gallery.date).toISOString().split('T')[0]
    });
    setShowEditModal(true);
  };

  const handleView = (gallery: GalleryItem) => {
    setSelectedGallery(gallery);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      images: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const categories = Array.isArray(galleries) ? [...new Set(galleries.map(g => g.category))] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">จัดการอัลบั้มภาพ</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} />
          เพิ่มอัลบั้มใหม่
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="ค้นหาอัลบั้ม..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
            <option value="">ทุกหมวดหมู่</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}><Grid size={20} /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}><List size={20} /></button>
        </div>
      </div>

      {galleries.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">ไม่พบอัลบั้มภาพ</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200">
                {gallery.images.length > 0 ? (
                  <img src={gallery.images[0]} alt={gallery.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={64} className="text-gray-400" /></div>
                )}
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">{gallery.images.length} รูป</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{gallery.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{gallery.description || 'ไม่มีคำอธิบาย'}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar size={16} />
                  {new Date(gallery.date).toLocaleDateString('th-TH')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Eye size={16} />
                  {gallery.viewCount} ครั้ง
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleView(gallery)} className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2">
                    <Eye size={16} />ดู
                  </button>
                  <button onClick={() => handleEdit(gallery)} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Edit size={16} />แก้ไข
                  </button>
                  <button onClick={() => handleDelete(gallery.id)} className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">อัลบั้ม</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">หมวดหมู่</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จำนวนรูป</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ยอดดู</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {galleries.map((gallery) => (
                <tr key={gallery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 mr-3">
                        {gallery.images.length > 0 ? (
                          <img src={gallery.images[0]} alt={gallery.title} className="h-10 w-10 rounded object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center"><ImageIcon size={20} className="text-gray-400" /></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{gallery.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{gallery.description || 'ไม่มีคำอธิบาย'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{gallery.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{gallery.images.length} รูป</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(gallery.date).toLocaleDateString('th-TH')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{gallery.viewCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleView(gallery)} className="text-purple-600 hover:text-green-900"><Eye size={18} /></button>
                      <button onClick={() => handleEdit(gallery)} className="text-blue-600 hover:text-blue-900"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(gallery.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{showEditModal ? 'แก้ไขอัลบั้ม' : 'เพิ่มอัลบั้มใหม่'}</h2>
                <button onClick={() => { showEditModal ? setShowEditModal(false) : setShowAddModal(false); setSelectedGallery(null); resetForm(); }} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={showEditModal ? handleUpdate : handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชื่ออัลบั้ม *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่ *</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="เช่น กิจกรรม, โครงการ, งานแข่งขัน" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL รูปภาพ (คั่นด้วยเครื่องหมายจุลภาค) *</label>
                  <textarea value={formData.images} onChange={(e) => setFormData({ ...formData, images: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" />
                  <p className="text-sm text-gray-500 mt-1">ใส่ URL รูปภาพคั่นด้วยเครื่องหมายจุลภาค (,)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">วันที่ *</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" style={{ colorScheme: 'light' }} required />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => { showEditModal ? setShowEditModal(false) : setShowAddModal(false); setSelectedGallery(null); resetForm(); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    ยกเลิก
                  </button>
                  <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    {showEditModal ? 'บันทึกการแก้ไข' : 'เพิ่มอัลบั้ม'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedGallery && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedGallery.title}</h2>
                <button onClick={() => { setShowViewModal(false); setSelectedGallery(null); }} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{selectedGallery.category}</span>
                </div>
                {selectedGallery.description && <p className="text-gray-700">{selectedGallery.description}</p>}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2"><Calendar size={16} />{new Date(selectedGallery.date).toLocaleDateString('th-TH')}</div>
                  <div className="flex items-center gap-2"><Eye size={16} />{selectedGallery.viewCount} ครั้ง</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {selectedGallery.images.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img src={image} alt={`${selectedGallery.title} - ${index + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}