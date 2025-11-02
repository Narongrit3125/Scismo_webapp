'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Eye,
  Download,
  Upload,
  ArrowLeft
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string | null;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  type: string;
  uploadedBy: string;
  downloadCount: number;
  createdAt: string;
  isPublic: boolean;
}

export default function AdminDocuments() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    file: null as File | null,
    isPublic: true
  });

  // Function to generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim() + '-' + Date.now(); // Add timestamp to ensure uniqueness
  };

  const categories = [
    { value: 'general', label: 'ทั่วไป' },
    { value: 'academic', label: 'วิชาการ' },
    { value: 'activity', label: 'กิจกรรม' },
    { value: 'achievement', label: 'ความสำเร็จ' },
    { value: 'announcement', label: 'ประกาศ' }
  ];

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchDocuments();
  }, [session, status, router]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // Fetch all documents (public and private) for admin
      const response = await fetch('/api/documents?public=all');
      const result = await response.json();
      
      if (result.success) {
        setDocuments(result.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      
      // Auto-detect type from extension
      const ext = file.name.split('.').pop()?.toUpperCase();
      if (ext) {
        setFormData(prev => ({ ...prev, type: ext }));
      }
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file) {
      setError('กรุณาเลือกไฟล์');
      return;
    }

    if (!formData.title) {
      setError('กรุณาระบุชื่อเอกสาร');
      return;
    }

    if (!session?.user?.id) {
      setError('ไม่พบข้อมูลผู้ใช้');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      console.log('Starting upload...', { fileName: formData.file.name, type: formData.type });

      // Upload file to Vercel Blob
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Upload failed:', errorText);
        throw new Error('การอัปโหลดไฟล์ล้มเหลว');
      }
      
      const uploadResult = await uploadResponse.json();
      console.log('Upload success:', uploadResult);
      const { url } = uploadResult;

      // Create document record
      const documentData = {
        title: formData.title,
        description: formData.description || null,
        fileName: formData.file.name,
        fileUrl: url,
        fileSize: formData.file.size,
        type: formData.type,
        isPublic: formData.isPublic,
        uploadedBy: session?.user?.id,
      };

      console.log('Creating document record:', documentData);

      const docResponse = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData),
      });

      if (!docResponse.ok) {
        const errorData = await docResponse.json();
        console.error('Document creation failed:', errorData);
        throw new Error(errorData.error || 'การสร้างข้อมูลเอกสารล้มเหลว');
      }

      const docResult = await docResponse.json();
      console.log('Document created successfully:', docResult);

      // Success
      await fetchDocuments();
      setShowUploadModal(false);
      setFormData({
        title: '',
        description: '',
        type: '',
        file: null,
        isPublic: true,
      });
      setError(null);
      alert('อัปโหลดเอกสารสำเร็จ!');
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'การอัปโหลดล้มเหลว');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/documents?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');
      await fetchDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete document');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'ALL' || doc.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="pt-6 pb-2 flex items-center text-white hover:text-blue-100 transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">กลับ</span>
          </button>

          <div className="flex justify-between items-center pb-10">
            <div className="flex items-center space-x-6">
              <div className="bg-white bg-opacity-25 p-4 rounded-xl shadow-lg backdrop-blur-sm">
                <FileText size={36} className="text-blue-100 drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-4xl font-bold drop-shadow-md">จัดการเอกสาร</h1>
                <p className="opacity-90 text-lg drop-shadow-sm">เอกสารทั้งหมด {filteredDocuments.length} ไฟล์</p>
              </div>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-3"
            >
              <Upload size={24} />
              <span>อัปโหลดเอกสาร</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ค้นหาเอกสาร..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border-2 border-gray-400 rounded-lg px-4 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">ประเภททั้งหมด</option>
                <option value="PDF">PDF</option>
                <option value="DOC">DOC</option>
                <option value="DOCX">DOCX</option>
                <option value="XLS">XLS</option>
                <option value="XLSX">XLSX</option>
                <option value="PPT">PPT</option>
                <option value="PPTX">PPTX</option>
                <option value="OTHER">อื่นๆ</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Documents Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อเอกสาร
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ประเภท
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ขนาดไฟล์
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่อัปโหลด
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ดาวน์โหลด
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                        <div className="text-xs text-gray-500">{doc.fileName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Download className="w-4 h-4 mr-1" />
                      {doc.downloadCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      doc.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {doc.isPublic ? 'สาธารณะ' : 'ส่วนตัว'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => window.open(doc.fileUrl, '_blank')}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50"
                        title="ดูเอกสาร"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                        title="ลบเอกสาร"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบเอกสาร</h3>
              <p className="text-gray-500">ยังไม่มีเอกสารในระบบ หรือลองเปลี่ยนเงื่อนไขการค้นหา</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 rounded-t-2xl">
              <h3 className="text-2xl font-bold text-white">อัปโหลดเอกสารใหม่</h3>
              <p className="text-purple-100 text-sm mt-1">เพิ่มเอกสารใหม่เข้าสู่ระบบ</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleUploadDocument} id="upload-form">
              <div className="p-8 space-y-6 max-h-[calc(90vh-220px)] overflow-y-auto">
                {/* Section: ข้อมูลเอกสาร */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-gray-900">ข้อมูลเอกสาร</h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ชื่อเอกสาร <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="ระบุชื่อเอกสาร"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        คำอธิบาย
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-400 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="อธิบายเกี่ยวกับเอกสารนี้..."
                      />
                    </div>
                  </div>
                </div>

                {/* Section: อัปโหลดไฟล์ */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-gray-900">อัปโหลดไฟล์</h4>
                  </div>

                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-3">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <p className="mb-2 text-sm text-gray-700">
                          <span className="font-semibold">คลิกเพื่อเลือกไฟล์</span> หรือลากไฟล์มาวาง
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (สูงสุด 50MB)</p>
                        {formData.file && (
                          <div className="mt-3 px-4 py-2 bg-white border border-purple-200 rounded-lg">
                            <p className="text-sm text-purple-700 font-medium flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              {formData.file.name}
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                  </div>
                </div>

                {/* Section: การเผยแพร่ */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-gray-900">การเผยแพร่</h4>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                        className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="ml-3">
                        <span className="block text-sm font-medium text-gray-900">เผยแพร่สาธารณะ</span>
                        <span className="block text-xs text-gray-600 mt-1">ผู้ใช้ทั่วไปสามารถดูและดาวน์โหลดเอกสารนี้ได้</span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer with Buttons */}
              <div className="sticky bottom-0 bg-gray-50 px-8 py-6 rounded-b-2xl border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setFormData({ title: '', description: '', type: '', file: null, isPublic: false });
                    setError(null);
                  }}
                  disabled={uploading}
                  className="min-w-[120px] px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={uploading || !formData.file}
                  className="min-w-[140px] px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>กำลังอัปโหลด...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>อัปโหลด</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
