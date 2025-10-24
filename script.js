/* script.js - CyberX Nexty final
   - Particles, mode toggle
   - Start Experience (music + reveal)
   - Contact modal
   - Tools modal + 25 functional tools
   - Local visitor counters
*/

document.addEventListener('DOMContentLoaded', () => {
  // DOM refs
  const modeToggle = document.getElementById('modeToggle');
  const startBtn = document.getElementById('startBtn');
  const contactBtn = document.getElementById('contactBtn');
  const contactModal = document.getElementById('contactModal');
  const closeContact = document.getElementById('closeContact');
  const toolsBtn = document.getElementById('toolsBtn');
  const toolsModal = document.getElementById('toolsModal');
  const closeTools = document.getElementById('closeTools');
  const toolsGrid = document.getElementById('toolsGrid');
  const toolPanel = document.getElementById('toolPanel');
  const toolTitle = document.getElementById('toolTitle');
  const toolBody = document.getElementById('toolBody');
  const closePanel = document.getElementById('closePanel');
  const extraRow = document.getElementById('extraRow');
  const pvEl = document.getElementById('pv');
  const uvEl = document.getElementById('uv');
  const bgMusic = document.getElementById('bgMusic');

  // particles background
  (function particles(){
    const c = document.getElementById('particles');
    if(!c) return;
    const ctx = c.getContext('2d');
    function resize(){ c.width = innerWidth; c.height = innerHeight; }
    resize(); window.addEventListener('resize', resize);
    const parts = [];
    for(let i=0;i<80;i++) parts.push({x:Math.random()*c.width, y:Math.random()*c.height, r:Math.random()*1.6+0.6, vx:(Math.random()-0.5)*0.6, vy:(Math.random()-0.5)*0.6});
    function loop(){
      ctx.clearRect(0,0,c.width,c.height);
      for(const p of parts){
        p.x += p.vx; p.y += p.vy;
        if(p.x<0||p.x>c.width) p.vx *= -1;
        if(p.y<0||p.y>c.height) p.vy *= -1;
        ctx.fillStyle = 'rgba(123,47,247,0.6)';
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    loop();
  })();

  // mode toggle
  modeToggle.addEventListener('click', ()=>{
    document.body.classList.toggle('light-mode');
    modeToggle.textContent = document.body.classList.contains('light-mode') ? '🌞' : '🌙';
  });

  // visitor counters (local)
  let visits = parseInt(localStorage.getItem('cyberx_visits')||'0',10);
  visits++; localStorage.setItem('cyberx_visits', visits);
  pvEl.textContent = visits.toLocaleString();

  if(!localStorage.getItem('cyberx_seen')){
    localStorage.setItem('cyberx_seen','1');
    localStorage.setItem('cyberx_unique','1');
    uvEl.textContent = '1';
  } else {
    uvEl.textContent = (localStorage.getItem('cyberx_unique') || '1');
  }

  // Contact modal
  contactBtn.addEventListener('click', ()=> {
    contactModal.classList.add('show'); contactModal.style.display='flex';
  });
  closeContact && closeContact.addEventListener('click', ()=> { contactModal.classList.remove('show'); contactModal.style.display='none'; });
  contactModal.addEventListener('click', (e)=> { if(e.target === contactModal){ contactModal.classList.remove('show'); contactModal.style.display='none'; } });

  // Start Experience: reveal extras + music
  let started=false;
  startBtn.addEventListener('click', ()=>{
    if(!started){
      bgMusic.play().catch(()=>{}); // may be blocked but attempts
      startBtn.textContent = '⏸ Pause Experience';
      extraRow.classList.add('show'); extraRow.style.display='flex';
      started = true;
    } else {
      if(bgMusic.paused){ bgMusic.play().catch(()=>{}); startBtn.textContent='⏸ Pause Experience'; }
      else{ bgMusic.pause(); startBtn.textContent='🚀 Start Experience'; }
    }
  });

  // Tools definitions (25)
  const TOOLS = [
    {id:'idea', name:'Idea Generator', fn: toolIdea},
    {id:'calc', name:'Calculator', fn: toolCalc},
    {id:'scheduler', name:'Scheduler', fn: toolScheduler},
    {id:'notes', name:'Notes (local)', fn: toolNotes},
    {id:'preview', name:'Web Preview', fn: toolPreview},
    {id:'color', name:'Color Picker', fn: toolColor},
    {id:'coin', name:'Coin Flip', fn: toolCoin},
    {id:'chart', name:'Chart (SVG)', fn: toolChart},
    {id:'img64', name:'Image → Base64', fn: toolImg64},
    {id:'password', name:'Password Generator', fn: toolPassword},
    {id:'word', name:'Word Counter', fn: toolWord},
    {id:'stopwatch', name:'Stopwatch', fn: toolStopwatch},
    {id:'todo', name:'To-Do (local)', fn: toolTodo},
    {id:'resize', name:'Image Resize', fn: toolResize},
    {id:'audio', name:'Audio Player', fn: toolAudio},
    {id:'file', name:'File Saver', fn: toolFile},
    {id:'dev', name:'Dev Info', fn: toolDev},
    {id:'analytics', name:'Analytics (local)', fn: toolAnalytics},
    {id:'date', name:'Date Diff', fn: toolDate},
    {id:'quote', name:'Quote Generator', fn: toolQuote},
    {id:'mirror', name:'Mirror (camera)', fn: toolMirror},
    {id:'random', name:'Random Picker', fn: toolRandom},
    {id:'bmi', name:'BMI Calculator', fn: toolBmi},
    {id:'unit', name:'Unit Converter', fn: toolUnit},
    {id:'puzzle', name:'Puzzle (placeholder)', fn: toolPuzzle}
  ];

  // populate tools grid on first open
  function populateTools(){
    if(toolsGrid.children.length) return;
    TOOLS.forEach(t => {
      const d = document.createElement('div');
      d.className = 'tool-item';
      d.innerText = t.name;
      d.addEventListener('click', ()=> openToolPanel(t));
      toolsGrid.appendChild(d);
    });
  }

  // open/close tools modal
  toolsBtn && toolsBtn.addEventListener('click', ()=>{
    populateTools();
    toolsModal.classList.add('show'); toolsModal.style.display='flex';
  });
  closeTools && closeTools.addEventListener('click', ()=> { toolsModal.classList.remove('show'); toolsModal.style.display='none'; closeToolPanel(); });
  toolsModal.addEventListener('click', (e)=> { if(e.target === toolsModal){ toolsModal.classList.remove('show'); toolsModal.style.display='none'; closeToolPanel(); } });

  // open tool panel
  function openToolPanel(tool){
    toolTitle.textContent = tool.name;
    toolBody.innerHTML = '<div style="opacity:.7">Loading...</div>';
    toolPanel.style.display = 'block';
    try{ tool.fn(toolBody); } catch(err){ toolBody.innerHTML = '<pre style="color:#f88">'+err+'</pre>'; }
  }
  function closeToolPanel(){ toolPanel.style.display = 'none'; toolTitle.textContent=''; toolBody.innerHTML=''; }
  closePanel && closePanel.addEventListener('click', closeToolPanel);

  /* ===== Tool implementations ===== */
  // helper function
  function e(tag, props={}, parent=null){
    const el = document.createElement(tag);
    for(const k in props){
      if(k === 'html') el.innerHTML = props[k];
      else if(k === 'class') el.className = props[k];
      else el.setAttribute(k, props[k]);
    }
    if(parent) parent.appendChild(el);
    return el;
  }

  // 1 Idea Generator
  function toolIdea(container){
    container.innerHTML = '';
    const out = e('div',{html:'<em>Press Generate</em>'}, container);
    const btn = e('button',{class:'btn small', html:'Generate Idea'}, container);
    btn.addEventListener('click', ()=> {
      const a = ['AI assistant','neon portfolio','saaS microproduct','productivity app','game prototype'];
      const b = ['for creators','for students','for remote teams','for designers'];
      const c = ['with analytics','with offline mode','with templates','with voice control'];
      out.innerHTML = `💡 Build a <b>${a[Math.floor(Math.random()*a.length)]}</b> ${b[Math.floor(Math.random()*b.length)]} ${c[Math.floor(Math.random()*c.length)]}.`;
    });
  }

  // 2 Calculator
  function toolCalc(container){
    container.innerHTML = '';
    const inp = e('input',{placeholder:'e.g. (12+8)/4*3'}, container);
    const run = e('button',{class:'btn small', html:'Calc'}, container);
    const out = e('div', {}, container);
    run.addEventListener('click', ()=> {
      try{
        const expr = inp.value.replace(/\bPI\b/gi,'Math.PI');
        const allowed = /^[0-9+\-*/()., \sMathPIabsfloorceilminmaxpowsqrt]*$/i;
        if(!allowed.test(expr)) throw 'Invalid characters';
        const res = Function('"use strict";return ('+expr+')')();
        out.textContent = '= ' + res;
      } catch(e){ out.textContent = 'Error: ' + e; }
    });
  }

  // 3 Scheduler
  function toolScheduler(container){
    container.innerHTML = '';
    const date = e('input',{type:'date'}, container);
    const note = e('input',{placeholder:'Note'}, container);
    const add = e('button',{class:'btn small', html:'Save'}, container);
    const list = e('div',{style:'margin-top:8px;max-height:160px;overflow:auto'}, container);
    const key='cyberx_sched';
    function load(){
      const arr = JSON.parse(localStorage.getItem(key)||'[]'); list.innerHTML='';
      arr.forEach((r,i)=>{ const row = e('div',{}, list); row.innerHTML = `<b>${r.date}</b> ${r.note} <button data-i="${i}" style="float:right">✕</button>`; row.querySelector('button').addEventListener('click', ()=> { arr.splice(i,1); localStorage.setItem(key, JSON.stringify(arr)); load(); }); });
    }
    add.addEventListener('click', ()=> {
      if(!date.value) return alert('Pick date');
      const arr = JSON.parse(localStorage.getItem(key)||'[]'); arr.push({date:date.value, note:note.value}); localStorage.setItem(key, JSON.stringify(arr)); load();
    });
    load();
  }

  // 4 Notes
  function toolNotes(container){
    container.innerHTML = '';
    const ta = e('textarea', {}, container);
    const save = e('button',{class:'btn small', html:'Save'}, container);
    const load = e('button',{class:'btn small ghost', html:'Load'}, container);
    save.addEventListener('click', ()=> { localStorage.setItem('cyberx_notes', ta.value); alert('Saved'); });
    load.addEventListener('click', ()=> { ta.value = localStorage.getItem('cyberx_notes')||''; });
  }

  // 5 Web Preview
  function toolPreview(container){
    container.innerHTML = '';
    const url = e('input',{placeholder:'https://example.com'}, container);
    const open = e('button',{class:'btn small', html:'Preview'}, container);
    const out = e('div',{style:'margin-top:8px;max-height:300px;overflow:auto'}, container);
    open.addEventListener('click', ()=> {
      if(!url.value) return alert('Enter URL');
      out.innerHTML = `<iframe src="${url.value}" sandbox style="width:100%;height:280px;border:1px solid rgba(255,255,255,0.06)"></iframe>`;
    });
  }

  // 6 Color Picker
  function toolColor(container){
    container.innerHTML = '';
    const c = e('input',{type:'color', value:'#7b2ff7'}, container);
    const out = e('div',{style:'margin-top:8px'}, container);
    c.addEventListener('input', ()=> out.textContent = c.value);
    out.textContent = c.value;
  }

  // 7 Coin Flip
  function toolCoin(container){
    container.innerHTML = '';
    const btn = e('button',{class:'btn small', html:'Flip'}, container);
    const out = e('div',{style:'margin-top:8px;font-weight:700'}, container);
    btn.addEventListener('click', ()=> out.textContent = Math.random()<0.5 ? 'Heads' : 'Tails');
  }

  // 8 Chart (SVG)
  function toolChart(container){
    container.innerHTML = '';
    const ta = e('textarea',{placeholder:'5,10,3,8'}, container);
    const gen = e('button',{class:'btn small', html:'Generate'}, container);
    const out = e('div',{style:'margin-top:8px'}, container);
    gen.addEventListener('click', ()=> {
      const arr = (ta.value||'').split(',').map(s=>Number(s.trim())).filter(n=>!isNaN(n));
      if(!arr.length) return alert('Enter numbers');
      const w=360,h=180,max=Math.max(...arr);
      let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;
      const bw = w/arr.length;
      arr.forEach((v,i)=>{ const bh=(v/max)*(h-20); const x=i*bw+8; const y=h-bh-10; svg+=`<rect x="${x}" y="${y}" width="${bw-16}" height="${bh}" fill="#7b2ff7" rx="4"></rect>`; });
      svg += `</svg>`;
      out.innerHTML = svg;
    });
  }

  // 9 Image -> Base64
  function toolImg64(container){
    container.innerHTML = '';
    const f = e('input',{type:'file', accept:'image/*'}, container);
    const conv = e('button',{class:'btn small', html:'Convert'}, container);
    const out = e('div',{style:'margin-top:8px;max-height:220px;overflow:auto'}, container);
    conv.addEventListener('click', ()=> {
      const file = f.files[0]; if(!file) return alert('Choose image');
      const fr = new FileReader();
      fr.onload = e => out.innerHTML = `<textarea style="width:100%;height:120px">${e.target.result}</textarea><img src="${e.target.result}" style="max-width:160px;margin-top:8px">`;
      fr.readAsDataURL(file);
    });
  }

  // 10 Password
  function toolPassword(container){
    container.innerHTML = '';
    const len = e('input',{type:'number', value:16, min:4, max:128}, container);
    const gen = e('button',{class:'btn small', html:'Generate'}, container);
    const out = e('div',{style:'margin-top:8px;font-family:monospace'}, container);
    gen.addEventListener('click', ()=> {
      const l = Math.max(4, Number(len.value)||16);
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
      let s=''; for(let i=0;i<l;i++) s += chars.charAt(Math.floor(Math.random()*chars.length));
      out.textContent = s;
    });
  }

  // 11 Word counter
  function toolWord(container){
    container.innerHTML = '';
    const ta = e('textarea', {}, container);
    const out = e('div',{style:'margin-top:8px'}, container);
    ta.addEventListener('input', ()=> {
      const t = ta.value || ''; const words = t.trim()? t.trim().split(/\s+/).length : 0;
      out.textContent = `Words: ${words} — Characters: ${t.length}`;
    });
  }

  // 12 Stopwatch
  function toolStopwatch(container){
    container.innerHTML = '';
    const disp = e('div',{style:'font-family:monospace;margin-bottom:8px'}, container);
    const start = e('button',{class:'btn small', html:'Start'}, container);
    const stop = e('button',{class:'btn small', html:'Stop'}, container);
    const reset = e('button',{class:'btn small', html:'Reset'}, container);
    let sid=null, startTs=0, acc=0;
    function format(ms){ const s=Math.floor(ms/1000)%60; const m=Math.floor(ms/60000)%60; const h=Math.floor(ms/3600000); return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;}
    start.addEventListener('click', ()=> { if(sid) return; startTs = Date.now(); sid=setInterval(()=> disp.textContent = format(acc + (Date.now()-startTs)), 50); });
    stop.addEventListener('click', ()=> { if(!sid) return; acc += Date.now()-startTs; clearInterval(sid); sid=null; });
    reset.addEventListener('click', ()=> { acc=0; startTs=0; if(sid){ clearInterval(sid); sid=null } disp.textContent='00:00:00.000'; });
    reset.click();
  }

  // 13 Todo
  function toolTodo(container){
    container.innerHTML = '';
    const input = e('input',{placeholder:'New task'}, container);
    const add = e('button',{class:'btn small', html:'Add'}, container);
    const list = e('div',{style:'margin-top:8px;max-height:200px;overflow:auto'}, container);
    const key='cyberx_todo_v3';
    function load(){ const arr = JSON.parse(localStorage.getItem(key)||'[]'); list.innerHTML=''; arr.forEach((t,i)=>{ const row = e('div',{}, list); row.innerHTML = `<input type="checkbox" id="c${i}" ${t.done?'checked':''}> <label for="c${i}">${t.text}</label> <button data-i="${i}" style="float:right">✕</button>`; row.querySelector('button').addEventListener('click', ()=> { arr.splice(i,1); localStorage.setItem(key, JSON.stringify(arr)); load(); }); row.querySelector('input').addEventListener('change', e=> { arr[i].done = e.target.checked; localStorage.setItem(key, JSON.stringify(arr)); }); }); }
    add.addEventListener('click', ()=> { const v=input.value.trim(); if(!v) return; const arr = JSON.parse(localStorage.getItem(key)||'[]'); arr.push({text:v, done:false}); localStorage.setItem(key, JSON.stringify(arr)); input.value=''; load(); });
    load();
  }

  // 14 Image resize
  function toolResize(container){
    container.innerHTML = '';
    const f = e('input',{type:'file', accept:'image/*'}, container);
    const scale = e('input',{type:'range', min:10, max:200, value:100}, container);
    const out = e('div',{style:'margin-top:8px'}, container);
    f.addEventListener('change', ()=> {
      const file = f.files[0]; if(!file) return;
      const img = document.createElement('img'); img.src = URL.createObjectURL(file); img.style.maxWidth='100%';
      out.innerHTML = ''; out.appendChild(img);
      scale.addEventListener('input', ()=> img.style.width = scale.value + '%');
    });
  }

  // 15 Audio player local
  function toolAudio(container){
    container.innerHTML = '';
    const f = e('input',{type:'file', accept:'audio/*'}, container);
    const play = e('button',{class:'btn small', html:'Play'}, container);
    const stop = e('button',{class:'btn small', html:'Stop'}, container);
    const audioEl = e('audio',{controls:'controls', style:'margin-top:8px'}, container);
    play.addEventListener('click', ()=> { const file = f.files[0]; if(!file) return alert('Select audio'); audioEl.src = URL.createObjectURL(file); audioEl.play(); });
    stop.addEventListener('click', ()=> { audioEl.pause(); audioEl.currentTime = 0; });
  }

  // 16 File saver
  function toolFile(container){
    container.innerHTML = '';
    const ta = e('textarea', {}, container);
    const save = e('button',{class:'btn small', html:'Save .txt'}, container);
    save.addEventListener('click', ()=> {
      const blob = new Blob([ta.value||''], {type:'text/plain'}); const a=document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='cyberx.txt'; a.click();
    });
  }

  // 17 Dev info
  function toolDev(container){
    container.innerHTML = '';
    const pre = e('pre',{style:'white-space:pre-wrap;font-family:monospace'}, container);
    pre.textContent = `UserAgent: ${navigator.userAgent}\nViewport: ${innerWidth}x${innerHeight}\nPlatform: ${navigator.platform}`;
  }

  // 18 Analytics (local)
  function toolAnalytics(container){
    container.innerHTML = '';
    const pv = localStorage.getItem('cyberx_visits')||'0';
    const uniq = localStorage.getItem('cyberx_seen') ? '1' : '0';
    container.innerHTML = `<p>Local visits: <strong>${pv}</strong></p><p>Unique (local): <strong>${uniq}</strong></p>`;
  }

  // 19 Date diff
  function toolDate(container){
    container.innerHTML = '';
    const a = e('input',{type:'date'}, container);
    const b = e('input',{type:'date'}, container);
    const btn = e('button',{class:'btn small', html:'Days between'}, container);
    const out = e('div',{style:'margin-top:8px'}, container);
    btn.addEventListener('click', ()=> {
      if(!a.value||!b.value) return out.textContent='Pick two dates';
      const diff = Math.abs(new Date(a.value)-new Date(b.value));
      out.textContent = Math.floor(diff/86400000) + ' days';
    });
  }

  // 20 Quote generator
  function toolQuote(container){
    container.innerHTML = '';
    const arr = ['Stay curious.','Ship fast, iterate faster.','Simplicity is the ultimate sophistication.'];
    const out = e('div',{style:'min-height:80px;padding:8px;background:rgba(255,255,255,0.02);border-radius:8px'}, container);
    const btn = e('button',{class:'btn small', html:'New Quote'}, container);
    btn.addEventListener('click', ()=> out.textContent = arr[Math.floor(Math.random()*arr.length)]);
    btn.click();
  }

  // 21 Mirror (camera)
  function toolMirror(container){
    container.innerHTML = '';
    const v = e('video',{autoplay:'', style:'max-width:100%;border-radius:8px'}, container);
    navigator.mediaDevices.getUserMedia({video:true}).then(s=> v.srcObject = s).catch(()=> container.textContent = 'Camera not available or permission denied')
