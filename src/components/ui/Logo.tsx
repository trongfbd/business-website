'use client'
import { useState } from 'react'
import { SiteConfig } from '@/types'

interface LogoProps {
  config: SiteConfig
  size?: number
  dark?: boolean
}

// Hiển thị ảnh logo thật từ config.logo (vd: /images/logo.svg).
// Nếu file chưa tồn tại hoặc lỗi load, tự động fallback về
// hình vuông chữ cái đầu để không vỡ giao diện.
export default function Logo({ config, size = 40, dark = false }: LogoProps) {
  const [imgError, setImgError] = useState(false)
  const hasLogo = config.logo && !imgError

  if (hasLogo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={config.logo}
        alt={config.companyName}
        width={size}
        height={size}
        className="rounded-lg object-contain"
        style={{ width: size, height: size }}
        onError={() => setImgError(true)}
      />
    )
  }

  const initial = config.companyName?.trim()?.[0]?.toUpperCase() || 'A'
  return (
    <div
      className={`rounded-lg flex items-center justify-center flex-shrink-0 ${dark ? 'bg-white text-brand-primary' : 'bg-brand-primary text-white'}`}
      style={{ width: size, height: size }}
    >
      <span className="font-bold" style={{ fontSize: size * 0.45 }}>{initial}</span>
    </div>
  )
}
