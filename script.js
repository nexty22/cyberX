function $(id){return document.getElementById(id);}
const startBtn=$('startBtn'),bgMusic=$('bgMusic'),extraButtons=$('extraButtons'),toolsBtn=$('toolsBtn'),toolsBox=$('toolsBox');

startBtn.onclick=()=>{
  if(bgMusic.paused){bgMusic.play();startBtn.innerHTML='⏸ Pause Music';extraButtons.classList.add('show');}
  else{bgMusic.pause();startBtn.innerHTML='🚀 Start Experience';}
};

toolsBtn.onclick=()=>{toolsBox.classList.toggle('show');};
function closeTools(){toolsBox.classList.remove('show');}

function showContact(){ $('contactModal').style.display='flex'; }
function closeContact(){ $('contactModal').style.display='none'; }

document.getElementById("simToolTile").onclick=function(){
  const modal=document.createElement("div");
  modal.className="modal-backdrop";
  modal.style.display="flex";
  modal.innerHTML=`<div class="modal" style="max-width:900px;width:100%">
      <h3>📱 SIM Database Lookup</h3>
      <iframe src="sim.html" style="width:100%;height:550px;border-radius:12px;border:none;"></iframe>
      <br><button class="btn" onclick="this.parentNode.parentNode.remove()">❌ Close</button>
  </div>`;
  document.body.appendChild(modal);
};
