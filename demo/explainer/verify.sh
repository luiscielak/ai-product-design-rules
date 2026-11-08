#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
MP4="${1:-out/brief-to-prototype-loop.mp4}"

if [[ ! -f "$MP4" ]]; then
  echo "missing $MP4" >&2
  exit 1
fi

probe() {
  ffprobe -v error -select_streams v:0 -show_entries "$1" -of default=nw=1:nk=1 "$MP4"
}

W=$(probe stream=width)
H=$(probe stream=height)
DUR=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$MP4")
AUDIO=$(ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 "$MP4" || true)
SAR=$(probe stream=sample_aspect_ratio)

echo "file     $MP4"
echo "size     $(wc -c < "$MP4") bytes"
echo "wxh      ${W}x${H}"
echo "duration ${DUR}s"
echo "sar      ${SAR}"
echo "audio    ${AUDIO:-none}"

python3 - <<PY
import subprocess, os, tempfile

dur = float("$DUR")
w, h = int("$W"), int("$H")
audio = """$AUDIO""".strip()
mp4 = "$MP4"
assert w == 1920 and h == 1080, (w, h)
assert 45.0 <= dur <= 60.0, dur
assert audio == "", audio
print("verify: 1920x1080, silent, duration in 45–60s")

def frame(ss, dest):
    subprocess.check_call(
        ["ffmpeg", "-y", "-ss", ss, "-i", mp4, "-frames:v", "1", dest],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

def mad(a, b, vw=960, vh=540):
    def raw(p):
        return subprocess.check_output(
            ["ffmpeg", "-v", "error", "-i", p, "-vf", f"scale={vw}:{vh}", "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"]
        )
    x, y = raw(a), raw(b)
    n = min(len(x), len(y))
    return sum(abs(x[i] - y[i]) for i in range(n)) / n

td = tempfile.mkdtemp()
first = os.path.join(td, "first.png")
last = os.path.join(td, "last.png")
mid_a = os.path.join(td, "m24.png")
mid_b = os.path.join(td, "m28.png")
hi_a = os.path.join(td, "h32.png")
hi_b = os.path.join(td, "h36.png")
frame("0.00", first)
frame(str(dur - 0.04), last)
frame("24.0", mid_a)
frame("28.0", mid_b)
frame("32.0", hi_a)
frame("36.0", hi_b)
loop_err = mad(first, last)
loop_full = mad(first, last, 1920, 1080)
mid_err = mad(mid_a, mid_b)
hi_err = mad(hi_a, hi_b)
print(f"loop seam MAD (960x540 RGB): {loop_err:.2f}")
print(f"loop seam MAD (1920x1080 RGB): {loop_full:.2f}")
print(f"midfi motion 24s vs 28s MAD: {mid_err:.2f}")
print(f"hifi motion 32s vs 36s MAD: {hi_err:.2f}")
assert loop_err < 3.0, loop_err
assert loop_full < 3.0, loop_full
assert mid_err > 4.0, "midfi clip looks frozen"
assert hi_err > 4.0, "hifi clip looks frozen"
print("verify: loop seam (full-res) and clip motion")
PY
