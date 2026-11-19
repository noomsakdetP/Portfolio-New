/**
 * Work Experience. Figma: Home v2 / Desktop › Experience (364:2659).
 *
 * Development annotation, "Reveal one job per scroll": the yarn draws down the
 * timeline (useScrollTimeline) and each job fades/slides in only when the yarn reaches
 * its dot; until then it sits at 30% (Figma shows the 2nd job in that state).
 * Content lives in src/data/experience.ts.
 */
import '@fontsource/noto-emoji/400.css'
import { useT } from '../../i18n/lang'
import { useScrollTimeline } from '../../hooks/useScrollTimeline'
import { JOBS, RESPONSIBLE_PROJECTS } from '../../data/experience'
import { ArrowToCard, ArrowToProjects, DotCurrent, DotPast, HeadingUnderline, YarnDrawn, YarnNotReached } from './ExperienceArt'
import './Experience.css'

export default function Experience() {
  const t = useT()
  const timelineRef = useScrollTimeline<HTMLOListElement>('.xp-job')

  return (
    <section className="xp" id="experience" aria-labelledby="xp-title">
      <div className="xp-inner">
        {/* ── left: journey ── */}
        <div className="xp-journey">
          <p className="xp-kicker">{t("MY JOURNEY")}</p>
          <h2 id="xp-title" className="xp-title">{t("Work Experience")}</h2>
          <HeadingUnderline />
          <p className="xp-note xp-note--jobs" aria-hidden="true">{t("2 jobs, 1 journey")}</p>

          <ol className="xp-timeline" ref={timelineRef}>
            {JOBS.map((job, i) => (
              <li key={job.period} className={`xp-job${job.current ? ' xp-job--current' : ''}`}>
                {i === 0 ? <YarnDrawn /> : <YarnNotReached />}
                <span className="xp-dot-wrap">{job.current ? <DotCurrent /> : <DotPast />}</span>
                <div className="xp-job-content">
                  <p className="xp-period">{t(job.period)}</p>
                  <h3 className="xp-company">{t(job.company[0])}<br />{t(job.company[1])}</h3>
                  <p className="xp-role">{t(job.role)}</p>
                  {Array.isArray(job.body)
                    ? <ul className="xp-body xp-body--list">{job.body.map(line => <li key={line}>{t(line)}</li>)}</ul>
                    : <p className="xp-body">{t(job.body)}</p>}
                </div>
                {i === 0 && <ArrowToProjects />}
              </li>
            ))}
          </ol>
        </div>

        {/* ── right: projects I was responsible for ── */}
        <div className="xp-projects">
          <span className="xp-tape xp-tape--top" aria-hidden="true" />
          <span className="xp-tape xp-tape--bottom" aria-hidden="true" />
          <p className="xp-note xp-note--led" aria-hidden="true">{t("I led these!")}</p>
          <ArrowToCard />

          <h3 className="xp-projects-title">{t("The project I'm responsible for")}</h3>
          <ul className="xp-project-list">
            {RESPONSIBLE_PROJECTS.map(p => (
              <li key={p.title} className="xp-project">
                <p className="xp-project-head">
                  <span className="xp-project-emoji" aria-hidden="true">{p.emoji}</span>
                  <span className="xp-project-title">{t(p.title)}</span>
                </p>
                <p className="xp-project-desc">{t(p.desc)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
