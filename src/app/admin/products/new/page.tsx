import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import ProductEditor from '@/components/admin/ProductEditor'

export default async function NewProduct() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return <ProductEditor product={{ status: 'draft' }} isNew={true} />
}
