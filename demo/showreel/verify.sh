#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

check() {
  local MP4="$1"
  local WANT_W="$2"
  local WANT_H="$3"
  local LOOP="${4:-0}"

  if [[ ! -f "$MP4" ]]; then
    echo "missing $MP4" >&2
    exit 1
  fi

  local W H DUR AUDIO
  W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=nw=1:nk=1 "$MP4")
  H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=nw=1:nk=1 "$MP4")
  DUR=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$MP4")
  AUDIO=$(ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 "$MP4" || true)

  echo "file     $MP4"
  echo "size     $(wc -c < "$MP4") bytes"
  echo "wxh      ${W}x${H}"
  echo "duration ${DUR}s"
  echo "audio    ${AUDIO:-none}"

  python3 - "$MP4" "$W" "$H" "$DUR" "$AUDIO" "$WANT_W" "$WANT_H" "$LOOP" <<'PY'
import subprocess, os, tempfile, sys

mp4, w, h, dur, audio, want_w, want_h, loop = sys.argv[1:9]
w, h = int(w), int(h)
dur = float(dur)
want_w, want_h, loop = int(want_w), int(want_h), int(loop)
audio = audio.strip()
assert w == want_w and h == want_h, (w, h, want_w, want_h)
assert 30.0 <= dur <= 45.5, dur
assert audio == "", audio
print(f"verify: {want_w}x{want_h}, silent, duration in 30–45s")

def frame(ss, dest):
    subprocess.check_call(
        ["ffmpeg", "-y", "-ss", ss, "-i", mp4, "-frames:v", "1", dest],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

def mad(a, b, vw, vh):
    def raw(p):
        return subprocess.check_output(
            ["ffmpeg", "-v", "error", "-i", p, "-vf", f"scale={vw}:{vh}", "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"]
        )
    x, y = raw(a), raw(b)
    n = min(len(x), len(y))
    return sum(abs(x[i] - y[i]) for i in range(n)) / n

td = tempfile.mkdtemp()
proto_a = os.path.join(td, "p12.png")
proto_b = os.path.join(td, "p32.png")
frame("12.0", proto_a)
frame("32.0" if want_h > want_w else "26.0", proto_b)
motion = mad(proto_a, proto_b, 480, 270)
print(f"prototype motion 12s vs later MAD: {motion:.2f}")
assert motion > 4.0, "prototype stretch looks frozen"

if loop:
    first = os.path.join(td, "first.png")
    last = os.path.join(td, "last.png")
    frame("0.00", first)
    frame(str(dur - 0.04), last)
    loop_err = mad(first, last, 960, 540)
    loop_full = mad(first, last, want_w, want_h)
    print(f"loop seam MAD (960x540 RGB): {loop_err:.2f}")
    print(f"loop seam MAD ({want_w}x{want_h} RGB): {loop_full:.2f}")
    assert loop_err < 3.0, loop_err
    assert loop_full < 3.0, loop_full
    print("verify: loop seam")
PY
}

check out/finley-showreel-16x9.mp4 1920 1080 1
echo
check out/finley-showreel-9x16.mp4 1080 1920 0

python3 - <<'PY'
"""9:16 must be a vertical composition: frame edges stay the dark stage, not sliced UI."""
import subprocess, os, tempfile
from PIL import Image

mp4 = "out/finley-showreel-9x16.mp4"
times = ["0.5", "2.6", "4.1", "5.1", "6.1", "7.2", "8.5", "9.2", "12.4", "19.6", "25.4", "32.0", "38.2"]
td = tempfile.mkdtemp()
inset = 10
thresh = 48

def grab(ss, dest):
    subprocess.check_call(
        ["ffmpeg", "-y", "-ss", ss, "-i", mp4, "-frames:v", "1", dest],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

def edge_means(path):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    px = im.load()

    def band(xs, ys):
        s = n = 0
        for x in xs:
            for y in ys:
                r, g, b = px[x, y]
                s += (r + g + b) / 3
                n += 1
        return s / n

    ys = range(0, h, 6)
    xs = range(0, w, 6)
    return {
        "left": band(range(inset), ys),
        "right": band(range(w - inset, w), ys),
        "top": band(xs, range(inset)),
    }

failed = []
for ss in times:
    dest = os.path.join(td, f"t{ss.replace('.', '_')}.png")
    grab(ss, dest)
    m = edge_means(dest)
    print(f"9:16 t={ss:>5}  left={m['left']:.1f}  right={m['right']:.1f}  top={m['top']:.1f}")
    if m["left"] > thresh or m["right"] > thresh or m["top"] > thresh:
        failed.append((ss, m))

assert not failed, f"UI touches 9:16 frame edge at {failed}"
print("verify: 9:16 edges are stage, not cropped UI")
PY
echo "verify: both cuts ok"
