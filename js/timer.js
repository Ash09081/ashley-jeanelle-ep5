/* Calendar-accurate timers + live stats (local time, monthsary = the 7th) */
window.Timer = (() => {
  const S = window.CONFIG.start, pad = n => String(n).padStart(2, "0");
  const anchor = n => new Date(S.year, S.month - 1 + n, S.day, 0, 0, 0);

  function since(now = new Date()) {
    let m = (now.getFullYear() - S.year) * 12 + (now.getMonth() - (S.month - 1));
    while (m > 0 && anchor(m) > now) m--;
    m = Math.max(m, 0);
    const rem = Math.max(0, now - anchor(m));
    return { months: m, days: Math.floor(rem / 864e5), hours: Math.floor(rem / 36e5) % 24,
      minutes: Math.floor(rem / 6e4) % 60, seconds: Math.floor(rem / 1e3) % 60 };
  }
  function stats(now = new Date()) {
    const ms = Math.max(0, now - anchor(0));
    return { days: Math.floor(ms / 864e5), hours: Math.floor(ms / 36e5),
      beats: Math.floor(ms / 6e4 * 72), months: since(now).months };
  }
  const unit = (v, l) => `<div class="unit"><span>${v}</span><small>${l}</small></div>`;
  const row = (...u) => `<div class="timer-row">${u.join("")}</div>`;

  function tick() {
    const now = new Date(), t = since(now), $ = id => document.getElementById(id);
    $("relationshipTimer").innerHTML = row(unit(t.months, "MONTHS"), unit(t.days, "DAYS"),
      unit(pad(t.hours), "HRS"), unit(pad(t.minutes), "MIN"), unit(pad(t.seconds), "SEC"));
    const b = $("monthsaryBanner"), today = now.getDate() === S.day && t.months > 0;
    b.hidden = !today; if (today) b.textContent = `Happy ${t.months}-month monthsary, Mahal! ❤️`;
    const d = anchor(t.months + 1) - now;
    $("monthsaryCountdown").innerHTML = row(unit(Math.floor(d / 864e5), "DAYS"), unit(pad(Math.floor(d / 36e5) % 24), "HRS"),
      unit(pad(Math.floor(d / 6e4) % 60), "MIN"), unit(pad(Math.floor(d / 1e3) % 60), "SEC"));
  }
  document.addEventListener("DOMContentLoaded", () => { tick(); setInterval(tick, 1000); });
  return { since, stats };
})();
