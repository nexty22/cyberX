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

/* Tools panel toggle (only visible after Start) */
toolsBtn.addEventListener('click', ()=>{
  const shown = toolsBox.style.display === 'block';
  toolsBox.style.display = shown ? 'none' : 'block';
});

/* ===== Popup handling ===== */
function openTool(id,name){
  // ensure start was clicked (tools unlocked)
  if(!extraButtons.classList.contains('show')){
    alert('Click "Start Experience" first to unlock tools.');
    return;
  }
  toolTitle.innerText = name;
  toolBody.innerHTML = '<div style="opacity:.7">Loading...</div>';
  toolPopup.style.display = 'flex';
  toolPopup.setAttribute('aria-hidden','false');
  // small delay then render
  setTimeout(()=> renderTool(id), 80);
}
function closeToolPopup(){ toolPopup.style.display = 'none'; toolPopup.setAttribute('aria-hidden','true'); }
toolClose.addEventListener('click', closeToolPopup);
toolPopup.addEventListener('click', (e)=> { if(e.target === toolPopup) closeToolPopup(); });
document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeToolPopup(); });

/* ========== Tool renderers ========== */

/* Helpers */
function createRow(innerHTML=''){ const d=document.createElement('div'); d.className='row'; d.style.marginTop='10px'; d.innerHTML=innerHTML; return d; }
Array.prototype.rand = function(){ return this[Math.floor(Math.random()*this.length)]; };

/* 1 Idea Generator */
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
  toolBody.appendChild(input); toolBody.appendChild(createRow(run.outerHTML));
  toolBody.appendChild(out);
  // attach real handler
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

/* 4 Countdown Timer */
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

/* 6 Notes (localStorage) */
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

/* 7 Todo (localStorage) */
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

/* 8 Password Generator */
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

/* 10 Binary ↔ Text */
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

/* 13 Random Number */
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

/* 14 RGB ↔ HEX */
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

/* 15 Text → Speech */
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

/* 16 Speech → Text (if supported) */
let sttRec = null;
function renderSTT(){
  toolBody.innerHTML = '';
  const btn = document.createElement('button'); btn.className='smallBtn'; btn.innerText='Start/Stop Listening';
  const out = document.createElement('div'); out.style.marginTop='8px';
  btn.onclick = ()=>{
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) return out.innerText = 'Speech recognition not supported';
    if(sttRec){ sttRec.stop(); sttRec = null; btn.innerText='Start/Stop Listening'; return; }
    sttRec = new SR(); sttRec.lang='en-US'; sttRec.interimResults = true;
    sttRec.onresult = (ev)=> out.innerText = Array.from(ev.results).map(r=>r[0].transcript).join(' ');
    sttRec.start(); btn.innerText='Stop Listening';
  };
  toolBody.appendChild(btn); toolBody.appendChild(out);
}

/* 17 Unit Converter (m ↔ ft, kg ↔ lb) */
function renderUnit(){
  toolBody.innerHTML = '';
  const sel = document.createElement('select'); sel.className='input';
  sel.innerHTML = '<option value="mft">Meters ↔ Feet</option><option value="kglb">Kg ↔ Lb</option>';
  const val = document.createElement('input'); val.className='input'; val.placeholder='Value';
  const fwd = document.createElement('button'); fwd.className='smallBtn'; fwd.innerText='Convert →';
  const back = document.createElement('button'); back.className='smallBtn ghost'; back.innerText='Convert ←';
  const out = document.createElement('div');
  function conv(dir){
    const v = Number(val.value); if(isNaN(v)) return out.innerText='Enter number';
    if(sel.value==='mft') out.innerText = dir==='f' ? (v*3.28084).toFixed(4)+' ft' : (v/3.28084).toFixed(4)+' m';
    else out.innerText = dir==='f' ? (v*2.20462).toFixed(4)+' lb' : (v/2.20462).toFixed(4)+' kg';
  }
  toolBody.appendChild(sel); toolBody.appendChild(val); toolBody.appendChild(createRow(fwd.outerHTML + back.outerHTML)); toolBody.appendChild(out);
  const btns = toolBody.querySelectorAll('.smallBtn'); btns[0].onclick = ()=> conv('f'); btns[1].onclick = ()=> conv('b');
}

/* 18 Temperature Converter */
function renderTemp(){
  toolBody.innerHTML = '';
  const val = document.createElement('input'); val.className='input'; val.placeholder='Temperature';
  const toF = document.createElement('button'); toF.className='smallBtn'; toF.innerText='°C → °F';
  const toC = document.createElement('button'); toC.className='smallBtn ghost'; toC.innerText='°F → °C';
  const out = document.createElement('div');
  toF.onclick = ()=> { const v=Number(val.value); out.innerText = (v*9/5+32).toFixed(2)+' °F'; };
  toC.onclick = ()=> { const v=Number(val.value); out.innerText = ((v-32)*5/9).toFixed(2)+' °C'; };
  toolBody.appendChild(val); toolBody.appendChild(createRow(toF.outerHTML + toC.outerHTML)); toolBody.appendChild(out);
  const btns = toolBody.querySelectorAll('.smallBtn'); btns[0].onclick = toF.onclick; btns[1].onclick = toC.onclick;
}

/* 19 JSON Formatter */
function renderJSON(){
  toolBody.innerHTML = '';
  const ta = document.createElement('textarea'); ta.className='input'; ta.style.height='160px';
  const fmt = document.createElement('button'); fmt.className='smallBtn'; fmt.innerText='Format';
  const min = document.createElement('button'); min.className='smallBtn ghost'; min.innerText='Minify';
  const out = document.createElement('pre'); out.style.textAlign='left'; out.style.marginTop='8px'; out.style.whiteSpace='pre-wrap';
  fmt.onclick = ()=> { try{ const j = JSON.parse(ta.value); out.innerText = JSON.stringify(j,null,2); }catch{ out.innerText='Invalid JSON'; } };
  min.onclick = ()=> { try{ const j = JSON.parse(ta.value); out.innerText = JSON.stringify(j); }catch{ out.innerText='Invalid JSON'; } };
  toolBody.appendChild(ta); toolBody.appendChild(createRow(fmt.outerHTML + min.outerHTML)); toolBody.appendChild(out);
  const btns = toolBody.querySelectorAll('.smallBtn'); btns[0].onclick = fmt.onclick; btns[1].onclick = min.onclick;
}

/* 20 Word Counter */
function renderWordCounter(){
  toolBody.innerHTML = '';
  const ta = document.createElement('textarea'); ta.className='input'; ta.style.height='140px';
  const count = document.createElement('button'); count.className='smallBtn'; count.innerText='Count';
  const out = document.createElement('div');
  count.onclick = ()=> { const s = ta.value||''; const words = s.trim()? s.trim().split(/\s+/).length : 0; out.innerText = `Words: ${words}, Characters: ${s.length}`; };
  toolBody.appendChild(ta); toolBody.appendChild(createRow(count.outerHTML)); toolBody.appendChild(out);
  toolBody.querySelector('.smallBtn').onclick = count.onclick;
}

/* 21 Palindrome Checker */
function renderPalindrome(){
  toolBody.innerHTML = '';
  const input = document.createElement('input'); input.className='input'; input.placeholder='Text';
  const check = document.createElement('button'); check.className='smallBtn'; check.innerText='Check';
  const out = document.createElement('div');
  check.onclick = ()=> { const s = (input.value||'').replace(/[^a-z0-9]/gi,'').toLowerCase(); out.innerText = s === s.split('').reverse().join('') ? 'Palindrome' : 'Not palindrome'; };
  toolBody.appendChild(input); toolBody.appendChild(createRow(check.outerHTML)); toolBody.appendChild(out);
  toolBody.querySelector('.smallBtn').onclick = check.onclick;
}

/* 22 Text Reverser */
function renderReverser(){
  toolBody.innerHTML = '';
  const ta = document.createElement('textarea'); ta.className='input'; ta.style.height='120px';
  const rev = document.createElement('button'); rev.className='smallBtn'; rev.innerText='Reverse';
  const out = document.createElement('div');
  rev.onclick = ()=> { out.innerText = (ta.value||'').split('').reverse().join(''); };
  toolBody.appendChild(ta); toolBody.appendChild(createRow(rev.outerHTML)); toolBody.appendChild(out);
  toolBody.querySelector('.smallBtn').onclick = rev.onclick;
}

/* 23 Image -> Base64 */
function renderImageToBase64(){
  toolBody.innerHTML = '';
  const file = document.createElement('input'); file.type='file'; file.accept='image/*';
  const conv = document.createElement('button'); conv.className='smallBtn'; conv.innerText='Convert';
  const out = document.createElement('div'); out.style.marginTop='8px';
  conv.onclick = ()=> {
    const f = file.files[0]; if(!f) return alert('Select image');
    const fr = new FileReader();
    fr.onload = e => { const data = e.target.result; out.innerText = data.slice(0,200)+'...'; const im = document.createElement('img'); im.src=data; im.style.maxWidth='160px'; im.style.display='block'; im.style.marginTop='8px'; out.appendChild(im); };
    fr.readAsDataURL(f);
  };
  toolBody.appendChild(file); toolBody.appendChild(createRow(conv.outerHTML)); toolBody.appendChild(out);
  toolBody.querySelector('.smallBtn').onclick = conv.onclick;
}

/* 24 SHA-256 */
async function renderSHA(){
  toolBody.innerHTML = '';
  const ta = document.createElement('textarea'); ta.className='input'; ta.style.height='100px';
  const hashBtn = document.createElement('button'); hashBtn.className='smallBtn'; hashBtn.innerText='Hash (SHA-256)';
  const out = document.createElement('div'); out.style.marginTop='8px'; out.style.wordBreak='break-all';
  hashBtn.onclick = async ()=> {
    const txt = ta.value || '';
    const buf = new TextEncoder().encode(txt);
    const digest = await crypto.subtle.digest('SHA-256', buf);
    const hex = Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
    out.innerText = hex;
  };
  toolBody.appendChild(ta); toolBody.appendChild(createRow(hashBtn.outerHTML)); toolBody.appendChild(out);
  toolBody.querySelector('.smallBtn').onclick = hashBtn.onclick;
}

/* 25 Live Clock */
let clkInterval = null;
function renderClock(){
  toolBody.innerHTML = '';
  const disp = document.createElement('div'); disp.style.fontSize='1.2rem'; disp.style.fontWeight='700';
  toolBody.appendChild(disp);
  clearInterval(clkInterval);
  clkInterval = setInterval(()=> { disp.innerText = new Date().toLocaleString(); }, 500);
}

/* Router */
function renderTool(id){
  toolBody.innerHTML = '';
  switch(id){
    case 'idea': renderIdea(); break;
    case 'calc': renderCalc(); break;
    case 'color': renderColorPicker(); break;
    case 'countdown': renderCountdown(); break;
    case 'stopwatch': renderStopwatch(); break;
    case 'notes': renderNotes(); break;
    case 'todo': renderTodo(); break;
    case 'password': renderPassword(); break;
    case 'b64': renderBase64(); break;
    case 'binary': renderBinary(); break;
    case 'bmi': renderBMI(); break;
    case 'age': renderAge(); break;
    case 'rng': renderRng(); break;
    case 'rgbhex': renderRgbHex(); break;
    case 'tts': renderTTS(); break;
    case 'stt': renderSTT(); break;
    case 'unit': renderUnit(); break;
    case 'temp': renderTemp(); break;
    case 'json': renderJSON(); break;
    case 'word': renderWordCounter(); break;
    case 'pal': renderPalindrome(); break;
    case 'rev': renderReverser(); break;
    case 'imgb64': renderImageToBase64(); break;
    case 'sha': renderSHA(); break;
    case 'clock': renderClock(); break;
    default: toolBody.innerText = 'Tool not found';
  }
}

/* Small helpers: when clicking a tool card we open popup and call renderTool */
function openTool(id,name){
  // require Start Experience to be clicked
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

/* Attach openTool to all cards created earlier */
document.querySelectorAll('.tool-card').forEach(c=>{
  // already built in buildToolsGrid
});

/* Expose openTool to grid items created earlier */
function openToolFromGrid(id, name){ openTool(id, name); }

/* Ensure the global openTool used by each created card points to correct function */
document.querySelectorAll('.tool-card').forEach(card=>{
  const id = card.dataset.id;
  const found = TOOLS.find(t=>t.id===id);
  if(found) card.onclick = ()=> openTool(found.id, found.name);
});

/* show contact closing */
document.getElementById('toolClose').addEventListener('click', closeToolPopup);

/* Safety initial state */
toolsBox.style.display = 'none';
toolPopup.style.display = 'none';
contactModal.style.display = 'none';
extraButtons.style.display = 'none';

/* Extra: show extraButtons after first start click (also prevent duplicate reveal) */
startBtn.addEventListener('click', ()=> { extraButtons.style.display = 'flex'; });

/* End of script */    default: toolBody.innerHTML = '<div>Tool not found</div>';
  }
}

/* -- IMPLEMENTATIONS -- */

/* 1 Idea */
function renderIdea(){
  toolBody.innerHTML = `<div id="ideaOut">Press Generate to create an idea.</div>
    <div class="row" style="margin-top:10px">
      <button class="smallBtn" id="genIdeaBtn">Generate</button>
      <button class="smallBtn" id="copyIdeaBtn">Copy</button>
    </div>`;
  const themes=["mobile app","micro-SaaS","AI assistant","niche marketplace","developer tool","education app"];
  const mods=["for creators","for students","for teams","with offline mode","with realtime sync","with templates"];
  const feats=["analytics dashboard","one-click export","smart suggestions","voice control","dark mode"];
  document.getElementById('genIdeaBtn').onclick = ()=>{
    const idea = `A ${themes.rand()} ${mods.rand()} that includes ${feats.rand()}.`;
    document.getElementById('ideaOut').innerText = idea;
  };
  document.getElementById('copyIdeaBtn').onclick = ()=> {
    const t = document.getElementById('ideaOut').innerText;
    navigator.clipboard?.writeText(t).then(()=> alert('Copied'));
  };
}

/* 2 Calculator */
function renderCalc(){
  toolBody.innerHTML = `<div><input id="calcIn" class="input" placeholder="e.g. (2+2)*3" /></div>
    <div class="row" style="margin-top:8px"><button class="smallBtn" id="calcRun">Calculate</button></div>
    <div id="calcRes" style="margin-top:8px"></div>`;
  document.getElementById('calcRun').onclick = ()=>{
    const v = document.getElementById('calcIn').value;
    try{ const r = Function('"use strict";return ('+v+')')(); document.getElementById('calcRes').innerText = r; } catch(e){ document.getElementById('calcRes').innerText = 'Error'; }
  };
}

/* 3 Color Picker */
function renderColorPicker(){
  toolBody.innerHTML = `<div class="row"><input id="colorIn" type="color" value="#7b2ff7" /></div>
    <div id="colorVal" style="margin-top:10px"></div>`;
  const colorIn = document.getElementById('colorIn');
  function update(){ document.getElementById('colorVal').innerText = colorIn.value; }
  colorIn.addEventListener('input', update);
  update();
}

/* 4 Countdown Timer */
let countdownTimer=null;
function renderCountdown(){
  toolBody.innerHTML = `<div><input id="cdMin" type="number" placeholder="Seconds" class="input"/></div>
    <div class="row" style="margin-top:8px"><button class="smallBtn" id="cdStart">Start</button><button class="smallBtn" id="cdStop">Stop</button></div>
    <div id="cdOut" style="margin-top:10px;font-weight:700"></div>`;
  const out = document.getElementById('cdOut');
  document.getElementById('cdStart').onclick = ()=>{
    const secs = Math.max(1, Number(document.getElementById('cdMin').value) || 10);
    let rem = secs;
    clearInterval(countdownTimer);
    out.innerText = rem + 's';
    countdownTimer = setInterval(()=>{ rem--; out.innerText = rem+'s'; if(rem<=0){ clearInterval(countdownTimer); out.innerText='Done'; } }, 1000);
  };
  document.getElementById('cdStop').onclick = ()=> { clearInterval(countdownTimer); out.innerText='Stopped'; };
}

/* 5 Stopwatch */
let swInterval=null, swStart=null;
function renderStopwatch(){
  toolBody.innerHTML = `<div id="swTime">00:00:00.000</div>
    <div class="row" style="margin-top:8px"><button class="smallBtn" id="swStart">Start</button><button class="smallBtn" id="swStop">Stop</button><button class="smallBtn" id="swReset">Reset</button></div>`;
  const timeEl = document.getElementById('swTime');
  document.getElementById('swStart').onclick = ()=>{
    if(swInterval) return;
    swStart = Date.now() - (window._swOffset||0);
    swInterval = setInterval(()=> {
      const diff = Date.now() - swStart;
      window._swOffset = diff;
      timeEl.innerText = msToTime(diff);
    }, 37);
  };
  document.getElementById('swStop').onclick = ()=>{ clearInterval(swInterval); swInterval=null; };
  document.getElementById('swReset').onclick = ()=>{ clearInterval(swInterval); swInterval=null; window._swOffset=0; timeEl.innerText='00:00:00.000'; };
}
function msToTime(ms){ const h = Math.floor(ms/3600000); const m = Math.floor(ms%3600000/60000); const s = Math.floor(ms%60000/1000); const msr = ms%1000; return `${pad(h)}:${pad(m)}:${pad(s)}.${String(msr).padStart(3,'0')}`; }
function pad(n){ return String(n).padStart(2,'0'); }

/* 6 Notes (localStorage) */
function renderNotes(){
  toolBody.innerHTML = `<textarea id="notesA" class="input" style="height:140px" placeholder="Write notes..."></textarea>
    <div class="row" style="margin-top:8px"><button class="smallBtn" id="notesSave">Save</button><button class="smallBtn" id="notesLoad">Load</button></div><div id="notesMsg" style="margin-top:8px"></div>`;
  document.getElementById('notesSave').onclick = ()=>{ localStorage.setItem('cyberx_notes', document.getElementById('notesA').value); document.getElementById('notesMsg').innerText='Saved'; };
  document.getElementById('notesLoad').onclick = ()=>{ document.getElementById('notesA').value = localStorage.getItem('cyberx_notes') || ''; document.getElementById('notesMsg').innerText='Loaded'; };
}

/* 7 Todo (localStorage) */
function renderTodo(){
  toolBody.innerHTML = `<div><input id="todoInput" class="input" placeholder="New task"/></div>
    <div class="row" style="margin-top:8px"><button class="smallBtn" id="todoAdd">Add</button><button class="smallBtn" id="todoClear">Clear All</button></div>
    <ul id="todoList" style="text-align:left;margin-top:8px;max-height:220px;overflow:auto;padding-left:16px"></ul>`;
  const listEl = document.getElementById('todoList');
  function load(){ const arr = JSON.parse(localStorage.getItem('cyberx_todo')||'[]'); listEl.innerHTML=''; arr.forEach((t,i)=>{ const li = document.createElement('li'); li.textContent = t + ' '; const del = document.createElement('button'); del.textContent='x'; del.style.marginLeft='8px'; del.onclick = ()=> { arr.splice(i,1); localStorage.setItem('cyberx_todo', JSON.stringify(arr)); load(); }; li.appendChild(del); listEl.appendChild(li); }); }
  document.getElementById('todoAdd').onclick = ()=> { const v = document.getElementById('todoInput').value.trim(); if(!v) return; const arr = JSON.parse(localStorage.getItem('cyberx_todo')||'[]'); arr.push(v); localStorage.setItem('cyberx_todo', JSON.stringify(arr)); document.getElementById('todoInput').value=''; load(); };
  document.getElementById('todoClear').onclick = ()=> { localStorage.removeItem('cyberx_todo'); load(); };
  load();
}

/* 8 Password */
function renderPassword(){
  toolBody.innerHTML = `<div><input id="pwLen" type="number" class="input" value="16" min="4" max="128"/></div>
    <div class="row" style="margin-top:8px"><button class="smallBtn" id="pwGen">Generate</button><button class="smallBtn" id="pwCopy">Copy</button></div>
    <div id="pwOut" style="margin-top:8px;font-family:monospace"></div>`;
  document.getElementById('pwGen').onclick = ()=> {
    const len = Math.max(4, Number(document.getElementById('pwLen').value)||16);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let out=''; for(let i=0;i<len;i++) out += chars.charAt(Math.floor(Math.random()*chars.length));
    document.getElementById('pwOut').textContent = out;
  };
  document.getElementById('pwCopy').onclick = ()=> { navigator.clipboard?.writeText(document.getElementById('pwOut').textContent||'').then(()=>alert('Copied')); };
}

/* 9 Base64 */
function renderBase64(){
  toolBody.innerHTML = `<div><textarea id="b64In" class="input" placeholder="Text or base64" style="height:80px"></textarea></div>
    <div class="row" style="margin-top:8px"><button class="smallBtn" id="b64Enc">Encode</button><button class="smallBtn" id="b64Dec">Decode</button></div>
    <div id="b64Out" style="margin-top:8px"></div>`;
  document.getElementById('b64Enc').onclick = ()=> { try{ document.getElementById('b64Out').innerText = btoa(unescape(encodeURIComponent(document.getElementById('b64In').value||''))); }catch{document.getElementById('b64Out').innerText='Error'} };
  document.getElementById('b64Dec').onclick = ()=> { try{ document.getElementById('b64Out').innerText = decodeURIComponent(escape(atob(document.getElementById('b64In').value||''))); }catch{document.getElementById('b64Out').innerText='Invalid Base64'} };
}

/* 10 Binary */
function renderBinary(){
  toolBody.innerHTML = `<div><textarea id="binIn" class="input" style="height:80px" placeholder="Text or binary"/></textarea></div>
    <div class="row" style="margin-top:8px"><button class="smallBtn" id="t2b">Text → Binary</button><button class="smallBtn" id="b2t">Binary → Text</button></div>
    <div id="binOut" style="margin-top:8px"></div>`;
  document.getElementById('t2b').onclick = ()=> { const s=document.getElementById('binIn').value||''; document.getElementById('binOut').innerText = Array.from(s).map(ch=>ch.charCodeAt(0).toString(2).padStart(8,'0')).join(' '); };
  document.getElementById('b2t').onclick = ()=> { try{ const parts = (document.getElementById('binIn').value||'').trim().split(/\s+/); document.getElementById('binOut').innerText = parts.map(b=>String.fromCharCode(parseInt(b,2))).join(''); }catch{document.getElementById('binOut').innerText='Invalid'} };
}

/* 11 BMI */
function renderBMI(){
  toolBody.innerHTML = `<div><input id="weight" class="input" placeholder="Weight (kg)"/><input id="height" class="input" placeholder="Height (m)"/></div>
    <div class="row" style="margin-top:8px"><button class="smallBtn" id="calcBmi">Calculate</button></div><div id="bmiOut" style="margin-top:8px"></div>`;
  document.getElementById('calcBmi').onclick = ()=> {
    const w=Number(document.getElementById('weight').value), h=Number(document.getElementById('height').value);
    if(!w||!h){ document.getElementById('bmiOut').innerText='Enter numbers'; return; }
    const bmi = (w/(h*h)).toFixed(2); document.getElementById('bmiOut').innerText = `BMI: ${bmi}`;
  };
}

/* 12 Age */
function renderAge(){
  toolBody.innerHTML = `<div><input id="dob" type="date" class="input"/></div><div class="row" style="margin-top:8px"><button class="smallBtn" id="ageCalc">Calculate Age</button></div><div id="ageOut" style="margin-top:8px"></div>`;
  document.getElementById('ageCalc').onclick = ()=>{
    const d = document.getElementById('dob').value; if(!d){ document.getElementById('ageOut').innerText='Select date'; return; }
    const diff = Date.now() - new Date(d).getTime(); const years = Math.floor(diff/31557600000); document.getElementById('ageOut').innerText = `${years} years`;
  };
}

/* 13 RNG */
function renderRng(){ toolBody.innerHTML = `<div><input id="minR" class="input" placeholder="Min (default 0)"/><input id="maxR" class="input" placeholder="Max (default 100)"/></div><div class="row" style="margin-top:8px"><button class="smallBtn" id="rngGo">Generate</button></div><div id="rngOut" style="margin-top:8px"></div>`; document.getElementById('rngGo').onclick = ()=>{ const min = Number(document.getElementById('minR').value)||0; const max = Number(document.getElementById('maxR').value)||100; document.getElementById('rngOut').innerText = Math.floor(Math.random()*(max-min+1))+min; }; }

/* 14 RGB<>HEX */
function renderRgbHex(){
  toolBody.innerHTML = `<div class="row"><input id="hexIn" class="input" placeholder="#rrggbb"/><input id="rIn" class="input" placeholder="R"/></div>
    <div class="row" style="margin-top:8px"><button class="smallBtn" id="toRgb">HEX → RGB</button><button class="smallBtn" id="toHex">RGB → HEX</button></div>
    <div id="rhOut" style="margin-top:8px"></div>`;
  document.getElementById('toRgb').onclick = ()=> {
    const h = (document.getElementById('hexIn').value||'').replace('#',''); if(h.length!==6){ document.getElementById('rhOut').innerText='Invalid hex'; return; }
    const bi = parseInt(h,16), r=(bi>>16)&255, g=(bi>>8)&255, b=bi&255; document.getElementById('rhOut').innerText = `rgb(${r}, ${g}, ${b})`;
  };
  document.getElementById('toHex').onclick = ()=> {
    const r = Number(document.getElementById('rIn').value)||0; const g = Number(prompt('G value (0-255)','128'))||0; const b = Number(prompt('B value (0-255)','128'))||0;
    document.getElementById('rhOut').innerText = '#'+[r,g,b].map(n=>Number(n).toString(16).padStart(2,'0')).join('');
  };
}

/* 15 TTS */
function renderTTS(){
  toolBody.innerHTML = `<div><textarea id="ttsText" class="input" style="height:90px" placeholder="Text to speak"></textarea></div><div class="row" style="margin-top:8px"><button class="smallBtn" id="ttsPlay">Speak</button></div>`;
  document.getElementById('ttsPlay').onclick = ()=> {
    if(!('speechSynthesis' in window)) return alert('TTS not supported');
    const u = new SpeechSynthesisUtterance(document.getElementById('ttsText').value||'');
    speechSynthesis.speak(u);
  };
}

/* 16 STT */
let sttRec = null;
function renderSTT(){
  toolBody.innerHTML = `<div class="row"><button class="smallBtn" id="sttBtn">Start/Stop Listening</button></div><div id="sttOut" style="margin-top:8px"></div>`;
  const btn = document.getElementById('sttBtn'), out = document.getElementById('sttOut');
  btn.onclick = ()=>{
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) return out.innerText = 'Speech recognition not supported';
    if(sttRec){ sttRec.stop(); sttRec=null; btn.innerText='Start/Stop Listening'; return; }
    sttRec = new SR(); sttRec.lang='en-US'; sttRec.onresult = (ev)=> out.innerText = Array.from(ev.results).map(r=>r[0].transcript).join(' ');
    sttRec.start();
    btn.innerText='Stop Listening';
  };
}

/* 17 Unit Converter (length / weight) */
function renderUnit(){
  toolBody.innerHTML = `<div><select id="unitType" class="input"><option value="mft">Meters ↔ Feet</option><option value="kglb">Kg ↔ Lb</option></select></div>
    <div><input id="unitVal" class="input" placeholder="Value"/></div>
    <div class="row" style="margin-top:8px"><button class="smallBtn" id="unitF">Convert →</button><button class="smallBtn" id="unitB">Convert ←</button></div>
    <div id="unitOut" style="margin-top:8px"></div>`;
  function conv(dir){
    const type = document.getElementById('unitType').value, v = Number(document.getElementById('unitVal').value);
    if(isNaN(v)) return document.getElementById('unitOut').innerText='Enter number';
    let res='';
    if(type==='mft') res = dir==='f' ? (v*3.28084).toFixed(4)+' ft' : (v/3.28084).toFixed(4)+' m';
    else res = dir==='f' ? (v*2.20462).toFixed(4)+' lb' : (v/2.20462).toFixed(4)+' kg';
    document.getElementById('unitOut').innerText = res;
  }
  document.getElementById('unitF').onclick = ()=> conv('f');
  document.getElementById('unitB').onclick = ()=> conv('b');
}

/* 18 Temp Converter */
function renderTemp(){
  toolBody.innerHTML = `<div><input id="tempVal" class="input" placeholder="Temperature"/></div>
    <div class="row" style="margin-top:8px"><button class="smallBtn" id="toF">°C → °F</button><button class="smallBtn" id="toC">°F → °C</button></div>
    <div id="tempOut" style="margin-top:8px"></div>`;
  document.getElementById('toF').onclick = ()=> { const v=Number(document.getElementById('tempVal').value); document.getElementById('tempOut').innerText = (v*9/5+32).toFixed(2)+' °F'; };
  document.getElementById('toC').onclick = ()=> { const v=Number(document.getElementById('tempVal').value); document.getElementById('tempOut').innerText = ((v-32)*5/9).toFixed(2)+' °C'; };
}

/* 19 JSON Formatter */
function renderJSON(){
  toolBody.innerHTML = `<textarea id="jsonIn" class="input" style="height:140px" placeholder='Enter JSON'></textarea>
    <div class="row" style="margin-top:8px"><button class="smallBtn" id="jsonFmt">Format</button><button class="smallBtn" id="jsonMin">Minify</button></div>
    <div id="jsonOut" style="margin-top:8px;white-space:pre-wrap;text-align:left"></div>`;
  document.getElementById('jsonFmt').onclick = ()=> { try{ const v=JSON.parse(document.getElementById('jsonIn').value); document.getElementById('jsonOut').innerText = JSON.stringify(v,null,2); }catch(e){ document.getElementById('jsonOut').innerText='Invalid JSON'; } };
  document.getElementById('jsonMin').onclick = ()=> { try{ const v=JSON.parse(document.getElementById('jsonIn').value); document.getElementById('jsonOut').innerText = JSON.stringify(v); }catch(e){ document.getElementById('jsonOut').innerText='Invalid JSON'; } };
}

/* 20 Word Counter */
function renderWordCounter(){
  toolBody.innerHTML = `<textarea id="wcIn" class="input" style="height:140px"></textarea><div class="row" style="margin-top:8px"><button class="smallBtn" id="wcBtn">Count</button></div><div id="wcOut" style="margin-top:8px"></div>`;
  document.getElementById('wcBtn').onclick = ()=> { const txt = document.getElementById('wcIn').value||''; const words = txt.trim() ? txt.trim().split(/\s+/).length : 0; document.getElementById('wcOut').innerText = `Words: ${words}, Characters: ${txt.length}`; };
}

/* 21 Palindrome */
function renderPalindrome(){ toolBody.innerHTML = `<input id="palIn" class="input" placeholder="Text"/><div class="row" style="margin-top:8px"><button class="smallBtn" id="palBtn">Check</button></div><div id="palOut" style="margin-top:8px"></div>`; document.getElementById('palBtn').onclick = ()=>{ const s=(document.getElementById('palIn').value||'').replace(/[^a-z0-9]/gi,'').toLowerCase(); document.getElementById('palOut').innerText = s === s.split('').reverse().join('') ? 'Palindrome' : 'Not palindrome'; } }

/* 22 Text Reverser */
function renderReverser(){ toolBody.innerHTML = `<textarea id="revIn" class="input" style="height:100px"></textarea><div class="row" style="margin-top:8px"><button class="smallBtn" id="revBtn">Reverse</button></div><div id="revOut" style="margin-top:8px"></div>`; document.getElementById('revBtn').onclick = ()=> { const s=document.getElementById('revIn').value||''; document.getElementById('revOut').innerText = s.split('').reverse().join(''); } }

/* 23 Image -> Base64 */
function renderImageToBase64(){
  toolBody.innerHTML = `<input id="imgFile" type="file" accept="image/*" /><div class="row" style="margin-top:8px"><button class="smallBtn" id="imgConv">Convert</button></div><div id="imgOut" style="margin-top:8px"></div>`;
  document.getElementById('imgConv').onclick = ()=> {
    const f = document.getElementById('imgFile').files[0]; if(!f) return alert('Select file');
    const r = new FileReader();
    r.onload = e => { const data = e.target.result; document.getElementById('imgOut').innerText = data.slice(0,200) + '...'; const im=document.createElement('img'); im.src=data; im.style.maxWidth='160px'; im.style.display='block'; im.style.marginTop='8px'; document.getElementById('imgOut').appendChild(im); };
    r.readAsDataURL(f);
  };
}

/* 24 SHA-256 */
async function renderSHA(){
  toolBody.innerHTML = `<textarea id="shaIn" class="input" style="height:80px"></textarea><div class="row" style="margin-top:8px"><button class="smallBtn" id="shaBtn">Hash (SHA-256)</button></div><div id="shaOut" style="margin-top:8px;word-break:break-all"></div>`;
  document.getElementById('shaBtn').onclick = async ()=> {
    const txt = document.getElementById('shaIn').value || '';
    const buf = new TextEncoder().encode(txt);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
    document.getElementById('shaOut').innerText = hex;
  };
}

/* 25 Live Clock */
let clockInterval;
function renderClock(){
  toolBody.innerHTML = `<div id="clk" style="font-size:1.4rem;font-weight:700"></div>`;
  const clk = document.getElementById('clk');
  clearInterval(clockInterval);
  clockInterval = setInterval(()=> { const d = new Date(); clk.innerText = d.toLocaleString(); }, 500);
}

/* Utilities & helpers */
Array.prototype.rand = function(){ return this[Math.floor(Math.random()*this.length)]; };

/* Provide initial UI state: hide tools panel and popup */
toolsPanel.style.display = 'none';
toolPopup.style.display = 'none';
contactModal.style.display = 'none';

/* ensure extraRow hidden until start clicked */
document.getElementById('extraRow').style.display = 'none';
startBtn.addEventListener('click', ()=> { document.getElementById('extraRow').style.display = 'flex'; });

/* ensure close button connection (when popup built) */
document.getElementById('toolCloseBtn').addEventListener('click', closeTool);    d.setAttribute('data-tool', t.id);
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
