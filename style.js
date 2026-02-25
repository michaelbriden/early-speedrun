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

// --- Update market cap display (manual default) ---
// Set your market cap number here:
const marketCapUSD = 12500; // $12.5K
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
