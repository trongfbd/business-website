'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Menu, X, ChevronDown } from 'lucide-react'
import { SiteConfig } from '@/types'
import Logo from '@/components/ui/Logo'

const NAV_ITEMS = [
  { label: 'Trang Chủ', href: '/' },
  { label: 'Giới Thiệu', href: '/#about' },
  { label: 'Dịch Vụ', href: '/#services', children: [
    { label: 'Dịch Vụ 1', href: '/services/1' },
    { label: 'Dịch Vụ 2', href: '/services/2' },
    { label: 'Dịch Vụ 3', href: '/services/3' },
  ]},
  { label: 'Blog', href: '/blog' },
  { label: 'Liên Hệ', href: '/#contact' },
]

export default function Header({ config }: { config: SiteConfig }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-2' : 'bg-white/95 backdrop-blur-sm py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Logo config={config} size={40} />
            <span className={`font-display font-bold text-brand-dark transition-all ${scrolled ? 'text-lg' : 'text-xl'}`}>
              {config.companyName.split(' ').slice(-2).join(' ')}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative group">
                {item.children ? (
                  <button
                    className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-brand-primary font-medium transition-colors rounded-lg hover:bg-blue-50"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <Link href={item.href} className="px-4 py-2 text-gray-700 hover:text-brand-primary font-medium transition-colors rounded-lg hover:bg-blue-50 block">
                    {item.label}
                  </Link>
                )}
                {item.children && (
                  <div
                    className={`absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 transition-all ${activeDropdown === item.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.children.map((child) => (
                      <Link key={child.label} href={child.href} className="block px-4 py-3 text-gray-700 hover:text-brand-primary hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl transition-colors">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 text-brand-primary">
              <Phone className="w-4 h-4 animate-pulse" />
              <a href={`tel:${config.hotline}`} className="font-bold text-lg hover:text-brand-secondary transition-colors">
                {config.hotlineDisplay}
              </a>
            </div>
            <a
              href={`tel:${config.hotline}`}
              className="bg-brand-accent hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md text-sm"
            >
              {config.ctaText}
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100">
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} href={item.href} className="block py-3 px-2 text-gray-700 hover:text-brand-primary font-medium border-b border-gray-50" onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <a href={`tel:${config.hotline}`} className="flex items-center justify-center gap-2 bg-brand-primary text-white py-3 rounded-xl font-semibold">
                <Phone className="w-4 h-4" />
                Gọi: {config.hotlineDisplay}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
