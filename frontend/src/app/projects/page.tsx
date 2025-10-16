'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectAPI } from '@/lib/api';
import { Section, Container, Card, Badge, Button } from '@/components/ui/SharedComponents';
import Loading from '@/components/Loading';
import { Calendar, User, DollarSign, Target, Users, Award, X, FileText, Download, TrendingUp, CheckCircle, Clock, Briefcase } from 'lucide-react';

interface Project {
  id: string;
  code: string;
  title: string;
  description: string;
  shortDescription: string;
  year: number;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  usedBudget: number;
  objectives: string;
  targetGroup: string;
  expectedResults: string;
  sponsor: string;
  coordinator: string;
  isActive: boolean;
  image: string | null;
  planFile: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [yearFilter, setYearFilter] = useState<string>('ALL');

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const response = await projectAPI.getAll();
        console.log('API Response:', response.data);
        return response.data.data || [];
      } catch (error) {
        console.error('Error fetching projects:', error);
        throw new Error('ไม่สามารถโหลดข้อมูลโครงการได้');
      }
    },
  });

  // Get unique years
  const years = useMemo(() => {
    const yearSet = new Set(projects?.map((p: any) => p.year.toString()) || []);
    return ['ALL', ...Array.from(yearSet).sort((a, b) => Number(b) - Number(a))];
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return (projects || []).filter((project: any) => {
      const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
      const matchesYear = yearFilter === 'ALL' || project.year.toString() === yearFilter;
      return matchesStatus && matchesYear;
    });
  }, [projects, statusFilter, yearFilter]);

  // Calculate statistics
  const stats = useMemo(() => ({
    total: projects?.length || 0,
    completed: projects?.filter((p: any) => p.status === 'COMPLETED').length || 0,
    inProgress: projects?.filter((p: any) => p.status === 'IN_PROGRESS').length || 0,
    planning: projects?.filter((p: any) => p.status === 'PLANNING').length || 0,
    totalBudget: projects?.reduce((sum: number, p: any) => sum + (Number(p.totalBudget) || 0), 0) || 0,
  }), [projects]);

  const downloadFile = (fileUrl: string, fileName: string) => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'ไม่ระบุ';
    try {
      return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'ไม่ระบุ';
    }
  };

  // Helper functions
  const getStatusInfo = (status: string) => {
    const statusMap = {
      'COMPLETED': { label: 'เสร็จสิ้น', variant: 'success' as const, icon: CheckCircle },
      'IN_PROGRESS': { label: 'กำลังดำเนินการ', variant: 'warning' as const, icon: TrendingUp },
      'PLANNING': { label: 'กำลังวางแผน', variant: 'info' as const, icon: Clock },
      'CANCELLED': { label: 'ยกเลิก', variant: 'danger' as const, icon: X }
    };
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'default' as const, icon: Briefcase };
  };

  const getPriorityInfo = (priority: string) => {
    const priorityMap = {
      'URGENT': { label: 'เร่งด่วน', variant: 'danger' as const },
      'HIGH': { label: 'สูง', variant: 'warning' as const },
      'MEDIUM': { label: 'ปานกลาง', variant: 'info' as const },
      'LOW': { label: 'ต่ำ', variant: 'default' as const }
    };
    return priorityMap[priority as keyof typeof priorityMap] || { label: priority, variant: 'default' as const };
  };

  if (isLoading) return <Loading text="กำลังโหลดข้อมูลโครงการ..." />;
  
  if (error) {
    return (
      <main className="min-h-screen pt-20 flex items-center justify-center">
        <Container>
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-600">ไม่สามารถโหลดข้อมูลโครงการได้ กรุณาลองใหม่อีกครั้ง</p>
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
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">โครงการ</h1>
            <p className="text-xl text-purple-200 drop-shadow-lg">
              โครงการและกิจกรรมของสโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร
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
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.total}</div>
              <div className="text-gray-600">โครงการทั้งหมด</div>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.completed}</div>
              <div className="text-gray-600">เสร็จสิ้นแล้ว</div>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.inProgress}</div>
              <div className="text-gray-600">กำลังดำเนินการ</div>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {(stats.totalBudget / 1000).toFixed(0)}K
              </div>
              <div className="text-gray-600">งบประมาณรวม (บาท)</div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Filter Section */}
      <Section variant="light">
        <Container>
          <Card className="p-6 shadow-xl mb-8">
            <div className="flex flex-col gap-4">
              {/* Status Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">สถานะโครงการ</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'ALL', label: 'ทั้งหมด' },
                    { value: 'PLANNING', label: 'กำลังวางแผน' },
                    { value: 'IN_PROGRESS', label: 'กำลังดำเนินการ' },
                    { value: 'COMPLETED', label: 'เสร็จสิ้น' },
                  ].map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setStatusFilter(status.value)}
                      className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                        statusFilter === status.value
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">ปีการศึกษา</h3>
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setYearFilter(year)}
                      className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                        yearFilter === year
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {year === 'ALL' ? 'ทั้งหมด' : `ปี ${year}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              พบ {filteredProjects.length} โครงการ
              {statusFilter !== 'ALL' && ` สถานะ: ${getStatusInfo(statusFilter).label}`}
              {yearFilter !== 'ALL' && ` ปีการศึกษา: ${yearFilter}`}
            </div>
          </Card>
        </Container>
      </Section>

      {/* Projects Grid */}
      <Section variant="light">
        <Container>
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project: any) => {
                const statusInfo = getStatusInfo(project.status);
                const priorityInfo = getPriorityInfo(project.priority);
                const budgetPercent = Number(project.totalBudget) > 0 
                  ? (Number(project.usedBudget) / Number(project.totalBudget)) * 100 
                  : 0;

                return (
                  <Card 
                    key={project.id} 
                    hover 
                    className="overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    {/* Project Image */}
                    <div className="relative h-48 bg-gradient-to-br from-purple-500 to-blue-600 overflow-hidden">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="text-6xl mb-2">📊</div>
                            <div className="text-sm font-medium">{project.code}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4">
                        <Badge variant={priorityInfo.variant}>
                          {priorityInfo.label}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {project.description || project.shortDescription}
                      </p>

                      {/* Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={16} className="mr-2 text-purple-500" />
                          <span>ปีการศึกษา {project.year}</span>
                        </div>
                        
                        {project.coordinator && (
                          <div className="flex items-center text-sm text-gray-600">
                            <User size={16} className="mr-2 text-purple-500" />
                            <span className="truncate">{project.coordinator}</span>
                          </div>
                        )}
                        
                        {project.totalBudget > 0 && (
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign size={16} className="mr-2 text-purple-500" />
                            <span>{project.totalBudget.toLocaleString()} บาท</span>
                          </div>
                        )}
                      </div>

                      {/* Budget Progress */}
                      {project.totalBudget > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>งบประมาณที่ใช้</span>
                            <span>{budgetPercent.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
                        >
                          ดูรายละเอียด
                        </button>
                        
                        {project.planFile && (
                          <button
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              downloadFile(project.planFile!, `${project.code}_plan.pdf`);
                            }}
                            className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            title="ดาวน์โหลดแผน"
                          >
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">📂</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">ไม่พบโครงการ</h3>
              <p className="text-gray-500 mb-6">
                {statusFilter === 'ALL' && yearFilter === 'ALL'
                  ? 'ขณะนี้ยังไม่มีโครงการในระบบ'
                  : 'ไม่พบโครงการที่ตรงกับเงื่อนไขที่เลือก'}
              </p>
              {(statusFilter !== 'ALL' || yearFilter !== 'ALL') && (
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setStatusFilter('ALL');
                    setYearFilter('ALL');
                  }}
                >
                  ล้างตัวกรอง
                </Button>
              )}
            </div>
          )}
        </Container>
      </Section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onDownload={downloadFile}
          formatDate={formatDate}
          getStatusInfo={getStatusInfo}
          getPriorityInfo={getPriorityInfo}
        />
      )}
    </main>
  );
}

// Project Detail Modal Component
function ProjectDetailModal({
  project,
  onClose,
  onDownload,
  formatDate,
  getStatusInfo,
  getPriorityInfo
}: {
  project: Project;
  onClose: () => void;
  onDownload: (url: string, name: string) => void;
  formatDate: (date: string) => string;
  getStatusInfo: (status: string) => any;
  getPriorityInfo: (priority: string) => any;
}) {
  const statusInfo = getStatusInfo(project.status);
  const priorityInfo = getPriorityInfo(project.priority);
  const budgetPercent = project.totalBudget > 0 
    ? (project.usedBudget / project.totalBudget) * 100 
    : 0;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl">
        {/* Modal Header */}
        <div className="relative p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="pr-12">
            <div className="flex gap-2 mb-3">
              <Badge variant={statusInfo.variant} className="bg-white/90">
                {statusInfo.label}
              </Badge>
              <Badge variant={priorityInfo.variant} className="bg-white/90">
                {priorityInfo.label}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
            <p className="text-purple-100 text-sm">รหัสโครงการ: {project.code}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">ปีการศึกษา</div>
              <div className="font-bold text-gray-900">{project.year}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">งบประมาณ</div>
              <div className="font-bold text-gray-900">{project.totalBudget.toLocaleString()}</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <User className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">ผู้ประสานงาน</div>
              <div className="font-bold text-gray-900 text-sm truncate">{project.coordinator}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">ผู้สนับสนุน</div>
              <div className="font-bold text-gray-900 text-sm truncate">{project.sponsor || '-'}</div>
            </div>
          </div>

          {/* Budget Progress */}
          {project.totalBudget > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>การใช้งบประมาณ</span>
                <span className="font-bold">
                  {project.usedBudget.toLocaleString()} / {project.totalBudget.toLocaleString()} บาท
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-1 text-right">
                {budgetPercent.toFixed(1)}% ของงบประมาณทั้งหมด
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600" />
              รายละเอียดโครงการ
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Objectives */}
          {project.objectives && (
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                วัตถุประสงค์
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {project.objectives}
              </p>
            </div>
          )}

          {/* Target Group */}
          {project.targetGroup && (
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                กลุ่มเป้าหมาย
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {project.targetGroup}
              </p>
            </div>
          )}

          {/* Expected Results */}
          {project.expectedResults && (
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-600" />
                ผลที่คาดว่าจะได้รับ
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {project.expectedResults}
              </p>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              ระยะเวลาดำเนินการ
            </h3>
            <div className="flex items-center gap-4 text-gray-700">
              <div>
                <span className="text-sm text-gray-600">เริ่ม: </span>
                <span className="font-medium">{formatDate(project.startDate)}</span>
              </div>
              <span className="text-gray-400">→</span>
              <div>
                <span className="text-sm text-gray-600">สิ้นสุด: </span>
                <span className="font-medium">{formatDate(project.endDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            ปิด
          </Button>
          {project.planFile && (
            <Button 
              variant="primary" 
              onClick={() => onDownload(project.planFile!, `${project.code}_plan.pdf`)}
              className="flex-1"
            >
              <Download size={16} className="mr-2" />
              ดาวน์โหลดแผนโครงการ
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}