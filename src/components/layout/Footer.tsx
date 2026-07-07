import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Youtube } from 'lucide-react'
import { SiteConfig } from '@/types'
import Logo from '@/components/ui/Logo'

export default function Footer({ config }: { config: SiteConfig }) {
  return (
    <footer className="bg-brand-dark text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo config={config} size={40} />
              <h3 className="text-white font-display font-bold text-xl">{config.companyName}</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">{config.description}</p>
            <div className="flex items-center gap-3">
              <a href={config.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-brand-primary rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={config.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-brand-primary rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.91a8.16 8.16 0 004.77 1.52V7.01a4.85 4.85 0 01-1-.32z"/></svg>
              </a>
              <a href={config.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href={config.zalo} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.84 1.276 5.39 3.36 7.16-.16.96-.59 2.27-1.43 3.39-.13.18.03.42.25.36 1.7-.46 3.06-1.32 3.8-1.89.93.27 1.93.41 2.97.41h.1c5.523 0 10.04-4.14 10.04-9.24C21.1 6.145 17.523 2 12 2z" fill="currentColor"/>
                  <text x="12" y="14.8" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0F172A">Z</text>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-3">
              {[['Trang Chủ', '/'], ['Giới Thiệu', '/#about'], ['Dịch Vụ', '/#services'], ['Blog', '/blog'], ['Liên Hệ', '/#contact']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-white transition-colors hover:pl-1 duration-200 block">
                    → {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Thông Tin Liên Hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                <a href={`tel:${config.hotline}`} className="text-gray-400 hover:text-white transition-colors">{config.hotlineDisplay}</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                <a href={`mailto:${config.email}`} className="text-gray-400 hover:text-white transition-colors">{config.email}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">{config.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">{config.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} {config.companyName}. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/chinh-sach-bao-mat" className="hover:text-white transition-colors">Chính Sách Bảo Mật</Link>
            <Link href="/dieu-khoan-su-dung" className="hover:text-white transition-colors">Điều Khoản Sử Dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
