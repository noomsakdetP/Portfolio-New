import { useLang, useT } from '../i18n/lang'

/** EN / TH switch for the navbar. */
export default function LangToggle() {
  const { lang, setLang } = useLang()
  const t = useT()
  const next = lang === 'en' ? 'th' : 'en'
  return (
    <button
      className="lang-toggle"
      onClick={() => setLang(next)}
      aria-label={next === 'th' ? t('Switch to Thai') : t('Switch to English')}
      lang={next}
    >
      <span className={lang === 'en' ? 'on' : ''}>EN</span>
      <span className={lang === 'th' ? 'on' : ''}>TH</span>
    </button>
  )
}
