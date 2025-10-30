'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { memberAPI, positionAPI } from '@/lib/api';
import { Section, Container, Card, Badge, Button } from '@/components/ui/SharedComponents';
import Loading from '@/components/Loading';
import { Users, Mail, Phone, GraduationCap, Award, Search, Filter, Grid, List, BookOpen } from 'lucide-react';

interface Member {
  id: string;
  studentId: string;
  name: string;
  email?: string;
  phone?: string;
  year?: number;
  department?: string;
  faculty?: string;
  position?: string;
  division?: string;
  avatar?: string;
  isActive?: boolean;
}

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('ทั้งหมด');
  const [selectedMajor, setSelectedMajor] = useState<string>('ทั้งหมด');
  const [selectedPosition, setSelectedPosition] = useState<string>('ทั้งหมด');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [groupByYear, setGroupByYear] = useState(false);

  const { data: members, isLoading: membersLoading, error: membersError } = useQuery({
    queryKey: ['members'],
    queryFn: () => memberAPI.getAll().then(res => {
      console.log('Members API response:', res);
      return res.data;
    }),
  });

  const { data: positions, isLoading: positionsLoading } = useQuery({
    queryKey: ['positions'],
    queryFn: () => positionAPI.getAll().then(res => res.data),
  });

  console.log('Members data:', members);
  console.log('Members loading:', membersLoading);
  console.log('Members error:', membersError);

  const membersList = Array.isArray(members) ? members : [];
  console.log('Members list:', membersList.length, 'members');

  // Get unique values for filters
  const years = useMemo(() => {
    const yearSet = new Set(membersList.map((m: Member) => m.year?.toString()).filter(Boolean));
    return ['ทั้งหมด', ...Array.from(yearSet).sort((a, b) => Number(b) - Number(a))];
  }, [membersList]);

  const majors = useMemo(() => {
    const majorSet = new Set(membersList.map((m: Member) => m.department).filter(Boolean));
    return ['ทั้งหมด', ...Array.from(majorSet).sort()];
  }, [membersList]);

  const positionNames = useMemo(() => {
    const posSet = new Set(membersList.map((m: Member) => m.position).filter(Boolean));
    return ['ทั้งหมด', ...Array.from(posSet)];
  }, [membersList]);

  // Filter members
  const filteredMembers = useMemo(() => {
    return membersList.filter((member: Member) => {
      const matchesSearch = 
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.studentId?.includes(searchQuery) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesYear = selectedYear === 'ทั้งหมด' || member.year?.toString() === selectedYear;
      const matchesMajor = selectedMajor === 'ทั้งหมด' || member.department === selectedMajor;
      const matchesPosition = selectedPosition === 'ทั้งหมด' || member.position === selectedPosition;
      
      return matchesSearch && matchesYear && matchesMajor && matchesPosition;
    });
  }, [membersList, searchQuery, selectedYear, selectedMajor, selectedPosition]);

  // Group members by year
  const groupedMembers: Record<string, Member[]> = useMemo(() => {
    if (!groupByYear) return { 'ทั้งหมด': filteredMembers };
    
    const groups: Record<string, Member[]> = {};
    filteredMembers.forEach((member: Member) => {
      const year = member.year ? `ปี ${member.year}` : 'ไม่ระบุปี';
      if (!groups[year]) groups[year] = [];
      groups[year].push(member);
    });
    
    return groups;
  }, [filteredMembers, groupByYear]);

  // Statistics
  const stats = useMemo(() => ({
    total: membersList.length,
    years: new Set(membersList.map((m: Member) => m.year).filter(Boolean)).size,
    majors: new Set(membersList.map((m: Member) => m.department).filter(Boolean)).size,
    withPosition: membersList.filter((m: Member) => m.position).length,
  }), [membersList]);

  if (membersLoading || positionsLoading) return <Loading text="กำลังโหลดข้อมูลสมาชิก..." />;
  
  if (membersError) {
    return (
      <Container>
        <Section>
          <div className="text-center py-16">
            <div className="text-red-500 text-xl mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูลสมาชิก</div>
            <p className="text-gray-600">{membersError instanceof Error ? membersError.message : 'Unknown error'}</p>
          </div>
        </Section>
      </Container>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-32 pb-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">สมาชิกสโมสร</h1>
            <p className="text-xl text-purple-200 drop-shadow-lg">
              สมาชิกนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร
            </p>
          </div>
        </Container>
      </section>

      {/* Statistics Section */}
      <Section variant="light" className="-mt-10 relative z-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-center p-8 bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.total}</div>
              <div className="text-gray-600">สมาชิกทั้งหมด</div>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.years}</div>
              <div className="text-gray-600">ชั้นปี</div>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.majors}</div>
              <div className="text-gray-600">สาขาวิชา</div>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.withPosition}</div>
              <div className="text-gray-600">มีตำแหน่ง</div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Search and Filter Section */}
      <Section variant="light">
        <Container>
          <Card className="p-6 shadow-xl mb-8">
            <div className="flex flex-col gap-4">
              {/* Top Row: Search and View Options */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="ค้นหาสมาชิก (ชื่อ, รหัสนิสิต, อีเมล)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                {/* View Controls */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="แสดงแบบตาราง"
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="แสดงแบบรายการ"
                  >
                    <List size={20} />
                  </button>
                  <button
                    onClick={() => setGroupByYear(!groupByYear)}
                    className={`px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                      groupByYear
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    จัดกลุ่มตามปี
                  </button>
                </div>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Year Filter */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="text-gray-400" size={16} />
                    <span className="text-sm font-medium text-gray-700">ชั้นปี</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {years.slice(0, 5).map((year) => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year as string)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          selectedYear === year
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {year === 'ทั้งหมด' ? year : `ปี ${year}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Major Filter */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="text-gray-400" size={16} />
                    <span className="text-sm font-medium text-gray-700">สาขาวิชา</span>
                  </div>
                  <select
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    {majors.map((major) => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </select>
                </div>

                {/* Position Filter */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="text-gray-400" size={16} />
                    <span className="text-sm font-medium text-gray-700">ตำแหน่ง</span>
                  </div>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    {positionNames.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                พบ {filteredMembers.length} คน
                {searchQuery && ` จากการค้นหา "${searchQuery}"`}
              </div>
              {(searchQuery || selectedYear !== 'ทั้งหมด' || selectedMajor !== 'ทั้งหมด' || selectedPosition !== 'ทั้งหมด') && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedYear('ทั้งหมด');
                    setSelectedMajor('ทั้งหมด');
                    setSelectedPosition('ทั้งหมด');
                  }}
                >
                  ล้างตัวกรอง
                </Button>
              )}
            </div>
          </Card>
        </Container>
      </Section>

      {/* Members Display Section */}
      <Section variant="light">
        <Container>
          {filteredMembers.length > 0 ? (
            Object.keys(groupedMembers).map((groupKey) => (
              <div key={groupKey} className="mb-12 last:mb-0">
                {groupByYear && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{groupKey}</h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-2"></div>
                  </div>
                )}
                
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'flex flex-col gap-4'
                }>
                  {(groupedMembers[groupKey] || []).map((member: Member) => (
                    <MemberCard key={member.id} member={member} viewMode={viewMode} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">👥</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">ไม่พบสมาชิก</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? `ไม่พบสมาชิกที่ค้นหา "${searchQuery}"`
                  : 'ไม่พบสมาชิกที่ตรงกับเงื่อนไข'}
              </p>
              <p className="text-xs text-gray-400">
                Total members: {membersList.length} | Filtered: {filteredMembers.length}
              </p>
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}

// Member Card Component
function MemberCard({ member, viewMode }: { member: Member; viewMode: 'grid' | 'list' }) {
  return viewMode === 'grid' ? (
    <Card hover className="h-full">
      <div className="p-6 text-center">
        {/* Profile Image */}
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Users className="w-12 h-12 text-purple-500" />
          )}
        </div>

        {/* Name */}
        <h3 className="font-bold text-lg text-gray-900 mb-2">
          {member.name}
        </h3>

        {/* Student ID */}
        <div className="flex items-center justify-center text-sm text-gray-600 mb-3">
          <GraduationCap size={14} className="mr-1" />
          <span>{member.studentId}</span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {member.year && (
            <Badge variant="success">ปี {member.year}</Badge>
          )}
          {member.position && (
            <Badge variant="info">{member.position}</Badge>
          )}
        </div>

        {member.department && (
          <div className="text-sm text-gray-600 mb-3">
            📚 {member.department}
          </div>
        )}

        {/* Contact */}
        <div className="space-y-1 text-xs text-gray-600 border-t pt-3">
          {member.email && (
            <div className="flex items-center justify-center">
              <Mail size={12} className="mr-1 text-purple-500" />
              <span className="truncate">{member.email}</span>
            </div>
          )}
          {member.phone && (
            <div className="flex items-center justify-center">
              <Phone size={12} className="mr-1 text-purple-500" />
              <span>{member.phone}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  ) : (
    <Card hover>
      <div className="flex items-center p-4 gap-4">
        {/* Profile Image */}
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Users className="w-8 h-8 text-purple-500" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-1">
            {member.name}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="flex items-center">
              <GraduationCap size={12} className="mr-1" />
              {member.studentId}
            </span>
            {member.department && (
              <span>• {member.department}</span>
            )}
            {member.year && (
              <span>• ปี {member.year}</span>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 flex-shrink-0">
          {member.position && (
            <Badge variant="info">{member.position}</Badge>
          )}
        </div>

        {/* Contact Icons */}
        <div className="flex gap-2 flex-shrink-0">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
              title={member.email}
            >
              <Mail size={16} className="text-purple-600" />
            </a>
          )}
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
              title={member.phone}
            >
              <Phone size={16} className="text-purple-600" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}