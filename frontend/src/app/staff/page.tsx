'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Section, Container, Card, Badge, Button } from '@/components/ui/SharedComponents';
import Loading from '@/components/Loading';
import { Search, Mail, Phone, User, Users, GraduationCap, Briefcase, Filter, MapPin } from 'lucide-react';

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  email?: string;
  phone?: string;
  bio?: string;
  image?: string;
  startDate: string;
  status: string;
  createdAt: string;
}

// Fetch staff from API
const fetchStaff = async (): Promise<Staff[]> => {
  const response = await fetch('/api/staff');
  if (!response.ok) {
    throw new Error('Failed to fetch staff');
  }
  return response.json();
};

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ทั้งหมด');
  const [selectedRole, setSelectedRole] = useState('ทั้งหมด');

  const { data: staff, isLoading, error } = useQuery<Staff[]>({
    queryKey: ['staff'],
    queryFn: fetchStaff,
  });

  // Ensure staff is an array
  const staffList = Array.isArray(staff) ? staff : [];
  
  // Filter active staff
  const activeStaff = staffList.filter(s => s.status === 'ACTIVE');

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(activeStaff.map((s: Staff) => s.department as string));
    return ['ทั้งหมด', ...Array.from(depts)];
  }, [activeStaff]);

  // Role categories
  const roles = ['ทั้งหมด', 'ผู้บริหาร', 'หัวหน้าฝ่าย', 'สมาชิก'];

  // Categorize role
  const getRoleCategory = (position: string) => {
    if (position.includes('ประธาน')) return 'ผู้บริหาร';
    if (position.includes('หัวหน้า')) return 'หัวหน้าฝ่าย';
    return 'สมาชิก';
  };

  // Filter staff
  const filteredStaff = useMemo(() => {
    return activeStaff.filter((person: Staff) => {
      const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
      const search = searchQuery.toLowerCase();
      const matchesSearch = fullName.includes(search) ||
        person.position.toLowerCase().includes(search) ||
        person.department.toLowerCase().includes(search);
      
      const matchesDepartment = selectedDepartment === 'ทั้งหมด' || person.department === selectedDepartment;
      const matchesRole = selectedRole === 'ทั้งหมด' || getRoleCategory(person.position) === selectedRole;
      
      return matchesSearch && matchesDepartment && matchesRole;
    });
  }, [activeStaff, searchQuery, selectedDepartment, selectedRole]);

  // Group staff by role
  const groupedStaff = useMemo(() => {
    const executives = filteredStaff.filter((s: Staff) => getRoleCategory(s.position) === 'ผู้บริหาร');
    const heads = filteredStaff.filter((s: Staff) => getRoleCategory(s.position) === 'หัวหน้าฝ่าย');
    const members = filteredStaff.filter((s: Staff) => getRoleCategory(s.position) === 'สมาชิก');
    return { executives, heads, members };
  }, [filteredStaff]);

  // Stats
  const stats = useMemo(() => ({
    total: activeStaff.length,
    executives: activeStaff.filter((s: Staff) => getRoleCategory(s.position) === 'ผู้บริหาร').length,
    departments: new Set(activeStaff.map((s: Staff) => s.department)).size,
  }), [activeStaff]);

  if (isLoading) return <Loading text="กำลังโหลดข้อมูลคณะกรรมการ..." />;

  if (error) {
    return (
      <main className="min-h-screen pt-20 flex items-center justify-center">
        <Container>
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <div className="text-red-500 text-6xl mb-4">??</div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-600">ไม่สามารถโหลดข้อมูลได้ในขณะนี้</p>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-32 pb-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">คณะกรรมการบริหาร</h1>
            <p className="text-xl text-purple-200 drop-shadow-lg">
              สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร
            </p>
          </div>
        </Container>
      </section>

      {/* Statistics Section */}
      <Section variant="light" className="-mt-10 relative z-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center p-8 bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.total}</div>
              <div className="text-gray-600">คณะกรรมการทั้งหมด</div>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.executives}</div>
              <div className="text-gray-600">ผู้บริหาร</div>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.departments}</div>
              <div className="text-gray-600">ฝ่ายงาน</div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Search and Filter Section */}
      <Section variant="light">
        <Container>
          <Card className="p-6 shadow-xl mb-8">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="ค้นหาคณะกรรมการ (ชื่อ, ตำแหน่ง, ฝ่าย)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Role Filter */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="text-gray-400" size={16} />
                    <span className="text-sm font-medium text-gray-700">ตำแหน่ง</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                          selectedRole === role
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Department Filter */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="text-gray-400" size={16} />
                    <span className="text-sm font-medium text-gray-700">ฝ่าย</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {departments.slice(0, 4).map((dept) => (
                      <button
                        key={dept}
                        onClick={() => setSelectedDepartment(dept)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                          selectedDepartment === dept
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              พบ {filteredStaff.length} คน
              {searchQuery && ` จากการค้นหา "${searchQuery}"`}
              {selectedRole !== 'ทั้งหมด' && ` ตำแหน่ง "${selectedRole}"`}
              {selectedDepartment !== 'ทั้งหมด' && ` ฝ่าย "${selectedDepartment}"`}
            </div>
          </Card>
        </Container>
      </Section>

      {/* Staff Section */}
      <Section variant="light">
        <Container>
          {filteredStaff.length > 0 ? (
            <div className="space-y-16">
              {/* Executives */}
              {groupedStaff.executives.length > 0 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">ผู้บริหาร</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groupedStaff.executives.map((person: Staff) => (
                      <StaffCard key={person.id} person={person} />
                    ))}
                  </div>
                </div>
              )}

              {/* Department Heads */}
              {groupedStaff.heads.length > 0 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">หัวหน้าฝ่าย</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {groupedStaff.heads.map((person: Staff) => (
                      <StaffCard key={person.id} person={person} compact />
                    ))}
                  </div>
                </div>
              )}

              {/* Members */}
              {groupedStaff.members.length > 0 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">สมาชิก</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {groupedStaff.members.map((person: Staff) => (
                      <StaffCard key={person.id} person={person} compact />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">??</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">ไม่พบข้อมูล</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? `ไม่พบคณะกรรมการที่ค้นหา "${searchQuery}"`
                  : 'ยังไม่มีข้อมูลคณะกรรมการในระบบ'}
              </p>
              {(searchQuery || selectedRole !== 'ทั้งหมด' || selectedDepartment !== 'ทั้งหมด') && (
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRole('ทั้งหมด');
                    setSelectedDepartment('ทั้งหมด');
                  }}
                >
                  ล้างการค้นหา
                </Button>
              )}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}

// Staff Card Component
function StaffCard({ person, compact = false }: { person: Staff; compact?: boolean }) {
  return (
    <Card hover className="h-full overflow-hidden group">
      <div className={compact ? 'p-4' : 'p-6'}>
        {/* Profile Image */}
        <div className={`mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden group-hover:shadow-xl transition-shadow ${compact ? 'w-20 h-20' : 'w-28 h-28'}`}>
          {person.image ? (
            <img
              src={person.image}
              alt={`${person.firstName} ${person.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className={`text-purple-500 ${compact ? 'w-10 h-10' : 'w-14 h-14'}`} />
          )}
        </div>

        {/* Info */}
        <div className="text-center mb-4">
          <h3 className={`font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors ${compact ? 'text-lg' : 'text-xl'}`}>
            {person.firstName} {person.lastName}
          </h3>
          <Badge variant="info" className="mb-2">
            {person.position}
          </Badge>
          <p className={`text-gray-600 font-medium ${compact ? 'text-sm' : ''}`}>{person.department}</p>
        </div>

        {/* Bio */}
        {!compact && person.bio && (
          <p className="text-sm text-gray-600 text-center mb-4 line-clamp-3">
            {person.bio}
          </p>
        )}

        {/* Contact */}
        <div className={`space-y-2 border-t pt-4 ${compact ? 'text-xs' : 'text-sm'}`}>
          {person.email && (
            <div className="flex items-center justify-center">
              <Mail className={`text-purple-500 mr-2 flex-shrink-0 ${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <a 
                href={`mailto:${person.email}`} 
                className="text-purple-600 hover:text-purple-700 hover:underline truncate"
              >
                {person.email}
              </a>
            </div>
          )}
          {person.phone && (
            <div className="flex items-center justify-center">
              <Phone className={`text-purple-500 mr-2 flex-shrink-0 ${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <a 
                href={`tel:${person.phone}`}
                className="text-gray-700 hover:text-purple-600"
              >
                {person.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
