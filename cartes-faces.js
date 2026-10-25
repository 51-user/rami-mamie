/* ===== Les faces des cartes, communes au rami, au solitaire et à la belote — matière de la maquette Vallée validée par
   Florian le 25/10 (« ajoute les améliorations portées par la session qui a fini ») : papier crème grainé et toilé, tranche
   visible, liseré doré et filet, coins avec reflet, ornements Vallée (feuillage, baies, lanterne), couronne autour de l'as,
   cadre doré des figures, enseignes et chiffres peints. Le dos fleuri garde son dessin et reçoit la même matière.
   Pour rester léger sur tablette, le grain et la toile sont tissés une seule fois dans une petite image partagée
   (au lieu d'un filtre recalculé sur chaque carte).
   Les portraits des figures : cartes/figures/<r|d|v>-<coeur|carreau|pique|trefle>.webp, déclarés dans « portraits » en bas ;
   une figure sans portrait garde sa version provisoire (lettre et enseigne ornées) dans le même cadre doré.
   Usage : CartesFaces.parNumero(n, largeur) pour n = enseigne × 13 + rang − 1 (0 à 51) ; CartesFaces.dos(largeur, prénom, photo) ;
   CartesFaces.face({rang:1..13, enseigne:0..3} ou {joker:true}, largeur, nom). Enseignes : 0 pique, 1 cœur, 2 carreau, 3 trèfle. ===== */
(function(){
  const ROUGE='#C21A28', NOIR='#1E2633', OR='#C9962A';
  const INDEX="Georgia, 'Noto Serif', 'Times New Roman', serif";
  const LETTRE={1:'A',11:'V',12:'D',13:'R'};
  const NOMS=['pique','cœur','carreau','trèfle'], FICHIER=['pique','coeur','carreau','trefle'];
  /* Les quatre enseignes, dessinées dans une boîte de 100 × 100. */
  const FORME=[
    '<path d="M50 3C50 3 95 33 95 60C95 74 85 83 72 83C63 83 56 79 53 73C54 83 58 91 67 97H33C42 91 46 83 47 73C44 79 37 83 28 83C15 83 5 74 5 60C5 33 50 3 50 3Z"/>',
    '<path d="M50 94C50 94 5 63 5 33C5 16 17 5 31 5C41 5 47 11 50 20C53 11 59 5 69 5C83 5 95 16 95 33C95 63 50 94 50 94Z"/>',
    '<path d="M50 2Q69 29 91 50Q69 71 50 98Q31 71 9 50Q31 29 50 2Z"/>',
    '<circle cx="50" cy="27" r="21"/><circle cx="26" cy="58" r="21"/><circle cx="74" cy="58" r="21"/><circle cx="50" cy="52" r="13"/><path d="M46 58C46 77 41 88 31 97H69C59 88 54 77 54 58Z"/>'
  ];
  /* Les places des enseignes, comme sur un vrai jeu (carte de 250 × 350). */
  const G=82, C=125, D=168, H=72, B=278, M=175;
  const PLACES={
    2:[[C,H],[C,B]], 3:[[C,H],[C,M],[C,B]],
    4:[[G,H],[D,H],[G,B],[D,B]], 5:[[G,H],[D,H],[C,M],[G,B],[D,B]],
    6:[[G,H],[D,H],[G,M],[D,M],[G,B],[D,B]],
    7:[[G,H],[D,H],[C,123],[G,M],[D,M],[G,B],[D,B]],
    8:[[G,H],[D,H],[C,123],[G,M],[D,M],[C,227],[G,B],[D,B]],
    9:[[G,H],[D,H],[G,141],[D,141],[C,M],[G,209],[D,209],[G,B],[D,B]],
    10:[[G,H],[D,H],[C,106],[G,141],[D,141],[G,209],[D,209],[C,244],[G,B],[D,B]]
  };
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const rougeDe=s=>s===1||s===2;

  /* Enseigne peinte : dégradé, trait sombre, petit reflet. */
  function enseigne(s,x,y,t,tete){
    const r=rougeDe(s);
    return `<g transform="translate(${x-t/2} ${y-t/2}) scale(${t/100})${tete?' rotate(180 50 50)':''}">
      <g fill="url(#cf-${r?'rouge':'noir'})" stroke="${r?'#6E0A14':'#05080E'}" stroke-width="3.5" stroke-linejoin="round">${FORME[s]}</g>
      <ellipse cx="34" cy="32" rx="11" ry="6" transform="rotate(-35 34 32)" fill="#fff" fill-opacity=".5"/></g>`;
  }
  /* Ornement de coin : brin de feuillage, baies et lanterne dorée (agrandie : elle se voit dans la main). */
  function ornement(x,y,rot){
    return `<g transform="translate(${x} ${y}) rotate(${rot})">
      <path d="M0 0 Q18 4 30 -8 Q40 -18 54 -14" stroke="#6E7F3E" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      ${[[10,1,-30],[22,-3,20],[34,-11,-25],[46,-15,25]].map(([a,b,r])=>`<ellipse cx="${a}" cy="${b}" rx="6.5" ry="3" transform="rotate(${r} ${a} ${b})" fill="#7E9C5B" stroke="#4E6630" stroke-width=".9"/>`).join('')}
      <circle cx="16" cy="6" r="2.6" fill="#C9473F" stroke="#6E1A14" stroke-width=".8"/><circle cx="20" cy="8" r="2.2" fill="#D9604A" stroke="#6E1A14" stroke-width=".8"/>
      <circle cx="56" cy="0" r="12" fill="#FFD77A" fill-opacity=".28"/>
      <line x1="56" y1="-16" x2="56" y2="-10" stroke="#5a4020" stroke-width="1.4"/>
      <path d="M48.5 -9 L56 -15 L63.5 -9Z" fill="#7A5418"/>
      <rect x="50" y="-9" width="12" height="15" rx="2" fill="#FFD77A" stroke="#7A5418" stroke-width="1.4"/>
      <rect x="53" y="-6" width="6" height="9" rx="1.2" fill="#FFF3C8"/>
      <rect x="49" y="6" width="14" height="2.6" rx="1" fill="#7A5418"/></g>`;
  }

  /* La matière partagée : papier, grain et toile tissés une fois, dégradés, cadres, fleurs du dos. */
  function tisser(){
    try{
      const c=document.createElement('canvas'); c.width=250; c.height=352;
      const g=c.getContext('2d'); let s=7;
      const hasard=()=>((s=(s*16807)%2147483647)/2147483647);
      for(let y=0;y<352;y+=2){ g.fillStyle=`rgba(110,80,40,${(.03+hasard()*.05).toFixed(3)})`; g.fillRect(0,y,250,1); }
      for(let x=0;x<250;x+=2){ g.fillStyle=`rgba(110,80,40,${(.02+hasard()*.04).toFixed(3)})`; g.fillRect(x,0,1,352); }
      for(let k=0;k<5200;k++){ const v=hasard(); g.fillStyle=v<.7?`rgba(95,65,30,${(.05+hasard()*.12).toFixed(3)})`:`rgba(255,255,255,${(.25+hasard()*.4).toFixed(3)})`; g.fillRect(hasard()*250,hasard()*352,v<.9?1:1.6,1); }
      return c.toDataURL('image/png');
    }catch(e){ return ''; }
  }
  function installer(){
    if(document.getElementById('cf-defs')||!document.body) return;
    const matiere=tisser();
    const d=document.createElement('div');
    d.innerHTML=`<svg id="cf-defs" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
      <linearGradient id="cf-papier" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#FFFDF6"/><stop offset=".6" stop-color="#FCF3E0"/><stop offset="1" stop-color="#F5E8CC"/></linearGradient>
      <pattern id="cf-matiere" width="250" height="352" patternUnits="userSpaceOnUse">${matiere?`<image href="${matiere}" width="250" height="352"/>`:''}</pattern>
      <linearGradient id="cf-or" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A8741E"/><stop offset=".3" stop-color="#F3D27C"/><stop offset=".55" stop-color="#B88A2E"/><stop offset=".8" stop-color="#F6DC92"/><stop offset="1" stop-color="#9C6A1A"/></linearGradient>
      <linearGradient id="cf-rouge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2393C"/><stop offset=".55" stop-color="#C21A28"/><stop offset="1" stop-color="#8E0F1C"/></linearGradient>
      <linearGradient id="cf-noir" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A4558"/><stop offset=".55" stop-color="#1E2633"/><stop offset="1" stop-color="#0E131C"/></linearGradient>
      <linearGradient id="cf-reflet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".18" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="cf-cadre-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBEADF"/><stop offset=".5" stop-color="#F3D6C6"/><stop offset="1" stop-color="#FBEADF"/></linearGradient>
      <linearGradient id="cf-cadre-n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF0EE"/><stop offset=".5" stop-color="#DCE0E2"/><stop offset="1" stop-color="#EEF0EE"/></linearGradient>
      <clipPath id="cf-haut"><rect x="62" y="36" width="126" height="139"/></clipPath>
      <pattern id="cf-fleurs" width="46" height="46" patternUnits="userSpaceOnUse" viewBox="0 0 22 22">
        <rect width="22" height="22" fill="#EED9DC"/>
        <g fill="#C2546B"><circle cx="6" cy="3.6" r="2"/><circle cx="8.4" cy="5.4" r="2"/><circle cx="7.5" cy="8.2" r="2"/><circle cx="4.5" cy="8.2" r="2"/><circle cx="3.6" cy="5.4" r="2"/></g>
        <circle cx="6" cy="6" r="1.4" fill="#F3C14B"/>
        <g fill="#7E9C5B"><ellipse cx="15" cy="15" rx="2.4" ry="1.1" transform="rotate(-35 15 15)"/><ellipse cx="18.5" cy="18" rx="2.4" ry="1.1" transform="rotate(35 18.5 18)"/></g>
        <g fill="#E58FA0"><circle cx="17" cy="9" r="1.2"/><circle cx="18.6" cy="10.2" r="1.2"/><circle cx="17.9" cy="12" r="1.2"/><circle cx="16.1" cy="12" r="1.2"/><circle cx="15.4" cy="10.2" r="1.2"/></g>
        <circle cx="17" cy="10.8" r=".8" fill="#FFF3C4"/>
      </pattern>
      <clipPath id="cf-medaillon"><ellipse cx="125" cy="145" rx="66" ry="86"/></clipPath>
    </defs></svg>`;
    document.body.appendChild(d.firstElementChild);
  }

  /* Le papier : tranche visible, carton crème, grain et toile, liseré doré, filet, reflet. */
  const papier=`<rect x="1.5" y="4.5" width="247" height="347" rx="16" fill="#C9B387"/>
    <rect x="1.5" y="3" width="247" height="347" rx="16" fill="#E2D2AC"/>
    <rect x="1.5" y="1.5" width="247" height="347" rx="16" fill="url(#cf-papier)" stroke="#8F7A52" stroke-width="1.6"/>
    <rect x="1.5" y="1.5" width="247" height="347" rx="16" fill="url(#cf-matiere)"/>
    <rect x="9" y="9" width="232" height="332" rx="11" fill="none" stroke="url(#cf-or)" stroke-width="2.4"/>
    <rect x="12.5" y="12.5" width="225" height="325" rx="9" fill="none" stroke="#B88A2E" stroke-opacity=".45" stroke-width=".8"/>`;
  const reflet=`<rect x="1.5" y="1.5" width="247" height="347" rx="16" fill="url(#cf-reflet)"/>`;
  const ouvre=(w,nom)=>`<svg class="cf" width="${w}" height="${Math.round(w*1.4)}" viewBox="0 0 250 352" role="img" aria-label="${esc(nom)}">`;

  /* L'index peint, dans deux coins opposés, et les ornements dans les deux autres. */
  function coin(L,s){
    const r=rougeDe(s), dix=L==='10';
    return `<text x="31" y="60" font-size="${dix?48:54}" text-anchor="middle" font-family="${INDEX}" font-weight="700" fill="url(#cf-${r?'rouge':'noir'})" stroke="${r?'#6E0A14':'#05080E'}" stroke-width="1.2"${dix?' textLength="48" lengthAdjust="spacingAndGlyphs"':''}>${L}</text>${enseigne(s,31,88,32)}`;
  }
  const coins=(L,s)=>coin(L,s)+`<g transform="rotate(180 125 175)">${coin(L,s)}</g>`+ornement(186,40,0)+`<g transform="rotate(180 125 175)">${ornement(186,40,0)}</g>`;

  /* L'as : grande enseigne dans une couronne de feuillage et de baies. */
  function couronne(){
    const feuilles=[...Array(18)].map((_,k)=>{ const a=k/18*2*Math.PI, x=125+Math.cos(a)*86, y=175+Math.sin(a)*96, r=a*180/Math.PI+90;
      return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="11" ry="4.6" transform="rotate(${r.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${k%2?'#7E9C5B':'#94B06A'}" stroke="#4E6630" stroke-width="1"/>`; }).join('');
    const baies=[0,3,6,9,12,15].map(k=>{ const a=k/18*2*Math.PI+.17; return `<circle cx="${(125+Math.cos(a)*88).toFixed(1)}" cy="${(175+Math.sin(a)*98).toFixed(1)}" r="4" fill="#D9604A" stroke="#6E1A14" stroke-width="1"/>`; }).join('');
    return `<ellipse cx="125" cy="175" rx="86" ry="96" fill="none" stroke="#B88A2E" stroke-opacity=".5" stroke-width="1.2"/>${feuilles}${baies}`;
  }

  /* Les figures : cadre doré à deux têtes, portrait s'il existe, sinon lettre et enseigne ornées. */
  function coiffe(r,col){
    if(r===13) return `<path d="M90 90L84 56L103 72L125 48L147 72L166 56L160 90Z" fill="url(#cf-or)" stroke="${col}" stroke-width="2.6" stroke-linejoin="round"/>
      <rect x="90" y="86" width="70" height="9" rx="3" fill="${col}"/>`;
    if(r===12) return `<path d="M92 92Q125 44 158 92Z" fill="url(#cf-or)" stroke="${col}" stroke-width="2.6"/><circle cx="125" cy="60" r="6" fill="${col}"/><rect x="90" y="88" width="70" height="7" rx="3" fill="${col}"/>`;
    return `<path d="M88 92Q90 64 125 62Q158 64 162 92Z" fill="url(#cf-or)" stroke="${col}" stroke-width="2.6"/><rect x="88" y="88" width="74" height="7" rx="3" fill="${col}"/>`;
  }
  function figure(r,s){
    const rouge=rougeDe(s), col=rouge?'#B3121F':'#141A24', L=LETTRE[r], cle=`${L==='R'?'r':L==='D'?'d':'v'}-${FICHIER[s]}`;
    const moitie=CartesFaces.portraits.includes(cle)
      ?`<image href="${CartesFaces.cheminFigures}${cle}.webp" x="62" y="36" width="126" height="139" preserveAspectRatio="xMidYMin slice" clip-path="url(#cf-haut)"/>`
      :`${coiffe(r,col)}<text x="106" y="160" font-size="66" text-anchor="middle" font-family="${INDEX}" font-weight="700" fill="url(#cf-${rouge?'rouge':'noir'})" stroke="${col}" stroke-width="1">${L}</text>${enseigne(s,158,138,40)}`;
    return `<rect x="54" y="28" width="142" height="294" rx="9" fill="url(#cf-cadre-${rouge?'r':'n'})" stroke="url(#cf-or)" stroke-width="3"/>
      ${moitie}<g transform="rotate(180 125 175)">${moitie}</g>
      <rect x="62" y="36" width="126" height="278" rx="5" fill="none" stroke="url(#cf-or)" stroke-width="2.4"/>
      <line x1="62" y1="175" x2="188" y2="175" stroke="url(#cf-or)" stroke-width="2.4"/>
      ${enseigne(s,170,160,22)}<g transform="rotate(180 125 175)">${enseigne(s,170,160,22)}</g>`;
  }

  function face(c,w,nom){
    if(c.joker){
      const lettres=[...'JOKER'].map((x,k)=>`<text x="29" y="${48+k*33}" font-size="30" text-anchor="middle" font-family="${INDEX}" font-weight="700" fill="url(#cf-rouge)" stroke="#6E0A14" stroke-width="1">${x}</text>`).join('');
      return `${ouvre(w,nom||'joker')}${papier}${lettres}<g transform="rotate(180 125 175)">${lettres}</g>
        <path d="M125 120L80 92Q66 140 96 176ZM125 120L170 92Q184 140 154 176ZM125 120L125 70Q100 110 105 176L145 176Q150 110 125 70Z" fill="url(#cf-rouge)" stroke="#7A0A1C" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M100 120L125 70L150 120Z" fill="url(#cf-or)" opacity=".9"/>
        <circle cx="80" cy="92" r="9" fill="url(#cf-or)" stroke="#7A0A1C" stroke-width="2"/><circle cx="170" cy="92" r="9" fill="url(#cf-or)" stroke="#7A0A1C" stroke-width="2"/><circle cx="125" cy="68" r="9" fill="url(#cf-or)" stroke="#7A0A1C" stroke-width="2"/>
        <rect x="90" y="174" width="70" height="16" rx="7" fill="url(#cf-or)" stroke="#7A0A1C" stroke-width="2"/>
        <polygon points="125,205 136,236 169,236 142,255 152,287 125,268 98,287 108,255 81,236 114,236" fill="url(#cf-or)" stroke="${ROUGE}" stroke-width="3" stroke-linejoin="round"/>${reflet}</svg>`;
    }
    const r=c.rang, s=c.enseigne, L=LETTRE[r]||String(r);
    let milieu;
    if(r===1) milieu=couronne()+enseigne(s,125,175,s===2?100:112);
    else if(r<=10) milieu=PLACES[r].map(([x,y])=>enseigne(s,x,y,r>=9?44:48,y>M)).join('');
    else milieu=figure(r,s);
    return `${ouvre(w,nom||'')}${papier}${coins(L,s)}${milieu}${reflet}</svg>`;
  }

  function parNumero(n,w){
    const s=Math.floor(n/13), r=n%13+1;
    const nom=(r===1?"l'as":r===11?'le valet':r===12?'la dame':r===13?'le roi':'le '+r)+' de '+NOMS[s];
    return face({rang:r,enseigne:s},w,nom);
  }

  /* Le dos fleuri à son prénom, cadré de bois, avec la même matière que les faces (ou une photo dans le médaillon). */
  function dos(w,prenom,photo){
    const n=prenom||'', petit=w<50, len=n.length, t=len>9?28:33;
    const fleur=`<g transform="translate(125 145) scale(2.5)"><g fill="#C2546B" stroke="#7A2436" stroke-width=".9">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-11" rx="7" ry="10" transform="rotate(${a})"/>`).join('')}</g><circle r="6" fill="#F3C14B" stroke="#9A6A14" stroke-width=".8"/><circle r="2.4" cx="-2" cy="-2" fill="#fff" fill-opacity=".5"/></g>`;
    const dedans=photo?`<image href="${esc(photo)}" x="59" y="59" width="132" height="172" preserveAspectRatio="xMidYMid slice" clip-path="url(#cf-medaillon)"/>`:fleur;
    const ruban=petit||!n?'':`<rect x="34" y="252" width="182" height="56" rx="12" fill="#FBF0D2" stroke="#6B4022" stroke-width="3.5"/>
      <text x="125" y="291" font-size="${t}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" fill="#6B2A2A"${len>11?' textLength="166" lengthAdjust="spacingAndGlyphs"':''}>${esc(n)}</text>`;
    return `${ouvre(w,'dos de carte')}<rect x="1.5" y="4.5" width="247" height="347" rx="16" fill="#5A3416"/>
      <rect x="1.5" y="1.5" width="247" height="347" rx="16" fill="#A86E3C" stroke="#4A2A12" stroke-width="4"/>
      <rect x="1.5" y="1.5" width="247" height="347" rx="16" fill="url(#cf-matiere)"/>
      <rect x="14" y="14" width="222" height="322" rx="9" fill="url(#cf-fleurs)" stroke="#4A2A12" stroke-width="4"/>
      <rect x="20" y="20" width="210" height="310" rx="7" fill="none" stroke="url(#cf-or)" stroke-width="2"/>
      ${petit?'':`<ellipse cx="125" cy="145" rx="72" ry="92" fill="#FBF0D2" stroke="#6B4022" stroke-width="4.5"/><ellipse cx="125" cy="145" rx="64" ry="84" fill="none" stroke="url(#cf-or)" stroke-width="2"/>${dedans}`}${ruban}${reflet}</svg>`;
  }

  /* Les portraits déjà déposés dans cartes/figures (une figure absente de cette liste garde sa version provisoire). */
  const CartesFaces={face,dos,parNumero,installer,ROUGE,NOIR,RATIO:1.4,cheminFigures:'cartes/figures/',
    portraits:['r-coeur','r-carreau','r-pique','r-trefle','d-coeur','d-pique','d-trefle','v-coeur','v-carreau','v-pique','v-trefle']};
  window.CartesFaces=CartesFaces;
  if(document.body) installer(); else addEventListener('DOMContentLoaded',installer);
})();
