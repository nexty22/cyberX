/* CyberX script.js
   - Handles loader, particles, music, modal, tools logic
   - 25 tools implemented (one-at-a-time modal)
// Note: QR and IP use public APIs (need internet). Other tools offline.
*/

document.addEventListener('DOMContentLoaded', ()=> {
  // loader
  let p = 0;
  const prEl = document.getElementById('progress');
  const loader = document.getElementById('loader');
  const id = setInterval(()=>{
    p += Math.ceil(Math.random()*5);
    if(p > 100) p = 100;
    prEl.innerText = p + '%';
    if(p >= 100){
      clearInterval(id);
      loader.style.transition = 'opacity .6s, transform .6s';
      loader.style.opacity = '0';
      loader.style.transform = 'scale(1.02)';
      setTimeout(()=> loader.remove(), 600);
    }
  }, 60);

  setupParticles();
  buildToolsGrid();
  hookUI();
});

/* ---------- Particles ---------- */
function setupParticles(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);
  const particles = [];
  for(let i=0;i<90;i++){
    particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.8+0.5,vx:(Math.random()-0.5)*0.6,vy:(Math.random()-0.5)*0.6});
  }
  (function anim(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>canvas.width) p.vx *= -1;
      if(p.y<0||p.y>canvas.height) p.vy *= -1;
      ctx.fillStyle = 'rgba(123,47,247,0.6)';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(anim);
  })();
}

/* ---------- UI Hooks ---------- */
function hookUI(){
  const modeToggle = document.getElementById('modeToggle');
  const contactBtn = document.getElementById('contactBtn');
  const contactModal = document.getElementById('contactModal');
  const startBtn = document.getElementById('startBtn');
  const bgMusic = document.getElementById('bgMusic');
  const bottomButtons = document.getElementById('bottomButtons');
  const toolsBtn = document.getElementById('toolsBtn');
  const toolsPanel = document.getElementById('toolsPanel');
  const toolModal = document.getElementById('toolModal');
  const closeModal = document.getElementById('closeModal');

  modeToggle.addEventListener('click', ()=> document.body.classList.toggle('light-mode'));

  contactBtn.addEventListener('click', ()=>{
    contactModal.classList.add('show');
    contactModal.setAttribute('aria-hidden','false');
  });
  contactModal.addEventListener('click', (e)=> { if(e.target === contactModal) closeContact(); });
  window.closeContact = function(){ contactModal.classList.remove('show'); contactModal.setAttribute('aria-hidden','true'); };

  // Start Experience: toggle play/pause music and show bottom buttons once (do not hide buttons when pausing)
  let started = false;
  startBtn.addEventListener('click', ()=>{
    if(bgMusic.paused){
      bgMusic.play().catch(()=>{});
      startBtn.innerHTML = '⏸ Pause Music';
      bottomButtons.classList.add('show');
      started = true;
    } else {
      bgMusic.pause();
      startBtn.innerHTML = '🚀 Start Experience';
      // keep bottomButtons visible (per your request)
    }
  });

  // Tools button toggles tools panel (single click - opens/closes)
  toolsBtn.addEventListener('click', ()=>{
    toolsPanel.classList.toggle('show');
    if(toolsPanel.classList.contains('show')) toolsPanel.scrollIntoView({behavior:'smooth'});
  });

  // modal close
  closeModal.addEventListener('click', closeToolModal);
  toolModal.addEventListener('click', (e)=> { if(e.target === toolModal) closeToolModal(); });

  // hooking grid clicks delegated
  document.getElementById('toolsGrid').addEventListener('click', async (e)=>{
    const card = e.target.closest('[data-tool]');
    if(!card) return;
    const id = card.getAttribute('data-tool');
    await openToolModal(id);
  });

  // Coming soon
  document.getElementById('soon1').addEventListener('click', ()=> alert('🚧 Feature coming soon...'));
  document.getElementById('soon2').addEventListener('click', ()=> alert('🚧 Feature coming soon...'));
}

/* ---------- Tools Grid Builder (25 tools) ---------- */
const TOOLS = [
  { id:'calculator', name:'Calculator' },
  { id:'password', name:'Password Generator' },
  { id:'qr', name:'QR Code Generator' },
  { id:'base64', name:'Base64 Encode/Decode' },
  { id:'binary', name:'Binary ↔ Text' },
  { id:'unit', name:'Unit Converter (m/ft, kg/lb, C/F)' },
  { id:'bmi', name:'BMI Calculator' },
  { id:'age', name:'Age Calculator' },
  { id:'color', name:'Color Picker' },
  { id:'rgbhex', name:'RGB ↔ HEX' },
  { id:'notes', name:'Notes (local)' },
  { id:'todo', name:'Todo List (local)' },
  { id:'stopwatch', name:'Stopwatch' },
  { id:'timer', name:'Timer' },
  { id:'rng', name:'Random Number' },
  { id:'json', name:'JSON Formatter' },
  { id:'urlenc', name:'URL Encode/Decode' },
  { id:'textcase', name:'Text Case Changer' },
  { id:'textcount', name:'Text/Word Counter' },
  { id:'currency', name:'Currency (sample rates)' },
  { id:'ip', name:'IP Finder' },
  { id:'clock', name:'Live Clock' },
  { id:'tts', name:'Text → Speech' },
  { id:'stt', name:'Speech → Text' },
  { id:'image2b64', name:'Image → Base64' }
];

function buildToolsGrid(){
  const grid = document.getElementById('toolsGrid');
  TOOLS.forEach(t=>{
    const d = document.createElement('div');
    d.className = 'card';
    d.setAttribute('data-tool', t.id);
    d.innerHTML = `<div style="text-align:center"><div style="font-size:18px">⚙️</div><div style="margin-top:8px">${t.name}</div></div>`;
    grid.appendChild(d);
  });
}

/* ---------- Modal control ---------- */
function closeToolModal(){
  const modal = document.getElementById('toolModal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
  document.getElementById('modalTitle').innerText = '';
  document.getElementById('modalBody').innerHTML = '';
}

/* ---------- Tool Renderer Dispatcher ---------- */
async function openToolModal(id){
  const modal = document.getElementById('toolModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  title.innerText = TOOLS.find(t=>t.id===id).name || id;
  body.innerHTML = '<p style="opacity:.8">Loading...</p>';
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');

  // small delay for better UX
  await new Promise(r=>setTimeout(r,80));

  switch(id){
    case 'calculator': renderCalculator(body); break;
    case 'password': renderPassword(body); break;
    case 'qr': renderQR(body); break;
    case 'base64': renderBase64(body); break;
    case 'binary': renderBinary(body); break;
    case 'unit': renderUnit(body); break;
    case 'bmi': renderBMI(body); break;
    case 'age': renderAge(body); break;
    case 'color': renderColorPicker(body); break;
    case 'rgbhex': renderRgbHex(body); break;
    case 'notes': renderNotes(body); break;
    case 'todo': renderTodo(body); break;
    case 'stopwatch': renderStopwatch(body); break;
    case 'timer': renderTimer(body); break;
    case 'rng': renderRng(body); break;
    case 'json': renderJSON(body); break;
    case 'urlenc': renderUrlEnc(body); break;
    case 'textcase': renderTextCase(body); break;
    case 'textcount': renderTextCount(body); break;
    case 'currency': renderCurrency(body); break;
    case 'ip': renderIP(body); break;
    case 'clock': renderClock(body); break;
    case 'tts': renderTTS(body); break;
    case 'stt': renderSTT(body); break;
    case 'image2b64': renderImageToBase64(body); break;
    default: body.innerHTML = '<p>Tool not implemented.</p>';
  }
}

/* ----------------- Tool Implementations ----------------- */

/* 1 Calculator */
function renderCalculator(container){
  container.innerHTML = `
    <div style="display:flex;gap:8px;margin-bottom:8px">
      <input id="calc_expr" class="input" placeholder="Enter expression, e.g. (2+3)*4" />
      <button class="small-btn" id="calc_eval">=</button>
    </div>
    <div class="output" id="calc_out">Result</div>
  `;
  document.getElementById('calc_eval').onclick = ()=>{
    const expr = document.getElementById('calc_expr').value || '';
    try{
      // safer eval: allow digits and operators only (simple)
      if(!/^[0-9+\-*/().,\s%]+$/.test(expr)) throw 'Invalid characters';
      const res = Function('"use strict";return ('+expr.replace(/,/g,'.')+')')();
      document.getElementById('calc_out').textContent = String(res);
    }catch(e){ document.getElementById('calc_out').textContent = 'Error'; }
  };
}

/* 2 Password */
function renderPassword(container){
  container.innerHTML = `
    <label>Length</label><input id="pw_len" class="input" type="number" value="16" min="4" max="128" />
    <div style="margin-top:8px"><button class="small-btn" id="pw_gen">Generate</button><button class="small-btn" id="pw_copy">Copy</button></div>
    <div class="output" id="pw_out">—</div>
  `;
  document.getElementById('pw_gen').onclick = ()=>{
    const len = Math.max(4, Number(document.getElementById('pw_len').value)||16);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let out=''; for(let i=0;i<len;i++) out += chars.charAt(Math.floor(Math.random()*chars.length));
    document.getElementById('pw_out').textContent = out;
  };
  document.getElementById('pw_copy').onclick = ()=>{
    const t = document.getElementById('pw_out').textContent || '';
    if(t && navigator.clipboard) navigator.clipboard.writeText(t).then(()=> alert('Copied'));
  };
}

/* 3 QR (online API) */
function renderQR(container){
  container.innerHTML = `
    <input id="qr_text" class="input" placeholder="Text or URL" />
    <div style="margin-top:8px"><button class="small-btn" id="qr_gen">Generate</button></div>
    <div id="qr_out" style="margin-top:12px"></div>
  `;
  document.getElementById('qr_gen').onclick = ()=>{
    const v = document.getElementById('qr_text').value.trim();
    if(!v) return (document.getElementById('qr_out').textContent='Enter text');
    // public qr api (needs internet)
    const url = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data='+encodeURIComponent(v);
    document.getElementById('qr_out').innerHTML = `<img src="${url}" alt="QR" style="max-width:250px"/>`;
  };
}

/* 4 Base64 */
function renderBase64(container){
  container.innerHTML = `
    <textarea id="b64_text" class="input" placeholder="Text or Base64"></textarea>
    <div><button class="small-btn" id="b64_e">Encode</button><button class="small-btn" id="b64_d">Decode</button></div>
    <div class="output" id="b64_out">—</div>
  `;
  document.getElementById('b64_e').onclick = ()=> {
    try{ const v=document.getElementById('b64_text').value||''; document.getElementById('b64_out').textContent = btoa(unescape(encodeURIComponent(v))); }catch(e){ document.getElementById('b64_out').textContent='Error';}
  };
  document.getElementById('b64_d').onclick = ()=> {
    try{ const v=document.getElementById('b64_text').value||''; document.getElementById('b64_out').textContent = decodeURIComponent(escape(atob(v))); }catch(e){ document.getElementById('b64_out').textContent='Invalid Base64';}
  };
}

/* 5 Binary */
function renderBinary(container){
  container.innerHTML = `
    <input id="bin_text" class="input" placeholder="Text or binary" />
    <div style="margin-top:8px"><button class="small-btn" id="t2b">Text → Binary</button><button class="small-btn" id="b2t">Binary → Text</button></div>
    <div class="output" id="bin_out">—</div>
  `;
  document.getElementById('t2b').onclick = ()=> {
    const s = document.getElementById('bin_text').value||''; const arr=[]; for(let i=0;i<s.length;i++) arr.push(s.charCodeAt(i).toString(2).padStart(8,'0'));
    document.getElementById('bin_out').textContent = arr.join(' ');
  };
  document.getElementById('b2t').onclick = ()=> {
    const s = document.getElementById('bin_text').value||''; try{ const parts = s.trim().split(/\s+/); const chars = parts.map(b=>String.fromCharCode(parseInt(b,2))); document.getElementById('bin_out').textContent = chars.join(''); }catch(e){ document.getElementById('bin_out').textContent='Invalid binary';}
  };
}

/* 6 Unit Converter */
function renderUnit(container){
  container.innerHTML = `
    <select id="unit_type" class="input"><option value="mft">Length (m ↔ ft)</option><option value="kg">Weight (kg ↔ lb)</option><option value="temp">Temp (°C ↔ °F)</option></select>
    <input id="unit_val" class="input" placeholder="Value" />
    <div><button class="small-btn" id="unit_f">Convert →</button><button class="small-btn" id="unit_b">Convert ←</button></div>
    <div class="output" id="unit_out">—</div>
  `;
  function unitConv(dir){
    const type = document.getElementById('unit_type').value; const v = Number(document.getElementById('unit_val').value);
    if(isNaN(v)){ document.getElementById('unit_out').textContent='Enter number'; return; }
    let res='';
    if(type==='mft') res = dir==='f' ? (v*3.28084).toFixed(4)+' ft' : (v/3.28084).toFixed(4)+' m';
    else if(type==='temp') res = dir==='f' ? (v*9/5+32).toFixed(2)+' °F' : ((v-32)*5/9).toFixed(2)+' °C';
    else res = dir==='f' ? (v*2.20462).toFixed(4)+' lb' : (v/2.20462).toFixed(4)+' kg';
    document.getElementById('unit_out').textContent = res;
  }
  document.getElementById('unit_f').onclick = ()=> unitConv('f');
  document.getElementById('unit_b').onclick = ()=> unitConv('b');
}

/* 7 BMI */
function renderBMI(container){
  container.innerHTML = `
    <input id="bmi_w" class="input" placeholder="Weight (kg)" /><input id="bmi_h" class="input" placeholder="Height (cm)" />
    <div><button class="small-btn" id="bmi_go">Calculate</button></div>
    <div class="output" id="bmi_out">—</div>
  `;
  document.getElementById('bmi_go').onclick = ()=>{
    const w = parseFloat(document.getElementById('bmi_w').value), hcm = parseFloat(document.getElementById('bmi_h').value);
    if(!w||!hcm){ document.getElementById('bmi_out').textContent='Enter values'; return; }
    const h = hcm/100, bmi = (w/(h*h)).toFixed(2);
    let s = bmi<18.5?'Underweight':bmi<25?'Normal':bmi<30?'Overweight':'Obese';
    document.getElementById('bmi_out').textContent = `${bmi} (${s})`;
  };
}

/* 8 Age */
function renderAge(container){
  container.innerHTML = `<input type="date" id="birth" class="input" /><div><button class="small-btn" id="age_go">Get Age</button></div><div class="output" id="age_out">—</div>`;
  document.getElementById('age_go').onclick = ()=>{
    const d = document.getElementById('birth').value; if(!d) return document.getElementById('age_out').textContent='Select date';
    const b = new Date(d), now=new Date(); let years = now.getFullYear()-b.getFullYear(), months = now.getMonth()-b.getMonth(), days = now.getDate()-b.getDate();
    if(days<0){ months--; days += new Date(now.getFullYear(), now.getMonth(),0).getDate(); }
    if(months<0){ years--; months += 12; }
    document.getElementById('age_out').textContent = `${years}y ${months}m ${days}d`;
  };
}

/* 9 Color Picker */
function renderColorPicker(container){
  container.innerHTML = `<input type="color" id="color_in" class="input" value="#7b2ff7"/><div><button class="small-btn" id="color_show">Show</button></div><div class="output" id="color_out">—</div>`;
  document.getElementById('color_show').onclick = ()=> {
    const v = document.getElementById('color_in').value; document.getElementById('color_out').textContent = `HEX: ${v} • RGB: ${hexToRgb(v)}`;
  };
}

/* 10 RGB <-> HEX */
function renderRgbHex(container){
  container.innerHTML = `<input id="rgbhex_in" class="input" placeholder="#ff00cc or 255,0,204" /><div><button class="small-btn" id="rgbhex_go">Convert</button></div><div class="output" id="rgbhex_out">—</div>`;
  document.getElementById('rgbhex_go').onclick = ()=>{
    const v=document.getElementById('rgbhex_in').value.trim(); const out=document.getElementById('rgbhex_out');
    if(v.startsWith('#')) out.textContent = hexToRgb(v); else { const parts = v.split(',').map(s=>Number(s.trim())); if(parts.length===3 && parts.every(n=>!isNaN(n))) out.textContent = rgbToHex(parts[0],parts[1],parts[2]); else out.textContent='Enter #hex or r,g,b'; }
  };
}

/* 11 Notes (local) */
function renderNotes(container){
  container.innerHTML = `<textarea id="notes_in" class="input" style="height:160px"></textarea><div style="margin-top:8px"><button class="small-btn" id="notes_save">Save</button><button class="small-btn" id="notes_load">Load</button></div><div class="output" id="notes_out">—</div>`;
  document.getElementById('notes_save').onclick = ()=> { localStorage.setItem('cyberx_notes', document.getElementById('notes_in').value); document.getElementById('notes_out').textContent='Saved'; };
  document.getElementById('notes_load').onclick = ()=> { document.getElementById('notes_in').value = localStorage.getItem('cyberx_notes')||''; document.getElementById('notes_out').textContent='Loaded'; };
}

/* 12 Todo */
function renderTodo(container){
  container.innerHTML = `<input id="todo_in" class="input" placeholder="New todo" /><div style="margin-top:8px"><button class="small-btn" id="todo_add">Add</button><button class="small-btn" id="todo_clear">Clear</button></div><div class="output" id="todo_out">—</div>`;
  function render(){ const out = document.getElementById('todo_out'); const list = JSON.parse(localStorage.getItem('cyberx_todos')||'[]'); if(!list.length) return out.textContent='No todos'; out.innerHTML=''; list.forEach((it,i)=>{ const div = document.createElement('div'); div.style.display='flex'; div.style.justifyContent='space-between'; div.style.marginBottom='6px'; const s = document.createElement('span'); s.textContent = it; const b = document.createElement('button'); b.textContent='Del'; b.className='small-btn'; b.onclick = ()=>{ list.splice(i,1); localStorage.setItem('cyberx_todos', JSON.stringify(list)); render(); }; div.appendChild(s); div.appendChild(b); out.appendChild(div); }); }
  document.getElementById('todo_add').onclick = ()=> { const v = document.getElementById('todo_in').value.trim(); if(!v) return; const list = JSON.parse(localStorage.getItem('cyberx_todos')||'[]'); list.push(v); localStorage.setItem('cyberx_todos', JSON.stringify(list)); document.getElementById('todo_in').value=''; render(); };
  document.getElementById('todo_clear').onclick = ()=> { localStorage.removeItem('cyberx_todos'); render(); };
  render();
}

/* 13 Stopwatch */
let swTimer = null, swStart = 0, swElapsed = 0;
function renderStopwatch(container){
  container.innerHTML = `<div style="display:flex;gap:8px"><button class="small-btn" id="sw_start">Start</button><button class="small-btn" id="sw_stop">Stop</button><button class="small-btn" id="sw_reset">Reset</button></div><div class="output" id="sw_out">00:00:00.000</div>`;
  document.getElementById('sw_start').onclick = ()=> { if(swTimer) return; swStart = performance.now() - swElapsed; swTimer = setInterval(()=>{ swElapsed = performance.now() - swStart; document.getElementById('sw_out').textContent = formatTime(swElapsed); },31); };
  document.getElementById('sw_stop').onclick = ()=> { clearInterval(swTimer); swTimer = null; };
  document.getElementById('sw_reset').onclick = ()=> { clearInterval(swTimer); swTimer=null; swElapsed=0; document.getElementById('sw_out').textContent='00:00:00.000'; };
}

/* 14 Timer */
let timerInterval = null;
function renderTimer(container){
  container.innerHTML = `<input id="timer_seconds" class="input" placeholder="Seconds" /><div><button class="small-btn" id="timer_start">Start</button><button class="small-btn" id="timer_stop">Stop</button></div><div class="output" id="timer_out">—</div>`;
  document.getElementById('timer_start').onclick = ()=> {
    let s = Math.max(1, Number(document.getElementById('timer_seconds').value)||10); clearInterval(timerInterval); document.getElementById('timer_out').textContent = s+'s';
    timerInterval = setInterval(()=>{ s--; document.getElementById('timer_out').textContent = s+'s'; if(s<=0){ clearInterval(timerInterval); document.getElementById('timer_out').textContent='Done'; } },1000);
  };
  document.getElementById('timer_stop').onclick = ()=> { clearInterval(timerInterval); document.getElementById('timer_out').textContent='Stopped'; };
}

/* 15 RNG */
function renderRng(container){
  container.innerHTML = `<input id="rng_min" class="input" placeholder="Min" /><input id="rng_max" class="input" placeholder="Max" /><div><button class="small-btn" id="rng_gen">Generate</button></div><div class="output" id="rng_out">—</div>`;
  document.getElementById('rng_gen').onclick = ()=> {
    const min = Number(document.getElementById('rng_min').value) || 0, max = Number(document.getElementById('rng_max').value) || 100;
    const n = Math.floor(Math.random()*(max-min+1))+min; document.getElementById('rng_out').textContent = String(n);
  };
}

/* 16 JSON Formatter */
function renderJSON(container){
  container.innerHTML = `<textarea id="json_in" class="input" style="height:160px" placeholder='Paste JSON here'></textarea><div><button class="small-btn" id="json_pretty">Format</button><button class="small-btn" id="json_min">Minify</button></div><div class="output" id="json_out">—</div>`;
  document.getElementById('json_pretty').onclick = ()=> {
    try{ const j = JSON.parse(document.getElementById('json_in').value); document.getElementById('json_out').textContent = JSON.stringify(j,null,2); }catch(e){ document.getElementById('json_out').textContent='Invalid JSON'; }
  };
  document.getElementById('json_min').onclick = ()=> {
    try{ const j = JSON.parse(document.getElementById('json_in').value); document.getElementById('json_out').textContent = JSON.stringify(j); }catch(e){ document.getElementById('json_out').textContent='Invalid JSON'; }
  };
}

/* 17 URL Encode/Decode */
function renderUrlEnc(container){
  container.innerHTML = `<input id="url_in" class="input" placeholder="Text or URL" /><div><button class="small-btn" id="url_enc">Encode</button><button class="small-btn" id="url_dec">Decode</button></div><div class="output" id="url_out">—</div>`;
  document.getElementById('url_enc').onclick = ()=> { const v=document.getElementById('url_in').value||''; document.getElementById('url_out').textContent = encodeURIComponent(v); };
  document.getElementById('url_dec').onclick = ()=> { const v=document.getElementById('url_in').value||''; try{ document.getElementById('url_out').textContent = decodeURIComponent(v); }catch(e){ document.getElementById('url_out').textContent='Invalid encoding'; } };
}

/* 18 Text Case Changer */
function renderTextCase(container){
  container.innerHTML = `<textarea id="case_in" class="input" style="height:140px"></textarea><div><button class="small-btn" id="upper">UPPER</button><button class="small-btn" id="lower">lower</button><button class="small-btn" id="title">Title Case</button></div><div class="output" id="case_out">—</div>`;
  document.getElementById('upper').onclick = ()=> { const v=document.getElementById('case_in').value||''; document.getElementById('case_out').textContent = v.toUpperCase(); };
  document.getElementById('lower').onclick = ()=> { const v=document.getElementById('case_in').value||''; document.getElementById('case_out').textContent = v.toLowerCase(); };
  document.getElementById('title').onclick = ()=> { const v=document.getElementById('case_in').value||''; document.getElementById('case_out').textContent = v.replace(/\w\S*/g, w => w.charAt(0).toUpperCase()+w.substr(1).toLowerCase()); };
}

/* 19 Text/Word Counter */
function renderTextCount(container){
  container.innerHTML = `<textarea id="cnt_in" class="input" style="height:140px"></textarea><div><button class="small-btn" id="cnt_go">Count</button></div><div class="output" id="cnt_out">—</div>`;
  document.getElementById('cnt_go').onclick = ()=> {
    const v = document.getElementById('cnt_in').value || '';
    const chars = v.length;
    const words = v.trim() ? v.trim().split(/\s+/).length : 0;
    document.getElementById('cnt_out').textContent = `Words: ${words} • Characters: ${chars}`;
  };
}

/* 20 Currency (sample rates) */
function renderCurrency(container){
  container.innerHTML = `<div style="display:flex;gap:8px"><select id="cur_from" class="input"><option>USD</option><option>EUR</option><option>GBP</option></select><select id="cur_to" class="input"><option>PKR</option><option>USD</option><option>EUR</option></select></div><input id="cur_amt" class="input" placeholder="Amount" /><div><button class="small-btn" id="cur_go">Convert</button></div><div class="output" id="cur_out">—</div>`;
  document.getElementById('cur_go').onclick = ()=> {
    const rates = { USD:1, EUR:0.93, GBP:0.82, PKR:280 }; // sample
    const from = document.getElementById('cur_from').value, to = document.getElementById('cur_to').value, amt = Number(document.getElementById('cur_amt').value)||0;
    const usd = amt / (rates[from]||1), res = usd * (rates[to]||1);
    document.getElementById('cur_out').textContent = `${res.toFixed(2)} ${to} (sample rates)`;
  };
}

/* 21 IP Finder (online) */
async function renderIP(container){
  container.innerHTML = `<div><button class="small-btn" id="ip_go">Get IP</button></div><div class="output" id="ip_out">—</div>`;
  document.getElementById('ip_go').onclick = async ()=> {
    const out = document.getElementById('ip_out'); out.textContent='Checking...';
    try{ const r = await fetch('https://api.ipify.org?format=json'); const j = await r.json(); out.textContent = j.ip; }catch(e){ out.textContent='Unable to fetch (offline?)'; }
  };
}

/* 22 Live Clock */
function renderClock(container){
  container.innerHTML = `<div class="output" id="clock_out" style="font-family:monospace;font-size:18px"></div>`;
  function upd(){ document.getElementById('clock_out').textContent = new Date().toLocaleString(); }
  upd(); setInterval(upd,1000);
}

/* 23 TTS */
function renderTTS(container){
  container.innerHTML = `<input id="tts_in" class="input" placeholder="Text to speak" /><div><button class="small-btn" id="tts_go">Speak</button></div><div class="output" id="tts_out">—</div>`;
  document.getElementById('tts_go').onclick = ()=>{
    const t = document.getElementById('tts_in').value || '';
    if(!('speechSynthesis' in window)) return document.getElementById('tts_out').textContent='TTS not supported';
    const u = new SpeechSynthesisUtterance(t); speechSynthesis.speak(u); document.getElementById('tts_out').textContent='Speaking...'; u.onend = ()=> document.getElementById('tts_out').textContent='Done';
  };
}

/* 24 STT (browser support) */
function renderSTT(container){
  container.innerHTML = `<div><button class="small-btn" id="stt_btn">Start Listening</button></div><div class="output" id="stt_out">—</div>`;
  let rec = null; const out = container.querySelector('#stt_out'), btn = container.querySelector('#stt_btn');
  btn.onclick = ()=>{
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) return out.textContent='Speech recognition not supported';
    if(rec){ rec.stop(); rec=null; btn.textContent='Start Listening'; out.textContent='Stopped'; return; }
    rec = new SR(); rec.lang='en-US'; rec.interimResults=true;
    rec.onresult = ev => out.textContent = Array.from(ev.results).map(r=>r[0].transcript).join('');
    rec.onerror = e => { out.textContent = 'Error: '+e.error; rec=null; };
    rec.onend = ()=> { btn.textContent='Start Listening'; rec=null; };
    rec.start(); btn.textContent='Stop Listening'; out.textContent='Listening...';
  };
}

/* 25 Image -> Base64 */
function renderImageToBase64(container){
  container.innerHTML = `<input type="file" id="img_file" accept="image/*" /><div><button class="small-btn" id="img_go">Convert</button></div><div class="output" id="img_out">—</div>`;
  document.getElementById('img_go').onclick = ()=> {
    const f = document.getElementById('img_file').files[0]; const out = document.getElementById('img_out');
    if(!f) return out.textContent='Select file';
    const r = new FileReader();
    r.onload = e => { out.textContent = e.target.result.slice(0,200)+'...'; const im = document.createElement('img'); im.src = e.target.result; im.style.maxWidth='160px'; im.style.display='block'; im.style.marginTop='8px'; out.appendChild(im); };
    r.readAsDataURL(f);
  };
}

/* ---------- Helpers ---------- */
function hexToRgb(hex){ try{ const h = hex.replace('#',''); const bi = parseInt(h,16); const r=(bi>>16)&255,g=(bi>>8)&255,b=bi&255; return `${r}, ${g}, ${b}` }catch(e){ return '' } }
function rgbToHex(r,g,b){ return '#'+[r,g,b].map(x=>Number(x).toString(16).padStart(2,'0')).join('') }
function formatTime(ms){ const h = Math.floor(ms/3600000), m = Math.floor((ms%3600000)/60000), s = Math.floor((ms%60000)/1000), msx = Math.floor(ms%1000); return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(msx).padStart(3,'0')}` }

/* openToolModal is async, but we already used above */    case 'clock': renderClock(); break;
    default:
      toolUi.innerHTML = '<p>Tool not found.</p>';
  }
}

/* -------- Helpers & each tool renderers -------- */

function friendlyName(key){
  const map = {
    password:'Password Generator',
    qr:'QR Code Generator',
    base64:'Base64 Encode / Decode',
    binary:'Binary ↔ Text',
    unit:'Unit Converter',
    img2b64:'Image → Base64',
    tts:'Text → Speech',
    stt:'Speech → Text',
    color:'Color Picker',
    rgbhex:'RGB ↔ HEX',
    bmi:'BMI Calculator',
    age:'Age Calculator',
    currency:'Currency Converter',
    countdown:'Countdown Timer',
    stopwatch:'Stopwatch',
    rng:'Random Number',
    notes:'Notes (local)',
    todo:'Todo List (local)',
    ip:'IP Detector',
    clock:'Live Clock'
  };
  return map[key] || key;
}

/* 1 Password */
function renderPassword(){
  toolUi.innerHTML = `
    <div>
      <label>Length</label>
      <input id="pw_len" type="number" min="4" max="128" value="16" />
      <button id="pw_gen" class="modal-btn">Generate</button>
      <div id="pw_out" style="margin-top:10px;font-family:monospace;"></div>
    </div>
  `;
  document.getElementById('pw_gen').addEventListener('click', () => {
    const len = Math.max(4, Number(document.getElementById('pw_len').value) || 16);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let out = '';
    for(let i=0;i<len;i++) out += chars.charAt(Math.floor(Math.random()*chars.length));
    document.getElementById('pw_out').textContent = out;
  });
}

/* 2 QR (uses api.qrserver.com online; offline shows text) */
function renderQR(){
  toolUi.innerHTML = `
    <div>
      <input id="qr_text" type="text" placeholder="Text or URL" style="width:100%;padding:8px"/>
      <button id="qr_gen" class="modal-btn">Generate</button>
      <div id="qr_out" style="margin-top:10px"></div>
    </div>
  `;
  document.getElementById('qr_gen').addEventListener('click', () => {
    const t = document.getElementById('qr_text').value.trim();
    const out = document.getElementById('qr_out');
    if(!t){ out.textContent='Enter text'; return; }
    const url = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(t);
    out.innerHTML = `<img src="${url}" alt="QR" />`;
  });
}

/* 3 Base64 */
function renderBase64(){
  toolUi.innerHTML = `
    <div>
      <input id="b64_text" type="text" placeholder="Enter text or Base64" style="width:100%;padding:8px"/>
      <div style="margin-top:8px">
        <button id="b64_enc" class="modal-btn">Encode</button>
        <button id="b64_dec" class="modal-btn">Decode</button>
      </div>
      <div id="b64_out" style="margin-top:10px;font-family:monospace;"></div>
    </div>
  `;
  document.getElementById('b64_enc').addEventListener('click', () => {
    try {
      const v = document.getElementById('b64_text').value || '';
      const enc = btoa(unescape(encodeURIComponent(v)));
      document.getElementById('b64_out').textContent = enc;
    } catch(e){ document.getElementById('b64_out').textContent = 'Error'; }
  });
  document.getElementById('b64_dec').addEventListener('click', () => {
    try {
      const v = document.getElementById('b64_text').value || '';
      const dec = decodeURIComponent(escape(atob(v)));
      document.getElementById('b64_out').textContent = dec;
    } catch(e){ document.getElementById('b64_out').textContent = 'Invalid Base64'; }
  });
}

/* 4 Binary */
function renderBinary(){
  toolUi.innerHTML = `
    <div>
      <input id="bin_text" type="text" placeholder="Text or binary" style="width:100%;padding:8px"/>
      <div style="margin-top:8px">
        <button id="t2b" class="modal-btn">Text → Binary</button>
        <button id="b2t" class="modal-btn">Binary → Text</button>
      </div>
      <div id="bin_out" style="margin-top:10px;font-family:monospace;"></div>
    </div>
  `;
  document.getElementById('t2b').addEventListener('click', () => {
    const s = document.getElementById('bin_text').value || '';
    const arr = [];
    for(let i=0;i<s.length;i++) arr.push(s.charCodeAt(i).toString(2).padStart(8,'0'));
    document.getElementById('bin_out').textContent = arr.join(' ');
  });
  document.getElementById('b2t').addEventListener('click', () => {
    const s = document.getElementById('bin_text').value || '';
    try {
      const parts = s.trim().split(/\s+/);
      const chars = parts.map(b => String.fromCharCode(parseInt(b,2)));
      document.getElementById('bin_out').textContent = chars.join('');
    } catch(e){ document.getElementById('bin_out').textContent = 'Invalid binary'; }
  });
}

/* 5 Unit */
function renderUnitConverter(){
  toolUi.innerHTML = `
    <div>
      <select id="unit_type" style="width:100%;padding:8px">
        <option value="length">Length (m ↔ ft)</option>
        <option value="temp">Temp (°C ↔ °F)</option>
        <option value="weight">Weight (kg ↔ lb)</option>
      </select>
      <input id="unit_val" type="number" style="width:100%;padding:8px;margin-top:8px" placeholder="Value"/>
      <div style="margin-top:8px">
        <button id="unit_fwd" class="modal-btn">Convert →</button>
        <button id="unit_bwd" class="modal-btn">Convert ←</button>
      </div>
      <div id="unit_out" style="margin-top:10px"></div>
    </div>
  `;
  document.getElementById('unit_fwd').addEventListener('click', ()=> unitConvert('forward'));
  document.getElementById('unit_bwd').addEventListener('click', ()=> unitConvert('back'));
  function unitConvert(dir){
    const type = document.getElementById('unit_type').value;
    const v = Number(document.getElementById('unit_val').value);
    if(isNaN(v)){ document.getElementById('unit_out').textContent='Enter number'; return; }
    let res='';
    if(type==='length'){ res = dir==='forward' ? (v*3.28084).toFixed(4)+' ft' : (v/3.28084).toFixed(4)+' m'; }
    else if(type==='temp'){ res = dir==='forward' ? (v*9/5+32).toFixed(2)+' °F' : ((v-32)*5/9).toFixed(2)+' °C'; }
    else { res = dir==='forward' ? (v*2.20462).toFixed(4)+' lb' : (v/2.20462).toFixed(4)+' kg'; }
    document.getElementById('unit_out').textContent = res;
  }
}

/* 6 Image -> Base64 */
function renderImageToBase64(){
  toolUi.innerHTML = `
    <div>
      <input id="img_file" type="file" accept="image/*"/>
      <button id="img_conv" class="modal-btn">Convert</button>
      <div id="img_out" style="margin-top:10px"></div>
    </div>
  `;
  document.getElementById('img_conv').addEventListener('click', () => {
    const f = document.getElementById('img_file').files[0];
    const out = document.getElementById('img_out');
    if(!f){ out.textContent='Select file'; return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      out.textContent = data.slice(0,200) + '...';
      const im = document.createElement('img'); im.src = data; im.style.maxWidth='160px'; im.style.display='block'; im.style.marginTop='8px';
      out.appendChild(im);
    };
    reader.readAsDataURL(f);
  });
}

/* 7 TTS */
function renderTTS(){
  toolUi.innerHTML = `
    <div>
      <input id="tts_text" type="text" placeholder="Text to speak" style="width:100%;padding:8px"/>
      <button id="tts_go" class="modal-btn">Speak</button>
      <div id="tts_out" style="margin-top:10px"></div>
    </div>
  `;
  document.getElementById('tts_go').addEventListener('click', () => {
    const text = document.getElementById('tts_text').value || '';
    if(!('speechSynthesis' in window)){ document.getElementById('tts_out').textContent='TTS not supported'; return; }
    const u = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(u);
    document.getElementById('tts_out').textContent='Speaking...';
    u.onend = ()=> document.getElementById('tts_out').textContent='Done';
  });
}

/* 8 STT (browser support) */
let sttRec = null;
function renderSTT(){
  toolUi.innerHTML = `
    <div>
      <button id="stt_btn" class="modal-btn">Start Listening</button>
      <div id="stt_out" style="margin-top:10px"></div>
    </div>
  `;
  const out = document.getElementById('stt_out');
  const btn = document.getElementById('stt_btn');
  btn.addEventListener('click', () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ out.textContent='Speech recognition not supported'; return; }
    if(sttRec){ sttRec.stop(); sttRec = null; btn.textContent='Start Listening'; out.textContent='Stopped'; return; }
    sttRec = new SR(); sttRec.lang='en-US'; sttRec.interimResults=true; sttRec.onresult = (ev)=> { out.textContent = Array.from(ev.results).map(r=>r[0].transcript).join(''); };
    sttRec.onerror = (e)=> { out.textContent = 'Error: '+e.error; sttRec=null; };
    sttRec.onend = ()=> { btn.textContent='Start Listening'; sttRec=null; };
    sttRec.start(); btn.textContent='Stop'; out.textContent='Listening...';
  });
}

/* 9 Color Picker */
function renderColorPicker(){
  toolUi.innerHTML = `
    <div>
      <input id="color_input" type="color" value="#7b2ff7"/>
      <button id="color_show" class="modal-btn">Show</button>
      <div id="color_out" style="margin-top:10px"></div>
    </div>
  `;
  document.getElementById('color_show').addEventListener('click', () => {
    const v = document.getElementById('color_input').value;
    document.getElementById('color_out').textContent = `HEX: ${v} • RGB: ${hexToRgb(v)}`;
  });
}
function hexToRgb(hex){
  const h = hex.replace('#',''); const bigint = parseInt(h,16);
  const r = (bigint>>16)&255, g=(bigint>>8)&255, b=bigint&255;
  return `${r}, ${g}, ${b}`;
}

/* 10 RGB/HEX */
function renderRgbHex(){
  toolUi.innerHTML = `
    <div>
      <input id="rgbhex_in" type="text" placeholder="#ff00cc or 255,0,204" style="width:100%;padding:8px"/>
      <button id="rgbhex_go" class="modal-btn">Convert</button>
      <div id="rgbhex_out" style="margin-top:10px"></div>
    </div>
  `;
  document.getElementById('rgbhex_go').addEventListener('click', () => {
    const v = document.getElementById('rgbhex_in').value.trim();
    const out = document.getElementById('rgbhex_out');
    if(v.startsWith('#')) out.textContent = hexToRgb(v);
    else {
      const parts = v.split(',').map(s=>Number(s.trim()));
      if(parts.length===3 && parts.every(n=>!isNaN(n))) out.textContent = rgbToHex(parts[0],parts[1],parts[2]);
      else out.textContent = 'Enter #hex or r,g,b';
    }
  });
}
function rgbToHex(r,g,b){ return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join(''); }

/* 11 BMI */
function renderBMI(){
  toolUi.innerHTML = `
    <div>
      <input id="bmi_w" type="number" placeholder="Weight (kg)" style="width:100%;padding:8px;margin-bottom:8px"/>
      <input id="bmi_h" type="number" placeholder="Height (cm)" style="width:100%;padding:8px"/>
      <button id="bmi_go" class="modal-btn">Calculate</button>
      <div id="bmi_out" style="margin-top:10px"></div>
    </div>
  `;
  document.getElementById('bmi_go').addEventListener('click', () => {
    const w = parseFloat(document.getElementById('bmi_w').value);
    const hcm = parseFloat(document.getElementById('bmi_h').value);
    if(!w||!hcm){ document.getElementById('bmi_out').textContent='Enter values'; return; }
    const h = hcm/100; const bmi = (w/(h*h)).toFixed(2);
    let s = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
    document.getElementById('bmi_out').textContent = `BMI: ${bmi} (${s})`;
  });
}

/* 12 Age */
function renderAge(){
  toolUi.innerHTML = `
    <div>
      <input id="birth_date" type="date" style="width:100%;padding:8px"/>
      <button id="age_go" class="modal-btn">Get Age</button>
      <div id="age_out" style="margin-top:10px"></div>
    </div>
  `;
  document.getElementById('age_go').addEventListener('click', () => {
    const d = document.getElementById('birth_date').value;
    if(!d){ document.getElementById('age_out').textContent='Select date'; return; }
    const b = new Date(d); const now = new Date();
    let years = now.getFullYear() - b.getFullYear();
    let months = now.getMonth() - b.getMonth();
    let days = now.getDate() - b.getDate();
    if(days<0){ months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if(months<0){ years--; months += 12; }
    document.getElementById('age_out').textContent = `${years} years, ${months} months, ${days} days`;
  });
}

/* 13 Currency (sample rates) */
function renderCurrency(){
  toolUi.innerHTML = `
    <div>
      <select id="cur_from" style="width:48%;padding:8px"><option>USD</option><option>EUR</option><option>PKR</option></select>
      <select id="cur_to" style="width:48%;padding:8px;margin-left:4%"><option>PKR</option><option>USD</option><option>EUR</option></select>
      <input id="cur_amount" type="number" placeholder="Amount" style="width:100%;padding:8px;margin-top:8px"/>
      <button id="cur_go" class="modal-btn">Convert</button>
      <div id="cur_out" style="margin-top:10px"></div>
    </div>
  `;
  document.getElementById('cur_go').addEventListener('click', () => {
    const sampleRates = { USD:1, EUR:0.93, PKR:280 };
    const from = document.getElementById('cur_from').value;
    const to = document.getElementById('cur_to').value;
    const amt = Number(document.getElementById('cur_amount').value) || 0;
    const usd = amt / (sampleRates[from] || 1);
    const res = usd * (sampleRates[to] || 1);
    document.getElementById('cur_out').textContent = `${res.toFixed(2)} ${to} (sample rates)`;
  });
}

/* 14 Countdown */
let cdTimer = null;
function renderCountdown(){
  toolUi.innerHTML = `
    <div>
      <input id="cd_seconds" type="number" placeholder="Seconds" style="width:100%;padding:8px"/>
      <div style="margin-top:8px"><button id="cd_start" class="modal-btn">Start</button><button id="cd_stop" class="modal-btn">Stop</button></div>
      <div id="cd_out" style="margin-top:10px"></div>
    </div>
  `;
  document.getElementById('cd_start').addEventListener('click', () => {
    let s = Math.max(1, Number(document.getElementById('cd_seconds').value) || 10);
    clearInterval(cdTimer);
    document.getElementById('cd_out').textContent = `${s} s`;
    cdTimer = setInterval(() => {
      s--; document.getElementById('cd_out').textContent = `${s} s`;
      if(s<=0){ clearInterval(cdTimer); document.getElementById('cd_out').textContent='Done'; }
    },1000);
  });
  document.getElementById('cd_stop').addEventListener('click', () => { clearInterval(cdTimer); document.getElementById('cd_out').textContent='Stopped'; });
}

/* 15 Stopwatch */
let swStart=0, swTimer=null, swElapsed=0;
function renderStopwatch(){
  toolUi.innerHTML = `
    <div>
      <div style="margin-bottom:8px"><button id="sw_start" class="modal-btn">Start</button><button id="sw_stop" class="modal-btn">Stop</button><button id="sw_reset" class="modal-btn">Reset</button></div>
      <div id="sw_out" style="margin-top:10px;font-family:monospace">00:00:00.000</div>
    </div>
  `;
  document.getElementById('sw_start').addEventListener('click', () => {
    if(swTimer) return;
    swStart = performance.now() - swElapsed;
    swTimer = setInterval(()=> { swElapsed = performance.now() - swStart; document.getElementById('sw_out').textContent = formatTime(swElapsed); }, 31);
  });
  document.getElementById('sw_stop').addEventListener('click', () => { clearInterval(swTimer); swTimer=null; });
  document.getElementById('sw_reset').addEventListener('click', () => { clearInterval(swTimer); swTimer=null; swElapsed=0; document.getElementById('sw_out').textContent='00:00:00.000'; });
}
function formatTime(ms){
  const hours = Math.floor(ms/3600000);
  const mins = Math.floor((ms%3600000)/60000);
  const secs = Math.floor((ms%60000)/1000);
  const msec = Math.floor(ms%1000);
  return `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}.${String(msec).padStart(3,'0')}`;
}

/* 16 RNG */
function renderRng(){
  toolUi.innerHTML = `
    <div>
      <input id="rng_min" type="number" placeholder="Min" style="width:48%;padding:8px"/><input id="rng_max" type="number" placeholder="Max" style="width:48%;padding:8px;margin-left:4%"/>
      <button id="rng_go" class="modal-btn">Generate</button>
      <div id="rng_out" style="margin-top:10px"></div>
    </div>
  `;
  document.getElementById('rng_go').addEventListener('click', ()=> {
    const min = Number(document.getElementById('rng_min').value) || 0;
    const max = Number(document.getElementById('rng_max').value) || 100;
    const n = Math.floor(Math.random()*(max-min+1))+min;
    document.getElementById('rng_out').textContent = String(n);
  });
}

/* 17 Notes */
function renderNotes(){
  toolUi.innerHTML = `
    <div>
      <textarea id="notes_text" style="width:100%;height:120px;padding:8px"></textarea>
      <div style="margin-top:8px"><button id="notes_save" class="modal-btn">Save</button><button id="notes_load" class="modal-btn">Load</button><button id="notes_clear" class="modal-btn">Clear</button></div>
      <div id="notes_out" style="margin-top:10px"></div>
    </div>
  `;
  document.getElementById('notes_save').addEventListener('click', ()=> { localStorage.setItem('cyberx_note', document.getElementById('notes_text').value); document.getElementById('notes_out').textContent='Saved';});
  document.getElementById('notes_load').addEventListener('click', ()=> { document.getElementById('notes_text').value = localStorage.getItem('cyberx_note') || ''; document.getElementById('notes_out').textContent='Loaded';});
  document.getElementById('notes_clear').addEventListener('click', ()=> { localStorage.removeItem('cyberx_note'); document.getElementById('notes_text').value=''; document.getElementById('notes_out').textContent='Cleared';});
}

/* 18 Todo */
function renderTodo(){
  toolUi.innerHTML = `
    <div>
      <input id="todo_in" type="text" placeholder="New todo" style="width:100%;padding:8px"/>
      <div style="margin-top:8px"><button id="todo_add" class="modal-btn">Add</button><button id="todo_clear" class="modal-btn">Clear All</button></div>
      <div id="todo_out" style="margin-top:10px"></div>
    </div>
  `;
  function render(){ const out=document.getElementById('todo_out'); const list=JSON.parse(localStorage.getItem('cyberx_todos')||'[]'); if(list.length===0){ out.textContent='No todos'; return;} out.innerHTML=''; list.forEach((it,idx)=>{ const d=document.createElement('div'); d.style.display='flex'; d.style.justifyContent='space-between'; d.style.marginBottom='6px'; const s=document.createElement('span'); s.textContent=it; const b=document.createElement('button'); b.textContent='Del'; b.className='modal-btn'; b.onclick=()=>{ list.splice(idx,1); localStorage.setItem('cyberx_todos',JSON.stringify(list)); render(); }; d.appendChild(s); d.appendChild(b); out.appendChild(d); }); }
  document.getElementById('todo_add').addEventListener('click', ()=> { const v=document.getElementById('todo_in').value.trim(); if(!v) return; const list=JSON.parse(localStorage.getItem('cyberx_todos')||'[]'); list.push(v); localStorage.setItem('cyberx_todos',JSON.stringify(list)); document.getElementById('todo_in').value=''; render();});
  document.getElementById('todo_clear').addEventListener('click', ()=> { localStorage.removeItem('cyberx_todos'); render();});
  render();
}

/* 19 IP */
function renderIP(){
  toolUi.innerHTML = `<div><button id="ip_go" class="modal-btn">Get IP</button><div id="ip_out" style="margin-top:10px"></div></div>`;
  document.getElementById('ip_go').addEventListener('click', async () => {
    const out = document.getElementById('ip_out'); out.textContent='Checking...';
    try {
      const r = await fetch('https://api.ipify.org?format=json'); const j = await r.json(); out.textContent = j.ip;
    } catch(e){ out.textContent = 'Unable to fetch IP (offline?)'; }
  });
}

/* 20 Clock */
function renderClock(){
  toolUi.innerHTML = `<div><div id="clock_out" style="font-family:monospace;font-size:18px"></div></div>`;
  function upd(){ document.getElementById('clock_out').textContent = new Date().toLocaleString(); }
  upd(); setInterval(upd,1000);
}
