/* HUMAN RETURN ENGINE — FINAL HARD FIX */

let audioCtx = null;
let master = null;
let nodes = [];
let timers = [];
let running = false;
let currentProtocol = "breakbeats";
let currentRoute = "mellow";

const protocols = ["breakbeats", "hyperpop", "synthpop", "driftphonk", "darkwave", "ambient"];

function $(id){ return document.getElementById(id); }

function forceClickable(){
  document.querySelectorAll("button,.protocol,.hero-actions,.protocol-grid,.calibration-grid").forEach(el=>{
    el.style.pointerEvents = "auto";
    el.style.position = "relative";
    el.style.zIndex = "9999";
  });
  document.querySelectorAll("canvas,#heroCanvas").forEach(el=>{
    el.style.pointerEvents = "none";
  });
}

function ctx(){
  if(!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = 0.7;
    master.connect(audioCtx.destination);
  }
  if(audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function stopAll(){
  timers.forEach(clearInterval);
  timers = [];
  nodes.forEach(n=>{
    try{ n.stop && n.stop(); }catch(e){}
    try{ n.disconnect && n.disconnect(); }catch(e){}
  });
  nodes = [];
}

function tone(freq, type="sine", gain=0.08, dur=0.2){
  ctx();
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, audioCtx.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);

  osc.connect(g);
  g.connect(master);

  osc.start();
  osc.stop(audioCtx.currentTime + dur + 0.03);

  nodes.push(osc,g);
}

function drone(freqs, gain=0.06, type="sine"){
  ctx();
  freqs.forEach((f,i)=>{
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();

    osc.type = i % 2 ? "triangle" : type;
    osc.frequency.value = f;
    g.gain.value = gain;

    osc.connect(g);
    g.connect(master);

    osc.start();
    nodes.push(osc,g);
  });
}

function playProtocol(key){
  stopAll();
  currentProtocol = key;
  setUI(key);

  if(key === "breakbeats"){
    let s = 0;
    timers.push(setInterval(()=>{
      s++;
      tone(s % 4 === 0 ? 90 : 145, "sine", 0.14, 0.08);
      if(s % 3 === 0) tone(427, "triangle", 0.04, 0.06);
      if(s % 5 === 0) tone(1280, "square", 0.03, 0.04);
    },145));
  }

  if(key === "hyperpop"){
    timers.push(setInterval(()=>{
      const arr = [427,640,724,854,1280,1448];
      tone(arr[Math.floor(Math.random()*arr.length)], "square", 0.05, 0.07);
    },105));
  }

  if(key === "synthpop"){
    drone([427,540,640,724],0.045,"triangle");
    timers.push(setInterval(()=>{
      const arr = [427,480,540,640];
      tone(arr[Math.floor(Math.random()*arr.length)],"triangle",0.04,0.35);
    },520));
  }

  if(key === "driftphonk"){
    drone([53.375,106.75,427],0.075,"sine");
    timers.push(setInterval(()=>{
      tone(80,"sine",0.12,0.12);
    },420));
  }

  if(key === "darkwave"){
    drone([106.75,213.5,320,427],0.045,"sawtooth");
    timers.push(setInterval(()=>{
      tone(106.75,"sawtooth",0.04,0.55);
    },820));
  }

  if(key === "ambient"){
    drone([106.75,213.5,currentRoute === "stallion" ? 724 : 427],0.055,"sine");
  }
}

function playAnchor(type){
  stopAll();

  if(type === "724"){
    drone([724,1448,1086,181],0.055,"triangle");
    timers.push(setInterval(()=>{
      tone(724,"triangle",0.035,0.09);
    },360));
    if($("orbText")) $("orbText").innerText = "724Hz";
  } else {
    drone([427,213.5,106.75],0.075,"sine");
    timers.push(setInterval(()=>{
      tone(106.75,"sine",0.035,0.18);
    },900));
    if($("orbText")) $("orbText").innerText = "427Hz";
  }
}

function setUI(key){
  document.querySelectorAll(".protocol").forEach(el=>{
    el.classList.toggle("active", el.dataset.protocol === key);
  });

  const titleMap = {
    breakbeats:"Breakbeats",
    hyperpop:"Hyperpop",
    synthpop:"Synthpop",
    driftphonk:"Drift Phonk",
    darkwave:"Darkwave",
    ambient:"Ambient Techno"
  };

  if($("protocolTitle")) $("protocolTitle").innerText = titleMap[key];
  if($("miniProtocol")) $("miniProtocol").innerText = titleMap[key];
  if($("orbText")) $("orbText").innerText = titleMap[key].toUpperCase();

  document.querySelectorAll(".route span").forEach(s=>{
    s.classList.toggle("active-step", s.innerText.trim() === titleMap[key]);
  });
}

function simulate(){
  const next = protocols[Math.floor(Math.random()*protocols.length)];
  playProtocol(next);

  if($("stateName")) $("stateName").innerText = "Simulated → " + next;
  if($("miniState")) $("miniState").innerText = next;
}

function bindHard(){
  forceClickable();

  document.addEventListener("pointerdown", e=>{
    const protocol = e.target.closest(".protocol");
    if(protocol && protocol.dataset.protocol){
      e.preventDefault();
      ctx();
      playProtocol(protocol.dataset.protocol);
      return;
    }

    if(e.target.closest("#startEngine")){
      e.preventDefault();
      ctx();
      running = true;
      playProtocol(currentProtocol);
      return;
    }

    if(e.target.closest("#simulateOnce")){
      e.preventDefault();
      ctx();
      simulate();
      return;
    }

    if(e.target.closest("#stopEngine")){
      e.preventDefault();
      running = false;
      stopAll();
      return;
    }

    if(e.target.closest("#play427")){
      e.preventDefault();
      ctx();
      playAnchor("427");
      return;
    }

    if(e.target.closest("#play724")){
      e.preventDefault();
      ctx();
      playAnchor("724");
      return;
    }

    if(e.target.closest("#mellowMode")){
      e.preventDefault();
      currentRoute = "mellow";
      if($("modeLabel")) $("modeLabel").innerText = "Mellow · 427Hz";
      tone(427,"sine",0.04,0.2);
      return;
    }

    if(e.target.closest("#stallionMode")){
      e.preventDefault();
      currentRoute = "stallion";
      if($("modeLabel")) $("modeLabel").innerText = "Stallion · 724Hz";
      tone(724,"triangle",0.04,0.2);
      return;
    }

    if(e.target.closest("#playProtocol")){
      e.preventDefault();
      ctx();
      playProtocol(currentProtocol);
      return;
    }

    if(e.target.closest("#stopProtocol")){
      e.preventDefault();
      stopAll();
      return;
    }
  }, true);
}

function init(){
  bindHard();
  setUI("breakbeats");
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", init);
}else{
  init();
}
