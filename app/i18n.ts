export type Dictionary = {
  nav: { products: string; shop: string; about: string; contact: string; faq: string }
  hero: { eyebrow: string; title: string; subtitle: string }
  products: { heading: string; notes: string; cta: string; addToCart: string }
  contact: { heading: string; tagline: string }
  specialOffer: { eyebrow: string; cta: string }
}

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('./dictionaries/en.json').then((m) => m.default as Dictionary),
  fa: () => import('./dictionaries/fa.json').then((m) => m.default as Dictionary),
}

export type Locale = 'en' | 'fa'

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]()
