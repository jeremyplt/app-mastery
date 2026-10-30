# Ajoute les balises DocuSeal aux contrats « Pack Incubateur App Mastery » (DOCX
# d'origine du Drive, sans balises). Usage : python3 scripts/docuseal-contrats.py
# 1x.docx 2x.docx 3x.docx -> écrit 1x-v4.docx, etc. Puis POST /templates/docx
# avec external_id app-mastery-<n>x-v3 pour mettre à jour le modèle existant.
# Les DOCX du Drive ont déjà le texte conseil et audit (contrats-conseil.py,
# passé le 30 oct. 2026 sur les anciennes versions).
import copy, sys, docx, docx.shared, docx.enum.text

R = "role=Client"

def set_text(p, text):
    for r in p.runs[1:]:
        r._r.getparent().remove(r._r)
    # Balise DocuSeal dans son propre run, en blanc : si DocuSeal laisse un
    # reste de balise en l'effaçant, il ne se voit pas.
    i = text.find("{{")
    j = text.find("}}", i) + 2 if i >= 0 else -1
    p.runs[0].text = text if i < 0 else text[:i]
    if i < 0:
        return
    tag = copy.deepcopy(p.runs[0]._r)
    p.runs[0]._r.addnext(tag)
    tr = docx.text.run.Run(tag, p)
    tr.text = text[i:j]
    tr.font.color.rgb = docx.shared.RGBColor(0xFF, 0xFF, 0xFF)
    if j < len(text):
        rest = copy.deepcopy(p.runs[0]._r)
        tag.addnext(rest)
        docx.text.run.Run(rest, p).text = text[j:]

def clone_after(p, text, italic=None, bold=None):
    new = copy.deepcopy(p._p)
    p._p.addnext(new)
    np = docx.text.paragraph.Paragraph(new, p._parent)
    set_text(np, text)
    for r in np.runs:
        if italic is not None: r.italic = italic
        if bold is not None: r.bold = bold
    return np

def find(paras, start):
    for p in paras:
        if p.text.startswith(start): return p
    raise SystemExit(f"introuvable : {start}")

def build(src, dst):
    d = docx.Document(src)
    P = d.paragraphs
    et = find(P, "ET :")
    nom = find(P, "Nom et prénom : ....")
    email = find(P, "Email : ....")
    tel = find(P, "Téléphone : ....")
    cas = find(P, "Le cas échéant, si le Client agit")
    deno = find(P, "Dénomination sociale")
    forme = find(P, "Forme juridique")
    imma = find(P, "Numéro d'immatriculation")
    siege = find(P, "Adresse du siège social")
    qual = find(P, "Qualité du signataire")
    debut = find(P, "Date de Début de la mission : ....")
    case = find(P, "☐ En cochant cette case")
    fait = find(P, "Fait en deux exemplaires originaux")

    # Note de facturation juste après « ET : », en italique comme les autres mentions.
    clone_after(et, "Les informations ci-dessous sont remplies par le Client. Elles servent à établir ses factures : il s'engage à ce qu'elles soient exactes et complètes.", italic=True, bold=False)

    set_text(nom, f"Nom et prénom : {{{{Nom et prénom;{R};readonly=true}}}}")
    set_text(email, f"Email : {{{{Email;{R};readonly=true}}}}")
    set_text(tel, f"Téléphone : {{{{Téléphone;{R};required=true}}}}")
    # Adresse et choix particulier / société après le téléphone. Le téléphone
    # passe en interligne serré, le choix garde l'espace après du bloc.
    typ_after = tel.paragraph_format.space_after
    tel.paragraph_format.space_after = email.paragraph_format.space_after
    a1 = clone_after(tel, f"Adresse postale : {{{{Adresse postale;{R};required=true}}}}")
    a2 = clone_after(a1, f"Code postal : {{{{Code postal;{R};required=true}}}}")
    a3 = clone_after(a2, f"Ville : {{{{Ville;{R};required=true}}}}")
    a3 = clone_after(a3, f"Pays : {{{{Pays;{R};required=true}}}}")
    typ = clone_after(a3, f"Le Client signe en tant que : {{{{Statut;{R};type=select;options=Particulier,Société}}}}")
    typ.paragraph_format.space_after = typ_after

    # Champs société : affichés et obligatoires seulement si « Société » est choisi.
    O = f"{R};condition=Statut:Société"
    set_text(cas, "Uniquement si le Client agit pour le compte d'une société (les factures sont alors établies au nom de la société) :")
    set_text(deno, "Dénomination sociale : {{Dénomination sociale;" + O + "}}")
    set_text(forme, "Forme juridique : {{Forme juridique;" + O + "}}")
    set_text(imma, "Numéro d'immatriculation (SIREN/RCS) : {{Immatriculation;" + O + "}}")
    set_text(siege, "Adresse du siège social : {{Adresse du siège;" + O + "}}")
    clone_after(siege, "Numéro de TVA intracommunautaire : {{N° de TVA;" + O + ";required=false}}")
    set_text(qual, "Qualité du signataire : {{Qualité du signataire;" + O + "}}")

    set_text(debut, f"Date de Début de la mission : {{{{Date de début;{R};readonly=true}}}}")
    # Case à cocher seule sur sa ligne, juste au-dessus de la phrase.
    set_text(case, case.text.replace("☐ ", "", 1))
    box = clone_after(case, f"{{{{Exécution immédiate;{R};type=checkbox;required=true;width=12;height=12}}}}")
    case._p.addprevious(box._p)
    box.alignment = docx.enum.text.WD_ALIGN_PARAGRAPH.LEFT
    box.paragraph_format.space_after = docx.shared.Pt(0)
    set_text(fait, fait.text.replace(".............................", f"{{{{Date;{R};type=datenow;format=DD/MM/YYYY}}}}"))
    # La date et les signatures restent sur la même page.
    fait.paragraph_format.keep_with_next = True
    docx.text.paragraph.Paragraph(fait._p.getprevious(), fait._parent).paragraph_format.keep_with_next = True

    cell = d.tables[-1].rows[0].cells[1]
    cn = [p for p in cell.paragraphs if p.text.startswith("Nom et prénom")][0]
    set_text(cn, "Nom et prénom :")
    clone_after(cn, f"{{{{Nom et prénom;{R};readonly=true}}}}", bold=False)
    sig = [p for p in cell.paragraphs if p.text.startswith("Signature")][0]
    clone_after(sig, f"{{{{Signature;{R};type=signature;width=200;height=60}}}}", bold=False)
    d.save(dst)

for src in sys.argv[1:]:
    build(src, src.replace(".docx", "-v4.docx"))
    print("ok", src)
