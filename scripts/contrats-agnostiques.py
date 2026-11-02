# Chaque contrat ne parle que de sa propre modalité de paiement : le contrat
# en une fois ne doit jamais laisser deviner qu'un paiement en plusieurs fois
# existe, et les contrats 2x / 3x ne parlent ni de paiement comptant ni d'un
# « choix » du client (1er nov. 2026, un client a vu l'option dans le 1x).
# Usage : python3 scripts/contrats-agnostiques.py 1x.docx 2x.docx 3x.docx
# -> réécrit les DOCX du Drive en place, à passer ensuite dans
# docuseal-contrats.py.
import re, sys, docx

def set_text(p, text):
    for r in p.runs[1:]:
        r._r.getparent().remove(r._r)
    p.runs[0].text = text

def find(paras, start):
    hits = [p for p in paras if p.text.startswith(start)]
    if len(hits) != 1:
        raise SystemExit(f"{len(hits)} paragraphe(s) pour : {start}")
    return hits[0]

def replace(p, old, new):
    if old not in p.text:
        raise SystemExit(f"introuvable : {old}")
    set_text(p, p.text.replace(old, new))

def build(path, n):
    d = docx.Document(path)
    P = d.paragraphs

    # Article 23, condition 1 de la garantie.
    cond = find(P, "Être à jour du paiement intégral du prix")
    if n == 1:
        set_text(cond, "Être à jour du paiement intégral du prix de la prestation de conseil à la date de la demande de mise en œuvre de la Garantie.")
        # Article 8 : motifs de résiliation, pas d'échéancier dans le 1x.
        replace(find(P, "Le Prestataire peut résilier le contrat de plein droit"),
                "(i) impayé non régularisé dans les conditions de l'échéancier de paiement ;",
                "(i) défaut de paiement du prix ;")
    else:
        mots = {2: "deux (2)", 3: "trois (3)"}[n]
        set_text(cond, "Être à jour du paiement intégral du prix de la prestation de conseil, en ce compris la totalité des échéances prévues à la Partie III, à la date de la demande de mise en œuvre de la Garantie.")
        set_text(find(P, "Le Client a opté pour un règlement échelonné"),
                 f"Le prix est réglé en {mots} échéances, selon les modalités définies ci-après. Ce règlement est consenti à titre commercial et ne constitue en aucun cas une opération de crédit.")
        set_text(find(P, "Le paiement échelonné n'emporte aucune majoration"),
                 "Aucune majoration, aucun intérêt ni aucun frais ne s'ajoute au prix de 3 000 euros.")

    ps = list(d.paragraphs) + [p for t in d.tables for r in t.rows for c in r.cells for p in c.paragraphs]
    texte = "\n".join(p.text for p in ps)
    interdits = [r"échelonn", r"plusieurs fois", r"\bopté", r"facilité de paiement"]
    interdits += [r"échéance", r"échéancier"] if n == 1 else [r"comptant", r"une seule fois", r"en une fois"]
    for motif in interdits:
        m = re.search(r".{0,60}" + motif + r".{0,60}", texte, re.I)
        if m: raise SystemExit(f"{n}x : reste « {m.group(0)} »")
    d.save(path)

for src in sys.argv[1:]:
    n = int(re.search(r"([123])x", src.rsplit("/", 1)[-1]).group(1))
    build(src, n)
    print("ok", src)
