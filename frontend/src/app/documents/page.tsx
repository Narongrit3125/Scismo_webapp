'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Loading from '@/components/Loading';
import Card, { CardContent } from '@/components/Card';
import { FileText, Download, Filter } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  type: string;
  downloadCount: number;
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents?public=true');
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique document types for filter
  const documentTypes = ['all', ...Array.from(new Set(documents.map(doc => doc.type)))];

  // Filter documents based on type and search query
  const filteredDocuments = documents.filter(doc => {
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading) return <Loading />;

  return (
    <PageLayout title="เอกสารดาวน์โหลด">
      {/* Filter Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาเอกสาร..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border-2 border-gray-400 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {documentTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'ทั้งหมด' : type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          แสดง {filteredDocuments.length} จาก {documents.length} เอกสาร
        </div>
      </div>

      {filteredDocuments.length > 0 ? (
        <div className="space-y-4">
          {filteredDocuments.map(doc => (
            <Card key={doc.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <FileText className="text-blue-600 mt-1" size={24} />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{doc.title}</h3>
                        {doc.description && (
                          <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                        )}
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                          <span className="inline-flex items-center">
                            📄 {doc.fileName}
                          </span>
                          <span className="inline-flex items-center">
                            📦 {formatFileSize(doc.fileSize)}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {doc.type}
                          </span>
                          <span className="inline-flex items-center">
                            ⬇️ {doc.downloadCount} ครั้ง
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                      <Download size={16} />
                      ดาวน์โหลด
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">ยังไม่มีเอกสาร</p>
        </div>
      )}
    </PageLayout>
  );
}
