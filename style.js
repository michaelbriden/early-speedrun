// --- Copy contract address ---
const copyBtn = document.getElementById("copyBtn");
const caEl = document.getElementById("ca");

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

// --- Market cap (manual default) ---
const marketCapUSD = 12500; // change this
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

const pct = Math.max(0, Math.min(100, (marketCapUSD / target) * 100));
mcapEl.textContent = formatUSD(marketCapUSD);
pctEl.textContent = `${pct.toFixed(4)}%`;
fillEl.style.width = `${pct}%`;

// --- Floating suns background ---
const sunLayer = document.getElementById("sunLayer");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnSun() {
  if (!sunLayer) return;

  const sun = document.createElement("div");
  sun.className = "sun";
  sun.textContent = "☀️";

  const x = rand(0, window.innerWidth);
  const size = rand(18, 44);
  const dur = rand(9, 16);
  const op = rand(0.18, 0.55);
  const drift = rand(-80, 80);
  const rise = rand(95, 130);

  sun.style.left = `${x}px`;
  sun.style.setProperty("--size", `${size}px`);
  sun.style.setProperty("--dur", `${dur}s`);
  sun.style.setProperty("--op", `${op}`);
  sun.style.setProperty("--drift", `${drift}px`);
  sun.style.setProperty("--rise", `${rise}vh`);

  sunLayer.appendChild(sun);

  // cleanup
  setTimeout(() => sun.remove(), (dur + 1) * 1000);
}

// spawn rate: adjust for density
setInterval(() => {
  // burst-ish randomness
  const count = Math.random() < 0.35 ? 2 : 1;
  for (let i = 0; i < count; i++) spawnSun();
}, 650);

// initial few
for (let i = 0; i < 6; i++) setTimeout(spawnSun, i * 250);
