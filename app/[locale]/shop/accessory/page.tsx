import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary, hasLocale } from '../../../i18n'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

const products = [
  { id: 1, slug: 'elite-case-pro', name: 'Elite Case Pro', description: 'Hard protective case',     price: '$120', image: '/images/shop/accessories/a1.jpg' },
  { id: 2, slug: 'elite-soft-bag', name: 'Elite Soft Bag', description: 'Lightweight carry bag',     price: '$80',  image: '/images/shop/accessories/a2.jpg' },
  { id: 3, slug: 'elite-stand',    name: 'Elite Stand',    description: 'Foldable instrument stand', price: '$65',  image: '/images/shop/accessories/a3.jpg' },
]

export default async function ShopAccessoryPage({
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
              Accessories
            </h1>
            <div className="mt-6 h-px w-16 bg-[#C9A84C] opacity-60" />
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/${locale}/shop/accessory/${product.slug}`}
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
                  {product.description}
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
