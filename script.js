// ================= Loader =================
let progress = 0;
const loader = document.getElementById('loader');
const progressText = document.getElementById('progress');
const loaderInterval = setInterval(() => {
  progress += 2;
  if (progress >= 100) {
    progress = 100;
    progressText.innerText = '100%';
    clearInterval(loaderInterval);
    loader.style.transition = 'opacity 0.8s, transform 0.8s';
    loader.style.opacity = '0';
    loader.style.transform = 'scale(1.05)';
    setTimeout(() => loader.style.display = 'none', 800);
  } else {
    progressText.innerText = progress + '%';
  }
}, 100);

// =============== Dark/Light Mode ===============
function toggleMode() {
  document.body.classList.toggle('light-mode');
  const modeStatus = document.getElementById('modeStatus');
  if (modeStatus) modeStatus.innerText = document.body.classList.contains('light-mode') ? 'Light' : 'Dark';
}

// =============== Contact Modal ===============
const modal = document.getElementById('contactModal');
function showModal(){ modal.classList.add('show'); }
function closeModal(){ modal.classList.remove('show'); }

// =============== Particle Background ===============
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];
for(let i=0;i<60;i++){
  particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,size:Math.random()*2+1,speedX:(Math.random()-0.5)*0.5,speedY:(Math.random()-0.5)*0.5});
}
function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let p of particles){
    p.x+=p.speedX;p.y+=p.speedY;
    if(p.x>canvas.width||p.x<0)p.speedX*=-1;
    if(p.y>canvas.height||p.y<0)p.speedY*=-1;
    ctx.fillStyle='rgba(123,47,247,0.7)';
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(animate);
}
animate();

// =============== Start Music ===============
const startBtn = document.getElementById('startBtn');
const bgMusic = document.getElementById('bgMusic');
startBtn.addEventListener('click',()=>{
  if(bgMusic.paused){bgMusic.play();startBtn.innerHTML='⏸ Pause Music';}
  else{bgMusic.pause();startBtn.innerHTML='🚀 Start Experience';}
});

// =============== HUD Logic + Dragging ===============
const hud=document.getElementById('cyberx-hud');
const modeStatus=document.getElementById('modeStatus');
const activeTool=document.getElementById('activeTool');
const toolCountEl=document.getElementById('toolCount');
function updateToolCount(){const cards=document.querySelectorAll('.tool-card');toolCountEl.innerText=cards.length?cards.length:5;}
updateToolCount();

// Make HUD draggable with persistence
(function enableHudDrag(){
  if(!hud)return;
  const saved=localStorage.getItem('cyberx_hud_pos');
  if(saved){try{const pos=JSON.parse(saved);hud.style.left=pos.left;hud.style.top=pos.top;hud.style.right='auto';}catch(e){}}
  let isDragging=false,startX=0,startY=0,startLeft=0,startTop=0;
  function clamp(l,t){const pad=8,w=hud.offsetWidth,h=hud.offsetHeight;return{
    left:Math.min(Math.max(l,pad),window.innerWidth-w-pad),
    top:Math.min(Math.max(t,pad),window.innerHeight-h-pad)
  };}
  function onDown(x,y){isDragging=true;hud.classList.add('dragging');const r=hud.getBoundingClientRect();startX=x;startY=y;startLeft=r.left;startTop=r.top;document.body.style.userSelect='none';}
  function onMove(x,y){if(!isDragging)return;const dx=x-startX,dy=y-startY;const c=clamp(startLeft+dx,startTop+dy);hud.style.left=c.left+'px';hud.style.top=c.top+'px';hud.style.right='auto';}
  function onUp(){if(!isDragging)return;isDragging=false;hud.classList.remove('dragging');document.body.style.userSelect='';localStorage.setItem('cyberx_hud_pos',JSON.stringify({left:hud.style.left,top:hud.style.top}));}
  hud.addEventListener('mousedown',e=>{if(e.button!==0)return;onDown(e.clientX,e.clientY);const mm=ev=>onMove(ev.clientX,ev.clientY);const mu=()=>{onUp();window.removeEventListener('mousemove',mm);window.removeEventListener('mouseup',mu);};window.addEventListener('mousemove',mm);window.addEventListener('mouseup',mu);});
  hud.addEventListener('touchstart',e=>{const t=e.touches[0];onDown(t.clientX,t.clientY);const tm=ev=>{const tt=ev.touches[0];onMove(tt.clientX,tt.clientY);};const te=()=>{onUp();window.removeEventListener('touchmove',tm);window.removeEventListener('touchend',te);};window.addEventListener('touchmove',tm,{passive:false});window.addEventListener('touchend',te);});
  window.addEventListener('resize',()=>{const r=hud.getBoundingClientRect();const c=clamp(r.left,r.top);hud.style.left=c.left+'px';hud.style.top=c.top+'px';localStorage.setItem('cyberx_hud_pos',JSON.stringify({left:hud.style.left,top:hud.style
