import { Cormorant_Garamond, Inter, Vazirmatn } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale } from '../i18n'
import '../globals.css'
import ReCaptchaProvider from './ReCaptchaProvider'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-cormorant',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
})

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fa' }]
}

export const metadata = {
  title: 'Elite Handpan',
  description: 'Premium handpan instruments, handcrafted to order.',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(locale)) notFound()

  const dir = locale === 'fa' ? 'rtl' : 'ltr'

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cormorant.variable} ${inter.variable} ${vazirmatn.variable}`}
    >
      <body className="bg-white text-[#111111] antialiased overflow-x-hidden">
        <ReCaptchaProvider>{children}</ReCaptchaProvider>
      </body>
    </html>
  )
}
