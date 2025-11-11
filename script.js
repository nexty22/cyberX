const $ = id => document.getElementById(id);

/* ---------- Particles ---------- */
const canvas = $('particles'), ctx = canvas.getContext('2d');
function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); window.addEventListener('resize', resize);
let p=[]; for(let i=0;i<120;i++){ p.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,s:Math.random()*2+0.6}); }
function draw(){ ctx.clearRect(0,0,innerWidth,innerHeight); p.forEach(o=>{ o.x+=o.vx;o.y+=o.vy; if(o.x<0||o.x>innerWidth)o.vx*=-1; if(o.y<0||o.y>innerHeight)o.vy*=-1; ctx.beginPath(); ctx.fillStyle="rgba(123,47,247,.75)"; ctx.arc(o.x,o.y,o.s,0,Math.PI*2); ctx.fill(); }); requestAnimationFrame(draw); }
draw();

/* ---------- Core elements ---------- */
const startBtn = $('startBtn'), bgMusic = $('bgMusic'), extraButtons = $('extraButtons'),
      toolsBtn = $('toolsBtn'), toolsBox = $('toolsBox'),
      visitorCount = $('visitorCount'), simToolTile = $('simToolTile'), aiToolTile=$('aiToolTile'),
      simToolBox = $('simToolBox'), aiToolBox=$('aiToolBox'), loaderOverlay=$('loaderOverlay'),
      contactBtn=$('contactBtn');

startBtn.addEventListener('click', ()=>{
  if(bgMusic.paused){
    bgMusic.play().catch(()=>{});
    startBtn.textContent = '⏸ Pause Music';
    extraButtons.classList.add('show');
    toolsBox.classList.remove('show'); // initially closed
  } else {
    bgMusic.pause();
    startBtn.textContent = '🚀 Start Experience';
  }
});

/* ---------- Tools button toggle ---------- */
toolsBtn.addEventListener('click', ()=> toolsBox.classList.toggle('show'));

/* ---------- Visitors Count ---------- */
(function(){
  try{
    const key = 'cyberx_visits_v2';
    const val = Number(localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, val);
    visitorCount.innerText = val.toLocaleString();
  }catch(e){ visitorCount.innerText='--'; }
})();

/* ---------- SIM Tool ---------- */
simToolTile.addEventListener('click', ()=>{
  if(simToolBox.innerHTML===""){
    simToolBox.style.display='block';
    simToolBox.innerHTML=simUI();
    bindSim();
  } else simToolBox.style.display = simToolBox.style.display==='none'?'block':'none';
});

function simUI(){
  return `
    <div class="sim-tool-wrap">
      <div class="lookup-card">
        <div class="search-type">
          <label class="search-option"><input type="radio" name="t" value="sim" checked> SIM</label>
          <label class="search-option"><input type="radio" name="t" value="cnic"> CNIC</label>
        </div>
        <div class="input-group">
          <input id="q" type="text" placeholder="Enter SIM or CNIC">
          <button id="go" class="lookup">Search</button>
        </div>
        <div class="examples">
          <button class="example-btn" data-v="03338570120" data-t="sim">03338570120</button>
          <button class="example-btn" data-v="3240214025071" data-t="cnic">3240214025071</button>
        </div>
        <div id="res"></div>
      </div>
    </div>
  `;
}

function bindSim(){
  const q=$('q'), go=$('go'), res=$('res');
  document.querySelectorAll('.example-btn').forEach(b=>{b.onclick=()=>{q.value=b.dataset.v; document.querySelector(`input[name="t"][value="${b.dataset.t}"]`).checked=true; go.click();}});
  go.onclick=async()=>{
    const val=q.value.trim(), type=document.querySelector('input[name="t"]:checked').value;
    if(!val){ alert('Enter value'); return; }
    loaderOverlay.style.display='flex'; res.innerHTML='';
    try{
      const r=await fetch(`/api/simlookup?number=${encodeURIComponent(val)}`);
      const json=await r.json();
      loaderOverlay.style.display='none';
      showSim(json,res,val,type);
    }catch(e){ loaderOverlay.style.display='none'; res.innerHTML='Error'; }
  };
}

function showSim(d,res,val,type){
  if(!d||!d.success){ res.innerHTML=`<div class="no-data">No Data found for ${val}</div>`; return; }
  let h=`<div class="result-card"><div class="result-row"><strong>${type.toUpperCase()}: ${val}</strong></div></div>`;
  d.data.forEach(x=>{h+=`<div class="result-card"><div class="info-grid"><div class="info-card"><div class="info-label">SIM</div><div class="info-value">${x.number||'N/A'}</div></div><div class="info-card"><div class="info-label">CNIC</div><div class="info-value">${x.cnic||'N/A'}</div></div><div class="info-card"><div class="info-label">Operator</div><div class="info-value">${x.operator||'N/A'}</div></div><div class="info-card"><div class="info-label">Address</div><div class="info-value">${x.address||'N/A'}</div></div></div></div>`;});
  res.innerHTML=h;
}

/* ---------- AI Image Generator ---------- */
aiToolTile.addEventListener('click', ()=>{
  if(aiToolBox.innerHTML===""){
    aiToolBox.style.display='block';
    aiToolBox.innerHTML=aiUI();
    bindAI();
  } else aiToolBox.style.display = aiToolBox.style.display==='none'?'block':'none';
});

function aiUI(){
  return `
    <div class="sim-tool-wrap">
      <div class="lookup-card">
        <input id="aiPrompt" type="text" placeholder="Describe your image..." style="width:100%;margin-bottom:8px;padding:12px;border:2px solid #ccc;border-radius:8px">
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
          <button id="aiGenerate" class="lookup">Generate</button>
          <button id="aiClose" class="lookup" style="background:#b21f1f">Close</button>
        </div>
        <div id="aiCredit" class="ai-credit">Powered by Nexty OFC</div>
        <div id="aiResults"></div>
      </div>
    </div>
  `;
}

function bindAI(){
  const prompt=$('aiPrompt'), gen=$('aiGenerate'), close=$('aiClose'), results=$('aiResults'), credit=$('aiCredit');
  gen.onclick=async()=>{
    const p=prompt.value.trim();
    if(!p){ alert('Enter prompt'); return; }
    loaderOverlay.style.display='flex'; results.innerHTML='';
    try{
      const r=await fetch(`https://famofc.site/api/generate.php?prompt=${encodeURIComponent(p)}`);
      const json=await r.json();
      loaderOverlay.style.display='none';
      if(!json.success){ results.innerHTML='Error generating image'; return; }
      results.innerHTML='';
      json.images.forEach(img=>{
        const div=document.createElement('div'); div.className='ai-img-card';
        const image=document.createElement('img'); image.src=img.image_url;
        const btn=document.createElement('button'); btn.textContent='Download'; btn.className='download-btn';
        btn.onclick=()=>{ const a=document.createElement('a'); a.href=img.image_url; a.download='nexty.png'; a.click(); };
        div.appendChild(image); div.appendChild(btn); results.appendChild(div);
      });
    }catch(e){ loaderOverlay.style.display='none'; results.innerHTML='Error'; console.error(e); }
  };
  close.onclick=()=>{aiToolBox.style.display='none';};
                             }
