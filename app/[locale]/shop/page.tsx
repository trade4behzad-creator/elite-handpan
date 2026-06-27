import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary, hasLocale } from '../../i18n'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const categories = [
  {
    slug: 'handpan',
    title: 'Handpan',
    subtitle: 'Explore our handcrafted scales',
    image: '/images/shop/handpan-category.jpg',
  },
  {
    slug: 'accessory',
    title: 'Accessories',
    subtitle: 'Cases, stands, oils and more',
    image: '/images/shop/accessory-category.jpg',
  },
]

export default async function ShopPage({
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
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h1
              className="text-5xl text-[#111111] font-light"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Shop
            </h1>
            <div className="mx-auto mt-4 w-16 h-px bg-[#C9A84C]" />
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${locale}/shop/${cat.slug}`}
                className="group block bg-white border border-gray-200 hover:border-[#C9A84C] rounded-sm overflow-hidden transition-colors duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <h2
                    className="text-2xl text-[#111111] font-light mb-1"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    {cat.title}
                  </h2>
                  <p
                    className="text-sm text-gray-500"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {cat.subtitle}
                  </p>
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
