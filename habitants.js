/* V3, étape 3 : la vie (CONCEPTION-V3.md, section 4). Des habitants qui marchent sur les chemins, qu'on touche pour
   leur parler et leur offrir leur produit préféré ; des cœurs, des petites scènes à 3, 6 et 10 cœurs, un panneau de
   commandes. Se branche sur village.html sans le modifier : enveloppe de rendu(), état dans S.habitants seulement.
   Tout est dans un try : si ce fichier plante, le village tourne comme avant. */
try{(function(){
if(typeof rendu!=='function'||typeof BAT==='undefined')return;

/* ===================== Les habitants ===================== */
 /* 25/10, Florian : « Tu as déjà 3 prénoms et 3 métiers depuis le début » : Hugo, Chloé et Pierre, et personne d'autre.
    Tous trois habitent le hameau dès le début ; leurs boutiques s'ouvrent au fil des époques. */
const HAB=[
 {id:'chloe',nom:'Chloé',role:'la fleuriste',ep:0,aime:'fruits',peau:'#F3CBB0',cheveux:'#8B4A2B',habit:'#E98AA8',long:true,fleur:true,
  phrases:['Bonjour ! J\'ai mis des roses dans la vitrine, venez les voir.','Une pomme bien croquante, et la journée commence bien.',
   'Les abeilles ont l\'air contentes, aujourd\'hui.','Je prépare un bouquet pour quelqu\'un de très gentil… vous !',
   'Votre village devient de plus en plus joli.','Les fleurs, c\'est comme les gens : il leur faut du soleil et de l\'attention.'],
  scenes:{3:{l:['J\'ai toujours rêvé d\'avoir une boutique de fleurs.','Grâce à vous, ce rêve est devenu vrai.',
     'Je ne vous remercierai jamais assez.','Acceptez ces quelques pièces, de tout cœur.'],cadeau:{pieces:150}},
   6:{l:['Savez-vous ce que veut dire un bouquet de marguerites ?','Il veut dire : « Je suis contente que tu sois là. »',
     'Alors celui-ci est pour vous.','Et ces étoiles aussi, pour le progrès du village.'],cadeau:{etoiles:15}},
   10:{l:['Toute la place parle de vous, vous savez.','On dit que c\'est grâce à vous que le village est si joli.',
     'Alors j\'ai demandé à Pierre de m\'aider pour un cadeau…','Un kiosque à musique ! Posez-le où vous voulez.'],cadeau:{deco:'kiosque'}}}},
 {id:'hugo',nom:'Hugo',role:'le boulanger',ep:0,aime:'oeufs',peau:'#E8B994',cheveux:'#3B2A1E',habit:'#FFFFFF',chapeau:'toque',
  phrases:['Bonjour ! Le four est chaud, ça sent la brioche.','Avec trois œufs, je fais des crêpes pour tout le village.',
   'Je me lève tôt, mais je fais la sieste. Chut !','Une bonne baguette, ça ne s\'improvise pas.',
   'Vous avez une mine superbe aujourd\'hui !','Le secret d\'un bon pain ? La patience.'],
  scenes:{3:{l:['J\'ai essayé une nouvelle recette ce matin.','Une brioche aux pommes, avec un peu de cannelle.',
     'Vous êtes la première à la goûter. Alors ?','Ha ha, j\'en étais sûr ! Tenez, pour vous remercier.'],cadeau:{pieces:150}},
   6:{l:['Quand j\'étais petit, mon grand-père était boulanger.','Il disait : « Le pain, c\'est fait pour être partagé. »',
     'Avec vous, je comprends ce qu\'il voulait dire.','Ces étoiles, c\'est ma façon de partager.'],cadeau:{etoiles:15}},
   10:{l:['J\'ai fait une brioche géante, pour tout le village.','Tout le monde en a eu une part, même le chien !',
     'Et chacun a voulu vous remercier à sa façon.','Alors voici toutes leurs étoiles, réunies pour vous.'],cadeau:{etoiles:40}}}},
 {id:'pierre',nom:'Pierre',role:'le mécano',ep:0,aime:'pain',peau:'#D9A27E',cheveux:'#4A3B2A',habit:'#3A6EA5',chapeau:'casquette',
  phrases:['Bonjour ! Rien ne résiste à un bon tournevis.','J\'ai huilé la girouette de la place, elle ne grince plus.',
   'Un morceau de pain et du fromage : le meilleur repas du monde.','S\'il y a quelque chose de cassé, appelez-moi !',
   'J\'ai trouvé une vieille clé dans mon atelier. Mystère…','Votre village tient debout, solide comme un roc !'],
  scenes:{3:{l:['Vous savez ce que j\'aime dans ce village ?','Tout le monde s\'entraide. Ça, ça ne s\'achète pas.',
     'Et vous, vous êtes toujours là pour chacun.','Voilà quelques pièces. Rien de plus normal entre voisins.'],cadeau:{pieces:200}},
   6:{l:['La vieille clé de mon atelier… j\'ai trouvé ce qu\'elle ouvre !','Un coffret, caché sous le plancher.',
     'Et dedans… des étoiles ! Je vous assure !','Je crois bien qu\'elles vous attendaient.'],cadeau:{etoiles:20}},
   10:{l:['L\'eau de la place me donnait une idée depuis longtemps.','Alors j\'ai sorti mes outils les plus fins.',
     'Voilà : une fontaine, solide comme un roc et jolie comme tout.','Posez-la où vous voulez. Elle chantera pour vous.'],cadeau:{deco:'fontaine'}}}}];
const PALIERS=[3,6,10], MAX=10;
const POURQUOI={legumes:'pour la soupe',bois:'pour réparer la barrière',oeufs:'pour des crêpes',fleurs:'pour la fête',fruits:'pour une tarte',
  farine:'pour la brioche',pain:'pour le goûter',outils:'pour l\'atelier'};
const hab=id=>HAB.find(h=>h.id===id);

/* ===================== État : S.habitants, rien d'autre ===================== */
function E(){
  if(!S.habitants||typeof S.habitants!=='object')S.habitants={};
  const h=S.habitants;
  ['coeurs','offert','parle','paliers'].forEach(k=>{if(!h[k]||typeof h[k]!=='object')h[k]={}});
  ['attente','commandes','bons','arrives'].forEach(k=>{if(!Array.isArray(h[k]))h[k]=[]});
  const ok=id=>HAB.some(H=>H.id===id);
  ['coeurs','offert','parle','paliers'].forEach(k=>Object.keys(h[k]).forEach(id=>{if(!ok(id))delete h[k][id]}));
  h.attente=h.attente.filter(a=>ok(a.qui));h.commandes=h.commandes.filter(c=>c&&ok(c.qui));h.bons=h.bons.filter(b=>ok(b.de));h.arrives=h.arrives.filter(ok);
  return h;
}
const epoque=()=>{const n=['hameau','village','bourg','ville'].indexOf(S.epoque);return n<0?0:n};
const presents=()=>HAB.filter(h=>h.ep<=epoque());
const jour=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const numJour=()=>{const d=new Date();return Math.floor((d-d.getTimezoneOffset()*60000)/86400000)};
const coeurs=id=>E().coeurs[id]||0;
const ligneCoeurs=n=>'❤️'.repeat(n)+'🤍'.repeat(MAX-n);
const phraseDuJour=H=>H.phrases[(numJour()+HAB.indexOf(H)*2)%H.phrases.length];
const nomRes=k=>RES[k]?RES[k].e+' '+RES[k].nom:k;
const quiProduit=k=>{const b=Object.values(BAT).find(B=>B.produit===k);return b?b.nom:null};

/* ===================== Le dessin : petits personnages ronds ===================== */
function perso(H){
  let s='';
  s+=`<ellipse cx="0" cy="0" rx="9" ry="3.5" fill="#00000030"/>`;
  s+=`<ellipse cx="-4" cy="-1.5" rx="3.6" ry="2.2" fill="#4E3B2C"/><ellipse cx="4" cy="-1.5" rx="3.6" ry="2.2" fill="#4E3B2C"/>`;
  if(H.long)s+=`<rect x="-10" y="-32" width="20" height="17" rx="7" fill="${H.cheveux}"/>`;
  s+=`<rect x="-8.5" y="-20" width="17" height="19" rx="7.5" fill="${H.habit}" stroke="#00000045" stroke-width="1"/>`;
  if(H.id==='hugo')s+=`<rect x="-5" y="-15" width="10" height="13" rx="3" fill="#F3E2C4" stroke="#00000030" stroke-width=".8"/>`;
  if(H.id==='pierre')s+=`<rect x="-5" y="-17" width="10" height="7" rx="2" fill="#2B5585"/>`;
  s+=`<circle cx="0" cy="-27" r="9" fill="${H.peau}" stroke="#00000035" stroke-width="1"/>`;
  s+=`<path d="M-9.4,-27.5 A9.4,9.4 0 0 1 9.4,-27.5 Q0,-31.5 -9.4,-27.5Z" fill="${H.cheveux}"/>`;
  if(H.chapeau==='beret')s+=`<ellipse cx="1" cy="-35" rx="9" ry="3.6" fill="#6D5A4A"/><circle cx="1" cy="-38.5" r="1.4" fill="#6D5A4A"/>`;
  if(H.chapeau==='toque')s+=`<rect x="-7" y="-39" width="14" height="6" fill="#fff" stroke="#00000035" stroke-width=".8"/><circle cx="-4.5" cy="-41" r="4.5" fill="#fff"/><circle cx="4.5" cy="-41" r="4.5" fill="#fff"/><circle cx="0" cy="-43.5" r="5" fill="#fff"/>`;
  if(H.chapeau==='casquette')s+=`<path d="M-9,-32 A9,8 0 0 1 9,-32Z" fill="#E0A030"/><rect x="3" y="-33" width="9" height="2.6" rx="1.3" fill="#C28420"/>`;
  if(H.noeud)s+=`<circle cx="-6.5" cy="-34" r="2.6" fill="${H.noeud}"/><circle cx="-2.6" cy="-35" r="2.6" fill="${H.noeud}"/>`;
  if(H.fleur)s+=`<circle cx="7" cy="-33" r="2.8" fill="#fff"/><circle cx="7" cy="-33" r="1.3" fill="#F9C74F"/>`;
  s+=`<circle cx="-3.2" cy="-27" r="1.35" fill="#2B1F00"/><circle cx="3.2" cy="-27" r="1.35" fill="#2B1F00"/>`;
  s+=`<circle cx="-5.6" cy="-23.8" r="1.9" fill="#F48FB1" opacity=".75"/><circle cx="5.6" cy="-23.8" r="1.9" fill="#F48FB1" opacity=".75"/>`;
  s+=`<path d="M-2.6,-23.4 Q0,-21.2 2.6,-23.4" fill="none" stroke="#7A3B2E" stroke-width="1.1" stroke-linecap="round"/>`;
  return H.taille?`<g transform="scale(${H.taille})">${s}</g>`:s;
}
const portrait=(H,px)=>`<svg viewBox="-16 -48 32 50" width="${px}" height="${Math.round(px*50/32)}" aria-hidden="true">${perso(H)}</svg>`;
window.HAB_PORTRAIT=(id,px)=>{const H=hab(id);return H?portrait(H,px):''};   // pour les scènes du guide (village.html)

/* ===================== La marche sur les chemins ===================== */
const VITESSE=.65;                   // cases par seconde : un pas tranquille
const POS={};let MARCHE=new Set(), noeuds={}, parleA=null;
const cle=(i,j)=>i+','+j, de=k=>k.split(',').map(Number);
function auHasard(set){const a=[...set];return a[Math.floor(Math.random()*a.length)]}
function placeAuHasard(){return cle(PLACE.i+Math.floor(Math.random()*2),PLACE.j+Math.floor(Math.random()*2))}
function voisins(k){const [i,j]=de(k);return [[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>cle(i+a,j+b)).filter(x=>MARCHE.has(x))}
function suivant(p){const v=voisins(p.a);if(!v.length)return p.a;const sans=v.filter(x=>x!==p.prev);const l=sans.length?sans:v;return l[Math.floor(Math.random()*l.length)]}
function prepare(){
  presents().forEach(H=>{let p=POS[H.id];
    if(!p){const k=MARCHE.size>4&&Math.random()<.7?auHasard(MARCHE):placeAuHasard();p=POS[H.id]={a:k,b:k,prev:null,t:0,pause:Math.random()*2,etat:''}}
    if(!MARCHE.has(p.a)||!MARCHE.has(p.b)){const k=placeAuHasard();p.a=p.b=k;p.t=0;p.prev=null}});
}
function avance(dt){
  presents().forEach(H=>{const p=POS[H.id];if(!p)return;
    if(parleA===H.id)return;
    if(p.pause>0){p.pause-=dt;return}
    p.t+=dt*VITESSE;
    if(p.t>=1){p.prev=p.a;p.a=p.b;p.t=0;p.b=suivant(p);
      if(p.b===p.a||Math.random()<.22)p.pause=1+Math.random()*2.5}});
}
function ecran(H){const p=POS[H.id];if(!p)return null;const [ai,aj]=de(p.a),[bi,bj]=de(p.b),A=P(ai+.5,aj+.5),B=P(bi+.5,bj+.5),n=HAB.indexOf(H);
  return [A[0]+(B[0]-A[0])*p.t+((n%3)-1)*7,A[1]+(B[1]-A[1])*p.t+(n%2?3:-2)]}
/* Les noms, dans leur propre couche au-dessus des habitants : sous les pieds, et écartés vers le bas quand deux plaques se touchent. */
let OBST=[];   // les inscriptions de la carte (« La place »…), relevées à chaque dessin : les noms les évitent
function placeNoms(pos){
  const l=pos.filter(x=>x.n&&x.n.isConnected).sort((a,b)=>a.y-b.y||a.x-b.x), mis=OBST.slice();
  l.forEach(x=>{let y=x.y;
    for(let k=0;k<8;k++){const t=y+2.5,b=y+13.5;
      const gene=mis.find(m=>Math.abs(m.x-x.x)<(m.w+x.w)/2+2&&t<m.b+1&&b>m.t-1);if(!gene)break;y=gene.b+1-2.5}
    mis.push({x:x.x,w:x.w,t:y+2.5,b:y+13.5});x.n.setAttribute('transform',`translate(${x.x.toFixed(1)},${y.toFixed(1)})`)});
}
function place(){
  const pos=[];
  presents().forEach(H=>{const g=noeuds[H.id];if(!g||!g.isConnected)return;const xy=ecran(H);if(!xy)return;
    g.setAttribute('transform',`translate(${xy[0].toFixed(1)},${xy[1].toFixed(1)})`);
    const n=noeuds['nom:'+H.id];if(n)pos.push({n,x:xy[0],y:xy[1],w:+n.dataset.w});
    const p=POS[H.id],etat=(p.pause>0||parleA===H.id||p.a===p.b)?'h-arret':'h-marche';
    if(p.etat!==etat||!g.firstElementChild.classList.contains(etat)){p.etat=etat;const c=g.firstElementChild;c.classList.remove('h-arret','h-marche');c.classList.add(etat)}});
  placeNoms(pos);
}
let avant=0,enPanne=false;
function boucle(t){
  if(enPanne)return;
  try{const dt=Math.min(.1,avant?(t-avant)/1000:0);avant=t;avance(dt);place()}catch(e){enPanne=true;return}
  requestAnimationFrame(boucle);
}

/* La couche des habitants, ajoutée dans .carte svg après chaque rendu du village. */
function couche(){
  noeuds={};
  if(!S)return;E();
  const svg=document.querySelector('.carte svg');if(!svg)return;
  MARCHE=relies();prepare();
  const h=E(),aujourd=jour(),actif=!mode;
  let s=`<g id="h-couche" style="${actif?'':'pointer-events:none;opacity:.5'}">`, noms='';
  presents().forEach(H=>{
    const marque=h.attente.some(a=>a.qui===H.id)?'✨':(h.parle[H.id]!==aujourd?'💬':'');
    // 25/10 : habitants à la moitié de la hauteur d'une maison du hameau (échelle de la carte, donc vraie à tout zoom) ;
    // le nom en petit sur une plaque fine, juste sous les pieds
    const lw=Math.round(H.nom.length*4.6+10);
    s+=`<g data-h-qui="${H.id}" style="cursor:pointer" role="button" aria-label="Parler à ${H.nom}"><g class="h-marche"><g transform="scale(.85)">`
      +`<circle cx="0" cy="-20" r="26" fill="#fff" opacity="0"/>${perso(H)}`
      +(marque?`<g class="flotte"><circle cx="11" cy="-44" r="8.5" fill="#FFFDF6" stroke="#B8B09C" stroke-width="1.5"/><text x="11" y="-40" font-size="10" text-anchor="middle">${marque}</text></g>`:'')
      +`</g></g></g>`;
    noms+=`<g class="h-nom" data-h-nom="${H.id}" data-w="${lw}" data-h-a="parler" data-h-qui-b="${H.id}" style="cursor:pointer"><rect x="${-lw/2}" y="2.5" width="${lw}" height="11" rx="3" fill="#FBF0D2" fill-opacity=".92" stroke="#6B4022" stroke-width=".8"/>`
      +`<text x="0" y="10.6" font-size="8" font-weight="700" text-anchor="middle" fill="#3E2410" font-family="Fredoka, Arial, sans-serif">${H.nom}</text></g>`});
  s+=`<g id="h-noms">${noms}</g></g>`;
  const voile=svg.querySelector('rect[fill="#1A2A55"]');
  if(voile)voile.insertAdjacentHTML('beforebegin',s);else svg.insertAdjacentHTML('beforeend',s);
  svg.querySelectorAll('[data-h-qui]').forEach(g=>noeuds[g.dataset.hQui]=g);
  svg.querySelectorAll('[data-h-nom]').forEach(g=>noeuds['nom:'+g.dataset.hNom]=g);
  OBST=[];try{svg.querySelectorAll('text').forEach(e=>{if(e.closest('#h-couche')||!e.textContent.trim())return;const b=e.getBBox();
    if(b.width>20)OBST.push({x:b.x+b.width/2,w:b.width,t:b.y,b:b.y+b.height})})}catch(e){OBST=[]}
  place();
  // le bouton des commandes, sur le côté
  const cote=document.querySelector('.cote');
  if(cote&&!mode){const prets=h.commandes.filter(c=>(S.stock[c.res]||0)>=c.n).length;
    cote.insertAdjacentHTML('beforeend',`<button class="big alt h-bouton" data-h-a="commandes"><span class="e">📋</span><span>Commandes${prets?`<br><small>${prets} à donner</small>`:''}</span></button>`)}
}

/* ===================== Les commandes ===================== */
function produitsConnus(){
  const l=Object.keys(RES).filter(k=>k!=='pieces'&&k!=='etoiles'&&(S.b.some(o=>BAT[o.type]&&BAT[o.type].produit===k)||(S.stock[k]||0)>0));
  return l.length?l:['legumes'].filter(k=>RES[k]);
}
function nouvelleCommande(){
  const h=E(),gens=presents(),prod=produitsConnus();if(!gens.length||!prod.length)return null;
  for(let essai=0;essai<12;essai++){
    const H=gens[Math.floor(Math.random()*gens.length)],res=Math.random()<.4&&prod.includes(H.aime)?H.aime:prod[Math.floor(Math.random()*prod.length)];
    if(h.commandes.some(c=>c.res===res&&c.qui===H.id))continue;
    if(essai<6&&h.commandes.some(c=>c.qui===H.id))continue;
    const v=RES[res].vend||3,n=v<=3?3+Math.floor(Math.random()*4):v<=5?2+Math.floor(Math.random()*3):1+Math.floor(Math.random()*3);
    return {id:Math.random().toString(36).slice(2,8),qui:H.id,res,n,et:2+Math.ceil(n*v/5)};
  }
  return null;
}
function remplirCommandes(){
  const h=E(),ids=presents().map(H=>H.id);
  h.commandes=h.commandes.filter(c=>c&&ids.includes(c.qui)&&RES[c.res]);
  let garde=0;while(h.commandes.length<3&&garde++<6){const c=nouvelleCommande();if(c)h.commandes.push(c)}
}

/* ===================== Cœurs, scènes, cadeaux ===================== */
function gagnerCoeur(id,n){
  const h=E(),avant=coeurs(id),apres=Math.min(MAX,avant+n);h.coeurs[id]=apres;
  const vus=h.paliers[id]||(h.paliers[id]=[]);
  PALIERS.forEach(p=>{if(avant<p&&apres>=p&&!vus.includes(p)&&!h.attente.some(a=>a.qui===id&&a.palier===p))h.attente.push({qui:id,palier:p})});
  return apres>avant;
}
function sonCoeur(){note(784,0,.16,'sine',.12);note(988,.1,.16,'sine',.11);note(1319,.2,.4,'triangle',.08)}
function sonParle(){note(660,0,.08,'triangle',.05);note(880,.07,.09,'triangle',.05)}
function coeursVolent(sx,sy){const fx=document.getElementById('fx');if(!fx)return;
  for(let n=0;n<5;n++){const e=document.createElement('div');e.className='h-coeur';e.textContent='❤️';
    e.style.left=sx-16+(n-2)*16+'px';e.style.top=sy-16+'px';e.style.animationDelay=n*90+'ms';fx.appendChild(e);setTimeout(()=>e.remove(),1700)}}
function depuis(sel){const el=document.querySelector(sel);if(!el)return [innerWidth/2,innerHeight/2];const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/3]}
function donnerCadeau(c,H){
  const [sx,sy]=depuis('#h-voile .h-portrait');
  if(c.pieces){S.stock.pieces=(S.stock.pieces||0)+c.pieces;return {txt:`${c.pieces} 🪙 pièces`,vol:['pieces',c.pieces],sx,sy}}
  if(c.etoiles){S.stock.etoiles=(S.stock.etoiles||0)+c.etoiles;return {txt:`${c.etoiles} ⭐ étoiles`,vol:['etoiles',c.etoiles],sx,sy}}
  if(c.deco&&BAT[c.deco]){E().bons.push({type:c.deco,de:H.id});return {txt:`${BAT[c.deco].e} ${BAT[c.deco].nom}, à poser gratuitement`,deco:true,sx,sy}}
  return {txt:'',sx,sy};
}

/* Une déco offerte se pose avec le geste du moteur : on avance son prix, et on le reprend si elle n'est pas posée. */
function poserBon(k){
  const h=E(),bon=h.bons[k];if(!bon||!BAT[bon.type])return;
  const B=BAT[bon.type];
  Object.entries(B.cout).forEach(([r,v])=>S.stock[r]=(S.stock[r]||0)+v);
  h.pose={k,type:bon.type,avant:S.b.filter(o=>o.type===bon.type).length,cout:B.cout};
  fermer();feuille=null;{const [i,j]=viserPres(bon.type);mode={pose:bon.type,i,j}}message=`🎁 C'est un cadeau : glissez ${B.nom} où vous voulez, puis « Poser ici ».`;sauve();rendu();
}
function finPose(){
  const h=E();if(!h.pose||mode)return;
  const p=h.pose,n=S.b.filter(o=>o.type===p.type).length;
  if(n>p.avant){h.bons.splice(p.k,1);message=`🎁 ${BAT[p.type].e} ${BAT[p.type].nom} : c'est posé, et c'était gratuit !`}
  else Object.entries(p.cout).forEach(([r,v])=>S.stock[r]=Math.max(0,(S.stock[r]||0)-v));
  h.pose=null;sauve();
  const m=document.querySelector('.msg');if(m&&n>p.avant)m.textContent=message;
  const pills=document.querySelectorAll('.pill[data-res]');pills.forEach(el=>{const r=el.dataset.res;if(RES[r])el.innerHTML=RES[r].e+' '+(S.stock[r]||0)});   // les récoltes de la V4 ont une petite image
}

/* ===================== Les fenêtres des habitants ===================== */
let vue=null;
function fermer(){vue=null;parleA=null;const v=document.getElementById('h-voile');if(v)v.remove()}
function ouvrir(v){vue=v;let el=document.getElementById('h-voile');
  if(!el){el=document.createElement('div');el.id='h-voile';el.className='voile';el.setAttribute('data-h-a','fermer');document.body.appendChild(el)}
  el.innerHTML=`<div class="feuille" data-h-stop>${contenu(v)}</div>`}
function contenu(v){
  const h=E();
  if(v.quoi==='parler'){const H=hab(v.qui),c=coeurs(H.id),aime=H.aime,a=S.stock[aime]||0,deja=h.offert[H.id]===jour();
    const bons=h.bons.map((b,k)=>({b,k})).filter(x=>x.b.de===H.id);
    let offrir;
    if(deja)offrir=`<p class="h-note">🎁 Merci pour le cadeau d'aujourd'hui ! Revenez demain pour lui en offrir un autre.</p>`;
    else if(c>=MAX&&a<1)offrir=`<p class="h-note">❤️ ${H.nom} vous aime de tout son cœur.</p>`;
    else if(a>=1)offrir=`<button class="big" data-h-a="offrir"><span class="e">🎁</span>Offrir 1 ${nomRes(aime)}</button>`;
    else{const b=quiProduit(aime);offrir=`<p class="h-note">${H.nom} adore les ${nomRes(aime)}.${b?` Le bâtiment « ${b} » en donne.`:''}</p>`}
    return `<button class="fermer" data-h-a="fermer">Fermer</button>
      <div class="h-tete"><div class="h-portrait">${portrait(H,96)}</div><div><h2>${H.nom}</h2><p class="sous">${H.role} · aime les ${nomRes(aime)}</p>
      <div class="h-coeurs" aria-label="${c} cœurs sur ${MAX}">${ligneCoeurs(c)}</div></div></div>
      <div class="h-bulle">${phraseDuJour(H)}</div>
      <div class="actions">${offrir}${bons.map(x=>`<button class="big vert" data-h-a="poser" data-h-k="${x.k}"><span class="e">${BAT[x.b.type].e}</span>Poser le cadeau</button>`).join('')}
      <button class="big alt" data-h-a="fermer">Au revoir</button></div>`}
  if(v.quoi==='scene'){const H=hab(v.qui),S2=H.scenes[v.palier],l=S2.l,der=v.k>=l.length-1;
    return `<div class="h-tete"><div class="h-portrait">${portrait(H,96)}</div><div><h2>${H.nom}</h2><p class="sous">${v.palier} cœurs : un moment rien qu'à vous</p>
      <div class="h-coeurs">${ligneCoeurs(coeurs(H.id))}</div></div></div>
      <div class="h-bulle">${l[v.k]}</div><p class="h-note" style="text-align:right">${v.k+1} / ${l.length}</p>
      <div class="actions">${der?`<button class="big" data-h-a="recevoir"><span class="e">🎁</span>Recevoir le cadeau</button>`:`<button class="big" data-h-a="suite"><span class="e">▶</span>La suite</button>`}</div>`}
  if(v.quoi==='cadeau'){const H=hab(v.qui);
    return `<div class="h-tete"><div class="h-portrait">${portrait(H,96)}</div><div><h2>🎁 Le cadeau de ${H.nom}</h2><p class="h-gros">${v.txt}</p></div></div>
      <div class="actions">${v.deco?`<button class="big vert" data-h-a="poser" data-h-k="${v.k}"><span class="e">🌷</span>Le poser maintenant</button><button class="big alt" data-h-a="fermer">Plus tard</button>`
        :`<button class="big" data-h-a="fermer">Merci, ${H.nom} !</button>`}</div>${v.deco?'<p class="h-note">Le cadeau vous attend dans le panneau des commandes, aussi longtemps qu\'il le faut.</p>':''}`}
  if(v.quoi==='commandes'){remplirCommandes();
    const cmd=h.commandes.map(c=>{const H=hab(c.qui),a=S.stock[c.res]||0,ok=a>=c.n;
      return `<div class="h-cmd"><div class="h-mini">${portrait(H,44)}</div><div class="h-cmd-txt"><b>${c.n} ${nomRes(c.res)}</b> pour ${H.nom}${POURQUOI[c.res]?`<span class="h-pq">, ${POURQUOI[c.res]}</span>`:''}
        <small>Vous en avez ${a} · rapporte ${c.et} ⭐ et 1 ❤️</small></div>
        <button class="h-donner" data-h-a="donner" data-h-id="${c.id}" ${ok?'':'disabled'}>${ok?'Donner':'Il en manque '+(c.n-a)}</button>
        <button class="h-autre" data-h-a="autre" data-h-id="${c.id}" aria-label="Une autre demande">🔄</button></div>`}).join('');
    const gens=presents().map(H=>`<button class="h-gens" data-h-a="parler" data-h-qui-b="${H.id}"><span class="h-mini">${portrait(H,40)}</span><span><b>${H.nom}</b><br><small>${'❤️'.repeat(Math.min(coeurs(H.id),MAX))||'🤍'} ${coeurs(H.id)} / ${MAX}</small></span></button>`).join('');
    const bons=h.bons.map((b,k)=>BAT[b.type]?`<button class="big vert" data-h-a="poser" data-h-k="${k}"><span class="e">${BAT[b.type].e}</span>Poser : ${BAT[b.type].nom}</button>`:'').join('');
    return `<button class="fermer" data-h-a="fermer">Fermer</button><h2>📋 Les commandes du village</h2>
      <p class="sous">Rien ne presse : une commande attend aussi longtemps qu'il le faut. 🔄 en propose une autre.</p>${cmd||'<p class="sous">Pas de commande pour l\'instant.</p>'}
      ${bons?`<h2 style="margin-top:18px">🎁 Vos cadeaux à poser</h2><div class="actions">${bons}</div>`:''}
      <h2 style="margin-top:18px">👥 Les habitants</h2><div class="h-liste">${gens}</div>`}
  return '';
}
function parler(id){
  const h=E(),H=hab(id);if(!H)return;
  const att=h.attente.find(a=>a.qui===id);
  parleA=id;
  if(att){ouvrir({quoi:'scene',qui:id,palier:att.palier,k:0});sonParle();return}
  if(h.parle[id]!==jour()){h.parle[id]=jour();sauve()}
  ouvrir({quoi:'parler',qui:id});sonParle();
  rendu();
}
function apresCoeur(id){
  const h=E(),att=h.attente.find(a=>a.qui===id);
  if(att){setTimeout(()=>{parleA=id;ouvrir({quoi:'scene',qui:id,palier:att.palier,k:0})},900)}
}
function agir(a,el){
  const h=E();
  if(a==='fermer'){fermer();rendu();return}
  if(a==='commandes'){ouvrir({quoi:'commandes'});return}
  if(a==='parler'){parler(el.dataset.hQuiB);return}
  if(a==='poser'){poserBon(+el.dataset.hK);return}
  if(a==='offrir'&&vue&&vue.quoi==='parler'){const H=hab(vue.qui),k=H.aime;
    if(h.offert[H.id]===jour()||(S.stock[k]||0)<1)return;
    S.stock[k]-=1;h.offert[H.id]=jour();gagnerCoeur(H.id,1);sauve();
    const [sx,sy]=depuis('#h-voile .h-portrait');sonCoeur();coeursVolent(sx,sy);
    message=`❤️ ${H.nom} est ravi${H.id==='chloe'?'e':''} de votre cadeau !`;
    ouvrir(vue);rendu();apresCoeur(H.id);return}
  if(a==='suite'&&vue&&vue.quoi==='scene'){vue.k++;sonParle();ouvrir(vue);return}
  if(a==='recevoir'&&vue&&vue.quoi==='scene'){const H=hab(vue.qui),p=vue.palier;
    h.attente=h.attente.filter(x=>!(x.qui===H.id&&x.palier===p));
    const vus=h.paliers[H.id]||(h.paliers[H.id]=[]);if(!vus.includes(p))vus.push(p);
    const r=donnerCadeau(H.scenes[p].cadeau,H);sauve();
    message=`🎁 ${H.nom} vous a offert ${r.txt}.`;
    ouvrir({quoi:'cadeau',qui:H.id,txt:r.txt,deco:r.deco,k:h.bons.length-1});rendu();
    etincelles(r.sx,r.sy);note(523,0,.3,'triangle',.1);note(659,.12,.3,'triangle',.1);note(784,.24,.5,'triangle',.1);
    if(r.vol)voler(r.sx,r.sy,r.vol[0],r.vol[1]);return}
  if(a==='donner'){const c=h.commandes.find(x=>x.id===el.dataset.hId);if(!c||(S.stock[c.res]||0)<c.n)return;
    const [sx,sy]=(()=>{const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]})();
    S.stock[c.res]-=c.n;S.stock.etoiles=(S.stock.etoiles||0)+c.et;gagnerCoeur(c.qui,1);try{window.filSignal&&filSignal('commande')}catch{}
    h.commandes=h.commandes.filter(x=>x!==c);remplirCommandes();sauve();
    const H=hab(c.qui);message=`📋 ${H.nom} vous remercie : ${c.et} ⭐ et un cœur !`;
    SON.ramasse();ouvrir(vue);rendu();etincelles(sx,sy);coeursVolent(sx,sy);voler(sx,sy,'etoiles',c.et);
    if(h.attente.some(x=>x.qui===c.qui)){setTimeout(()=>{parleA=c.qui;const att=h.attente.find(x=>x.qui===c.qui);if(att)ouvrir({quoi:'scene',qui:c.qui,palier:att.palier,k:0})},1100)}
    return}
  if(a==='autre'){const i=h.commandes.findIndex(x=>x.id===el.dataset.hId);if(i<0)return;
    const vieille=h.commandes.splice(i,1)[0];const n=nouvelleCommande();h.commandes.splice(i,0,n||vieille);sauve();SON.lance();ouvrir(vue);return}
}

/* ===================== Les touchers : une délégation à moi, attributs data-h-* ===================== */
document.addEventListener('click',ev=>{
  try{
    const t=ev.target.closest&&ev.target.closest('[data-h-a],[data-h-stop],[data-h-qui]');if(!t||!S)return;
    if(t.hasAttribute('data-h-stop'))return;
    ev.stopPropagation();if(typeof premierGeste==='function')premierGeste();
    if(t.hasAttribute('data-h-qui')){if(!mode&&!feuille&&!fete)parler(t.dataset.hQui);return}
    if(t.hasAttribute('data-h-a')&&!t.disabled)agir(t.dataset.hA,t);
  }catch(e){fermer()}
});

/* Les arrivées : les trois habitent le hameau dès le début (une ancienne sauvegarde les accueille sans message). */
function arrivees(){
  if(fete||feuille)return;
  const h=E(),neufs=presents().filter(H=>!h.arrives.includes(H.id));if(!neufs.length)return;
  neufs.forEach(H=>h.arrives.push(H.id));
  remplirCommandes();sauve();
}

/* ===================== Le style ===================== */
const st=document.createElement('style');
st.textContent=`
.h-marche{animation:h-bal .8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
.h-arret{animation:h-souffle 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
@keyframes h-bal{0%,100%{transform:rotate(-5deg)}25%{transform:translateY(-1.6px)}50%{transform:rotate(5deg)}75%{transform:translateY(-1.6px)}}
@keyframes h-souffle{50%{transform:scaleY(1.03)}}
#h-voile{z-index:7}
#h-voile .feuille{font-size:22px}
.h-tete{display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:12px}
.h-portrait{background:#FFF4CC;border:3px solid var(--gold);border-radius:50%;width:116px;height:116px;display:flex;align-items:flex-end;justify-content:center;overflow:hidden;flex:none}
.h-portrait svg{margin-bottom:-6px}
.h-coeurs{font-size:22px;letter-spacing:1px;line-height:1.3}
.h-bulle{position:relative;background:#fff;border:3px solid var(--line);border-radius:22px;padding:16px 20px;font-size:26px;line-height:1.4;margin:8px 0 4px 10px}
.h-bulle:before{content:"";position:absolute;left:34px;top:-15px;border:13px solid transparent;border-top:0;border-bottom:15px solid var(--line)}
.h-note{font-size:21px;color:var(--ink-dim);margin:8px 0}
.h-gros{font-size:28px;font-weight:700;margin:6px 0}
.h-bouton{flex:none;min-height:76px;font-size:24px}
.h-bouton small{font-size:17px;font-weight:400}
.h-cmd{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--line);flex-wrap:wrap}
.h-cmd-txt{flex:1;min-width:200px;font-size:22px}
.h-cmd-txt small{display:block;font-size:18px;color:var(--ink-dim)}
.h-pq{color:var(--ink-dim)}
.h-mini{width:52px;height:52px;border-radius:50%;background:#FFF4CC;border:2px solid var(--line);display:flex;align-items:flex-end;justify-content:center;overflow:hidden;flex:none}
.h-donner{font-size:21px;font-weight:700;min-height:60px;min-width:130px;padding:0 18px;border-radius:16px;border:0;background:var(--gold);color:var(--gold-ink);box-shadow:0 4px 0 var(--gold-deep)}
.h-donner[disabled]{background:#EFE8D8;color:var(--ink-dim);box-shadow:none;cursor:default;font-weight:400}
.h-autre{font-size:24px;min-height:60px;min-width:60px;border-radius:16px;border:2px solid var(--line);background:#fff}
.h-liste{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}
.h-gens{display:flex;align-items:center;gap:10px;text-align:left;background:#fff;border:3px solid var(--line);border-radius:18px;padding:10px;font-size:21px;min-height:76px}
.h-gens small{font-size:15px}
.h-coeur{position:fixed;font-size:32px;animation:h-monte 1.5s ease-out both}
@keyframes h-monte{0%{transform:translateY(0) scale(.4);opacity:0}20%{opacity:1;transform:translateY(-20px) scale(1.15)}100%{transform:translateY(-120px) scale(.9);opacity:0}}`;
document.head.appendChild(st);

/* ===================== Le branchement ===================== */
const r0=rendu;
rendu=function(){
  r0.apply(this,arguments);
  try{if(S){E();finPose();arrivees();couche()}}catch(e){}
};
if(S){try{E();presents().forEach(H=>{if(!E().arrives.includes(H.id))E().arrives.push(H.id)});remplirCommandes();sauve()}catch(e){}}
rendu();
requestAnimationFrame(boucle);
})()}catch(e){}
