# 🚀 Production Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
สร้างไฟล์ `.env.production` ที่ production server:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_SITE_NAME="สโมสรนิสิตคณะวิทยาศาสตร์ มหาวิทยาลัยนเรศวร"

# Database
DATABASE_URL="your-production-database-url"

# NextAuth Configuration
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-strong-secret-with-openssl-rand-base64-32"

# Development Features
NEXT_PUBLIC_SHOW_TEST_ACCOUNTS="false"

# SEO & Analytics
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="your-google-verification-code"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Error Logging (Sentry)
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"

# API Configuration
NEXT_PUBLIC_API_URL="https://yourdomain.com/api"

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE="10485760"
```

### 2. Generate Secure Keys

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Update in .env.production
```

### 3. Database Migration

```bash
# Run migrations on production database
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### 4. Build Application

```bash
# Install dependencies
npm ci --production=false

# Build for production
npm run build

# Test production build locally
npm start
```

## 📊 Analytics Setup

### Google Analytics 4
1. สร้าง Property ใน Google Analytics
2. คัดลอก Measurement ID (G-XXXXXXXXXX)
3. เพิ่ม `NEXT_PUBLIC_GA_MEASUREMENT_ID` ใน environment variables

### Google Search Console
1. ยืนยันความเป็นเจ้าของเว็บไซต์
2. คัดลอก verification code
3. เพิ่ม `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` ใน environment variables

## 🐛 Error Logging Setup (Sentry)

### 1. สร้าง Sentry Project
```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard -i nextjs
```

### 2. Configure Sentry
เพิ่ม environment variables ที่จำเป็นตาม `.env.example`

## 🖼️ Image Optimization

### CDN Setup (Recommended)
1. ตั้งค่า CDN (Cloudflare, CloudFront, etc.)
2. อัพโหลดรูปภาพไปยัง CDN
3. อัปเดต image paths ในโค้ด

### Next.js Image Optimization
- ใช้ `next/image` component แทน `<img>` tags
- รูปภาพจะถูก optimize อัตโนมัติ
- รองรับ WebP และ AVIF formats

## 🔒 Security

### Headers Configuration
Security headers ถูกตั้งค่าไว้แล้วใน `next.config.ts`:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security
- Permissions-Policy

### SSL/TLS Certificate
- ใช้ Let's Encrypt สำหรับ free SSL certificate
- หรือใช้ Cloudflare SSL

## ⚡ Performance Optimization

### 1. Enable Caching
```nginx
# Nginx example
location /_next/static {
    expires 365d;
    add_header Cache-Control "public, immutable";
}

location /images {
    expires 365d;
    add_header Cache-Control "public, immutable";
}
```

### 2. Enable Compression
- Gzip compression เปิดใช้งานอยู่แล้ว
- พิจารณาใช้ Brotli compression

### 3. CDN Configuration
- Cloudflare (Free tier available)
- AWS CloudFront
- Vercel Edge Network

## 🧪 Testing

### Browser Testing
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Device Testing
- ✅ Desktop (1920x1080, 1366x768)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iPhone, Android phones)

### Tools
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

## 📱 Responsive Design Testing

```bash
# Use Chrome DevTools
F12 -> Toggle Device Toolbar (Ctrl+Shift+M)

# Test these breakpoints:
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 2: VPS/Cloud Server
```bash
# PM2 for process management
npm install -g pm2

# Start application
pm2 start npm --name "smowebnet" -- start

# Save process list
pm2 save

# Auto-start on reboot
pm2 startup
```

### Option 3: Docker
```dockerfile
# Dockerfile example
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

## 📈 Monitoring

### 1. Application Monitoring
- Sentry for error tracking
- Google Analytics for user behavior
- Uptime monitoring (UptimeRobot, Pingdom)

### 2. Performance Monitoring
- Next.js Analytics (Vercel)
- Google PageSpeed Insights
- Web Vitals monitoring

### 3. Server Monitoring
- CPU and Memory usage
- Disk space
- Network traffic

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      # Add deployment steps here
```

## 📝 Post-Deployment

### 1. Verify Deployment
- ✅ เว็บไซต์เข้าถึงได้
- ✅ SSL certificate ใช้งานได้
- ✅ All pages load correctly
- ✅ Authentication works
- ✅ Database connections work
- ✅ File uploads work

### 2. SEO Verification
- ✅ Submit sitemap to Google Search Console
- ✅ robots.txt configured correctly
- ✅ Meta tags present on all pages
- ✅ Open Graph tags working

### 3. Performance Check
- ✅ Run PageSpeed Insights
- ✅ Check Core Web Vitals
- ✅ Test load time

## 🆘 Troubleshooting

### Common Issues

**Issue**: Application won't start
```bash
# Check logs
pm2 logs smowebnet

# Restart application
pm2 restart smowebnet
```

**Issue**: Database connection fails
- Check DATABASE_URL is correct
- Verify database server is running
- Check firewall rules

**Issue**: Images not loading
- Check file permissions
- Verify upload directory exists
- Check CDN configuration

## 📞 Support

For issues or questions:
- Create GitHub issue
- Contact: admin@smo.com

---

**Last Updated**: 2025-10-14
**Version**: 1.0.0
