'use client'
import { Phone, ArrowRight, MessageCircle } from 'lucide-react'
import { SiteConfig } from '@/types'

export default function Hero({ config }: { config: SiteConfig }) {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-brand-dark via-red-950 to-brand-primary overflow-hidden pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay:'1s'}} />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-accent/20 border border-brand-accent/30 text-brand-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
              Dịch vụ uy tín hàng đầu
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-3">
              An Toàn Bắt Đầu Từ{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-yellow-300">
                Giải Pháp Đúng
              </span>
            </h1>
            <p className="text-red-200/80 italic text-base mb-6">{config.slogan}</p>
            <p className="text-lg text-red-100 mb-8 leading-relaxed max-w-xl text-justify">
              {config.description}
            </p>

            {/* Stats */}
            <div className="flex gap-8 mb-8">
              {[['500+', 'Khách hàng'], ['10+', 'Năm kinh nghiệm'], ['99%', 'Hài lòng']].map(([num, label]) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-brand-accent">{num}</div>
                  <div className="text-red-200 text-sm">{label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a
                href={`tel:${config.hotline}`}
                className="flex items-center gap-2 bg-brand-accent hover:bg-amber-500 text-white px-7 py-4 rounded-xl font-bold text-lg shadow-xl transition-all transform hover:scale-105"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).gtag)
                    (window as any).gtag('event', 'call_click', {event_category:'hero'})
                }}
              >
                <Phone className="w-5 h-5" />
                Gọi Ngay
              </a>
              <a
                href={config.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-7 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-sm"
              >
                <MessageCircle className="w-5 h-5" />
                {config.ctaText}
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Floating card 1 */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-2xl animate-float z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Tư vấn miễn phí</div>
                    <div className="text-gray-500 text-xs">24/7 hỗ trợ</div>
                  </div>
                </div>
              </div>
              {/* Main image */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl mt-6 mb-6">
                <img
                  src="/images/hero-pccc.jpg"
                  alt="Thiết bị phòng cháy chữa cháy chuyên nghiệp"
                  className="w-full aspect-square object-contain rounded-xl"
                />
              </div>
              {/* Floating card 2 */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-2xl animate-float z-10" style={{animationDelay:'1.5s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{config.hotlineDisplay}</div>
                    <div className="text-gray-500 text-xs">Hotline 24/7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs">Cuộn xuống</span>
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
