import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../../../i18n'
import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import AccessoryDetail from './AccessoryDetail'

const accessories = [
  {
    slug: 'elite-case-pro',
    id: 1,
    name: 'Elite Case Pro',
    category: 'Case',
    price: '$120',
    description: 'A hard protective case designed specifically for Elite handpans. Shock-resistant exterior with soft interior lining to keep your instrument safe during transport.',
    images: [
      '/images/shop/accessories/a1.jpg',
      '/images/shop/accessories/a1.jpg',
      '/images/shop/accessories/a1.jpg',
    ],
    specs: {
      'Type': 'Hard Case',
      'Compatible With': 'All Elite Handpans',
      'Material': 'ABS Shell + Foam Interior',
      'Weight': '2.5 kg',
      'Included': 'Lock, shoulder strap',
      'Shipping': 'Ready to Ship',
    },
  },
  {
    slug: 'elite-soft-bag',
    id: 2,
    name: 'Elite Soft Bag',
    category: 'Bag',
    price: '$80',
    description: 'A lightweight and stylish soft bag for everyday use. Padded interior protects your handpan while remaining easy to carry.',
    images: [
      '/images/shop/accessories/a2.jpg',
      '/images/shop/accessories/a2.jpg',
      '/images/shop/accessories/a2.jpg',
    ],
    specs: {
      'Type': 'Soft Bag',
      'Compatible With': 'All Elite Handpans',
      'Material': 'Canvas + Padding',
      'Weight': '0.8 kg',
      'Included': 'Backpack straps',
      'Shipping': 'Ready to Ship',
    },
  },
  {
    slug: 'elite-stand',
    id: 3,
    name: 'Elite Stand',
    category: 'Stand',
    price: '$65',
    description: 'A foldable and adjustable stand for performing or displaying your Elite handpan. Stable, elegant, and easy to set up.',
    images: [
      '/images/shop/accessories/a3.jpg',
      '/images/shop/accessories/a3.jpg',
      '/images/shop/accessories/a3.jpg',
    ],
    specs: {
      'Type': 'Instrument Stand',
      'Compatible With': 'All Elite Handpans',
      'Material': 'Powder-coated Steel',
      'Weight': '1.2 kg',
      'Included': 'Rubber feet, carry bag',
      'Shipping': 'Ready to Ship',
    },
  },
]

export async function generateStaticParams() {
  const locales = ['en', 'fa']
  return locales.flatMap((locale) =>
    accessories.map((a) => ({ locale, slug: a.slug }))
  )
}

export default async function AccessoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!hasLocale(locale)) notFound()

  const accessory = accessories.find((a) => a.slug === slug)
  if (!accessory) notFound()

  const dict = await getDictionary(locale as 'en' | 'fa')

  return (
    <>
      <Navbar dict={dict} locale={locale} />
      <AccessoryDetail accessory={accessory} locale={locale} dict={dict} />
      <Footer />
    </>
  )
}
