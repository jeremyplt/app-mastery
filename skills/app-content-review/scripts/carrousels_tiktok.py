# Lit images et chiffres de carrousels TikTok. Usage : python3 -I carrousels_tiktok.py <url> <url>... À lancer depuis le scratchpad : écrit car/ dans le dossier courant.
import re,json,sys,subprocess,os
U=sys.argv[1:]
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
for i,u in enumerate(U):
    n=f'car/c{i+1:02d}';os.makedirs(n,exist_ok=True)
    h=subprocess.run(['curl','-sL','--max-time','25','-A',UA,u.replace('/photo/','/video/')],capture_output=True,text=True).stdout
    m=re.search(r'__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>(.*?)</script>',h,re.S)
    if not m: print(i+1,'noscript',len(h),u);continue
    d=json.loads(m.group(1))
    it=d.get('__DEFAULT_SCOPE__',{}).get('webapp.video-detail',{}).get('itemInfo',{}).get('itemStruct',{})
    ims=it.get('imagePost',{}).get('images',[])
    st=it.get('stats',{})
    print(i+1,u.split('/')[3],'slides',len(ims),'vues',st.get('playCount'),'likes',st.get('diggCount'),'sauv',st.get('collectCount'),'| ',(it.get('desc') or '')[:150])
    for k,im in enumerate(ims[:10]):
        url=(im.get('imageURL',{}).get('urlList') or [None])[0]
        if url: subprocess.run(['curl','-sL','--max-time','20','-A',UA,'-o',f'{n}/s{k+1:02d}.img',url])
