"use client";
import Link from "next/link";
import { ShieldX, ArrowLeft, LogIn, AlertCircle } from "lucide-react";

export default function SignUp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldX className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              การสมัครสมาชิก
            </h2>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    ไม่สามารถสมัครสมาชิกได้ในขณะนี้
                  </h3>
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    ระบบนี้ไม่เปิดให้สมัครสมาชิกด้วยตนเอง 
                    กรุณาติดต่อผู้ดูแลระบบเพื่อขอรับบัญชีผู้ใช้งาน
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  วิธีการขอบัญชีผู้ใช้งาน:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>ติดต่อผู้ดูแลระบบสโมสรนิสิต</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>แจ้งข้อมูลส่วนตัวและตำแหน่งที่ต้องการ</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>รอรับข้อมูลการเข้าสู่ระบบทาง E-mail</span>
                  </li>
                </ul>
              </div>

              <Link 
                href="/auth/signin" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center font-medium shadow-lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                เข้าสู่ระบบ
              </Link>
              
              <Link 
                href="/" 
                className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                กลับหน้าหลัก
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                หากมีปัญหาหรือข้อสงสัย กรุณาติดต่อ{" "}
                <a href="mailto:science@nu.ac.th" className="text-yellow-600 hover:text-yellow-700 font-medium">
                  science@nu.ac.th
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
