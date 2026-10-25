/* =====================================================================
   RÈGLES DU JEU — BELOTE CLASSIQUE (article « Belote » de Wikipédia, lu le 25/10)
   ---------------------------------------------------------------------
   Première version SANS annonces de tierce, cinquante, cent ni carré : seule
   la belote-rebelote compte, pour rester simple.

   LE JEU
   - 32 cartes à quatre (7, 8, 9, 10, valet, dame, roi, as de chaque couleur).
   - Ordre hors atout, de la plus forte à la plus faible : A, 10, R, D, V, 9, 8, 7.
   - Ordre à l'atout : V, 9, A, 10, R, D, 8, 7.
   - Valeurs hors atout : A 11, 10 10, R 4, D 3, V 2, 9 / 8 / 7 0.
     À l'atout : V 20, 9 14 (le « quatorze »), les autres comme hors atout.
   - Total d'une donne : 152 points de cartes + 10 de der = 162.

   DISTRIBUTION
   - Le premier donneur est tiré au hasard ; ensuite le donneur passe à droite.
   - Le jeu est mélangé à chaque donne (règle officielle actuelle).
   - On tourne dans le sens inverse des aiguilles d'une montre : le premier servi,
     le premier à parler et le premier à jouer est le voisin de droite du donneur.
   - Chacun reçoit 3 cartes puis 2 (5 cartes). La carte suivante est retournée.

   PRISE (deux tours)
   - Premier tour : à partir de la droite du donneur, chacun accepte la couleur de
     la carte retournée comme atout (« je prends ») ou passe.
   - Second tour, si tout le monde a passé : chacun peut choisir l'une des trois
     autres couleurs, ou passer encore.
   - Celui qui prend ramasse la carte retournée ; on finit la donne : 3 cartes à
     chacun, 2 seulement au preneur. Chacun a alors 8 cartes.
   - Si personne ne prend au second tour : on regroupe et le voisin de droite redonne.

   LE JEU DE LA CARTE (8 plis)
   - Le voisin de droite du donneur entame ; on joue chacun son tour. Le pli va à
     l'atout le plus fort, sinon à la plus forte carte de la couleur demandée ;
     celui qui l'emporte entame le pli suivant.
   - FOURNIR : si l'on a de la couleur demandée, on doit en jouer.
   - COUPER : si l'on n'en a pas et que l'adversaire est maître du pli, on doit
     jouer atout si l'on en a.
   - MONTER À L'ATOUT : quand on joue atout (atout demandé, ou obligation de couper),
     on doit mettre un atout plus fort que le plus fort déjà posé, si on le peut ;
     sinon on joue quand même un atout (même plus faible). Atout demandé : on monte
     même sur l'atout de son partenaire.
   - EXCEPTION DU PARTENAIRE MAÎTRE : si l'on n'a pas de la couleur demandée et que
     son partenaire est maître du pli, on joue la carte de son choix (on peut
     défausser, ou jouer un atout, même plus petit que celui du partenaire).
   - Sans couleur demandée ni atout : la carte de son choix.

   POINTS
   - Chaque camp compte les cartes de ses plis ; le dernier pli rapporte 10 de der.
   - BELOTE-REBELOTE : qui a en main le roi et la dame d'atout dit « Belote » en
     posant le premier et « Rebelote » en posant le second : 20 points pour son
     camp. Le jeu l'annonce tout seul. La belote est personnelle : son camp la
     garde même s'il est dedans.
   - CONTRAT RÉUSSI : le camp du preneur fait plus de points que l'autre (belote
     comprise). Chaque camp marque ses points.
   - CHUTÉ (« dedans ») : le camp du preneur fait moins : l'autre camp marque 162
     (plus sa belote) ; le preneur ne marque que sa belote.
   - LITIGE (égalité) : le camp qui défend marque ses points ; ceux du preneur sont
     mis en réserve et vont au camp qui gagne la donne suivante.
   - CAPOT : un camp qui fait les 8 plis marque 252 (plus sa belote) ; l'autre rien
     (hors belote).
   - La partie se joue en 1000 points (règle officielle), ou 500 pour une partie
     courte. Si plusieurs camps passent le but à la même donne, le plus haut gagne ;
     à égalité, on rejoue une donne.

   À QUATRE : deux camps face à face (sièges 0-2 et 1-3).

   VARIANTE À TROIS, CHACUN POUR SOI (première variante de l'article)
   - On retire les 7 et les 8 : 24 cartes, toutes distribuées en 3 fois 8 cartes
     (3 + 2, la retournée, puis 3 + 3 + 2 au preneur). Total : toujours 162.
   - Mêmes obligations, sans partenaire : pas d'exception du partenaire maître.
   - Le preneur doit faire plus de points que CHACUN des deux autres.
     Réussi : chacun marque ses points. Sinon il est dedans : l'adversaire qui l'a
     dépassé marque ses points plus ceux du preneur, le troisième garde les siens
     (si les deux l'ont dépassé, le plus fort prend ; à égalité, ils partagent).
   - Simplification assumée : pas de bonus de capot à trois.

   LIAISON : la même que le rami (index.html). PeerJS, un mot de salle, aucun
   compte. L'hôte tient la partie et le paquet ; chaque autre tablette reçoit
   seulement SA main et ce qui est visible sur la table. Les joueurs automatiques
   ne voient, eux aussi, que cette même vue.
   ===================================================================== */

/* ---------- Les cartes : mêmes numéros que le rami (couleur × 13 + rang − 1) ---------- */
const SUIT_NAME=['pique','cœur','carreau','trèfle'];
const SUIT_DU=['du pique','du cœur','du carreau','du trèfle'];
const SUIT_RED=[false,true,true,false];
const SUIT_ORDER=[0,1,3,2];
const LABEL={1:'A',11:'V',12:'D',13:'R'};
const suitOf=id=>Math.floor(id/13);
const rankOf=id=>id%13+1;
const label=r=>LABEL[r]||String(r);
const RANKS4=[1,7,8,9,10,11,12,13], RANKS3=[1,9,10,11,12,13];
const ORD_PLAIN={1:7,10:6,13:5,12:4,11:3,9:2,8:1,7:0};
const ORD_TRUMP={11:7,9:6,1:5,10:4,13:3,12:2,8:1,7:0};
const PTS_PLAIN={1:11,10:10,13:4,12:3,11:2,9:0,8:0,7:0};
const PTS_TRUMP={11:20,9:14,1:11,10:10,13:4,12:3,8:0,7:0};
const points=(c,tr)=>(suitOf(c)===tr?PTS_TRUMP:PTS_PLAIN)[rankOf(c)];
const ord=(c,tr)=>(suitOf(c)===tr?ORD_TRUMP:ORD_PLAIN)[rankOf(c)];
const BOTS=['Hugo','Chloé','Pierre'];   // les trois habitants du village, personne d'autre

function cardName(id){
  const r=rankOf(id), s=' de '+SUIT_NAME[suitOf(id)];
  if(r===1) return "l'as"+s;
  if(r===11) return 'le valet'+s;
  if(r===12) return 'la dame'+s;
  if(r===13) return 'le roi'+s;
  return 'le '+r+s;
}
function sortHand(ids,tr){
  const k=c=>{ const s=suitOf(c); return (s===tr?-1:SUIT_ORDER[s])*20-ord(c,tr); };
  return [...ids].sort((a,b)=>k(a)-k(b));
}
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
const clone=o=>JSON.parse(JSON.stringify(o));

/* ---------- Les camps : à quatre, sièges face à face ; à trois, chacun le sien ---------- */
const teamOf=(st,seat)=>st.n===4?seat%2:seat;
const nTeams=st=>st.n===4?2:3;
const nxt=(st,s)=>(s+1)%st.n;

/* ---------- Qui gagne le pli ---------- */
function trickWinner(trick,tr){
  const lead=suitOf(trick[0].card); let best=trick[0];
  for(const t of trick.slice(1)){
    const bt=suitOf(best.card)===tr, ct=suitOf(t.card)===tr;
    if(ct&&!bt) best=t;
    else if(ct===bt&&suitOf(t.card)===suitOf(best.card)&&ord(t.card,tr)>ord(best.card,tr)) best=t;
    else if(!ct&&!bt&&suitOf(t.card)===lead&&suitOf(best.card)!==lead) best=t;
  }
  return best;
}

/* ---------- Les cartes permises : fournir, couper, monter, partenaire maître ---------- */
function legalInfo(hand,trick,tr,n,seat){
  if(!trick.length) return {ok:hand.slice(),why:null};
  const lead=suitOf(trick[0].card);
  const win=trickWinner(trick,tr);
  const tOnTable=trick.filter(t=>suitOf(t.card)===tr).map(t=>t.card);
  const best=tOnTable.length?tOnTable.reduce((a,b)=>ord(a,tr)>ord(b,tr)?a:b):null;
  const myT=hand.filter(c=>suitOf(c)===tr);
  const higher=best===null?myT:myT.filter(c=>ord(c,tr)>ord(best,tr));
  if(lead===tr){
    if(!myT.length) return {ok:hand.slice(),why:null};
    return higher.length?{ok:higher,why:'monter',best}:{ok:myT,why:'atout'};
  }
  const hasLead=hand.filter(c=>suitOf(c)===lead);
  if(hasLead.length) return {ok:hasLead,why:'fournir',lead};
  if(n===4&&win.seat===(seat+2)%4) return {ok:hand.slice(),why:'partenaire'};
  if(!myT.length) return {ok:hand.slice(),why:null};
  return higher.length?{ok:higher,why:best===null?'couper':'surcouper',lead,best}:{ok:myT,why:'souscouper',lead,best};
}
/* La bulle qui explique pourquoi une carte est refusée. */
function refusal(info,card,tr){
  const T=SUIT_NAME[tr];
  switch(info.why){
    case 'fournir': return `Il faut fournir : vous avez ${SUIT_DU[info.lead]}, la couleur demandée. Jouez ${SUIT_DU[info.lead]}.`;
    case 'monter': return suitOf(card)===tr?`Il faut monter : jouez un atout plus fort que ${cardName(info.best)}.`:`On a demandé de l'atout (${T}) : il faut en jouer, et monter sur ${cardName(info.best)}.`;
    case 'atout': return `On a demandé de l'atout (${T}) : il faut en jouer.`;
    case 'couper': return `Vous n'avez pas ${SUIT_DU[info.lead]} : il faut couper avec un atout (${T}).`;
    case 'surcouper': return suitOf(card)===tr?`Il faut monter : jouez un atout plus fort que ${cardName(info.best)}.`:`Vous n'avez pas ${SUIT_DU[info.lead]} : il faut couper, avec un atout plus fort que ${cardName(info.best)}.`;
    case 'souscouper': return `Vous n'avez pas ${SUIT_DU[info.lead]} et l'adversaire est maître : il faut jouer un atout (${T}), même plus petit.`;
  }
  return 'Cette carte ne peut pas être jouée maintenant.';
}

/* ---------- Une partie, une donne ---------- */
function newGame(players,n,target,firstDealer){
  const st={v:1,rev:0,n,target,players,scores:Array(n===4?2:3).fill(0),reserve:0,donne:0,
    gameId:Date.now()+'-'+Math.floor(Math.random()*1e6),dealer:firstDealer??Math.floor(Math.random()*n),history:[]};
  return newDonne(st,st.dealer);
}
function newDonne(prev,dealer){
  const st=clone(prev), R=st.n===4?RANKS4:RANKS3;
  const deck=shuffle([0,1,2,3].flatMap(s=>R.map(r=>s*13+r-1)));
  st.hands=Array.from({length:st.n},()=>[]);
  st.dealer=dealer; st.donne=(st.donne||0)+1;
  // 3 puis 2 cartes, en commençant par la droite du donneur
  for(const k of [3,2]) for(let i=1;i<=st.n;i++){ const s=(dealer+i)%st.n; for(let j=0;j<k;j++) st.hands[s].push(deck.pop()); }
  st.turned=deck.pop(); st.deck=deck;
  st.phase='bid'; st.bidRound=1; st.passes=0; st.turn=nxt(st,dealer);
  st.taker=null; st.trump=null; st.trick=[]; st.leader=null; st.played=[];
  st.won=Array.from({length:st.n},()=>[]); st.nWon=Array(st.n).fill(0); st.lastTrick=null;
  st.belote=null; st.say={}; st.result=null;
  st.hands=st.hands.map(h=>sortHand(h,-1));
  st.last=`Donne ${st.donne} : ${st.players[dealer].name} distribue.`;
  return st;
}
function finishDeal(st){
  st.hands[st.taker].push(st.turned);
  for(let i=1;i<=st.n;i++){ const s=(st.dealer+i)%st.n, k=s===st.taker?2:3; for(let j=0;j<k;j++) st.hands[s].push(st.deck.pop()); }
  st.hands=st.hands.map(h=>sortHand(h,st.trump));
  const K=st.trump*13+12, Q=st.trump*13+11;
  const h=st.hands.findIndex(x=>x.includes(K)&&x.includes(Q));
  st.belote=h>=0?{seat:h,said:0}:null;
  st.phase='play'; st.turn=nxt(st,st.dealer); st.leader=st.turn;
}

function scoreDonne(st){
  const tr=st.trump, n=st.n, T=nTeams(st);
  const pts=Array(T).fill(0), bel=Array(T).fill(0), tricks=Array(T).fill(0);
  st.won.forEach((cards,s)=>{ pts[teamOf(st,s)]+=cards.reduce((a,c)=>a+points(c,tr),0); });
  st.nWon.forEach((k,s)=>tricks[teamOf(st,s)]+=k);
  const der=teamOf(st,st.lastWinner); pts[der]+=10;
  if(st.belote&&st.belote.said===2) bel[teamOf(st,st.belote.seat)]=20;
  const tk=teamOf(st,st.taker), gain=Array(T).fill(0);
  let kind, winner=null;
  if(n===4){
    const df=1-tk, capot=tricks.findIndex(x=>x===8);
    if(capot>=0){ gain[capot]=252+bel[capot]; gain[1-capot]=bel[1-capot]; kind=capot===tk?'capot':'dedans-capot'; winner=capot; }
    else {
      const A=pts[tk]+bel[tk], B=pts[df]+bel[df];
      if(A>B){ kind='reussi'; gain[tk]=A; gain[df]=B; winner=tk; }
      else if(A<B){ kind='dedans'; gain[df]=162+bel[df]; gain[tk]=bel[tk]; winner=df; }
      else { kind='litige'; gain[df]=B; gain[tk]=bel[tk]; }
    }
  } else {
    const tot=pts.map((p,k)=>p+bel[k]), others=[0,1,2].filter(k=>k!==tk);
    if(others.every(k=>tot[tk]>tot[k])){ kind='reussi'; others.concat(tk).forEach(k=>gain[k]=tot[k]); winner=tk; }
    else {
      kind='dedans'; const over=others.filter(k=>tot[k]>=tot[tk]);
      const top=Math.max(...over.map(k=>tot[k])), best=over.filter(k=>tot[k]===top);
      others.forEach(k=>gain[k]=tot[k]); gain[tk]=bel[tk];
      best.forEach(k=>gain[k]+=Math.round(pts[tk]/best.length));
      winner=best[0];
    }
  }
  let reserveWon=0;
  if(winner!==null&&st.reserve){ gain[winner]+=st.reserve; reserveWon=st.reserve; st.reserve=0; }
  if(kind==='litige') st.reserve+=pts[tk];
  gain.forEach((g,k)=>st.scores[k]+=g);
  st.result={kind,pts,bel,gain,tricks,der,reserveWon,reserve:st.reserve,taker:st.taker,trump:tr};
  st.history.push({donne:st.donne,kind,gain});
  const max=Math.max(...st.scores), tops=st.scores.filter(x=>x===max).length;
  if(max>=st.target&&tops===1){ st.phase='over'; st.gameWinner=st.scores.indexOf(max); }
  else st.phase='done';
}

/* Applique un coup sur une copie. seat=null : un geste de la table (ramasser le pli, redonner). */
function apply(prev,seat,a){
  const st=clone(prev), me=seat!=null?st.players[seat]?.name:'';
  if(a.type==='bid'){
    if(st.phase!=='bid') return {error:'Le choix de l\'atout est fini.'};
    if(st.turn!==seat) return {error:`Attendez votre tour : c'est à ${st.players[st.turn].name} de parler.`};
    const ts=suitOf(st.turned);
    if(a.take){
      const s=st.bidRound===1?ts:a.suit;
      if(!(s>=0&&s<4)||(st.bidRound===2&&s===ts)) return {error:'Choisissez une autre couleur que celle de la carte retournée.'};
      st.taker=seat; st.trump=s; st.say={[seat]:'Je prends à '+SUIT_NAME[s]+' !'};
      st.last=`${me} prend : l'atout est ${SUIT_NAME[s]}.`;
      finishDeal(st); return {st};
    }
    st.say[seat]=st.bidRound===1?'Je passe.':'Je passe encore.'; st.passes++;
    st.last=`${me} passe.`;
    if(st.passes<st.n){ st.turn=nxt(st,st.turn); return {st}; }
    if(st.bidRound===1){ st.bidRound=2; st.passes=0; st.turn=nxt(st,st.dealer); st.say={}; st.last='Personne ne prend : second tour, chacun peut choisir une autre couleur.'; return {st}; }
    st.phase='nobid'; st.last='Personne n\'a pris : on redonne.'; return {st};
  }
  if(a.type==='play'){
    if(st.phase!=='play') return {error:'On ne joue pas encore les cartes.'};
    if(st.trick.length===st.n) return {error:'Le pli se ramasse.'};
    if(st.turn!==seat) return {error:`Attendez votre tour : c'est à ${st.players[st.turn].name} de jouer.`};
    const hand=st.hands[seat], k=hand.indexOf(a.card);
    if(k<0) return {error:'Cette carte n\'est plus dans votre main.'};
    const info=legalInfo(hand,st.trick,st.trump,st.n,seat);
    if(!info.ok.includes(a.card)) return {error:refusal(info,a.card,st.trump)};
    hand.splice(k,1); st.trick.push({seat,card:a.card}); st.played.push(a.card);
    if(st.trick.length===1) st.say={};
    const b=st.belote;
    if(b&&b.seat===seat&&suitOf(a.card)===st.trump&&(rankOf(a.card)===12||rankOf(a.card)===13)){
      b.said++; st.say[seat]=b.said===1?'Belote !':'Rebelote !';
    }
    st.last=`${me} joue ${cardName(a.card)}.`;
    if(st.trick.length<st.n) st.turn=nxt(st,seat);
    return {st};
  }
  if(a.type==='collect'){
    if(st.phase!=='play'||st.trick.length!==st.n) return {error:'Le pli n\'est pas complet.'};
    const w=trickWinner(st.trick,st.trump).seat;
    st.won[w].push(...st.trick.map(t=>t.card)); st.nWon[w]++;
    st.lastTrick={cards:st.trick,winner:w}; st.trick=[]; st.turn=w; st.leader=w;
    st.last=`${st.players[w].name} remporte le pli.`;
    if(st.hands.every(h=>!h.length)){ st.lastWinner=w; scoreDonne(st); }
    return {st};
  }
  if(a.type==='next'){ if(st.phase!=='done') return {error:'La donne continue.'}; return {st:newDonne(st,nxt(st,st.dealer))}; }
  if(a.type==='redeal'){ if(st.phase!=='nobid') return {error:'La donne continue.'}; return {st:newDonne(st,nxt(st,st.dealer))}; }
  if(a.type==='again'){ if(st.phase!=='over') return {error:'La partie continue.'}; return {st:newGame(st.players,st.n,st.target)}; }
  return {error:'Coup inconnu.'};
}

/* Ce qu'une place a le droit de voir : sa main, le nombre de cartes des autres, la table. */
function viewFor(st,seat){
  const v=clone(st);
  v.hands=st.hands.map((h,k)=>k===seat?h.slice():h.length);
  v.deck=st.deck.length; v.won=null; v.you=seat;
  return v;
}

/* ---------- Les joueurs automatiques : ils ne reçoivent que la vue de leur place ---------- */
function botBid(v,seat){
  const hand=[...v.hands[seat],v.turned], ts=suitOf(v.turned);
  const val=s=>hand.reduce((a,c)=>{
    const r=rankOf(c);
    if(suitOf(c)===s) return a+({11:3.5,9:2.5,1:1.5,10:1.2,13:0.8,12:0.8}[r]||0.6);
    return a+(r===1?1.1:r===10?0.3:0);
  },0);
  if(v.bidRound===1) return val(ts)>=5.6?{type:'bid',take:true}:{type:'bid',take:false};
  let best=-1,bv=0; for(let s=0;s<4;s++) if(s!==ts&&val(s)>bv){ bv=val(s); best=s; }
  return bv>=6?{type:'bid',take:true,suit:best}:{type:'bid',take:false};
}
function botPlay(v,seat){
  const hand=v.hands[seat], tr=v.trump, n=v.n, trick=v.trick;
  const L=legalInfo(hand,trick,tr,n,seat).ok;
  if(L.length===1) return {type:'play',card:L[0]};
  const seen=new Set([...v.played,...hand]);
  const R=n===4?RANKS4:RANKS3;
  // une carte est maîtresse si toutes les plus fortes de sa couleur sont déjà tombées ou dans ma main
  const master=c=>{ const s=suitOf(c); return R.every(r=>{ const o=s*13+r-1; return ord(o,tr)<=ord(c,tr)||seen.has(o); }); };
  const lowest=cs=>cs.reduce((a,b)=>(points(a,tr)-points(b,tr)||ord(a,tr)-ord(b,tr))<=0?a:b);
  const mine=teamOf(v,seat)===teamOf(v,v.taker);
  if(!trick.length){
    const myT=L.filter(c=>suitOf(c)===tr);
    const trumpsLeft=R.length-[...seen].filter(c=>suitOf(c)===tr).length;
    if(mine&&myT.length&&trumpsLeft>0){
      const m=myT.find(master); if(m) return {type:'play',card:m};
      if(seat===v.taker) return {type:'play',card:lowest(myT)};
    }
    const ms=L.filter(c=>suitOf(c)!==tr&&master(c));
    if(ms.length) return {type:'play',card:ms.reduce((a,b)=>points(a,tr)>=points(b,tr)?a:b)};
    const plain=L.filter(c=>suitOf(c)!==tr);
    return {type:'play',card:lowest(plain.length?plain:L)};
  }
  const win=trickWinner(trick,tr), last=trick.length===n-1;
  const partnerWins=n===4&&win.seat===(seat+2)%4;
  if(partnerWins&&(last||master(win.card))){
    const plain=L.filter(c=>suitOf(c)!==tr);
    if(plain.length) return {type:'play',card:plain.reduce((a,b)=>points(a,tr)>=points(b,tr)?a:b)};
    return {type:'play',card:lowest(L)};
  }
  if(partnerWins) return {type:'play',card:lowest(L)};
  const beats=L.filter(c=>trickWinner([...trick,{seat,card:c}],tr).seat===seat);
  if(beats.length){
    const sure=beats.filter(master);
    if(!last&&sure.length) return {type:'play',card:sure.reduce((a,b)=>ord(a,tr)<=ord(b,tr)?a:b)};
    return {type:'play',card:beats.reduce((a,b)=>ord(a,tr)<=ord(b,tr)?a:b)};
  }
  const plain=L.filter(c=>suitOf(c)!==tr);
  return {type:'play',card:lowest(plain.length?plain:L)};
}
function botMove(st){
  const v=viewFor(st,st.turn);
  return st.phase==='bid'?botBid(v,st.turn):botPlay(v,st.turn);
}

if(typeof module!=='undefined') module.exports={apply,newGame,newDonne,viewFor,legalInfo,refusal,trickWinner,botMove,botBid,botPlay,points,ord,teamOf,cardName,suitOf,rankOf};
