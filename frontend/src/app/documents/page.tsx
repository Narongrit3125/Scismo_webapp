'use client';

import { useQuery } from '@tanstack/react-query';
import { documentAPI } from '@/lib/api';
import Card, { CardContent } from '@/components/Card';
import Loading from '@/components/Loading';
import PageLayout from '@/components/PageLayout';
import { FileText, Download, Calendar, FileIcon } from 'lucide-react';

export default function DocumentsPage() {
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentAPI.getAll().then(res => res.data),
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

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const getFileIcon = (filename: string) => {
    const ext = getFileExtension(filename);
    switch (ext) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-6 h-6 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="w-6 h-6 text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="w-6 h-6 text-orange-500" />;
      default:
        return <FileIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) return <Loading text="กำลังโหลดเอกสาร..." />;
  if (error) return (
    <PageLayout title="เกิดข้อผิดพลาด" showSidebar={false}>
      <div className="text-center py-8 text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
    </PageLayout>
  );

  return (
    <PageLayout 
      title="เอกสารดาวน์โหลด" 
      subtitle="เอกสารและไฟล์ต่างๆ ของสโมสรนิสิตคณะวิทยาศาสตร์"
    >

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 text-center">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{Array.isArray(documents) ? documents.length : 0}</div>
            <div className="text-sm text-gray-600">เอกสารทั้งหมด</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <FileText className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {Array.isArray(documents) ? documents.filter((doc: any) => getFileExtension(doc.file_name) === 'pdf').length : 0}
            </div>
            <div className="text-sm text-gray-600">ไฟล์ PDF</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {Array.isArray(documents) ? documents.filter((doc: any) => ['doc', 'docx'].includes(getFileExtension(doc.file_name))).length : 0}
            </div>
            <div className="text-sm text-gray-600">ไฟล์ Word</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {Array.isArray(documents) ? documents.filter((doc: any) => ['xls', 'xlsx'].includes(getFileExtension(doc.file_name))).length : 0}
            </div>
            <div className="text-sm text-gray-600">ไฟล์ Excel</div>
          </div>
        </div>

        {/* Filter by file type */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">ประเภทไฟล์</h3>
          <div className="flex flex-wrap gap-2">
            {['ทั้งหมด', 'PDF', 'Word', 'Excel', 'PowerPoint', 'อื่นๆ'].map((type) => (
              <button
                key={type}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Documents List */}
        {Array.isArray(documents) && documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((document: any) => (
              <Card key={document.id} hover>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* File Icon */}
                      <div className="flex-shrink-0">
                        {getFileIcon(document.file_name)}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {document.file_name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>อัปโหลดเมื่อ {new Date(document.uploaded_at).toLocaleDateString('th-TH')}</span>
                          </div>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                            {getFileExtension(document.file_name).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Download Button */}
                    <div className="flex-shrink-0 ml-4">
                      <button
                        onClick={() => downloadFile(document.file_path, document.file_name)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download size={16} />
                        <span>ดาวน์โหลด</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">ยังไม่มีเอกสาร</h3>
            <p className="text-gray-500">ขณะนี้ยังไม่มีเอกสารที่จะแสดง</p>
          </div>
        )}
    </PageLayout>
  );
}