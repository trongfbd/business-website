import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getDb } from '@/lib/db'
import ProductCard from './ProductCard'
import { Product } from '@/types'

export default async function FeaturedProducts() {
  const db = getDb()

  // Ưu tiên sản phẩm nổi bật, nếu chưa đủ 6 thì bổ sung sản phẩm mới nhất
  const featured = db.prepare(
    "SELECT * FROM products WHERE status = 'published' AND featured = 1 ORDER BY sort_order ASC, created_at DESC LIMIT 6"
  ).all() as Product[]

  let products = featured
  if (products.length < 6) {
    const excludeIds = products.map((p) => p.id)
    const placeholders = excludeIds.length ? excludeIds.map(() => '?').join(',') : '0'
    const more = db.prepare(
      `SELECT * FROM products WHERE status = 'published' AND id NOT IN (${placeholders}) ORDER BY created_at DESC LIMIT ?`
    ).all(...excludeIds, 6 - products.length) as Product[]
    products = [...products, ...more]
  }

  if (products.length === 0) return null

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-brand-primary font-semibold uppercase tracking-widest text-sm">Sản Phẩm</span>
          <h2 className="text-4xl font-display font-bold text-brand-dark mt-2 mb-4">Thiết Bị PCCC Nổi Bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Các sản phẩm phòng cháy chữa cháy chính hãng, đạt chuẩn TCVN, được khách hàng tin dùng nhiều nhất.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 mb-12">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-red-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105"
          >
            Xem Tất Cả Sản Phẩm
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
