/* ===== Les faces des cartes, communes au rami, au solitaire et à la belote (25/10, Florian : « donne moi un putain de
   jeu de cartes qui aille plus loin que windows et surtout pas plus bas »).
   Format 2,5 × 3,5, coins arrondis, papier crème au grain très léger et fin liseré intérieur, index gros et nets dans
   deux coins, enseignes classiques à leur vraie place de 2 à 10, grande enseigne pour l'as, figures en cadre tête-bêche.
   Les portraits des figures : cartes/figures/<r|d|v>-<coeur|carreau|pique|trefle>.webp, déclarés dans la liste « portraits » en
   bas de ce fichier ; tant qu'un portrait manque, la figure provisoire (lettre et enseigne ornées) reste à sa place.
   Usage : CartesFaces.parNumero(n, largeur) pour n = enseigne × 13 + rang − 1 (0 à 51) ; CartesFaces.dos(largeur, prénom, photo) ;
   CartesFaces.face({rang:1..13, enseigne:0..3} ou {joker:true}, largeur, nom). Enseignes : 0 pique, 1 cœur, 2 carreau, 3 trèfle. ===== */
(function(){
  const ROUGE='#D0102A', NOIR='#141414', OR='#C9962A';
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
  const enseigne=(s,x,y,t,tete)=>`<g transform="translate(${x-t/2} ${y-t/2}) scale(${t/100})${tete?' rotate(180 50 50)':''}">${FORME[s]}</g>`;

  /* Les dessins partagés (papier, grain, cadres, fleurs du dos), posés une seule fois dans la page. */
  function installer(){
    if(document.getElementById('cf-defs')||!document.body) return;
    const d=document.createElement('div');
    d.innerHTML=`<svg id="cf-defs" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
      <linearGradient id="cf-papier" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#FFFEF8"/><stop offset="1" stop-color="#F7F0DF"/></linearGradient>
      <pattern id="cf-grain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="2" r=".55" fill="#7A5A2A" fill-opacity=".07"/><circle cx="5" cy="5.5" r=".5" fill="#7A5A2A" fill-opacity=".06"/><circle cx="5.5" cy="1" r=".45" fill="#FFF" fill-opacity=".6"/></pattern>
      <linearGradient id="cf-cadre-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCEDE6"/><stop offset=".5" stop-color="#F6DCD0"/><stop offset="1" stop-color="#FCEDE6"/></linearGradient>
      <linearGradient id="cf-cadre-n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3EFE4"/><stop offset=".5" stop-color="#E6DFCD"/><stop offset="1" stop-color="#F3EFE4"/></linearGradient>
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

  const papier=`<rect x="1.5" y="1.5" width="247" height="347" rx="16" fill="url(#cf-papier)" stroke="#9C8A68" stroke-width="2"/>
    <rect x="1.5" y="1.5" width="247" height="347" rx="16" fill="url(#cf-grain)"/>
    <rect x="9" y="9" width="232" height="332" rx="11" fill="none" stroke="#CDBB93" stroke-width="1.2"/>`;
  const ouvre=(w,nom)=>`<svg class="cf" width="${w}" height="${Math.round(w*1.4)}" viewBox="0 0 250 350" role="img" aria-label="${esc(nom)}">`;

  /* L'index : la valeur en gros, l'enseigne dessous, dans deux coins opposés. */
  function coin(L,s,col){
    const dix=L==='10';
    return `<text x="30" y="58" font-size="${dix?46:52}" text-anchor="middle" font-family="${INDEX}" font-weight="700" fill="${col}"${dix?' textLength="46" lengthAdjust="spacingAndGlyphs"':''}>${L}</text>${enseigne(s,30,86,32)}`;
  }

  /* Les figures : cadre à deux têtes ; le portrait s'il existe, sinon la lettre et l'enseigne ornées. */
  function coiffe(r,col){
    if(r===13) return `<path d="M90 90L84 56L103 72L125 48L147 72L166 56L160 90Z" fill="${OR}" stroke="${col}" stroke-width="2.6" stroke-linejoin="round"/>
      <circle cx="84" cy="54" r="4.5" fill="${OR}" stroke="${col}" stroke-width="2"/><circle cx="125" cy="46" r="5.5" fill="${OR}" stroke="${col}" stroke-width="2"/><circle cx="166" cy="54" r="4.5" fill="${OR}" stroke="${col}" stroke-width="2"/>
      <rect x="90" y="86" width="70" height="9" rx="3" fill="${col}"/><circle cx="108" cy="90.5" r="2.2" fill="${OR}"/><circle cx="125" cy="90.5" r="2.2" fill="${OR}"/><circle cx="142" cy="90.5" r="2.2" fill="${OR}"/>`;
    if(r===12) return `<path d="M92 92Q125 44 158 92Z" fill="${OR}" stroke="${col}" stroke-width="2.6"/><circle cx="125" cy="60" r="6" fill="${col}"/>
      <circle cx="106" cy="79" r="3.5" fill="${col}"/><circle cx="144" cy="79" r="3.5" fill="${col}"/><rect x="90" y="88" width="70" height="7" rx="3" fill="${col}"/>`;
    return `<path d="M88 92Q90 64 125 62Q158 64 162 92Z" fill="${OR}" stroke="${col}" stroke-width="2.6"/>
      <path d="M148 66Q176 42 184 60Q168 60 156 76Z" fill="${col}" fill-opacity=".85"/><rect x="88" y="88" width="74" height="7" rx="3" fill="${col}"/>`;
  }
  function figure(r,s,col,rouge){
    const L=LETTRE[r], cle=`${L==='R'?'r':L==='D'?'d':'v'}-${FICHIER[s]}`;
    const image=CartesFaces.portraits.includes(cle)?`<image href="${CartesFaces.cheminFigures}${cle}.webp" x="62" y="36" width="126" height="139" preserveAspectRatio="xMidYMin slice" clip-path="url(#cf-haut)"/>`:'';
    const moitie=`${coiffe(r,col)}
      <text x="106" y="160" font-size="66" text-anchor="middle" font-family="${INDEX}" font-weight="700" fill="${col}">${L}</text>${enseigne(s,158,138,40)}${image}`;
    return `<rect x="56" y="30" width="138" height="290" rx="8" fill="url(#cf-cadre-${rouge?'r':'n'})" stroke="${col}" stroke-width="2.6"/>
      ${moitie}<g transform="rotate(180 125 175)">${moitie}</g>
      <rect x="62" y="36" width="126" height="278" rx="5" fill="none" stroke="${OR}" stroke-width="2"/>
      <line x1="62" y1="175" x2="188" y2="175" stroke="${col}" stroke-width="2"/>`;
  }

  function face(c,w,nom){
    if(c.joker){
      const lettres=[...'JOKER'].map((x,k)=>`<text x="29" y="${48+k*33}" font-size="30" text-anchor="middle" font-family="${INDEX}" font-weight="700" fill="${ROUGE}">${x}</text>`).join('');
      return `${ouvre(w,nom||'joker')}${papier}${lettres}<g transform="rotate(180 125 175)">${lettres}</g>
        <path d="M125 120L80 92Q66 140 96 176ZM125 120L170 92Q184 140 154 176ZM125 120L125 70Q100 110 105 176L145 176Q150 110 125 70Z" fill="${ROUGE}" stroke="#7A0A1C" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M100 120L125 70L150 120Z" fill="${OR}" opacity=".9"/>
        <circle cx="80" cy="92" r="9" fill="${OR}" stroke="#7A0A1C" stroke-width="2"/><circle cx="170" cy="92" r="9" fill="${OR}" stroke="#7A0A1C" stroke-width="2"/><circle cx="125" cy="68" r="9" fill="${OR}" stroke="#7A0A1C" stroke-width="2"/>
        <rect x="90" y="174" width="70" height="16" rx="7" fill="${OR}" stroke="#7A0A1C" stroke-width="2"/>
        <polygon points="125,205 136,236 169,236 142,255 152,287 125,268 98,287 108,255 81,236 114,236" fill="${OR}" stroke="${ROUGE}" stroke-width="3" stroke-linejoin="round"/></svg>`;
    }
    const r=c.rang, s=c.enseigne, rouge=s===1||s===2, col=rouge?ROUGE:NOIR, L=LETTRE[r]||String(r);
    let milieu;
    if(r===1) milieu=enseigne(s,125,175,s===2?110:126)+(s===0?`<circle cx="125" cy="175" r="78" fill="none" stroke="${col}" stroke-width="1.5" stroke-opacity=".35"/>`:'');
    else if(r<=10) milieu=PLACES[r].map(([x,y])=>enseigne(s,x,y,r>=9?44:48,y>M)).join('');
    else milieu=figure(r,s,col,rouge);
    return `${ouvre(w,nom||'')}${papier}<g fill="${col}">${coin(L,s,col)}<g transform="rotate(180 125 175)">${coin(L,s,col)}</g>${milieu}</g></svg>`;
  }

  function parNumero(n,w){
    const s=Math.floor(n/13), r=n%13+1;
    const nom=(r===1?"l'as":r===11?'le valet':r===12?'la dame':r===13?'le roi':'le '+r)+' de '+NOMS[s];
    return face({rang:r,enseigne:s},w,nom);
  }

  /* Le dos fleuri, cadré de bois, avec le prénom sur le ruban (ou une photo de famille dans le médaillon). */
  function dos(w,prenom,photo){
    const n=prenom||'', petit=w<50, len=n.length, t=len>9?28:33;
    const fleur=`<g transform="translate(125 140) scale(2.5)"><g fill="#C2546B">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-11" rx="7" ry="10" transform="rotate(${a})"/>`).join('')}</g><circle r="6" fill="#F3C14B"/></g>`;
    const dedans=photo?`<image href="${esc(photo)}" x="59" y="59" width="132" height="172" preserveAspectRatio="xMidYMid slice" clip-path="url(#cf-medaillon)"/>`:fleur;
    const ruban=petit||!n?'':`<rect x="34" y="252" width="182" height="56" rx="12" fill="#FBF0D2" stroke="#6B4022" stroke-width="3.5"/>
      <text x="125" y="291" font-size="${t}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" fill="#6B2A2A"${len>11?' textLength="166" lengthAdjust="spacingAndGlyphs"':''}>${esc(n)}</text>`;
    return `${ouvre(w,'dos de carte')}<rect x="1.5" y="1.5" width="247" height="347" rx="16" fill="#A86E3C" stroke="#4A2A12" stroke-width="4"/>
      <rect x="1.5" y="1.5" width="247" height="347" rx="16" fill="url(#cf-grain)"/>
      <rect x="14" y="14" width="222" height="322" rx="9" fill="url(#cf-fleurs)" stroke="#4A2A12" stroke-width="4"/>
      ${petit?'':`<ellipse cx="125" cy="145" rx="72" ry="92" fill="#FBF0D2" stroke="#6B4022" stroke-width="4.5"/>${dedans}`}${ruban}</svg>`;
  }

  /* Les portraits déjà déposés dans cartes/figures (une figure absente de cette liste garde sa version provisoire). */
  const CartesFaces={face,dos,parNumero,installer,ROUGE,NOIR,RATIO:1.4,cheminFigures:'cartes/figures/',portraits:['r-coeur','r-carreau','r-pique','r-trefle','d-coeur','d-pique','d-trefle','v-coeur','v-carreau','v-pique','v-trefle']};
  window.CartesFaces=CartesFaces;
  if(document.body) installer(); else addEventListener('DOMContentLoaded',installer);
})();
