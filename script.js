// ================= Loader =================
let progress = 0;
const loader = document.getElementById('loader');
const progressText = document.getElementById('progress');

const loaderInterval = setInterval(() => {
  try {
    progress += 2;
    if (progress >= 100) {
      progress = 100;
      if (progressText) progressText.innerText = '100%';
      clearInterval(loaderInterval);
      if (loader) {
        loader.style.transition = 'opacity 0.8s, transform 0.8s';
        loader.style.opacity = '0';
        loader.style.transform = 'scale(1.05)';
        setTimeout(() => { if (loader) loader.style.display = 'none'; }, 800);
      }
    } else {
      if (progressText) progressText.innerText = progress + '%';
    }
  } catch (e) {
    // If any unexpected error occurs, stop interval to avoid infinite loop
    console.error('Loader error:', e);
    clearInterval(loaderInterval);
  }
}, 100);


// =============== Dark/Light Mode ===============
function toggleMode() {
  document.body.classList.toggle('light-mode');
  const modeStatus = document.getElementById('modeStatus');
  if (modeStatus) modeStatus.innerText = document.body.classList.contains('light-mode') ? 'Light' : 'Dark';
}


// =============== Contact Modal ===============
const contactModal = document.getElementById('contactModal');
function showModal(){ if(contactModal) contactModal.classList.add('show'); }
function closeModal(){ if(contactModal) contactModal.classList.remove('show'); }


// =============== Particle Background ===============
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let particles = [];
  const COUNT = 60;
  function createParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5
      });
    }
  }
  createParticles();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
      if (p.y > canvas.height || p.y < 0) p.speedY *= -1;
      ctx.fillStyle = 'rgba(123,47,247,0.7)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  animate();
})();


// =============== Start Music ===============
(function initMusic() {
  const startBtn = document.getElementById('startBtn');
  const bgMusic = document.getElementById('bgMusic');
  if (!startBtn || !bgMusic) return;
  startBtn.addEventListener('click', () => {
    try {
      if (bgMusic.paused) {
        bgMusic.play();
        startBtn.innerHTML = '⏸ Pause Music';
      } else {
        bgMusic.pause();
        startBtn.innerHTML = '🚀 Start Experience';
      }
    } catch (e) {
      console.warn('Music play blocked or error:', e);
    }
  });
})();


// =============== Tools Modal / UI ===============
const toolModal = document.getElementById('toolModal') || createToolModalFallback();
const toolContent = document.getElementById('toolContent') || (toolModal ? toolModal.querySelector('#toolContent') : null);

function createToolModalFallback() {
  // If HTML wasn't added, create a minimal modal so code won't break.
  const wrapper = document.createElement('div');
  wrapper.id = 'toolModal';
  wrapper.className = 'modal-backdrop';
  wrapper.innerHTML = `<div class="modal" id="toolContent"></div>`;
  document.body.appendChild(wrapper);
  return wrapper;
}

function openTool(type) {
  const names = {
    password: "Password Generator",
    encrypt: "Encrypt / Decrypt",
    qr: "QR Code Generator",
    bmi: "BMI Calculator",
    ip: "IP Finder"
  };
  const title = names[type] || 'Tool';
  if (document.getElementById('activeTool')) document.getElementById('activeTool').innerText = title;

  let html = '';
  switch (type) {
    case 'password':
      html = `
        <h3>🔑 Password Generator</h3>
        <input id="pwLength" type="number" placeholder="Length (8)" min="4" max="64" value="12" />
        <div style="margin-top:8px;">
          <button onclick="generatePassword()">Generate</button>
          <button onclick="copyText('pwResult')">Copy</button>
        </div>
        <p id="pwResult" style="margin-top:10px;word-break:break-all;"></p>
        <button onclick="closeTool()">❌ Close</button>
      `;
      break;

    case 'encrypt':
      html = `
        <h3>🔐 Text Encrypt / Decrypt (Base64)</h3>
        <textarea id="cryptoText" placeholder="Enter text..." rows="4"></textarea>
        <div style="margin-top:8px;">
          <button onclick="encryptText()">Encrypt</button>
          <button onclick="decryptText()">Decrypt</button>
          <button onclick="copyText('cryptoResult')">Copy</button>
        </div>
        <p id="cryptoResult" style="margin-top:10px;word-break:break-all;"></p>
        <button onclick="closeTool()">❌ Close</button>
      `;
      break;

    case 'qr':
      html = `
        <h3>📱 QR Code Generator</h3>
        <input id="qrInput" placeholder="Enter text or URL" />
        <div style="margin-top:8px;">
          <button onclick="generateQR()">Generate QR</button>
          <button onclick="downloadQR()">Download</button>
        </div>
        <div id="qrOutput" style="margin-top:10px"></div>
        <button onclick="closeTool()">❌ Close</button>
      `;
      break;

    case 'bmi':
      html = `
        <h3>🧮 BMI Calculator</h3>
        <input id="weight" type="number" placeholder="Weight (kg)" />
        <input id="height" type="number" placeholder="Height (cm)" />
        <div style="margin-top:8px;">
          <button onclick="calcBMI()">Calculate</button>
          <button onclick="copyText('bmiResult')">Copy</button>
        </div>
        <p id="bmiResult" style="margin-top:10px"></p>
        <button onclick="closeTool()">❌ Close</button>
      `;
      break;

    case 'ip':
      html = `
        <h3>🌐 IP Address Finder</h3>
        <div style="margin-top:8px;">
          <button onclick="fetchIP()">Get My IP</button>
        </div>
        <p id="ipResult" style="margin-top:10px">Your IP will appear here...</p>
        <button onclick="closeTool()">❌ Close</button>
      `;
      break;

    default:
      html = `<h3>${title}</h3><p>Tool not implemented yet.</p><button onclick="closeTool()">❌ Close</button>`;
  }

  if (toolContent) {
    toolContent.innerHTML = html;
    if (toolModal) toolModal.classList.add('show');
    // Update tool count in HUD in case cards exist
    updateToolCount();
  } else {
    alert('Tool UI not available.');
  }
}

function closeTool() {
  if (toolModal) toolModal.classList.remove('show');
  if (toolContent) toolContent.innerHTML = '';
  const active = document.getElementById('activeTool');
  if (active) active.innerText = 'None';
}

// Utility: copy text by element id
function copyText(id) {
  try {
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.innerText || el.value || el.textContent;
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard');
    }).catch(() => {
      alert('Copy failed');
    });
  } catch (e) {
    console.warn('Copy error', e);
  }
}


// =============== Tool Functionalities ===============

// Password Generator
function generatePassword() {
  const lenEl = document.getElementById('pwLength');
  const out = document.getElementById('pwResult');
  const len = Math.min(64, Math.max(4, parseInt(lenEl ? lenEl.value : 12) || 12));
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let pass = '';
  for (let i = 0; i < len; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  if (out) out.innerText = pass;
}

// Encrypt / Decrypt (Base64)
function encryptText() {
  const ta = document.getElementById('cryptoText');
  const out = document.getElementById('cryptoResult');
  if (!ta || !out) return;
  try {
    const encrypted = btoa(unescape(encodeURIComponent(ta.value || '')));
    out.innerText = encrypted;
  } catch (e) {
    out.innerText = 'Encryption failed';
  }
}
function decryptText() {
  const ta = document.getElementById('cryptoText');
  const out = document.getElementById('cryptoResult');
  if (!ta || !out) return;
  try {
    const decoded = decodeURIComponent(escape(atob(ta.value || '')));
    out.innerText = decoded;
  } catch (e) {
    out.innerText = '❌ Invalid encrypted text!';
  }
}

// QR Code (uses qrserver API)
function generateQR() {
  const inp = document.getElementById('qrInput');
  const out = document.getElementById('qrOutput');
  if (!inp || !out) return;
  const text = inp.value.trim();
  if (!text) return alert('Enter text or URL');
  const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  out.innerHTML = `<img id="__cyberx_qr" src="${qrAPI}" alt="QR Code" />`;
}
function downloadQR() {
  const img = document.getElementById('__cyberx_qr');
  if (!img) return alert('Generate QR first');
  const url = img.src;
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cyberx_qr.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// BMI
function calcBMI() {
  const wEl = document.getElementById('weight');
  const hEl = document.getElementById('height');
  const out = document.getElementById('bmiResult');
  if (!wEl || !hEl || !out) return;
  const w = parseFloat(wEl.value);
  const hcm = parseFloat(hEl.value);
  if (!w || !hcm) return alert('Enter weight and height');
  const h = hcm / 100;
  const bmi = (w / (h * h));
  const val = bmi.toFixed(2);
  let status = '';
  if (bmi < 18.5) status = 'Underweight';
  else if (bmi < 25) status = 'Normal';
  else if (bmi < 30) status = 'Overweight';
  else status = 'Obese';
  out.innerText = `BMI: ${val} (${status})`;
}

// IP Finder (public API)
async function fetchIP() {
  const out = document.getElementById('ipResult');
  if (!out) return;
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    if (!res.ok) throw new Error('Network response not ok');
    const data = await res.json();
    out.innerText = `Your IP: ${data.ip}`;
  } catch (e) {
    out.innerText = 'Failed to fetch IP';
  }
}


// =============== HUD Logic + Dragging ===============
const hud = document.getElementById('cyberx-hud');
const toolCountEl = document.getElementById('toolCount');

function updateToolCount() {
  const cards = document.querySelectorAll('.tool-card');
  if (toolCountEl) toolCountEl.innerText = cards.length ? cards.length : 5;
}
updateToolCount();

// Ensure openTool updates active tool (we already set active inside openTool)

// Make HUD draggable with persistence
(function enableHudDrag() {
  if (!hud) return;

  // restore position from localStorage
  const saved = localStorage.getItem('cyberx_hud_pos');
  if (saved) {
    try {
      const pos = JSON.parse(saved);
      if (pos.left) hud.style.left = pos.left;
      if (pos.top) hud.style.top = pos.top;
      hud.style.right = 'auto';
    } catch (e) { /* ignore */ }
  }

  let isDragging = false;
  let startX = 0, startY = 0, startLeft = 0, startTop = 0;

  function clamp(posLeft, posTop) {
    const pad = 8;
    const w = hud.offsetWidth;
    const h = hud.offsetHeight;
    const maxLeft = window.innerWidth - w - pad;
    const maxTop = window.innerHeight - h - pad;
    const left = Math.min(Math.max(posLeft, pad), Math.max(maxLeft, pad));
    const top  = Math.min(Math.max(posTop, pad), Math.max(maxTop, pad));
    return { left, top };
  }

  function onDown(clientX, clientY) {
    isDragging = true;
    hud.classList.add('dragging');
    const rect = hud.getBoundingClientRect();
    startX = clientX;
    startY = clientY;
    startLeft = rect.left;
    startTop = rect.top;
    document.body.style.userSelect = 'none';
  }

  function onMove(clientX, clientY) {
    if (!isDragging) return;
    const dx = clientX - startX;
    const dy = clientY - startY;
    let newLeft = startLeft + dx;
    let newTop  = startTop + dy;
    const clamped = clamp(newLeft, newTop);
    hud.style.left = clamped.left + 'px';
    hud.style.top  = clamped.top + 'px';
    hud.style.right = 'auto';
  }

  function onUp() {
    if (!isDragging) return;
    isDragging = false;
    hud.classList.remove('dragging');
    document.body.style.userSelect = '';
    const left = hud.style.left || (hud.getBoundingClientRect().left + 'px');
    const top  = hud.style.top  || (hud.getBoundingClientRect().top + 'px');
    localStorage.setItem('cyberx_hud_pos', JSON.stringify({ left, top }));
  }

  // Mouse events
  hud.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    onDown(e.clientX, e.clientY);
    const onMouseMove = (ev) => onMove(ev.clientX, ev.clientY);
    const onMouseUp = () => {
      onUp();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  // Touch events
  hud.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    onDown(t.clientX, t.clientY);
    const onTouchMove = (ev) => {
      const tt = ev.touches[0];
      onMove(tt.clientX, tt.clientY);
    };
    const onTouchEnd = () => {
      onUp();
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  });

  // keep HUD inside view on window resize
  window.addEventListener('resize', () => {
    const rect = hud.getBoundingClientRect();
    const clamped = clamp(rect.left, rect.top);
    hud.style.left = clamped.left + 'px';
    hud.style.top = clamped.top + 'px';
    localStorage.setItem('cyberx_hud_pos', JSON.stringify({ left: hud.style.left, top: hud.style.top }));
  });

})();

// End of script
