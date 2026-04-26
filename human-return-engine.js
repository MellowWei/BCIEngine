const protocols = {
  breakbeats: {
    stage: "ENTRY PROTOCOL",
    title: "Breakbeats",
    desc: "Irregularity becomes safe. Breakbeats train uncertainty tolerance and anti-dissociation anchoring.",
    descCN: "不规则变得安全。Breakbeats 训练不确定性承受与反解离锚定。",
    bpm: "150–170",
    target: "Amygdala · DMN",
    exit: "Flexible activation",
    qdr: "Deploy Breakbeats. Train irregularity as safe."
  },
  hyperpop: {
    stage: "PEAK TRAVERSAL",
    title: "Hyperpop",
    desc: "Intensity is survivable. Hyperpop brings activation to the ceiling, then teaches the body that peaks end.",
    descCN: "强度是可承受的。Hyperpop 把激活带到顶点，再让身体知道峰值会结束。",
    bpm: "160–190",
    target: "Dopamine · Tolerance",
    exit: "Plateau + micro-drop",
    qdr: "Allow controlled overload. Let peak become survivable."
  },
  synthpop: {
    stage: "FIRST BREATH",
    title: "Synthpop",
    desc: "Structure becomes kind. Linear rhythm lands as relief after chaos has been honored.",
    descCN: "结构可以是温柔的。当混乱被尊重之后，线性节律成为休息。",
    bpm: "95–125",
    target: "Narrative · Vagal",
    exit: "Emotion stabilized",
    qdr: "Offer predictable structure as gift, not command."
  },
  driftphonk: {
    stage: "TEMPORAL RE-ENTRY",
    title: "Drift Phonk",
    desc: "Time has moved forward. Sub-bass and 427Hz return the body from the historical room to now.",
    descCN: "时间已经向前。Sub-bass 与 427Hz 把身体从过去的房间带回当下。",
    bpm: "80–110",
    target: "Timeline reset",
    exit: "HRV coherence",
    qdr: "Emergency re-entry. Return the body from then to now."
  },
  darkwave: {
    stage: "SHADOW INTEGRATION",
    title: "Darkwave",
    desc: "Darkness is survivable. The system descends by choice, not collapse.",
    descCN: "黑暗是可承受的。系统是主动下潜，不是崩塌。",
    bpm: "70–105",
    target: "Parasympathetic depth",
    exit: "Baseline EDA",
    qdr: "Go down by choice. Witness shadow without collapse."
  },
  ambient: {
    stage: "HOMECOMING",
    title: "Ambient Techno",
    desc: "I have returned. The nervous system rests in earned silence and consolidates the journey.",
    descCN: "我已经回来了。神经系统在赢得的安静里休息，并整合整个旅程。",
    bpm: "60–90",
    target: "Consolidation",
    exit: "Sustained coherence",
    qdr: "Consolidate. Let the body remember completion."
  }
};

const stateRoutes = {
  overloaded: {
    name: "Overloaded",
    meaning: "Too much signal is entering. The body needs rhythm, not command.",
    cn: "太多信号正在进入。身体需要节律，而不是命令。",
    protocol: "breakbeats"
  },
  peak: {
    name: "Peak Rising",
    meaning: "Activation is high but usable. The system can traverse intensity.",
    cn: "激活很高但可使用。系统可以穿越强度。",
    protocol: "hyperpop"
  },
  drifting: {
    name: "Drifting",
    meaning: "Attention has not disappeared; it has lost anchor.",
    cn: "注意力没有消失，只是失去锚点。",
    protocol: "driftphonk"
  },
  shadow: {
    name: "Shadow Material",
    meaning: "Suppressed content is surfacing. Go down with agency.",
    cn: "被压抑内容正在浮现。带着主体性下潜。",
    protocol: "darkwave"
  },
  recovery: {
    name: "Recovery",
    meaning: "The body is ready for consolidation, not more demand.",
    cn: "身体准备整合，而不是承受更多要求。",
    protocol: "ambient"
  },
  structure: {
    name: "Ready for Structure",
    meaning: "Predictability can now land as relief.",
    cn: "可预测性现在可以作为休息落地。",
    protocol: "synthpop"
  }
};

let audioCtx;
let activeNodes = [];
let activeTimers = [];
let running = false;
let visualMode = "breakbeats";
let currentProtocol = "breakbeats";
let currentRoute = "mellow";
let lastMouseTime = performance.now();
let movementPulse = 0;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function stopAll() {
  activeTimers.forEach(clearInterval);
  activeTimers = [];
  activeNodes.forEach(node => {
    try { if (node.stop) node.stop(); } catch {}
    try { if (node.disconnect) node.disconnect(); } catch {}
  });
  activeNodes = [];
}

function add(node) {
  activeNodes.push(node);
  return node;
}

function tone(freq, type = "sine", level = 0.05, duration = 0.2) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(level, ctx.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);

  add(osc);
  add(gain);
}

function drone(freqs, level = 0.06, type = "sine") {
  const ctx = getCtx();
  const master = ctx.createGain();

  master.gain.value = level;
  master.connect(ctx.destination);
  add(master);

  freqs.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = index % 2 ? "triangle" : type;
    osc.frequency.value = freq;
    gain.gain.value = index === 0 ? 0.5 : 0.18;

    osc.connect(gain);
    gain.connect(master);

    osc.start();

    add(osc);
    add(gain);
  });
}

function playProtocolSound(key) {
  stopAll();

  if (key === "breakbeats") {
    let step = 0;

    activeTimers.push(setInterval(() => {
      step++;

      tone(step % 4 === 0 ? 90 : 145, "sine", 0.13, 0.08);

      if (step % 3 === 0) tone(427, "triangle", 0.035, 0.06);
      if (step % 5 === 0) tone(1280, "square", 0.025, 0.035);
      if (step % 7 === 0) tone(724, "sawtooth", 0.02, 0.04);
    }, 145));
  }

  if (key === "hyperpop") {
    activeTimers.push(setInterval(() => {
      const scale = [427, 640, 724, 854, 1280, 1448];
      const freq = scale[Math.floor(Math.random() * scale.length)];
      const type = Math.random() > 0.5 ? "square" : "sawtooth";

      tone(freq, type, 0.04, 0.075);
    }, 105));
  }

  if (key === "synthpop") {
    drone([427, 540, 640.5, 724], 0.065);

    activeTimers.push(setInterval(() => {
      const melody = [427, 480, 540, 640.5];
      const freq = melody[Math.floor(Math.random() * melody.length)];

      tone(freq, "triangle", 0.035, 0.35);
    }, 520));
  }

  if (key === "driftphonk") {
    drone([53.375, 106.75, 427], 0.08);

    activeTimers.push(setInterval(() => {
      tone(80, "sine", 0.12, 0.12);
    }, 420));
  }

  if (key === "darkwave") {
    drone([106.75, 213.5, 427], 0.055, "sawtooth");

    activeTimers.push(setInterval(() => {
      const tones = [106.75, 213.5, 320];
      const freq = tones[Math.floor(Math.random() * tones.length)];

      tone(freq, "sawtooth", 0.035, 0.55);
    }, 820));
  }

  if (key === "ambient") {
    drone([106.75, 213.5, currentRoute === "stallion" ? 724 : 427], 0.045);
  }
}

function setProtocol(key, play = true) {
  const data = protocols[key];
  if (!data) return;

  currentProtocol = key;
  visualMode = key;

  document.querySelectorAll(".protocol").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.protocol === key);
  });

  const protocolStage = document.getElementById("protocolStage");
  const protocolTitle = document.getElementById("protocolTitle");
  const protocolDesc = document.getElementById("protocolDesc");
  const protocolDescCN = document.getElementById("protocolDescCN");
  const metricBpm = document.getElementById("metricBpm");
  const metricTarget = document.getElementById("metricTarget");
  const metricExit = document.getElementById("metricExit");
  const orbText = document.getElementById("orbText");
  const miniProtocol = document.getElementById("miniProtocol");
  const qdrOutput = document.getElementById("qdrOutput");

  if (protocolStage) protocolStage.textContent = data.stage;
  if (protocolTitle) protocolTitle.textContent = data.title;
  if (protocolDesc) protocolDesc.textContent = data.desc;
  if (protocolDescCN) protocolDescCN.textContent = data.descCN;
  if (metricBpm) metricBpm.textContent = data.bpm;
  if (metricTarget) metricTarget.textContent = data.target;
  if (metricExit) metricExit.textContent = data.exit;
  if (orbText) orbText.textContent = key === "ambient" ? (currentRoute === "stallion" ? "724Hz" : "427Hz") : data.title.toUpperCase();
  if (miniProtocol) miniProtocol.textContent = data.title;
  if (qdrOutput) qdrOutput.textContent = data.qdr;

  updateRouteHighlight(key);

  if (play) playProtocolSound(key);
}

function updateBars(hrv, eda, motion) {
  const hrvBar = document.getElementById("hrvBar");
  const edaBar = document.getElementById("edaBar");
  const motionBar = document.getElementById("motionBar");
  const hrvValue = document.getElementById("hrvValue");
  const edaValue = document.getElementById("edaValue");
  const motionValue = document.getElementById("motionValue");

  if (hrvBar) hrvBar.style.width = hrv + "%";
  if (edaBar) edaBar.style.width = eda + "%";
  if (motionBar) motionBar.style.width = motion + "%";

  if (hrvValue) hrvValue.textContent = hrv + "%";
  if (edaValue) edaValue.textContent = eda + "%";
  if (motionValue) motionValue.textContent = motion + "%";
}

function simulateInput() {
  const keys = Object.keys(stateRoutes);
  const state = stateRoutes[keys[Math.floor(Math.random() * keys.length)]];

  const hrv = Math.floor(25 + Math.random() * 70);
  const eda = Math.floor(18 + Math.random() * 78);
  const motion = Math.floor(15 + Math.random() * 82);

  updateBars(hrv, eda, motion);

  const stateName = document.getElementById("stateName");
  const miniState = document.getElementById("miniState");
  const stateMeaning = document.getElementById("stateMeaning");
  const stateMeaningCN = document.getElementById("stateMeaningCN");

  if (stateName) stateName.textContent = state.name;
  if (miniState) miniState.textContent = state.name;
  if (stateMeaning) stateMeaning.textContent = state.meaning;
  if (stateMeaningCN) stateMeaningCN.textContent = state.cn;

  setProtocol(state.protocol, running);
}

function inferFromInteraction() {
  const now = performance.now();
  const delta = now - lastMouseTime;

  lastMouseTime = now;

  movementPulse = Math.max(0, Math.min(100, movementPulse + (delta < 80 ? 8 : -3)));

  const hrv = Math.max(20, Math.min(95, Math.floor(50 + Math.sin(now / 900) * 18 + movementPulse * 0.18)));
  const eda = Math.max(15, Math.min(96, Math.floor(35 + movementPulse * 0.55)));
  const motion = Math.max(10, Math.min(98, Math.floor(movementPulse)));

  updateBars(hrv, eda, motion);

  if (!running) return;

  if (eda > 76 && motion > 70) setProtocol("breakbeats", true);
  else if (hrv > 70 && eda > 58) setProtocol("hyperpop", true);
  else if (motion < 28 && eda < 45) setProtocol("ambient", true);
}

function setMode(mode) {
  currentRoute = mode;

  const label = mode === "stallion" ? "Stallion · 724Hz" : "Mellow · 427Hz";
  const modeLabel = document.getElementById("modeLabel");
  const orbText = document.getElementById("orbText");

  if (modeLabel) modeLabel.textContent = label;
  if (orbText) orbText.textContent = mode === "stallion" ? "724Hz" : "427Hz";

  updateRouteHighlight(currentProtocol);
}

function updateRouteHighlight(key) {
  document.querySelectorAll(".route span").forEach(span => span.classList.remove("active-step"));

  const names = {
    breakbeats: "Breakbeats",
    hyperpop: "Hyperpop",
    synthpop: "Synthpop",
    driftphonk: "Drift Phonk",
    darkwave: "Darkwave",
    ambient: "Ambient Techno"
  };

  document.querySelectorAll(".route span").forEach(span => {
    if (span.textContent.trim() === names[key]) {
      span.classList.add("active-step");
    }
  });
}

function playAnchor(freq, kind) {
  stopAll();

  if (kind === "724") {
    drone([724, 1448, 181, 1086], 0.05, "triangle");

    const orbText = document.getElementById("orbText");
    if (orbText) orbText.textContent = "724Hz";
  } else {
    drone([427, 213.5, 106.75], 0.065);

    const orbText = document.getElementById("orbText");
    if (orbText) orbText.textContent = "427Hz";
  }
}

function draw() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const w = canvas.width;
  const h = canvas.height;
  const t = performance.now() / 1000;

  ctx.clearRect(0, 0, w, h);

  const colorMap = {
    breakbeats: "rgba(255,230,109,.9)",
    hyperpop: "rgba(255,43,214,.9)",
    synthpop: "rgba(0,245,255,.9)",
    driftphonk: "rgba(53,255,159,.9)",
    darkwave: "rgba(141,92,255,.9)",
    ambient: "rgba(120,220,255,.75)"
  };

  const color = colorMap[visualMode] || colorMap.breakbeats;

  for (let layer = 0; layer < 4; layer++) {
    ctx.beginPath();

    for (let x = 0; x < w; x += 7 * dpr) {
      const nx = x / w;
      let amp;

      if (visualMode === "hyperpop") amp = (Math.random() - 0.5) * h * 0.18 + Math.sin(nx * 90 + t * 10) * h * 0.025;
      else if (visualMode === "ambient") amp = Math.sin(nx * 5 + t * 0.35 + layer) * h * 0.055;
      else if (visualMode === "darkwave") amp = Math.sin(nx * 8 + t * 0.7 + layer) * h * 0.12;
      else if (visualMode === "synthpop") amp = Math.sin(nx * 18 + t * 1.5 + layer) * h * 0.08;
      else if (visualMode === "driftphonk") amp = Math.sin(nx * 12 + t * 0.9 + layer) * h * 0.10 + Math.sin(nx * 4 + t * 0.5) * h * 0.07;
      else amp = Math.sign(Math.sin(nx * 34 + t * 6)) * h * 0.045 + Math.sin(nx * 9 + t) * h * 0.04;

      const y = h * (0.5 + (layer - 1.5) * 0.11) + amp;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = (layer === 1 ? 2.5 : 1.2) * dpr;
    ctx.shadowBlur = 16 * dpr;
    ctx.shadowColor = color;
    ctx.stroke();
  }

  requestAnimationFrame(draw);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".protocol").forEach(btn => {
    btn.addEventListener("click", () => setProtocol(btn.dataset.protocol, true));
  });

  const startEngine = document.getElementById("startEngine");
  const stopEngine = document.getElementById("stopEngine");
  const playProtocol = document.getElementById("playProtocol");
  const stopProtocol = document.getElementById("stopProtocol");
  const simulateOnce = document.getElementById("simulateOnce");
  const mellowMode = document.getElementById("mellowMode");
  const stallionMode = document.getElementById("stallionMode");
  const play427 = document.getElementById("play427");
  const play724 = document.getElementById("play724");

  if (startEngine) {
    startEngine.addEventListener("click", () => {
      running = true;
      setProtocol(currentProtocol, true);
    });
  }

  if (stopEngine) {
    stopEngine.addEventListener("click", () => {
      running = false;
      stopAll();
    });
  }

  if (playProtocol) playProtocol.addEventListener("click", () => setProtocol(currentProtocol, true));
  if (stopProtocol) stopProtocol.addEventListener("click", stopAll);
  if (simulateOnce) simulateOnce.addEventListener("click", simulateInput);
  if (mellowMode) mellowMode.addEventListener("click", () => setMode("mellow"));
  if (stallionMode) stallionMode.addEventListener("click", () => setMode("stallion"));
  if (play427) play427.addEventListener("click", () => playAnchor(427, "427"));
  if (play724) play724.addEventListener("click", () => playAnchor(724, "724"));

  window.addEventListener("mousemove", inferFromInteraction);
  window.addEventListener("scroll", () => {
    movementPulse = Math.min(100, movementPulse + 12);
    inferFromInteraction();
  });

  setProtocol("breakbeats", false);
  simulateInput();
  draw();
});
