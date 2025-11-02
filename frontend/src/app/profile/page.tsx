'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  MapPin, 
  Phone, 
  Building, 
  Edit2, 
  Save, 
  X,
  Camera,
  Lock,
  Settings,
  LogOut,
  Award,
  Activity,
  TrendingUp
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import PageLayout from '@/components/PageLayout';

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && session?.user) {
      fetchProfile();
    }
  }, [status, session, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/profile');
      const result = await response.json();
      
      if (result.success) {
        setProfile(result.data);
        setEditedProfile(result.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile),
      });

      const result = await response.json();
      
      if (result.success) {
        setProfile(result.data);
        setIsEditing(false);
        alert('บันทึกข้อมูลสำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      await signOut({ callbackUrl: '/' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleName = (role: string) => {
    const roles: { [key: string]: string } = {
      'ADMIN': 'ผู้ดูแลระบบ',
      'MEMBER': 'สมาชิก',
      'USER': 'ผู้ใช้งาน'
    };
    return roles[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'ADMIN': 'bg-gradient-to-r from-purple-600 to-blue-600 text-white',
      'MEMBER': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      'USER': 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
    };
    return colors[role] || 'bg-gray-200 text-gray-700';
  };

  if (status === 'loading' || loading) {
    return (
      <PageLayout title="โปรไฟล์" subtitle="ข้อมูลส่วนตัว">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!session || !profile) {
    return null;
  }

  return (
    <PageLayout title="โปรไฟล์ของคุณ" subtitle="จัดการข้อมูลส่วนตัวและการตั้งค่า">
      <div className="space-y-6">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-6xl font-bold border-4 border-white/30">
                {profile.firstName?.charAt(0) || profile.email.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 bg-white text-yellow-600 rounded-full p-2 shadow-lg hover:bg-yellow-50 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">
                {profile.firstName && profile.lastName 
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile.email}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(profile.role)}`}>
                  <Shield className="w-4 h-4 mr-1" />
                  {getRoleName(profile.role)}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  สมาชิกตั้งแต่ {formatDate(profile.createdAt)}
                </span>
              </div>
              <p className="text-yellow-50 text-sm">
                จัดการข้อมูลส่วนตัว ความปลอดภัย และการตั้งค่าบัญชีของคุณ
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex md:flex-col gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-yellow-600 px-4 py-2 rounded-lg font-medium hover:bg-yellow-50 transition-colors flex items-center shadow-lg"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  แก้ไข
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center shadow-lg disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedProfile(profile);
                    }}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    ยกเลิก
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100">
                <Activity className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-500">สถานะบัญชี</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">ใช้งานอยู่</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                +5
              </span>
            </div>
            <p className="text-sm text-gray-500">กิจกรรมที่เข้าร่วม</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                New
              </span>
            </div>
            <p className="text-sm text-gray-500">โครงการ</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4">
            <h2 className="text-lg font-semibold flex items-center">
              <User className="w-5 h-5 mr-2" />
              ข้อมูลส่วนตัว
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Email */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-2" />
                <span className="font-medium">อีเมล</span>
              </div>
              <div className="md:col-span-2">
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>
            </div>

            {/* First Name */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <User className="w-5 h-5 mr-2" />
                <span className="font-medium">ชื่อ</span>
              </div>
              <div className="md:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.firstName || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="กรอกชื่อ"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile.firstName || '-'}</p>
                )}
              </div>
            </div>

            {/* Last Name */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <User className="w-5 h-5 mr-2" />
                <span className="font-medium">นามสกุล</span>
              </div>
              <div className="md:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.lastName || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="กรอกนามสกุล"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile.lastName || '-'}</p>
                )}
              </div>
            </div>

            {/* Role */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <Shield className="w-5 h-5 mr-2" />
                <span className="font-medium">บทบาท</span>
              </div>
              <div className="md:col-span-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(profile.role)}`}>
                  {getRoleName(profile.role)}
                </span>
              </div>
            </div>

            {/* Updated At */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-medium">อัปเดตล่าสุด</span>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-900 py-2">{formatDate(profile.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              ความปลอดภัย
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-between group">
              <div className="flex items-center">
                <Lock className="w-5 h-5 mr-3 text-gray-400 group-hover:text-yellow-600" />
                <div>
                  <p className="font-medium text-gray-900">เปลี่ยนรหัสผ่าน</p>
                  <p className="text-sm text-gray-500">อัปเดตรหัสผ่านของคุณ</p>
                </div>
              </div>
              <Settings className="w-5 h-5 text-gray-400 group-hover:text-yellow-600" />
            </button>

            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center">
                <LogOut className="w-5 h-5 mr-3 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">ออกจากระบบ</p>
                  <p className="text-sm text-red-700">ออกจากบัญชีของคุณ</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
