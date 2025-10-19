'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar, 
  User,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  ArrowLeft
} from 'lucide-react';

interface Project {
  id: string;
  code: string;
  title: string;
  description: string;
  academicYear: number;
  semester?: number;
  status: 'PLANNING' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  startDate: string;
  endDate: string;
  budget?: number;
  isActive: boolean;
  image?: string;
  planFile?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
  activities?: any[];
}

export default function AdminProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string>('');
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    academicYear: new Date().getFullYear(),
    semester: 1,
    status: 'PLANNING',
    startDate: '',
    endDate: '',
    budget: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (status === 'authenticated') {
      fetchProjects();
    }
  }, [status, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user.id) {
      alert('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
      return;
    }

    console.log('Creating project with authorId:', session.user.id);
    console.log('Form data:', formData);

    try {
      const response = await fetch('/api/projects/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          year: formData.academicYear,
          totalBudget: formData.budget,
          startDate: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchProjects();
        setShowAddModal(false);
        resetForm();
        alert('สร้างโครงการสำเร็จ!');
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('เกิดข้อผิดพลาดในการสร้างโครงการ');
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      code: project.code || '',
      title: project.title,
      description: project.description,
      academicYear: project.academicYear,
      semester: project.semester || 1,
      status: project.status,
      startDate: project.startDate.split('T')[0],
      endDate: project.endDate.split('T')[0],
      budget: project.budget || 0
    });
    setUploadedFilePath('');
    setSelectedFile(null);
    setShowEditModal(true);
  };

  const handleFileUpload = async (file: File, projectId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);

    try {
      const response = await fetch('/api/upload/plan', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        return result.filePath;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject) return;

    try {
      let planFilePath = uploadedFilePath;

      // Upload file if selected
      if (selectedFile) {
        planFilePath = await handleFileUpload(selectedFile, selectedProject.id);
      }

      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          planFile: planFilePath
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchProjects();
        setShowEditModal(false);
        resetForm();
        setSelectedFile(null);
        setUploadedFilePath('');
        alert('อัปเดตโครงการสำเร็จ!');
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตโครงการ');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบโครงการนี้?')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchProjects();
        alert('ลบโครงการสำเร็จ!');
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('เกิดข้อผิดพลาดในการลบโครงการ');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      academicYear: new Date().getFullYear(),
      semester: 1,
      status: 'PLANNING',
      startDate: '',
      endDate: '',
      budget: 0
    });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'ON_HOLD': return 'bg-orange-100 text-orange-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLANNING': return <Clock size={16} />;
      case 'APPROVED': return <CheckCircle size={16} />;
      case 'IN_PROGRESS': return <Target size={16} />;
      case 'COMPLETED': return <CheckCircle size={16} />;
      case 'ON_HOLD': return <AlertCircle size={16} />;
      case 'CANCELLED': return <X size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'วางแผน';
      case 'APPROVED': return 'อนุมัติแล้ว';
      case 'IN_PROGRESS': return 'ดำเนินการ';
      case 'COMPLETED': return 'เสร็จสิ้น';
      case 'ON_HOLD': return 'ระงับ';
      case 'CANCELLED': return 'ยกเลิก';
      default: return status;
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-cyan-600 to-sky-500 text-white shadow-2xl">
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
                <FolderOpen size={36} className="text-cyan-300 drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-4xl font-bold drop-shadow-md">จัดการโครงการ</h1>
                <p className="opacity-90 text-lg drop-shadow-sm">ระบบจัดการโครงการและกิจกรรมของสโมสรนิสิต</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-cyan-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-50 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-3"
            >
              <Plus size={24} />
              <span>เพิ่มโครงการใหม่</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="ค้นหาโครงการ (ชื่อ, คำอธิบาย, ผู้ประสานงาน)"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">ทุกสถานะ</option>
                <option value="PLANNING">วางแผน</option>
                <option value="APPROVED">อนุมัติแล้ว</option>
                <option value="IN_PROGRESS">ดำเนินการ</option>
                <option value="COMPLETED">เสร็จสิ้น</option>
                <option value="ON_HOLD">ระงับ</option>
                <option value="CANCELLED">ยกเลิก</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FolderOpen className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">โครงการทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">กำลังดำเนินการ</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'IN_PROGRESS').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">เสร็จสิ้นแล้ว</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">วางแผน</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'PLANNING').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(project.status)}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                  
                  <div className="flex items-center mb-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-mono">
                      {project.code}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User size={14} className="mr-2" />
                      <span>ปีการศึกษา: {project.academicYear}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2" />
                      <span>
                        {new Date(project.startDate).toLocaleDateString('th-TH')} - 
                        {new Date(project.endDate).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      งบประมาณ: ฿{project.budget?.toLocaleString() || 'ไม่ระบุ'}
                    </span>
                    <span className="text-sm text-gray-500">
                      กิจกรรม: {project.activities?.length || 0} รายการ
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">ไม่พบโครงการ</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">เพิ่มโครงการใหม่</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <form id="project-form" onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รหัสโครงการ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="เช่น SC2567-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อโครงการ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="กรุณากรอกชื่อโครงการ"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  คำอธิบาย *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="กรุณากรอกคำอธิบายโครงการ"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ปีการศึกษา *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.academicYear}
                    onChange={(e) => setFormData({...formData, academicYear: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    งบประมาณรวม (บาท)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  สถานะ
                </label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="PLANNING">กำลังวางแผน</option>
                  <option value="APPROVED">อนุมัติแล้ว</option>
                  <option value="IN_PROGRESS">ดำเนินการ</option>
                  <option value="COMPLETED">เสร็จสิ้น</option>
                  <option value="ON_HOLD">ระงับ</option>
                  <option value="CANCELLED">ยกเลิก</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันที่เริ่มต้น *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                    style={{ colorScheme: 'light' }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันที่สิ้นสุด *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                    style={{ colorScheme: 'light' }}
                  />
                </div>
              </div>
            </form>
            
            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                type="submit"
                form="project-form"
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                เพิ่มโครงการ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">แก้ไขโครงการ</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProject} id="edit-project-form" className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อโครงการ *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ปีการศึกษา
                  </label>
                  <input
                    type="number"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({...formData, academicYear: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  คำอธิบายโครงการ *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    สถานะ
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="PLANNING">วางแผน</option>
                    <option value="APPROVED">อนุมัติแล้ว</option>
                    <option value="IN_PROGRESS">กำลังดำเนินการ</option>
                    <option value="COMPLETED">เสร็จสิ้น</option>
                    <option value="ON_HOLD">ระงับชั่วคราว</option>
                    <option value="CANCELLED">ยกเลิก</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันเริ่มต้น
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    style={{ colorScheme: 'light' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันสิ้นสุด
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    style={{ colorScheme: 'light' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    งบประมาณ (บาท)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ไฟล์แผนโครงการ (PDF, DOC, DOCX)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    ไฟล์ที่เลือก: {selectedFile.name}
                  </p>
                )}
              </div>
            </form>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedFile(null);
                  setUploadedFilePath('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                type="submit"
                form="edit-project-form"
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                อัปเดตโครงการ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
