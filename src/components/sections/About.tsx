import { Award, Users, Clock, ThumbsUp } from 'lucide-react'

const STATS = [
  { icon: <Award />, value: '10+', label: 'Năm kinh nghiệm' },
  { icon: <Users />, value: '500+', label: 'Khách hàng tin tưởng' },
  { icon: <Clock />, value: '24/7', label: 'Hỗ trợ liên tục' },
  { icon: <ThumbsUp />, value: '99%', label: 'Khách hàng hài lòng' },
]

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-brand-primary font-semibold uppercase tracking-widest text-sm">Về Chúng Tôi</span>
            <h2 className="text-4xl font-display font-bold text-brand-dark mt-2 mb-6">Đối Tác Tin Cậy Của Mọi Doanh Nghiệp</h2>
            <p className="text-gray-600 leading-relaxed mb-6">Chúng tôi tự hào là đơn vị hàng đầu trong lĩnh vực với hơn 10 năm kinh nghiệm phục vụ hàng trăm doanh nghiệp lớn nhỏ trên toàn quốc.</p>
            <p className="text-gray-600 leading-relaxed mb-8">Đội ngũ chuyên gia giàu kinh nghiệm của chúng tôi luôn sẵn sàng đồng hành, tư vấn và triển khai giải pháp tối ưu nhất cho từng khách hàng.</p>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="text-brand-primary w-6 h-6 mt-0.5">{stat.icon}</div>
                  <div>
                    <div className="text-2xl font-bold text-brand-dark">{stat.value}</div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-brand-primary to-brand-secondary rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Tại Sao Chọn Chúng Tôi?</h3>
              {['Đội ngũ chuyên gia giàu kinh nghiệm', 'Giải pháp tùy chỉnh theo nhu cầu', 'Hỗ trợ 24/7, phản hồi nhanh chóng', 'Cam kết chất lượng, đúng tiến độ', 'Giá cả cạnh tranh, minh bạch', 'Bảo hành dài hạn, uy tín'].map((item) => (
                <div key={item} className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
