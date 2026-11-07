/* Hero parallax + gold glow that follows the pointer (desktop only) */
(() => {
  const sc = document.getElementById("heroScene");
  if (matchMedia("(pointer:coarse)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  sc.addEventListener("pointermove", e => {
    const bg = sc.querySelector(".hero-bg");
    if (bg) bg.style.transform = `scale(1.1) translate(${(e.clientX / innerWidth - .5) * -24}px,${(e.clientY / innerHeight - .5) * -24}px)`;
    sc.style.setProperty("--mx", e.clientX + "px"); sc.style.setProperty("--my", e.clientY + "px");
  });
})();
