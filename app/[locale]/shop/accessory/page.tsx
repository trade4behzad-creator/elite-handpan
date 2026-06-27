import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../../i18n'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

export default async function ShopAccessoryPage({
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

      <main className="min-h-screen bg-white flex flex-col items-center justify-center px-8 text-center">
        <p
          className="text-4xl text-[#C9A84C] mb-6 select-none"
          aria-hidden="true"
        >
          ◉
        </p>
        <h1
          className="text-4xl md:text-5xl font-light text-[#111111] mb-4"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Accessories Coming Soon
        </h1>
        <p
          className="text-gray-500 text-base"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          We&apos;re preparing something special.
        </p>
      </main>

      <Footer />
    </>
  )
}
