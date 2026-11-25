#!/usr/bin/env python3
"""Construit le PDF « Les 50 niches ennuyeuses qui rapportent ».

Cadeau de la vidéo YouTube D (« Ces apps ennuyeuses rapportent des millions (et
personne n'en parle) », script dans src/app/admin/scripts/scripts-data.ts). La
vidéo promet, pour chaque niche : l'app qui domine, ce qu'elle coûte, son nombre
d'avis, combien d'apps de la même niche n'ont presque rien, et ce que ses
utilisateurs lui reprochent.

D'où viennent les chiffres (données dans niches-ennuyeuses.json) :
- rang : classement « Top Grossing » d'Apple aux États-Unis, par catégorie,
  relevé le 23/11/2026 (~/Projects/reports/2026-11-23-apps-ennuyeuses/charts) ;
- avis, note et prix : API iTunes lookup et page App Store, relevés le 25/11 ;
- « presque rien » : recherche iTunes (États-Unis, 100 premiers résultats), apps
  dont le nom contient un mot de la niche, et parmi elles celles qui ont moins de
  20 avis (le 23/11 pour les niches de la vidéo, le 25/11 pour les autres) ;
- reproches : avis mis en avant sur la page App Store de l'app, lus le 25/11.

Usage : python3 lead-magnets/build-niches-ennuyeuses.py
Produit le HTML et le PDF dans lead-magnets/, sa copie dans public/downloads/,
et l'image de couverture de la page d'optin. Mise en page des PDF précédents,
passée en Graphite comme le site depuis le 23/11 : zéro bleu, angles droits.
"""
import html
import json
import shutil
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
DATA = HERE / "niches-ennuyeuses.json"
OUT_HTML = HERE / "niches-ennuyeuses.html"
OUT_PDF = HERE / "Les-50-niches-ennuyeuses-qui-rapportent.pdf"
PUBLIC_PDF = ROOT / "public/downloads/niches-ennuyeuses-k7d3x9.pdf"
PREVIEW = ROOT / "public/proof/niches-ennuyeuses-preview.jpg"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CALL_URL = "https://www.jeremypitault.com/appel?utm_source=pdf&utm_medium=lead-magnet&utm_campaign=niches-ennuyeuses"
TITLE = "Les 50 niches ennuyeuses qui rapportent"

FAMILIES = {
    "metiers": ("Les apps des métiers", "Un outil pour un métier précis. Les pros paient sans hésiter quand l'app leur fait gagner du temps ou de l'argent sur un chantier, dans un camion ou au cabinet."),
    "passions": ("Les apps des passions", "Une passion à laquelle les gens consacrent leurs week-ends, et souvent beaucoup d'argent. Une app qui les aide à mieux la vivre se vend toute seule."),
    "galeres": ("Les apps des galères", "Un problème qu'on veut régler tout de suite. La personne tape sa galère dans l'App Store et télécharge une des premières apps qui sortent."),
}

# Noms des catégories tels qu'ils s'affichent sur l'App Store en français.
CATEGORIES = {
    "Navigation": "Navigation",
    "Meteo": "Météo",
    "Sports": "Sports",
    "Medical": "Médecine",
    "Reference": "Références",
    "Lifestyle": "Style de vie",
    "Education": "Éducation",
    "Utilitaires": "Utilitaires",
    "Voyage": "Voyages",
    "Productivite": "Productivité",
    "Business": "Économie et entreprise",
}

CSS = """
  @page { size: A4; margin: 0; }
  @page flow { size: A4; margin: 14mm 0 14mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; border-radius: 0 !important; }
  html, body { margin: 0; padding: 0; }
  body { font-family: -apple-system, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; color: #111; background: #fff; font-size: 12pt; line-height: 1.42; }
  .page { width: 210mm; height: 297mm; padding: 17mm 17mm 16mm; page-break-after: always; position: relative; overflow: hidden; }
  a { color: #111; text-decoration: underline; text-decoration-color: #b4b4ba; text-underline-offset: 2px; }

  .cover { background: #000; color: #fff; display: flex; flex-direction: column; justify-content: space-between; }
  .cover .kicker { color: #b4b4ba; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; font-size: 11pt; }
  .cover h1 { font-size: 44pt; line-height: 1.04; margin: 14mm 0 8mm; font-weight: 800; letter-spacing: -0.02em; }
  .cover h1 span { color: #a1a1a6; }
  .cover .sub { font-size: 15pt; color: #d0d0d0; max-width: 160mm; }
  .cover .apps { display: flex; flex-wrap: wrap; gap: 2.5mm; margin-top: 12mm; max-width: 170mm; }
  .cover .apps span { border: 1px solid #3a3a3c; color: #e5e5ea; padding: 1.6mm 3mm; font-size: 10.5pt; }
  .cover .bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 8mm; }
  .cover .author { font-size: 13pt; font-weight: 700; }
  .cover .author small { display: block; font-weight: 400; color: #9a9a9a; font-size: 10.5pt; margin-top: 2mm; }
  .cover .badge { background: linear-gradient(180deg, #ffffff 0%, #d2d2d7 100%); color: #000; padding: 5mm 7mm; font-weight: 800; font-size: 13pt; text-align: center; line-height: 1.25; }
  .cover .badge small { display: block; font-weight: 500; font-size: 9.5pt; color: #3a3a3c; }

  h2 { font-size: 22pt; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 2.5mm; }
  .lead { font-size: 12.5pt; color: #333; margin: 0 0 5mm; }
  .part-kicker { color: #6e6e73; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; font-size: 9.5pt; margin-bottom: 1.5mm; }
  .footer { position: absolute; left: 17mm; right: 17mm; bottom: 8mm; display: flex; justify-content: space-between; font-size: 9pt; color: #888; border-top: 1px solid #e6e6e6; padding-top: 2.5mm; }
  .callout { background: #f5f5f7; border-left: 4px solid #1d1d1f; padding: 4mm 5mm; margin: 5mm 0; font-size: 10.8pt; }
  .callout p { margin: 0 0 2mm; }
  .callout p:last-child { margin: 0; }

  .intro p { margin: 0 0 4mm; }
  .intro .stat { display: flex; gap: 4mm; margin: 6mm 0 7mm; }
  .intro .stat div { flex: 1; background: #000; color: #fff; padding: 5mm; }
  .intro .stat b { display: block; font-size: 21pt; letter-spacing: -0.02em; }
  .intro .stat span { font-size: 10pt; color: #cfcfcf; }
  ol.how { padding-left: 6mm; margin: 0; }
  ol.how li { margin-bottom: 2.5mm; }

  .flow { page: flow; padding: 0 17mm; }
  .fam { break-before: page; }
  .fam:first-child { break-before: auto; }
  .fam .head { break-inside: avoid; margin-bottom: 3mm; }
  .fam .head .lead { margin-bottom: 2mm; }
  .niche { padding: 3.6mm 0 3.8mm; border-top: 1px solid #e0e0e0; break-inside: avoid; }
  .niche .top { display: flex; gap: 3mm; align-items: baseline; }
  .niche .n { flex: 0 0 9mm; font-weight: 800; font-size: 13pt; color: #8e8e93; }
  .niche .name { font-weight: 800; font-size: 13.5pt; letter-spacing: -0.005em; }
  .niche .body { padding-left: 12mm; }
  .niche .app { margin-top: 1.2mm; font-size: 11pt; }
  .niche .app b { font-size: 11.5pt; }
  .niche .facts { display: flex; flex-wrap: wrap; gap: 1.6mm; margin: 1.6mm 0 1.4mm; }
  .niche .facts span { background: #f2f2f4; padding: .8mm 2.2mm; font-size: 9.8pt; font-weight: 600; color: #1d1d1f; white-space: nowrap; }
  .niche .facts span.dark { background: #1d1d1f; color: #fff; }
  .niche .line { font-size: 10.9pt; margin-top: 1mm; color: #222; }
  .niche .line b { color: #000; }
  .niche .door { margin-top: 1.4mm; font-size: 10.9pt; background: #f5f5f7; border-left: 3px solid #1d1d1f; padding: 1.6mm 3mm; }

  .cta { background: #000; color: #fff; display: flex; flex-direction: column; justify-content: center; }
  .cta .part-kicker { color: #b4b4ba; }
  .cta h2 { color: #fff; font-size: 29pt; line-height: 1.12; }
  .cta h2 span { color: #a1a1a6; }
  .cta p { color: #d0d0d0; font-size: 13pt; max-width: 160mm; }
  .cta .btn { display: inline-block; align-self: flex-start; background: linear-gradient(180deg, #ffffff 0%, #d2d2d7 100%); color: #000; font-weight: 800; padding: 5mm 8mm; font-size: 14pt; margin: 6mm 0 3mm; text-decoration: none; }
  .cta .url { color: #9a9a9a; font-size: 10.5pt; word-break: break-all; }
"""


def esc(text: str) -> str:
    return html.escape(text, quote=False)


def num(n: int) -> str:
    """12345 -> « 12 345 » (espace insécable, comme en français)."""
    return f"{n:,}".replace(",", "\u00a0")


def rank_text(rank: int, cat: str) -> str:
    suffix = "re" if rank == 1 else "e"
    return f"{rank}{suffix} des apps {CATEGORIES[cat]} qui rapportent le plus"


def stars_text(stars: float) -> str:
    return f"{stars:.1f}".replace(".", ",") + " ★"


def render_niche(n: int, row: dict) -> str:
    facts = [
        f'<span class="dark">{esc(rank_text(row["rank"], row["cat"]))}</span>',
        f"<span>{num(row['ratings'])} avis · {stars_text(row['stars'])}</span>",
        f"<span>{esc(row['price'])}</span>",
    ]
    flop = (
        f'quand on tape « {esc(row["term"])} » dans l\'App Store, {row["nRel"]} apps de la niche sortent, '
        f'et <b>{row["nLow"]} ont moins de 20 avis</b>.'
    )
    return (
        f'<div class="niche"><div class="top"><div class="n">{n}</div><div class="name">{esc(row["niche"])}</div></div>'
        f'<div class="body">'
        f'<div class="app">L\'app qui domine : <b><a href="{html.escape(row["url"])}">{esc(row["app"])}</a></b></div>'
        f'<div class="facts">{"".join(facts)}</div>'
        f'<div class="line"><b>Presque rien :</b> {flop}</div>'
        f'<div class="line"><b>Ce que ses utilisateurs lui reprochent :</b> {esc(row["reproche"])}</div>'
        f'<div class="door"><b>La place pour une nouvelle app :</b> {esc(row["porte"])}</div>'
        f"</div></div>"
    )


def check(rows: list) -> None:
    assert len(rows) == 50, f"{len(rows)} niches au lieu de 50"
    apps = [r["app"] for r in rows]
    assert len(set(apps)) == len(apps), "app en double"
    for r in rows:
        assert r["family"] in FAMILIES, r
        assert r["cat"] in CATEGORIES, r
        assert 0 < r["nLow"] <= r["nRel"], r["niche"]
        for field in ("niche", "app", "price", "term", "reproche", "porte"):
            assert "—" not in r[field], f"tiret cadratin dans {r['niche']} ({field})"
            assert r[field].strip(), f"{field} vide pour {r['niche']}"


def build_html(rows: list) -> str:
    check(rows)
    n = 0
    sections = []
    for i, (fam, (title, lead)) in enumerate(FAMILIES.items(), 1):
        fam_rows = [r for r in rows if r["family"] == fam]
        first = n + 1
        items = []
        for r in fam_rows:
            n += 1
            items.append(render_niche(n, r))
        sections.append(
            f'<div class="fam"><div class="head"><div class="part-kicker">Famille {i} sur 3 · niches {first} à {n}</div>'
            f'<h2>{esc(title)}</h2><p class="lead">{esc(lead)}</p></div>'
            + "\n".join(items)
            + "</div>"
        )
    low = sum(r["nLow"] for r in rows)
    rel = sum(r["nRel"] for r in rows)
    examples = ["Calculatrice de chantier", "Crochet", "Pièces de monnaie", "Ronflement", "Parents séparés", "GPS pour camions", "Bois de cerf", "Marées", "Pâtisserie à domicile", "Code de la route"]

    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>{TITLE}</title>
<style>{CSS}</style>
</head>
<body>

<section class="page cover">
  <div>
    <div class="kicker">Cadeau gratuit</div>
    <h1>Les 50 niches ennuyeuses <span>qui&nbsp;rapportent</span></h1>
    <div class="sub">Des apps auxquelles personne ne pense, relevées dans le classement des apps qui rapportent le plus aux États-Unis. Pour chaque niche : l'app qui domine, ce qu'elle coûte, son nombre d'avis, combien d'apps de la même niche n'ont presque rien, et ce que ses utilisateurs lui reprochent.</div>
    <div class="apps">{"".join(f"<span>{esc(e)}</span>" for e in examples)}</div>
  </div>
  <div class="bottom">
    <div class="author">Jeremy Pitault<small>Créateur de Shinobi Japanese, plus de 30 000 $ par mois avec une seule app</small></div>
    <div class="badge">50 niches<small>3 familles, une app réelle pour chacune</small></div>
  </div>
</section>

<section class="page intro">
  <h2>Comment lire cette liste</h2>
  <p class="lead">Les apps dont tout le monde parle peuvent très bien rapporter, mais elles ne sont pas les seules. Ces 50 niches viennent du classement des apps qui rapportent le plus aux États-Unis, catégorie par catégorie. Chacune y a au moins une app, et presque personne n'en parle.</p>
  <div class="stat">
    <div><b>50</b><span>niches, chacune avec une vraie app dans le classement des apps qui rapportent le plus</span></div>
    <div><b>{num(low)} sur {num(rel)}</b><span>apps trouvées dans ces niches ont moins de 20 avis</span></div>
    <div><b>3</b><span>familles : les métiers, les passions et les galères</span></div>
  </div>
  <ol class="how">
    <li><b>Commence par les niches que tu connais de l'intérieur</b>, parce que tu y travailles, parce que c'est ta passion, ou parce que tu as vécu la galère.</li>
    <li><b>Lis ce que les utilisateurs reprochent à l'app qui domine.</b> C'est là qu'il reste de la place : une app plus simple, moins chère, ou qui répond enfin à la question que les gens se posent.</li>
    <li><b>Regarde la ligne « presque rien ».</b> Une niche qui marche attire des copies, et la plupart ne décollent jamais. Il te faut une meilleure réponse que l'app installée, pas la même app avec un plus beau design.</li>
    <li><b>Ouvre la page App Store de l'app</b> (son nom est un lien) et lis ses avis à une et deux étoiles avant de te lancer.</li>
  </ol>
  <div class="callout">
    <p><b>Le rang</b> vient du classement des apps qui rapportent le plus sur l'App Store américain, par catégorie, relevé le 23 novembre 2026. Il bouge un peu chaque jour.</p>
    <p><b>Les avis, la note et le prix</b> viennent de la page App Store de chaque app, relevés le 25 novembre 2026. « Achats dans l'app » donne le moins cher et le plus cher des achats affichés.</p>
    <p><b>« Presque rien »</b> : on a tapé le mot-clé de la niche dans l'App Store américain, gardé parmi les 100 premiers résultats les apps dont le nom parle de la niche (sans les jeux), puis compté celles qui ont moins de 20 avis. Recherches faites les 23 et 25 novembre 2026.</p>
    <p><b>Les reproches</b> résument les avis mis en avant sur la page App Store de l'app.</p>
  </div>
  <div class="footer"><span>{TITLE}</span><span>jeremypitault.com</span></div>
</section>

<section class="flow">
{"".join(sections)}
</section>

<section class="page cta">
  <div class="part-kicker">Et maintenant</div>
  <h2>Tu veux que je t'aide à trouver <span>ta niche et à construire ton app</span> ?</h2>
  <p>Cette liste, c'est un point de départ. Le plus dur, c'est de choisir la bonne niche pour toi, de trouver la réponse que l'app installée ne donne pas, puis de faire connaître ton app. C'est ce que je fais avec les personnes que j'accompagne personnellement pendant trois mois.</p>
  <p>Tout commence par un appel de 30 minutes avec mon équipe. On regarde où tu en es, comment je peux t'aider, et si ton profil correspond aux personnes que j'accompagne.</p>
  <a class="btn" href="{CALL_URL}">Réserver mon appel</a>
  <div class="url">{CALL_URL}</div>
</section>

</body>
</html>
"""


def main() -> None:
    rows = json.loads(DATA.read_text(encoding="utf-8"))
    OUT_HTML.write_text(build_html(rows), encoding="utf-8")
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
         f"--print-to-pdf={OUT_PDF}", OUT_HTML.as_uri()],
        check=True, capture_output=True,
    )
    shutil.copyfile(OUT_PDF, PUBLIC_PDF)
    tmp = HERE / "_cover_niches"
    subprocess.run(["pdftoppm", "-jpeg", "-r", "120", "-f", "1", "-l", "1", "-singlefile", str(OUT_PDF), str(tmp)], check=True)
    subprocess.run(["magick", f"{tmp}.jpg", "-resize", "989x1400!", "-quality", "85", str(PREVIEW)], check=True)
    Path(f"{tmp}.jpg").unlink()
    pages = subprocess.run(["pdfinfo", str(OUT_PDF)], capture_output=True, text=True).stdout
    print(next(l for l in pages.splitlines() if l.startswith("Pages")))


if __name__ == "__main__":
    main()
