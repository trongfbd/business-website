import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import PostEditor from '@/components/admin/PostEditor'

export default async function NewPost() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return <PostEditor post={{ status: 'draft', author: session.username }} isNew={true} />
}
