import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  if (!rateLimit(ip, 5, 60000)) return NextResponse.json({ error: 'Quá nhiều yêu cầu' }, { status: 429 })
  const { username, password } = await req.json()
  if (!username || !password) return NextResponse.json({ error: 'Vui lòng nhập đầy đủ thông tin' }, { status: 400 })
  const db = getDb()
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as { id: number; username: string; password: string; role: string } | undefined
  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' }, { status: 401 })
  }
  const token = signToken({ id: user.id, username: user.username, role: user.role })
  const response = NextResponse.json({ ok: true })
  response.cookies.set(setAuthCookie(token))
  return response
}
