"use strict";
/* =====================================================================
   Asep - Elo 1850 - mesin catur + protokol UCI
   ---------------------------------------------------------------------
   SUMBER MESIN: "Mesin Catur Agresif - Pawn Storm" (HTML), isi
   <script id="eng"> (fungsi makeEngine). Algoritma pencarian dan evaluasi
   (pawn storm, tekanan zona raja, PVS, LMR, null-move, TT) TIDAK diubah.

   Perubahan pada teks mesin (hanya yang perlu agar bisa dipakai lewat UCI;
   ditandai komentar "TAMBAHAN INTEGRASI" di dalam makeEngine):
     1. setpos(a): memuat posisi dari FEN. Mesin asli hanya punya reset()
        dan semua variabel posisi (side, cast, ep, half, kp, hash) tersembunyi
        di dalam closure, jadi tidak bisa diisi dari luar.
     2. noBook + satu kondisi "!noBook&&" pada loop buku di search():
        buku pembukaan membandingkan riwayat langkah sejak posisi dipasang,
        sehingga dari posisi FEN non-awal ia bisa salah mengembalikan
        langkah buku. Gerbang ini mematikannya kecuali dari posisi awal.
     3. Ekspor tambahan: setpos, newgame (kosongkan TT), setNoBook, attacked,
        kingOf, state (cast/ep/half/hash untuk perintah debug "d").
   Selain itu teks mesin identik dengan HTML.

   Mengapa perlu lapisan UCI: mesin asli tidak kompatibel UCI (API:
   reset/legal/make/unmake/search(ms)). Lapisan di bawah mesin menyediakan:
     uci, isready, ucinewgame, setoption, position (startpos|fen ... moves ...),
     go (movetime, wtime/btime/winc/binc/movestogo, infinite), stop, quit,
     debug: d, go perft N.
   Catatan: search(ms) hanya menerima batas WAKTU; "go depth N" tidak
   didukung (waktu bawaan dipakai). search() sinkron, jadi "stop" pada
   pencarian berbatas waktu baru diproses setelah pencarian selesai;
   "go infinite" dijalankan per irisan waktu (300 ms, 600 ms, ... maks. 6 dtk).
   Waktu bawaan "go" polos: 1000 ms (waktu terkunci pada HTML asli).

   Dipakai lewat asep.js (adaptor protokol bot NusantaraChess) atau langsung
   sebagai Web Worker UCI murni.
   ===================================================================== */
(function (global) {

function createAsepUci(emit) {

  /* ===================================================================
     MESIN  (dari HTML, <script id="eng">) + TAMBAHAN INTEGRASI bertanda
     =================================================================== */
function makeEngine(){
var bd=new Int8Array(128),side=1,cast=15,ep=-1,half=0,h1=0,h2=0,sp=0,kp=[4,116],i,j;
var ND=[33,31,18,14,-33,-31,-18,-14],BD=[17,15,-17,-15],RD=[16,-16,1,-1],KD=[17,15,-17,-15,16,-16,1,-1];
var seed=123456789;function rnd(){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return seed|0}
var Z1=[],Z2=[];
for(i=0;i<13;i++){Z1[i]=new Int32Array(128);Z2[i]=new Int32Array(128);for(j=0;j<128;j++){Z1[i][j]=rnd();Z2[i][j]=rnd()}}
var S1=rnd(),S2=rnd(),C1=new Int32Array(16),C2=new Int32Array(16),E1=new Int32Array(8),E2=new Int32Array(8);
for(i=0;i<16;i++){C1[i]=rnd();C2[i]=rnd()}for(i=0;i<8;i++){E1[i]=rnd();E2[i]=rnd()}
var CM=new Int8Array(128).fill(15);CM[4]=12;CM[7]=14;CM[0]=13;CM[116]=3;CM[119]=11;CM[112]=7;
var uc=new Int8Array(1200),ucs=new Int8Array(1200),uep=new Int16Array(1200),uh=new Int16Array(1200),u1=new Int32Array(1200),u2=new Int32Array(1200),um=new Int32Array(1200);
var TS=1<<20,TM=TS-1,tk=new Int32Array(TS),tv=new Int16Array(TS),td=new Int8Array(TS),tf=new Int8Array(TS),tmv=new Int32Array(TS);
var K1=new Int32Array(70),K2=new Int32Array(70),hist=new Int32Array(32768);
var NOISE=25;/* derau evaluasi (sentipion): 0 = kekuatan penuh, makin besar makin lemah */
var nodes=0,stop=false,tEnd=0,rootMove=0,MATE=30000,MT=29800,INF=32000;
function ki(c){return c>0?0:1}
function hashAll(){h1=h2=0;for(var s=0;s<128;s++){if(s&8)continue;var v=bd[s];if(v){h1^=Z1[v+6][s];h2^=Z2[v+6][s]}}if(side<0){h1^=S1;h2^=S2}h1^=C1[cast];h2^=C2[cast]}
function reset(){bd.fill(0);var b=[4,2,3,5,6,3,2,4];for(var k=0;k<8;k++){bd[k]=b[k];bd[16+k]=1;bd[96+k]=-1;bd[112+k]=-b[k]}side=1;cast=15;ep=-1;half=0;sp=0;kp[0]=4;kp[1]=116;hashAll()}
function att(sq,c){var s,k,d,v;
s=sq-c*15;if(!(s&136)&&bd[s]==c)return true;s=sq-c*17;if(!(s&136)&&bd[s]==c)return true;
for(k=0;k<8;k++){s=sq+ND[k];if(!(s&136)&&bd[s]==2*c)return true;s=sq+KD[k];if(!(s&136)&&bd[s]==6*c)return true}
for(k=0;k<4;k++){d=BD[k];s=sq+d;while(!(s&136)){v=bd[s];if(v){if(v==3*c||v==5*c)return true;break}s+=d}
d=RD[k];s=sq+d;while(!(s&136)){v=bd[s];if(v){if(v==4*c||v==5*c)return true;break}s+=d}}
return false}
function pm(ml,f,t,pr){if(pr){for(var q=5;q>1;q--)ml.push(f|t<<8|q<<16)}else ml.push(f|t<<8)}
function gen(caps){var ml=[],c=side,sq,p,t,v,d,r,f,k,D,last,st,fw;
for(r=0;r<8;r++)for(f=0;f<8;f++){sq=r*16+f;p=bd[sq]*c;if(p<=0)continue;
if(p==1){last=c>0?6:1;st=c>0?1:6;fw=sq+16*c;
for(k=0;k<2;k++){t=sq+(k?17:15)*c;if(t&136)continue;v=bd[t]*c;if(v<0)pm(ml,sq,t,r==last);else if(t==ep)ml.push(sq|t<<8|1<<20)}
if(!bd[fw]&&(!caps||r==last)){pm(ml,sq,fw,r==last);if(!caps&&r==st&&!bd[fw+16*c])ml.push(sq|(fw+16*c)<<8|4<<20)}
}else if(p==2||p==6){D=p==2?ND:KD;
for(k=0;k<8;k++){t=sq+D[k];if(t&136)continue;v=bd[t]*c;if(v<0||(v==0&&!caps))ml.push(sq|t<<8)}
if(p==6&&!caps&&sq==(c>0?4:116)){var kr=c>0?1:4,qr=c>0?2:8;
if((cast&kr)&&!bd[sq+1]&&!bd[sq+2]&&!att(sq,-c)&&!att(sq+1,-c)&&!att(sq+2,-c))ml.push(sq|(sq+2)<<8|2<<20);
if((cast&qr)&&!bd[sq-1]&&!bd[sq-2]&&!bd[sq-3]&&!att(sq,-c)&&!att(sq-1,-c)&&!att(sq-2,-c))ml.push(sq|(sq-2)<<8|2<<20)}
}else{D=p==3?BD:p==4?RD:KD;
for(k=0;k<D.length;k++){t=sq+D[k];while(!(t&136)){v=bd[t]*c;if(v>0)break;if(v<0){ml.push(sq|t<<8);break}if(!caps)ml.push(sq|t<<8);t+=D[k]}}}}
return ml}
function make(m){var f=m&255,t=(m>>8)&255,pr=(m>>16)&15,fl=m>>20,p=bd[f],c=side,cap=bd[t],ap=p*c;
uc[sp]=cap;ucs[sp]=cast;uep[sp]=ep;uh[sp]=half;u1[sp]=h1;u2[sp]=h2;um[sp]=m;sp++;
if(ep>=0){h1^=E1[ep&7];h2^=E2[ep&7]}
h1^=C1[cast];h2^=C2[cast];half++;
bd[f]=0;h1^=Z1[p+6][f];h2^=Z2[p+6][f];
if(cap){h1^=Z1[cap+6][t];h2^=Z2[cap+6][t];half=0}
var np=pr?c*pr:p;bd[t]=np;h1^=Z1[np+6][t];h2^=Z2[np+6][t];
if(ap==1){half=0;if(fl&1){var cs=t-16*c,cp=bd[cs];bd[cs]=0;h1^=Z1[cp+6][cs];h2^=Z2[cp+6][cs]}}
ep=-1;if(fl&4){ep=(f+t)>>1;h1^=E1[ep&7];h2^=E2[ep&7]}
if(fl&2){var rf=t>f?t+1:t-2,rt=t>f?t-1:t+1,rk=bd[rf];bd[rf]=0;bd[rt]=rk;h1^=Z1[rk+6][rf]^Z1[rk+6][rt];h2^=Z2[rk+6][rf]^Z2[rk+6][rt]}
if(ap==6)kp[ki(c)]=t;
cast&=CM[f]&CM[t];h1^=C1[cast];h2^=C2[cast];side=-c;h1^=S1;h2^=S2}
function unmake(){sp--;var m=um[sp],f=m&255,t=(m>>8)&255,pr=(m>>16)&15,fl=m>>20;side=-side;var c=side,p=bd[t];if(pr)p=c;
bd[f]=p;bd[t]=uc[sp];
if(fl&1)bd[t-16*c]=-c;
if(fl&2){var rf=t>f?t+1:t-2,rt=t>f?t-1:t+1;bd[rf]=bd[rt];bd[rt]=0}
if(p*c==6)kp[ki(c)]=f;
cast=ucs[sp];ep=uep[sp];half=uh[sp];h1=u1[sp];h2=u2[sp]}
function nmake(){um[sp]=0;uc[sp]=0;ucs[sp]=cast;uep[sp]=ep;uh[sp]=half;u1[sp]=h1;u2[sp]=h2;sp++;if(ep>=0){h1^=E1[ep&7];h2^=E2[ep&7]}ep=-1;side=-side;h1^=S1;h2^=S2;half++}
function nunmake(){sp--;side=-side;ep=uep[sp];h1=u1[sp];h2=u2[sp];half=uh[sp]}
function legal(){var o=[],m=gen(false);for(var k=0;k<m.length;k++){make(m[k]);if(!att(kp[ki(-side)],side))o.push(m[k]);unmake()}return o}
function rep(){for(var k=sp-2;k>=sp-half&&k>=0;k-=2)if(u1[k]==h1&&u2[k]==h2)return true;return false}
function hasNP(c){for(var s=0;s<128;s++){if(s&8)continue;var v=bd[s]*c;if(v>1&&v<6)return true}return false}
function status(){var l=legal();if(!l.length)return att(kp[ki(side)],-side)?'mat':'pat';if(half>=100)return 'd50';
var c=0,k,mn=0;for(k=sp-2;k>=sp-half&&k>=0;k-=2)if(u1[k]==h1&&u2[k]==h2)c++;if(c>=2)return 'rep';
for(k=0;k<128;k++){if(k&8)continue;var v=Math.abs(bd[k]);if(v==1||v==4||v==5)return '';if(v==2||v==3)mn++}
return mn<2?'ins':''}
/* ---------- EVALUASI ---------- */
var CN=[0,1,2,3,3,2,1,0],VAL=[0,100,320,330,500,950,0],PA=[0,0,3,8,16,30,55,0],PP=[0,0,10,20,40,70,120,0];
var pc=[new Int8Array(10),new Int8Array(10)],pn=[new Int8Array(10),new Int8Array(10)],occ=new Int16Array(40);
function shield(c){var k=kp[ki(c)],n=0,d,j,t;for(d=-1;d<2;d++)for(j=1;j<3;j++){t=k+16*c*j+d;if(!(t&136)&&bd[t]==c){n++;break}}return n}
function ev(){var mg=0,eg=0,npm=0,no=0,k,x,bp=[0,0],hq=[0,0],st=[0,0],ka=[0,0],kw=[0,0],i,o,r,f,sq,v,a;
pc[0].fill(0);pc[1].fill(0);pn[0].fill(8);pn[1].fill(8);
for(r=0;r<8;r++)for(f=0;f<8;f++){sq=r*16+f;v=bd[sq];if(!v)continue;occ[no++]=sq;a=v>0?v:-v;
if(a==1){i=v>0?0:1;var q=v>0?r:7-r;pc[i][f+1]++;if(q<pn[i][f+1])pn[i][f+1]=q}else if(a<6)npm+=VAL[a]}
var sh=[shield(1),shield(-1)],wS=[0,0],am=[0,0];
for(i=0;i<2;i++){o=1-i;var ef=kp[o]&7,og=kp[i]&7;
/* bobot pawn storm: kuat bila raja lawan rokade di sisi lain, sedang bila sisi sama */
wS[i]=(ef<=2||ef>=5)?(Math.abs(ef-og)>=3?8:3.5):2;am[i]=1+0.2*(3-sh[o])}
for(k=0;k<no;k++){sq=occ[k];v=bd[sq];var c=v>0?1:-1;a=v*c;f=sq&7;r=sq>>4;var rr=c>0?r:7-r;i=c>0?0:1;o=1-i;
var ek=kp[o],ef2=ek&7,er=ek>>4,cen=CN[f]+CN[r],m=VAL[a],e=VAL[a],dist=Math.max(Math.abs(f-ef2),Math.abs(r-er));
switch(a){
case 1:m-=8;m+=(PA[rr]>>1)+((f==3||f==4)?rr*2:0);e+=PA[rr];
if(pc[i][f+1]>1){m-=6;e-=10}
if(!pc[i][f]&&!pc[i][f+2]){m-=10;e-=14}
var ps=1;for(x=f;x<f+3;x++)if(pn[o][x]<7-rr)ps=0;if(ps){m+=PP[rr]>>1;e+=PP[rr]}
var dd=Math.abs(f-ef2);
if(dd<=2&&rr>=2){if(rr>=3){var adv=rr-2;st[i]+=adv*(adv+1)/2*(dd==2?0.5:1)*wS[i]}
var lv=0;for(x=0;x<2;x++){var t=sq+(x?17:15)*c;if(!(t&136)&&bd[t]==-c)lv++}st[i]+=lv*7}
break;
case 2:m+=cen*4;e+=cen*3;if(dist<=4)m+=(5-dist)*5;break;
case 3:m+=cen*2;e+=cen*2;bp[i]++;if(dist<=4)m+=(5-dist)*4;break;
case 4:if(!pc[i][f+1]){m+=pc[o][f+1]?12:20;e+=10;if(Math.abs(f-ef2)<=1)m+=12}
if(rr==6){m+=10;e+=20}if(dist<=4)m+=(5-dist)*3;break;
case 5:hq[i]=1;m+=cen;e+=cen*2;if(dist<=4)m+=(5-dist)*6;break;
case 6:m+=sh[i]*12-cen*9-(rr>1?15*(rr-1):0);e+=cen*10;break}
if(a>1&&a<6&&dist<=3){ka[i]++;kw[i]+=a==5?5:a==4?3:2}
mg+=c*m;eg+=c*e}
if(bp[0]>1){mg+=30;eg+=45}if(bp[1]>1){mg-=30;eg-=45}
mg+=st[0]*am[0]*(hq[0]?1:0.5)-st[1]*am[1]*(hq[1]?1:0.5);
/* tekanan zona raja: butuh >=2 penyerang */
if(ka[0]>1)mg+=kw[0]*ka[0]*(hq[0]?1:0.5)*am[0];if(ka[1]>1)mg-=kw[1]*ka[1]*(hq[1]?1:0.5)*am[1];
var ph=Math.min(256,(npm*256/6500)|0),sc=((mg*ph+eg*(256-ph))/256)|0;
return (side>0?sc:-sc)+16+(((h1>>>5)%(2*NOISE+1))-NOISE)}
/* ---------- PENCARIAN ---------- */
function sc(m,tm,pl){if(m==tm)return 1e7;var t=(m>>8)&255,f=m&255,v=bd[t],a=v<0?-v:v;
if(a||((m>>20)&1)){if(!a)a=1;var ap=bd[f]<0?-bd[f]:bd[f];return 1e6+a*16-ap}
if((m>>16)&15)return 9e5+((m>>16)&15);if(m==K1[pl])return 8e5;if(m==K2[pl])return 7e5;
return hist[(side>0?0:16384)+f*128+t]}
function q(a,b,pl){if((++nodes&2047)==0&&Date.now()>tEnd)stop=true;if(stop)return 0;
var inC=att(kp[ki(side)],-side),best,i,j,m,v;if(pl>=62)return ev();
if(!inC){best=ev();if(best>=b)return best;if(best>a)a=best}else best=-MATE+pl;
var ml=gen(!inC),n=ml.length,ss=[];
for(i=0;i<n;i++){m=ml[i];v=bd[(m>>8)&255];v=v<0?-v:v;if(!v)v=1;var f=bd[m&255];f=f<0?-f:f;ss[i]=v*16-f+((m>>16)&15)*100}
for(i=0;i<n;i++){var bi=i;for(j=i+1;j<n;j++)if(ss[j]>ss[bi])bi=j;m=ml[bi];ml[bi]=ml[i];ss[bi]=ss[i];
v=bd[(m>>8)&255];v=v<0?-v:v;if(!v)v=1;
if(!inC&&!((m>>16)&15)&&best+VAL[v]+200<a)continue;
make(m);if(att(kp[ki(-side)],side)){unmake();continue}
var s=-q(-b,-a,pl+1);unmake();if(stop)return 0;
if(s>best){best=s;if(s>a){a=s;if(a>=b)break}}}
return best}
function ab(d,a,b,pl,nn){if((++nodes&2047)==0&&Date.now()>tEnd)stop=true;if(stop)return 0;
if(pl>0&&(half>=100||rep()))return pl&1?35:-35; /* contempt: hindari remis */
var inC=att(kp[ki(side)],-side);if(inC&&pl<60)d++;
if(d<=0)return q(a,b,pl);if(pl>=62)return ev();
var idx=h1&TM,tm=0,pv=b-a>1;
if(tk[idx]==h2&&tf[idx]){tm=tmv[idx];if(td[idx]>=d&&pl>0){var ts=tv[idx];if(ts>MT)ts-=pl;else if(ts<-MT)ts+=pl;var fg=tf[idx];if(fg==1||(fg==2&&ts>=b)||(fg==3&&ts<=a))return ts}}
if(nn&&!pv&&!inC&&d>=3&&hasNP(side)){nmake();var s0=-ab(d-1-(d>5?3:2),-b,-b+1,pl+1,false);nunmake();if(stop)return 0;if(s0>=b)return s0>MT?b:s0}
var ml=gen(false),n=ml.length,ss=[],i,j,best=-INF,bm=0,a0=a,cnt=0;
for(i=0;i<n;i++)ss[i]=sc(ml[i],tm,pl);
for(i=0;i<n;i++){var bi=i;for(j=i+1;j<n;j++)if(ss[j]>ss[bi])bi=j;
var m=ml[bi];ml[bi]=ml[i];ss[bi]=ss[i];
var quiet=!bd[(m>>8)&255]&&!((m>>16)&15)&&!((m>>20)&1);
make(m);if(att(kp[ki(-side)],side)){unmake();continue}
cnt++;var gc=att(kp[ki(side)],-side),s,r=0;
if(quiet&&!inC&&!gc&&!pv&&d<=3&&cnt>6+d*d){unmake();continue}
if(cnt==1)s=-ab(d-1,-b,-a,pl+1,true);
else{if(d>=3&&cnt>3&&quiet&&!inC&&!gc)r=1+(cnt>8?1:0)+(d>6?1:0);
s=-ab(d-1-r,-a-1,-a,pl+1,true);
if(s>a&&r)s=-ab(d-1,-a-1,-a,pl+1,true);
if(s>a&&s<b)s=-ab(d-1,-b,-a,pl+1,true)}
unmake();if(stop)return 0;
if(s>best){best=s;bm=m;if(pl==0)rootMove=m;
if(s>a){a=s;if(a>=b){if(quiet){if(K1[pl]!=m){K2[pl]=K1[pl];K1[pl]=m}hist[(side>0?0:16384)+(m&255)*128+((m>>8)&255)]+=d*d}break}}}}
if(!cnt)return inC?-MATE+pl:0;
var sv=best;if(sv>MT)sv+=pl;else if(sv<-MT)sv-=pl;
tk[idx]=h2;tv[idx]=sv;td[idx]=d;tf[idx]=best<=a0?3:best>=b?2:1;tmv[idx]=bm;
return best}
var BOOK=[
"e2e4 e7e5 f2f4 e5f4 g1f3 g7g5 h2h4 g5g4 f3e5",
"e2e4 e7e5 f2f4 e5f4 g1f3 d7d6 f1c4 h7h6 b1c3",
"e2e4 d7d5 e4d5 d8d5 b1c3 d5a5 d2d4 g8f6 g1f3 c7c6 f1c4",
"e2e4 c7c5 b1c3 b8c6 f2f4 g7g6 g1f3 f8g7 f1c4 e7e6 f4f5",
"e2e4 e7e6 d2d4 d7d5 e4e5 c7c5 c2c3 b8c6 g1f3 d8b6",
"e2e4 c7c6 b1c3 d7d5 g1f3 d5e4 c3e4 c8f5 e4g3 f5g6 h2h4",
"f2f4 d7d5 g1f3 g8f6 e2e3 g7g6 f1e2 f8g7 e1g1 e8g8",
"e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 g7g6",
"e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 a7a6",
"e2e4 c7c5 g1f3 b8c6 d2d4 c5d4 f3d4 g8f6 b1c3 e7e5",
"d2d4 g8f6 c2c4 g7g6 b1c3 f8g7 e2e4 d7d6",
"d2d4 f7f5 g2g3 g8f6 f1g2 e7e6 g1f3 f8e7 e1g1 e8g8",
"c2c4 e7e5 b1c3 g8f6 g1f3 b8c6"];
function search(ms){var t0=Date.now(),lm=legal();if(!lm.length)return null;
var hs=[],cand=[],k,z;for(k=0;k<sp;k++)hs.push(str(um[k]));
for(k=0;!noBook&&k<BOOK.length;k++){var ln=BOOK[k].split(' '),ok=ln.length>sp;for(z=0;ok&&z<sp;z++)if(ln[z]!=hs[z])ok=false;if(ok)cand.push(ln[sp])}
if(cand.length){var bs=cand[(Math.random()*cand.length)|0];for(k=0;k<lm.length;k++)if(str(lm[k])==bs)return {m:lm[k],score:0,depth:0,nodes:0,ms:0,book:1}}
tEnd=t0+ms-12;nodes=0;stop=false;rootMove=lm[0];hist.fill(0);K1.fill(0);K2.fill(0);
if(lm.length==1)return {m:lm[0],score:0,depth:0,nodes:0,ms:0};
var rs=0,rd=0;
for(var d=1;d<64;d++){var s=ab(d,-INF,INF,0,false);if(stop)break;rs=s;rd=d;if(s>MT)break}
return {m:rootMove,score:rs,depth:rd,nodes:nodes,ms:Date.now()-t0}}
function str(m){var f=m&255,t=(m>>8)&255,pr=(m>>16)&15;
return "abcdefgh"[f&7]+((f>>4)+1)+"abcdefgh"[t&7]+((t>>4)+1)+(pr?"nbrq"[pr-2]:"")}
/* ---- TAMBAHAN INTEGRASI NusantaraChess (bukan bagian mesin asli) ---- */
var noBook=false;
function setpos(a){bd.fill(0);for(var s=0;s<128;s++)if(!(s&8))bd[s]=a.board[s];side=a.stm;cast=a.castle;ep=a.ep;half=a.half;sp=0;kp[0]=a.kings[0];kp[1]=a.kings[1];hashAll();if(ep>=0){h1^=E1[ep&7];h2^=E2[ep&7]}}
function newgame(){tf.fill(0)}
return {reset:reset,legal:legal,make:make,unmake:unmake,search:search,status:status,str:str,bd:bd,
side:function(){return side},check:function(){return att(kp[ki(side)],-side)},king:function(){return kp[ki(side)]},
setpos:setpos,newgame:newgame,setNoBook:function(v){noBook=!!v},attacked:function(s,c){return att(s,c)},kingOf:function(c){return kp[ki(c)]},state:function(){return {cast:cast,ep:ep,half:half,key:(h1>>>0)+":"+(h2>>>0)}}}
}

  const E = makeEngine();

  /* ===================================================================
     LAPISAN UCI (BARU) — bukan bagian mesin asli. Fungsinya:
       - memuat posisi dari FEN lewat setpos() (tambahan integrasi di mesin),
       - mengubah "position ... moves ..." menjadi make() pada langkah legal,
       - menjalankan search(ms) lalu membalas info/bestmove.
     =================================================================== */
  const U_NAME = "Asep - Mesin Catur Agresif";
  const U_AUTHOR = "NusantaraChess (mesin dari Mesin Catur Agresif - Pawn Storm)";
  const U_DEFAULT_MOVETIME = 1000;           // waktu terkunci pada HTML asli: 1000 ms
  const U_MATE = 30000, U_MT = 29800;        // MATE dan MT milik mesin
  const U_START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const U_START_KEY = U_START_FEN.split(" ").slice(0, 4).join(" ");
  const U_TYPES = { p: 1, n: 2, b: 3, r: 4, q: 5, k: 6 };

  const uSq = s => "abcdefgh"[s & 7] + ((s >> 4) + 1);
  const uOut = line => emit(line);
  const uOpts = { ThinkTime: U_DEFAULT_MOVETIME, OwnBook: true };
  let uBaseFen = U_START_FEN, uMoveList = [], uPositionOk = true, uCur = null, uQuit = false;

  function uParseFen(fen) {
    const f = String(fen).trim().split(/\s+/);
    if (f.length < 2) throw new Error("FEN tidak lengkap");
    const rows = f[0].split("/");
    if (rows.length !== 8) throw new Error("FEN harus punya 8 baris");
    const board = new Array(128).fill(0), kings = [-1, -1];
    for (let r = 0; r < 8; r++) {
      const rank = 7 - r; let file = 0;
      for (const ch of rows[r]) {
        if (ch >= "1" && ch <= "8") { file += +ch; continue }
        const t = U_TYPES[ch.toLowerCase()];
        if (!t || file > 7) throw new Error("FEN: karakter/kolom tidak valid pada baris " + (rank + 1));
        const color = ch === ch.toLowerCase() ? -1 : 1, sqi = rank * 16 + file;
        if (t === 1 && (rank === 0 || rank === 7)) throw new Error("FEN: pion di baris pertama/terakhir");
        if (t === 6) { const ci = color > 0 ? 0 : 1; if (kings[ci] >= 0) throw new Error("FEN: raja ganda"); kings[ci] = sqi }
        board[sqi] = color * t; file++;
      }
      if (file !== 8) throw new Error("FEN: baris " + (rank + 1) + " tidak berisi 8 kolom");
    }
    if (kings[0] < 0 || kings[1] < 0) throw new Error("FEN: raja tidak lengkap");
    if (f[1] !== "w" && f[1] !== "b") throw new Error("FEN: giliran harus w atau b");
    const stm = f[1] === "w" ? 1 : -1;
    const cs = f[2] || "-";
    if (!/^(-|[KQkq]+)$/.test(cs)) throw new Error("FEN: hak rokade tidak valid");
    // Mesin tidak memeriksa keberadaan benteng saat rokade: hak yang tidak sesuai papan dibuang.
    let c = 0;
    if (cs.includes("K") && board[4] === 6 && board[7] === 4) c |= 1;
    if (cs.includes("Q") && board[4] === 6 && board[0] === 4) c |= 2;
    if (cs.includes("k") && board[116] === -6 && board[119] === -4) c |= 4;
    if (cs.includes("q") && board[116] === -6 && board[112] === -4) c |= 8;
    let e = -1;
    if (f[3] && f[3] !== "-") {
      if (!/^[a-h][36]$/.test(f[3])) throw new Error("FEN: kotak en passant tidak valid");
      const idx = (+f[3][1] - 1) * 16 + "abcdefgh".indexOf(f[3][0]);
      if (stm === 1 && f[3][1] === "6" && board[idx - 16] === -1 && !board[idx]) e = idx;
      if (stm === -1 && f[3][1] === "3" && board[idx + 16] === 1 && !board[idx]) e = idx;
    }
    const half = Math.max(0, parseInt(f[4], 10) || 0), full = Math.max(1, parseInt(f[5], 10) || 1);
    return { board, kings, stm, castle: c, ep: e, half, full };
  }

  function uToFen(full) {
    const P = "pnbrqk", rows = [];
    for (let r = 7; r >= 0; r--) {
      let row = "", n = 0;
      for (let fl = 0; fl < 8; fl++) {
        const p = E.bd[r * 16 + fl];
        if (!p) { n++; continue }
        if (n) { row += n; n = 0 }
        const ch = P[Math.abs(p) - 1]; row += p < 0 ? ch : ch.toUpperCase();
      }
      if (n) row += n;
      rows.push(row);
    }
    const st = E.state();
    const cs = (st.cast & 1 ? "K" : "") + (st.cast & 2 ? "Q" : "") + (st.cast & 4 ? "k" : "") + (st.cast & 8 ? "q" : "") || "-";
    return rows.join("/") + " " + (E.side() > 0 ? "w" : "b") + " " + cs + " " + (st.ep >= 0 ? uSq(st.ep) : "-") + " " + st.half + " " + full;
  }

  function uFindMove(token) {
    const want = token.toLowerCase(), L = E.legal();
    for (let i = 0; i < L.length; i++) if (E.str(L[i]) === want) return L[i];
    return 0;
  }

  // Membangun ulang posisi dari awal (FEN + semua langkah), seperti worker pada HTML asli.
  function uBuild(baseFen, moves) {
    const p = uParseFen(baseFen);
    E.setpos(p);
    if (E.attacked(E.kingOf(-E.side()), E.side())) throw new Error("posisi tidak valid: raja pihak yang tidak jalan sedang skak");
    let full = p.full;
    for (const tok of moves) {
      const m = uFindMove(tok);
      if (!m) throw new Error("langkah ilegal: " + tok);
      const wasBlack = E.side() < 0;
      E.make(m);
      if (wasBlack) full++;
    }
    return full;
  }

  function uSetPosition(tokens) {
    try {
      let base, i = 0;
      if (tokens[0] === "startpos") { base = U_START_FEN; i = 1 }
      else if (tokens[0] === "fen") {
        let j = 1; const fp = [];
        while (j < tokens.length && tokens[j] !== "moves") fp.push(tokens[j++]);
        base = fp.join(" "); i = j;
      } else throw new Error("position harus 'startpos' atau 'fen'");
      let moves = [];
      if (tokens[i] === "moves") moves = tokens.slice(i + 1);
      else if (i < tokens.length) throw new Error("token tak dikenal: " + tokens[i]);
      uBuild(base, moves);
      uBaseFen = base; uMoveList = moves.map(m => m.toLowerCase()); uPositionOk = true;
    } catch (e) {
      uPositionOk = false;
      uOut("info string ERROR: " + e.message);
    }
  }

  function uScore(v) {
    if (Math.abs(v) > U_MT) {
      const n = (U_MATE - Math.abs(v) + 1) >> 1;
      return "mate " + (v > 0 ? n : -n);
    }
    return "cp " + Math.round(v);
  }

  // Buku pembukaan milik mesin (di dalam search) hanya boleh aktif dari posisi awal standar.
  function uApplyBookPolicy() {
    const std = uBaseFen.trim().split(/\s+/).slice(0, 4).join(" ") === U_START_KEY;
    E.setNoBook(!(uOpts.OwnBook && std));
  }

  function uFinish(rec, bestMove) {
    if (uCur !== rec) return;
    if (rec.timer) { clearTimeout(rec.timer); rec.timer = null }
    uCur = null;
    uOut("bestmove " + bestMove);
  }

  function uInfoLine(r, best, t0) {
    const dt = Math.max(1, Date.now() - t0);
    return "info depth " + r.depth + " score " + uScore(r.score) + " nodes " + r.nodes + " nps " + Math.round(r.nodes * 1000 / dt) + " time " + dt + " pv " + best;
  }

  function uRunFinite(rec) {
    rec.timer = null;
    if (uCur !== rec) return;
    const t0 = Date.now(); let r;
    try { uBuild(uBaseFen, uMoveList); uApplyBookPolicy(); r = E.search(rec.ms) }
    catch (e) { uOut("info string ERROR: " + (e && e.message ? e.message : e)); uCur = null; uOut("bestmove 0000"); return }
    if (!r || !r.m) { uCur = null; uOut("bestmove 0000"); return }
    let best = E.str(r.m);
    if (rec.legalStr.indexOf(best) < 0) {
      uOut("info string WARNING: langkah mesin tidak ada di daftar legal; memakai langkah legal pertama");
      best = rec.legalStr[0];
    }
    if (r.book) uOut("info string buku pembukaan");
    else if (!r.depth) uOut("info string satu-satunya langkah legal");
    uOut(uInfoLine(r, best, t0));
    uFinish(rec, best);
  }

  function uRunSlice(rec) {
    rec.timer = null;
    if (uCur !== rec) return;
    const ms = Math.min(300 * Math.pow(2, rec.k++), 6000), t0 = Date.now();
    let r;
    try { uBuild(uBaseFen, uMoveList); E.setNoBook(true); r = E.search(ms) }
    catch (e) { uOut("info string ERROR: " + (e && e.message ? e.message : e)); uCur = null; uOut("bestmove 0000"); return }
    if (r && r.m) {
      const mv = E.str(r.m);
      if (rec.legalStr.indexOf(mv) >= 0) { rec.best = mv; if (r.depth) uOut(uInfoLine(r, mv, t0)) }
      if (!r.depth || Math.abs(r.score) > U_MT) return;      // langkah tunggal / mat: selesai, tunggu "stop"
    }
    rec.timer = setTimeout(() => uRunSlice(rec), 60);
  }

  function uGo(tokens) {
    if (uCur) { uOut("info string search already running"); return }
    if (!uPositionOk) { uOut("info string ERROR: posisi tidak valid"); uOut("bestmove 0000"); return }
    const lim = { infinite: false, depth: 0, movetime: -1, wtime: -1, btime: -1, winc: 0, binc: 0, movestogo: 0 };
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i], n = +tokens[i + 1];
      switch (t) {
        case "infinite": case "ponder": lim.infinite = true; break;
        case "depth": if (!isNaN(n)) lim.depth = n | 0; i++; break;
        case "movetime": if (!isNaN(n)) lim.movetime = Math.max(1, n); i++; break;
        case "wtime": case "btime": case "winc": case "binc": case "movestogo": if (!isNaN(n)) lim[t] = n; i++; break;
        default: break;
      }
    }
    let L;
    try { uBuild(uBaseFen, uMoveList); L = E.legal() }
    catch (e) { uPositionOk = false; uOut("info string ERROR: " + e.message); uOut("bestmove 0000"); return }
    if (!L.length) { uOut("bestmove 0000"); return }
    const legalStr = L.map(m => E.str(m));
    const rec = { timer: null, legalStr, best: legalStr[0], k: 0, infinite: lim.infinite, ms: 0 };
    if (lim.infinite) {
      uCur = rec; uOut("info string Asep mulai menganalisis");
      rec.timer = setTimeout(() => uRunSlice(rec), 0);
      return;
    }
    let ms;
    const stm = E.side();
    if (lim.movetime > 0) ms = lim.movetime;
    else if ((stm > 0 ? lim.wtime : lim.btime) >= 0) {
      const my = stm > 0 ? lim.wtime : lim.btime, inc = stm > 0 ? lim.winc : lim.binc;
      const share = my / (lim.movestogo > 0 ? Math.min(lim.movestogo, 40) : 30) + inc * 0.75;
      ms = Math.max(30, Math.min(share, Math.max(30, my - 50)));
    } else {
      if (lim.depth) uOut("info string batas kedalaman tidak didukung mesin ini; memakai waktu " + uOpts.ThinkTime + " ms");
      ms = uOpts.ThinkTime;
    }
    rec.ms = ms; uCur = rec;
    uOut("info string Asep mulai mencari (maks. " + Math.round(ms) + " ms)");
    rec.timer = setTimeout(() => uRunFinite(rec), 0);
  }

  function uStop() {
    if (!uCur) return;
    const rec = uCur;
    if (rec.timer) { clearTimeout(rec.timer); rec.timer = null }
    uFinish(rec, rec.best);
  }

  function uPerft(d) {
    if (d === 0) return 1;
    const L = E.legal();
    if (d === 1) return L.length;
    let n = 0;
    for (const m of L) { E.make(m); n += uPerft(d - 1); E.unmake() }
    return n;
  }

  function uNewGame() {
    uStop();
    E.newgame();   // kosongkan tabel transposisi (setara worker baru)
    uBaseFen = U_START_FEN; uMoveList = []; uPositionOk = true;
  }

  function uSetOption(tokens) {
    const vi = tokens.indexOf("value");
    const name = tokens.slice(tokens[0] === "name" ? 1 : 0, vi < 0 ? tokens.length : vi).join(" ").toLowerCase();
    const value = vi < 0 ? "" : tokens.slice(vi + 1).join(" ");
    if (name === "thinktime") { const v = parseInt(value, 10); if (!isNaN(v)) uOpts.ThinkTime = Math.max(50, Math.min(60000, v)) }
    else if (name === "ownbook") uOpts.OwnBook = value.toLowerCase() === "true";
    else if (name === "clear hash") E.newgame();
    else uOut("info string option tidak dikenal: " + name);
  }

  function command(line) {
    if (uQuit) return;
    for (const l of String(line).split(/\r?\n/)) {
      const tokens = l.trim().split(/\s+/).filter(Boolean);
      if (!tokens.length) continue;
      const cmd = tokens[0], rest = tokens.slice(1);
      switch (cmd) {
        case "uci":
          uOut("id name " + U_NAME);
          uOut("id author " + U_AUTHOR);
          uOut("option name ThinkTime type spin default " + U_DEFAULT_MOVETIME + " min 50 max 60000");
          uOut("option name OwnBook type check default true");
          uOut("option name Clear Hash type button");
          uOut("uciok"); break;
        case "isready": uOut("readyok"); break;
        case "ucinewgame": uNewGame(); break;
        case "setoption": uSetOption(rest); break;
        case "position": if (uCur) uStop(); uSetPosition(rest); break;
        case "go":
          if (rest[0] === "perft") {
            const d = Math.max(1, parseInt(rest[1], 10) || 1);
            try { uBuild(uBaseFen, uMoveList); uOut("info string perft " + d + " " + uPerft(d)) }
            catch (e) { uOut("info string ERROR: " + e.message) }
            break;
          }
          uGo(rest); break;
        case "stop": uStop(); break;
        case "ponderhit": break;
        case "d":
          try { const full = uBuild(uBaseFen, uMoveList); uOut("info string fen " + uToFen(full)); uOut("info string key " + E.state().key) }
          catch (e) { uOut("info string ERROR: " + e.message) }
          break;
        case "quit": uStop(); uQuit = true; break;
        default: uOut("info string perintah tidak dikenal: " + cmd);
      }
    }
  }

  return { command, isSearching: () => !!uCur, name: U_NAME };

}

global.AsepUCI = { create: createAsepUci };
if (typeof module === "object" && module && module.exports) module.exports = global.AsepUCI;

if (typeof WorkerGlobalScope !== "undefined" && typeof self !== "undefined" && self instanceof WorkerGlobalScope && !self.ASEP_UCI_EMBEDDED) {
  const eng = createAsepUci(line => self.postMessage(line));
  self.onmessage = e => { try { eng.command(String(e.data)) } catch (err) { self.postMessage("info string ERROR: " + (err && err.message ? err.message : err)) } };
}

})(typeof self !== "undefined" ? self : globalThis);
