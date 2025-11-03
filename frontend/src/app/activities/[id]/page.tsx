'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ArrowLeft,
  Users,
  Tag,
  FileText
} from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate?: string;
  location?: string;
  status: string;
  isPublic: boolean;
  image?: string;
  gallery?: string[];
  createdAt: string;
  updatedAt: string;
  author?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  project?: {
    id: string;
    code: string;
    title: string;
    year: number;
  };
}

export default function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/activities?id=${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Activity not found');
        } else {
          setError('Failed to load activity');
        }
        return;
      }

      const result = await response.json();
      if (result.success && result.data) {
        setActivity(result.data);
      } else {
        setError('Activity not found');
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
      setError('Failed to load activity');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {error || 'Activity not found'}
          </h1>
          <Link
            href="/activities"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Activities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">กลับ</span>
        </button>

        {/* Activity Content */}
        <article className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Hero Image */}
          {activity.image && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Status Badge on Image */}
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-purple-700 shadow-lg">
                  {activity.status === 'PLANNING' && 'กำลังวางแผน'}
                  {activity.status === 'OPEN_REGISTRATION' && 'เปิดรับสมัคร'}
                  {activity.status === 'FULL' && 'เต็ม'}
                  {activity.status === 'IN_PROGRESS' && 'กำลังดำเนินการ'}
                  {activity.status === 'COMPLETED' && 'เสร็จสิ้น'}
                  {activity.status === 'CANCELLED' && 'ยกเลิก'}
                </span>
              </div>

              {/* Title on Image */}
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  {activity.title}
                </h1>
              </div>
            </div>
          )}

          {/* Header (if no image) */}
          {!activity.image && (
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {activity.title}
              </h1>
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white">
                {activity.status === 'PLANNING' && 'กำลังวางแผน'}
                {activity.status === 'OPEN_REGISTRATION' && 'เปิดรับสมัคร'}
                {activity.status === 'FULL' && 'เต็ม'}
                {activity.status === 'IN_PROGRESS' && 'กำลังดำเนินการ'}
                {activity.status === 'COMPLETED' && 'เสร็จสิ้น'}
                {activity.status === 'CANCELLED' && 'ยกเลิก'}
              </div>
            </div>
          )}

          {/* Activity Details */}
          <div className="px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Date and Time */}
              <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">วันที่จัดกิจกรรม</h3>
                  <p className="text-gray-700">
                    {new Date(activity.startDate).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {activity.endDate && (
                    <p className="text-sm text-gray-600 mt-1">
                      ถึง {new Date(activity.endDate).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              {activity.location && (
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">สถานที่</h3>
                    <p className="text-gray-700">{activity.location}</p>
                  </div>
                </div>
              )}

              {/* Type */}
              <div className="flex items-start space-x-4 p-4 bg-indigo-50 rounded-xl">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Tag className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">ประเภทกิจกรรม</h3>
                  <p className="text-gray-700">
                    {activity.type === 'WORKSHOP' && 'เวิร์คช็อป'}
                    {activity.type === 'SEMINAR' && 'สัมมนา'}
                    {activity.type === 'COMPETITION' && 'การแข่งขัน'}
                    {activity.type === 'VOLUNTEER' && 'อาสาสมัคร'}
                    {activity.type === 'SOCIAL' && 'สังสรรค์'}
                    {activity.type === 'TRAINING' && 'ฝึกอบรม'}
                    {activity.type === 'MEETING' && 'ประชุม'}
                    {activity.type === 'CEREMONY' && 'พิธีการ'}
                    {activity.type === 'FUNDRAISING' && 'ระดมทุน'}
                    {activity.type === 'EXHIBITION' && 'นิทรรศการ'}
                  </p>
                </div>
              </div>

              {/* Author */}
              {activity.author && (
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
                    <User className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">ผู้จัดกิจกรรม</h3>
                    <p className="text-gray-700">
                      {activity.author.firstName} {activity.author.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{activity.author.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {activity.description && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">รายละเอียดกิจกรรม</h2>
                </div>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {activity.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Project Info */}
            {activity.project && (
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText size={24} className="text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">โครงการที่เกี่ยวข้อง</h2>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      {activity.project.code}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{activity.project.title}</h3>
                      <p className="text-sm text-gray-600">ปีงบประมาณ {activity.project.year}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery */}
            {activity.gallery && activity.gallery.length > 0 && (
              <div className="border-t pt-8 mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">รูปภาพเพิ่มเติม</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activity.gallery.map((image: string, index: number) => (
                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                      <img
                        src={image}
                        alt={`${activity.title} - รูปที่ ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>สร้างเมื่อ: {new Date(activity.createdAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</p>
              <p>อัปเดตล่าสุด: {new Date(activity.updatedAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</p>
            </div>
            <Link
              href="/activities"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-105 font-medium shadow-lg"
            >
              ดูกิจกรรมทั้งหมด
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
