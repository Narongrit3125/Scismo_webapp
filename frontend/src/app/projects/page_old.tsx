'use client';

import { useQuery } from '@tanstack/react-query';
import { projectAPI } from '@/lib/api';
import Card, { CardContent } from '@/components/Card';
import Loading from '@/components/Loading';
import { FolderOpen, FileText, Download, ExternalLink } from 'lucide-react';

export default function ProjectsPage() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectAPI.getAll().then(res => res.data),
  });

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

  if (isLoading) return <Loading text="กำลังโหลดโครงการ..." />;
  if (error) return <div className="text-center py-8 text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">โครงการ</h1>
          <p className="text-gray-600 mt-2">โครงการและกิจกรรมต่างๆ ของสโมสรนิสิตคณะวิทยาศาสตร์</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 text-center">
            <FolderOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{Array.isArray(projects) ? projects.length : 0}</div>
            <div className="text-sm text-gray-600">โครงการทั้งหมด</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {Array.isArray(projects) ? projects.filter((p: any) => p.content_title).length : 0}
            </div>
            <div className="text-sm text-gray-600">มีกิจกรรมเกี่ยวข้อง</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <Download className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {Array.isArray(projects) ? projects.filter((p: any) => p.file_project || p.file_start || p.file_summary).length : 0}
            </div>
            <div className="text-sm text-gray-600">มีไฟล์เอกสาร</div>
          </div>
        </div>

        {/* Projects Grid */}
        {Array.isArray(projects) && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <Card key={project.id} hover className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="w-6 h-6 text-blue-600" />
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {project.code || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <h2 className="font-semibold text-xl mb-3 line-clamp-2">
                    {project.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Project Info */}
                  <div className="space-y-2 mb-4">
                    <div className="text-xs text-gray-500">
                      ปีการศึกษา: {project.year} | สถานะ: {project.status}
                    </div>
                    {project.coordinator && (
                      <div className="text-xs text-gray-500">
                        ผู้ประสานงาน: {project.coordinator}
                      </div>
                    )}
                  </div>

                  {/* Files Section */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">ไฟล์เอกสาร:</h4>
                    
                    {project.planFile ? (
                      <button
                        onClick={() => downloadFile(project.planFile, `${project.code}_plan.pdf`)}
                        className="w-full flex items-center space-x-2 p-2 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <FileText size={16} className="text-blue-600" />
                        <span className="text-sm text-blue-800">ไฟล์แผนโครงการ</span>
                        <Download size={14} className="text-blue-600 ml-auto" />
                      </button>
                    ) : (
                      <div className="text-xs text-gray-400 italic">ยังไม่มีไฟล์แผนโครงการ</div>
                    )}
                        <Download size={14} className="text-blue-600 ml-auto" />
                      </button>
                    )}

                    {project.file_start && (
                      <button
                        onClick={() => downloadFile(project.file_start, `${project.project_code}_start.pdf`)}
                        className="w-full flex items-center space-x-2 p-2 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <FileText size={16} className="text-green-600" />
                        <span className="text-sm text-green-800">ไฟล์เริ่มกิจกรรม</span>
                        <Download size={14} className="text-green-600 ml-auto" />
                      </button>
                    )}

                    {project.file_summary && (
                      <button
                        onClick={() => downloadFile(project.file_summary, `${project.project_code}_summary.pdf`)}
                        className="w-full flex items-center space-x-2 p-2 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <FileText size={16} className="text-purple-600" />
                        <span className="text-sm text-purple-800">ไฟล์สรุปกิจกรรม</span>
                        <Download size={14} className="text-purple-600 ml-auto" />
                      </button>
                    )}

                    {!project.file_project && !project.file_start && !project.file_summary && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        ยังไม่มีไฟล์เอกสาร
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <FolderOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">ยังไม่มีโครงการ</h3>
            <p className="text-gray-500">ขณะนี้ยังไม่มีโครงการที่จะแสดง</p>
          </div>
        )}
      </div>
    </div>
  );
}