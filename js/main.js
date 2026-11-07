/* Scene engine + content rendering */
document.addEventListener("DOMContentLoaded", () => {
  const C = window.CONFIG, $ = id => document.getElementById(id);
  const scenes = [...document.querySelectorAll(".scene")];
  let cur = 0, typing = null, live = null, raf = null;

  /* ---------- render content ---------- */
  const h = new Date().getHours();
  $("greeting").textContent = `${h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"}, ${C.greetingName} ❤️`;
  $("dateRange").textContent = C.dateRange; $("episodeDate").textContent = C.episodeDate; $("nextEp").textContent = C.nextEpisode;
  const live4 = [["days", "DAYS TOGETHER"], ["hours", "HOURS TOGETHER"], ["beats", "HEARTBEATS (APPROX.)"], ["months", "MONTHSARIES"]];
  $("stats").innerHTML = live4.map(([k, l]) => `<div class="stat"><span data-stat="${k}">0</span><small>${l}</small></div>`).join("") +
    C.extraStats.map(s => `<div class="stat"><span>${s.value}</span><small>${s.label}</small></div>`).join("");
  $("envelopes").innerHTML = C.openWhen.map((o, n) => `<button class="env" data-i="${n}"><span class="flap">💌</span>
    <small>Open when</small><b>${o.label}</b></button>`).join("");
  $("openTotal").textContent = C.openWhen.length;
  Gallery.mount(C.photos, $("gallery"));
  Wishes.mount(C.wishes);
  $("letterTitle").textContent = C.letterTitle;

  /* ---------- open-when notes ---------- */
  const opened = new Set(), note = $("note");
  const closeNote = () => { note.hidden = true; };
  $("envelopes").addEventListener("click", e => { const b = e.target.closest(".env"); if (!b) return;
    const o = C.openWhen[+b.dataset.i]; $("noteTitle").textContent = `…${o.label}`; $("noteText").textContent = o.message;
    note.hidden = false; $("noteClose").focus(); b.classList.add("opened"); opened.add(b.dataset.i);
    $("openCount").textContent = opened.size;
    if (opened.size === C.openWhen.length) setTimeout(() => Effects.burst(innerWidth / 2, innerHeight / 2, 40), 400); });
  $("noteClose").onclick = closeNote; note.addEventListener("click", e => { if (e.target === note) closeNote(); });

  /* ---------- live stats count-up ---------- */
  function countUp() {
    clearInterval(live); cancelAnimationFrame(raf);
    const els = [...document.querySelectorAll("[data-stat]")], to = Timer.stats(), t0 = performance.now();
    const step = now => { const p = Math.min(1, (now - t0) / 1700), e = 1 - Math.pow(1 - p, 3);
      els.forEach(el => el.textContent = Math.round(to[el.dataset.stat] * e).toLocaleString());
      if (p < 1) raf = requestAnimationFrame(step);
      else live = setInterval(() => { const v = Timer.stats(); els.forEach(el => el.textContent = v[el.dataset.stat].toLocaleString()); }, 1000); };
    raf = requestAnimationFrame(step);
  }

  /* ---------- letter typewriter ---------- */
  function typeLetter() {
    const body = $("letterBody"), text = C.letter.join("\n\n"); let n = 0;
    clearInterval(typing); body.textContent = ""; $("letterNext").hidden = true; $("skipType").hidden = false;
    const done = () => { clearInterval(typing); body.textContent = text; $("letterNext").hidden = false; $("skipType").hidden = true; };
    $("skipType").onclick = done;
    typing = setInterval(() => { body.textContent = text.slice(0, ++n); body.scrollIntoView({ block: "nearest" }); if (n >= text.length) done(); }, C.typingSpeed);
  }

  /* ---------- navigation ---------- */
  function go(n) {
    n = Math.max(0, Math.min(scenes.length - 1, n));
    scenes[cur].classList.remove("active"); cur = n;
    const s = scenes[cur]; s.classList.add("active"); s.scrollTop = 0; closeNote();
    document.querySelectorAll("video").forEach(v => v.pause());
    [...$("dots").children].forEach((d, k) => d.classList.toggle("on", k === cur));
    $("dots").classList.toggle("hidden", cur === 0);
    clearInterval(typing); if (s.id !== "numbersScene") { clearInterval(live); cancelAnimationFrame(raf); }
    if (s.id === "letterScene") typeLetter();
    if (s.id === "numbersScene") countUp();
    if (s.id === "finaleScene") setTimeout(() => Effects.burst(innerWidth / 2, innerHeight / 3, 70), 500);
    if (s.id === "heroScene") setTimeout(() => Effects.burst(innerWidth / 2, innerHeight * .3, 30), 400);
  }
  document.addEventListener("click", e => {
    if (e.target.closest("[data-next]")) go(cur + 1);
    const g = e.target.closest("[data-goto]"); if (g) go(+g.dataset.goto);
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeNote();
    if (Gallery.isOpen() || !note.hidden || e.target.tagName === "INPUT") return;
    if (e.key === "ArrowRight" && scenes[cur].querySelector("[data-next]:not([hidden])")) go(cur + 1);
    if (e.key === "ArrowLeft") go(cur - 1);
  });
  let x0 = 0, y0 = 0;
  document.addEventListener("touchstart", e => { x0 = e.changedTouches[0].screenX; y0 = e.changedTouches[0].screenY; }, { passive: true });
  document.addEventListener("touchend", e => {
    if (Gallery.isOpen() || !note.hidden || e.target.closest("video, input")) return;
    const dx = e.changedTouches[0].screenX - x0, dy = e.changedTouches[0].screenY - y0;
    if (Math.abs(dx) < 90 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) { if (scenes[cur].querySelector("[data-next]:not([hidden])")) go(cur + 1); } else go(cur - 1);
  }, { passive: true });

  go(0);
  console.log("❤️ Season 1 Episode 5 ready.");
});
