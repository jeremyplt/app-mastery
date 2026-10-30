# Requalifie les contrats « Pack Incubateur App Mastery » en prestation de
# conseil et d'audit (TVA : le lieu de la prestation reste le Luxembourg pour
# les particuliers UE, ce qui ne serait pas le cas d'une formation en ligne).
# Les vidéos et la communauté restent dans le contrat, comme support accessoire.
# Usage : python3 scripts/contrats-conseil.py 1x.docx 2x.docx 3x.docx
# -> réécrit les fichiers en place, à passer ensuite dans docuseal-contrats.py.
import copy, re, sys, docx

def set_text(p, text):
    for r in p.runs[1:]:
        r._r.getparent().remove(r._r)
    p.runs[0].text = text

def clone_after(p, text):
    new = copy.deepcopy(p._p)
    p._p.addnext(new)
    np = docx.text.paragraph.Paragraph(new, p._parent)
    set_text(np, text)
    return np

def find(paras, start):
    for p in paras:
        if p.text.startswith(start): return p
    raise SystemExit(f"introuvable : {start}")

def replace_all(paras, old, new):
    for p in paras:
        if old not in p.text: continue
        for r in p.runs:
            if old in r.text:
                r.text = r.text.replace(old, new)
        if old in p.text:
            raise SystemExit(f"« {old} » coupé entre plusieurs runs : {p.text[:80]}")

def build(path):
    d = docx.Document(path)
    P = d.paragraphs

    title = P[0]
    set_text(title, title.text.replace("CONTRAT D'ACCOMPAGNEMENT ET", "CONTRAT DE CONSEIL, D'AUDIT ET")
                              .replace("CONTRAT D'ACCOMPAGNEMENT,", "CONTRAT DE CONSEIL ET D'AUDIT,"))
    set_text(find(P, "PARTIE I – CONTRAT D'ACCOMPAGNEMENT"), "PARTIE I – CONTRAT DE CONSEIL ET D'AUDIT")

    # Article 1 : l'objet principal est le conseil et l'audit, y compris pour
    # le client qui n'a pas encore d'application.
    objet = find(P, "Le présent contrat a pour objet")
    set_text(objet, "Le présent contrat a pour objet une prestation de conseil et d'audit personnalisés, dénommée « App Mastery » (ci-après « la mission » ou « le programme »), fournie par le Prestataire au Client sur son projet d'application mobile, dans les conditions définies ci-après.")
    a = clone_after(objet, "Si le Client dispose déjà d'une application, le Prestataire en réalise l'audit (fiche store, parcours d'inscription, paywall, monétisation, acquisition) et lui remet des recommandations et un plan d'action pour l'améliorer et la développer.")
    b = clone_after(a, "Si le Client n'a pas encore d'application, le Prestataire le conseille sur la création de son projet : étude de marché, choix et validation de l'idée, analyse de la concurrence, positionnement, direction à prendre, modèle de monétisation et stratégie de lancement. Il lui remet un plan d'action, puis audite l'application au fil de sa construction et de sa publication.")
    clone_after(b, "Les ressources en ligne mises à la disposition du Client (vidéos, modèles, documents de référence et communauté) sont un support accessoire de cette prestation de conseil. Elles n'en constituent pas l'objet principal.")
    set_text(find(P, "Le programme est un accompagnement à l'action"), "La prestation est une mission de conseil : le Client demeure seul maître d'œuvre et seul responsable de son projet, de son application et de ses décisions.")

    # Article 3 : le conseil d'abord, les ressources en ligne en dernier.
    P = d.paragraphs
    set_text(find(P, "Le programme comprend, pendant"), "La prestation comprend, pendant la durée définie à l'article 2 :")
    acces = find(P, "Un accès individuel à la plateforme de formation")
    commu = find(P, "Un accès à la communauté privée en ligne")
    messagerie = find(P, "Un suivi individuel à distance par messagerie")
    sessions = find(P, "Des sessions de suivi individuelles")
    recos = find(P, "Des recommandations personnalisées portant sur")
    audit = clone_after(acces, "Un audit personnalisé de l'application du Client ou, si le Client n'a pas encore d'application, une étude de son marché et de son projet (idée, cible, concurrence, positionnement, monétisation), restitués par écrit, en vidéo ou lors d'un appel ;")
    plan = clone_after(audit, "Un plan d'action personnalisé, mis à jour au fil de l'avancement du projet ;")
    set_text(sessions, sessions.text.replace("Des sessions de suivi individuelles", "Des sessions de conseil individuelles"))
    set_text(messagerie, messagerie.text.replace("Un suivi individuel à distance", "Un suivi de conseil individuel à distance"))
    set_text(recos, "Des recommandations personnalisées portant sur la création, le développement, la publication, la monétisation et la promotion de l'application du Client ;")
    set_text(acces, "À titre accessoire, un accès individuel aux ressources en ligne du Prestataire (vidéos, modèles et documents de référence), consenti sans limitation de durée dans les conditions de l'article 4, ainsi qu'un accès à la communauté privée en ligne du programme.")
    plan._p.addnext(sessions._p)
    sessions._p.addnext(messagerie._p)
    messagerie._p.addnext(recos._p)
    recos._p.addnext(acces._p)
    commu._p.getparent().remove(commu._p)

    P = d.paragraphs
    set_text(find(P, "Article 4 – Accès à la plateforme de formation"), "Article 4 – Accès aux ressources en ligne (accessoire)")
    replace_all(P, "plateforme de formation", "plateforme de ressources en ligne")
    set_text(find(P, "Offre souscrite :"), "Offre souscrite : Prestation de conseil et d'audit, Incubateur App Mastery")
    set_text(find(P, "Le prix du programme est de 3 000 euros"), "Le prix de la prestation est de 3 000 euros (trois mille euros) toutes taxes comprises. La TVA éventuellement due, selon le statut et le pays du Client, est incluse dans ce montant.")
    set_text(find(P, "Avoir participé à au moins trois (3) coachings de groupe"), "Avoir participé à au moins trois (3) appels collectifs de conseil.")
    replace_all(P, "modalités enseignées", "modalités recommandées")
    replace_all(P, "standards enseignés", "standards recommandés")
    # Partie III et clause d'impayé, seulement dans les contrats 2x et 3x.
    replace_all(P, "au titre du programme d'accompagnement « App Mastery »", "au titre de la prestation de conseil et d'audit « App Mastery »")
    replace_all(P, "« Accompagnement dans l'Incubateur App Mastery »", "« Prestation de conseil et d'audit, Incubateur App Mastery »")
    replace_all(P, "(contenus de formation, sessions de coaching, communauté", "(sessions et suivi de conseil, ressources en ligne, communauté")

    # « Accompagnement » devient « mission de conseil » partout (factures et
    # contrat parlent le même langage).
    for old, new in [
        ("du programme d'accompagnement", "de la prestation de conseil"),
        ("au programme d'accompagnement", "à la prestation de conseil"),
        ("contrat d'accompagnement", "contrat de conseil"),
        ("L'accompagnement est conclu ", "La mission de conseil est conclue "),
        ("l'accompagnement", "la mission"),
    ]:
        replace_all(P, old, new)

    for p in d.paragraphs:
        m = re.search(r"\b(formation|coaching|pédagogi|enseign|accompagnement)", p.text, re.I)
        if m: raise SystemExit(f"reste « {m.group(1)} » : {p.text[:100]}")
    d.save(path)

for src in sys.argv[1:]:
    build(src)
    print("ok", src)
