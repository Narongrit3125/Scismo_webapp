'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Users, 
  UserCog, 
  Newspaper, 
  Calendar, 
  FolderOpen, 
  FileText, 
  File,
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';

interface DashboardStats {
  users: number;
  members: number;
  staff: number;
  news: number;
  activities: number;
  projects: number;
  documents: number;
  contacts: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    members: 0,
    staff: 0,
    news: 0,
    activities: 0,
    projects: 0,
    documents: 0,
    contacts: 0
  });
  const [loading, setLoading] = useState(true);

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

    fetchStats();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      const endpoints = [
        '/api/users',
        '/api/members', 
        '/api/staff',
        '/api/news',
        '/api/activities',
        '/api/projects',
        '/api/documents',
        '/api/contacts'
      ];

      const responses = await Promise.all(
        endpoints.map(endpoint => fetch(endpoint))
      );

      const data = await Promise.all(
        responses.map(response => response.json())
      );

      setStats({
        users: data[0].total || 0,
        members: data[1].total || 0,
        staff: data[2].total || 0,
        news: data[3].total || 0,
        activities: data[4].total || 0,
        projects: data[5].total || 0,
        documents: data[6].total || 0,
        contacts: data[7].total || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminSections = [
    {
      title: 'ผู้ใช้งาน',
      items: [
        { name: 'จัดการผู้ใช้', icon: Users, href: '/admin/users', count: stats.users, bgColor: 'bg-blue-100', iconColor: 'text-blue-600', textColor: 'text-blue-600' },
        { name: 'สมาชิก', icon: UserCog, href: '/admin/members', count: stats.members, bgColor: 'bg-green-100', iconColor: 'text-purple-600', textColor: 'text-purple-600' },
        { name: 'เจ้าหน้าที่', icon: UserCog, href: '/admin/staff', count: stats.staff, bgColor: 'bg-purple-100', iconColor: 'text-purple-600', textColor: 'text-purple-600' },
      ]
    },
    {
      title: 'เนื้อหา',
      items: [
        { name: 'ข่าวสาร', icon: Newspaper, href: '/admin/news', count: stats.news, bgColor: 'bg-red-100', iconColor: 'text-red-600', textColor: 'text-red-600' },
        { name: 'กิจกรรม', icon: Calendar, href: '/admin/activities', count: stats.activities, bgColor: 'bg-orange-100', iconColor: 'text-purple-600', textColor: 'text-purple-600' },
        { name: 'โครงการ', icon: FolderOpen, href: '/admin/projects', count: stats.projects, bgColor: 'bg-cyan-100', iconColor: 'text-cyan-600', textColor: 'text-cyan-600' },
      ]
    },
    {
      title: 'ระบบอื่นๆ',
      items: [
        { name: 'เอกสาร', icon: File, href: '/admin/documents', count: stats.documents, bgColor: 'bg-amber-100', iconColor: 'text-amber-600', textColor: 'text-amber-600' },
      ]
    }
  ];

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
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('th-TH', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 px-4 py-2 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                    {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {session.user.name || session.user.email}
                    </div>
                    <div className="text-xs text-purple-600 font-medium">ผู้ดูแลระบบ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 mb-8 text-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">
                ยินดีต้อนรับกลับมา, {session.user.name?.split(' ')[0] || 'Admin'}! 👋
              </h2>
              <p className="text-purple-100 text-sm drop-shadow">
                คุณมีเนื้อหาทั้งหมด {stats.news + stats.activities + stats.projects} รายการ 
                และมีข้อความติดต่อใหม่ {stats.contacts} รายการ
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform">
                <Activity className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-purple-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-green-50 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500">ผู้ใช้ทั้งหมด</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.users}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-green-50 px-2 py-1 rounded-full">
                +8%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500">เนื้อหาทั้งหมด</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats.news + stats.activities + stats.projects}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-indigo-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200">
                <Activity className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                New
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500">ข้อความติดต่อ</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.contacts}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-purple-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                <File className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                +5
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500">เอกสาร</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.documents}</p>
          </div>
        </div>

        {/* Admin Sections */}
        {adminSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {section.title}
              </h2>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center transition-colors group">
                ดูเพิ่มเติม 
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  onClick={() => router.push(item.href)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-6 border border-gray-100 hover:border-purple-300 hover:scale-105 group"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${item.bgColor} group-hover:scale-110 transition-transform`}>
                        <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                      <span className={`text-2xl font-bold ${item.textColor}`}>
                        {item.count}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}