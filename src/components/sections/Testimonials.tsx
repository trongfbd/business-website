const REVIEWS = [
  { name: 'Nguyễn Văn A', role: 'Giám đốc Công ty XYZ', avatar: 'N', content: 'Dịch vụ tuyệt vời, đội ngũ chuyên nghiệp và tận tình. Chúng tôi rất hài lòng với kết quả đạt được sau khi hợp tác.', stars: 5 },
  { name: 'Trần Thị B', role: 'CEO Công ty ABC', avatar: 'T', content: 'Phản hồi nhanh, giải quyết vấn đề hiệu quả. Đây là đối tác chiến lược dài hạn mà chúng tôi tin tưởng.', stars: 5 },
  { name: 'Lê Văn C', role: 'Chủ doanh nghiệp DEF', avatar: 'L', content: 'Giá cả hợp lý, chất lượng vượt mong đợi. Tôi sẽ tiếp tục giới thiệu cho các đối tác của mình.', stars: 5 },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-brand-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand-accent font-semibold uppercase tracking-widest text-sm">Đánh Giá</span>
          <h2 className="text-4xl font-display font-bold text-white mt-2 mb-4">Khách Hàng Nói Gì Về Chúng Tôi</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
              <div className="flex gap-1 mb-4">
                {Array.from({length: r.stars}).map((_, j) => <span key={j} className="text-brand-accent">★</span>)}
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 italic">&ldquo;{r.content}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold">{r.avatar}</div>
                <div>
                  <div className="text-white font-semibold">{r.name}</div>
                  <div className="text-gray-400 text-sm">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
