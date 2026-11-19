"""Turn the Figma SVG exports of Home v2 / Desktop › Experience (364:2659) into small TSX
components. Path data is copied verbatim; colours become token classes.

Usage: python -I scripts/gen_experience_art.py design/figma-exports/experience src/components/home/ExperienceArt.tsx
"""
import re
import sys
from pathlib import Path

src, out = Path(sys.argv[1]), Path(sys.argv[2])
COLOR = {"#2E241D": "ink", "#D9A066": "ochre", "#A64B3C": "madder", "#F0EAE1": "page"}
ATTR = {"stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin",
        "cx": "cx", "cy": "cy", "r": "r", "x": "x", "y": "y", "width": "width", "height": "height", "rx": "rx", "d": "d"}


def shapes(name, extra=""):
    svg = (src / f"{name}.svg").read_text(encoding="utf-8")
    body = svg.split("<defs>")[0]
    out_lines = []
    for m in re.finditer(r"<(path|circle|rect)\s([^>]*?)/>", body):
        tag, raw = m.group(1), m.group(2)
        attrs = dict(re.findall(r'([\w-]+)="([^"]*)"', raw))
        cls = []
        if "stroke" in attrs:
            cls.append("xa-stroke-" + COLOR[attrs["stroke"].upper()])
        if "fill" in attrs:
            cls.append("xa-fill-" + COLOR[attrs["fill"].upper()])
        if extra:
            cls.append(extra)
        jsx = " ".join(f'{ATTR[k]}="{v}"' for k, v in attrs.items() if k in ATTR)
        if extra == "xp-yarn-path":
            jsx = "pathLength={1} " + jsx   # drawn on scroll via stroke-dashoffset
        out_lines.append(f'      <{tag} className="{" ".join(cls)}" {jsx} />')
    return "\n".join(out_lines)


def viewbox(name):
    return re.search(r'viewBox="([^"]+)"', (src / f"{name}.svg").read_text(encoding="utf-8")).group(1)


def comp(fn, name, vb=None, cls="", extra="", pl=False):
    attr_pl = ' preserveAspectRatio="none"' if pl else ""
    return f"""export function {fn}({{ className = '' }}: {{ className?: string }}) {{
  return (
    <svg className={{`{cls} ${{className}}`}} viewBox="{vb or viewbox(name)}"{attr_pl} fill="none" aria-hidden="true" focusable="false">
{shapes(name, extra)}
    </svg>
  )
}}
"""


parts = [
    # yarn: the two exported parts, cropped to each vector's bounds (Figma: drawn y16 h247.9,
    # not reached y263.9 h228.1), stretched to the job's height in CSS
    comp("YarnDrawn", "yarn-drawn", vb="0 16 51 247.9", cls="xp-yarn", extra="xp-yarn-path", pl=True),
    comp("YarnNotReached", "yarn-not-reached", vb="0 263.9 51 228.1", cls="xp-yarn", extra="xp-yarn-path", pl=True),
    comp("DotCurrent", "dot-active", cls="xp-dot xp-dot--current"),
    comp("DotPast", "dot-next", cls="xp-dot xp-dot--past"),
    comp("HeadingUnderline", "underline", cls="xp-underline", extra="xp-draw"),
    comp("ArrowToProjects", "arrow-timeline-projects", cls="xp-arrow xp-arrow--projects", extra="xp-draw"),
    comp("ArrowToCard", "arrow-note-card", cls="xp-arrow xp-arrow--card", extra="xp-draw"),
]
header = '''/**
 * Hand-drawn art for Work Experience, generated from the Figma SVG exports of
 * Home v2 / Desktop › Experience (364:2659) by scripts/gen_experience_art.py.
 * Paths are verbatim; regenerate rather than hand-edit. Colours: .xa-* in Experience.css.
 */
'''
out.write_text(header + "\n".join(parts), encoding="utf-8", newline="\n")
print("wrote", out)
