import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { getDb } from '@/lib/db'

interface Post {
  id: number
  title: string
  slug: string
  thumbnail: string | null
  short_description: string | null
  category: string | null
  created_at: string
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch { return dateStr }
}

const PLACEHOLDERS = [
  { title: 'Kiến thức PCCC: Phân loại bình chữa cháy và cách sử dụng đúng', category: 'Kiến Thức' },
  { title: 'Quy định pháp luật về phòng cháy chữa cháy cho doanh nghiệp 2024', category: 'Pháp Lý' },
  { title: 'Hệ thống báo cháy tự động: Nên lắp loại nào cho nhà xưởng?', category: 'Tư Vấn' },
]

export default async function BlogPreview() {
  const db = getDb()
  const posts = db.prepare(
    `SELECT id, title, slug, thumbnail, short_description, category, created_at
     FROM posts WHERE status = 'published' ORDER BY created_at DESC LIMIT 3`
  ).all() as Post[]

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-brand-primary font-semibold uppercase tracking-widest text-sm">Kiến Thức & Tin Tức</span>
          <h2 className="text-4xl font-display font-bold text-brand-dark mt-2 mb-4">Cẩm Nang PCCC</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Thông tin hữu ích về phòng cháy chữa cháy, quy định pháp luật và hướng dẫn sử dụng thiết bị an toàn
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.length > 0 ? posts.map((post) => (
            <Link
              key={post.id}
              href={`/bai-viet/${post.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="aspect-video bg-gray-100 overflow-hidden">
                {post.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                    <span className="text-4xl">📰</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                {post.category && (
                  <span className="text-xs font-semibold text-brand-primary uppercase tracking-wide mb-2">{post.category}</span>
                )}
                <h3 className="font-bold text-brand-dark mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors leading-snug">
                  {post.title}
                </h3>
                {post.short_description && (
                  <p className="text-gray-500 text-sm line-clamp-2 flex-1 mb-4">{post.short_description}</p>
                )}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                  <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(post.created_at)}
                  </span>
                  <span className="flex items-center gap-1 text-brand-primary text-xs font-semibold group-hover:gap-2 transition-all">
                    Đọc thêm <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          )) : PLACEHOLDERS.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl border border-dashed border-gray-200 overflow-hidden flex flex-col">
              <div className="aspect-video bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                <span className="text-4xl">📰</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-semibold text-brand-primary uppercase tracking-wide mb-2">{p.category}</span>
                <h3 className="font-bold text-gray-400 line-clamp-2 leading-snug">{p.title}</h3>
                <p className="text-gray-300 text-sm mt-2">Đang cập nhật nội dung...</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/bai-viet"
            className="inline-flex items-center gap-2 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-8 py-3.5 rounded-xl font-bold transition-all"
          >
            Xem Tất Cả Bài Viết
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
