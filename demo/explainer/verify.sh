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
dur = float("$DUR")
w, h = int("$W"), int("$H")
audio = """$AUDIO""".strip()
assert w == 1920 and h == 1080, (w, h)
assert 45.0 <= dur <= 60.0, dur
assert audio == "", audio
print("verify: 1920x1080, silent, duration in 45–60s")
PY
