'use client';

import { Users, Crown, Award, Star, Briefcase, UserCheck, Target, Zap, CheckCircle } from 'lucide-react';
import { Section, Container, SectionHeader, Card } from '@/components/ui/SharedComponents';

export default function OrganizationPage() {
  const structure = [
    {
      level: 'ระดับบริหาร',
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      positions: [
        { title: 'ประธานสโมสร', description: 'นำองค์กรและกำหนดนโยบาย', icon: Crown },
        { title: 'รองประธานสโมสร', description: 'ช่วยงานประธานและดูแลกิจกรรม', icon: Award },
        { title: 'เลขานุการ', description: 'จัดการเอกสารและการประชุม', icon: Briefcase },
        { title: 'เหรัญญิก', description: 'ดูแลงบประมาณและการเงิน', icon: Target }
      ]
    },
    {
      level: 'ระดับฝ่าย',
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
      positions: [
        { title: 'ฝ่ายวิชาการ', description: 'จัดกิจกรรมทางวิชาการและการเรียนรู้', icon: Award },
        { title: 'ฝ่ายกิจกรรม', description: 'จัดกิจกรรมสันทนาการและสร้างสรรค์', icon: Star },
        { title: 'ฝ่ายประชาสัมพันธ์', description: 'ดูแลการสื่อสารและประชาสัมพันธ์', icon: Users },
        { title: 'ฝ่ายบริการ', description: 'ให้บริการและสนับสนุนนิสิต', icon: UserCheck }
      ]
    },
    {
      level: 'ระดับปฏิบัติการ',
      icon: UserCheck,
      color: 'from-indigo-500 to-indigo-600',
      positions: [
        { title: 'หัวหน้าโครงการ', description: 'ดูแลโครงการเฉพาะด้าน', icon: Zap },
        { title: 'ผู้ช่วยฝ่าย', description: 'สนับสนุนการทำงานของแต่ละฝ่าย', icon: Users },
        { title: 'อาสาสมัคร', description: 'ร่วมกิจกรรมและให้ความช่วยเหลือ', icon: Star }
      ]
    }
  ];

  const committees = [
    {
      name: 'คณะกรรมการบริหาร',
      description: 'กำหนดนโยบายและทิศทางขององค์กร',
      icon: Crown,
      color: 'purple'
    },
    {
      name: 'คณะกรรมการวิชาการ',
      description: 'ดูแลกิจกรรมทางวิชาการและการเรียนรู้',
      icon: Award,
      color: 'blue'
    },
    {
      name: 'คณะกรรมการกิจกรรม',
      description: 'จัดกิจกรรมเสริมหลักสูตรและพัฒนาทักษะ',
      icon: Star,
      color: 'indigo'
    },
    {
      name: 'คณะกรรมการประชาสัมพันธ์',
      description: 'ดูแลการสื่อสารและการประชาสัมพันธ์',
      icon: Users,
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
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">โครงสร้างองค์กร</h1>
            <p className="text-2xl mb-6 text-purple-200 drop-shadow-lg">สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร</p>
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-lg leading-relaxed text-white">
                องค์กรที่มีโครงสร้างการบริหารที่ชัดเจน มีคณะกรรมการและฝ่ายงานต่างๆ 
                ที่ทำงานร่วมกันเพื่อพัฒนานิสิตและองค์กรอย่างมีประสิทธิภาพ
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Organization Structure */}
      <Section variant="light">
        <Container>
          <SectionHeader 
            subtitle="โครงสร้าง"
            title="โครงสร้างการบริหาร"
            description="แบ่งตามระดับความรับผิดชอบและหน้าที่ของแต่ละตำแหน่ง"
          />

          <div className="space-y-8">
            {structure.map((level, index) => {
              const LevelIcon = level.icon;
              return (
                <Card key={index} hover className="p-8">
                  <div className="flex items-center mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${level.color} rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                      <LevelIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{level.level}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {level.positions.map((position, idx) => {
                      const PositionIcon = position.icon;
                      return (
                        <div key={idx} className="group p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200">
                          <div className="flex items-center mb-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${level.color} rounded-lg flex items-center justify-center mr-3 shadow-md group-hover:scale-110 transition-transform`}>
                              <PositionIcon className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900">{position.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{position.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Committees Section */}
      <Section variant="gradient">
        <Container>
          <SectionHeader 
            subtitle="คณะกรรมการ"
            title="คณะกรรมการต่างๆ"
            description="คณะกรรมการที่ดูแลและขับเคลื่อนงานในแต่ละด้าน"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {committees.map((committee, index) => {
              const Icon = committee.icon;
              const colorClasses = {
                purple: 'from-purple-500 to-purple-600',
                blue: 'from-blue-500 to-blue-600',
                indigo: 'from-indigo-500 to-indigo-600',
                pink: 'from-pink-500 to-pink-600'
              };
              
              return (
                <Card key={index} hover className="p-6 bg-white/95 backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${colorClasses[committee.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{committee.name}</h3>
                      <p className="text-gray-600 leading-relaxed">{committee.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Process Flow */}
      <Section variant="light">
        <Container>
          <SectionHeader 
            subtitle="กระบวนการ"
            title="กระบวนการทำงาน"
            description="ขั้นตอนการดำเนินงานที่มีประสิทธิภาพ"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Target className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">ขั้นตอนที่ 1</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">วางแผน</h4>
              <p className="text-gray-600">คณะกรรมการบริหารกำหนดนโยบายและแผนงานอย่างชัดเจน</p>
            </Card>

            <Card hover className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">ขั้นตอนที่ 2</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">ดำเนินการ</h4>
              <p className="text-gray-600">ฝ่ายต่างๆ ดำเนินกิจกรรมและโครงการตามแผนที่กำหนด</p>
            </Card>

            <Card hover className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">ขั้นตอนที่ 3</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">ประเมินผล</h4>
              <p className="text-gray-600">ติดตามและประเมินผลการดำเนินงานเพื่อนำไปปรับปรุง</p>
            </Card>
          </div>
        </Container>
      </Section>
    </main>
  );
}
