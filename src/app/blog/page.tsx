import Link from 'next/link'
import { getDb } from '@/lib/db'
import { getSiteConfig } from '@/lib/config'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { DesktopContactHub, MobileContactBar } from '@/components/contact/OmnichannelHub'
import type { Metadata } from 'next'
import { Post } from '@/types'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tin tức, kiến thức và chia sẻ từ chuyên gia',
}

export default async function BlogPage({ searchParams }: { searchParams: { category?: string; tag?: string; q?: string } }) {
  const config = await getSiteConfig()
  const db = getDb()

  let query = 'SELECT * FROM posts WHERE status = ? '
  const params: (string | number)[] = ['published']

  if (searchParams.category) { query += ' AND category = ?'; params.push(searchParams.category) }
  if (searchParams.tag) { query += ' AND tags LIKE ?'; params.push(`%${searchParams.tag}%`) }
  if (searchParams.q) { query += ' AND (title LIKE ? OR short_description LIKE ?)'; params.push(`%${searchParams.q}%`, `%${searchParams.q}%`) }

  query += ' ORDER BY created_at DESC LIMIT 20'
  const posts = db.prepare(query).all(...params) as Post[]

  const categories = db.prepare('SELECT DISTINCT category FROM posts WHERE status = ? AND category IS NOT NULL').all('published') as { category: string }[]

  return (
    <>
      <Header config={config} />
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl font-display font-bold text-brand-dark mb-4">Blog & Tin Tức</h1>
            <p className="text-gray-600">Kiến thức, kinh nghiệm và xu hướng mới nhất trong ngành</p>
          </div>

          {/* Search */}
          <form className="mb-8 flex gap-3">
            <input name="q" defaultValue={searchParams.q} placeholder="Tìm kiếm bài viết..." className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            <button type="submit" className="bg-brand-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">Tìm</button>
          </form>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              <Link href="/blog" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!searchParams.category ? 'bg-brand-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>
                Tất cả
              </Link>
              {categories.map((c) => (
                <Link key={c.category} href={`/blog?category=${c.category}`} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${searchParams.category === c.category ? 'bg-brand-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>
                  {c.category}
                </Link>
              ))}
            </div>
          )}

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-lg">Chưa có bài viết nào</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 border border-gray-100">
                  {post.thumbnail && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="inline-block bg-blue-100 text-brand-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">{post.category}</span>
                    )}
                    <h2 className="text-lg font-bold text-brand-dark mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">{post.shortDescription}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{post.author}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer config={config} />
      <DesktopContactHub config={config} />
      <MobileContactBar config={config} />
    </>
  )
}
