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
proto_b = os.path.join(td, "p26.png")
frame("12.0", proto_a)
frame("26.0", proto_b)
motion = mad(proto_a, proto_b, 480, 270)
print(f"prototype motion 12s vs 26s MAD: {motion:.2f}")
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
echo "verify: both cuts ok"
