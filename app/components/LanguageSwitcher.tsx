'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(/^\/(en|fa)/, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-2 text-sm tracking-widest">
      <button
        onClick={() => switchLocale('en')}
        className={`transition-colors ${
          locale === 'en'
            ? 'text-[#C9A84C]'
            : 'text-white/50 hover:text-white'
        }`}
      >
        EN
      </button>
      <span className="text-white/20">|</span>
      <button
        onClick={() => switchLocale('fa')}
        className={`transition-colors ${
          locale === 'fa'
            ? 'text-[#C9A84C]'
            : 'text-white/50 hover:text-white'
        }`}
      >
        FA
      </button>
    </div>
  )
}
