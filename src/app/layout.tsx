import type { Metadata } from 'next'
import './globals.css'
import { getSiteConfig } from '@/lib/config'

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig()
  const rawUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  // Đảm bảo luôn có https:// để tránh lỗi "Invalid URL" khi Railway
  // inject domain không có protocol (vd: "xxx.up.railway.app")
  const baseUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`
  return {
    metadataBase: new URL(baseUrl),
    title: { default: config.companyName, template: `%s | ${config.companyName}` },
    description: config.description,
    openGraph: {
      type: 'website',
      siteName: config.companyName,
      images: [config.ogImage],
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig()
  return (
    <html lang="vi">
      <head>
        {config.gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${config.gaId}`} />
            <script dangerouslySetInnerHTML={{__html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${config.gaId}');`}} />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
