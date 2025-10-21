// Loader
let progress=0;
const loader=document.getElementById('loader');
const progressText=document.getElementById('progress');
let interval=setInterval(()=>{
  progress+=Math.random()*8+2;
  if(progress>=100){
    progress=100; clearInterval(interval);
    progressText.innerText='100%';
    loader.style.transition='opacity 0.8s, transform 0.8s';
    loader.style.opacity='0';
    loader.style.transform='scale(1.05)';
    setTimeout(()=>loader.style.display='none',800);
  } else {
    progressText.innerText=Math.floor(progress)+'%';
  }
},150);

// Dark/Light mode
function toggleMode(){document.body.classList.toggle('light-mode');}

// Modal
const modal=document.getElementById('contactModal');
function showModal(){modal.classList.add('show');}
function closeModal(){modal.classList.remove('show');}

// Particles
const canvas=document.getElementById('particles');
const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth; canvas.height=window.innerHeight;
let particles=[];
for(let i=0;i<60;i++){particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,size:Math.random()*2+1,speedX:(Math.random()-0.5)*0.5,speedY:(Math.random()-0.5)*0.5});}
function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let p of particles){
    p.x+=p.speedX; p.y+=p.speedY;
    if(p.x>canvas.width||p.x<0)p.speedX*=-1;
    if(p.y>canvas.height||p.y<0)p.speedY*=-1;
    ctx.fillStyle='rgba(123,47,247,0.7)'; ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
  }
  requestAnimationFrame(animate);
}
animate();

// Music Play/Pause
const startBtn = document.getElementById('startBtn');
const bgMusic = document.getElementById('bgMusic');

startBtn.addEventListener('click', () =>
