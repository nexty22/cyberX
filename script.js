/* CyberX script.js (split version)
   - Particles
   - Mode toggle
   - Music + Start Experience
   - Visitor counters (CountAPI)
   - Tools (25) with popup
   - Contact modal
*/

document.addEventListener('DOMContentLoaded', () => {
  //////////////////////
  // Element refs
  //////////////////////
  const toggleModeBtn = document.getElementById('toggleMode');
  const contactBtn = document.getElementById('contactBtn');
  const contactModal = document.getElementById('contactModal');
  const contactClose = document.getElementById('contactClose');
  const startBtn = document.getElementById('startBtn');
  const extraBtns = document.getElementById('extraBtns');
  const toolsBtn = document.getElementById('toolsBtn');
  const toolsBox = document.getElementById('toolsBox');
  const toolsGrid = document.getElementById('toolsGrid');
  const coming1 = document.getElementById('coming1');
  const coming2 = document.getElementById('coming2');

  const pageviewsEl = document.getElementById('pageviewsCount');
  const uniqueEl = document.getElementById('uniqueCount');
  const activeEl = document.getElementById('activeCount');

  const popup = document.getElementById('toolPopup');
  const popupTitle = document.getElementById('popupTitle');
  const popupBody = document.getElementById('popupBody');
  const popupClose = document.getElementById('popupClose');

  const bgMusic = document.getElementById('bgMusic');

  // safety: if missing elements (user edited), stop
  if (!pageviewsEl || !uniqueEl || !popup || !toolsGrid) {
    console.warn('Essential elements missing from DOM.');
  }

  //////////////////////
  // Particles
  //////////////////////
  (function particlesInit(){
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
    resize(); window.addEventListener('resize', resize);
    const particles = [];
    for (let i=0;i<90;i++){
      particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*1.6+0.6,
        vx: (Math.random()-0.5)*0.7,
        vy: (Math.random()-0.5)*0.7
      });
    }
    function frame(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p=>{
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.fillStyle = 'rgba(123,47,247,0.6)';
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      });
      requestAnimationFrame(frame);
    }
    frame();
  })();

  //////////////////////
  // Mode toggle
  //////////////////////
  toggleModeBtn.addEventListener('click', ()=> document.body.classList.toggle('light-mode'));

  //////////////////////
  // Contact modal
  //////////////////////
  contactBtn.addEventListener('click', ()=> {
    contactModal.style.display = 'flex';
    contactModal.classList.add('show');
  });
  if (contactClose) contactClose.addEventListener('click', ()=> {
    contactModal.style.display = 'none';
    contactModal.classList.remove('show');
  });
  contactModal.addEventListener('click', (e)=> { if (e.target === contactModal) { contactModal.style.display = 'none'; contactModal.classList.remove('show'); } });

  //////////////////////
  // Start Experience: music + extra buttons
  //////////////////////
  let started = false;
  startBtn.addEventListener('click', ()=> {
    if (!started){
      bgMusic.play().catch(()=>{}); // may be blocked on some browsers until a gesture
      startBtn.innerText = '⏸ Pause Music';
      extraBtns.classList.add('show'); extraBtns.style.display = 'flex';
      started = true;
    } else {
      if (bgMusic.paused) { bgMusic.play().catch(()=>{}); startBtn.innerText = '⏸ Pause Music'; }
      else { bgMusic.pause(); startBtn.innerText = '🚀 Start Experience'; }
    }
  });

  //////////////////////
  // Tools UI: definitions + rendering
  //////////////////////
  const TOOLS = [
    {id:'idea', name:'Idea Generator', init: toolIdea},
    {id:'calc', name:'Calculator', init: toolCalc},
    {id:'scheduler', name:'Scheduler', init: toolScheduler},
    {id:'notes', name:'Notes', init: toolNotes},
    {id:'webpreview', name:'Web Preview', init: toolWebPreview},
    {id:'color', name:'Color Picker', init: toolColor},
    {id:'tictactoe', name:'Tic-Tac-Toe', init: toolTicTacToe},
    {id:'brainteaser', name:'Brain Teasers', init: toolBrain},
    {id:'chart', name:'Chart (SVG)', init: toolChart},
    {id:'textfmt', name:'Text Formatter', init: toolTextFmt},
    {id:'img2b64', name:'Image → Base64', init: toolImg2B64},
    {id:'password', name:'Password Generator', init: toolPassword},
    {id:'wordcount', name:'Word Counter', init: toolWordCount},
    {id:'stopwatch', name:'Stopwatch', init: toolStopwatch},
    {id:'todo', name:'To-Do List', init: toolTodo},
    {id:'imageresize', name:'Image Resizer', init: toolImageResize},
    {id:'audioplayer', name:'Audio Player', init: toolAudioPlayer},
    {id:'filesaver', name:'File Saver', init: toolFileSaver},
    {id:'devtools', name:'Dev Info', init: toolDevInfo},
    {id:'analytics', name:'Analytics Viewer', init: toolAnalytics},
    {id:'dateconv', name:'Date Calculator', init: toolDateCalc},
    {id:'quote', name:'Quote Generator', init: toolQuote},
    {id:'mirror', name:'Mirror (camera)', init: toolMirror},
    {id:'randomizer', name:'Randomizer', init: toolRandomizer},
    {id:'puzzle', name:'Puzzle Box', init: toolPuzzle}
  ];

  const EMOJI = ["💡","🧮","📅","📝","🌐","🎨","🎮","🧠","📊","🔤","🖼️","🔐","🔢","⏱️","✅","🖼️","🎧","💾","🧰","📈","📆","📣","🪞","🎲","🧩"];

  // populate grid
  TOOLS.forEach((t,i)=>{
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `<div class="tool-emoji">${EMOJI[i]||'🔧'}</div><div class="tool-name">${t.name}</div>`;
    card.addEventListener('click', ()=> openTool(t));
    toolsGrid.appendChild(card);
  });

  // tools button toggles tools box
  toolsBtn.addEventListener('click', ()=> {
    toolsBox.style.display = (toolsBox.style.display === 'block') ? 'none' : 'block';
  });
  coming1.addEventListener('click', ()=> showPopup('🚧 Coming soon', '<p>Feature under development — stay tuned!</p>'));
  coming2.addEventListener('click', ()=> showPopup('🚧 Coming soon', '<p>Feature under development — stay tuned!</p>'));

  // popup controls
  popupClose.addEventListener('click', closePopup);
  popup.addEventListener('click', e=> { if (e.target === popup) closePopup(); });
  document.addEventListener('keydown', e=> { if (e.key === 'Escape') closePopup(); });

  function openTool(tool){
    if (!extraBtns.classList.contains('show')) { alert('Click Start Experience first to unlock tools'); return; }
    popupTitle.innerText = tool.name;
    popupBody.innerHTML = '<div style="opacity:.7">Loading...</div>';
    popup.classList.add('show'); popup.style.display = 'flex';
    setTimeout(()=> {
      try { tool.init(popupBody); } catch (err) { popupBody.innerHTML = '<pre style="color:#f88">'+err+'</pre>'; }
    }, 80);
  }
  function showPopup(title, html){
    popupTitle.innerText = title;
    popupBody.innerHTML = html;
    popup.classList.add('show'); popup.style.display = 'flex';
  }
  function closePopup(){
    popup.classList.remove('show'); popup.style.display = 'none'; popupBody.innerHTML = '';
  }

  //////////////////////
  // Visitor counters (CountAPI)
  //////////////////////
  (function counters(){
    const NAMESPACE = 'nexty22-cyberx';
    const PAGE_KEY = 'pageviews';
    const UNIQUE_KEY = 'unique';

    async function hit(key){
      try{
        const res = await fetch(`https://api.countapi.xyz/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(key)}`);
        if (!res.ok) throw 0;
        return await res.json();
      } catch(e){
        return null;
      }
    }
    async function get(key){
      try{
        const res = await fetch(`https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(key)}`);
        if (!res.ok) throw 0;
        return await res.json();
      } catch(e){
        return null;
      }
    }

    (async ()=>{
      const p = await hit(PAGE_KEY);
      if (p && pageviewsEl) pageviewsEl.innerText = (p.value||0).toLocaleString();
      else { const g = await get(PAGE_KEY); if (g && pageviewsEl) pageviewsEl.innerText = (g.value||0).toLocaleString(); }
    })();

    (async ()=>{
      if (!localStorage.getItem('cyberx_seen_v4')){
        const u = await hit(UNIQUE_KEY);
        if (u && uniqueEl) uniqueEl.innerText = (u.value||0).toLocaleString();
        localStorage.setItem('cyberx_seen_v4', Date.now().toString());
      } else {
        const g = await get(UNIQUE_KEY);
        if (g && uniqueEl) uniqueEl.innerText = (g.value||0).toLocaleString();
      }
    })();

    // active (rough) based on last tab ping
    (function activeLocal(){
      const key = 'cyberx_active_ts_v1';
      function ping(){ localStorage.setItem(key, Date.now().toString()); }
      ping(); setInterval(ping, 5000);
      setInterval(()=> {
        const ts = parseInt(localStorage.getItem(key)||'0', 10);
        const now = Date.now();
        activeEl.innerText = (now - ts) < 15000 ? '1' : '0';
      }, 3000);
    })();

  })();

  //////////////////////
  // Tool implementations (functions)
  //////////////////////

  // utilities
  function create(tag, props={}, parent){
    const e = document.createElement(tag);
    Object.keys(props).forEach(k=>{
      if (k === 'className') e.className = props[k];
      else if (k === 'innerHTML') e.innerHTML = props[k];
      else e.setAttribute(k, props[k]);
    });
    if (parent) parent.appendChild(e);
    return e;
  }

  // 1 Idea Generator
  function toolIdea(parent){
    parent.innerHTML = '';
    const sel = create('select', {className:'input'}, parent);
    ['Mobile app','Micro-SaaS','Chrome extension','AI assistant','Niche marketplace'].forEach(s=> sel.appendChild(new Option(s,s)));
    const tone = create('select', {className:'input'}, parent);
    ['for creators','for students','for remote teams','with offline mode'].forEach(s=> tone.appendChild(new Option(s,s)));
    const feat = create('input', {className:'input', placeholder:'Optional extra'}, parent);
    const bwrap = create('div', {}, parent);
    const gen = create('button', {className:'smallBtn', innerHTML:'Generate Idea'}, bwrap);
    const copy = create('button', {className:'smallBtn ghost', innerHTML:'Copy'}, bwrap);
    const out = create('div', {style:'margin-top:10px; font-weight:700'}, parent);

    gen.addEventListener('click', ()=> {
      const idea = `${sel.value} ${tone.value}${feat.value? ' — includes '+feat.value: ''}`;
      out.innerHTML = `💡 <span style="color:#ffd">${idea}</span>`;
    });
    copy.addEventListener('click', ()=> navigator.clipboard?.writeText(out.innerText||'').then(()=> alert('Copied')));
  }

  // 2 Calculator (safe-ish)
  function toolCalc(parent){
    parent.innerHTML = '';
    const inp = create('input', {className:'input', placeholder:'e.g. (12+8)/4*3'}, parent);
    const run = create('button', {className:'smallBtn', innerHTML:'Calculate'}, parent);
    const out = create('div', {style:'margin-top:10px;font-family:monospace'}, parent);
    run.addEventListener('click', ()=> {
      try{
        // minimal sanitization: allow digits and math chars and Math.
        const expr = inp.value.replace(/\bPI\b/gi, 'Math.PI').replace(/\bE\b/g,'Math.E');
        const allowed = /^[0-9+\-*/().,\sMathPIEabsfloorceilsqrtminmaxpow,]*$/i;
        if (!allowed.test(expr)) throw 'Invalid characters';
        const res = Function('"use strict";return ('+expr+')')();
        out.innerText = '= ' + res;
      }catch(e){ out.innerText = 'Error: ' + e; }
    });
  }

  // 3 Scheduler
  function toolScheduler(parent){
    parent.innerHTML = '';
    const d = create('input',{type:'date',className:'input'},parent);
    const t = create('input',{type:'time',className:'input'},parent);
    const note = create('input',{className:'input', placeholder:'Reminder text'},parent);
    const add = create('button',{className:'smallBtn', innerHTML:'Save Reminder'},parent);
    const list = create('div',{style:'margin-top:10px;max-height:180px;overflow:auto'},parent);
    function load(){
      const arr = JSON.parse(localStorage.getItem('cyberx_sched')||'[]');
      list.innerHTML = '';
      arr.forEach((r,i)=>{
        const row = create('div',{},list);
        row.innerHTML = `<b>${r.date} ${r.time||''}</b> — ${r.note} <button data-i="${i}" style="margin-left:8px">✕</button>`;
        row.querySelector('button').addEventListener('click', ()=> { arr.splice(i,1); localStorage.setItem('cyberx_sched', JSON.stringify(arr)); load(); });
      });
    }
    add.addEventListener('click', ()=> {
      if(!d.value) return alert('Pick date');
      const arr = JSON.parse(localStorage.getItem('cyberx_sched')||'[]');
      arr.push({date:d.value, time:t.value, note:note.value});
      localStorage.setItem('cyberx_sched', JSON.stringify(arr)); load();
    });
    load();
  }

  // 4 Notes
  function toolNotes(parent){
    parent.innerHTML = '';
    const ta = create('textarea',{className:'input'},parent);
    const save = create('button',{className:'smallBtn', innerHTML:'Save'},parent);
    const load = create('button',{className:'smallBtn ghost', innerHTML:'Load'},parent);
    const dl = create('button',{className:'smallBtn ghost', innerHTML:'Download .txt'},parent);
    save.addEventListener('click', ()=> { localStorage.setItem('cyberx_notes_v2', ta.value); alert('Saved'); });
    load.addEventListener('click', ()=> { ta.value = localStorage.getItem('cyberx_notes_v2')||''; alert('Loaded'); });
    dl.addEventListener('click', ()=> { const blob = new Blob([ta.value||''],{type:'text/plain'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='notes.txt'; a.click(); });
  }

  // 5 Web preview (sandboxed iframe)
  function toolWebPreview(parent){
    parent.innerHTML = '';
    const inp = create('input',{className:'input', placeholder:'https://example.com'},parent);
    const go = create('button',{className:'smallBtn', innerHTML:'Preview (sandboxed iframe)'},parent);
    const out = create('div',{style:'margin-top:10px;max-height:360px;overflow:auto'},parent);
    go.addEventListener('click', ()=> {
      const url = inp.value.trim();
      if (!url) return alert('Enter URL');
      out.innerHTML = `<iframe src="${url}" style="width:100%;height:320px;border:1px solid rgba(255,255,255,0.06)" sandbox></iframe>`;
    });
  }

  // 6 Color picker
  function toolColor(parent){
    parent.innerHTML = '';
    const c = create('input',{type:'color', value:'#7b2ff7'},parent);
    const out = create('div',{style:'margin-top:8px;font-weight:700'},parent);
    c.addEventListener('input', ()=> out.innerText = c.value);
    out.innerText = c.value;
  }

  // 7 Tic-Tac-Toe (simple)
  function toolTicTacToe(parent){
    parent.innerHTML = '';
    const board = Array(9).fill(null);
    let turn = 'X';
    const grid = create('div',{style:'display:grid;grid-template-columns:repeat(3,80px);gap:6px;justify-content:center'},parent);
    const status = create('div',{style:'margin-top:10px'},parent);
    function draw(){
      grid.innerHTML='';
      for(let i=0;i<9;i++){
        const b = create('button',{style:'width:80px;height:80px;font-size:24px'},grid);
        b.innerText = board[i]||'';
        b.addEventListener('click', ()=> {
          if (board[i]) return;
          board[i]=turn; turn = (turn==='X'?'O':'X'); draw(); check();
        });
      }
    }
    function check(){
      const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      for(const w of wins){ const [a,b,c]=w; if(board[a] && board[a]===board[b] && board[a]===board[c]) { status.innerText = 'Winner: ' + board[a]; return; } }
      if(board.every(Boolean)) status.innerText = 'Draw';
      else status.innerText = 'Turn: ' + turn;
    }
    const reset = create('button',{className:'smallBtn', innerHTML:'Reset'},parent);
    reset.addEventListener('click', ()=> { for(let i=0;i<9;i++) board[i]=null; turn='X'; draw(); check(); });
    draw(); check();
  }

  // 8 Brain teasers
  function toolBrain(parent){
    parent.innerHTML = '';
    const list = [
      "I speak without a mouth... — An echo.",
      "What has keys but can't open locks? — A piano.",
      "What gets wetter the more it dries? — A towel."
    ];
    const out = create('div',{style:'min-height:80px;padding:8px;background:rgba(255,255,255,0.02);border-radius:8px'},parent);
    const btn = create('button',{className:'smallBtn', innerHTML:'New Riddle'},parent);
    btn.addEventListener('click', ()=> out.innerText = list[Math.floor(Math.random()*list.length)]);
    btn.click();
  }

  // 9 Chart builder (SVG)
  function toolChart(parent){
    parent.innerHTML = '';
    const ta = create('textarea',{className:'input', placeholder:'Numbers comma separated: 5,10,3,8'},parent);
    const gen = create('button',{className:'smallBtn', innerHTML:'Generate Chart'},parent);
    const out = create('div',{style:'margin-top:10px;overflow:auto'},parent);
    gen.addEventListener('click', ()=> {
      const arr = (ta.value||'').split(',').map(s=>Number(s.trim())).filter(n=>!isNaN(n));
      if (!arr.length) return alert('Enter numbers');
      const w = 400, h = 200; const max = Math.max(...arr);
      let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;
      const barW = w / arr.length;
      arr.forEach((v,i)=>{
        const bh = (v/max)*(h-20); const x = i*barW + 8; const y = h - bh - 10;
        svg += `<rect x="${x}" y="${y}" width="${barW-16}" height="${bh}" fill="#7b2ff7" rx="4"></rect>`;
        svg += `<text x="${x+6}" y="${h-2}" font-size="12" fill="#ddd">${v}</text>`;
      });
      svg += `</svg>`;
      out.innerHTML = svg;
    });
  }

  // 10 Text formatter (very basic)
  function toolTextFmt(parent){
    parent.innerHTML = '';
    const ta = create('textarea',{className:'input', placeholder:'# Title\n**bold**'},parent);
    const out = create('div',{style:'margin-top:8px;text-align:left;white-space:pre-wrap'},parent);
    ta.addEventListener('input', ()=> {
      let v = ta.value;
      v = v.replace(/^# (.*)$/gm, '\n\n== $1 ==\n\n');
      v = v.replace(/\*\*(.*?)\*\*/g, (m,p)=> p.toUpperCase());
      out.innerText = v;
    });
    ta.dispatchEvent(new Event('input'));
  }

  // 11 Image -> Base64
  function toolImg2B64(parent){
    parent.innerHTML = '';
    const f = create('input',{type:'file', accept:'image/*'},parent);
    const conv = create('button',{className:'smallBtn', innerHTML:'Convert'},parent);
    const out = create('div',{style:'margin-top:8px;max-height:260px;overflow:auto'},parent);
    conv.addEventListener('click', ()=> {
      const file = f.files[0]; if(!file) return alert('Choose image');
      const fr = new FileReader();
      fr.onload = e => out.innerHTML = `<textarea style="width:100%;height:120px">${e.target.result}</textarea><img src="${e.target.result}" style="max-width:180px;margin-top:8px">`;
      fr.readAsDataURL(file);
    });
  }

  // 12 Password generator
  function toolPassword(parent){
    parent.innerHTML = '';
    const len = create('input',{type:'number', className:'input', value:16, min:4, max:128},parent);
    const gen = create('button',{className:'smallBtn', innerHTML:'Generate'},parent);
    const out = create('div',{style:'margin-top:8px;font-family:monospace'},parent);
    gen.addEventListener('click', ()=> {
      const l = Math.max(4, Number(len.value)||16);
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
      let s=''; for (let i=0;i<l;i++) s += chars.charAt(Math.floor(Math.random()*chars.length));
      out.inn
