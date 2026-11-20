/**
 * Shared "has the intro curtain played?" flag for this page load.
 * CurtainLoader sets it when it plays; the page transition sets it too, so arriving at Home
 * through a client-side transition never stacks the intro curtain on top of it.
 */
let played = false

export const introPlayedThisPageLoad = () => played
export const markIntroPlayed = () => { played = true }
