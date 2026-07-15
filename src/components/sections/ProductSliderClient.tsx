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

const VISIBLE = 3

export default function ProductSliderClient({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const total = Math.max(products.length - VISIBLE + 1, 1)

  const prev = useCallback(() => setIndex(i => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIndex(i => (i + 1) % total), [total])

  useEffect(() => {
    if (paused || products.length <= VISIBLE) return
    const t = setInterval(next, 4000)
    return () => clearInterval(t)
  }, [paused, next, products.length])

  const visible = products.slice(index, index + VISIBLE)
  // pad nếu cuối list không đủ 3
  const padded = [...visible, ...products.slice(0, Math.max(0, VISIBLE - visible.length))]

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {padded.map((p, i) => {
          const thumb = parseImages(p.images)[0]
          return (
            <Link
              key={`${p.id}-${index}-${i}`}
              href={`/san-pham/${p.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-gray-200">🧯</div>
                )}
                {!!p.featured && (
                  <span className="absolute top-3 left-3 bg-brand-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">Nổi bật</span>
                )}
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1">
                {p.category && (
                  <span className="text-xs font-semibold text-brand-primary uppercase tracking-wide mb-1">{p.category}</span>
                )}
                <h3 className="font-bold text-brand-dark mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">{p.name}</h3>
                {p.shortDescription && (
                  <p className="text-gray-500 text-sm line-clamp-2 flex-1 mb-4">{p.shortDescription}</p>
                )}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                  <span className={`font-bold text-sm ${p.price ? 'text-brand-primary' : 'text-gray-500'}`}>
                    {formatPrice(p.price)}
                  </span>
                  <span className="flex items-center gap-1 text-brand-primary text-sm font-semibold group-hover:gap-2 transition-all">
                    Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Navigation */}
      {products.length > VISIBLE && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`rounded-full transition-all ${i === index ? 'w-6 h-2.5 bg-brand-primary' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
