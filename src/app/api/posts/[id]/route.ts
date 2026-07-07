import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const post = getDb().prepare('SELECT * FROM posts WHERE id = ?').get(params.id)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  getDb().prepare(`UPDATE posts SET title=?,meta_title=?,meta_description=?,keywords=?,thumbnail=?,short_description=?,content=?,category=?,tags=?,faq=?,author=?,status=?,updated_at=datetime('now','localtime') WHERE id=?`)
    .run(body.title,body.metaTitle,body.metaDescription,body.keywords,body.thumbnail,body.shortDescription,body.content,body.category,JSON.stringify(body.tags||[]),JSON.stringify(body.faq||[]),body.author,body.status,params.id)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  getDb().prepare('DELETE FROM posts WHERE id = ?').run(params.id)
  return NextResponse.json({ ok: true })
}
