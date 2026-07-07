import { NextRequest, NextResponse } from 'next/server'

// Edge runtime can't run the `jsonwebtoken` package (Node-only APIs).
// Middleware only checks cookie presence for a fast redirect; the actual
// JWT signature verification happens in `getSession()` on each protected
// page/route, which runs in the Node.js runtime.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
