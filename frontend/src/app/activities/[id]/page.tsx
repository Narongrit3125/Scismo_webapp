'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Activity {
  id: string;
  title: string;
  content: string;
  images: string[];
  createdAt: string;
  author?: string;
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/activities"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Activities
        </Link>

        {/* Activity Content */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 border-b">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {activity.title}
            </h1>
            <div className="flex items-center text-sm text-gray-600">
              <time dateTime={activity.createdAt}>
                {new Date(activity.createdAt).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {activity.author && (
                <>
                  <span className="mx-2">•</span>
                  <span>โดย {activity.author}</span>
                </>
              )}
            </div>
          </div>

          {/* Images Gallery */}
          {activity.images && activity.images.length > 0 && (
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activity.images.map((image, index) => (
                  <div key={index} className="relative aspect-video">
                    <img
                      src={image}
                      alt={`${activity.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-8">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: activity.content }}
            />
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/activities"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Activities
          </Link>
        </div>
      </div>
    </div>
  );
}
