'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Loading from '@/components/Loading';
import Card, { CardContent } from '@/components/Card';
import { FileText, Download } from 'lucide-react';

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

  if (loading) return <Loading />;

  return (
    <PageLayout title="เอกสารดาวน์โหลด">
      {documents.length > 0 ? (
        <div className="space-y-4">
          {documents.map(doc => (
            <Card key={doc.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{doc.title}</h3>
                    <p className="text-sm text-gray-600">{doc.fileName}</p>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    <Download className="inline mr-2" size={16} />
                    ดาวน์โหลด
                  </a>
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
