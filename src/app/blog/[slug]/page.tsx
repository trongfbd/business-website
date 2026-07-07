import { notFound } from 'next/navigation'
import { getDb } from '@/lib/db'
import { getSiteConfig } from '@/lib/config'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { DesktopContactHub, MobileContactBar } from '@/components/contact/OmnichannelHub'
import { marked } from 'marked'
import type { Metadata } from 'next'
import { Post } from '@/types'
import { ArticleSchema, FAQSchema, BreadcrumbSchema } from '@/components/ui/JsonLd'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const db = getDb()
  const post = db.prepare('SELECT * FROM posts WHERE slug = ? AND status = ?').get(params.slug, 'published') as Post | undefined
  if (!post) return {}
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.shortDescription,
    keywords: post.keywords,
    openGraph: { title: post.metaTitle || post.title, description: post.metaDescription || post.shortDescription, images: post.thumbnail ? [post.thumbnail] : [] },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const config = await getSiteConfig()
  const db = getDb()
  const post = db.prepare('SELECT * FROM posts WHERE slug = ? AND status = ?').get(params.slug, 'published') as Post | undefined
  if (!post) notFound()

  // Increment view count
  db.prepare('UPDATE posts SET view_count = view_count + 1 WHERE id = ?').run(post.id)

  const htmlContent = marked(post.content || '')
  const faq = post.faq ? JSON.parse(post.faq) : []
  const related = db.prepare('SELECT id, title, slug, thumbnail, created_at FROM posts WHERE status = ? AND id != ? AND category = ? LIMIT 3').all('published', post.id, post.category) as Partial<Post>[]

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.metaDescription || post.shortDescription}
        image={post.thumbnail || config.ogImage}
        author={post.author}
        datePublished={post.createdAt}
        dateModified={post.updatedAt}
        baseUrl={process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com'}
      />
      <FAQSchema faqs={faq} />
      <BreadcrumbSchema
        items={[{ name: 'Trang chủ', url: '/' }, { name: 'Blog', url: '/blog' }, { name: post.title, url: `/blog/${post.slug}` }]}
        baseUrl={process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com'}
      />
      <Header config={config} />
      <main className="pt-24 pb-16 bg-gray-50 min-h-screen">
        <article className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <a href="/" className="hover:text-brand-primary">Trang chủ</a>
            <span>/</span>
            <a href="/blog" className="hover:text-brand-primary">Blog</a>
            <span>/</span>
            <span className="text-gray-700 font-medium">{post.title}</span>
          </nav>

          {post.thumbnail && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <header className="mb-8">
            {post.category && <span className="inline-block bg-blue-100 text-brand-primary text-sm font-semibold px-3 py-1 rounded-full mb-4">{post.category}</span>}
            <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Bởi <strong>{post.author}</strong></span>
              <span>·</span>
              <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
              <span>·</span>
              <span>{post.viewCount} lượt xem</span>
            </div>
          </header>

          <div className="bg-white rounded-2xl p-8 shadow-sm mb-8 prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />

          {/* FAQ */}
          {faq.length > 0 && (
            <section className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-6">Câu Hỏi Thường Gặp</h2>
              <div className="space-y-4">
                {faq.map((item: { question: string; answer: string }, i: number) => (
                  <details key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                    <summary className="px-6 py-4 cursor-pointer font-semibold text-brand-dark hover:bg-gray-50">{item.question}</summary>
                    <div className="px-6 pb-4 text-gray-600">{item.answer}</div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related */}
          {related.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-6">Bài Viết Liên Quan</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map((r) => (
                  <a key={r.id} href={`/blog/${r.slug}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-100">
                    {r.thumbnail && <div className="aspect-video overflow-hidden"><img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>}
                    <div className="p-4">
                      <h3 className="font-semibold text-brand-dark line-clamp-2 group-hover:text-brand-primary transition-colors">{r.title}</h3>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer config={config} />
      <DesktopContactHub config={config} />
      <MobileContactBar config={config} />
    </>
  )
}
