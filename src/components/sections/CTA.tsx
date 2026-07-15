import { Phone, ArrowRight } from 'lucide-react'
import { SiteConfig } from '@/types'

export default function CTA({ config }: { config: SiteConfig }) {
  return (
    <section className="py-20 bg-gradient-to-r from-brand-primary to-brand-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-display font-bold text-white mb-4">Nhận Báo Giá PCCC Miễn Phí Trong 24h</h2>
        <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">Đội ngũ kỹ thuật sẵn sàng khảo sát thực tế, tư vấn giải pháp và gửi báo giá chi tiết — hoàn toàn miễn phí, không ràng buộc.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href={`tel:${config.hotline}`} className="flex items-center gap-2 bg-brand-accent hover:bg-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-all transform hover:scale-105">
            <Phone className="w-5 h-5" />
            Gọi: {config.hotlineDisplay}
          </a>
          <a href={config.zalo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-brand-primary hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-all transform hover:scale-105">
            {config.ctaText}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
