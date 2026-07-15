import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getDb } from '@/lib/db'
import { Product } from '@/types'
import ProductSliderClient from './ProductSliderClient'

export default async function ProductSlider() {
  const db = getDb()
  const products = db.prepare(
    "SELECT * FROM products WHERE status = 'published' ORDER BY featured DESC, sort_order ASC, created_at DESC LIMIT 16"
  ).all() as Product[]

  if (products.length === 0) return null

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 mb-10 text-center">
        <span className="text-brand-primary font-semibold uppercase tracking-widest text-sm">Sản Phẩm</span>
        <h2 className="text-4xl font-display font-bold text-brand-dark mt-2 mb-4">Thiết Bị PCCC Của Chúng Tôi</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Thiết bị phòng cháy chữa cháy chính hãng, đạt chuẩn TCVN, bảo hành rõ ràng</p>
      </div>

      {/* Infinite scroll slider */}
      <div className="overflow-hidden">
        <ProductSliderClient products={products} />
      </div>

      <div className="text-center mt-10">
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-2 bg-brand-primary hover:bg-red-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105"
        >
          Xem Tất Cả Sản Phẩm
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}
