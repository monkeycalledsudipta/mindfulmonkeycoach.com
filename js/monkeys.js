// Storyline monkeys: the logo monkey as a gold outline, one pose per section.
// Leaps in the first section, quirky poses after; it meditates in the footer (drawn at build time).
// Placed at runtime in the side margins / empty space and never over a photo, video or text.
// Desktop only (>= 1100px wide); it hops in as each section scrolls into view.
(function () {
  var R = window.MonkeyRig; if (!R) return;
  var P = R.POSES, S = 1.7, PAD = 10, GOLD = "#D4A62A";
  var QUIRKY = ["handstand", "sitwave", "scratch", "tree", "hips", "peekaboo", "ready"];
  function doc(q) { return { x0: q.left + scrollX, y0: q.top + scrollY, x1: q.right + scrollX, y1: q.bottom + scrollY }; }
  function hit(a, b) { return a.x0 < b.x1 + PAD && a.x1 + PAD > b.x0 && a.y0 < b.y1 + PAD && a.y1 + PAD > b.y0; }
  function blockers() {
    var out = [], tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n;
    while ((n = tw.nextNode())) {
      if (!n.textContent.trim()) continue;
      var el = n.parentElement; if (!el || el.closest("style,script,svg,.links")) continue;
      var r = document.createRange(); r.selectNodeContents(n);
      [].forEach.call(r.getClientRects(), function (q) { if (q.width > 0 && q.height > 0) out.push(doc(q)); });
    }
    document.querySelectorAll("img,.vid,.banner,.card,.form,.orbit,.bub,.btn,.t,.sc,.igrid>div,.ptable,.status,.im,.ph,.site-header,.wa-float,input,select,.faq").forEach(function (e) {
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
  function geom(pose, x, y, face) {
    var d = R.draw(P[pose], { lw: 1.5 });
    var low = Math.max.apply(null, d.feet.map(function (f) { return Math.max(f.ankle[1], f.toe[1]); }).concat(d.hands.map(function (h) { return h[1] + 4; })));
    var b = d.bbox, oy = y - low * S, xs = [x + b.x0 * S * face, x + b.x1 * S * face];
    return { oy: oy, box: { x0: Math.min(xs[0], xs[1]), x1: Math.max(xs[0], xs[1]), y0: oy + b.y0 * S, y1: oy + b.y1 * S } };
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
  function place() {
    clear();
    var W = document.documentElement.clientWidth; if (W < 1100) return;
    var B = blockers();
    var secs = [].slice.call(document.querySelectorAll("main > section")).filter(function (s) { return !s.classList.contains("workout"); });
    var qi = 0, first = true, side = 0;
    secs.forEach(function (sec) {
      var r = doc(sec.getBoundingClientRect()); if (r.y1 - r.y0 < 200) return;
      var pose = first ? "leap" : QUIRKY[qi % QUIRKY.length];
      var xsR = [[W - 82, -1], [W - 210, -1]], xsL = [[82, 1], [210, 1]];
      var order = side ? xsL.concat(xsR) : xsR.concat(xsL), done = false;
      for (var i = 0; i < order.length && !done; i++) {
        var x = order[i][0], face = order[i][1];
        for (var y = r.y1 - 16; y > r.y0 + 150 && !done; y -= 20) {
          var g = geom(pose, x, y, face);
          if (g.box.x0 < 4 || g.box.x1 > W - 4 || g.box.y0 < r.y0 + 10) continue;
          if (B.some(function (b) { return hit(g.box, b); })) continue;
          B.push(put(pose, x, y, face, sec)); done = true;
        }
      }
      if (done) { if (first) first = false; else qi++; side ^= 1; }
    });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          placed.forEach(function (p) { if (p.sec === e.target) p.s.classList.remove("pre"); });
          io.unobserve(e.target);
        });
      }, { threshold: 0.25 });
      placed.forEach(function (p) { io.observe(p.sec); });
    } else placed.forEach(function (p) { p.s.classList.remove("pre"); });
  }
  window.placeMonkeys = place;
  var tm; window.addEventListener("resize", function () { clearTimeout(tm); tm = setTimeout(place, 300); });
  var go = function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(place, 150); }); };
  if (document.readyState === "complete") go(); else window.addEventListener("load", go);
})();
