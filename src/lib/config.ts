import { SiteConfig } from '@/types'
import siteConfig from '../../public/config.json'

// Import trực tiếp để config được bundle vào serverless function (Vercel không đọc được
// public/ bằng fs lúc runtime). Sửa config.json cần build/deploy lại.
export async function getSiteConfig(): Promise<SiteConfig> {
  return { ...getDefaultConfig(), ...siteConfig } as SiteConfig
}

// Đảm bảo BASE_URL luôn có protocol (https://)
// Railway đôi khi inject domain không có protocol vào biến môi trường
export function getBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return raw.startsWith('http') ? raw : `https://${raw}`
}

export function getDefaultConfig(): SiteConfig {
  return {
    companyName: 'Công Ty ABC',
    slogan: 'Giải Pháp Chuyên Nghiệp',
    description: 'Chúng tôi cung cấp giải pháp toàn diện cho doanh nghiệp',
    hotline: '+84909123456',
    hotlineDisplay: '0909 123 456',
    email: 'info@abc.vn',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    facebook: 'https://facebook.com',
    messenger: 'https://m.me/page',
    zalo: 'https://zalo.me/0909123456',
    tiktok: 'https://tiktok.com',
    youtube: 'https://youtube.com',
    googleMapEmbed: '',
    googleBusinessUrl: 'https://maps.google.com',
    workingHours: 'Thứ 2 - Thứ 7: 8:00 - 18:00',
    ctaText: 'Nhận Báo Giá Miễn Phí',
    gaId: '',
    logo: '/images/logo.svg',
    ogImage: '/images/og-image.jpg'
  }
}
