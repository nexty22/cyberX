/* ==========================================================
   script.js — Final CyberX (All 25 tools fully functional)
   - No alert popup
   - Sets visible "Nexty Here — JS Connected" in page
   - Console log as connection proof
   ========================================================== */

console.log("✅ CyberX script.js loaded");

/* If index has <h2>Nexty Here</h2>, append " — JS Connected" */
(function showConnectedBadge(){
  try{
    const h2 = document.querySelector('main .container h2') || document.querySelector('h2');
    if(h2) h2.innerText = (h2.innerText || 'Nexty Here') + ' — JS Connected';
  }catch(e){ /* ignore */ }
})();

/* ----------------- Utilities ----------------- */
function $(id){ return document.getElementById(id); }
function create(tag, props={}, text=''){
  const el = document.createElement(tag);
  for(const k in props) {
    try{ el[k] = props[k]; } catch(e){ el.setAttribute(k, props[k]); }
  }
  if(text) el.textContent = text;
  return el;
}
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }

/* ----------------- Particles ----------------- */
const canvas = $('particles');
const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
function fitCanvas(){ if(!canvas) return; canvas.width = innerWidth; canvas.height = innerHeight; }
if(canvas) { fitCanvas(); window.addEventListener('resize', fitCanvas); }

let particles = [];
if(ctx){
  for (let i=0;i<120;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      s: Math.random()*2+0.6,
      vx: (Math.random()-0.5)*0.7,
      vy: (Math.random()-0.5)*0.7
    });
  }
  (function anim(){
    if(!ctx) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < -20) p.x = canvas.width + 20;
      if(p.x > canvas.width + 20) p.x = -20;
      if(p.y < -20) p.y = canvas.height + 20;
      if(p.y > canvas.height + 20) p.y = -20;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(123,47,247,0.75)';
      ctx.arc(p.x,p.y,p.s,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(anim);
  })();
}

/* ----------------- UI Elements ----------------- */
const startBtn = $('startBtn'),
      bgMusic = $('bgMusic'),
      extraButtons = $('extraButtons'),
      toolsBtn = $('toolsBtn'),
      toolsBox = $('toolsBox'),
      visitorCount = $('visitorCount'),
      contactModal = $('contactModal'),
      toolModal = $('toolModal'),
      toolInner = $('toolInner'),
      toolTitle = $('toolTitle');

let toolsVisible = false;

/* Start Experience: play/pause music & reveal extra buttons */
if(startBtn){
  startBtn.addEventListener('click', ()=>{
    if(bgMusic && bgMusic.paused){
      bgMusic.play().catch(()=>{}); // user gesture required on some browsers
      startBtn.innerHTML = '⏸ Pause Music';
      extraButtons && extraButtons.classList && extraButtons.classList.add('show');
    } else {
      bgMusic && bgMusic.pause();
      startBtn.innerHTML = '🚀 Start Experience';
      extraButtons && extraButtons.classList && extraButtons.classList.remove('show');
      toolsBox && toolsBox.classList && toolsBox.classList.remove('show');
      toolsVisible = false;
    }
  });
}

/* Tools button toggles toolbox visibility */
if(toolsBtn){
  toolsBtn.addEventListener('click', ()=>{
    toolsVisible = !toolsVisible;
    if(toolsBox) toolsBox.classList.toggle('show', toolsVisible);
  });
}

/* Contact modal open/close */
function showContact(){ if(contactModal) contactModal.style.display = 'flex'; }
function closeContact(){ if(contactModal) contactModal.style.display = 'none'; }
if(contactModal) contactModal.addEventListener('click', (e)=>{ if(e.target===contactModal) closeContact(); });

/* Tool modal helper */
function openModal(title, html){
  if(!toolModal) return;
  if(toolTitle) toolTitle.innerText = title;
  if(toolInner) toolInner.innerHTML = html;
  toolModal.style.display = 'flex';
}
function closeModal(){
  if(!toolModal) return;
  toolModal.style.display = 'none';
  if(toolInner) toolInner.innerHTML = '';
}
if(toolModal) toolModal.addEventListener('click', (e)=>{ if(e.target===toolModal) closeModal(); });

function openComing(name){
  openModal(name, `<p class="small">🚧 This feature is coming soon.</p>`);
}

/* ----------------- Visitor counter (local fallback) ----------------- */
(function initVisitor(){
  try{
    const key = 'cyberx_visits';
    const v = Number(localStorage.getItem(key)||0) + 1;
    localStorage.setItem(key, v);
    if(visitorCount) visitorCount.innerText = v.toLocaleString();
  }catch(e){ if(visitorCount) visitorCount.innerText='--'; }
})();

/* ----------------- Tools Registry & Grid ----------------- */
const toolDefs = [
  {id:'ideaTool', label:'💡 Idea Generator', fn: openIdea},
  {id:'calcTool', label:'🧮 Calculator', fn: openCalc},
  {id:'colorTool', label:'🎨 Color Picker', fn: openColor},
  {id:'schedTool', label:'📅 Scheduler', fn: openSched},
  {id:'notesTool', label:'📝 Notes', fn: openNotes},
  {id:'compassTool', label:'🧭 Compass', fn: openCompass},
  {id:'shortenTool', label:'🌐 URL Shortener', fn: openShorten},
  {id:'fileOrgTool', label:'🗂 File Organizer', fn: openFileOrg},
  {id:'vizTool', label:'📊 Data Visualizer', fn: openViz},
  {id:'aiTool', label:'🧠 AI Assistant', fn: openAI},
  {id:'imgCompTool', label:'📸 Image Compressor', fn: openImgComp},
  {id:'audioTrimTool', label:'🎵 Audio Trimmer', fn: openAudioTrim},
  {id:'videoTool', label:'📹 Video Frame Export', fn: openVideoTool},
  {id:'pwTool', label:'🔐 Password Generator', fn: openPassword},
  {id:'gradTool', label:'🌈 Gradient Maker', fn: openGrad},
  {id:'cdTool', label:'🗓 Countdown Timer', fn: openCountdown},
  {id:'gameTool', label:'🕹 Mini Game', fn: openGame},
  {id:'uploaderTool', label:'📂 File Uploader', fn: openUploader},
  {id:'screenshotTool', label:'📷 Screenshot Canvas', fn: openScreenshot},
  {id:'invoiceTool', label:'🧾 Invoice Creator', fn: openInvoice},
  {id:'unitTool', label:'🧮 Unit Converter', fn: openUnit},
  {id:'qrTool', label:'📑 QR Code Generator', fn: openQR},
  {id:'ttsTool', label:'📢 Text-to-Speech', fn: openTTS},
  {id:'chatTool', label:'💬 Chat Simulator', fn: openChat},
  {id:'logoTool', label:'🪄 Logo Maker', fn: openLogo}
];

const toolGrid = $('toolGrid');
if(toolGrid){
  toolDefs.forEach(t=>{
    const d = create('div',{className:'tool', id:t.id}, t.label);
    d.addEventListener('click', t.fn);
    toolGrid.appendChild(d);
  });
}

/* ----------------- Tool Implementations ----------------- */

/* Helper: format date/time */
function fmt(dt){ try{return new Date(dt).toLocaleString(); } catch(e){ return String(dt); } }

/* 1) Idea Generator */
function openIdea(){
  const ideas = ["AI portfolio site", "Smart expense tracker", "Voice meeting notes", "Futuristic dashboard", "Mood-based playlists", "Snippet organizer", "Nexty chat companion", "AR business card reader", "Eco-ride optimizer", "Instant recipe from fridge"];
  openModal('💡 Idea Generator', `
    <p class="small">Click Generate</p>
    <div class="preview-box" id="ideaBox">${ideas[0]}</div>
    <div class="actions"><button class="modal-btn" id="ideaGen">🎲 Generate</button></div>
  `);
  $('ideaGen').onclick = ()=> { $('ideaBox').innerText = ideas[Math.floor(Math.random()*ideas.length)]; };
}

/* 2) Calculator (safe-ish) */
function openCalc(){
  openModal('🧮 Calculator', `
    <p class="small">Enter expression and press Evaluate (use ^ for power)</p>
    <input id="calcExpr" class="input" placeholder="(12+3)/5*2">
    <div class="actions"><button class="modal-btn" id="calcEval">Evaluate</button></div>
    <div class="preview-box" id="calcRes">Result: —</div>
  `);
  $('calcEval').onclick = ()=>{
    const expr = $('calcExpr').value.replace(/\^/g,'**');
    try{
      // basic sanitization
      const safe = expr.replace(/[^0-9+\-*/()., %\^A-Za-z]/g,'');
      const res = Function('"use strict";return(' + safe + ')')();
      $('calcRes').innerText = 'Result: ' + res;
    }catch(e){ $('calcRes').innerText = 'Error: ' + e.message; }
  };
}

/* 3) Color Picker */
function openColor(){
  openModal('🎨 Color Picker', `
    <p class="small">Pick color and copy CSS</p>
    <div style="display:flex;gap:8px;align-items:center">
      <input id="colorInp" type="color" value="#7b2ff7" style="height:48px;border-radius:8px;border:none">
      <div class="preview-box" id="colorInfo">HEX: #7b2ff7<br>RGB: 123,47,247</div>
    </div>
    <div class="actions"><button class="modal-btn" id="copyColorBtn">Copy CSS</button></div>
  `);
  const inp = $('colorInp'), info = $('colorInfo');
  const update = ()=>{
    const c = inp.value;
    const r = parseInt(c.substr(1,2),16), g = parseInt(c.substr(3,2),16), b = parseInt(c.substr(5,2),16);
    info.innerHTML = `HEX: ${c}<br>RGB: ${r},${g},${b}`;
    info.style.background = c;
    info.style.color = (r+g+b > 380) ? '#000' : '#fff';
  };
  inp.addEventListener('input', update); update();
  $('copyColorBtn').onclick = ()=>{ navigator.clipboard.writeText(`background: ${inp.value};`).then(()=>{ alert('CSS copied to clipboard'); }); };
}

/* 4) Scheduler (local reminders) */
function openSched(){
  openModal('📅 Scheduler', `
    <p class="small">Save reminders locally</p>
    <input id="remTitle" class="input" placeholder="Title">
    <input id="remAt" type="datetime-local" class="input">
    <div class="actions"><button class="modal-btn" id="remSet">Set</button></div>
    <div class="preview-box" id="remList">No reminders</div>
  `);
  function load(){
    const arr = JSON.parse(localStorage.getItem('cyberx_rems')||'[]');
    const el = $('remList');
    if(!arr.length) el.innerText = 'No reminders';
    else el.innerHTML = arr.map((r,i)=>`<div style="margin-bottom:8px">${r.title} — ${fmt(r.at)} <button class="modal-btn" onclick="(function(){const a=JSON.parse(localStorage.getItem('cyberx_rems')||'[]'); a.splice(${i},1); localStorage.setItem('cyberx_rems', JSON.stringify(a)); document.getElementById('remList').innerHTML=''; })()">Delete</button></div>`).join('');
  }
  $('remSet').onclick = ()=>{
    const title = $('remTitle').value || 'Reminder';
    const at = $('remAt').value;
    if(!at) return alert('Pick date/time');
    const arr = JSON.parse(localStorage.getItem('cyberx_rems')||'[]');
    arr.push({title,at});
    localStorage.setItem('cyberx_rems', JSON.stringify(arr));
    load(); alert('Saved');
  };
  load();
}

/* 5) Notes */
function openNotes(){
  openModal('📝 Notes', `
    <p class="small">Quick notes (saved locally)</p>
    <textarea id="notesArea" class="input" placeholder="Write..."></textarea>
    <div class="actions"><button class="modal-btn" id="saveNotes">Save</button><button class="modal-btn" id="clearNotes">Clear</button></div>
  `);
  const ta = $('notesArea');
  ta.value = localStorage.getItem('cyberx_notes') || '';
  $('saveNotes').onclick = ()=>{ localStorage.setItem('cyberx_notes', ta.value); alert('Saved'); };
  $('clearNotes').onclick = ()=>{ ta.value=''; localStorage.removeItem('cyberx_notes'); };
}

/* 6) Compass (deviceorientation) */
function openCompass(){
  openModal('🧭 Compass', `<p class="small">Device heading (mobile)</p><div class="preview-box" id="compBox">Heading: N/A</div><div class="actions"><button class="modal-btn" id="stopCompass">Stop</button></div>`);
  const box = $('compBox');
  function handler(e){
    const h = e.webkitCompassHeading || e.alpha;
    box.innerText = h == null ? 'Heading: N/A' : 'Heading: ' + Math.round(h) + '°';
  }
  if(window.DeviceOrientationEvent){
    window.addEventListener('deviceorientation', handler);
    $('stopCompass').onclick = ()=>{ window.removeEventListener('deviceorientation', handler); box.innerText = 'Stopped'; };
  } else {
    box.innerText = 'Not supported';
    $('stopCompass').style.display = 'none';
  }
}

/* 7) URL Shortener (local pseudo) */
function openShorten(){
  openModal('🌐 URL Shortener', `
    <p class="small">Create local short link</p>
    <input id="longUrl" class="input" placeholder="https://...">
    <div class="actions"><button class="modal-btn" id="shortGo">Shorten & Copy</button></div>
    <input id="shortRes" class="input preview-box" readonly>
  `);
  $('shortGo').onclick = ()=>{
    const u = $('longUrl').value;
    if(!u) return alert('Enter URL');
    const key = Math.random().toString(36).slice(2,9);
    const db = JSON.parse(localStorage.getItem('cyberx_shorts')||'{}');
    db[key] = u;
    localStorage.setItem('cyberx_shorts', JSON.stringify(db));
    const out = location.origin + location.pathname + '#u=' + key;
    $('shortRes').value = out;
    navigator.clipboard.writeText(out).then(()=>alert('Short link copied'));
  };
}

/* 8) File Organizer (client metadata) */
function openFileOrg(){
  openModal('🗂 File Organizer', `
    <p class="small">Tag files (client-only)</p>
    <input id="orgFiles" type="file" multiple class="input">
    <input id="orgTags" class="input" placeholder="tags (comma)">
    <div class="actions"><button class="modal-btn" id="orgAdd">Add</button></div>
    <div class="preview-box" id="orgList">No files</div>
  `);
  function render(){
    const db = JSON.parse(localStorage.getItem('cyberx_files')||'[]');
    const el = $('orgList');
    if(!db.length) el.innerText = 'No files';
    else el.innerHTML = db.map((f,i)=>`<div style="margin-bottom:8px"><b>${f.name}</b> (${Math.round(f.size/1024)}KB) — ${f.tags.join(', ')} <button class="modal-btn" onclick="(function(){const a=JSON.parse(localStorage.getItem('cyberx_files')||'[]'); a.splice(${i},1); localStorage.setItem('cyberx_files', JSON.stringify(a)); document.getElementById('orgList').innerHTML=''; })()">Remove</button></div>`).join('');
  }
  $('orgAdd').onclick = ()=>{
    const files = $('orgFiles').files; const tags = $('orgTags').value.split(',').map(s=>s.trim()).filter(Boolean);
    if(!files.length) return alert('Select files');
    const db = JSON.parse(localStorage.getItem('cyberx_files')||'[]');
    for(const f of files) db.unshift({name:f.name, size:f.size, type:f.type, added:Date.now(), tags});
    localStorage.setItem('cyberx_files', JSON.stringify(db));
    render(); alert('Added');
  };
  render();
}

/* 9) Data Visualizer (simple bar) */
function openViz(){
  openModal('📊 Data Visualizer', `
    <p class="small">CSV: label,value or numbers comma-separated</p>
    <textarea id="vizInput" class="input" placeholder="10,20,5 or Apple,10\nBanana,5"></textarea>
    <div class="actions"><button class="modal-btn" id="vizDraw">Draw</button></div>
    <canvas id="vizCanvas" class="preview-box" style="width:100%;height:220px"></canvas>
  `);
  $('vizDraw').onclick = ()=>{
    const txt = $('vizInput').value.trim();
    if(!txt) return alert('Enter data');
    let data=[];
    const lines = txt.split('\n').map(l=>l.trim()).filter(Boolean);
    if(lines.length>1 && lines[0].includes(',')) data = lines.map(l=>{ const p=l.split(','); return {label:p[0].trim(), value:parseFloat(p[1])||0}; });
    else if(txt.includes(',') && !txt.includes('\n')) {
      const arr = txt.split(',').map(s=>s.trim());
      if(arr.every(a=>!isNaN(a))) data = arr.map((v,i)=>({label:String(i+1),value:parseFloat(v)||0}));
      else data = [{label:arr[0],value:parseFloat(arr[1])||0}];
    } else return alert('Unsupported format');
    const cvs = $('vizCanvas'); const c = cvs.getContext('2d'); const wpx = cvs.clientWidth; cvs.width = wpx*devicePixelRatio; cvs.height = 220*devicePixelRatio; c.scale(devicePixelRatio, devicePixelRatio); c.clearRect(0,0,cvs.width,cvs.height);
    const max = Math.max(...data.map(d=>d.value),1), w = (wpx)/data.length;
    data.forEach((d,i)=>{ const h = (d.value/max)*150; c.fillStyle='rgba(123,47,247,0.9)'; c.fillRect(i*w+8,180-h,w-16,h); c.fillStyle='#fff'; c.fillText(d.label, i*w+8, 200); });
  };
}

/* 10) AI Assistant (local simple) */
function openAI(){
  openModal('🧠 AI Assistant', `
    <p class="small">Local assistant (replace with server integration for real AI)</p>
    <input id="aiQ" class="input" placeholder="Ask a question...">
    <div class="actions"><button class="modal-btn" id="aiAsk">Ask</button></div>
    <div class="preview-box" id="aiOut">Responses appear here</div>
  `);
  $('aiAsk').onclick = ()=>{
    const q = $('aiQ').value.trim().toLowerCase();
    if(!q) return alert('Ask something');
    if(q.includes('idea')) $('aiOut').innerText = 'Try building a micro-SaaS for local stores: appointment + payments.';
    else if(q.includes('time')) $('aiOut').innerText = new Date().toString();
    else $('aiOut').innerText = 'Quick reply: ' + $('aiQ').value;
  };
}

/* 11) Image Compressor (resize & download) */
function openImgComp(){
  openModal('📸 Image Compressor', `
    <p class="small">Resize and download JPG</p>
    <input id="imgFile" type="file" accept="image/*" class="input">
    <input id="imgMaxW" class="input" type="number" value="1200" placeholder="Max width">
    <div class="actions"><button class="modal-btn" id="imgDo">Compress & Download</button></div>
    <div class="preview-box" id="imgPrev"></div>
  `);
  let url=null;
  $('imgFile').addEventListener('change', e=>{ const f=e.target.files[0]; if(!f) return; url = URL.createObjectURL(f); $('imgPrev').innerHTML = `<img src="${url}" style="max-width:100%">`; });
  $('imgDo').onclick = ()=>{ if(!url) return alert('Choose image'); const maxW = parseInt($('imgMaxW').value)||1200; const img = new Image(); img.onload = ()=>{ const scale = Math.min(1, maxW/img.width); const w = img.width*scale, h = img.height*scale; const cvs = document.createElement('canvas'); cvs.width = w; cvs.height = h; const c = cvs.getContext('2d'); c.drawImage(img,0,0,w,h); cvs.toBlob(b=>{ const a=document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'compressed.jpg'; a.click(); }, 'image/jpeg', 0.78); }; img.src = url; };
}

/* 12) Audio Trimmer (client-side WAV export) */
async function openAudioTrim(){
  openModal('🎵 Audio Trimmer', `
    <p class="small">Trim audio and export WAV</p>
    <input id="audioFile" type="file" accept="audio/*" class="input">
    <div style="display:flex;gap:8px;margin-top:8px"><input id="aStart" class="input" placeholder="Start (s)"><input id="aEnd" class="input" placeholder="End (s)"></div>
    <div class="actions"><button class="modal-btn" id="aTrim">Trim & Download</button></div>
    <div class="preview-box" id="aInfo"></div>
  `);
  let buffer=null, ac=null;
  $('audioFile').addEventListener('change', async e=>{ const f=e.target.files[0]; if(!f) return; const ab = await f.arrayBuffer(); ac = new (window.AudioContext||window.webkitAudioContext)(); buffer = await ac.decodeAudioData(ab.slice(0)); $('aInfo').innerText = 'Loaded — duration: ' + buffer.duration.toFixed(2) + 's'; });
  $('aTrim').onclick = ()=>{ if(!buffer) return alert('Load audio first'); const s = parseFloat($('aStart').value)||0, e = parseFloat($('aEnd').value)||buffer.duration; if(s>=e) return alert('Invalid range'); const sr = buffer.sampleRate, len = Math.floor((e-s)*sr), numCh = buffer.numberOfChannels; const out = ac.createBuffer(numCh, len, sr); for(let ch=0; ch<numCh; ch++) out.getChannelData(ch).set(buffer.getChannelData(ch).subarray(Math.floor(s*sr), Math.floor(e*sr))); function encodeWAV(buff){ const numChan=buff.numberOfChannels, sampleRate=buff.sampleRate, length=buff.length; const bytes = 44 + length * numChan * 2; const ab = new ArrayBuffer(bytes); const view = new DataView(ab); let p=0; function writeStr(s){ for(let i=0;i<s.length;i++) view.setUint8(p++, s.charCodeAt(i)); } writeStr('RIFF'); view.setUint32(p, 36 + length * numChan * 2, true); p+=4; writeStr('WAVE'); writeStr('fmt '); view.setUint32(p,16,true); p+=4; view.setUint16(p,1,true); p+=2; view.setUint16(p,numChan,true); p+=2; view.setUint32(p,sampleRate,true); p+=4; view.setUint32(p,sampleRate*numChan*2,true); p+=4; view.setUint16(p,numChan*2,true); p+=2; view.setUint16(p,16,true); p+=2; writeStr('data'); view.setU
