import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../../../i18n'
import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import AccessoryDetail from './AccessoryDetail'
import { supabaseAdmin } from '../../../../../lib/supabase'

export default async function AccessoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!hasLocale(locale)) notFound()

  const { data: accessory } = await supabaseAdmin
    .from('accessories')
    .select('id, name_en, name_fa, slug, category, price, price_fa, description_en, description_fa, in_stock')
    .eq('slug', slug)
    .single()

  if (!accessory) notFound()

  const { data: imageRows } = await supabaseAdmin
    .from('accessory_images')
    .select('url')
    .eq('accessory_id', accessory.id)
    .order('sort_order', { ascending: true })

  const images = imageRows?.map((r) => r.url) ?? []
  const dict = await getDictionary(locale as 'en' | 'fa')

  return (
    <>
      <Navbar dict={dict} locale={locale} />
      <AccessoryDetail accessory={accessory} images={images} locale={locale} dict={dict} />
      <Footer />
    </>
  )
}
