// js/spiral.js

const cvs = document.getElementById('bgCanvas');
const ctx = cvs.getContext('2d');

function fit() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const { clientWidth: w, clientHeight: h } = cvs;
  cvs.width = Math.floor(w * dpr);
  cvs.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}
fit();
addEventListener('resize', fit);

// espiral
let time = 0;
const CURVES = 18;
const STEPS  = 1000;
const basePhase = Math.PI/2;
const aFreq = 1;
const bFreq = 1;


const mouseTarget = { x: 0, y: 0 };
const mouse = { x: 0, y: 0 };
let isPointerDown = false;

// mouse
function onPointer(e){
  const rect = cvs.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top  + rect.height/2;
  const p = e.touches?.[0] ?? e;
  const px = p.clientX ?? cx;
  const py = p.clientY ?? cy;
  mouseTarget.x = (px - cx) / (rect.width/2);
  mouseTarget.y = (py - cy)  / (rect.height/2);
}
addEventListener('mousemove', onPointer, { passive:true });
addEventListener('touchmove', onPointer, { passive:true });
addEventListener('pointerdown', ()=> isPointerDown = true);
addEventListener('pointerup',   ()=> isPointerDown = false);

const lerp = (a,b,t)=> a + (b-a)*t;

function lissajous(t, ampX, ampY, phase, cx, cy){
  const x = cx + ampX * Math.sin(aFreq*t + phase);
  const y = cy + ampY * Math.sin(bFreq*t);
  return [x, y];
}

function noise(x){
  return Math.sin(x) * 0.5 + Math.sin(x*0.37)*0.3 + Math.sin(x*1.7)*0.2;
}

function draw(){
  const w = cvs.clientWidth;
  const h = cvs.clientHeight;
  ctx.clearRect(0,0,w,h);

  
  mouse.x = lerp(mouse.x, mouseTarget.x, 0.08);
  mouse.y = lerp(mouse.y, mouseTarget.y, 0.08);

  const baseRadius = Math.min(w, h) * 0.50;

  let centerX = w * 0.62;
  let centerY = h * 0.50;

  // movimiento espiral
  centerX += mouse.x * 32;
  centerY += mouse.y * 24;
  centerX += noise(time*0.002) * 28;
  centerY += noise(time*0.0014 + 10) * 22;

  const attractX = centerX + mouse.x * 120;
  const attractY = centerY + mouse.y * 90;

  const autoRot   = time * 0.0017; 
  const mouseRot  = mouse.x * 0.25;
  const wobbleRot = Math.sin(time*0.0025)*0.14;
  const rot = autoRot + mouseRot + wobbleRot;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rot);
  ctx.translate(-centerX, -centerY);

  for (let i=0; i<CURVES; i++){
    const k = (i - (CURVES-1)/2) / CURVES;

    const wave = noise(time*0.003 + i*0.9) * 24;

    const ampX = (baseRadius + wave) * (1 + 0.025*k);
    const ampY = (baseRadius + wave) * (1 - 0.025*k) * (1 + mouse.y*0.15);

    const phase = basePhase
      + i*0.12
      + mouse.x*0.6
      + Math.sin(time*0.004 + i*0.35)*0.09;

    // grosores
    const thickness = 1.4 + Math.abs(Math.sin(i*0.8 + time*0.006))*2.6;

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(209,21,36,0.05)';
    ctx.lineWidth = thickness;

    for (let s=0; s<=STEPS; s++){
      const tt = (s/STEPS) * Math.PI * 2;
      let [x,y] = lissajous(tt, ampX, ampY, phase, centerX, centerY);

      const vx = attractX - x;
      const vy = attractY - y;
      const dist = Math.hypot(vx, vy) || 1;

      const falloff = 1 - Math.min(dist / (baseRadius*2), 1);
      const attractStrength = 14 * falloff; 

      const jitter = 0.3 + 0.7*Math.abs(noise(time*0.004 + i*0.6 + tt*3));

      x += (vx/dist) * attractStrength * jitter;
      y += (vy/dist) * attractStrength * jitter;

      if (s===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }

    ctx.closePath();
    ctx.stroke();
  }

  ctx.restore();

  time += isPointerDown ? 1.4 : 1.1;
  requestAnimationFrame(draw);
}

draw();
