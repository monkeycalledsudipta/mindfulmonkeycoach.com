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

  /* YouTube: muted background video on the home hero (photo stays underneath until it plays),
     and an on-page player for every [data-yt] link. Off for ?static and reduced motion. */
  var still = /[?&]static\b/.test(location.search) || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var NC = "https://www.youtube-nocookie.com/embed/";
  var bg = document.querySelector("[data-yt-bg]");
  if (bg && !still) {
    var bid = bg.getAttribute("data-yt-bg");
    var f = document.createElement("iframe");
    f.src = NC + bid + "?autoplay=1&mute=1&loop=1&playlist=" + bid + "&controls=0&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&fs=0";
    f.allow = "autoplay; encrypted-media; picture-in-picture";
    f.title = "Background video"; f.tabIndex = -1;
    f.addEventListener("load", function () { setTimeout(function () { bg.classList.add("on"); }, 2200); });
    bg.appendChild(f);
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
        if (!was) b.classList.add("open");
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
