import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../i18n'
import Navbar from '../../components/Navbar'
import AuthForm from './AuthForm'

export default async function AuthPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()
  const dict = await getDictionary(locale as 'en' | 'fa')

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <Navbar dict={dict} locale={locale} />
      <AuthForm locale={locale} />
    </div>
  )
}
