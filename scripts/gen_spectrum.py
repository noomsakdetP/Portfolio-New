"""Merge the Figma SVG exports of "Spectrum: Design → Code" (364:2598) into one TSX
component. Path data is copied verbatim; colours become token classes.

Usage: python -I scripts/gen_spectrum.py design/figma-exports/spectrum src/components/home/SpectrumArt.tsx"""
import re
import sys
from pathlib import Path

src = Path(sys.argv[1])          # folder with the downloaded SVGs
out = Path(sys.argv[2])          # output .tsx

COLOR = {"#2E241D": "ink", "#D9A066": "ochre", "#A9B9BC": "sky", "#A64B3C": "madder", "#EBCFAE": "terracotta"}


def paths(name):
    svg = (src / f"{name}.svg").read_text(encoding="utf-8")
    res = []
    for m in re.finditer(r"<path ([^>]*)/>", svg):
        attrs = dict(re.findall(r'([\w-]+)="([^"]*)"', m.group(1)))
        cls = []
        if "stroke" in attrs:
            cls.append("sp-stroke-" + COLOR[attrs["stroke"].upper()])
        if "fill" in attrs:
            cls.append("sp-fill-" + COLOR[attrs["fill"].upper()])
        jsx = {"d": attrs["d"]}
        if "stroke-width" in attrs:
            jsx["strokeWidth"] = attrs["stroke-width"]
        if "stroke-linecap" in attrs:
            jsx["strokeLinecap"] = attrs["stroke-linecap"]
        if "stroke-linejoin" in attrs:
            jsx["strokeLinejoin"] = attrs["stroke-linejoin"]
        res.append((" ".join(cls), jsx))
    return res


def render(name, extra_cls="", indent="      ", extra_attr=""):
    lines = []
    for cls, jsx in paths(name):
        c = (cls + " " + extra_cls).strip()
        attrs = "".join(f' {k}="{v}"' for k, v in jsx.items() if k != "d")
        lines.append(f'{indent}<path className="{c}"{attrs}{extra_attr} d="{jsx["d"]}" />')
    return "\n".join(lines)


parts = []
parts.append("      {/* line: hand-drawn dashes, drawn on scroll (pathLength=1 + stroke-dashoffset) */}")
parts.append(render("line", "spectrum-line", extra_attr=" pathLength={1}"))
parts.append("      {/* ends */}")
parts.append(render("end-design"))
parts.append(render("end-code"))
for i in range(1, 7):
    parts.append(f'      <g className="spectrum-stop" style={{{{ "--i": {i} }} as CSSProperties}}>')
    parts.append(render(f"tick-{i}", indent="        "))
    parts.append(render(f"dot-{i}", indent="        "))
    parts.append("      </g>")
parts.append('      <g className="spectrum-me">')
parts.append(render("me-halo", "spectrum-me-halo", indent="        "))
parts.append(render("me-dot", "spectrum-me-dot", indent="        "))
parts.append("      </g>")
parts.append('      <g className="spectrum-pointer">')
parts.append(render("arrow-me", indent="        "))
parts.append('        <g transform="translate(432.4 44)">')
parts.append(render("underline", indent="          "))
parts.append("        </g>")
parts.append("      </g>")

tsx = f"""/**
 * Spectrum art: Design → Code. Generated from the Figma SVG exports of
 * playground › Home v2 / Desktop › "Spectrum: Design → Code" (364:2598), paths verbatim.
 * Regenerate rather than hand-edit. Colours: .sp-stroke-* / .sp-fill-* in WhatIDo.css.
 */
import type {{ CSSProperties }} from 'react'

export default function SpectrumArt() {{
  return (
    <svg className="spectrum-art" viewBox="0 0 1120 360" fill="none" aria-hidden="true" focusable="false">
{chr(10).join(parts)}
    </svg>
  )
}}
"""
out.write_text(tsx, encoding="utf-8", newline="\n")
print("wrote", out, len(tsx), "bytes")
