'use client';

import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showSidebar?: boolean;
}

export default function PageLayout({ 
  children, 
  title, 
  subtitle,
  showSidebar = true 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      {title && (
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xl text-purple-100 opacity-90 drop-shadow">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content with Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 ${showSidebar ? 'lg:grid-cols-4' : 'lg:grid-cols-1'}`}>
          {/* Main Content */}
          <div className={showSidebar ? 'lg:col-span-3' : 'lg:col-span-1'}>
            {children}
          </div>

          {/* Sidebar */}
          {showSidebar && (
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-4">
                {/* Quick Menu */}
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg overflow-hidden shadow-lg">
                  <div className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600">
                    <h3 className="text-lg font-semibold">เมนูย่อย</h3>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-3">
                      <li>
                        <a href="/about/history" className="flex items-center text-white hover:text-purple-100 transition-colors">
                          <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                          ประวัติสโมสร
                        </a>
                      </li>
                      <li>
                        <a href="/about/organization" className="flex items-center text-white hover:text-purple-100 transition-colors">
                          <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                          โครงสร้างองค์กร
                        </a>
                      </li>
                      <li>
                        <a href="/members" className="flex items-center text-white hover:text-purple-100 transition-colors">
                          <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                          สมาชิกสโมสร
                        </a>
                      </li>
                      <li>
                        <a href="/projects" className="flex items-center text-white hover:text-purple-100 transition-colors">
                          <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                          โครงการ
                        </a>
                      </li>
                      <li>
                        <a href="/news" className="flex items-center text-white hover:text-purple-100 transition-colors">
                          <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                          ข่าวสาร
                        </a>
                      </li>
                      <li>
                        <a href="/activities" className="flex items-center text-white hover:text-purple-100 transition-colors">
                          <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                          กิจกรรม
                        </a>
                      </li>
                      <li>
                        <a href="/documents" className="flex items-center text-white hover:text-purple-100 transition-colors">
                          <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                          เอกสาร
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Contact Info Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500">
                    <h3 className="text-lg font-semibold text-white">ติดต่อเรา</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">สโมสรนิสิตคณะวิทยาศาสตร์</p>
                        <p className="text-gray-600">มหาวิทยาลัยนเรศวร</p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          99 หมู่ 9 ตำบลท่าโพธิ์<br />
                          อำเภอเมือง จังหวัดพิษณุโลก<br />
                          65000
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          โทร: 055-961000<br />
                          อีเมล: science@nu.ac.th
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banner */}
                <div className="bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-lg p-6 text-center shadow-lg">
                  <h4 className="text-2xl font-bold text-white mb-2">NU</h4>
                  <p className="text-white text-sm mb-4">มหาวิทยาลัยนเรศวร<br />Naresuan University</p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-purple-700 font-semibold text-xs">
                      EXCELLENCE IN<br />
                      EDUCATION & RESEARCH
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
