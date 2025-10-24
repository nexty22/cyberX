/* ✅ CyberX — Full Functional Script (Final) */

/* ---------- Particles Background ---------- */
const canvas = document.getElementById("particles"),
      ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    s: Math.random() * 2 + 0.8,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.fillStyle = "rgba(123,47,247,0.7)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(animate);
}
animate();

/* ---------- Buttons & Music ---------- */
const startBtn = document.getElementById("startBtn"),
  bgMusic = document.getElementById("bgMusic"),
  extraButtons = document.getElementById("extraButtons"),
  toolsBtn = document.getElementById("toolsBtn"),
  toolsBox = document.getElementById("toolsBox");

let toolsVisible = false;
startBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
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

toolsBtn.addEventListener("click", () => {
  toolsVisible = !toolsVisible;
  toolsBox.classList.toggle("show", toolsVisible);
});

/* ---------- Contact Modal ---------- */
function showContact() {
  document.getElementById("contactModal").style.display = "flex";
}
function closeContact() {
  document.getElementById("contactModal").style.display = "none";
}
document
  .getElementById("contactModal")
  .addEventListener("click", (e) => e.target === contactModal && closeContact());

/* ---------- Modal Helper ---------- */
const toolModal = document.getElementById("toolModal"),
  toolInner = document.getElementById("toolInner"),
  toolTitle = document.getElementById("toolTitle");

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

function openComing(name) {
  openModal(name, `<p class="small">🚧 Coming Soon 🚧</p>`);
}

/* ---------- Visitor Counter (Local) ---------- */
(function () {
  const key = "cyberx_visits";
  let v = Number(localStorage.getItem(key) || 0) + 1;
  localStorage.setItem(key, v);
  document.getElementById("visitorCount").innerText = v;
})();

/* ---------- Tool List ---------- */
const tools = [
  "💡 Idea Generator",
  "🧮 Calculator",
  "🎨 Color Picker",
  "📅 Scheduler",
  "📝 Notes",
  "🧭 Compass",
  "🌐 URL Shortener",
  "🗂 File Organizer",
  "📊 Data Visualizer",
  "🧠 AI Assistant",
  "📸 Image Compressor",
  "🎵 Audio Trimmer",
  "📹 Video Frame Export",
  "🔐 Password Generator",
  "🌈 Gradient Maker",
  "🗓 Countdown Timer",
  "🕹 Mini Game",
  "📂 File Uploader",
  "📷 Screenshot Canvas",
  "🧾 Invoice Creator",
  "🧮 Unit Converter",
  "📑 QR Code Generator",
  "📢 Text-to-Speech",
  "💬 Chat Simulator",
  "🪄 Logo Maker",
];

/* ---------- Tool Grid Creation ---------- */
const grid = document.getElementById("toolGrid");
tools.forEach((name) => {
  const div = document.createElement("div");
  div.className = "tool";
  div.textContent = name;
  div.addEventListener("click", () => openTool(name));
  grid.appendChild(div);
});

/* ---------- Tool Logic ---------- */
function openTool(name) {
  switch (name) {
    case "💡 Idea Generator":
      openModal(name, `<p class="small">Click Generate for a new idea</p>
        <div class="preview" id="ideaBox">AI-powered portfolio website</div>
        <button class="btn" id="ideaGen">🎲 Generate</button>`);
      document.getElementById("ideaGen").onclick = () => {
        const ideas = [
          "AI assistant for music",
          "Virtual recipe helper",
          "Smart fitness tracker",
          "Custom logo creator",
          "Mood-based playlist",
        ];
        document.getElementById("ideaBox").innerText =
          ideas[Math.floor(Math.random() * ideas.length)];
      };
      break;

    case "🧮 Calculator":
      openModal(name, `<p class="small">Type expression and Evaluate</p>
        <input id="calcExpr" class="input" placeholder="e.g. (5+3)*2">
        <button class="btn" id="calcBtn">Evaluate</button>
        <div class="preview" id="calcOut">Result: —</div>`);
      document.getElementById("calcBtn").onclick = () => {
        try {
          const expr = document.getElementById("calcExpr").value;
          const res = Function(`"use strict";return(${expr})`)();
          document.getElementById("calcOut").innerText = `Result: ${res}`;
        } catch {
          document.getElementById("calcOut").innerText = "Error!";
        }
      };
      break;

    case "🎨 Color Picker":
      openModal(name, `<input id="colorPick" type="color" value="#7b2ff7">
        <div class="preview" id="colorOut">HEX: #7b2ff7</div>`);
      const cInp = document.getElementById("colorPick");
      cInp.addEventListener("input", () => {
        document.getElementById(
          "colorOut"
        ).innerText = `HEX: ${cInp.value.toUpperCase()}`;
      });
      break;

    default:
      openModal(name, `<p class="small">This tool is coming soon 🚧</p>`);
  }
    }
