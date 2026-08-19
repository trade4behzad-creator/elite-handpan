import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../i18n'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import FaqAccordion from './FaqAccordion'
import { supabaseAdmin } from '../../../lib/supabase-admin'

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()
  const dict = await getDictionary(locale as 'en' | 'fa')

  const { data: faqRows } = await supabaseAdmin
    .from('faqs')
    .select('question_en, question_fa, answer_en, answer_fa')
    .order('sort_order', { ascending: true })

  const faqs = (faqRows ?? []).map((row) => ({
    q: locale === 'fa' && row.question_fa ? row.question_fa : row.question_en,
    a: locale === 'fa' && row.answer_fa ? row.answer_fa : row.answer_en,
  }))

  return (
    <>
      <Navbar dict={dict} locale={locale} />

      <main className="min-h-screen bg-white">
        {/* Page header */}
        <div className="text-center pt-32 pb-16 px-8">
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: '#3F3E7A', fontFamily: 'var(--font-inter)' }}
          >
            {locale === 'fa' ? 'پشتیبانی' : 'Support'}
          </p>
          <h1
            className="text-5xl font-light text-[#111111]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {locale === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
          </h1>
          <div className="mx-auto mt-6 w-12 h-px bg-[#3F3E7A]" />
        </div>

        <FaqAccordion faqs={faqs} />
      </main>

      <Footer locale={locale} />
    </>
  )
}
