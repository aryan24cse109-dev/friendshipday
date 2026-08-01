// ---------------------------------------------------------------
// Friendship Day site — navigation, award animation, image fallback
// ---------------------------------------------------------------

const scenes = Array.from(document.querySelectorAll(".scene"));
const dotsWrap = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let current = 0;

// Build pagination dots
scenes.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "dot-indicator" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", `Go to page ${i + 1}`);
  dot.addEventListener("click", () => goTo(i));
  dotsWrap.appendChild(dot);
});
const dotEls = Array.from(dotsWrap.children);

function render() {
  scenes.forEach((s, i) => s.classList.toggle("active", i === current));
  dotEls.forEach((d, i) => d.classList.toggle("active", i === current));
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === scenes.length - 1;

  // Trigger the award loading-bar animation each time scene 2 becomes active
  if (current === 1) playAwardAnimation();
}

function goTo(index) {
  current = Math.max(0, Math.min(scenes.length - 1, index));
  render();
}

prevBtn.addEventListener("click", () => goTo(current - 1));
nextBtn.addEventListener("click", () => goTo(current + 1));

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") goTo(current + 1);
  if (e.key === "ArrowLeft") goTo(current - 1);
});

// ---- Award page: animated loading bar --------------------------------
const loadingFill = document.getElementById("loadingFill");
const loadingLabel = document.getElementById("loadingLabel");
const awardBubble = document.getElementById("awardBubble");
let awardTimer = null;

function playAwardAnimation() {
  clearInterval(awardTimer);
  loadingFill.style.width = "0%";
  loadingLabel.textContent = "LOADING...";
  awardBubble.classList.remove("show");

  const start = Date.now();
  const duration = 1400;

  awardTimer = setInterval(() => {
    const t = Math.min(1, (Date.now() - start) / duration);
    loadingFill.style.width = `${Math.round(t * 100)}%`;
    if (t >= 1) {
      clearInterval(awardTimer);
      loadingLabel.textContent = "AWARDED";
      awardBubble.classList.add("show");
    }
  }, 30);
}

// ---- Image fallback: show a soft color placeholder if a photo is missing ---
// This lets the site look good immediately, before you've added your own
// photos into the /images folder (see README.md for exact filenames).
const tintMap = {
  pink: "#F2A6C4",
  purple: "#8B5CF6",
  sage: "#7C9473",
  gold: "#F5C94B",
};

document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    const tint = tintMap[img.dataset.tint] || "#F2A6C4";
    const label = img.dataset.placeholder || "";
    img.style.setProperty("--tint-color", tint);
    img.classList.add("img-missing");
    img.style.display = "flex";
    img.style.alignItems = "center";
    img.style.justifyContent = "center";
    img.style.textAlign = "center";
    img.alt = label || img.alt;
    img.title = "Add your photo here — see README.md";
  });
});

render();
