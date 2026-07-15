'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Product } from '@/types'

function parseImages(raw: unknown): string[] {
  try { return JSON.parse(raw as string || '[]') } catch { return [] }
}

function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return 'Liên hệ báo giá'
  return price.toLocaleString('vi-VN') + 'đ'
}

const PAGE_SIZE = 6

export default function ProductSliderClient({ products }: { products: Product[] }) {
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)

  const totalPages = Math.ceil(products.length / PAGE_SIZE)

  const prev = useCallback(() => setPage(p => (p - 1 + totalPages) % totalPages), [totalPages])
  const next = useCallback(() => setPage(p => (p + 1) % totalPages), [totalPages])

  useEffect(() => {
    if (paused || totalPages <= 1) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [paused, next, totalPages])

  const pageProducts = products.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  // Pad để luôn đủ 6 ô (tránh layout nhảy ở trang cuối)
  const padded = [...pageProducts, ...Array(Math.max(0, PAGE_SIZE - pageProducts.length)).fill(null)]

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 2 rows × 3 cols */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
        {padded.map((p: Product | null, i) =>
          p ? (
            <Link
              key={`${p.id}-${page}-${i}`}
              href={`/san-pham/${p.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="aspect-square bg-gray-50 overflow-hidden relative">
                {parseImages(p.images)[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={parseImages(p.images)[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl text-gray-200">🧯</div>
                )}
                {!!p.featured && (
                  <span className="absolute top-3 left-3 bg-brand-primary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">Nổi bật</span>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                {p.category && (
                  <span className="text-xs font-semibold text-brand-primary uppercase tracking-wide mb-1">{p.category}</span>
                )}
                <h3 className="font-bold text-brand-dark mb-2 line-clamp-2 text-sm group-hover:text-brand-primary transition-colors">{p.name}</h3>
                {p.shortDescription && (
                  <p className="text-gray-500 text-xs line-clamp-2 flex-1 mb-3">{p.shortDescription}</p>
                )}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                  <span className={`font-bold text-sm ${p.price ? 'text-brand-primary' : 'text-gray-400'}`}>
                    {formatPrice(p.price)}
                  </span>
                  <span className="flex items-center gap-1 text-brand-primary text-xs font-semibold group-hover:gap-2 transition-all">
                    Xem thêm <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            // Ô trống (padding cuối danh sách)
            <div key={`empty-${i}`} className="rounded-2xl bg-gray-50/50 border border-dashed border-gray-100 aspect-square md:aspect-auto" />
          )
        )}
      </div>

      {/* Navigation — chỉ hiện khi có nhiều hơn 1 trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
            aria-label="Trang trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Trang ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${i === page ? 'w-6 h-2.5 bg-brand-primary' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
            aria-label="Trang sau"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
