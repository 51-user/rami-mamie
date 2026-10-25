/* V3, étape 4 : les saisons, la fête de fin de saison et le grand monument (CONCEPTION-V3.md, sections 3 et 4).
   Se branche sur village.html sans le modifier : enveloppe de rendu(), délégation data-s-* sur document.
   État : S.saison et S.monument seulement. Tout est dans un try : si ce fichier plante, le village tourne quand même. */
try{(function(){
  if(typeof S==='undefined'||typeof rendu!=='function')return;

  /* ===================== Les saisons : une semaine réelle chacune ===================== */
  const SAISONS=[
    {id:'printemps',nom:'le printemps',titre:'Printemps',e:'🌸',sol:['#A6D884','#C4ECA8','#86AE66','#8CC46E'],fond:['#E6F4D8','#FBEFF4'],teinte:['#F7C6D9',.07],
     commande:{legumes:30,bois:20,oeufs:10},plus:{fleurs:10},deco:{nom:'Cerisier en fleurs',e:'🌸'}},
    {id:'ete',nom:"l'été",titre:'Été',e:'🌻',sol:['#B7D46A','#D2EA8C','#94AB58','#9CB858'],fond:['#F3EFC2','#FFF8E0'],teinte:['#FFE27A',.08],
     commande:{legumes:40,bois:15,oeufs:10},plus:{fruits:15},deco:{nom:"Tournesols de l'été",e:'🌻'}},
    {id:'automne',nom:"l'automne",titre:'Automne',e:'🍂',sol:['#C6B66A','#DDCD8C','#A09055','#AE9C58'],fond:['#F1DDBF','#FBF0E2'],teinte:['#E0892E',.09],
     commande:{legumes:25,bois:30,oeufs:10},plus:{farine:10},deco:{nom:"Citrouilles d'automne",e:'🎃'}},
    {id:'hiver',nom:"l'hiver",titre:'Hiver',e:'❄️',sol:['#E4ECEF','#CDE9FA','#B9C6CC','#C7D3D9'],fond:['#DCE8F2','#F6F9FC'],teinte:['#BFD9F2',.12],
     commande:{legumes:20,bois:30,oeufs:15},plus:{pain:10},deco:{nom:'Bonhomme de neige',e:'⛄'}}];
  const JOUR=864e5, REF=new Date(2026,0,5);                  // un lundi : les semaines partent de là, à minuit (heure de la tablette)
  const maintenant=()=>window.__dateSaison?new Date(window.__dateSaison):new Date();   // __dateSaison : pour l'essai seulement
  function semaineDe(d){const m=new Date(d.getFullYear(),d.getMonth(),d.getDate());return Math.floor(Math.round((m-REF)/JOUR)/7)}
  const saisonDe=w=>SAISONS[(((w+1)%4)+4)%4];                // la semaine du 19/10/2026 est l'automne
  const resOk=k=>typeof RES!=='undefined'&&RES[k];
  const epN=()=>{const ids=['hameau','village','bourg','ville'];return Math.max(0,ids.indexOf(S&&S.epoque||'hameau'))};
  const deLa=Sa=>({printemps:'du printemps',ete:"de l'été",automne:"d'automne",hiver:"de l'hiver"})[Sa.id];
  const txtR=c=>Object.entries(c).filter(([k])=>resOk(k)).map(([k,v])=>v+' '+RES[k].e).join(' + ');

  /* L'état : S.saison = {semaine, commande, verse, finie, decos:{printemps:1,…}} ; S.monument = {niveau, verse} */
  function nouvelleFete(w){const Sa=saisonDe(w),c=Object.assign({},Sa.commande);
    if(epN()>=1)Object.entries(Sa.plus).forEach(([k,v])=>{if(resOk(k))c[k]=v});
    return {semaine:w,commande:c,verse:{},finie:false}}
  function verifier(){
    if(!S)return false;
    if(!S.monument||typeof S.monument!=='object')S.monument={niveau:0,verse:{}};
    if(!S.monument.verse)S.monument.verse={};
    const w=semaineDe(maintenant());
    if(!S.saison||typeof S.saison!=='object'){S.saison=Object.assign(nouvelleFete(w),{decos:{}});return true}
    if(!S.saison.decos)S.saison.decos={};
    if(S.saison.semaine===w)return false;
    // la semaine a tourné : une fête pas finie rend tout ce qu'on y avait versé — rien ne se perd
    let rendu_=[];
    if(!S.saison.finie)Object.entries(S.saison.verse||{}).forEach(([k,v])=>{if(v>0){S.stock[k]=(S.stock[k]||0)+v;rendu_.push(v+' '+(resOk(k)?RES[k].e:k))}});
    const ancienne=saisonDe(S.saison.semaine);
    Object.assign(S.saison,nouvelleFete(w));
    const Sa=saisonDe(w);
    try{message=`${Sa.e} Voici ${Sa.nom} !`+(epN()>=1?' Une nouvelle fête se prépare au village.':'')+(rendu_.length?` Ce que vous aviez donné pour la fête ${deLa(ancienne)} est revenu dans vos réserves : ${rendu_.join(', ')}.`:'')}catch{}
    return true;
  }

  /* ===================== Le grand monument : 10 niveaux, +5 % de production chacun ===================== */
  const NIV_MAX=10;
  const coutNiveau=n=>Object.assign({legumes:15+10*n,bois:15+10*n,oeufs:5+5*n},RES.pierre?{pierre:5+5*n}:{});   // 25/10 : la pierre sert aussi au monument   // n = niveau actuel (0 à 9)
  const majBonus=()=>{window.BONUS_MONUMENT=Math.round(5*((S&&S.monument&&S.monument.niveau)||0))/100};

  /* ===================== Verser : seulement quand elle le décide ===================== */
  const reste=(but,verse,k)=>Math.max(0,(but[k]||0)-(verse[k]||0));
  function cible(q){
    if(q==='fete'){if(S.saison.finie)return null;return {but:S.saison.commande,verse:S.saison.verse}}
    if(S.monument.niveau>=NIV_MAX)return null;return {but:coutNiveau(S.monument.niveau),verse:S.monument.verse}}
  function verser(q,k,n){const c=cible(q);if(!c)return 0;
    const m=Math.min(n,reste(c.but,c.verse,k),S.stock[k]||0);if(m<=0)return 0;
    S.stock[k]-=m;c.verse[k]=(c.verse[k]||0)+m;return m}
  const complet=c=>Object.keys(c.but).every(k=>reste(c.but,c.verse,k)===0);
  function apresVerse(q,total){
    if(!total){try{SON.non()}catch{}return}
    try{SON.ramasse()}catch{}
    const c=cible(q);
    if(c&&complet(c)){
      if(q==='fete')finirFete();else monterMonument();
    }
    sauve();rendu();montreFeuille();
    try{const b=document.querySelector('#s-feuille .s-jauge');if(b){const r=b.getBoundingClientRect();etincelles(r.left+r.width/2,r.top+r.height/2)}}catch{}
  }
  let celebre=null;
  function finirFete(){const Sa=saisonDe(S.saison.semaine);S.saison.finie=true;
    const deja=S.saison.decos[Sa.id]||0;S.saison.decos[Sa.id]=deja+1;S.stock.etoiles=(S.stock.etoiles||0)+10;
    if(deja)S.stock.pieces=(S.stock.pieces||0)+150;
    celebre={titre:`La fête ${deLa(Sa)} est réussie !`,e:Sa.deco.e,
      texte:deja?`Tout le village a fait la fête. Votre ${Sa.deco.nom.toLowerCase()} brille un peu plus, et vous recevez 10 ⭐ et 150 🪙.`
        :`Tout le village a fait la fête. En cadeau : ${Sa.deco.nom}, sur la place du village, et 10 ⭐.`}}
  function monterMonument(){S.monument.niveau++;S.monument.verse={};majBonus();
    celebre={titre:`Le monument passe au niveau ${S.monument.niveau} !`,e:'🏛️',
      texte:S.monument.niveau>=NIV_MAX?'Il est terminé : le plus beau monument de la région. Tout le village produit 50 % de plus, pour toujours.'
        :`Tout le village produit maintenant ${S.monument.niveau*5} % de plus, pour toujours.`}}

  /* ===================== Dessins ===================== */
  function dessinMonument(n){
    const [cx,c0]=P(PLACE.i+.85,PLACE.j+.85),cy=c0+2;let h=`<ellipse cx="${cx}" cy="${cy}" rx="38" ry="15" fill="#00000022"/>`;
    if(n<=0){// le chantier : des pierres et un panneau
      h+=`<ellipse cx="${cx-14}" cy="${cy-4}" rx="12" ry="7" fill="#B9B2A3" stroke="#7E776A"/><ellipse cx="${cx+10}" cy="${cy-2}" rx="14" ry="8" fill="#C9C2B2" stroke="#7E776A"/><ellipse cx="${cx-2}" cy="${cy-11}" rx="11" ry="6" fill="#D6CFBF" stroke="#7E776A"/>
        <rect x="${cx+22}" y="${cy-40}" width="4" height="34" fill="#6D4C41"/><rect x="${cx+8}" y="${cy-52}" width="34" height="20" rx="4" fill="#FFF3D6" stroke="#8A6A3E" stroke-width="2"/><text x="${cx+25}" y="${cy-37}" font-size="14" text-anchor="middle">🏛️</text>`;
      return {h,top:cy-56}}
    const etages=Math.min(n,6);let y=cy;
    for(let k=0;k<etages;k++){const w=66-k*7,ht=13;y-=ht;
      h+=`<rect x="${cx-w/2}" y="${y}" width="${w}" height="${ht}" rx="2" fill="${k%2?'#CFC6B2':'#E2DACA'}" stroke="#8E8470"/>`}
    h+=`<ellipse cx="${cx}" cy="${y}" rx="${(66-(etages-1)*7)/2}" ry="5" fill="#EEE8DA" stroke="#8E8470"/>`;
    if(n>=7){const w=66-(etages-1)*7-12;   // colonnes et fronton
      [-w/2+4,-w/6,w/6,w/2-4].forEach(d=>h+=`<rect x="${cx+d-2.5}" y="${y-26}" width="5" height="26" fill="#FFFFFF" stroke="#8E8470"/>`);
      y-=26;h+=`<polygon points="${cx-w/2-4},${y} ${cx},${y-14} ${cx+w/2+4},${y}" fill="#E2DACA" stroke="#8E8470"/>`;y-=14}
    if(n>=8)[-30,30].forEach(d=>h+=`<rect x="${cx+d-1.5}" y="${cy-62}" width="3" height="50" fill="#6D4C41"/><polygon points="${cx+d+1.5},${cy-62} ${cx+d+(d<0?-18:20)},${cy-56} ${cx+d+1.5},${cy-50}" fill="${d<0?'#E53935':'#1E88E5'}"/>`);
    if(n>=9){h+=`<path d="M${cx-11},${y} A11,11 0 0 1 ${cx+11},${y} Z" fill="#F0C04A" stroke="#C99A22"/>`;y-=11}
    if(n>=NIV_MAX){h+=`<g class="brille" style="transform-box:fill-box"><text x="${cx}" y="${y-2}" font-size="24" text-anchor="middle">⭐</text></g>`;y-=24}
    else if(n<7){h+=`<polygon points="${cx-6},${y} ${cx},${y-22+(n<4?6:0)} ${cx+6},${y}" fill="#D6CFBF" stroke="#8E8470"/>`;y-=22}
    return {h,top:y}}
  const DECOS={
    printemps:(x,y)=>`<rect x="${x-2}" y="${y-18}" width="4" height="18" fill="#7A4E2D"/>${[[-8,-22],[7,-24],[0,-31],[-4,-17],[6,-15]].map(([a,b])=>`<circle cx="${x+a}" cy="${y+b}" r="8" fill="#F8BBD0" stroke="#E91E63" stroke-width=".6"/>`).join('')}`,
    ete:(x,y)=>[-7,0,7].map((a,k)=>`<rect x="${x+a-1}" y="${y-24+k%2*5}" width="2" height="${24-k%2*5}" fill="#558B2F"/><circle cx="${x+a}" cy="${y-26+k%2*5}" r="6" fill="#FDD835" stroke="#F9A825"/><circle cx="${x+a}" cy="${y-26+k%2*5}" r="2.4" fill="#6D4C41"/>`).join(''),
    automne:(x,y)=>`<ellipse cx="${x-7}" cy="${y-6}" rx="9" ry="7" fill="#EF6C00" stroke="#BF360C"/><ellipse cx="${x+7}" cy="${y-4}" rx="7" ry="5.5" fill="#FB8C00" stroke="#BF360C"/><rect x="${x-8}" y="${y-15}" width="2.5" height="4" fill="#558B2F"/>`,
    hiver:(x,y)=>`<circle cx="${x}" cy="${y-8}" r="9" fill="#FFFFFF" stroke="#90A4AE"/><circle cx="${x}" cy="${y-22}" r="6.5" fill="#FFFFFF" stroke="#90A4AE"/><polygon points="${x},${y-22} ${x+7},${y-21} ${x},${y-20}" fill="#FB8C00"/><rect x="${x-6}" y="${y-32}" width="12" height="4" fill="#37474F"/><rect x="${x-4}" y="${y-38}" width="8" height="7" fill="#37474F"/>`};
  const COINS={printemps:[PLACE.i+.3,PLACE.j+1.75],ete:[PLACE.i+1.75,PLACE.j+.3],automne:[PLACE.i+.95,PLACE.j+1.85],hiver:[PLACE.i+1.85,PLACE.j+.95]};

  /* ===================== La couche par-dessus le village ===================== */
  const css=document.createElement('style');css.textContent=`
    body.s-on:not(.nuit){background:linear-gradient(180deg,var(--s-f1),var(--s-f2)) fixed}
    #s-part{position:fixed;inset:0;pointer-events:none;z-index:4;overflow:hidden}
    #s-part i{position:absolute;top:-30px;display:block;animation:s-tombe linear infinite;opacity:.85}
    #s-part .petale{width:10px;height:7px;border-radius:60% 0 60% 0;background:#F8BBD0}
    #s-part .neige{width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 3px #9fb8c8}
    #s-part .feuille-a{font-style:normal;font-size:20px}
    @keyframes s-tombe{0%{transform:translate(0,0) rotate(0)}50%{transform:translate(var(--s-dx),52vh) rotate(180deg)}100%{transform:translate(0,108vh) rotate(360deg)}}
    @media (prefers-reduced-motion:reduce){#s-part{display:none}}
    .s-bandeau{background:var(--paper);border:3px solid var(--s-bord);border-radius:18px;padding:8px 12px;display:flex;flex-direction:column;gap:8px}
    .s-bandeau .s-titre{font-family:var(--f-display);font-size:23px;font-weight:700;display:flex;align-items:center;gap:8px;white-space:nowrap}
    .s-bandeau .s-titre small{font-family:var(--f-body);font-weight:400;font-size:16px;color:var(--ink-dim)}
    @media (max-width:900px){.s-bandeau{flex-direction:row;flex-wrap:wrap;align-items:center}.s-bandeau .s-titre{flex-basis:100%}.s-bouton{flex:1;min-width:240px}}
    .s-bouton{min-height:60px;font-size:21px;font-weight:700;border-radius:16px;border:0;background:var(--gold);color:var(--gold-ink);box-shadow:0 4px 0 var(--gold-deep);display:flex;align-items:center;gap:10px;padding:6px 14px;text-align:left}
    .s-bouton.alt{background:#fff;box-shadow:0 4px 0 #B8B09C;border:2px solid var(--line)}
    .s-bouton:active{transform:translateY(3px);box-shadow:0 1px 0 var(--gold-deep)}
    .s-bouton .e{font-size:30px}
    .s-bouton small{display:block;font-weight:400;font-size:17px;color:var(--ink-dim)}
    .s-ligne{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--line);flex-wrap:wrap}
    .s-ligne .nom{flex:1;min-width:200px;font-size:22px}
    .s-ligne .nom b{font-size:24px}
    .s-ligne button{font-size:20px;font-weight:700;min-height:60px;min-width:120px;padding:0 16px;border-radius:14px;border:2px solid var(--gold-deep);background:var(--gold)}
    .s-ligne button[disabled]{opacity:.4}
    .s-jauge{height:30px;border-radius:999px;background:#EFE7D3;border:2px solid var(--line);overflow:hidden;margin:6px 0 4px}
    .s-jauge div{height:100%;background:linear-gradient(90deg,#9CCC65,#7BB661);transition:width .5s}
    .s-feuille-monu{display:flex;gap:18px;align-items:flex-end;flex-wrap:wrap}
    .s-feuille-monu svg{width:150px;height:170px;flex:none}
    #s-feuille .voile{z-index:7}`;
  document.head.appendChild(css);
  const part=document.createElement('div');part.id='s-part';part.setAttribute('aria-hidden','true');document.body.appendChild(part);
  const boite=document.createElement('div');boite.id='s-feuille';document.body.appendChild(boite);
  let partSaison=null;
  function particules(Sa){if(partSaison===Sa.id)return;partSaison=Sa.id;let h='';
    const n=Sa.id==='hiver'?22:Sa.id==='ete'?0:14;
    for(let k=0;k<n;k++){const g=(k*37)%100,d=9+(k*7)%8,r=-((k*53)%160)/10,dx=((k%2?1:-1)*(20+(k*11)%50))+'px';
      const cl=Sa.id==='hiver'?'neige':Sa.id==='automne'?'feuille-a':'petale';
      h+=`<i class="${cl}" style="left:${g}vw;animation-duration:${d}s;animation-delay:${r}s;--s-dx:${dx}">${Sa.id==='automne'?(k%3?'🍂':'🍁'):''}</i>`}
    // en été : quelques papillons qui passent doucement
    if(Sa.id==='ete')for(let k=0;k<5;k++)h+=`<i class="feuille-a" style="left:${10+k*19}vw;animation-duration:${18+k*3}s;animation-delay:${-k*4}s;--s-dx:${k%2?60:-60}px;font-size:18px">🦋</i>`;
    part.innerHTML=h}

  function couche(){
    if(!S)return;
    verifier();majBonus();
    const Sa=saisonDe(S.saison.semaine),svg=document.querySelector('#app .carte svg');
    document.body.classList.add('s-on');
    document.body.style.setProperty('--s-f1',Sa.fond[0]);document.body.style.setProperty('--s-f2',Sa.fond[1]);
    document.body.style.setProperty('--s-bord',{printemps:'#F48FB1',ete:'#F0C04A',automne:'#E0892E',hiver:'#90CAF9'}[Sa.id]);
    particules(Sa);
    if(svg){
      // le sol prend la couleur de la saison
      const [herbe,vise,achat,trait]=Sa.sol;
      svg.querySelectorAll('polygon[data-c]').forEach(p=>{const f=p.getAttribute('fill');p.setAttribute('fill',f==='#B9E59A'?vise:herbe);p.setAttribute('stroke',trait)});
      svg.querySelectorAll('polygon[data-x]').forEach(p=>p.setAttribute('fill',achat));
      // les décos de saison gagnées, aux coins de la place, puis le monument
      let h='';SAISONS.forEach(s=>{if(S.saison.decos[s.id]){const [x,y]=P(...COINS[s.id]);h+=`<g style="pointer-events:none">${DECOS[s.id](x,y)}</g>`}});
      const m=dessinMonument(S.monument.niveau),[mx,my]=P(PLACE.i+.85,PLACE.j+.85);
      h+=`<g data-s-ouvre="monument" style="${mode?'pointer-events:none;opacity:.5':'cursor:pointer'}" aria-label="Le grand monument">${m.h}
        <circle cx="${mx+42}" cy="${my-8}" r="13" fill="#FFF9E8" stroke="#8A6A3E" stroke-width="2"/><text x="${mx+42}" y="${my-2}" font-size="15" font-weight="700" text-anchor="middle" fill="#5A4630">${S.monument.niveau}</text></g>`;
      const vb=svg.viewBox.baseVal;
      h+=`<rect x="${vb.x}" y="${vb.y}" width="${vb.width}" height="${vb.height}" fill="${Sa.teinte[0]}" opacity="${Sa.teinte[1]}" pointer-events="none"/>`;
      // juste après les bâtiments (avant le voile de nuit s'il existe)
      const nuitR=[...svg.children].find(e=>e.tagName==='rect'&&e.getAttribute('fill')==='#1A2A55');
      const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.innerHTML=h;
      [...g.childNodes].forEach(c=>svg.insertBefore(c,nuitR||null));
    }
    // le bandeau de la saison, en tête de la colonne
    const cote=document.querySelector('#app .cote');
    if(cote&&!cote.querySelector('.s-bandeau')){
      const f=S.saison,fb=Object.values(f.commande).reduce((a,b)=>a+b,0),fv=Object.values(f.verse).reduce((a,b)=>a+b,0);
      const d=document.createElement('div');d.className='s-bandeau';
      d.innerHTML=`<div class="s-titre"><span style="font-size:32px">${Sa.e}</span>${Sa.titre}<small>jusqu'à dimanche</small></div>
        <button class="s-bouton" data-s-ouvre="fete"><span class="e">🎉</span><span>${f.finie?'La fête est réussie !':'La fête de la saison'}<small>${f.finie?Sa.deco.e+' '+Sa.deco.nom:fv+' sur '+fb+' produits'}</small></span></button>
        <button class="s-bouton alt" data-s-ouvre="monument"><span class="e">🏛️</span><span>Le grand monument<small>${S.monument.niveau>=NIV_MAX?'terminé · +50 %':'niveau '+S.monument.niveau+' sur 10 · +'+S.monument.niveau*5+' %'}</small></span></button>`;
      cote.insertBefore(d,cote.firstChild);
    }
  }

  /* ===================== Les feuilles : la fête, le monument, la célébration ===================== */
  let ouvert=null;
  function lignes(q,c){
    return Object.keys(c.but).filter(resOk).map(k=>{const r=reste(c.but,c.verse,k),a=S.stock[k]||0,n5=Math.min(5,r,a),nt=Math.min(r,a);
      return `<div class="s-ligne"><span class="nom">${RES[k].e} ${RES[k].nom} : <b>${(c.verse[k]||0)} / ${c.but[k]}</b>${r?`<br><small>vous en avez ${a}</small>`:' ✅'}</span>
        ${r?`<button data-s-verse="${q}:${k}:5" ${n5?'':'disabled'}>Donner ${n5||5}</button><button data-s-verse="${q}:${k}:${nt}" ${nt>n5?'':'disabled'}>Donner ${nt>n5?nt:'tout'}</button>`:''}</div>`}).join('')}
  function jauge(c){const b=Object.values(c.but).reduce((x,y)=>x+y,0),v=Object.keys(c.but).reduce((x,k)=>x+Math.min(c.verse[k]||0,c.but[k]),0);
    return `<div class="s-jauge"><div style="width:${b?Math.round(100*v/b):100}%"></div></div><p class="sous" style="margin:0 0 6px">${v} sur ${b}</p>`}
  const peutTout=(q,c)=>Object.keys(c.but).some(k=>Math.min(reste(c.but,c.verse,k),S.stock[k]||0)>0);
  function feuilleHTML(){
    if(celebre){const x=celebre;return `<div class="voile" data-s-ok style="align-items:center;background:rgba(255,236,170,.92);z-index:9"><div style="text-align:center;padding:24px;max-width:700px">
      <div style="font-size:90px;line-height:1">${x.e}</div><h1 style="font-size:42px;margin:12px 0">${x.titre}</h1><p style="font-size:26px">${x.texte}</p>
      <button class="big" data-s-ok style="max-width:420px;margin:18px auto 0">Merci !</button></div></div>`}
    if(ouvert==='fete'){const Sa=saisonDe(S.saison.semaine),f=S.saison;
      const corps=f.finie?`<p style="font-size:24px">🎉 La fête de la saison est réussie. ${Sa.deco.e} <b>${Sa.deco.nom}</b> décore la place du village.</p><p class="sous">Une nouvelle fête viendra avec la saison suivante, lundi.</p>`
        :`<p class="sous">Tout le village prépare la fête ${deLa(Sa)}. Donnez petit à petit, quand vous voulez : la fête reste ouverte toute la semaine et rien de ce que vous donnez n'est perdu.</p>
          <p style="font-size:21px;margin:4px 0">En cadeau : ${Sa.deco.e} <b>${Sa.deco.nom}</b>${f.decos&&f.decos[Sa.id]?' (il brillera un peu plus) et 150 🪙':''}, et 10 ⭐.</p>
          ${jauge({but:f.commande,verse:f.verse})}${lignes('fete',{but:f.commande,verse:f.verse})}
          <div class="actions"><button class="big" data-s-tout="fete" ${peutTout('fete',{but:f.commande,verse:f.verse})?'':'disabled'}><span class="e">🎁</span>Donner tout ce que je peux</button></div>`;
      return feuille_(`${Sa.e} La fête ${deLa(Sa)}`,corps)}
    if(ouvert==='monument'){const n=S.monument.niveau,m=dessinMonument(n);
      const svg=`<svg viewBox="${P(PLACE.i+.85,PLACE.j+.85)[0]-75} ${P(PLACE.i+.85,PLACE.j+.85)[1]-150} 150 170" aria-hidden="true">${m.h}</svg>`;
      let corps=`<div class="s-feuille-monu">${svg}<div style="flex:1;min-width:240px"><p style="font-size:24px;margin:0 0 6px"><b>Niveau ${n} sur 10</b></p>
        <p class="sous">Chaque niveau fait produire tout le village 5 % de plus, pour toujours. Maintenant : <b>+${n*5} %</b>.</p></div></div>`;
      if(n>=NIV_MAX)corps+=`<p style="font-size:24px">⭐ Le monument est terminé. Bravo !</p>`;
      else{const c={but:coutNiveau(n),verse:S.monument.verse};
        corps+=`<p style="font-size:21px;margin:8px 0 0">Pour le niveau ${n+1} :</p>${jauge(c)}${lignes('monument',c)}
          <div class="actions"><button class="big" data-s-tout="monument" ${peutTout('monument',c)?'':'disabled'}><span class="e">🧱</span>Donner tout ce que je peux</button></div>`}
      return feuille_('🏛️ Le grand monument',corps)}
    return ''}
  const feuille_=(titre,corps)=>`<div class="voile" data-s-fermer><div class="feuille" data-s-garde><button class="fermer" data-s-fermer>Fermer</button><h2>${titre}</h2>${corps}</div></div>`;
  function montreFeuille(){boite.innerHTML=S?feuilleHTML():''}

  document.addEventListener('click',ev=>{try{
    const t=ev.target.closest('[data-s-ouvre],[data-s-verse],[data-s-tout],[data-s-fermer],[data-s-ok],[data-s-garde]');if(!t||!S)return;
    if(t.hasAttribute('data-s-garde'))return;   // un toucher dans la feuille ne la ferme pas
    ev.stopPropagation();
    try{premierGeste()}catch{}
    if(t.hasAttribute('data-s-ok')){celebre=null;try{rendu()}catch{}montreFeuille();return}
    if(t.hasAttribute('data-s-fermer')){ouvert=null;montreFeuille();return}
    if(t.dataset.sOuvre){if(mode||feuille)return;verifier();ouvert=t.dataset.sOuvre;try{SON.lance()}catch{}montreFeuille();return}
    if(t.dataset.sVerse){const [q,k,n]=t.dataset.sVerse.split(':');apresVerse(q,verser(q,k,+n));return}
    if(t.dataset.sTout){const q=t.dataset.sTout,c=cible(q);let tot=0;if(c)Object.keys(c.but).forEach(k=>tot+=verser(q,k,1e9));apresVerse(q,tot);return}
  }catch(e){try{console.warn('saisons :',e)}catch{}}},true);
  // le clic dans la feuille (hors boutons) ne doit pas atteindre le voile
  boite.addEventListener('click',ev=>{if(ev.target.closest('[data-s-garde]')&&!ev.target.closest('button'))ev.stopPropagation()});

  // une célébration ouverte : les confettis du moteur
  const montre0=montreFeuille;montreFeuille=function(){const avant=!!boite.querySelector('[data-s-ok]');montre0();if(celebre&&!avant)try{confettis()}catch{}};

  /* ===================== L'enveloppe de rendu ===================== */
  const r0=rendu;
  rendu=function(){try{if(S&&verifier())sauve()}catch{}r0.apply(this,arguments);try{couche()}catch(e){try{console.warn('saisons :',e)}catch{}}};
  // la saison tourne toute seule le lundi, même si la tablette reste allumée
  setInterval(()=>{try{if(S&&verifier()){sauve();rendu();if(ouvert)montreFeuille()}}catch{}},60000);
  if(S){if(verifier())sauve();majBonus();couche()}
  window.SAISONS_VILLAGE={saison:()=>S&&S.saison?saisonDe(S.saison.semaine).id:saisonDe(semaineDe(maintenant())).id};
})()}catch(e){try{console.warn('saisons.js : désactivé',e)}catch{}}
