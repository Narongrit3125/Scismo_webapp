'use client';

import { Calendar, Users, Award, Heart, Target, Lightbulb, Rocket, BookOpen } from 'lucide-react';
import { Section, Container, SectionHeader, Card, IconBox } from '@/components/ui/SharedComponents';

export default function HistoryPage() {
  const timeline = [
    {
      year: '2010',
      title: 'ก่อตั้งชมรมนักเรียน',
      description: 'การเริ่มต้นจากความคิดริเริ่มของนักเรียนที่ต้องการเป็นส่วนหนึ่งของสังคมนักเรียนที่ดี นำไปสู่การจัดตั้งชมรมนักเรียนอย่างเป็นทางการ',
      icon: Users,
      color: 'purple'
    },
    {
      year: '2015',
      title: 'การพัฒนาองค์กร',
      description: 'ขยายกิจกรรมและความร่วมมือกับสถาบันการศึกษาต่างๆ ทั้งในและต่างประเทศ จัดตั้งคณะกรรมการบริหารอย่างเป็นระบบ',
      icon: Award,
      color: 'blue'
    },
    {
      year: '2020',
      title: 'ยุคดิจิทัล',
      description: 'เปลี่ยนผ่านสู่การจัดกิจกรรมแบบออนไลน์ผ่านสื่อสังคม พัฒนาระบบการจัดการโครงการผ่านแพลตฟอร์มดิจิทัลที่ทันสมัย',
      icon: Rocket,
      color: 'indigo'
    },
    {
      year: '2025',
      title: 'ปัจจุบัน',
      description: 'ชมรมมีสมาชิกกว่า 500 คน พัฒนาโครงการนักเรียนต่างๆ อย่างต่อเนื่อง มีกิจกรรมที่หลากหลายและตอบสนองความต้องการของสมาชิก',
      icon: Heart,
      color: 'pink'
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-32 pb-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">ประวัติชมรมนักเรียน</h1>
            <p className="text-2xl mb-6 text-purple-200 drop-shadow-lg">ประวัติที่ยาวนาน ความทรงจำที่ล้ำค่า</p>
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-lg leading-relaxed text-white">
                ชมรมนักเรียนประวัติยาวนาน ความทรงจำที่ล้ำค่า ตลอดเส้นทางที่เดินมากับกิจกรรมหลากหลาย
                การแลกเปลี่ยน การพัฒนาทักษะ และการสร้างความผูกพัน กับเพื่อนนักเรียนทั่วประเทศ
                จนกลายเป็นครอบครัวใหญ่ในวันนี้
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Timeline Section */}
      <Section variant="light">
        <Container>
          <SectionHeader 
            subtitle="เส้นทางการเดินทาง"
            title="ประวัติความเป็นมา"
            description="ติดตามความเคลื่อนไหวและพัฒนาการของชมรมนักเรียนตั้งแต่อดีตจนถึงปัจจุบัน"
          />

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-200 via-blue-200 to-pink-200"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div key={index} className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Content Card */}
                    <div className={`w-full md:w-5/12 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                      <Card hover className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                            <Icon size={28} />
                          </div>
                          <div className="flex-1">
                            <div className="mb-3">
                              <span className={`inline-block px-4 py-1 bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white text-sm font-bold rounded-full shadow-md`}>
                                {item.year}
                              </span>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Center Dot */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-purple-500 rounded-full shadow-lg z-10"></div>

                    {/* Spacer */}
                    <div className="hidden md:block w-5/12"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* Vision & Mission Section */}
      <Section variant="gradient">
        <Container>
          <SectionHeader 
            subtitle="เป้าหมายของเรา"
            title="วิสัยทัศน์และพันธกิจ"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 bg-white/95 backdrop-blur-md border-white/30 shadow-2xl">
              <div className="flex items-start space-x-4 mb-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">วิสัยทัศน์</h3>
                  <div className="w-20 h-1 bg-purple-500"></div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                มุ่งสู่นักเรียนที่มีความเป็นเลิศในการพัฒนาตนเองอย่างมีคุณภาพ มีความรัก สามัคคี และคุณธรรม 
                และเป็นกำลังสำคัญในการพัฒนาสังคมและประเทศชาติ
              </p>
            </Card>

            <Card className="p-8 bg-white/95 backdrop-blur-md border-white/30 shadow-2xl">
              <div className="flex items-start space-x-4 mb-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">พันธกิจ</h3>
                  <div className="w-20 h-1 bg-blue-500"></div>
                </div>
              </div>
              <ul className="text-gray-700 space-y-3 text-lg">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1 text-xl"></span>
                  <span>ส่งเสริมความเป็นเลิศและพัฒนาทักษะของนักเรียน</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1 text-xl"></span>
                  <span>สร้างโอกาสการเรียนรู้ที่หลากหลาย</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1 text-xl"></span>
                  <span>เสริมสร้างความร่วมมือในชุมชน</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1 text-xl"></span>
                  <span>พัฒนาผู้นำและผู้ประกอบการทำงานเป็นทีม</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Core Values */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-center text-white mb-12 drop-shadow-lg">ค่านิยมหลัก</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card hover className="p-6 bg-white">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg">
                    <BookOpen size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">การเรียนรู้</h4>
                  <p className="text-gray-600">ส่งเสริมความเป็นเลิศทางวิชาการ</p>
                </div>
              </Card>
              
              <Card hover className="p-6 bg-white">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg">
                    <Users size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">ความสามัคคี</h4>
                  <p className="text-gray-600">รักษาความเป็นเพื่อนและช่วยเหลือกันและกัน</p>
                </div>
              </Card>
              
              <Card hover className="p-6 bg-white">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg">
                    <Heart size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">ความรับผิดชอบ</h4>
                  <p className="text-gray-600">มีจิตสำนึกต่อหน้าที่และชุมชน</p>
                </div>
              </Card>
              
              <Card hover className="p-6 bg-white">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg">
                    <Award size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">ความเป็นเลิศ</h4>
                  <p className="text-gray-600">มุ่งมั่นพัฒนาอย่างต่อเนื่อง</p>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}