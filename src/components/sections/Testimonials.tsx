const REVIEWS = [
  { name: 'Nguyễn Minh Khoa', avatar: 'K', content: 'Đội ngũ kỹ thuật tư vấn rất nhiệt tình, lắp đặt nhanh gọn và đúng hẹn. Hệ thống báo cháy hoạt động tốt, mình rất hài lòng.', stars: 5 },
  { name: 'Trần Thị Hương', avatar: 'H', content: 'Thiết bị chính hãng, có tem kiểm định rõ ràng. Gọi là có người xuống tư vấn ngay, không phải chờ lâu. Sẽ tiếp tục sử dụng dịch vụ.', stars: 5 },
  { name: 'Lê Thanh Phong', avatar: 'P', content: 'Báo giá minh bạch, không phát sinh chi phí ẩn. Thi công xong còn hướng dẫn cách sử dụng và bảo quản thiết bị rất chu đáo.', stars: 5 },
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
                <div className="text-white font-semibold">{r.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
