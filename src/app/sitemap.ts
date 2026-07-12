import { MetadataRoute } from 'next'
import { getDb } from '@/lib/db'

const rawBase = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com'
const BASE_URL = rawBase.startsWith('http') ? rawBase : `https://${rawBase}`

function toDate(raw: string): Date {
  const d = new Date(raw.replace(' ', 'T'))
  return isNaN(d.getTime()) ? new Date() : d
}

export default function sitemap(): MetadataRoute.Sitemap {
  const db = getDb()
  const posts = db.prepare('SELECT slug, updated_at as updatedAt FROM posts WHERE status = ?').all('published') as { slug: string; updatedAt: string }[]
  const products = db.prepare('SELECT slug, updated_at as updatedAt FROM products WHERE status = ?').all('published') as { slug: string; updatedAt: string }[]

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/san-pham`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    ...products.map((p) => ({
      url: `${BASE_URL}/san-pham/${p.slug}`,
      lastModified: toDate(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: toDate(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
