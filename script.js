/* =========================================================
   CyberX — Nexty Here ⚡ (script.js — Part 1)
   ========================================================= */

/* ---------- Connection check ---------- */
console.log("✅ CyberX JS connected — Nexty Here ⚡");

/* Helper shortcut */
function $(id){ return document.getElementById(id); }

/* =========================================================
   PART A — PARTICLE BACKGROUND
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
for(let i=0;i<100;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    s:Math.random()*2+0.5,
    vx:(Math.random()-.5)*0.6,
    vy:(Math.random()-.5)*0.6
  });
}

function drawParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const p of particles){
    p.x += p.vx;
    p.y += p.vy;
    if(p.x<0||p.x>canvas.width) p.vx *= -1;
    if(p.y<0||p.y>canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.fillStyle="rgba(123,47,247,0.7)";
    ctx.arc(p.x,p.y,p.s,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* =========================================================
   PART B — BASIC UI AND CONTROLS
   ========================================================= */

const bgMusic = $("bgMusic");
const startBtn = $("startBtn");
const contactModal = $("contactModal");
const extraButtons = $("extraButtons");
const toolsBtn = $("toolsBtn");
const toolsBox = $("toolsBox");
const visitorCount = $("visitorCount");
let toolsVisible = false;

/* --- Start / Pause Music + Reveal Buttons --- */
startBtn.addEventListener("click", ()=>{
  if(bgMusic.paused){
    bgMusic.play().catch(()=>{});
    startBtn.innerHTML = "⏸ Pause Music";
    extraButtons.classList.add("show");
  } else {
    bgMusic.pause();
    startBtn.innerHTML = "🚀 Start Experience";
    extraButtons.classList.remove("show");
    toolsBox.classList.remove("show");
    toolsVisible = false;
  }
});

/* --- Tools toggle --- */
toolsBtn.addEventListener("click", ()=>{
  toolsVisible = !toolsVisible;
  toolsBox.classList.toggle("show", toolsVisible);
});

/* --- Contact modal --- */
function showContact(){ contactModal.style.display="flex"; }
function closeContact(){ contactModal.style.display="none"; }
contactModal.addEventListener("click", e=>{
  if(e.target===contactModal) closeContact();
});

/* --- Coming soon popups --- */
function openComing(name){
  openModal(name, `<p class="small">🚧 This feature is coming soon!</p>`);
}

/* --- Visitor counter (local only) --- */
(function(){
  try{
    const key="cyberx_visits";
    const v=Number(localStorage.getItem(key)||0)+1;
    localStorage.setItem(key,v);
    visitorCount.innerText=v.toLocaleString();
  }catch(e){ visitorCount.innerText="—"; }
})();

/* =========================================================
   PART C — MODAL SYSTEM + TOOLBOX SETUP
   ========================================================= */

const toolModal = $("toolModal");
const toolTitle = $("toolTitle");
const toolInner = $("toolInner");

/* --- Open & Close Modal --- */
function openModal(title, html){
  toolTitle.innerText = title;
  toolInner.innerHTML = html;
  toolModal.style.display = "flex";
}
function closeModal(){
  toolModal.style.display = "none";
  toolInner.innerHTML = "";
}
toolModal.addEventListener("click", e=>{
  if(e.target===toolModal) closeModal();
});

/* =========================================================
   PART D — TOOL LIST CREATION
   ========================================================= */

const toolsMap = [
  {id:"ideaTool",label:"💡 Idea Generator",fn:openIdea},
  {id:"calcTool",label:"🧮 Calculator",fn:openCalc},
  {id:"colorTool",label:"🎨 Color Picker",fn:openColor},
  {id:"notesTool",label:"📝 Notes",fn:openNotes},
  {id:"pwTool",label:"🔐 Password Generator",fn:openPassword},
  {id:"gradTool",label:"🌈 Gradient Maker",fn:openGrad},
  {id:"cdTool",label:"🗓 Countdown Timer",fn:openCountdown},
  {id:"qrTool",label:"📑 QR Code Generator",fn:openQR},
  {id:"ttsTool",label:"📢 Text-to-Speech",fn:openTTS},
  {id:"chatTool",label:"💬 Chat Simulator",fn:openChat}
];

const grid = $("toolGrid");
if(grid){
  grid.innerHTML = "";
  toolsMap.forEach(t=>{
    const el = document.createElement("div");
    el.className = "tool";
    el.id = t.id;
    el.textContent = t.label;
    el.addEventListener("click", t.fn);
    grid.appendChild(el);
  });
}

/* =========================================================
   PART E — FIRST SET OF TOOL IMPLEMENTATIONS
   ========================================================= */

/* 1) Idea Generator */
function openIdea(){
  const ideas = [
    "AI-powered portfolio",
    "Smart expense tracker",
    "Voice assistant dashboard",
    "CyberX futuristic theme",
    "Mood-based music app"
  ];
  openModal("💡 Idea Generator", `
    <p class='small'>Click generate for a new idea.</p>
    <div class='preview-box' id='ideaBox'>${ideas[0]}</div>
    <div class='actions'><button class='modal-btn' id='ideaGenBtn'>🎲 Generate</button></div>
  `);
  $("ideaGenBtn").onclick = ()=>{
    $("ideaBox").innerText = ideas[Math.floor(Math.random()*ideas.length)];
  };
}

/* 2) Calculator */
function openCalc(){
  openModal("🧮 Calculator", `
    <p class='small'>Type a math expression and press Evaluate.</p>
    <input id='calcExpr' class='input' placeholder='(12+3)/5*2'>
    <div class='actions'><button class='modal-btn' id='calcBtn'>Evaluate</button></div>
    <div class='preview-box' id='calcRes'>Result: —</div>
  `);
  $("calcBtn").onclick = ()=>{
    try{
      const expr = $("calcExpr").value.replace(/\^/g,"**");
      const res = Function('"use strict";return ('+expr+')')();
      $("calcRes").innerText = "Result: " + res;
    }catch(e){
      $("calcRes").innerText = "Error: " + e.message;
    }
  };
}

/* 3) Color Picker */
function openColor(){
  openModal("🎨 Color Picker", `
    <p class='small'>Pick a color and copy its CSS code.</p>
    <input id='colorInp' type='color' value='#7b2ff7' style='width:100%;height:50px;border:none;border-radius:8px;'>
    <div class='preview-box' id='colorInfo'>HEX: #7b2ff7<br>RGB: 123,47,247</div>
    <div class='actions'><button class='modal-btn' id='copyColorBtn'>Copy CSS</button></div>
  `);
  const inp = $("colorInp"), info = $("colorInfo");
  function update(){
    const c = inp.value;
    const r=parseInt(c.substr(1,2),16), g=parseInt(c.substr(3,2),16), b=parseInt(c.substr(5,2),16);
    info.innerHTML = `HEX: ${c}<br>RGB: ${r},${g},${b}`;
    info.style.background=c;
    info.style.color=(r+g+b>380)?"#000":"#fff";
  }
  inp.addEventListener("input", update);
  update();
  $("copyColorBtn").onclick = ()=>{
    navigator.clipboard.writeText(`background: ${inp.value};`);
    alert("CSS Copied!");
  };
}

/* 4) Notes */
function openNotes(){
  openModal("📝 Notes", `
    <p class='small'>Write quick notes (saved locally).</p>
    <textarea id='noteText' class='input' style='height:120px'></textarea>
    <div class='actions'>
      <button class='modal-btn' id='saveNoteBtn'>Save</button>
      <button class='modal-btn' id='clearNoteBtn'>Clear</button>
    </div>
  `);
  const area = $("noteText");
  area.value = localStorage.getItem("cyberx_notes") || "";
  $("saveNoteBtn").onclick = ()=>{
    localStorage.setItem("cyberx_notes", area.value);
    alert("Saved!");
  };
  $("clearNoteBtn").onclick = ()=>{
    area.value = "";
    localStorage.removeItem("cyberx_notes");
  };
    }

/* =========================================================
   PART F — REMAINING TOOL IMPLEMENTATIONS
   ========================================================= */

/* 5) Password Generator */
function openPassword(){
  openModal("🔐 Password Generator", `
    <p class='small'>Generate secure passwords.</p>
    <input id='pwLen' type='number' class='input' value='12' min='4' max='64'>
    <div class='actions'><button class='modal-btn' id='pwGen'>Generate</button></div>
    <div class='preview-box' id='pwOut'>Result: —</div>
  `);
  $("pwGen").onclick = ()=>{
    const len = parseInt($("pwLen").value)||12;
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,./?";
    let out="";
    for(let i=0;i<len;i++) out += chars[Math.floor(Math.random()*chars.length)];
    $("pwOut").innerHTML = `<code>${out}</code><br><button class='modal-btn' onclick="navigator.clipboard.writeText('${out}')">Copy</button>`;
  };
}

/* 6) Gradient Maker */
function openGrad(){
  openModal("🌈 Gradient Maker", `
    <p class='small'>Pick two colors for CSS gradient.</p>
    <div class='row'>
      <input id='grad1' type='color' value='#7b2ff7' class='input'>
      <input id='grad2' type='color' value='#00f0ff' class='input'>
    </div>
    <div class='preview-box' id='gradPrev'>Preview</div>
    <div class='actions'><button class='modal-btn' id='copyGrad'>Copy CSS</button></div>
  `);
  const c1=$("grad1"), c2=$("grad2"), p=$("gradPrev");
  function upd(){
    p.style.background=`linear-gradient(45deg,${c1.value},${c2.value})`;
  }
  c1.addEventListener("input",upd); c2.addEventListener("input",upd); upd();
  $("copyGrad").onclick=()=>{
    navigator.clipboard.writeText(p.style.background);
    alert("Gradient CSS Copied!");
  };
}

/* 7) Countdown Timer */
function openCountdown(){
  openModal("🗓 Countdown Timer", `
    <p class='small'>Select target date/time.</p>
    <input id='cdTarget' type='datetime-local' class='input'>
    <div class='preview-box' id='cdDisplay'>--:--:--</div>
    <div class='actions'><button class='modal-btn' id='startCd'>Start</button></div>
  `);
  $("startCd").onclick=()=>{
    const t = new Date($("cdTarget").value).getTime();
    if(!t){ alert("Select date/time"); return; }
    const disp=$("cdDisplay");
    const int=setInterval(()=>{
      const diff=t-Date.now();
      if(diff<=0){disp.textContent="🎉 Time's up!";clearInterval(int);}
      else{
        const h=Math.floor(diff/3600000),m=Math.floor(diff%3600000/60000),s=Math.floor(diff%60000/1000);
        disp.textContent=`${h}h ${m}m ${s}s`;
      }
    },1000);
  };
}

/* 8) QR Code Generator (uses API) */
function openQR(){
  openModal("📑 QR Code Generator", `
    <p class='small'>Enter text or link.</p>
    <input id='qrText' class='input' placeholder='https://...'>
    <div class='actions'><button class='modal-btn' id='makeQR'>Generate</button></div>
    <div class='preview-box'><img id='qrImg' style='max-width:100%'></div>
  `);
  $("makeQR").onclick=()=>{
    const txt=encodeURIComponent($("qrText").value.trim());
    if(!txt) return alert("Enter text/link");
    $("qrImg").src=`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${txt}`;
  };
}

/* 9) Text to Speech */
function openTTS(){
  openModal("📢 Text-to-Speech", `
    <p class='small'>Type text and listen.</p>
    <textarea id='ttsText' class='input' placeholder='Write something...'></textarea>
    <div class='actions'><button class='modal-btn' id='speakBtn'>Speak</button></div>
  `);
  $("speakBtn").onclick=()=>{
    const msg=new SpeechSynthesisUtterance($("ttsText").value);
    speechSynthesis.speak(msg);
  };
}

/* 10) Chat Simulator */
function openChat(){
  openModal("💬 Chat Simulator", `
    <p class='small'>A mini local chat demo.</p>
    <div id='chatBox' class='preview-box' style='height:150px;overflow:auto'></div>
    <input id='chatInp' class='input' placeholder='Type a message'>
    <div class='actions'><button class='modal-btn' id='sendChat'>Send</button></div>
  `);
  const box=$("chatBox");
  $("sendChat").onclick=()=>{
    const val=$("chatInp").value.trim(); if(!val) return;
    box.innerHTML += `<div>🧑‍💻 You: ${val}</div>`;
    $("chatInp").value="";
    setTimeout(()=>{ box.innerHTML += `<div>🤖 Bot: ${val.split('').reverse().join('')}</div>`; box.scrollTop=box.scrollHeight; },700);
  };
}

/* =========================================================
   END OF CyberX script.js
   ========================================================= */
console.log("⚡ CyberX fully loaded — All tools functional.");
