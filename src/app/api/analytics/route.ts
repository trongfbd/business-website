import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  if (!rateLimit(ip, 60, 60000)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const { eventType, page, metadata } = await req.json()
  const db = getDb()
  db.prepare('INSERT INTO analytics (event_type, page, metadata, ip, user_agent) VALUES (?, ?, ?, ?, ?)').run(
    eventType, page, JSON.stringify(metadata || {}), ip, req.headers.get('user-agent')
  )
  return NextResponse.json({ ok: true })
}
