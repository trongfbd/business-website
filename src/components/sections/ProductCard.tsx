import Link from 'next/link'
import { Eye } from 'lucide-react'
import { Product } from '@/types'

function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return 'Liên hệ báo giá'
  return price.toLocaleString('vi-VN') + 'đ'
}

export default function ProductCard({ product }: { product: Product & { image?: string } }) {
  const images: string[] = (() => {
    try {
      return JSON.parse(product.images || '[]')
    } catch {
      return []
    }
  })()
  const thumb = images[0]

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden relative">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-gray-200">🧯</div>
        )}
        {!!product.featured && (
          <span className="absolute top-3 left-3 bg-brand-primary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            Nổi bật
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        {product.category && (
          <span className="text-xs font-semibold text-brand-primary uppercase tracking-wide mb-1">{product.category}</span>
        )}
        <h3 className="font-bold text-brand-dark mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{product.shortDescription}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <span className={`font-bold ${product.price ? 'text-brand-primary' : 'text-gray-500 text-sm'}`}>
            {formatPrice(product.price)}
          </span>
          {!!product.viewCount && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Eye className="w-3.5 h-3.5" />
              {product.viewCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
