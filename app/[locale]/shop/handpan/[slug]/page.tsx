import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../../../../i18n'
import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import ProductDetail from './ProductDetail'

const products = [
  {
    slug: 'elite-solstice',
    id: 1,
    name: 'Elite Solstice',
    scale: 'D Minor',
    notes: 9,
    price: '$1,400',
    description: 'The Elite Solstice is one of our most beloved scales, known for its warm, meditative tone. Perfect for beginners and professionals alike.',
    images: [
      '/images/shop/handpan/p1/img1.jpg',
      '/images/shop/handpan/p1/img2.jpg',
      '/images/shop/handpan/p1/img3.jpg',
    ],
    noteArrangement: 'D3, A3, Bb3, C4, D4, E4, F4, G4, A4',
    specs: {
      'Total Notes': '9',
      'Scale': 'D Minor',
      'Level': 'Beginner to Advanced',
      'Popularity': '★★★★★',
      'Included': 'Hard case, protective oil, handwoven strap',
      'Shipping': 'Ready to Ship',
    },
  },
  {
    slug: 'elite-aurora',
    id: 2,
    name: 'Elite Aurora',
    scale: 'F# Major',
    notes: 8,
    price: '$1,250',
    description: 'The Elite Aurora radiates brightness and warmth. Its major scale creates an uplifting, joyful atmosphere ideal for meditation and performance.',
    images: [
      '/images/shop/handpan/p2/img1.jpg',
      '/images/shop/handpan/p2/img2.jpg',
      '/images/shop/handpan/p2/img3.jpg',
    ],
    noteArrangement: 'F#3, C#4, D#4, F#4, G#4, A#4, C#5, D#5',
    specs: {
      'Total Notes': '8',
      'Scale': 'F# Major',
      'Level': 'Intermediate to Advanced',
      'Popularity': '★★★★★',
      'Included': 'Hard case, protective oil, handwoven strap',
      'Shipping': 'Ready to Ship',
    },
  },
  {
    slug: 'elite-eclipse',
    id: 3,
    name: 'Elite Eclipse',
    scale: 'C# Minor',
    notes: 10,
    price: '$1,600',
    description: 'The Elite Eclipse offers a rich, complex sound with 10 notes. Its minor scale creates a deep, mysterious atmosphere perfect for advanced players.',
    images: [
      '/images/shop/handpan/p3/img1.jpg',
      '/images/shop/handpan/p3/img2.jpg',
      '/images/shop/handpan/p3/img3.jpg',
    ],
    noteArrangement: 'C#3, G#3, A3, B3, C#4, D#4, E4, F#4, G#4, A4',
    specs: {
      'Total Notes': '10',
      'Scale': 'C# Minor',
      'Level': 'Advanced',
      'Popularity': '★★★★★',
      'Included': 'Hard case, protective oil, handwoven strap',
      'Shipping': 'Made to Order',
    },
  },
  {
    slug: 'elite-zenith',
    id: 4,
    name: 'Elite Zenith',
    scale: 'E Minor',
    notes: 9,
    price: '$1,350',
    description: 'The Elite Zenith combines clarity and depth in E Minor, producing a balanced tone that suits both solo and ensemble playing.',
    images: [
      '/images/shop/handpan/p4/img1.jpg',
      '/images/shop/handpan/p4/img2.jpg',
      '/images/shop/handpan/p4/img3.jpg',
    ],
    noteArrangement: 'E3, B3, C4, D4, E4, F#4, G4, A4, B4',
    specs: {
      'Total Notes': '9',
      'Scale': 'E Minor',
      'Level': 'Beginner to Advanced',
      'Popularity': '★★★★★',
      'Included': 'Hard case, protective oil, handwoven strap',
      'Shipping': 'Ready to Ship',
    },
  },
  {
    slug: 'elite-nocturne',
    id: 5,
    name: 'Elite Nocturne',
    scale: 'A Minor',
    notes: 9,
    price: '$1,500',
    description: 'The Elite Nocturne evokes the stillness of night. Its A Minor scale is deeply emotional and resonant, ideal for meditative and concert settings.',
    images: [
      '/images/shop/handpan/p5/img1.jpg',
      '/images/shop/handpan/p5/img2.jpg',
      '/images/shop/handpan/p5/img3.jpg',
    ],
    noteArrangement: 'A3, E4, F4, G4, A4, B4, C5, D5, E5',
    specs: {
      'Total Notes': '9',
      'Scale': 'A Minor',
      'Level': 'All Levels',
      'Popularity': '★★★★★',
      'Included': 'Hard case, protective oil, handwoven strap',
      'Shipping': 'Ready to Ship',
    },
  },
  {
    slug: 'elite-equinox',
    id: 6,
    name: 'Elite Equinox',
    scale: 'G Major',
    notes: 8,
    price: '$1,200',
    description: 'The Elite Equinox brings balance and harmony. Its G Major scale is bright and versatile, perfect for players seeking a cheerful, open sound.',
    images: [
      '/images/shop/handpan/p6/img1.jpg',
      '/images/shop/handpan/p6/img2.jpg',
      '/images/shop/handpan/p6/img3.jpg',
    ],
    noteArrangement: 'G3, D4, E4, G4, A4, B4, D5, E5',
    specs: {
      'Total Notes': '8',
      'Scale': 'G Major',
      'Level': 'Beginner to Intermediate',
      'Popularity': '★★★★★',
      'Included': 'Hard case, protective oil, handwoven strap',
      'Shipping': 'Ready to Ship',
    },
  },
]

export async function generateStaticParams() {
  const locales = ['en', 'fa']
  return locales.flatMap((locale) =>
    products.map((p) => ({ locale, slug: p.slug }))
  )
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!hasLocale(locale)) notFound()

  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  const dict = await getDictionary(locale as 'en' | 'fa')

  return (
    <>
      <Navbar dict={dict} locale={locale} />
      <ProductDetail product={product} locale={locale} dict={dict} />
      <Footer />
    </>
  )
}
