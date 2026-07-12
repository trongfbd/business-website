export interface Post {
  id: number
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  keywords: string
  thumbnail: string
  shortDescription: string
  content: string
  category: string
  tags: string
  faq: string
  author: string
  status: 'draft' | 'published'
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  name: string
  slug: string
  metaTitle: string
  metaDescription: string
  keywords: string
  images: string // JSON.stringify(string[])
  shortDescription: string
  description: string
  category: string
  price: number | null
  status: 'draft' | 'published'
  featured: number // 0 | 1 (SQLite boolean)
  viewCount: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface SiteConfig {
  companyName: string
  slogan: string
  description: string
  hotline: string
  hotlineDisplay: string
  email: string
  address: string
  facebook: string
  messenger: string
  zalo: string
  tiktok: string
  youtube: string
  googleMapEmbed: string
  googleBusinessUrl: string
  workingHours: string
  ctaText: string
  gaId: string
  logo: string
  ogImage: string
}

export interface FAQ {
  question: string
  answer: string
}
