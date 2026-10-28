// APP.JS — mise à jour "PC AQUARIUM" (boîtier panoramique tout en verre + watercooling à liquide, SANS poissons)
// ÉTAPES (2 fichiers dans le même dossier que index.html) :
//  1) Crée un fichier  app_base.js  et colle dedans TON app.js actuel (le gros fichier complet).
//  2) Mets CE fichier ci-dessous comme  app.js  (il remplace l'ancien).  index.html ne change pas.
const body=f=>{const s=f.toString();return s.slice(s.indexOf('{')+1,s.lastIndexOf('}'))};

function ADD(){
let cur=null;
// ---------- PC AQUARIUM : cadre alu, grandes vitres, circuit de watercooling avec liquide ----------
const aqL=new THREE.PointLight(0x00b7ff,0,3);
function aquaFront(par){
 const AL=M(0x2a2a33,{metalness:1,roughness:.25,envMapIntensity:1.4});
 [-.525,.525].forEach(x=>box(.035,2.1,.035,AL,x,0,.575,par));
 box(1.09,.035,.035,AL,0,1.05,.575,par);box(1.09,.035,.035,AL,0,-1.05,.575,par);
 [-.525,.525].forEach(x=>box(.035,.035,1.15,AL,x,1.05,0,par));
 box(1.0,.012,1.05,LED(0x00c8ff),0,-1.07,0,par);box(.012,.012,1.05,LED(0x00c8ff),.5,.97,0,par);
 const lt=cvTex(256,64,g=>{g.font='bold 40px sans-serif';g.textAlign='center';g.fillStyle='#9fe8ff';g.shadowColor='#00c8ff';g.shadowBlur=14;g.fillText('AQUA',128,46)});
 const lg=new THREE.Mesh(new THREE.PlaneGeometry(.42,.1),new THREE.MeshBasicMaterial({map:lt,transparent:true,toneMapped:false}));lg.rotation.y=Math.PI/2;lg.position.set(.405,-.88,-.03);par.add(lg);
}
function aquaLoop(par){
 const liq=new THREE.MeshPhysicalMaterial({color:0x00c8ff,transparent:true,opacity:.6,roughness:.08,metalness:0,clearcoat:1,emissive:0x0077aa,emissiveIntensity:.7,envMapIntensity:1.5});
 const gm=new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.18,roughness:.04,clearcoat:1,envMapIntensity:2});
 cyl(.095,.56,gm,.12,.05,.42,par);cyl(.075,.46,liq,.12,0,.42,par);cyl(.1,.05,GOLD,.12,.35,.42,par);cyl(.1,.05,GOLD,.12,-.25,.42,par);
 box(.9,.07,.42,M(0x0c0c10,{metalness:.7,roughness:.4}),0,.95,.15,par);box(.88,.012,.4,LED(0x00c8ff),0,.99,.15,par);
 const lt=pts=>par.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2]))),32,.028,12),liq));
 lt([[.12,-.25,.42],[.05,-.4,.25],[-.2,-.2,.05],[-.265,.3,-.1]]);
 lt([[-.265,.42,-.1],[-.2,.7,-.05],[-.1,.9,.05]]);
 lt([[.2,.9,.25],[.2,.6,.4],[.12,.35,.42]]);
 aqL.position.set(.15,0,.3);par.add(aqL);
}
}

const P=[
["// --- boîtier PC : châssis, façade","/*ADD*/\n// --- boîtier PC : châssis, façade"],
// boîtier aquarium : façade vitrée au lieu de la façade pleine, pas de radiateur plein
["caseShell(cs,false);rb(.98,2.0,.04,.04,M(0x0a0a10,{metalness:.5,roughness:.5}),0,0,.45,cs,.004);","caseShell(cs,false);aquaFront(cs);"],
["box(.9,1.8,.08,M(0x08080c,{roughness:.7,metalness:.6}),0,0,.35,cs); // radiateur AIO","aquaLoop(cs);"],
// verre plus réaliste (plus transparent, reflets plus forts)
["opacity:.28,envMapIntensity:1.6,clearcoat:1}));glass.position.z=.588;","opacity:.12,envMapIntensity:2.4,clearcoat:1}));glass.position.z=.588;"],
["opacity:.18,envMapIntensity:1.6,clearcoat:1}));gl.rotation.y","opacity:.1,envMapIntensity:2.4,clearcoat:1}));gl.rotation.y"],
["cpl.intensity+=((ON.v?10*S.set.fx:0)-cpl.intensity)*.05;","cpl.intensity+=((ON.v?10*S.set.fx:0)-cpl.intensity)*.05;aqL.intensity+=((ON.v?8*S.set.fx:0)-aqL.intensity)*.05;"],
// écrans haute définition + curseur de souris
["k.width=SW;k.height=SH;","k.width=SW*2;k.height=SH*2;"],
["g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,SW,SH);","g.setTransform(2,0,0,2,0,0);g.clearRect(0,0,SW,SH);"],
["({left:drawL,top:drawT,right:drawR})[n](g,T);","({left:drawL,top:drawT,right:drawR})[n](g,T);if(n=='left'&&cur&&view=='left'){g.save();g.translate(cur.x,cur.y);g.fillStyle='#fff';g.strokeStyle='#000';g.lineWidth=1.5;g.beginPath();g.moveTo(0,0);g.lineTo(0,17);g.lineTo(4.5,13);g.lineTo(8,20);g.lineTo(10.5,19);g.lineTo(7,12);g.lineTo(12.5,12);g.closePath();g.fill();g.stroke();g.restore()}"],
["if(T-(loop.d||0)>.12||lastD!==scrOn)","if(T-(loop.d||0)>(view=='left'?.05:.12)||lastD!==scrOn)"],
["rd.render(sc,cam)}","if(view=='left'){mv.set(ptr.x,-ptr.y);rc.setFromCamera(mv,cam);const q=rc.intersectObject(scr.left)[0];cur=q&&q.uv?{x:q.uv.x*SW,y:(1-q.uv.y)*SH}:null}\n rd.render(sc,cam)}"],
// peau des mains avec pores
["const hands=[hand(-1),hand(1)];","var poreTex=cvTex(256,256,(g,w,h)=>{g.fillStyle='#808080';g.fillRect(0,0,w,h);for(let i=0;i<5000;i++){const v=95+Math.random()*70|0;g.fillStyle='rgb('+v+','+v+','+v+')';g.fillRect(Math.random()*w,Math.random()*h,2,2)}},[5,5]);\nconst hands=[hand(-1),hand(1)];"],
["skin=new THREE.MeshPhysicalMaterial({color:0xd9a273,roughness:.55,","skin=new THREE.MeshPhysicalMaterial({color:0xd9a273,bumpMap:poreTex,bumpScale:.5,clearcoat:.12,clearcoatRoughness:.5,roughness:.5,"]
];

const showErr=m=>{const d=document.createElement('pre');d.style.cssText='position:fixed;top:0;left:0;z-index:99;background:#400;color:#fff;padding:10px;max-width:100%;white-space:pre-wrap;font-size:13px';d.textContent=m;document.body.appendChild(d)};
try{
 const r=await fetch('./app_base.js',{cache:'no-store'});
 if(!r.ok)throw new Error('fichier app_base.js introuvable (erreur '+r.status+'). Crée-le dans le même dossier que index.html et colle-y ton ancien app.js complet.');
 let s=await r.text();
 for(const [a,b] of P){const i=s.indexOf(a);if(i<0||s.indexOf(a,i+1)>=0)throw new Error('motif introuvable ou en double : '+a.slice(0,60)+'\n(app_base.js doit être le gros app.js complet avec atelier/MAMAZON)');s=s.replace(a,()=>b==='/*ADD*/\n// --- boîtier PC : châssis, façade'?body(ADD)+'\n// --- boîtier PC : châssis, façade':b)}
 await import(URL.createObjectURL(new Blob([s],{type:'text/javascript'})));
}catch(e){
 console.warn(e);showErr('Mise à jour non appliquée : '+e.message);
 try{await import('./app_base.js')}catch(e2){}
}
