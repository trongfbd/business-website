import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { SiteConfig } from '@/types'

export default function Contact({ config }: { config: SiteConfig }) {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand-primary font-semibold uppercase tracking-widest text-sm">Liên Hệ</span>
          <h2 className="text-4xl font-display font-bold text-brand-dark mt-2 mb-4">Hãy Liên Hệ Với Chúng Tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn. Liên hệ ngay để được phục vụ tốt nhất.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="space-y-6">
              {[
                { icon: <Phone />, label: 'Hotline', value: config.hotlineDisplay, href: `tel:${config.hotline}` },
                { icon: <Mail />, label: 'Email', value: config.email, href: `mailto:${config.email}` },
                { icon: <MapPin />, label: 'Địa chỉ', value: config.address, href: config.googleBusinessUrl },
                { icon: <Clock />, label: 'Giờ làm việc', value: config.workingHours, href: null },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                  <div className="text-brand-primary w-6 h-6 mt-0.5">{item.icon}</div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="font-semibold text-brand-dark hover:text-brand-primary transition-colors">{item.value}</a>
                    ) : (
                      <span className="font-semibold text-brand-dark">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <div className="font-semibold text-brand-dark mb-4">Kết Nối Với Chúng Tôi</div>
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: 'Facebook', href: config.facebook, bg: 'bg-blue-600' },
                  { label: 'Zalo', href: config.zalo, bg: 'bg-blue-500' },
                  { label: 'Messenger', href: config.messenger, bg: 'bg-indigo-500' },
                  { label: 'TikTok', href: config.tiktok, bg: 'bg-gray-900' },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={`${s.bg} text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-96 lg:h-auto bg-gray-200 flex items-center justify-center">
            {config.googleMapEmbed ? (
              <iframe src={config.googleMapEmbed} className="w-full h-full" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Cập nhật Google Maps Embed trong config.json</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
