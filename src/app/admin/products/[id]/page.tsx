import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import ProductEditor from '@/components/admin/ProductEditor'
import { Product } from '@/types'

export default async function EditProduct({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const found = getDb().prepare('SELECT * FROM products WHERE id = ?').get(params.id) as (Product & { id: number }) | undefined
  if (!found) redirect('/admin/products')

  return <ProductEditor product={found} isNew={false} />
}
