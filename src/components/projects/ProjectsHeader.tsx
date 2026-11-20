/**
 * Projects header (Figma 441:2721): dark band with the room title, hand-drawn doodles and the
 * feature portrait, which hangs over the top of the gallery wall. Below 900px the portrait
 * moves under the title.
 */
import { useT } from '../../i18n/lang'
import FeaturePortrait from './FeaturePortrait'
import { ArrowToTitle, ArrowToTitleHead, Sparkle12, Sparkle20, Underline2, UnderlineCollection } from './GalleryArt'

export default function ProjectsHeader() {
  const t = useT()
  return (
    <header className="coll-header">
      <div className="coll-header-inner">
        <p className="coll-kicker">{t('ROOM 01: THE COLLECTION')}</p>
        <h1 className="coll-title">
          <span className="coll-title-the">{t('The')} </span>
          <em className="coll-title-collection">{t('Collection')}</em>
          <UnderlineCollection className="coll-underline coll-underline--1" />
          <Underline2 className="coll-underline coll-underline--2" />
        </h1>
        <p className="coll-intro">
          {t('Seven works from the HR floor, the event hall and the campus. Hover a frame to light it, click to step inside.')}
        </p>

        <div className="coll-header-doodles" aria-hidden="true">
          <p className="coll-note coll-note--drying">{t('7 works, 2 still drying')}</p>
          <ArrowToTitle className="coll-arrow-title" />
          <ArrowToTitleHead className="coll-arrow-title-head" />
          <Sparkle20 className="coll-sparkle coll-sparkle--20" />
          <Sparkle12 className="coll-sparkle coll-sparkle--12" />
        </div>

        <FeaturePortrait />
      </div>
    </header>
  )
}
