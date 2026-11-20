// Storyline monkeys: the logo monkey as a gold outline, one pose per section. Desktop uses the side
// margins at full size; tablets and phones (< 1100px) get a smaller monkey on the same rules.
// Rules: it never overlaps a photo, box, button or text, and it is always grounded:
// it stands or sits on a real surface (the floor of a section's side margin, or the top edge of a
// photo / card / box). It never floats in mid-air. The footer meditation monkey is drawn at build time.
(function () {
  var R = window.MonkeyRig; if (!R) return;
  var P = R.POSES, S = 1.6, PAD = 14, GOLD = "#D4A62A", MOB = false, K = 1; // K scales hop/arc distances with S
  var STAND = ["ready", "scratch", "tree", "hips", "handstand"]; // for floors
  var SIT = ["sitwave", "peekaboo"];                              // for sitting on a box edge
  var BOX = "img,.vid,.banner,.card,.form,.orbit .me,.t,.sc,.igrid>div,.ptable,.im,.status,.callout";
  function doc(q) { return { x0: q.left + scrollX, y0: q.top + scrollY, x1: q.right + scrollX, y1: q.bottom + scrollY }; }
  function hit(a, b) { return a.x0 < b.x1 + PAD && a.x1 + PAD > b.x0 && a.y0 < b.y1 + PAD && a.y1 + PAD > b.y0; }
  function visible(e) { var q = e.getBoundingClientRect(); return q.width > 40 && q.height > 40; }
  function blockers() {
    var out = [], tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n;
    while ((n = tw.nextNode())) {
      if (!n.textContent.trim()) continue;
      var el = n.parentElement; if (!el || el.closest("style,script,svg,.links,.tip")) continue;
      var r = document.createRange(); r.selectNodeContents(n);
      [].forEach.call(r.getClientRects(), function (q) { if (q.width > 0 && q.height > 0) out.push(doc(q)); });
    }
    document.querySelectorAll(BOX + ",.bub,.btn,.site-header,.wa-float,input,select,.faq,.orbit").forEach(function (e) {
      var q = e.getBoundingClientRect(); if (q.width && q.height) out.push(doc(q));
    });
    return out;
  }
  function bg(el) {
    for (var e = el; e; e = e.parentElement) {
      var c = getComputedStyle(e).backgroundColor, m = c.match(/[\d.]+/g);
      if (m && (m.length < 4 || +m[3] > 0.5)) return c;
    }
    return "#ffffff";
  }
  // box of a pose whose lowest point (feet, or hands for a handstand) sits exactly on y
  function geom(pose, x, y, face) {
    var d = R.draw(P[pose], { lw: 1.5 });
    var low = Math.max.apply(null, d.feet.map(function (f) { return Math.max(f.ankle[1], f.toe[1]) + 3; }).concat(d.hands.map(function (h) { return h[1] + 4; })));
    var b = d.bbox, oy = y - low * S, xs = [x + b.x0 * S * face, x + b.x1 * S * face];
    return { oy: oy, box: { x0: Math.min(xs[0], xs[1]), x1: Math.max(xs[0], xs[1]), y0: oy + b.y0 * S, y1: y } };
  }
  var placed = [];
  function put(pose, x, y, face, sec) {
    var g = geom(pose, x, y, face);
    var d = R.draw(P[pose], { line: GOLD, fill: bg(sec), lw: 1.5 });
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "mkr pre"); s.setAttribute("aria-hidden", "true");
    s.setAttribute("style", "position:absolute;left:0;top:0;width:1px;height:1px;overflow:visible;z-index:6;pointer-events:none");
    s.innerHTML = '<g transform="translate(' + x + " " + g.oy + ") scale(" + S * face + " " + S + ')">' + d.svg + "</g>";
    document.body.appendChild(s); placed.push({ s: s, sec: sec, spot: { pose: pose, x: x, y: y, face: face, fill: bg(sec) } });
    return g.box;
  }
  function clear() { placed.forEach(function (p) { p.s.remove(); }); placed = []; stopTravel(); }
  // the monkey may touch its surface, so the overlap test ignores its bottom padding
  function clearOf(box, B) { var t = { x0: box.x0, x1: box.x1, y0: box.y0, y1: box.y1 - PAD - 1 }; return !B.some(function (b) { return hit(t, b); }); }

  // y (page coords) of the wave's top curve at page-x, read from the SVG path itself
  function curveY(svg, x) {
    if (!svg) return null;
    var path = svg.querySelectorAll("path")[1], q = doc(svg.getBoundingClientRect());
    var u = (x - q.x0) / (q.x1 - q.x0); if (/scaleX\(-1\)/.test(svg.getAttribute("style") || "")) u = 1 - u;
    var tx = u * 1440, L = path.getTotalLength(), lo = 0, hi = L;
    for (var k = 0; k < 30; k++) { var m = (lo + hi) / 2; if (path.getPointAtLength(m).x < tx) lo = m; else hi = m; }
    return q.y0 + path.getPointAtLength(lo).y * (q.y1 - q.y0) / 150;
  }
  function place() {
    clear();
    var W = document.documentElement.clientWidth;
    MOB = W < 1100; S = W < 600 ? 0.62 : MOB ? 0.9 : 1.6; PAD = MOB ? 8 : 14; K = S / 1.6;
    var B = blockers();
    var secs = [].slice.call(document.querySelectorAll("main > section")).filter(function (s) { return !s.classList.contains("workout") && !s.classList.contains("hero"); });
    var si = 0, ti = 0, side = 0;
    secs.forEach(function (sec) {
      var r = doc(sec.getBoundingClientRect()); if (r.y1 - r.y0 < (MOB ? 180 : 260)) return;
      var next = sec.nextElementSibling, wavyBelow = next && next.classList.contains("wave-top");
      // floor: the visible edge between this section and the next (a wave curve, a colour change or a rule line)
      var cands = [];
      var m = MOB ? Math.round(32 * S / 0.62) : 90; // phones: just inside the page gutter
      var gx = side ? [[m, 1], [W - m, -1]] : [[W - m, -1], [m, 1]];
      if (MOB) gx.push([Math.round(W * (side ? 0.3 : 0.7)), side ? 1 : -1]);
      var edgeVisible = next && (wavyBelow || bg(next) !== bg(sec) || parseFloat(getComputedStyle(next).borderTopWidth) > 0);
      if (edgeVisible) gx.forEach(function (g) {
        var y = wavyBelow ? curveY(next.querySelector(".wave"), g[0]) : r.y1;
        if (y != null) cands.push({ x: g[0], y: y + 1, face: g[1], kind: "stand" });
      });
      // tops of boxes inside this section: sit near either top corner
      sec.querySelectorAll(BOX).forEach(function (e) {
        if (!visible(e)) return;
        var q = doc(e.getBoundingClientRect());
        if (q.x1 - q.x0 < 180) return;
        var ins = Math.round(50 * K) + (MOB ? 6 : 0);
        cands.push({ x: q.x1 - ins, y: q.y0, face: -1, kind: "sit" });
        cands.push({ x: q.x0 + ins, y: q.y0, face: 1, kind: "sit" });
      });
      for (var i = 0; i < cands.length; i++) {
        var c = cands[i];
        var pose = c.kind === "sit" ? SIT[ti % SIT.length] : STAND[si % STAND.length];
        var g = geom(pose, c.x, c.y, c.face);
        if (g.box.x0 < 4 || g.box.x1 > W - 4 || g.box.y0 < r.y0 + (MOB ? 10 : 20)) continue;
        if (!clearOf(g.box, B)) continue;
        B.push(put(pose, c.x, c.y, c.face, sec));
        if (c.kind === "sit") ti++; else si++;
        side ^= 1; break;
      }
    });
    if (ANIM) { placed.forEach(function (p) { p.s.style.display = "none"; }); startTravel(); return; }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          placed.forEach(function (p) { if (p.sec === e.target) p.s.classList.remove("pre"); });
          io.unobserve(e.target);
        });
      }, { threshold: 0.2 });
      placed.forEach(function (p) { io.observe(p.sec); });
    } else placed.forEach(function (p) { p.s.classList.remove("pre"); });
  }

  /* ---------- scroll animation ----------
     One monkey travels down the page as you scroll. It holds a quirky pose at each spot, then hops to the
     next: an arc within the same side margin, or (when the next spot is on the other side or on a box)
     a quick hop out and back in, so it never sweeps across text. It lands meditating in the footer. */
  var ANIM = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) && !/[?&]static\b/.test(location.search);
  var trav = null, spots = [], foot = null, raf = 0;
  function footSpot() {
    var svg = document.querySelector(".mk-foot svg"); if (!svg) return null;
    var vb = svg.viewBox.baseVal, q = doc(svg.getBoundingClientRect()), k = (q.x1 - q.x0) / vb.width;
    var d = R.draw(P.meditate, { lw: 1.5 });
    var low = Math.max.apply(null, d.feet.map(function (f) { return Math.max(f.ankle[1], f.toe[1]) + 3; }).concat(d.hands.map(function (h) { return h[1] + 4; })));
    return { pose: "meditate", x: q.x0 + (0 - vb.x) * k, y: q.y0 + (low - vb.y) * k, face: 1, scale: k, fill: "#101B33", el: svg };
  }
  function startTravel() {
    spots = placed.map(function (p) { return p.spot; }).sort(function (a, b) { return a.y - b.y; });
    foot = footSpot();
    if (!spots.length && !foot) return;
    if (foot) { foot.el.style.transition = "opacity .35s"; foot.el.style.opacity = "0"; spots.push(foot); }
    // timing key: where the scroll line must be for the monkey to be at a spot (the footer must be reachable)
    var maxLine = document.documentElement.scrollHeight - innerHeight * 0.38 - 4;
    spots.forEach(function (sp) { sp.ty = Math.min(sp.y, maxLine); });
    var gapMin = MOB ? 90 : 120;
    for (var j = spots.length - 2; j >= 0; j--) if (spots[j].ty > spots[j + 1].ty - gapMin) spots[j].ty = spots[j + 1].ty - gapMin;
    trav = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    trav.setAttribute("class", "mkr mk-trav"); trav.setAttribute("aria-hidden", "true");
    trav.setAttribute("style", "position:absolute;left:0;top:0;width:1px;height:1px;overflow:visible;z-index:6;pointer-events:none;transition:none;will-change:contents");
    document.body.appendChild(trav);
    cacheSecs(); shown = null;
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }
  function stopTravel() {
    window.removeEventListener("scroll", onScroll);
    if (trav) trav.remove(); trav = null;
    var f = document.querySelector(".mk-foot svg"); if (f) f.style.opacity = "";
  }
  // the monkey follows a smoothed scroll position, so wheel steps become one continuous glide
  var shown = null;
  function target() { return scrollY + innerHeight * 0.62; }
  function tick() {
    raf = 0;
    var t = target();
    if (shown === null || Math.abs(t - shown) > innerHeight * 3) shown = t;
    shown += (t - shown) * 0.14;
    if (Math.abs(t - shown) < 0.5) shown = t;
    frame(shown);
    if (shown !== t) raf = requestAnimationFrame(tick);
  }
  function onScroll() { if (!raf) raf = requestAnimationFrame(tick); }
  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  var secCache = [];
  function cacheSecs() { secCache = [].map.call(document.querySelectorAll("main > section, footer"), function (e) { var r = doc(e.getBoundingClientRect()); return { y0: r.y0, y1: r.y1, c: bg(e) }; }); }
  function bgAt(y) {
    for (var i = 0; i < secCache.length; i++) if (y >= secCache[i].y0 && y < secCache[i].y1) return secCache[i].c;
    return "#ffffff";
  }
  var lastKey = "";
  function draw(pose, x, y, face, scale, alpha, fill) {
    var key = JSON.stringify([pose, Math.round(x), Math.round(y), face, scale.toFixed(3), alpha.toFixed(2), fill]);
    if (key === lastKey) return; lastKey = key;
    var d = R.draw(pose, { line: GOLD, fill: fill, lw: 1.5 });
    var low = Math.max.apply(null, d.feet.map(function (f) { return Math.max(f.ankle[1], f.toe[1]) + 3; }).concat(d.hands.map(function (h) { return h[1] + 4; })));
    trav.innerHTML = '<g transform="translate(' + x.toFixed(1) + " " + (y - low * scale).toFixed(1) + ") scale(" + (scale * face).toFixed(3) + " " + scale.toFixed(3) + ')">' + d.svg + "</g>";
    trav.style.opacity = (0.7 * alpha).toFixed(3);
  }
  function frame(line) {
    if (!trav) return;
    var n = spots.length;
    var sc = function (s) { return s.scale || S; };
    var arrived = false;
    var LEAD = 420 * Math.max(K, 0.6);
    if (line < spots[0].ty - LEAD) { trav.style.opacity = "0"; }
    else if (line < spots[0].ty) {
      // the opening leap: drops in from above into the first pose
      var t = ease((line - (spots[0].ty - LEAD)) / LEAD), a = spots[0];
      var pose = t < 0.7 ? P.leap : R.blend(P.leap, P[a.pose], (t - 0.7) / 0.3);
      draw(pose, a.x, a.y - (1 - t) * 260 * K, a.face, S, Math.min(1, t * 2), a.fill);
    } else {
      var i = 0; while (i < n - 1 && line >= spots[i + 1].ty) i++;
      var A = spots[i];
      if (i === n - 1) { arrived = true; if (A === foot) trav.style.opacity = "0"; else draw(P[A.pose], A.x, A.y, A.face, sc(A), 1, A.fill); }
      else {
        var B = spots[i + 1], u = (line - A.ty) / (B.ty - A.ty);
        if (u < 0.45) draw(P[A.pose], A.x, A.y, A.face, sc(A), 1, A.fill);       // pause in this section's pose
        else {
          var t2 = ease((u - 0.45) / 0.55);
          var sameSide = Math.abs(B.x - A.x) < 160 * K && B !== foot;
          var mid = t2 < 0.5 ? R.blend(P[A.pose], P.leap, t2 * 2) : R.blend(P.leap, P[B.pose], (t2 - 0.5) * 2);
          var s = sc(A) + (sc(B) - sc(A)) * t2;
          if (sameSide) {
            // arc down the margin, bowing outwards toward the page edge
            var out = (A.x > innerWidth / 2 ? 1 : -1) * 40 * K * Math.sin(Math.PI * t2);
            var x = A.x + (B.x - A.x) * t2 + out, y = A.y + (B.y - A.y) * t2 - 140 * K * Math.sin(Math.PI * t2);
            draw(mid, x, y, t2 < 0.5 ? A.face : B.face, s, 1, bgAt(y - 40));
          } else if (t2 < 0.5) {
            // hop up out of the current spot and fade
            var k = t2 * 2; draw(mid, A.x, A.y - 160 * K * k, A.face, sc(A), 1 - k, A.fill);
          } else {
            // drop into the next spot and fade in
            var k2 = (t2 - 0.5) * 2; draw(mid, B.x, B.y - 160 * K * (1 - k2), B.face, sc(B), k2, B === foot ? foot.fill : B.fill);
          }
        }
      }
    }
    if (foot) foot.el.style.opacity = arrived ? "" : "0";
  }
  window.placeMonkeys = place;
  // phones fire resize when the address bar shows or hides; re-place only when the width really changes
  var tm, lastW = document.documentElement.clientWidth;
  window.addEventListener("resize", function () {
    var w = document.documentElement.clientWidth; if (w === lastW) return; lastW = w;
    clearTimeout(tm); tm = setTimeout(place, 300);
  });
  var go = function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(place, 150); }); };
  if (document.readyState === "complete") go(); else window.addEventListener("load", go);
})();
