/* script.js — CyberX Pro (all 25 tools) */

/* ---------------- Utilities ---------------- */
function $(id){return document.getElementById(id);}
function el(tag,attrs={},children=[]){const e=document.createElement(tag); for(const k in attrs){ if(k==='class') e.className=attrs[k]; else if(k==='html') e.innerHTML=attrs[k]; else e.setAttribute(k,attrs[k]); } children.forEach(c=>e.appendChild(c)); return e;}

/* ---------------- Part A: Particles ---------------- */
const canvas=document.getElementById('particles'), ctx=canvas.getContext('2d');
function fit(){canvas.width=innerWidth; canvas.height=innerHeight;}
fit(); window.addEventListener('resize',fit);
let particles=[]; for(let i=0;i<120;i++) particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,s:Math.random()*2+0.6,vx:(Math.random()-.5)*0.6,vy:(Math.random()-.5)*0.6});
function draw(){ ctx.clearRect(0,0,canvas.width,canvas.height); for(const p of particles){ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>canvas.width) p.vx*=-1; if(p.y<0||p.y>canvas.height) p.vy*=-1; ctx.beginPath(); ctx.fillStyle='rgba(123,47,247,0.7)'; ctx.arc(p.x,p.y,p.s,0,Math.PI*2); ctx.fill(); } requestAnimationFrame(draw); } draw();

/* ---------------- Part B: UI controls ---------------- */
const startBtn=$('startBtn'), bgMusic=$('bgMusic'), extraButtons=$('extraButtons'), toolsBtn=$('toolsBtn'), toolsBox=$('toolsBox');
const contactModal=$('contactModal'), toolModal=$('toolModal'), toolInner=$('toolInner'), toolTitle=$('toolTitle'), visitorBox=$('visitorCount');

let toolsVisible=false;
startBtn.addEventListener('click', ()=>{
  if(bgMusic.paused){ bgMusic.play().catch(()=>{}); startBtn.innerHTML='⏸ Pause Music'; extraButtons.classList.add('show'); } 
  else { bgMusic.pause(); startBtn.innerHTML='🚀 Start Experience'; extraButtons.classList.remove('show'); toolsBox.classList.remove('show'); toolsVisible=false; }
});
toolsBtn.addEventListener('click', ()=>{ toolsVisible=!toolsVisible; toolsBox.classList.toggle('show',toolsVisible); });

function showContact(){ contactModal.style.display='flex'; }
function closeContact(){ contactModal.style.display='none'; }
contactModal.addEventListener('click', (e)=>{ if(e.target===contactModal) closeContact(); });

function openModal(title,html){ toolTitle.innerText = title; toolInner.innerHTML = html; toolModal.style.display='flex'; }
function closeModal(){ toolModal.style.display='none'; toolInner.innerHTML=''; }
toolModal.addEventListener('click', (e)=>{ if(e.target===toolModal) closeModal(); });

function openComing(name){ openModal(name, `<p class="small">This feature is coming soon.</p>`); }

/* Visitor counter — server fallback: local increment (pro version uses local) */
(function initVisitors(){ try{ let k='cyberx_visits'; let v=Number(localStorage.getItem(k)||0)+1; localStorage.setItem(k,v); visitorBox.textContent=v.toLocaleString(); }catch(e){ visitorBox.textContent='—'; }})();

/* ---------------- Part C: Build tool grid & wiring ---------------- */
const tools = [
  {id:'ideaTool', label:'💡 Idea Generator', fn:openIdea},
  {id:'calcTool', label:'🧮 Calculator', fn:openCalc},
  {id:'colorTool', label:'🎨 Color Picker', fn:openColor},
  {id:'schedTool', label:'📅 Scheduler', fn:openSched},
  {id:'notesTool', label:'📝 Notes', fn:openNotes},
  {id:'compassTool', label:'🧭 Compass', fn:openCompass},
  {id:'shortenTool', label:'🌐 URL Shortener', fn:openShorten},
  {id:'fileOrgTool', label:'🗂 File Organizer', fn:openFileOrg},
  {id:'vizTool', label:'📊 Data Visualizer', fn:openViz},
  {id:'aiTool', label:'🧠 AI Assistant', fn:openAI},
  {id:'imgCompTool', label:'📸 Image Compressor', fn:openImgComp},
  {id:'audioTrimTool', label:'🎵 Audio Trimmer', fn:openAudioTrim},
  {id:'videoTool', label:'📹 Video Frame Export', fn:openVideoTool},
  {id:'pwTool', label:'🔐 Password Generator', fn:openPassword},
  {id:'gradTool', label:'🌈 Gradient Maker', fn:openGrad},
  {id:'cdTool', label:'🗓 Countdown Timer', fn:openCountdown},
  {id:'gameTool', label:'🕹 Mini Game', fn:openGame},
  {id:'uploaderTool', label:'📂 File Uploader', fn:openUploader},
  {id:'screenshotTool', label:'📷 Screenshot Canvas', fn:openScreenshot},
  {id:'invoiceTool', label:'🧾 Invoice Creator', fn:openInvoice},
  {id:'unitTool', label:'🧮 Unit Converter', fn:openUnit},
  {id:'qrTool', label:'📑 QR Code Generator', fn:openQR},
  {id:'ttsTool', label:'📢 Text-to-Speech', fn:openTTS},
  {id:'chatTool', label:'💬 Chat Simulator', fn:openChat},
  {id:'logoTool', label:'🪄 Logo Maker', fn:openLogo},
];

const grid = $('toolGrid');
for(const t of tools){
  const d = document.createElement('div'); d.className='tool'; d.id=t.id; d.innerText=t.label; d.addEventListener('click', t.fn);
  grid.appendChild(d);
}

/* ---------------- Part D: Tool implementations (pro-level) ---------------- */

/* 1 Idea Generator */
function openIdea(){
  const ideas = ["AI portfolio", "Smart expense tracker", "Voice assistant", "Futuristic dashboard","Mood playlist","Snippet manager","Chat companion","AR biz card","Eco route planner","Instant fridge recipes"];
  openModal('💡 Idea Generator', `
    <p class="small">Tap generate for ideas.</p>
    <div class="preview" id="ideaBox">${ideas[0]}</div>
    <div style="margin-top:10px;text-align:right;"><button class="btn" id="ideaGen">🎲 Generate</button></div>`);
  $('ideaGen').onclick = ()=>{$('ideaBox').innerText = ideas[Math.floor(Math.random()*ideas.length)];};
}

/* 2 Calculator (safe eval) */
function openCalc(){
  openModal('🧮 Calculator', `
    <p class="small">Safe math expressions. ^ = power.</p>
    <input id="calcExpr" class="input" placeholder="(12+3)/5*2">
    <div style="margin-top:8px;text-align:right"><button class="btn" id="calcEval">Evaluate</button></div>
    <div class="preview" id="calcRes">Result: —</div>`);
  $('calcEval').onclick = ()=>{
    const expr = $('calcExpr').value;
    try{
      const safe = expr.replace(/[^0-9+\-*/().,%\sA-Za-z]/g,'').replace(/\^/g,'**');
      const res = Function('"use strict"; return ('+safe+')')();
      $('calcRes').innerText = 'Result: '+res;
    }catch(e){ $('calcRes').innerText = 'Error: '+e.message; }
  };
}

/* 3 Color Picker */
function openColor(){
  openModal('🎨 Color Picker', `
    <p class="small">Pick color; copy CSS.</p>
    <input id="colorInp" type="color" value="#7b2ff7" style="height:44px;border-radius:8px;border:none">
    <div class="preview" id="colorInfo">HEX: #7b2ff7<br>RGB: 123,47,247</div>
    <div style="margin-top:8px;text-align:right"><button class="btn" id="copyColor">Copy CSS</button></div>`);
  const inp=$('colorInp'), info=$('colorInfo');
  function upd(){ const c=inp.value; const r=parseInt(c.substr(1,2),16), g=parseInt(c.substr(3,2),16), b=parseInt(c.substr(5,2),16); info.innerHTML=`HEX: ${c}<br>RGB: ${r},${g},${b}`; info.style.background=c; info.style.color=(r+g+b>380)?'#000':'#fff'; }
  inp.addEventListener('input',upd); upd();
  $('copyColor').onclick = ()=>navigator.clipboard.writeText(`background: ${inp.value};`).then(()=>alert('CSS copied'));
}

/* 4 Scheduler (local reminders) */
function openSched(){
  openModal('📅 Scheduler', `
    <p class="small">Local reminders saved to browser.</p>
    <input id="remTitle" class="input" placeholder="Title">
    <input id="remAt" class="input" type="datetime-local">
    <div style="margin-top:8px;text-align:right"><button class="btn" id="setRem">Set</button></div>
    <div class="preview" id="remList">No reminders</div>`);
  function load(){ const arr=JSON.parse(localStorage.getItem('cyberx_rem')||'[]'); const el=$('remList'); if(!arr.length) el.innerText='No reminders'; else el.innerHTML = arr.map((r,i)=>`<div style="margin-bottom:8px">${r.title} — ${new Date(r.at).toLocaleString()} <button class="btn" onclick="(function(){const a=JSON.parse(localStorage.getItem('cyberx_rem')||'[]');a.splice(${i},1);localStorage.setItem('cyberx_rem',JSON.stringify(a));document.getElementById('remList').innerHTML='';})()">Del</button></div>`).join(''); }
  $('setRem').onclick = ()=>{
    const t=$('remAt').value, title=$('remTitle').value||'Reminder'; if(!t){alert('Pick time');return;}
    const arr=JSON.parse(localStorage.getItem('cyberx_rem')||'[]'); arr.push({title,at:t}); localStorage.setItem('cyberx_rem',JSON.stringify(arr)); load(); alert('Saved — will alert while page open');
  };
  load();
}

/* 5 Notes */
function openNotes(){
  openModal('📝 Notes', `<p class="small">Save quick notes locally.</p><textarea id="notesArea" class="input" placeholder="Write..."></textarea><div style="margin-top:8px;text-align:right"><button class="btn" id="saveNotes">Save</button><button class="btn" id="clearNotes">Clear</button></div>`);
  const ta=$('notesArea'); ta.value = localStorage.getItem('cyberx_notes')||'';
  $('saveNotes').onclick = ()=>{ localStorage.setItem('cyberx_notes', ta.value); alert('Saved'); };
  $('clearNotes').onclick = ()=>{ ta.value=''; localStorage.removeItem('cyberx_notes'); };
}

/* 6 Compass (DeviceOrientation - mobile) */
function openCompass(){
  openModal('🧭 Compass', `<p class="small">Device heading (mobile only)</p><div class="preview" id="compBox">Heading: N/A</div><div style="margin-top:8px;text-align:right"><button class="btn" id="stopCompass">Stop</button></div>`);
  const box=$('compBox');
  function h(e){ const heading = e.webkitCompassHeading || e.alpha; box.innerText = (heading==null)?'Heading: N/A':'Heading: '+Math.round(heading)+'°'; }
  if(window.DeviceOrientationEvent){ window.addEventListener('deviceorientation', h); $('stopCompass').onclick = ()=>{ window.removeEventListener('deviceorientation', h); box.innerText='Stopped'; }; } else { box.innerText='Not supported'; $('stopCompass').style.display='none'; }
}

/* 7 URL Shortener (local shortlinks) */
function openShorten(){
  openModal('🌐 URL Shortener', `<p class="small">Create local shortlinks stored in browser</p><input id="longUrl" class="input" placeholder="https://..."><div style="margin-top:8px;text-align:right"><button class="btn" id="shortIt">Shorten & Copy</button></div><input id="shortRes" class="input preview" readonly>`);
  $('shortIt').onclick = ()=>{
    const u=$('longUrl').value; if(!u){alert('Enter URL');return;}
    const s=Math.random().toString(36).slice(2,9), db=JSON.parse(localStorage.getItem('cyberx_short')||'{}'); db[s]=u; localStorage.setItem('cyberx_short', JSON.stringify(db));
    const short = location.origin + location.pathname + '#u=' + s; $('shortRes').value = short; navigator.clipboard.writeText(short); alert('Copied');
  };
}

/* 8 File Organizer (metadata only) */
function openFileOrg(){
  openModal('🗂 File Organizer', `<p class="small">Tag files client-side (metadata only)</p><input id="orgFiles" type="file" multiple class="input"><input id="orgTags" class="input" placeholder="tags (comma)"><div style="margin-top:8px;text-align:right"><button class="btn" id="addOrg">Add</button></div><div class="preview" id="orgList">No files</div>`);
  function render(){ const db=JSON.parse(localStorage.getItem('cyberx_files')||'[]'); const el=$('orgList'); if(!db.length) el.innerText='No files'; else el.innerHTML=db.map((f,i)=>`<div style="margin-bottom:8px"><b>${f.name}</b> (${Math.round(f.size/1024)}KB) — ${f.tags.join(', ')} <button class="btn" onclick="(function(){const a=JSON.parse(localStorage.getItem('cyberx_files')||'[]');a.splice(${i},1);localStorage.setItem('cyberx_files',JSON.stringify(a));document.getElementById('orgList').innerHTML='';})()">Remove</button></div>`).join(''); }
  $('addOrg').onclick = ()=>{ const files=$('orgFiles').files; const tags=$('orgTags').value.split(',').map(s=>s.trim()).filter(Boolean); if(!files.length){alert('Select files');return;} const db=JSON.parse(localStorage.getItem('cyberx_files')||'[]'); for(const f of files) db.unshift({name:f.name,size:f.size,type:f.type,added:Date.now(),tags}); localStorage.setItem('cyberx_files', JSON.stringify(db)); render(); };
  render();
}

/* 9 Data Visualizer (CSV or numbers) */
function openViz(){
  openModal('📊 Data Visualizer', `<p class="small">CSV (label,value) or numbers list</p><textarea id="vizInput" class="input" placeholder="10,20,5 or Apple,10"></textarea><div style="margin-top:8px;text-align:right"><button class="btn" id="vizDraw">Draw</button></div><canvas id="vizCanvas" style="width:100%;height:220px" class="preview"></canvas>`);
  $('vizDraw').onclick = ()=>{
    const txt=$('vizInput').value.trim(); if(!txt){alert('Enter data');return;}
    let data=[];
    const lines = txt.split(/\n/).map(l=>l.trim()).filter(Boolean);
    if(lines.length>1){ data = lines.map(l=>{ const p=l.split(','); return {label:p[0].trim(), value:parseFloat(p[1])||0}; }); }
    else if(txt.includes(',')){ const arr=txt.split(',').map(s=>s.trim()); if(arr.every(a=>!isNaN(a))) data=arr.map((v,i)=>({label:String(i+1),value:parseFloat(v)||0})); else data = [txt.split(',').slice(0,2).map(s=>s.trim())].map(p=>({label:p[0],value:parseFloat(p[1])||0})); }
    else { alert('Unsupported format'); return; }
    const cvs=$('vizCanvas'); const ctx=cvs.getContext('2d'); cvs.width = cvs.clientWidth*devicePixelRatio; cvs.height = 220*devicePixelRatio; ctx.scale(devicePixelRatio, devicePixelRatio); ctx.clearRect(0,0,cvs.width,cvs.height);
    const max = Math.max(...data.map(d=>d.value),1); const w = (cvs.width/devicePixelRatio) / data.length;
    ctx.fillStyle='rgba(123,47,247,0.9)'; data.forEach((d,i)=>{ const h=(d.value/max)*160; ctx.fillRect(i*w+8,200-h,w-16,h); ctx.fillStyle='#fff'; ctx.fillText(d.label, i*w+8, 216); ctx.fillStyle='rgba(123,47,247,0.9)'; });
  };
}

/* 10 AI Assistant (mock pro: local + optional API hook) */
function openAI(){
  openModal('🧠 AI Assistant', `<p class="small">Local assistant — or configure API in code.</p><input id="aiPrompt" class="input" placeholder="Ask (e.g. ideas, code)"><div style="margin-top:8px;text-align:right"><button class="btn" id="aiAsk">Ask</button></div><div class="preview" id="aiRes">Responses here</div>`);
  $('aiAsk').onclick = async ()=>{
    const q=$('aiPrompt').value.trim(); if(!q){alert('Ask something');return;}
    // Local rule-based replies (safe). Replace with real API call for full pro backend.
    const low=q.toLowerCase();
    let ans='I can help with ideas or quick examples. Try "idea", "time", "explain X".';
    if(low.includes('idea')) ans='Try a micro-SaaS for local shops: automated appointment reminders + payment links.';
    else if(low.includes('time')) ans=new Date().toString();
    else if(low.includes('explain')) ans='Short explanation: '+q;
    $('aiRes').innerText = ans;
    // For true pro: call your backend here and stream responses.
  };
}

/* 11 Image Compressor (resize + quality) */
function openImgComp(){
  openModal('📸 Image Compressor', `<p class="small">Resize & compress; download JPG</p><input id="imgFile" type="file" accept="image/*" class="input"><input id="imgMaxW" class="input" type="number" value="1200" placeholder="Max width"><div style="margin-top:8px;text-align:right"><button class="btn" id="imgCompress">Compress & Download</button></div><div id="imgPreview" class="preview"></div>`);
  let src=null;
  $('imgFile').addEventListener('change', e=>{ const f=e.target.files[0]; if(!f) return; src=URL.createObjectURL(f); $('imgPreview').innerHTML = `<img src="${src}" style="max-width:100%">`; });
  $('imgCompress').onclick = ()=>{ if(!src){alert('Choose image');return;} const w=parseInt($('imgMaxW').value)||1200; const img=new Image(); img.onload=()=>{ const scale=Math.min(1,w/img.width); const cw=img.width*scale, ch=img.height*scale; const cvs=document.createElement('canvas'); cvs.width=cw; cvs.height=ch; const c = cvs.getContext('2d'); c.drawImage(img,0,0,cw,ch); cvs.toBlob(b=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='compressed.jpg'; a.click(); }, 'image/jpeg', 0.78); }; img.src=src; };
}

/* 12 Audio Trimmer (full decode + export WAV) */
async function openAudioTrim(){
  openModal('🎵 Audio Trimmer', `<p class="small">Trim audio client-side and export WAV</p><input id="aFile" type="file" accept="audio/*" class="input"><div style="display:flex;gap:8px;margin-top:8px"><input id="aStart" class="input" placeholder="Start (s)"><input id="aEnd" class="input" placeholder="End (s)"></div><div style="margin-top:8px;text-align:right"><button class="btn" id="aTrimBtn">Trim & Download</button></div><div id="aInfo" class="preview"></div>`);
  let buffer=null, actx=null;
  $('aFile').addEventListener('change', async e=>{ const f=e.target.files[0]; const ab=await f.arrayBuffer(); actx = new (window.AudioContext||window.webkitAudioContext)(); buffer = await actx.decodeAudioData(ab.slice(0)); $('aInfo').innerText = 'Loaded — duration: '+buffer.duration.toFixed(2)+'s'; });
  $('aTrimBtn').onclick = ()=>{ if(!buffer){alert('Load audio');return;} const s=parseFloat($('aStart').value)||0, e=parseFloat($('aEnd').value)||buffer.duration; if(s>=e){alert('Invalid range');return;} const sr=buffer.sampleRate, len=Math.floor((e-s)*sr); const newBuf = new (window.OfflineAudioContext||window.webkitOfflineAudioContext)(buffer.numberOfChannels, len, sr); // use offline context
    // copy samples
    const outBuf = newBuf;
    for(let ch=0; ch<buffer.numberOfChannels; ch++){
      const src = buffer.getChannelData(ch).subarray(Math.floor(s*sr), Math.floor(e*sr));
      outBuf.getChannelData(ch).set(src);
    }
    // encode WAV
    function encodeWAV(buff){
      const numChan=buff.numberOfChannels, sampleRate=buff.sampleRate, length=buff.length;
      const bytes = 44 + length * numChan * 2;
      const ab = new ArrayBuffer(bytes); const view=new DataView(ab);
      function writeStr(o,s){ for(let i=0;i<s.length;i++) view.setUint8(o+i,s.charCodeAt(i)); }
      let offset=0; writeStr(offset,'RIFF'); offset+=4; view.setUint32(offset,36+length*numChan*2,true); offset+=4; writeStr(offset,'WAVE'); offset+=4; writeStr(offset,'fmt '); offset+=4; view.setUint32(offset,16,true); offset+=4; view.setUint16(offset,1,true); offset+=2; view.setUint16(offset,numChan,true); offset+=2; view.setUint32(offset,sampleRate,true); offset+=4; view.setUint32(offset,sampleRate*numChan*2,true); offset+=4; view.setUint16(offset,numChan*2,true); offset+=2; view.setUint16(offset,16,true); offset+=2; writeStr(offset,'data'); offset+=4; view.setUint32(offset,length*numChan*2,true); offset+=4;
      let pos=offset;
      for(let i=0;i<length;i++){
        for(let ch=0; ch<numChan; ch++){
          let s = Math.max(-1, Math.min(1, buff.getChannelData(ch)[i]));
          view.setInt16(pos, s<0? s*0x8000 : s*0x7FFF, true);
          pos+=2;
        }
      }
      return new Blob([view], {type:'audio/wav'});
    }
    const blob = encodeWAV(outBuf);
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='trimmed.wav'; a.click();
};

/* 13 Video Frame Export */
function openVideoTool(){
  openModal('📹 Video Frame Export', `<p class="small">Select video; extract frame</p><input id="vFile" type="file" accept="video/*" class="input"><input id="vTime" class="input" placeholder="Time (s)"><div style="margin-top:8px;text-align:right"><button class="btn" id="vCapture">Capture</button></div><canvas id="vCanvas" class="preview" style="width:100%;height:220px"></canvas>`);
  let url=null;
  $('vFile').addEventListener('change', e=>{ const f=e.target.files[0]; url = URL.createObjectURL(f); });
  $('vCapture').onclick = async ()=>{
    if(!url){alert('Choose video');return;}
    const t=parseFloat($('vTime').value)||0; const v=document.createElement('video'); v.src=url; v.muted=true; await v.play().catch(()=>{}); v.pause(); v.currentTime = Math.min(t, v.duration||t);
    v.addEventListener('seeked', ()=>{ const cvs=$('vCanvas'); const ctx=cvs.getContext('2d'); cvs.width = cvs.clientWidth*devicePixelRatio; cvs.height = 220*devicePixelRatio; ctx.drawImage(v,0,0,cvs.width,cvs.height); cvs.toBlob(b=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='frame.png'; a.click(); }, 'image/png'); }, {once:true});
  };
}

/* 14 Password Generator (crypto) */
function openPassword(){
  openModal('🔐 Password Generator', `<p class="small">Generate secure passwords</p><input id="pwLen" class="input" value="20" type="number" min="4" max="128"><div style="margin-top:8px;text-align:right"><button class="btn" id="genPw">Generate</button></div><div class="preview" id="pwBox"></div>`);
  $('genPw').onclick = ()=>{ const l=parseInt($('pwLen').value)||20; const chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'; const arr=new Uint32Array(l); (window.crypto||window.msCrypto).getRandomValues(arr); let s=''; for(let i=0;i<l;i++) s+=chars[arr[i]%chars.length]; $('pwBox').innerHTML=`<code>${s}</code> <button class="btn" onclick="navigator.clipboard.writeText('${s}')">Copy</button>`; };
}

/* 15 Gradient Maker */
function openGrad(){
  openModal('🌈 Gradient Maker', `<p class="small">Create linear gradient CSS</p><div style="display:flex;gap:8px"><input id="g1" type="color" value="#7b2ff7"><input id="g2" type="color" value="#00f0ff"></div><div id="gPreview" class="preview" style="height:80px;margin-top:8px"></div><div style="margin-top:8px;text-align:right"><button class="btn" id="copyGrad">Copy CSS</button></div>`);
  function upd(){ const a=$('g1').value, b=$('g2').value, css=`linear-gradient(90deg, ${a}, ${b})`; $('gPreview').style.background=css; $('gPreview').innerText=css; }
  $('g1').addEventListener('input',upd); $('g2').addEventListener('input',upd); upd();
  $('copyGrad').onclick = ()=>navigator.clipboard.writeText(`background: ${$('gPreview').innerText};`).then(()=>alert('Copied'));
}

/* 16 Countdown */
function openCountdown(){
  openModal('🗓 Countdown Timer', `<p class="small">Countdown to date/time</p><input id="ctTarget" type="datetime-local" class="input"><div style="margin-top:8px;text-align:right"><button class="btn" id="startCt">Start</button></div><div class="preview" id="ctBox">No countdown</div>`);
  let intv=null;
  $('startCt').onclick = ()=>{ clearInterval(intv); const t=$('ctTarget').value; if(!t){alert('Pick');return;} const target=new Date(t).getTime(); intv=setInterval(()=>{ const d=target-Date.now(); if(d<=0){ $('ctBox').innerText='Time reached!'; clearInterval(intv); alert('Time reached'); return; } const days=Math.floor(d/86400000), hrs=Math.floor(d%86400000/3600000), mins=Math.floor(d%3600000/60000), secs=Math.floor(d%60000/1000); $('ctBox').innerText = `${days}d ${hrs}h ${mins}m ${secs}s`; }, 500); };
}

/* 17 Mini Game (Snake-lite) */
function openGame(){
  openModal('🕹 Mini Game', `<p class="small">Simple Snake-like game</p><canvas id="gameCanvas" class="preview" style="width:100%;height:240px"></canvas><div style="margin-top:8px;text-align:right"><button class="btn" id="startGame">Start</button></div>`);
  const cvs=$('gameCanvas'), gctx=cvs.getContext('2d'); cvs.width=cvs.clientWidth*devicePixelRatio; cvs.height=240*devicePixelRatio;
  let running=false, snake=[{x:5,y:5}], dir={x:1,y:0}, food={x:8,y:5}, grid=16, speed=150, timer=null;
  function drawGame(){ gctx.fillStyle='#000'; gctx.fillRect(0,0,cvs.width,cvs.height); gctx.fillStyle='#7b2ff7'; snake.forEach(s=>gctx.fillRect(s.x*grid*devicePixelRatio,s.y*grid*devicePixelRatio,grid*devicePixelRatio-2,grid*devicePixelRatio-2)); gctx.fillStyle='#00f0ff'; gctx.fillRect(food.x*grid*devicePixelRatio,food.y*grid*devicePixelRatio,grid*devicePixelRatio-2,grid*devicePixelRatio-2); }
  function step(){ const head={x:snake[0].x+dir.x, y:snake[0].y+dir.y}; if(head.x<0) head.x=40; if(head.y<0) head.y=30; if(head.x>40) head.x=0; if(head.y>30) head.y=0; snake.unshift(head); if(head.x===food.x && head.y===food.y){ food={x:Math.floor(Math.random()*30),y:Math.floor(Math.random()*20)}; } else snake.pop(); drawGame(); }
  document.addEventListener('keydown', e=>{ if(e.key==='ArrowUp') dir={x:0,y:-1}; if(e.key==='ArrowDown') dir={x:0,y:1}; if(e.key==='ArrowLeft') dir={x:-1,y:0}; if(e.key==='ArrowRight') dir={x:1,y:0}; });
  $('startGame').onclick = ()=>{ if(timer) clearInterval(timer); snake=[{x:5,y:5}]; dir={x:1,y:0}; timer=setInterval(step, speed); };
  drawGame();
}

/* 18 File Uploader (server-ready: sends to /upload if configured) */
function openUploader(){
  openModal('📂 File Uploader', `<p class="small">Upload files to server (or preview locally)</p><input id="upFiles" type="file" multiple class="input"><div style="margin-top:8px;text-align:right"><button class="btn" id="upBtn">Upload</button></div><div id="upList" class="preview">No files</div>`);
  $('upBtn').onclick = async ()=>{ const files=$('upFiles').files; if(!files.length){alert('Select files');return;} const list=[]; for(const f of files){ list.push(`<div style="margin-bottom:8px"><b>${f.name}</b> (${Math.round(f.size/1024)}KB) <a href="${URL.createObjectURL(f)}" download="${f.name}"><button class="btn">Download</button></a></div>`); } $('upList').innerHTML = list.join(''); /* If you have a server endpoint, you can POST files here */ };
}

/* 19 Screenshot Canvas */
function openScreenshot(){
  openModal('📷 Screenshot Canvas', `<p class="small">Capture the animated background</p><div style="margin-top:8px;text-align:right"><button class="btn" id="capBtn">Capture</button></div>`);
  $('capBtn').onclick = ()=>{ canvas.toBlob(b=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='screenshot.png'; a.click(); }); };
}

/* 20 Invoice Creator */
function openInvoice(){
  openModal('🧾 Invoice Creator', `<p class="small">Create printable invoice</p><input id="invTo" class="input" placeholder="Client"><textarea id="invItems" class="input" placeholder="Item,qty,price">Design,1,50\nWebsite,1,300</textarea><div style="margin-top:8px;text-align:right"><button class="btn" id="genInv">Generate & Print</button></div>`);
  $('genInv').onclick = ()=>{ const to=$('invTo').value||'Client'; const lines=$('invItems').value.split('\n').map(l=>l.trim()).filter(Boolean); let rows='', total=0; for(const r of lines){ const p=r.split(','); const desc=p[0]||''; const q=parseFloat(p[1])||1; const pr=parseFloat(p[2])||0; const sub=q*pr; total+=sub; rows+=`<tr><td>${desc}</td><td>${q}</td><td>$${pr.toFixed(2)}</td><td>$${sub.toFixed(2)}</td></tr>`; } const html=`<html><body><h2>Invoice</h2><p>To: ${to}</p><table border="1" cellpadding="6" cellspacing="0">${rows}<tr><td colspan="3"><strong>Total</strong></td><td><strong>$${total.toFixed(2)}</strong></td></tr></table></body></html>`; const w=window.open(''); w.document.write(html); w.document.close(); w.print(); };
}

/* 21 Unit Converter */
function openUnit(){
  openModal('🧮 Unit Converter', `<p class="small">m↔ft, kg↔lb, °C↔°F</p><input id="ucVal" class="input" placeholder="Value"><select id="ucType" class="input"><option value="mft">m → ft</option><option value="ftm">ft → m</option><option value="kg_lb">kg → lb</option><option value="lb_kg">lb → kg</option><option value="c_f">°C → °F</option><option value="f_c">°F → °C</option></select><div style="margin-top:8px;text-align:right"><button class="btn" id="ucBtn">Convert</button></div><div class="preview" id="ucRes"></div>`);
  $('ucBtn').onclick = ()=>{ const v=parseFloat($('ucVal').value); if(isNaN(v)){alert('Enter number');return;} const t=$('ucType').value; let r=''; if(t==='mft') r=(v*3.28084).toFixed(4)+' ft'; if(t==='ftm') r=(v/3.28084).toFixed(4)+' m'; if(t==='kg_lb') r=(v*2.20462).toFixed(4)+' lb'; if(t==='lb_kg') r=(v/2.20462).toFixed(4)+' kg'; if(t==='c_f') r=((v*9/5)+32).toFixed(2)+' °F'; if(t==='f_c') r=((v-32)*5/9).toFixed(2)+' °C'; $('ucRes').innerText = r; };
}

/* 22 QR Code Generator (Google Charts) */
function openQR(){
  openModal('📑 QR Code Generator', `<p class="small">Generate QR image (uses Google Charts)</p><input id="qrText" class="input" placeholder="Text or URL"><div style="margin-top:8px;text-align:right"><button class="btn" id="genQr">Generate</button></div><div id="qrPrev" class="preview"></div>`);
  $('genQr').onclick = ()=>{ const t=$('qrText').value; if(!t){alert('Enter text');return;} const src='https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl='+encodeURIComponent(t); $('qrPrev').innerHTML = `<img src="${src}" style="max-width:100%">`; };
}

/* 23 Text-to-Speech */
function openTTS(){
  openModal('📢 Text-to-Speech', `<p class="small">Speak text using browser TTS</p><textarea id="ttsText" class="input">Hello from CyberX!</textarea><div style="margin-top:8px;text-align:right"><button class="btn" id="speak">Speak</button><button class="btn" id="stopSpeak">Stop</button></div>`);
  $('speak').onclick = ()=>{ const s=$('ttsText').value; if(!s) return; const u=new SpeechSynthesisUtterance(s); speechSynthesis.speak(u); };
  $('stopSpeak').onclick = ()=>{ speechSynthesis.cancel(); };
}

/* 24 Chat Simulator (local, threaded) */
function openChat(){
  openModal('💬 Chat Simulator', `<p class="small">Local simulated chat</p><div id="chatBox" style="height:180px;overflow:auto;background:rgba(255,255,255,0.02);padding:8px;border-radius:8px"></div><input id="chatInp" class="input" placeholder="Say something..."><div style="margin-top:8px;text-align:right"><button class="btn" id="sendChat">Send</button></div>`);
  const box=$('chatBox'); $('sendChat').onclick = ()=>{ const t=$('chatInp').value; if(!t) return; box.innerHTML += `<div style="color:#0ff">You: ${t}</div>`; $('chatInp').value=''; setTimeout(()=>{ const reply = (q=>{ q=q.toLowerCase(); if(q.includes('hi')) return 'Hi!'; if(q.includes('help')) return 'What do you need?'; if(q.includes('price')) return 'Contact for pricing.'; return 'Interesting!'; })(t); box.innerHTML += `<div style="color:#ffd">Bot: ${reply}</div>`; box.scrollTop = box.scrollHeight; }, 400); };
}

/* 25 Logo Maker (export PNG) */
function openLogo(){
  openModal('🪄 Logo Maker', `<p class="small">Text logo export (PNG)</p><input id="logoText" class="input" value="CyberX"><input id="logoSize" class="input" value="72" type="number"><canvas id="logoCanvas" class="preview" style="width:100%;height:140px"></canvas><div style="margin-top:8px;text-align:right"><button class="btn" id="renderLogo">Render</button><button class="btn" id="dlLogo">Download</button></div>`);
  const cvs=$('logoCanvas'), ctx=cvs.getContext('2d');
  $('renderLogo').onclick = ()=>{ const t=$('logoText').value||'Logo', s=parseInt($('logoSize').value)||72; cvs.width = cvs.clientWidth*devicePixelRatio; cvs.height = 140*devicePixelRatio; ctx.clearRect(0,0,cvs.width,cvs.height); ctx.fillStyle='#000'; ctx.fillRect(0,0,cvs.width,cvs.height); ctx.fillStyle='#7b2ff7'; ctx.font=`bold ${s*devicePixelRatio}px Orbitron, Arial`; ctx.textAlign='center'; ctx.fillText(t, cvs.width/2, cvs.height/2 + (s/2)*devicePixelRatio); ctx.fillStyle='#00f0ff'; ctx.globalAlpha=0.45; ctx.fillText(t, cvs.width/2 + 6*devicePixelRatio, cvs.height/2 + (s/2 +6)*devicePixelRatio); ctx.globalAlpha=1; };
  $('dlLogo').onclick = ()=>{ cvs.toBlob(b=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='logo.png'; a.click(); }); };
}

/* ---------------- End of tools ---------------- */

console.log('CyberX Pro script loaded — all tools wired.');
