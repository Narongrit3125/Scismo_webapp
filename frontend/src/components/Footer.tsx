'use client';

import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin, Settings, ChevronRight, Send } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Footer() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('loading');
    
    // TODO: Implement newsletter subscription API
    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }, 1000);
  };

  const footerLinks = {
    aboutUs: [
      { name: 'ประวัติสโมสร', href: '/about/history' },
      { name: 'โครงสร้างองค์กร', href: '/about/organization' },
      { name: 'สมาชิก', href: '/members' },
      { name: 'คณะกรรมการ', href: '/staff' },
      { name: 'ติดต่อเรา', href: '/contact' }
    ],
    forStudents: [
      { name: 'ข่าวสาร', href: '/news' },
      { name: 'กิจกรรม', href: '/activities' },
      { name: 'โครงการ', href: '/projects' },
      { name: 'เอกสารดาวน์โหลด', href: '/documents' },
      { name: 'คำถามที่พบบ่อย', href: '/faq' }
    ],
    resources: [
      { name: 'มหาวิทยาลัยนเรศวร', href: 'https://www.nu.ac.th', external: true },
      { name: 'คณะวิทยาศาสตร์', href: 'https://sa.sci.nu.ac.th/', external: true },
      { name: 'ห้องสมุด', href: 'https://www.library.nu.ac.th/', external: true },
      { name: 'ระบบทะเบียน', href: 'https://reg.nu.ac.th/', external: true }
    ]
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* About Section with Newsletter */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold">สโมสรนิสิต</span>
            </Link>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              องค์กรนิสิตที่มุ่งเน้นการพัฒนานิสิตทั้งด้านวิชาการและกิจกรรม 
              เพื่อสร้างบัณฑิตที่มีคุณภาพสู่สังคม
            </p>

            {/* Newsletter Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h5 className="font-semibold mb-3 text-sm">รับข่าวสารล่าสุด</h5>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center bg-white/10 rounded-lg overflow-hidden">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="อีเมลของคุณ"
                    required
                    className="flex-1 px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                  />
                  <button
                    type="submit"
                    disabled={subscribeStatus === 'loading'}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </div>
                {subscribeStatus === 'success' && (
                  <p className="text-green-400 text-xs">✓ สมัครรับข่าวสารสำเร็จ!</p>
                )}
                {subscribeStatus === 'error' && (
                  <p className="text-red-400 text-xs">เกิดข้อผิดพลาด กรุณาลองใหม่</p>
                )}
              </form>
            </div>
          </div>

          {/* เกี่ยวกับเรา Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-purple-300">เกี่ยวกับเรา</h4>
            <ul className="space-y-3">
              {footerLinks.aboutUs.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center text-gray-300 hover:text-white hover:translate-x-1 transition-all text-sm group"
                  >
                    <ChevronRight size={16} className="mr-2 text-purple-400 group-hover:text-purple-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* สำหรับนิสิต Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-blue-300">สำหรับนิสิต</h4>
            <ul className="space-y-3">
              {footerLinks.forStudents.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center text-gray-300 hover:text-white hover:translate-x-1 transition-all text-sm group"
                  >
                    <ChevronRight size={16} className="mr-2 text-blue-400 group-hover:text-blue-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ติดต่อเรา */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-indigo-300">ติดต่อเรา</h4>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <MapPin size={18} className="text-purple-400" />
                </div>
                <div className="text-sm text-gray-300">
                  <p>คณะวิทยาศาสตร์</p>
                  <p>มหาวิทยาลัยนเรศวร</p>
                  <p>จ.พิษณุโลก 65000</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Phone size={18} className="text-blue-400" />
                </div>
                <div className="text-sm text-gray-300">
                  <p>055-961-000</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <Mail size={18} className="text-indigo-400" />
                </div>
                <div className="text-sm text-gray-300">
                  <p>science@nu.ac.th</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <a
                href="https://www.facebook.com/SCISMO.NU"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com/scismo_nu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-400 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                aria-label="X (Twitter)"
              >
                <span className="text-sm font-bold">𝕏</span>
              </a>
              <a
                href="https://www.instagram.com/scismo.nu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 rounded-lg flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@scismo.nu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © 2025 <span className="text-white font-semibold">สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร</span> สงวนลิขสิทธิ์
            </div>

            {/* Footer Links & Admin */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                นโยบายความเป็นส่วนตัว
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                เงื่อนไขการใช้งาน
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href={session ? "/admin" : "/auth/signin"}
                className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <Settings size={14} />
                <span>SCISMOGateway</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500">
              {footerLinks.resources.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="hover:text-purple-400 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}