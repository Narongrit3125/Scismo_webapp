'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, User, Eye, Tag, Clock, ZoomIn, X, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';

interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  authorId: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  slug: string;
  viewCount: number;
  image?: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function NewsDetail() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const slug = params.slug as string;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        console.log('Fetching news with slug:', slug);
        
        const response = await fetch(`/api/news?slug=${encodeURIComponent(slug)}`);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        const result = await response.json();
        console.log('API Response:', result);

        if (result.success && result.data) {
          console.log('Setting news data:', result.data);
          setNews(result.data);
          
          // Fetch related news
          const relatedResponse = await fetch('/api/news?status=PUBLISHED');
          const relatedResult = await relatedResponse.json();
          if (relatedResult.success && relatedResult.data) {
            // Filter out current news and limit to 3 items
            const filtered = relatedResult.data
              .filter((item: News) => item.slug !== slug)
              .slice(0, 3);
            setRelatedNews(filtered);
          }
        } else {
          console.error('News not found or error:', result);
          setError(result.error || 'ไม่พบข่าวสารที่ต้องการ');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข่าวสาร');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      console.log('useEffect triggered with slug:', slug);
      fetchNews();
    }
  }, [slug]);

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showImageModal) {
        setShowImageModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal]);

  if (loading) {
    return (
      <PageLayout title="กำลังโหลด..." subtitle="กรุณารอสักครู่">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังโหลดข่าวสาร...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !news) {
    return (
      <PageLayout title="ไม่พบข่าวสาร" subtitle="เกิดข้อผิดพลาด">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-6xl text-gray-400 mb-4">📰</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">ไม่พบข่าวสาร</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/news')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              กลับไปหน้าข่าวสาร
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'LOW': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'ด่วนมาก';
      case 'HIGH': return 'สำคัญ';
      case 'MEDIUM': return 'ปกติ';
      case 'LOW': return 'ไม่สำคัญ';
      default: return 'ปกติ';
    }
  };

  return (
    <PageLayout title={news.title} subtitle={news.category}>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          กลับ
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(news.priority)}`}>
              {getPriorityText(news.priority)}
            </span>
            <span className="text-sm text-gray-500">{news.category}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Eye className="w-4 h-4 mr-1" />
            {news.viewCount.toLocaleString()} ครั้ง
          </div>
        </div>
      </div>
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {news.image && (
            <div className="w-full relative group">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-auto max-h-[70vh] object-contain bg-gray-100 cursor-zoom-in"
                style={{ objectFit: 'contain' }}
                onClick={() => setShowImageModal(true)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-zoom-in">
                <ZoomIn className="w-12 h-12 text-white" />
              </div>
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {news.title}
            </h1>
            
            {news.excerpt && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-lg text-gray-700 italic">
                  {news.excerpt}
                </p>
              </div>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                {news.author.firstName} {news.author.lastName}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {news.publishedAt ? formatDate(news.publishedAt) : formatDate(news.createdAt)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                อัปเดตล่าสุด: {formatDate(news.updatedAt)}
              </div>
            </div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3">แท็ก</h3>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br>') }}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => router.push('/news')}
                  className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  ดูข่าวสารทั้งหมด
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: news.title,
                          text: news.excerpt || news.title,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('คัดลอกลิงค์แล้ว');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    แชร์
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">ข่าวสารเพิ่มเติม</h2>
            <Link 
              href="/news"
              className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
            >
              ดูทั้งหมด
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedNews.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`}>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                  {item.image ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                      <div className="text-white text-6xl">📰</div>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock size={14} className="mr-1" />
                      <span>{new Date(item.publishedAt || item.createdAt).toLocaleDateString('th-TH', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                    
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors mb-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.excerpt || item.content?.substring(0, 80)}...
                    </p>
                    
                    <div className="flex items-center text-purple-600 font-medium text-sm mt-3 group-hover:text-purple-700">
                      <span>อ่านต่อ</span>
                      <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && news?.image && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={news.image}
              alt={news.title}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={() => setShowImageModal(false)}
            />
          </div>
        </div>
      )}
    </PageLayout>
  );
}