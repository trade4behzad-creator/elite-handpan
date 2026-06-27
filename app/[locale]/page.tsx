import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../i18n'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import ProductsSection from '../components/ProductsSection'
import Footer from '../components/Footer'

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
      <AboutSection locale={locale} />
      <ProductsSection dict={dict} locale={locale} />
      <Footer />
    </main>
  )
}
