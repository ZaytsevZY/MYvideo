#!/bin/zsh
set -euo pipefail

repo_dir="${0:A:h:h:h}"
demo_dir="$repo_dir/demos/first-segment"
audio_file="$repo_dir/assets/audio/segment-01-adrian-v4.mp3"
output_file="$demo_dir/output/segment-01-demo-v0.1.mp4"

mkdir -p "$demo_dir/output"

python3 "$demo_dir/render_demo.py" | ffmpeg -y \
  -f rawvideo -pix_fmt rgb24 -s 1920x1080 -r 30 -i - \
  -i "$audio_file" \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest -movflags +faststart \
  "$output_file"

ffprobe -v error \
  -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate \
  -of default=noprint_wrappers=1 \
  "$output_file"

