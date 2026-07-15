'use client'
import { Phone, Shield, FileText, Users, Trophy, Star, ShieldCheck, Lightbulb, Wrench, Headphones, ArrowRight } from 'lucide-react'
import { SiteConfig } from '@/types'

const SERVICES = ['Tư Vấn', 'Thiết Kế', 'Thi Công', 'Bảo Trì']

const STATS = [
  { icon: <Users className="w-6 h-6 text-brand-accent" />, value: '500+', label: 'Khách hàng tin tưởng' },
  { icon: <Trophy className="w-6 h-6 text-brand-accent" />, value: '10+', label: 'Năm kinh nghiệm trong ngành' },
  { icon: <Star className="w-6 h-6 text-brand-accent" />, value: '99%', label: 'Khách hàng hài lòng' },
]

const FEATURES = [
  { icon: <ShieldCheck className="w-6 h-6" />, title: 'Đạt chuẩn PCCC', sub: 'Theo quy định hiện hành' },
  { icon: <Lightbulb className="w-6 h-6" />, title: 'Giải pháp tối ưu', sub: 'Phù hợp mọi công trình' },
  { icon: <Wrench className="w-6 h-6" />, title: 'Thi công chuyên nghiệp', sub: 'Đúng tiến độ, đúng kỹ thuật' },
  { icon: <Headphones className="w-6 h-6" />, title: 'Bảo trì tận tâm', sub: 'Hỗ trợ nhanh chóng 24/7' },
]

export default function Hero({ config }: { config: SiteConfig }) {
  return (
    <section className="relative flex flex-col overflow-hidden pt-20"
      style={{ background: 'linear-gradient(135deg, #1a0000 0%, #3d0000 40%, #7b0000 100%)' }}
    >
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <img src="/images/hero-bg.jpg" alt="" className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center py-16">

            {/* ── Left: Text ── */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-red-400/50 bg-red-700/40 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                <Shield className="w-4 h-4 text-brand-accent flex-shrink-0" />
                Đơn vị PCCC uy tín hàng đầu
              </div>

              {/* H1 */}
              <h1 className="font-display font-black uppercase mb-4" style={{ fontSize: '2rem', lineHeight: '1.5' }}>
                <span className="text-white block">Giải Pháp PCCC</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-yellow-300 block">
                  Cho Công Trình An Toàn
                </span>
              </h1>

              {/* Slogan */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-brand-accent text-3xl font-serif leading-none select-none">&ldquo;</span>
                <p className="text-white/80 italic text-sm md:text-base">{config.slogan}</p>
                <span className="text-brand-accent text-3xl font-serif leading-none select-none">&rdquo;</span>
                <div className="flex-1 h-px bg-gradient-to-r from-brand-accent/60 to-transparent hidden md:block" />
              </div>

              {/* Service pills */}
              <div className="inline-flex items-center border-2 border-red-500/70 rounded-full px-4 py-2 mb-6">
                {SERVICES.map((s, i) => (
                  <span key={s} className="flex items-center text-white/90 text-xs font-bold uppercase tracking-widest">
                    <span className="text-brand-accent mx-2">•</span>
                    {s}
                    {i === SERVICES.length - 1 && <span className="text-brand-accent ml-2">•</span>}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-red-100/85 text-base leading-relaxed mb-8 max-w-lg">
                {config.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <a
                  href={`tel:${config.hotline}`}
                  className="flex items-center gap-3 bg-brand-accent hover:bg-amber-500 text-white px-6 py-3 rounded-xl shadow-xl transition-all hover:scale-105"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).gtag)
                      (window as any).gtag('event', 'call_click', { event_category: 'hero' })
                  }}
                >
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-black uppercase">Gọi Ngay</div>
                    <div className="text-xs opacity-85">Tư vấn miễn phí</div>
                  </div>
                </a>
                <a
                  href={config.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-xl transition-all backdrop-blur-sm"
                >
                  <FileText className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-black uppercase">Nhận Báo Giá</div>
                    <div className="text-xs opacity-75">Báo giá nhanh chóng</div>
                  </div>
                </a>
                <a
                  href="#products"
                  className="flex items-center gap-1.5 text-white/75 hover:text-white text-sm font-semibold transition-colors"
                >
                  Xem dịch vụ <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                {STATS.map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    {s.icon}
                    <div>
                      <div className="text-2xl font-black text-brand-accent leading-none">{s.value}</div>
                      <div className="text-red-200 text-xs leading-tight mt-0.5">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Image ── */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-[400px]">
                {/* Floating card top */}
                <div className="absolute -top-4 left-4 bg-white rounded-2xl px-4 py-3 shadow-2xl animate-float z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold text-base">✓</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">Tư vấn miễn phí</div>
                      <div className="text-gray-400 text-xs">Hỗ trợ 24/7</div>
                    </div>
                  </div>
                </div>

                {/* Main image card */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl mt-8 mb-8">
                  <img
                    src="/images/hero-pccc.jpg"
                    alt="Thiết bị phòng cháy chữa cháy chuyên nghiệp"
                    className="w-full aspect-square object-contain rounded-xl"
                  />
                </div>

                {/* Floating card bottom */}
                <div className="absolute -bottom-4 right-4 bg-white rounded-2xl px-4 py-3 shadow-2xl animate-float z-10" style={{ animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{config.hotlineDisplay}</div>
                      <div className="text-gray-400 text-xs">Hotline 24/7</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom feature bar — nền đỏ tối ── */}
      <div className="relative z-10 bg-black/25 border-t border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`flex items-center gap-4 py-5 px-6 ${i < 3 ? 'border-r border-white/10' : ''}`}
              >
                <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-brand-accent flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{f.title}</div>
                  <div className="text-red-200/70 text-xs">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
