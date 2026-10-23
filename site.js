/* ======================================================================
   Shared script for every page (site.js). Each part checks that its page has the element it needs, so one file serves all pages.
   EDIT ME. Everything you will change often is in this block.
   - The figure gallery is switched off. Its code is kept as comments marked "GALLERY (disabled)" in index.html and in this file; uncomment all of them to bring it back, then add a figure by copying the image into assets/ and adding one line to FIGURES.
   - Captions may contain simple HTML such as <sub> and <sup>.
   - Set SHOW_PLACEHOLDER_TAGS to false once you have replaced the sample media.
   - Put your LLNL release numbers in RELEASE_NUMBER (Richtmyer–Meshkov movies with reshock), RELEASE_NUMBER_RM_SINGLE (single-shock Richtmyer–Meshkov movies), RELEASE_NUMBER_TGV (Taylor–Green movies) and RELEASE_NUMBER_TGV_SS (supersonic Taylor–Green movies) below.
   - Contact links (shown on the home page) are in CONTACT. The email is given as user and domain, so the plain address is not written in the page; visitors see it spelled out ("name at domain dot edu"), and the link still uses the real address. Add copy: true to an entry to show a Copy button next to it.
   ====================================================================== */
const SHOW_PLACEHOLDER_TAGS = true;
const RELEASE_NUMBER = "LLNL-PRES-2008060";       /* the Richtmyer–Meshkov movies with reshock; empty shows an "add release number" tag */
const RELEASE_NUMBER_RM_SINGLE = "LLNL-PRES-854267";   /* the single-shock Richtmyer–Meshkov movies */
const RELEASE_NUMBER_TGV = "LLNL-PRES-2009903";   /* the Taylor–Green vortex movies */
const RELEASE_NUMBER_TGV_SS = "LLNL-PRES-2021958";   /* the supersonic Taylor–Green movies */

/* GALLERY (disabled): the figure list. Uncomment together with the gallery blocks.
const FIGURES = [
  { src: "assets/fig-vorticity-early.jpg", w: 1080, h: 930, placeholder: true,
    title: "Vorticity at early times",
    caption: "ω<sub>z</sub> at t = 1.2. Thin filaments are being stretched out of the initial blobs.",
    meta: "256² · ν = 2×10⁻⁴",
    alt: "Vorticity field with thin blue and orange filaments on a dark background" },
  { src: "assets/fig-vorticity-late.jpg", w: 1080, h: 930, placeholder: true,
    title: "Vorticity at late times",
    caption: "ω<sub>z</sub> at t = 6.0. Same-sign vortices have merged into coherent cores.",
    meta: "256² · ν = 2×10⁻⁴",
    alt: "Vorticity field with round coherent vortices of both signs" },
  { src: "assets/fig-okubo-weiss.jpg", w: 1080, h: 930, placeholder: true,
    title: "Rotation versus strain",
    caption: "Okubo–Weiss parameter W/σ<sub>W</sub> at t = 3.0. Blue marks rotation-dominated cores, orange marks strain.",
    meta: "256² · ν = 2×10⁻⁴",
    alt: "Okubo-Weiss field with blue vortex cores surrounded by orange strain regions" },
  { src: "assets/fig-spectrum.png", w: 1080, h: 810, placeholder: true,
    title: "Kinetic energy spectrum",
    caption: "E(k) at four times, with a k<sup>−3</sup> guide line.",
    meta: "log–log · shell-summed",
    alt: "Log-log plot of energy spectra at four times with a dashed guide line" },
  { src: "assets/fig-decay.png", w: 1080, h: 690, placeholder: true,
    title: "Decay of energy and enstrophy",
    caption: "Kinetic energy and enstrophy, each normalised by its initial value.",
    meta: "t = 0 to 6",
    alt: "Line plot of normalised kinetic energy and enstrophy against time" },
  { src: "assets/fig-tgv-slice.png", w: 1080, h: 930, placeholder: true,
    title: "Taylor–Green vortex initial condition",
    caption: "Speed and streamlines on the z = 0 plane for the analytic initial field.",
    meta: "analytic",
    alt: "Speed contours with streamlines showing four counter-rotating vortex cells" }
];
*/

const CONTACT = [
  { label: "Email", user: "vzendeja", domain: "caltech.edu" },   /* shown as "vzendeja at caltech dot edu"; the address is only put together when the page runs */
  { label: "LinkedIn", value: "linkedin.com/in/victorzendejaslopez", href: "https://www.linkedin.com/in/victorzendejaslopez" },
  { label: "GitHub", value: "github.com/vzendejasl", href: "https://github.com/vzendejasl" }
];
/* ================= end of the part you edit ================= */

const $ = (s, r) => (r || document).querySelector(s);
const root = document.documentElement;
const phTag = () => '<span class="ph">placeholder</span>';
if (!SHOW_PLACEHOLDER_TAGS) root.classList.add("no-ph");

/* open every page at the top.
   A page reached by clicking a link starts at the top (or at its #section). A page shown inside a frame that keeps
   its own scroll position, such as a preview window, can open part-way down instead, so the page asks for the top itself.
   Reload, Back and Forward are left alone, so the browser still returns you to where you were. */
(function () {
  if (location.hash) return;
  const nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
  if (nav && nav.type !== "navigate") return;
  let moved = false;
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach((n) => addEventListener(n, () => { moved = true; }, { passive: true, once: true }));
  const toTop = () => {
    try { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); } catch (e) { window.scrollTo(0, 0); }
    if (window.parent !== window) { try { document.body.scrollIntoView({ block: "start", behavior: "instant" }); } catch (e) {} }
  };
  toTop();
  requestAnimationFrame(() => { if (!moved) toTop(); });
  addEventListener("load", () => { if (!moved) toTop(); });
})();

/* theme toggle */
const themeBtn = $("#theme");
const isDark = () => {
  const a = root.getAttribute("data-theme");
  return a ? a === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
};
const themeLabel = () => { if (themeBtn) themeBtn.textContent = isDark() ? "Light mode" : "Dark mode"; };
try { const s = localStorage.getItem("theme"); if (s) root.setAttribute("data-theme", s); } catch (e) {}
themeLabel();
if (themeBtn) themeBtn.addEventListener("click", () => {
  const next = isDark() ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
  themeLabel();
});
try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", themeLabel); } catch (e) {}

/* release number */
document.querySelectorAll(".release-num").forEach((rel) => {
  const num = { tgv: RELEASE_NUMBER_TGV, tgvss: RELEASE_NUMBER_TGV_SS, rmsingle: RELEASE_NUMBER_RM_SINGLE }[rel.dataset.release] || (rel.dataset.release ? "" : RELEASE_NUMBER);
  if (num) { rel.classList.add("mono"); rel.textContent = num; }
  else { rel.classList.add("todo"); rel.textContent = "add release number"; }
});

/* lead movie on the 2D Richtmyer–Meshkov page: plays on load, with a Pause button once it has data */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
(function () {
  const hero = $("#hero-video"), heroBtn = $("#hero-toggle");
  if (!hero || !heroBtn) return;
  if (reduce) hero.removeAttribute("autoplay");
  function heroReady() {
    heroBtn.hidden = false;
    if (reduce) { hero.pause(); heroBtn.textContent = "Play"; heroBtn.setAttribute("aria-label", "Play animation"); }
  }
  hero.addEventListener("loadeddata", heroReady);
  if (hero.readyState >= 2) heroReady();
  heroBtn.addEventListener("click", () => {
    if (hero.paused) { hero.play().catch(() => {}); heroBtn.textContent = "Pause"; heroBtn.setAttribute("aria-label", "Pause animation"); }
    else { hero.pause(); heroBtn.textContent = "Play"; heroBtn.setAttribute("aria-label", "Play animation"); }
  });
})();

/* the second 2D movie (no mesh): plays while it is on screen, pauses when it is not, and has its own button */
(function () {
  const v = $("#amr-nomesh"), btn = $("#amr-nomesh-toggle");
  if (!v || !btn) return;
  let userPaused = reduce;
  const sync = () => {
    btn.textContent = v.paused ? "Play" : "Pause";
    btn.setAttribute("aria-label", v.paused ? "Play animation" : "Pause animation");
  };
  const enable = () => { btn.disabled = false; sync(); };
  v.addEventListener("loadedmetadata", enable);
  if (v.readyState >= 1) enable();
  v.addEventListener("play", sync);
  v.addEventListener("pause", sync);
  btn.addEventListener("click", () => {
    if (v.paused) { userPaused = false; v.play().catch(() => {}); } else { userPaused = true; v.pause(); }
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      const on = entries[entries.length - 1].isIntersecting;
      if (on && !userPaused && v.paused) v.play().catch(() => {});
      else if (!on && !v.paused) v.pause();
    }, { threshold: 0.25 }).observe(v);
  }
})();

/* GALLERY (disabled)
// gallery builder
const grid = $("#gallery-grid");
FIGURES.forEach((f, i) => {
  const fig = document.createElement("figure");
  fig.innerHTML =
    '<button class="fig-btn" type="button" data-i="' + i + '" aria-label="Enlarge: ' + f.alt.replace(/"/g, "&quot;") + '">' +
    '<img src="' + f.src + '" width="' + f.w + '" height="' + f.h + '" loading="lazy" alt="' + f.alt.replace(/"/g, "&quot;") + '"></button>' +
    "<figcaption><h3>" + f.title + "</h3><p>" + f.caption + "</p>" +
    '<p class="meta"><span>' + (f.meta || "") + "</span>" + (f.placeholder ? phTag() : "") + "</p></figcaption>";
  grid.appendChild(fig);
});
*/

/* preview cards on the home page: each short loop plays while its card is on screen and is paused otherwise.
   Nothing downloads until a card is close to the screen. A button pauses all of them. */
(function () {
  const vids = [...document.querySelectorAll("video[data-preview]")];
  const btn = $("#prev-toggle");
  if (!vids.length) return;
  let on = !reduce, visible = new Set();
  const label = () => { if (btn) { btn.textContent = on ? "Pause previews" : "Play previews"; btn.setAttribute("aria-pressed", String(!on)); } };
  const update = (v) => { if (on && visible.has(v)) v.play().catch(() => {}); else v.pause(); };
  const wake = (v) => { if (v.preload !== "auto") { v.preload = "auto"; v.load(); } };
  if (btn) btn.addEventListener("click", () => { on = !on; label(); vids.forEach(update); });
  label();
  if (!("IntersectionObserver" in window)) { vids.forEach((v) => { wake(v); visible.add(v); update(v); }); return; }
  const near = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { wake(e.target); near.unobserve(e.target); } });
  }, { rootMargin: "300px 0px" });
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); update(e.target); });
  }, { threshold: 0.35 });
  vids.forEach((v) => { near.observe(v); seen.observe(v); });
})();

/* synchronized movies: one clock, one set of controls per group.
   A group is any element with data-sync-group that holds .sync-btn, .sync-range, .sync-time and a .sync-media box of videos.
   The movie that lasts longest is the clock. A shorter movie holds its last frame until the clock loops.
   A group with data-lazy starts loading its movies shortly before it scrolls into view. */
function initSyncGroup(root) {
  const grid = root.querySelector(".sync-media"), btn = root.querySelector(".sync-btn"),
        range = root.querySelector(".sync-range"), label = root.querySelector(".sync-time");
  if (!grid || !btn || !range || !label) return;
  const vids = [...grid.querySelectorAll("video")];
  const fmt = (s) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
  const lastFrame = (v) => Math.max(0, v.duration - 0.04);
  let dur = 0, master = vids[0], ready = false, playing = false, userPaused = reduce, visible = false, dragging = false, raf = 0;

  function setBtn() {
    btn.textContent = playing ? "Pause" : "Play";
    btn.setAttribute("aria-label", playing ? "Pause all the movies" : "Play all the movies");
  }
  function ui(t) {
    range.value = String(dur ? Math.round((t / dur) * 1000) : 0);
    label.textContent = fmt(t) + " / " + fmt(dur);
  }
  function seek(t) {
    t = Math.max(0, Math.min(t, dur));
    vids.forEach((v) => { v.currentTime = Math.min(t, lastFrame(v)); });
    ui(t);
  }
  function play() {
    if (!ready) return;
    if (master.currentTime >= dur - 0.05) seek(0);
    playing = true; setBtn();
    vids.forEach((v) => { if (v.currentTime < lastFrame(v)) v.play().catch(() => {}); });
    cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  }
  function pause() {
    playing = false; setBtn(); cancelAnimationFrame(raf);
    vids.forEach((v) => v.pause());
  }
  function tick() {
    if (!playing) return;
    const t = master.currentTime;
    if (master.ended || t >= dur - 0.05) {
      seek(0); vids.forEach((v) => v.play().catch(() => {}));
    } else {
      vids.forEach((v) => {
        if (v === master) return;
        if (t >= lastFrame(v)) { if (!v.paused) v.pause(); }
        else {
          if (v.paused) v.play().catch(() => {});
          if (Math.abs(v.currentTime - t) > 0.15) v.currentTime = t;
        }
      });
      if (!dragging) ui(t);
    }
    raf = requestAnimationFrame(tick);
  }
  function toggle() {
    if (!ready) return;
    if (playing) { userPaused = true; pause(); } else { userPaused = false; play(); }
  }

  range.addEventListener("input", () => { dragging = true; if (ready) seek((range.value / 1000) * dur); });
  const endDrag = () => { dragging = false; };
  ["change", "pointerup", "pointercancel", "blur"].forEach((n) => range.addEventListener(n, endDrag));
  btn.addEventListener("click", toggle);
  grid.addEventListener("click", toggle);

  const canPlay = () => Promise.race([
    Promise.all(vids.map((v) => (v.readyState >= 3 ? 0 : new Promise((r) => v.addEventListener("canplay", r, { once: true }))))),
    new Promise((r) => setTimeout(r, 6000))
  ]);
  function autoplayWhenVisible() {
    const go = () => canPlay().then(() => { if (visible && !userPaused && !playing) play(); });
    if (!("IntersectionObserver" in window)) { visible = true; if (!userPaused) go(); return; }
    new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) { if (!userPaused && !playing) go(); }
      else if (playing) pause();
    }, { threshold: 0.2 }).observe(grid);
  }

  Promise.all(vids.map((v) => (v.readyState >= 1 ? 0 : new Promise((r) => v.addEventListener("loadedmetadata", r, { once: true }))))).then(() => {
    dur = Math.max(...vids.map((v) => v.duration));
    master = vids.reduce((a, b) => (b.duration > a.duration ? b : a));
    vids.forEach((v) => {
      v.loop = false;
      if (v.duration < dur - 0.5) { const note = v.closest("figure").querySelector(".sync-note"); if (note) note.textContent = " · ends at " + fmt(v.duration) + ", last frame held"; }
    });
    ready = true; btn.disabled = false; range.disabled = false; setBtn(); ui(0);
    if (reduce) seek(dur * 0.45);
    autoplayWhenVisible();
  });

  if (root.hasAttribute("data-lazy")) {
    const wake = () => vids.forEach((v) => { v.preload = "auto"; v.load(); });
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { io.disconnect(); wake(); }
      }, { rootMargin: "600px 0px" });
      io.observe(grid);
    } else wake();
  }
}
document.querySelectorAll("[data-sync-group]").forEach(initSyncGroup);

/* contact */
const list = $("#contact-list");
if (list) CONTACT.forEach((c) => {
  const li = document.createElement("li");
  const label = document.createElement("span"); label.className = "label"; label.textContent = c.label;
  const val = document.createElement("span"); val.className = "val";
  const addr = c.user ? c.user + "@" + c.domain : "";
  const shown = addr ? c.user + " at " + c.domain.replace(/\./g, " dot ") : c.value;
  const href = addr ? "mailto:" + addr : c.href;
  if (href) {
    const a = document.createElement("a"); a.href = href; a.textContent = shown;
    if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
    val.appendChild(a);
  } else val.textContent = shown;
  li.append(label, val);
  if (c.copy) {
    const b = document.createElement("button"); b.type = "button"; b.className = "btn"; b.textContent = "Copy";
    b.addEventListener("click", () => {
      const done = () => { b.textContent = "Copied"; setTimeout(() => { b.textContent = "Copy"; }, 1600); };
      const fallback = () => { const r = document.createRange(); r.selectNodeContents(val); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Selected"; };
      try { navigator.clipboard.writeText(addr || c.value).then(done, fallback); } catch (e) { fallback(); }
    });
    li.appendChild(b);
  }
  if (c.placeholder) li.insertAdjacentHTML("beforeend", phTag());
  list.appendChild(li);
});

/* GALLERY (disabled)
// lightbox
const lb = $("#lb"), lbImg = $("#lb-img"), lbTitle = $("#lb-title"), lbText = $("#lb-text"), lbCount = $("#lb-count");
let cur = 0, opener = null;
function show(i) {
  cur = (i + FIGURES.length) % FIGURES.length;
  const f = FIGURES[cur];
  lbImg.src = f.src; lbImg.alt = f.alt;
  lbTitle.innerHTML = f.title;
  lbText.innerHTML = f.caption + (f.placeholder ? " " + phTag() : "");
  lbCount.textContent = (cur + 1) + " / " + FIGURES.length;
}
function openLb(i, from) {
  opener = from || null; show(i); lb.hidden = false; root.style.overflow = "hidden"; $("#lb-close").focus();
}
function closeLb() {
  lb.hidden = true; root.style.overflow = ""; lbImg.removeAttribute("src");
  if (opener) opener.focus();
}
grid.addEventListener("click", (e) => {
  const b = e.target.closest(".fig-btn"); if (b) openLb(+b.dataset.i, b);
});
$("#lb-close").addEventListener("click", closeLb);
$("#lb-prev").addEventListener("click", () => show(cur - 1));
$("#lb-next").addEventListener("click", () => show(cur + 1));
lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-stage")) closeLb(); });
document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLb();
  else if (e.key === "ArrowLeft") show(cur - 1);
  else if (e.key === "ArrowRight") show(cur + 1);
  else if (e.key === "Tab") {
    const f = [$("#lb-prev"), $("#lb-next"), $("#lb-close")];
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
  }
});
*/
