'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Search, Eye, FileText } from 'lucide-react';

interface Form {
  id: string;
  title: string;
  description: string | null;
  type: 'MEMBERSHIP_APPLICATION' | 'EVENT_REGISTRATION' | 'FEEDBACK' | 'CONTACT' | 'SURVEY' | 'OTHER';
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  fields: string; // JSON string
  settings: string | null; // JSON string
  createdAt: string;
  updatedAt: string;
  _count?: {
    submissions: number;
  };
}

const FORM_TYPES = [
  { value: 'MEMBERSHIP_APPLICATION', label: 'ใบสมัครสมาชิก' },
  { value: 'EVENT_REGISTRATION', label: 'ลงทะเบียนกิจกรรม' },
  { value: 'FEEDBACK', label: 'แบบฟีดแบ็ค' },
  { value: 'CONTACT', label: 'แบบติดต่อ' },
  { value: 'SURVEY', label: 'แบบสำรวจ' },
  { value: 'OTHER', label: 'อื่นๆ' }
];

const FORM_STATUS = [
  { value: 'ACTIVE', label: 'เปิดใช้งาน', color: 'bg-green-100 text-green-800' },
  { value: 'INACTIVE', label: 'ปิดใช้งาน', color: 'bg-gray-100 text-gray-800' },
  { value: 'ARCHIVED', label: 'เก็บถาวร', color: 'bg-yellow-100 text-yellow-800' }
];

export default function AdminFormsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'CONTACT' as Form['type'],
    status: 'ACTIVE' as Form['status'],
    fields: '[]',
    settings: '{}'
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchForms();
  }, [searchTerm, typeFilter, statusFilter]);

  const fetchForms = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (typeFilter) params.append('type', typeFilter);
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await fetch(`/api/forms?${params}`);
      if (response.ok) {
        const data = await response.json();
        const formsData = Array.isArray(data) ? data : (data.data || data.forms || []);
        setForms(formsData);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      // Validate JSON fields
      try {
        JSON.parse(formData.fields);
        JSON.parse(formData.settings);
      } catch {
        alert('รูปแบบ JSON ไม่ถูกต้อง');
        return;
      }

      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowAddModal(false);
        resetForm();
        fetchForms();
      } else {
        const error = await response.json();
        alert('เกิดข้อผิดพลาด: ' + error.error);
      }
    } catch (error) {
      console.error('Error creating form:', error);
      alert('เกิดข้อผิดพลาดในการสร้างฟอร์ม');
    }
  };

  const handleUpdate = async () => {
    if (!selectedForm) return;

    try {
      // Validate JSON fields
      try {
        JSON.parse(formData.fields);
        JSON.parse(formData.settings);
      } catch {
        alert('รูปแบบ JSON ไม่ถูกต้อง');
        return;
      }

      const response = await fetch(`/api/forms/${selectedForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedForm(null);
        resetForm();
        fetchForms();
      } else {
        const error = await response.json();
        alert('เกิดข้อผิดพลาด: ' + error.error);
      }
    } catch (error) {
      console.error('Error updating form:', error);
      alert('เกิดข้อผิดพลาดในการแก้ไขฟอร์ม');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบฟอร์มนี้? การส่งฟอร์มทั้งหมดจะถูกลบด้วย')) return;

    try {
      const response = await fetch(`/api/forms/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchForms();
      } else {
        const error = await response.json();
        alert('เกิดข้อผิดพลาด: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      alert('เกิดข้อผิดพลาดในการลบฟอร์ม');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'CONTACT',
      status: 'ACTIVE',
      fields: '[]',
      settings: '{}'
    });
  };

  const openEditModal = (form: Form) => {
    setSelectedForm(form);
    setFormData({
      title: form.title,
      description: form.description || '',
      type: form.type,
      status: form.status,
      fields: form.fields,
      settings: form.settings || '{}'
    });
    setShowEditModal(true);
  };

  const openViewModal = (form: Form) => {
    setSelectedForm(form);
    setShowViewModal(true);
  };

  const getTypeLabel = (type: string) => {
    return FORM_TYPES.find(t => t.value === type)?.label || type;
  };

  const getStatusConfig = (status: string) => {
    return FORM_STATUS.find(s => s.value === status) || FORM_STATUS[1];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">จัดการฟอร์ม</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          สร้างฟอร์มใหม่
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ค้นหาฟอร์ม..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ทุกประเภท</option>
            {FORM_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ทุกสถานะ</option>
            {FORM_STATUS.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => {
          const statusConfig = getStatusConfig(form.status);
          return (
            <div key={form.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <FileText className="text-blue-600" size={32} />
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{form.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {form.description || 'ไม่มีคำอธิบาย'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                    {getTypeLabel(form.type)}
                  </span>
                  <span>
                    {form._count?.submissions || 0} การส่ง
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openViewModal(form)}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 flex items-center justify-center gap-1"
                  >
                    <Eye size={16} />
                    ดู
                  </button>
                  <button
                    onClick={() => openEditModal(form)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-1"
                  >
                    <Edit2 size={16} />
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {forms.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          <FileText className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-lg">ไม่พบฟอร์ม</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">สร้างฟอร์มใหม่</h2>
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อฟอร์ม *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  คำอธิบาย
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ประเภท *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Form['type'] })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {FORM_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    สถานะ *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Form['status'] })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {FORM_STATUS.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fields (JSON) *
                </label>
                <textarea
                  value={formData.fields}
                  onChange={(e) => setFormData({ ...formData, fields: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  rows={6}
                  placeholder='[{"name": "email", "type": "email", "label": "อีเมล", "required": true}]'
                />
                <p className="text-xs text-gray-500 mt-1">ใส่ JSON array ของ field objects</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Settings (JSON)
                </label>
                <textarea
                  value={formData.settings}
                  onChange={(e) => setFormData({ ...formData, settings: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  rows={4}
                  placeholder='{"confirmationMessage": "ขอบคุณสำหรับการส่งฟอร์ม"}'
                />
                <p className="text-xs text-gray-500 mt-1">ใส่ JSON object ของ settings</p>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreate}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                สร้าง
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">แก้ไขฟอร์ม</h2>
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อฟอร์ม *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  คำอธิบาย
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ประเภท *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Form['type'] })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {FORM_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    สถานะ *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Form['status'] })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {FORM_STATUS.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fields (JSON) *
                </label>
                <textarea
                  value={formData.fields}
                  onChange={(e) => setFormData({ ...formData, fields: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-1">ใส่ JSON array ของ field objects</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Settings (JSON)
                </label>
                <textarea
                  value={formData.settings}
                  onChange={(e) => setFormData({ ...formData, settings: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">ใส่ JSON object ของ settings</p>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                บันทึก
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedForm(null);
                  resetForm();
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">รายละเอียดฟอร์ม</h2>
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อฟอร์ม</label>
                <p className="text-gray-900">{selectedForm.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
                <p className="text-gray-900">{selectedForm.description || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ประเภท</label>
                  <p className="text-gray-900">{getTypeLabel(selectedForm.type)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusConfig(selectedForm.status).color}`}>
                    {getStatusConfig(selectedForm.status).label}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fields</label>
                <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(JSON.parse(selectedForm.fields), null, 2)}
                </pre>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Settings</label>
                <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
                  {selectedForm.settings ? JSON.stringify(JSON.parse(selectedForm.settings), null, 2) : '{}'}
                </pre>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">สร้างเมื่อ</label>
                  <p>{new Date(selectedForm.createdAt).toLocaleString('th-TH')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">แก้ไขล่าสุด</label>
                  <p>{new Date(selectedForm.updatedAt).toLocaleString('th-TH')}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedForm(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
