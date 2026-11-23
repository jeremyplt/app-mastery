// Comptabilité SDG STUDIO : lit dans Gmail les mails qui portent une facture ou un
// reçu, pour que le serveur retrouve la pièce de chaque dépense bancaire.
// LECTURE SEULE (droit gmail.readonly) : ce script ne peut ni envoyer, ni modifier,
// ni supprimer un mail. Il ne renvoie que les pièces jointes PDF ou image.

var API = 'https://gmail.googleapis.com/gmail/v1/users/me/messages';
var TYPES = /^(application\/pdf|image\/(jpeg|png|heic|webp))$/i;

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

function get_(url) {
  var r = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) throw new Error('Gmail ' + r.getResponseCode() + ' : ' + r.getContentText().slice(0, 150));
  return JSON.parse(r.getContentText());
}

function header_(msg, name) {
  var h = (msg.payload.headers || []).filter(function (x) { return x.name.toLowerCase() === name; })[0];
  return h ? h.value : '';
}

// Pièces jointes d'un mail, repérées par leur partId (l'attachmentId de Gmail change à chaque lecture).
function pieces_(part, out) {
  if (part.filename && part.body && part.body.attachmentId && TYPES.test(part.mimeType || '')) {
    out.push({ partId: part.partId, filename: part.filename, mimeType: part.mimeType, size: part.body.size || 0 });
  }
  (part.parts || []).forEach(function (p) { pieces_(p, out); });
  return out;
}

function trouver_(part, partId) {
  if (part.partId === partId) return part;
  var parts = part.parts || [];
  for (var i = 0; i < parts.length; i++) {
    var f = trouver_(parts[i], partId);
    if (f) return f;
  }
  return null;
}

function doPost(e) {
  try {
    var b = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('secret');
    if (!secret || b.secret !== secret) return json_({ ok: false, error: 'refusé' });

    if (b.action === 'chercher') {
      var url = API + '?maxResults=' + Math.min(Number(b.max) || 50, 100) + '&q=' + encodeURIComponent(String(b.q || ''));
      if (b.pageToken) url += '&pageToken=' + encodeURIComponent(b.pageToken);
      var list = get_(url);
      var messages = (list.messages || []).map(function (m) {
        var msg = get_(API + '/' + m.id + '?format=full');
        return {
          id: msg.id,
          date: Number(msg.internalDate),
          from: header_(msg, 'from'),
          subject: header_(msg, 'subject'),
          pieces: pieces_(msg.payload, [])
        };
      });
      return json_({ ok: true, messages: messages, next: list.nextPageToken || null });
    }

    if (b.action === 'piece') {
      if (!/^[0-9a-f]{8,24}$/i.test(String(b.messageId))) return json_({ ok: false, error: 'mail invalide' });
      var msg = get_(API + '/' + b.messageId + '?format=full');
      var part = trouver_(msg.payload, String(b.partId));
      if (!part || !part.body || !part.body.attachmentId || !TYPES.test(part.mimeType || '')) return json_({ ok: false, error: 'pièce introuvable' });
      var att = get_(API + '/' + b.messageId + '/attachments/' + part.body.attachmentId);
      return json_({ ok: true, filename: part.filename, mimeType: part.mimeType, data: att.data });
    }

    return json_({ ok: false, error: 'action inconnue' });
  } catch (err) {
    return json_({ ok: false, error: String(err).slice(0, 200) });
  }
}
