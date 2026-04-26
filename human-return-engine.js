/* ================================
   HUMAN RETURN ENGINE · JS CORE
   ================================ */

const protocols = {
  breakbeats: {
    stage: "ENTRY PROTOCOL",
    title: "Breakbeats",
    desc: "Irregularity becomes safe.",
    descCN: "不规则变得安全。",
    bpm: "150–170",
    target: "Amygdala · DMN",
    exit: "Flexible activation"
  },
  hyperpop: {
    stage: "PEAK TRAVERSAL",
    title: "Hyperpop",
    desc: "Intensity is survivable.",
    descCN: "强度是可承受的。",
    bpm: "160–190",
    target: "Dopamine",
    exit: "Plateau"
  },
  synthpop: {
    stage: "FIRST BREATH",
    title: "Synthpop",
    desc: "Structure becomes rest.",
    descCN: "结构成为休息。",
    bpm: "95–125",
    target: "Narrative",
    exit: "Emotion stable"
  },
  driftphonk: {
    stage: "RE-ENTRY",
    title: "Drift Phonk",
    desc: "Return to now.",
    descCN: "回到当下。",
    bpm: "80–110",
    target: "Timeline",
    exit: "HRV stable"
  },
  darkwave: {
    stage: "SHADOW",
    title: "Darkwave",
    desc: "Go down safely.",
    descCN: "安全下潜。",
    bpm: "70–105",
    target: "Parasympathetic",
    exit: "EDA baseline"
  },
  ambient: {
    stage: "HOME",
    title: "Ambient",
    desc: "Rest and integrate.",
    descCN: "休息与整合。",
    bpm: "60–90",
    target: "Consolidation",
    exit: "Complete"
  }
};

let ctx;
let nodes = [];
let timers = [];
let running = false;

/* ================= AUDIO CORE ================= */

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function stopAll() {
  timers.forEach(clearInterval);
  timers = [];

  nodes.forEach(n => {
    try { n.stop(); } catch {}
  });
  nodes = [];
}

/* ================= SOUND TYPES ================= */

function tone(freq, type="sine", gainVal=0.05, dur=0.2){
  const c = getCtx();
  const o = c.createOscillator();
  const g = c.createGain();

  o.type = type;
  o.frequency.value = freq;

  g.gain.value = gainVal;

  o.connect(g);
  g.connect(c.destination);

  o.start();
  o.stop(c.currentTime + dur);

  nodes.push(o);
}

/* BREAKBEAT */
function playBreakbeat(){
  stopAll();

  timers.push(setInterval(()=>{
    tone(80 + Math.random()*200, "square", 0.1, 0.08);
    if(Math.random()>0.6) tone(427, "triangle", 0.03, 0.05);
  }, 140));
}

/* HYPERPOP */
function playHyperpop(){
  stopAll();

  timers.push(setInterval(()=>{
    const freqs=[427,640,724,1280];
    tone(freqs[Math.floor(Math.random()*freqs.length)], "sawtooth", 0.05, 0.07);
  },100));
}

/* SYNTHPOP */
function playSynthpop(){
  stopAll();

  timers.push(setInterval(()=>{
    tone(427, "triangle", 0.04, 0.4);
  },500));
}

/* DRIFT PHONK */
function playDrift(){
  stopAll();

  timers.push(setInterval(()=>{
    tone(60, "sine", 0.1, 0.2);
    tone(427, "triangle", 0.02, 0.1);
  },400));
}

/* DARKWAVE */
function playDarkwave(){
  stopAll();

  timers.push(setInterval(()=>{
    tone(100, "sawtooth", 0.03, 0.6);
  },800));
}

/* AMBIENT */
function playAmbient(){
  stopAll();

  tone(427, "sine", 0.03, 5);
}

/* ================= ENGINE ================= */

function runProtocol(name){
  if(name==="breakbeats") playBreakbeat();
  if(name==="hyperpop") playHyperpop();
  if(name==="synthpop") playSynthpop();
  if(name==="driftphonk") playDrift();
  if(name==="darkwave") playDarkwave();
  if(name==="ambient") playAmbient();

  document.getElementById("stateName").innerText = protocols[name].title;
}

/* ================= STATE SIM ================= */

const states = ["breakbeats","hyperpop","synthpop","driftphonk","darkwave","ambient"];

function simulate(){
  const next = states[Math.floor(Math.random()*states.length)];
  runProtocol(next);
}

/* ================= UI ================= */

document.getElementById("startEngine")?.addEventListener("click",()=>{
  running=true;
  simulate();
});

document.getElementById("stopEngine")?.addEventListener("click",()=>{
  running=false;
  stopAll();
});

document.getElementById("simulateOnce")?.addEventListener("click",simulate);

/* ================= AUTO LOOP ================= */

setInterval(()=>{
  if(running) simulate();
},8000);
