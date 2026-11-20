// Mindful Monkey site behaviour: header, mobile menu, reveal on scroll, WhatsApp form,
// local-currency prices, and the floating bubbles on the About page.
(function () {
  var WA = "919711013282";
  var waUrl = function (text) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text); };

  /* header: transparent over the home hero, solid after scrolling */
  var hdr = document.querySelector(".site-header");
  var overHero = hdr && hdr.classList.contains("over");
  function onScroll() {
    if (!overHero) return;
    if (window.scrollY > 60 || hdr.classList.contains("open")) hdr.classList.remove("over");
    else hdr.classList.add("over");
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* mobile menu */
  var btn = document.querySelector(".menu-btn"), links = document.querySelector(".links");
  if (btn && links) btn.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    hdr.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
    onScroll();
  });

  /* reveal */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("in"); });

  /* course cards turn blue on hover; touch screens have no hover, so there the card crossing the middle of the screen lights up */
  if (window.matchMedia && window.matchMedia("(hover: none)").matches && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle("lit", e.isIntersecting); });
    }, { rootMargin: "-42% 0px -42% 0px" });
    document.querySelectorAll(".card").forEach(function (c) { cio.observe(c); });
  }

  /* WhatsApp form: composes a message and opens WhatsApp (no data stored anywhere) */
  document.querySelectorAll("form.wa-form").forEach(function (f) {
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = (f.elements.name.value || "").trim();
      var phone = (f.elements.phone.value || "").trim();
      var interest = f.elements.interest.value;
      var join = f.elements.join && f.elements.join.checked;
      var msg = "Hi Sudipta, I am " + (name || "interested in your coaching") + (name ? "." : "") +
        (interest && interest !== "Not sure yet" ? " I am interested in " + interest + "." : " I am not sure which course suits me yet. Can you help me choose?") +
        (phone ? " My WhatsApp number is " + phone + "." : "") +
        (join ? " I would also like to join your daily WhatsApp group." : "");
      window.open(waUrl(msg), "_blank", "noopener");
    });
  });

  /* prices in the visitor's local currency (from the device time zone). INR if unknown or offline. */
  var tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
  var CA = /^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|St_Johns|Regina|Montreal)/;
  var EUR = /^Europe\/(Dublin|Paris|Berlin|Madrid|Rome|Amsterdam|Brussels|Vienna|Lisbon|Athens|Helsinki|Luxembourg|Monaco|Bratislava|Ljubljana|Tallinn|Riga|Vilnius|Valletta|Zagreb)/;
  var cur = /^Asia\/(Kolkata|Calcutta)$/.test(tz) ? "INR"
    : CA.test(tz) ? "CAD"
    : /^(America|US)\//.test(tz) || /^Pacific\/Honolulu/.test(tz) ? "USD"
    : /^Europe\/London/.test(tz) ? "GBP"
    : EUR.test(tz) ? "EUR"
    : /^Australia\//.test(tz) ? "AUD"
    : /^Pacific\/Auckland/.test(tz) ? "NZD"
    : /^Asia\/Dubai/.test(tz) ? "AED"
    : /^Asia\/Singapore/.test(tz) ? "SGD"
    : "INR";
  var nodes = document.querySelectorAll("[data-inr]");
  if (cur !== "INR" && nodes.length) {
    var KEY = "mm_fx_v2", rates = null;
    try { var c = JSON.parse(sessionStorage.getItem(KEY) || "null"); if (c && Date.now() - c.t < 6 * 3600e3) rates = c.r; } catch (e) {}
    var apply = function (r) {
      if (!r || !r[cur]) return;
      var fmt; try { fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: cur, maximumFractionDigits: 0 }); } catch (e) { return; }
      nodes.forEach(function (n) {
        var v = parseFloat(n.getAttribute("data-inr")) * r[cur];
        v = v > 200 ? Math.round(v / 5) * 5 : Math.round(v);
        n.textContent = fmt.format(v);
        n.title = "Approximate. Billed as ₹" + Number(n.getAttribute("data-inr")).toLocaleString("en-IN");
      });
      document.querySelectorAll(".fx-note").forEach(function (n) { n.textContent = "Prices shown in " + cur + " for your location, converted from INR. Sudipta bills in INR."; });
    };
    if (rates) apply(rates);
    else fetch("https://open.er-api.com/v6/latest/INR").then(function (r) { return r.json(); }).then(function (d) {
      if (d && d.rates) { try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), r: d.rates })); } catch (e) {} apply(d.rates); }
    }).catch(function () {});
  }

  /* Home hero: a self-hosted, silent loop (images/hero-loop*.mp4, cut from "Back to your roots" from 0:41).
     A plain muted <video playsinline> autoplays on phones too, which the YouTube embed never did.
     Phones get the smaller portrait crop. The photo stays underneath until the video is actually playing.
     Off for ?static, reduced motion and data-saver. */
  var still = /[?&]static(?:[=&#]|$)/.test(location.search) || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var NC = "https://www.youtube-nocookie.com/embed/";
  var hv = document.querySelector("video.hero-vid");
  var saveData = navigator.connection && navigator.connection.saveData;
  if (hv && !still && !saveData) {
    var small = window.matchMedia("(max-width: 760px)").matches;
    hv.muted = true; hv.defaultMuted = true; hv.setAttribute("muted", "");
    hv.src = hv.getAttribute(small ? "data-sm" : "data-lg");
    hv.preload = "auto";
    hv.addEventListener("playing", function () { hv.classList.add("on"); });
    var tryPlay = function () { var pr = hv.play(); if (pr && pr.catch) pr.catch(function () {}); };
    tryPlay();
    // iOS Low Power Mode blocks autoplay; the first touch anywhere starts it instead
    var kick = function () { if (hv.paused) tryPlay(); window.removeEventListener("touchstart", kick); window.removeEventListener("scroll", kick); };
    window.addEventListener("touchstart", kick, { passive: true }); window.addEventListener("scroll", kick, { passive: true });
    document.addEventListener("visibilitychange", function () { if (!document.hidden && hv.paused) tryPlay(); });
  }
  var modal = null;
  function closeYt() { if (modal) { modal.remove(); modal = null; document.body.style.overflow = ""; } }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-yt]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    var t = a.getAttribute("data-t");
    modal = document.createElement("div");
    modal.className = "ytm" + (a.hasAttribute("data-short") ? " short" : "");
    modal.innerHTML = '<div class="box"><button class="x" aria-label="Close video">×</button><iframe allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="Video"></iframe></div>';
    modal.querySelector("iframe").src = NC + a.getAttribute("data-yt") + "?autoplay=1&rel=0&playsinline=1" + (t ? "&start=" + t : "");
    modal.addEventListener("click", function (ev) { if (ev.target === modal || ev.target.classList.contains("x")) closeYt(); });
    document.body.appendChild(modal); document.body.style.overflow = "hidden";
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeYt(); });

  /* video carousel: arrows, swipe (native scroll), mouse drag, dots, gentle auto-slide that pauses on hover/touch */
  document.querySelectorAll("[data-car]").forEach(function (car) {
    var tr = car.querySelector(".car-track"), prev = car.querySelector(".prev"), next = car.querySelector(".next"), dotsEl = car.querySelector(".car-dots");
    var items = [].slice.call(tr.children);
    var max = function () { return tr.scrollWidth - tr.clientWidth - 2; };
    // index of the first item whose left edge is in view
    var cur = function () { var x = tr.scrollLeft, on = 0; items.forEach(function (it, i) { if (it.offsetLeft - items[0].offsetLeft <= x + 10) on = i; }); return on; };
    var to = function (i) { tr.scrollTo({ left: items[Math.max(0, Math.min(items.length - 1, i))].offsetLeft - items[0].offsetLeft, behavior: "smooth" }); };
    var go = function (dir) {
      if (dir > 0 && tr.scrollLeft >= max()) to(0);
      else if (dir < 0 && tr.scrollLeft <= 2) tr.scrollTo({ left: tr.scrollWidth, behavior: "smooth" });
      else to(cur() + dir);
    };
    var until = 0, hold = function () { until = Date.now() + 9000; };
    prev.addEventListener("click", function () { go(-1); hold(); });
    next.addEventListener("click", function () { go(1); hold(); });
    items.forEach(function (it, i) { var d = document.createElement("button"); d.type = "button"; d.tabIndex = -1; d.addEventListener("click", function () { to(i); hold(); }); dotsEl.appendChild(d); });
    var dots = [].slice.call(dotsEl.children);
    var sync = function () {
      var on = tr.scrollLeft >= max() ? items.length - 1 : cur();
      dots.forEach(function (d, i) { d.classList.toggle("on", i === on); });
      car.classList.toggle("at-start", tr.scrollLeft <= 2);
    };
    tr.addEventListener("scroll", function () { requestAnimationFrame(sync); }, { passive: true });
    window.addEventListener("resize", sync); sync();
    // mouse drag (touch uses native swipe); a drag must not open the video
    var down = null, moved = false;
    tr.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse" || e.button) return; down = { x: e.clientX, l: tr.scrollLeft }; moved = false; });
    window.addEventListener("pointermove", function (e) {
      if (!down) return; var dx = e.clientX - down.x;
      if (Math.abs(dx) > 6) { moved = true; car.classList.add("drag"); tr.scrollLeft = down.l - dx; }
    });
    window.addEventListener("pointerup", function () { if (down) { down = null; car.classList.remove("drag"); if (moved) { to(cur()); hold(); } } });
    tr.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    tr.addEventListener("dragstart", function (e) { e.preventDefault(); });
    // auto-slide every 4.5s; pauses while hovered, touched, off screen or a video is open; off for ?static and reduced motion
    var paused = false, seen = true;
    car.addEventListener("mouseenter", function () { paused = true; });
    car.addEventListener("mouseleave", function () { paused = false; });
    tr.addEventListener("touchstart", hold, { passive: true });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }).observe(car);
    if (!still) setInterval(function () { if (!paused && seen && Date.now() > until && !document.hidden && !document.querySelector(".ytm")) go(1); }, 4500);
  });

  /* About page bubbles: gentle float, drift away from the cursor, tap/click opens a short line */
  var orbit = document.querySelector(".orbit");
  if (orbit) {
    var bubs = [].slice.call(orbit.querySelectorAll(".bub"));
    var mouse = null, t0 = performance.now();
    var st = bubs.map(function (b, i) { return { b: b, ox: 0, oy: 0, ph: i * 1.7, sp: 0.5 + (i % 3) * 0.17 }; });
    orbit.addEventListener("mousemove", function (e) { var r = orbit.getBoundingClientRect(); mouse = [e.clientX - r.left, e.clientY - r.top]; });
    orbit.addEventListener("mouseleave", function () { mouse = null; });
    bubs.forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        var was = b.classList.contains("open");
        bubs.forEach(function (x) { x.classList.remove("open"); });
        if (!was) {
          // keep the tooltip on screen (bubbles near a phone's edge would push it off)
          var tip = b.querySelector(".tip");
          if (tip) {
            tip.style.setProperty("--tx", "0px");
            var tr = tip.getBoundingClientRect(), vw = document.documentElement.clientWidth, sh = 0;
            if (tr.right > vw - 10) sh = vw - 10 - tr.right; else if (tr.left < 10) sh = 10 - tr.left;
            tip.style.setProperty("--tx", sh + "px");
          }
          b.classList.add("open");
        }
      });
    });
    document.addEventListener("click", function () { bubs.forEach(function (x) { x.classList.remove("open"); }); });
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function tick(now) {
      var t = (now - t0) / 1000;
      st.forEach(function (s) {
        var fx = Math.sin(t * s.sp + s.ph) * 7, fy = Math.cos(t * s.sp * 0.8 + s.ph) * 9;
        var px = 0, py = 0;
        if (mouse) {
          var r = s.b.offsetLeft, q = s.b.offsetTop;
          var dx = r - mouse[0], dy = q - mouse[1], d = Math.hypot(dx, dy) || 1;
          if (d < 170) { var k = (170 - d) / 170 * 46; px = dx / d * k; py = dy / d * k; }
        }
        s.ox += (px - s.ox) * 0.08; s.oy += (py - s.oy) * 0.08;
        s.b.style.transform = "translate(" + (fx + s.ox).toFixed(1) + "px," + (fy + s.oy).toFixed(1) + "px)";
      });
      requestAnimationFrame(tick);
    }
    if (!reduce) requestAnimationFrame(tick);
  }
})();
