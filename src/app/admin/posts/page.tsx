import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import Link from 'next/link'
import { Post } from '@/types'

export default async function AdminPosts() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  const posts = getDb().prepare('SELECT id, title, slug, status, category, view_count, created_at FROM posts ORDER BY created_at DESC').all() as Pick<Post, 'id'|'title'|'slug'|'status'|'category'|'viewCount'|'createdAt'>[]
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-brand-primary text-sm">← Dashboard</Link>
            <h1 className="text-xl font-display font-bold text-brand-dark">Quản Lý Bài Viết</h1>
          </div>
          <Link href="/admin/posts/new" className="bg-brand-primary text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm">+ Tạo mới</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tiêu đề</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Danh mục</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Lượt xem</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-brand-dark max-w-xs">
                    <span className="line-clamp-1">{post.title}</span>
                    <div className="text-xs text-gray-400 mt-0.5">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm hidden md:table-cell">{post.category || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm hidden lg:table-cell">{(post as any).view_count}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/blog/${post.slug}`} target="_blank" className="text-xs text-gray-500 hover:text-brand-primary">Xem</Link>
                      <Link href={`/admin/posts/${post.id}`} className="text-xs text-brand-primary hover:text-blue-700 font-medium">Sửa</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📝</div>
              <p>Chưa có bài viết nào</p>
              <Link href="/admin/posts/new" className="mt-4 inline-block text-brand-primary hover:underline text-sm">Tạo bài viết đầu tiên</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
