// SAME JS EXACT WORKING — not changed logic

const $ = id => document.getElementById(id);

const canvas = $('particles'), ctx = canvas.getContext('2d');
function resize(){ canvas.width=innerWidth; canvas.height=innerHeight }
resize(); addEventListener('resize',resize);

let p=[]; for(let i=0;i<100;i++){ p.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,s:Math.random()*2+0.6}); }
function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  p.forEach(o=>{o.x+=o.vx;o.y+=o.vy;if(o.x<0||o.x>innerWidth)o.vx*=-1;if(o.y<0||o.y>innerHeight)o.vy*=-1;
    ctx.beginPath();ctx.fillStyle="rgba(123,47,247,.75)";ctx.arc(o.x,o.y,o.s,0,Math.PI*2);ctx.fill();});
  requestAnimationFrame(draw);
} draw();

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

$('simToolTile').onclick=()=>{
  const box=$('simToolBox');
  if(box.innerHTML===""){ box.style.display="block"; box.innerHTML=simUI(); bindSim(); }
  else{ box.style.display="none"; box.innerHTML=""; }
};

function simUI(){return `
<div class="sim-tool-wrap">
  <div class="lookup-card">
    <div class="search-type">
      <label class="search-option"><input type="radio" name="t" value="sim" checked> SIM</label>
      <label class="search-option"><input type="radio" name="t" value="cnic"> CNIC</label>
    </div>
    <div class="input-group">
      <input id="q" type="text">
      <button id="go" class="lookup">Search</button>
    </div>
    <div class="examples">
      <button class="example-btn" data-v="03338570120" data-t="sim">03338570120</button>
      <button class="example-btn" data-v="3240214025071" data-t="cnic">3240214025071</button>
    </div>
    <div id="load" style="display:none">⏳ Searching...</div>
    <div id="res"></div>
  </div>
</div>`;}

function bindSim(){
  const q=$('q'), go=$('go'), load=$('load'), res=$('res');
  document.querySelectorAll('.example-btn').forEach(b=>b.onclick=()=>{q.value=b.dataset.v; go.click()});
  go.onclick=()=>{
    const val=q.value.trim(), type=document.querySelector('input[name="t"]:checked').value;
    if(!val)return alert("Enter value");
    load.style.display="block"; res.innerHTML="";
    fetch(API+val).then(r=>r.json()).then(d=>show(d,res,val,type)).catch(()=>res.innerHTML="<div class=no-data>Error</div>").finally(()=>load.style.display="none");
  };
}

function show(d,res,val,type){
  if(!d.success){res.innerHTML="<div class=no-data>No Data</div>";return;}
  let h=`<div class=result-card><strong>${type}:${val}</strong></div>`;
  d.data.forEach(x=>{h+=`<div class=result-card><b>${x.number||""}</b><br>${x.name||""}<br>${x.cnic||""}<br>${x.address||""}</div>`});
  res.innerHTML=h;
}
