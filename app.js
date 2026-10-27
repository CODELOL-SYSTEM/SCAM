// JEU PC IMMERSIF — moteur de dialogue À RÈGLES (mots-clés), pas une IA conversationnelle.
// Toutes les données sont fictives : aucun paiement ni donnée bancaire réels.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const $=s=>document.querySelector(s),K='pcgame_v1',R=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.random()*a.length|0];
const DEF={v:1,bal:1000,tut:0,unl:[],own:[],vip:null,hist:[],tx:[],calls:0,scam:{},cl:{},seen:{},bought:[],
 set:{vol:.8,call:.8,sfx:.8,q:1,fx:1,sc:1,voice:1,inc:1},desk:{bg:0,font:0}};
let S=Object.assign(structuredClone(DEF),JSON.parse(localStorage.getItem(K)||'{}'));
const PRICE={vip:250000,vipRenew:2500,ultime:500000,legend:75000,epic:20000,rare:6000,cosm:3000};
// ---------- Sauvegarde ----------
let uid=null,fb=null,st=0;
const toast=m=>{const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.display='none',2800)};
function save(now){clearTimeout(st);const go=async()=>{S.hist=S.hist.slice(-40);S.tx=S.tx.slice(-60);S.u=Date.now();
 try{localStorage.setItem(K,JSON.stringify(S));if(uid&&fb)await fb.Db.set(fb.Db.ref(fb.db,`users/${uid}/save`),JSON.parse(JSON.stringify(S)));return 1}catch(e){toast('Échec de sauvegarde : '+e.message);return 0}};
 if(now)return go();st=setTimeout(go,600)}
const gain=(a,l)=>{if(vipOn())a*=2;S.bal+=a;S.tx.push({a,l,d:Date.now()});save()};
const spend=(a,l)=>{if(S.bal<a){toast('Solde insuffisant');return 0}S.bal-=a;S.tx.push({a:-a,l,d:Date.now()});save();return 1};
const vipOn=()=>S.vip&&S.vip.on;
function vipTick(){if(!vipOn())return;while(S.vip.next<=Date.now()){if(S.bal>=PRICE.vipRenew){S.bal-=PRICE.vipRenew;S.tx.push({a:-PRICE.vipRenew,l:'Renouvellement VIP',d:S.vip.next});S.vip.next+=3600000}else{S.vip=null;toast('VIP terminé : solde insuffisant');break}}save()}
// ---------- Audio ----------
let AC;const beep=(f,d,v=1,type='sine',k='sfx')=>{try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.value=.15*v*S.set[k]*S.set.vol;o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}};
const chime=()=>[392,523,659,784].forEach((f,i)=>setTimeout(()=>beep(f,.5),i*220)); // jingle original (le son Windows est protégé)
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
const code=i=>`DEMO-${String(i+1).padStart(3,'0')}-${(i*7919+1234)%9000+1000}`;
const avail=c=>!c.prem||S.own.includes(c.i);
const face=c=>{const b=`hsl(${c.h} 45% 30%)`,hair=['M20 50Q50 5 80 50Q50 25 20 50','M18 55Q20 8 82 40L80 60Q50 30 18 55','M22 45Q50 0 78 45Q80 20 50 14Q20 20 22 45','M15 70Q10 10 50 8Q90 10 85 70Q80 30 50 28Q20 30 15 70'][c.hr];
 return`<svg viewBox="0 0 100 100"><g filter="url(#pc)"><rect width="100" height="100" fill="${b}"/><ellipse cx="50" cy="55" rx="26" ry="32" fill="${c.sk}" stroke="#111" stroke-width="2.5"/><path d="${hair}" fill="hsl(${(c.h+90)%360} 30% 18%)" stroke="#111" stroke-width="2"/><circle cx="40" cy="50" r="3" fill="#111"/><circle cx="60" cy="50" r="3" fill="#111"/><ellipse class="mo" cx="50" cy="70" rx="7" ry="2" fill="#7a1f1f" stroke="#111"/><path d="M30 92Q50 78 70 92" fill="#d4af37" stroke="#111" stroke-width="2"/></g></svg>`};
// ---------- Moteur de dialogue ----------
const INS=/\b(con|idiot|imbécile|nul|ferme|débile|stupide|crétin|merde|connard)\b/i,POS=/\b(bonjour|bonsoir|merci|s'il|svp|désolé|pardon|gentil|aide|comprends|confiance|bravo|plaisir|madame|monsieur)\b/i,NEG=/\b(menace|obligé|vite|argent|gratuit|urgent|tais|jamais)\b/i;
function analyse(a,txt){const ty=TD[a.c.ty];let d=1.5,cat='neu';
 if(INS.test(txt)){d=-30;cat='neg'}else if(NEG.test(txt)){d=-7;cat='neg'}else if(POS.test(txt)){d=9;cat='pos'}
 if(a.said.includes(txt.toLowerCase())){d-=6;cat='neg'}if(txt.length<3){d-=3;cat='neg'}if(/\?/.test(txt)&&cat=='neu')d+=2;
 d*=d>0?ty.p:ty.n;d*=1+(a.c.dif-3)*(d<0?.08:-.05);a.said.push(txt.toLowerCase());a.raw+=d;return cat}
// ---------- Scène 3D ----------
const cv=$('#c'),rd=new THREE.WebGLRenderer({canvas:cv,antialias:true});rd.shadowMap.enabled=true;
const sc=new THREE.Scene();sc.background=new THREE.Color(0x050308);sc.fog=new THREE.Fog(0x050308,6,14);
const cam=new THREE.PerspectiveCamera(50,1,.1,50);
const M=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.5,metalness:.4,...o}),box=(w,h,d,m,x,y,z)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=b.receiveShadow=true;sc.add(b);return b};
box(9,.15,3,M(0x111111),0,.9,0);box(.15,.9,2.8,M(0xd4af37),-4.3,.45,0);box(.15,.9,2.8,M(0xd4af37),4.3,.45,0);box(14,.1,10,M(0x08050c),0,0,-1);box(14,6,.1,M(0x0c0814),0,3,-3);
const pl=[0x7b2fff,0xd4af37];[[-3,3,1,0],[3,3,1,0],[0,2,-2.5,0]].forEach(p=>{const l=new THREE.PointLight(0x7b2fff,18,9);l.position.set(p[0],p[1],p[2]);sc.add(l)});
sc.add(new THREE.AmbientLight(0x221133,.8));const key=new THREE.PointLight(0xd4af37,6,8);key.position.set(0,3.2,2);sc.add(key);
box(1.6,.05,.55,M(0x1a1a1a),0,1,1.1);box(.3,.08,.45,M(0x222222),1.4,1.02,1.1);
const tower=box(.9,1.9,1.1,M(0x0d0d0d),3.4,1.9,-.4);const pbtn=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.06,24),M(0xd4af37,{emissive:0x331100}));pbtn.rotation.x=Math.PI/2;pbtn.position.set(3.4,2.5,.18);pbtn.name='power';sc.add(pbtn);
const hands=[-1,1].map(s=>box(.45,.12,.6,M(0xd9a273,{roughness:.8}),s*.4,1.15,1.6));
const scrDef={left:[-2.1,1.9,-.9],right:[2.1,1.9,-.9],top:[0,3.45,-1.3]},scr={},ON={v:0};
const tex=(t,on,c)=>{const k=document.createElement('canvas');k.width=512;k.height=300;const g=k.getContext('2d');g.fillStyle=on?c:'#050505';g.fillRect(0,0,512,300);if(on){g.fillStyle='#fff';g.font='bold 40px sans-serif';g.textAlign='center';g.fillText(t,256,160)}const x=new THREE.CanvasTexture(k);return x};
const SC={left:['COMMENCER','#3a7bd5'],top:['CONNEXION','#4b1fa0'],right:['PARAMÈTRES','#6b5a10']};
for(const n in scrDef){const p=scrDef[n],bz=box(2.5,1.5,.1,M(0x050505),p[0],p[1],p[2]);const m=new THREE.Mesh(new THREE.PlaneGeometry(2.3,1.3),new THREE.MeshBasicMaterial({map:tex('',0)}));m.position.set(p[0],p[1],p[2]+.06);m.name=n;sc.add(m);scr[n]=m;box(.15,.5,.15,M(0x111111),p[0],p[1]-.9,p[2]-.1)}
const home={p:new THREE.Vector3(0,2.15,5.2),l:new THREE.Vector3(0,2.2,-.5)};let tp=home.p.clone(),tl=home.l.clone(),cl=home.l.clone(),view='home';cam.position.copy(tp);
function size(){const q=[.5,.75,1][S.set.q|0]||1;rd.setPixelRatio(Math.min(devicePixelRatio,2)*q);rd.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();document.body.style.zoom=S.set.sc}
addEventListener('resize',size);size();
function go(n){view=n;if(n=='home'){tp.copy(home.p);tl.copy(home.l)}else{const p=scrDef[n];tp.set(p[0],p[1],p[2]+(n=='top'?1.9:1.9));tl.set(p[0],p[1],p[2])}}
let t0=0;(function loop(t){requestAnimationFrame(loop);cam.position.lerp(tp,.07);cl.lerp(tl,.07);cam.lookAt(cl);const s=Math.sin(t/90)*(typing?1:.1);hands[0].position.y=1.15+Math.max(0,s)*.05*(typing?1:0);hands[1].position.y=1.15+Math.max(0,-s)*.05;hands[1].position.x=1+Math.sin(t/700)*.05;
 pbtn.material.emissive.setHex(tut.s==0&&!ON.v?(Math.sin(t/150)>0?0xffffff:0x333300):ON.v?0x00aa55:0x331100);key.intensity=6*S.set.fx;rd.render(sc,cam)})(0);
let typing=0;addEventListener('keydown',()=>{typing=1;clearTimeout(typing.t);typing.t=setTimeout(()=>typing=0,400)});
// ---------- Tutoriel ----------
const TS=[['power','Clique sur le bouton d’alimentation doré du boîtier (à droite).'],['left','Clique sur l’écran GAUCHE pour le zoomer.'],['start','Clique sur COMMENCER.'],['phone','Ouvre l’application Téléphone : c’est là que tu passes les appels. Gagne la confiance (jauge) pour débloquer des personnages → BOL, récompenses → Ma Banque / MAMAZON. VIP x2, sauvegardes : ENREGISTRER.'],['call','Appelle un contact (bouton Appeler) ou réponds à un appel entrant.'],['end','Discute poliment puis raccroche (ou gagne la confiance à 85 %).']];
const tut={s:S.tut?-1:0};
function tShow(){const e=$('#tut');if(tut.s<0){e.style.display='none';return}e.style.display='block';e.textContent=`Tutoriel ${tut.s+1}/${TS.length} — ${TS[tut.s][1]}`}
const ok=n=>tut.s<0||TS[tut.s][0]==n||n=='x'||(!$('#tut')?1:0)||(toast('Suis le tutoriel : action non autorisée pour l’instant'),0);
function ev(n){if(tut.s<0||TS[tut.s][0]!=n)return;tut.s++;if(tut.s>=TS.length){tut.s=-1;S.tut=1;toast('Tutoriel terminé ! Tu es libre de jouer. Aucun objectif obligatoire.');save()}tShow()}
tShow();
// ---------- Interaction 3D ----------
const rc=new THREE.Raycaster(),mv=new THREE.Vector2();
cv.addEventListener('click',e=>{if(view!='home'||busy)return;mv.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);rc.setFromCamera(mv,cam);const h=rc.intersectObjects([pbtn,...Object.values(scr)])[0];if(!h)return;const n=h.object.name;
 if(n=='power'){if(ok('power')&&!ON.v)boot()}else if(ON.v&&ok(n)){go(n);busy=1;setTimeout(()=>{busy=0;panel(n)},850);ev(n)}});
let busy=0;
$('#x').onclick=()=>{$('#pn').style.display=$('#x').style.display='none';go('home')};
function boot(){busy=1;ON.v=1;pbtn.position.z=.14;beep(200,.2);$('#boot').style.display='flex';setTimeout(()=>{$('#boot').style.display='none';chime();for(const n in scr){scr[n].material.map=tex(SC[n][0],1,SC[n][1]);scr[n].material.needsUpdate=true}busy=0;ev('power');vipTick()},2600)}
async function shutdown(){busy=1;const m=$('#msg');m.style.display='flex';m.textContent='Sauvegarde de la progression…';await save(1);await new Promise(r=>setTimeout(r,1200));m.textContent='EXTINCTION DU PC…';await new Promise(r=>setTimeout(r,1500));
 for(const n in scr){scr[n].material.map=tex('',0);scr[n].material.needsUpdate=true}ON.v=0;pbtn.position.z=.18;$('#pn').style.display=$('#x').style.display='none';go('home');m.style.display='none';busy=0;toast('PC éteint. Rallume-le avec le bouton.')}
// ---------- Panneaux ----------
let app=null,menuOpen=0,started=0;const pn=$('#pn'),E=s=>s;
const APPS=[['phone','Téléphone','📞'],['bol','BOL','📇'],['scam','SCAM','🪪'],['bank','Ma Banque','🏦'],['shop','MAMAZON','🛒'],['sub','ABONNEMENT','⭐'],['save','ENREGISTRER','💾'],['quest','Quêtes','🏆'],['dset','Paramètres','⚙️']];
const BG=['linear-gradient(#5aa0f0 0 55%,#4caf2a 55%)','linear-gradient(#1b2a49,#0a0f1c)','linear-gradient(#e8a33d,#7a3b12)'],FT=['Tahoma','Georgia','Courier New'];
function panel(n){pn.style.display=$('#x').style.display='block';pn.dataset.n=n;render()}
function render(){const n=pn.dataset.n;if(n=='left')pn.innerHTML=started?desktop():`<div class="dk" style="background:${BG[0]};display:flex;align-items:center;justify-content:center"><button data-a="start" id="cb" style="font-size:34px;padding:20px 40px;background:#3c9a3c;color:#fff;border-radius:30px">COMMENCER</button></div>`;
 else if(n=='top')pn.innerHTML=loginUI();else pn.innerHTML=settingsUI(1);
 if(tut.s>=0)document.querySelectorAll(`[data-a="${TS[tut.s][0]=='phone'?'app:phone':TS[tut.s][0]=='start'?'start':''}"]`).forEach(e=>e.classList.add('hl'))}
const clk=()=>new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
function desktop(){const q=($('#sq')||{}).value||'';const ap=APPS.filter(a=>a[0]!='sub'||vipOn());
 return`<div class="dk" style="background:${BG[S.desk.bg]};font-family:${FT[S.desk.font]};height:100%">${ap.map(a=>`<span class="ic" data-a="app:${a[0]}"><b>${a[2]}</b>${a[1]}</span>`).join('')}${app?`<div class="win"><div style="display:flex;justify-content:space-between"><b>${APPS.find(a=>a[0]==app)[1]}</b><button data-a="close">✕</button></div><hr>${APP[app]()}</div>`:''}
 <div class="menu" style="display:${menuOpen?'block':'none'}">${ap.map(a=>`<div data-a="app:${a[0]}">${a[2]} ${a[1]}</div>`).join('')}<div data-a="off">⏻ Arrêter</div></div>
 <div class="tb"><span class="st" data-a="menu" style="padding:6px 14px">⊞ démarrer</span><input id="sq" placeholder="Rechercher une appli…" value="${q}" style="width:160px"><span id="sr"></span><span style="margin-left:auto">${clk()}</span></div></div>`}
const SB=(l,v)=>`<div class="row"><b>${l}</b>${v}</div>`;
const APP={
phone(){const l=CH.filter(avail);return`<button data-a="tab:c">Contacts</button> <button data-a="tab:h">Historique</button> <label><input type="checkbox" data-a="inc" ${S.set.inc?'checked':''}> Appels entrants</label>
 ${phoneTab=='h'?(S.hist.slice().reverse().map(h=>`<div class="row">${CH[h.i].n} — ${h.r} — ${new Date(h.d).toLocaleTimeString('fr-FR')}</div>`).join('')||'<p>Aucun appel.</p>'):l.slice(0,60).map(c=>`<div class="row"><span class="pt">${face(c)}</span><span>${c.n}<br><small>${TD[c.ty].nm}</small></span><button data-a="dial:${c.i}">Appeler</button></div>`).join('')}`},
bol(){return S.unl.length?S.unl.map(i=>{const c=CH[i];return`<div class="row"><span class="pt">${face(c)}</span><div><b>${c.n}</b> — ${S.scam[i]?'Dossier validé':'Débloqué'}<br><small>${c.story}<br>Dossier fictif : ${code(i)} · Type DEMO · statut ${['actif','en attente','archivé'][i%3]}</small></div></div>`}).join(''):'<p>Aucun personnage débloqué. Réussis un appel (confiance ≥ 85 %).</p>'},
scam(){return`<p>Saisis l’identifiant de dossier DEMO d’un personnage débloqué (visible dans BOL). Données fictives uniquement.</p><input id="sc" placeholder="DEMO-001-1234"> <button data-a="val">Valider</button><div id="sres"></div>`},
bank(){return`<h3>Solde : ${S.bal.toLocaleString('fr-FR')} ₢</h3>${S.tx.slice().reverse().map(t=>`<div class="row"><span style="color:${t.a>0?'green':'#a00'}">${t.a>0?'+':''}${t.a}</span> ${t.l} <small>${new Date(t.d).toLocaleTimeString('fr-FR')}</small></div>`).join('')||'<p>Aucune transaction.</p>'}`},
shop(){const it=[['vip','VIP x2 (gains doublés, renouvelé /60 min)',PRICE.vip,'légendaire'],['ultime','Installation ultime (cosmétique PC)',PRICE.ultime,'légendaire'],['cosm','Fond d’écran Nuit & police Georgia',PRICE.cosm,'rare']];
 return`<h3>Solde : ${S.bal} ₢</h3>${it.map(a=>`<div class="row"><div><b>${a[1]}</b><br><small>${a[3]}</small></div><span style="margin-left:auto">${a[2]} ₢</span><button data-a="buy:${a[0]}" ${S.bought.includes(a[0])||(a[0]=='vip'&&vipOn())?'disabled':''}>Acheter</button></div>`).join('')}<h4>Personnages premium</h4>${CH.filter(c=>c.prem).map(c=>{const p=prc(c);return`<div class="row"><span class="pt" style="width:44px;height:44px">${face(c)}</span><div>${c.n} <small>${c.rar}</small></div><span style="margin-left:auto">${p} ₢</span><button data-a="buy:c${c.i}" ${S.own.includes(c.i)?'disabled':''}>${S.own.includes(c.i)?'Possédé':'Acheter'}</button></div>`}).join('')}`},
sub(){return`<p>VIP actif : gains x2. Prochain renouvellement : ${new Date(S.vip.next).toLocaleTimeString('fr-FR')} (${PRICE.vipRenew} ₢).</p><button data-a="cancel">Annuler l’abonnement</button>`},
save(){return`<button data-a="dosave">Enregistrer maintenant</button><div id="svs"></div>`},
quest(){return QU.map(q=>{const d=q.c(),cl=S.cl[q.id];return`<div class="row"><div>${q.t}<br><small>${cl?'Récompense récupérée':d?'Terminé':S.seen.quest?'En cours':'Non commencé'} — ${q.r} ₢</small></div><button data-a="qc:${q.id}" ${d&&!cl?'':'disabled'}>Récupérer</button></div>`}).join('')},
dset(){return`<p>Fond :</p>${BG.map((b,i)=>`<button data-a="bg:${i}">Fond ${i+1}</button>`).join(' ')}<p>Police :</p>${FT.map((f,i)=>`<button data-a="ft:${i}" style="font-family:${f}">${f}</button>`).join(' ')}<p><small>Ne change que le bureau virtuel.</small></p>`}};
let phoneTab='c';const prc=c=>c.rar=='légendaire'?PRICE.legend:c.rar=='épique'?PRICE.epic:PRICE.rare;
const QU=[{id:'a',t:'Découvrir Ma Banque',r:200,c:()=>S.seen.bank},{id:'b',t:'Terminer 3 appels',r:500,c:()=>S.calls>=3},{id:'c',t:'Débloquer un personnage',r:1000,c:()=>S.unl.length>=1},{id:'d',t:'Atteindre 10 000 ₢',r:2000,c:()=>S.bal>=10000}];
function loginUI(){return`<div class="cen"><h2>Connexion (facultative)</h2><p id="who">${uid?'Connecté.':'Mode local : ta progression est enregistrée dans ce navigateur.'}</p>
 <button data-a="g">Connexion Google</button><p><input id="em" type="email" placeholder="e-mail"> <input id="pw" type="password" placeholder="mot de passe (6+)"></p><button data-a="li">Se connecter</button> <button data-a="su">S’inscrire</button> <button data-a="lo">Déconnexion</button> <button data-a="x2">Continuer sans compte</button><p id="err" style="color:#f88"></p></div>`}
function settingsUI(){const r=(k,l)=>`<p>${l} <input type="range" min="0" max="1" step=".05" value="${S.set[k]}" data-r="${k}"></p>`,c=(k,l)=>`<p><label><input type="checkbox" data-c="${k}" ${S.set[k]?'checked':''}> ${l}</label></p>`;
 return`<div class="cen"><h2>Paramètres</h2>${r('vol','Volume général')}${r('call','Volume des appels')}${r('sfx','Effets sonores')}<p>Qualité graphique <select data-s="q">${['Basse','Moyenne','Haute'].map((o,i)=>`<option value="${i}" ${S.set.q==i?'selected':''}>${o}</option>`).join('')}</select></p><p>Effets visuels <input type="range" min="0" max="1" step=".1" value="${S.set.fx}" data-r="fx"></p><p>Échelle d’affichage <select data-s="sc">${[.8,1,1.2].map(o=>`<option value="${o}" ${S.set.sc==o?'selected':''}>${o*100}%</option>`).join('')}</select></p>${c('voice','Voix des personnages')}${c('inc','Appels entrants')}<button data-a="rt">Refaire le tutoriel</button> <button data-a="wipe">Effacer les données locales</button></div>`}
pn.addEventListener('input',e=>{const t=e.target;if(t.dataset.r){S.set[t.dataset.r]=+t.value;save()}if(t.id=='sq'){const q=t.value.toLowerCase(),r=APPS.filter(a=>a[1].toLowerCase().includes(q)&&q);$('#sr').innerHTML=r.map(a=>`<u data-a="app:${a[0]}" style="cursor:pointer">${a[1]}</u> `).join('')}});
pn.addEventListener('change',e=>{const t=e.target;if(t.dataset.c){S.set[t.dataset.c]=t.checked?1:0;save()}if(t.dataset.s){S.set[t.dataset.s]=+t.value;size();save()}if(t.dataset.a=='inc'){S.set.inc=t.checked?1:0;save()}});
// ---------- Actions ----------
const cb={};document.addEventListener('click',async e=>{const el=e.target.closest('[data-a]');if(!el||el.disabled)return;const[a,v]=el.dataset.a.split(':');const re=()=>{render()};
 if(a=='start'){if(!ok('start'))return;started=1;ev('start');re()}
 else if(a=='menu'){menuOpen=!menuOpen;re()}
 else if(a=='app'){if(!ok('phone')||(tut.s>=0&&v!='phone'))return;app=v;menuOpen=0;S.seen[v]=1;if(v=='phone')ev('phone');save();re()}
 else if(a=='close'){app=null;re()}else if(a=='tab'){phoneTab=v;re()}
 else if(a=='off'){if(tut.s>=0)return toast('Termine le tutoriel d’abord');shutdown()}
 else if(a=='dial'){if(call)return;startCall(+v)}
 else if(a=='bg'){S.desk.bg=+v;save();re()}else if(a=='ft'){S.desk.font=+v;save();re()}
 else if(a=='buy')buy(v)
 else if(a=='cancel'){S.vip.on=0;S.vip=null;app=null;toast('Abonnement annulé');save();re()}
 else if(a=='qc'){const q=QU.find(x=>x.id==v);if(q.c()&&!S.cl[v]){S.cl[v]=1;gain(q.r,'Quête : '+q.t);re()}}
 else if(a=='val'){const t=$('#sc').value.trim().toUpperCase(),i=S.unl.find(i=>code(i)==t);if(i!=null&&!S.scam[i]){S.scam[i]=1;gain(3000,'Dossier validé '+t);$('#sres').textContent='Validé ! +'+(vipOn()?6000:3000)+' ₢'}else $('#sres').textContent=i!=null?'Déjà validé.':'Carte fausse';}
 else if(a=='dosave'){const s=$('#svs');s.textContent='Sauvegardement de la progression…';await new Promise(r=>setTimeout(r,3000));const r=await save(1);s.textContent=r?'Sauvegarde réussie ✔':'Erreur de sauvegarde'}
 else if(a=='rt'){S.tut=0;tut.s=0;tShow();save();toast('Tutoriel relancé : éteins puis rallume le PC.')}
 else if(a=='wipe'){if(confirm('Effacer la sauvegarde locale ?')){localStorage.removeItem(K);location.reload()}}
 else if(a=='x2'){$('#x').click()}else if(['g','li','su','lo'].includes(a))auth(a)
 else if(a=='ans'){answer()}else if(a=='ref'){hang('refusé',1)}else if(a=='snd')send()else if(a=='hup')hang('raccroché')else if(a=='mic')mic()});
function buy(k){if(k[0]=='c'){const i=+k.slice(1),c=CH[i];if(S.own.includes(i))return;if(spend(prc(c),'Achat '+c.n)){S.own.push(i);toast(c.n+' acheté !')}}
 else{if(S.bought.includes(k))return;if(k=='vip'&&vipOn())return;if(!spend(PRICE[k],'Achat '+k))return;if(k=='vip')S.vip={on:1,next:Date.now()+3600000};else{S.bought.push(k);if(k=='cosm'){S.desk.bg=1;S.desk.font=1}}toast('Achat effectué !')}save();render()}
// ---------- Appels ----------
let call=null,ringT=null,next=Date.now()+8000,redial={};
const ring=$('#ring'),cd=$('#call');
function incoming(i){if(call||ringT)return;const c=CH[i];ringT=setInterval(()=>beep(880,.2,1,'square','call'),700);ring.style.display='block';ring.innerHTML=`<div class="pt">${face(c)}</div><p><b>${c.n}</b> vous appelle…</p><button class="g" data-a="ans">Répondre</button> <button class="r" data-a="ref">Refuser</button>`;ring.dataset.i=i;ring.to=setTimeout(()=>{if(ringT){hang('manqué',1)}},12000)}
function stopRing(){clearInterval(ringT);ringT=null;clearTimeout(ring.to);ring.style.display='none'}
function answer(){const i=+ring.dataset.i;stopRing();startCall(i)}
function startCall(i){if(!ok('call')&&tut.s>=0&&TS[tut.s][0]!='phone'&&TS[tut.s][0]!='end')return;call={c:CH[i],raw:50,said:[],n:0};ev('call');cd.style.display='flex';cd.innerHTML=`<div style="text-align:center"><div class="pt" id="cp" style="width:110px;height:110px">${face(call.c)}</div><h3>${call.c.n}</h3><div class="bar"><i id="tb" style="width:50%"></i></div><small id="tp">Confiance 50 %</small></div><div id="lg" style="flex:1;overflow:auto;margin:8px 0;border:1px solid #6b4fb0;padding:8px"></div><div><input id="ti" style="width:55%" placeholder="Ton message…"> <button data-a="snd">Envoyer</button> <button data-a="mic">🎤</button> <button class="r" data-a="hup">Raccrocher</button></div>`;$('#ti').onkeydown=e=>{if(e.key=='Enter')send()};say(pick(TD[call.c.ty].op))}
function say(t){const l=$('#lg');l.innerHTML+=`<p><b>${call.c.n} :</b> ${t}</p>`;l.scrollTop=1e5;const p=$('#cp');p.classList.add('talk');setTimeout(()=>p.classList.remove('talk'),Math.min(4000,t.length*70));speak(t)}
function send(){const i=$('#ti');if(!call||!i.value.trim())return;const t=i.value.trim();i.value='';$('#lg').innerHTML+=`<p style="color:#9cf"><b>Toi :</b> ${t}</p>`;const cat=analyse(call,t),tr=Math.max(0,Math.min(100,call.raw));$('#tb').style.width=tr+'%';$('#tp').textContent='Confiance '+Math.round(tr)+' %';call.n++;
 if(call.raw<=-5){$('#cp').classList.remove('talk');beep(150,.6,1,'sawtooth');const m=$('#msg');m.style.display='flex';m.textContent='IL T’A RACCROCHÉ AU NEZ !';setTimeout(()=>m.style.display='none',1800);return end('raccroché au nez')}
 if(call.raw>=85)return end('réussi');say(pick(TD[call.c.ty][cat]))}
function mic(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast('Reconnaissance vocale indisponible : utilise le clavier');const r=new SR();r.lang='fr-FR';r.onresult=e=>{$('#ti').value=e.results[0][0].transcript;send()};r.onerror=()=>toast('Micro refusé');r.start()}
function hang(r,inc){if(inc&&ringT){const i=+ring.dataset.i;stopRing();S.hist.push({i,r,d:Date.now()});redial[i]=(redial[i]||0)+1;if(redial[i]<=3&&r=='refusé')setTimeout(()=>{if(S.set.inc)incoming(i)},R(4000,9000));save();next=Date.now()+R(3000,7000);return}end(r)}
function end(r){const c=call.c;call.c&&(speechSynthesis&&speechSynthesis.cancel());S.hist.push({i:c.i,r,d:Date.now()});S.calls++;if(r=='réussi'){if(!S.unl.includes(c.i)){S.unl.push(c.i);gain(500*c.dif,'Appel réussi : '+c.n);toast(c.n+' ajouté à BOL !')}else toast('Appel réussi (déjà débloqué)')}
 call=null;cd.innerHTML='<h2 style="text-align:center">Fin d’appel…</h2>';beep(300,.3);setTimeout(()=>{cd.style.display='none';if(pn.dataset.n=='left'&&app=='phone')render()},1100);next=Date.now()+R(3000,7000);save();ev('end')}
setInterval(()=>{vipTick();if(ON.v&&S.set.inc&&!call&&!ringT&&Date.now()>next&&tut.s<0){const l=CH.filter(avail);incoming(pick(l).i);next=Date.now()+R(25000,45000)}if(pn.dataset.n=='left'&&started&&!app&&pn.style.display=='block'){const t=pn.querySelector('.tb span:last-child');if(t)t.textContent=clk()}},1000);
// ---------- Firebase (facultatif) ----------
const cfg={apiKey:"AIzaSyDoHkXTbF_ypvBmrj4RdZG9chb32rY9hP8",authDomain:"scam-game-2db05.firebaseapp.com",projectId:"scam-game-2db05",storageBucket:"scam-game-2db05.firebasestorage.app",messagingSenderId:"186640063309",appId:"1:186640063309:web:60b673d28362f639f73504",measurementId:"G-PBQ5WPBZX5"};
const V='https://www.gstatic.com/firebasejs/10.12.2/';
async function FB(){if(fb)return fb;try{const[A,Au,Db]=await Promise.all([import(V+'firebase-app.js'),import(V+'firebase-auth.js'),import(V+'firebase-database.js')]);const app=A.getApps().length?A.getApp():A.initializeApp(cfg);fb={Au,Db,auth:Au.getAuth(app),db:Db.getDatabase(app)};Au.onAuthStateChanged(fb.auth,onUser);return fb}catch(e){err('Firebase indisponible : mode local actif.');return null}}
const err=m=>{const e=$('#err');if(e)e.textContent=m;else toast(m)};
const EM={'auth/invalid-credential':'E-mail ou mot de passe incorrect.','auth/email-already-in-use':'E-mail déjà utilisé.','auth/weak-password':'Mot de passe trop court (6 min).','auth/invalid-email':'E-mail invalide.','auth/operation-not-allowed':'Méthode non activée dans la console Firebase.','auth/configuration-not-found':'Authentification non activée dans la console Firebase.','auth/popup-closed-by-user':'Fenêtre fermée.'};
async function auth(a){const f=await FB();if(!f)return;try{const em=($('#em')||{}).value,pw=($('#pw')||{}).value;if(a=='g')await f.Au.signInWithPopup(f.auth,new f.Au.GoogleAuthProvider());else if(a=='li')await f.Au.signInWithEmailAndPassword(f.auth,em,pw);else if(a=='su')await f.Au.createUserWithEmailAndPassword(f.auth,em,pw);else{await f.Au.signOut(f.auth);toast('Déconnecté (sauvegarde locale conservée)')}}catch(e){err(EM[e.code]||e.message)}}
async function onUser(u){uid=u?u.uid:null;const w=$('#who');if(w)w.textContent=u?'Connecté : '+(u.email||u.displayName):'Mode local.';if(!u)return;try{const s=await fb.Db.get(fb.Db.ref(fb.db,`users/${uid}/save`));if(s.exists()){const c=s.val();if(c.u!==S.u&&confirm('Une sauvegarde en ligne existe.\nOK = charger la sauvegarde en ligne\nAnnuler = garder la locale et l’envoyer en ligne')){S=Object.assign(structuredClone(DEF),c);localStorage.setItem(K,JSON.stringify(S));toast('Sauvegarde en ligne chargée')}else save(1)}else save(1)}catch(e){toast('Erreur base de données (règles publiées ?) : '+e.message)}}
if(S.u)FB(); // restaure la session si le joueur s’était déjà connecté
