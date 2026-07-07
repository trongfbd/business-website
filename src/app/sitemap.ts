import { MetadataRoute } from 'next'
import { getDb } from '@/lib/db'
import { Post } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const db = getDb()
  const posts = db.prepare('SELECT slug, updated_at as updatedAt FROM posts WHERE status = ?').all('published') as { slug: string; updatedAt: string }[]

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    ...posts.map((p) => {
      const d = new Date(p.updatedAt.replace(' ', 'T'))
      return { url: `${BASE_URL}/blog/${p.slug}`, lastModified: isNaN(d.getTime()) ? new Date() : d, changeFrequency: 'weekly' as const, priority: 0.6 }
    }),
  ]
}
