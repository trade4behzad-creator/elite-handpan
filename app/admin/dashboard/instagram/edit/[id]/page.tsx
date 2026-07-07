import { supabaseAdmin } from '../../../../../../lib/supabase-admin'
import EditInstagramPostForm from './EditInstagramPostForm'
import { notFound } from 'next/navigation'

export default async function EditInstagramPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: post } = await supabaseAdmin
    .from('instagram_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  return <EditInstagramPostForm post={post} />
}