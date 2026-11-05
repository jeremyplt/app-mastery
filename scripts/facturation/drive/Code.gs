// Dépose les factures et les justificatifs sur le Drive de Jeremy. Appelé par le
// job de facturation. Ne peut qu'ajouter des fichiers, dans ces dossiers : aucune
// lecture, aucune suppression, jamais d'écrasement.
var ROOT = '1QdUnA9KXGAh6Wz1tT44SkyP2xouMAxDD'; // ACCOMPAGNEMENT
var HORS_ELEVES = '_FACTURES HORS ÉLÈVES';
var JUSTIFICATIFS = '1drmdECmlQym9D3RJlyVNfQGtz0nTKHiI'; // Justificatifs de domicile hors UE

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Le secret est créé ici et remis une seule fois, au job, juste après le déploiement.
function doGet() {
  var p = PropertiesService.getScriptProperties();
  if (p.getProperty('delivered')) return json_({ ok: false });
  var s = Utilities.getUuid() + Utilities.getUuid();
  p.setProperties({ secret: s, delivered: '1' });
  return json_({ ok: true, secret: s });
}

function clean_(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
}

function child_(parent, name) {
  var it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

// Dossier d'un élève : « Ayoube » retrouve AYOUB, « Kilian » retrouve KILIAN & PHILIPPE.
function studentFolder_(root, firstName) {
  var wanted = clean_(firstName);
  var it = root.getFolders();
  while (it.hasNext()) {
    var f = it.next();
    var word = clean_(f.getName()).split(' ')[0];
    if (word.length >= 3 && (word === wanted || (Math.min(word.length, wanted.length) >= 4 && (word.indexOf(wanted) === 0 || wanted.indexOf(word) === 0)))) return f;
  }
  return root.createFolder(wanted);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var b = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('secret');
    if (!secret || b.secret !== secret) return json_({ ok: false, error: 'refusé' });
    if (!/^[^\/\\]{1,200}$/.test(b.name || '')) return json_({ ok: false, error: 'nom invalide' });
    lock.waitLock(30000);
    var folder;
    if (b.kind === 'justificatif') {
      folder = DriveApp.getFolderById(JUSTIFICATIFS);
    } else if (b.kind === 'facture') {
      var root = DriveApp.getFolderById(ROOT);
      folder = b.student ? child_(studentFolder_(root, b.student), 'Factures') : child_(root, HORS_ELEVES);
    } else {
      return json_({ ok: false, error: 'type inconnu' });
    }
    var same = folder.getFilesByName(b.name);
    if (same.hasNext()) return json_({ ok: true, id: same.next().getId(), existed: true });
    var blob = Utilities.newBlob(Utilities.base64Decode(b.base64), b.mime || 'application/pdf', b.name);
    return json_({ ok: true, id: folder.createFile(blob).getId(), existed: false });
  } catch (err) {
    return json_({ ok: false, error: String(err).slice(0, 200) });
  } finally {
    lock.releaseLock();
  }
}
