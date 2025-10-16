"use client";"use client";"use client";

import Link from "next/link";

import { ShieldX, ArrowLeft, Users, Mail } from "lucide-react";import Link from "next/link";import Link from "next/link";



export default function SignUp() {import { ShieldX, ArrowLeft, Users, Mail } from "lucide-react";import { ShieldX, ArrowLeft, Users, Mail } from "lucide-react";

  return (

    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-md w-full space-y-8">

        <div className="bg-white rounded-lg shadow-xl p-8">export default function SignUp() {export default function SignUp() {

          <div className="text-center mb-8">

            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">  return (  return (

              <ShieldX className="h-8 w-8 text-red-600" />

            </div>    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

            <h2 className="text-2xl font-bold text-gray-900">

              ไม่สามารถสมัครสมาชิกได้      <div className="max-w-md w-full space-y-8">      <div className="max-w-md w-full space-y-8">

            </h2>

            <p className="mt-2 text-sm text-gray-600">        <div className="bg-white rounded-lg shadow-xl p-8">        <div className="bg-white rounded-lg shadow-xl p-8">

              ระบบนี้ไม่เปิดให้สมัครสมาชิกด้วยตนเอง

            </p>          <div className="text-center mb-8">          <div className="text-center mb-8">

          </div>

            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">

          <div className="space-y-6">

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">              <ShieldX className="h-8 w-8 text-red-600" />              <ShieldX className="h-8 w-8 text-red-600" />

              <div className="flex items-start">

                <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />            </div>            </div>

                <div>

                  <h3 className="text-sm font-medium text-blue-800">            <h2 className="text-2xl font-bold text-gray-900">            <h2 className="text-2xl font-bold text-gray-900">

                    สำหรับนิสิตคณะวิทยาศาสตร์

                  </h3>              ไม่สามารถสมัครสมาชิกได้              ไม่สามารถสมัครสมาชิกได้

                  <p className="mt-1 text-sm text-blue-700">

                    การสมัครสมาชิกจะดำเนินการผ่านกิจกรรมต้อนรับน้องใหม่ หรือติดต่อคณะกรรมการสโมสรโดยตรง            </h2>            </h2>

                  </p>

                </div>            <p className="mt-2 text-sm text-gray-600">            <p className="mt-2 text-sm text-gray-600">

              </div>

            </div>              ระบบนี้ไม่เปิดให้สมัครสมาชิกด้วยตนเอง              ระบบนี้ไม่เปิดให้สมัครสมาชิกด้วยตนเอง



            <div className="bg-green-50 border border-green-200 rounded-lg p-4">            </p>            </p>

              <div className="flex items-start">

                <Mail className="h-5 w-5 text-green-600 mt-0.5 mr-3" />          </div>          </div>

                <div>

                  <h3 className="text-sm font-medium text-green-800">          <div className="space-y-6">

                    ต้องการข้อมูลเพิ่มเติม?

                  </h3>          <div className="space-y-6">            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">

                  <p className="mt-1 text-sm text-green-700">

                    ติดต่อสโมสรนิสิตคณะวิทยาศาสตร์ผ่านช่องทางต่างๆ ที่ระบุในเว็บไซต์            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">              <div className="flex items-start space-x-3">

                  </p>

                </div>              <div className="flex items-start">                <Users className="h-5 w-5 text-orange-600 mt-0.5" />

              </div>

            </div>                <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />                <div>

          </div>

                <div>                  <h3 className="text-sm font-medium text-orange-800">

          <div className="mt-8 space-y-4">

            <Link                  <h3 className="text-sm font-medium text-blue-800">                    การสมัครสมาชิก

              href="/auth/signin"

              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"                    สำหรับนิสิตคณะวิทยาศาสตร์                  </h3>

            >

              เข้าสู่ระบบ                  </h3>                  <p className="mt-1 text-sm text-orange-700">

            </Link>

                              <p className="mt-1 text-sm text-blue-700">                    เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถลงทะเบียนผู้ใช้ใหม่ได้

            <Link

              href="/"                    การสมัครสมาชิกจะดำเนินการผ่านกิจกรรมต้อนรับน้องใหม่ หรือติดต่อคณะกรรมการสโมสรโดยตรง                  </p>

              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"

            >                  </p>                </div>

              <ArrowLeft className="w-4 h-4 mr-2" />

              กลับหน้าหลัก                </div>              </div>

            </Link>

          </div>              </div>            </div>

        </div>

      </div>            </div>            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

    </div>

  );              <div className="flex items-start space-x-3">

}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />

              <div className="flex items-start">                <div>

                <Mail className="h-5 w-5 text-green-600 mt-0.5 mr-3" />                  <h3 className="text-sm font-medium text-blue-800">

                <div>                    ต้องการเข้าใช้งานระบบ?

                  <h3 className="text-sm font-medium text-green-800">                  </h3>

                    ต้องการข้อมูลเพิ่มเติม?                  <p className="mt-1 text-sm text-blue-700">

                  </h3>                    กรุณาติดต่อผู้ดูแลระบบเพื่อขอสร้างบัญชีผู้ใช้

                  <p className="mt-1 text-sm text-green-700">                  </p>

                    ติดต่อสโมสรนิสิตคณะวิทยาศาสตร์ผ่านช่องทางต่างๆ ที่ระบุในเว็บไซต์                </div>

                  </p>              </div>

                </div>            </div>

              </div>          </div>

            </div>          <div className="mt-8 space-y-3">

          </div>            <Link

              href="/auth/signin"

          <div className="mt-8 space-y-4">              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors"

            <Link            >

              href="/auth/signin"              เข้าสู่ระบบ

              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"            </Link>

            >            <Link

              เข้าสู่ระบบ              href="/"

            </Link>              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"

                        >

            <Link              <ArrowLeft className="h-4 w-4 mr-2" />

              href="/"              กลับหน้าหลัก

              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"            </Link>

            >          </div>

              <ArrowLeft className="w-4 h-4 mr-2" />        </div>

              กลับหน้าหลัก      </div>

            </Link>    </div>

          </div>  );

        </div>}

      </div>
    </div>
  );
}
