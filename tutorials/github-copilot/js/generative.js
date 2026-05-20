(() => {
  const canvas = document.getElementById('genCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let particles = [];

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function spawn(x,y,dx=0,dy=0){
    particles.push({x,y,vx:dx*0.3+(Math.random()-0.5)*4,vy:dy*0.3+(Math.random()-0.5)*4,life:1,size:6+Math.random()*24,hue:Math.random()*360,decay:0.01+Math.random()*0.03});
  }

  let last = null;
  function pointer(e){
    const t = e.touches?e.touches[0]:e;
    return {x:t.clientX,y:t.clientY};
  }

  function move(e){
    const p = pointer(e);
    if(last){
      const dx = p.x-last.x, dy = p.y-last.y, dist = Math.hypot(dx,dy);
      const count = Math.min(8, Math.max(1, Math.floor(dist/6)));
      for(let i=0;i<count;i++) spawn(p.x+(Math.random()-0.5)*12,p.y+(Math.random()-0.5)*12,dx*(0.3+Math.random()*0.7),dy*(0.3+Math.random()*0.7));
    } else spawn(p.x,p.y);
    last = p;
    e.preventDefault && e.preventDefault();
  }

  canvas.addEventListener('mousemove', move);
  canvas.addEventListener('touchmove', move, {passive:false});
  canvas.addEventListener('mouseleave', ()=> last=null);
  canvas.addEventListener('touchend', ()=> last=null);

  function draw(p){
    const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size);
    g.addColorStop(0, `hsla(${p.hue},90%,60%,${Math.min(1,p.life)})`);
    g.addColorStop(0.6, `hsla(${p.hue},80%,50%,${0.35*p.life})`);
    g.addColorStop(1, `hsla(${p.hue},80%,40%,0)`);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g;
    ctx.fillRect(p.x-p.size,p.y-p.size,p.size*2,p.size*2);
    ctx.globalCompositeOperation = 'source-over';
  }

  function loop(){
    // trail fade
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0,0,canvas.width/dpr,canvas.height/dpr);
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vx*=0.99; p.vy*=0.99; p.life -= p.decay; p.size *= 0.995;
      if(p.life<=0||p.size<0.5) particles.splice(i,1); else draw(p);
    }
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  ctx.fillStyle='black'; ctx.fillRect(0,0,canvas.width/dpr,canvas.height/dpr);
  requestAnimationFrame(loop);
})();
