'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Post } from '@/types'

interface Props {
  post: Partial<Post>
  isNew: boolean
}

export default function PostEditor({ post: initialPost, isNew }: Props) {
  const router = useRouter()
  const [post, setPost] = useState({
    title: initialPost.title || '',
    metaTitle: (initialPost as any).meta_title || '',
    metaDescription: (initialPost as any).meta_description || '',
    keywords: initialPost.keywords || '',
    thumbnail: initialPost.thumbnail || '',
    shortDescription: (initialPost as any).short_description || '',
    content: initialPost.content || '',
    category: initialPost.category || '',
    tags: initialPost.tags || '',
    author: initialPost.author || 'Admin',
    status: initialPost.status || 'draft',
    faq: (initialPost as any).faq || '[]',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)

  function set(key: string, value: string) {
    setPost(prev => ({ ...prev, [key]: value }))
  }

  async function uploadImage(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)
    if (data.url) set('thumbnail', data.url)
  }

  async function save(status?: string) {
    setSaving(true)
    const payload = { ...post, status: status || post.status }
    const url = isNew ? '/api/posts' : `/api/posts/${(initialPost as any).id}`
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      setMsg(status === 'published' ? '✅ Đã xuất bản!' : '✅ Đã lưu!')
      if (isNew) { const d = await res.json(); router.push(`/admin/posts/${d.id}`) }
    } else {
      setMsg('❌ Lỗi khi lưu')
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function deletePost() {
    if (!confirm('Xóa bài viết này?')) return
    await fetch(`/api/posts/${(initialPost as any).id}`, { method: 'DELETE' })
    router.push('/admin/posts')
  }

  const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/posts" className="text-gray-500 hover:text-brand-primary text-sm">← Danh sách</Link>
            <h1 className="text-xl font-display font-bold text-brand-dark">{isNew ? 'Tạo bài viết mới' : 'Chỉnh sửa bài viết'}</h1>
          </div>
          <div className="flex items-center gap-3">
            {msg && <span className="text-sm">{msg}</span>}
            {!isNew && <button onClick={deletePost} className="text-red-500 hover:text-red-700 text-sm px-3 py-2">Xóa</button>}
            <button onClick={() => save('draft')} disabled={saving} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors">Lưu nháp</button>
            <button onClick={() => save('published')} disabled={saving} className="bg-brand-primary hover:bg-red-800 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors">Xuất bản</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-brand-dark mb-4">Nội Dung Bài Viết</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Tiêu đề *</label>
                  <input className={inputClass} value={post.title} onChange={e => set('title', e.target.value)} placeholder="Nhập tiêu đề bài viết" />
                </div>
                <div>
                  <label className={labelClass}>Mô tả ngắn</label>
                  <textarea className={inputClass} rows={3} value={post.shortDescription} onChange={e => set('shortDescription', e.target.value)} placeholder="Mô tả ngắn hiển thị ngoài danh sách" />
                </div>
                <div>
                  <label className={labelClass}>Nội dung (Markdown)</label>
                  <textarea className={`${inputClass} font-mono`} rows={20} value={post.content} onChange={e => set('content', e.target.value)} placeholder="Viết nội dung bằng Markdown..." />
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-brand-dark mb-4">FAQ (JSON)</h2>
              <textarea className={`${inputClass} font-mono`} rows={6} value={post.faq} onChange={e => set('faq', e.target.value)} placeholder='[{"question":"Câu hỏi?","answer":"Câu trả lời"}]' />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Thumbnail */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-brand-dark mb-4">Ảnh đại diện</h2>
              {post.thumbnail && <img src={post.thumbnail} alt="" className="w-full aspect-video object-cover rounded-xl mb-3" />}
              <input className={inputClass} value={post.thumbnail} onChange={e => set('thumbnail', e.target.value)} placeholder="URL ảnh" />
              <div className="mt-3">
                <label className="block w-full text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-3 cursor-pointer hover:bg-gray-100 transition-colors text-sm text-gray-500">
                  {uploading ? 'Đang tải...' : '📎 Upload ảnh'}
                  <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                </label>
              </div>
            </div>

            {/* Meta SEO */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-brand-dark mb-4">SEO</h2>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Meta Title</label>
                  <input className={inputClass} value={post.metaTitle} onChange={e => set('metaTitle', e.target.value)} placeholder="Tiêu đề SEO (nên 55-65 ký tự)" />
                  <div className="text-xs text-gray-400 mt-1">{post.metaTitle.length}/65 ký tự</div>
                </div>
                <div>
                  <label className={labelClass}>Meta Description</label>
                  <textarea className={inputClass} rows={3} value={post.metaDescription} onChange={e => set('metaDescription', e.target.value)} placeholder="Mô tả SEO (nên 150-160 ký tự)" />
                  <div className="text-xs text-gray-400 mt-1">{post.metaDescription.length}/160 ký tự</div>
                </div>
                <div>
                  <label className={labelClass}>Keywords</label>
                  <input className={inputClass} value={post.keywords} onChange={e => set('keywords', e.target.value)} placeholder="từ khóa, cách nhau bằng dấu phẩy" />
                </div>
              </div>
            </div>

            {/* Category & Tags */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-brand-dark mb-4">Phân loại</h2>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Danh mục</label>
                  <input className={inputClass} value={post.category} onChange={e => set('category', e.target.value)} placeholder="VD: Tin tức, Hướng dẫn..." />
                </div>
                <div>
                  <label className={labelClass}>Tags</label>
                  <input className={inputClass} value={post.tags} onChange={e => set('tags', e.target.value)} placeholder="tag1, tag2, tag3" />
                </div>
                <div>
                  <label className={labelClass}>Tác giả</label>
                  <input className={inputClass} value={post.author} onChange={e => set('author', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Trạng thái</label>
                  <select className={inputClass} value={post.status} onChange={e => set('status', e.target.value)}>
                    <option value="draft">Bản nháp</option>
                    <option value="published">Xuất bản</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
