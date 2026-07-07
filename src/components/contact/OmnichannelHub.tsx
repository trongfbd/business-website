'use client'
import { useState, useEffect, useRef } from 'react'
import { Phone, Mail, Map } from 'lucide-react'
import { SiteConfig } from '@/types'

function trackEvent(action: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, { event_category: 'contact' })
  }
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventType: action, page: window.location.pathname })
  }).catch(() => {})
}

const TikTokIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.91a8.16 8.16 0 004.77 1.52V7.01a4.85 4.85 0 01-1-.32z"/>
  </svg>
)

const MessengerIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.946 1.37 5.581 3.526 7.38V22l3.208-1.78c.857.24 1.766.37 2.266.37 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.007 12.44l-2.545-2.718-4.97 2.718 5.466-5.804 2.607 2.718 4.908-2.718-5.466 5.804z"/>
  </svg>
)

// Biểu tượng bubble-chat tự vẽ, không dùng logo chính thức của Zalo Corp,
// đủ để người dùng nhận diện đây là kênh chat Zalo.
const ZaloIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.84 1.276 5.39 3.36 7.16-.16.96-.59 2.27-1.43 3.39-.13.18.03.42.25.36 1.7-.46 3.06-1.32 3.8-1.89.93.27 1.93.41 2.97.41h.1c5.523 0 10.04-4.14 10.04-9.24C21.1 6.145 17.523 2 12 2z" fill="currentColor"/>
    <text x="12" y="14.8" textAnchor="middle" fontSize="9" fontWeight="800" fill="#2563eb">Z</text>
  </svg>
)

export function DesktopContactHub({ config }: { config: SiteConfig }) {
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const items = [
    { id: 'hotline', label: config.hotlineDisplay, icon: <Phone className="w-5 h-5" />, href: `tel:${config.hotline}`, bg: 'bg-green-500 hover:bg-green-600', action: 'call_click', external: false },
    { id: 'zalo', label: 'Chat Zalo', icon: <ZaloIcon />, href: config.zalo, bg: 'bg-blue-500 hover:bg-blue-600', action: 'zalo_click', external: true },
    { id: 'messenger', label: 'Messenger', icon: <MessengerIcon />, href: config.messenger, bg: 'bg-indigo-500 hover:bg-indigo-600', action: 'messenger_click', external: true },
    { id: 'tiktok', label: 'TikTok', icon: <TikTokIcon />, href: config.tiktok, bg: 'bg-gray-900 hover:bg-black', action: 'tiktok_click', external: true },
    { id: 'email', label: 'Gửi Email', icon: <Mail className="w-5 h-5" />, href: `mailto:${config.email}`, bg: 'bg-red-500 hover:bg-red-600', action: 'email_click', external: false },
    { id: 'maps', label: 'Bản đồ', icon: <Map className="w-5 h-5" />, href: config.googleBusinessUrl, bg: 'bg-orange-500 hover:bg-orange-600', action: 'map_click', external: true },
  ]

  return (
    <div className="fixed right-4 bottom-24 z-40 hidden lg:flex flex-col items-end gap-2">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel="noopener noreferrer"
          onClick={() => trackEvent(item.action)}
          className={`group flex items-center gap-2 px-3 py-2.5 rounded-full shadow-lg text-white transition-all duration-300 ${item.bg} ${item.id === 'hotline' && shaking ? 'animate-bounce' : ''}`}
        >
          {item.icon}
          <span className="max-w-0 overflow-hidden group-hover:max-w-[140px] transition-all duration-300 whitespace-nowrap text-sm font-medium">
            {item.label}
          </span>
        </a>
      ))}
    </div>
  )
}

export function MobileContactBar({ config }: { config: SiteConfig }) {
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY
      setVisible(y < lastScrollY.current || y < 100)
      lastScrollY.current = y
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const items = [
    { label: 'Gọi ngay', icon: <Phone className="w-5 h-5" />, href: `tel:${config.hotline}`, color: 'text-green-600', action: 'call_click' },
    { label: 'Zalo', icon: <ZaloIcon />, href: config.zalo, color: 'text-blue-600', action: 'zalo_click' },
    { label: 'Messenger', icon: <MessengerIcon />, href: config.messenger, color: 'text-indigo-600', action: 'messenger_click' },
    { label: 'TikTok', icon: <TikTokIcon />, href: config.tiktok, color: 'text-gray-900', action: 'tiktok_click' },
    { label: 'Chỉ đường', icon: <Map className="w-5 h-5" />, href: config.googleBusinessUrl, color: 'text-orange-600', action: 'map_click' },
  ]

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t shadow-2xl transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="flex">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith('tel:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            onClick={() => trackEvent(item.action)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 ${item.color} active:bg-gray-50`}
          >
            {item.icon}
            <span className="text-xs text-gray-600">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}
