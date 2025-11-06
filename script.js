// script.js
// SAME JS EXACT WORKING — not changed logic but integrated with UI and loader + admin login

const $ = id => document.getElementById(id);

/* ---------- Particles ---------- */
const canvas = $('particles'), ctx = canvas.getContext('2d');
function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); window.addEventListener('resize', resize);
let p=[]; for(let i=0;i<120;i++){ p.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,s:Math.random()*2+0.6}); }
function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  p.forEach(o=>{
    o.x+=o.vx; o.y+=o.vy;
    if(o.x<0||o.x>innerWidth) o.vx*=-1;
    if(o.y<0||o.y>innerHeight) o.vy*=-1;
    ctx.beginPath();
    ctx.fillStyle="rgba(123,47,247,.75)";
    ctx.arc(o.x,o.y,o.s,0,Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
draw();

/* ---------- Core elements ---------- */
const startBtn = $('startBtn'), bgMusic = $('bgMusic'), extraButtons = $('extraButtons'),
      toolsBtn = $('toolsBtn'), toolsBox = $('toolsBox'),
      visitorCount = $('visitorCount'), simToolTile = $('simToolTile'),
      simToolBox = $('simToolBox'), loaderOverlay = $('loaderOverlay'),
      contactBtn = $('contactBtn'), contactModal = $('contactModal'), closeContactBtn = $('closeContactBtn');

/* ---------- Start experience (music + reveal) ---------- */
let musicPos = 0;
startBtn.addEventListener('click', ()=>{
  if(bgMusic.paused){
    bgMusic.currentTime = musicPos;
    bgMusic.play().catch(()=>{});
    startBtn.textContent = '⏸ Pause Music';
    extraButtons.classList.add('show');
    // show tools box small animation
    setTimeout(()=>{ toolsBox.classList.add('show'); }, 200);
  } else {
    musicPos = bgMusic.currentTime;
    bgMusic.pause();
    startBtn.textContent = '🚀 Start Experience';
  }
});

/* ---------- Tools button toggle ---------- */
toolsBtn.addEventListener('click', ()=> toolsBox.classList.toggle('show'));

/* ---------- Contact modal ---------- */
contactBtn.addEventListener('click', ()=> contactModal.style.display = 'flex');
closeContactBtn.addEventListener('click', ()=> contactModal.style.display = 'none');
contactModal.addEventListener('click', e => { if(e.target===contactModal) contactModal.style.display='none'; });

/* ---------- Visitors Count (local) ---------- */
(function(){
  try{
    const key = 'cyberx_visits_v2';
    const val = Number(localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, val);
    visitorCount.innerText = val.toLocaleString();
    const adminVisitors = document.getElementById('adminVisitors');
    if(adminVisitors) adminVisitors.innerText = val.toLocaleString();
  }catch(e){
    visitorCount.innerText = '--';
  }
})();

/* ---------- API (proxy on vercel) ---------- */
const API = "/api/simlookup?number=";

/* ---------- SIM tile click behavior (show/hide sim UI) ---------- */
simToolTile.addEventListener('click', ()=>{
  const box = simToolBox;
  if(box.innerHTML === ""){
    box.style.display = "block";
    box.innerHTML = simUI();
    bindSim();
  } else {
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  }
});

/* ---------- Build SIM UI HTML ---------- */
function simUI(){
  return `
    <div class="sim-tool-wrap">
      <div class="lookup-card">
        <div class="search-type">
          <label class="search-option"><input type="radio" name="t" value="sim" checked> SIM</label>
          <label class="search-option"><input type="radio" name="t" value="cnic"> CNIC</label>
        </div>
        <div class="input-group">
          <input id="q" type="text" placeholder="Enter SIM or CNIC (demo)">
          <button id="go" class="lookup">Search</button>
        </div>
        <div class="examples">
          <button class="example-btn" data-v="03338570120" data-t="sim">03338570120</button>
          <button class="example-btn" data-v="3240214025071" data-t="cnic">3240214025071</button>
          <button class="example-btn" data-v="03321756120" data-t="sim">03321756120</button>
        </div>
        <div id="res"></div>
      </div>
    </div>
  `;
}

/* ---------- Bind events for SIM UI ---------- */
function bindSim(){
  const q = document.getElementById('q');
  const go = document.getElementById('go');
  const res = document.getElementById('res');
  document.querySelectorAll('.example-btn').forEach(b=>{
    b.onclick = ()=>{ q.value = b.dataset.v; document.querySelector(`input[name="t"][value="${b.dataset.t}"]`).checked = true; go.click(); };
  });

  go.onclick = async ()=>{
    const val = q.value.trim();
    const type = document.querySelector('input[name="t"]:checked').value;
    if(!val){ alert("Enter value"); return; }

    // minimal validation like original logic
    if(type === 'sim' && !/^\d{10,12}$/.test(val)) {
      if(!confirm("SIM value doesn't look like 10-12 digits. Continue anyway?")) return;
    }
    if(type === 'cnic' && !/^\d{13}$/.test(val)) {
      if(!confirm("CNIC not 13 digits. Continue anyway?")) return;
    }

    // show loader overlay with fade animation for at least 500ms
    loaderOverlay.style.display = 'flex';
    const start = Date.now();
    res.innerHTML = '';

    try {
      const r = await fetch(API + encodeURIComponent(val));
      const json = await r.json();
      const elapsed = Date.now() - start;
      // ensure loader visible for at least 600ms for nice fade
      await new Promise(s=>setTimeout(s, Math.max(0, 600 - elapsed)));
      loaderOverlay.style.display = 'none';
      show(json, res, val, type);
      // store search in local log (for admin)
      try{
        const log = JSON.parse(localStorage.getItem('cyberx_search_log')||'[]');
        log.unshift({when:new Date().toISOString(), type, value:val, ok:!!json.success});
        localStorage.setItem('cyberx_search_log', JSON.stringify(log.slice(0,200)));
      }catch(e){}
    } catch(err){
      loaderOverlay.style.display = 'none';
      res.innerHTML = `<div class="no-data">Error fetching data. Try again later.</div>`;
      console.error(err);
    }
  };
}

/* ---------- Render results (keeps similar format to your original) ---------- */
function show(d, res, val, type){
  if(!d || !d.success){
    res.innerHTML = `<div class="no-data">No Data found for ${val}</div>`;
    return;
  }

  let h = `<div class="result-card"><div class="result-row"><div><strong>${type.toUpperCase()}: ${val}</strong></div><div style="font-weight:700;color:#b21f1f">${d.data?.length||1} result(s)</div></div></div>`;
  d.data.forEach(x=>{
    h += `<div class="result-card">
            <div style="font-weight:800;font-size:1.05rem;margin-bottom:6px">${x.name||'N/A'}</div>
            <div class="info-grid">
              <div class="info-card"><div class="info-label">SIM</div><div class="info-value">${x.number||'N/A'}</div></div>
              <div class="info-card"><div class="info-label">CNIC</div><div class="info-value">${x.cnic||'N/A'}</div></div>
              <div class="info-card"><div class="info-label">Operator</div><div class="info-value">${x.operator||'N/A'}</div></div>
              <div class="info-card"><div class="info-label">Address</div><div class="info-value">${x.address||'N/A'}</div></div>
            </div>
          </div>`;
  });

  // credit if present
  if(d.credit) h += `<div style="text-align:center;color:#cfc;margin-top:8px">Info by: ${d.credit}</div>`;
  res.innerHTML = h;
}

/* ---------- Admin login panel (client-side) ---------- */
const loginModal = $('loginModal'), loginSubmit = $('loginSubmit'), loginCancel = $('loginCancel'),
      loginUser = $('loginUser'), loginPass = $('loginPass'), adminPanel = $('adminPanel'), logoutBtn = $('logoutBtn');

function showLogin(){ loginModal.style.display='flex'; }
function closeLogin(){ loginModal.style.display='none'; }

loginCancel.addEventListener('click', ()=> { closeLogin(); });
loginSubmit.addEventListener('click', ()=>{
  const u = loginUser.value.trim(), p = loginPass.value.trim();
  if(u==='nexty' && p==='ofcnexty'){
    sessionStorage.setItem('cx_admin','1');
    closeLogin();
    showAdmin();
  } else {
    alert('Invalid credentials');
  }
});

function showAdmin(){
  if(sessionStorage.getItem('cx_admin')){
    adminPanel.style.display='block';
    const v = localStorage.getItem('cyberx_visits_v2') || '--';
    document.getElementById('adminVisitors').innerText = v;
  } else adminPanel.style.display='none';
}
logoutBtn && logoutBtn.addEventListener('click', ()=>{
  sessionStorage.removeItem('cx_admin');
  adminPanel.style.display='none';
});

/* quick admin open via double-click on visitor box */
document.querySelector('.visitor-box').addEventListener('dblclick', ()=> {
  if(sessionStorage.getItem('cx_admin')) showAdmin();
  else showLogin();
});

/* init admin if already logged in */
showAdmin();

/* ---------- small helper: close modals on ESC ---------- */
document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){ contactModal.style.display='none'; loginModal.style.display='none'; }
});
