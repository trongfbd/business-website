import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getSession } from '@/lib/auth'
import slugify from 'slugify'

export async function GET(req: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const featured = searchParams.get('featured')
  const category = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = 'SELECT * FROM products WHERE 1=1'
  const params: (string | number)[] = []

  if (status) { query += ' AND status = ?'; params.push(status) }
  if (featured) { query += ' AND featured = ?'; params.push(featured === 'true' ? 1 : 0) }
  if (category) { query += ' AND category = ?'; params.push(category) }

  query += ' ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?'
  params.push(limit, offset)

  const products = db.prepare(query).all(...params)

  let countQuery = 'SELECT COUNT(*) as count FROM products WHERE 1=1'
  const countParams: (string | number)[] = []
  if (status) { countQuery += ' AND status = ?'; countParams.push(status) }
  if (featured) { countQuery += ' AND featured = ?'; countParams.push(featured === 'true' ? 1 : 0) }
  if (category) { countQuery += ' AND category = ?'; countParams.push(category) }
  const total = db.prepare(countQuery).get(...countParams) as { count: number }

  return NextResponse.json({ products, total: total.count })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = getDb()

  if (!body.name) return NextResponse.json({ error: 'Tên sản phẩm là bắt buộc' }, { status: 400 })

  const slug = slugify(body.name, { lower: true, locale: 'vi', strict: true }) + '-' + Date.now().toString(36)

  const result = db.prepare(`
    INSERT INTO products (name, slug, meta_title, meta_description, keywords, images, short_description, description, category, price, status, featured, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    body.name,
    slug,
    body.metaTitle || null,
    body.metaDescription || null,
    body.keywords || null,
    JSON.stringify(body.images || []),
    body.shortDescription || null,
    body.description || null,
    body.category || null,
    body.price === '' || body.price === undefined ? null : Number(body.price),
    body.status || 'draft',
    body.featured ? 1 : 0,
    body.sortOrder ? Number(body.sortOrder) : 0
  )

  return NextResponse.json({ id: result.lastInsertRowid, slug })
}
