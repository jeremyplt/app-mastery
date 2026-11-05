import sys
def shot(t,cap=None,img=None,txt=None):
    c=f'<div class="cap">{cap}</div>' if cap else ''
    if img:
        body=f'<img src="img/{img}.jpg" alt="" loading="lazy">'
    else:
        body=f'<div class="todo"><b>À filmer</b><span>{txt}</span></div>'
    return f'<figure class="shot"><div class="screen">{body}{c}</div><figcaption>{t}</figcaption></figure>'
def links(items):
    return '<ul class="refs">'+''.join(f'<li><a href="{u}">{t}</a> <span>{m}</span></li>' for t,m,u in items)+'</ul>'
def recipe(n,title,idea,shots,refs,extra='',tag=''):
    tagh=f'<span class="tag">{tag}</span>' if tag else ''
    return f'''<article class="recipe" id="video-{n}"><header><span class="num">{n}</span><div><h3>{title}{tagh}</h3><p>{idea}</p></div></header>
<div class="shots">{''.join(shots)}</div>{extra}<h4>Le modèle à regarder</h4>{links(refs)}</article>'''

R=[]
def slide(t,html,img,ar='r34',note=''):
    n=f'<small class="hint">{note}</small>' if note else ''
    im=f'<img src="img/{img}.jpg" alt="" loading="lazy">' if img else ''
    return f'<figure class="shot"><div class="screen slide {ar}">{im}{html}</div><figcaption>{t}{n}</figcaption></figure>'
def box(x,cls=''): return f'<div class="sl lb {cls}"><span>{x}</span></div>'
V=lambda t,html,img,note='': slide(t,html,img,'r916',note)
def wt(x,c=''): return f'<div class="sl wt {c}">{x}</div>'
def split(a,la,b,lb): return f'<div class="split"><div class="ims"><img src="img/{a}.jpg" alt=""><img src="img/{b}.jpg" alt=""></div><div class="lbs"><span>{la}</span><span>{lb}</span></div></div>'
def kc(a,b,dash=False): return f'<div class="sl kc"><span>{a}</span><span>{b}</span></div>'+('<i class="dash"></i>' if dash else '')
def duo(a,b): return f'<div class="duo"><img src="img/{a}.jpg" alt=""><img src="img/{b}.jpg" alt=""></div><img class="mini" src="img/b_home.jpg" alt=""><div class="sl dl a">AVEC FAMILY QUEST</div><div class="sl dl b">SANS FAMILY QUEST</div>'
def stk(a,la,b,lb): return f'<div class="duo"><img src="img/{a}.jpg" alt=""><img src="img/{b}.jpg" alt=""></div><div class="sl dl c a">{la}</div><div class="sl dl c b">{lb}</div>'
def wd(x): return f'<div class="sl wd">{x}</div>'
def ttl(x): return f'<div class="sl ttl">{x}</div>'
def rows(rs): return '<div class="rows">'+''.join(f'<div style="background-image:linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.35)),url(img/{im}.jpg)"><b style="color:{c}">{a}</b><span>{h}</span></div>' for a,c,h,im in rs)+'</div>'
GR='#35e04a'; YE='#ffd60a'; RE='#ff2d55'; TOPE='y_topempty0'; SETT='y_tableset4'
def model(imgs,txt,refs):
    s=''.join(f'<img src="img/{n}.jpg" alt="" loading="lazy">' for n in imgs)
    return f'<div class="model"><div class="strip">{s}</div><div><h4>La vidéo qui marche</h4><p>{txt}</p>{links(refs)}</div></div>'
def tile(t,cap=None,img=None,txt=None,lab='À filmer',raw=None):
    c=f'<div class="cap">{cap}</div>' if cap else ''
    if raw: body=raw
    elif img and txt: body=f'<img src="img/{img}.jpg" alt="" loading="lazy"><div class="todo over"><b>{lab}</b><span>{txt}</span></div>'
    elif img: body=f'<img src="img/{img}.jpg" alt="" loading="lazy">'
    else: body=f'<div class="todo"><b>{lab}</b><span>{txt}</span></div>'
    return f'<figure class="shot"><div class="screen">{body}{c}</div><figcaption>{t}</figcaption></figure>'
def fiche(n,title,mod,idea,shots,extra='',tag=''):
    tagh=f'<span class="tag">{tag}</span>' if tag else ''
    return f"""<article class="recipe" id="video-{n}"><header><span class="num">{n}</span><div><h3>{title}{tagh}</h3></div></header>
{mod}<h4>Pour Family Quest</h4><p>{idea}</p><div class="shots tall">{''.join(shots)}</div>{extra}</article>"""
def radar(title,r,t,n,o):
    c=lambda v:v*0.36
    pts=f"50,{50-c(r)} {50+c(t)},50 50,{50+c(n)} {50-c(o)},50"
    return f"""<div class="stats"><b>{title}</b><div class="nums"><span>Ranger <i>{r}</i></span><span>Mettre la table <i>{t}</i></span><span>Négocier <i>{n}</i></span><span>Oublier <i>{o}</i></span></div><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 14L86 50L50 86L14 50Z M50 14V86 M14 50H86" fill="none" stroke="#666" stroke-width=".6"/><polygon points="{pts}" fill="#ddd" fill-opacity=".85"/></svg></div>"""
def stack(rows):
    return '<div class="stack">'+''.join(f'<div style="background-image:linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)),url(img/{d}.jpg);background-size:cover;background-position:center"><b>{a}</b><span>{b}</span><i>{c}</i></div>' for a,b,c,d in rows)+'</div>'

R.append(fiche(1,"« Je te jure, j'ai mis la table »",
 model(['r_cal1','r_cal2','r_cal3'],"Une phrase en blanc au milieu de l'image : « Cal AI est précise, je te jure ». Il cache un cookie dans le sandwich. Puis l'écran passe en deux colonnes sur fond noir, avec juste « No Cookie » et « Cookie » écrits en dessous. Une scène, un piège, un résultat, en 9 secondes.",[
  ("Le cookie caché dans le sandwich","10,9 M de vues, 9 secondes","https://www.instagram.com/p/DM8lXAYJG_O/"),
  ("Le chocolat caché dans le sandwich","7,3 M de vues, 15 secondes","https://www.instagram.com/p/DJVVEyhOfpR/"),
  ("Le chocolat ajouté après le scan","4,5 M de vues, 15 secondes","https://www.instagram.com/p/DJ1mr0jIpmD/")]),
 "Chez toi, c'est l'enfant qui essaie de piéger le parent, et ça arrive vraiment à la maison. Le parent se reconnaît tout de suite et il comprend à quoi sert l'app, sans aucune explication. Mets les deux images l'une au-dessus de l'autre pour qu'on les voie en grand. Tout se filme avec tes mains.",[
 V("0 à 3 s",wt("« Papa, j'ai mis la table, je te jure. »"),'b_home',"À filmer : la notification sur ton téléphone, ta main dans le cadre."),
 V("3 à 6 s",stk('b_valide',"CE QU'IL DIT",'x_empty2',"CE QUE JE VOIS"),None,"À monter : en haut, ton écran « Tylio a fini ». En bas, la table toujours vide."),
 V("6 à 9 s",stk('b_valide',"À REFAIRE",'y_tableset4',"10 MIN PLUS TARD"),None,"À monter : en haut, ton doigt sur « À refaire ». En bas, la table mise, même cadre."),
 V("9 à 11 s","",'b_jeu',"À filmer : tu valides, et le jeu s'ouvre, avec son vrai son. (Éventuellement, filme ton enfant en train de jouer, ou prends une photo, sans montrer sa tête.)"),
],extra='<p class="note">À décliner sans fin : les dents « brossées » avec la brosse sèche, le lave-vaisselle « vidé » à moitié, le sac « prêt » sans les cahiers.</p>',tag="À faire en premier"))

R.append(fiche(2,"« POV : quand ton fils te dit qu'il a rangé sa chambre »",
 model(['r_pov1','r_pov2','r_pov3'],"Une seule phrase « POV » en blanc, posée au milieu de l'image, qui reste du début à la fin. Tout est filmé au téléphone comme si on y était, et la phrase de fin invite à envoyer la vidéo à quelqu'un.",[
  ("Studley AI : « POV : ton podcast devient humain »","10,8 M de vues, 988 064 likes, 18 secondes","https://www.instagram.com/reel/DSAtXLkEfv_/"),
  ("« POV : une fiche de révision en 30 secondes », en français","206 800 vues, 19 secondes, avec « Envoie ça à ton study bro » à la fin","https://www.tiktok.com/@teho_champion/video/7423417728817466657"),
  ("« POV : tu as trouvé comment faire VOULOIR à tes enfants faire leurs tâches »","59 500 vues, 20 secondes, dans ta niche","https://www.tiktok.com/@vicandjayfinds/video/7677733579345972510")]),
 "La version vidéo du premier carrousel. Le lit a l'air fait, tu soulèves la couverture, et tout est caché dessous. Le parent a déjà vécu ça, il comprend en une seconde. Et ta main suffit, ton enfant n'apparaît jamais.",[
 V("0 à 2 s",wt("POV : quand ton fils te dit qu'il a rangé sa chambre 😭",'pv'),'y_lumpy4',"À filmer : le lit « fait », téléphone à la main, comme si tu entrais dans la chambre."),
 V("2 à 4 s",wt("POV : quand ton fils te dit qu'il a rangé sa chambre 😭",'pv'),'y_lift0',"À filmer : ta main attrape la couverture et la soulève d'un coup."),
 V("4 à 7 s",wt("POV : quand ton fils te dit qu'il a rangé sa chambre 😭",'pv'),'y_under6',"À filmer : tout est dessous, jouets, vêtements, assiette. Garde cette image un peu plus longtemps."),
 V("7 à 10 s",wt("POV : quand ton fils te dit qu'il a rangé sa chambre 😭",'pv')+wt("Envoie ça à son père 💀",'pvend'),'b_valide',"À filmer : ton doigt appuie sur « À refaire » dans l'app."),
],extra='<p class="note">Une vidéo par cachette : sous le lit, dans le placard, derrière le rideau. Même montage, et le nom de l\'app va en légende.</p>',tag="À faire en premier"))

R.append(fiche(3,"Sans Family Quest, avec Family Quest",
 model(['r_ti1','r_ti2','r_ti3'],"L'écran est coupé en deux, l'une au-dessus de l'autre. En haut « AFTER TIIMO », en bas « BEFORE TIIMO », en grosses lettres blanches au niveau de la coupure, avec l'écran de l'app posé sur le côté. La même scène, deux résultats, et le spectateur compare tout seul.",[
  ("Tiimo : avant et après l'app","1,9 M de vues, 14 000 likes","https://www.tiktok.com/@palopenguin/video/7604984371631688974"),
  ("CalScan : pour la vue du dessus et le son des objets","16,5 M de vues, 17 secondes","https://www.tiktok.com/@calscanapp/video/7508465001674624302")]),
 "La même table, filmée deux fois sous le même angle. En bas, sans l'app, elle ne bouge jamais. En haut, avec l'app, des mains la mettent. Tu n'as rien à expliquer. L'accroche va dans la légende : « Il est 18 h et tu répètes encore de mettre la table. »",[
 V("0 à 3 s",duo('y_topempty0','y_topempty0'),None,"À filmer : la table vide, téléphone fixé. Les deux moitiés sont identiques."),
 V("3 à 9 s",duo('y_topset5','y_topempty0'),None,"À filmer : en haut, des mains posent l'assiette, la fourchette, le verre. En bas, la même table reste vide."),
 V("9 à 12 s",duo('y_tableset4','y_topempty0'),None,"À filmer : en haut, la table est mise. En bas, toujours rien."),
 V("12 à 15 s",duo('b_jeu','y_topempty0'),None,"À filmer : en haut, le jeu s'ouvre, avec son vrai son. En bas, la table vide, jusqu'au bout. (Éventuellement, filme ton enfant en train de jouer, ou prends une photo, sans montrer sa tête.)"),
],tag="À faire en premier"))

R.append(fiche(4,"« Expliqué par des chats »",
 model(['r_ca1','r_ca2','r_ca3'],"Fond blanc, un titre noir écrit à la main avec un mot en rouge, et un chat détouré. Puis un mème de chat par phrase, avec un seul mot à l'écran, pendant qu'une voix raconte. « ÉTAPE 4 : » sur fond blanc, et l'app tenue par des pattes de chat.",[
  ("Kitty : maigrir sans effort, expliqué par des chats","4,9 M de vues, sans aucun visage","https://www.tiktok.com/@kittyweight/video/7567016921816714526")]),
 "Tu enregistres déjà ta voix : il te reste à trouver les chats. Aucun tournage. C'est le ton le plus jeune de la liste, et il permet de parler du problème en riant.",[
 slide("Le titre",ttl('FAIRE <em>METTRE</em><br>LA TABLE'),'y_catbase1','r916 catt',"À monter : fond blanc, un chat détouré en bas."),
 V("Étape 1",wd('gentiment'),'y_catcry4',"À monter : un mème par phrase, un seul mot à l'écran."),
 V("Étape 3",wd('crie'),'y_catsofa4',"À monter : le mot suit ta voix."),
 V("Le passage",'<div class="sl ttl mid">ÉTAPE 4 :</div>',None,"À monter : fond blanc, une seconde seulement."),
 V("Étape 4",wd('table'),'y_catphone1',"À monter : ta vraie app, tenue par le chat."),
],extra='<blockquote class="script"><b>Le texte à dire :</b> « Comment faire mettre la table à un enfant, expliqué par des chats. Étape 1 : maman chat demande gentiment. Petit chat ne bouge pas. Étape 2 : maman chat redemande. Petit chat réclame cinq minutes. Étape 3 : maman chat crie. Tout le monde pleure. Étape 4 : maman chat installe Family Quest. Petit chat veut jouer, alors petit chat met la table. Étape 5 : maman chat s\'allonge sur le canapé. »</blockquote>'))

R.append(fiche(5,"3 enfants, à la même heure",
 model(['r_ty1','r_ty2','r_ty3'],"L'écran est coupé en trois lignes. Chaque ligne a son titre en couleur (vert, jaune, rouge) et son heure en blanc juste en dessous. À 23 h 30, l'une travaille encore et l'autre dort. Aucune autre phrase : on compare, et on se demande lequel on est.",[
  ("« La différence entre 3 types d'étudiants »","17,1 M de vues, 320 715 likes, 10 secondes","https://www.instagram.com/reel/DU_DxeJiH8c/")]),
 "La même table filmée trois fois, sans personne à l'image. Le parent se reconnaît dans une des deux dernières lignes.",[
 V("0 à 5 s",rows([("Avec Family Quest",GR,"19:00",TOPE),("L'enfant qui oublie",YE,"19:00",TOPE),("L'enfant qui négocie",RE,"19:00",TOPE)]),None,"À filmer : la table vide, trois fois le même cadre."),
 V("5 à 10 s",rows([("Avec Family Quest",GR,"19:05",SETT),("L'enfant qui oublie",YE,"19:05",TOPE),("L'enfant qui négocie",RE,"21:30",TOPE)]),None,"À filmer : la table mise, pour la première ligne seulement."),
]))

R.append(fiche(6,"On décroche le vieux tableau",
 model(['r_he1','r_he2','r_he3'],"Petit texte blanc au milieu de l'image : « Out with the OLD ». On arrache le vieux tableau du frigo. Puis une 2e ligne apparaît : « In with the NEW », et l'écran arrive. À la fin, une liste dans des boîtes noires. C'est le plus gros score de ta niche, et la vidéo dure 10 secondes.",[
  ("Hearth : le tableau papier remplacé par l'écran","29,9 M de vues, 269 164 likes","https://www.instagram.com/reel/DESc1ZGOzxU/"),
  ("Skylight : l'écran familial sans visage","2,1 M de vues, 42 600 likes","https://www.tiktok.com/@myskylight/video/7356736324960816426")]),
 "Un avant et un après compris en une seconde. Il te faut juste ce que vous aviez avant : tableau, liste sur le frigo, post-it.",[
 V("0 à 3 s",wt("Adieu le VIEUX tableau"),'y_chart3',"À filmer : une main l'arrache du frigo. On entend le papier."),
 V("3 à 7 s",wt("Adieu le VIEUX tableau<br>Bonjour les ✨ MISSIONS ✨"),'y_tabletcal4',"À filmer : la tablette sur la table, ton vrai calendrier à l'écran."),
 V("7 à 10 s",'<div class="sl blk mdl"><span>Une seule appli pour :<br>✅ Les tâches<br>✅ Le calendrier<br>✅ Les récompenses<br>🎮 Et le jeu</span></div>','b_home',"À filmer : ton app, en gros plan."),
]))

PX={'door0': '6274958', 'door1': '7045947', 'door2': '279810', 'door3': '39828929', 'door4': '11231039', 'door5': '16550173', 'door6': '34001300', 'door7': '10400473', 'door8': '8693637', 'door9': '37124334', 'door10': '6903157', 'messy0': '5894709', 'messy1': '18063446', 'messy2': '4046082', 'messy3': '5317154', 'messy4': '7045947', 'messy5': '1547968', 'messy6': '7794043', 'messy7': '39828929', 'messy8': '30630960', 'messy9': '29659894', 'messy10': '12489331', 'bed0': '22711513', 'bed1': '18063446', 'bed2': '4046082', 'bed3': '29162163', 'bed4': '6903157', 'bed5': '4399367', 'bed6': '34496715', 'bed7': '6010874', 'bed8': '5849367', 'bed9': '10554461', 'bed10': '8089268', 'bag0': '37492244', 'bag1': '37580640', 'bag2': '9629915', 'bag3': '8555349', 'bag4': '36931056', 'bag5': '5445610', 'bag6': '5352628', 'bag7': '12932566', 'bag8': '764681', 'bag9': '5926443', 'bag10': '29659894', 'table0': '20130513', 'table1': '5728168', 'table2': '5990698', 'table3': '2995012', 'table4': '18823960', 'table5': '24433378', 'table6': '39122376', 'table7': '14715769', 'table8': '4119832', 'table9': '7243881', 'table10': '37827340', 'morning0': '32960958', 'morning1': '29304300', 'morning2': '35523270', 'morning3': '29623051', 'morning4': '13790220', 'morning5': '13009039', 'morning6': '19836790', 'morning7': '7209057', 'morning8': '4253133', 'morning9': '34579767', 'morning10': '5849982', 'cal0': '32381238', 'cal1': '29509515', 'cal2': '39474424', 'cal3': '6172482', 'cal4': '16472571', 'cal5': '38699699', 'cal6': '29279352', 'cal7': '8042344', 'cal8': '7059603', 'cal9': '6925113', 'cal10': '7668396', 'shop0': '4057737', 'shop1': '5861185', 'shop2': '8487200', 'shop3': '8386523', 'shop4': '5498233', 'shop5': '4177709', 'shop6': '7657381', 'shop7': '8166563', 'shop8': '4968388', 'shop9': '3958205', 'shop10': '5102221', 'tablet0': '3905745', 'tablet1': '6437813', 'tablet2': '5934547', 'tablet3': '12788664', 'tablet4': '4260316', 'tablet5': '7414065', 'tablet6': '9784245', 'tablet7': '7411', 'tablet8': '9786319', 'tablet9': '9784237', 'tablet10': '9784235', 'empty0': '16754448', 'empty1': '4993950', 'empty2': '2995012', 'empty3': '16754448', 'empty4': '5728168', 'empty5': '5990698', 'empty6': '7658310', 'empty7': '260689', 'empty8': '18823960', 'empty9': '9300726', 'empty10': '19165510', 'plate0': '19075629', 'plate1': '18823960', 'plate2': '39122376', 'plate3': '33490517', 'plate4': '5728168', 'plate5': '7243881', 'plate6': '12018270', 'plate7': '2995012', 'plate8': '5990698', 'plate9': '37827340', 'plate10': '5837000', 'phone0': '580669', 'phone1': '7115', 'phone2': '694424', 'phone3': '12876446', 'phone4': '32171277', 'phone5': '569062', 'phone6': '13929418', 'phone7': '17801590', 'phone8': '34513350', 'phone9': '7411', 'phone10': '7821761', 'tidy0': '3875085', 'tidy1': '7045947', 'tidy2': '3890165', 'tidy3': '6903157', 'tidy4': '4008518', 'tidy5': '39828929', 'tidy6': '8089268', 'tidy7': '5158462', 'tidy8': '36099777', 'tidy9': '5644712', 'tidy10': '34864845', 'bedmade0': '32895225', 'bedmade1': '10554461', 'bedmade2': '6903157', 'bedmade3': '8089268', 'bedmade4': '6010874', 'bedmade5': '9616714', 'bedmade6': '34496715', 'bedmade7': '28513849', 'bedmade8': '4399367', 'bedmade9': '6489093', 'bedmade10': '29162163', 'tooth0': '65055', 'tooth1': '13466251', 'tooth2': '7622547', 'tooth3': '10566139', 'tooth4': '6322805', 'tooth5': '13885861', 'tooth6': '6957081', 'tooth7': '4300078', 'tooth8': '5468620', 'tooth9': '19666087', 'tooth10': '29462819', 'ready0': '7969103', 'ready1': '9629915', 'ready2': '37580640', 'ready3': '10400473', 'ready4': '11628718', 'ready5': '11231039', 'ready6': '34001300', 'ready7': '10875019', 'ready8': '16550173', 'ready9': '5352628', 'ready10': '6633602'}
def X(k): return 'y_'+k
J=lambda t,x,img,sub='',end='': slide(t,box(x,'jt')+(box(sub,'js') if sub else '')+(box(end,'je') if end else ''),img,'r34')
def NS(n,no,yes,img): return slide(f"Image {n}",box("❌ « "+no+" »",'n1')+box("Dis plutôt :",'n2')+box("✅ « "+yes+" »",'n3'),img,'r34')
def SP(n,img,top,bot='',small='',bl=False):
    h=box(top,'tl')
    if bot: h+=box(bot,'bl2' if bl else 'br2')
    if small: h+=box(small,'sm2')
    return slide(f"Image {n}",h,img,'r34')
JUNO=''.join([
 J("Image 1","Ce qu'il ne faut PAS dire à ton enfant pour qu'il mette la table",'y_messy2',"(édition parents fatigués)","lis jusqu'à la fin >>"),
 NS(2,"Je te l'ai déjà dit 10 fois","Tu as 5 minutes pour mettre la table",'x_empty2'),
 NS(3,"Si tu ne le fais pas, plus d'écran","Dès que c'est fait, tu peux jouer",'y_tableset2'),
 NS(4,"Tu ne m'écoutes jamais","Commence par les assiettes, je regarde après",'y_morning2'),
 NS(5,"Bon, laisse, je vais le faire","Dis-moi quand c'est fini, je viendrai vérifier",'y_tidy1'),
 SP(6,'y_messy4',"personne ne t'apprend à faire mettre la table sans crier","mais les bons mots changent toute la soirée"),
 SP(7,'b_home',"c'est pour ça que j'ai créé Family Quest 🧡","ton enfant voit ses missions, il les fait, et il gagne son temps de jeu",bl=True),
 SP(8,'b_valide',"il te signale quand c'est fini","et toi, tu n'as plus qu'à vérifier","(au lieu de répéter toute la soirée)"),
 SP(9,'b_jeu',"ensuite, il part jouer avec son héros","sans que tu aies à le redemander"),
 SP(10,'y_tableset4',"Commente « MISSION » si tu veux que je t'envoie le lien","Enregistre ça pour ce soir 🫶"),
])
FOUNDER=f"""<h2>Ton histoire de créateur, pour le compte principal</h2>
<p>C'est ici que tu peux expliquer l'app, de temps en temps. Ces formats demandent plus de temps et plus de travail que les vidéos courtes. Voici deux façons de le faire sans montrer ta tête.</p>
<article class="recipe"><header><span class="num">A</span><div><h3>En carrousel, comme le créateur de Juno</h3></div></header>
{model(['k_j1','k_j2','k_j4'],"10 images. D'abord un titre et 4 images utiles : ce qu'il ne faut pas dire chez le médecin, et ce qu'il faut dire à la place. Puis « personne ne t'apprend ça », « c'est pour ça que j'ai créé Juno », ce que fait l'app, et « Commente Juno pour recevoir le lien ». Il montre son visage, mais le format marche aussi avec des photos de ta maison.",[("Le créateur de Juno raconte son histoire","2,5 M de vues, 28 000 likes, 13 743 enregistrements","https://www.tiktok.com/@isaac.tryjuno/photo/7618183450427673878")]).replace('La vidéo qui marche','Le carrousel qui marche')}
<h4>Pour Family Quest</h4><p>Après le titre, 4 images donnent de vrais conseils. L'app n'arrive qu'à la 7e, une fois que le parent a déjà reçu quelque chose d'utile.</p><div class="shots wide">{JUNO}</div></article>
<article class="recipe"><header><span class="num">B</span><div><h3>En voix off, avec des images de chez toi</h3></div></header>
<p>Ta voix du début à la fin, sur des images de ta maison et de ton app. Tu filmes les vrais moments : la table pas mise, la chambre pas rangée, ton écran d'ordinateur. Une image toutes les 2 à 3 secondes.</p>
<div class="shots tall">{V("0 à 4 s","",'y_topempty0',"À filmer : la table pas mise, les assiettes encore empilées.")}{V("4 à 8 s","",'y_messy2',"À filmer : tu pousses la porte, la chambre en bazar.")}{V("8 à 14 s","",'y_desk2',"À filmer : ton écran le soir, ton projet ouvert, tes mains sur le clavier.")}{V("14 à 22 s","",'b_home',"À filmer : ton app, droite et nette.")}{V("22 à 28 s","",'b_valide',"À filmer : tu valides.")}{V("28 à 32 s","",'y_tableset4',"À filmer : la table mise, même cadre qu'au début.")}{V("32 à 40 s","",'b_jeu',"À filmer : le jeu, avec son vrai son. (Éventuellement, filme ton enfant en train de jouer, ou prends une photo, sans montrer sa tête.)")}</div>
<blockquote class="script"><b>Le texte à dire, à adapter :</b> « Tous les soirs, c'était pareil. La table n'était pas mise. La chambre n'était pas rangée. Et moi, je répétais. Un soir, j'ai ouvert mon ordinateur et j'ai commencé à créer un jeu pour mon fils. Une seule règle : pour jouer, il faut d'abord faire ses tâches. Il met la table, il me le signale, je vérifie. Et là, il part jouer. Ça s'appelle Family Quest. Je suis tout seul dessus, et je l'améliore encore chaque soir. »</blockquote>
<p class="note">Change tout ce qui n'est pas vrai chez toi. Une histoire vraie et imparfaite vaut mieux qu'une histoire bien écrite.</p></article>"""
R_EXTRA="""<section class="card"><h3>5 autres formats à essayer ensuite</h3>
<ul class="refs ideas">
<li><a href="https://www.instagram.com/reel/Dcaw3k-q2Os">Drifty : « POV : ce chat ne te laisse pas scroller »</a> <span>4,7 M de vues, 12 secondes.</span> Pour toi : « POV : ce dragon ne laisse pas ton fils jouer tant que la table n'est pas mise. » Ton dragon a toute sa place dans ce format.</li>
<li><a href="https://www.tiktok.com/@playmoshikids/video/6882642977194249474">Moshi : « Comment je couche mes enfants en 15 minutes »</a> <span>13,3 M de vues.</span> Une promesse en haut, 4 étapes, et l'app est l'étape 3. Pour toi : « Comment je fais mettre la table en un seul rappel. »</li>
<li><a href="https://www.instagram.com/reel/DekAPTxoHgJ/">Stella : « Commente LUCKY et je t'envoie l'app »</a> <span>8,9 M de vues.</span> Pour finir une vidéo sur Instagram : « Commente MISSION et je t'envoie le lien. » Il faut un outil de réponse automatique, comme ManyChat.</li>
<li><a href="https://www.instagram.com/reel/DH7MA6ZT20U/">StudyFetch : « Ma sœur vient de me montrer ce qu'elle utilise pour réviser »</a> <span>11,9 M de vues, 10 secondes.</span> Pour toi : « Ma collègue m'a montré ce qu'elle utilise pour que son fils range sa chambre. » Ici, le jeu peut servir d'accroche, parce que la phrase parle d'abord du problème du parent. À garder pour un test, une fois que tu as de très beaux plans du jeu.</li>
<li><a href="https://www.instagram.com/reel/DIAZ15_pbeL/">DAWG : « bro il y a 2 mois, bro maintenant »</a> <span>6,2 M de vues, 10 secondes, sans tournage.</span> Pour toi : un graphique façon jeu vidéo, « ton fils il y a 2 mois, ton fils maintenant », où Négocier passe de 100 à 3. À tester seulement si le ton te plaît.</li>
</ul></section>"""
def car(n,title,mod,idea,shots,extra='',wide=False,large=False):
    cl='shots '+('wide' if wide else 'large' if large else 'tall')
    return f"""<article class="recipe" id="carrousel-{n}"><header><span class="num">{n}</span><div><h3>{title}</h3></div></header>
{mod}<h4>Pour Family Quest</h4><p>{idea}</p><div class="{cl}">{''.join(shots)}</div>{extra}</article>"""
def modelc(imgs,txt,refs):
    return model(imgs,txt,refs).replace('La vidéo qui marche','Le carrousel qui marche')
C=[]
def ser(x,pos='bot',w=False): return f'<div class="sl ser {pos}{" ww" if w else ""}">{x}</div>'
def le(x): return f'<div class="sl le">{x}</div>'
def le2(n,d): return f'<div class="sl le"><i>{n}</i>{d}</div>'
def tip(h,d): return f'<div class="sl tip"><b>{h}</b>{d}</div>'
def blk(x): return f'<div class="sl blk"><span>{x}</span></div>'
def neon(ti,ls=(),col='#ff5a5f',one=False):
    r=''.join(f'<p>{l}</p>' for l in ls)
    return f'<div class="sl neon{" one" if one else ""}" style="--c:{col}"><b>{ti}</b>{r}</div>'
Y=lambda k:'y_'+k
C=[]
C.append(car(1,"« Il dit que c'est rangé. On vérifie. »",
 modelc(['k_y1','k_y2','k_y3'],"« On scanne des produits pour cheveux avec Yuka. » Une photo du produit en main, puis la note de l'app, puis le produit suivant. Le texte est petit, noir, écrit avec une police à empattements, sans fond, et pose juste une réaction de quelques mots.",[
  ("Les produits de chez Target notés par Yuka","1,2 M de vues, 81 000 likes, 19 images","https://www.tiktok.com/@victoria.icurn/photo/7312648488989330731")]),
 "Même alternance : une photo de ce qu'il appelle « fait », puis ton vrai écran avec le verdict. Le parent veut voir le verdict suivant.",[
 slide("Image 1",ser("il dit que c'est rangé.<br>on vérifie.",'top',True),Y('messy4')),
 slide("Image 2",ser("le lit. « il est fait, je te jure »"),Y('bed1')),
 slide("Image 3",ser("à refaire.",'bot',True),'b_valide'),
 slide("Image 4",ser("le sac d'école. il manque la moitié",'low'),Y('bag0')),
 slide("Image 5",ser("à refaire aussi.",'bot',True),'b_valide'),
 slide("Image 6",ser("la table. pas mal",'top'),Y('tableset2')),
 slide("Image 7",ser("validé, +10 min",'low',True),'b_home'),
],wide=True))
C.append(car(2,"« 4 applis que tous les parents devraient avoir »",
 modelc(['k_l1','k_l2','k_l3'],"Des photos en format large et plutôt sombres. Le texte est blanc, simple et centré, sans fond : le nom de l'appli en petit, sa phrase juste en dessous. L'app qui fait sa promotion (Albo) arrive en 2e, au milieu des autres.",[
  ("« 4 apps qui te rendent productive »","1,4 M de vues, 218 900 likes, 133 785 enregistrements, 5 images","https://www.tiktok.com/@leah.internet.hoarder/photo/7658784851738234134"),
  ("La même liste en captures de l'App Store","401 300 vues, 38 100 likes, 31 148 enregistrements","https://www.tiktok.com/@chlo20578/photo/7538237948861353224")]),
 "Mets Family Quest en 2e, pas en dernier, sinon on voit que la liste est faite pour elle. Prends des applis que tu utilises vraiment.",[
 slide("Image 1",le("4 applis que tous les parents devraient avoir"),Y('morning2'),'r43'),
 slide("Image 2",le2("family quest","ton enfant fait ses tâches pour gagner son temps de jeu, sans que tu répètes"),'b_home','r43'),
 slide("Image 3",le2("timetree","le calendrier de toute la famille, sur le téléphone de chacun"),Y('walcal5'),'r43'),
 slide("Image 4",le2("bring!","la liste de courses que tout le monde voit et complète"),Y('list1'),'r43'),
 slide("Image 5",le2("family link","pour garder un œil sur le temps d'écran"),Y('kidphone5'),'r43'),
],large=True))
C.append(car(3,"« Comment arrêter de répéter 10 fois la même chose »",
 modelc(['k_m1','k_m2','k_m3'],"Même créatrice, même style. Le titre est centré, puis chaque conseil a une ligne plus grande et un petit texte aligné à gauche. Sur la dernière image, le texte passe dans des boîtes noires, posées sur l'écran de l'app.",[
  ("« Comment avoir vraiment une vie calme »","1,2 M de vues, 251 300 likes, 67 578 enregistrements, 5 images","https://www.tiktok.com/@leah.internet.hoarder/photo/7635413210757221635")]),
 "Trois conseils qu'un parent peut appliquer ce soir, même sans ton app. La dernière image montre que ton app le fait pour lui.",[
 slide("Image 1",le("comment arrêter de répéter 10 fois la même chose"),Y('morning2'),'r43'),
 slide("Image 2",tip("1. une seule consigne à la fois","pas « range ta chambre et mets la table », juste « mets la table »"),Y('topset5'),'r43'),
 slide("Image 3",tip("2. d'abord la tâche, ensuite le jeu","la règle ne change jamais, même le week-end"),Y('phoneface1'),'r43'),
 slide("Image 4",tip("3. tu vérifies une seule fois","c'est fait ou c'est à refaire, sans discuter"),Y('tidy1'),'r43'),
 slide("Image 5",blk("j'ai aussi créé une appli qui fait tout ça, Family Quest. ça m'a vraiment changé les soirs"),'b_home','r43'),
],large=True))
C.append(car(4,"« pov : tes enfants font leurs tâches sans que tu répètes »",
 modelc(['k_e1','k_e2','k_e3'],"Une photo par moment de la journée. Le texte est dans de petites boîtes blanches qui épousent chaque ligne : un mot en haut, de petites notes posées autour de l'objet. L'écran de l'app arrive à la fin.",[
  ("« pov : tu as commencé à manger sain »","617 400 vues, 67 600 likes, 26 855 enregistrements, 6 images","https://www.tiktok.com/@jess.healthyeating/photo/7543364770133560607")]),
 "Une journée à la maison, avec le temps de jeu gagné écrit dessus. Tu n'as qu'à prendre une photo à chaque tâche.",[
 slide("Image 1",box("pov : tes enfants font leurs tâches sans que tu répètes",'mid')+box("(et sans crier)",'midsub'),Y('morning2'),'r45'),
 slide("Image 2",box("matin",'topc')+box("lit fait :<br>+ 5 min de jeu",'note nl'),Y('tidy1'),'r45'),
 slide("Image 3",box("midi",'topc')+box("table mise :<br>+ 10 min de jeu",'note nr'),Y('tableset4'),'r45'),
 slide("Image 4",box("après l'école",'topc')+box("sac prêt :<br>+ 5 min de jeu",'note nl'),Y('bag1'),'r45'),
 slide("Image 5",box("soir",'topc')+box("dents brossées :<br>+ 5 min de jeu",'note nr'),Y('tooth2'),'r45'),
 slide("Image 6",box("25 min de jeu gagnées,<br>et zéro rappel",'note nr'),'b_home','r45'),
],wide=True))
C.append(car(5,"« Personne ne fait ce comparatif honnêtement »",
 modelc(['k_v1','k_v2','k_v3'],"En français. Le texte est centré, avec une couleur différente par appli et un contour clair, sur le même fond tout au long. Les coches et les croix commencent chaque ligne. Sa propre app arrive en dernier, et la légende demande : « T'utilises quoi, toi ? »",[
  ("Le comparatif des applis de suivi de règles","389 000 vues, 17 100 likes, 5 images","https://www.tiktok.com/@venora177/photo/7670625073778150688")]),
 "Tu compares des méthodes, pas des marques. Les parents ont tous essayé les premières, et ils le disent en commentaire. Garde une vraie croix pour ton app : c'est ce qui rend le comparatif crédible.",[
 slide("Image 1",neon("Je teste et je note les méthodes pour faire ranger les enfants !",col='#ff9f0a',one=True),Y('bed1'),'r916'),
 slide("Image 2",neon("Répéter 10 fois :",["✅ C'est gratuit","❌ Tu t'épuises","❌ Ça recommence demain"],'#ff6fa8'),Y('bed1'),'r916'),
 slide("Image 3",neon("Le tableau sur le frigo :",["✅ C'est simple","❌ Oublié après 2 semaines"],'#ff9f0a'),Y('bed1'),'r916'),
 slide("Image 4",neon("L'argent de poche :",["✅ Il apprend","❌ Chaque tâche se négocie"],'#ff5a5f'),Y('bed1'),'r916'),
 slide("Image 5",neon("Family Quest :",["✅ Il veut jouer, alors il le fait","✅ Tu valides en un geste","❌ Il faut installer une appli"],'#4da3ff'),Y('bed1'),'r916'),
]))
CAROUSELS=''.join(C)

def gridimgs(names):
    return '<div class="grid">'+''.join(f'<img src="img/{n}.jpg" alt="" loading="lazy">' for n in names)+'</div>'
def pair(l,r):
    return f'<div class="pair"><figure><figcaption>{l[0]}</figcaption>{l[1]}</figure></div>'

html=open('tpl.html',encoding='utf-8').read().replace('%%RECIPES%%','\n'.join(R)+R_EXTRA).replace('%%CAROUSELS%%',CAROUSELS).replace('%%FOUNDER%%',FOUNDER)
for k,v in {'%%G1%%':gridimgs(['s1','s2','s3','s4','s5','s6','s7','s8']),'%%G2%%':gridimgs(['k1b','k2','k3','h1']),'%%G3%%':gridimgs(['p_flou','p_doigt']),'%%G4%%':gridimgs(['ia1','ia2','ia3','ia4']),'%%G5%%':gridimgs(['d1','d2','d3','d4']),'%%G6%%':gridimgs(['k2','h1','h2','h3'])}.items(): html=html.replace(k,v)
open('web/index.html','w',encoding='utf-8').write(html)
