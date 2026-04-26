/* FINAL JS — ALL INTERACTIONS + SOUND FIXED */

const protocols = {
  breakbeats: { stage:"ENTRY",title:"Breakbeats",desc:"Irregularity becomes safe.",descCN:"不规则变得安全",bpm:"150–170",target:"Amygdala",exit:"Flexible",qdr:"Breakbeats entry" },
  hyperpop: { stage:"PEAK",title:"Hyperpop",desc:"Peak traversal.",descCN:"峰值穿越",bpm:"160–190",target:"Dopamine",exit:"Plateau",qdr:"Peak then release" },
  synthpop: { stage:"BREATH",title:"Synthpop",desc:"Structure becomes kind.",descCN:"结构变温柔",bpm:"95–125",target:"Narrative",exit:"Stable",qdr:"Gift rhythm" },
  driftphonk: { stage:"RE-ENTRY",title:"Drift Phonk",desc:"Return to now.",descCN:"回到当下",bpm:"80–110",target:"Timeline",exit:"Coherence",qdr:"Return body" },
  darkwave: { stage:"SHADOW",title:"Darkwave",desc:"Go down safely.",descCN:"安全下潜",bpm:"70–105",target:"Depth",exit:"Baseline",qdr:"Integrate shadow" },
  ambient: { stage:"HOME",title:"Ambient",desc:"Completion.",descCN:"完成",bpm:"60–90",target:"Rest",exit:"Coherent",qdr:"Consolidate" }
};

let audioCtx, masterGain;
let timers=[], nodes=[];
let running=false, current="breakbeats", mode="mellow";

function ctx(){
  if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==="suspended") audioCtx.resume();
  if(!masterGain){
    masterGain=audioCtx.createGain();
    masterGain.gain.value=0.6;
    masterGain.connect(audioCtx.destination);
  }
}

function stopAll(){
  timers.forEach(clearInterval); timers=[];
  nodes.forEach(n=>{try{n.stop&&n.stop()}catch{}});
  nodes=[];
}

function tone(f,type="sine",g=0.05,d=0.2){
  ctx();
  let o=audioCtx.createOscillator(), a=audioCtx.createGain();
  o.type=type; o.frequency.value=f;
  a.gain.setValueAtTime(0.0001,audioCtx.currentTime);
  a.gain.exponentialRampToValueAtTime(g,audioCtx.currentTime+0.02);
  a.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+d);
  o.connect(a); a.connect(masterGain);
  o.start(); o.stop(audioCtx.currentTime+d+0.03);
  nodes.push(o,a);
}

function drone(freqs){
  ctx();
  freqs.forEach(f=>{
    let o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.frequency.value=f; g.gain.value=0.05;
    o.connect(g); g.connect(masterGain);
    o.start(); nodes.push(o,g);
  });
}

function play(key){
  stopAll();
  if(key==="breakbeats"){
    let s=0;
    timers.push(setInterval(()=>{
      s++;
      tone(s%4?140:90,"sine",0.12,0.08);
      if(s%3===0) tone(427,"triangle",0.03,0.05);
    },140));
  }
  if(key==="hyperpop"){
    timers.push(setInterval(()=>{
      let arr=[427,724,1280];
      tone(arr[Math.random()*3|0],"square",0.04,0.07);
    },100));
  }
  if(key==="synthpop"){
    drone([427,540,640]);
    timers.push(setInterval(()=>tone(540,"triangle",0.03,0.3),500));
  }
  if(key==="driftphonk"){
    drone([106,427]);
    timers.push(setInterval(()=>tone(80,"sine",0.12,0.1),400));
  }
  if(key==="darkwave"){
    drone([106,213,427]);
  }
  if(key==="ambient"){
    drone([mode==="stallion"?724:427]);
  }
}

function setProtocol(k){
  current=k;
  document.querySelectorAll(".protocol").forEach(el=>{
    el.classList.toggle("active",el.dataset.protocol===k);
  });
  if(running) play(k);
}

function playAnchor(type){
  stopAll();
  if(type==="724"){
    drone([724,1448]);
    tone(724,"triangle",0.05,0.5);
  }else{
    drone([427,213]);
    tone(106,"sine",0.05,0.5);
  }
}

function bind(){
  document.querySelector(".protocol-grid").addEventListener("click",e=>{
    let el=e.target.closest(".protocol");
    if(!el) return;
    ctx();
    setProtocol(el.dataset.protocol);
    play(el.dataset.protocol);
  });

  document.getElementById("startEngine").onclick=()=>{
    ctx(); running=true; play(current);
  };

  document.getElementById("stopEngine").onclick=()=>{
    running=false; stopAll();
  };

  document.getElementById("simulateOnce").onclick=()=>{
    ctx();
    let keys=Object.keys(protocols);
    let k=keys[Math.random()*keys.length|0];
    setProtocol(k); play(k);
  };

  document.getElementById("play427").onclick=()=>{ctx(); playAnchor("427")};
  document.getElementById("play724").onclick=()=>{ctx(); playAnchor("724")};

  document.getElementById("mellowMode").onclick=()=>mode="mellow";
  document.getElementById("stallionMode").onclick=()=>mode="stallion";
}

document.addEventListener("DOMContentLoaded",()=>{
  bind();
  setProtocol("breakbeats");
});
