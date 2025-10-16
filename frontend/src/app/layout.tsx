import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ErrorBoundaryWrapper from "@/components/ErrorBoundary";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร",
    template: "%s | สโมสรนิสิตคณะวิทยาศาสตร์ NU"
  },
  description: "เว็บไซต์สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร - ศูนย์กลางข่าวสาร กิจกรรม และโครงการต่างๆ ของนิสิตคณะวิทยาศาสตร์",
  keywords: ["สโมสรนิสิต", "คณะวิทยาศาสตร์", "มหาวิทยาลัยนเรศวร", "NU Science", "กิจกรรม", "ข่าวสาร", "โครงการ"],
  authors: [{ name: "Naresuan Science Student Club" }],
  creator: "Naresuan Science Student Club",
  publisher: "Naresuan Science Student Club",
  icons: {
    icon: '/favicon.ico',
    apple: '/images/logo.jpg',
  },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: '/',
    siteName: 'สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร',
    title: 'สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร',
    description: 'ศูนย์กลางข่าวสาร กิจกรรม และโครงการต่างๆ ของนิสิตคณะวิทยาศาสตร์',
    images: [
      {
        url: '/images/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'สโมสรนิสิตคณะวิทยาศาสตร์ NU',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร',
    description: 'ศูนย์กลางข่าวสาร กิจกรรม และโครงการต่างๆ ของนิสิตคณะวิทยาศาสตร์',
    images: ['/images/logo.jpg'],
    creator: '@nuscience',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50`}
      >
        <ErrorBoundaryWrapper>
          <Providers>
            <QueryProvider>
              <Header />
              {/* Add padding-top to account for fixed header (h-20) */}
              <main className="flex-1 pt-20">
                {children}
              </main>
              <Footer />
            </QueryProvider>
          </Providers>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
