/* ============================================================
   EDIT ME — all the personal content lives here
   ============================================================ */
const CONFIG = {
  friendName: "Apurva Dadhich",                 // shown on the certificate + award page
  noteText: "Here's to the person who's somehow both the reason I laugh the hardest and the reason I lose my patience the fastest. You're a certified overthinker, part-time menace, full-time chaos generator, and completely allergic to admitting you're wrong. Yet somehow, every dumb conversation, every random plan, and every ridiculous memory is better because you're in it. Thanks for being my favorite headache. Happy Friendship Day—you wonderfully unhinged human. 💜",
  certificateBody: "for endless laughs, unwavering loyalty, and always picking up the phone.",
  certificateDate: new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
}),

  // characteristics shown around the bestie photo on page 3
  characteristics: [
    "😂 Laughs at the worst possible moments",
    "👀 FBI-level observation skills.",
    "📸 Has 500 selfies but says, I have no good photos",
    "🦥Lazy Until It's Shopping Time",
    "🧠 Thinks she's always right",
    "💬 Unlimited Gossip Storage"
  ],

  // captions for the memory photos (optional, shown as image alt/title)
  memoryCaptions: [
    "that college group chat fight where everything start",
    "that judgemental look you gave me",
    "everyday chaos",
    "still going strong"
  ],

  finalNote: [
    "Congratulations! You survived this website without rage-quitting. Honestly, that's more impressive than most of your life decisions. You're a walking bug report—random mood swings, unlimited drama, zero storage for common sense, but somehow 100% storage for gossip. You're the type of person who says I'm not hungry and then steals everyone's food. Despite all that, life would be ridiculously boring without your daily nonsense. Happy Friendship Day, you certified chaos machine.",
  ],
};

/* ============================================================
   PAGE NAVIGATION
   ============================================================ */
const pages = Array.from(document.querySelectorAll(".page"));
const dots = Array.from(document.querySelectorAll(".dot"));
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
let current = 0;
const pageInitDone = new Set();

function goTo(index){
  if(index < 0 || index >= pages.length) return;
  if(index === current) return;

  pages[current].classList.add("leaving");
  pages[current].classList.remove("active");
  setTimeout(()=> pages[current].classList.remove("leaving"), 650);

  current = index;
  pages[current].classList.add("active");

  dots.forEach((d,i)=> d.classList.toggle("active", i === current));
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === pages.length - 1;

  if(!pageInitDone.has(current)){
    pageInitDone.add(current);
    runPageIntro(current);
  }
}

dots.forEach((d,i)=> d.addEventListener("click", ()=> goTo(i)));
prevBtn.addEventListener("click", ()=> goTo(current - 1));
nextBtn.addEventListener("click", ()=> goTo(current + 1));
document.querySelectorAll("[data-next]").forEach(btn=>{
  btn.addEventListener("click", ()=> goTo(current + 1));
});

document.addEventListener("keydown", (e)=>{
  if(e.key === "ArrowDown" || e.key === "PageDown") goTo(current + 1);
  if(e.key === "ArrowUp" || e.key === "PageUp") goTo(current - 1);
});

prevBtn.disabled = true;

/* ============================================================
   PAGE 0 — ENVELOPE
   ============================================================ */
const envelopeBtn = document.getElementById("envelope-btn");
envelopeBtn.addEventListener("click", ()=>{
  if(envelopeBtn.classList.contains("opened")) return;
  envelopeBtn.classList.add("opened");
  setTimeout(()=> goTo(1), 900);
});

/* ============================================================
   PAGE 1 — NOTE: staggered reveal (title -> photo -> text -> button)
   NOT all at once — each piece loads in turn, like the reference video.
   ============================================================ */
function initNotePage(){
  const title = document.getElementById("note-title");
  const photoFrame = document.getElementById("note-photo-frame");
  const photoLoader = document.getElementById("note-photo-loader");
  const photoImg = document.getElementById("note-photo");
  const textEl = document.getElementById("note-text");
  const nextBtnEl = document.getElementById("note-next-btn");

  // build the word-by-word text now, hidden, so it's ready to reveal
  textEl.innerHTML = CONFIG.noteText.split(" ").map(w=>`<span class="word">${w}</span>`).join(" ");

  setTimeout(()=> title.classList.add("shown"), 200);

  setTimeout(()=>{
    photoFrame.classList.add("shown");
    // simulate a real "loading" moment before the photo appears
    setTimeout(()=>{
      photoLoader.classList.add("done");
      photoImg.classList.add("shown");
    }, 900);
  }, 700);

  // words reveal one by one after the photo has loaded in
  const words = Array.from(textEl.querySelectorAll(".word"));
  const wordStart = 2000;
  words.forEach((w,i)=>{
    setTimeout(()=> w.classList.add("shown"), wordStart + i * 55);
  });

  setTimeout(()=> nextBtnEl.classList.add("shown"), wordStart + words.length * 55 + 300);
}

/* ============================================================
   PAGE 2 — CERTIFICATE
   ============================================================ */
function initCertificatePage(){
  const nameText = document.getElementById("award-name-text");
  const openBtn = document.getElementById("open-cert-btn");
  const certificate = document.getElementById("certificate");
  const awardIntro = document.getElementById("award-intro");

  document.getElementById("cert-name").textContent = CONFIG.friendName;
  document.getElementById("cert-body").textContent = CONFIG.certificateBody;
  document.getElementById("cert-date").textContent = CONFIG.certificateDate;

  // type the name in, letter by letter, like it's "loading"
  const name = CONFIG.friendName;
  let i = 0;
  const typer = setInterval(()=>{
    nameText.textContent = name.slice(0, i+1);
    i++;
    if(i >= name.length){
      clearInterval(typer);
      setTimeout(()=>{ openBtn.hidden = false; }, 400);
    }
  }, 90);

  openBtn.addEventListener("click", ()=>{
    awardIntro.style.transition = "opacity .4s ease, transform .4s ease";
    awardIntro.style.opacity = "0";
    awardIntro.style.transform = "translateY(-14px)";
    setTimeout(()=>{
      awardIntro.hidden = true;
      certificate.hidden = false;
      requestAnimationFrame(()=> certificate.classList.add("shown"));
    }, 380);
  });
}

/* ============================================================
   PAGE 3 — CHARACTERISTICS with animated arrows
   Positions are computed on a 100x100 viewBox circle so it stays
   responsive at any screen size.
   ============================================================ */
function initCharacteristicsPage(){
  const svg = document.getElementById("arrows-svg");
  const labelsWrap = document.getElementById("char-labels");
  const items = CONFIG.characteristics;
  const cx = 50, cy = 50;
  const radius = 42;

  items.forEach((label, i)=>{
    const angle = (-90 + (360 / items.length) * i) * (Math.PI / 180);
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    // control point bows the line slightly for a hand-drawn feel
    const midX = cx + (radius * 0.55) * Math.cos(angle) + 6 * Math.sin(angle);
    const midY = cy + (radius * 0.55) * Math.sin(angle) - 6 * Math.cos(angle);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${cx} ${cy} Q ${midX} ${midY} ${x} ${y}`);
    svg.appendChild(path);
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    path.style.transitionDelay = `${i * 0.28}s`;

    const labelEl = document.createElement("div");
    labelEl.className = "char-label";
    labelEl.textContent = label;
    labelEl.style.left = x + "%";
    labelEl.style.top = y + "%";
    labelEl.style.transitionDelay = `${i * 0.28 + 0.5}s`;
    labelsWrap.appendChild(labelEl);
  });

  // trigger the draw-in animation shortly after the page mounts
  requestAnimationFrame(()=>{
    setTimeout(()=>{
      svg.querySelectorAll("path").forEach(p=> { p.style.strokeDashoffset = 0; });
      labelsWrap.querySelectorAll(".char-label").forEach(l=> l.classList.add("shown"));
    }, 300);
  });
}

/* ============================================================
   PAGE 4 — MEMORIES COLLAGE
   ============================================================ */
function initMemoriesPage(){
  const mems = document.querySelectorAll(".mem");
  const captions = CONFIG.memoryCaptions;
  mems.forEach((m,i)=>{
    if(captions[i]) m.querySelector("img").title = captions[i];
  });
  requestAnimationFrame(()=>{
    setTimeout(()=> mems.forEach(m=> m.classList.add("shown")), 150);
  });
}

/* ============================================================
   PAGE 5 — FINAL NOTE (full page, line by line)
   ============================================================ */
function initFinalPage(){
  const body = document.getElementById("final-note-body");
  body.innerHTML = CONFIG.finalNote.map(line=> `<span class="line">${line}</span>`).join("");
  const lines = body.querySelectorAll(".line");
  lines.forEach((l,i)=> setTimeout(()=> l.classList.add("shown"), 300 + i * 500));

  // gentle falling hearts on the closing page
  const heartsWrap = document.querySelector(".final-hearts");
  for(let i=0;i<10;i++){
    const h = document.createElement("span");
    h.textContent = "❤";
    h.style.cssText = `position:absolute; left:${Math.random()*100}%; top:-10%; color:#ffb4a8; font-size:${12+Math.random()*14}px; opacity:${.3+Math.random()*.4}; animation: heart-fall ${6+Math.random()*5}s linear ${Math.random()*4}s infinite;`;
    heartsWrap.appendChild(h);
  }

  document.getElementById("replay-btn").addEventListener("click", ()=> goTo(0));
}

const heartFallStyle = document.createElement("style");
heartFallStyle.textContent = `@keyframes heart-fall{0%{transform:translateY(0) rotate(0);}100%{transform:translateY(120vh) rotate(90deg);}}`;
document.head.appendChild(heartFallStyle);

/* ============================================================
   dispatch per-page setup the first time it's shown
   ============================================================ */
function runPageIntro(index){
  switch(index){
    case 1: initNotePage(); break;
    case 2: initCertificatePage(); break;
    case 3: initCharacteristicsPage(); break;
    case 4: initMemoriesPage(); break;
    case 5: initFinalPage(); break;
  }
}

/* ============================================================
   ambient floating hearts on the landing page background
   ============================================================ */
(function ambientFloaties(){
  const wrap = document.getElementById("floaties");
  const emojis = ["💌","💕","✨","🎀"];
  for(let i=0;i<12;i++){
    const s = document.createElement("span");
    s.textContent = emojis[i % emojis.length];
    s.style.left = Math.random()*100 + "%";
    s.style.animationDuration = (14 + Math.random()*10) + "s";
    s.style.animationDelay = (Math.random()*14) + "s";
    s.style.fontSize = (14 + Math.random()*14) + "px";
    wrap.appendChild(s);
  }
})();

/* run the very first page's intro if it ever isn't page 0 */
prevBtn.disabled = true;
nextBtn.disabled = pages.length <= 1;
