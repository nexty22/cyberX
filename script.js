/* ========= Core UI & Particles ========= */
const particlesCanvas = document.getElementById('particles');
const ctx = particlesCanvas.getContext('2d');
function resizeCanvas(){ particlesCanvas.width = innerWidth; particlesCanvas.height = innerHeight; }
resizeCanvas(); window.addEventListener('resize', resizeCanvas);

const particles = [];
for(let i=0;i<80;i++){
  particles.push({
    x: Math.random()*particlesCanvas.width,
    y: Math.random()*particlesCanvas.height,
    r: Math.random()*1.6+0.6,
    vx: (Math.random()-0.5)*0.6,
    vy: (Math.random()-0.5)*0.6
  });
}
(function loop(){
  ctx.clearRect(0,0,particlesCanvas.width,particlesCanvas.height);
  for(const p of particles){
    p.x += p.vx; p.y += p.vy;
    if(p.x<0||p.x>particlesCanvas.width) p.vx *= -1;
    if(p.y<0||p.y>particlesCanvas.height) p.vy *= -1;
    ctx.fillStyle = 'rgba(123,47,247,0.6)';
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
  }
  requestAnimationFrame(loop);
})();

/* ====== Elements ====== */
const modeBtn = document.getElementById('modeBtn');
const contactBtn = document.getElementById('contactBtn');
const contactModal = document.getElementById('contactModal');
const startBtn = document.getElementById('startBtn');
const bgMusic = document.getElementById('bgMusic');
const extraButtons = document.getElementById('extraButtons');
const toolsBtn = document.getElementById('toolsBtn');
const toolsBox = document.getElementById('toolsBox');
const toolsGrid = document.getElementById('toolsGrid');
const toolPopup = document.getElementById('toolPopup');
const toolTitle = document.getElementById('toolTitle');
const toolBody = document.getElementById('toolBody');
const toolClose = document.getElementById('toolClose');

/* ====== Light/Dark toggle ====== */
modeBtn.addEventListener('click', ()=> document.body.classList.toggle('light-mode'));

/* ====== Contact modal ====== */
contactBtn.addEventListener('click', ()=> showContact());
function showContact(){
  contactModal.style.display = 'flex';
  contactModal.setAttribute('aria-hidden','false');
}
function closeContact(){
  contactModal.style.display = 'none';
  contactModal.setAttribute('aria-hidden','true');
}
contactModal.addEventListener('click', (e)=> { if(e.target===contactModal) closeContact(); });

/* ====== Start Experience (music + reveal extra) ====== */
startBtn.addEventListener('click', ()=>{
  try{
    if(bgMusic.paused){
      bgMusic.play().catch(()=>{});
      startBtn.innerText = '⏸ Pause Music';
      extraButtons.classList.add('show');
      extraButtons.style.display = 'flex';
    } else {
      bgMusic.pause();
      startBtn.innerText = '🚀 Start Experience';
    }
  } catch(e){ console.warn(e); }
});

/* ====== Tools list (25 tools) ====== */
const TOOLS = [
  {id:'idea', name:'Idea Generator'},
  {id:'calc', name:'Calculator'},
  {id:'color', name:'Color Picker'},
  {id:'countdown', name:'Countdown Timer'},
  {id:'stopwatch', name:'Stopwatch'},
  {id:'notes', name:'Notes (local)'},
  {id:'todo', name:'Todo List (local)'},
  {id:'password', name:'Password Generator'},
  {id:'b64', name:'Base64 Encode/Decode'},
  {id:'binary', name:'Binary ↔ Text'},
  {id:'bmi', name:'BMI Calculator'},
  {id:'age', name:'Age Calculator'},
  {id:'rng', name:'Random Number'},
  {id:'rgbhex', name:'RGB ↔ HEX'},
  {id:'tts', name:'Text → Speech'},
  {id:'stt', name:'Speech → Text'},
  {id:'unit', name:'Unit Converter'},
  {id:'temp', name:'Temperature Converter'},
  {id:'json', name:'JSON Formatter'},
  {id:'word', name:'Word Counter'},
  {id:'pal', name:'Palindrome Checker'},
  {id:'rev', name:'Text Reverser'},
  {id:'imgb64', name:'Image → Base64'},
  {id:'sha', name:'SHA-256 Hash'},
  {id:'clock', name:'Live Clock'}
];

function buildToolsGrid(){
  toolsGrid.innerHTML = '';
  TOOLS.forEach(t=>{
    const el = document.createElement('div');
    el.className = 'tool-card';
    el.textContent = '🔧 ' + t.name;
    el.dataset.id = t.id;
    el.addEventListener('click', ()=> openTool(t.id, t.name));
    toolsGrid.appendChild(el);
  });
}
buildToolsGrid();

/* Tools panel toggle */
toolsBtn.addEventListener('click', ()=>{
  const shown = toolsBox.style.display === 'block';
  toolsBox.style.display = shown ? 'none' : 'block';
});

/* ===== Popup handling ===== */
function openTool(id,name){
  if(!extraButtons.classList.contains('show')){
    alert('Click "Start Experience" first to unlock tools.');
    return;
  }
  toolTitle.innerText = name;
  toolBody.innerHTML = '<div style="opacity:.7">Loading...</div>';
  toolPopup.style.display = 'flex';
  toolPopup.setAttribute('aria-hidden','false');
  setTimeout(()=> renderTool(id), 80);
}
function closeToolPopup(){ toolPopup.style.display = 'none'; toolPopup.setAttribute('aria-hidden','true'); }
toolClose.addEventListener('click', closeToolPopup);
toolPopup.addEventListener('click', (e)=> { if(e.target === toolPopup) closeToolPopup(); });
document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeToolPopup(); });

/* Helpers */
function createRow(innerHTML=''){ const d=document.createElement('div'); d.className='row'; d.style.marginTop='10px'; d.innerHTML=innerHTML; return d; }
Array.prototype.rand = function(){ return this[Math.floor(Math.random()*this.length)]; };

/* ---------- Tool implementations (same as delivered previously) ---------- */

/* 1 Idea */
function renderIdea(){
  toolBody.innerHTML = '';
  const out = document.createElement('div'); out.id='ideaOut'; out.style.minHeight='60px'; out.style.padding='8px'; out.style.background='rgba(255,255,255,0.02)'; out.style.borderRadius='8px'; out.innerText='Press Generate to get an idea.';
  const btnRow = createRow();
  const gen = document.createElement('button'); gen.className='smallBtn'; gen.innerText='Generate Idea';
  const copy = document.createElement('button'); copy.className='smallBtn ghost'; copy.innerText='Copy';
  gen.onclick = ()=> {
    const themes=["mobile app","micro-SaaS","AI assistant","niche marketplace","developer utility","education game"];
    const mods=["for creators","for students","for remote teams","with offline mode","with realtime sync","with templates"];
    const feats=["analytics dashboard","one-click export","smart suggestions","voice commands","image sharing"];
    const idea = `A ${themes.rand()} ${mods.rand()} that includes ${feats.rand()}.`;
    out.innerText = idea;
  };
  copy.onclick = ()=> { navigator.clipboard?.writeText(out.innerText).then(()=> alert('Copied')); };
  btnRow.appendChild(gen); btnRow.appendChild(copy);
  toolBody.appendChild(out); toolBody.appendChild(btnRow);
}

/* 2 Calculator */
function renderCalc(){
  toolBody.innerHTML = '';
  const input = document.createElement('input'); input.className='input'; input.placeholder='e.g. (12+8)/4 * 3';
  const run = document.createElement('button'); run.className='smallBtn'; run.innerText='Calculate';
  const out = document.createElement('div'); out.style.marginTop='8px';
  run.onclick = ()=> {
    try{ const r = Function('"use strict";return ('+input.value+')')(); out.innerText = '= ' + r; }catch{ out.innerText='Error'; }
  };
  toolBody.appendChild(input); toolBody.appendChild(createRow(run.outerHTML)); toolBody.appendChild(out);
  toolBody.querySelector('.smallBtn').onclick = run.onclick;
}

/* 3 Color Picker */
function renderColorPicker(){
  toolBody.innerHTML = '';
  const inp = document.createElement('input'); inp.type='color'; inp.value='#7b2ff7';
  const out = document.createElement('div'); out.style.marginTop='10px';
  inp.oninput = ()=> out.innerText = inp.value;
  toolBody.appendChild(inp); toolBody.appendChild(out); out.innerText = inp.value;
}

/* 4 Countdown */
let countdownInterval = null;
function renderCountdown(){
  toolBody.innerHTML = '';
  const input = document.createElement('input'); input.className='input'; input.placeholder='Seconds';
  const start = document.createElement('button'); start.className='smallBtn'; start.innerText='Start';
  const stop = document.createElement('button'); stop.className='smallBtn ghost'; stop.innerText='Stop';
  const out = document.createElement('div'); out.style.marginTop='10px';
  start.onclick = ()=> {
    let s = Math.max(1, Number(input.value)||10);
    clearInterval(countdownInterval);
    out.innerText = s + 's';
    countdownInterval = setInterval(()=> {
      s--; out.innerText = s + 's';
      if(s<=0){ clearInterval(countdownInterval); out.innerText='Done'; }
    },1000);
  };
  stop.onclick = ()=> { clearInterval(countdownInterval); out.innerText='Stopped'; };
  toolBody.appendChild(input); toolBody.appendChild(createRow(start.outerHTML + stop.outerHTML)); toolBody.appendChild(out);
  const buttons = toolBody.querySelectorAll('.smallBtn');
  buttons[0].onclick = start.onclick; buttons[1].onclick = stop.onclick;
}

/* 5 Stopwatch */
let swInterval = null, swStart = 0, swOffset = 0;
function renderStopwatch(){
  toolBody.innerHTML = '';
  const disp = document.createElement('div'); disp.innerText='00:00:00.000'; disp.style.fontWeight='700';
  const start = document.createElement('button'); start.className='smallBtn'; start.innerText='Start';
  const stop = document.createElement('button'); stop.className='smallBtn ghost'; stop.innerText='Stop';
  const reset = document.createElement('button'); reset.className='smallBtn ghost'; reset.innerText='Reset';
  function msToTime(ms){
    const h = String(Math.floor(ms/3600000)).padStart(2,'0');
    const m = String(Math.floor(ms%3600000/60000)).padStart(2,'0');
    const s = String(Math.floor(ms%60000/1000)).padStart(2,'0');
    const msr = String(ms%1000).padStart(3,'0');
    return `${h}:${m}:${s}.${msr}`;
  }
  start.onclick = ()=> {
    if(swInterval) return;
    swStart = Date.now() - swOffset;
    swInterval = setInterval(()=> { swOffset = Date.now()-swStart; disp.innerText = msToTime(swOffset); }, 37);
  };
  stop.onclick = ()=> { clearInterval(swInterval); swInterval=null; };
  reset.onclick = ()=> { clearInterval(swInterval); swInterval=null; swOffset=0; disp.innerText='00:00:00.000'; };
  toolBody.appendChild(disp); toolBody.appendChild(createRow(start.outerHTML + stop.outerHTML + reset.outerHTML));
  const btns = toolBody.querySelectorAll('.smallBtn');
  btns[0].onclick = start.onclick; btns[1].onclick = stop.onclick; btns[2].onclick = reset.onclick;
}

/* 6 Notes */
function renderNotes(){
  toolBody.innerHTML = '';
  const ta = document.createElement('textarea'); ta.className='input'; ta.style.height='140px'; ta.placeholder='Write notes...';
  const save = document.createElement('button'); save.className='smallBtn'; save.innerText='Save';
  const load = document.createElement('button'); load.className='smallBtn ghost'; load.innerText='Load';
  const msg = document.createElement('div'); msg.style.marginTop='8px';
  save.onclick = ()=> { localStorage.setItem('cyberx_notes', ta.value); msg.innerText='Saved'; };
  load.onclick = ()=> { ta.value = localStorage.getItem('cyberx_notes') || ''; msg.innerText='Loaded'; };
  toolBody.appendChild(ta); toolBody.appendChild(createRow(save.outerHTML + load.outerHTML)); toolBody.appendChild(msg);
  const btns = toolBody.querySelectorAll('.smallBtn'); btns[0].onclick = save.onclick; btns[1].onclick = load.onclick;
}

/* 7 Todo */
function renderTodo(){
  toolBody.innerHTML = '';
  const input = document.createElement('input'); input.className='input'; input.placeholder='New task';
  const add = document.createElement('button'); add.className='smallBtn'; add.innerText='Add';
  const clear = document.createElement('button'); clear.className='smallBtn ghost'; clear.innerText='Clear';
  const list = document.createElement('ul'); list.style.textAlign='left'; list.style.marginTop='10px'; list.style.maxHeight='220px'; list.style.overflow='auto';
  function load(){ const arr = JSON.parse(localStorage.getItem('cyberx_todo')||'[]'); list.innerHTML=''; arr.forEach((t,i)=>{ const li=document.createElement('li'); li.textContent=t; const del=document.createElement('button'); del.innerText='✕'; del.style.marginLeft='8px'; del.onclick = ()=> { arr.splice(i,1); localStorage.setItem('cyberx_todo',JSON.stringify(arr)); load(); }; li.appendChild(del); list.appendChild(li); }); }
  add.onclick = ()=> { const v = input.value.trim(); if(!v) return; const arr = JSON.parse(localStorage.getItem('cyberx_todo')||'[]'); arr.push(v); localStorage.setItem('cyberx_todo',JSON.stringify(arr)); input.value=''; load(); };
  clear.onclick = ()=> { localStorage.removeItem('cyberx_todo'); load(); };
  toolBody.appendChild(input); toolBody.appendChild(createRow(add.outerHTML + clear.outerHTML)); toolBody.appendChild(list);
  const btns = toolBody.querySelectorAll('.smallBtn'); btns[0].onclick = add.onclick; btns[1].onclick = clear.onclick;
  load();
}

/* 8 Password */
function renderPassword(){
  toolBody.innerHTML = '';
  const len = document.createElement('input'); len.type='number'; len.className='input'; len.value=16; len.min=4; len.max=128;
  const gen = document.createElement('button'); gen.className='smallBtn'; gen.innerText='Generate';
  const copy = document.createElement('button'); copy.className='smallBtn ghost'; copy.innerText='Copy';
  const out = document.createElement('div'); out.style.marginTop='8px'; out.style.fontFamily='monospace';
  gen.onclick = ()=> {
    const l = Math.max(4, Number(len.value)||16);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let s=''; for(let i=0;i<l;i++) s += chars.charAt(Math.floor(Math.random()*chars.length));
    out.innerText = s;
  };
  copy.onclick = ()=> { navigator.clipboard?.writeText(out.innerText||'').then(()=> alert('Copied')); };
  toolBody.appendChild(len); toolBody.appendChild(createRow(gen.outerHTML + copy.outerHTML)); toolBody.appendChild(out);
  const btns = toolBody.querySelectorAll('.smallBtn'); btns[0].onclick = gen.onclick; btns[1].onclick = copy.onclick;
}

/* 9 Base64 */
function renderBase64(){
  toolBody.innerHTML = '';
  const ta = document.createElement('textarea'); ta.className='input'; ta.style.height='110px';
  const enc = document.createElement('button'); enc.className='smallBtn'; enc.innerText='Encode';
  const dec = document.createElement('button'); dec.className='smallBtn ghost'; dec.innerText='Decode';
  const out = document.createElement('div'); out.style.marginTop='8px';
  enc.onclick = ()=> { try{ out.innerText = btoa(unescape(encodeURIComponent(ta.value||''))); }catch{ out.innerText='Error'; } };
  dec.onclick = ()=> { try{ out.innerText = decodeURIComponent(escape(atob(ta.value||''))); }catch{ out.innerText='Invalid Base64'; } };
  toolBody.appendChild(ta); toolBody.appendChild(createRow(enc.outerHTML + dec.outerHTML)); toolBody.appendChild(out);
  const btns = toolBody.querySelectorAll('.smallBtn'); btns[0].onclick = enc.onclick; btns[1].onclick = dec.onclick;
}

/* 10 Binary */
function renderBinary(){
  toolBody.innerHTML = '';
  const ta = document.createElement('textarea'); ta.className='input'; ta.style.height='110px';
  const t2b = document.createElement('button'); t2b.className='smallBtn'; t2b.innerText='Text → Binary';
  const b2t = document.createElement('button'); b2t.className='smallBtn ghost'; b2t.innerText='Binary → Text';
  const out = document.createElement('div'); out.style.marginTop='8px';
  t2b.onclick = ()=> { const s = ta.value||''; out.innerText = Array.from(s).map(c=>c.charCodeAt(0).toString(2).padStart(8,'0')).join(' '); };
  b2t.onclick = ()=> { try{ const parts = (ta.value||'').trim().split(/\s+/); out.innerText = parts.map(b=>String.fromCharCode(parseInt(b,2))).join(''); }catch{ out.innerText='Invalid'; } };
  toolBody.appendChild(ta); toolBody.appendChild(createRow(t2b.outerHTML + b2t.outerHTML)); toolBody.appendChild(out);
  const btns = toolBody.querySelectorAll('.smallBtn'); btns[0].onclick = t2b.onclick; btns[1].onclick = b2t.onclick;
}

/* 11 BMI */
function renderBMI(){
  toolBody.innerHTML = '';
  const w = document.createElement('input'); w.className='input'; w.placeholder='Weight (kg)';
  const h = document.createElement('input'); h.className='input'; h.placeholder='Height (m)';
  const calc = document.createElement('button'); calc.className='smallBtn'; calc.innerText='Calculate';
  const out = document.createElement('div');
  calc.onclick = ()=> { const ww=Number(w.value), hh=Number(h.value); if(!ww||!hh) { out.innerText='Enter numbers'; return; } out.innerText = 'BMI: ' + (ww/(hh*hh)).toFixed(2); };
  toolBody.appendChild(w); toolBody.appendChild(h); toolBody.appendChild(createRow(calc.outerHTML)); toolBody.appendChild(out);
  toolBody.querySelector('.smallBtn').onclick = calc.onclick;
}

/* 12 Age */
function renderAge(){
  toolBody.innerHTML = '';
  const d = document.createElement('input'); d.type='date'; d.className='input';
  const calc = document.createElement('button'); calc.className='smallBtn'; calc.innerText='Calculate Age';
  const out = document.createElement('div');
  calc.onclick = ()=> { if(!d.value) { out.innerText='Select date'; return; } const diff = Date.now() - new Date(d.value).getTime(); out.innerText = Math.floor(diff/31557600000) + ' years'; };
  toolBody.appendChild(d); toolBody.appendChild(createRow(calc.outerHTML)); toolBody.appendChild(out);
  toolBody.querySelector('.smallBtn').onclick = calc.onclick;
}

/* 13 RNG */
function renderRng(){
  toolBody.innerHTML = '';
  const min = document.createElement('input'); min.className='input'; min.placeholder='Min (default 0)';
  const max = document.createElement('input'); max.className='input'; max.placeholder='Max (default 100)';
  const gen = document.createElement('button'); gen.className='smallBtn'; gen.innerText='Generate';
  const out = document.createElement('div');
  gen.onclick = ()=> { const a=Number(min.value)||0, b=Number(max.value)||100; out.innerText = Math.floor(Math.random()*(b-a+1))+a; };
  toolBody.appendChild(min); toolBody.appendChild(max); toolBody.appendChild(createRow(gen.outerHTML)); toolBody.appendChild(out);
  toolBody.querySelector('.smallBtn').onclick = gen.onclick;
}

/* 14 RGB<>HEX */
function renderRgbHex(){
  toolBody.innerHTML = '';
  const hex = document.createElement('input'); hex.className='input'; hex.placeholder='#rrggbb';
  const r = document.createElement('input'); r.className='input'; r.placeholder='R';
  const toRgb = document.createElement('button'); toRgb.className='smallBtn'; toRgb.innerText='HEX → RGB';
  const toHex = document.createElement('button'); toHex.className='smallBtn ghost'; toHex.innerText='RGB → HEX';
  const out = document.createElement('div');
  toRgb.onclick = ()=> { const h=(hex.value||'').replace('#',''); if(h.length!==6){ out.innerText='Invalid'; return; } const bi=parseInt(h,16); out.innerText = `rgb(${(bi>>16)&255}, ${(bi>>8)&255}, ${bi&255})`; };
  toHex.onclick = ()=> { const rr=Number(r.value)||0; const gg=Number(prompt('G value','128'))||0; const bb=Number(prompt('B value','128'))||0; out.innerText = '#'+[rr,gg,bb].map(n=>Number(n).toString(16).padStart(2,'0')).join(''); };
  toolBody.appendChild(hex); toolBody.appendChild(r); toolBody.appendChild(createRow(toRgb.outerHTML + toHex.outerHTML)); toolBody.appendChild(out);
  const btns=toolBody.querySelectorAll('.smallBtn'); btns[0].onclick = toRgb.onclick; btns[1].onclick = toHex.onclick;
}

/* 15 TTS */
function renderTTS(){
  toolBody.innerHTML = '';
  const ta = document.createElement('textarea'); ta.className='input'; ta.style.height='110px';
  const speak = document.createElement('button'); speak.className='smallBtn'; speak.innerText='Speak';
  speak.onclick = ()=> {
    if(!('speechSynthesis' in window)) return alert('TTS not supported');
    const u = new SpeechSynthesisUtterance(ta.value||'');
    speechSynthesis.speak(u);
  };
  toolBody.appendChild(ta); toolBody.appendChild(createRow(speak.outerHTML));
  toolBody.querySelector('.smallBtn').onclick = speak.onclick;
}

/* 16 STT */
let sttRec = null;
function renderSTT(){
  toolBody.innerHTML = '';
  const btn = docum
