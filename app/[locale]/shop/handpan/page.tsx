import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary, hasLocale } from '../../../i18n'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

const products = [
  { id: 1, slug: 'elite-solstice', name: 'Elite Solstice', scale: 'D Minor',  notes: 9,  price: '$1,400', image: '/images/portfolio/p1.jpg' },
  { id: 2, slug: 'elite-aurora',   name: 'Elite Aurora',   scale: 'F# Major', notes: 8,  price: '$1,250', image: '/images/portfolio/p2.jpg' },
  { id: 3, slug: 'elite-eclipse',  name: 'Elite Eclipse',  scale: 'C# Minor', notes: 10, price: '$1,600', image: '/images/portfolio/p3.jpg' },
  { id: 4, slug: 'elite-zenith',   name: 'Elite Zenith',   scale: 'E Minor',  notes: 9,  price: '$1,350', image: '/images/portfolio/p4.jpg' },
  { id: 5, slug: 'elite-nocturne', name: 'Elite Nocturne', scale: 'A Minor',  notes: 9,  price: '$1,500', image: '/images/portfolio/p5.jpg' },
  { id: 6, slug: 'elite-equinox',  name: 'Elite Equinox',  scale: 'G Major',  notes: 8,  price: '$1,200', image: '/images/portfolio/p6.jpg' },
]

export default async function ShopHandpanPage({
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

      <main className="min-h-screen bg-white pt-32 pb-24 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="mb-16">
            <p
              className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Collection
            </p>
            <h1
              className="text-5xl md:text-6xl font-light text-[#111111]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Handpan
            </h1>
            <div className="mt-6 h-px w-16 bg-[#C9A84C] opacity-60" />
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/${locale}/shop/handpan/${product.slug}`}
                className="group block bg-white border border-gray-200 hover:border-[#C9A84C]/60 transition-all duration-300 rounded-[4px] overflow-hidden p-6"
              >
                <div className="aspect-square bg-[#f5f5f5] flex items-center justify-center rounded-sm overflow-hidden mb-5 p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <h3
                  className="text-lg md:text-xl text-[#111111] font-semibold mb-1"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-gray-500 text-xs tracking-wider mb-4"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {product.scale} · {product.notes} {dict.products.notes}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#C9A84C] text-sm font-medium">
                    {product.price}
                  </span>
                  <span className="text-xs tracking-[0.2em] text-gray-400 group-hover:text-[#C9A84C] transition-colors uppercase border border-gray-200 group-hover:border-[#C9A84C]/60 px-3 py-1.5 rounded-[2px]">
                    {dict.products.cta}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
