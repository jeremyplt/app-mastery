// GIGA BANQUE DE CONTENU : le serveur (Harness Maxxing) y ajoute les vidéos
// d'inspiration trouvées pour la niche d'un élève. Ce script ne peut qu'ajouter
// du texte à la fin d'une section ou créer une section : aucune suppression,
// aucune modification de l'existant. Copie de scripts/contenus/giga-banque/Code.gs.
var DOC = '1j_5Hru4rpGmoQ4gMNuQ_03IeZ_YXBpOfgqcWvxirLw8'; // GIGA BANQUE DE CONTENU

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Le secret est créé ici et remis une seule fois, au serveur, juste après le déploiement.
function doGet() {
  var p = PropertiesService.getScriptProperties();
  if (p.getProperty('delivered')) return json_({ ok: false });
  var s = Utilities.getUuid() + Utilities.getUuid();
  p.setProperties({ secret: s, delivered: '1' });
  return json_({ ok: true, secret: s });
}

function text_(s, max) {
  return String(s || '').replace(/[\u0000-\u001f]/g, ' ').slice(0, max);
}

function isUrl_(u) {
  return /^https:\/\/(www\.|vm\.|m\.)?(tiktok\.com|instagram\.com|youtube\.com|youtu\.be)\//.test(u || '');
}

// Index du titre de section (H1) qui porte ce texte, ou -1.
function findHeading_(body, title) {
  var n = body.getNumChildren();
  for (var i = 0; i < n; i++) {
    var el = body.getChild(i);
    if (el.getType() === DocumentApp.ElementType.PARAGRAPH) {
      var p = el.asParagraph();
      if (p.getHeading() === DocumentApp.ParagraphHeading.HEADING1 && p.getText().trim() === title) return i;
    }
  }
  return -1;
}

// Fin de la section qui commence à l'index i : juste avant le titre H1 suivant.
function sectionEnd_(body, i) {
  var n = body.getNumChildren();
  for (var j = i + 1; j < n; j++) {
    var el = body.getChild(j);
    if (el.getType() === DocumentApp.ElementType.PARAGRAPH && el.asParagraph().getHeading() === DocumentApp.ParagraphHeading.HEADING1) return j;
  }
  return n;
}

// { secret, titre, intro?, groupes: [{ titre, liens: [{ texte, url }] }] }
// Ajoute les liens à la section « titre » (créée à la fin du document si elle
// n'existe pas). Renvoie le lien direct vers la section (signet).
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var b = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('secret');
    if (!secret || b.secret !== secret) return json_({ ok: false, error: 'refusé' });
    var titre = text_(b.titre, 150).trim();
    if (!titre) return json_({ ok: false, error: 'titre manquant' });
    var groupes = (b.groupes || []).slice(0, 6);
    lock.waitLock(30000);
    var doc = DocumentApp.openById(DOC);
    var body = doc.getBody();
    var at = findHeading_(body, titre);
    var heading;
    if (at === -1) {
      heading = body.appendParagraph(titre).setHeading(DocumentApp.ParagraphHeading.HEADING1);
      at = body.getChildIndex(heading);
      if (b.intro) body.insertParagraph(at + 1, text_(b.intro, 500)).setHeading(DocumentApp.ParagraphHeading.NORMAL);
    } else {
      heading = body.getChild(at).asParagraph();
    }
    var pos = sectionEnd_(body, at);
    var added = 0;
    groupes.forEach(function (g) {
      var liens = (g.liens || []).filter(function (l) { return isUrl_(l.url); }).slice(0, 80);
      if (!liens.length) return;
      body.insertParagraph(pos++, text_(g.titre, 120)).setHeading(DocumentApp.ParagraphHeading.HEADING2);
      liens.forEach(function (l) {
        var label = text_(l.texte, 220) || l.url;
        var p = body.insertListItem(pos++, label);
        p.setGlyphType(DocumentApp.GlyphType.BULLET);
        p.editAsText().setLinkUrl(0, label.length - 1, l.url);
        added++;
      });
    });
    var mark = doc.addBookmark(doc.newPosition(heading.editAsText(), 0));
    doc.saveAndClose();
    return json_({ ok: true, ajoutes: added, lien: 'https://docs.google.com/document/d/' + DOC + '/edit#bookmark=' + mark.getId() });
  } catch (err) {
    return json_({ ok: false, error: String(err).slice(0, 200) });
  } finally {
    lock.releaseLock();
  }
}
