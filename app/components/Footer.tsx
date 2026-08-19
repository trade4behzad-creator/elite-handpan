import Image from 'next/image'
import Link from 'next/link'
import { supabaseAdmin } from '../../lib/supabase-admin'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.462 3.485 1.34 5.003l-1.42 5.19 5.313-1.394a9.96 9.96 0 0 0 4.764 1.213h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.671-1.04-5.182-2.929-7.071a9.937 9.937 0 0 0-7.072-2.941zm0 18.174h-.003a8.16 8.16 0 0 1-4.158-1.14l-.298-.177-3.153.827.842-3.075-.194-.315a8.15 8.15 0 0 1-1.253-4.34c0-4.508 3.669-8.176 8.18-8.176a8.13 8.13 0 0 1 5.784 2.398 8.12 8.12 0 0 1 2.395 5.782c0 4.508-3.669 8.216-8.14 8.216z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function GoldDivider() {
  return <div className="w-10 h-[2px] bg-[#3F3E7A] mt-1 mb-4" />
}

export default async function Footer({ locale }: { locale: string }) {
  const isFa = locale === 'fa'
  const { data: instagramPosts } = await supabaseAdmin
    .from('instagram_posts')
    .select('*')
    .order('order', { ascending: true })
    .limit(6)

  const { data: settings } = await supabaseAdmin
    .from('site_settings')
    .select('contact_email, contact_phone, contact_address, whatsapp_number, instagram_url')
    .eq('id', 1)
    .maybeSingle()

  const contactEmail = settings?.contact_email || 'info@elitehandpan.com'
  const contactPhone = settings?.contact_phone || '+989000000000'
  const contactAddress = settings?.contact_address || 'Tehran, Iran'
  const whatsappNumber = settings?.whatsapp_number || contactPhone
  const instagramUrl = settings?.instagram_url || 'https://www.instagram.com/elite_handpan/'

  const posts = instagramPosts ?? []
  const emptySlots = Math.max(0, 6 - posts.length)

  const socialLinks = [
    { icon: <InstagramIcon />, label: 'Instagram', href: instagramUrl },
    {
      icon: <WhatsAppIcon />,
      label: 'WhatsApp',
      href: `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`,
    },
  ]

  return (
    <footer id="contact" className="relative bg-[#0d0d0d] text-white overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about.jpg"
          alt=""
          fill
          className="object-cover opacity-10"
          aria-hidden="true"
        />
      </div>

      {/* Main footer content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Col 1 — Brand */}
          <div className="flex flex-col items-start">
            <Image
              src="/images/logo.png"
              alt="Elite Handpan Logo"
              width={120}
              height={60}
              className="object-contain"
              style={{ height: '60px', width: 'auto' }}
            />
            <p className="mt-3 text-lg font-semibold tracking-[0.25em] uppercase">ELITE</p>
            <div className="flex gap-3 mt-5">
              {socialLinks.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-white/40 text-white hover:border-[#3F3E7A] hover:text-[#3F3E7A] transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Contact us */}
          <div>
            <h3 className="text-base font-semibold">{isFa ? 'تماس با ما' : 'Contact us'}</h3>
            <GoldDivider />
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href={`mailto:${contactEmail}`} className="hover:text-[#3F3E7A] transition-colors">
                  {contactEmail}
                </a>
              </li>
              <li>
                <a href={`tel:${contactPhone}`} className="hover:text-[#3F3E7A] transition-colors">
                  {contactPhone}
                </a>
              </li>
              <li className="text-gray-400">{contactAddress}</li>
            </ul>
          </div>

          {/* Col 3 — Other Links */}
          <div>
            <h3 className="text-base font-semibold">{isFa ? 'لینک‌های دیگر' : 'Other Links'}</h3>
            <GoldDivider />
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href={`/${locale}/about`} className="hover:text-[#3F3E7A] transition-colors">
                  {isFa ? 'درباره ما' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-[#3F3E7A] transition-colors">
                  {isFa ? 'تماس با ما' : 'Contact Us'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="hover:text-[#3F3E7A] transition-colors">
                  {isFa ? 'سوالات متداول' : 'FAQ'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 — Instagram */}
          <div>
            <h3 className="text-base font-semibold">{isFa ? 'اینستاگرام' : 'Instagram'}</h3>
            <GoldDivider />
            <div className="grid grid-cols-3 gap-1.5">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={post.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square block relative overflow-hidden rounded-sm group"
                >
                  <Image
                    src={post.image_url}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 33vw, 150px"
                    className="object-cover group-hover:opacity-80 transition-opacity"
                  />
                </a>
              ))}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square bg-[#2a2a2a] rounded-sm"
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10">
        <div className="w-full h-px bg-[#3F3E7A]" />
        <p className="text-center text-sm text-gray-500 py-5">
          {isFa ? 'کلیه حقوق محفوظ است © ۲۰۲۶ الیت هندپن.' : 'Copyrights 2026 © Elite Handpan. All rights reserved.'}
        </p>
      </div>
    </footer>
  )
}