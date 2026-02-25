/* ===============================
   COPY CONTRACT ADDRESS
================================ */
const copyBtn = document.getElementById("copyBtn");
const caEl = document.getElementById("ca");

if (copyBtn && caEl) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(caEl.textContent.trim());
      copyBtn.textContent = "COPIED";
      setTimeout(() => (copyBtn.textContent = "COPY"), 1200);
    } catch {
      copyBtn.textContent = "FAILED";
      setTimeout(() => (copyBtn.textContent = "COPY"), 1200);
    }
  });
}

/* ===============================
   MARKET CAP / PROGRESS BAR
   (manual number for now)
================================ */
const marketCapUSD = 12500; // <-- CHANGE THIS NUMBER
const target = 100_000_000;

const mcapEl = document.getElementById("mcap");
const pctEl = document.getElementById("pct");
const fillEl = document.getElementById("barFill");

function formatUSD(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

if (mcapEl && pctEl && fillEl) {
  const pct = Math.max(0, Math.min(100, (marketCapUSD / target) * 100));
  mcapEl.textContent = formatUSD(marketCapUSD);
  pctEl.textContent = `${pct.toFixed(4)}%`;
  fillEl.style.width = `${pct}%`;
}

/* ===============================
   FLOATING SUNS BACKGROUND
================================ */
const sunLayer = document.getElementById("sunLayer");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnSun() {
  if (!sunLayer) return;

  const sun = document.createElement("div");
  sun.className = "sun";
sun.innerHTML = `<img src="sun.png" class="sun-img" />`; // replace with image if you want

  const x = rand(0, window.innerWidth);
  const size = rand(18, 46);
  const dur = rand(10, 18);
  const op = rand(0.2, 0.55);
  const drift = rand(-90, 90);
  const rise = rand(95, 135);

  sun.style.left = `${x}px`;
  sun.style.setProperty("--size", `${size}px`);
  sun.style.setProperty("--dur", `${dur}s`);
  sun.style.setProperty("--op", `${op}`);
  sun.style.setProperty("--drift", `${drift}px`);
  sun.style.setProperty("--rise", `${rise}vh`);

  sunLayer.appendChild(sun);

  // cleanup after animation
  setTimeout(() => {
    sun.remove();
  }, (dur + 1) * 1000);
}

/* spawn suns continuously */
setInterval(() => {
  const count = Math.random() < 0.35 ? 2 : 1;
  for (let i = 0; i < count; i++) spawnSun();
}, 650);

/* initial burst */
for (let i = 0; i < 6; i++) {
  setTimeout(spawnSun, i * 250);
}
