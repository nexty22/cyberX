const $ = id => document.getElementById(id);

const canvas = $('particles'), ctx = canvas.getContext('2d');
function resize(){ canvas.width=innerWidth; canvas.height=innerHeight }
resize(); addEventListener('resize',resize);

let p=[]; for(let i=0;i<100;i++){ p.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,s:Math.random()*2+0.6}); }
(function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  p.forEach(o=>{o.x+=o.vx;o.y+=o.vy;if(o.x<0||o.x>innerWidth)o.vx*=-1;if(o.y<0||o.y>innerHeight)o.vy*=-1;
    ctx.beginPath();ctx.fillStyle="rgba(123,47,247,.75)";ctx.arc(o.x,o.y,o.s,0,Math.PI*2);ctx.fill();});
  requestAnimationFrame(draw);
})();

let music = $('bgMusic'), pos=0;
$('startBtn').onclick=()=>{
  if(music.paused){music.currentTime=pos;music.play();$('startBtn').innerText="⏸ Pause Music";$('extraButtons').classList.add('show')}
  else{pos=music.currentTime;music.pause();$('startBtn').innerText="🚀 Start Experience"}
}

$('toolsBtn').onclick=()=> $('toolsBox').classList.toggle('show');

function showContact(){ $('contactModal').style.display='flex'; }
function closeContact(){ $('contactModal').style.display='none'; }

(function(){ try{let c=+localStorage.cx||0;c++;localStorage.cx=c;$('visitorCount').innerText=c;}catch(e){} })();

const API = "https://fam-official.serv00.net/api/famofc_simdatabase.php?number=";

$('simToolTile').onclick=()=>{ $('simToolBox').innerHTML=simUI(); bindSim(); };

function simUI(){return `
<input id="q" style="width:90%;padding:10px;border-radius:12px;margin-top:10px;">
<button id="go" class="btn" style="margin-top:10px">Search</button>
<div id="loader">⏳ Loading...</div>
<div id="res" style="margin-top:12px"></div>`;}

function bindSim(){
  const q=$('q'), go=$('go'), load=$('loader'), res=$('res');
  go.onclick=()=>{
    if(!q.value.trim()) return alert("Enter Number");
    load.style.display="block"; res.innerHTML="";
    fetch(API+q.value.trim()).then(r=>r.json()).then(d=>show(d,res)).finally(()=>load.style.display="none");
  }
}

function show(d,res){
  if(!d.success){res.innerHTML="<div>No Data Found</div>";return;}
  let html="<div style='display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));'>";
  d.data.forEach(x=>{
    html+=`<div class="card">
      <div style="font-size:1.3rem;color:#00eaff">${x.number}</div>
      <div style="margin-top:4px;font-weight:600;color:#ff7b7b">${x.name}</div>
      <div style="margin-top:8px;font-size:.9rem"><b>CNIC:</b> ${x.cnic}<br><b>Address:</b> ${x.address}</div>
    </div>`;
  });
  html+="</div>"; res.innerHTML=html;
}
