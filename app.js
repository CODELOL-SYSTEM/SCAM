// APP.JS v3 — UN SEUL PC / UN SEUL ÉCRAN : toutes les applis (Téléphone, SCAM, Ma Banque, MAMAZON, Connexion, Paramètres…) sont DANS le PC.
// Le bureau Windows 11 est collé pile sur l’écran 3D. Bloom (lueur), pièces PC détaillées, mains/peau plus réalistes.
// INSTALLATION : 1) enregistre ton GROS app.js actuel sous le nom  app_base.js  (même dossier)   2) mets CE fichier en app.js + le nouvel index.html
//                3) ouvre le jeu  4) bouton « ⬇ Télécharger app.js COMPLET » en bas à gauche = fichier unique final.
const WIN11="function win11bg(g,T){const gr=g.createLinearGradient(0,0,SW,SH);gr.addColorStop(0,'#050f2a');gr.addColorStop(1,'#0b3f9c');g.fillStyle=gr;g.fillRect(0,0,SW,SH);g.save();g.translate(SW*.5,SH*.46);g.globalCompositeOperation='lighter';for(let i=0;i<6;i++){g.save();g.rotate(i*Math.PI/3+.35+Math.sin(T*.3)*.02);const p=g.createLinearGradient(0,0,0,-270);p.addColorStop(0,'rgba(0,110,255,0)');p.addColorStop(.55,'rgba(40,150,255,.55)');p.addColorStop(1,'rgba(160,225,255,.18)');g.fillStyle=p;g.beginPath();g.ellipse(0,-135,92,155,0,0,7);g.fill();g.restore()}const c=g.createRadialGradient(0,0,0,0,0,250);c.addColorStop(0,'rgba(210,240,255,.65)');c.addColorStop(1,'rgba(0,80,255,0)');g.fillStyle=c;g.fillRect(-320,-320,640,640);g.restore()}\n";

const PARTS="bx(.01,.03,.9,GOLD,.38,-.76,-.03);\n const hs=M(0x2a2a33,{metalness:1,roughness:.28,envMapIntensity:1.2}),pcb=T(B.mb);\n bx(.05,.1,.34,hs,X+.03,.66,-.3);bx(.05,.3,.1,hs,X+.03,.3,-.5);bx(.046,.1,.12,hs,X+.025,-.22,.3);\n for(let i=0;i<4;i++)bx(.052,.008,.3,METAL,X+.03,.62+i*.025,-.3);\n if(pcb>0){bx(.03,.05,.5,hs,X+.02,-.3,-.05);bx(.032,.012,.5,rgbMat(),X+.022,-.275,-.05)}\n tube(g,[[X+.03,-.76,.3],[X+.12,-.4,.32],[X+.03,.1,.3]],0x111114);tube(g,[[X+.03,-.76,.2],[X+.14,-.5,.1],[gx+th/2,-.1+h/2,gz+len/2-.05]],0x111114);tube(g,[[X+.03,-.76,.15],[X+.1,.2,-.2],[X+.03,.72,-.42]],0x111114);\n bx(.01,h,len*.98,M(0x0c0c10,{metalness:.9,roughness:.3}),X+th+.004,-.1,gz);bx(.012,.04,.14,rgbMat(),X+th+.01,-.1,gz);\n";

const HAND_PRE="var poreTex=cvTex(256,256,(g,w,h)=>{g.fillStyle='#808080';g.fillRect(0,0,w,h);for(let i=0;i<5000;i++){const v=95+Math.random()*70|0;g.fillStyle='rgb('+v+','+v+','+v+')';g.fillRect(Math.random()*w,Math.random()*h,2,2)}},[5,5]);\nconst hands=[hand(-1),hand(1)];";

// la fenêtre HTML (bureau + applis) est collée exactement sur la dalle 3D de l’écran
const ALIGN="if(pn.style.display=='block'&&scr.left){const w=MW-.08,h=MH-.1,P=[[-1,1],[1,-1]].map(a=>{const v=new THREE.Vector3(a[0]*w/2,a[1]*h/2,0);scr.left.localToWorld(v);v.project(cam);return[(v.x+1)/2*innerWidth/S.set.sc,(1-v.y)/2*innerHeight/S.set.sc]}),W=P[1][0]-P[0][0],s=pn.style;s.left=P[0][0]+'px';s.top=P[0][1]+'px';s.width='1000px';s.height=Math.round(1000*h/w)+'px';s.transform='scale('+(W/1000)+')';s.transformOrigin='0 0';s.border='none';s.borderRadius='4px';s.boxShadow='none'}\n COMP?COMP.render():rd.render(sc,cam)}";

const BLOOM="var COMP=null;try{const U='https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/';const[a,b,c,d]=await Promise.all([import(U+'EffectComposer.js'),import(U+'RenderPass.js'),import(U+'UnrealBloomPass.js'),import(U+'OutputPass.js')]);COMP=new a.EffectComposer(rd);COMP.addPass(new b.RenderPass(sc,cam));COMP.addPass(new c.UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.38,.55,.88));COMP.addPass(new d.OutputPass());COMP.setSize(innerWidth,innerHeight)}catch(e){COMP=null;console.warn('Bloom indisponible',e)}\nrefreshPC();requestAnimationFrame(loop);";

const P=[
// --- un seul grand écran centré (plus d’écrans gauche/haut/droite) ---
["scrDef={left:[-2.2,2.1,-.55,.2],right:[2.2,2.1,-.55,-.2],top:[0,3.7,-1.2,0]}","scrDef={left:[0,2.25,-.9,0]}"],
["const MW=2.6,MH=1.5,SW=1024,SH=576","const MW=3.5,MH=1.95,SW=1024,SH=576"],
["new THREE.PlaneGeometry(MW-.12,MH-.14)","new THREE.PlaneGeometry(MW-.08,MH-.1)"],
["g.position.set(s*1.75,.98+.3,-1.0)","g.position.set(s*2.5,.98+.3,-1.0)"],
["const p=scrDef[n],d=1.75;","const p=scrDef[n],d=3.1;"],
["Clique sur l’écran GAUCHE pour le zoomer.","Clique sur l’écran du PC pour le zoomer."],
// --- toutes les applis sont dans le PC ---
["['dset','Paramètres','⚙️']];","['dset','Bureau','🖼️'],['login','Connexion','🔑'],['param','Paramètres','⚙️']];"],
["let phoneTab='c';","APP.login=()=>loginUI();APP.param=()=>settingsUI();let phoneTab='c';"],
// --- fond Windows 11 ---
["'radial-gradient(circle at 30% 45%,#5cb0ff,#1a5fd0 35%,#041033 90%)'","'radial-gradient(ellipse 40% 55% at 52% 45%,rgba(150,215,255,.8),transparent 70%),radial-gradient(ellipse 20% 60% at 36% 50%,rgba(0,120,255,.85),transparent 70%),radial-gradient(ellipse 20% 60% at 68% 50%,rgba(50,90,255,.85),transparent 70%),linear-gradient(135deg,#050f2a,#0b3f9c)'"],
["function drawL(g,T){if(S.desk.bg==0){",WIN11+"function drawL(g,T){if(S.desk.bg==0){win11bg(g,T)}else if(0){"],
// --- pièces du PC plus détaillées ---
["bx(.01,.03,.9,GOLD,.38,-.76,-.03);",PARTS],
// --- mains / peau ---
["const hands=[hand(-1),hand(1)];",HAND_PRE],
["skin=new THREE.MeshPhysicalMaterial({color:0xd9a273,roughness:.55,","skin=new THREE.MeshPhysicalMaterial({color:0xd9a273,bumpMap:poreTex,bumpScale:.5,clearcoat:.12,clearcoatRoughness:.5,roughness:.5,"],
// --- écran net (x2) et dalle brillante ---
["k.width=SW;k.height=SH;","k.width=SW*2;k.height=SH*2;"],
["g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,SW,SH);","g.setTransform(2,0,0,2,0,0);g.clearRect(0,0,SW,SH);"],
["color:0x000000,roughness:.07,metalness:0,clearcoat:1,","color:0x000000,roughness:.04,metalness:0,clearcoat:1,"],
["rd.toneMappingExposure=1.1;","rd.toneMappingExposure=1.2;"],
// --- bloom + alignement du bureau sur l’écran ---
["rd.setSize(innerWidth,innerHeight);cam.aspect=","rd.setSize(innerWidth,innerHeight);if(typeof COMP!='undefined'&&COMP)COMP.setSize(innerWidth,innerHeight);cam.aspect="],
["rd.render(sc,cam)}",ALIGN],
["refreshPC();requestAnimationFrame(loop);",BLOOM]
];

const banner=(m,c)=>{const d=document.createElement('pre');d.style.cssText='position:fixed;top:0;left:0;z-index:99;background:'+c+';color:#fff;padding:8px;max-width:100%;white-space:pre-wrap;font-size:12px;margin:0';d.textContent=m;document.body.appendChild(d);setTimeout(()=>{if(c!='#400')d.remove()},9000)};
try{
 const r=await fetch('./app_base.js',{cache:'no-store'});
 if(!r.ok)throw new Error('app_base.js introuvable (erreur '+r.status+'). Enregistre ton gros app.js sous le nom app_base.js, dans le même dossier que index.html.');
 let s=await r.text();const miss=[];
 for(const [a,b] of P){const i=s.indexOf(a);if(i<0||s.indexOf(a,i+1)>=0){miss.push(a.slice(0,50));continue}s=s.replace(a,()=>b)}
 if(miss.length)banner('Certaines améliorations n’ont pas pu s’appliquer ('+miss.length+') :\n'+miss.join('\n')+'\n(app_base.js doit être le gros app.js complet avec atelier/MAMAZON)','#7a4a00');
 const bt=document.createElement('button');bt.textContent='⬇ Télécharger app.js COMPLET';bt.style.cssText='position:fixed;left:10px;bottom:10px;z-index:50';
 bt.onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([s],{type:'text/javascript'}));a.download='app.js';a.click()};document.body.appendChild(bt);
 await import(URL.createObjectURL(new Blob([s],{type:'text/javascript'})));
}catch(e){
 console.warn(e);banner('Mise à jour non appliquée : '+e.message,'#400');
 try{await import('./app_base.js')}catch(e2){}
}
