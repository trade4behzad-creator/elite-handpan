import { notFound } from 'next/navigation'
import { supabaseAdmin } from '../../../../../../lib/supabase'
import EditProductForm from './EditProductForm'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: product } = await supabaseAdmin
    .from('products')
    .select('id, name_en, name_fa, slug, scale, notes, price, description_en, description_fa, note_arrangement, in_stock')
    .eq('id', id)
    .single()

  if (!product) notFound()

  const { data: images } = await supabaseAdmin
    .from('product_images')
    .select('id, url, order')
    .eq('product_id', id)
    .order('order', { ascending: true })

  return <EditProductForm product={product} images={images ?? []} />
}
