import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getSession } from '@/lib/auth'
import slugify from 'slugify'

export async function GET(req: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = 'SELECT * FROM posts'
  const params: (string | number)[] = []
  if (status) { query += ' WHERE status = ?'; params.push(status) }
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  params.push(limit, offset)

  const posts = db.prepare(query).all(...params)
  const total = db.prepare(`SELECT COUNT(*) as count FROM posts${status ? ' WHERE status = ?' : ''}`).get(...(status ? [status] : [])) as { count: number }
  return NextResponse.json({ posts, total: total.count })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = getDb()

  const slug = slugify(body.title, { lower: true, locale: 'vi', strict: true }) + '-' + Date.now().toString(36)

  const result = db.prepare(`
    INSERT INTO posts (title, slug, meta_title, meta_description, keywords, thumbnail, short_description, content, category, tags, faq, author, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(body.title, slug, body.metaTitle, body.metaDescription, body.keywords, body.thumbnail, body.shortDescription, body.content, body.category, JSON.stringify(body.tags || []), JSON.stringify(body.faq || []), body.author || session.username, body.status || 'draft')

  return NextResponse.json({ id: result.lastInsertRowid, slug })
}
