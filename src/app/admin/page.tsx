import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import Link from 'next/link'
import LogoutButton from '@/components/admin/LogoutButton'

export default async function AdminDashboard() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const db = getDb()
  const total = (db.prepare('SELECT COUNT(*) as c FROM posts').get() as { c: number }).c
  const published = (db.prepare("SELECT COUNT(*) as c FROM posts WHERE status='published'").get() as { c: number }).c
  const draft = (db.prepare("SELECT COUNT(*) as c FROM posts WHERE status='draft'").get() as { c: number }).c
  const totalViews = (db.prepare('SELECT SUM(view_count) as v FROM posts').get() as { v: number | null }).v || 0
  const topPosts = db.prepare('SELECT title, slug, view_count FROM posts ORDER BY view_count DESC LIMIT 5').all() as { title: string; slug: string; view_count: number }[]

  const totalProducts = (db.prepare('SELECT COUNT(*) as c FROM products').get() as { c: number }).c
  const publishedProducts = (db.prepare("SELECT COUNT(*) as c FROM products WHERE status='published'").get() as { c: number }).c
  const featuredProducts = (db.prepare("SELECT COUNT(*) as c FROM products WHERE featured=1").get() as { c: number }).c

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-brand-dark">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">Xin chào, <strong>{session.username}</strong></span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats - Bài viết */}
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Blog</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Tổng bài viết', value: total, color: 'bg-blue-500' },
            { label: 'Đã xuất bản', value: published, color: 'bg-green-500' },
            { label: 'Bản nháp', value: draft, color: 'bg-yellow-500' },
            { label: 'Tổng lượt xem', value: totalViews.toLocaleString(), color: 'bg-purple-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                <span className="text-white text-lg">📊</span>
              </div>
              <div className="text-2xl font-bold text-brand-dark">{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Stats - Sản phẩm */}
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Sản phẩm</h2>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Tổng sản phẩm', value: totalProducts, color: 'bg-brand-primary' },
            { label: 'Đang hiển thị', value: publishedProducts, color: 'bg-green-500' },
            { label: 'Nổi bật', value: featuredProducts, color: 'bg-amber-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                <span className="text-white text-lg">🧯</span>
              </div>
              <div className="text-2xl font-bold text-brand-dark">{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-brand-dark mb-4">Hành Động Nhanh</h2>
            <div className="space-y-3">
              <Link href="/admin/products/new" className="flex items-center gap-3 p-4 bg-brand-primary/5 hover:bg-brand-primary/10 rounded-xl transition-colors">
                <span className="text-2xl">🧯</span>
                <div>
                  <div className="font-semibold text-brand-dark">Thêm sản phẩm mới</div>
                  <div className="text-gray-500 text-sm">Thêm thiết bị PCCC vào website</div>
                </div>
              </Link>
              <Link href="/admin/products" className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <span className="text-2xl">📦</span>
                <div>
                  <div className="font-semibold text-brand-dark">Quản lý sản phẩm</div>
                  <div className="text-gray-500 text-sm">Xem, sửa, xóa sản phẩm</div>
                </div>
              </Link>
              <Link href="/admin/posts/new" className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <span className="text-2xl">✍️</span>
                <div>
                  <div className="font-semibold text-brand-dark">Tạo bài viết mới</div>
                  <div className="text-gray-500 text-sm">Viết và xuất bản bài viết</div>
                </div>
              </Link>
              <Link href="/admin/posts" className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <span className="text-2xl">📋</span>
                <div>
                  <div className="font-semibold text-brand-dark">Quản lý bài viết</div>
                  <div className="text-gray-500 text-sm">Xem, sửa, xóa bài viết</div>
                </div>
              </Link>
              <Link href="/" target="_blank" className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <span className="text-2xl">🌐</span>
                <div>
                  <div className="font-semibold text-brand-dark">Xem website</div>
                  <div className="text-gray-500 text-sm">Mở website công khai</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Top Posts */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-brand-dark mb-4">Bài Xem Nhiều Nhất</h2>
            {topPosts.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Chưa có bài viết</p>
            ) : (
              <div className="space-y-3">
                {topPosts.map((p, i) => (
                  <div key={p.slug} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</span>
                    <a href={`/blog/${p.slug}`} target="_blank" className="flex-1 text-sm font-medium text-brand-dark hover:text-brand-primary line-clamp-1">{p.title}</a>
                    <span className="text-xs text-gray-400">{p.view_count} lượt</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
