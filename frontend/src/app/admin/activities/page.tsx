'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Filter,
  Tag,
  Upload,
  X
} from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  authorId: string;
  projectId?: string;
  categoryId: string;
  type: 'WORKSHOP' | 'SEMINAR' | 'COMPETITION' | 'VOLUNTEER' | 'SOCIAL' | 'TRAINING' | 'MEETING' | 'CEREMONY' | 'FUNDRAISING' | 'EXHIBITION';
  startDate: string;
  endDate?: string;
  location?: string;
  status: 'PLANNING' | 'OPEN_REGISTRATION' | 'FULL' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  isPublic: boolean;
  gallery?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
  project?: {
    id: string;
    code: string;
    title: string;
    year: number;
  };
}

export default function AdminActivities() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<{id: string; code: string; title: string; year: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    type: 'WORKSHOP' as 'WORKSHOP' | 'SEMINAR' | 'COMPETITION' | 'VOLUNTEER' | 'SOCIAL' | 'TRAINING' | 'MEETING' | 'CEREMONY' | 'FUNDRAISING' | 'EXHIBITION',
    location: '',
    startDate: '',
    endDate: '',
    image: '',
    isPublic: true,
    projectId: ''
  });

  const activityTypes = [
    { value: 'WORKSHOP', label: 'เวิร์คช็อป' },
    { value: 'SEMINAR', label: 'สัมมนา' },
    { value: 'COMPETITION', label: 'การแข่งขัน' },
    { value: 'VOLUNTEER', label: 'อาสาสมัคร' },
    { value: 'SOCIAL', label: 'สังสรรค์' },
    { value: 'TRAINING', label: 'ฝึกอบรม' },
    { value: 'MEETING', label: 'ประชุม' },
    { value: 'CEREMONY', label: 'พิธีการ' },
    { value: 'FUNDRAISING', label: 'ระดมทุน' },
    { value: 'EXHIBITION', label: 'นิทรรศการ' }
  ];

  const [categories, setCategories] = useState<{value: string; label: string}[]>([]);

  const fetchCategoryList = async () => {
    try {
      const res = await fetch('/api/categories');
      const json = await res.json();
      if (json.success) {
        setCategories(json.data.map((c: any) => ({ value: c.id, label: c.name })));
      }
    } catch (err) {
      console.error('Error fetching category list:', err);
    }
  };

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

    fetchActivities();
    fetchProjects();
    fetchCategoryList();
  }, [session, status, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const result = await response.json();
      
      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/activities');
      const result = await response.json();
      console.debug('fetchActivities result:', result);
      
      if (result.success) {
        // Defensive mapping: ensure required fields exist and types are strings
        const safe = result.data.map((a: any) => ({
          id: a.id,
          title: a.title || '(no title)',
          description: a.description || '',
          categoryId: a.categoryId || 'default',
          type: a.type || 'WORKSHOP',
          startDate: a.startDate || new Date().toISOString(),
          endDate: a.endDate || null,
          location: a.location || '',
          status: a.status || 'PLANNING',
          isPublic: !!a.isPublic,
          createdAt: a.createdAt || new Date().toISOString(),
          updatedAt: a.updatedAt || new Date().toISOString(),
          image: a.image || '',
          gallery: a.gallery || null,
          authorId: a.authorId || '',
          author: a.author || { firstName: '', lastName: '', email: '' },
          project: a.project || null
        }));
        setActivities(safe);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
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
    formData.append('type', 'activities');
    
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

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ตรวจสอบฟิลด์ที่จำเป็น
    if (!formData.title) {
      alert('กรุณากรอกชื่อกิจกรรม');
      return;
    }
    if (!formData.description) {
      alert('กรุณากรอกรายละเอียดกิจกรรม');
      return;
    }
    if (!formData.categoryId || formData.categoryId.trim() === '') {
      alert('กรุณาเลือกหมวดหมู่');
      return;
    }
    if (!formData.type) {
      alert('กรุณาเลือกประเภท');
      return;
    }
    if (!formData.startDate) {
      alert('กรุณาเลือกวันที่เริ่มต้น');
      return;
    }
    if (!session?.user?.id) {
      alert('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
      return;
    }
    
    try {
      // Upload image if user selected a file
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const activityData = {
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        location: formData.location || null,
        image: imageUrl || null,
        isPublic: formData.isPublic,
        projectId: formData.projectId || null,
        authorEmail: session.user.email
      };

      console.log('Session user:', session.user);
      console.log('Sending activity data:', activityData);
      
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      });

      const result = await response.json();

      if (result.success) {
        await fetchActivities();
        setShowCreateForm(false);
        resetForm();
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      alert('เกิดข้อผิดพลาดในการสร้างกิจกรรม');
    }
  };

  const handleUpdateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingActivity) return;

    try {
      // Upload new image if user selected a file
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      if (!formData.categoryId || formData.categoryId.trim() === '') {
        alert('กรุณาเลือกหมวดหมู่');
        return;
      }
      const response = await fetch(`/api/activities?id=${editingActivity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId,
          image: imageUrl
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchActivities();
        setEditingActivity(null);
        resetForm();
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดทกิจกรรม');
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบกิจกรรมนี้?')) return;

    try {
      const response = await fetch(`/api/activities?id=${activityId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchActivities();
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('เกิดข้อผิดพลาดในการลบกิจกรรม');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      categoryId: '',
      type: 'WORKSHOP' as const,
      location: '',
      startDate: '',
      endDate: '',
      image: '',
      isPublic: true,
      projectId: ''
    });
    setImageFile(null);
    setImagePreview('');
  };

  const startEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      categoryId: activity.categoryId,
      type: activity.type,
      location: activity.location || '',
      startDate: activity.startDate.slice(0, 16), // Format for datetime-local input
      endDate: activity.endDate?.slice(0, 16) || '',
      image: activity.image || '',
      isPublic: activity.isPublic,
      projectId: activity.projectId || ''
    });
    setImageFile(null);
    setImagePreview(activity.image || '');
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || activity.categoryId === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' ||
                         (statusFilter === 'COMPLETED' && activity.status === 'COMPLETED') ||
                         (statusFilter === 'IN_PROGRESS' && activity.status === 'IN_PROGRESS');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getActivityStatus = (activity: Activity) => {
    const now = new Date();
    const startDate = new Date(activity.startDate);
    const endDate = activity.endDate ? new Date(activity.endDate) : startDate;
    
    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'ongoing';
    return 'ended';
  };

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
      <div className="bg-gradient-to-r from-purple-500 via-blue-600 to-indigo-600 text-white shadow-2xl">
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
                <Calendar size={36} className="text-purple-200 drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-4xl font-bold drop-shadow-md">จัดการกิจกรรม</h1>
                <p className="opacity-90 text-lg drop-shadow-sm">กิจกรรมทั้งหมด {filteredActivities.length} กิจกรรม</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-3"
            >
              <Plus size={24} />
              <span>เพิ่มกิจกรรมใหม่</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="ค้นหากิจกรรม..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={() => {/* ฟังก์ชันค้นหา */}}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>ค้นหา</span>
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="ALL">สถานะทั้งหมด</option>
                <option value="ACTIVE">เปิดใช้งาน</option>
                <option value="INACTIVE">ปิดใช้งาน</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => {
            const status = getActivityStatus(activity);
            return (
              <div key={activity.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                {activity.image ? (
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center text-gray-400">ไม่มีรูปภาพ</div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      status === 'ongoing' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {status === 'upcoming' ? 'กำลังจะมาถึง' :
                       status === 'ongoing' ? 'กำลังดำเนินการ' : 'สิ้นสุดแล้ว'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {categories.find(cat => cat.value === activity.categoryId)?.label}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {activity.title}
                  </h3>
                  
                  {activity.project && (
                    <div className="flex items-center mb-2">
                      <span className="text-xs bg-orange-100 text-purple-700 px-2 py-1 rounded-md font-mono mr-2">
                        {activity.project.code}
                      </span>
                      <span className="text-xs text-gray-500">
                        {activity.project.title}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {activity.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {activity.location || 'ไม่ระบุสถานที่'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {activity.startDate ? new Date(activity.startDate).toLocaleDateString('th-TH') : 'ไม่ระบุวันที่'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        activity.status === 'COMPLETED' || activity.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {activity.status === 'COMPLETED' ? 'เสร็จสิ้น' : 
                         activity.status === 'CANCELLED' ? 'ยกเลิก' : 
                         activity.status === 'IN_PROGRESS' ? 'กำลังดำเนินการ' : 
                         activity.status === 'OPEN_REGISTRATION' ? 'เปิดรับสมัคร' : 'วางแผน'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(activity)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบกิจกรรม</h3>
            <p className="text-gray-500">ยังไม่มีกิจกรรมในระบบ หรือลองเปลี่ยนเงื่อนไขการค้นหา</p>
          </div>
        )}
      </div>

      {/* Create/Edit Activity Modal */}
      {(showCreateForm || editingActivity) && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingActivity ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรมใหม่'}
            </h3>
            
            <form onSubmit={editingActivity ? handleUpdateActivity : handleCreateActivity}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อกิจกรรม
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รายละเอียด
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  โครงการ
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">เลือกโครงการ (ไม่บังคับ)</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.code} - {project.title} (ปี {project.year})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    หมวดหมู่ <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ประเภทกิจกรรม
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {activityTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สถานที่
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    วันเวลาเริ่ม
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    วันเวลาสิ้นสุด
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รูปภาพกิจกรรม
                </label>
                
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="activity-image-upload"
                  />
                  <label
                    htmlFor="activity-image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {imagePreview ? (
                      <div className="relative w-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setImageFile(null);
                            setImagePreview('');
                            setFormData({...formData, image: ''});
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">คลิกเพื่ออัปโหลดรูปภาพ</span>
                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Or enter URL */}
                <div className="mt-2">
                  <span className="text-xs text-gray-500">หรือใส่ URL รูปภาพ:</span>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({...formData, image: e.target.value});
                      if (e.target.value) {
                        setImagePreview(e.target.value);
                      }
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingActivity(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {editingActivity ? 'อัพเดท' : 'สร้าง'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
