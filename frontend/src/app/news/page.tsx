'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Section, Container, SectionHeader, Card, Badge, Button } from '@/components/ui/SharedComponents';
import Loading from '@/components/Loading';
import { Calendar, User, Tag, Search, Filter, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  priority: string;
  status: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  slug: string;
  viewCount: number;
  image: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['news-public'],
    queryFn: async () => {
      const res = await fetch('/api/news?status=PUBLISHED');
      if (!res.ok) throw new Error('Failed to fetch news');
      return res.json();
    },
  });

  const newsData = response?.data || [];

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCats = new Set<string>();
    newsData.forEach((item: NewsItem) => {
      if (item.category && item.category !== 'ทั้งหมด') {
        uniqueCats.add(item.category);
      }
    });
    return ['ทั้งหมด', ...Array.from(uniqueCats)];
  }, [newsData]);

  // Filter news
  const filteredNews = useMemo(() => {
    return newsData.filter((item: NewsItem) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [newsData, searchQuery, selectedCategory]);

  if (isLoading) return <Loading text="กำลังโหลดข่าวสาร..." />;
  
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
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">ข่าวสาร</h1>
            <p className="text-xl text-purple-200 drop-shadow-lg">
              ข่าวสารล่าสุดและกิจกรรมต่างๆ จากสโมสรนิสิตคณะวิทยาศาสตร์
            </p>
          </div>
        </Container>
      </section>

      {/* Search and Filter Section */}
      <Section variant="light" className="-mt-10 relative z-20">
        <Container>
          <Card className="p-6 shadow-xl">
            <div className="flex flex-col md:flex-row gap-2">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="ค้นหาข่าวสาร..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter className="text-gray-400 flex-shrink-0" size={20} />
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              พบ {filteredNews.length} รายการ
              {searchQuery && ` จากการค้นหา "${searchQuery}"`}
              {selectedCategory !== 'ทั้งหมด' && ` ในหมวดหมู่ "${selectedCategory}"`}
            </div>
          </Card>
        </Container>
      </Section>

      {/* News Grid */}
      <Section variant="light">
        <Container>
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item: NewsItem) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <Card hover className="h-full overflow-hidden group cursor-pointer">
                    {/* Image */}
                    {item.image ? (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="info">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                        <div className="text-white text-6xl">📰</div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-6">
                      {/* Meta */}
                      <div className="flex items-center text-sm text-gray-500 mb-3 gap-4">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{new Date(item.publishedAt || item.createdAt).toLocaleDateString('th-TH', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span className="truncate">{item.author.firstName}</span>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {item.title}
                      </h3>
                      
                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {item.excerpt || item.content?.substring(0, 120)}...
                      </p>
                      
                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
                              <Tag size={10} className="mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Read More */}
                      <div className="flex items-center text-purple-600 font-medium text-sm group-hover:text-purple-700">
                        <span>อ่านต่อ</span>
                        <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">�</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">ไม่พบข่าวสาร</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? `ไม่พบผลลัพธ์สำหรับ "${searchQuery}"`
                  : 'กรุณาติดตามข่าวสารของเราในภายหลัง'}
              </p>
              {(searchQuery || selectedCategory !== 'ทั้งหมด') && (
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ทั้งหมด');
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