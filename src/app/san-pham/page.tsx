import Link from 'next/link'
import { getDb } from '@/lib/db'
import { getSiteConfig } from '@/lib/config'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { DesktopContactHub, MobileContactBar } from '@/components/contact/OmnichannelHub'
import ProductCard from '@/components/sections/ProductCard'
import type { Metadata } from 'next'
import { Product } from '@/types'

export const metadata: Metadata = {
  title: 'Sản Phẩm PCCC',
  description: 'Toàn bộ sản phẩm thiết bị phòng cháy chữa cháy: bình chữa cháy, hệ thống báo cháy, vòi chữa cháy, đèn thoát hiểm...',
}

const PAGE_SIZE = 12

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string; page?: string } }) {
  const config = await getSiteConfig()
  const db = getDb()
  const page = Math.max(1, parseInt(searchParams.page || '1'))
  const offset = (page - 1) * PAGE_SIZE

  let query = 'SELECT * FROM products WHERE status = ?'
  const params: (string | number)[] = ['published']
  if (searchParams.category) { query += ' AND category = ?'; params.push(searchParams.category) }
  query += ' ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?'

  const products = db.prepare(query).all(...params, PAGE_SIZE, offset) as Product[]

  let countQuery = 'SELECT COUNT(*) as count FROM products WHERE status = ?'
  const countParams: (string | number)[] = ['published']
  if (searchParams.category) { countQuery += ' AND category = ?'; countParams.push(searchParams.category) }
  const totalCount = (db.prepare(countQuery).get(...countParams) as { count: number }).count
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  const categories = db.prepare("SELECT DISTINCT category FROM products WHERE status = 'published' AND category IS NOT NULL AND category != ''").all() as { category: string }[]

  return (
    <>
      <Header config={config} />
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        {/* Page Banner */}
        <div className="bg-gradient-to-br from-brand-dark via-red-950 to-brand-primary py-14 mb-10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Sản Phẩm Phòng Cháy Chữa Cháy</h1>
            <p className="text-red-100 max-w-2xl mx-auto">Đầy đủ thiết bị PCCC chính hãng, đạt chuẩn TCVN, bảo hành rõ ràng, tư vấn lắp đặt tận nơi.</p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              <Link
                href="/san-pham"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!searchParams.category ? 'bg-brand-primary text-white' : 'bg-white text-gray-600 hover:bg-red-50 border border-gray-200'}`}
              >
                Tất cả
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.category}
                  href={`/san-pham?category=${encodeURIComponent(c.category)}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${searchParams.category === c.category ? 'bg-brand-primary text-white' : 'bg-white text-gray-600 hover:bg-red-50 border border-gray-200'}`}
                >
                  {c.category}
                </Link>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🧯</div>
              <p className="text-lg">Chưa có sản phẩm nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 animate-fade-up">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Phân trang">
              {page > 1 && (
                <Link
                  href={`/san-pham?${new URLSearchParams({ ...(searchParams.category ? { category: searchParams.category } : {}), page: String(page - 1) }).toString()}`}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-brand-primary transition-colors text-sm font-medium"
                >
                  ← Trước
                </Link>
              )}
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1
                return (
                  <Link
                    key={pageNum}
                    href={`/san-pham?${new URLSearchParams({ ...(searchParams.category ? { category: searchParams.category } : {}), page: String(pageNum) }).toString()}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${pageNum === page ? 'bg-brand-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-brand-primary'}`}
                  >
                    {pageNum}
                  </Link>
                )
              })}
              {page < totalPages && (
                <Link
                  href={`/san-pham?${new URLSearchParams({ ...(searchParams.category ? { category: searchParams.category } : {}), page: String(page + 1) }).toString()}`}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-brand-primary transition-colors text-sm font-medium"
                >
                  Sau →
                </Link>
              )}
            </nav>
          )}
        </div>
      </main>
      <Footer config={config} />
      <DesktopContactHub config={config} />
      <MobileContactBar config={config} />
    </>
  )
}
