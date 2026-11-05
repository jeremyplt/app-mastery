#!/bin/zsh
# Mesure un dossier de vidéos d'élève : durée, part d'image figée, nombre de plans, planche d'images.
# Le pourcentage figé dépend des réglages de freezedetect : ne comparer que des vidéos mesurées avec ce même script.
# Usage : mesurer_videos.sh <dossier_videos> <dossier_sortie>
# Dans le scratchpad, jamais dans le repo.
IN="$1"; OUT="$2"; mkdir -p "$OUT/sheets"
echo -e "video\tduree_s\tfige_pct\tplans\tmd5" > "$OUT/index.tsv"
find -L "$IN" -type f \( -iname '*.mp4' -o -iname '*.mov' -o -iname '*.webm' \) | sort | while read -r f; do
  b=$(basename "$f"); b=${b%.*}
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  fz=$(ffmpeg -nostdin -hide_banner -i "$f" -vf freezedetect=n=0.003:d=0.5 -an -f null - 2>&1 | awk '/freeze_duration/{s+=$NF}END{print s+0}')
  pct=$(awk -v a="$fz" -v b="$d" 'BEGIN{printf "%.0f", (b>0?100*a/b:0)}')
  pl=$(ffmpeg -nostdin -hide_banner -i "$f" -vf "select='gt(scene,0.3)',showinfo" -an -f null - 2>&1 | grep -c 'pts_time')
  sum=$(md5 -q "$f")
  printf '%s\t%s\t%s\t%s\t%s\n' "$b" "$d" "$pct" "$((pl+1))" "$sum" >> "$OUT/index.tsv"
  ffmpeg -nostdin -hide_banner -loglevel error -y -i "$f" -vf "fps=14/$d,scale=180:-1,tile=14x1" -frames:v 1 "$OUT/sheets/$b.jpg"
done
echo "Résultat : $OUT/index.tsv et $OUT/sheets/"
echo "Doublons : deux lignes avec le même md5 (attention, un même film renvoyé par WhatsApp peut avoir un md5 différent : comparer aussi les planches)."
