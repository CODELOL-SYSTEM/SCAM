// JEU PC IMMERSIF — FICHIER UNIQUE (fusion app_base + app v3).
// UN SEUL PC / UN SEUL ÉCRAN : toutes les applis (Téléphone, BOL, SCAM, Ma Banque, MAMAZON, Connexion, Paramètres…) sont DANS le PC.
// Moteur de dialogue À RÈGLES (mots-clés), pas une IA conversationnelle.
// Toutes les données sont fictives : aucun paiement ni donnée bancaire réels.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
let COMP=null; // post-traitement (bloom), chargé en fin de fichier
const $=s=>document.querySelector(s),K='pcgame_v1',R=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.random()*a.length|0];
const DEF={v:1,bal:1000,tut:0,unl:[],own:[],vip:null,hist:[],tx:[],calls:0,scam:{},rev:{},notes:'',cl:{},seen:{},bought:[],
 set:{vol:.8,call:.8,sfx:.8,q:1,fx:1,sc:1,voice:1,inc:1},desk:{bg:0,font:0},inv:['c0','r5','m0','g0','v0','s0'],build:{case:'c0',cpu:'r5',mb:'m0',gpu:'g0',cool:'v0',mon:'s0'}};
let S=Object.assign(structuredClone(DEF),JSON.parse(localStorage.getItem(K)||'{}'));
const PRICE={vip:250000,vipRenew:2500,ultime:500000,legend:75000,epic:20000,rare:6000,cosm:3000};
// ---------- Catalogue MAMAZON : composants PC ----------
const TL={case:'Boîtiers PC',cpu:'Processeurs',mb:'Cartes mères',gpu:'Cartes graphiques',cool:'Ventirads & watercooling',mon:'Écrans PC',tool:'Outils'};
const CAT={c0:{t:'case',n:'Boîtier Classic',p:0,tier:0},c1:{t:'case',n:'Boîtier Nexus blanc verre trempé',p:8000,tier:1},c2:{t:'case',n:'Boîtier Obsidian RGB',p:25000,tier:2},c3:{t:'case',n:'Boîtier Titan violet',p:90000,tier:3},
r5:{t:'cpu',n:'Ryzen 5',p:0,tier:0},r6:{t:'cpu',n:'Ryzen 6',p:6000,tier:1},r7:{t:'cpu',n:'Ryzen 7',p:12000,tier:2},r8:{t:'cpu',n:'Ryzen 8',p:30000,tier:3},r9:{t:'cpu',n:'Ryzen 9',p:60000,tier:4},
m0:{t:'mb',n:'Carte mère A320',p:0,tier:0},m1:{t:'mb',n:'Carte mère B450',p:5000,tier:1},m2:{t:'mb',n:'Carte mère B550',p:12000,tier:2},m3:{t:'mb',n:'Carte mère X670 Gaming',p:35000,tier:3},
g0:{t:'gpu',n:'Carte graphique GTX 1650',p:0,tier:0},g1:{t:'gpu',n:'Carte graphique RTX 3060',p:15000,tier:1},g2:{t:'gpu',n:'Carte graphique RTX 4070',p:40000,tier:2},g3:{t:'gpu',n:'Carte graphique RTX 4090',p:120000,tier:3},
v0:{t:'cool',n:'Ventirad d’origine',p:0,tier:0},v1:{t:'cool',n:'Ventirad tour 120 mm',p:4000,tier:1},v2:{t:'cool',n:'Watercooling 240 mm RGB',p:12000,tier:2},v3:{t:'cool',n:'Watercooling 360 mm RGB',p:30000,tier:3},
s0:{t:'mon',n:'Écran 24" 60 Hz',p:0,tier:0},s1:{t:'mon',n:'Écran 27" 144 Hz',p:9000,tier:1},s2:{t:'mon',n:'Écran 32" 240 Hz',p:25000,tier:2},s3:{t:'mon',n:'Écran 34" OLED',p:70000,tier:3},
tool:{t:'tool',n:'Tournevis cruciforme',p:500,tier:0,d:'À prendre sur l’établi ($ PC éteint)'}};
const catHTML=()=>Object.entries(TL).map(([t,l])=>`<h4>${l}</h4>`+Object.entries(CAT).filter(([k,v])=>v.t==t&&v.p>0).map(([k,v])=>`<div class="row"><div><b>${v.n}</b><br><small>${v.d||'Se monte à l’établi ($ PC éteint)'}</small></div><span style="margin-left:auto">${v.p} ₢</span><button data-a="buy:${k}" ${S.inv.includes(k)?'disabled':''}>${S.inv.includes(k)?'Possédé':'Acheter'}</button></div>`).join('')).join('');
function buyCat(k){if(S.inv.includes(k))return;const v=CAT[k];if(!spend(v.p,'Achat '+v.n))return;S.inv.push(k);toast(v.n+' acheté ! '+(k=='tool'?'Il t’attend sur l’établi ($ PC éteint).':'Installe-le à l’établi ($ PC éteint).'));tool3d.visible=S.inv.includes('tool')&&!holding;save();render()}
// ---------- Sauvegarde ----------
let uid=null,fb=null,st=0;
const toast=m=>{const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.display='none',2800)};
function save(now){clearTimeout(st);const go=async()=>{S.hist=S.hist.slice(-40);S.tx=S.tx.slice(-60);S.u=Date.now();
 try{localStorage.setItem(K,JSON.stringify(S));if(uid&&fb)await fb.Db.set(fb.Db.ref(fb.db,`users/${uid}/save`),JSON.parse(JSON.stringify(S)));return 1}catch(e){toast('Échec de sauvegarde : '+e.message);return 0}};
 if(now)return go();st=setTimeout(go,600)}
const gain=(a,l)=>{if(vipOn())a*=2;S.bal+=a;S.tx.push({a,l,d:Date.now()});save()};
const spend=(a,l)=>{if(S.bal<a){toast('Solde insuffisant');return 0}S.bal-=a;S.tx.push({a:-a,l,d:Date.now()});save();return 1};
const vipOn=()=>S.vip&&S.vip.on;
function vipTick(){if(!vipOn())return;while(S.vip&&S.vip.next<=Date.now()){save();if(S.bal>=PRICE.vipRenew){S.bal-=PRICE.vipRenew;S.tx.push({a:-PRICE.vipRenew,l:'Renouvellement VIP',d:S.vip.next});S.vip.next+=3600000}else{S.vip=null;toast('VIP terminé : solde insuffisant');break}}}
// ---------- Audio ----------
let AC;const beep=(f,d,v=1,type='sine',k='sfx')=>{try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.value=.15*v*S.set[k]*S.set.vol;o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}};
const chime=()=>[392,523,659,784].forEach((f,i)=>setTimeout(()=>beep(f,.5),i*220)); // jingle original
// ---------- Sons réalistes (synthèse Web Audio : aucun fichier à charger) ----------
const ac=()=>{AC=AC||new AudioContext();if(AC.state=='suspended')AC.resume();return AC};
const vol=(k='sfx')=>S.set[k]*S.set.vol;
let NB=null,RG=null,hum=null;const noiseBuf=()=>{const a=ac();if(!NB){NB=a.createBuffer(1,a.sampleRate*2,a.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}return NB};
function tick(o){try{const a=ac(),t=a.currentTime+(o.at||0),n=a.createBufferSource();n.buffer=noiseBuf();n.playbackRate.value=o.rate||1;
 const f=a.createBiquadFilter();f.type=o.type||'bandpass';f.frequency.value=o.f;f.Q.value=o.q||1;const g=a.createGain();g.gain.setValueAtTime(o.v*vol(o.k),t);g.gain.exponentialRampToValueAtTime(.0001,t+o.d);n.connect(f);f.connect(g);g.connect(a.destination);n.start(t,Math.random(),o.d+.02);
 if(o.th){const q=a.createOscillator(),h=a.createGain();q.frequency.setValueAtTime(o.th,t);q.frequency.exponentialRampToValueAtTime(o.th*.5,t+.06);h.gain.setValueAtTime(o.tv*vol(o.k),t);h.gain.exponentialRampToValueAtTime(.0001,t+.07);q.connect(h);h.connect(a.destination);q.start(t);q.stop(t+.08)}}catch(e){}}
const kbd=k=>{const big=k==' '||k=='Enter'||k=='Backspace',r=.9+Math.random()*.25;tick({f:(big?1400:2600)*r,q:.8,d:.035,v:1.1,rate:r,th:(big?120:190)*r,tv:.5});tick({f:4200*r,q:1.5,d:.015,v:.35,at:.075,rate:r,type:'highpass'})};
const mclick=()=>{tick({f:3200,q:2,d:.012,v:1.1,th:900,tv:.25});tick({f:2600,q:2,d:.012,v:.6,at:.085})};
const pwrClick=()=>tick({f:900,q:.7,d:.09,v:1.4,th:90,tv:.9}),hangup=()=>tick({f:500,q:.8,d:.06,v:1.2,th:150,tv:.7}),pickup=()=>{tick({f:1800,q:1,d:.02,v:.8});tick({f:600,q:.8,d:.05,v:.9,at:.06,th:130,tv:.5})};
const humOn=()=>{try{if(hum)return;const a=ac(),n=a.createBufferSource();n.buffer=noiseBuf();n.loop=true;const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=260;const g=a.createGain();g.gain.value=0;g.gain.linearRampToValueAtTime(.09*vol(),a.currentTime+3);n.connect(f);f.connect(g);g.connect(a.destination);n.start();hum={n,g}}catch(e){}};
const humOff=()=>{if(!hum)return;try{hum.g.gain.linearRampToValueAtTime(0,AC.currentTime+.8);hum.n.stop(AC.currentTime+.9)}catch(e){}hum=null};
// sonnerie de téléphone à cloches
function bell(t0,fr,dst){const a=ac();[1,2.76,5.4].forEach((m,j)=>{const o=a.createOscillator(),g=a.createGain();o.frequency.value=fr*m;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime((.22/(j+1))*vol('call'),t0+.002);g.gain.exponentialRampToValueAtTime(.0001,t0+.06);o.connect(g);g.connect(dst);o.start(t0);o.stop(t0+.07)})}
function ringOnce(){try{const a=ac(),t=a.currentTime+.02;RG=a.createGain();RG.connect(a.destination);for(let i=0;i<34;i++)bell(t+i/24,i%2?1380:1130,RG)}catch(e){}}
const speak=t=>{if(!S.set.voice||!window.speechSynthesis)return;const u=new SpeechSynthesisUtterance(t);u.lang='fr-FR';u.volume=S.set.call*S.set.vol;speechSynthesis.speak(u)};
// ---------- Personnages (250 générés) ----------
const F='Léa Hugo Inès Marc Zoé Théo Nina Paul Lola Axel Maya Remi Clara Odile Samir Yanis Elsa Bruno Anaïs Victor Salomé Karim Jade Émile Nora Gaspard Iris Lucas Mila Ravi Flora Basile Ysé Tom Alice Noé Cléo Jules Sana Oscar Lina Étienne Maëlle Dimitri Rose Ismaël Eva Cyril Thaïs Léon'.split(' '),L=['Martin','Roux','Fabre','Morel','Girard'];
const JOB='boulanger,infirmière,retraité,étudiante,facteur,libraire,mécanicien,institutrice,pêcheur,comptable'.split(','),CITY='Lille,Arras,Nantes,Albi,Brest,Metz,Tours,Dax,Nîmes,Vichy'.split(',');
const TY=['naif','meff','bav','grin','poli'],TD={
naif:{p:1.6,n:.5,nm:'naïf',op:['Allô ? Oh, quelle surprise !','Oui bonjour, c’est pour quoi ?'],pos:['Oh c’est gentil, je vous écoute !','Vous êtes adorable.'],neg:['Oh… ce n’est pas très aimable.','Pourquoi dites-vous ça ?'],neu:['Ah bon ? Dites-m’en plus.','Je ne comprends pas tout mais continuez.']},
meff:{p:.5,n:1.7,nm:'méfiant',op:['Qui est à l’appareil ?','Je ne donne rien par téléphone.'],pos:['Les belles paroles ne me suffisent pas.','Hmm… prouvez-le.'],neg:['Je le savais ! Je raccroche bientôt.','Ne me parlez pas sur ce ton.'],neu:['Je reste sur mes gardes.','Où voulez-vous en venir ?']},
bav:{p:1,n:1,nm:'bavard',op:['Allô ! Vous tombez bien, laissez-moi vous raconter ma journée !','Ah enfin quelqu’un ! Alors, hier…'],pos:['Exactement ! Comme je disais à ma voisine…','Vous me comprenez, vous !'],neg:['Oh la la, quel caractère !','Calmez-vous, j’ai plein de choses à dire.'],neu:['Ça me rappelle une histoire…','Attendez, je n’ai pas fini !']},
grin:{p:.7,n:1.3,nm:'grincheux',op:['Quoi encore ?','Je suis occupé, faites vite.'],pos:['Mouais. Continuez, mais vite.','Bon, ça passe.'],neg:['Insolent ! Rappelez quand vous serez poli.','J’ai autre chose à faire.'],neu:['Et alors ?','Ça ne m’intéresse pas beaucoup.']},
poli:{p:1.2,n:1.2,nm:'poli',op:['Bonjour, à qui ai-je l’honneur ?','Bonsoir, que puis-je pour vous ?'],pos:['Merci, c’est très aimable.','Voilà qui est courtois.'],neg:['Je préfère que nous restions respectueux.','Ce ton est regrettable.'],neu:['Je vous en prie, précisez.','Je comprends, poursuivez.']}};
const CH=Array.from({length:250},(_,i)=>{const ty=TY[(i*7+(i>>3))%5],j=JOB[(i*3)%10],c=CITY[(i*7)%10],h=(i*47)%360;
 return{i,n:F[i%50]+' '+L[i/50|0],ty,j,c,prem:i>=150,dif:1+i%5,h,sk:['#f2c9a0','#d9a273','#a8744b','#7a4e30','#f6d9bd'][i%5],hr:i%4,
 story:`${F[i%50]} est ${j} à ${c}. ${TD[ty].nm[0].toUpperCase()+TD[ty].nm.slice(1)}, difficulté ${1+i%5}/5.`,rar:['commun','rare','épique','légendaire','épique'][i%5]}});
const avail=c=>!c.prem||S.own.includes(c.i);
const face=c=>{const b=`hsl(${c.h} 45% 30%)`,hair=['M20 50Q50 5 80 50Q50 25 20 50','M18 55Q20 8 82 40L80 60Q50 30 18 55','M22 45Q50 0 78 45Q80 20 50 14Q20 20 22 45','M15 70Q10 10 50 8Q90 10 85 70Q80 30 50 28Q20 30 15 70'][c.hr];
 return`<svg viewBox="0 0 100 100"><g filter="url(#pc)"><rect width="100" height="100" fill="${b}"/><ellipse cx="50" cy="55" rx="26" ry="32" fill="${c.sk}" stroke="#111" stroke-width="2.5"/><path d="${hair}" fill="hsl(${(c.h+90)%360} 30% 18%)" stroke="#111" stroke-width="2"/><circle cx="40" cy="50" r="3" fill="#111"/><circle cx="60" cy="50" r="3" fill="#111"/><ellipse class="mo" cx="50" cy="70" rx="7" ry="2" fill="#7a1f1f" stroke="#111"/><path d="M30 92Q50 78 70 92" fill="#d4af37" stroke="#111" stroke-width="2"/></g></svg>`};
// ---------- Moteur de dialogue ----------
const INS=/\b(con|idiot|imbécile|nul|ferme|débile|stupide|crétin|merde|connard)\b/i,POS=/\b(bonjour|bonsoir|merci|s'il|svp|désolé|pardon|gentil|aide|comprends|confiance|bravo|plaisir|madame|monsieur)\b/i,NEG=/\b(menace|obligé|vite|argent|gratuit|urgent|tais|jamais)\b/i;
function analyse(a,txt){const ty=TD[a.c.ty];let d=1,cat='neu';if(PRE.test(txt)){a.pre=(a.pre||0)+1;if(a.c.ty=='meff')a.raw-=4}
 if(INS.test(txt)){d=-30;cat='neg'}else if(NEG.test(txt)){d=-7;cat='neg'}else if(POS.test(txt)){d=6;cat='pos'}
 if(a.said.includes(txt.toLowerCase())){d-=6;cat='neg'}if(txt.length<3){d-=3;cat='neg'}if(/\?/.test(txt)&&cat=='neu')d+=2;
 d*=d>0?ty.p:ty.n;d*=1+(a.c.dif-3)*(d<0?.08:-.05);a.said.push(txt.toLowerCase());a.raw+=d;return cat}

// =====================================================================
// ---------- Scène 3D (matériaux PBR, environnement, écran animé) ----------
// =====================================================================
const cv=$('#c'),rd=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
rd.shadowMap.enabled=true;rd.shadowMap.type=THREE.PCFSoftShadowMap;rd.toneMapping=THREE.ACESFilmicToneMapping;rd.toneMappingExposure=1.2;
const sc=new THREE.Scene();sc.background=new THREE.Color(0x050308);sc.fog=new THREE.FogExp2(0x060309,.032);
const cam=new THREE.PerspectiveCamera(50,1,.1,60);
// Environnement procédural (softboxes) -> reflets réalistes sur métal, verre, écrans
const envS=new THREE.Scene();envS.add(new THREE.Mesh(new THREE.BoxGeometry(30,16,30),new THREE.MeshBasicMaterial({color:0x0a0614,side:THREE.BackSide})));
[[0,7.5,0,12,.2,6,0xfff0d0,6],[-12,3,0,.2,3,10,0x7b2fff,5],[12,3,0,.2,3,10,0xd4af37,4],[0,3,14,14,3,.2,0x5a3bff,3],[0,2,-14,14,3,.2,0x7b2fff,2]].forEach(a=>{const m=new THREE.Mesh(new THREE.BoxGeometry(a[3],a[4],a[5]),new THREE.MeshBasicMaterial({color:new THREE.Color(a[6]).multiplyScalar(a[7])}));m.position.set(a[0],a[1],a[2]);envS.add(m)});
sc.environment=new THREE.PMREMGenerator(rd).fromScene(envS,.03).texture;
const M=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.5,metalness:.15,envMapIntensity:.6,...o});
const cvTex=(w,h,fn,rep)=>{const k=document.createElement('canvas');k.width=w;k.height=h;fn(k.getContext('2d'),w,h);const t=new THREE.CanvasTexture(k);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;if(rep)t.repeat.set(rep[0],rep[1]);return t};
// Textures procédurales : bois, sol, tapis, pores de peau
const woodTex=cvTex(512,256,(g,w,h)=>{g.fillStyle='#4a2d1a';g.fillRect(0,0,w,h);for(let i=0;i<300;i++){const y=Math.random()*h;g.strokeStyle=`rgba(${Math.random()<.5?'20,10,4':'150,90,45'},${Math.random()*.22})`;g.lineWidth=Math.random()*2+.3;g.beginPath();g.moveTo(0,y);for(let x=0;x<=w;x+=32)g.lineTo(x,y+Math.sin(x*.02+i)*3);g.stroke()}},[.3,.45]);
const floorTex=cvTex(512,512,(g,w,h)=>{g.fillStyle='#1a1322';g.fillRect(0,0,w,h);for(let i=0;i<5000;i++){g.fillStyle=`rgba(255,255,255,${Math.random()*.04})`;g.fillRect(Math.random()*w,Math.random()*h,2,2)}g.strokeStyle='rgba(212,175,55,.5)';g.lineWidth=2;g.strokeRect(1,1,w-2,h-2)},[6,4]);
const matTex=cvTex(1024,410,(g,w,h)=>{g.fillStyle='#0d0b14';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=3){g.fillStyle=y%6?'rgba(255,255,255,.015)':'rgba(0,0,0,.2)';g.fillRect(0,y,w,1)}g.strokeStyle='rgba(123,47,255,.35)';g.lineWidth=2;for(let i=0;i<9;i++){g.beginPath();g.moveTo(0,40+i*40);g.lineTo(w*.5,40+i*40);g.lineTo(w*.5+60,h-20);g.stroke()}g.strokeStyle='#d4af37';g.lineWidth=8;g.strokeRect(8,8,w-16,h-16);g.fillStyle='#d4af37';g.font='bold 54px sans-serif';g.textAlign='center';g.fillText('◆ GAMING ◆',w/2,h/2+18)},[1/4.4,1/1.7]);matTex.offset.set(.5,.5);
const poreTex=cvTex(256,256,(g,w,h)=>{g.fillStyle='#808080';g.fillRect(0,0,w,h);for(let i=0;i<5000;i++){const v=95+Math.random()*70|0;g.fillStyle='rgb('+v+','+v+','+v+')';g.fillRect(Math.random()*w,Math.random()*h,2,2)}},[5,5]);
// Géométries utilitaires (boîtes arrondies biseautées)
function rg(w,h,d,r,bev){const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
 const dd=Math.max(.001,d-2*bev),g=new THREE.ExtrudeGeometry(s,{depth:dd,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bev*.9,bevelSegments:2,curveSegments:6});g.translate(0,0,-dd/2);return g}
const rb=(w,h,d,r,m,x,y,z,par=sc,bev=.01)=>{const b=new THREE.Mesh(rg(w,h,d,r,bev),m);b.position.set(x,y,z);b.castShadow=b.receiveShadow=true;par.add(b);return b};
const rbH=(w,dp,th,r,m,x,y,z,par=sc,bev=.01)=>{const b=rb(w,dp,th,r,m,x,y,z,par,bev);b.rotation.x=-Math.PI/2;return b}; // à plat : largeur x, profondeur z, épaisseur y
const box=(w,h,d,m,x,y,z,par=sc)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=b.receiveShadow=true;par.add(b);return b};
const cyl=(r,h,m,x,y,z,par=sc)=>{const b=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,32),m);b.position.set(x,y,z);b.castShadow=true;b.receiveShadow=true;par.add(b);return b};
const GOLD=M(0xd4af37,{metalness:1,roughness:.22,envMapIntensity:1.3}),BLK=M(0x14141a,{roughness:.4,metalness:.5}),METAL=M(0x9a9aa8,{metalness:1,roughness:.3,envMapIntensity:1.2}),SATIN=M(0x0b0b0f,{metalness:.7,roughness:.32}),LED=c=>new THREE.MeshStandardMaterial({color:0x111111,emissive:c,emissiveIntensity:1.6});
const cable=(pts,c=0x0c0c10,r=.022)=>{const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2]))),50,r,8),M(c,{roughness:.55}));m.castShadow=true;sc.add(m)};
const glowTex=cvTex(128,128,g=>{const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.3,'rgba(255,255,255,.3)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,128,128)});
const halos=[],halo=(c,s,x,y,z,o)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:c,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:o,fog:false}));m.scale.set(s,s,1);m.position.set(x,y,z);m.userData.o=o;sc.add(m);halos.push(m);return m};
// --- pièce : sol poli, murs, panneaux acoustiques en lattes, plinthes dorées, néon ---
box(18,.1,12,M(0x1a1322,{roughness:.32,metalness:.55,map:floorTex,envMapIntensity:.9}),0,0,0);
rbH(7,4.4,.02,.2,M(0x120e1c,{roughness:1,metalness:0}),0,.06,.6,sc,.004); // tapis
box(18,7,.1,M(0x1a1426,{roughness:.95}),0,3.5,-3.4);box(.1,7,12,M(0x2a2140,{roughness:.9}),-9,3.5,0);box(.1,7,12,M(0x2a2140,{roughness:.9}),9,3.5,0);
const slat=M(0x3a2517,{roughness:.55,map:woodTex});for(let i=0;i<34;i++){const x=-7.6+i*.46;box(.24,5.2,.06,slat,x,3.3,-3.3);if(i%4==1)box(.04,5.2,.02,LED(0x7b2fff),x+.23,3.3,-3.35)}
box(18,.12,.12,GOLD,0,.4,-3.3);box(18,.1,.1,GOLD,0,6.1,-3.3);
const neonTex=cvTex(512,128,g=>{g.font='bold 80px sans-serif';g.textAlign='center';g.fillStyle='#e0c4ff';g.shadowColor='#7b2fff';g.shadowBlur=30;g.fillText('GAMING',256,92)});
const neon=new THREE.Mesh(new THREE.PlaneGeometry(3,.8),new THREE.MeshBasicMaterial({map:neonTex,transparent:true,toneMapped:false}));neon.position.set(-5.4,4.3,-3.2);sc.add(neon);
const nl=new THREE.PointLight(0x7b2fff,14,7);nl.position.set(-5.4,4.3,-2.6);sc.add(nl);halo(0x7b2fff,3.6,-5.4,4.3,-3.1,.5);
// étagère murale avec plante et trophée
box(1.8,.06,.4,M(0x2c1d14,{roughness:.4}),5.6,3.3,-3.15);cyl(.14,.2,M(0xd4af37,{metalness:.9,roughness:.3}),5.2,3.43,-3.15);
const pot=cyl(.16,.22,M(0x201a28,{roughness:.6}),6.1,3.44,-3.15);for(let i=0;i<7;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(.1,10,8),M(0x1d6b3a,{roughness:.6}));l.scale.set(.4,1.6,.2);l.position.set(6.1+Math.sin(i*2.1)*.1,3.7,-3.15);l.rotation.z=Math.sin(i*2.1)*.7;sc.add(l)}
// --- bureau : plateau bois vernis, pieds métal, tringle, LED sous le plateau, tapis de souris ---
rbH(10.4,3.4,.14,.08,M(0xffffff,{roughness:.28,metalness:.05,map:woodTex,envMapIntensity:.8}),0,.91,.1,sc,.01);
[[-5,-1.3],[5,-1.3],[-5,1.4],[5,1.4]].forEach(p=>rb(.14,.85,.14,.03,METAL,p[0],.45,p[1],sc,.01));
box(9,.08,.08,METAL,0,.3,-1.3);box(9.4,.03,.03,LED(0x7b2fff),0,.82,1.76);
const ug=new THREE.PointLight(0x7b2fff,0,6);ug.position.set(0,.5,1.4);sc.add(ug);
rbH(4.4,1.7,.014,.12,M(0xffffff,{map:matTex,roughness:.95,metalness:0,envMapIntensity:.15}),0,.99,1.35,sc,.004);
// tasse + casque sur support
const cup=cyl(.09,.17,M(0xeeeeee,{roughness:.25}),-3.3,1.07,1.1);const hd=new THREE.Mesh(new THREE.TorusGeometry(.055,.012,8,16,Math.PI*1.5),M(0xeeeeee,{roughness:.3}));hd.position.set(-3.19,1.07,1.1);sc.add(hd);
{const hs=new THREE.Group();hs.position.set(-4.1,.98,.3);sc.add(hs);cyl(.22,.04,METAL,0,.02,0,hs);cyl(.03,.8,METAL,0,.42,0,hs);
 const band=new THREE.Mesh(new THREE.TorusGeometry(.3,.035,10,32,Math.PI),M(0x15151b,{roughness:.5,metalness:.4}));band.position.y=.82;hs.add(band);
 [-1,1].forEach(s=>{const e=cyl(.14,.12,M(0x15151b,{roughness:.6}),s*.3,.82,0,hs);e.rotation.z=Math.PI/2;const r=new THREE.Mesh(new THREE.TorusGeometry(.12,.012,8,24),LED(0x7b2fff));r.rotation.y=Math.PI/2;r.position.set(s*.365,.82,0);hs.add(r)})}
// enceintes (écartées pour le grand écran unique)
[-1,1].forEach(s=>{const g=new THREE.Group();g.position.set(s*2.5,.98+.3,-1.0);g.rotation.y=-s*.2;sc.add(g);rb(.42,.62,.34,.04,BLK,0,0,0,g,.012);const w=cyl(.13,.03,M(0x08080c,{roughness:.8}),0,-.08,.17,g);w.rotation.x=Math.PI/2;const rg2=new THREE.Mesh(new THREE.TorusGeometry(.14,.012,8,28),GOLD);rg2.position.set(0,-.08,.18);g.add(rg2);const tw=cyl(.04,.02,M(0x08080c),0,.17,.17,g);tw.rotation.x=Math.PI/2});
// --- clavier : socle alu, rétroéclairage RGB, 51 touches biseautées (InstancedMesh) ---
const KB={x:-.25,y:1.065,z:1.3},kp=[],dummy=new THREE.Object3D();
[14,13,13,12].forEach((n,r)=>{const x0=-(n-1)*.058+(r==1?.03:r==2?.05:r==3?.07:0);for(let k=0;k<n;k++)kp.push([KB.x+x0+k*.116,KB.z-.2+r*.116])});
rbH(1.82,.7,.05,.05,M(0x101016,{metalness:.8,roughness:.28}),KB.x,1.02,KB.z,sc,.01);rbH(1.86,.74,.01,.06,GOLD,KB.x,.995,KB.z,sc,.003);
const kbGlow=rbH(1.7,.58,.01,.04,new THREE.MeshStandardMaterial({color:0x111111,emissive:0x7b2fff,emissiveIntensity:1.2}),KB.x,1.05,KB.z,sc,.002);
const kg=rg(.1,.1,.05,.02,.008);kg.rotateX(-Math.PI/2);
const keys=new THREE.InstancedMesh(kg,new THREE.MeshStandardMaterial({color:0x23232d,roughness:.38,metalness:.1,emissive:0x000000,envMapIntensity:.8}),kp.length);
function setKey(i,o){dummy.position.set(kp[i][0],KB.y-o,kp[i][1]);dummy.updateMatrix();keys.setMatrixAt(i,dummy.matrix);keys.instanceMatrix.needsUpdate=true}
kp.forEach((_,i)=>setKey(i,0));keys.castShadow=true;sc.add(keys);
rbH(.9,.1,.05,.02,M(0x23232d,{roughness:.38}),KB.x-.1,KB.y,KB.z+.27,sc,.008);
{const LB=["`",'1','2','3','4','5','6','7','8','9','0','-','=','⌫','⇥','Q','W','E','R','T','Y','U','I','O','P','[',']','⇪','A','S','D','F','G','H','J','K','L',';',"'",'↵','⇧','Z','X','C','V','B','N','M',',','.','/','⇧'],PW=1.9,PH=.74;
 const lt=cvTex(1024,400,(g,w,h)=>{g.textAlign='center';g.textBaseline='middle';g.font='bold 34px Segoe UI,Arial';g.fillStyle='#e6dcff';kp.forEach((q,i)=>g.fillText(LB[i]||'',(q[0]-KB.x)/PW*w+w/2,(q[1]-KB.z)/PH*h+h/2))});
 const lp=new THREE.Mesh(new THREE.PlaneGeometry(PW,PH),new THREE.MeshBasicMaterial({map:lt,transparent:true,depthWrite:false,opacity:.9}));lp.rotation.x=-Math.PI/2;lp.position.set(KB.x,KB.y+.0265,KB.z);sc.add(lp);halo(0x7b2fff,2.6,KB.x,1.2,KB.z,.25)}
cable([[KB.x,1.03,KB.z-.36],[KB.x,1.0,.3],[.4,.99,-.5],[1.2,.98,-1.3],[3.6,.98,-1.0]]);
// --- souris : coque, boutons, molette dorée, LED, sans fil ---
const mouse=new THREE.Group(),mb=new THREE.Mesh(new THREE.SphereGeometry(1,32,20),M(0x17171d,{roughness:.28,metalness:.55,envMapIntensity:1}));mb.scale.set(.15,.065,.24);mb.position.y=.03;mb.castShadow=true;mouse.add(mb);
const btnL=box(.07,.012,.12,M(0x0c0c10,{roughness:.4}),-.04,.093,-.07,mouse),btnR=box(.07,.012,.12,M(0x0c0c10,{roughness:.4}),.04,.093,-.07,mouse);
cyl(.02,.05,GOLD,0,.1,-.08,mouse).rotation.z=Math.PI/2;box(.012,.01,.3,LED(0x7b2fff),0,.005,0,mouse);mouse.position.set(1.45,.99,1.3);sc.add(mouse);
// --- mains : paume, doigts à 3 phalanges, pouce, poignet, manche de sweat, montre, peau avec pores ---
function hand(side){const g=new THREE.Group(),skin=new THREE.MeshPhysicalMaterial({color:0xd9a273,bumpMap:poreTex,bumpScale:.5,clearcoat:.12,clearcoatRoughness:.5,roughness:.5,sheen:1,sheenColor:new THREE.Color(0xff9a8a),sheenRoughness:.45,envMapIntensity:.3}),nail=M(0xf3d9cf,{roughness:.2,metalness:0,envMapIntensity:.8}),cloth=M(0x17131f,{roughness:.95,envMapIntensity:.25}),fs=[];
 const cap=(r,l,m)=>{const x=new THREE.Mesh(new THREE.CapsuleGeometry(r,l,6,14),m);x.rotation.x=Math.PI/2;x.castShadow=true;return x};
 const palm=new THREE.Mesh(new THREE.SphereGeometry(1,28,18),skin);palm.scale.set(.185,.05,.16);palm.position.set(0,0,.02);palm.castShadow=true;g.add(palm);
 const heel=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),skin);heel.scale.set(.15,.055,.11);heel.position.set(0,.005,.14);g.add(heel);
 for(let i=0;i<4;i++){const s=[.95,1.05,1,.8][i],f=new THREE.Group();f.position.set(-.12+i*.08,.012,-.14);f.add(new THREE.Mesh(new THREE.SphereGeometry(.034,14,12),skin));
  const a=cap(.03,.07*s,skin);a.position.z=-.06*s;f.add(a);
  const j2=new THREE.Group();j2.position.z=-.115*s;f.add(j2);j2.add(new THREE.Mesh(new THREE.SphereGeometry(.028,12,10),skin));const b=cap(.027,.05*s,skin);b.position.z=-.05*s;j2.add(b);
  const j3=new THREE.Group();j3.position.z=-.085*s;j2.add(j3);const c=cap(.024,.04*s,skin);c.position.z=-.04*s;j3.add(c);box(.028,.004,.034,nail,0,.021,-.062*s,j3);
  f.userData.j=[f,j2,j3];g.add(f);fs.push(f)}
 const th=new THREE.Group();th.position.set(side*-.19,0,0);th.rotation.y=side*.75;const t1=cap(.034,.06,skin);t1.position.z=-.05;th.add(t1);const t2g=new THREE.Group();t2g.position.z=-.1;t2g.rotation.x=-.2;th.add(t2g);const t2=cap(.029,.05,skin);t2.position.z=-.045;t2g.add(t2);box(.026,.004,.032,nail,0,.025,-.085,t2g);g.add(th);
 const arm=new THREE.Group();arm.position.set(0,.02,.15);arm.rotation.x=-.2;g.add(arm);
 const wr=cyl(.085,.22,skin,0,0,.08,arm);wr.rotation.x=Math.PI/2;
 const sl=new THREE.Mesh(new THREE.CylinderGeometry(.115,.16,1.3,20),cloth);sl.rotation.x=Math.PI/2;sl.position.z=.85;sl.castShadow=true;arm.add(sl);
 const cf=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.12,20),M(0x2a2336,{roughness:.9}));cf.rotation.x=Math.PI/2;cf.position.z=.2;arm.add(cf);
 if(side<0){const w=new THREE.Mesh(new THREE.TorusGeometry(.095,.016,8,24),GOLD);w.position.z=.07;arm.add(w);box(.09,.025,.09,M(0x08080c,{metalness:.8,roughness:.2}),0,.1,.07,arm)}
 g.userData.f=fs;sc.add(g);return g}
const hands=[hand(-1),hand(1)];hands[0].position.set(-.7,1.1,1.45);hands[1].position.set(1.45,1.12,1.42);
// ---------- Boîtier modulaire, composants réels, établi ----------
const caseMat=M(0x14141a,{roughness:.4,metalness:.6}),rgbM=[],spinners=[];let holding=0,benchBusy=0;
const rgbMat=()=>{const m=new THREE.MeshStandardMaterial({color:0x111111,emissive:0x7b2fff,emissiveIntensity:0});rgbM.push(m);return m};
function caseShell(par,open){const m=caseMat;box(.03,2.1,1.15,m,-.51,0,0,par);box(1.05,.03,1.15,m,0,1.035,0,par);box(1.05,.03,1.15,m,0,-1.035,0,par);box(1.05,2.1,.03,m,0,0,-.56,par);
 if(!open){const gl=new THREE.Mesh(new THREE.PlaneGeometry(1.15,2.1),new THREE.MeshPhysicalMaterial({color:0x05050a,roughness:.04,transparent:true,opacity:.18,envMapIntensity:1.6,clearcoat:1}));gl.rotation.y=Math.PI/2;gl.position.x=.525;par.add(gl);box(.02,2.1,.02,GOLD,.525,0,.57,par);box(.02,2.1,.02,GOLD,.525,0,-.55,par)}else box(.03,2.1,.03,GOLD,.52,0,.57,par)}
function fan(par,r,x,y,z,axZ){const o=new THREE.Group();o.position.set(x,y,z);if(axZ)o.rotation.y=-Math.PI/2;par.add(o);const ring=new THREE.Mesh(new THREE.TorusGeometry(r,r*.14,8,28),rgbMat());ring.rotation.y=Math.PI/2;o.add(ring);
 const sp=new THREE.Group();o.add(sp);cyl(r*.3,.02,GOLD,0,0,0,sp).rotation.z=Math.PI/2;for(let i=0;i<7;i++){const a=i/7*6.283,b=box(.008,r*.8,r*.35,M(0x15151c),0,0,0,sp);b.position.set(0,Math.cos(a)*r*.55,Math.sin(a)*r*.55);b.rotation.x=a;b.rotation.y=.4}spinners.push(sp);return o}
function tube(par,pts,c){const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2]))),24,.018,8),M(c,{roughness:.5}));par.add(m)}
function parts(par,B){const g=new THREE.Group();par.add(g);const T=id=>CAT[id].tier,X=-.315,bx=(w,h,d,m,x,y,z)=>box(w,h,d,m,x,y,z,g);
 bx(.03,1.45,.84,M([0x1a3a2a,0x1d1d26,0x24242e,0x2b1b3a][T(B.mb)],{roughness:.45,metalness:.5}),X-.015,.12,-.13);
 bx(.08,.5,.1,METAL,X+.04,.72,-.45);bx(.04,.14,.14,GOLD,X+.02,-.42,.1);bx(.06,.3,.02,rgbMat(),X+.03,.45,.2);
 for(let i=0;i<(T(B.mb)>1?4:2);i++){bx(.05,.34,.02,M(0x22222c,{metalness:.6,roughness:.3}),X+.025,.45,.13+i*.04);bx(.052,.02,.022,rgbMat(),X+.026,.63,.13+i*.04)}
 bx(.05,.1,.1,M(0x888890,{metalness:1,roughness:.3}),X+.02,.38,-.1); // CPU sous le ventirad
 const c=T(B.cool);
 if(c==0){bx(.1,.2,.2,METAL,X+.05,.38,-.1);fan(g,.08,X+.11,.38,-.1)}
 else if(c==1){bx(.22,.46,.14,M(0xb0b0bc,{metalness:1,roughness:.35}),X+.11,.4,-.1);fan(g,.11,X+.2,.4,-.1+.08,true)}
 else{const n=c==2?2:3,r=c==2?.12:.1,z0=c==2?-.27:-.35,st=c==2?.27:.23;const pm=cyl(.07,.05,M(0x15151c,{metalness:.6,roughness:.4}),X+.05,.38,-.1,g);pm.rotation.z=Math.PI/2;const pc=new THREE.Mesh(new THREE.TorusGeometry(.05,.01,8,20),rgbMat());pc.rotation.y=Math.PI/2;pc.position.set(X+.08,.38,-.1);g.add(pc);
  bx(.05,.26,n*st+.08,M(0x15151c,{roughness:.6}),.1,.78,z0+(n-1)*st/2);for(let i=0;i<n;i++)fan(g,r,.14,.78,z0+i*st);
  tube(g,[[X+.05,.42,-.14],[-.1,.6,-.3],[.1,.66,z0-.04]],0x0c0c10);tube(g,[[X+.05,.34,-.06],[-.1,.5,.0],[.1,.66,z0+(n-1)*st+.04]],0x0c0c10)}
 const t=T(B.gpu),len=[.45,.58,.7,.78][t],th=.08+.02*t,h=.2+.03*t,gz=-.5+len/2,gx=X+th/2;
 bx(th,h,len,M(0x15151b,{metalness:.6,roughness:.35}),gx,-.1,gz);bx(th+.004,.02,len*.8,rgbMat(),gx,-.1+h/2,gz);if(t>=2)bx(.01,h,len,GOLD,X+th,-.1,gz);
 const nf=t==0?1:t==3?3:2;for(let i=0;i<nf;i++)fan(g,.085+.005*t,X+th+.006,-.1,-.5+len*(i+.5)/nf);
 bx(.8,.3,1.0,M(0x101015,{roughness:.5,metalness:.5}),0,-.88,-.03);
 bx(.01,.03,.9,GOLD,.38,-.76,-.03);
 // détails : dissipateurs VRM/chipset, barrettes RAM, SSD, backplate GPU, câbles d'alimentation
 const hs=M(0x2a2a33,{metalness:1,roughness:.28,envMapIntensity:1.2}),pcb=T(B.mb);
 bx(.05,.1,.34,hs,X+.03,.66,-.3);bx(.05,.3,.1,hs,X+.03,.3,-.5);bx(.046,.1,.12,hs,X+.025,-.22,.3);
 for(let i=0;i<4;i++)bx(.052,.008,.3,METAL,X+.03,.62+i*.025,-.3);
 if(pcb>0){bx(.03,.05,.5,hs,X+.02,-.3,-.05);bx(.032,.012,.5,rgbMat(),X+.022,-.275,-.05)}
 tube(g,[[X+.03,-.76,.3],[X+.12,-.4,.32],[X+.03,.1,.3]],0x111114);tube(g,[[X+.03,-.76,.2],[X+.14,-.5,.1],[gx+th/2,-.1+h/2,gz+len/2-.05]],0x111114);tube(g,[[X+.03,-.76,.15],[X+.1,.2,-.2],[X+.03,.72,-.42]],0x111114);
 bx(.01,h,len*.98,M(0x0c0c10,{metalness:.9,roughness:.3}),X+th+.004,-.1,gz);bx(.012,.04,.14,rgbMat(),X+th+.01,-.1,gz);
 return g}
function refreshPC(){const B=S.build,tc=CAT[B.case].tier;caseMat.color.setHex([0x14141a,0xe9e9f0,0x1a1230,0x3a0f2a][tc]);caseMat.metalness=tc==1?.2:.6;const k=[.8,.84,.88,.92][tc];cs.scale.setScalar(k);cs.position.y=1+1.05*k;
 rgbM.length=0;spinners.length=0;[cs,bc].forEach(par=>{if(par.userData.pg)par.remove(par.userData.pg);par.userData.pg=parts(par,B)});
 const ms=[1,1.07,1.14,1.2][CAT[B.mon].tier];for(const n in mg){const q=mg[n];q.scale.setScalar(ms);q.position.y=1+q.userData.drop*ms}}
// établi
const bench=new THREE.Group();bench.position.set(60,0,0);sc.add(bench);
box(14,.1,10,M(0x1a1322,{roughness:.4,metalness:.5,map:floorTex}),0,0,0,bench);box(14,6,.1,M(0x1a1426,{roughness:.9}),0,3,-2.4,bench);box(14,.1,.1,GOLD,0,4.6,-2.33,bench);
box(8,.16,3.4,M(0xffffff,{roughness:.4,map:woodTex,envMapIntensity:.7}),0,.92,0,bench);[[-3.8,-1.5],[3.8,-1.5],[-3.8,1.5],[3.8,1.5]].forEach(q=>box(.16,.85,.16,METAL,q[0],.43,q[1],bench));
rbH(5.2,2.4,.012,.12,M(0x16202c,{roughness:.9}),0,1.005,.2,bench,.003);
for(let i=0;i<9;i++){const sw=cyl(.018,.03,GOLD,-2.4+i*.12+Math.random()*.05,1.025,1.35+Math.random()*.2,bench);sw.rotation.z=Math.random()*3}
const bnT=cvTex(512,128,g=>{g.font='bold 80px sans-serif';g.textAlign='center';g.fillStyle='#ffe9a8';g.shadowColor='#d4af37';g.shadowBlur=24;g.fillText('ATELIER',256,92)});const bn=new THREE.Mesh(new THREE.PlaneGeometry(3,.75),new THREE.MeshBasicMaterial({map:bnT,transparent:true,toneMapped:false}));bn.position.set(0,3.9,-2.3);bench.add(bn);
const bl=new THREE.SpotLight(0xfff0dd,260,16,.9,.7,1.6);bl.position.set(60,6,3);bl.target.position.set(60,1.2,0);sc.add(bl,bl.target);const bp=new THREE.PointLight(0x7b2fff,14,9);bp.position.set(57,3,1);sc.add(bp);
const bc=new THREE.Group();bc.position.set(0,2.2,0);bc.rotation.y=-Math.PI/2;bc.scale.setScalar(1.15);bench.add(bc);caseShell(bc,true);
const tool3d=new THREE.Group();{const hd=cyl(.035,.2,M(0xc02020,{roughness:.4}),0,0,-.15,tool3d);hd.rotation.x=Math.PI/2;const r1=cyl(.038,.03,GOLD,0,0,-.05,tool3d);r1.rotation.x=Math.PI/2;const sf=cyl(.01,.28,METAL,0,0,.1,tool3d);sf.rotation.x=Math.PI/2;box(.025,.004,.03,METAL,0,0,.24,tool3d)}
tool3d.position.set(58.1,1.04,1.1);tool3d.rotation.y=.5;tool3d.visible=S.inv.includes('tool');sc.add(tool3d);
const TG={cpu:[0,.4,-.1],cool:[0,.4,-.1],mb:[-.3,-.3,-.35],gpu:[-.2,-.1,.1],case:[0,0,.5]},bUI=document.createElement('div'),fd=document.createElement('div');
bUI.style.cssText='position:fixed;right:16px;top:16px;width:340px;max-height:92%;overflow:auto;z-index:6;background:#120a1e;border:2px solid #d4af37;border-radius:12px;padding:12px;color:#f3e3b0;display:none;box-shadow:0 0 30px #7b2fff;font-size:14px';document.body.appendChild(bUI);
fd.style.cssText='position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:35;transition:opacity .25s';document.body.appendChild(fd);
const fadeTo=fn=>{fd.style.opacity=1;setTimeout(()=>{fn();fd.style.opacity=0},280)};
function benchUI(){const B=S.build;bUI.innerHTML=`<b style="font-size:17px">🔧 ATELIER</b> <small>($ pour sortir)</small><p>${S.inv.includes('tool')?(holding?'🪛 Tournevis en main':'🪛 Tournevis sur la table : clique dessus pour le prendre'):'🪛 Pas de tournevis : achète-le sur MAMAZON'}</p>`+Object.keys(TL).filter(t=>t!='tool').map(t=>`<div class="row"><div style="width:110px"><b>${TL[t]}</b></div><select data-t="${t}" style="flex:1">${S.inv.filter(i=>CAT[i].t==t).map(i=>`<option value="${i}" ${B[t]==i?'selected':''}>${CAT[i].n}${B[t]==i?' ✔':''}</option>`).join('')}</select><button data-i="${t}">Installer</button></div>`).join('')+'<p><small>Les pièces installées apparaissent sur ton vrai PC.</small></p>'}
bUI.addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(!b)return;const t=b.dataset.i,id=bUI.querySelector(`select[data-t="${t}"]`).value;installPart(t,id)});
function installPart(ty,id){if(benchBusy)return;if(S.build[ty]==id)return toast('Déjà installé');if(ty!='mon'&&!holding)return toast(S.inv.includes('tool')?'Prends d’abord le tournevis sur la table (clique dessus)':'Il te faut un tournevis : achète-le sur MAMAZON');
 benchBusy=1;const fin=()=>{S.build[ty]=id;save();refreshPC();benchUI();benchBusy=0;tool3d.visible=false;toast(CAT[id].n+' installé !');tick({f:900,q:.7,d:.09,v:1.2,th:110,tv:.7})};if(ty=='mon')return fin();
 const P=bc.localToWorld(new THREE.Vector3(...TG[ty])),a=tool3d.position.clone(),b=P.clone().add(new THREE.Vector3(0,.1,.55));tool3d.visible=true;let n=0;const iv=setInterval(()=>{n++;tool3d.position.lerpVectors(a,b,Math.min(1,n/6));tool3d.lookAt(P);tool3d.children[2].rotation.y+=.9;if(n>6)tick({f:2200,q:3,d:.015,v:.6});if(n>=22){clearInterval(iv);fin()}},80)}
function benchClick(e){mv.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);rc.setFromCamera(mv,cam);if(tool3d.visible&&!benchBusy&&rc.intersectObject(tool3d,true)[0]){holding=1;tool3d.visible=false;toast('Tournevis en main 🪛');tick({f:1500,q:2,d:.03,v:.8});benchUI()}}
function toggleBench(){if(busy||benchBusy)return;if(view=='table'){fadeTo(()=>{view='home';tp.copy(home.p);tl.copy(home.l);cp.copy(tp);cl.copy(tl);bUI.style.display='none'})}
 else if(ON.v)toast('Éteins le PC d’abord (menu démarrer → Arrêter)');else if(view=='home'&&pn.style.display!='block'){if(tut.s>=0)return toast('Termine le tutoriel d’abord');fadeTo(()=>{view='table';tp.set(60,2.9,4.6);tl.set(60,2.15,0);cp.copy(tp);cl.copy(tl);tool3d.visible=S.inv.includes('tool')&&!holding;benchUI();bUI.style.display='block'})}}
// --- boîtier PC : châssis, façade verre trempé, 3 ventilateurs RGB à pales, radiateur, bouton d'alimentation ---
const TX=4.35,TZ=-.15,cs=new THREE.Group();cs.position.set(TX,1.84,TZ);cs.rotation.y=-1.0;cs.scale.setScalar(.8);sc.add(cs);
caseShell(cs,false);rb(.98,2.0,.04,.04,M(0x0a0a10,{metalness:.5,roughness:.5}),0,0,.45,cs,.004);
const glass=new THREE.Mesh(new THREE.PlaneGeometry(1.0,2.0),new THREE.MeshPhysicalMaterial({color:0x05050a,roughness:.04,metalness:0,transparent:true,opacity:.28,envMapIntensity:1.6,clearcoat:1}));glass.position.z=.588;cs.add(glass);
box(.9,1.8,.08,M(0x08080c,{roughness:.7,metalness:.6}),0,0,.35,cs); // radiateur AIO
const fans=[.58,0,-.58].map(k=>{const f=new THREE.Group();f.position.set(0,k,.52);cs.add(f);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.23,.03,10,40),new THREE.MeshStandardMaterial({color:0x111111,emissive:0x7b2fff,emissiveIntensity:0}));f.add(ring);
 rb(.5,.5,.03,.05,M(0x0c0c10,{roughness:.6}),0,0,-.02,f,.004);
 const sp=new THREE.Group();f.add(sp);cyl(.06,.04,GOLD,0,0,0,sp).rotation.x=Math.PI/2;for(let i=0;i<9;i++){const bl=box(.06,.17,.008,M(0x15151c,{roughness:.5}),0,0,0,sp);const a=i/9*Math.PI*2;bl.position.set(Math.cos(a)*.13,Math.sin(a)*.13,0);bl.rotation.z=a-Math.PI/2;bl.rotation.x=.5}
 f.userData={ring,sp};return f});
box(.04,1.8,.03,LED(0x7b2fff),.44,0,.6,cs);rb(1.05,.04,1.15,.01,GOLD,0,1.05,0,cs,.004);
const cpl=new THREE.PointLight(0x7b2fff,0,4);cpl.position.set(.2,0,-.1);cs.add(cpl);
const pbtn=cyl(.075,.05,M(0xd4af37,{metalness:.85,roughness:.28,emissive:0x331100}),0,.93,.6,cs);pbtn.rotation.x=Math.PI/2;pbtn.name='power';const pz0=pbtn.position.z;
const pring=new THREE.Mesh(new THREE.TorusGeometry(.095,.011,8,28),new THREE.MeshStandardMaterial({color:0x111111,emissive:0x00aa55,emissiveIntensity:0}));pring.position.set(0,.93,.6);cs.add(pring);
const hit=new THREE.Mesh(new THREE.SphereGeometry(.26),new THREE.MeshBasicMaterial({visible:false}));hit.position.copy(pbtn.position);hit.name='power';cs.add(hit);
cable([[3.7,1.5,-.9],[3.3,1.05,-1.1],[1.9,.99,-1.15],[1.0,2.2,-1.35]]);cable([[3.7,1.4,-.9],[3.0,1.0,-.8],[2.3,1.0,-1.1],[2.3,1.55,-.7]]);
// --- lumières : spot principal à ombres, accents violets, lueur de l'écran ---
const amb=new THREE.AmbientLight(0x8070a0,1.6);sc.add(amb);
const room=new THREE.SpotLight(0xffe2b0,380,24,.85,.9,1.6);room.position.set(0,6.2,4.5);room.target.position.set(0,1.5,0);sc.add(room,room.target);
room.castShadow=true;room.shadow.mapSize.set(...[[1024,1024],[2048,2048],[2048,2048]][S.set.q|0]||[2048,2048]);room.shadow.bias=-.0004;room.shadow.normalBias=.02;
[[-3,3,1],[3,3,1],[0,2,-2.5]].forEach(p=>{const l=new THREE.PointLight(0x7b2fff,18,9);l.position.set(p[0],p[1],p[2]);sc.add(l)});
const key=new THREE.PointLight(0xd4af37,6,8);key.position.set(0,3.2,2);sc.add(key);
// --- L'ÉCRAN UNIQUE du PC : coque, dalle brillante avec reflets, pied, bureau Windows 11 dessiné en direct ---
const MW=3.5,MH=1.95,SW=1024,SH=576,scrDef={left:[0,2.25,-.9,0]},scr={},glow={},ON={v:0},GL={left:0x3a7bd5};let scrOn=0;
const mg={},sCv={},sTx={};for(const n in scrDef){const k=document.createElement('canvas');k.width=SW*2;k.height=SH*2;const t=new THREE.CanvasTexture(k);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;sCv[n]=k;sTx[n]=t}
for(const n in scrDef){const p=scrDef[n],g=new THREE.Group();g.position.set(p[0],p[1],p[2]);g.rotation.y=p[3];sc.add(g);mg[n]=g;g.userData.drop=p[1]-1.0;
 rb(MW,MH,.07,.05,SATIN,0,0,0,g,.01);rb(MW*.86,MH*.8,.12,.07,M(0x15151b,{roughness:.5,metalness:.4}),0,0,-.09,g,.015);rb(MW*.3,.05,.012,.02,GOLD,0,-MH/2+.035,.04,g,.004);
 const dm=new THREE.MeshPhysicalMaterial({color:0x000000,roughness:.04,metalness:0,clearcoat:1,clearcoatRoughness:.05,emissive:0xffffff,emissiveMap:sTx[n],emissiveIntensity:0,envMapIntensity:1.2});
 const m=new THREE.Mesh(new THREE.PlaneGeometry(MW-.08,MH-.1),dm);m.position.set(0,.01,.042);m.name=n;g.add(m);scr[n]=m;
 const dot=new THREE.Mesh(new THREE.SphereGeometry(.012,8,8),new THREE.MeshBasicMaterial({color:0x222222}));dot.position.set(MW*.4,-MH/2+.035,.045);g.add(dot);m.userData.dot=dot;
 const drop=p[1]-1.0;rb(.18,drop,.06,.03,METAL,0,-drop/2,-.14,g,.01);
 const base=cyl(.5,.03,METAL,0,-drop+.015,-.14,g);base.scale.set(1,1,.62);
 const l=new THREE.PointLight(GL[n],0,6);l.position.set(p[0]+Math.sin(p[3])*1.2,p[1],p[2]+Math.cos(p[3])*1.2);sc.add(l);glow[n]=l;halo(GL[n],4.6,p[0],p[1],p[2]-.5,.35)}
// poussière en suspension dans la lumière violette
const dg=new THREE.BufferGeometry(),dp=new Float32Array(240*3);for(let i=0;i<240;i++){dp[i*3]=R(-5,5);dp[i*3+1]=R(1,5);dp[i*3+2]=R(-2,5)}dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
const dust=new THREE.Points(dg,new THREE.PointsMaterial({color:0xc9a8ff,size:.025,transparent:true,opacity:.5,depthWrite:false,blending:THREE.AdditiveBlending}));sc.add(dust);
// profondeur de champ simulée : flou + vignette sur les bords de l'écran (CSS)
const vg=document.createElement('div');vg.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:3;background:radial-gradient(ellipse at 50% 45%,transparent 52%,rgba(2,0,6,.6) 100%);-webkit-backdrop-filter:blur(2.5px);backdrop-filter:blur(2.5px);-webkit-mask-image:radial-gradient(ellipse at 50% 45%,transparent 56%,#000 100%);mask-image:radial-gradient(ellipse at 50% 45%,transparent 56%,#000 100%)';document.body.appendChild(vg);
// ----- interface dessinée sur l'écran (mise à jour en direct) -----
const FNT='Segoe UI,Tahoma,sans-serif',rr=(g,x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
const BGC=[['#5aa0f0','#4caf2a'],['#1b2a49','#0a0f1c'],['#e8a33d','#7a3b12']],FTS=['Tahoma','Georgia','Courier New'];
// fond d'écran Windows 11 (fleur bleue lumineuse)
function win11bg(g,T){const gr=g.createLinearGradient(0,0,SW,SH);gr.addColorStop(0,'#050f2a');gr.addColorStop(1,'#0b3f9c');g.fillStyle=gr;g.fillRect(0,0,SW,SH);g.save();g.translate(SW*.5,SH*.46);g.globalCompositeOperation='lighter';for(let i=0;i<6;i++){g.save();g.rotate(i*Math.PI/3+.35+Math.sin(T*.3)*.02);const p=g.createLinearGradient(0,0,0,-270);p.addColorStop(0,'rgba(0,110,255,0)');p.addColorStop(.55,'rgba(40,150,255,.55)');p.addColorStop(1,'rgba(160,225,255,.18)');g.fillStyle=p;g.beginPath();g.ellipse(0,-135,92,155,0,0,7);g.fill();g.restore()}const c=g.createRadialGradient(0,0,0,0,0,250);c.addColorStop(0,'rgba(210,240,255,.65)');c.addColorStop(1,'rgba(0,80,255,0)');g.fillStyle=c;g.fillRect(-320,-320,640,640);g.restore()}
function drawL(g,T){if(S.desk.bg==0){win11bg(g,T)}else{const b=BGC[S.desk.bg],gr=g.createLinearGradient(0,0,0,SH);gr.addColorStop(0,b[0]);gr.addColorStop(1,b[1]);g.fillStyle=gr;g.fillRect(0,0,SW,SH)}
 g.textAlign='center';g.textBaseline='middle';
 if(!started){const p=1+Math.sin(T*3)*.04;g.save();g.translate(SW/2,SH/2);g.scale(p,p);g.shadowColor='#fff';g.shadowBlur=40;const gr=g.createLinearGradient(0,-55,0,55);gr.addColorStop(0,'#7be08a');gr.addColorStop(1,'#1d7a2b');g.fillStyle=gr;rr(g,-230,-55,460,110,55);g.fill();g.lineWidth=6;g.strokeStyle='#fff';g.stroke();g.shadowBlur=0;g.fillStyle='#fff';g.font='bold 54px '+FNT;g.fillText('COMMENCER',0,4);g.restore();return}
 APPS.filter(a=>a[0]!='sub'||vipOn()).forEach((a,i)=>{const x=64+(i/6|0)*100,y=46+(i%6)*78;g.fillStyle='#fff';g.font='36px '+FNT;g.fillText(a[2],x,y);g.font='14px '+FNT;g.shadowColor='#000';g.shadowBlur=4;g.fillText(a[1],x,y+30);g.shadowBlur=0});
 if(app){const A=APPS.find(a=>a[0]==app);g.save();g.shadowColor='rgba(0,0,0,.6)';g.shadowBlur=30;g.fillStyle='#fff';rr(g,250,26,SW-280,SH-110,12);g.fill();g.restore();g.fillStyle='#f3f3f3';g.beginPath();g.moveTo(250,66);g.lineTo(250,38);g.arcTo(250,26,262,26,12);g.lineTo(SW-42,26);g.arcTo(SW-30,26,SW-30,38,12);g.lineTo(SW-30,66);g.closePath();g.fill();g.fillStyle='#222';g.font='16px '+FNT;g.textAlign='left';g.fillText(A[2]+'  '+A[1],266,46);g.textAlign='right';g.fillText('—     ▢     ✕',SW-44,46);g.textAlign='left';g.font='22px '+FNT;
  const L2={phone:['Appels passés : '+S.calls,'Contacts : '+CH.filter(avail).length],bol:['Dossiers : '+S.unl.length],scam:['Cartes validées : '+Object.keys(S.scam).length],bank:['Solde : '+S.bal.toLocaleString('fr-FR')+' ₢'],shop:['VIP : '+(vipOn()?'actif':'inactif'),'Solde : '+S.bal+' ₢','Pièces possédées : '+S.inv.length],sub:['VIP actif'],save:['Dernière sauvegarde : '+(S.u?new Date(S.u).toLocaleTimeString('fr-FR'):'—')],quest:['Quêtes terminées : '+Object.keys(S.cl).length+'/'+QU.length],dset:['Fond '+(S.desk.bg+1)+' · '+FTS[S.desk.font]]}[app]||[];g.fillStyle='#111';L2.forEach((t,i)=>g.fillText(t,276,106+i*36));g.textAlign='center'}
 if(call){g.fillStyle='#d32727';rr(g,SW/2-170,SH-130,340,44,22);g.fill();g.fillStyle='#fff';g.font='bold 20px '+FNT;g.fillText('📞 Appel : '+call.c.n,SW/2,SH-108)}
 if(menuOpen){g.save();g.shadowColor='rgba(0,0,0,.6)';g.shadowBlur=30;g.fillStyle='rgba(34,36,48,.97)';rr(g,SW/2-210,SH-56-340,420,330,14);g.fill();g.restore();g.fillStyle='#fff';g.font='bold 16px '+FNT;g.textAlign='left';g.fillText('Épinglé',SW/2-190,SH-56-320);g.textAlign='center';APPS.filter(a=>a[0]!='sub'||vipOn()).forEach((a,i)=>{const x=SW/2-130+(i%3)*130,y=SH-56-270+(i/3|0)*72;g.font='32px '+FNT;g.fillText(a[2],x,y);g.font='13px '+FNT;g.fillText(a[1],x,y+28)})}
 g.fillStyle='rgba(22,24,34,.94)';g.fillRect(0,SH-56,SW,56);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(0,SH-56,SW,1);
 const tI=['⊞','🔍'].concat(APPS.slice(0,5).map(a=>a[2]));tI.forEach((e,i)=>{const x=SW/2-tI.length*26+i*52+26;if(i==0&&menuOpen){g.fillStyle='rgba(255,255,255,.15)';rr(g,x-22,SH-50,44,44,8);g.fill()}if(app&&i>1&&APPS[i-2][0]==app){g.fillStyle='#4cc2ff';g.fillRect(x-8,SH-8,16,3)}g.font=(i==0?'30px ':'26px ')+FNT;g.fillStyle=i==0?'#4cc2ff':'#fff';g.fillText(e,x,SH-28)});
 g.textAlign='right';g.font='15px '+FNT;g.fillStyle='#fff';g.fillText(clk(),SW-16,SH-36);g.fillText(new Date().toLocaleDateString('fr-FR'),SW-16,SH-16);g.textAlign='center'}
function drawAll(T){for(const n in scrDef){const g=sCv[n].getContext('2d');g.setTransform(2,0,0,2,0,0);g.clearRect(0,0,SW,SH);g.textBaseline='alphabetic';if(scrOn){drawL(g,T);const v=g.createRadialGradient(SW/2,SH/2,SH*.35,SW/2,SH/2,SW*.62);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.35)');g.fillStyle=v;g.fillRect(0,0,SW,SH);g.fillStyle='rgba(0,0,0,.07)';for(let y=0;y<SH;y+=3)g.fillRect(0,y,SW,1)}else{g.fillStyle='#000';g.fillRect(0,0,SW,SH)}sTx[n].needsUpdate=true}}
// ----- caméra -----
const home={p:new THREE.Vector3(.5,2.6,6.3),l:new THREE.Vector3(.4,2.2,-.5)};let tp=home.p.clone(),tl=home.l.clone(),cl=home.l.clone(),cp=home.p.clone(),view='home';cam.position.copy(tp);
function size(){const q=[.5,.75,1][S.set.q|0]||1;rd.setPixelRatio(Math.min(devicePixelRatio,2)*q);rd.setSize(innerWidth,innerHeight);if(COMP)COMP.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();document.body.style.zoom=S.set.sc;vg.style.display=(S.set.q>=1&&S.set.fx>0)?'block':'none'}
addEventListener('resize',size);size();
function go(n){view=n;if(n=='home'){tp.copy(home.p);tl.copy(home.l)}else{const p=scrDef[n],d=3.1;tp.set(p[0]+Math.sin(p[3])*d,p[1],p[2]+Math.cos(p[3])*d);tl.set(p[0],p[1],p[2])}}
// ----- animation : mains, clavier, souris, lumières, caméra -----
const pv=new THREE.Vector3(),off={x:0,y:0},ptr={x:0,y:0},presses=new Map(),fpT=[[0,0,0,0],[0,0,0,0]],mt={x:1.45,z:1.3};let typing=0,typT=0,clkT=0,lastKX=0,lastD=-1,lastPtr=0;
addEventListener('pointermove',e=>{ptr.x=e.clientX/innerWidth*2-1;ptr.y=e.clientY/innerHeight*2-1;lastPtr=performance.now()});
addEventListener('pointerdown',()=>{clkT=performance.now();mclick()});
addEventListener('keydown',e=>{if(e.key=='$'&&!/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||'')){toggleBench();return}typing=1;const ki=(e.key&&e.key.length==1?e.key.toLowerCase().charCodeAt(0):e.keyCode||7)%kp.length;presses.set(ki,performance.now());const h=kp[ki][0]<KB.x?0:1;fpT[h][ki%4]=performance.now();lastKX=kp[ki][0]-KB.x;clearTimeout(typT);typT=setTimeout(()=>typing=0,400);kbd(e.key)});
function loop(t){requestAnimationFrame(loop);const T=t/1000,now=performance.now(),hm=view=='home';
 cp.lerp(tp,.07);cl.lerp(tl,.07);off.x+=((hm?ptr.x*.4:ptr.x*.05)-off.x)*.05;off.y+=((hm?-ptr.y*.15:-ptr.y*.03)-off.y)*.05;
 cam.position.set(cp.x+off.x+Math.sin(T*.5)*.015,cp.y+off.y+Math.sin(T*.7)*.012,cp.z);cam.lookAt(cl);
 // souris : la main droite suit réellement le pointeur
 const idle=now-lastPtr>1500;mt.x+=((1.45+Math.max(-1,Math.min(1,ptr.x))*.3+(idle?Math.sin(T*.8)*.08:0))-mt.x)*.1;mt.z+=((1.3+ptr.y*.1+(idle?Math.cos(T*1.1)*.05:0))-mt.z)*.1;
 mouse.position.set(mt.x,.99,mt.z);mouse.rotation.y=-(mt.x-1.45)*.2;btnL.position.y=.093-(now-clkT<110?.012:0);
 hands[1].position.set(mt.x,1.12,mt.z+.12);
 // clavier : main gauche, doigts et touches enfoncées
 hands[0].position.x+=((-.7+lastKX*.25)-hands[0].position.x)*.1;hands[0].position.y=1.1+(typing?Math.sin(T*14)*.006:0);hands[0].position.z=1.45;
 hands.forEach((h,hi)=>h.userData.f.forEach((f,i)=>{const p=Math.max(0,1-(now-fpT[hi][i])/170),id=typing?Math.max(0,Math.sin(T*16+i*1.7+hi*2.3))*.15*(hi==0?1:.3):0,cc=(hi==1&&i==0)?Math.max(0,1-(now-clkT)/130):0,a=p*.55+id+cc*.5,j=f.userData.j;j[0].rotation.x=-(.12+a*.6);j[1].rotation.x=-(.32+a*.8);j[2].rotation.x=-(.22+a*.5)}));
 presses.forEach((t0,i)=>{const d=1-(now-t0)/130;if(d<=0){setKey(i,0);presses.delete(i)}else setKey(i,.03*d)});
 // RGB : clavier, ventilateurs, LEDs ; lueur de l'écran
 const hue=(T/7)%1,hc=new THREE.Color().setHSL(hue,.9,.5);keys.material.emissive.setHSL(hue,.9,ON.v?.07:0);kbGlow.material.emissive.copy(hc);kbGlow.material.emissiveIntensity=ON.v?1.4:0;
 fans.forEach((f,i)=>{const m=f.userData.ring.material;m.emissive.setHSL((hue+i*.12)%1,.9,.5);m.emissiveIntensity=ON.v?1.8:0;f.userData.sp.rotation.z-=ON.v?.12:0});rgbM.forEach((m,i)=>{m.emissive.setHSL((hue+i*.04)%1,.9,.5);m.emissiveIntensity=ON.v?1.8:(view=='table'?.2:0)});spinners.forEach(q=>q.rotation.x+=ON.v?.18:0);
 for(const n in glow){const l=glow[n];l.intensity+=((ON.v?10*S.set.fx:0)-l.intensity)*.05;scr[n].material.emissiveIntensity+=((scrOn?1:0)-scr[n].material.emissiveIntensity)*.08;scr[n].userData.dot.material.color.setHex(ON.v?0x2aff6a:0x222222)}
 ug.intensity+=((ON.v?14*S.set.fx:0)-ug.intensity)*.05;cpl.intensity+=((ON.v?10*S.set.fx:0)-cpl.intensity)*.05;halos.forEach(h=>h.material.opacity=h.userData.o*(ON.v?1:.12)*(.5+.5*S.set.fx));
 pbtn.material.emissive.setHex(tut.s==0&&!ON.v?(Math.sin(t/150)>0?0xffffff:0x333300):ON.v?0x00aa55:0x331100);pring.material.emissiveIntensity=ON.v?2:0;
 key.intensity=6*S.set.fx;room.intensity+=((ON.v?35:380)-room.intensity)*.04;amb.intensity+=((ON.v?.25:1.6)-amb.intensity)*.04;dust.rotation.y=T*.015;dust.position.y=Math.sin(T*.3)*.1;
 // écran animé (~8 images/s)
 if(T-(loop.d||0)>.12||lastD!==scrOn){loop.d=T;lastD=scrOn;drawAll(T)}
 // flèche + zone lumineuse du tutoriel
 const ar=$('#arrow'),tg=tut.s>=0&&view=='home'&&pn.style.display!='block'?(ON.v?(TS[tut.s][0]!='power'?scr.left:null):hit):null;
 if(tg){tg.getWorldPosition(pv);pv.project(cam);ar.style.display='block';ar.style.left=((pv.x+1)/2*innerWidth/S.set.sc)+'px';ar.style.top=((1-pv.y)/2*innerHeight/S.set.sc)+'px'}else ar.style.display='none';
 // le bureau HTML (applis) est collé pile sur la dalle 3D de l'écran
 if(pn.style.display=='block'&&scr.left){const w=MW-.08,h=MH-.1,P=[[-1,1],[1,-1]].map(a=>{const v=new THREE.Vector3(a[0]*w/2,a[1]*h/2,0);scr.left.localToWorld(v);v.project(cam);return[(v.x+1)/2*innerWidth/S.set.sc,(1-v.y)/2*innerHeight/S.set.sc]}),W=P[1][0]-P[0][0],s=pn.style;s.left=P[0][0]+'px';s.top=P[0][1]+'px';s.width='1000px';s.height=Math.round(1000*h/w)+'px';s.transform='scale('+(W/1000)+')';s.transformOrigin='0 0';s.border='none';s.borderRadius='4px';s.boxShadow='none'}
 COMP?COMP.render():rd.render(sc,cam)}
// ---------- Tutoriel ----------
const TS=[['power','Clique sur le bouton d’alimentation doré du boîtier (à droite).'],['left','Clique sur l’écran du PC pour le zoomer.'],['start','Clique sur COMMENCER.'],['phone','Ouvre l’application Téléphone : tu y appelles des personnages. Discute, mets-les en confiance (jauge), donne un prétexte crédible (sécurité, remboursement…), puis demande leur carte. Note-la et saisis-la dans SCAM pour recevoir leur solde. Ma Banque, MAMAZON, VIP x2, sauvegardes : ENREGISTRER.'],['call','Appelle un contact (bouton Appeler) ou réponds à un appel entrant.'],['end','Discute poliment, mets-le en confiance, demande sa carte (jauge assez haute) puis raccroche.']];
const tut={s:S.tut?-1:0};
function tShow(){const e=$('#tut');if(tut.s<0){e.style.display='none';return}e.style.display='block';e.textContent=`Tutoriel ${tut.s+1}/${TS.length} — ${TS[tut.s][1]}`}
const ok=n=>tut.s<0||TS[tut.s][0]==n||n=='x'||(!$('#tut')?1:0)||(toast('Suis le tutoriel : action non autorisée pour l’instant'),0);
const okS=n=>tut.s<0||(n=='left'&&['left','start','phone','call','end'].includes(TS[tut.s][0]))||(toast('Suis le tutoriel : clique sur l’élément en surbrillance'),0);
function ev(n){if(tut.s<0||TS[tut.s][0]!=n)return;tut.s++;if(tut.s>=TS.length){tut.s=-1;S.tut=1;toast('Tutoriel terminé ! Tu es libre de jouer. Aucun objectif obligatoire.');save()}tShow()}
tShow();
// ---------- Interaction 3D ----------
const rc=new THREE.Raycaster(),mv=new THREE.Vector2();
cv.addEventListener('click',e=>{if(view=='table')return benchClick(e);if(view!='home'||busy)return;mv.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);rc.setFromCamera(mv,cam);const h=rc.intersectObjects([pbtn,hit,...Object.values(scr)])[0];if(!h)return;const n=h.object.name;
 if(n=='power'){if(ok('power')&&!ON.v)boot()}else if(ON.v&&scrOn&&okS(n)){go(n);busy=1;setTimeout(()=>{busy=0;panel(n)},850);ev(n)}});
let busy=0;
$('#x').onclick=()=>{$('#pn').style.display=$('#x').style.display='none';go('home')};
function boot(){busy=1;ON.v=1;pbtn.position.z=pz0-.04;pwrClick();humOn();$('#boot').style.display='flex';setTimeout(()=>{$('#boot').style.display='none';chime();scrOn=1;busy=0;ev('power');vipTick()},2600)}
async function shutdown(){busy=1;const m=$('#msg');m.style.display='flex';m.textContent='Sauvegarde de la progression…';await save(1);await new Promise(r=>setTimeout(r,1200));m.textContent='EXTINCTION DU PC…';await new Promise(r=>setTimeout(r,1500));
 scrOn=0;ON.v=0;humOff();pwrClick();pbtn.position.z=pz0;$('#pn').style.display=$('#x').style.display='none';go('home');m.style.display='none';busy=0;toast('PC éteint. Rallume-le avec le bouton.')}
// ---------- Panneaux (le bureau Windows + toutes les applis, DANS le PC) ----------
let app=null,menuOpen=0,started=0;const pn=$('#pn');
const APPS=[['phone','Téléphone','📞'],['bol','BOL','📇'],['scam','SCAM','🪪'],['bank','Ma Banque','🏦'],['shop','MAMAZON','🛒'],['sub','ABONNEMENT','⭐'],['save','ENREGISTRER','💾'],['quest','Quêtes','🏆'],['dset','Bureau','🖼️'],['login','Connexion','🔑'],['param','Paramètres','⚙️']];
const BG=['radial-gradient(ellipse 40% 55% at 52% 45%,rgba(150,215,255,.8),transparent 70%),radial-gradient(ellipse 20% 60% at 36% 50%,rgba(0,120,255,.85),transparent 70%),radial-gradient(ellipse 20% 60% at 68% 50%,rgba(50,90,255,.85),transparent 70%),linear-gradient(135deg,#050f2a,#0b3f9c)','linear-gradient(#1b2a49,#0a0f1c)','linear-gradient(#e8a33d,#7a3b12)'],FT=['Tahoma','Georgia','Courier New'];
function panel(n){pn.style.display=$('#x').style.display='block';pn.dataset.n=n;render()}
function render(){const n=pn.dataset.n;if(n=='left')pn.innerHTML=started?desktop():`<div class="dk" style="background:${BG[0]};display:flex;align-items:center;justify-content:center"><button data-a="start" id="cb">COMMENCER</button></div>`;
 else if(n=='top')pn.innerHTML=loginUI();else pn.innerHTML=settingsUI(1);
 if(tut.s>=0)document.querySelectorAll(`[data-a="${TS[tut.s][0]=='phone'?'app:phone':TS[tut.s][0]=='start'?'start':''}"]`).forEach(e=>e.classList.add('hl'))}
const clk=()=>new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
function desktop(){const q=($('#sq')||{}).value||'';const ap=APPS.filter(a=>a[0]!='sub'||vipOn());
 return`<div class="dk" style="background:${BG[S.desk.bg]};font-family:${FT[S.desk.font]};height:100%">${ap.map(a=>`<span class="ic" data-a="app:${a[0]}"><b>${a[2]}</b>${a[1]}</span>`).join('')}${app?`<div class="win"><div style="display:flex;justify-content:space-between"><b>${APPS.find(a=>a[0]==app)[1]}</b><button data-a="close">✕</button></div><hr>${APP[app]()}</div>`:''}
 <div class="menu" style="display:${menuOpen?'block':'none'}">${ap.map(a=>`<div data-a="app:${a[0]}">${a[2]} ${a[1]}</div>`).join('')}<div data-a="off">⏻ Arrêter</div></div>
 <div class="tb"><span class="st" data-a="menu" style="padding:4px 12px">⊞</span><input id="sq" placeholder="Rechercher une appli…" value="${q}" style="width:160px"><span id="sr"></span><span style="margin-left:auto">${clk()}</span></div></div>`}
const APP={
phone(){const l=CH.filter(avail);return`<button data-a="tab:c">Contacts</button> <button data-a="tab:h">Historique</button> <label><input type="checkbox" data-a="inc" ${S.set.inc?'checked':''}> Appels entrants</label>
 ${phoneTab=='h'?(S.hist.slice().reverse().map(h=>`<div class="row">${CH[h.i].n} — ${h.r} — ${new Date(h.d).toLocaleTimeString('fr-FR')}</div>`).join('')||'<p>Aucun appel.</p>'):l.slice(0,60).map(c=>`<div class="row"><span class="pt">${face(c)}</span><span>${c.n}<br><small>${TD[c.ty].nm}</small></span><button data-a="dial:${c.i}">Appeler</button></div>`).join('')}`},
bol(){return S.unl.length?S.unl.map(i=>{const c=CH[i];return`<div class="row"><span class="pt">${face(c)}</span><div><b>${c.n}</b> — ${S.scam[i]?'Dossier validé':'Débloqué'}<br><small>${c.story}<br>Carte fictive : ${card(i).n} · exp ${card(i).exp} · CVV ${card(i).cvv} · solde ${card(i).bal} ₢ · statut ${['actif','en attente','archivé'][i%3]}</small></div></div>`}).join(''):'<p>Aucun personnage débloqué. Obtiens une carte au téléphone et valide-la dans SCAM.</p>'},
scam(){return`<p>Saisis la carte obtenue au téléphone (données FICTIVES générées par le jeu : n’entre jamais une vraie carte !).</p><p><input id="sm" placeholder="NOM SUR LA CARTE" style="width:60%"><br><input id="sn" placeholder="0000 0000 0000 0000"> <input id="se" placeholder="MM/AA" size="6"> <input id="sv" placeholder="CVV" size="4"></p><button data-a="val">Valider</button><div id="sres"></div><h4>Bloc-notes</h4><textarea id="nt" data-n="1" rows="5" style="width:95%">${S.notes||''}</textarea>`},
bank(){return`<h3>Solde : ${S.bal.toLocaleString('fr-FR')} ₢</h3>${S.tx.slice().reverse().map(t=>`<div class="row"><span style="color:${t.a>0?'green':'#a00'}">${t.a>0?'+':''}${t.a}</span> ${t.l} <small>${new Date(t.d).toLocaleTimeString('fr-FR')}</small></div>`).join('')||'<p>Aucune transaction.</p>'}`},
shop(){const it=[['vip','VIP x2 (gains doublés, renouvelé /60 min)',PRICE.vip,'légendaire'],['ultime','Installation ultime (cosmétique PC)',PRICE.ultime,'légendaire'],['cosm','Fond d’écran Nuit & police Georgia',PRICE.cosm,'rare']];
 return`<h3>Solde : ${S.bal} ₢</h3>${it.map(a=>`<div class="row"><div><b>${a[1]}</b><br><small>${a[3]}</small></div><span style="margin-left:auto">${a[2]} ₢</span><button data-a="buy:${a[0]}" ${S.bought.includes(a[0])||(a[0]=='vip'&&vipOn())?'disabled':''}>Acheter</button></div>`).join('')}${catHTML()}<h4>Personnages premium</h4>${CH.filter(c=>c.prem).map(c=>{const p=prc(c);return`<div class="row"><span class="pt" style="width:44px;height:44px">${face(c)}</span><div>${c.n} <small>${c.rar}</small></div><span style="margin-left:auto">${p} ₢</span><button data-a="buy:p${c.i}" ${S.own.includes(c.i)?'disabled':''}>${S.own.includes(c.i)?'Possédé':'Acheter'}</button></div>`}).join('')}`},
sub(){return`<p>VIP actif : gains x2. Prochain renouvellement : ${new Date(S.vip.next).toLocaleTimeString('fr-FR')} (${PRICE.vipRenew} ₢).</p><button data-a="cancel">Annuler l’abonnement</button>`},
save(){return`<button data-a="dosave">Enregistrer maintenant</button><div id="svs"></div>`},
quest(){return QU.map(q=>{const d=q.c(),cl=S.cl[q.id];return`<div class="row"><div>${q.t}<br><small>${cl?'Récompense récupérée':d?'Terminé':S.seen.quest?'En cours':'Non commencé'} — ${q.r} ₢</small></div><button data-a="qc:${q.id}" ${d&&!cl?'':'disabled'}>Récupérer</button></div>`}).join('')},
dset(){return`<p>Fond :</p>${BG.map((b,i)=>`<button data-a="bg:${i}">Fond ${i+1}</button>`).join(' ')}<p>Police :</p>${FT.map((f,i)=>`<button data-a="ft:${i}" style="font-family:${f}">${f}</button>`).join(' ')}<p><small>Ne change que le bureau virtuel.</small></p>`}};
APP.login=()=>loginUI();APP.param=()=>settingsUI();
let phoneTab='c';const prc=c=>c.rar=='légendaire'?PRICE.legend:c.rar=='épique'?PRICE.epic:PRICE.rare;
const QU=[{id:'a',t:'Découvrir Ma Banque',r:200,c:()=>S.seen.bank},{id:'b',t:'Terminer 3 appels',r:500,c:()=>S.calls>=3},{id:'c',t:'Débloquer un personnage',r:1000,c:()=>S.unl.length>=1},{id:'d',t:'Atteindre 10 000 ₢',r:2000,c:()=>S.bal>=10000}];
function loginUI(){return`<div class="cen"><h2>Connexion (facultative)</h2><p id="who">${uid?'Connecté.':'Mode local : ta progression est enregistrée dans ce navigateur.'}</p>
 <button data-a="g" class="gg">🔵 Continuer avec Google</button><p><input id="em" type="email" placeholder="e-mail"> <input id="pw" type="password" placeholder="mot de passe (6+)"></p><button data-a="li">Se connecter</button> <button data-a="su">S’inscrire</button> <button data-a="lo">Déconnexion</button> <button data-a="x2">Continuer sans compte</button><p id="err" style="color:#f88"></p><small style="opacity:.7">Google : active ce fournisseur dans Authentication → Sign-in method, et ajoute ton domaine (ex. tonpseudo.github.io) dans Paramètres → Domaines autorisés. Le jeu marche aussi sans compte.</small></div>`}
function settingsUI(){const r=(k,l)=>`<p>${l} <input type="range" min="0" max="1" step=".05" value="${S.set[k]}" data-r="${k}"></p>`,c=(k,l)=>`<p><label><input type="checkbox" data-c="${k}" ${S.set[k]?'checked':''}> ${l}</label></p>`;
 return`<div class="cen"><h2>Paramètres</h2>${r('vol','Volume général')}${r('call','Volume des appels')}${r('sfx','Effets sonores')}<p>Qualité graphique <select data-s="q">${['Basse','Moyenne','Haute'].map((o,i)=>`<option value="${i}" ${S.set.q==i?'selected':''}>${o}</option>`).join('')}</select></p><p>Effets visuels <input type="range" min="0" max="1" step=".1" value="${S.set.fx}" data-r="fx"></p><p>Échelle d’affichage <select data-s="sc">${[.8,1,1.2].map(o=>`<option value="${o}" ${S.set.sc==o?'selected':''}>${o*100}%</option>`).join('')}</select></p>${c('voice','Voix des personnages')}${c('inc','Appels entrants')}<button data-a="rt">Refaire le tutoriel</button> <button data-a="wipe">Effacer les données locales</button></div>`}
pn.addEventListener('input',e=>{const t=e.target;if(t.dataset.n){S.notes=t.value;save()}if(t.dataset.r){S.set[t.dataset.r]=+t.value;size();save()}if(t.id=='sq'){const q=t.value.toLowerCase(),r=APPS.filter(a=>a[1].toLowerCase().includes(q)&&q);$('#sr').innerHTML=r.map(a=>`<u data-a="app:${a[0]}" style="cursor:pointer">${a[1]}</u> `).join('')}});
pn.addEventListener('change',e=>{const t=e.target;if(t.dataset.c){S.set[t.dataset.c]=t.checked?1:0;save()}if(t.dataset.s){S.set[t.dataset.s]=+t.value;size();save()}if(t.dataset.a=='inc'){S.set.inc=t.checked?1:0;save()}});
const w11=document.createElement('style');w11.textContent=`.tb{height:50px;background:rgba(24,26,36,.92);backdrop-filter:blur(20px);justify-content:center;border-top:1px solid #fff2}.tb span:last-child{position:absolute;right:12px}.st{background:transparent!important;border-radius:8px!important;font-size:24px;color:#4cc2ff}.st:hover{background:#fff2!important}.menu{left:50%;transform:translateX(-50%);bottom:58px;width:320px;border:1px solid #fff3;border-radius:12px;background:rgba(34,36,48,.97);color:#fff;box-shadow:0 10px 40px #000a}.menu div{border-radius:8px;margin:2px 6px}.menu div:hover{background:#fff2}.ic{border-radius:8px}.ic:hover{background:#fff3}.win{background:#fff;border:1px solid #0003;border-radius:12px;box-shadow:0 10px 40px #0009;font-family:Segoe UI,Tahoma,sans-serif}.win>div:first-child{background:#f3f3f3;margin:-10px -10px 8px;padding:8px 12px;border-radius:12px 12px 0 0}.win button{border-radius:6px;border:1px solid #0002;background:#fbfbfb}.win button:hover{background:#e9f3ff;box-shadow:none}#sq{border-radius:20px;background:#fff2;color:#fff;border:1px solid #fff3}.win .cen{color:#111}.win .row{color:#111}`;document.head.appendChild(w11);
// ---------- Actions ----------
document.addEventListener('click',async e=>{const el=e.target.closest('[data-a]');if(!el||el.disabled)return;const[a,v]=el.dataset.a.split(':');const re=()=>{render()};
 if(a=='start'){if(!ok('start'))return;started=1;ev('start');re()}
 else if(a=='menu'){menuOpen=!menuOpen;re()}
 else if(a=='app'){if(tut.s>=0&&v!='phone')return toast('Suis le tutoriel');app=v;menuOpen=0;S.seen[v]=1;if(v=='phone')ev('phone');save();re()}
 else if(a=='close'){app=null;re()}else if(a=='tab'){phoneTab=v;re()}
 else if(a=='off'){if(tut.s>=0)return toast('Termine le tutoriel d’abord');shutdown()}
 else if(a=='dial'){if(call)return;startCall(+v)}
 else if(a=='bg'){S.desk.bg=+v;save();re()}else if(a=='ft'){S.desk.font=+v;save();re()}
 else if(a=='buy')buy(v)
 else if(a=='cancel'){S.vip.on=0;S.vip=null;app=null;toast('Abonnement annulé');save();re()}
 else if(a=='qc'){const q=QU.find(x=>x.id==v);if(q.c()&&!S.cl[v]){S.cl[v]=1;gain(q.r,'Quête : '+q.t);re()}}
 else if(a=='val'){const g=id=>($(id).value||'').replace(/\s+/g,'').toUpperCase(),n=g('#sn'),nm=($('#sm').value||'').trim().toUpperCase(),ex=g('#se'),cv2=g('#sv'),r=$('#sres');const i=CH.findIndex(c=>{const k=card(c.i);return k.n.replace(/\s/g,'')==n&&k.name==nm&&k.exp==ex&&k.cvv==cv2});
 if(i<0||!S.rev[i])r.textContent='Carte fausse';else if(S.scam[i])r.textContent='Carte déjà utilisée.';else{S.scam[i]=1;if(!S.unl.includes(i))S.unl.push(i);const b=card(i).bal;gain(b,'Solde récupéré : '+CH[i].n);r.textContent='Carte valide ! Solde récupéré : +'+b*(vipOn()?2:1)+' ₢'}}
 else if(a=='dosave'){const s=$('#svs');s.textContent='Sauvegardement de la progression…';await new Promise(r=>setTimeout(r,3000));const r=await save(1);s.textContent=r?'Sauvegarde réussie ✔':'Erreur de sauvegarde'}
 else if(a=='rt'){S.tut=0;tut.s=0;tShow();save();toast('Tutoriel relancé : éteins puis rallume le PC.')}
 else if(a=='wipe'){if(confirm('Effacer la sauvegarde locale ?')){localStorage.removeItem(K);location.reload()}}
 else if(a=='x2'){$('#x').click()}else if(['g','li','su','lo'].includes(a))auth(a)
 else if(a=='ans'){answer()}else if(a=='ref'){hang('refusé',1)}else if(a=='snd')send();else if(a=='hup')hang('raccroché');else if(a=='mic')mic()});
function buy(k){if(CAT[k])return buyCat(k);if(k[0]=='p'){const i=+k.slice(1),c=CH[i];if(S.own.includes(i))return;if(spend(prc(c),'Achat '+c.n)){S.own.push(i);toast(c.n+' acheté !')}}
 else{if(S.bought.includes(k))return;if(k=='vip'&&vipOn())return;if(!spend(PRICE[k],'Achat '+k))return;if(k=='vip')S.vip={on:1,next:Date.now()+3600000};else{S.bought.push(k);if(k=='cosm'){S.desk.bg=1;S.desk.font=1}}toast('Achat effectué !')}save();render()}
// ---------- Appels ----------
let call=null,ringT=null,next=Date.now()+8000,redial={};
const ring=$('#ring'),cd=$('#call');
function incoming(i){if(call||ringT)return;const c=CH[i];ringOnce();ringT=setInterval(ringOnce,3200);ring.style.display='block';ring.innerHTML=`<div class="pt">${face(c)}</div><p><b>${c.n}</b> vous appelle…</p><button class="g" data-a="ans">Répondre</button> <button class="r" data-a="ref">Refuser</button>`;ring.dataset.i=i;ring.to=setTimeout(()=>{if(ringT){hang('manqué',1)}},12000)}
function stopRing(){if(RG)RG.gain.value=0;clearInterval(ringT);ringT=null;clearTimeout(ring.to);ring.style.display='none'}
function answer(){const i=+ring.dataset.i;stopRing();startCall(i)}
function startCall(i){if(tut.s>=0&&TS[tut.s][0]!='call'&&TS[tut.s][0]!='end')return toast('Suis le tutoriel');pickup();call={c:CH[i],raw:50,said:[],n:0};ev('call');cd.style.display='flex';cd.innerHTML=`<div style="text-align:center"><div class="pt" id="cp" style="width:110px;height:110px">${face(call.c)}</div><h3>${call.c.n}</h3><div class="bar"><i id="tb" style="width:50%"></i></div><small id="tp">Confiance 50 %</small></div><div id="lg" style="flex:1;overflow:auto;margin:8px 0;border:1px solid #6b4fb0;padding:8px"></div><div><input id="ti" style="width:55%" placeholder="Ton message…"> <button data-a="snd">Envoyer</button> <button data-a="mic">🎤</button> <button class="r" data-a="hup">Raccrocher</button></div>`;$('#ti').onkeydown=e=>{if(e.key=='Enter')send()};say(pick(TD[call.c.ty].op))}
function say(t){const l=$('#lg');l.innerHTML+=`<p><b>${call.c.n} :</b> ${t}</p>`;l.scrollTop=1e5;const p=$('#cp');p.classList.add('talk');setTimeout(()=>p.classList.remove('talk'),Math.min(4000,t.length*70));speak(t)}
function send(){const i=$('#ti');if(!call||!i.value.trim())return;const t=i.value.trim();i.value='';$('#lg').innerHTML+=`<p style="color:#9cf"><b>Toi :</b> ${t}</p>`;const cat=analyse(call,t),ask=CI.test(t)?askCard():null,tr=Math.max(0,Math.min(100,call.raw));$('#tb').style.width=tr+'%';$('#tp').textContent='Confiance '+Math.round(tr)+' %';call.n++;
 if(call.raw<=-5){$('#cp').classList.remove('talk');[0,300,600].forEach(d=>setTimeout(()=>beep(425,.2,1,'sine','call'),d));const m=$('#msg');m.style.display='flex';m.textContent='IL T’A RACCROCHÉ AU NEZ !';setTimeout(()=>m.style.display='none',1800);return end('raccroché au nez')}
 say(ask||pick(TD[call.c.ty][cat]))}
function mic(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast('Reconnaissance vocale indisponible : utilise le clavier');const r=new SR();r.lang='fr-FR';r.onresult=e=>{$('#ti').value=e.results[0][0].transcript;send()};r.onerror=()=>toast('Micro refusé');r.start()}
function hang(r,inc){if(inc&&ringT){const i=+ring.dataset.i;stopRing();S.hist.push({i,r,d:Date.now()});redial[i]=(redial[i]||0)+1;if(redial[i]<=3&&r=='refusé')setTimeout(()=>{if(S.set.inc)incoming(i)},R(4000,9000));save();next=Date.now()+R(3000,7000);return}end(r)}
function end(r){const c=call.c;if(window.speechSynthesis)speechSynthesis.cancel();S.hist.push({i:c.i,r,d:Date.now()});S.calls++;if(r=='réussi'){if(!S.unl.includes(c.i)){S.unl.push(c.i);gain(500*c.dif,'Appel réussi : '+c.n);toast(c.n+' ajouté à BOL !')}else toast('Appel réussi (déjà débloqué)')}
 call=null;cd.innerHTML='<h2 style="text-align:center">Fin d’appel…</h2>';hangup();setTimeout(()=>{cd.style.display='none';if(pn.dataset.n=='left'&&app=='phone')render()},1100);next=Date.now()+R(3000,7000);save();ev('end')}
setInterval(()=>{vipTick();if(ON.v&&S.set.inc&&!call&&!ringT&&Date.now()>next&&tut.s<0){const l=CH.filter(avail);incoming(pick(l).i);next=Date.now()+R(25000,45000)}if(pn.dataset.n=='left'&&started&&!app&&pn.style.display=='block'){const t=pn.querySelector('.tb span:last-child');if(t)t.textContent=clk()}},1000);
// ---------- Firebase (facultatif) ----------
const cfg={apiKey:"AIzaSyDoHkXTbF_ypvBmrj4RdZG9chb32rY9hP8",authDomain:"scam-game-2db05.firebaseapp.com",projectId:"scam-game-2db05",storageBucket:"scam-game-2db05.firebasestorage.app",messagingSenderId:"186640063309",appId:"1:186640063309:web:60b673d28362f639f73504",measurementId:"G-PBQ5WPBZX5"};
const DB_URL=''; // Base Realtime hors USA ? colle ici son URL (ex. https://scam-game-2db05-default-rtdb.europe-west1.firebasedatabase.app)
const V='https://www.gstatic.com/firebasejs/10.12.2/';
const err=m=>{const e=$('#err');if(e)e.textContent=m;else if(m)toast(m)};
const EM={'auth/invalid-credential':'E-mail ou mot de passe incorrect.','auth/wrong-password':'Mot de passe incorrect.','auth/user-not-found':'Compte introuvable.','auth/email-already-in-use':'E-mail déjà utilisé.','auth/weak-password':'Mot de passe trop court (6 min).','auth/invalid-email':'E-mail invalide.',
'auth/operation-not-allowed':'Méthode non activée : console Firebase → Authentication → Sign-in method → active-la.','auth/configuration-not-found':'Authentication non activée : console Firebase → Authentication → Commencer.',
'auth/unauthorized-domain':'Domaine non autorisé : console Firebase → Authentication → Paramètres → Domaines autorisés → ajoute le domaine de ton site (ex. tonpseudo.github.io).',
'auth/popup-closed-by-user':'Fenêtre Google fermée avant la fin.','auth/popup-blocked':'Popup bloquée : autorise-la dans ton navigateur.','auth/network-request-failed':'Pas de connexion à Firebase (réseau ou bloqueur de pub).','auth/too-many-requests':'Trop de tentatives, réessaie plus tard.',
'auth/operation-not-supported-in-this-environment':'Connexion impossible en file:// : héberge le jeu (GitHub Pages) ou lance un serveur local.','auth/invalid-api-key':'Clé API Firebase invalide.'};
async function FB(quiet){if(fb)return fb;try{const[A,Au,Db]=await Promise.all([import(V+'firebase-app.js'),import(V+'firebase-auth.js'),import(V+'firebase-database.js')]);
 const app2=A.getApps().length?A.getApp():A.initializeApp(cfg);fb={Au,Db,auth:Au.getAuth(app2),db:DB_URL?Db.getDatabase(app2,DB_URL):Db.getDatabase(app2)};
 Au.onAuthStateChanged(fb.auth,onUser);Au.getRedirectResult(fb.auth).catch(e=>err(EM[e.code]||e.message));return fb}
 catch(e){if(!quiet)err('Impossible de charger Firebase (internet ? bloqueur de pub ?). Mode local actif.');return null}}
async function auth(a){const f=await FB();if(!f)return;const em=($('#em')||{}).value||'',pw=($('#pw')||{}).value||'';err('');
 try{if(a=='g'){const pr=new f.Au.GoogleAuthProvider();pr.setCustomParameters({prompt:'select_account'});
   try{await f.Au.signInWithPopup(f.auth,pr)}catch(e){if(['auth/popup-blocked','auth/cancelled-popup-request'].includes(e.code)){err('Popup bloquée : redirection vers Google…');await f.Au.signInWithRedirect(f.auth,pr)}else throw e}}
  else if(a=='li')await f.Au.signInWithEmailAndPassword(f.auth,em,pw);
  else if(a=='su')await f.Au.createUserWithEmailAndPassword(f.auth,em,pw);
  else{await f.Au.signOut(f.auth);toast('Déconnecté (sauvegarde locale conservée)')}}
 catch(e){err((EM[e.code]||e.message)+(EM[e.code]?'':' ['+e.code+']'))}}
async function onUser(u){uid=u?u.uid:null;if(u)toast('Connecté : '+(u.email||u.displayName||'Google'));const w=$('#who');if(w)w.textContent=u?'Connecté : '+(u.email||u.displayName):'Mode local.';if(!u)return;try{const s=await fb.Db.get(fb.Db.ref(fb.db,`users/${uid}/save`));if(s.exists()){const c=s.val();if(c.u!==S.u&&confirm('Une sauvegarde en ligne existe.\nOK = charger la sauvegarde en ligne\nAnnuler = garder la locale et l’envoyer en ligne')){S=Object.assign(structuredClone(DEF),c);localStorage.setItem(K,JSON.stringify(S));toast('Sauvegarde en ligne chargée')}else save(1)}else save(1)}catch(e){toast('Erreur base de données (règles publiées ?) : '+e.message)}}
FB(1); // restaure la session / résultat de redirection Google

// ---------- Réponses supplémentaires par type de caractère ----------
const MORE={naif:{pos:['Oh vraiment ? Quelle bonne idée !','Je vous fais confiance, vous avez l’air sincère.'],neg:['Oh là là, vous me faites un peu peur…'],neu:['Si vous le dites… je n’y connais pas grand-chose.']},
meff:{pos:['C’est ce que disent tous les beaux parleurs.','On verra si vos actes suivent vos mots.'],neg:['Ça y est, je note votre numéro.'],neu:['Je vérifie tout ce que l’on me dit.']},
bav:{pos:['Ah, vous au moins vous savez écouter ! Ma sœur, elle…','Tiens, ça me fait penser à mes vacances à la mer !'],neg:['Oh, vous êtes bien pressé, vous !'],neu:['Je disais quoi déjà ? Ah oui, mon chat…']},
grin:{pos:['Hm. Un peu de politesse, ça change.','Bon, je vous donne deux minutes.'],neg:['Vous m’avez fait perdre mon temps.'],neu:['Abrégez, je regarde la télé.']},
poli:{pos:['Je vous remercie sincèrement.','Voilà une conversation agréable.'],neg:['Je vous prie de rester correct.'],neu:['Je vous écoute avec attention.']}};
for(const t in MORE)for(const k in MORE[t])TD[t][k].push(...MORE[t][k]);
// ---------- Cartes FICTIVES générées par le jeu (préfixe 0000, jamais de vraie carte) ----------
const sd=(i,m)=>(i*7919+m*104729+1234)%9973;
const card=i=>({n:'0000 '+[1,2,3].map(m=>String(1000+sd(i,m)%9000)).join(' '),cvv:String(100+sd(i,4)%900),exp:String(1+sd(i,5)%12).padStart(2,'0')+'/'+(27+sd(i,6)%5),name:CH[i].n.toUpperCase(),bal:5000+sd(i,7)%95*1000});
const CI=/\b(carte|cvv|numéro|numero|cryptogramme)\b/i;
const PRE=/\b(sécurité|securite|vérification|verification|remboursement|gagné|gagne|cadeau|problème|probleme|compte|banque|prélèvement|colis|livraison|impôts|assurance|erreur)\b/i; // prétexte crédible
// Le personnage ne donne sa carte que si la confiance dépasse un seuil (selon son caractère et sa difficulté)
function askCard(){const c=call.c,th={naif:68,meff:88,bav:75,grin:82,poli:78}[c.ty]+(c.dif-3)*3;
 // il faut : confiance haute + conversation installée (4 messages) + un prétexte crédible
 if(call.raw>=th&&call.n>=4&&(call.pre||0)>=1){const k=card(c.i);S.rev[c.i]=1;save();return`D’accord, je vous la donne. Nom : ${k.name}. Numéro : ${k.n}. Expiration : ${k.exp}. Cryptogramme : ${k.cvv}.`}
 call.ref=(call.ref||0)+1;call.raw-=call.ref>1?10:3;
 if(call.n<4)return pick(['On vient à peine de commencer à parler…','Doucement, on ne se connaît pas.']);
 if(!(call.pre||0))return pick(['Pourquoi auriez-vous besoin de ça ?','Et pour quelle raison, exactement ?']);
 return pick(['Je ne vous fais pas encore assez confiance.','Non, je préfère ne pas donner ça.','Hors de question pour l’instant.'])}
// ---------- Démarrage : bloom (lueur) puis boucle 3D ----------
try{const U='https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/';const[pa,pb,pc,pd]=await Promise.all([import(U+'EffectComposer.js'),import(U+'RenderPass.js'),import(U+'UnrealBloomPass.js'),import(U+'OutputPass.js')]);COMP=new pa.EffectComposer(rd);COMP.addPass(new pb.RenderPass(sc,cam));COMP.addPass(new pc.UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.38,.55,.88));COMP.addPass(new pd.OutputPass());COMP.setSize(innerWidth,innerHeight)}catch(e){COMP=null;console.warn('Bloom indisponible',e)}
refreshPC();requestAnimationFrame(loop);
