/**
 * Museum colour tokens for code that can't read CSS custom properties
 * (three.js materials, canvas 2D textures). Hex values are the resolved Museum-mode
 * values from src/styles/tokens.css (generated from Figma "playground" › Portfolio
 * Tokens). If tokens.css is regenerated, update these to match.
 * CSS should use var(--color-*) instead of importing this.
 */
export const MUSEUM = {
  bgPage: '#F0EAE1',          // plaster-ivory
  bgSurface: '#ECE3DA',       // fresco-plaster
  bgSurfaceStrong: '#D7D2C9', // warm-stone
  bgCard: '#FAF6EF',          // card
  bgInverse: '#2E241D',       // deep-umber
  bgInverseRaised: '#3E3128', // umber-raised
  bgAccent: '#D9A066',        // ochre
  bgAccentStrong: '#A64B3C',  // madder-red
  bgHighlight: '#EBCFAE',     // terracotta-light

  textPrimary: '#2E241D',     // deep-umber
  textMuted: '#7F5B46',       // burnt-umber
  textNav: '#7A6A5C',         // nav
  textAccent: '#A64B3C',      // madder-red
  textOnAccent: '#2E241D',    // deep-umber
  textOnInverse: '#F0EAE1',   // plaster-ivory
  textOnInverseMuted: '#BFB3A3', // ivory-muted

  borderDefault: '#D7C9B5',   // crack
  borderStrong: '#8A7A68',    // crack-dark
} as const
