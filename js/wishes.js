/* Shared wish list — saved in localStorage (try/catch for private mode) */
window.Wishes = (() => {
  const KEY = "aj-ep5-wishes"; let list = [];
  const $ = id => document.getElementById(id);
  const esc = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} };

  function render() {
    $("wishList").innerHTML = list.map((w, i) => `<li class="${w.done ? "done" : ""}">
      <button class="chk" data-i="${i}" aria-pressed="${w.done}" aria-label="Toggle">${w.done ? "✓" : ""}</button>
      <span>${esc(w.text)}</span><button class="del" data-del="${i}" aria-label="Remove">×</button></li>`).join("");
    const d = list.filter(w => w.done).length;
    $("wishDone").textContent = d; $("wishTotal").textContent = list.length;
    $("wishBar").style.width = list.length ? (d / list.length * 100) + "%" : "0";
  }
  function add() { const t = $("wishInput").value.trim(); if (!t) return;
    list.push({ text: t, done: false }); $("wishInput").value = ""; save(); render(); }

  return { mount(defaults) {
    const saved = load(); list = Array.isArray(saved) ? saved : defaults.map(text => ({ text, done: false }));
    render();
    $("wishList").addEventListener("click", e => {
      const c = e.target.closest(".chk"), d = e.target.closest(".del");
      if (c) { const w = list[+c.dataset.i]; w.done = !w.done; save(); render(); if (w.done) Effects.burst(e.clientX, e.clientY, 24); }
      if (d) { list.splice(+d.dataset.del, 1); save(); render(); } });
    $("wishAdd").addEventListener("click", add);
    $("wishInput").addEventListener("keydown", e => { if (e.key === "Enter") add(); e.stopPropagation(); });
  } };
})();
