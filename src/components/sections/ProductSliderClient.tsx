'use client'
import Link from 'next/link'
import { Product } from '@/types'

function parseImages(raw: string | undefined): string[] {
  try { return JSON.parse(raw || '[]') } catch { return [] }
}

export default function ProductSliderClient({ products }: { products: Product[] }) {
  // Duplicate for seamless infinite loop
  const items = [...products, ...products]

  return (
    <div
      className="flex gap-5 animate-marquee hover:[animation-play-state:paused]"
      style={{ width: 'max-content' }}
    >
      {items.map((p, i) => {
        const thumb = parseImages(p.images as unknown as string)[0]
        return (
          <Link
            key={`${p.id}-${i}`}
            href={`/san-pham/${p.slug}`}
            className="group flex-shrink-0 w-56 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="aspect-square bg-gray-50 overflow-hidden">
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl text-gray-200">🧯</div>
              )}
            </div>
            <div className="p-4">
              {p.category && (
                <span className="text-xs font-semibold text-brand-primary uppercase tracking-wide">{p.category}</span>
              )}
              <h3 className="font-bold text-brand-dark mt-1 line-clamp-2 text-sm group-hover:text-brand-primary transition-colors">
                {p.name}
              </h3>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
