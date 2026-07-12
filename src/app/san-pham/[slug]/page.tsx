import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDb } from '@/lib/db'
import { getSiteConfig, getBaseUrl } from '@/lib/config'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { DesktopContactHub, MobileContactBar } from '@/components/contact/OmnichannelHub'
import ProductCard from '@/components/sections/ProductCard'
import ProductGallery from '@/components/sections/ProductGallery'
import { ProductSchema, BreadcrumbSchema } from '@/components/ui/JsonLd'
import { marked } from 'marked'
import { Phone, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'
import { Product } from '@/types'

function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return 'Liên hệ báo giá'
  return price.toLocaleString('vi-VN') + 'đ'
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const db = getDb()
  const product = db.prepare('SELECT * FROM products WHERE slug = ? AND status = ?').get(params.slug, 'published') as Product | undefined
  if (!product) return {}
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription,
    keywords: product.keywords,
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.shortDescription,
      images: (() => { try { return JSON.parse(product.images || '[]') } catch { return [] } })(),
    },
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const config = await getSiteConfig()
  const db = getDb()
  const product = db.prepare('SELECT * FROM products WHERE slug = ? AND status = ?').get(params.slug, 'published') as Product | undefined
  if (!product) notFound()

  db.prepare('UPDATE products SET view_count = view_count + 1 WHERE id = ?').run(product.id)

  const images: string[] = (() => { try { return JSON.parse(product.images || '[]') } catch { return [] } })()
  const htmlDescription = marked(product.description || '')
  const baseUrl = getBaseUrl()

  const related = db.prepare('SELECT * FROM products WHERE status = ? AND id != ? AND category = ? ORDER BY sort_order ASC LIMIT 4').all('published', product.id, product.category) as Product[]

  return (
    <>
      <ProductSchema
        name={product.name}
        description={product.metaDescription || product.shortDescription}
        image={images}
        price={product.price}
        sku={product.slug}
        baseUrl={baseUrl}
      />
      <BreadcrumbSchema
        items={[{ name: 'Trang chủ', url: '/' }, { name: 'Sản phẩm', url: '/san-pham' }, { name: product.name, url: `/san-pham/${product.slug}` }]}
        baseUrl={baseUrl}
      />
      <Header config={config} />
      <main className="pt-24 pb-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
            <Link href="/" className="hover:text-brand-primary">Trang chủ</Link>
            <span>/</span>
            <Link href="/san-pham" className="hover:text-brand-primary">Sản phẩm</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 mb-14">
            {/* Gallery */}
            <ProductGallery images={images} name={product.name} />

            {/* Info */}
            <div>
              {product.category && (
                <span className="inline-block bg-red-50 text-brand-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {product.category}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-dark mb-4">{product.name}</h1>

              {product.shortDescription && (
                <p className="text-gray-600 leading-relaxed mb-6">{product.shortDescription}</p>
              )}

              <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
                <div className="text-sm text-gray-500 mb-1">Giá bán</div>
                <div className={`text-3xl font-bold ${product.price ? 'text-brand-primary' : 'text-gray-600'}`}>
                  {formatPrice(product.price)}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${config.hotline}`}
                  className="flex items-center gap-2 bg-brand-primary hover:bg-red-800 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105"
                >
                  <Phone className="w-5 h-5" />
                  Gọi Ngay: {config.hotlineDisplay}
                </a>
                <a
                  href={config.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white border-2 border-brand-primary text-brand-primary hover:bg-red-50 px-6 py-3.5 rounded-xl font-bold transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat Zalo Tư Vấn
                </a>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-12 prose prose-red max-w-none" dangerouslySetInnerHTML={{ __html: htmlDescription }} />
          )}

          {/* Related products */}
          {related.length > 0 && (
            <section>
              <h2 className="text-2xl font-display font-bold text-brand-dark mb-6">Sản Phẩm Liên Quan</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer config={config} />
      <DesktopContactHub config={config} />
      <MobileContactBar config={config} />
    </>
  )
}
