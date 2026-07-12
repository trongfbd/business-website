import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import Link from 'next/link'
import { Product } from '@/types'

export default async function AdminProducts() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const products = getDb().prepare('SELECT * FROM products ORDER BY sort_order ASC, created_at DESC').all() as (Product & { view_count: number })[]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-brand-primary text-sm">← Dashboard</Link>
            <h1 className="text-xl font-display font-bold text-brand-dark">Quản Lý Sản Phẩm</h1>
          </div>
          <Link href="/admin/products/new" className="bg-brand-primary text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-800 transition-colors text-sm">+ Thêm sản phẩm</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Danh mục</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Nổi bật</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => {
                let thumb = ''
                try { thumb = JSON.parse(p.images || '[]')[0] || '' } catch { /* noop */ }
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 max-w-xs">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-xl">
                          {thumb ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={thumb} alt={p.name} className="w-full h-full object-cover" />
                          ) : '🧯'}
                        </div>
                        <div>
                          <div className="font-medium text-brand-dark line-clamp-1">{p.name}</div>
                          <div className="text-xs text-gray-400">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm hidden md:table-cell">{p.category || '-'}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm hidden lg:table-cell">{p.price ? Number(p.price).toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.status === 'published' ? 'Hiển thị' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      {!!p.featured && <span className="text-brand-primary text-sm font-semibold">★ Nổi bật</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/san-pham/${p.slug}`} target="_blank" className="text-xs text-gray-500 hover:text-brand-primary">Xem</Link>
                        <Link href={`/admin/products/${p.id}`} className="text-xs text-brand-primary hover:text-red-800 font-medium">Sửa</Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🧯</div>
              <p>Chưa có sản phẩm nào</p>
              <Link href="/admin/products/new" className="mt-4 inline-block text-brand-primary hover:underline text-sm">Thêm sản phẩm đầu tiên</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
