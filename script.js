// ====== CONFIG (set this on launch) ======
const TOKEN_CA = "FrhioeeWr84kspR2zfEZ4hg6SAG7GSp9TTc4KEdLCWFr"; // <-- paste mint address here when you launch

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
   NEW JERSEY (ET) LIVE CLOCK
================================ */
const njTimeEl = document.getElementById("njTime");

function updateNJTime() {
  if (!njTimeEl) return;

  const now = new Date();

  const time = now.toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  njTimeEl.textContent = time;
}

// initial + live update
updateNJTime();
setInterval(updateNJTime, 1000);

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

/* ===============================
   MARKET CAP TRACKER (pump.fun / Solana)
   Uses DexScreener (free, auto-indexed once trading)
================================ */

const GOAL = 100_000_000; // matches your "/ $100M"
const PUMP_SUPPLY_FALLBACK = 1_000_000_000;

function fmtAbbrev(n) {
  if (n == null || Number.isNaN(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e9) return "$" + (n / 1e9).toFixed(2).replace(/\.00$/, "") + "B";
  if (abs >= 1e6) return "$" + (n / 1e6).toFixed(2).replace(/\.00$/, "") + "M";
  if (abs >= 1e3) return "$" + (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return "$" + Math.round(n).toLocaleString();
}

async function fetchDexScreenerSol(ca) {
  const url = `https://api.dexscreener.com/latest/dex/tokens/${ca}`;
  const r = await fetch(url);
  const data = await r.json();

  const pairs = data?.pairs || [];
  if (!pairs.length) return { marketcap: null };

  const best =
    pairs
      .filter(p => p.chainId === "solana")
      .sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0] || pairs[0];

  const priceUsd = best.priceUsd != null ? Number(best.priceUsd) : null;
  let marketcap = best.marketCap ?? best.fdv ?? null;

  // fallback if only price is available
  if (marketcap == null && priceUsd != null) marketcap = priceUsd * PUMP_SUPPLY_FALLBACK;

  return { marketcap };
}

function setMarketUI(marketcap) {
  const mcapEl = document.getElementById("mcap");
  const barFill = document.getElementById("barFill");
  const pctEl = document.getElementById("pct");

  if (mcapEl) mcapEl.textContent = fmtAbbrev(marketcap);

  const pct = marketcap != null ? (marketcap / GOAL) * 100 : 0;
  const pctClamped = Math.max(0, Math.min(100, pct));

  if (barFill) barFill.style.width = `${pctClamped}%`;
  if (pctEl) pctEl.textContent = `${pctClamped.toFixed(4)}%`;
}

async function tickMarket(ca) {
  try {
    const { marketcap } = await fetchDexScreenerSol(ca);
    setMarketUI(marketcap);
  } catch (e) {
    console.warn("Marketcap fetch failed:", e);
  }
}

function startMarketTracker(ca) {
  // Put CA into the contract box so copy works
  if (caEl) caEl.textContent = ca;

  tickMarket(ca);
  setInterval(() => tickMarket(ca), 5000);
}

if (TOKEN_CA && TOKEN_CA.length > 20) {
  startMarketTracker(TOKEN_CA);
} else {
  // show placeholder so people know it’s not live yet
  setMarketUI(null);
  if (caEl) caEl.textContent = "TBA";
}
