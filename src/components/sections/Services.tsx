'use client'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { SiteConfig } from '@/types'

const SERVICES = [
  { icon: '⚡', title: 'Dịch Vụ Tư Vấn', desc: 'Tư vấn chuyên sâu, giải pháp tối ưu cho từng doanh nghiệp', features: ['Phân tích nhu cầu', 'Đề xuất giải pháp', 'Hỗ trợ triển khai'] },
  { icon: '🛡️', title: 'Dịch Vụ Bảo Trì', desc: 'Bảo trì, bảo dưỡng định kỳ đảm bảo hoạt động liên tục', features: ['Kiểm tra định kỳ', 'Sửa chữa nhanh', 'Báo cáo chi tiết'] },
  { icon: '🚀', title: 'Giải Pháp Toàn Diện', desc: 'Gói dịch vụ đầy đủ từ A-Z cho doanh nghiệp', features: ['Thiết kế tùy chỉnh', 'Triển khai chuyên nghiệp', 'Hỗ trợ 24/7'] },
]

export default function Services({ config }: { config: SiteConfig }) {
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand-primary font-semibold uppercase tracking-widest text-sm">Dịch Vụ</span>
          <h2 className="text-4xl font-display font-bold text-brand-dark mt-2 mb-4">Chúng Tôi Cung Cấp</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Với kinh nghiệm hơn 10 năm trong ngành, chúng tôi cam kết mang đến dịch vụ chất lượng cao nhất</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {SERVICES.map((svc, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-brand-primary/20 hover:-translate-y-1">
              <div className="text-4xl mb-4">{svc.icon}</div>
              <h3 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-primary transition-colors">{svc.title}</h3>
              <p className="text-gray-600 mb-5 leading-relaxed">{svc.desc}</p>
              <ul className="space-y-2 mb-6">
                {svc.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/#contact" className="flex items-center gap-1 text-brand-primary font-semibold text-sm group-hover:gap-2 transition-all">
                Tìm hiểu thêm <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={`tel:${config.hotline}`}
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105"
          >
            Gọi ngay để được tư vấn miễn phí
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
