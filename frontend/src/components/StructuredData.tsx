import Script from 'next/script'

interface StructuredDataProps {
  data: Record<string, any>
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร',
  alternateName: 'NU Science Student Club',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/images/logo.jpg`,
  sameAs: [
    // Add social media URLs here
    // 'https://www.facebook.com/nuscience',
    // 'https://twitter.com/nuscience',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    availableLanguage: ['Thai', 'English'],
  },
}

// WebSite Schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

// Article Schema Generator
export function generateArticleSchema(article: {
  title: string
  description: string
  image?: string
  publishedAt: string
  author: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.jpg`,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  }
}

// Event Schema Generator
export function generateEventSchema(event: {
  title: string
  description: string
  startDate: string
  endDate?: string
  location: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    location: {
      '@type': 'Place',
      name: event.location,
    },
    image: event.image || `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.jpg`,
    organizer: {
      '@type': 'Organization',
      name: 'สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  }
}
