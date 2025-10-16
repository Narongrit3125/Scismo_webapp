'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Section, Container, Card, Badge, Button } from '@/components/ui/SharedComponents';
import Loading from '@/components/Loading';
import { Calendar, MapPin, Users, Search, Filter, Clock, ArrowRight, Grid, List } from 'lucide-react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  status: string;
  image?: string;
  createdAt: string;
}

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ทั้งหมด');
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['activities-public'],
    queryFn: async () => {
      const res = await fetch('/api/activities?isPublic=true');
      if (!res.ok) throw new Error('Failed to fetch activities');
      return res.json();
    },
  });

  const activitiesData = response?.data || [];

  // Get unique types
  const activityTypes = useMemo(() => {
    const types = new Set(activitiesData.map((item: ActivityItem) => item.type as string));
    return ['ทั้งหมด', ...Array.from(types)] as string[];
  }, [activitiesData]);

  // Get unique statuses
  const statuses = ['ทั้งหมด', 'เปิดรับสมัคร', 'กำลังดำเนินการ', 'สิ้นสุดแล้ว'];

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activitiesData.filter((item: ActivityItem) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'ทั้งหมด' || item.type === selectedType;
      const matchesStatus = selectedStatus === 'ทั้งหมด' || item.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [activitiesData, searchQuery, selectedType, selectedStatus]);

  // Get status info
  const getStatusInfo = (activity: ActivityItem) => {
    const now = new Date();
    const startDate = new Date(activity.startDate);
    const endDate = new Date(activity.endDate);
    
    if (now > endDate) {
      return { label: 'สิ้นสุดแล้ว', variant: 'default' as const };
    } else if (now >= startDate && now <= endDate) {
      return { label: 'กำลังดำเนินการ', variant: 'warning' as const };
    } else {
      return { label: 'เปิดรับสมัคร', variant: 'success' as const };
    }
  };

  if (isLoading) return <Loading text="กำลังโหลดกิจกรรม..." />;
  
  if (error) return (
    <main className="min-h-screen pt-20 flex items-center justify-center">
      <Container>
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600">ไม่สามารถโหลดข้อมูลได้ในขณะนี้</p>
        </div>
      </Container>
    </main>
  );

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-32 pb-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">กิจกรรม</h1>
            <p className="text-xl text-purple-200 drop-shadow-lg">
              ร่วมสร้างประสบการณ์ที่น่าจดจำและพัฒนาทักษะไปด้วยกัน
            </p>
          </div>
        </Container>
      </section>

      {/* Search and Filter Section */}
      <Section variant="light" className="-mt-10 relative z-20">
        <Container>
          <Card className="p-6 shadow-xl">
            <div className="flex flex-col gap-4">
              {/* Top Row: Search and View Toggle */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="ค้นหากิจกรรม..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                {/* View Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
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
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Type Filter */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="text-gray-400" size={16} />
                    <span className="text-sm font-medium text-gray-700">ประเภทกิจกรรม</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activityTypes.map((type: string) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                          selectedType === type
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-gray-400" size={16} />
                    <span className="text-sm font-medium text-gray-700">สถานะ</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                          selectedStatus === status
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              พบ {filteredActivities.length} กิจกรรม
              {searchQuery && ` จากการค้นหา "${searchQuery}"`}
              {selectedType !== 'ทั้งหมด' && ` ประเภท "${selectedType}"`}
              {selectedStatus !== 'ทั้งหมด' && ` สถานะ "${selectedStatus}"`}
            </div>
          </Card>
        </Container>
      </Section>

      {/* Activities Grid/List */}
      <Section variant="light">
        <Container>
          {filteredActivities.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'flex flex-col gap-6'
            }>
              {filteredActivities.map((activity: ActivityItem) => {
                const statusInfo = getStatusInfo(activity);
                const participantsPercent = activity.maxParticipants > 0
                  ? (activity.currentParticipants / activity.maxParticipants) * 100
                  : 0;

                return viewMode === 'grid' ? (
                  // Grid View
                  <Card key={activity.id} hover className="overflow-hidden group cursor-pointer">
                    {/* Image */}
                    {activity.image ? (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge variant={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                        <div className="text-white text-6xl">🎉</div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-6">
                      {/* Type Badge */}
                      <Badge variant="info" className="mb-3">
                        {activity.type}
                      </Badge>
                      
                      {/* Title */}
                      <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {activity.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {activity.description}
                      </p>
                      
                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={16} className="mr-2 text-purple-500" />
                          <span>
                            {new Date(activity.startDate).toLocaleDateString('th-TH', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        {activity.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin size={16} className="mr-2 text-purple-500" />
                            <span className="line-clamp-1">{activity.location}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Users size={16} className="mr-2 text-purple-500" />
                          <span>
                            {activity.currentParticipants}/{activity.maxParticipants} คน
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {activity.maxParticipants > 0 && (
                        <div className="mb-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(participantsPercent, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {participantsPercent >= 100 ? 'เต็มแล้ว' : `เหลืออีก ${activity.maxParticipants - activity.currentParticipants} ที่นั่ง`}
                          </p>
                        </div>
                      )}
                      
                      {/* Button */}
                      <Button variant="primary" className="w-full group-hover:shadow-lg transition-shadow">
                        <span>ดูรายละเอียด</span>
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                ) : (
                  // List View
                  <Card key={activity.id} hover className="overflow-hidden group cursor-pointer">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      {activity.image ? (
                        <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden flex-shrink-0">
                          <img
                            src={activity.image}
                            alt={activity.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div className="w-full md:w-64 h-48 md:h-auto bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <div className="text-white text-6xl">🎉</div>
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="p-6 flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="info">{activity.type}</Badge>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </div>
                        
                        <h3 className="font-bold text-2xl mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                          {activity.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {activity.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar size={16} className="mr-2 text-purple-500" />
                            <span>
                              {new Date(activity.startDate).toLocaleDateString('th-TH', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                          {activity.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin size={16} className="mr-2 text-purple-500" />
                              <span className="line-clamp-1">{activity.location}</span>
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600">
                            <Users size={16} className="mr-2 text-purple-500" />
                            <span>
                              {activity.currentParticipants}/{activity.maxParticipants} คน
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {activity.maxParticipants > 0 && (
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                                  style={{ width: `${Math.min(participantsPercent, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          <Button variant="primary">
                            ดูรายละเอียด
                            <ArrowRight size={16} className="ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">ไม่พบกิจกรรม</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? `ไม่พบผลลัพธ์สำหรับ "${searchQuery}"`
                  : 'เราจะแจ้งข่าวสารเมื่อมีกิจกรรมใหม่'}
              </p>
              {(searchQuery || selectedType !== 'ทั้งหมด' || selectedStatus !== 'ทั้งหมด') && (
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('ทั้งหมด');
                    setSelectedStatus('ทั้งหมด');
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