'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Loading from '@/components/Loading';
import Card, { CardContent } from '@/components/Card';
import { Users, Mail, Phone, Building, GraduationCap, Filter } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  studentId: string;
  email?: string;
  phone?: string;
  department?: string;
  faculty?: string;
  year?: number;
  academicYear?: number;
  position?: string;
  division?: string;
  avatar?: string;
  isActive?: boolean;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterAcademicYear, setFilterAcademicYear] = useState<string>('all');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      const data = await response.json();
      
      if (data.success) {
        setMembers(data.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const years = ['all', ...Array.from(new Set(members.map(m => m.year).filter(Boolean)))].sort();
  const departments = ['all', ...Array.from(new Set(members.map(m => m.department).filter(Boolean)))].sort();
  const academicYears = ['all', ...Array.from(new Set(members.map(m => m.academicYear).filter(Boolean)))].sort((a, b) => {
    if (a === 'all') return -1;
    if (b === 'all') return 1;
    return Number(b) - Number(a);
  });

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = searchQuery === '' || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.studentId.includes(searchQuery) ||
      (member.email && member.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesYear = filterYear === 'all' || member.year === Number(filterYear);
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    const matchesAcademicYear = filterAcademicYear === 'all' || member.academicYear === Number(filterAcademicYear);

    return matchesSearch && matchesYear && matchesDepartment && matchesAcademicYear;
  });

  if (loading) return <Loading />;

  return (
    <PageLayout title="สมาชิก">
      {/* Filter Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="w-full">
            <input
              type="text"
              placeholder="ค้นหาสมาชิก (ชื่อ, รหัสนักศึกษา, อีเมล)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-3 items-center">
            <Filter size={20} className="text-gray-500" />
            
            {/* Academic Year Filter */}
            <select
              value={filterAcademicYear}
              onChange={(e) => setFilterAcademicYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">ทุกปีการศึกษา</option>
              {academicYears.filter(y => y !== 'all').map(year => (
                <option key={year} value={year}>
                  ปีการศึกษา {year}
                </option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">ทุกชั้นปี</option>
              {years.filter(y => y !== 'all').map(year => (
                <option key={year} value={year}>
                  ชั้นปีที่ {year}
                </option>
              ))}
            </select>

            {/* Department Filter */}
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">ทุกสาขา</option>
              {departments.filter(d => d !== 'all').map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          แสดง {filteredMembers.length} จาก {members.length} สมาชิก
        </div>
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map(member => (
            <Card key={member.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              {/* Profile Picture - Full width */}
              <div className="relative h-64 bg-gray-100">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <Users size={80} className="text-gray-400" />
                  </div>
                )}
                
                {/* Academic Year Badge - Top Left */}
                {member.academicYear && (
                  <div className="absolute top-3 left-3">
                    <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-lg">
                      <div className="text-xs font-medium">ปีการศึกษา</div>
                      <div className="text-lg font-bold">{member.academicYear}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <CardContent className="p-5">
                {/* Name */}
                <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">
                  {member.name}
                </h3>

                {/* Position */}
                {member.position && (
                  <div className="text-center mb-3 pb-3 border-b">
                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                      {member.position}
                    </p>
                  </div>
                )}

                {/* Department */}
                {member.department && (
                  <div className="flex items-start mb-3">
                    <Building size={18} className="mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{member.department}</div>
                      {member.faculty && (
                        <div className="text-xs text-gray-500 mt-0.5">{member.faculty}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Email */}
                {member.email && (
                  <div className="flex items-center text-sm text-gray-700">
                    <Mail size={16} className="mr-2 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">ยังไม่มีสมาชิก</p>
        </div>
      )}
    </PageLayout>
  );
}
