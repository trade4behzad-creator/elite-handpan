import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../i18n'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { supabaseAdmin } from '../../../lib/supabase-admin'

const fallbackContent = {
  en: {
    eyebrow: 'OUR STORY',
    heading: 'About Elite',
    body: 'Kouhanian Handicrafts Company was founded in 2023 by Maziar Kouhanian Khajouei, with the goal of producing high-quality handpan instruments. Through continuous efforts and steady growth, the company has developed premium instruments for both the domestic market and export to European countries and beyond. Drawing on the expertise of skilled artisans, Elite is committed to advancing craftsmanship to compete with the world\'s finest handpan makers — with sales teams active in Germany, Netherlands, and Switzerland. The company also produces handpan accessories, supports artists in their creative endeavors, and sponsors concerts and music events.',
  },
  fa: {
    eyebrow: 'داستان ما',
    heading: 'درباره الیت',
    body: 'شرکت صنایع دستی کوهانیان در سال‌۱۴۰۲ به همت آقای مازیار کوهانیان خواجوئی فعالیت‌خود را در زمینه تولید ساز هندپن ( هنگدرام) آغاز کرده با توجه به فعالیت‌های مستمر و پیشرفت مناسب این مجموعه در توسعه تولیدات با کیفیت در داخل کشور و همچنین صادرات محصولات تولید شده به کشور های اروپایی و اقصا نقاط دنیا و با استفاده از تجربیات و ظرفیت‌های علمی هنرمندان حاضر در مجموعه، تاسیس شد. پیشبرد توسعه و تحقیق پیرامون حفظ و افزایش کیفیت ساخت به جهت رقابت با بهترین شرکت‌های تولید کننده ساز هندپن (هنگدرام) در دنیا و همچنین گسترش تیم فروش در کشور المان و هلند و سوئیس میباشد. از دیگر فعالیت‌های این مجموعه می‌توان به تولید انواع لوازم جانبی برای ساز هندپن (هنگ درام) سرمایه‌گذاری و پشتیبانی از هنرمندان در جهت تولید آثار هنری خود برگزاری کنسرت و اسپانسرینگ های متعدد در زمینه موسیقی و ساز هندپن (هنگدرام)',
  },
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(locale)) notFound()

  const dict = await getDictionary(locale as 'en' | 'fa')
  const lang = locale as 'en' | 'fa'
  const isRtl = locale === 'fa'

  const { data: settings } = await supabaseAdmin
    .from('site_settings')
    .select('about_heading_en, about_heading_fa, about_body_en, about_body_fa, about_hero_image_url, about_team_image_url')
    .eq('id', 1)
    .maybeSingle()

  const c = {
    eyebrow: fallbackContent[lang].eyebrow,
    heading: (lang === 'fa' ? settings?.about_heading_fa : settings?.about_heading_en) || fallbackContent[lang].heading,
    body: (lang === 'fa' ? settings?.about_body_fa : settings?.about_body_en) || fallbackContent[lang].body,
  }

  const heroImage = settings?.about_hero_image_url || '/images/about-page/hero.jpg'
  const teamImage = settings?.about_team_image_url || '/images/about-page/team.jpg'

  return (
    <>
      <Navbar dict={dict} locale={locale} />

      {/* 1. Hero */}
      <div className="relative w-full" style={{ height: '60vh' }}>
        <img
          src={heroImage}
          alt="Elite Handpan workshop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: '#3F3E7A', fontFamily: 'var(--font-inter)' }}
          >
            {c.eyebrow}
          </p>
          <h1
            className="text-5xl md:text-7xl font-light text-white"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {c.heading}
          </h1>
        </div>
      </div>

      {/* 2. Main content */}
      <section className="bg-white py-24 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Part A — Text */}
          <p
            className="text-gray-700 text-lg leading-relaxed"
            style={{
              fontFamily: 'var(--font-inter)',
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            {c.body}
          </p>

          {/* Part B — Team image */}
          <div className="mt-16">
            <img
              src={teamImage}
              alt="Elite Handpan team"
              className="w-full rounded-sm object-cover"
              style={{ maxHeight: '600px' }}
            />
          </div>
        </div>
      </section>

      {/* 3. Stats row removed per request */}

      <Footer locale={locale} />
    </>
  )
}
