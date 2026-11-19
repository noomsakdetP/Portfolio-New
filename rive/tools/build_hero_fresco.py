"""Generate rive/hero-fresco/scene.rml from assets/rig.json.

Run:  python -I rive/tools/build_hero_fresco.py
Then: cd rive/hero-fresco && rive . --verify

Everything (mesh grid, skin weights, bind pose, animation keys) is derived from
rig.json, so re-tune there or in the constants below and regenerate.

Angle convention: rig.json degrees are math-style (counter-clockwise positive,
y up). Rive's rotation is clockwise-positive on screen (y down), so every rig
degree is negated before keying (see rot()).
"""
import base64
import json
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.join(HERE, "..", "hero-fresco")
RIG = json.load(open(os.path.join(PROJ, "assets", "rig.json"), encoding="utf-8"))
W, H = RIG["canvas"]["width"], RIG["canvas"]["height"]

# Opaque-pixel bounds of each arm layer (measured from the PNG alpha), padded.
BOUNDS = {"man": (336, 332, 742, 493), "cat": (765, 327, 1079, 413)}
PAD = 14
GRID = 22          # target mesh cell size in px
JOINT_BLEND = 26   # px over which two bones share a vertex at a joint
PIN_BEHIND = 18    # px behind the shoulder still fully pinned to the anchor
PIN_BLEND = 40     # px over which the anchor hands over to the upper bone
COOLDOWN_FRAMES = 90  # 1.5 s @60fps after a swat during which swats are ignored

# Swat tuning (rig degrees, CCW positive; see rot())
CONTACT_FRAME = 20       # paw meets fingertip; the man's flinch starts here
CONTACT_GAP_PX = 6       # paw_tip joint stops this far short of the fingertip joint;
                         # the paw's fur reaches ~7px past its joint, so it just grazes
CAT_WRIST_KEEP = 0.4     # fraction of the wrist's rest curl kept while reaching
CAT_OVERSHOOT_DEG = 4    # follow-through past contact (down, away from the hand)
MAN_PULLBACK_PX = 18     # fingertip pulled back toward the body along the arm
MAN_SHOULDER_DEG = 7     # away from the cat (hand up and back)
MAN_WRIST_DEG = 10

_ids = [10]


def nid():
    _ids[0] += 1
    return f"0:{_ids[0]}"


def f(v):
    return f"{v:.6f}".rstrip("0").rstrip(".") if v != int(v) else str(int(v))


def deg(r):
    return math.radians(r)


def rot(rig_deg):
    """rig.json degrees (CCW+) -> Rive radians delta (CW+)."""
    return -math.radians(rig_deg)


def varuint(n):
    out = bytearray()
    while True:
        b = n & 0x7F
        n >>= 7
        out.append(b | (0x80 if n else 0))
        if not n:
            return bytes(out)


def smooth(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


class Arm:
    def __init__(self, key, joint_names, label):
        self.key, self.label = key, label
        b = RIG["bones"][key]
        self.pts = [tuple(map(float, b[n])) for n in joint_names]
        self.names = ["Upper", "Fore", "Hand"]
        # world angle + length per segment
        self.ang, self.len = [], []
        for (x0, y0), (x1, y1) in zip(self.pts, self.pts[1:]):
            self.ang.append(math.atan2(y1 - y0, x1 - x0))
            self.len.append(math.hypot(x1 - x0, y1 - y0))
        self.cum = [0.0]
        for L in self.len:
            self.cum.append(self.cum[-1] + L)
        # local (parent-relative) rotations used as rest values for the bones
        self.rest = [self.ang[0]] + [
            math.atan2(math.sin(self.ang[i] - self.ang[i - 1]),
                       math.cos(self.ang[i] - self.ang[i - 1]))
            for i in range(1, 3)
        ]
        self.anchor_id = nid()
        self.bone_ids = [nid() for _ in range(3)]

    def chain_s(self, px, py):
        """Arc length of the closest point on the polyline (ends extended)."""
        best = None
        for i, ((x0, y0), (x1, y1)) in enumerate(zip(self.pts, self.pts[1:])):
            dx, dy = x1 - x0, y1 - y0
            L2 = dx * dx + dy * dy
            t = ((px - x0) * dx + (py - y0) * dy) / L2
            lo = -math.inf if i == 0 else 0.0
            hi = math.inf if i == 2 else 1.0
            tc = max(lo, min(hi, t))
            cx, cy = x0 + tc * dx, y0 + tc * dy
            d = math.hypot(px - cx, py - cy)
            s = self.cum[i] + tc * math.sqrt(L2)
            if best is None or d < best[0]:
                best = (d, s)
        return best[1]

    def weights(self, px, py):
        """Return {tendon_index: weight} ; tendon 0 = anchor, 1..3 = bones."""
        s = self.chain_s(px, py)
        w = {}
        if s < -PIN_BEHIND + PIN_BLEND:
            a = 1 - smooth((s + PIN_BEHIND) / PIN_BLEND)
            if a > 0:
                w[0] = a
        rest = 1 - w.get(0, 0)
        if rest > 0:
            # bone weights along the chain with soft joints
            bw = [0.0, 0.0, 0.0]
            j1, j2 = self.cum[1], self.cum[2]
            t1 = smooth((s - (j1 - JOINT_BLEND / 2)) / JOINT_BLEND)
            t2 = smooth((s - (j2 - JOINT_BLEND / 2)) / JOINT_BLEND)
            bw[0] = 1 - t1
            bw[1] = t1 * (1 - t2)
            bw[2] = t1 * t2
            for i, v in enumerate(bw):
                if v > 1e-3:
                    w[i + 1] = w.get(i + 1, 0) + v * rest
        return w

    def packed(self, px, py):
        w = sorted(self.weights(px, py).items(), key=lambda kv: -kv[1])[:4]
        tot = sum(v for _, v in w)
        vals = [int(round(v / tot * 255)) for _, v in w]
        vals[0] += 255 - sum(vals)  # make it total exactly 255
        pairs = [(k, v) for (k, _), v in zip(w, vals) if v > 0]
        idx = sum((k + 1) << (8 * i) for i, (k, _) in enumerate(pairs))
        val = sum(v << (8 * i) for i, (_, v) in enumerate(pairs))
        return val, idx

    def mesh_xml(self, ind):
        x0, y0, x1, y1 = BOUNDS[self.key]
        x0, y0 = max(0, x0 - PAD), max(0, y0 - PAD)
        x1, y1 = min(W, x1 + PAD), min(H, y1 + PAD)
        nx = max(2, round((x1 - x0) / GRID)) + 1
        ny = max(2, round((y1 - y0) / GRID)) + 1
        grid = [[(x0 + (x1 - x0) * i / (nx - 1), y0 + (y1 - y0) * j / (ny - 1))
                 for i in range(nx)] for j in range(ny)]
        # contour vertices first (perimeter, clockwise), then interior
        order = []
        order += [(0, i) for i in range(nx)]
        order += [(j, nx - 1) for j in range(1, ny)]
        order += [(ny - 1, i) for i in range(nx - 2, -1, -1)]
        order += [(j, 0) for j in range(ny - 2, 0, -1)]
        n_contour = len(order)
        order += [(j, i) for j in range(1, ny - 1) for i in range(1, nx - 1)]
        index = {rc: k for k, rc in enumerate(order)}
        tris = []
        for j in range(ny - 1):
            for i in range(nx - 1):
                a, b = index[(j, i)], index[(j, i + 1)]
                c, d = index[(j + 1, i + 1)], index[(j + 1, i)]
                tris += [a, b, c, a, c, d]
        tib = base64.b64encode(b"".join(varuint(t) for t in tris)).decode()
        p = " " * ind
        out = [f'{p}<Mesh triangleIndexBytes="{tib}" name="{self.label} Mesh" id="{nid()}">']
        for k, (j, i) in enumerate(order):
            x, y = grid[j][i]
            tag = "ContourMeshVertex" if k < n_contour else "MeshVertex"
            val, idx = self.packed(x, y)
            out.append(f'{p}    <{tag} x="{f(x)}" y="{f(y)}" u="{f(x / W)}" v="{f(y / H)}" name="V{k}">')
            out.append(f'{p}        <Weight values="{val}" indices="{idx}"/>')
            out.append(f'{p}    </{tag}>')
        out.append(f'{p}    <Skin name="{self.label} Skin">')
        sx, sy = self.pts[0]
        out.append(f'{p}        <Tendon boneId="{self.anchor_id}" tx="{f(sx)}" ty="{f(sy)}" name="Anchor"/>')
        for i in range(3):
            a = self.ang[i]
            bx, by = self.pts[i]
            out.append(
                f'{p}        <Tendon boneId="{self.bone_ids[i]}" xx="{f(math.cos(a))}" xy="{f(math.sin(a))}" '
                f'yx="{f(-math.sin(a))}" yy="{f(math.cos(a))}" tx="{f(bx)}" ty="{f(by)}" name="{self.names[i]}"/>')
        out.append(f'{p}    </Skin>')
        out.append(f'{p}</Mesh>')
        self.vertex_count = len(order)
        return "\n".join(out)

    def bones_xml(self, ind):
        p = " " * ind
        sx, sy = self.pts[0]
        return "\n".join([
            f'{p}<RootBone x="{f(sx)}" y="{f(sy)}" length="1" name="{self.label} Anchor" id="{self.anchor_id}"/>',
            f'{p}<RootBone x="{f(sx)}" y="{f(sy)}" length="{f(self.len[0])}" rotation="{f(self.rest[0])}" name="{self.label} Upper" id="{self.bone_ids[0]}">',
            f'{p}    <Bone length="{f(self.len[1])}" rotation="{f(self.rest[1])}" name="{self.label} Fore" id="{self.bone_ids[1]}">',
            f'{p}        <Bone length="{f(self.len[2])}" rotation="{f(self.rest[2])}" name="{self.label} Hand" id="{self.bone_ids[2]}"/>',
            f'{p}    </Bone>',
            f'{p}</RootBone>',
        ])


def chain_tip(arm, d_rig, rels, s):
    """Forward kinematics, mirroring Rive's bone transforms: root at the shoulder
    rotated by rest + rot(d_rig) and scaled s along its length (children inherit
    the scale); `rels` are the two child bones' local rotations in radians."""
    a = arm.rest[0] + rot(d_rig)
    x, y = arm.pts[0]
    ux, uy = math.cos(a), math.sin(a)          # parent x axis (scaled by s)
    vx, vy = -math.sin(a), math.cos(a)         # parent y axis
    # root -> elbow
    x += arm.len[0] * s * ux
    y += arm.len[0] * s * uy
    ang = 0.0
    for L, r in zip(arm.len[1:], rels):
        ang += r
        lx, ly = math.cos(ang) * L, math.sin(ang) * L   # in root-local space
        x += lx * s * ux + ly * vx
        y += lx * s * uy + ly * vy
    return x, y


def cat_contact_pose(cat, man):
    """Solve the cat's shoulder angle (rig deg) and arm stretch so that, with the
    elbow straight, the paw tip lands CONTACT_GAP_PX short of the fingertip."""
    rels = (0.0, cat.rest[2] * CAT_WRIST_KEEP)
    fx, fy = man.pts[3]
    px, py = cat.pts[3]
    dx, dy = fx - px, fy - py
    dist = math.hypot(dx, dy)
    tx, ty = fx - dx / dist * CONTACT_GAP_PX, fy - dy / dist * CONTACT_GAP_PX
    best = None
    for i in range(-400, 401):
        d0 = i * 0.025                                   # -10..+10 rig deg
        lo, hi = 0.9, 1.4
        for _ in range(40):                              # stretch along the aim line
            mid = (lo + hi) / 2
            x, y = chain_tip(cat, d0, rels, mid)
            if x > tx: lo = mid
            else: hi = mid
        s = (lo + hi) / 2
        x, y = chain_tip(cat, d0, rels, s)
        err = math.hypot(x - tx, y - ty)
        if best is None or err < best[0]:
            best = (err, d0, s, (x, y))
    _, d0, s, tip = best
    return {"d0": d0, "s": s, "tip": tip, "moved": math.hypot(tip[0] - px, tip[1] - py)}


EASE_IO = (0.42, 0, 0.58, 1)      # breathing
EASE_OUT = (0.2, 0.8, 0.3, 1)     # settle / wind-up
EASE_IN = (0.6, 0, 0.9, 0.5)      # fast strike


def keyed(arm, bone, keys, ind):
    """keys: [(frame, rig_deg, ease or None)] -> KeyedObject on that bone's rotation."""
    return keyed_raw(arm.bone_ids[bone], 15,
                     [(fr, arm.rest[bone] + rot(d), e) for fr, d, e in keys], ind)


def keyed_raw(object_id, prop_key, keys, ind):
    """keys: [(frame, absolute value, ease or None)] on any double property
    (15 = rotation in radians, 16 = scaleX)."""
    p = " " * ind
    out = [f'{p}<KeyedObject objectId="{object_id}">',
           f'{p}    <KeyedProperty propertyKey="{prop_key}">']
    for frame, v, ease in keys:
        if ease:
            out.append(f'{p}        <KeyFrameDouble value="{f(v)}" frame="{frame}" interpolationType="cubic">')
            out.append(f'{p}            <CubicEaseInterpolator x1="{ease[0]}" y1="{ease[1]}" x2="{ease[2]}" y2="{ease[3]}"/>')
            out.append(f'{p}        </KeyFrameDouble>')
        else:
            out.append(f'{p}        <KeyFrameDouble value="{f(v)}" frame="{frame}" interpolationType="linear"/>')
    out += [f'{p}    </KeyedProperty>', f'{p}</KeyedObject>']
    return "\n".join(out)


def optimized_assets():
    """Re-encode the source PNGs as WebP for the shipped .riv (~10 MB -> ~0.5 MB).

    The arm PNGs are ~98% transparent but ~3.4 MB each; WebP keeps the alpha.
    Originals stay untouched in assets/. Falls back to the PNGs without Pillow.
    """
    try:
        from PIL import Image
    except ImportError:
        print("Pillow not installed: embedding the original PNGs")
        return {n: f"assets/{n}.png" for n in ("bg-no-arms", "arm-man", "arm-cat")}
    out_dir = os.path.join(PROJ, "assets", "optimized")
    os.makedirs(out_dir, exist_ok=True)
    paths = {}
    for n in ("bg-no-arms", "arm-man", "arm-cat"):
        src = os.path.join(PROJ, "assets", f"{n}.png")
        dst = os.path.join(out_dir, f"{n}.webp")
        if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
            im = Image.open(src)
            im = im.convert("RGB") if n == "bg-no-arms" else im.convert("RGBA")
            im.save(dst, "WEBP", quality=88, method=6, alpha_quality=100)
        paths[n] = f"assets/optimized/{n}.webp"
    return paths


def main():
    files = optimized_assets()
    man = Arm("man", ["shoulder", "elbow", "wrist", "fingertip"], "Man")
    cat = Arm("cat", ["shoulder", "elbow", "wrist", "paw_tip"], "Cat")

    ART, STYLE, SM, LAYER = "0:2", "0:3", "0:4", "0:5"
    IN_RM, IN_SWAT = "0:6", "0:7"
    A_BG, A_MAN, A_CAT = nid(), nid(), nid()
    HIT = nid()
    AN_IDLE, AN_SWAT, AN_REST = nid(), nid(), nid()
    S_IDLE, S_SWAT, S_REST, S_COOL = nid(), nid(), nid(), nid()

    man_mesh = man.mesh_xml(12)
    cat_mesh = cat.mesh_xml(12)

    # Cat hit area: arm + head + front of the body (does not move with the arm).
    hx0, hy0, hx1, hy1 = 755, 175, 1185, 470

    E = EASE_IO
    idle = [
        # man 0 -> -1 deg, cat 0 -> +1 deg, 3 s loop; hands lag the shoulder a little
        keyed(man, 0, [(0, 0, E), (90, -1, E), (180, 0, None)], 12),
        keyed(man, 2, [(0, 0, E), (105, -0.8, E), (180, 0, None)], 12),
        keyed(cat, 0, [(0, 0, E), (90, 1, E), (180, 0, None)], 12),
        keyed(cat, 2, [(0, 0, E), (110, 1.5, E), (180, 0, None)], 12),
    ]
    # ── swat @60fps ──────────────────────────────────────────────────────────
    # Cat: wind-up 0.25 s (f0-15) to -10 deg; fast strike to CONTACT at f20 with
    # the elbow straightened and the arm reaching ~30 px forward so the paw
    # grazes the man's fingertip; overshoot down past it (f23); return (f47).
    # Man: flinch starts AT contact (f20): arm pulls ~18 px back toward the body,
    # +7 deg shoulder and +10 deg wrist away from the cat, fast out 0.08 s (5f),
    # hold 0.2 s (12f), slow ease back 0.5 s (30f).
    c = cat_contact_pose(cat, man)
    straight = math.degrees(cat.rest[1])           # rig deg that zeroes the elbow
    wrist_c = math.degrees(cat.rest[2]) * (1 - CAT_WRIST_KEEP)
    man_s = (man.cum[3] - MAN_PULLBACK_PX) / man.cum[3]
    F_HIT, F_OVER, F_BACK = CONTACT_FRAME, CONTACT_FRAME + 3, CONTACT_FRAME + 27
    m_out, m_hold, m_back = CONTACT_FRAME + 5, CONTACT_FRAME + 5 + 12, CONTACT_FRAME + 5 + 12 + 30
    swat_len = m_back + 1
    EASE_BACK = (0.45, 0, 0.25, 1)                 # slow, soft settle
    swat = [
        keyed(cat, 0, [(0, 0, EASE_OUT), (15, -10, EASE_IN), (F_HIT, c["d0"], EASE_OUT),
                       (F_OVER, c["d0"] + CAT_OVERSHOOT_DEG, EASE_OUT), (F_BACK, 0, None)], 12),
        keyed(cat, 1, [(0, 0, EASE_OUT), (15, -4, EASE_IN), (F_HIT, straight, None),
                       (F_OVER, straight, EASE_OUT), (F_BACK + 2, 0, None)], 12),
        keyed(cat, 2, [(0, 0, EASE_OUT), (16, -14, EASE_IN), (F_HIT, wrist_c, EASE_OUT),
                       (F_OVER + 1, wrist_c + 6, EASE_OUT), (F_BACK + 5, 0, None)], 12),
        keyed_raw(cat.bone_ids[0], 16, [(0, 1, None), (15, 1, EASE_IN), (F_HIT, c["s"], None),
                                         (F_OVER, c["s"], EASE_OUT), (F_BACK, 1, None)], 12),
        keyed(man, 0, [(0, 0, None), (F_HIT, 0, EASE_OUT), (m_out, MAN_SHOULDER_DEG, None),
                       (m_hold, MAN_SHOULDER_DEG, EASE_BACK), (m_back, 0, None)], 12),
        keyed(man, 2, [(0, 0, None), (F_HIT, 0, EASE_OUT), (m_out, MAN_WRIST_DEG, None),
                       (m_hold, MAN_WRIST_DEG, EASE_BACK), (m_back, 0, None)], 12),
        keyed_raw(man.bone_ids[0], 16, [(0, 1, None), (F_HIT, 1, EASE_OUT), (m_out, man_s, None),
                                         (m_hold, man_s, EASE_BACK), (m_back, 1, None)], 12),
    ]
    print(f"contact f{F_HIT}: paw tip {c['tip'][0]:.1f},{c['tip'][1]:.1f}  man fingertip "
          f"{man.pts[3][0]:.0f},{man.pts[3][1]:.0f}  (cat d0 {c['d0']:+.2f} deg, stretch x{c['s']:.3f}, "
          f"paw moved {c['moved']:.1f}px)  man pull-back scale x{man_s:.3f}  swat {swat_len}f")
    # Rest pose held for 90 frames (1.5 s): used by the reducedMotion state and as
    # the post-swat cooldown (its 100% exit time IS the cooldown length).
    rest = [keyed(a, b, [(0, 0, None), (COOLDOWN_FRAMES, 0, None)], 12) for a in (man, cat) for b in range(3)]
    rest += [keyed_raw(a.bone_ids[0], 16, [(0, 1, None), (COOLDOWN_FRAMES, 1, None)], 12) for a in (man, cat)]

    rml = f'''<Rive version="1" kind="fragment">
    <!-- Generated by rive/tools/build_hero_fresco.py from assets/rig.json. Edit the generator, not this file. -->
    <ImageAsset file="{files['bg-no-arms']}" name="bg-no-arms" id="{A_BG}"/>
    <ImageAsset file="{files['arm-man']}" name="arm-man" id="{A_MAN}"/>
    <ImageAsset file="{files['arm-cat']}" name="arm-cat" id="{A_CAT}"/>

    <Artboard defaultStateMachineId="{SM}" styleId="{STYLE}" width="{W}" height="{H}" name="Hero" id="{ART}">
        <LayoutComponentStyle name="Artboard Style" id="{STYLE}"/>

        <!-- RML draw order: the FIRST sibling draws on top. So this list is
             rig.json's layer order reversed: hit area, arm-cat, arm-man, bg. -->
        <Shape x="{f((hx0 + hx1) / 2)}" y="{f((hy0 + hy1) / 2)}" name="Cat Hit Area" id="{HIT}">
            <Rectangle width="{hx1 - hx0}" height="{hy1 - hy0}" name="Hit Rect"/>
            <Fill name="Invisible"><SolidColor colorValue="00000000" name="Clear"/></Fill>
        </Shape>

        <Image originX="0" originY="0" assetId="{A_CAT}" name="arm-cat" id="{nid()}">
{cat_mesh}
        </Image>
        <Image originX="0" originY="0" assetId="{A_MAN}" name="arm-man" id="{nid()}">
{man_mesh}
        </Image>

        <!-- Bones: an unanimated Anchor pins the shoulder end of each arm to the body. -->
{man.bones_xml(8)}
{cat.bones_xml(8)}

        <Image originX="0" originY="0" assetId="{A_BG}" name="bg-no-arms" id="{nid()}"/>

        <StateMachine name="Hero" id="{SM}">
            <StateMachineBool name="reducedMotion" id="{IN_RM}"/>
            <StateMachineTrigger name="swat" id="{IN_SWAT}"/>

            <StateMachineListenerSingle targetId="{HIT}" listenerTypeValue="enter" name="Hover Cat" id="{nid()}">
                <ListenerTriggerChange inputId="{IN_SWAT}"/>
            </StateMachineListenerSingle>
            <StateMachineListenerSingle targetId="{HIT}" listenerTypeValue="down" name="Tap Cat" id="{nid()}">
                <ListenerTriggerChange inputId="{IN_SWAT}"/>
            </StateMachineListenerSingle>

            <StateMachineLayer name="Arms" id="{LAYER}">
                <AnyState x="0" y="-160"/>
                <ExitState x="640" y="-160"/>
                <EntryState x="0" y="0">
                    <StateTransition stateToId="{S_REST}">
                        <TransitionBoolCondition inputId="{IN_RM}" opValue="equal"/>
                    </StateTransition>
                    <StateTransition stateToId="{S_IDLE}"/>
                </EntryState>
                <AnimationState x="220" y="0" animationId="{AN_IDLE}" reset="true" id="{S_IDLE}">
                    <StateTransition stateToId="{S_REST}" duration="250">
                        <TransitionBoolCondition inputId="{IN_RM}" opValue="equal"/>
                    </StateTransition>
                    <StateTransition stateToId="{S_SWAT}" duration="80">
                        <TransitionTriggerCondition inputId="{IN_SWAT}"/>
                    </StateTransition>
                </AnimationState>
                <AnimationState x="440" y="0" animationId="{AN_SWAT}" reset="true" id="{S_SWAT}">
                    <StateTransition stateToId="{S_COOL}" duration="0"
                                     enableExitTime="true" exitTimeIsPercetange="true" exitTime="100"/>
                </AnimationState>
                <!-- Cooldown: 1.5 s holding the rest pose (= swat's last frame = idle frame 0);
                     no swat transition here, so hover/tap/trigger is ignored until it ends. -->
                <AnimationState x="440" y="160" animationId="{AN_REST}" reset="true" id="{S_COOL}">
                    <StateTransition stateToId="{S_REST}" duration="0">
                        <TransitionBoolCondition inputId="{IN_RM}" opValue="equal"/>
                    </StateTransition>
                    <StateTransition stateToId="{S_IDLE}" duration="0"
                                     enableExitTime="true" exitTimeIsPercetange="true" exitTime="100"/>
                </AnimationState>
                <AnimationState x="220" y="160" animationId="{AN_REST}" id="{S_REST}">
                    <StateTransition stateToId="{S_IDLE}" duration="250">
                        <TransitionBoolCondition inputId="{IN_RM}" opValue="notEqual"/>
                    </StateTransition>
                </AnimationState>
            </StateMachineLayer>
        </StateMachine>

        <LinearAnimation loopValue="loop" fps="60" duration="180" name="idle" id="{AN_IDLE}">
{chr(10).join(idle)}
        </LinearAnimation>

        <LinearAnimation loopValue="oneShot" fps="60" duration="{swat_len}" name="swat" id="{AN_SWAT}">
{chr(10).join(swat)}
        </LinearAnimation>

        <LinearAnimation loopValue="oneShot" fps="60" duration="{COOLDOWN_FRAMES}" name="rest (idle frame 0)" id="{AN_REST}">
{chr(10).join(rest)}
        </LinearAnimation>
    </Artboard>
</Rive>
'''
    with open(os.path.join(PROJ, "scene.rml"), "w", encoding="utf-8", newline="\n") as fh:
        fh.write(rml)
    print(f"wrote scene.rml  man mesh {man.vertex_count} verts, cat mesh {cat.vertex_count} verts")
    for a in (man, cat):
        print(a.label, "rest deg", [round(math.degrees(r), 2) for r in a.rest],
              "lengths", [round(L, 1) for L in a.len])


if __name__ == "__main__":
    main()
