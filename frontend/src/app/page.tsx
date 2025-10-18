'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight, Users, BookOpen, Trophy, Heart, TrendingUp, Zap, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Section, Container, SectionHeader, Card, Button, StatsCard, IconBox } from '@/components/ui/SharedComponents';

interface News {
  id: string;
  title: string;
  excerpt?: string;
  category: string;
  publishedAt?: string;
  createdAt: string;
  slug: string;
}

interface Activity {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  status: string;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  
  const slides = [
    {
      id: 1,
      image: "/images/banner01.png",
      title: "ยินดีต้อนรับสู่สโมสรนิสิต คณะวิทยาศาสตร์",
      subtitle: "มหาวิทยาลัยนเรศวร",
      description: "ขอให้อุดมคุณและมีความสุขที่ได้มาเยี่ยมชมเว็บไซต์ของเรา ร่วมเป็นส่วนหนึ่งของชุมชนแห่งการเรียนรู้"
    },
    {
      id: 2,
      image: "/images/banner02.jpg",
      title: "กิจกรรมหลากหลาย",
      subtitle: "พัฒนาทักษะและความรู้",
      description: "มาร่วมเป็นส่วนหนึ่งของกิจกรรมที่น่าสนใจ เพื่อพัฒนาตนเองและสร้างเครือข่ายเพื่อน"
    },
    {
      id: 3,
      image: "/images/banner03.jpg",
      title: "ชุมชนที่แข็งแกร่ง",
      subtitle: "สานสัมพันธ์ที่ดี",
      description: "เป็นส่วนหนึ่งของครอบครัวใหญ่ที่พร้อมช่วยเหลือและสนับสนุนซึ่งกันและกัน"
    }
  ];

  // Fetch News
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news?status=PUBLISHED&limit=3');
        const result = await response.json();
        if (result.success) {
          setNewsItems(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, []);

  // Fetch Activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities?upcoming=true&limit=3');
        const result = await response.json();
        if (result.success) {
          setActivities(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // Slider auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen">
      {/* Hero Slider */}
      <section className="relative h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-blue-900/80 to-indigo-900/90" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl text-white">
                  <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-2xl md:text-3xl mb-4 text-purple-200 drop-shadow-lg">
                    {slide.subtitle}
                  </p>
                  <p className="text-lg md:text-xl mb-8 text-gray-200 drop-shadow-lg">
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary" size="lg" icon={ArrowRight} href="/about/history">
                      เรียนรู้เพิ่มเติม
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      href="/activities"
                      className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-purple-700"
                    >
                      กิจกรรมทั้งหมด
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <Section variant="gradient">
        <Container>
          <SectionHeader 
            subtitle="เกี่ยวกับเรา"
            title="สโมสรนิสิตคณะวิทยาศาสตร์"
            description="องค์กรนิสิตที่มุ่งเน้นการพัฒนานิสิตทั้งด้านวิชาการและกิจกรรม เพื่อสร้างบัณฑิตที่มีคุณภาพ"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <IconBox 
              icon={BookOpen}
              title="พัฒนาวิชาการ"
              description="จัดกิจกรรมเสริมสร้างความรู้และทักษะทางวิชาการ"
              color="purple"
            />
            <IconBox 
              icon={Users}
              title="สร้างเครือข่าย"
              description="เชื่อมโยงนิสิตและศิษย์เก่าเพื่อแบ่งปันประสบการณ์"
              color="blue"
            />
            <IconBox 
              icon={Trophy}
              title="พัฒนาทักษะ"
              description="ฝึกฝนความเป็นผู้นำและทักษะด้านต่างๆ"
              color="indigo"
            />
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section variant="light">
        <Container>
          <SectionHeader 
            subtitle="จุดเด่น"
            title="ทำไมต้องเข้าร่วมกับเรา"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: 'เรียนรู้และพัฒนา', desc: 'กิจกรรมที่หลากหลายเพื่อพัฒนาศักยภาพ' },
              { icon: Users, title: 'เพื่อนใหม่', desc: 'พบปะเพื่อนจากทุกสาขาวิชา' },
              { icon: Trophy, title: 'รางวัลและความสำเร็จ', desc: 'โอกาสในการแสดงความสามารถ' },
              { icon: BookOpen, title: 'ความรู้เพิ่มเติม', desc: 'เรียนรู้นอกห้องเรียน' },
              { icon: Zap, title: 'ประสบการณ์จริง', desc: 'ลงมือปฏิบัติจริงในโครงการต่างๆ' },
              { icon: Heart, title: 'บริการชุมชน', desc: 'ทำประโยชน์เพื่อสังคม' }
            ].map((feature, index) => (
              <Card key={index} hover className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* News Section */}
      <Section variant="gradient">
        <Container>
          <div className="flex justify-between items-center mb-12">
            <SectionHeader 
              subtitle="ข่าวสาร"
              title="ข่าวและประชาสัมพันธ์"
              centered={false}
            />
            <Button variant="outline" icon={ArrowRight} href="/news">
              ดูทั้งหมด
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : newsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsItems.map((news) => (
                <Card key={news.id} hover className="overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500"></div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-3">
                      {news.category}
                    </span>
                    <h3 className="font-bold text-xl mb-2 line-clamp-2">{news.title}</h3>
                    {news.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">{news.excerpt}</p>
                    )}
                    <Link 
                      href={`/news/${news.slug}`}
                      className="text-purple-600 font-medium flex items-center space-x-2 hover:text-purple-700"
                    >
                      <span>อ่านเพิ่มเติม</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              ยังไม่มีข่าวสารในขณะนี้
            </div>
          )}
        </Container>
      </Section>

      {/* Activities Section */}
      <Section variant="light">
        <Container>
          <div className="flex justify-between items-center mb-12">
            <SectionHeader 
              subtitle="กิจกรรม"
              title="กิจกรรมที่กำลังจะมาถึง"
              centered={false}
            />
            <Button variant="outline" icon={ArrowRight} href="/activities">
              ดูทั้งหมด
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <Card key={activity.id} hover className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex flex-col items-center justify-center text-white">
                      <span className="text-2xl font-bold">
                        {new Date(activity.startDate).getDate()}
                      </span>
                      <span className="text-xs">
                        {new Date(activity.startDate).toLocaleDateString('th-TH', { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{activity.title}</h3>
                      {activity.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{activity.description}</p>
                      )}
                      {activity.location && (
                        <div className="flex items-center text-purple-600 text-sm mt-2">
                          <MapPin size={14} className="mr-1" />
                          {activity.location}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              ยังไม่มีกิจกรรมในขณะนี้
            </div>
          )}
        </Container>
      </Section>

      {/* Call to Action Section */}
      <Section variant="dark">
        <Container>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              ติดต่อเรา
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              ติดตามข่าวสารและกิจกรรมของเราได้ทาง Social Media
            </p>
            
            {/* Social Media Links */}
            <div className="flex flex-wrap gap-6 justify-center mb-8">
              <a 
                href="https://www.facebook.com/SCISMO.NU" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all group"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-white font-medium">Facebook</span>
              </a>

              <a 
                href="https://www.instagram.com/scismo.nu" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="text-white font-medium">Instagram</span>
              </a>

              <a 
                href="https://www.tiktok.com/@scismo.nu" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all group"
              >
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>
                <span className="text-white font-medium">TikTok</span>
              </a>
            </div>

            {/* Phone Number */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <a 
                href="tel:055961000"
                className="inline-flex items-center gap-3 text-xl text-white hover:text-purple-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-semibold">055-961000</span>
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}