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
            <Card key={member.id} className="overflow-hidden">
              {/* Card Header with Dark Blue Background */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 h-20"></div>
              
              <CardContent className="relative pt-0 pb-6 px-6">
                {/* Profile Picture - Overlapping header */}
                <div className="flex justify-center -mt-12 mb-4">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-lg border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                      <Users size={40} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{member.name}</h3>
                  {member.position && (
                    <p className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-2">
                      {member.position}
                    </p>
                  )}
                </div>

                {/* Contact Details */}
                <div className="space-y-2 text-sm">
                  {member.phone && (
                    <div className="flex items-center text-gray-700">
                      <Phone size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{member.phone}</span>
                    </div>
                  )}
                  
                  {member.email && (
                    <div className="flex items-center text-gray-700">
                      <Mail size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}

                  {member.department && (
                    <div className="flex items-start text-gray-700 pt-2 border-t">
                      <Building size={16} className="mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{member.department}</div>
                        {member.faculty && (
                          <div className="text-xs text-gray-500">{member.faculty}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {(member.year || member.academicYear) && (
                    <div className="flex items-center text-gray-700 pt-2 border-t">
                      <GraduationCap size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                      <div className="flex gap-3 text-xs">
                        {member.year && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">
                            ชั้นปี {member.year}
                          </span>
                        )}
                        {member.academicYear && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-medium">
                            ปีการศึกษา {member.academicYear}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {member.studentId && (
                    <div className="text-center pt-2 border-t">
                      <span className="text-xs text-gray-500">รหัสนักศึกษา</span>
                      <div className="font-mono font-semibold text-gray-700">{member.studentId}</div>
                    </div>
                  )}
                </div>
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
