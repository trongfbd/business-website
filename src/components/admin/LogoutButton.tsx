'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Gọi API logout bằng fetch (không submit form trực tiếp tới API route),
// sau đó điều hướng về trang chủ bằng router.push — tránh trình duyệt
// cố render JSON response của API thành một "trang" gây lỗi/404.
export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={className || 'text-sm text-red-500 hover:text-red-700 disabled:opacity-60'}
    >
      {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
    </button>
  )
}
