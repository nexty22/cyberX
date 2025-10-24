/* script.js — CyberX Pro (all 25 tools) */

/* ---------- Utilities ---------- */
function $(id){ return document.getElementById(id); }
function create(tag, attrs={}, text=''){ const e=document.createElement(tag); for(const k in attrs) e[k]=attrs[k]; if(text) e.textContent=text; return e; }

/* ---------- Part A: Particles ---------- */
const canvas = $('particles'), ctx = canvas.getContext('2d');
function fitCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
fitCanvas(); window.addEventListener('resize', fitCanvas);
let particles = [];
for(let i=0;i<120;i++) particles.push({ x:Math.random()*canvas.width, y:Math.random()*canvas.height, s:Math.random()*2+0.6, vx:(Math.random()-.5)*0.6, vy:(Math.random()-.5)*0.6 });
function drawParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const p of particles){
    p.x += p.vx; p.y += p.vy;
    if(p.x<0||p.x>canvas.width) p.vx *= -1;
    if(p.y<0||p.y>canvas.height) p.vy *= -1;
    ctx.beginPath(); ctx.fillStyle = 'rgba(123,47,247,0.7)'; ctx.arc(p.x,p.y,p.s,0,Math.PI*2); ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ---------- Part B: UI & Controls ---------- */
const startBtn = $('startBtn'), bgMusic = $('bgMusic'), extraButtons = $('extraButtons'),
      toolsBtn = $('toolsBtn'), toolsBox = $('toolsBox'), visitorCount = $('visitorCount');
const contactModal = $('contactModal'), toolModal = $('toolModal'), toolInner = $('toolInner'), toolTitle = $('toolTitle');

let toolsVisible = false;
startBtn.addEventListener('click', ()=>{
  if(bgMusic.paused){
    bgMusic.play().catch(()=>{});
    startBtn.innerHTML = '⏸ Pause Music';
    extraButtons.classList.add('show');
  } else {
    bgMusic.pause();
    startBtn.innerHTML = '🚀 Start Experience';
    extraButtons.classList.remove('show');
    toolsBox.classList.remove('show');
    toolsVisible = false;
  }
});
toolsBtn.addEventListener('click', ()=>{ toolsVisible = !toolsVisible; toolsBox.classList.toggle('show', toolsVisible); });

function showContact(){ contactModal.style.display = 'flex'; }
function closeContact(){ contactModal.style.display = 'none'; }
contactModal.addEventListener('click', (e)=>{ if(e.target===contactModal) closeContact(); });

function openModal(title, html){ toolTitle.innerText = title; toolInner.innerHTML = html; toolModal.style.display = 'flex'; }
function closeModal(){ toolModal.style.display = 'none'; toolInner.innerHTML = ''; }
toolModal.addEventListener('click', (e)=>{ if(e.target===toolModal) closeModal(); });

function openComing(name){ openModal(name, '<p class="small">This feature is coming soon.</p>'); }

/* ---------- Visitors (local increment) ---------- */
(function initVisitors(){ try{ const k='cyberx_visits'; const v = Number(localStorage.getItem(k)||0)+1; localStorage.setItem(k,v); visitorCount.innerText = v.toLocaleString(); } catch(e){ visitorCount.innerText = '—'; } })();

/* ---------- Part C: Tools grid creation ---------- */
const toolList=[
  {id:'ideaTool',label:'💡 Idea Generator',fn:openIdea},
  {id:'calcTool',label:'🧮 Calculator',fn:openCalc},
  {id:'colorTool',label:'🎨 Color Picker',fn:openColor},
  {id:'schedTool',label:'📅 Scheduler',fn:openSched},
  {id:'notesTool',label:'📝 Notes',fn:openNotes},
  {id:'compassTool',label:'🧭 Compass',fn:openCompass},
  {id:'shortenTool',label:'🌐 URL Shortener',fn:openShorten},
  {id:'fileOrgTool',label:'🗂 File Organizer',fn:openFileOrg},
  {id:'vizTool',label:'📊 Data Visualizer',fn:openViz},
  {id:'aiTool',label:'🧠 AI Assistant',fn:openAI},
  {id:'imgCompTool',label:'📸 Image Compressor',fn:openImgComp},
  {id:'audioTrimTool',label:'🎵 Audio Trimmer',fn:openAudioTrim},
  {id:'videoTool',label:'📹 Video Frame Export',fn:openVideoTool},
  {id:'pwTool',label:'🔐 Password Generator',fn:openPassword},
  {id:'gradTool',label:'🌈 Gradient Maker',fn:openGrad},
  {id:'cdTool',label:'🗓 Countdown Timer',fn:openCountdown},
  {id:'gameTool',label:'🕹 Mini Game',fn:openGame},
  {id:'uploaderTool',label:'📂 File Uploader',fn:openUploader},
  {id:'screenshotTool',label:'📷 Screenshot Canvas',fn:openScreenshot},
  {id:'invoiceTool',label:'🧾 Invoice Creator',fn:openInvoice},
  {id:'unitTool',label:'🧮 Unit Converter',fn:openUnit},
  {id:'qrTool',label:'📑 QR Code Generator',fn:openQR},
  {id:'ttsTool',label:'📢 Text-to-Speech',fn:openTTS},
  {id:'chatTool',label:'💬 Chat Simulator',fn:openChat},
  {id:'logoTool',label:'🪄 Logo Maker',fn:openLogo},
];

const grid = $('toolGrid');
for(const t of toolList){
  const d = create('div'); d.className='tool'; d.id=t.id; d.textContent=t.label; d.addEventListener('click', t.fn); grid.appendChild(d);
}

/* ---------- Part D: All tool implementations ---------- */

/* 1) Idea Generator */
function openIdea(){
  const ideas=["AI portfolio","Smart expense tracker","Voice assistant","Futuristic dashboard","Mood playlist","Snippet manager","Chat companion","AR business card","Eco route planner","Instant recipe from fridge"];
  openModal('💡 Idea Generator', `<p class="small">Tap generate for a new idea.</p><div class="preview" id="ideaBox">${ideas[0]}</div><div class="actions"><button class="btn" id="ideaGen">🎲 Generate</button></div>`);
  $('ideaGen').onclick = ()=>{ $('ideaBox').innerText = ideas[Math.floor(Math.random()*ideas.length)]; };
}

/* 2) Calculator */
function openCalc(){
  openModal('🧮 Calculator', `<p class="small">Type expression and Evaluate (^ works as power)</p><input id="calcExpr" class="input" placeholder="(12+3)/5*2"><div class="actions"><button class="btn" id="calcEval">Evaluate</button></div><div class="preview" id="calcRes">Result: —</div>`);
  $('calcEval').onclick = ()=>{ try{ const expr = $('calcExpr').value.replace(/\^/g,'**'); const res = Function('"use strict"; return ('+expr+')')(); $('calcRes').innerText = 'Result: '+res; }catch(e){ $('calcRes').innerText = 'Error: '+e.message; } };
}

/* 3) Color Picker */
function openColor(){
  openModal('🎨 Color Picker', `<p class="small">Pick a color and copy CSS</p><input id="colorInp" type="color" value="#7b2ff7"><div class="preview" id="colorInfo">HEX: #7b2ff7<br>RGB: 123,47,247</div><div class="actions"><button class="btn" id="copyColor">Copy CSS</button></div>`);
  const inp = $('colorInp'), info = $('colorInfo');
  function upd(){ const c = inp.value; const r=parseInt(c.substr(1,2),16), g=parseInt(c.substr(3,2),16), b=parseInt(c.substr(5,2),16); info.innerHTML = `HEX: ${c}<br>RGB: ${r},${g},${b}`; info.style.background = c; info.style.color = (r+g+b>380)?'#000':'#fff'; }
  inp.addEventListener('input', upd); upd();
  $('copyColor').onclick = ()=>{ navigator.clipboard.writeText(`background: ${inp.value};`).then(()=>alert('CSS copied')); };
}

/* 4) Scheduler */
function openSched(){
  openModal('📅 Scheduler', `<p class="small">Save reminders locally.</p><input id="remTitle" class="input" placeholder="Title"><input id="remAt" type="datetime-local" class="input"><div class="actions"><button class="btn" id="setRem">Set Reminder</button></div><div class="preview" id="remList">No reminders</div>`);
  function load(){ const arr=JSON.parse(localStorage.getItem('cyberx_rem')||'[]'); const el=$('remList'); if(!arr.length) el.innerText='No reminders'; else el.innerHTML = arr.map((r,i)=>`<div style="margin-bottom:8px">${r.title} — ${new Date(r.at).toLocaleString()} <button class="btn" onclick="(function(){const a=JSON.parse(localStorage.getItem('cyberx_rem')||'[]');a.splice(${i},1);localStorage.setItem('cyberx_rem',JSON.stringify(a));document.getElementById('remList').innerHTML='';})()">Del</button></div>`).join(''); }
  $('setRem').onclick = ()=>{ const t=$('remAt').value, title=$('remTitle').value||'Reminder'; if(!t){ alert('Choose date/time'); return; } const arr=JSON.parse(localStorage.getItem('cyberx_rem')||'[]'); arr.push({title,at:t}); localStorage.setItem('cyberx_rem',JSON.stringify(arr)); load(); alert('Saved'); };
  load();
}

/* 5) Notes */
function openNotes(){
  openModal('📝 Notes', `<p class="small">Quick notes stored locally</p><textarea id="notesArea" class="input" placeholder="Write..."></textarea><div class="actions"><button class="btn" id="saveNotes">Save</button><button class="btn" id="clearNotes">Clear</button></div>`);
  const ta = $('notesArea'); ta.value = localStorage.getItem('cyberx_notes')||'';
  $('saveNotes').onclick = ()=>{ localStorage.setItem('cyberx_notes', ta.value); alert('Saved'); };
  $('clearNotes').onclick = ()=>{ ta.value=''; localStorage.removeItem('cyberx_notes'); };
}

/* 6) Compass */
function openCompass(){
  openModal('🧭 Compass', `<p class="small">Device heading (mobile)</p><div class="preview" id="compHeading">Heading: N/A</div><div class="actions"><button class="btn" id="stopCompass">Stop</button></div>`);
  const box = $('compHeading');
  function h(e){ const hd = e.webkitCompassHeading || e.alpha; box.innerText = (hd==null)?'Heading: N/A':'Heading: '+Math.round(hd)+'°'; }
  if(window.DeviceOrientationEvent){ window.addEventListener('deviceorientation', h); $('stopCompass').onclick = ()=>{ window.removeEventListener('deviceorientation', h); box.innerText='Stopped'; }; } else { box.innerText='DeviceOrientation not supported'; $('stopCompass').style.display='none'; }
}

/* 7) URL Shortener (local pseudo) */
function openShorten(){
  openModal('🌐 URL Shortener', `<p class="small">Create a short link stored locally</p><input id="longUrl" class="input" placeholder="https://..."><div class="actions"><button class="btn" id="shortBtn">Shorten & Copy</button></div><input id="shortRes" class="input preview" readonly>`);
  $('shortBtn').onclick = ()=>{ const u=$('longUrl').value; if(!u){ alert('Enter URL'); return; } const s = Math.random().toString(36).slice(2,9); const db = JSON.parse(localStorage.getItem('cyberx_short')||'{}'); db[s]=u; localStorage.setItem('cyberx_short', JSON.stringify(db)); const short = location.origin + location.pathname + '#u=' + s; $('shortRes').value = short; navigator.clipboard.writeText(short); alert('Short link copied'); };
}

/* 8) File Organizer (metadata client-side) */
function openFileOrg(){
  openModal('🗂 File Organizer', `<p class="small">Tag files (client-side metadata)</p><input id="orgFiles" type="file" multiple class="input"><input id="orgTag" class="input" placeholder="Tags (comma)"><div class="actions"><button class="btn" id="addOrg">Add</button></div><div class="preview" id="orgList">No files</div>`);
  function render(){ const db=JSON.parse(localStorage.getItem('cyberx_files')||'[]'); const el=$('orgList'); if(!db.length) el.innerText='No files'; else el.innerHTML = db.map((f,i)=>`<div style="margin-bottom:8px"><b>${f.name}</b> (${Math.round(f.size/1024)}KB) — tags: ${f.tags.join(', ')} <button class="btn" onclick="(function(){const a=JSON.parse(localStorage.getItem('cyberx_files')||'[]');a.splice(${i},1);localStorage.setItem('cyberx_files',JSON.stringify(a));document.getElementById('orgList').innerHTML='';})()">Remove</button></div>`).join(''); }
  $('addOrg').onclick = ()=>{ const files = $('orgFiles').files; const tags = $('orgTag').value.split(',').map(s=>s.trim()).filter(Boolean); if(!files.length){ alert('Select files'); return; } const db=JSON.parse(localStorage.getItem('cyberx_files')||'[]'); for(const f of files){ db.unshift({name:f.name,size:f.size,type:f.type,added:Date.now(),tags}); } localStorage.setItem('cyberx_files', JSON.stringify(db)); render(); };
  render();
}

/* 9) Data Visualizer */
function openViz(){
  openModal('📊 Data Visualizer', `<p class="small">Enter CSV (label,value) or comma numbers</p><textarea id="vizInput" class="input" placeholder="10,20,5 or Apple,10\nBanana,5"></textarea><div class="actions"><button class="btn" id="vizDraw">Draw</button></div><canvas id="vizCanvas" class="preview" style="width:100%;height:220px"></canvas>`);
  $('vizDraw').onclick = ()=>{ const txt = $('vizInput').value.trim(); if(!txt){ alert('Enter data'); return; }
    let data=[];
    const lines = txt.split('\n').map(l=>l.trim()).filter(Boolean);
    if(lines.length>1){ data = lines.map(l=>{ const p=l.split(','); return {label:p[0].trim(), value:parseFloat(p[1])||0}; }); }
    else if(txt.includes(',')){ const arr = txt.split(',').map(s=>s.trim()); if(arr.every(a=>!isNaN(a))) data=arr.map((v,i)=>({label:String(i+1),value:parseFloat(v)||0})); else data=[txt.split(',').slice(0,2)].map(p=>({label:p[0],value:parseFloat(p[1])||0})); }
    else { alert('Unsupported format'); return; }
    const cvs=$('vizCanvas'), cctx=cvs.getContext('2d'); cvs.width = cvs.clientWidth*devicePixelRatio; cvs.height = 220*devicePixelRatio; cctx.scale(devicePixelRatio, devicePixelRatio); cctx.clearRect(0,0,cvs.width,cvs.height);
    const max = Math.max(...data.map(d=>d.value),1); const w = (cvs.width/devicePixelRatio) / data.length;
    cctx.fillStyle='rgba(123,47,247,0.9)'; data.forEach((d,i)=>{ const h=(d.value/max)*160; cctx.fillRect(i*w+8,200-h,w-16,h); cctx.fillStyle='#fff'; cctx.fillText(d.label, i*w+8, 216); cctx.fillStyle='rgba(123,47,247,0.9)'; });
  };
}

/* 10) AI Assistant (local rule-based; add backend integration for full AI) */
function openAI(){
  openModal('🧠 AI Assistant', `<p class="small">Local assistant — replace with your API integration for real AI.</p><input id="aiPrompt" class="input" placeholder="Ask..."><div class="actions"><button class="btn" id="aiAsk">Ask</button></div><div class="preview" id="aiRes">Responses appear here</div>`);
  $('aiAsk').onclick = async ()=>{ const q = $('aiPrompt').value.trim(); if(!q) return $('aiRes').innerText = 'Please ask something.'; const l=q.toLowerCase(); let ans='Try: "idea", "time", "explain X".'; if(l.includes('idea')) ans='Try a micro-SaaS for local shops: booking + payments.'; else if(l.includes('time')) ans=new Date().toString(); else if(l.includes('help')) ans='I can help with ideas, small code snippets, explanations.'; $('aiRes').innerText = ans; };
}

/* 11) Image Compressor */
function openImgComp(){
  openModal('📸 Image Compressor', `<p class="small">Resize image client-side and download</p><input id="imgFile" type="file" accept="image/*" class="input"><input id="imgWidth" class="input" type="number" value="800" placeholder="Max width"><div class="actions"><button class="btn" id="imgCompress">Compress & Download</button></div><div id="imgPreview" class="preview"></div>`);
  let url=null;
  $('imgFile').addEventListener('change', e=>{ const f=e.target.files[0]; if(!f) return; url = URL.createObjectURL(f); $('imgPreview').innerHTML = `<img src="${url}" style="max-width:100%">`; });
  $('imgCompress').onclick = ()=>{ if(!url){ alert('Choose image'); return; } const w=parseInt($('imgWidth').value)||800; const img=new Image(); img.onload = ()=>{ const scale = Math.min(1, w / img.width); const cw = img.width * scale, ch = img.height * scale; const cvs = document.createElement('canvas'); cvs.width = cw; cvs.height = ch; const c = cvs.getContext('2d'); c.drawImage(img,0,0,cw,ch); cvs.toBlob(b=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='compressed.jpg'; a.click(); }, 'image/jpeg', 0.8); }; img.src = url; };
}

/* 12) Audio Trimmer */
async function openAudioTrim(){
  openModal('🎵 Audio Trimmer', `<p class="small">Trim audio and export WAV</p><input id="audioFile" type="file" accept="audio/*" class="input"><div style="display:flex;gap:8px;margin-top:8px"><input id="audioStart" class="input" placeholder="Start (s)"><input id="audioEnd" class="input" placeholder="End (s)"></div><div class="actions"><button class="btn" id="audioTrimBtn">Trim & Download</button></div><div id="audioInfo" class="preview"></div>`);
  let buffer=null, audioCtx=null;
  $('audioFile').addEventListener('change', async (e)=>{ const f=e.target.files[0]; if(!f) return; const ab = await f.arrayBuffer(); audioCtx = new (window.AudioContext||window.webkitAudioContext)(); buffer = await audioCtx.decodeAudioData(ab.slice(0)); $('audioInfo').innerText = 'Loaded — duration: '+buffer.duration.toFixed(2)+'s'; });
  $('audioTrimBtn').onclick = ()=>{ if(!buffer){ alert('Load audio first'); return; } const s = parseFloat($('audioStart').value)||0, e = parseFloat($('audioEnd').value)||buffer.duration; if(s>=e){ alert('Invalid range'); return; } const sr = buffer.sampleRate, len = Math.floor((e-s)*sr); const newBuf = audioCtx.createBuffer(buffer.numberOfChannels, len, sr); for(let ch=0; ch<buffer.numberOfChannels; ch++){ newBuf.getChannelData(ch).set(buffer.getChannelData(ch).subarray(Math.floor(s*sr), Math.floor(e*sr))); } function encodeWAV(buff){ const numChan=buff.numberOfChannels, sampleRate=buff.sampleRate, length=buff.length; const bytes=44+length*numChan*2; const array = new ArrayBuffer(bytes); const view = new DataView(array); function writeStr(o,s){ for(let i=0;i<s.length;i++) view.setUint8(o+i,s.charCodeAt(i)); } let offset=0; writeStr(offset,'RIFF'); offset+=4; view.setUint32(offset,36+length*numChan*2,true); offset+=4; writeStr(offset,'WAVE'); offset+=4; writeStr(offset,'fmt '); offset+=4; view.setUint32(offset,16,true); offset+=4; view.setUint16(offset,1,true); offset+=2; view.setUint16(offset,numChan,true); offset+=2; view.setUint32(offset,sampleRate,true); offset+=4; view.setUint32(offset,sampleRate*numChan*2,true); offset+=4; view.setUint16(offset,numChan*2,true); offset+=2; view.setUint16(offset,16,true); offset+=2; writeStr(offset,'data'); offset+=4; view.setUint32(offset,length*numChan*2,true); offset+=4; let pos=offset; for(let i=0;i<length;i++){ for(let ch=0; ch<numChan; ch++){ let s = Math.max(-1, Math.min(1, buff.getChannelData(ch)[i])); view.setInt16(pos, s<0? s*0x8000 : s*0x7FFF, true); pos+=2; } } return new Blob([view], {type:'audio/wav'}); } const blob = encodeWAV(newBuf); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='trimmed.wav'; a.click(); };
}

/* 13) Video Frame Export */
function openVideoTool(){
  openModal('📹 Video Frame Export', `<p class="small">Export a frame from video</p><input id="vidFile" type="file" accept="video/*" class="input"><input id="vidTime" class="input" placeholder="Time in seconds"><div class="actions"><button class="btn" id="captureFrameBtn">Capture Frame</button></div><canvas id="vidCanvas" class="preview" style="width:100%;height:220px"></canvas>`);
  let videoURL=null;
  $('vidFile').addEventListener('change', e=>{ const f=e.target.files[0]; if(!f) return; videoURL = URL.createObjectURL(f); });
  $('captureFrameBtn').onclick = async ()=>{ if(!videoURL){ alert('Choose video'); return; } const t = parseFloat($('vidTime').value)||0; const v = document.createElement('video'); v.src = videoURL; v.muted=true; await v.play().catch(()=>{}); v.pause(); v.currentTime = Math.min(t, v.duration || t); v.addEventListener('seeked', ()=>{ const cvs = $('vidCanvas'); const ctx = cvs.getContext('2d'); cvs.width = cvs.clientWidth * devicePixelRatio; cvs.height = 220 * devicePixelRatio; ctx.drawImage(v,0,0,cvs.width,cvs.height); cvs.toBlob(b=>{ const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download='frame.png'; a.click(); }, 'image/png'); }, {once:true}); };
}

/* 14) Password Generator */
function openPassword(){
  openModal('🔐 Password Generator', `<p class="small">Generate secure passwords</p><input id="pwLen" class="input" type="number" value="16" min="4" max="128"><div class="actions"><button class="btn" id="genPwBtn">Generate</button></div><div class="preview" id="pwBox"></div>`);
  $('genPwBtn').onclick = ()=>{ const l=parseInt($('pwLen').value)||16; const chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'; const arr = new Uint32Array(l); (window.crypto||window.msCrypto).getRandomValues(arr); let out=''; for(let i=0;i<l;i++) out += chars[arr[i]%chars.length]; $('pwBox').innerHTML = `<code>${out}</code><div style="margin-top:8px"><button class="btn" onclick="navigator.clipboard.writeText('${out}')">Copy</button></div>`; };
}

/* 15) Gradient Maker */
function openGrad(){
  openModal('🌈 
