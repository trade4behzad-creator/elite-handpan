import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../i18n'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import ProductsSection from '../components/ProductsSection'
import ContactSection from '../components/ContactSection'

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(locale)) notFound()

  const dict = await getDictionary(locale as 'en' | 'fa')

  return (
    <main>
      <Navbar dict={dict} locale={locale} />
      <HeroSection dict={dict} locale={locale} />
      <ProductsSection dict={dict} locale={locale} />
      <ContactSection dict={dict} locale={locale} />
    </main>
  )
}
