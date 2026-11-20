/**
 * My Project: the single featured project. Figma: Home v2 / Desktop ›
 * My Project (single) (364:2680). "View all projects" goes to /projects.
 * The hidden "Hover Label" in Figma (tags + title over the image) appears on hover/focus.
 */
import TransitionLink from '../../transition/TransitionLink'
import { useT } from '../../i18n/lang'
import { FEATURED_PROJECT as P } from '../../data/featuredProject'
import { ArrowRight14, ArrowToImage, UnderlineResults, UnderlineStrategy } from './ProjectArt'
import './MyProject.css'

export default function MyProject() {
  const t = useT()
  const href = `/projects/${P.caseStudyId}`

  return (
    <section className="pj" id="projects" aria-labelledby="pj-title">
      <div className="pj-inner">
        <header className="pj-header">
          <h2 id="pj-title" className="pj-title">{t("My Project")}</h2>
          <TransitionLink to="/projects" className="pj-view-all">
            <span>{t("VIEW ALL PROJECTS")}</span>
            <span className="pj-view-all-icon"><ArrowRight14 /></span>
          </TransitionLink>
        </header>

        <div className="pj-grid">
          <div className="pj-image-wrap">
            <span className="pj-tape pj-tape--left" aria-hidden="true" />
            <span className="pj-tape pj-tape--right" aria-hidden="true" />
            <p className="pj-note" aria-hidden="true">{t("my favourite one")}</p>
            <ArrowToImage />

            <TransitionLink to={href} className="pj-image" tabIndex={-1} aria-hidden="true">
              {P.image
                ? <img src={P.image.src} width={P.image.width} height={P.image.height} alt="" loading="lazy" decoding="async" />
                : (
                  // TODO(content): image slot placeholder, as in Figma (see src/data/featuredProject.ts)
                  <span className="pj-image-slot">IMAGE SLOT<br />src/assets/project-banner.png</span>
                )}
              <span className="pj-hover-label">
                <span className="pj-hover-tag">{P.tags}</span>
                <span className="pj-hover-title">{t(P.title)}</span>
              </span>
            </TransitionLink>
          </div>

          <div className="pj-info">
            <div className="pj-block">
              <h3 className="pj-block-title">{t("Strategy")}<UnderlineStrategy /></h3>
              <p className="pj-block-body">{t(P.strategy)}</p>
            </div>
            <div className="pj-block">
              <h3 className="pj-block-title">{t("Results")}<UnderlineResults /></h3>
              <p className="pj-block-body">{t(P.results)}</p>
            </div>
            <TransitionLink to={href} className="btn-view-project" aria-label={`${t("View Project")}: ${t(P.title)}`}>
              {t("View Project")}
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  )
}
