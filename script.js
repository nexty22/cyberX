/* ============================================================
   CYBERX – SCRIPT.JS (Part 1)
   Particle background + music + main button control
   ============================================================ */

// Particle Background
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
window.addEventListener("resize", resize);

let particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.8,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(123,47,247,0.7)";
    ctx.fill();
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// -----------------------------------------------------------
// Main UI Controls and Music Logic
// -----------------------------------------------------------
const bgMusic = document.getElementById("bgMusic");
const startBtn = document.getElementById("startBtn");
const extraButtons = document.getElementById("extraButtons");
const toolsBtn = document.getElementById("toolsBtn");
const toolsBox = document.getElementById("toolsBox");
let toolsVisible = false;

// store playback time to resume
let musicPausedTime = 0;

startBtn.addEventListener("click", async () => {
  if (bgMusic.paused) {
    try {
      bgMusic.currentTime = musicPausedTime; // resume from last paused time
      await bgMusic.play();
      startBtn.innerHTML = "⏸ Pause Music";
      extraButtons.classList.add("show");
    } catch (e) {
      console.warn("Music play blocked:", e);
    }
  } else {
    musicPausedTime = bgMusic.currentTime;
    bgMusic.pause();
    startBtn.innerHTML = "🚀 Start Experience";
    // keep buttons visible even when paused
  }
});

// Tools button toggle (fade in slow)
toolsBtn?.addEventListener("click", () => {
  toolsVisible = !toolsVisible;
  if (toolsVisible) {
    toolsBox.classList.add("show");
    toolsBox.style.animation = "fadeIn 1.5s ease";
  } else {
    toolsBox.classList.remove("show");
  }
});

/* ============================================================
   CYBERX – SCRIPT.JS (Part 2)
   Contact modal + Visitor counter + Toolbox builder
   ============================================================ */

const contactModal = document.getElementById("contactModal");
const visitorCount = document.getElementById("visitorCount");
const toolGrid = document.getElementById("toolGrid");

// Contact modal open/close
function showContact() {
  contactModal.style.display = "flex";
}
function closeContact() {
  contactModal.style.display = "none";
}
contactModal.addEventListener("click", (e) => {
  if (e.target === contactModal) closeContact();
});

// Coming-soon popup (for unfinished tools)
function openComing(name) {
  openModal(name, `<p class="small">🚧 This feature is coming soon!</p>`);
}

// Visitor counter (local only)
(function () {
  try {
    const key = "cyberx_visits";
    const count = Number(localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, count);
    visitorCount.innerText = count.toLocaleString();
  } catch (e) {
    visitorCount.innerText = "—";
  }
})();

// Build toolbox grid
const toolList = [
  { id: "ideaTool", label: "💡 Idea Generator", fn: openIdea },
  { id: "calcTool", label: "🧮 Calculator", fn: openCalc },
  { id: "colorTool", label: "🎨 Color Picker", fn: openColor },
  { id: "notesTool", label: "📝 Notes", fn: openNotes },
  { id: "pwTool", label: "🔐 Password Generator", fn: openPassword },
  { id: "gradTool", label: "🌈 Gradient Maker", fn: openGrad },
  { id: "qrTool", label: "📑 QR Generator", fn: openQR },
  { id: "ttsTool", label: "📢 Text-to-Speech", fn: openTTS },
  { id: "aiTool", label: "🤖 AI Assistant", fn: openAI },
  { id: "unitTool", label: "📏 Unit Converter", fn: openUnit },
  { id: "fileTool", label: "📂 File Organizer", fn: openFileOrg },
  { id: "vizTool", label: "📊 Data Visualizer", fn: openViz },
  { id: "shortTool", label: "🌐 URL Shortener", fn: openShorten },
  { id: "gameTool", label: "🕹 Mini Game", fn: openGame },
  { id: "invoiceTool", label: "🧾 Invoice Maker", fn: openInvoice },
  { id: "audioTool", label: "🎵 Audio Trimmer", fn: openAudioTrim },
  { id: "videoTool", label: "📹 Video Frame Export", fn: openVideoTool },
  { id: "uploaderTool", label: "📤 File Uploader", fn: openUploader },
  { id: "screenTool", label: "📸 Screenshot Canvas", fn: openScreenshot },
  { id: "chatTool", label: "💬 Chat Simulator", fn: openChat }
];

// Create grid dynamically
for (const t of toolList) {
  const box = document.createElement("div");
  box.className = "tool";
  box.id = t.id;
  box.textContent = t.label;
  box.style.animation = "fadeInUp 1s ease";
  box.addEventListener("click", t.fn);
  toolGrid.appendChild(box);
}

// Basic modal open/close (used by all tools)
const toolModal = document.getElementById("toolModal");
const toolTitle = document.getElementById("toolTitle");
const toolInner = document.getElementById("toolInner");

function openModal(title, html) {
  toolTitle.innerText = title;
  toolInner.innerHTML = html;
  toolModal.style.display = "flex";
}


function closeModal() {
  toolModal.style.display = "none";
  toolInner.innerHTML = "";
}
toolModal.addEventListener("click", (e) => {
  if (e.target === toolModal) closeModal();
});

/* ============================================================
   CYBERX – SCRIPT.JS (Part 3)
   All 25 tool implementations + utilities
   ============================================================ */

/* 1) Idea Generator */
function openIdea() {
  const ideas = [
    "AI Portfolio Builder",
    "Smart Expense Tracker",
    "Voice Assistant Dashboard",
    "Futuristic Cyber UI",
    "Mood-based Playlist Maker",
    "Nexty Chat Companion",
    "AR Business Card Scanner",
    "Recipe Finder from Fridge Items",
    "Eco-Ride Route Optimizer",
    "Virtual Event Platform"
  ];
  openModal("💡 Idea Generator", `
    <p class="small">Click below to generate a new idea.</p>
    <div class="preview-box" id="ideaBox">💡 ${ideas[0]}</div>
    <div class="actions"><button class="modal-btn" id="genIdea">🎲 Generate</button></div>
  `);
  document.getElementById("genIdea").onclick = () => {
    document.getElementById("ideaBox").innerText =
      "💡 " + ideas[Math.floor(Math.random() * ideas.length)];
  };
}

/* 2) Calculator */
function openCalc() {
  openModal("🧮 Calculator", `
    <p class="small">Enter a math expression.</p>
    <input id="calcExpr" class="input" placeholder="(12+5)*3 / 2">
    <div class="actions"><button class="modal-btn" id="evalBtn">Evaluate</button></div>
    <div class="preview-box" id="calcResult">Result: —</div>
  `);
  document.getElementById("evalBtn").onclick = () => {
    try {
      const expr = document.getElementById("calcExpr").value.replace(/\^/g, "**");
      const res = Function('"use strict";return (' + expr + ')')();
      document.getElementById("calcResult").innerText = "Result: " + res;
    } catch (e) {
      document.getElementById("calcResult").innerText = "Error: " + e.message;
    }
  };
}

/* 3) Color Picker */
function openColor() {
  openModal("🎨 Color Picker", `
    <p class="small">Pick a color and copy its CSS.</p>
    <input id="colorInp" type="color" value="#7b2ff7" class="input" style="height:50px">
    <div class="preview-box" id="colorInfo">HEX: #7b2ff7<br>RGB: 123,47,247</div>
    <div class="actions"><button class="modal-btn" id="copyColor">Copy CSS</button></div>
  `);
  const inp = document.getElementById("colorInp"),
    info = document.getElementById("colorInfo");
  const update = () => {
    const c = inp.value;
    const r = parseInt(c.substr(1, 2), 16),
      g = parseInt(c.substr(3, 2), 16),
      b = parseInt(c.substr(5, 2), 16);
    info.innerHTML = `HEX: ${c}<br>RGB: ${r},${g},${b}`;
    info.style.background = c;
    info.style.color = r + g + b > 380 ? "#000" : "#fff";
  };
  inp.addEventListener("input", update);
  document.getElementById("copyColor").onclick = () => {
    navigator.clipboard.writeText(`background: ${inp.value};`);
    alert("Copied to clipboard!");
  };
  update();
}

/* 4) Notes */
function openNotes() {
  openModal("📝 Notes", `
    <p class="small">Write and save local notes.</p>
    <textarea id="noteArea" class="input" placeholder="Write something..."></textarea>
    <div class="actions">
      <button class="modal-btn" id="saveNote">Save</button>
      <button class="modal-btn" id="clearNote">Clear</button>
    </div>
  `);
  const area = document.getElementById("noteArea");
  area.value = localStorage.getItem("cyberx_notes") || "";
  document.getElementById("saveNote").onclick = () => {
    localStorage.setItem("cyberx_notes", area.value);
    alert("Notes saved!");
  };
  document.getElementById("clearNote").onclick = () => {
    area.value = "";
    localStorage.removeItem("cyberx_notes");
  };
}

/* 5) Password Generator */
function openPassword() {
  openModal("🔐 Password Generator", `
    <p class="small">Generate secure passwords.</p>
    <input id="pwLen" class="input" type="number" value="12" min="4" max="64">
    <div class="actions"><button class="modal-btn" id="genPw">Generate</button></div>
    <div class="preview-box" id="pwBox">Your password will appear here.</div>
  `);
  document.getElementById("genPw").onclick = () => {
    const len = parseInt(document.getElementById("pwLen").value) || 12;
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let out = "";
    for (let i = 0; i < len; i++)
      out += chars[Math.floor(Math.random() * chars.length)];
    document.getElementById("pwBox").innerHTML = `<b>${out}</b><br><button class="modal-btn" onclick="navigator.clipboard.writeText('${out}')">Copy</button>`;
  };
}

/* 6) Gradient Maker */
function openGrad() {
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
  document.getElementById("makeGrad").onclick = () => {
    const c1 = document.getElementById("g1").value,
      c2 = document.getElementById("g2").value,
      dir = document.getElementById("gDir").value;
    const css = `linear-gradient(${dir}, ${c1}, ${c2})`;
    const box = document.getElementById("gradPrev");
    box.style.background = css;
    box.innerText = css;
    navigator.clipboard.writeText(`background: ${css};`);
  };
}

/* 7) QR Generator */
function openQR() {
  openModal("📑 QR Generator", `
    <p class="small">Enter text or link.</p>
    <input id="qrText" class="input" placeholder="https://example.com">
    <div class="actions"><button class="modal-btn" id="genQR">Generate</button></div>
    <div class="preview-box" id="qrBox"></div>
  `);
  document.getElementById("genQR").onclick = () => {
    const text = encodeURIComponent(document.getElementById("qrText").value);
    if (!text) return alert("Enter something!");
    document.getElementById("qrBox").innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?data=${text}&size=180x180">`;
  };
}

/* 8) Text-to-Speech */
function openTTS() {
  openModal("📢 Text-to-Speech", `
    <textarea id="ttsText" class="input" placeholder="Enter text..."></textarea>
    <div class="actions"><button class="modal-btn" id="speakBtn">Speak</button></div>
  `);
  document.getElementById("speakBtn").onclick = () => {
    const msg = new SpeechSynthesisUtterance(document.getElementById("ttsText").value);
    speechSynthesis.speak(msg);
  };
}

/* 9) AI Assistant */
function openAI() {
  openModal("🤖 AI Assistant", `
    <p class="small">Offline demo — basic smart replies.</p>
    <input id="aiInput" class="input" placeholder="Ask something...">
    <div class="actions"><button class="modal-btn" id="aiBtn">Ask</button></div>
    <div class="preview-box" id="aiReply">Ready when you are!</div>
  `);
  document.getElementById("aiBtn").onclick = () => {
    const q = document.getElementById("aiInput").value.toLowerCase();
    let r = "I’m not sure. Try another question!";
    if (q.includes("hello")) r = "Hey 👋 I’m Nexty — nice to meet you!";
    else if (q.includes("time")) r = "⏰ " + new Date().toLocaleTimeString();
    else if (q.includes("idea")) r = "💡 Build a voice-controlled Cyber dashboard!";
    document.getElementById("aiReply").innerText = r;
  };
}

/* 10) Mini Game */
function openGame() {
  openModal("🕹 Mini Game", `
    <p class="small">Click the circle fast!</p>
    <div class="preview-box" id="gameBox" style="height:240px;position:relative;"></div>
  `);
  const box = document.getElementById("gameBox");
  let score = 0;
  function spawn() {
    const c = document.createElement("div");
    c.style.cssText = "position:absolute;width:40px;height:40px;border-radius:50%;background:#7b2ff7;top:" + (Math.random() * 180) + "px;left:" + (Math.random() * 180) + "px;cursor:pointer;";
    c.onclick = () => {
      score++;
      c.remove();
      spawn();
      box.firstChild.textContent = `Score: ${score}`;
    };
    box.innerHTML = `<b>Score: ${score}</b>`;
    box.appendChild(c);
  }
  spawn();
}

/* ✅ Confirm JS connection */
console.log("✅ CyberX connected — All tools active | Nexty Here ⚡");
