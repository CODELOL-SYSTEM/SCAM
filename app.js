// NOUVEAU app.js — améliore ton ancien code au chargement.
// ÉTAPE : renomme ton ANCIEN app.js en  app_base.js  (même dossier), puis mets CE fichier à la place sous le nom app.js.
// index.html ne change pas.
const body=f=>{const s=f.toString();return s.slice(s.indexOf('{')+1,s.lastIndexOf('}'))};

// ===== Code ajouté dans le jeu (catalogue MAMAZON, atelier, composants 3D, écran Windows) =====
function ADD(){
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
let cur=null;
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
 bx(.05,.1,.1,M(0x888890,{metalness:1,roughness:.3}),X+.02,.38,-.1);
 const c=T(B.cool);
 if(c==0){bx(.1,.2,.2,METAL,X+.05,.38,-.1);fan(g,.08,X+.11,.38,-.1)}
 else if(c==1){bx(.22,.46,.14,M(0xb0b0bc,{metalness:1,roughness:.35}),X+.11,.4,-.1);fan(g,.11,X+.2,.4,-.1+.08,true)}
 else{const n=c==2?2:3,r=c==2?.12:.1,z0=c==2?-.27:-.35,st=c==2?.27:.23;const pm=cyl(.07,.05,M(0x15151c,{metalness:.6,roughness:.4}),X+.05,.38,-.1,g);pm.rotation.z=Math.PI/2;const pc=new THREE.Mesh(new THREE.TorusGeometry(.05,.01,8,20),rgbMat());pc.rotation.y=Math.PI/2;pc.position.set(X+.08,.38,-.1);g.add(pc);
  bx(.05,.26,n*st+.08,M(0x15151c,{roughness:.6}),.1,.78,z0+(n-1)*st/2);for(let i=0;i<n;i++)fan(g,r,.14,.78,z0+i*st);
  tube(g,[[X+.05,.42,-.14],[-.1,.6,-.3],[.1,.66,z0-.04]],0x0c0c10);tube(g,[[X+.05,.34,-.06],[-.1,.5,.0],[.1,.66,z0+(n-1)*st+.04]],0x0c0c10)}
 const t=T(B.gpu),len=[.45,.58,.7,.78][t],th=.08+.02*t,h=.2+.03*t,gz=-.5+len/2,gx=X+th/2;
 bx(th,h,len,M(0x15151b,{metalness:.6,roughness:.35}),gx,-.1,gz);bx(th+.004,.02,len*.8,rgbMat(),gx,-.1+h/2,gz);if(t>=2)bx(.01,h,len,GOLD,X+th,-.1,gz);
 const nf=t==0?1:t==3?3:2;for(let i=0;i<nf;i++)fan(g,.085+.005*t,X+th+.006,-.1,-.5+len*(i+.5)/nf);
 bx(.8,.3,1.0,M(0x101015,{roughness:.5,metalness:.5}),0,-.88,-.03);bx(.01,.03,.9,GOLD,.38,-.76,-.03);
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
// ---------- Écran gauche façon Windows 11 ----------
function drawL2(g,T){if(S.desk.bg==0){const a=g.createRadialGradient(SW*.3,SH*.45,20,SW*.3,SH*.45,SW*.85);a.addColorStop(0,'#5cb0ff');a.addColorStop(.35,'#1a5fd0');a.addColorStop(1,'#041033');g.fillStyle=a;g.fillRect(0,0,SW,SH);const b=g.createRadialGradient(SW*.72,SH*.3,10,SW*.72,SH*.3,330);b.addColorStop(0,'rgba(190,120,255,.5)');b.addColorStop(1,'rgba(190,120,255,0)');g.fillStyle=b;g.fillRect(0,0,SW,SH)}else{const b=BGC[S.desk.bg],gr=g.createLinearGradient(0,0,0,SH);gr.addColorStop(0,b[0]);gr.addColorStop(1,b[1]);g.fillStyle=gr;g.fillRect(0,0,SW,SH)}
 g.textAlign='center';g.textBaseline='middle';
 if(!started){const p=1+Math.sin(T*3)*.04;g.save();g.translate(SW/2,SH/2);g.scale(p,p);g.shadowColor='#fff';g.shadowBlur=40;const gr=g.createLinearGradient(0,-55,0,55);gr.addColorStop(0,'#7be08a');gr.addColorStop(1,'#1d7a2b');g.fillStyle=gr;rr(g,-230,-55,460,110,55);g.fill();g.lineWidth=6;g.strokeStyle='#fff';g.stroke();g.shadowBlur=0;g.fillStyle='#fff';g.font='bold 54px '+FNT;g.fillText('COMMENCER',0,4);g.restore();return}
 APPS.filter(a=>a[0]!='sub'||vipOn()).forEach((a,i)=>{const x=64+(i/6|0)*100,y=46+(i%6)*78;g.fillStyle='#fff';g.font='36px '+FNT;g.fillText(a[2],x,y);g.font='14px '+FNT;g.shadowColor='#000';g.shadowBlur=4;g.fillText(a[1],x,y+30);g.shadowBlur=0});
 if(app){const A=APPS.find(a=>a[0]==app);g.save();g.shadowColor='rgba(0,0,0,.6)';g.shadowBlur=30;g.fillStyle='#fff';rr(g,250,26,SW-280,SH-110,12);g.fill();g.restore();g.fillStyle='#f3f3f3';g.beginPath();g.moveTo(250,66);g.lineTo(250,38);g.arcTo(250,26,262,26,12);g.lineTo(SW-42,26);g.arcTo(SW-30,26,SW-30,38,12);g.lineTo(SW-30,66);g.closePath();g.fill();g.fillStyle='#222';g.font='16px '+FNT;g.textAlign='left';g.fillText(A[2]+'  '+A[1],266,46);g.textAlign='right';g.fillText('—     ▢     ✕',SW-44,46);g.textAlign='left';g.font='22px '+FNT;
  const L2={phone:['Appels passés : '+S.calls,'Contacts : '+CH.filter(avail).length],bol:['Dossiers : '+S.unl.length],scam:['Cartes validées : '+Object.keys(S.scam).length],bank:['Solde : '+S.bal.toLocaleString('fr-FR')+' ₢'],shop:['VIP : '+(vipOn()?'actif':'inactif'),'Solde : '+S.bal+' ₢','Pièces possédées : '+S.inv.length],sub:['VIP actif'],save:['Dernière sauvegarde : '+(S.u?new Date(S.u).toLocaleTimeString('fr-FR'):'—')],quest:['Quêtes terminées : '+Object.keys(S.cl).length+'/'+QU.length],dset:['Fond '+(S.desk.bg+1)+' · '+FTS[S.desk.font]]}[app]||[];g.fillStyle='#111';L2.forEach((t,i)=>g.fillText(t,276,106+i*36));g.textAlign='center'}
 if(call){g.fillStyle='#d32727';rr(g,SW/2-170,SH-130,340,44,22);g.fill();g.fillStyle='#fff';g.font='bold 20px '+FNT;g.fillText('📞 Appel : '+call.c.n,SW/2,SH-108)}
 if(menuOpen){g.save();g.shadowColor='rgba(0,0,0,.6)';g.shadowBlur=30;g.fillStyle='rgba(34,36,48,.97)';rr(g,SW/2-210,SH-56-340,420,330,14);g.fill();g.restore();g.fillStyle='#fff';g.font='bold 16px '+FNT;g.textAlign='left';g.fillText('Épinglé',SW/2-190,SH-56-320);g.textAlign='center';APPS.filter(a=>a[0]!='sub'||vipOn()).forEach((a,i)=>{const x=SW/2-130+(i%3)*130,y=SH-56-270+(i/3|0)*82;g.font='32px '+FNT;g.fillText(a[2],x,y);g.font='13px '+FNT;g.fillText(a[1],x,y+28)})}
 g.fillStyle='rgba(22,24,34,.94)';g.fillRect(0,SH-56,SW,56);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(0,SH-56,SW,1);
 const tI=['⊞','🔍'].concat(APPS.slice(0,5).map(a=>a[2]));tI.forEach((e,i)=>{const x=SW/2-tI.length*26+i*52+26;if(i==0&&menuOpen){g.fillStyle='rgba(255,255,255,.15)';rr(g,x-22,SH-50,44,44,8);g.fill()}if(app&&i>1&&APPS[i-2][0]==app){g.fillStyle='#4cc2ff';g.fillRect(x-8,SH-8,16,3)}g.font=(i==0?'30px ':'26px ')+FNT;g.fillStyle=i==0?'#4cc2ff':'#fff';g.fillText(e,x,SH-28)});
 g.textAlign='right';g.font='15px '+FNT;g.fillStyle='#fff';g.fillText(clk(),SW-16,SH-36);g.fillText(new Date().toLocaleDateString('fr-FR'),SW-16,SH-16);g.textAlign='center'}
const w11=document.createElement('style');w11.textContent='.tb{height:50px;background:rgba(24,26,36,.92);backdrop-filter:blur(20px);justify-content:center;border-top:1px solid #fff2}.tb span:last-child{position:absolute;right:12px}.st{background:transparent!important;border-radius:8px!important;font-size:24px;color:#4cc2ff}.st:hover{background:#fff2!important}.menu{left:50%;transform:translateX(-50%);bottom:58px;width:320px;border:1px solid #fff3;border-radius:12px;background:rgba(34,36,48,.97);color:#fff;box-shadow:0 10px 40px #000a}.menu div{border-radius:8px;margin:2px 6px}.menu div:hover{background:#fff2}.ic{border-radius:8px}.ic:hover{background:#fff3}.win{background:#fff;border:1px solid #0003;border-radius:12px;box-shadow:0 10px 40px #0009;font-family:Segoe UI,Tahoma,sans-serif}.win>div:first-child{background:#f3f3f3;margin:-10px -10px 8px;padding:8px 12px;border-radius:12px 12px 0 0}.win button{border-radius:6px;border:1px solid #0002;background:#fbfbfb}.win button:hover{background:#e9f3ff;box-shadow:none}#sq{border-radius:20px;background:#fff2;color:#fff;border:1px solid #fff3}';document.head.appendChild(w11);
}

// ===== Remplacements dans l'ancien code =====
const P=[
// sauvegarde : inventaire + PC monté
["desk:{bg:0,font:0}};","desk:{bg:0,font:0},inv:['c0','r5','m0','g0','v0','s0'],build:{case:'c0',cpu:'r5',mb:'m0',gpu:'g0',cool:'v0',mon:'s0'}};"],
// MAMAZON vend les composants
["<h4>Personnages premium</h4>","${catHTML()}<h4>Personnages premium</h4>"],
["function buy(k){if(k[0]=='p'){","function buy(k){if(CAT[k])return buyCat(k);if(k[0]=='p'){"],
// fond Windows 11 + bouton démarrer
["const BG=['linear-gradient(#5aa0f0 0 55%,#4caf2a 55%)',","const BG=['radial-gradient(circle at 30% 45%,#5cb0ff,#1a5fd0 35%,#041033 90%)',"],
['<span class="st" data-a="menu" style="padding:6px 14px">⊞ démarrer</span>','<span class="st" data-a="menu" style="padding:4px 12px">⊞</span>'],
// mains plus réalistes (pores, brillance, paume arrondie)
["const hands=[hand(-1),hand(1)];","var poreTex=cvTex(256,256,(g,w,h)=>{g.fillStyle='#808080';g.fillRect(0,0,w,h);for(let i=0;i<5000;i++){const v=95+Math.random()*70|0;g.fillStyle='rgb('+v+','+v+','+v+')';g.fillRect(Math.random()*w,Math.random()*h,2,2)}},[5,5]);\nconst hands=[hand(-1),hand(1)];"],
["skin=M(0xd9a273,{roughness:.62,envMapIntensity:.3})","skin=new THREE.MeshPhysicalMaterial({color:0xd9a273,bumpMap:poreTex,bumpScale:.5,clearcoat:.12,clearcoatRoughness:.5,roughness:.5,sheen:1,sheenColor:new THREE.Color(0xff9a8a),sheenRoughness:.45,envMapIntensity:.3})"],
["new THREE.CapsuleGeometry(r,l,4,10)","new THREE.CapsuleGeometry(r,l,6,16)"],
["rbH(.34,.3,.07,.07,skin,0,0,0,g,.015);","const palm=new THREE.Mesh(new THREE.SphereGeometry(1,28,18),skin);palm.scale.set(.185,.05,.16);palm.position.set(0,0,.02);palm.castShadow=true;g.add(palm);const heel=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),skin);heel.scale.set(.15,.055,.11);heel.position.set(0,.005,.14);g.add(heel);"],
// code ajouté (avant le boîtier)
["// --- boîtier PC : châssis, façade","/*ADD*/\n// --- boîtier PC : châssis, façade"],
// boîtier modulaire
["const TX=4.2,","const TX=4.35,"],
["cs.position.set(TX,1.93,TZ);cs.rotation.y=-.35;cs.scale.setScalar(.9);sc.add(cs);","cs.position.set(TX,1.84,TZ);cs.rotation.y=-1.0;cs.scale.setScalar(.8);sc.add(cs);"],
["rb(1.05,2.1,1.15,.06,BLK,0,0,0,cs,.012);","caseShell(cs,false);"],
// écrans : groupes pour agrandir, haute définition, curseur
["const sCv={},sTx={};","const mg={},sCv={},sTx={};"],
["k.width=SW;k.height=SH;","k.width=SW*2;k.height=SH*2;"],
["g.rotation.y=p[3];sc.add(g);","g.rotation.y=p[3];sc.add(g);mg[n]=g;g.userData.drop=p[1]-1.0;"],
["g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,SW,SH);","g.setTransform(2,0,0,2,0,0);g.clearRect(0,0,SW,SH);"],
["({left:drawL,top:drawT,right:drawR})[n](g,T);","({left:drawL2,top:drawT,right:drawR})[n](g,T);if(n=='left'&&cur&&view=='left'){g.save();g.translate(cur.x,cur.y);g.fillStyle='#fff';g.strokeStyle='#000';g.lineWidth=1.5;g.beginPath();g.moveTo(0,0);g.lineTo(0,17);g.lineTo(4.5,13);g.lineTo(8,20);g.lineTo(10.5,19);g.lineTo(7,12);g.lineTo(12.5,12);g.closePath();g.fill();g.stroke();g.restore()}"],
["if(T-(loop.d||0)>.12||lastD!==scrOn)","if(T-(loop.d||0)>(view=='left'?.05:.12)||lastD!==scrOn)"],
["rd.render(sc,cam)}","if(view=='left'){mv.set(ptr.x,-ptr.y);rc.setFromCamera(mv,cam);const q=rc.intersectObject(scr.left)[0];cur=q&&q.uv?{x:q.uv.x*SW,y:(1-q.uv.y)*SH}:null}\n rd.render(sc,cam)}"],
// RGB des pièces
["f.userData.sp.rotation.z-=ON.v?.12:0});","f.userData.sp.rotation.z-=ON.v?.12:0});\n rgbM.forEach((m,i)=>{m.emissive.setHSL((hue+i*.04)%1,.9,.5);m.emissiveIntensity=ON.v?1.8:(view=='table'?.2:0)});spinners.forEach(q=>q.rotation.x+=ON.v?.18:0);"],
// touche $ + clic atelier
["addEventListener('keydown',e=>{typing=1;","addEventListener('keydown',e=>{if(e.key=='$'&&!/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||'')){toggleBench();return}typing=1;"],
["cv.addEventListener('click',e=>{if(view!='home'||busy)return;","cv.addEventListener('click',e=>{if(view=='table')return benchClick(e);if(view!='home'||busy)return;"],
// montage du PC au démarrage
["requestAnimationFrame(loop); // démarre","refreshPC();requestAnimationFrame(loop); // démarre"]
];

const showErr=m=>{const d=document.createElement('pre');d.style.cssText='position:fixed;top:0;left:0;z-index:99;background:#400;color:#fff;padding:10px;max-width:100%;white-space:pre-wrap;font-size:13px';d.textContent=m;document.body.appendChild(d)};
try{
 let s=await (await fetch('./app_base.js',{cache:'no-store'})).text();
 for(const [a,b] of P){const i=s.indexOf(a);if(i<0||s.indexOf(a,i+1)>=0)throw new Error('motif introuvable ou en double : '+a.slice(0,60));s=s.replace(a,()=>b==='/*ADD*/\n// --- boîtier PC : châssis, façade'?body(ADD)+'\n// --- boîtier PC : châssis, façade':b)}
 await import(URL.createObjectURL(new Blob([s],{type:'text/javascript'})));
}catch(e){
 console.warn('Mise à jour ignorée, ancien code lancé :',e);
 showErr('Mise à jour non appliquée : '+e.message+'\n(Vérifie que ton ancien fichier s’appelle bien app_base.js)');
 try{await import('./app_base.js')}catch(e2){showErr('app_base.js introuvable : '+e2.message)}
}
