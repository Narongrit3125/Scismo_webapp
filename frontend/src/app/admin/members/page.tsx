'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  UserCheck,
  GraduationCap,
  X,
  ArrowLeft,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface Member {
  id: string;
  studentId: string;
  firstName?: string;
  lastName?: string;
  name?: string; // Computed field
  email: string;
  phone?: string;
  department: string;
  faculty: string;
  year: number;
  academicYear: number;
  position?: string;
  division?: string;
  avatar?: string;
  isActive: boolean;
  joinDate: string;
}

// รายชื่อสาขาวิชาคณะวิทยาศาสตร์
const DEPARTMENTS = [
  'คณิตศาสตร์',
  'ชีววิทยา',
  'ฟิสิกส์',
  'ฟิสิกส์ประยุกต์',
  'วิทยาการข้อมูลและการวิเคราะห์',
  'วิทยาการคอมพิวเตอร์',
  'สถิติ',
  'เคมี',
  'เทคโนโลยีการวัดและระบบอัจฉริยะ',
  'เทคโนโลยีนวัตกรรมพลังงานและสิ่งแวดล้อม',
  'เทคโนโลยีสารสนเทศ'
];

// ตำแหน่งหลักๆ ในสโมสรนิสิต
const POSITIONS = [
  'ประธานสโมสรนิสิต',
  'รองประธานสโมสรนิสิต',
  'เลขานุการ',
  'เหรัญญิก',
  'ฝ่าย',
  'อื่นๆ'
];

export default function AdminMembersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    academicYear: '2568',
    position: '',
    division: '',
    isDivisionHead: false,
    customPosition: '',
    avatar: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (status === 'authenticated') {
      fetchMembers();
    }
  }, [status, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      studentId: '',
      email: '',
      phone: '',
      department: '',
      year: '',
      academicYear: '2568',
      position: '',
      division: '',
      isDivisionHead: false,
      customPosition: '',
      avatar: ''
    });
    setImageFile(null);
    setImagePreview('');
    setSelectedMember(null);
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสมาชิกคนนี้?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/members?id=${memberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('ลบสมาชิกสำเร็จ');
        await fetchMembers();
      } else {
        const error = await response.json();
        alert(`เกิดข้อผิดพลาด: ${error.error || 'ไม่สามารถลบสมาชิกได้'}`);
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('เกิดข้อผิดพลาดในการลบสมาชิก');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (member: Member) => {
    setSelectedMember(member);
    
    // Parse position to extract division info if it contains "ฝ่าย"
    let basePosition = member.position || '';
    let divisionName = '';
    let isHead = false;
    
    if (basePosition.includes('รองประธาน') && basePosition.includes('ฝ่าย')) {
      const match = basePosition.match(/รองประธานสโมสรนิสิต\s*ฝ่าย(.+)/);
      if (match) {
        divisionName = match[1].trim();
        basePosition = 'รองประธานสโมสรนิสิต';
      }
    } else if (basePosition.includes('หัวหน้าฝ่าย')) {
      const match = basePosition.match(/หัวหน้าฝ่าย(.+)/);
      if (match) {
        divisionName = match[1].trim();
        isHead = true;
        basePosition = 'ฝ่าย';
      }
    } else if (basePosition.includes('ฝ่าย') && !POSITIONS.includes(basePosition)) {
      const match = basePosition.match(/ฝ่าย(.+)/);
      if (match) {
        divisionName = match[1].trim();
        basePosition = 'ฝ่าย';
      }
    }
    
    setFormData({
      name: member.name || '',
      studentId: member.studentId || '',
      email: member.email || '',
      phone: member.phone || '',
      department: member.department || '',
      year: member.year?.toString() || '',
      academicYear: member.academicYear?.toString() || '2568',
      position: POSITIONS.includes(basePosition) ? basePosition : 'อื่นๆ',
      division: divisionName,
      isDivisionHead: isHead,
      customPosition: POSITIONS.includes(basePosition) ? '' : member.position || '',
      avatar: member.avatar || ''
    });
    setImagePreview(member.avatar || '');
    setShowAddModal(true);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      // Upload image if selected
      let avatarUrl = '';
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      // Build position string based on selection
      let finalPosition = '';
      if (formData.position === 'รองประธานสโมสรนิสิต' && formData.division) {
        finalPosition = `รองประธานสโมสรนิสิต ฝ่าย${formData.division}`;
      } else if (formData.position === 'ฝ่าย' && formData.division) {
        if (formData.isDivisionHead) {
          finalPosition = `หัวหน้าฝ่าย${formData.division}`;
        } else {
          finalPosition = `ฝ่าย${formData.division}`;
        }
      } else if (formData.position === 'อื่นๆ' && formData.customPosition) {
        finalPosition = formData.customPosition;
      } else {
        finalPosition = formData.position || 'สมาชิกทั่วไป';
      }

      const memberData = {
        name: formData.name,
        studentId: formData.studentId,
        email: formData.email,
        phone: formData.phone || '',
        department: formData.department,
        faculty: 'คณะวิทยาศาสตร์',
        year: parseInt(formData.year),
        academicYear: parseInt(formData.academicYear),
        position: finalPosition,
        division: formData.division || undefined,
        avatar: avatarUrl || formData.avatar || undefined
      };

      let response;
      if (selectedMember) {
        // Update existing member
        response = await fetch(`/api/members?id=${selectedMember.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(memberData),
        });
      } else {
        // Create new member
        response = await fetch('/api/members/simple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(memberData),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `เกิดข้อผิดพลาดในการ${selectedMember ? 'แก้ไข' : 'เพิ่ม'}สมาชิก`);
      }

      // Success
      alert(`${selectedMember ? 'แก้ไข' : 'เพิ่ม'}ข้อมูลสมาชิกเรียบร้อยแล้ว ✅`);
      setShowAddModal(false);
      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Error creating member:', error);
      alert(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเพิ่มสมาชิก');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      if (response.ok) {
        const data = await response.json();
        // API now returns members with name field directly
        const mappedMembers = (data.data || []).map((member: any) => ({
          ...member,
          // name is already in the response, no need to combine firstName + lastName
        }));
        setMembers(mappedMembers);
      } else {
        console.error('Failed to fetch members:', response.status);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    (member.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.studentId || '').includes(searchTerm) ||
    (member.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-2xl">
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
                <Users size={36} className="text-purple-200 drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-4xl font-bold drop-shadow-md">จัดการสมาชิก</h1>
                <p className="opacity-90 text-lg drop-shadow-sm">ระบบจัดการข้อมูลสมาชิกสโมสรนิสิต</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-3"
            >
              <Plus size={24} />
              <span>เพิ่มสมาชิกใหม่</span>
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
                placeholder="ค้นหาสมาชิก (ชื่อ, รหัสนิสิต, ภาควิชา)"
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 border-2 border-gray-400 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <option value="">ทุกสถานะ</option>
                <option value="active">ใช้งานอยู่</option>
                <option value="inactive">ไม่ใช้งาน</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">สมาชิกทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{members.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <UserCheck className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">ใช้งานอยู่</p>
                <p className="text-2xl font-bold text-gray-900">
                  {members.filter(m => m.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <GraduationCap className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">นิสิตปี 1</p>
                <p className="text-2xl font-bold text-gray-900">
                  {members.filter(m => m.year === 1).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">เดือนนี้</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">รายชื่อสมาชิก</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สมาชิก
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัสนิสิต
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ภาควิชา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชั้นปี
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ปีการศึกษา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.name || ''}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                                <span className="text-purple-600 font-medium">
                                  {(member.name || '?').charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail size={12} className="mr-1" />
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ปี {member.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.academicYear || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          member.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.isActive ? 'ใช้งานอยู่' : 'ไม่ใช้งาน'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => startEdit(member)}
                            className="text-purple-600 hover:text-purple-900 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                            title="แก้ไข"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(member.id)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="ลบ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      <Users size={48} className="mx-auto text-gray-300 mb-4" />
                      <p>ไม่พบข้อมูลสมาชิก</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 transform transition-all">
            {/* Header with Gradient */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedMember ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มสมาชิกใหม่'}
                </h3>
                <p className="text-purple-100 text-sm mt-1">
                  {selectedMember ? 'อัพเดตข้อมูลสมาชิกในระบบ' : 'เพิ่มสมาชิกใหม่เข้าสู่ระบบ'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>
            
            <form id="member-form" onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[calc(90vh-240px)] overflow-y-auto">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4 pb-6 border-b border-gray-200">
                <div className="relative group">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-36 h-36 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center border-4 border-purple-200 shadow-lg">
                      <ImageIcon className="w-16 h-16 text-purple-400" />
                    </div>
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full cursor-pointer hover:shadow-xl transition-all transform hover:scale-110"
                  >
                    <Upload size={18} />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-800">รูปโปรไฟล์</p>
                  <p className="text-sm text-gray-500 mt-1">
                    อัปโหลดรูปภาพ (PNG, JPG, JPEG)
                  </p>
                </div>
              </div>
              
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-3"></div>
                  ข้อมูลส่วนตัว
                </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="กรุณากรอกชื่อ-นามสกุล"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รหัสนิสิต <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="เช่น 6410110001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    อีเมล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="example@student.university.ac.th"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="0XX-XXX-XXXX"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  สาขาวิชา <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                >
                  <option value="">เลือกสาขาวิชา</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชา{dept}
                    </option>
                  ))}
                </select>
              </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-3"></div>
                  ข้อมูลการศึกษา
                </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชั้นปี <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  >
                    <option value="">เลือกชั้นปี</option>
                    <option value="1">ปี 1</option>
                    <option value="2">ปี 2</option>
                    <option value="3">ปี 3</option>
                    <option value="4">ปี 4</option>
                    <option value="5">ปี 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ปีการศึกษา <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.academicYear}
                    onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="เช่น 2568"
                    min="2560"
                    max="2580"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ตำแหน่งในสโมสร
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({
                      ...formData, 
                      position: e.target.value,
                      division: e.target.value === 'รองประธานสโมสรนิสิต' || e.target.value === 'ฝ่าย' ? formData.division : '',
                      isDivisionHead: e.target.value === 'ฝ่าย' ? formData.isDivisionHead : false,
                      customPosition: e.target.value === 'อื่นๆ' ? formData.customPosition : ''
                    })}
                    className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  >
                    <option value="">เลือกตำแหน่ง</option>
                    {POSITIONS.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* รองประธานสโมสรนิสิต - แสดงช่องฝ่าย */}
              {formData.position === 'รองประธานสโมสรนิสิต' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ฝ่าย <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.division}
                    onChange={(e) => setFormData({...formData, division: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="เช่น วิชาการ, กีฬา, ประชาสัมพันธ์"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ระบุชื่อฝ่ายที่รับผิดชอบ (ตำแหน่งจะแสดงเป็น "รองประธานสโมสรนิสิต ฝ่าย...")
                  </p>
                </div>
              )}

              {/* ฝ่าย - แสดงช่องฝ่ายและติ๊กหัวหน้า */}
              {formData.position === 'ฝ่าย' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อฝ่าย <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.division}
                      onChange={(e) => setFormData({...formData, division: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="เช่น วิชาการ, กีฬา, ประชาสัมพันธ์"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDivisionHead"
                      checked={formData.isDivisionHead}
                      onChange={(e) => setFormData({...formData, isDivisionHead: e.target.checked})}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="isDivisionHead" className="ml-2 text-sm font-medium text-gray-700">
                      เป็นหัวหน้าฝ่าย
                    </label>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    {formData.isDivisionHead 
                      ? '✓ ตำแหน่งจะแสดงเป็น "หัวหน้าฝ่าย..."'
                      : 'ตำแหน่งจะแสดงเป็น "ฝ่าย..."'
                    }
                  </p>
                </div>
              )}

              {/* อื่นๆ - แสดงช่องกรอกตำแหน่งเอง */}
              {formData.position === 'อื่นๆ' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ระบุตำแหน่ง <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customPosition}
                    onChange={(e) => setFormData({...formData, customPosition: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-purple-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="เช่น ที่ปรึกษา, พิธีกร, ผู้ประสานงาน"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    กรอกตำแหน่งที่ต้องการ (สำหรับตำแหน่งที่ไม่อยู่ในตัวเลือก)
                  </p>
                </div>
              )}
              </div>

            </form>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-gray-50 px-8 py-6 flex justify-end space-x-4 border-t border-gray-200 rounded-b-2xl">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium min-w-[120px]"
              >
                ยกเลิก
              </button>
              <button 
                type="submit"
                form="member-form"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[120px]"
              >
                {loading 
                  ? (selectedMember ? 'กำลังแก้ไข...' : 'กำลังเพิ่ม...') 
                  : (selectedMember ? 'บันทึกการแก้ไข' : 'เพิ่มสมาชิก')
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}