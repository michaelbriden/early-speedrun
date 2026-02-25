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
