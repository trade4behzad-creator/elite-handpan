import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../i18n'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import FaqAccordion from './FaqAccordion'

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()
  const dict = await getDictionary(locale as 'en' | 'fa')

  return (
    <>
      <Navbar dict={dict} locale={locale} />

      <main className="min-h-screen bg-white">
        {/* Page header */}
        <div className="text-center pt-32 pb-16 px-8">
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: '#C9A84C', fontFamily: 'var(--font-inter)' }}
          >
            Support
          </p>
          <h1
            className="text-5xl font-light text-[#111111]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Frequently Asked Questions
          </h1>
          <div className="mx-auto mt-6 w-12 h-px bg-[#C9A84C]" />
        </div>

        <FaqAccordion />
      </main>

      <Footer />
    </>
  )
}
