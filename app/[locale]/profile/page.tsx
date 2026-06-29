import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../i18n'
import Navbar from '../../components/Navbar'
import ProfileContent from './ProfileContent'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()
  const dict = await getDictionary(locale as 'en' | 'fa')

  return (
    <div className="min-h-screen bg-white" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <Navbar dict={dict} locale={locale} />
      <ProfileContent locale={locale} />
    </div>
  )
}
