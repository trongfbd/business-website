const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

export function rateLimit(ip: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now - record.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return true
  }
  
  if (record.count >= limit) return false
  record.count++
  return true
}
