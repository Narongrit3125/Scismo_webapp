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
    position: '',
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
      position: '',
      avatar: ''
    });
    setImageFile(null);
    setImagePreview('');
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

      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create user account first
      const userResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.studentId,
          password: 'changeme123', // Default password
          firstName: firstName,
          lastName: lastName,
          role: 'MEMBER'
        }),
      });

      if (!userResponse.ok) {
        const error = await userResponse.json();
        throw new Error(error.error || 'Failed to create user account');
      }

      const userData = await userResponse.json();
      const userId = userData.user?.id;

      if (!userId) {
        throw new Error('Failed to get user ID');
      }

      // Create member profile
      const memberResponse = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          studentId: formData.studentId,
          department: formData.department,
          faculty: 'คณะวิทยาศาสตร์', // Default faculty
          year: parseInt(formData.year),
          phone: formData.phone || '',
          position: formData.position || 'สมาชิกทั่วไป',
          avatar: avatarUrl
        }),
      });

      if (!memberResponse.ok) {
        const error = await memberResponse.json();
        throw new Error(error.error || 'Failed to create member profile');
      }

      // Success
      alert('เพิ่มสมาชิกเรียบร้อยแล้ว\nชื่อผู้ใช้: ' + formData.studentId + '\nรหัสผ่านเริ่มต้น: changeme123');
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
        // Map the API response to match our interface
        const mappedMembers = (data.data || []).map((member: any) => ({
          ...member,
          name: `${member.firstName || ''} ${member.lastName || ''}`.trim()
        }));
        setMembers(mappedMembers);
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
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
                            onClick={() => setSelectedMember(member)}
                            className="text-purple-600 hover:text-purple-900 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
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
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">เพิ่มสมาชิกใหม่</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* รูปโปรไฟล์ */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-purple-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center border-4 border-purple-100">
                      <ImageIcon className="w-12 h-12 text-purple-400" />
                    </div>
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors shadow-lg"
                  >
                    <Upload size={16} />
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
                  <p className="text-sm font-medium text-gray-700">รูปโปรไฟล์</p>
                  <p className="text-xs text-gray-500 mt-1">
                    คลิกปุ่มกล้องเพื่ออัปโหลดรูปภาพ (PNG, JPG, JPEG)
                  </p>
                </div>
              </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">เลือกสาขาวิชา</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชา{dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชั้นปี <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    ตำแหน่งในสโมสร
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">เลือกตำแหน่ง</option>
                    <option value="ประธานสโมสร">ประธานสโมสร</option>
                    <option value="รองประธานสโมสร">รองประธานสโมสร</option>
                    <option value="เลขานุการ">เลขานุการ</option>
                    <option value="เหรัญญิก">เหรัญญิก</option>
                    <option value="ประชาสัมพันธ์">ประชาสัมพันธ์</option>
                    <option value="สมาชิก">สมาชิกทั่วไป</option>
                  </select>
                </div>
              </div>
            </form>
            
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex space-x-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                ยกเลิก
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg"
              >
                เพิ่มสมาชิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}