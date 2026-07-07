import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import PostEditor from '@/components/admin/PostEditor'
import { Post } from '@/types'

export default async function EditPost({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const isNew = params.id === 'new'
  let post: Partial<Post> = { status: 'draft', author: session.username }

  if (!isNew) {
    const found = getDb().prepare('SELECT * FROM posts WHERE id = ?').get(params.id) as Post | undefined
    if (!found) redirect('/admin/posts')
    post = found
  }

  return <PostEditor post={post} isNew={isNew} />
}
