import { useEffect, useState, type ReactNode } from 'react'
import { LangContext, type Lang } from './lang'

const KEY = 'portfolio-lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'en' || saved === 'th') return saved
  } catch { /* storage blocked — fall through */ }
  return 'en'
}

/** Holds the current language, remembers it per browser, and sets <html lang>. */
export default function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem(KEY, lang) } catch { /* ignore */ }
  }, [lang])

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}
