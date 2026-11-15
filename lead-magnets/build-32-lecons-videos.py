#!/usr/bin/env python3
"""Construit le PDF « Les 32 leçons des vidéos qui font télécharger des apps ».

Cadeau de la vidéo YouTube B (« J'ai analysé 1 633 vidéos qui font télécharger
des apps », script dans src/app/admin/scripts/scripts-data.ts). Les leçons et
les chiffres viennent de l'analyse de la GIGA BANQUE du 12/11/2026
(~/Projects/reports/2026-11-12-giga-banque-analyse.md) : vues TikTok relues
avec yt-dlp le 12/11, vues Instagram relevées dans la banque début novembre.

Usage : python3 lead-magnets/build-32-lecons-videos.py
Produit 32-lecons-videos.html et le PDF dans lead-magnets/, sa copie dans
public/downloads/, et l'image de couverture de la page d'optin.
"""
import html
import shutil
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
OUT_HTML = HERE / "32-lecons-videos.html"
OUT_PDF = HERE / "Les-32-lecons-des-videos-qui-font-telecharger.pdf"
PUBLIC_PDF = ROOT / "public/downloads/32-lecons-videos-v6m2q8.pdf"
PREVIEW = ROOT / "public/proof/32-lecons-videos-preview.jpg"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CALL_URL = "https://www.jeremypitault.com/appel?utm_source=pdf&utm_medium=lead-magnet&utm_campaign=32-lecons-videos"

# (numéro, titre, explication, [(libellé du lien, url, chiffres)])
PARTS = [
    {
        "kicker": "Partie 1 · Leçons 1 à 5",
        "title": "Comment filmer ton app",
        "lead": "Avant l'idée, il y a la forme : une vidéo qui ressemble à une recommandation, pas à une pub.",
        "lessons": [
            (1, "Filme ton téléphone avec un deuxième téléphone, la main dans le cadre",
             "Un vrai téléphone posé sur un bureau et un doigt qui tape dessus, ça fait « quelqu'un me montre son truc ». 16 des 24 plus grosses vidéos qu'on a regardées image par image sont filmées comme ça.",
             [("Soundscape (@soundscape.study)", "https://www.tiktok.com/@soundscape.study/video/7485770482667588866", "TikTok · 40,8 M de vues · 20 s")]),
            (2, "Tu n'as pas besoin de montrer ton visage",
             "Un amphi filmé de dos, des mains, un écran : 14 des 24 plus grosses vidéos ne montrent jamais le visage de la personne qui filme.",
             [("Coconote (@coconote.app)", "https://www.instagram.com/reel/C9hepDsMoYQ/", "Instagram · 26 M de vues · 15 s")]),
            (3, "Montre l'app dans le premier tiers de la vidéo",
             "Dans 16 des 24 grosses vidéos, l'app est à l'écran dès la 2e ou la 3e seconde, juste après la phrase d'accroche. N'attends pas la fin pour la montrer.",
             [("Stronger (@kailyn.lifts)", "https://www.tiktok.com/@kailyn.lifts/video/7626442321860644127", "TikTok · 15,3 M de vues · 11 s")]),
            (4, "Fais court : moins de 20 secondes",
             "Sur 75 vidéos TikTok vérifiées, la durée médiane est de 18 secondes. Une accroche, l'app, un résultat, et la vidéo s'arrête.",
             [("Forméa (@formea.pilates)", "https://www.tiktok.com/@formea.pilates/video/7678283526629903638", "TikTok · 9,2 M de vues · 5 s")]),
            (5, "L'exception : le long face caméra qui explique vraiment l'app",
             "Quand tu parles à un public précis et que tu montres l'app en détail, une vidéo de près de 2 minutes peut faire des millions. Ça reste l'exception, pas la règle.",
             [("Goblin Tools (@thatadhdlife)", "https://www.tiktok.com/@thatadhdlife/video/7255360682063858990", "TikTok · 10,8 M de vues · 1 min 52")]),
        ],
    },
    {
        "kicker": "Partie 2 · Leçons 6 à 11",
        "title": "Les accroches",
        "lead": "La première phrase décide si la personne reste. Ces accroches ont fait des millions de vues dans toutes les niches.",
        "lessons": [
            (6, "« Pourquoi je découvre ça seulement maintenant »",
             "« 3 ans d'études et je trouve ça maintenant » dit au spectateur qu'il est en train de rater quelque chose. C'est l'accroche la plus copiée de la banque.",
             [("Unstuck AI (@quizard.ai)", "https://www.instagram.com/reel/C_jtibrRhzI/", "Instagram · 66,1 M de vues · 17 s")]),
            (7, "Fais dire par quelqu'un d'autre que l'app est géniale",
             "« Ma sœur m'a montré ce qu'elle utilise pour réviser » transforme une pub en bouche-à-oreille. On le retrouve dans 3 des 18 vidéos les plus vues de la banque.",
             [("StudyFetch", "https://www.instagram.com/reel/DH7MA6ZT20U/", "Instagram · 11,9 M de vues · 10 s")]),
            (8, "Les mots « secret » et « ça paraît illégal » donnent envie de savoir",
             "Présenter l'app comme un avantage caché (« mon secret pour avoir A+ ») crée de la curiosité. Environ 25 vidéos de la banque jouent là-dessus.",
             [("Yolk AI (@studyv.tok)", "https://www.tiktok.com/@studyv.tok/video/7466063517137865989", "TikTok · 3,3 M de vues · 14 s")]),
            (9, "Commence par le problème, finis par l'app",
             "La vidéo pose une galère que ta cible vit (rester au lit, ne pas avoir 1 h 38 pour un cours), puis l'app arrive comme la réponse.",
             [("Finch (@finchcare)", "https://www.tiktok.com/@finchcare/video/7457035886274907438", "TikTok · 63,4 M de vues · 10 s")]),
            (10, "Le POV met le spectateur dans la scène en une phrase",
             "« POV : dans 2 mois c'est le bac et t'as toujours pas fait tes fiches » décrit la situation du spectateur, pas la tienne. Il se projette tout de suite.",
             [("Parkeur (@studywchimene), en français", "https://www.tiktok.com/@studywchimene/video/7488235301383458070", "TikTok · 346 900 vues · 16 s")]),
            (11, "La réaction choquée dure une seconde, puis on passe à l'app",
             "Main sur le front, bouche ouverte : c'est un hook visuel, et dès la 2e seconde l'écran prend le relais. Filme toujours ta propre réaction, jamais celle d'un autre créateur.",
             [("Stronger (@kailyn.lifts)", "https://www.tiktok.com/@kailyn.lifts/video/7626442321860644127", "TikTok · 15,3 M de vues · 11 s")]),
        ],
    },
    {
        "kicker": "Partie 3 · Leçons 12 à 16",
        "title": "Les formats",
        "lead": "Des façons concrètes de montrer ton app, que tu peux refaire telles quelles.",
        "lessons": [
            (12, "Le format roi : « je mets ça dedans, regarde ce qui sort »",
             "On voit l'entrée (un cours, une photo, un lien), on la donne à l'app, et le résultat apparaît. La transformation se comprend sans un mot d'explication.",
             [("@studywithtay2", "https://www.tiktok.com/@studywithtay2/video/7525296604312554766", "TikTok · 4,7 M de vues · 17 s")]),
            (13, "Deux assiettes, un scan, pas un mot : « lequel tu choisis ? »",
             "Deux choix côte à côte, l'app tranche à l'écran. Aucune voix, aucun visage, et ce sont parmi les vidéos les plus vues de la banque.",
             [("CalScan (@calscanapp)", "https://www.tiktok.com/@calscanapp/video/7508465001674624302", "TikTok · 16,5 M de vues · 17 s")]),
            (14, "L'avant/après marche aussi pour une app",
             "Le vieux calendrier papier qu'on jette, puis l'écran : on compare deux mondes, et ton app est le côté « après ».",
             [("Hearth (compte officiel)", "https://www.instagram.com/reel/DESc1ZGOzxU/", "Instagram · 29,9 M de vues · 10 s")]),
            (15, "La liste « 3 apps que tout le monde devrait avoir » permet de glisser la tienne",
             "Le spectateur enregistre la vidéo pour plus tard, et ton app profite de la crédibilité des apps connues autour d'elle. Mets-la au milieu de la liste.",
             [("Être Étudiant (@etreetudiant), en français", "https://www.tiktok.com/@etreetudiant/video/7584398508120100118", "TikTok · 1,6 M de vues · 1 min 03")]),
            (16, "Les carrousels font des millions, sans visage et sans montage",
             "Des images et des captures qu'on fait défiler : c'est le format le plus simple à produire, et il atteint les mêmes chiffres que les vidéos.",
             [("Yuka (@yuka_app), carrousel", "https://www.tiktok.com/@yuka_app/photo/7468423289392647467", "TikTok · 2 M de vues")]),
        ],
    },
    {
        "kicker": "Partie 3 · Leçons 17 à 20",
        "title": "Les formats (suite)",
        "lead": "Quand ton app a un personnage, une récompense ou une ambiance, montre-les.",
        "lessons": [
            (17, "Une mascotte à faire grandir rend l'app mémorable",
             "Un personnage donne un visage à l'app sans montrer le tien, et le spectateur a envie de s'en occuper.",
             [("Finch (@finchcare)", "https://www.tiktok.com/@finchcare/video/7368551995138968875", "TikTok · 33,2 M de vues · 11 s")]),
            (18, "Montre le moment où la récompense tombe",
             "Un rang après un développé couché, un monstre battu à la pompe, un arbre qui pousse : quand l'app transforme l'effort en jeu, filme la récompense.",
             [("Push Up Arena (@pushuparena.app)", "https://www.tiktok.com/@pushuparena.app/video/7637686723069185311", "TikTok · 3,4 M de vues · 16 s")]),
            (19, "L'ambiance vend l'app sans un mot",
             "Un bureau rangé, une lampe, l'app qui tourne sur un iPad, une musique douce : on montre le rituel, pas les fonctionnalités.",
             [("FocusFlight (@idkjustrant)", "https://www.tiktok.com/@idkjustrant/video/7627726704018017543", "TikTok · 12,2 M de vues · 25 s")]),
            (20, "Raconte pourquoi tu as créé l'app",
             "Une phrase sur ta raison personnelle suffit (« je construis l'app que j'aurais voulu avoir »), et ça marche même avant la sortie de l'app.",
             [("Storia (@storiaworld)", "https://www.tiktok.com/@storiaworld/video/7662028837600906518", "TikTok · 1,6 M de vues · 7 s")]),
        ],
    },
    {
        "kicker": "Parties 4 et 5 · Leçons 21 à 26",
        "title": "Le nom de l'app et les comptes",
        "lead": "Faire passer le spectateur au téléchargement, puis tenir dans la durée.",
        "lessons": [
            (21, "Donne le nom de l'app comme une évidence : « au fait, elle s'appelle… »",
             "Le nom arrive en passant, à la fin ou dans la légende (« the app is called X btw »). Ça sonne comme une recommandation, pas comme une pub.",
             [("FocusFlight (@lily6021023)", "https://www.tiktok.com/@lily6021023/video/7547388643988622614", "TikTok · 7,1 M de vues · 23 s")]),
            (22, "Sur Instagram, « commente un mot et je t'envoie l'app »",
             "Au lieu de donner le lien, on demande de commenter un mot et le lien arrive en message privé. Les commentaires font monter la portée. 29 des 32 vidéos qui le font sont sur Instagram.",
             [("Eclipta", "https://www.instagram.com/reel/DYfnXHqOo27/", "Instagram · 13 M de vues · 13 s")]),
            (23, "Le compte officiel de l'app peut faire aussi bien qu'un créateur",
             "8 des 15 vidéos TikTok les plus vues de la banque sont postées par le compte de l'app lui-même, avec des formats simples.",
             [("Turbo AI (@getturboai)", "https://www.tiktok.com/@getturboai/video/7590870277337206030", "TikTok · 9,3 M de vues · 32 s")]),
            (24, "Les grosses apps font poster des dizaines de créatrices tous les jours",
             "Derrière les chiffres, il y a des créatrices qui postent leur quotidien avec l'app à l'écran. 13 comptes différents de la banque portent le nom d'une seule app.",
             [("StudyFetch (@peter.studyfetch)", "https://www.tiktok.com/@peter.studyfetch/video/7597638663517785362", "TikTok · 3,7 M de vues · 15 s")]),
            (25, "Le même script, tourné par 4 créateurs, fait de 1 701 à 428 500 vues",
             "Même texte, même son, même durée, et des résultats qui n'ont rien à voir. Le contenu n'explique pas tout : il faut poster plusieurs fois.",
             [("Bloom chez @savingwithselma", "https://www.tiktok.com/@savingwithselma/video/7611325663475223839", "428 500 vues"),
              ("la même chez @treylovesinvesting", "https://www.tiktok.com/@treylovesinvesting/video/7619835357634252054", "1 701 vues")]),
            (26, "Répète le même format : un gros chiffre finit par tomber",
             "Les comptes qui marchent déclinent le même format chaque jour, et une vidéo sur 5 ou 8 explose. Poste un format au moins 10 fois avant de conclure.",
             [("Tallow (@tallowapp), 8 vidéos au même format", "https://www.tiktok.com/@tallowapp/video/7655431387650395423", "TikTok · 2,9 M de vues · 38 s")]),
        ],
    },
    {
        "kicker": "Parties 6 et 7 · Leçons 27 à 32",
        "title": "Les niches et les détails qui changent tout",
        "lead": "Où sont les vues, ce qui ne fait pas télécharger, et les trois détails à ne pas rater.",
        "lessons": [
            (27, "Les étudiants sont la niche qui fait le plus de vues",
             "Révision et concentration, c'est 28 % des vidéos de la banque mais la moitié de celles qui dépassent un million de vues.",
             [("Quizlet (@duda_studies_ofc)", "https://www.tiktok.com/@duda_studies_ofc/video/7489175927327444229", "TikTok · 13,1 M de vues · 29 s")]),
            (28, "Les parents font des millions de vues, si tu parles de leur fatigue",
             "Les vidéos qui explosent ne parlent pas de l'enfant mais du parent : « je couche mes enfants en 15 minutes », « la maman est le calendrier de la famille ».",
             [("Skylight (@livjowen)", "https://www.tiktok.com/@livjowen/video/7521894532103949598", "TikTok · 14,1 M de vues · 1 min 50")]),
            (29, "Des millions de vues sans l'app à l'écran ne font pas forcément télécharger",
             "Quand l'app n'est que dans la légende, on fait des vues mais rien ne prouve qu'on fait des téléchargements. Mieux vaut 5 000 vues qui convertissent qu'un viral sans app.",
             [("Tone AI (@movewmil), le contre-exemple", "https://www.tiktok.com/@movewmil/video/7562274640857632002", "TikTok · 11,8 M de vues · 6 s")]),
            (30, "Quand tu copies un format, garde exactement le même son",
             "Deux apps de musculation concurrentes ont explosé avec le même audio. Quand tu reprends un format, le son en fait partie.",
             [("Lyfta (@lyft.withnicole)", "https://www.tiktok.com/@lyft.withnicole/video/7588999110909283592", "TikTok · 4,2 M de vues · 14 s")]),
            (31, "Écris ton accroche à l'écran, en gros, dès la première image",
             "21 des 24 grosses vidéos ont une phrase écrite sur la première image. Le texte fait le travail, même quand le son est coupé.",
             [("Moshi (@playmoshikids)", "https://www.tiktok.com/@playmoshikids/video/6882642977194249474", "TikTok · 13,3 M de vues · 29 s")]),
            (32, "Le français a de la place, mais les plus gros chiffres sont en anglais",
             "Aucune des 18 vidéos les plus vues de la banque n'est en français. Si ton app marche en anglais, ouvre un compte séparé en anglais.",
             [("Nomad Education (@priel.study), en français", "https://www.tiktok.com/@priel.study/video/7290614054438079777", "TikTok · 7,2 M de vues · 38 s")]),
        ],
    },
]

CSS = """
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; }
  body { font-family: -apple-system, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; color: #111; background: #fff; font-size: 12.5pt; line-height: 1.42; }
  .page { width: 210mm; height: 297mm; padding: 17mm 17mm 16mm; page-break-after: always; position: relative; overflow: hidden; }
  .page:last-child { page-break-after: auto; }
  a { color: #0060df; text-decoration: none; }

  .cover { background: #0a0a0a; color: #fff; display: flex; flex-direction: column; justify-content: space-between; }
  .cover .kicker { color: #0A84FF; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; font-size: 11pt; }
  .cover h1 { font-size: 40pt; line-height: 1.06; margin: 14mm 0 8mm; font-weight: 800; letter-spacing: -0.02em; }
  .cover h1 span { color: #0A84FF; }
  .cover .sub { font-size: 15pt; color: #d0d0d0; max-width: 158mm; }
  .cover .bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 8mm; }
  .cover .author { font-size: 13pt; font-weight: 700; }
  .cover .author small { display: block; font-weight: 400; color: #9a9a9a; font-size: 10.5pt; margin-top: 2mm; }
  .cover .badge { background: #0A84FF; color: #fff; border-radius: 12px; padding: 5mm 7mm; font-weight: 700; font-size: 12pt; text-align: center; line-height: 1.25; }
  .cover .badge small { display: block; font-weight: 400; font-size: 9.5pt; opacity: .9; }

  h2 { font-size: 22pt; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 2.5mm; }
  .lead { font-size: 12.5pt; color: #333; margin: 0 0 5mm; }
  .part-kicker { color: #0A84FF; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; font-size: 9.5pt; margin-bottom: 1.5mm; }
  .rule { display: flex; gap: 4mm; padding: 3.8mm 0; border-bottom: 1px solid #e6e6e6; }
  .rule:last-of-type { border-bottom: none; }
  .box { flex: 0 0 auto; width: 6mm; height: 6mm; border: 2px solid #0A84FF; border-radius: 4px; margin-top: 1mm; }
  .rule .n { flex: 0 0 9mm; font-weight: 800; color: #0A84FF; font-size: 13pt; margin-top: .2mm; }
  .rule .t { font-weight: 700; font-size: 13pt; }
  .rule .d { color: #333; font-size: 11.5pt; margin-top: .8mm; }
  .rule .ex { font-size: 10.8pt; margin-top: 1.6mm; color: #333; }
  .rule .ex b { color: #111; }
  .rule .ex a { font-weight: 700; }
  .rule .ex .st { white-space: nowrap; }
  .footer { position: absolute; left: 17mm; right: 17mm; bottom: 8mm; display: flex; justify-content: space-between; font-size: 9pt; color: #888; border-top: 1px solid #e6e6e6; padding-top: 2.5mm; }
  .callout { background: #f2f6ff; border-left: 4px solid #0A84FF; border-radius: 6px; padding: 4mm 5mm; margin: 5mm 0; font-size: 11pt; }
  .callout b { color: #0A84FF; }

  .intro p { margin: 0 0 4mm; }
  .intro .stat { display: flex; gap: 5mm; margin: 6mm 0 8mm; }
  .intro .stat div { flex: 1; background: #0a0a0a; color: #fff; border-radius: 12px; padding: 5mm; }
  .intro .stat b { display: block; font-size: 21pt; color: #0A84FF; letter-spacing: -0.02em; }
  .intro .stat span { font-size: 10pt; color: #cfcfcf; }
  ol.how { padding-left: 6mm; margin: 0; }
  ol.how li { margin-bottom: 2.5mm; }

  .cta { background: #0a0a0a; color: #fff; display: flex; flex-direction: column; justify-content: center; }
  .cta h2 { color: #fff; font-size: 29pt; line-height: 1.12; }
  .cta h2 span { color: #0A84FF; }
  .cta p { color: #d0d0d0; font-size: 13pt; max-width: 160mm; }
  .cta .proof { background: #161618; border-radius: 12px; padding: 5mm 6mm; margin: 5mm 0 2mm; max-width: 160mm; }
  .cta .proof b { color: #0A84FF; font-size: 17pt; display: block; margin-bottom: 1mm; }
  .cta .proof span { color: #d0d0d0; font-size: 11.5pt; }
  .cta .btn { display: inline-block; background: #0A84FF; color: #fff; font-weight: 800; padding: 5mm 8mm; border-radius: 12px; font-size: 14pt; margin: 6mm 0 3mm; text-decoration: none; }
  .cta .url { color: #9a9a9a; font-size: 10.5pt; word-break: break-all; }
"""


def esc(text: str) -> str:
    return html.escape(text, quote=False)


def render_lesson(n, title, desc, examples) -> str:
    links = " · ".join(
        f'<a href="{html.escape(url)}">{esc(label)}</a>, <span class="st">{esc(stats)}</span>' for label, url, stats in examples
    )
    label = "Exemples" if len(examples) > 1 else "Exemple"
    return (
        f'<div class="rule"><div class="box"></div><div class="n">{n}</div><div>'
        f'<div class="t">{esc(title)}</div><div class="d">{esc(desc)}</div>'
        f'<div class="ex"><b>{label} :</b> {links}</div></div></div>'
    )


def render_part(part) -> str:
    rows = "\n  ".join(render_lesson(*lesson) for lesson in part["lessons"])
    return f"""
<section class="page">
  <div class="part-kicker">{esc(part["kicker"])}</div>
  <h2>{esc(part["title"])}</h2>
  <p class="lead">{esc(part["lead"])}</p>
  {rows}
  <div class="footer"><span>Les 32 leçons des vidéos qui font télécharger des apps</span><span>jeremypitault.com</span></div>
</section>"""


def build_html() -> str:
    count = sum(len(p["lessons"]) for p in PARTS)
    assert count == 32, f"{count} leçons au lieu de 32"
    numbers = [lesson[0] for p in PARTS for lesson in p["lessons"]]
    assert numbers == list(range(1, 33)), "numérotation cassée"
    for p in PARTS:
        for lesson in p["lessons"]:
            assert "—" not in "".join(str(x) for x in lesson[:3]), f"tiret cadratin dans la leçon {lesson[0]}"

    parts_html = "\n".join(render_part(p) for p in PARTS)
    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Les 32 leçons des vidéos qui font télécharger des apps</title>
<style>{CSS}</style>
</head>
<body>

<section class="page cover">
  <div>
    <div class="kicker">Checklist gratuite</div>
    <h1>Les 32 leçons des vidéos qui font <span>télécharger des apps</span></h1>
    <div class="sub">On a passé au crible environ 12 500 vidéos TikTok et Instagram pour garder les 1 633 qui mettent vraiment une app en avant. Voici ce qu'on en a appris, avec une vraie vidéo d'exemple pour chaque leçon.</div>
  </div>
  <div class="bottom">
    <div class="author">Jeremy Pitault<small>Créateur de Shinobi Japanese, plus de 30 000 $ par mois avec une seule app</small></div>
    <div class="badge">32 leçons<small>7 parties, 1 exemple par leçon</small></div>
  </div>
</section>

<section class="page intro">
  <h2>Comment utiliser cette checklist</h2>
  <p class="lead">Ces leçons ne viennent pas d'une intuition. Elles sortent de la banque de contenus qu'on construit pour les élèves que j'accompagne, niche par niche, et chaque chiffre a été vérifié vidéo par vidéo.</p>
  <div class="stat">
    <div><b>1 633</b><span>vidéos gardées sur environ 12 500 passées au crible</span></div>
    <div><b>1,2 milliard</b><span>de vues cumulées, rien que sur celles dont on connaît les vues</span></div>
    <div><b>18 s</b><span>de durée médiane pour les vidéos TikTok vérifiées</span></div>
  </div>
  <ol class="how">
    <li><b>Lis les 32 leçons une fois</b> et coche celles que tes vidéos appliquent déjà vraiment aujourd'hui.</li>
    <li><b>Choisis trois leçons que tu n'appliques pas encore</b> et ouvre leur vidéo d'exemple. Regarde-la plusieurs fois, image par image.</li>
    <li><b>Refais l'exemple à l'identique avec ton app</b> : même durée, même accroche adaptée à ta niche, même son, mêmes plans. Copier un format qui a marché, c'est le point de départ, pas de la triche.</li>
    <li><b>Poste le même format au moins 10 fois avant de juger.</b> La leçon 25 montre pourquoi : le même script fait de 1 701 à 428 500 vues selon le compte et le jour.</li>
  </ol>
  <div class="callout"><b>D'où viennent les chiffres :</b> les vues TikTok ont été relues une par une le 12 novembre 2026. Les vues Instagram ont été relevées début novembre 2026. Un « M » veut dire un million de vues.</div>
  <div class="footer"><span>Les 32 leçons des vidéos qui font télécharger des apps</span><span>jeremypitault.com</span></div>
</section>
{parts_html}

<section class="page cta">
  <div class="part-kicker">Et maintenant</div>
  <h2>Tu veux qu'on trouve ensemble <span>les vidéos qui feront vendre ton app</span> ?</h2>
  <p>Ces 32 leçons, c'est la base. Le plus dur, c'est de trouver le format qui marche pour ta niche à toi, puis de tenir le rythme jusqu'à ce qu'une vidéo décolle. C'est ce qu'on fait avec les personnes que j'accompagne pendant trois mois.</p>
  <div class="proof"><b>De 0 à 1 793 $ en 28 jours, sans une seule pub</b><span>Florian, 20 ans, est un des élèves que j'accompagne. Son application de productivité a fait un million de vues sur Instagram en 30 jours, uniquement avec du contenu filmé depuis son téléphone.</span></div>
  <p>Tout commence par un appel de 30 minutes avec mon associé Nolan ou avec moi. On regarde ton projet et le temps que tu peux y consacrer, et on te dit franchement si l'accompagnement est fait pour toi.</p>
  <a class="btn" href="{CALL_URL}">Réserver mon appel</a>
  <div class="url">{CALL_URL}</div>
</section>

</body>
</html>
"""


def main() -> None:
    OUT_HTML.write_text(build_html(), encoding="utf-8")
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
         f"--print-to-pdf={OUT_PDF}", OUT_HTML.as_uri()],
        check=True, capture_output=True,
    )
    shutil.copyfile(OUT_PDF, PUBLIC_PDF)
    # Couverture pour la page d'optin (même format que les autres guides).
    tmp = HERE / "_cover"
    subprocess.run(["pdftoppm", "-jpeg", "-r", "120", "-f", "1", "-l", "1", "-singlefile", str(OUT_PDF), str(tmp)], check=True)
    subprocess.run(["magick", f"{tmp}.jpg", "-resize", "989x1400!", "-quality", "85", str(PREVIEW)], check=True)
    Path(f"{tmp}.jpg").unlink()
    pages = subprocess.run(["pdfinfo", str(OUT_PDF)], capture_output=True, text=True).stdout
    print(next(l for l in pages.splitlines() if l.startswith("Pages")))


if __name__ == "__main__":
    main()
