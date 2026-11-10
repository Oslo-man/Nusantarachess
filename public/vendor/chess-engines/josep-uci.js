"use strict";
/* =====================================================================
   Josep — Elo 2250 — mesin catur + protokol UCI
   ---------------------------------------------------------------------
   SUMBER MESIN: Mesin_Catur_Buatan_Sendiri.html
   Bagian berjudul "MESIN" di bawah adalah isi <script id="eng"> dari HTML
   tersebut, disalin BARIS PER BARIS tanpa perubahan (representasi 0x88,
   PVS + aspiration window, iterative deepening, tabel transposisi,
   null-move, LMR, SEE, evaluasi tapered, dst.). Algoritma pencarian dan
   evaluasi TIDAK diubah. Yang tidak dibawa dari HTML: seluruh kode UI/DOM
   (papan klik, tombol, riwayat, undo, pilihan tingkat) dan pembungkus
   Worker milik HTML (diganti adaptor josep.js).

   Mengapa perlu lapisan UCI baru: mesin asli TIDAK kompatibel UCI. Ia
   hanya punya reset() ke posisi awal, make()/unmake() pada langkah
   terenkode, dan think(ms, kedalaman) yang mengembalikan {m, s, d, n};
   tidak ada pemuat FEN. Lapisan UCI (di bawah mesin) menambahkan:
     uci, isready, ucinewgame, setoption, position (startpos|fen ... moves ...),
     go (movetime, depth, wtime/btime/winc/binc/movestogo, infinite),
     stop, quit, ekstensi debug: d, go perft N.
   Balasan: id, option, uciok, readyok, info depth/score/nodes/nps/time/pv,
   bestmove.

   Catatan perilaku:
     - think() bersifat sinkron (tidak bisa diinterupsi di tengah). "stop"
       pada pencarian berbatas waktu baru diproses setelah pencarian itu
       selesai (maks. ~2,3 dtk). "go infinite" dijalankan per irisan waktu
       (300 ms, 600 ms, ... maks. 6 dtk) agar "stop" bisa diproses.
     - "go movetime N" dan "go" polos memakai seluruh N ms (berhenti lebih awal
       hanya jika ketemu mat atau mencapai kedalaman maks.). Waktu bawaan "go"
       polos: 2300 ms, kedalaman 14 (pasangan tingkat "Kuat" HTML asli). Buku pembukaan HTML dipakai untuk posisi awal
       standar (opsi OwnBook, bawaan aktif).
     - Pencarian dipanggil hanya saat dibutuhkan: tidak untuk langkah buku
       dan tidak untuk posisi dengan satu langkah legal.

   Dipakai dua cara:
     1) langsung sebagai Web Worker UCI murni
          w = new Worker("vendor/chess-engines/josep-uci.js");
          w.postMessage("uci"); // -> "id name ...", "uciok"
     2) lewat josep.js (adaptor protokol bot NusantaraChess) yang
        meng-importScripts berkas ini dan berbicara UCI dengannya.
   ===================================================================== */
(function (global) {

function createJosepUci(emit) {

  /* ===================================================================
     MESIN  (dari Mesin_Catur_Buatan_Sendiri.html, <script id="eng">)
     Disalin tanpa perubahan.
     =================================================================== */
const MATE=30000,INF=32000,VAL=[0,100,320,330,500,900,0];
const b=new Int8Array(128),cm=new Uint8Array(128).fill(15);
cm[0]=13;cm[4]=12;cm[7]=14;cm[112]=7;cm[116]=3;cm[119]=11;
let side=0,castle=15,ep=-1,half=0,sp=0,h1=0,h2=0;const ksq=[4,116];
const sCp=new Int8Array(4096),sCa=new Int8Array(4096),sEp=new Int16Array(4096),sHf=new Int16Array(4096),hh1=new Int32Array(4096),hh2=new Int32Array(4096);
let rs=0x9e3779b9;const rn=()=>{rs^=rs<<13;rs^=rs>>>17;rs^=rs<<5;return rs|0};
const Z1=new Int32Array(2048),Z2=new Int32Array(2048),C1=new Int32Array(16),C2=new Int32Array(16);
for(let i=0;i<2048;i++){Z1[i]=rn();Z2[i]=rn()}for(let i=0;i<16;i++){C1[i]=rn();C2[i]=rn()}
const SD1=rn(),SD2=rn();
const xp=(p,s)=>{const i=p<<7|s;h1^=Z1[i];h2^=Z2[i]};
function reset(){b.fill(0);const bk=[4,2,3,5,6,3,2,4];
 for(let f=0;f<8;f++){b[f]=bk[f];b[16+f]=1;b[96+f]=9;b[112+f]=8|bk[f]}
 side=0;castle=15;ep=-1;half=0;sp=0;ksq[0]=4;ksq[1]=116;h1=h2=0;
 for(let s=0;s<128;s++)if(!(s&136)&&b[s])xp(b[s],s);
 h1^=C1[15];h2^=C2[15];hh1[0]=h1;hh2[0]=h2}
const ND=[33,31,18,14,-33,-31,-18,-14],KD=[1,-1,16,-16,15,-15,17,-17],BD=[15,17,-15,-17],RD=[1,-1,16,-16];
function att(s,c){const o=c<<3;let t=c?s+15:s-15;if(!(t&136)&&b[t]==(o|1))return 1;
 t=c?s+17:s-17;if(!(t&136)&&b[t]==(o|1))return 1;
 for(let i=0;i<8;i++){t=s+ND[i];if(!(t&136)&&b[t]==(o|2))return 1;t=s+KD[i];if(!(t&136)&&b[t]==(o|6))return 1}
 for(let i=0;i<4;i++){let d=BD[i];t=s+d;while(!(t&136)){const p=b[t];if(p){if(p==(o|3)||p==(o|5))return 1;break}t+=d}
  d=RD[i];t=s+d;while(!(t&136)){const p=b[t];if(p){if(p==(o|4)||p==(o|5))return 1;break}t+=d}}
 return 0}
let gL,gS,gn=0,gtt=0,gpl=0;
const mv=[],sc=[];for(let i=0;i<72;i++){mv.push(new Int32Array(256));sc.push(new Int32Array(256))}
const k1=new Int32Array(72),k2=new Int32Array(72),hist=new Int32Array(2048),cmv=new Int32Array(2048),pmv=new Int32Array(72),ch1=new Int16Array(589824),ch2=new Int16Array(589824),cpk=new Int16Array(72).fill(-1),qtm=new Int32Array(4608),PI=new Int16Array(2048);let ckey=0,cp1=-1,cp2=-1;
for(let q=1;q<15;q++)if((q&7)>0&&(q&7)<7)for(let s=0;s<128;s++)if(!(s&136))PI[q<<7|s]=(((q&7)-1+6*(q>>3))<<6)|((s&7)|(s>>4)<<3);
function upd(a,i,bn){const v=a[i];a[i]=v+bn-((v*(bn<0?-bn:bn)/16384)|0)}
function add(f,t,pr,s){const m=f|t<<8|pr<<16;gL[gn]=m;
 if(s<0){const x=(b[f]<<7)|t,y=PI[x];s=hist[x];if(cp1>=0)s+=ch1[cp1*768+y];if(cp2>=0)s+=ch2[cp2*768+y];if(m==k1[gpl])s=900000;else if(m==k2[gpl])s=800000;else if(m==cmv[ckey])s=700000}
 if(m==gtt)s=2000000;gS[gn++]=s}
function gen(pl,qo){gpl=pl;gL=mv[pl];gS=sc[pl];gn=0;const S=side,o=S?-16:16,pr7=S?1:6,st=S?6:1;
 for(let s=0;s<120;s++){if(s&136)continue;const p=b[s];if(!p||(p>>3)!=S)continue;const t=p&7,r=s>>4;
  if(t==1){let to=s+o;
   if(!b[to]){if(r==pr7){add(s,to,5,1500000);if(!qo)for(let q=4;q>1;q--)add(s,to,q,-1)}
    else if(!qo){add(s,to,0,-1);if(r==st&&!b[to+o])add(s,to+o,0,-1)}}
   for(let dd=-1;dd<=1;dd+=2){to=s+o+dd;if(to&136)continue;const q=b[to];
    if(q&&(q>>3)!=S){const cs=1000000+(VAL[q&7]<<4)-1;
     if(r==pr7){add(s,to,5,cs+500000);if(!qo)for(let z=4;z>1;z--)add(s,to,z,cs-900000)}else add(s,to,0,cs)}
    else if(!q&&to==ep)add(s,to,0,1000000+1599)}}
  else if(t==2||t==6){const D=t==2?ND:KD;
   for(let i=0;i<8;i++){const to=s+D[i];if(to&136)continue;const q=b[to];
    if(!q){if(!qo)add(s,to,0,-1)}else if((q>>3)!=S)add(s,to,0,1000000+(VAL[q&7]<<4)-t)}
   if(t==6&&!qo){
    if(S==0&&s==4){if((castle&1)&&!b[5]&&!b[6]&&!att(4,1)&&!att(5,1)&&!att(6,1))add(4,6,0,-1);
     if((castle&2)&&!b[3]&&!b[2]&&!b[1]&&!att(4,1)&&!att(3,1)&&!att(2,1))add(4,2,0,-1)}
    if(S==1&&s==116){if((castle&4)&&!b[117]&&!b[118]&&!att(116,0)&&!att(117,0)&&!att(118,0))add(116,118,0,-1);
     if((castle&8)&&!b[115]&&!b[114]&&!b[113]&&!att(116,0)&&!att(115,0)&&!att(114,0))add(116,114,0,-1)}}}
  else{const D=t==3?BD:t==4?RD:KD,n=t==5?8:4;
   for(let i=0;i<n;i++){const d=D[i];let to=s+d;
    while(!(to&136)){const q=b[to];if(!q){if(!qo)add(s,to,0,-1)}else{if((q>>3)!=S)add(s,to,0,1000000+(VAL[q&7]<<4)-t);break}to+=d}}}}
 return gn}
function make(m){const f=m&255,t=m>>8&255,pr=m>>16,p=b[f],T=p&7;let cp=b[t],nep=-1;
 sCp[sp]=cp;sCa[sp]=castle;sEp[sp]=ep;sHf[sp]=half;
 h1^=SD1;h2^=SD2;if(ep>=0){h1^=Z1[ep];h2^=Z2[ep]}h1^=C1[castle];h2^=C2[castle];
 half++;xp(p,f);b[f]=0;let np=p;
 if(cp){xp(cp,t);half=0}
 if(T==1){half=0;if(t==ep&&!cp){const cs=t+(side?16:-16);xp(b[cs],cs);b[cs]=0}
  if(pr)np=side<<3|pr;else if(t-f==32||f-t==32)nep=(f+t)>>1}
 else if(T==6){ksq[side]=t;
  if(t-f==2){const r=b[f+3];xp(r,f+3);b[f+3]=0;b[f+1]=r;xp(r,f+1)}
  else if(f-t==2){const r=b[f-4];xp(r,f-4);b[f-4]=0;b[f-1]=r;xp(r,f-1)}}
 b[t]=np;xp(np,t);castle&=cm[f]&cm[t];h1^=C1[castle];h2^=C2[castle];
 ep=nep;if(ep>=0){h1^=Z1[ep];h2^=Z2[ep]}
 side^=1;sp++;hh1[sp]=h1;hh2[sp]=h2}
function unmake(m){sp--;side^=1;const f=m&255,t=m>>8&255,pr=m>>16;let p=b[t];const cp=sCp[sp];
 if(pr)p=side<<3|1;b[f]=p;b[t]=cp;
 if((p&7)==1&&!cp&&t==sEp[sp]){b[t]=0;b[t+(side?16:-16)]=(side^1)<<3|1}
 else if((p&7)==6){ksq[side]=f;if(t-f==2){b[f+3]=b[f+1];b[f+1]=0}else if(f-t==2){b[f-4]=b[f-1];b[f-1]=0}}
 castle=sCa[sp];ep=sEp[sp];half=sHf[sp];h1=hh1[sp];h2=hh2[sp]}
function mkNull(){sEp[sp]=ep;sHf[sp]=half;h1^=SD1;h2^=SD2;if(ep>=0){h1^=Z1[ep];h2^=Z2[ep]}ep=-1;half=0;side^=1;sp++;hh1[sp]=h1;hh2[sp]=h2}
function unNull(){sp--;side^=1;ep=sEp[sp];half=sHf[sp];h1=hh1[sp];h2=hh2[sp]}
function legal(){gtt=0;const n=gen(0,0),L=mv[0],r=[];
 for(let i=0;i<n;i++){const m=L[i];make(m);if(!att(ksq[side^1],side))r.push(m);unmake(m)}return r}
// ---- evaluasi ----
const PH=[0,0,1,1,2,4,0],PP=[0,0,10,20,40,70,120,0];
const PMX=new Int8Array(10),PMN=new Int8Array(10),PC=[new Int8Array(10),new Int8Array(10)],ps=new Int16Array(20),rl=new Int16Array(24);
const pa=[new Uint16Array(128),new Uint16Array(128)],kz=[null,null],KZT=[[],[]],MW=[0,0],NQ=[0,0],NR=[0,0],NNn=[0,0],ku=[0,0],kn=[0,0],KW=[0,0,3,3,4,6];let zh=0,pst=0;
// Material MG/EG terpisah + PST per bidak (tapered). Tabel setengah papan a-d, baris peringkat 1..8 dari sisi pemilik;
// disimpan penuh per warna: indeks c<<10|t<<7|petak.
const PGT=new Int16Array(2048),PGE=new Int16Array(2048);
(function(){
 const MGV=[0,82,322,335,485,925,0],EGV=[0,94,306,328,520,965,0];
 const HM=[null,
  [0,0,0,0, -2,0,0,-8, 0,2,5,12, 4,6,12,26, 14,16,22,34, 30,32,38,46, 52,54,58,62, 0,0,0,0],
  [-40,-32,-24,-24, -32,-16,0,4, -24,4,8,12, -24,0,12,16, -24,4,12,16, -24,0,8,12, -32,-16,0,0, -40,-32,-24,-24],
  [-16,-8,-8,-8, -8,4,0,0, -8,8,8,8, -8,0,8,8, -8,4,4,8, -8,0,4,8, -8,0,0,0, -16,-8,-8,-8],
  [-3,-1,2,6, -6,0,0,0, -6,0,0,0, -6,0,0,0, -6,0,0,0, -6,0,0,0, 4,8,8,8, 0,0,2,4],
  [-16,-8,-8,-4, -8,0,4,0, -8,4,4,4, -2,0,4,4, -4,0,4,4, -8,0,4,4, -8,0,0,0, -16,-8,-8,-4],
  [18,26,10,0, 18,18,0,0, -9,-18,-18,-18, -18,-27,-27,-36, -27,-36,-36,-45, -27,-36,-36,-45, -27,-36,-36,-45, -27,-36,-36,-45]];
 const HE=[null,
  [0,0,0,0, 0,0,0,0, 6,6,7,8, 16,16,17,18, 34,34,35,36, 62,62,63,64, 100,100,101,102, 0,0,0,0],
  [-45,-34,-24,-18, -34,-18,-6,0, -24,-6,8,14, -18,0,14,20, -18,0,14,20, -24,-6,8,14, -34,-18,-6,0, -45,-34,-24,-18],
  [-14,-8,-8,-8, -8,0,0,2, -8,0,4,6, -8,2,6,8, -8,2,6,8, -8,0,4,6, -8,0,0,2, -14,-8,-8,-8],
  [-4,-2,0,0, -2,0,2,2, -2,0,2,2, -2,0,2,2, -2,0,2,2, 0,2,4,4, 4,6,8,8, 0,2,4,4],
  [-24,-16,-12,-8, -16,-8,-2,2, -12,-2,6,10, -8,2,10,14, -8,2,10,14, -12,-2,6,10, -16,-8,-2,2, -24,-16,-12,-8],
  [-36,-24,-18,-12, -24,-8,0,6, -18,0,14,22, -12,6,22,30, -12,6,22,30, -18,0,14,22, -24,-8,0,6, -36,-24,-18,-12]];
 for(let t=1;t<7;t++)for(let c=0;c<2;c++)for(let rr=0;rr<8;rr++)for(let f=0;f<8;f++){
  const x=f<4?f:7-f,r=c?7-rr:rr,i=c<<10|t<<7|(rr<<4|f);
  PGT[i]=(t<6?MGV[t]:0)+HM[t][r*4+x];PGE[i]=(t<6?EGV[t]:0)+HE[t][r*4+x]}
})();
// pion terhubung: bonus naik per rank (indeks = rank relatif 0..7). SU = didukung pion di belakang, PHL = berdampingan (phalanx)
const SUM=[0,0,3,5,8,13,22,0],SUE=[0,0,4,6,10,17,30,0],PHM=[0,2,3,5,8,13,22,0],PHE=[0,2,4,7,12,20,34,0];
const pcl=new Int8Array(4);
const pcn=[0,0];
const passL=new Int16Array(16);let pgM=0,pgE=0,pgN=0;
// pawn hash: kunci 2x32 bit dari Zobrist bidak pion; menyimpan skor struktur statis + daftar pion bebas
let pk1=0,pk2=0;const PHM_=(1<<14)-1,phK1=new Int32Array(PHM_+1),phK2=new Int32Array(PHM_+1),phM=new Int16Array(PHM_+1),phE=new Int16Array(PHM_+1),phN=new Uint8Array(PHM_+1),phP=new Uint8Array((PHM_+1)<<4);
for(let c=0;c<2;c++)for(let ks=0;ks<128;ks++){if(ks&136)continue;const K=new Uint8Array(128),o=c?-16:16;
 for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const q=ks+dy*16+dx;if(!(q&136))K[q]=1}
 for(let dx=-1;dx<=1;dx++){const q=ks+2*o+dx;if(!(q&136))K[q]=1}
 KZT[c][ks]=K}
function md(a,c){let x=(a&7)-(c&7),y=(a>>4)-(c>>4);return(x<0?-x:x)+(y<0?-y:y)}
function cd(a,c){let x=(a&7)-(c&7),y=(a>>4)-(c>>4);if(x<0)x=-x;if(y<0)y=-y;return x>y?x:y}
function mob(s,t,c){let n=0;zh=0;
 const D=t==2?ND:t==3?BD:t==4?RD:KD,k=t==2||t==5?8:4,PA=pa[c^1],KZ=kz[c^1];
 for(let i=0;i<k;i++){const d=D[i];let q=s+d;
  if(t==2){if(!(q&136)){const p=b[q];if((!p||(p>>3)!=c)&&PA[q]!=pst)n++;if(KZ[q])zh++}}
  else while(!(q&136)){const p=b[q];if(!p){if(PA[q]!=pst)n++;if(KZ[q])zh++}else{if((p>>3)!=c&&PA[q]!=pst)n++;if(KZ[q])zh++;break}q+=d}}
 return n}
const EM=(1<<18)-1,ek=new Int32Array(EM+1),evl=new Int16Array(EM+1);
const pcs=new Int16Array(32),bcol=[0,0],sev=new Int16Array(72),TW=[0,0,3,2,3,5];let npc=0,lz=0,excl=0;
function ev(a,bt){const i=h1&EM;if(ek[i]==h2)return evl[i];lz=0;const v=ev0(a===undefined?-INF:a,bt===undefined?INF:bt);if(!lz){ek[i]=h2;evl[i]=v}return v}
// struktur pion statis: hanya bergantung pada letak pion (aman untuk pawn hash)
function pawnStruct(np){let mg=0,eg=0,n=0;
 for(let i=0;i<np;i++){const s=ps[i],c=b[s]>>3,f=s&7,rr=s>>4,r=c?7-rr:rr,g=c?-1:1,P=PC[c],o=c?-16:16,pw=c<<3|1;
  const sup=b[s-o+1]==pw||b[s-o-1]==pw,pha=f<7&&b[s+1]==pw;
  if(sup){mg+=g*SUM[r];eg+=g*SUE[r]}
  if(pha){mg+=g*PHM[r];eg+=g*PHE[r]}
  if(P[f+1]>1){mg-=g*8;eg-=g*12}
  if(!P[f]&&!P[f+2]){mg-=g*10;eg-=g*10}
  else if(!(c?(PMX[f]>=rr||PMX[f+2]>=rr):(PMN[f]<=rr||PMN[f+2]<=rr))){
   // pion terbelakang: tak ada pion kawan sejajar/di belakang pada kolom tetangga, petak depan diserang pion lawan
   const ew=(c^1)<<3|1,q1=s+2*o-1,q2=s+2*o+1;
   if((!(q1&136)&&b[q1]==ew)||(!(q2&136)&&b[q2]==ew)){mg-=g*6;eg-=g*8;if(!PC[c^1][f+1]){mg-=g*4;eg-=g*2}}}
  const pass=c?(PMN[f]>=rr&&PMN[f+1]>=rr&&PMN[f+2]>=rr):(PMX[f]<=rr&&PMX[f+1]<=rr&&PMX[f+2]<=rr);
  if(pass){mg+=g*(PP[r]>>1);eg+=g*PP[r];if(r>=2)passL[n++]=s}}
 pgM=mg;pgE=eg;pgN=n}
function ev0(a,bt){npc=0;let mg=0,eg=0,ph=0,pn=0,rc=0,bb0=0,bb1=0,mt=0;
 PC[0].fill(0);PC[1].fill(0);PMX.fill(-1);PMN.fill(9);MW[0]=MW[1]=NQ[0]=NQ[1]=NR[0]=NR[1]=NNn[0]=NNn[1]=0;
 pcl.fill(0);
 pcn[0]=pcn[1]=0;
 pk1=pk2=0;
 for(let s=0;s<120;s++){if(s&136)continue;const p=b[s];if(!p)continue;
  const c=p>>3,t=p&7,f=s&7,rr=s>>4,ix=c<<10|t<<7|s,m=PGT[ix],e=PGE[ix];
  if(t==1){
   if(pn<20)ps[pn]=s;pn++;PC[c][f+1]++;
   pcl[c<<1|((f+rr)&1)]++;
   pcn[c]++;
   pk1^=Z1[p<<7|s];pk2^=Z2[p<<7|s];
   if(c){if(rr>PMX[f+1])PMX[f+1]=rr}else if(rr<PMN[f+1])PMN[f+1]=rr}
  else{ph+=PH[t];mt+=VAL[t];MW[c]+=VAL[t];if(t<6)pcs[npc++]=s;
   if(t==2)NNn[c]++;
   else if(t==3){bcol[c]=(f+rr)&1;if(c)bb1++;else bb0++}
   else if(t==4){NR[c]++;if(rc<24)rl[rc++]=s}
   else if(t==5)NQ[c]++}
  if(c){mg-=m;eg-=e}else{mg+=m;eg+=e}}
 if(!pn&&mt<=330)return 0;
 if(ph>4&&pcn[0]&&pcn[1]){const q=ph>24?24:ph,w=((mg*q+eg*(24-q))/24)|0,x=(side?-w:w)+8;if(x+260<=a||x-260>=bt){lz=1;return x}}
 const np=pn>20?20:pn;if(++pst>65534){pa[0].fill(0);pa[1].fill(0);pst=1}
 for(let i=0;i<np;i++){const s=ps[i],c=b[s]>>3,o=c?-16:16;let q=s+o-1;if(!(q&136))pa[c][q]=pst;q=s+o+1;if(!(q&136))pa[c][q]=pst}
 {const hi=pk1&PHM_;
  if(pn&&phK1[hi]==pk1&&phK2[hi]==pk2){pgM=phM[hi];pgE=phE[hi];pgN=phN[hi];const o=hi<<4;for(let k=0;k<pgN;k++)passL[k]=phP[o+k]}
  else{pawnStruct(np);if(pn){phK1[hi]=pk1;phK2[hi]=pk2;phM[hi]=pgM;phE[hi]=pgE;phN[hi]=pgN;const o=hi<<4;for(let k=0;k<pgN;k++)phP[o+k]=passL[k]}}}
 mg+=pgM;eg+=pgE;
 // pion bebas: suku dinamis (jarak raja, aturan kotak, terblokir) bergantung pada raja dan bidak
 for(let k=0;k<pgN;k++){const s=passL[k],c=b[s]>>3,f=s&7,rr=s>>4,r=c?7-rr:rr,g=c?-1:1,o=c?-16:16;
  const st=s+o,ke=ksq[c^1],km=ksq[c],de=cd(ke,st),dm=cd(km,st);
  eg+=g*(((de*4-dm*2)*(r-1))>>2);
  if(b[st])eg-=g*(PP[r]>>2);
  else if(!MW[c^1]){let free=1;for(let q=st;!(q&136);q+=o)if(b[q]){free=0;break}
   if(free){const steps=7-r-(r==1?1:0),dk=cd(ke,f|(c?0:112));if(dk-(side==(c^1)?1:0)>steps)eg+=g*(350+30*r)}}}
 for(let i=0;i<rc;i++){const s=rl[i],c=b[s]>>3,f=s&7,g=c?-1:1,r=c?7-(s>>4):s>>4;let x=0;
  if(!PC[c][f+1]){x+=14;if(!PC[c^1][f+1])x+=10}if(r==6)x+=16;mg+=g*x;eg+=g*(x>>1)}
 if(bb0>1){mg+=25;eg+=40}if(bb1>1){mg-=25;eg-=40}
 // gajah buruk: pion sendiri di warna petak yang sama dengan gajah; penalti mulai dari lebih dari 3 pion
 for(let i=0;i<npc;i++){const s=pcs[i],p=b[s];if((p&7)!=3)continue;const c=p>>3,n=pcl[c<<1|(((s&7)+(s>>4))&1)];
  if(n>3){const x=n-3,g=c?-1:1;mg-=g*x*5;eg-=g*x*8}}
 for(let c=0;c<2;c++){const ks=ksq[c],o=c?-16:16,fk=ks&7,g=c?-1:1,pw=c<<3|1;let sh=0;
  for(let d=-1;d<=1;d++){let q=ks+o+d;if(!(q&136)&&b[q]==pw)sh+=2;else{q+=o;if(!(q&136)&&b[q]==pw)sh++}}
  mg+=g*sh*7;
  if(NQ[c^1]+NR[c^1]){let pe=0;for(let df=-1;df<=1;df++){const ff=fk+df;if(ff<0||ff>7)continue;if(!PC[c][ff+1]){pe+=10;if(!PC[c^1][ff+1])pe+=8}}mg-=g*pe}}
 if(ph>4&&pcn[0]&&pcn[1]){const q=ph>24?24:ph,w=((mg*q+eg*(24-q))/24)|0,x=(side?-w:w)+8;if(x+130<=a||x-130>=bt){lz=1;return x}}
 kz[0]=KZT[0][ksq[0]];kz[1]=KZT[1][ksq[1]];
 ku[0]=ku[1]=kn[0]=kn[1]=0;
 for(let i=0;i<npc;i++){const s=pcs[i],p=b[s],c=p>>3,t=p&7,g=c?-1:1,mo=mob(s,t,c),f=s&7,rr=s>>4,k=ksq[c^1],dd=Math.max(Math.abs(f-(k&7)),Math.abs(rr-(k>>4)));let x=0,y=0;
  if(zh){ku[c]+=zh*KW[t];kn[c]++}
  if(t==2){x=y=4*(mo-4);const r=c?7-rr:rr;if(r>=3&&r<=5&&(c?PMN[f]>=rr&&PMN[f+2]>=rr:PMX[f]<=rr&&PMX[f+2]<=rr)){const o=c?-16:16;if(b[s-o+1]==(c<<3|1)||b[s-o-1]==(c<<3|1)){x+=18;y+=8}}}
  else if(t==3)x=y=3*(mo-6);else if(t==4){x=2*(mo-6);y=4*(mo-6)}else x=y=(mo-14)>>1;
  if(dd<4)x+=(4-dd)*TW[t];mg+=g*x;eg+=g*y}
 for(let c=0;c<2;c++)if(kn[c]>=2){let u=ku[c];if(!NQ[c])u>>=1;const pe=(u*u)>>3;mg+=(c?-1:1)*(pe>300?300:pe)}
 if(mt==660&&bb0==1&&bb1==1&&bcol[0]!=bcol[1])eg=(eg/2)|0;
 let kb=-1,kx=-1;
 if(!pn){const d=MW[0]-MW[1],ad=d<0?-d:d,L=d>0?0:1;
  if(ad==VAL[2]+VAL[3]&&MW[L^1]==0&&NNn[L]==1)kb=L;
  else if(MW[L^1]==0&&(MW[L]==VAL[5]||MW[L]==VAL[4]))kx=L;
  else if(ad<=330)eg=(eg/8)|0;
  else if(ad==2*VAL[2]&&NNn[L]==2&&MW[L^1]==0)eg=(eg/16)|0}
 else if(ph<=14){
  // sisi unggul tanpa pion hanya unggul satu bidak ringan (lawan masih punya pion): skor diturunkan ke 1/4
  const L=eg>0?0:1,dN=MW[L]-MW[L^1];
  if(!pcn[L]&&dN>0&&dN<=330){mg=(mg/4)|0;eg=(eg/4)|0}}
 if(kb>=0){const lk=ksq[kb^1],wk=ksq[kb],bc=bcol[kb],dR=Math.min(md(lk,bc?112:0),md(lk,bc?7:119)),lf=lk&7,lr=lk>>4,ed=Math.min(lf,7-lf,lr,7-lr);eg+=(kb?-1:1)*(20*(14-dR)-25*ed+5*(14-md(lk,wk)))}
 else if(kx>=0){
  // KQK / KRK: dorong raja lawan ke tepi, dekatkan raja sendiri
  const lk=ksq[kx^1],wk=ksq[kx],lf=lk&7,lr=lk>>4,ed=Math.min(lf,7-lf,lr,7-lr);
  eg+=(kx?-1:1)*((3-ed)*40+(7-cd(lk,wk))*20)}
 else if(ph<=10&&(eg>200||eg<-200)){const L=eg>0?1:0,k=ksq[L],kw=ksq[L^1],cn=((k&7)<4?(k&7):7-(k&7))+((k>>4)<4?(k>>4):7-(k>>4)),dk=Math.abs((k&7)-(kw&7))+Math.abs((k>>4)-(kw>>4));eg+=(L?1:-1)*((6-cn)*8+(14-dk)*3)}
 if(ph>24)ph=24;const v=((mg*ph+eg*(24-ph))/24)|0;return(side?-v:v)+8}
function npMat(c){let n=0;for(let s=0;s<120;s++){if(s&136)continue;const p=b[s];if(p&&(p>>3)==c){const t=p&7;if(t>1&&t<6)n+=VAL[t]}}return n}
function hasNP(c){for(let s=0;s<120;s++){if(s&136)continue;const p=b[s];if(p&&(p>>3)==c){const t=p&7;if(t>1&&t<6)return 1}}return 0}
// ---- pencarian ----
const TM=(1<<21)-1,tk=new Int32Array(TM+1),td=new Int8Array(TM+1),tfl=new Int8Array(TM+1),tv=new Int16Array(TM+1),tmv=new Int32Array(TM+1),tg=new Uint8Array(TM+1);let gen8=0;
const LR=[];for(let d=0;d<64;d++){LR.push(new Int8Array(64));for(let l=1;l<64;l++)LR[d][l]=d?Math.floor(.6+Math.log(d)*Math.log(l)/2.2):0}
let nodes=0,tEnd=0,stop=0,rootBest=0;
function rep(){for(let i=sp-2;i>=0&&i>=sp-half;i-=2)if(hh1[i]==h1&&hh2[i]==h2)return 1;return 0}
function pick(L,S,i,n){let bj=i,bs=S[i];for(let j=i+1;j<n;j++)if(S[j]>bs){bs=S[j];bj=j}
 if(bj!=i){let x=L[i];L[i]=L[bj];L[bj]=x;x=S[i];S[i]=S[bj];S[bj]=x}return L[i]}
const SV=[0,100,320,330,500,900,20000];
function lva(s,c){const o=c<<3;let t=c?s+15:s-15;if(!(t&136)&&b[t]==(o|1))return t;t=c?s+17:s-17;if(!(t&136)&&b[t]==(o|1))return t;
 for(let i=0;i<8;i++){t=s+ND[i];if(!(t&136)&&b[t]==(o|2))return t}
 let r=-1,rv=9;
 for(let i=0;i<8;i++){const d=i<4?BD[i]:RD[i-4];t=s+d;while(!(t&136)){const p=b[t];if(p){const y=p&7;if((p>>3)==c&&(i<4?(y==3||y==5):(y==4||y==5))&&y<rv){rv=y;r=t}break}t+=d}}
 if(r>=0)return r;
 for(let i=0;i<8;i++){t=s+KD[i];if(!(t&136)&&b[t]==(o|6))return t}return -1}
const seA=new Int16Array(80),seP=new Int8Array(80),seG=new Int32Array(40);
function see(m){const f=m&255,t=m>>8&255,p=b[f],q=b[t];let n=2;seA[0]=f;seP[0]=p;seA[1]=t;seP[1]=q;
 seG[0]=q?SV[q&7]:((p&7)==1&&((f^t)&7)?100:0);let c=p>>3,d=0,pv=SV[p&7];
 b[f]=0;b[t]=p;
 for(;;){c^=1;const a=lva(t,c);if(a<0)break;d++;seG[d]=pv-seG[d-1];pv=SV[b[a]&7];seA[n]=a;seP[n]=b[a];n++;b[t]=b[a];b[a]=0}
 for(let i=n-1;i>=0;i--)b[seA[i]]=seP[i];
 for(;d>0;d--)seG[d-1]=-Math.max(-seG[d-1],seG[d]);return seG[0]}
function slot(){const j=h1&TM&~1;return tk[j]==h2?j:tk[j+1]==h2?j+1:-1}
function st(d,fl,sv,m){let j=h1&TM&~1,k=1;
 if(tk[j]==h2)k=0;else if(tk[j+1]==h2){j++;k=0}
 else{const a0=td[j]-(((gen8-tg[j])&255)<<3),a1=td[j+1]-(((gen8-tg[j+1])&255)<<3);if(a1<a0)j++}
 if(k){if(d<=0&&td[j]>0&&tg[j]==gen8)return}
 else{if(!(d>=td[j]||tg[j]!=gen8))return}
 tk[j]=h2;td[j]=d;tfl[j]=fl;tv[j]=sv;tmv[j]=m;tg[j]=gen8}
function qT(v,fl,pl,m){let sv=v;if(v>MATE-200)sv+=pl;else if(v<-MATE+200)sv-=pl;st(0,fl,sv,m)}
function nck(m){const f=m&255,p=b[f];if((p&7)==6)return 1;const k=ksq[side],dx=(f&7)-(k&7),dy=(f>>4)-(k>>4);if(!dx||!dy||dx==dy||dx==-dy)return 1;return (p&7)==1&&(m>>8&255)==ep?1:0}
function qs(a,bt,pl){if((++nodes&2047)==0&&Date.now()>tEnd)stop=1;if(stop)return 0;
 const inC=att(ksq[side],side^1);let se=-INF,tm=0;
 const sl=slot();if(sl>=0){tm=tmv[sl];let v=tv[sl];if(v>MATE-200)v-=pl;else if(v<-MATE+200)v+=pl;const f=tfl[sl];if(f==0||(f==1&&v>=bt)||(f==2&&v<=a))return v}
 if(inC){if(pl>=64)return ev()}else{se=ev(a,bt);if(pl>=64||se>=bt)return se;if(se>a)a=se}
 gtt=tm;const n=gen(pl,inC?0:1),L=mv[pl],S=sc[pl],a0=a;let lg=0;
 for(let i=0;i<n;i++){const m=pick(L,S,i,n);
  if(!inC&&!(m>>16)&&(se+VAL[b[m>>8&255]&7]+200<a||see(m)<0))continue;
  const nk=inC||nck(m);make(m);if(nk&&att(ksq[side^1],side)){unmake(m);continue}
  lg++;const v=-qs(-bt,-a,pl+1);unmake(m);if(stop)return 0;if(v>=bt){qT(v,1,pl,m);return v}if(v>a)a=v}
 if(inC&&!lg)return -MATE+pl;
 qT(a,a>a0?0:2,pl,0);
 return a}
function anyLegal(pl){gtt=0;const n=gen(pl,0),L=mv[pl];for(let i=0;i<n;i++){const m=L[i];make(m);const ok=!att(ksq[side^1],side);unmake(m);if(ok)return 1}return 0}
function ab(d,a,bt,pl,nu){if(stop)return 0;const root=pl==0;const exc=excl;excl=0;
 if(!root&&rep())return 0;
 if(pl>=62)return ev();
 const inC=att(ksq[side],side^1);
 if(!root){if(half>=100)return !inC||anyLegal(pl)?0:-MATE+pl;
  const ma=-MATE+pl,mb=MATE-pl-1;if(a<ma)a=ma;if(bt>mb)bt=mb;if(a>=bt)return a}
 if(inC)d++;
 if(d<=0)return qs(a,bt,pl);
 if((++nodes&2047)==0&&Date.now()>tEnd)stop=1;
 const pv=bt-a>1,ix=slot();let ttm=0;
 if(ix>=0){ttm=tmv[ix];
  if(!root&&!exc&&td[ix]>=d){let v=tv[ix];if(v>MATE-200)v-=pl;else if(v<-MATE+200)v+=pl;const f=tfl[ix];
   if(f==0||(f==1&&v>=bt)||(f==2&&v<=a))return v}}
 let se=0,e2=0;
 if(!inC){se=ev(a,bt);e2=se;if(ix>=0){const tf=tfl[ix],tq=tv[ix];if(tq<MATE-300&&tq>-MATE+300&&(tf==0||(tf==1&&tq>se)||(tf==2&&tq<se)))e2=tq}}
 sev[pl]=inC?-INF:se;const imp=!inC&&pl>=2&&sev[pl-2]>-INF&&se>sev[pl-2]?1:0;
 if(!pv&&!inC){let npm=0;
  if(d<=6&&e2-(115*d-50*imp)>=bt)return e2;
  if(d<=2&&e2+300+100*(d-1)<=a)return qs(a,bt,pl);
  if(nu&&!exc&&d>=3&&e2>=bt&&(npm=npMat(side))>0){pmv[pl+1]=0;cpk[pl+1]=-1;mkNull();const v=-ab(d-3-(d>6?1:0),-bt,-bt+1,pl+1,0);unNull();
   if(stop)return 0;if(v>=bt){const vv=v>MATE-200?bt:v;if(d<7||npm>900)return vv;const v2=ab(d-5,bt-1,bt,pl,0);if(stop)return 0;if(v2>=bt)return vv}}}
 if(!pv&&!inC&&d>=5&&!exc&&bt<MATE-300&&bt>-MATE+300){const pb=bt+110;gtt=0;const n2=gen(pl,1),L2=mv[pl],S2=sc[pl];
  for(let i=0;i<n2;i++){const m=pick(L2,S2,i,n2);if(see(m)<pb-e2)continue;pmv[pl+1]=m;make(m);if(att(ksq[side^1],side)){unmake(m);continue}
   cpk[pl+1]=PI[(b[m>>8&255]<<7)|(m>>8&255)];let v=-qs(-pb,-pb+1,pl+1);if(v>=pb)v=-ab(d-4,-pb,-pb+1,pl+1,1);unmake(m);if(stop)return 0;if(v>=pb)return v}}
 if(!ttm&&!root&&!exc&&d>=5&&(pv||d>=7)){ab(d-2,a,bt,pl,0);if(stop)return 0;const s2=slot();if(s2>=0)ttm=tmv[s2]}
 let sing=0;
 if(!root&&!exc&&d>=8&&ttm&&ix>=0&&tk[ix]==h2&&tfl[ix]!=2&&td[ix]>=d-3&&Math.abs(tv[ix])<MATE-300){const sb=tv[ix]-2*d;excl=ttm;const v=ab((d-1)>>1,sb-1,sb,pl,0);excl=0;if(stop)return 0;if(v<sb)sing=1}
 const pp=pmv[pl];ckey=pl&&pp?(b[pp>>8&255]<<7)|(pp>>8&255):0;cp1=cpk[pl];cp2=pl?cpk[pl-1]:-1;const ck=ckey;
 gtt=ttm;const n=gen(pl,0),L=mv[pl],S=sc[pl],qb=pl<<6;let nqt=0;
 let best=-INF,bm=0,lg=0,fl=2;
 for(let i=0;i<n;i++){const m=pick(L,S,i,n);
  if(S[i]>=1000000&&S[i]<2000000&&!(m>>16)){const ta=b[m&255]&7;if(ta>1&&ta<6&&VAL[ta]>VAL[b[m>>8&255]&7]&&see(m)<0){S[i]-=4000000;i--;continue}}
  const t=m>>8&255,q=!b[t]&&!(m>>16)&&!(t==ep&&(b[m&255]&7)==1);
  if(lg&&!q&&!(m>>16)&&!pv&&!inC&&d<=4&&best>-MATE+300&&see(m)<-90*d)continue;
  if(m==exc)continue;pmv[pl+1]=m;const ex=sing&&m==ttm?1:0,nk=inC||nck(m);
  make(m);if(nk&&att(ksq[side^1],side)){unmake(m);continue}
  lg++;cpk[pl+1]=PI[(b[t]<<7)|t];
  if(!pv&&!inC&&q&&lg>1&&d<=3&&a>-MATE+300&&best>-MATE+300){
   if((lg>((3+d*d)>>(1-imp))||(d<=2&&e2+150*d<=a))&&!att(ksq[side],side^1)){unmake(m);continue}}
  let v;
  if(lg==1)v=-ab(d-1+ex,-bt,-a,pl+1,1);
  else{let r=0;if(d>=3&&lg>2&&q&&!inC){r=LR[d>63?63:d][lg>63?63:lg];if(pv)r--;if(!imp)r++;{const hx=(b[t]<<7)|t,hy=PI[hx],hv=hist[hx]+(cp1>=0?ch1[cp1*768+hy]:0)+(cp2>=0?ch2[cp2*768+hy]:0);r-=Math.max(-2,Math.min(2,(hv/4000)|0))}
   if(m==k1[pl]||m==k2[pl]||m==cmv[ck])r--;if(r>d-2)r=d-2;if(r<0)r=0}
   v=-ab(d-1-r,-a-1,-a,pl+1,1);
   if(v>a&&r)v=-ab(d-1,-a-1,-a,pl+1,1);
   if(v>a&&v<bt)v=-ab(d-1,-bt,-a,pl+1,1)}
  unmake(m);if(stop)return 0;
  if(v>best){best=v;bm=m;
   if(v>a){a=v;fl=0;if(root)rootBest=m;
    if(a>=bt){fl=1;
     if(q){if(m!=k1[pl]){k2[pl]=k1[pl];k1[pl]=m}
      if(pl&&pmv[pl])cmv[ck]=m;
      const bn=Math.min(170*d-90,1650),x=(b[m&255]<<7)|t,y=PI[x];
      upd(hist,x,bn);if(cp1>=0)upd(ch1,cp1*768+y,bn);if(cp2>=0)upd(ch2,cp2*768+y,bn);
      for(let k=0;k<nqt;k++){const mm=qtm[qb+k],x2=(b[mm&255]<<7)|(mm>>8&255),y2=PI[x2];upd(hist,x2,-bn);if(cp1>=0)upd(ch1,cp1*768+y2,-bn);if(cp2>=0)upd(ch2,cp2*768+y2,-bn)}}
     break}}}
  if(q&&nqt<64)qtm[qb+nqt++]=m}
 if(!lg)return exc?a:inC?-MATE+pl:0;
 let sv=best;if(best>MATE-200)sv+=pl;else if(best<-MATE+200)sv-=pl;
 if(!stop&&!exc)st(d,fl,sv,bm);
 return best}
function think(ms,md){const t0=Date.now();gen8=(gen8+1)&255;tEnd=t0+ms;stop=0;nodes=0;k1.fill(0);k2.fill(0);
 for(let i=0;i<2048;i++)hist[i]>>=1;for(let i=0;i<589824;i++){ch1[i]>>=1;ch2[i]>>=1}cpk[0]=-1;
 let best=0,s=0,dd=0;
 for(let d=1;d<=md;d++){let a=-INF,bt=INF,w=35,v;if(d>=5){a=s-w;bt=s+w}
  for(;;){rootBest=0;v=ab(d,a,bt,0,0);if(stop)break;
   if(v<=a){w*=3;a=w>600?-INF:v-w}else if(v>=bt){w*=3;bt=w>600?INF:v+w}else break}
  if(stop){if(rootBest)best=rootBest;break}
  const pv0=s;best=rootBest;s=v;dd=d;
  if(Math.abs(v)>MATE-100&&d>=4)break;
  if(Date.now()-t0>ms*(d>4&&v<pv0-40?.75:.45))break}
 return{m:best,s:s,d:dd,n:nodes}}
reset();

  /* ===================================================================
     LAPISAN UCI (BARU) — semua yang ada di bawah garis ini BUKAN bagian
     mesin asli. Mesin di atas tidak diubah sama sekali; lapisan ini hanya:
       - memuat posisi dari FEN (mesin asli hanya punya reset() posisi awal),
         dengan cara yang sama persis seperti reset(): mengisi papan, side,
         castle, ep, half, ksq, hash h1/h2, dan hh1[0]/hh2[0];
       - mengubah "position ... moves ..." menjadi make() pada langkah legal;
       - menjalankan think(ms, md) lalu membalas info/bestmove;
       - buku pembukaan (U_BOOK) yang aslinya ada di skrip UI HTML.
     =================================================================== */
  const U_NAME = "Josep - Mesin Catur Buatan Sendiri";
  const U_AUTHOR = "NusantaraChess (mesin dari Mesin_Catur_Buatan_Sendiri.html)";
  // Pasangan waktu/kedalaman tingkat "Kuat" pada HTML asli: LV[3] = [2300 ms, kedalaman 14].
  const U_DEFAULT_MOVETIME = 2300, U_DEFAULT_DEPTH = 14;
  // Kedalaman tingkat "Maksimum" HTML asli (LV[4]); dipakai jika hanya waktu yang dibatasi.
  const U_MAX_DEPTH = 40;
  const U_START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const U_START_KEY = U_START_FEN.split(" ").slice(0, 4).join(" ");
  const U_PN = { 5: "q", 4: "r", 3: "b", 2: "n" };
  const U_TYPES = { p: 1, n: 2, b: 3, r: 4, q: 5, k: 6 };
  // Buku pembukaan: disalin apa adanya dari konstanta BK pada skrip UI HTML.
  const U_BOOK=["e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6 e1g1","e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 c2c3 g8f6 d2d3","e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3","e2e4 c7c5 g1f3 b8c6 d2d4 c5d4 f3d4 g8f6 b1c3 e7e5","e2e4 e7e6 d2d4 d7d5 b1c3 g8f6 c1g5 f8e7","e2e4 c7c6 d2d4 d7d5 b1c3 d5e4 c3e4 c8f5","d2d4 d7d5 c2c4 e7e6 b1c3 g8f6 c1g5 f8e7 e2e3 e8g8","d2d4 d7d5 c2c4 c7c6 g1f3 g8f6 b1c3 d5c4 a2a4","d2d4 g8f6 c2c4 e7e6 b1c3 f8b4 e2e3 e8g8","d2d4 g8f6 c2c4 g7g6 b1c3 f8g7 e2e4 d7d6 g1f3 e8g8","g1f3 d7d5 g2g3 g8f6 f1g2 e7e6 e1g1 f8e7","c2c4 e7e5 b1c3 g8f6 g1f3 b8c6 g2g3 d7d5","e2e4 e7e5 g1f3 g8f6 f3e5 d7d6 e5f3 f6e4 d2d4"];

  const uSq = s => "abcdefgh"[s & 7] + ((s >> 4) + 1);
  const uMoveStr = m => uSq(m & 255) + uSq(m >> 8 & 255) + (m >> 16 ? U_PN[m >> 16] : "");
  const uOut = line => emit(line);

  const uOpts = { ThinkTime: U_DEFAULT_MOVETIME, OwnBook: true };
  let uBaseFen = U_START_FEN, uMoveList = [], uPositionOk = true, uCur = null, uQuit = false;

  /* ---- FEN -> struktur yang dimengerti mesin ---- */
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
        const color = ch === ch.toLowerCase() ? 1 : 0, sqi = rank * 16 + file;
        if (t === 1 && (rank === 0 || rank === 7)) throw new Error("FEN: pion di baris pertama/terakhir");
        if (t === 6) { if (kings[color] >= 0) throw new Error("FEN: raja ganda"); kings[color] = sqi }
        board[sqi] = color << 3 | t; file++;
      }
      if (file !== 8) throw new Error("FEN: baris " + (rank + 1) + " tidak berisi 8 kolom");
    }
    if (kings[0] < 0 || kings[1] < 0) throw new Error("FEN: raja tidak lengkap");
    if (f[1] !== "w" && f[1] !== "b") throw new Error("FEN: giliran harus w atau b");
    const stm = f[1] === "w" ? 0 : 1;
    const cs = f[2] || "-";
    if (!/^(-|[KQkq]+)$/.test(cs)) throw new Error("FEN: hak rokade tidak valid");
    // Mesin tidak memeriksa keberadaan benteng saat rokade, jadi hak rokade yang tidak
    // sesuai papan dibuang (benteng/raja harus ada di petak asal).
    let c = 0;
    if (cs.includes("K") && board[4] === 6 && board[7] === 4) c |= 1;
    if (cs.includes("Q") && board[4] === 6 && board[0] === 4) c |= 2;
    if (cs.includes("k") && board[116] === 14 && board[119] === 12) c |= 4;
    if (cs.includes("q") && board[116] === 14 && board[112] === 12) c |= 8;
    // en passant: dipakai hanya jika konsisten dengan giliran dan pion lawan memang ada di depannya.
    let e = -1;
    if (f[3] && f[3] !== "-") {
      if (!/^[a-h][36]$/.test(f[3])) throw new Error("FEN: kotak en passant tidak valid");
      const idx = (+f[3][1] - 1) * 16 + "abcdefgh".indexOf(f[3][0]);
      if (stm === 0 && f[3][1] === "6" && board[idx - 16] === 9 && !board[idx]) e = idx;
      if (stm === 1 && f[3][1] === "3" && board[idx + 16] === 1 && !board[idx]) e = idx;
    }
    const half = Math.max(0, parseInt(f[4], 10) || 0), full = Math.max(1, parseInt(f[5], 10) || 1);
    return { board, kings, stm, castle: c, ep: e, half, full };
  }

  // Sama dengan reset() pada mesin, tetapi dari posisi sembarang.
  function uSetBoard(p) {
    b.fill(0);
    for (let s = 0; s < 128; s++) if (!(s & 136)) b[s] = p.board[s];
    side = p.stm; castle = p.castle; ep = p.ep; half = p.half; sp = 0;
    ksq[0] = p.kings[0]; ksq[1] = p.kings[1];
    h1 = h2 = 0;
    for (let s = 0; s < 128; s++) if (!(s & 136) && b[s]) xp(b[s], s);
    h1 ^= C1[castle]; h2 ^= C2[castle];
    if (side) { h1 ^= SD1; h2 ^= SD2 }      // make() membalik SD1/SD2 tiap langkah
    if (ep >= 0) { h1 ^= Z1[ep]; h2 ^= Z2[ep] }
    hh1[0] = h1; hh2[0] = h2;
  }

  function uToFen(full) {
    const P = "pnbrqk", rows = [];
    for (let r = 7; r >= 0; r--) {
      let row = "", n = 0;
      for (let fl = 0; fl < 8; fl++) {
        const p = b[r * 16 + fl];
        if (!p) { n++; continue }
        if (n) { row += n; n = 0 }
        const ch = P[(p & 7) - 1]; row += (p >> 3) ? ch : ch.toUpperCase();
      }
      if (n) row += n;
      rows.push(row);
    }
    const cs = (castle & 1 ? "K" : "") + (castle & 2 ? "Q" : "") + (castle & 4 ? "k" : "") + (castle & 8 ? "q" : "") || "-";
    return rows.join("/") + " " + (side ? "b" : "w") + " " + cs + " " + (ep >= 0 ? uSq(ep) : "-") + " " + half + " " + full;
  }

  function uFindMove(token) {
    const want = token.toLowerCase(), L = legal();
    for (let i = 0; i < L.length; i++) if (uMoveStr(L[i]) === want) return L[i];
    return 0;
  }

  // Membangun ulang posisi dari awal (reset/FEN + semua langkah), persis seperti
  // worker pada HTML asli (reset(); for m of h: make(m)).
  function uBuild(baseFen, moves) {
    const p = uParseFen(baseFen);
    uSetBoard(p);
    if (att(ksq[side ^ 1], side)) throw new Error("posisi tidak valid: raja pihak yang tidak jalan sedang skak");
    let full = p.full;
    for (const tok of moves) {
      const m = uFindMove(tok);
      if (!m) throw new Error("langkah ilegal: " + tok);
      const wasBlack = side === 1;
      make(m);
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
      uBuild(base, moves);                       // validasi sekarang
      uBaseFen = base; uMoveList = moves.map(m => m.toLowerCase()); uPositionOk = true;
    } catch (e) {
      uPositionOk = false;
      uOut("info string ERROR: " + e.message);
    }
  }

  function uScore(v) {
    if (Math.abs(v) > MATE - 100) {
      const n = (MATE - Math.abs(v) + 1) >> 1;   // rumus yang sama dengan HTML asli
      return "mate " + (v > 0 ? n : -n);
    }
    return "cp " + Math.round(v);
  }

  function uBookMove(L) {
    if (!uOpts.OwnBook) return 0;
    if (uBaseFen.trim().split(/\s+/).slice(0, 4).join(" ") !== U_START_KEY) return 0;
    const n = uMoveList.length, c = [];
    for (const line of U_BOOK) {
      const a = line.split(" ");
      if (a.length > n && uMoveList.every((x, i) => x === a[i])) c.push(a[n]);
    }
    if (!c.length) return 0;
    const w = c[Math.random() * c.length | 0];
    for (let i = 0; i < L.length; i++) if (uMoveStr(L[i]) === w) return L[i];
    return 0;
  }

  function uFinish(rec, bestMove) {
    if (uCur !== rec) return;
    if (rec.timer) { clearTimeout(rec.timer); rec.timer = null }
    uCur = null;
    uOut("bestmove " + uMoveStr(bestMove));
  }

  function uInfoLine(r, best, t0) {
    const dt = Math.max(1, Date.now() - t0);
    return "info depth " + r.d + " score " + uScore(r.s) + " nodes " + r.n + " nps " + Math.round(r.n * 1000 / dt) + " time " + dt + " pv " + uMoveStr(best);
  }

  function uRunFinite(rec) {
    rec.timer = null;
    if (uCur !== rec) return;
    const t0 = Date.now(), deadline = t0 + rec.ms;
    let r = null, nodes = 0;
    try {
      uBuild(uBaseFen, uMoveList);
      // Aturan waktu mesin asli berhenti menambah kedalaman setelah ~45% waktu. Jika diminta
      // memakai seluruh waktu (rec.full), sisa waktu dipakai dengan memanggil think() lagi
      // (tabel transposisi tetap hangat, jadi pencarian berikutnya makin dalam). Kode mesin tidak diubah.
      for (;;) {
        const left = deadline - Date.now();
        const cur = think(rec.full ? left : rec.ms, rec.md);
        nodes += cur.n;
        if (!r || (cur.m && cur.d >= r.d)) r = { m: cur.m, s: cur.s, d: cur.d, n: 0 };
        if (!rec.full || !cur.m || cur.d >= rec.md || Math.abs(cur.s) > MATE - 100 || deadline - Date.now() < 120) break;
      }
      r.n = nodes;
    }
    catch (e) { uOut("info string ERROR: " + (e && e.message ? e.message : e)); uCur = null; uOut("bestmove 0000"); return }
    let best = r.m;
    if (!best || rec.legal.indexOf(best) < 0) {
      if (best) uOut("info string WARNING: langkah mesin tidak ada di daftar legal; memakai langkah legal pertama");
      best = rec.legal[0];
    }
    uOut(uInfoLine(r, best, t0));
    uFinish(rec, best);
  }

  function uRunSlice(rec) {
    rec.timer = null;
    if (uCur !== rec) return;
    const ms = Math.min(300 * Math.pow(2, rec.k++), 6000), t0 = Date.now();
    let r;
    try { uBuild(uBaseFen, uMoveList); r = think(ms, U_MAX_DEPTH) }
    catch (e) { uOut("info string ERROR: " + (e && e.message ? e.message : e)); uCur = null; uOut("bestmove 0000"); return }
    if (r.m && rec.legal.indexOf(r.m) >= 0) { rec.best = r.m; uOut(uInfoLine(r, r.m, t0)) }
    if (r.d >= U_MAX_DEPTH || Math.abs(r.s) > MATE - 100) return;      // selesai; tunggu "stop"
    rec.timer = setTimeout(() => uRunSlice(rec), 60);                  // beri kesempatan "stop" diproses
  }

  function uGo(tokens) {
    if (uCur) { uOut("info string search already running"); return }
    if (!uPositionOk) { uOut("info string ERROR: posisi tidak valid"); uOut("bestmove 0000"); return }
    const lim = { infinite: false, depth: 0, movetime: -1, wtime: -1, btime: -1, winc: 0, binc: 0, movestogo: 0 };
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i], n = +tokens[i + 1];
      switch (t) {
        case "infinite": case "ponder": lim.infinite = true; break;
        case "depth": if (!isNaN(n)) lim.depth = Math.max(1, Math.min(U_MAX_DEPTH, n | 0)); i++; break;
        case "movetime": if (!isNaN(n)) lim.movetime = Math.max(1, n); i++; break;
        case "wtime": case "btime": case "winc": case "binc": case "movestogo": if (!isNaN(n)) lim[t] = n; i++; break;
        default: break;
      }
    }
    let L;
    try { uBuild(uBaseFen, uMoveList); L = legal() }
    catch (e) { uPositionOk = false; uOut("info string ERROR: " + e.message); uOut("bestmove 0000"); return }
    if (!L.length) { uOut("bestmove 0000"); return }
    const rec = { timer: null, legal: L, best: L[0], k: 0, infinite: lim.infinite, ms: 0, md: 0, full: false };
    if (lim.infinite) {
      uCur = rec; uOut("info string Josep mulai menganalisis");
      rec.timer = setTimeout(() => uRunSlice(rec), 0);
      return;
    }
    // Langkah buku pembukaan / satu-satunya langkah legal: tidak perlu memanggil pencarian.
    const bk = uBookMove(L);
    if (bk) { uOut("info string buku pembukaan"); uOut("bestmove " + uMoveStr(bk)); return }
    if (L.length === 1) { uOut("info string satu-satunya langkah legal"); uOut("bestmove " + uMoveStr(L[0])); return }
    // Batas pencarian.
    let ms, md;
    const stm = side;                       // posisi sudah dibangun: side = pihak yang jalan
    if (lim.movetime > 0) { ms = lim.movetime; md = lim.depth || U_MAX_DEPTH }
    else if ((stm === 0 ? lim.wtime : lim.btime) >= 0) {
      const my = stm === 0 ? lim.wtime : lim.btime, inc = stm === 0 ? lim.winc : lim.binc;
      const share = my / (lim.movestogo > 0 ? Math.min(lim.movestogo, 40) : 30) + inc * 0.75;
      ms = Math.max(10, Math.min(share, Math.max(10, my - 50))); md = lim.depth || U_MAX_DEPTH;
    }
    else if (lim.depth) { ms = 1e9; md = lim.depth }                    // go depth N saja
    else { ms = uOpts.ThinkTime; md = U_DEFAULT_DEPTH }                 // "go" polos
    rec.ms = ms; rec.md = md; rec.full = ms < 1e9 && (lim.movetime > 0 || (!lim.depth && !(lim.wtime >= 0 || lim.btime >= 0))); uCur = rec;
    uOut("info string Josep mulai mencari (maks. " + (ms >= 1e9 ? "tanpa batas waktu" : Math.round(ms) + " ms") + ", kedalaman " + md + ")");
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
    const L = legal();
    if (d === 1) return L.length;
    let n = 0;
    for (const m of L) { make(m); n += uPerft(d - 1); unmake(m) }
    return n;
  }

  function uNewGame() {
    uStop();
    // Setara dengan membuat worker baru pada HTML asli (newG): TT dan tabel riwayat kosong.
    tk.fill(0); tg.fill(0); hist.fill(0); cmv.fill(0); ch1.fill(0); ch2.fill(0);
    uBaseFen = U_START_FEN; uMoveList = []; uPositionOk = true;
  }

  function uSetOption(tokens) {
    const vi = tokens.indexOf("value");
    const name = tokens.slice(tokens[0] === "name" ? 1 : 0, vi < 0 ? tokens.length : vi).join(" ").toLowerCase();
    const value = vi < 0 ? "" : tokens.slice(vi + 1).join(" ");
    if (name === "thinktime") { const v = parseInt(value, 10); if (!isNaN(v)) uOpts.ThinkTime = Math.max(50, Math.min(60000, v)) }
    else if (name === "ownbook") uOpts.OwnBook = value.toLowerCase() === "true";
    else if (name === "clear hash") { tk.fill(0); tg.fill(0) }
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
          try { const full = uBuild(uBaseFen, uMoveList); uOut("info string fen " + uToFen(full)); uOut("info string key " + (h1 >>> 0) + ":" + (h2 >>> 0)) }
          catch (e) { uOut("info string ERROR: " + e.message) }
          break;
        case "quit": uStop(); uQuit = true; break;
        default: uOut("info string perintah tidak dikenal: " + cmd);
      }
    }
  }

  return { command, isSearching: () => !!uCur, name: U_NAME };

}

/* ---- ekspor ---------------------------------------------------------- */
global.JosepUCI = { create: createJosepUci };
if (typeof module === "object" && module && module.exports) module.exports = global.JosepUCI;

/* ---- mode Web Worker UCI murni (kecuali dipakai via josep.js) -------- */
if (typeof WorkerGlobalScope !== "undefined" && typeof self !== "undefined" && self instanceof WorkerGlobalScope && !self.JOSEP_UCI_EMBEDDED) {
  const eng = createJosepUci(line => self.postMessage(line));
  self.onmessage = e => { try { eng.command(String(e.data)) } catch (err) { self.postMessage("info string ERROR: " + (err && err.message ? err.message : err)) } };
}

})(typeof self !== "undefined" ? self : globalThis);
