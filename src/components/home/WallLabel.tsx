/**
 * Wall Label: the museum placard strip under the hero.
 * Figma: playground › Home v2 / Desktop › Wall Label (416:3119).
 */
import { useT } from '../../i18n/lang'
import ArrowRight from '../icons/ArrowRight'
import './WallLabel.css'

const EMAIL = 'sakdidetsuttipol@hotmail.com'

export default function WallLabel() {
  const t = useT()
  return (
    <section className="wall-label" aria-label={t("About")}>
      <div className="wall-label-placard">
        <p className="wall-label-room">{t("Room 00: Lobby")}</p>
        <p className="wall-label-title">The Creation of Components</p>
        <p className="wall-label-credit">{t("Sakdidet, 2026. Digital fresco, AI-assisted.")}</p>
      </div>

      <p className="wall-label-intro">
        {t("Design Technologist bridging design decisions into real product. From Figma tokens to production-ready components that teams can ship.")}
      </p>

      <div className="wall-label-actions">
        {/* TODO(content): no CV file yet; point href at the PDF (e.g. /sakdidet-cv.pdf) and add `download`. */}
        <a href="#" className="cv-badge">{t("Download My CV")}</a>
        <a href={`mailto:${EMAIL}`} className="email-link">
          <span>sakdidetsuttipol@<wbr />hotmail.com</span>
          <ArrowRight />
        </a>
      </div>
    </section>
  )
}
