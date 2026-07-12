import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = getDb().prepare('SELECT * FROM products WHERE id = ?').get(params.id)
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (!body.name) return NextResponse.json({ error: 'Tên sản phẩm là bắt buộc' }, { status: 400 })

  getDb().prepare(`
    UPDATE products SET
      name=?, meta_title=?, meta_description=?, keywords=?, images=?,
      short_description=?, description=?, category=?, price=?, status=?, featured=?, sort_order=?,
      updated_at=datetime('now','localtime')
    WHERE id=?
  `).run(
    body.name,
    body.metaTitle || null,
    body.metaDescription || null,
    body.keywords || null,
    JSON.stringify(body.images || []),
    body.shortDescription || null,
    body.description || null,
    body.category || null,
    body.price === '' || body.price === undefined || body.price === null ? null : Number(body.price),
    body.status || 'draft',
    body.featured ? 1 : 0,
    body.sortOrder ? Number(body.sortOrder) : 0,
    params.id
  )

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  getDb().prepare('DELETE FROM products WHERE id = ?').run(params.id)
  return NextResponse.json({ ok: true })
}
