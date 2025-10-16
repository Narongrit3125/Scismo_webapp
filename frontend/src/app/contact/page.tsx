'use client';

import { useState } from 'react';
import { Section, Container, Card, Badge, Button } from '@/components/ui/SharedComponents';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Facebook, 
  Twitter, 
  Instagram, 
  MessageSquare,
  Building,
  User,
  MessageCircle
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-32 pb-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">ติดต่อเรา</h1>
            <p className="text-xl text-purple-200 drop-shadow-lg">
              สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร
            </p>
            <p className="text-lg text-purple-200 mt-2 drop-shadow-lg">
              ยินดีให้บริการและตอบคำถามทุกข้อสงสัย
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Information Cards */}
      <Section variant="light" className="-mt-10 relative z-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Location */}
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">ที่ตั้ง</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                คณะวิทยาศาสตร์<br />
                มหาวิทยาลัยนเรศวร<br />
                จ.พิษณุโลก 65000
              </p>
            </Card>

            {/* Phone */}
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">โทรศัพท์</h3>
              <a 
                href="tel:055-961000" 
                className="text-gray-600 hover:text-purple-600 transition-colors text-sm block"
              >
                055-961000
              </a>
              <p className="text-gray-500 text-xs mt-1">จันทร์-ศุกร์ 8:30-16:30</p>
            </Card>

            {/* Email */}
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">อีเมล</h3>
              <a 
                href="mailto:scismo@nu.ac.th" 
                className="text-gray-600 hover:text-purple-600 transition-colors text-sm block"
              >
                scismo@nu.ac.th
              </a>
              <p className="text-gray-500 text-xs mt-1">ตอบกลับภายใน 24 ชม.</p>
            </Card>

            {/* Office Hours */}
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">เวลาทำการ</h3>
              <p className="text-gray-600 text-sm">
                จันทร์ - ศุกร์<br />
                08:30 - 16:30 น.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section variant="light">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">ส่งข้อความถึงเรา</h2>
                <p className="text-gray-600">
                  กรอกแบบฟอร์มด้านล่าง เราจะติดต่อกลับโดยเร็วที่สุด
                </p>
              </div>

              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="กรอกชื่อ-นามสกุล"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      อีเมล <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      เบอร์โทรศัพท์
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="08X-XXX-XXXX"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      หัวข้อ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="หัวข้อที่ต้องการติดต่อ"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      ข้อความ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-3 text-gray-400" size={20} />
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="รายละเอียดเพิ่มเติม..."
                      />
                    </div>
                  </div>

                  {/* Submit Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">
                        ✓ ส่งข้อความสำเร็จ! เราจะติดต่อกลับโดยเร็วที่สุด
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">
                        ✗ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        กำลังส่ง...
                      </>
                    ) : (
                      <>
                        <Send size={20} className="mr-2" />
                        ส่งข้อความ
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Additional Information */}
            <div className="space-y-8">
              {/* Map */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">แผนที่</h2>
                <Card className="overflow-hidden h-80">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3779.8326445842844!2d100.26179731490058!3d16.748048388401166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30dfba5e94c4b5ab%3A0x5e1ab0e8e9f2e5b0!2sNaresuan%20University%20Faculty%20of%20Science!5e0!3m2!1sen!2sth!4v1234567890123!5m2!1sen!2sth"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </Card>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">ติดตามเราได้ที่</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Facebook size={24} />
                    <span className="font-medium">Facebook</span>
                  </a>

                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Twitter size={24} />
                    <span className="font-medium">X (Twitter)</span>
                  </a>

                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Instagram size={24} />
                    <span className="font-medium">Instagram</span>
                  </a>

                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <MessageSquare size={24} />
                    <span className="font-medium">TikTok</span>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Building className="w-6 h-6 mr-2 text-purple-600" />
                  ข้อมูลเพิ่มเติม
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>
                      <strong>ที่อยู่:</strong> อาคารคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร 
                      ต.ท่าโพธิ์ อ.เมือง จ.พิษณุโลก 65000
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>
                      <strong>เวลาทำการ:</strong> จันทร์ - ศุกร์ เวลา 08:30 - 16:30 น. 
                      (ปิดวันเสาร์ - อาทิตย์ และวันหยุดนักขัตฤกษ์)
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>
                      <strong>การเดินทาง:</strong> สามารถเดินทางโดยรถโดยสารประจำทาง 
                      สาย 8, 12 หรือรถแท็กซี่จากตัวเมืองพิษณุโลก
                    </p>
                  </div>
                </div>
              </Card>

              {/* FAQ Quick Info */}
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
                <h3 className="text-xl font-bold text-gray-900 mb-4">คำถามที่พบบ่อย</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900">Q: ติดต่อสโมสรนิสิตได้อย่างไร?</p>
                    <p className="text-gray-700 mt-1">A: สามารถติดต่อผ่านแบบฟอร์ม, โทรศัพท์, อีเมล หรือ Social Media</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Q: ตอบกลับใช้เวลานานไหม?</p>
                    <p className="text-gray-700 mt-1">A: เราตอบกลับภายใน 24 ชั่วโมงในวันทำการ</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Q: สามารถมาติดต่อด้วยตนเองได้ไหม?</p>
                    <p className="text-gray-700 mt-1">A: ได้เลย! เวลาทำการ จันทร์-ศุกร์ 08:30-16:30 น.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
