'use client'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const FAQS = [
  {
    q: 'Chi phí lắp đặt hệ thống PCCC khoảng bao nhiêu?',
    a: 'Chi phí phụ thuộc vào diện tích, loại công trình và giải pháp kỹ thuật. Vĩnh Mai cung cấp báo giá chi tiết miễn phí sau khi khảo sát thực tế — không phát sinh chi phí ẩn.',
  },
  {
    q: 'Thi công hệ thống PCCC mất bao lâu?',
    a: 'Thông thường từ 3–15 ngày tùy quy mô công trình. Chúng tôi cam kết đúng tiến độ đã thỏa thuận và bàn giao hồ sơ nghiệm thu đầy đủ.',
  },
  {
    q: 'Sản phẩm và hệ thống có được bảo hành không?',
    a: 'Có. Thiết bị được bảo hành theo nhà sản xuất (thường 12–24 tháng). Hệ thống lắp đặt được bảo hành thi công 12 tháng và hỗ trợ bảo trì định kỳ theo hợp đồng.',
  },
  {
    q: 'Doanh nghiệp cần giấy tờ gì để hợp lệ về PCCC?',
    a: 'Tùy loại công trình, có thể cần: Giấy phép thẩm duyệt thiết kế PCCC, Biên bản nghiệm thu hệ thống PCCC, và Giấy chứng nhận đủ điều kiện PCCC. Vĩnh Mai hỗ trợ tư vấn và làm hồ sơ trọn gói.',
  },
  {
    q: 'Có dịch vụ bảo trì định kỳ hệ thống PCCC không?',
    a: 'Có. Chúng tôi cung cấp gói bảo trì định kỳ 6 tháng/lần hoặc theo yêu cầu, bao gồm kiểm tra, vệ sinh và thay thế linh kiện đảm bảo hệ thống luôn sẵn sàng hoạt động.',
  },
  {
    q: 'Khu vực nào Vĩnh Mai có thể thi công?',
    a: 'Chúng tôi nhận thi công trên toàn địa bàn TP. Hồ Chí Minh và các tỉnh lân cận. Liên hệ hotline để được tư vấn cụ thể cho khu vực của bạn.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-brand-primary font-semibold uppercase tracking-widest text-sm">Giải Đáp</span>
          <h2 className="text-4xl font-display font-bold text-brand-dark mt-2 mb-4">Câu Hỏi Thường Gặp</h2>
          <p className="text-gray-600">Những thắc mắc phổ biến nhất về dịch vụ PCCC — chúng tôi giải đáp rõ ràng.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${open === i ? 'border-brand-primary shadow-md' : 'border-gray-100 shadow-sm'}`}
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className={`font-semibold leading-snug ${open === i ? 'text-brand-primary' : 'text-brand-dark'}`}>
                  {faq.q}
                </span>
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${open === i ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {open === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQS.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
      </div>
    </section>
  )
}
