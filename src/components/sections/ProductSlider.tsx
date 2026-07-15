import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getDb } from '@/lib/db'
import { Product } from '@/types'
import ProductSliderClient from './ProductSliderClient'

export default async function ProductSlider() {
  const db = getDb()
  const products = db.prepare(
    "SELECT * FROM products WHERE status = 'published' ORDER BY featured DESC, sort_order ASC, created_at DESC LIMIT 12"
  ).all() as Product[]

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-brand-primary font-semibold uppercase tracking-widest text-sm">Sản Phẩm</span>
          <h2 className="text-4xl font-display font-bold text-brand-dark mt-2 mb-4">Thiết Bị PCCC Của Chúng Tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Thiết bị phòng cháy chữa cháy chính hãng, đạt chuẩn TCVN — bảo hành rõ ràng, tư vấn lắp đặt tận nơi
          </p>
        </div>

        {products.length > 0 ? (
          <ProductSliderClient products={products} />
        ) : (
          /* Placeholder khi chưa có sản phẩm */
          <div className="grid md:grid-cols-3 gap-6">
            {['Bình Chữa Cháy', 'Hệ Thống Báo Cháy', 'Phụ Kiện PCCC'].map((name) => (
              <div key={name} className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-center min-h-[260px]">
                <div className="text-5xl">🧯</div>
                <div>
                  <p className="font-semibold text-brand-dark">{name}</p>
                  <p className="text-gray-400 text-sm mt-1">Đang cập nhật sản phẩm</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-10">
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
