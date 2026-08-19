import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../i18n'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CartClient from './CartClient'
import { supabaseAdmin } from '../../../lib/supabase-admin'

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()
  const dict = await getDictionary(locale as 'en' | 'fa')

  const { data: settings } = await supabaseAdmin
    .from('site_settings')
    .select('payment_accounts_text, cheque_sample_url, whatsapp_number, terms_fa, terms_en')
    .eq('id', 1)
    .maybeSingle()

  return (
    <>
      <Navbar dict={dict} locale={locale} />
      <CartClient
        locale={locale}
        settings={{
          payment_accounts_text: settings?.payment_accounts_text ?? null,
          cheque_sample_url: settings?.cheque_sample_url ?? null,
          whatsapp_number: settings?.whatsapp_number ?? null,
          terms_fa: settings?.terms_fa ?? null,
          terms_en: settings?.terms_en ?? null,
        }}
      />
      <Footer locale={locale} />
    </>
  )
}
