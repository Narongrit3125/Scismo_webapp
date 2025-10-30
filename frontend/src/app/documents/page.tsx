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
    queryFn: () => documentAPI.getAll().then(res => {
      console.log('Documents response:', res);
      return res.data;
    }),
  });

  console.log('📄 Documents Page - Data:', documents);
  console.log('📄 Documents Page - Loading:', isLoading);
  console.log('📄 Documents Page - Error:', error);
  console.log('📄 Documents Page - Array?:', Array.isArray(documents));

  const downloadFile = async (docId: string, fileUrl: string, fileName: string) => {
    try {
      // Increment download count
      await fetch(`/api/documents?id=${docId}&action=download`, {
        method: 'PATCH',
      });

      // Download file
      if (fileUrl) {
        window.open(fileUrl, '_blank');
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const getFileIcon = (type: string) => {
    const typeUpper = type.toUpperCase();
    switch (typeUpper) {
      case 'PDF':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'DOC':
      case 'DOCX':
        return <FileText className="w-6 h-6 text-blue-500" />;
      case 'XLS':
      case 'XLSX':
        return <FileText className="w-6 h-6 text-green-500" />;
      case 'PPT':
      case 'PPTX':
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
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
        <div className="text-gray-600 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</div>
      </div>
    </PageLayout>
  );

  return (
    <PageLayout 
      title="เอกสารดาวน์โหลด" 
      subtitle="เอกสารและไฟล์ต่างๆ ของสโมสรนิสิตคณะวิทยาศาสตร์"
    >

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{Array.isArray(documents) ? documents.length : 0}</div>
            <div className="text-sm text-gray-600">เอกสารทั้งหมด</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 text-center border border-red-200 shadow-sm hover:shadow-md transition-shadow">
            <FileText className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {Array.isArray(documents) ? documents.filter((doc: any) => doc.type === 'PDF').length : 0}
            </div>
            <div className="text-sm text-gray-600">ไฟล์ PDF</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-lg p-6 text-center border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {Array.isArray(documents) ? documents.filter((doc: any) => ['DOC', 'DOCX'].includes(doc.type)).length : 0}
            </div>
            <div className="text-sm text-gray-600">ไฟล์ Word</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-6 text-center border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {Array.isArray(documents) ? documents.filter((doc: any) => ['XLS', 'XLSX'].includes(doc.type)).length : 0}
            </div>
            <div className="text-sm text-gray-600">ไฟล์ Excel</div>
          </div>
        </div>

        {/* Filter by file type */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-sm p-6 mb-8 border border-purple-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">ประเภทไฟล์</h3>
          <div className="flex flex-wrap gap-2">
            {['ทั้งหมด', 'PDF', 'Word', 'Excel', 'PowerPoint', 'อื่นๆ'].map((type) => (
              <button
                key={type}
                className="px-4 py-2 text-sm bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white rounded-full transition-all shadow-sm border border-gray-200"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Documents List */}
        {Array.isArray(documents) && documents.length > 0 ? (
          <div className="space-y-4">
            {documents.filter((doc: any) => doc.isPublic).map((document: any) => (
              <Card key={document.id} hover>
                <CardContent className="p-6 bg-gradient-to-r from-white to-gray-50 hover:from-purple-50 hover:to-blue-50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* File Icon */}
                      <div className="flex-shrink-0 bg-white p-3 rounded-lg shadow-sm">
                        {getFileIcon(document.type)}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {document.title}
                        </h3>
                        {document.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {document.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>อัปโหลดเมื่อ {new Date(document.createdAt).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                          <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                            {document.type}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Download size={14} />
                            <span>{document.downloadCount} ครั้ง</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {document.fileName} • {formatFileSize(document.fileSize)}
                        </div>
                      </div>
                    </div>

                    {/* Download Button */}
                    <div className="flex-shrink-0 ml-4">
                      <button
                        onClick={() => downloadFile(document.id, document.fileUrl, document.fileName)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
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
          <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100">
            <div className="text-purple-300 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">ยังไม่มีเอกสาร</h3>
            <p className="text-gray-500">ขณะนี้ยังไม่มีเอกสารที่จะแสดง</p>
            <p className="text-xs text-gray-400 mt-2">
              Total documents: {Array.isArray(documents) ? documents.length : 0} | 
              Public documents: {Array.isArray(documents) ? documents.filter((d: any) => d.isPublic).length : 0}
            </p>
          </div>
        )}
    </PageLayout>
  );
}