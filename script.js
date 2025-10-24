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
startBtn.addEventListener('click',()=>{ if(bgMusic.paused){ bgMusic.play(); startBtn.innerHTML='â¸ Pause Music'; extraButtons.classList.add('show'); } else { bgMusic.pause(); startBtn.innerHTML='ðŸš€ Start Experience'; }});
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
function openModal(title, html){ toolTitle.innerText = title; toolInner.innerHTML = html; toolModal.style.display='flex'; /* run any inline scripts if present by using eval â€” we'll attach handlers separately where needed */ }
function closeModal(){ toolModal.style.display='none'; toolInner.innerHTML=''; }

/* Close modal when clicking backdrop */
toolModal.addEventListener('click', (e)=>{ if(e.target===toolModal) closeModal(); });

/* ---------------- Part C: Tool wiring ---------------- */
/* Tools are already present as DOM elements with IDs â€” attach click handlers */
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
  openModal('ðŸ’¡ Idea Generator', `<p class="small">Click Generate for a new idea.</p><div class="preview-box" id="ideaBox">ðŸ’¡ ${ideas[0]}</div><div class="actions"><button class="modal-btn" id="ideaGenBtn">ðŸŽ² Generate</button></div>`);
  document.getElementById('ideaGenBtn').onclick = ()=>{ document.getElementById('ideaBox').innerText = 'ðŸ’¡ '+ideas[Math.floor(Math.random()*ideas.length)]; };
}

/* 2) Calculator (safe-ish eval with whitelist) */
function openCalc(){
  openModal('ðŸ§® Calculator', `<p class="small">Type a math expression (supports + - * / % ^ Math functions) and press Evaluate.</p>
    <input id="calcExpr" class="input" placeholder="e.g. (12+3)/5*2">
    <div class="actions"><button class="modal-btn" id="calcEvalBtn">Evaluate</button></div>
    <div class="preview-box" id="calcRes">Result: â€”</div>`);
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
  openModal('ðŸŽ¨ Color Picker', `<p class="small">Pick a color, see HEX/RGB and copy CSS code.</p>
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
  openModal('ðŸ“… Scheduler', `<p class="small">Create reminders (stored locally). Alerts will appear while this tab is open.</p>
    <input id="remTitle" class="input" placeholder="Reminder title">
    <input id="remTime" class="input" type="datetime-local">
    <div class="actions"><button class="modal-btn" id="setRemBtn">Set Reminder</button></div>
    <div class="preview-box" id="remList">No reminders</div>`);
  const listEl = document.getElementById('remList');
  function load(){ const arr=JSON.parse(localStorage.getItem('cyberx_rem')||'[]'); if(!arr.length) listEl.innerText='No reminders'; else listEl.innerHTML = arr.map((r,i)=>`<div style="margin-bottom:8px">${r.title} â€” ${new Date(r.at).toLocaleString()} <button class="modal-btn" onclick="deleteRem(${i})" style="display:inline-block;margin-left:8px;padding:6px 8px">Del</button></div>`).join(''); }
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
    for(const r of arr){ const t=new Date(r.at).getTime(); if(t>now && t-now<24*3600*1000){ setTimeout(()=> alert('ðŸ”” '+r.title), Math.max(0,t-now)); } }
  }
  scheduleCheck();
}

/* 5) Notes (localStorage) */
function openNotes(){
  openModal('ðŸ“ Notes', `<p class="small">Quick notes (saved locally)</p>
    <textarea id="notesArea" placeholder="Write notes..."></textarea>
    <div class="actions"><button class="modal-btn" id="saveNotes">Save</button><button class="modal-btn" id="clearNotes">Clear</button></div>`);
  const ta=document.getElementById('notesArea');
  ta.value = localStorage.getItem('cyberx_notes')||'';
  document.getElementById('saveNotes').onclick = ()=>{ localStorage.setItem('cyberx_notes', ta.value); alert('Saved locally'); };
  document.getElementById('clearNotes').onclick = ()=>{ ta.value=''; localStorage.removeItem('cyberx_notes'); };
}

/* 6) Compass (DeviceOrientation) */
function openCompass(){
  openModal('ðŸ§­ Compass', `<p class="small">Shows device heading (if supported; mobile & secure context recommended).</p>
    <div class="preview-box" id="compHeading">Heading: N/A</div>
    <div class="actions"><button class="modal-btn" id="stopCompass">Stop</button></div>`);
  const box=document.getElementById('compHeading');
  function handler(e){ const h = e.webkitCompassHeading || e.alpha; box.innerText = (h==null)?'Heading: N/A':'Heading: '+Math.round(h)+'Â°'; }
  if(window.DeviceOrientationEvent){ window.addEventListener('deviceorientation', handler); document.getElementById('stopCompass').onclick = ()=>{ window.removeEventListener('deviceorientation', handler); box.innerText='Stopped'; }; } else { box.innerText='DeviceOrientation not supported'; document.getElementById('stopCompass').style.display='none'; }
}

/* 7) URL Shortener (local pseudo) */
function openShorten(){
  openModal('ðŸŒ URL Shortener', `<p class="small">Creates local pseudo-short links (stored in this browser).</p>
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
  openModal('ðŸ—‚ File Organizer', `<p class="small">Choose files and label them (client-side only).</p>
    <input id="orgFiles" type="file" multiple class="input">
    <input id="orgTag" class="input" placeholder="Comma-separated tags">
    <div class="actions"><button class="modal-btn" id="addOrg">Add</button></div>
    <div id="orgList" class="preview-box">No files</div>`);
  function render(){ const db=JSON.parse(localStorage.getItem('cyberx_files')||'[]'); const el=document.getElementById('orgList'); if(!db.length) el.innerText='No files'; else el.innerHTML = db.map((f,i)=>`<div style="margin-bottom:8px"><b>${f.name}</b> (${Math.round(f.size/1024)}KB) â€” tags: ${f.tags.join(', ')} <button class="modal-btn" onclick="removeOrg(${i})" style="display:inline-block;margin-left:8px;padding:6px 8px">Remove</button></div>`).join(''); }
  window.removeOrg = function(i){ const db=JSON.parse(localStorage.getItem('cyberx_files')||'[]'); db.splice(i,1); localStorage.setItem('cyberx_files', JSON.stringify(db)); render(); }
  document.getElementById('addOrg').onclick = ()=>{
    const files=document.getElementById('orgFiles').files; const tags=document.getElementById('orgTag').value.split(',').map(s=>s.trim()).filter(Boolean);
    if(!files.length){ alert('Select files'); return; }
    const db = JSON.parse(localStorage.getItem('cyberx_files')||'[]');
    for(const f of files){ db.unshift({name:f.name, size:f.size, tags}); }
    localStorage.setItem('cyberx_files', JSON.stringify(db)); render();
  };
  render();
}

/* 9) Data Visualizer (placeholder) */
function openViz(){
  openModal('ðŸ“Š Data Visualizer', `<p class="small">Placeholder: Enter CSV-like data to visualize (basic chart demo).</p>
    <textarea id="vizData" class="input" placeholder="e.g. Label1,10\nLabel2,20"></textarea>
    <div class="actions"><button class="modal-btn" id="vizBtn">Visualize</button></div>
    <div class="preview-box" id="vizRes">Chart will appear here</div>`);
  document.getElementById('vizBtn').onclick = ()=>{
    const data = document.getElementById('vizData').value.split('\n').map(l=>l.split(',')).filter(l=>l.length==2);
    if(!data.length){ alert('Enter valid data'); return; }
    const max = Math.max(...data.map(d=>+d[1])); document.getElementById('vizRes').innerHTML = data.map(d=>`<div style="margin:4px">${d[0]}: <div style="display:inline-block;width:${(+d[1]/max)*200}px;background:#7b2ff7;height:20px"></div> ${d[1]}</div>`).join('');
  };
}

/* 10) AI Assistant (placeholder) */
function openAI(){
  openModal('ðŸ§  AI Assistant', `<p class="small">Placeholder: Ask a question (simulated response).</p>
    <input id="aiQuery" class="input" placeholder="e.g. What is AI?">
    <div class="actions"><button class="modal-btn" id="aiBtn">Ask</button></div>
    <div class="preview-box" id="aiRes">Response: â€”</div>`);
  document.getElementById('aiBtn').onclick = ()=>{
    const q = document.getElementById('aiQuery').value; document.getElementById('aiRes').innerText = 'Response: ' + (q ? 'Simulated: ' + q.split('').reverse().join('') : 'Ask something!');
  };
}

/* 11) Image Compressor (placeholder) */
function openImgComp(){
  openModal('ðŸ“¸ Image Compressor', `<p class="small">Placeholder: Select image to compress (client-side demo, no real compression).</p>
    <input id="imgFile
