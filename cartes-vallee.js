/* ===== Le jeu d'abord, et la sensation des cartes (25/10, Florian : « elle aime avoir les cartes dans sa main et bien
   les voir »). Ce fichier ne touche ni aux règles, ni aux coups, ni à la liaison entre tablettes : il dessine les cartes
   avec cartes-faces.js, tient la main du rami en éventail (toucher ou glisser, réordonner), fait glisser et retourner
   les cartes, joue un petit bruit de carte, bat le jeu en début de partie et fait s'envoler des cartes quand on gagne.
   Les coups passent toujours par les boutons du jeu. Chargé après le jeu et après cartes-faces.js, dans index.html. ===== */
(function(){
  if(!window.CartesFaces) return;
  const doux=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('cv-js');
  CartesFaces.installer();

  /* ---------- Les cartes dessinées par cartes-faces.js ---------- */
  window.cardSVG=function(id,w){
    if(id==null) return backSVG(w);
    if(isJoker(id)) return CartesFaces.face({joker:true},w,'joker');
    return CartesFaces.face({rang:rankOf(id),enseigne:suitOf(id)},w,cardName(id));
  };
  window.backSVG=function(w,name){ return CartesFaces.dos(w,name===undefined?backName():name,PHOTO_DOS); };

  /* ---------- La main du rami : grande, en éventail ---------- */
  window.handLayout=function(n){
    const avail=app.clientWidth-24, portrait=innerHeight>innerWidth;
    let W=innerHeight*(portrait?0.24:0.29)/1.4;
    W=Math.min(W, avail/(1.45+0.2*Math.max(n-1,0)));
    return {W:Math.floor(W), per:Math.max(n,1), step:0.22*W};
  };
  let ordre=[];
  function disposer(glisser){
    const main=app.querySelector('.hand'); if(!main) return;
    const cartes=[...main.querySelectorAll('.card')], n=cartes.length; if(!n) return;
    /* une main fraîchement dessinée se pose d'un coup ; seul un rangement glisse */
    if(!glisser){ main.classList.add('pose'); requestAnimationFrame(()=>requestAnimationFrame(()=>main.classList.remove('pose'))); }
    main.classList.add('eventail');
    const ids=cartes.map(c=>+c.dataset.id);
    if(ordre.filter(i=>ids.includes(i)).length<ids.length/2) ordre=[];
    ordre=ordre.filter(i=>ids.includes(i)).concat(ids.filter(i=>!ordre.includes(i)));
    const W=parseFloat(cartes[0].querySelector('svg').getAttribute('width')), H=W*1.4;
    const ouvert=Math.min(innerHeight>innerWidth?16:24,(n-1)*2.1), penche=Math.sin(ouvert/2*Math.PI/180);
    const large=main.clientWidth, bord=H*1.2*penche+8, pas=n>1?Math.min(W*0.62,(large-W-2*bord)/(n-1)):0;
    const creux=W*0.12, x0=(large-(W+pas*(n-1)))/2, marge=38;
    const parId=new Map(cartes.map(c=>[+c.dataset.id,c]));
    ordre.forEach((id,i)=>{
      const c=parId.get(id), t=n>1?i/(n-1)*2-1:0;
      c.style.setProperty('--x',(x0+i*pas)+'px');
      c.style.setProperty('--y',(marge+creux*t*t)+'px');
      c.style.setProperty('--r',(t*ouvert/2)+'deg');
      c.style.zIndex=i+1;
    });
    main.style.height=(marge+H+creux+W*penche+14)+'px';
  }

  /* Toucher choisit (comme avant) ; glisser pose : vers la défausse, sur une combinaison, sur le tapis, ou dans la main. */
  let tenue=null, sansClic=false;
  const bouton=id=>app.querySelector(`.hand .card[data-id="${id}"]`);
  const choisies=()=>[...app.querySelectorAll('.hand .card.sel')].map(b=>+b.dataset.id);
  function seule(id){
    const s=choisies();
    if(s.length===1&&s[0]===id) return;
    if(s.length) app.querySelector('[data-act="clear"]')?.click();
    bouton(id)?.click();
  }
  function lacher(id,x,y){
    const sous=document.elementFromPoint(x,y);
    if(!sous) return;
    if(sous.closest('.pile[data-from="discard"]')){ seule(id); app.querySelector('[data-act="discard"]')?.click(); return; }
    const g=sous.closest('.grp:not(.staged)');
    if(g){
      const k=[...app.querySelectorAll('.grp:not(.staged)')].indexOf(g);
      if(!choisies().includes(id)) seule(id);
      const cible=app.querySelectorAll('.grp:not(.staged)')[k];
      if(cible&&cible.classList.contains('can')) cible.click();
      return;
    }
    if(sous.closest('.board')){ if(choisies().includes(id)) app.querySelector('[data-act="pose"]')?.click(); return; }
    if(sous.closest('.hand')){
      const autres=ordre.filter(i=>i!==id), places=autres.map(i=>{ const r=bouton(i).getBoundingClientRect(); return r.left+r.width/2; });
      ordre=autres; ordre.splice(places.filter(p=>p<x).length,0,id); disposer(true); claque(0,.12);
    }
  }
  app.addEventListener('pointerdown',e=>{
    audio();
    const c=e.target.closest('.hand.eventail .card'); if(!c) return;
    tenue={c,id:+c.dataset.id,x0:e.clientX,y0:e.clientY,pid:e.pointerId,bouge:false};
  });
  addEventListener('pointermove',e=>{
    if(!tenue||e.pointerId!==tenue.pid) return;
    const dx=e.clientX-tenue.x0, dy=e.clientY-tenue.y0;
    if(!tenue.bouge){ if(Math.hypot(dx,dy)<12) return; tenue.bouge=true; tenue.c.classList.add('tenue'); }
    tenue.c.style.transform=`translate(calc(var(--x) + ${dx}px),calc(var(--y) + ${dy}px)) scale(1.1)`;
  });
  addEventListener('pointerup',e=>{
    if(!tenue||e.pointerId!==tenue.pid) return;
    const t=tenue; tenue=null;
    if(!t.bouge) return;
    t.c.style.pointerEvents='none';
    const x=e.clientX, y=e.clientY;
    t.c.classList.remove('tenue'); t.c.style.transform='';
    if(t.c.isConnected) lacher(t.id,x,y);
    t.c.style.pointerEvents='';
    /* le clic que le navigateur envoie après un glisser ne doit pas choisir une carte de plus */
    sansClic=true; setTimeout(()=>{ sansClic=false; },0);
  });
  addEventListener('pointercancel',()=>{ if(tenue){ tenue.c.classList.remove('tenue'); tenue.c.style.transform=''; tenue=null; } });
  document.addEventListener('click',e=>{ if(sansClic){ e.stopPropagation(); e.preventDefault(); } },true);

  /* ---------- Le petit bruit de carte, synthétisé ---------- */
  let ctx=null;
  function audio(){
    try{ if(!ctx) ctx=new (window.AudioContext||window.webkitAudioContext)(); if(ctx.state==='suspended') ctx.resume(); }catch{ ctx=null; }
    return ctx;
  }
  function claque(quand=0,force=.2,note=2600){
    if(!ctx||ctx.state!=='running') return;
    const d=.07, buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*d),ctx.sampleRate), b=buf.getChannelData(0);
    for(let i=0;i<b.length;i++) b[i]=(Math.random()*2-1)*Math.pow(1-i/b.length,3);
    const src=ctx.createBufferSource(), f=ctx.createBiquadFilter(), g=ctx.createGain();
    src.buffer=buf; f.type='bandpass'; f.frequency.value=note; f.Q.value=.9; g.gain.value=force;
    src.connect(f).connect(g).connect(ctx.destination); src.start(ctx.currentTime+quand);
  }

  /* ---------- Les cartes qui glissent et qui se retournent ---------- */
  function releve(){
    const vus=new Map(), deux=new Set();
    for(const s of app.querySelectorAll('svg[aria-label]')){
      const k=s.getAttribute('aria-label');
      if(k==='dos de carte'||s.closest('.panel')) continue;
      if(vus.has(k)) deux.add(k); else vus.set(k,s);
    }
    deux.forEach(k=>vus.delete(k));
    return vus;
  }
  function glisse(avant){
    if(!avant.size) return;
    const apres=releve(); let nouvelles=0, bouge=false, tourne=false;
    apres.forEach((s,k)=>{ if(!avant.has(k)) nouvelles++; });
    apres.forEach((s,k)=>{
      const vieux=avant.get(k);
      if(!vieux){
        if(nouvelles<4){ tourne=true; if(doux) s.animate([{transform:'perspective(700px) rotateY(90deg)'},{transform:'none'}],{duration:280,easing:'ease-out'}); }
        return;
      }
      const b=s.getBoundingClientRect(), dx=vieux.left-b.left, dy=vieux.top-b.top;
      if(Math.hypot(dx,dy)<40) return;
      bouge=true; if(!doux) return;
      const btn=s.parentElement, z=btn.style.zIndex;
      btn.style.zIndex=19;
      s.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'none'}],{duration:320,easing:'cubic-bezier(.2,.8,.3,1)'})
        .finished.then(()=>{ btn.style.zIndex=z; },()=>{ btn.style.zIndex=z; });
    });
    if(bouge) claque(0,.22); else if(tourne) claque(.05,.14,3200);
  }

  /* ---------- Le battage en début de partie ---------- */
  let battu='';
  function battage(){
    claque(.25,.12,2200); for(let k=0;k<20;k++) claque(.3+k*.035,.1,1800+Math.random()*1600);
    if(!doux) return;
    const voile=document.createElement('div'); voile.className='envol';
    const W=Math.round(Math.min(130,innerWidth*0.15)), H=W*1.4, cx=innerWidth/2-W/2, cy=innerHeight/2-H/2;
    for(let k=0;k<14;k++){
      voile.insertAdjacentHTML('beforeend',CartesFaces.dos(W,''));
      const c=voile.lastElementChild, cote=k%2?1:-1, haut=-k*1.2;
      const ici=`translate(${cx}px,${cy+haut}px)`, ecart=`translate(${cx+cote*W*0.75}px,${cy+haut+8}px) rotate(${cote*9}deg)`;
      c.animate([{transform:ici,opacity:0},{transform:ici,opacity:1,offset:.12},{transform:ecart,offset:.32},{transform:ici,offset:.5},
        {transform:ecart,offset:.68},{transform:ici,offset:.86,opacity:1},{transform:ici,opacity:0}],{duration:1500,delay:k*12,easing:'ease-in-out',fill:'both'});
    }
    document.body.appendChild(voile);
    setTimeout(()=>voile.remove(),1800);
  }
  function battreSiDebut(){
    let cle='';
    if(mode==='solo'&&SOL&&SOL.moves===0&&!SOL.won) cle='s:'+SOL.stock.join(',');
    else if(screen()==='game'&&S&&S.turnNo===1&&!S.took) cle='r:'+word+':'+S.round;
    if(cle&&cle!==battu) battage();
    battu=cle||battu;
  }

  /* ---------- L'envol des cartes quand on gagne ---------- */
  let fete='';
  const cleVictoire=()=>(mode==='solo'&&SOL&&SOL.won)?'solo':(S&&S.phase==='over'&&S.result&&S.result.winner===mySeat)?'rami-'+(S.carnet||[]).length:'';
  function envol(){
    claque(0,.15); claque(.12,.15); claque(.24,.15);
    if(!doux) return;
    const voile=document.createElement('div'); voile.className='envol';
    const W=Math.round(Math.min(120,innerWidth*0.13)), H=Math.round(W*1.4);
    for(let k=0;k<26;k++){
      voile.insertAdjacentHTML('beforeend',cardSVG((k*7+Math.floor(Math.random()*52))%52,W));
      const c=voile.lastElementChild;
      const x0=innerWidth*(0.2+Math.random()*0.6)-W/2, y0=innerHeight+20;
      const x1=x0+(Math.random()-.5)*innerWidth*0.9, y1=-H-40-Math.random()*innerHeight*0.3;
      const r0=(Math.random()-.5)*40, r1=r0+(Math.random()-.5)*540;
      c.animate([
        {transform:`translate(${x0}px,${y0}px) rotate(${r0}deg)`,opacity:1},
        {transform:`translate(${(x0+x1)/2}px,${innerHeight*0.25}px) rotate(${(r0+r1)/2}deg)`,opacity:1,offset:.55},
        {transform:`translate(${x1}px,${y1}px) rotate(${r1}deg)`,opacity:.2}
      ],{duration:1900+Math.random()*900,delay:k*55,easing:'cubic-bezier(.3,.6,.4,1)',fill:'both'});
    }
    document.body.appendChild(voile);
    setTimeout(()=>voile.remove(),4800);
  }
  function victoire(){ const cle=cleVictoire(); if(cle&&cle!==fete) envol(); fete=cle; }

  /* ---------- ⚙ : les règles et le carnet rangés dans la fenêtre des réglages ; la confirmation de « Nouvelle partie » ---------- */
  function range(){
    const p=app.querySelector('.panel[aria-label="Mes cartes"]');
    if(p&&screen()==='game'&&!p.querySelector('.rangement'))
      p.querySelector('[data-act="close"]').insertAdjacentHTML('beforebegin','<div class="rangement"><button class="big alt" data-act="regles">Les règles</button><button class="big alt" data-act="carnet">Le carnet des victoires</button></div>');
    const n=app.querySelector('.soltop [data-act="solonew"]');
    if(n) n.classList.toggle('confirme',/Toucher/.test(n.textContent));
  }

  const dessine=window.render;
  window.render=function(force){
    const avant=new Map();
    releve().forEach((s,k)=>avant.set(k,s.getBoundingClientRect()));
    dessine(force);
    range(); disposer(); glisse(avant); battreSiDebut(); victoire();
  };
  fete=cleVictoire();
  render(true);
})();
