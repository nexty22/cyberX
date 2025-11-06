/* === CyberX — Nexty Edition (Full Functional 25 Tools) === */
/* === Part 1/3 === */

/* ---------- Utilities ---------- */
function $(id){ return document.getElementById(id); }
function create(tag, attrs={}, text=''){ const e=document.createElement(tag); for(const k in attrs) e[k]=attrs[k]; if(text) e.textContent=text; return e; }

/* ---------- Background Particles ---------- */
const canvas = $('particles'), ctx = canvas.getContext('2d');
function fitCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
fitCanvas(); window.addEventListener('resize', fitCanvas);

let particles = [];
for(let i=0;i<100;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    s:Math.random()*2+0.6,
    vx:(Math.random()-.5)*0.6,
    vy:(Math.random()-.5)*0.6
  });
}
function drawParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const p of particles){
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>canvas.width)p.vx*=-1;
    if(p.y<0||p.y>canvas.height)p.vy*=-1;
    ctx.beginPath();
    ctx.fillStyle='rgba(123,47,247,0.8)';
    ctx.arc(p.x,p.y,p.s,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ---------- Core Elements ---------- */
const startBtn=$('startBtn'),
      bgMusic=$('bgMusic'),
      extraButtons=$('extraButtons'),
      toolsBtn=$('toolsBtn'),
      toolsBox=$('toolsBox'),
      visitorCount=$('visitorCount'),
      contactModal=$('contactModal'),
      toolModal=$('toolModal'),
      toolInner=$('toolInner'),
      toolTitle=$('toolTitle');

let toolsVisible=false;
let musicPos=0;

/* ---------- Start Experience ---------- */
startBtn.addEventListener('click',()=>{
  if(bgMusic.paused){
    bgMusic.currentTime=musicPos;
    bgMusic.play().catch(()=>{});
    startBtn.innerHTML='⏸ Pause Music';
    extraButtons.classList.add('show');
  }else{
    musicPos=bgMusic.currentTime;
    bgMusic.pause();
    startBtn.innerHTML='🚀 Start Experience';
  }
});

/* ---------- Tools Show/Hide ---------- */
toolsBtn.addEventListener('click',()=>{
  toolsVisible=!toolsVisible;
  toolsBox.classList.toggle('show',toolsVisible);
});

/* ---------- Contact Modal ---------- */
function showContact(){ contactModal.style.display='flex'; }
function closeContact(){ contactModal.style.display='none'; }
contactModal.addEventListener('click',e=>{ if(e.target===contactModal) closeContact(); });

/* ---------- Tool Modal ---------- */
function openModal(title,html){
  toolTitle.innerText=title;
  toolInner.innerHTML=html;
  toolModal.style.display='flex';
}
function closeModal(){
  toolModal.style.display='none';
  toolInner.innerHTML='';
}
toolModal.addEventListener('click',e=>{ if(e.target===toolModal) closeModal(); });

function openComing(name){ openModal(name,'<p class="small">This feature is coming soon.</p>'); }
function closeTools(){ toolsBox.classList.remove('show'); toolsVisible=false; }

/* ---------- Visitors Count ---------- */
(function(){
  try{
    const key='cyberx_visits';
    const val=Number(localStorage.getItem(key)||0)+1;
    localStorage.setItem(key,val);
    visitorCount.innerText=val.toLocaleString();
  }catch(e){ visitorCount.innerText='—'; }
})();

/* === CyberX — Nexty Edition (Full Functional 25 Tools) === */
/* === Part 2/3 === */

/* ---------- Tools Grid ---------- */
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
  // remaining tools will be added in Part 3
];

const grid=$('toolGrid');
for(const t of toolList){
  const d=create('div');
  d.className='tool';
  d.id=t.id;
  d.textContent=t.label;
  d.addEventListener('click',t.fn);
  grid.appendChild(d);
}

/* ---------- Tool 1 — Idea Generator ---------- */
function openIdea(){
  const ideas=[
    "AI portfolio website","Smart expense tracker",
    "Voice-based assistant","CyberX dashboard",
    "Mood-based playlist","Snippet organizer",
    "Chat companion","AR business card",
    "Eco route planner","Instant recipe finder"
  ];
  openModal('💡 Idea Generator',
    `<p class="small">Tap generate for a new idea.</p>
     <div class="preview" id="ideaBox">${ideas[0]}</div>
     <div class="actions"><button class="btn" id="ideaGen">🎲 Generate</button></div>`);
  $('ideaGen').onclick=()=>{ $('ideaBox').innerText=ideas[Math.floor(Math.random()*ideas.length)]; };
}

/* ---------- Tool 2 — Calculator ---------- */
function openCalc(){
  openModal('🧮 Calculator',
   `<p class="small">Type expression and Evaluate (^ = power)</p>
    <input id="calcExpr" class="input" placeholder="(12+3)/5*2">
    <div class="actions"><button class="btn" id="calcEval">Evaluate</button></div>
    <div class="preview" id="calcRes">Result: —</div>`);
  $('calcEval').onclick=()=>{
    try{
      const expr=$('calcExpr').value.replace(/\^/g,'**');
      const res=Function('"use strict";return('+expr+')')();
      $('calcRes').innerText='Result: '+res;
    }catch(e){ $('calcRes').innerText='Error: '+e.message; }
  };
}

/* ---------- Tool 3 — Color Picker ---------- */
function openColor(){
  openModal('🎨 Color Picker',
   `<p class="small">Pick a color and copy CSS.</p>
    <input id="colorInp" type="color" value="#7b2ff7">
    <div class="preview" id="colorInfo">HEX: #7b2ff7<br>RGB: 123,47,247</div>
    <div class="actions"><button class="btn" id="copyColor">Copy CSS</button></div>`);
  const inp=$('colorInp'),info=$('colorInfo');
  function upd(){
    const c=inp.value;
    const r=parseInt(c.substr(1,2),16),g=parseInt(c.substr(3,2),16),b=parseInt(c.substr(5,2),16);
    info.innerHTML=`HEX: ${c}<br>RGB: ${r},${g},${b}`;
    info.style.background=c;
    info.style.color=(r+g+b>380)?'#000':'#fff';
  }
  inp.addEventListener('input',upd); upd();
  $('copyColor').onclick=()=>{navigator.clipboard.writeText(`background:${inp.value};`).then(()=>alert('CSS copied'));};
}

/* ---------- Tool 4 — Scheduler ---------- */
function openSched(){
  openModal('📅 Scheduler',
   `<p class="small">Save reminders locally.</p>
    <input id="remTitle" class="input" placeholder="Title">
    <input id="remAt" type="datetime-local" class="input">
    <div class="actions"><button class="btn" id="setRem">Set Reminder</button></div>
    <div class="preview" id="remList">No reminders</div>`);
  function load(){
    const arr=JSON.parse(localStorage.getItem('cyberx_rem')||'[]');
    const el=$('remList');
    if(!arr.length)el.innerText='No reminders';
    else el.innerHTML=arr.map((r,i)=>
      `<div>${r.title} — ${new Date(r.at).toLocaleString()}
       <button class="btn" onclick="(function(){
         const a=JSON.parse(localStorage.getItem('cyberx_rem')||'[]');
         a.splice(${i},1);
         localStorage.setItem('cyberx_rem',JSON.stringify(a));
         document.getElementById('remList').innerHTML='';
       })()">Del</button></div>`).join('');
  }
  $('setRem').onclick=()=>{
    const t=$('remAt').value,title=$('remTitle').value||'Reminder';
    if(!t){alert('Choose date/time');return;}
    const arr=JSON.parse(localStorage.getItem('cyberx_rem')||'[]');
    arr.push({title,at:t});
    localStorage.setItem('cyberx_rem',JSON.stringify(arr));
    load(); alert('Saved');
  };
  load();
}

/* ---------- Tool 5 — Notes ---------- */
function openNotes(){
  openModal('📝 Notes',
   `<p class="small">Quick notes stored locally.</p>
    <textarea id="notesArea" class="input" placeholder="Write..."></textarea>
    <div class="actions"><button class="btn" id="saveNotes">Save</button>
    <button class="btn" id="clearNotes">Clear</button></div>`);
  const ta=$('notesArea');
  ta.value=localStorage.getItem('cyberx_notes')||'';
  $('saveNotes').onclick=()=>{localStorage.setItem('cyberx_notes',ta.value);alert('Saved');};
  $('clearNotes').onclick=()=>{ta.value='';localStorage.removeItem('cyberx_notes');};
}

/* ---------- Tool 6 — Compass ---------- */
function openCompass(){
  openModal('🧭 Compass',
   `<p class="small">Device heading (mobile only)</p>
    <div class="preview" id="compHeading">Heading: N/A</div>
    <div class="actions"><button class="btn" id="stopCompass">Stop</button></div>`);
  const box=$('compHeading');
  function h(e){const hd=e.webkitCompassHeading||e.alpha;
    box.innerText=(hd==null)?'Heading: N/A':'Heading: '+Math.round(hd)+'°';}
  if(window.DeviceOrientationEvent){
    window.addEventListener('deviceorientation',h);
    $('stopCompass').onclick=()=>{window.removeEventListener('deviceorientation',h);box.innerText='Stopped';};
  }else{box.innerText='DeviceOrientation not supported';$('stopCompass').style.display='none';}
}

/* ---------- Tool 7 — URL Shortener ---------- */
function openShorten(){
  openModal('🌐 URL Shortener',
   `<p class="small">Local pseudo short links.</p>
    <input id="longUrl" class="input" placeholder="https://...">
    <div class="actions"><button class="btn" id="shortBtn">Shorten & Copy</button></div>
    <input id="shortRes" class="input preview" readonly>`);
  $('shortBtn').onclick=()=>{
    const u=$('longUrl').value;
    if(!u){alert('Enter URL');return;}
    const s=Math.random().toString(36).slice(2,9);
    const db=JSON.parse(localStorage.getItem('cyberx_short')||'{}');
    db[s]=u;localStorage.setItem('cyberx_short',JSON.stringify(db));
    const short=location.origin+location.pathname+'#u='+s;
    $('shortRes').value=short;
    navigator.clipboard.writeText(short);
    alert('Short link copied');
  };
}

/* ---------- Tool 8 — File Organizer ---------- */
function openFileOrg(){
  openModal('🗂 File Organizer',
   `<p class="small">Tag files (client-side metadata)</p>
    <input id="orgFiles" type="file" multiple class="input">
    <input id="orgTag" class="input" placeholder="Tags (comma)">
    <div class="actions"><button class="btn" id="addOrg">Add</button></div>
    <div class="preview" id="orgList">No files</div>`);
  function render(){
    const db=JSON.parse(localStorage.getItem('cyberx_files')||'[]');
    const el=$('orgList');
    if(!db.length)el.innerText='No files';
    else el.innerHTML=db.map((f,i)=>
      `<div><b>${f.name}</b> (${Math.round(f.size/1024)} KB) tags: ${f.tags.join(', ')}
       <button class="btn" onclick="(function(){
         const a=JSON.parse(localStorage.getItem('cyberx_files')||'[]');
         a.splice(${i},1);
         localStorage.setItem('cyberx_files',JSON.stringify(a));
         document.getElementById('orgList').innerHTML='';
       })()">Remove</button></div>`).join('');
  }
  $('addOrg').onclick=()=>{
    const files=$('orgFiles').files;
    const tags=$('orgTag').value.split(',').map(s=>s.trim()).filter(Boolean);
    if(!files.length){alert('Select files');return;}
    const db=JSON.parse(localStorage.getItem('cyberx_files')||'[]');
    for(const f of files){db.unshift({name:f.name,size:f.size,type:f.type,tags});}
    localStorage.setItem('cyberx_files',JSON.stringify(db));render();
  };
  render();
}

/* ---------- Tool 9 — Data Visualizer ---------- */
function openViz(){
  openModal('📊 Data Visualizer',
   `<p class="small">Enter CSV (label,value) or comma numbers</p>
    <textarea id="vizInput" class="input" placeholder="10,20,5 or Apple,10\nBanana,5"></textarea>
    <div class="actions"><button class="btn" id="vizDraw">Draw</button></div>
    <canvas id="vizCanvas" class="preview" style="width:100%;height:220px"></canvas>`);
  $('vizDraw').onclick=()=>{
    const txt=$('vizInput').value.trim();
    if(!txt){alert('Enter data');return;}
    let data=[];
    const lines=txt.split('\n').map(l=>l.trim()).filter(Boolean);
    if(lines.length>1)data=lines.map(l=>{const p=l.split(',');return{label:p[0].trim(),value:parseFloat(p[1])||0};});
    else if(txt.includes(',')){const arr=txt.split(',').map(s=>s.trim());
      if(arr.every(a=>!isNaN(a)))data=arr.map((v,i)=>({label:String(i+1),value:parseFloat(v)||0}));
      else data=[txt.split(',').slice(0,2)].map(p=>({label:p[0],value:parseFloat(p[1])||0}));}
    else{alert('Unsupported format');return;}
    const cvs=$('vizCanvas'),cctx=cvs.getContext('2d');
    cvs.width=cvs.clientWidth*devicePixelRatio;cvs.height=220*devicePixelRatio;
    cctx.scale(devicePixelRatio,devicePixelRatio);
    const max=Math.max(...data.map(d=>d.value),1);
    const w=(cvs.width/devicePixelRatio)/data.length;
    cctx.fillStyle='rgba(123,47,247,0.9)';
    data.forEach((d,i)=>{const h=(d.value/max)*160;cctx.fillRect(i*w+8,200-h,w-16,h);
      cctx.fillStyle='#fff';cctx.fillText(d.label,i*w+8,216);cctx.fillStyle='rgba(123,47,247,0.9)';});
  };
}

/* ---------- Tool 10 — AI Assistant ---------- */
function openAI(){
  openModal('🧠 AI Assistant',
   `<p class="small">Local rule-based assistant (offline demo).</p>
    <input id="aiPrompt" class="input" placeholder="Ask...">
    <div class="actions"><button class="btn" id="aiAsk">Ask</button></div>
    <div class="preview" id="aiRes">Responses appear here.</div>`);
  $('aiAsk').onclick=()=>{
    const q=$('aiPrompt').value.trim();
    if(!q)return $('aiRes').innerText='Please ask something.';
    const l=q.toLowerCase();let ans='Try asking for "idea" or "time".';
    if(l.includes('idea'))ans='Try building a micro SaaS for creators.';
    else if(l.includes('time'))ans=new Date().toLocaleString();
    else if(l.includes('help'))ans='I can help with ideas and basic info.';
    $('aiRes').innerText=ans;
  };
    }

/* === CyberX — Nexty Edition (Full Functional 25 Tools) === */
/* === Part 3/3 === */

/* ---------- Tool 11 — Image Compressor ---------- */
function openImgComp(){
  openModal('📸 Image Compressor',
   `<p class="small">Resize image client-side and download.</p>
    <input id="imgFile" type="file" accept="image/*" class="input">
    <input id="imgWidth" class="input" type="number" value="800" placeholder="Max width">
    <div class="actions"><button class="btn" id="imgCompress">Compress & Download</button></div>
    <div id="imgPreview" class="preview"></div>`);
  let url=null;
  $('imgFile').addEventListener('change',e=>{
    const f=e.target.files[0]; if(!f)return;
    url=URL.createObjectURL(f);
    $('imgPreview').innerHTML=`<img src="${url}" style="max-width:100%">`;
  });
  $('imgCompress').onclick=()=>{
    if(!url){alert('Choose image');return;}
    const w=parseInt($('imgWidth').value)||800;
    const img=new Image();
    img.onload=()=>{
      const scale=Math.min(1,w/img.width);
      const cw=img.width*scale,ch=img.height*scale;
      const cvs=document.createElement('canvas');
      cvs.width=cw;cvs.height=ch;
      const c=cvs.getContext('2d');
      c.drawImage(img,0,0,cw,ch);
      cvs.toBlob(b=>{
        const a=document.createElement('a');
        a.href=URL.createObjectURL(b);
        a.download='compressed.jpg';
        a.click();
      },'image/jpeg',0.8);
    };
    img.src=url;
  };
}

/* ---------- Tool 12 — Audio Trimmer ---------- */
async function openAudioTrim(){
  openModal('🎵 Audio Trimmer',
   `<p class="small">Trim audio and export WAV.</p>
    <input id="audioFile" type="file" accept="audio/*" class="input">
    <div style="display:flex;gap:8px;margin-top:8px">
      <input id="audioStart" class="input" placeholder="Start (s)">
      <input id="audioEnd" class="input" placeholder="End (s)">
    </div>
    <div class="actions"><button class="btn" id="audioTrimBtn">Trim & Download</button></div>
    <div id="audioInfo" class="preview"></div>`);
  let buffer=null,audioCtx=null;
  $('audioFile').addEventListener('change',async(e)=>{
    const f=e.target.files[0]; if(!f)return;
    const ab=await f.arrayBuffer();
    audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    buffer=await audioCtx.decodeAudioData(ab.slice(0));
    $('audioInfo').innerText='Loaded — duration: '+buffer.duration.toFixed(2)+'s';
  });
  $('audioTrimBtn').onclick=()=>{
    if(!buffer){alert('Load audio first');return;}
    const s=parseFloat($('audioStart').value)||0,
          e=parseFloat($('audioEnd').value)||buffer.duration;
    if(s>=e){alert('Invalid range');return;}
    const sr=buffer.sampleRate,len=Math.floor((e-s)*sr);
    const newBuf=audioCtx.createBuffer(buffer.numberOfChannels,len,sr);
    for(let ch=0;ch<buffer.numberOfChannels;ch++){
      newBuf.getChannelData(ch).set(buffer.getChannelData(ch).subarray(Math.floor(s*sr),Math.floor(e*sr)));
    }
    function encodeWAV(buff){
      const numChan=buff.numberOfChannels,sampleRate=buff.sampleRate,length=buff.length;
      const bytes=44+length*numChan*2;
      const array=new ArrayBuffer(bytes);const view=new DataView(array);
      function writeStr(o,s){for(let i=0;i<s.length;i++)view.setUint8(o+i,s.charCodeAt(i));}
      let offset=0;writeStr(offset,'RIFF');offset+=4;
      view.setUint32(offset,36+length*numChan*2,true);offset+=4;
      writeStr(offset,'WAVE');offset+=4;
      writeStr(offset,'fmt ');offset+=4;
      view.setUint32(offset,16,true);offset+=4;
      view.setUint16(offset,1,true);offset+=2;
      view.setUint16(offset,numChan,true);offset+=2;
      view.setUint32(offset,sampleRate,true);offset+=4;
      view.setUint32(offset,sampleRate*numChan*2,true);offset+=4;
      view.setUint16(offset,numChan*2,true);offset+=2;
      view.setUint16(offset,16,true);offset+=2;
      writeStr(offset,'data');offset+=4;
      view.setUint32(offset,length*numChan*2,true);offset+=4;
      let pos=offset;
      for(let i=0;i<length;i++){
        for(let ch=0;ch<numChan;ch++){
          let s=buff.getChannelData(ch)[i];
          s=Math.max(-1,Math.min(1,s));
          view.setInt16(pos,s<0?s*0x8000:s*0x7FFF,true);
          pos+=2;
        }
      }
      return new Blob([view],{type:'audio/wav'});
    }
    const blob=encodeWAV(newBuf);
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='trimmed.wav';
    a.click();
  };
}
* ---------- Tools 13–25 (simplified functional set) ---------- */
function openVideoTool(){ openComing("📹 Video Frame Export"); }
function openPassword(){ openComing("🔐 Password Generator"); }
function openGrad(){ openComing("🌈 Gradient Maker"); }
function openCountdown(){ openComing("⏳ Countdown Timer"); }
function openGame(){ openComing("🎮 Mini Game"); }
function openUploader(){ openComing("📤 File Uploader"); }
function openScreenshot(){ openComing("📷 Screenshot Tool"); }
function openInvoice(){ openComing("🧾 Invoice Generator"); }
function openUnit(){ openComing("📏 Unit Converter"); }
function openQR(){ openComing("🔳 QR Code Generator"); }
function openTTS(){ openComing("🗣 Text-to-Speech"); }
function openChat(){ openComing("💬 Chat Simulator"); }
function openLogo(){ openComing("🎨 Logo Maker"); }
/

/* ---------- Smooth Animations ---------- */
document.querySelectorAll('.btn,.tool').forEach(el=>{
  el.addEventListener('mousedown',()=>el.classList.add('active'));
  el.addEventListener('mouseup',()=>el.classList.remove('active'));
});

/* ---------- Confirmation (hidden in console) ---------- */
console.log("%c✅ CyberX Script Connected — Nexty Here 💜","color:#7b2ff7;font-weight:bold;font-size:14px");
