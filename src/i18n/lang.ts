import { createContext, useCallback, useContext } from 'react'
import { TH } from './th'

export type Lang = 'en' | 'th'
export type LangCtx = { lang: Lang; setLang: (l: Lang) => void }

export const LangContext = createContext<LangCtx>({ lang: 'en', setLang: () => {} })

/** Translate one English string (falls back to English when there is no Thai line). */
export function translate(lang: Lang, s: string) {
  return lang === 'th' ? TH[s] ?? s : s
}

/** Translate every string inside an object/array (used for case-study data). */
export function translateDeep<T>(lang: Lang, value: T): T {
  if (lang === 'en') return value
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') return TH[v] ?? v
    if (Array.isArray(v)) return v.map(walk)
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]))
    return v
  }
  return walk(value) as T
}

export function useLang() {
  return useContext(LangContext)
}

/** `const t = useT()` → `t('English text')` */
export function useT() {
  const { lang } = useLang()
  return useCallback((s: string) => translate(lang, s), [lang])
}
