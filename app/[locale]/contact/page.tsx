import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../i18n'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ContactForm from './ContactForm'

export default async function ContactPage({
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

      <main className="min-h-screen bg-white pt-16">
        {/* Page header */}
        <div className="max-w-6xl mx-auto px-8 pt-16 pb-0">
          <p
            className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Get in Touch
          </p>
          <h1
            className="text-5xl md:text-6xl font-light text-[#111111]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Contact Us
          </h1>
          <div className="mt-6 h-px w-16 bg-[#C9A84C] opacity-60" />
        </div>

        <ContactForm />
      </main>

      <Footer />
    </>
  )
}
