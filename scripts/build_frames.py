#!/usr/bin/env python3
"""
Builds the scroll-film frame sequences and dish stills from ../media.

  python3 scripts/build_frames.py

Outputs (served from public/):
  film/<name>/d/f_NNNN.webp  desktop, 16:9, 1280 wide
  film/<name>/m/f_NNNN.webp  mobile, portrait crop centred on the subject
  dishes/<dish>.webp, dishes/<dish>-m.webp
  src/lib/films.ts           frame counts + clip boundaries for the engine

Film "serve" = c1 (rice) + a synthetic lead-in + c2 (nalli) + orbit, concatenated
at full rate with duplicate junction frames dropped, then decimated.
"""
import json, shutil, subprocess, sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT.parent / "media"
CLIPS = MEDIA / "clips"
KEYS = MEDIA / "keyframes"
PUB = ROOT / "public"
WORK = MEDIA / "_work"

W, H = 1920, 1080
DESK_W = 1280
MOB_H, MOB_ASPECT = 1100, 0.72  # portrait crop width = height * aspect

# horizontal focal point per film (matches focalX in the components)
FOCAL = {"serve": 0.6, "fire": 0.45, "feast": 0.62}


def run(*args):
    subprocess.run(args, check=True)


def read_frames(clip: Path):
    """Decode a clip to a list of RGB arrays at W x H."""
    out = WORK / clip.stem
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    run("ffmpeg", "-v", "error", "-i", str(clip), "-vf", f"scale={W}:{H}:flags=lanczos", str(out / "%04d.png"))
    return sorted(out.glob("*.png"))


def nalli_lead_in(c1_last: Path, c2_first: Path, n=8):
    """c2's first frame already shows the shank entering at the top edge.
    Synthesize frames where that shank slides down from out of frame onto
    c1's last frame, so the seam is continuous."""
    a = np.asarray(Image.open(c1_last).convert("RGB")).astype(np.int16)
    b = np.asarray(Image.open(c2_first).convert("RGB")).astype(np.int16)
    band = int(H * 0.2)
    diff = np.abs(b[:band] - a[:band]).sum(axis=2)
    mask = (diff > 60).astype(np.float32)
    if mask.mean() < 0.004:  # c2 already opens on the bare rice: nothing to bridge
        return []
    # soften the mask edges
    m = Image.fromarray((mask * 255).astype(np.uint8)).filter(__import__("PIL.ImageFilter").ImageFilter.GaussianBlur(4))
    mask = np.asarray(m).astype(np.float32)[..., None] / 255.0
    rows = np.where(mask[..., 0].max(axis=1) > 0.2)[0]
    depth = int(rows.max()) + 1 if len(rows) else 0
    frames = []
    for k in range(1, n + 1):
        shift = int(round(depth * (1 - k / (n + 1)) ** 1.6))  # eases in, like gravity
        f = a.astype(np.float32).copy()
        if depth and shift < depth:
            src = b[shift:band].astype(np.float32)
            mk = mask[shift:band]
            h = band - shift
            f[:h] = f[:h] * (1 - mk) + src * mk
        p = WORK / f"leadin_{k:02d}.png"
        Image.fromarray(np.clip(f, 0, 255).astype(np.uint8)).save(p)
        frames.append(p)
    return frames


def write_sequence(name: str, frames, desk_step=2, mob_step=3, desk_w=DESK_W):
    fx = FOCAL[name]
    d = PUB / "film" / name / "d"
    m = PUB / "film" / name / "m"
    for p in (d, m):
        if p.exists():
            shutil.rmtree(p)
        p.mkdir(parents=True)
    cw = int(H * MOB_ASPECT)
    cx = int(round((W - cw) * fx))
    cx = max(0, min(W - cw, cx))
    nd = nm = 0
    for i, f in enumerate(frames):
        im = None
        if i % desk_step == 0 or i == len(frames) - 1:
            im = Image.open(f).convert("RGB")
            nd += 1
            im.resize((desk_w, int(desk_w * H / W)), Image.LANCZOS).save(d / f"f_{nd:04d}.webp", quality=62, method=5)
        if i % mob_step == 0 or i == len(frames) - 1:
            im = im or Image.open(f).convert("RGB")
            nm += 1
            im.crop((cx, 0, cx + cw, H)).resize((int(MOB_H * MOB_ASPECT), MOB_H), Image.LANCZOS).save(
                m / f"f_{nm:04d}.webp", quality=55, method=5
            )
    size = lambda p: sum(x.stat().st_size for x in p.glob("*.webp")) / 1e6
    print(f"{name}: desktop {nd} frames {size(d):.1f}MB · mobile {nm} frames {size(m):.1f}MB")
    return nd, nm


def dish_stills():
    out = PUB / "dishes"
    out.mkdir(parents=True, exist_ok=True)
    fx = FOCAL["serve"]
    cw = int(H * MOB_ASPECT)
    cx = max(0, min(W - cw, int(round((W - cw) * fx))))
    for src, name in [
        ("beef_biryani2", "beef-biryani"),
        ("chk_biryani", "chicken-biryani"),
        ("beef_pulao2", "beef-pulao"),
        ("chk_pulao", "chicken-pulao"),
    ]:
        im = Image.open(KEYS / f"{src}.png").convert("RGB").resize((W, H), Image.LANCZOS)
        im.save(out / f"{name}.webp", quality=84, method=6)
        im.crop((cx, 0, cx + cw, H)).resize((int(MOB_H * MOB_ASPECT), MOB_H), Image.LANCZOS).save(
            out / f"{name}-m.webp", quality=80, method=6
        )
    print("dish stills written")


def main():
    WORK.mkdir(exist_ok=True)
    films = {}

    # ---- serve: c1 + lead-in + c2 + orbit
    c1 = read_frames(CLIPS / "c1.mp4")
    c2 = read_frames(CLIPS / "c2.mp4")
    orbit = read_frames(CLIPS / "orbit.mp4") if (CLIPS / "orbit.mp4").exists() else []
    lead = nalli_lead_in(c1[-1], c2[0])
    seq = c1 + lead + c2 + orbit[1:]
    rice_end = len(c1) - 1
    nalli_end = len(c1) + len(lead) + len(c2) - 1
    nd, nm = write_sequence("serve", seq)
    total = len(seq) - 1
    films["serve"] = {
        "desktop": nd,
        "mobile": nm,
        "segments": {"riceFrac": round(rice_end / total, 4), "nalliFrac": round(nalli_end / total, 4) if orbit else 1},
    }

    for name in ("fire", "feast"):
        fr = read_frames(CLIPS / f"{name}.mp4")
        nd, nm = write_sequence(name, fr, desk_w=1280)
        films[name] = {"desktop": nd, "mobile": nm}

    dish_stills()

    def block(key, name):
        f = films[name]
        seg = f",\n  segments: {json.dumps(f['segments'])}" if "segments" in f else ""
        return (
            f"export const {key} = {{\n"
            f"  desktop: {{ dir: \"/film/{name}/d\", count: {f['desktop']} }},\n"
            f"  mobile: {{ dir: \"/film/{name}/m\", count: {f['mobile']} }}{seg},\n}};\n"
        )

    ts = "// generated by scripts/build_frames.py — do not edit by hand\n\n" + "\n".join(
        [block("FILM_SERVE", "serve"), block("FILM_FIRE", "fire"), block("FILM_FEAST", "feast")]
    )
    (ROOT / "src/lib/films.ts").write_text(ts)
    print(json.dumps(films, indent=1))
    shutil.rmtree(WORK)


if __name__ == "__main__":
    sys.exit(main())
