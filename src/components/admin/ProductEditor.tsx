'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Product } from '@/types'
import { X, Star } from 'lucide-react'

interface Props {
  product: Partial<Product> & { id?: number }
  isNew: boolean
}

export default function ProductEditor({ product: initialProduct, isNew }: Props) {
  const router = useRouter()

  const initialImages: string[] = (() => {
    try { return JSON.parse((initialProduct as any).images || '[]') } catch { return [] }
  })()

  const [product, setProduct] = useState({
    name: initialProduct.name || '',
    metaTitle: (initialProduct as any).meta_title || '',
    metaDescription: (initialProduct as any).meta_description || '',
    keywords: initialProduct.keywords || '',
    shortDescription: (initialProduct as any).short_description || '',
    description: initialProduct.description || '',
    category: initialProduct.category || '',
    price: initialProduct.price !== null && initialProduct.price !== undefined ? String(initialProduct.price) : '',
    status: initialProduct.status || 'draft',
    featured: !!Number((initialProduct as any).featured || 0),
    sortOrder: String((initialProduct as any).sort_order || 0),
  })
  const [images, setImages] = useState<string[]>(initialImages)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)

  function set<K extends keyof typeof product>(key: K, value: typeof product[K]) {
    setProduct((prev) => ({ ...prev, [key]: value }))
  }

  async function uploadImages(files: FileList) {
    setUploading(true)
    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) uploaded.push(data.url)
    }
    setImages((prev) => [...prev, ...uploaded])
    setUploading(false)
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  function setAsMain(idx: number) {
    setImages((prev) => {
      const copy = [...prev]
      const [item] = copy.splice(idx, 1)
      return [item, ...copy]
    })
  }

  async function save(status?: string) {
    if (!product.name.trim()) {
      setMsg('❌ Vui lòng nhập tên sản phẩm')
      setTimeout(() => setMsg(''), 3000)
      return
    }
    setSaving(true)
    const payload = { ...product, status: status || product.status, images, price: product.price === '' ? null : product.price }
    const url = isNew ? '/api/products' : `/api/products/${initialProduct.id}`
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      setMsg(status === 'published' ? '✅ Đã đăng sản phẩm!' : '✅ Đã lưu!')
      if (isNew) { const d = await res.json(); router.push(`/admin/products/${d.id}`) }
    } else {
      const err = await res.json().catch(() => ({}))
      setMsg(`❌ ${err.error || 'Lỗi khi lưu'}`)
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function deleteProduct() {
    if (!confirm('Xóa sản phẩm này?')) return
    await fetch(`/api/products/${initialProduct.id}`, { method: 'DELETE' })
    router.push('/admin/products')
  }

  const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="text-gray-500 hover:text-brand-primary text-sm">← Danh sách</Link>
            <h1 className="text-xl font-display font-bold text-brand-dark">{isNew ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}</h1>
          </div>
          <div className="flex items-center gap-3">
            {msg && <span className="text-sm">{msg}</span>}
            {!isNew && <button onClick={deleteProduct} className="text-red-500 hover:text-red-700 text-sm px-3 py-2">Xóa</button>}
            <button onClick={() => save('draft')} disabled={saving} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors">Lưu nháp</button>
            <button onClick={() => save('published')} disabled={saving} className="bg-brand-primary hover:bg-red-800 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors">Hiển thị</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-brand-dark mb-4">Thông Tin Sản Phẩm</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Tên sản phẩm *</label>
                  <input className={inputClass} value={product.name} onChange={(e) => set('name', e.target.value)} placeholder="VD: Bình chữa cháy bột ABC MFZ4" />
                </div>
                <div>
                  <label className={labelClass}>Mô tả ngắn</label>
                  <textarea className={inputClass} rows={3} value={product.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} placeholder="Hiển thị ngoài danh sách sản phẩm" />
                </div>
                <div>
                  <label className={labelClass}>Mô tả chi tiết (Markdown)</label>
                  <textarea className={`${inputClass} font-mono`} rows={14} value={product.description} onChange={(e) => set('description', e.target.value)} placeholder="Đặc điểm, thông số kỹ thuật... viết bằng Markdown" />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-brand-dark mb-1">Hình Ảnh Sản Phẩm</h2>
              <p className="text-xs text-gray-400 mb-4">Ảnh đầu tiên là ảnh đại diện. Bấm ★ để đặt ảnh khác làm đại diện.</p>
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                  {images.map((img, i) => (
                    <div key={img + i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Ảnh ${i + 1}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-brand-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Đại diện</span>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        {i !== 0 && (
                          <button type="button" onClick={() => setAsMain(i)} title="Đặt làm ảnh đại diện" className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white">
                            <Star className="w-3.5 h-3.5 text-brand-primary" />
                          </button>
                        )}
                        <button type="button" onClick={() => removeImage(i)} title="Xóa ảnh" className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white">
                          <X className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <label className="block w-full text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-4 cursor-pointer hover:bg-gray-100 transition-colors text-sm text-gray-500">
                {uploading ? 'Đang tải ảnh...' : '📎 Tải lên ảnh (chọn nhiều ảnh cùng lúc)'}
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && e.target.files.length > 0 && uploadImages(e.target.files)} />
              </label>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* SEO */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-brand-dark mb-4">SEO</h2>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Meta Title</label>
                  <input className={inputClass} value={product.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} placeholder="Tiêu đề SEO (55-65 ký tự)" />
                  <div className="text-xs text-gray-400 mt-1">{product.metaTitle.length}/65 ký tự</div>
                </div>
                <div>
                  <label className={labelClass}>Meta Description</label>
                  <textarea className={inputClass} rows={3} value={product.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} placeholder="Mô tả SEO (150-160 ký tự)" />
                  <div className="text-xs text-gray-400 mt-1">{product.metaDescription.length}/160 ký tự</div>
                </div>
                <div>
                  <label className={labelClass}>Keywords</label>
                  <input className={inputClass} value={product.keywords} onChange={(e) => set('keywords', e.target.value)} placeholder="từ khóa, cách nhau bằng dấu phẩy" />
                </div>
              </div>
            </div>

            {/* Pricing & Category */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-brand-dark mb-4">Giá & Phân Loại</h2>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Giá (VNĐ)</label>
                  <input type="number" min="0" className={inputClass} value={product.price} onChange={(e) => set('price', e.target.value)} placeholder="Để trống nếu cần báo giá riêng" />
                  <div className="text-xs text-gray-400 mt-1">Để trống sẽ hiển thị &ldquo;Liên hệ báo giá&rdquo;</div>
                </div>
                <div>
                  <label className={labelClass}>Danh mục</label>
                  <input className={inputClass} value={product.category} onChange={(e) => set('category', e.target.value)} placeholder="VD: Bình chữa cháy, Hệ thống báo cháy..." />
                </div>
                <div>
                  <label className={labelClass}>Thứ tự hiển thị</label>
                  <input type="number" className={inputClass} value={product.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} placeholder="0" />
                  <div className="text-xs text-gray-400 mt-1">Số nhỏ hơn hiển thị trước</div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-brand-dark mb-4">Trạng Thái</h2>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Hiển thị</label>
                  <select className={inputClass} value={product.status} onChange={(e) => set('status', e.target.value as 'draft' | 'published')}>
                    <option value="draft">Bản nháp (ẩn)</option>
                    <option value="published">Hiển thị công khai</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 p-3 bg-red-50 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={product.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 accent-brand-primary" />
                  <div>
                    <div className="font-medium text-brand-dark text-sm">Sản phẩm nổi bật</div>
                    <div className="text-xs text-gray-500">Hiển thị ưu tiên ở trang chủ</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
