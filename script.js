/* =========================================================
   CyberX — Nexty Here ⚡ (script.js — Part 1)
   ========================================================= */

console.log("✅ CyberX JS connected — Nexty Here ⚡");

/* Helper */
function $(id){ return document.getElementById(id); }

/* =========================================================
   PARTICLE BACKGROUND
   ========================================================= */
const canvas = $("particles");
const ctx = canvas.getContext("2d");

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let particles = [];
for(let i=0;i<120;i++){
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
    if(p.x<0||p.x>canvas.width) p.vx*=-1;
    if(p.y<0||p.y>canvas.height) p.vy*=-1;
    ctx.beginPath();
    ctx.fillStyle="rgba(123,47,247,0.7)";
    ctx.arc(p.x,p.y,p.s,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* =========================================================
   UI CONTROLS + MUSIC HANDLING
   ========================================================= */
const bgMusic=$("bgMusic"),
      startBtn=$("startBtn"),
      contactModal=$("contactModal"),
      extraButtons=$("extraButtons"),
      toolsBtn=$("toolsBtn"),
      toolsBox=$("toolsBox"),
      visitorCount=$("visitorCount");

let toolsVisible=false;

/* ---------- “Tap to enable sound” overlay ---------- */
const overlay=document.createElement("div");
overlay.id="soundOverlay";
overlay.textContent="🔊 Tap anywhere to enable sound";
Object.assign(overlay.style,{
  position:"fixed",inset:"0",display:"flex",
  alignItems:"center",justifyContent:"center",
  background:"rgba(0,0,0,0.8)",color:"#00f0ff",
  fontFamily:"Orbitron,sans-serif",fontSize:"1.1rem",
  zIndex:"2000",transition:"opacity .6s ease",cursor:"pointer"
});
document.body.appendChild(overlay);
function enableSoundOnce(){
  overlay.style.opacity="0";
  setTimeout(()=>overlay.remove(),600);
  console.log("🎵 Sound permission granted");
  window.removeEventListener("click",enableSoundOnce);
}
window.addEventListener("click",enableSoundOnce);

/* ---------- Start / Pause Music ---------- */
startBtn.addEventListener("click", async ()=>{
  try{
    if(bgMusic.paused){
      bgMusic.currentTime=0;
      bgMusic.volume=0.6;
      await bgMusic.play();
      startBtn.innerHTML="⏸ Pause Music";
      extraButtons.classList.add("show");
    }else{
      bgMusic.pause();                // pause only the music
      startBtn.innerHTML="🚀 Start Experience";
      // buttons stay visible
    }
  }catch(e){
    console.warn("⚠️ Music play blocked:",e);
    alert("Please tap again to enable sound 🎵");
  }
});

/* ---------- Tools toggle (slow-motion open) ---------- */
toolsBtn.addEventListener("click",()=>{
  toolsVisible=!toolsVisible;
  toolsBox.classList.toggle("show",toolsVisible);
});

/* ---------- Contact modal ---------- */
function showContact(){ contactModal.style.display="flex"; }
function closeContact(){ contactModal.style.display="none"; }
contactModal.addEventListener("click",e=>{
  if(e.target===contactModal) closeContact();
});

/* ---------- Coming Soon popup ---------- */
function openComing(name){
  openModal(name,`<p class="small">🚧 ${name} — Coming soon!</p>`);
}

/* ---------- Visitor counter (local) ---------- */
(function(){
  try{
    const key="cyberx_visits";
    const v=(+localStorage.getItem(key)||0)+1;
    localStorage.setItem(key,v);
    visitorCount.textContent=v.toLocaleString();
  }catch(e){ visitorCount.textContent="—"; }
})();

/* ---------- Part D: Tool Implementations ---------- */

/* 1) Idea Generator */
function openIdea(){
  const ideas = [
    "AI-powered portfolio website",
    "Smart expense tracker app",
    "Voice-controlled home automation",
    "CyberX futuristic dashboard",
    "Mood-based playlist generator",
    "Code snippet manager",
    "Virtual chat companion",
    "Eco-route optimizer",
    "AR business card reader",
    "Instant recipe finder"
  ];
  openModal("💡 Idea Generator", `
    <p class="small">Click Generate to get a random idea.</p>
    <div class="preview-box" id="ideaBox">💡 ${ideas[0]}</div>
    <div class="actions"><button class="modal-btn" id="ideaBtn">🎲 Generate</button></div>
  `);
  $("ideaBtn").onclick = () => {
    $("ideaBox").innerText = "💡 " + ideas[Math.floor(Math.random() * ideas.length)];
  };
}

/* 2) Calculator */
function openCalc(){
  openModal("🧮 Calculator", `
    <p class="small">Enter an expression and press Evaluate.</p>
    <input id="calcInput" class="input" placeholder="(12+5)*2">
    <div class="actions"><button class="modal-btn" id="calcEval">Evaluate</button></div>
    <div class="preview-box" id="calcResult">Result: —</div>
  `);
  $("calcEval").onclick = () => {
    try {
      const expr = $("calcInput").value.replace(/\^/g, "**");
      const res = Function('"use strict";return (' + expr + ')')();
      $("calcResult").innerText = "Result: " + res;
    } catch (e) {
      $("calcResult").innerText = "Error: " + e.message;
    }
  };
}

/* 3) Color Picker */
function openColor(){
  openModal("🎨 Color Picker", `
    <p class="small">Pick a color and copy the CSS code.</p>
    <input id="colorPick" type="color" value="#7b2ff7" class="input" style="height:50px">
    <div class="preview-box" id="colorInfo">HEX: #7b2ff7<br>RGB: 123,47,247</div>
    <div class="actions"><button class="modal-btn" id="copyColor">Copy CSS</button></div>
  `);
  const inp = $("colorPick"), info = $("colorInfo");
  const update = () => {
    const c = inp.value;
    const r = parseInt(c.substr(1,2),16),
          g = parseInt(c.substr(3,2),16),
          b = parseInt(c.substr(5,2),16);
    info.innerHTML = `HEX: ${c}<br>RGB: ${r},${g},${b}`;
    info.style.background = c;
    info.style.color = (r+g+b>380) ? "#000" : "#fff";
  };
  inp.addEventListener("input", update);
  $("copyColor").onclick = () => {
    navigator.clipboard.writeText(`background: ${inp.value};`);
    alert("Copied to clipboard!");
  };
  update();
}

/* 4) Notes */
function openNotes(){
  openModal("📝 Notes", `
    <p class="small">Write and save local notes.</p>
    <textarea id="notesArea" class="input" placeholder="Type here..."></textarea>
    <div class="actions">
      <button class="modal-btn" id="saveNotes">Save</button>
      <button class="modal-btn" id="clearNotes">Clear</button>
    </div>
  `);
  const ta = $("notesArea");
  ta.value = localStorage.getItem("cyberx_notes") || "";
  $("saveNotes").onclick = () => {
    localStorage.setItem("cyberx_notes", ta.value);
    alert("Notes saved!");
  };
  $("clearNotes").onclick = () => {
    ta.value = "";
    localStorage.removeItem("cyberx_notes");
  };
}

/* 5) Compass */
function openCompass(){
  openModal("🧭 Compass", `
    <p class="small">Shows device orientation (mobile only).</p>
    <div class="preview-box" id="compData">Move your phone...</div>
  `);
  const el = $("compData");
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", e => {
      const heading = e.webkitCompassHeading || e.alpha;
      el.innerText = "Heading: " + (heading ? heading.toFixed(1) + "°" : "N/A");
    });
  } else {
    el.innerText = "Compass not supported on this device.";
  }
}

/* 6) Scheduler */
function openSched(){
  openModal("📅 Scheduler", `
    <p class="small">Save reminders locally (stored in your browser).</p>
    <input id="schedTitle" class="input" placeholder="Reminder title">
    <input id="schedDate" type="datetime-local" class="input">
    <div class="actions"><button class="modal-btn" id="saveSched">Save</button></div>
    <div class="preview-box" id="schedList">No reminders.</div>
  `);
  function load(){
    const arr = JSON.parse(localStorage.getItem("cyberx_sched") || "[]");
    $("schedList").innerHTML = arr.length
      ? arr.map((r,i)=>`${r.t} — ${new Date(r.d).toLocaleString()} <button class='modal-btn' onclick='(function(){const a=JSON.parse(localStorage.getItem("cyberx_sched")||"[]");a.splice(${i},1);localStorage.setItem("cyberx_sched",JSON.stringify(a));location.reload();})();'>❌</button>`).join("<br>")
      : "No reminders.";
  }
  $("saveSched").onclick = ()=>{
    const title = $("schedTitle").value || "Reminder";
    const date = $("schedDate").value;
    if(!date) return alert("Pick a date & time!");
    const arr = JSON.parse(localStorage.getItem("cyberx_sched") || "[]");
    arr.push({t:title,d:date});
    localStorage.setItem("cyberx_sched",JSON.stringify(arr));
    load(); alert("Saved!");
  };
  load();
}

/* 7) URL Shortener (Local) */
function openShorten(){
  openModal("🌐 URL Shortener", `
    <p class="small">Creates pseudo short links (saved locally).</p>
    <input id="longUrl" class="input" placeholder="https://...">
    <div class="actions"><button class="modal-btn" id="shortBtn">Shorten</button></div>
    <input id="shortResult" class="input preview" readonly>
  `);
  $("shortBtn").onclick = ()=>{
    const url = $("longUrl").value.trim();
    if(!url) return alert("Enter URL!");
    const id = Math.random().toString(36).substr(2,6);
    const db = JSON.parse(localStorage.getItem("cyberx_urls") || "{}");
    db[id] = url;
    localStorage.setItem("cyberx_urls", JSON.stringify(db));
    const short = location.origin + "/#u=" + id;
    $("shortResult").value = short;
    navigator.clipboard.writeText(short);
    alert("Short link copied!");
  };
}

/* 8) AI Assistant (Local Mock) */
function openAI(){
  openModal("🧠 AI Assistant", `
    <p class="small">Offline demo — simple rule-based responses.</p>
    <input id="aiAsk" class="input" placeholder="Ask me anything...">
    <div class="actions"><button class="modal-btn" id="aiBtn">Ask</button></div>
    <div class="preview-box" id="aiAns">Awaiting your question...</div>
  `);
  $("aiBtn").onclick = ()=>{
    const q = $("aiAsk").value.toLowerCase();
    let a = "I'm here to help!";
    if(q.includes("time")) a = new Date().toLocaleString();
    else if(q.includes("idea")) a = "How about a Nexty AI dashboard?";
    else if(q.includes("hello")) a = "Hey there 👋 Welcome to CyberX!";
    $("aiAns").innerText = a;
  };
}

/* 9) Password Generator */
function openPassword(){
  openModal("🔐 Password Generator", `
    <p class="small">Create strong passwords instantly.</p>
    <input id="pwLen" type="number" class="input" value="16" min="4" max="50">
    <div class="actions"><button class="modal-btn" id="genPw">Generate</button></div>
    <div class="preview-box" id="pwBox">Your password will appear here.</div>
  `);
  $("genPw").onclick = ()=>{
    const len = parseInt($("pwLen").value)||12;
    const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let pass="";
    for(let i=0;i<len;i++) pass+=chars[Math.floor(Math.random()*chars.length)];
    $("pwBox").innerHTML = `<b>${pass}</b><br><button class="modal-btn" onclick="navigator.clipboard.writeText('${pass}')">Copy</button>`;
  };
}

/* 10) QR Generator */
function openQR(){
  openModal("📑 QR Code Generator", `
    <p class="small">Enter text or URL.</p>
    <input id="qrInput" class="input" placeholder="https://example.com">
    <div class="actions"><button class="modal-btn" id="makeQR">Generate</button></div>
    <div class="preview-box" id="qrBox"></div>
  `);
  $("makeQR").onclick = ()=>{
    const text = encodeURIComponent($("qrInput").value.trim());
    if(!text) return alert("Enter text!");
    $("qrBox").innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?data=${text}&size=180x180">`;
  };
}

/* 11) Countdown Timer */
function openCountdown(){
  openModal("⏳ Countdown Timer", `
    <input type="datetime-local" id="cdInput" class="input">
    <div class="preview-box" id="cdDisplay">Set your time!</div>
    <div class="actions"><button class="modal-btn" id="cdStart">Start</button></div>
  `);
  $("cdStart").onclick = ()=>{
    const end = new Date($("cdInput").value);
    if(!end) return alert("Pick a date/time!");
    const disp = $("cdDisplay");
    const int = setInterval(()=>{
      const diff = end - new Date();
      if(diff<=0){ clearInterval(int); disp.innerText="Done!"; return; }
      const h=Math.floor(diff/3600000), m=Math.floor(diff/60000)%60, s=Math.floor(diff/1000)%60;
      disp.innerText=`${h}h ${m}m ${s}s`;
    },1000);
  };
}

/* 12) Gradient Maker */
function openGrad(){
  openModal("🌈 Gradient Maker", `
    <p class="small">Select two colors and direction.</p>
    <div class="row">
      <input type="color" id="g1" value="#7b2ff7">
      <input type="color" id="g2" value="#00f0ff">
    </div>
    <select id="gDir" class="input">
      <option value="to right">→ Right</option>
      <option value="to bottom">↓ Down</option>
      <option value="135deg">Diagonal</option>
    </select>
    <div class="actions"><button class="modal-btn" id="makeGrad">Generate</button></div>
    <div class="preview-box" id="gradPrev">Preview</div>
  `);
  $("makeGrad").onclick = ()=>{
    const c1=$("g1").value, c2=$("g2").value, dir=$("gDir").value;
    const css=`linear-gradient(${dir},${c1},${c2})`;
    $("gradPrev").style.background=css;
    $("gradPrev").innerText=css;
    navigator.clipboard.writeText(`background:${css};`);
  };
}

/* 13) Mini Game */
function openGame(){
  openModal("🕹 Mini Game", `
    <p class="small">Click the circle as fast as possible!</p>
    <div class="preview-box" style="height:220px;position:relative" id="gameBox"></div>
  `);
  const box=$("gameBox");
  let score=0;
  function spawn(){
    const c=document.createElement("div");
    c.style.cssText=`position:absolute;width:40px;height:40px;border-radius:50%;background:#7b2ff7;top:${Math.random()*180}px;left:${Math.random()*180}px;cursor:pointer;`;
    c.onclick=()=>{score++;c.remove();spawn();};
    box.innerHTML=`Score: ${score}`;
    box.appendChild(c);
  }
  spawn();
}

/* 14) Text-to-Speech */
function openTTS(){
  openModal("📢 Text to Speech", `
    <textarea id="ttsText" class="input" placeholder="Type something..."></textarea>
    <div class="actions"><button class="modal-btn" id="ttsBtn">Speak</button></div>
  `);
  $("ttsBtn").onclick=()=>{
    const u=new SpeechSynthesisUtterance($("ttsText").value);
    speechSynthesis.speak(u);
  };
}

/* 15) Logo Maker */
function openLogo(){
  openModal("🪄 Logo Maker", `
    <input id="logoText" class="input" placeholder="Enter brand name">
    <div class="actions"><button class="modal-btn" id="makeLogo">Generate</button></div>
    <div class="preview-box" id="logoPrev">Your logo will appear here</div>
  `);
  $("makeLogo").onclick=()=>{
    const t=$("logoText").value||"Nexty";
    $("logoPrev").innerHTML=`<span style="font-family:'Orbitron',sans-serif;font-size:2rem;background:linear-gradient(45deg,#7b2ff7,#00f0ff);-webkit-background-clip:text;color:transparent;">${t}</span>`;
  };
}

/* ✅ Connection confirmation */
console.log("✅ CyberX script.js connected — built by Nexty ⚡");
