export type Dictionary = {
  nav: { products: string; contact: string }
  hero: { eyebrow: string; title: string; subtitle: string }
  products: { heading: string; notes: string; cta: string }
  contact: { heading: string; tagline: string }
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
