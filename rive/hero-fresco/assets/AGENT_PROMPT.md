# Prompt for your coding agent (Rive CLI)

Run from `Projects/Portfolio`. Copy the 3 PNGs and `rig.json` into `rive/hero-fresco/assets/` first.

```
Use the Rive CLI project in rive/hero-fresco.

Build an artboard "Hero" sized 1672x941 from the three images in assets/,
stacked at 0,0 in the order listed in assets/rig.json (bg-no-arms, arm-man, arm-cat).

Rig the two arm images using the joint coordinates in rig.json:
- arm-man: a 3-bone chain shoulder > elbow > wrist > fingertip, mesh-bound to the image
- arm-cat: a 3-bone chain shoulder > elbow > wrist > paw_tip, mesh-bound to the image
If meshes/bones are not possible from the CLI, fall back to rotating each arm image
around its shoulder point.

Animations (follow "animation_idea" in rig.json):
- idle: gentle breathing loop for both arms
- swat: the cat winds up, swats with overshoot, returns; the man's arm flinches right after the hit

State machine "Hero":
- starts in idle
- boolean input "reducedMotion": when true, stay still on idle frame 0
- trigger input "swat" and a pointer-enter listener on the cat area both play swat once, then back to idle

Check with `rive <dir> --verify` and `rive inspect`, render a frame of idle and of the
swat peak so I can compare, then export to public/hero-fresco.riv.
```

Then in React:

```tsx
import { useRive, useStateMachineInput } from '@rive-app/react-webgl2'

export default function HeroFresco() {
  const { rive, RiveComponent } = useRive({ src: '/hero-fresco.riv', stateMachines: 'Hero', autoplay: true })
  const reduced = useStateMachineInput(rive, 'Hero', 'reducedMotion')
  if (reduced) reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return <RiveComponent className="hero-fresco" aria-label="The Creation of Components: me and my cat" role="img" />
}
```
