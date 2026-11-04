// Storyline monkeys: the logo monkey as a gold outline, one pose per section (desktop >= 1100px).
// Rules: it never overlaps a photo, box, button or text, and it is always grounded:
// it stands or sits on a real surface (the floor of a section's side margin, or the top edge of a
// photo / card / box). It never floats in mid-air. The footer meditation monkey is drawn at build time.
(function () {
  var R = window.MonkeyRig; if (!R) return;
  var P = R.POSES, S = 1.6, PAD = 14, GOLD = "#D4A62A";
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
    document.body.appendChild(s); placed.push({ s: s, sec: sec });
    return g.box;
  }
  function clear() { placed.forEach(function (p) { p.s.remove(); }); placed = []; }
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
    var W = document.documentElement.clientWidth; if (W < 1100) return;
    var B = blockers();
    var secs = [].slice.call(document.querySelectorAll("main > section")).filter(function (s) { return !s.classList.contains("workout") && !s.classList.contains("hero"); });
    var si = 0, ti = 0, side = 0;
    secs.forEach(function (sec) {
      var r = doc(sec.getBoundingClientRect()); if (r.y1 - r.y0 < 260) return;
      var next = sec.nextElementSibling, wavyBelow = next && next.classList.contains("wave-top");
      // floor: the visible edge between this section and the next (a wave curve, a colour change or a rule line)
      var cands = [];
      var gx = side ? [[90, 1], [W - 90, -1]] : [[W - 90, -1], [90, 1]];
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
        cands.push({ x: q.x1 - 50, y: q.y0, face: -1, kind: "sit" });
        cands.push({ x: q.x0 + 50, y: q.y0, face: 1, kind: "sit" });
      });
      for (var i = 0; i < cands.length; i++) {
        var c = cands[i];
        var pose = c.kind === "sit" ? SIT[ti % SIT.length] : STAND[si % STAND.length];
        var g = geom(pose, c.x, c.y, c.face);
        if (g.box.x0 < 6 || g.box.x1 > W - 6 || g.box.y0 < r.y0 + 20) continue;
        if (!clearOf(g.box, B)) continue;
        B.push(put(pose, c.x, c.y, c.face, sec));
        if (c.kind === "sit") ti++; else si++;
        side ^= 1; break;
      }
    });
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
  window.placeMonkeys = place;
  var tm; window.addEventListener("resize", function () { clearTimeout(tm); tm = setTimeout(place, 300); });
  var go = function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(place, 150); }); };
  if (document.readyState === "complete") go(); else window.addEventListener("load", go);
})();
