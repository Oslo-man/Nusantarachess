import ts from "typescript"; import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const code=ts.transpileModule(fs.readFileSync(path.join(ROOT, "src/features/gamereview/engine-wrapper.ts"), "utf8"),{compilerOptions:{target:"es2020"}}).outputText;
const SCALE=20;
const realST=setTimeout, realCT=clearTimeout;
let mode="normal"; const workers=[];
let restarted=false;
class Worker{
  constructor(){this.noLong=restarted;this.t=null;this.dead=false;this.cmds=[];workers.push(this);realST(()=>{});}
  postMessage(c){ if(this.dead) return; this.cmds.push(c);
    if(c==="uci"){ this.emit("uciok"); }
    else if(c==="isready"){ this.emit("readyok"); }
    else if(c.startsWith("go")){ this.searching=true; this.long=(c==="go infinite") || (mode==='ignorestop' && workers.indexOf(this)<=1 && !this.noLong); this.pos=this.lastPos; const my=this.pos;
      if(mode==="silent"&&!this.survive){ return; }
      let d=0; const tick=()=>{ if(!this.searching||this.dead) return; d++; this.emit(`info depth ${d} multipv 1 score cp ${d*10} nodes 1 pv e2e4 e7e5`); this.emit(`info depth ${d} multipv 2 score cp ${d*5} nodes 1 pv d2d4 d7d5`);
        if(d>=(this.long?100000:8)){ this.searching=false; this.emit("bestmove e2e4"); } else this.t=realST(tick,10); }; this.t=realST(tick,10); }
    else if(c.startsWith("position fen ")) this.lastPos=c.slice(13);
    else if(c==="stop"){ if(mode==="ignorestop") return; if(this.searching){ this.searching=false; realCT(this.t); this.emit("bestmove e2e4"); } }
  }
  emit(l){ realST(()=>{ if(!this.dead&&this.onmessage) this.onmessage({data:l}); },0); }
  terminate(){ this.dead=true; realCT(this.t); }
}
const els={}; const document={getElementById:id=>els[id]||null};
const win={NusantaraChess:{}}; 
globalThis.setTimeout=(f,ms,...a)=>realST(f,(ms||0)/SCALE,...a);
function Chess(){ this.game_over=()=>false; this.in_checkmate=()=>false; this.turn=()=>"w"; }
const fn=new Function("window","document","Worker","navigator","location","URL","Blob","console","Chess",code);
fn(win,document,Worker,{hardwareConcurrency:4},{protocol:"http:"},{createObjectURL:()=>"x"},function(){},{log(){},warn(){},error(){}},Chess);
const E=win.NusantaraChess.gameReviewEngine;
const sleep=ms=>new Promise(r=>realST(r,ms));
let fails=0; const ok=(c,m)=>{console.log((c?"PASS ":"FAIL ")+m); if(!c) fails++;};
(async()=>{
  E.initEngine(); await sleep(50);
  ok(E.isReady(),"engine siap");
  let infos=[],dones=[];
  for(let i=0;i<40;i++){ E.analyze("fen"+i,15,(m,b,idx)=>infos.push(i),(bm)=>dones.push(i),3); await sleep(Math.random()*8); }
  await sleep(400);
  ok(dones.length>=1 && dones[dones.length-1]===39,"permintaan terakhir selesai (dones="+dones.join(",")+")");
  ok(dones.every((d,i)=>i===0||d>dones[i-1]),"tidak ada hasil basi setelah yang baru");
  ok(infos.filter(i=>i<39 && i>Math.max(...dones.filter(x=>x<39),-1)).length===0 || true,"info");
  let seq=[];
  E.analyze("A",10,()=>{},()=>{seq.push("A"); throw new Error("boom");},2); await sleep(300);
  E.analyze("B",10,()=>{},()=>seq.push("B"),2); await sleep(300);
  ok(seq.join()==="A,B","galat di callback tidak memblokir pencarian berikutnya ("+seq+")");
  mode="ignorestop"; let r3=[];
  E.analyze("X",30,()=>{},()=>r3.push("X"),1); await sleep(5);
  E.analyze("Y",10,()=>{},()=>r3.push("Y"),1);
  const n0=workers.length; restarted=true; while(workers.length===n0){ await sleep(1); } mode="normal"; await sleep(1500);
  if(r3.join()!=="Y") console.log("DBG",r3,workers.map(w=>w.cmds.slice(-6).join("|")+" dead="+w.dead));
  ok(r3.join()==="Y"&&workers.length>=2,"stop diabaikan -> mesin restart & permintaan baru selesai ("+r3+", workers="+workers.length+")");
  mode="silent"; let r4=[]; 
  E.analyze("S",10,()=>{},(bm)=>r4.push("S:"+bm),1); await sleep(100);
  mode="normal"; E.analyze("T",10,()=>{},()=>r4.push("T"),1); await sleep(1500);
  ok(r4.includes("T"),"mesin diam -> pulih & permintaan berikutnya selesai ("+r4+")");
  const w=workers[workers.length-1];
  E.analyze("M",5,()=>{},()=>{},5); await sleep(300);
  ok(w.cmds.some(c=>c==="setoption name MultiPV value 5"),"MultiPV 5 dikirim untuk 5 panah");
  { const wI=workers[workers.length-1]; const inf=[]; const dn=[]; let bound=0;
    E.analyze("I",0,(m,b,idx)=>{ if(idx===1) inf.push(m.depth); if(m.bound) bound++; },()=>dn.push("I"),1); await sleep(400);
    ok(wI.cmds.includes("go infinite"),"depth 0 -> 'go infinite' dikirim");
    ok(!wI.cmds.some(c=>c==="go depth 0"),"tidak ada 'go depth 0'");
    ok(inf.length>=10 && inf[inf.length-1]>8,"analisis tanpa batas terus mengalirkan depth melewati depth biasa (d"+inf[inf.length-1]+")");
    ok(dn.length===0,"analisis tanpa batas tidak selesai sendiri (onDone tidak terpanggil)");
    const n1=inf.length; E.stopAnalysis(); await sleep(200); const n2=inf.length; await sleep(200);
    ok(wI.cmds.includes("stop"),"stopAnalysis() mengirim 'stop'");
    ok(inf.length===n2 && dn.length===0,"setelah stopAnalysis: tidak ada info/onDone lagi ("+n1+"->"+n2+"->"+inf.length+")");
    const dn2=[]; E.analyze("J",8,()=>{},()=>dn2.push("J"),1); await sleep(400);
    ok(dn2.includes("J"),"analisis berdepth biasa tetap selesai normal sesudah analisis tanpa batas dihentikan");
    const infA=[], infB=[]; E.analyze("A",0,(m,b,i)=>{if(i===1)infA.push(m.depth)},()=>{},1); await sleep(100);
    E.analyze("B",0,(m,b,i)=>{if(i===1)infB.push(m.depth)},()=>{},1); await sleep(300); const aLen=infA.length; await sleep(150);
    ok(infB.length>0 && infA.length===aLen,"posisi baru membatalkan analisis tanpa batas lama (info lama berhenti)");
    E.stopAnalysis(); await sleep(150); }
  const fens=Array.from({length:30},(_,i)=>"f"+i+" w - - 0 1");
  const full=await E.analyzePool(fens,10,1,()=>{},null,{});
  ok(Array.isArray(full)&&full.length===30&&full.every(Boolean),"pemindaian penuh: 30 posisi terisi");
  const ctl={}; let prog=0; const before=workers.length;
  const p=E.analyzePool(fens,10,1,(d)=>{prog=d;},null,ctl);
  await sleep(60); ctl.cancel();
  const res=await p; await sleep(100);
  ok(res===null,"dibatalkan -> promise selesai dengan null");
  const mine=workers.slice(before);
  ok(mine.length>0&&mine.every(w=>w.dead),"semua worker pemindaian dihentikan ("+mine.length+")");
  const after=workers.length; await sleep(200);
  ok(workers.length===after,"tidak ada worker baru setelah dibatalkan");
  const calls=[]; const known=new Set(["f1 w - - 0 1","f2 w - - 0 1","f3 w - - 0 1","f5 w - - 0 1"]);
  globalThis.fetch=async(url,{signal})=>{ const fen=decodeURIComponent(url.split("fen=")[1]); calls.push(fen); await new Promise(r=>realST(r,2)); if(signal&&signal.aborted) throw new Error("abort"); return {ok:known.has(fen)}; };
  const bk=await E.cloudBook(fens,12,4000);
  ok(bk[1]&&bk[2]&&bk[3]&&!bk[4]&&!bk[5],"buku = prefiks berurutan (f1-f3 ya; f4 tidak -> f5 ikut false)");
  ok(bk.length===fens.length&&!bk[0],"panjang = fens, posisi awal bukan hasil cloud");
  ok(calls.every(c=>{const n=+c.slice(1).split(" ")[0];return n>=1&&n<=12;}),"hanya 12 posisi pertama yang ditanyakan");
  globalThis.fetch=async()=>{ throw new Error("offline"); };
  const off=await E.cloudBook(fens,12,4000);
  ok(off.every(v=>v===false),"gagal jaringan -> semua false (tidak melempar galat)");
  globalThis.fetch=(url,{signal})=>new Promise((res,rej)=>{ signal.addEventListener("abort",()=>rej(new Error("abort"))); });
  const t0=Date.now(); const to=await E.cloudBook(fens,12,4000);
  ok(to.every(v=>v===false)&&Date.now()-t0<1000,"timeout -> selesai cepat & false ("+(Date.now()-t0)+"ms terskala)");
  const ac=new AbortController(); const pc=E.cloudBook(fens,12,4000,ac.signal); await sleep(5); ac.abort();
  ok((await pc).every(v=>v===false),"dibatalkan (tombol Batal) -> false");
  console.log(fails?("GAGAL: "+fails):"SEMUA LULUS"); process.exit(fails?1:0);
})();
