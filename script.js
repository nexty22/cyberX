// ========== Loader ==========
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const progressText = document.getElementById('progress');
  let progress = 0;
  const t = setInterval(() => {
    progress += 2;
    if (progress >= 100) {
      progress = 100;
      progressText.innerText = '100%';
      clearInterval(t);
      loader.style.transition = 'opacity .7s, transform .7s';
      loader.style.opacity = '0';
      loader.style.transform = 'scale(1.02)';
      setTimeout(() => loader.style.display = 'none', 750);
    } else {
      progressText.innerText = progress + '%';
    }
  }, 80);

  // ensure canvas sizing after load
  setupParticles();
  setupUI();
});

// ========== Dark/Light Toggle ==========
function toggleMode() {
  document.body.classList.toggle('light-mode');
}
document.getElementById('toggleModeBtn').addEventListener('click', toggleMode);

// ========== Contact Modal ==========
const contactModal = document.getElementById('contactModal');
document.getElementById('contactBtn').addEventListener('click', () => {
  contactModal.classList.add('show');
});
document.getElementById('closeContact').addEventListener('click', () => {
  contactModal.classList.remove('show');
});

// ========== Particles ==========
let particles = [];
let canvas, ctx;
function setupParticles(){
  canvas = document.getElementById('particles');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  particles = [];
  for(let i=0;i<70;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*2+0.6,
      vx: (Math.random()-0.5)*0.5,
      vy: (Math.random()-0.5)*0.5
    });
  }
  requestAnimationFrame(particlesAnimate);
}
function particlesAnimate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const p of particles){
    p.x += p.vx; p.y += p.vy;
    if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.fillStyle = 'rgba(123,47,247,0.7)';
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
  }
  requestAnimationFrame(particlesAnimate);
}

// ========== Music / Start ==========
const bgMusic = document.getElementById('bgMusic');
const startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', () => {
  try {
    if (bgMusic.paused) {
      bgMusic.play();
      startBtn.innerText = '⏸ Pause Music';
    } else {
      bgMusic.pause();
      startBtn.innerText = '🚀 Start Experience';
    }
  } catch (e) {
    console.warn('audio blocked', e);
  }
});

// ========== Tools Panel Logic (open tool in same page) ==========
const toolPanel = document.getElementById('toolPanel');
const toolTitle = document.getElementById('toolTitle');
const toolUi = document.getElementById('toolUi');
const closeToolPanel = document.getElementById('closeToolPanel');

function setupUI(){
  // attach click to all tool cards
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      const tool = card.getAttribute('data-tool');
      openTool(tool);
    });
  });

  // close handler
  closeToolPanel.addEventListener('click', () => {
    toolPanel.classList.remove('show');
    toolUi.innerHTML = '';
  });

  // make contact modal close on backdrop click too
  document.getElementById('contactModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('contactModal')) contactModal.classList.remove('show');
  });
  toolPanel.addEventListener('click', (e) => {
    if (e.target === toolPanel) { toolPanel.classList.remove('show'); toolUi.innerHTML = ''; }
  });
}

// Dispatcher: chooses which tool UI to render
function openTool(name){
  toolPanel.classList.add('show');
  toolTitle.innerText = friendlyName(name);
  toolUi.innerHTML = ''; // clear
  // switch to render specific UI + logic hookup
  switch(name){
    case 'password': renderPassword(); break;
    case 'qr': renderQR(); break;
    case 'base64': renderBase64(); break;
    case 'binary': renderBinary(); break;
    case 'unit': renderUnitConverter(); break;
    case 'img2b64': renderImageToBase64(); break;
    case 'tts': renderTTS(); break;
    case 'stt': renderSTT(); break;
    case 'color': renderColorPicker(); break;
    case 'rgbhex': renderRgbHex(); break;
    case 'bmi': renderBMI(); break;
    case 'age': renderAge(); break;
    case 'currency': renderCurrency(); break;
    case 'countdown': renderCountdown(); break;
    case 'stopwatch': renderStopwatch(); break;
    case 'rng': renderRng(); break;
    case 'notes': renderNotes(); break;
    case 'todo': renderTodo(); break;
    case 'ip': renderIP(); break;
    case 'clock': renderClock(); break;
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
