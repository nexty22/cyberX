/* ---------------- Part A: UI + Particles ---------------- */
const c=document.getElementById('particles'), x=c.getContext('2d');
function resize(){c.width=innerWidth; c.height=innerHeight;}
resize(); window.addEventListener('resize', resize);
let p=[]; for(let i=0;i<80;i++) p.push({x:Math.random()*c.width,y:Math.random()*c.height,s:Math.random()*2+0.8,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5});
function anim(){ x.clearRect(0,0,c.width,c.height); for(const a of p){ a.x+=a.vx; a.y+=a.vy; if(a.x<0||a.x>c.width) a.vx*=-1; if(a.y<0||a.y>c.height) a.vy*=-1; x.fillStyle='rgba(123,47,247,0.7)'; x.beginPath(); x.arc(a.x,a.y,a.s,0,Math.PI*2); x.fill(); } requestAnimationFrame(anim); } anim();

/* Buttons */
const startBtn=document.getElementById('startBtn'), bgMusic=document.getElementById('bgMusic');
const extraButtons=document.getElementById('extraButtons'), toolsBtn=document.getElementById('toolsBtn'), toolsBox=document.getElementById('toolsBox');
let toolsVisible=false;
startBtn.addEventListener('click',()=>{ if(bgMusic.paused){ bgMusic.play(); startBtn.innerHTML='⏸ Pause Music'; extraButtons.classList.add('show'); } else { bgMusic.pause(); startBtn.innerHTML='🚀 Start Experience'; }});
toolsBtn.addEventListener('click',()=>{ toolsVisible=!toolsVisible; toolsBox.classList.toggle('show', toolsVisible); });

/* Contact modal */
function showContact(){ document.getElementById('contactModal').style.display='flex'; }
function closeContact(){ document.getElementById('contactModal').style.display='none'; }

/* Coming Soon popups */
function openComing(name){ openModal(name, `<p class="small">This slot is reserved for future features. You can add content here later.</p>`); }

/* Visitor counter */
async function updateVisitorCount(){ const visitorCount=document.getElementById('visitorCount'); try{ const res=await fetch('https://api.countapi.xyz/hit/cyberx/visits'); const data=await res.json(); visitorCount.textContent=data.value.toLocaleString(); }catch(e){ const key='cyberx_local_visits'; const v=Number(localStorage.getItem(key)||0)+1; localStorage.setItem(key,v); visitorCount.textContent=v.toLocaleString(); } }
updateVisitorCount();

/* ---------------- Part B: Modal helper ---------------- */
const toolModal=document.getElementById('toolModal'), toolInner=document.getElementById('toolInner'), toolTitle=document.getElementById('toolTitle');
function openModal(title, html){ toolTitle.innerText = title; toolInner.innerHTML = html; toolModal.style.display='flex'; /* run any inline scripts if present by using eval — we'll attach handlers separately where needed */ }
function closeModal(){ toolModal.style.display='none'; toolInner.innerHTML=''; }

/* Close modal when clicking backdrop */
toolModal.addEventListener('click', (e)=>{ if(e.target===toolModal) closeModal(); });

/* ---------------- Part C: Tool wiring ---------------- */
/* Tools are already present as DOM elements with IDs — attach click handlers */
const toolsMap = {
  ideaTool: openIdea,
  calcTool: openCalc,
  colorTool: openColor,
  schedTool: openSched,
  notesTool: openNotes,
  compassTool: openCompass,
  shortenTool: openShorten,
  fileOrgTool: openFileOrg,
  vizTool: openViz,
  aiTool: openAI,
  imgCompTool: openImgComp,
  audioTrimTool: openAudioTrim,
  videoTool: openVideoTool,
  pwTool: openPassword,
  gradTool: openGrad,
  cdTool: openCountdown,
  gameTool: openGame,
  uploaderTool: openUploader,
  screenshotTool: openScreenshot,
  invoiceTool: openInvoice,
  unitTool: openUnit,
  qrTool: openQR,
  ttsTool: openTTS,
  chatTool: openChat,
  logoTool: openLogo
};
for(const id in toolsMap){
  const el=document.getElementById(id);
  if(el) el.addEventListener('click', toolsMap[id]);
}

/* ---------------- Part D: Tool Implementations ---------------- */

/* 1) Idea Generator */
function openIdea(){
  const ideas=["AI-powered portfolio website","Smart expense tracker app","Virtual assistant using voice","CyberX futuristic dashboard","Music mood-based playlist generator","Code snippet organizer","Nexty Chat companion AI","AR business card reader","Eco-ride route optimizer","Instant recipe from fridge items"];
  openModal('💡 Idea Generator', `<p class="small">Click Generate for a new idea.</p><div class="preview-box" id="ideaBox">💡 ${ideas[0]}</div><div class="actions"><button class="modal-btn" id="ideaGenBtn">🎲 Generate</button></div>`);
  document.getElementById('ideaGenBtn').onclick = ()=>{ document.getElementById('ideaBox').innerText = '💡 '+ideas[Math.floor(Math.random()*ideas.length)]; };
}

/* 2) Calculator (safe-ish eval with whitelist) */
function openCalc(){
  openModal('🧮 Calculator', `<p class="small">Type a math expression (supports + - * / % ^ Math functions) and press Evaluate.</p>
    <input id="calcExpr" class="input" placeholder="e.g. (12+3)/5*2">
    <div class="actions"><button class="modal-btn" id="calcEvalBtn">Evaluate</button></div>
    <div class="preview-box" id="calcRes">Result: —</div>`);
  document.getElementById('calcEvalBtn').onclick = ()=>{
    const expr = document.getElementById('calcExpr').value;
    try{
      // whitelist safer characters and allow Math. functions
      const safe = expr.replace(/[^0-9+\-*/().,%\sA-Za-z]/g,'');
      // Replace ^ with **
      const prepared = safe.replace(/\^/g,'**');
      // Disallow letters except Math and constants
      // Evaluate in Function scope
      const res = Function('"use strict"; return ( '+prepared+' )')();
      document.getElementById('calcRes').innerText = 'Result: '+res;
    }catch(e){
      document.getElementById('calcRes').innerText = 'Error: '+e.message;
    }
  };
}

/* 3) Color Picker */
function openColor(){
  openModal('🎨 Color Picker', `<p class="small">Pick a color, see HEX/RGB and copy CSS code.</p>
    <div class="row"><div class="col"><input id="colorInp" type="color" value="#7b2ff7" style="height:48px;border-radius:8px;border:none"></div>
    <div class="col preview-box" id="colorInfo">HEX: #7b2ff7<br>RGB: 123,47,247</div></div>
    <div class="actions"><button class="modal-btn" id="copyColorBtn">Copy CSS</button></div>`);
  const inp=document.getElementById('colorInp'), info=document.getElementById('colorInfo');
  const update = ()=>{ const c=inp.value; const r=parseInt(c.substr(1,2),16), g=parseInt(c.substr(3,2),16), b=parseInt(c.substr(5,2),16); info.innerHTML = `HEX: ${c}<br>RGB: ${r},${g},${b}`; info.style.background = c; info.style.color = (r+g+b>380)?'#000':'#fff'; };
  inp.addEventListener('input', update); update();
  document.getElementById('copyColorBtn').onclick = ()=>{ navigator.clipboard.writeText(`background: ${inp.value};`).then(()=>alert('CSS copied')) };
}

/* 4) Scheduler (localStorage + in-tab alerts) */
function openSched(){
  openModal('📅 Scheduler', `<p class="small">Create reminders (stored locally). Alerts will appear while this tab is open.</p>
    <input id="remTitle" class="input" placeholder="Reminder title">
    <input id="remTime" class="input" type="datetime-local">
    <div class="actions"><button class="modal-btn" id="setRemBtn">Set Reminder</button></div>
    <div class="preview-box" id="remList">No reminders</div>`);
  const listEl = document.getElementById('remList');
  function load(){ const arr=JSON.parse(localStorage.getItem('cyberx_rem')||'[]'); if(!arr.length) listEl.innerText='No reminders'; else listEl.innerHTML = arr.map((r,i)=>`<div style="margin-bottom:8px">${r.title} — ${new Date(r.at).toLocaleString()} <button class="modal-btn" onclick="deleteRem(${i})" style="display:inline-block;margin-left:8px;padding:6px 8px">Del</button></div>`).join(''); }
  window.deleteRem = function(i){ const arr=JSON.parse(localStorage.getItem('cyberx_rem')||'[]'); arr.splice(i,1); localStorage.setItem('cyberx_rem',JSON.stringify(arr)); load(); };
  document.getElementById('setRemBtn').onclick = ()=>{
    const t=document.getElementById('remTime').value, title=document.getElementById('remTitle').value||'Reminder';
    if(!t){ alert('Choose date/time'); return; }
    const arr=JSON.parse(localStorage.getItem('cyberx_rem')||'[]'); arr.push({title, at:t}); localStorage.setItem('cyberx_rem',JSON.stringify(arr)); load(); scheduleCheck();
  };
  load();
  // schedule upcoming (only while tab is open)
  function scheduleCheck(){
    const arr=JSON.parse(localStorage.getItem('cyberx_rem')||'[]'); const now=Date.now();
    for(const r of arr){ const t=new Date(r.at).getTime(); if(t>now && t-now<24*3600*1000){ setTimeout(()=> alert('🔔 '+r.title), Math.max(0,t-now)); } }
  }
  scheduleCheck();
}

/* 5) Notes (localStorage) */
function openNotes(){
  openModal('📝 Notes', `<p class="small">Quick notes (saved locally)</p>
    <textarea id="notesArea" placeholder="Write notes..."></textarea>
    <div class="actions"><button class="modal-btn" id="saveNotes">Save</button><button class="modal-btn" id="clearNotes">Clear</button></div>`);
  const ta=document.getElementById('notesArea');
  ta.value = localStorage.getItem('cyberx_notes')||'';
  document.getElementById('saveNotes').onclick = ()=>{ localStorage.setItem('cyberx_notes', ta.value); alert('Saved locally'); };
  document.getElementById('clearNotes').onclick = ()=>{ ta.value=''; localStorage.removeItem('cyberx_notes'); };
}

/* 6) Compass (DeviceOrientation) */
function openCompass(){
  openModal('🧭 Compass', `<p class="small">Shows device heading (if supported; mobile & secure context recommended).</p>
    <div class="preview-box" id="compHeading">Heading: N/A</div>
    <div class="actions"><button class="modal-btn" id="stopCompass">Stop</button></div>`);
  const box=document.getElementById('compHeading');
  function handler(e){ const h = e.webkitCompassHeading || e.alpha; box.innerText = (h==null)?'Heading: N/A':'Heading: '+Math.round(h)+'°'; }
  if(window.DeviceOrientationEvent){ window.addEventListener('deviceorientation', handler); document.getElementById('stopCompass').onclick = ()=>{ window.removeEventListener('deviceorientation', handler); box.innerText='Stopped'; }; } else { box.innerText='DeviceOrientation not supported'; document.getElementById('stopCompass').style.display='none'; }
}

/* 7) URL Shortener (local pseudo) */
function openShorten(){
  openModal('🌐 URL Shortener', `<p class="small">Creates local pseudo-short links (stored in this browser).</p>
    <input id="longUrl" class="input" placeholder="https://example.com/very/long/path">
    <div class="actions"><button class="modal-btn" id="shortBtn">Shorten & Copy</button></div>
    <input id="shortRes" class="input preview-box" readonly placeholder="Short link appears here">`);
  document.getElementById('shortBtn').onclick = ()=>{
    const u=document.getElementById('longUrl').value; if(!u){alert('Enter URL');return;}
    const s = Math.random().toString(36).slice(2,9); const short = location.origin + location.pathname + '#u=' + s;
    const db = JSON.parse(localStorage.getItem('cyberx_short')||'{}'); db[s]=u; localStorage.setItem('cyberx_short', JSON.stringify(db));
    document.getElementById('shortRes').value = short; navigator.clipboard?.writeText(short); alert('Short link copied');
  };
}

/* 8) File Organizer (client-side metadata) */
function openFileOrg(){
  openModal('🗂 File Organizer', `<p class="small">Choose files and label them (client-side only).</p>
    <input id="orgFiles" type="file" multiple class="input">
    <input id="orgTag" class="input" placeholder="Comma-separated tags">
    <div class="actions"><button class="modal-btn" id="addOrg">Add</button></div>
    <div id="orgList" class="preview-box">No files</div>`);
  function render(){ const db=JSON.parse(localStorage.getItem('cyberx_files')||'[]'); const el=document.getElementById('orgList'); if(!db.length) el.innerText='No files'; else el.innerHTML = db.map((f,i)=>`<div style="margin-bottom:8px"><b>${f.name}</b> (${Math.round(f.size/1024)}KB) — tags: ${f.tags.join(', ')} <button class="modal-btn" onclick="removeOrg(${i})" style="display:inline-block;margin-left:8px;padding:6px 8px">Remove</button></div>`).join(''); }
  window.removeOrg = function(i){ const db=JSON.parse(localStorage.getItem('cyberx_files')||'[]'); db.splice(i,1); localStorage.setItem('cyberx_files', JSON.stringify(db)); render(); }
  document.getElementById('addOrg').onclick = ()=>{
    const files=document.getElementById('orgFiles').files; const tags=document.getElementById('orgTag').value.split(',').map(s=>s.trim()).filter(Boolean);
    if(!files.length){ alert('Select files'); return; }
    const db = JSON.parse(localStorage.getItem('cyberx_files')||'[]');
    for(const f of files){ db.unshift({name:f.name,size:f.size,type:f.type,added:Date.now(),tags}); }
    localStorage.setItem('cyberx_files', JSON.stringify(db)); render();
  };
  render();
}

/* 9) Data Visualizer (CSV -> bar chart) */
function openViz(){
  openModal('📊 Data Visualizer', `<p class="small">Enter comma-separated values (numbers) or CSV (label,value)</p>
    <textarea id="vizInput" class="input" placeholder="10,20,5,30 or Apples,10\nBananas,5"></textarea>
    <div class="actions"><button class="modal-btn" id="vizDraw">Draw</button></div>
    <canvas id="vizCanvas" width="700" height="240" class="preview-box" style="width:100%;height:240px"></canvas>`);
  document.getElementById('vizDraw').onclick = ()=>{
    const txt=document.getElementById('vizInput').value.trim(); if(!txt){alert('Enter numbers or CSV'); return;}
    let data=[];
    if(txt.includes('\n') || txt.includes(',')){
      const lines = txt.split(/\n/).map(r=>r.trim()).filter(Boolean);
      if(lines[0].includes(',')){ data = lines.map(r=>{const [lab,val]=r.split(',');return {label:lab.trim(),value:parseFloat(val)||0}}); }
      else { data = lines[0].split(',').map((v,i)=>({label:String(i+1), value:parseFloat(v)||0})); }
    }
    const cvs=document.getElementById('vizCanvas'), ctx=cvs.getContext('2d'); ctx.clearRect(0,0,cvs.width,cvs.height);
    const max = Math.max(...data.map(d=>d.value),1); const w=cvs.width/data.length;
    data.forEach((d,i)=>{ const h=(d.value/max)*(cvs.height-40); ctx.fillStyle='rgba(123,47,247,0.9)'; ctx.fillRect(i*w+10,cvs.height-30-h,w-20,h); ctx.fillStyle='#fff'; ctx.fillText(d.label,i*w+12,cvs.height-10); ctx.fillText(d.value, i*w+12, cvs.height-40-h); });
  };
}

/* 10) AI Assistant (local rule-based) */
function openAI(){
  openModal('🧠 AI Assistant (Local)', `<p class="small">Local assistant — rule-based suggestions (no external API).</p>
    <input id="aiQ" class="input" placeholder="Ask something...">
    <div class="actions"><button class="modal-btn" id="aiAsk">Ask</button></div>
    <div id="aiA" class="preview-box">Answer will appear here</div>`);
  document.getElementById('aiAsk').onclick = ()=>{
    const q=document.getElementById('aiQ').value.toLowerCase(); const out=document.getElementById('aiA');
    if(!q) return out.innerText='Say something';
    if(q.includes('hello')||q.includes('hi')) out.innerText='Hello! How can I help?';
    else if(q.includes('time')) out.innerText = new Date().toString();
    else if(q.includes('idea')) out.innerText = 'Try building a micro-SaaS for '+['designers','teachers','local shops'][Math.floor(Math.random()*3)];
    else out.innerText='I can help with ideas, tips, or quick examples. Try: "idea", "time", "seo".';
  };
}

/* 11) Image Compressor (resize & download) */
function openImgComp(){
  openModal('📸 Image Compressor', `<p class="small">Resize & compress image client-side, download JPG.</p>
    <input id="imgFile" type="file" accept="image/*" class="input">
    <input id="imgWidth" class="input" type="number" value="800" placeholder="Max width (px)">
    <div class="actions"><button class="modal-btn" id="imgCompressBtn">Compress & Download</button></div>
    <div id="imgPreview" class="preview-box"></div>`);
  let last=null;
  document.getElementById('imgFile').addEventListener('change', e=>{ const f=e.target.files[0]; if(!f) return; last=URL.createObjectURL(f); document.getElementById('imgPreview').innerHTML = `<img src="${last}" style="max-width:100%;">`; });
  document.getElementById('imgCompressBtn').onclick = ()=>{
    if(!last){ alert('Choose image'); return; }
    const w=parseInt(document.getElementById('imgWidth').value)||800;
    const img=new Image(); img.onload=()=>{ const scale=Math.min(1, w/img.width); const cw=img.width*scale, ch=img.height*scale; const cvs=document.createElement('canvas'); cvs.width=cw; cvs.height=ch; const ctx=cvs.getContext('2d'); ctx.drawImage(img,0,0,cw,ch); cvs.toBlob(b=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='compressed.jpg'; a.click(); }, 'image/jpeg', 0.77); }; img.src=last;
  };
}

/* 12) Audio Trimmer (decode & export WAV) */
function openAudioTrim(){
  openModal('🎵 Audio Trimmer', `<p class="small">Trim audio and export WAV (client-side).</p>
    <input id="audioFile" type="file" accept="audio/*" class="input">
    <div class="row"><input id="audioStart" class="input" placeholder="Start (s)"><input id="audioEnd" class="input" placeholder="End (s)"></div>
    <div class="actions"><button class="modal-btn" id="audioTrimBtn">Trim & Download</button></div>
    <div id="audioInfo" class="preview-box"></div>`);
  let audioBuffer = null, audioCtx = null;
  document.getElementById('audioFile').addEventListener('change', async (e)=>{ const f=e.target.files[0]; if(!f) return; const ab=await f.arrayBuffer(); audioCtx = new (window.AudioContext||window.webkitAudioContext)(); audioBuffer = await audioCtx.decodeAudioData(ab.slice(0)); document.getElementById('audioInfo').innerText = 'Loaded — duration: '+audioBuffer.duration.toFixed(2)+'s'; });
  document.getElementById('audioTrimBtn').onclick = ()=>{
    if(!audioBuffer){ alert('Load audio'); return; }
    const s=parseFloat(document.getElementById('audioStart').value)||0; const e=parseFloat(document.getElementById('audioEnd').value)||audioBuffer.duration;
    if(s>=e){ alert('Invalid range'); return; }
    const sr=audioBuffer.sampleRate; const len=Math.floor((e-s)*sr);
    const newBuf = new (window.AudioContext||window.webkitAudioContext)().createBuffer(audioBuffer.numberOfChannels, len, sr);
    for(let ch=0; ch<audioBuffer.numberOfChannels; ch++){
      newBuf.getChannelData(ch).set(audioBuffer.getChannelData(ch).subarray(Math.floor(s*sr), Math.floor(e*sr)));
    }
    // simple WAV encode
    function encodeWAV(buff){
      const numChan=buff.numberOfChannels, sampleRate=buff.sampleRate, len=buff.length;
      const bytes = 44 + len * numChan * 2;
      const buffer = new ArrayBuffer(bytes); const view = new DataView(buffer);
      function writeStr(o,s){ for(let i=0;i<s.length;i++) view.setUint8(o+i,s.charCodeAt(i)); }
      let off=0; writeStr(off,'RIFF'); off+=4; view.setUint32(off,36+len*numChan*2,true); off+=4; writeStr(off,'WAVE'); off+=4; writeStr(off,'fmt '); off+=4; view.setUint32(off,16,true); off+=4; view.setUint16(off,1,true); off+=2; view.setUint16(off,numChan,true); off+=2; view.setUint32(off,sampleRate,true); off+=4; view.setUint32(off,sampleRate*numChan*2,true); off+=4; view.setUint16(off,numChan*2,true); off+=2; view.setUint16(off,16,true); off+=2; writeStr(off,'data'); off+=4; view.setUint32(off,len*numChan*2,true); off+=4;
      let pos=off; for(let i=0;i<len;i++){ for(let ch=0; ch<numChan; ch++){ let s = Math.max(-1, Math.min(1, buff.getChannelData(ch)[i])); view.setInt16(pos, s<0? s*0x8000 : s*0x7FFF, true); pos+=2; } }
      return new Blob([view], {type:'audio/wav'});
    }
    const blob = encodeWAV(newBuf);
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='trimmed.wav'; a.click();
  };
}

/* 13) Video Frame Export */
function openVideoTool(){
  openModal('📹 Video Frame Export', `<p class="small">Pick a video and export a frame as PNG at specified time.</p>
    <input id="vidFile" type="file" accept="video/*" class="input">
    <input id="vidTime" class="input" placeholder="Time in seconds (e.g. 2.5)">
    <div class="actions"><button class="modal-btn" id="captu
