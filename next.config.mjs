/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Giới hạn domain ảnh được phép tối ưu để giảm thiểu rủi ro DoS
    // (GHSA-9g9p-9gw9-jx7f) khi remotePatterns dùng wildcard '**'.
    // Thêm domain CDN/ảnh thật của bạn vào đây khi cần.
    remotePatterns: [
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    // Giới hạn kích thước ảnh xử lý để tránh out-of-memory
    minimumCacheTTL: 60,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' }
        ]
      }
    ]
  }
}

export default nextConfig
