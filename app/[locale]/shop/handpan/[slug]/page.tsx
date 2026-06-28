import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../../../i18n'
import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import ProductDetail from './ProductDetail'
import { supabaseAdmin } from '../../../../../lib/supabase'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!hasLocale(locale)) notFound()

  const { data: product } = await supabaseAdmin
    .from('products')
    .select('id, name_en, name_fa, slug, scale, notes, price, price_fa, description_en, description_fa, note_arrangement, in_stock')
    .eq('slug', slug)
    .single()

  if (!product) notFound()

  const { data: imageRows } = await supabaseAdmin
    .from('product_images')
    .select('url')
    .eq('product_id', product.id)
    .order('sort_order', { ascending: true })

  const images = imageRows?.map((r) => r.url) ?? []
  const dict = await getDictionary(locale as 'en' | 'fa')

  return (
    <>
      <Navbar dict={dict} locale={locale} />
      <ProductDetail product={product} images={images} locale={locale} dict={dict} />
      <Footer />
    </>
  )
}
