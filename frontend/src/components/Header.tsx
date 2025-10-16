'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Home, Users, Calendar, FileText, FolderOpen, ChevronDown, Settings, LogOut, User, Facebook, Instagram, Youtube, Search, Bell, MessageCircle } from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = useMemo(() => [
    { name: 'หน้าแรก', href: '/', icon: Home },
    { 
      name: 'เกี่ยวกับ', 
      href: '#',
      icon: Users,
      dropdown: [
        { 
          name: 'ประวัติสโมสร', 
          href: '/about/history',
          icon: FileText,
          description: 'ประวัติความเป็นมาของสโมสรนิสิต'
        },
        { 
          name: 'โครงสร้างองค์กร', 
          href: '/about/organization',
          icon: Users,
          description: 'โครงสร้างการบริหารงาน'
        },
        { 
          name: 'สมาชิกสโมสรนิสิต', 
          href: '/members',
          icon: User,
          description: 'ข้อมูลสมาชิกสโมสรนิสิต'
        }
      ]
    },
    { 
      name: 'สำหรับนิสิต', 
      href: '#',
      icon: FileText,
      dropdown: [
        { 
          name: 'ข่าวสาร', 
          href: '/news',
          icon: Bell,
          description: 'ข่าวสารและประชาสัมพันธ์'
        },
        { 
          name: 'กิจกรรม', 
          href: '/activities',
          icon: Calendar,
          description: 'กิจกรรมและโครงการ'
        },
        { 
          name: 'เอกสาร', 
          href: '/documents',
          icon: FileText,
          description: 'เอกสารและแบบฟอร์มต่างๆ'
        }
      ]
    },
    { 
      name: 'บุคลากร', 
      href: '#',
      icon: FolderOpen,
      dropdown: [
        { 
          name: 'คณะกรรมการ', 
          href: '/staff',
          icon: Users,
          description: 'คณะกรรมการบริหารสโมสร'
        },
        { 
          name: 'โครงการ', 
          href: '/projects',
          icon: FolderOpen,
          description: 'โครงการและกิจกรรมต่างๆ'
        }
      ]
    },
    { name: 'ติดต่อ', href: '/contact', icon: MessageCircle }
  ], []);

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-lg' 
          : 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600'
      }`}
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg transition-transform group-hover:scale-110">
              <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden lg:block">
              <h1 className={`text-lg font-bold transition-colors ${
                scrolled ? 'text-purple-700' : 'text-white'
              }`}>
                สโมสรนิสิตคณะวิทยาศาสตร์
              </h1>
              <p className={`text-sm transition-colors ${
                scrolled ? 'text-purple-600' : 'text-white/90'
              }`}>
                Naresuan Science Student Club
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const hasDropdown = item.dropdown && item.dropdown.length > 0;
              
              return (
                <div key={item.name} className="relative group">
                  {hasDropdown ? (
                    <button
                      onClick={() => handleDropdownToggle(item.name)}
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      className={`flex items-center space-x-1 px-4 py-3 rounded-lg transition-all ${
                        scrolled
                          ? 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <item.icon size={18} />
                      <span className="font-medium">{item.name}</span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-1 px-4 py-3 rounded-lg transition-all ${
                        scrolled
                          ? 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <item.icon size={18} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )}
                  
                  {/* Extended Dropdown Menu - Devin Style */}
                  {hasDropdown && (
                    <div 
                      className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 transition-all duration-300 ${
                        activeDropdown === item.name 
                          ? 'opacity-100 visible translate-y-0' 
                          : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                      }`}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.dropdown?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="flex items-start px-4 py-3 hover:bg-purple-50 transition-colors group"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            {dropdownItem.icon && <dropdownItem.icon size={20} className="text-purple-600" />}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="font-semibold text-gray-900 group-hover:text-purple-700">
                              {dropdownItem.name}
                            </div>
                            {dropdownItem.description && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {dropdownItem.description}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <button className={`p-2 rounded-lg transition-colors ${
              scrolled 
                ? 'text-gray-600 hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
            }`}>
              <Search size={20} />
            </button>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                >
                  <User size={18} />
                  <span className="font-medium">{session.user.name || 'ผู้ใช้'}</span>
                  <ChevronDown size={14} />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2">
                    <Link 
                      href="/profile" 
                      className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-purple-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={18} className="mr-3 text-purple-600" />
                      โปรไฟล์
                    </Link>
                    {session.user.role === 'ADMIN' && (
                      <Link 
                        href="/admin" 
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-purple-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={18} className="mr-3 text-purple-600" />
                        จัดการระบบ
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={() => signOut()}
                      className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} className="mr-3" />
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/auth/signin" 
                className="flex items-center space-x-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <User size={18} />
                <span>เข้าสู่ระบบ</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const hasDropdown = item.dropdown && item.dropdown.length > 0;
              
              return (
                <div key={item.name}>
                  {hasDropdown ? (
                    <>
                      <button
                        onClick={() => handleDropdownToggle(item.name)}
                        className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon size={20} />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <ChevronDown size={16} className={`transition-transform ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      </button>
                      {activeDropdown === item.name && (
                        <div className="ml-6 mt-2 space-y-1">
                          {item.dropdown?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setActiveDropdown(null);
                              }}
                            >
                              {dropdownItem.icon && <dropdownItem.icon size={18} className="mr-2" />}
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )}
                </div>
              );
            })}

            {/* Mobile Auth Section */}
            {session ? (
              <div className="pt-4 border-t border-gray-200 space-y-1">
                <Link 
                  href="/profile" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} className="mr-3" />
                  โปรไฟล์
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link 
                    href="/admin" 
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings size={20} className="mr-3" />
                    จัดการระบบ
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut size={20} className="mr-3" />
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200">
                <Link 
                  href="/auth/signin" 
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} />
                  <span>เข้าสู่ระบบ</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}