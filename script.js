// 🌌 Particle Background
const canvas=document.getElementById('particles');
const ctx=canvas.getContext('2d');
function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}
resize();window.addEventListener('resize',resize);
let particles=[];
for(let i=0;i<80;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    s:Math.random()*2+0.8,
    vx:(Math.random()-.5)*.5,
    vy:(Math.random()-.5)*.5
  });
}
function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const p of particles){
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>canvas.width)p.vx*=-1;
    if(p.y<0||p.y>canvas.height)p.vy*=-1;
    ctx.fillStyle='rgba(123,47,247,0.7)';
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.s,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(animate);
}
animate();

// 🎵 Buttons and Functions
const startBtn=document.getElementById('startBtn');
const bgMusic=document.getElementById('bgMusic');
const extraButtons=document.getElementById('extraButtons');
const toolsBtn=document.getElementById('toolsBtn');
const toolsBox=document.getElementById('toolsBox');
const contactModal=document.getElementById('contactModal');

// Start / Pause
startBtn.addEventListener('click',()=>{
  if(bgMusic.paused){
    bgMusic.play();
    startBtn.innerHTML='⏸ Pause Music';
    extraButtons.classList.add('show');
  }else{
    bgMusic.pause();
    startBtn.innerHTML='🚀 Start Experience';
  }
});

// Tools toggle
toolsBtn.addEventListener('click',()=>{
  toolsBox.classList.toggle('show');
});

// Contact modal open/close
function showContact(){contactModal.style.display='flex';}
function closeContact(){contactModal.style.display='none';}

// 👁 Visitor counter
async function updateVisitorCount(){
  const span=document.getElementById('visitorCount');
  try{
    const res=await fetch('https://api.countapi.xyz/hit/cyberx/visits');
    const data=await res.json();
    span.textContent=data.value.toLocaleString();
  }catch(e){
    const key='cyberx_local_visits';
    const v=Number(localStorage.getItem(key)||0)+1;
    localStorage.setItem(key,v);
    span.textContent=v.toLocaleString();
  }
}
updateVisitorCount();
