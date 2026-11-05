# Classe tous les liens de ~/Desktop/contenu-ugc-*.md par vues. À lancer depuis le scratchpad : écrit rows.json dans le dossier courant.
import re,glob,os,json
rows=[]
url=re.compile(r'https://www\.(?:tiktok|instagram)\.com/[^\s\)\]"]+')
def num(s,unit):
    s=s.replace(' ','').replace(' ','').replace('\xa0','').replace(',','.')
    try:v=float(s)
    except: return 0
    u=(unit or '').strip().lower()
    return v*{'m':1e6,'k':1e3}.get(u,1)
for f in glob.glob(os.path.expanduser('~/Desktop/contenu-ugc-*.md')):
    lines=open(f,encoding='utf-8').read().split('\n')
    for i,l in enumerate(lines):
        for u in url.findall(l):
            ctx=l
            if l.strip().startswith('- http') and i+1<len(lines): ctx=lines[i+1]
            ctx=url.sub('',ctx)
            v=0
            m=re.findall(r'([\d][\d  \xa0.,]*)\s*(M|K)?\s*(?:de )?vues',ctx)
            if m: v=max(num(a,b) for a,b in m)
            lk=0
            m=re.findall(r'([\d][\d  \xa0.,]*)\s*(M|K)?\s*likes',ctx)
            if m: lk=max(num(a,b) for a,b in m)
            rows.append(dict(v=v,l=lk,u=u,c=ctx.strip()[:210],f=os.path.basename(f)[13:-3]))
seen=set();R=[]
for r in rows:
    if r['u'] in seen: continue
    seen.add(r['u']);R.append(r)
json.dump(R,open('rows.json','w'),ensure_ascii=False)
print(len(R))
R.sort(key=lambda r:(r['v'] or r['l']*12),reverse=True)
for r in R[:90]:
    print(f"{int(r['v']/1000):>6}k {int(r['l']/1000):>5}kL [{r['f'][:12]}] {r['c'][:170]} || {r['u'][-55:]}")
