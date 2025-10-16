import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  author?: string
}

const defaultMetadata = {
  siteName: 'สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  defaultImage: '/images/logo.jpg',
  twitterHandle: '@nuscience',
}

export function generateSEO({
  title,
  description,
  keywords = [],
  image = defaultMetadata.defaultImage,
  url,
  type = 'website',
  publishedTime,
  author,
}: SEOProps): Metadata {
  const fullTitle = `${title} | ${defaultMetadata.siteName}`
  const fullUrl = url ? `${defaultMetadata.siteUrl}${url}` : defaultMetadata.siteUrl
  const fullImage = image.startsWith('http') ? image : `${defaultMetadata.siteUrl}${image}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : [{ name: defaultMetadata.siteName }],
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: defaultMetadata.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'th_TH',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: defaultMetadata.twitterHandle,
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
  }

  // Add article-specific metadata
  if (type === 'article' && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
    }
  }

  return metadata
}

// Common metadata presets
export const seoPresets = {
  home: {
    title: 'หน้าแรก',
    description: 'สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร - ศูนย์กลางข่าวสาร กิจกรรม และโครงการต่างๆ ของนิสิตคณะวิทยาศาสตร์',
    keywords: ['สโมสรนิสิต', 'คณะวิทยาศาสตร์', 'มหาวิทยาลัยนเรศวร', 'NU Science', 'กิจกรรม', 'ข่าวสาร'],
  },
  news: {
    title: 'ข่าวสาร',
    description: 'ข่าวสารและประชาสัมพันธ์จากสโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร',
    keywords: ['ข่าวสาร', 'ประชาสัมพันธ์', 'สโมสรนิสิต', 'คณะวิทยาศาสตร์'],
  },
  activities: {
    title: 'กิจกรรม',
    description: 'กิจกรรมและโครงการต่างๆ ของสโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร',
    keywords: ['กิจกรรม', 'โครงการ', 'สโมสรนิสิต', 'คณะวิทยาศาสตร์'],
  },
  projects: {
    title: 'โครงการ',
    description: 'โครงการและแผนงานของสโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร',
    keywords: ['โครงการ', 'แผนงาน', 'สโมสรนิสิต'],
  },
  members: {
    title: 'สมาชิก',
    description: 'สมาชิกสโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร',
    keywords: ['สมาชิก', 'นิสิต', 'สโมสร'],
  },
  staff: {
    title: 'คณะกรรมการ',
    description: 'คณะกรรมการบริหารสโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร',
    keywords: ['คณะกรรมการ', 'ผู้บริหาร', 'สโมสรนิสิต'],
  },
  documents: {
    title: 'เอกสาร',
    description: 'เอกสารและข้อมูลต่างๆ ของสโมสรนิสิตคณะวิทยาศาสตร์',
    keywords: ['เอกสาร', 'ข้อมูล', 'ดาวน์โหลด'],
  },
  about: {
    title: 'เกี่ยวกับเรา',
    description: 'ประวัติและข้อมูลของสโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร',
    keywords: ['เกี่ยวกับ', 'ประวัติ', 'โครงสร้าง'],
  },
}
