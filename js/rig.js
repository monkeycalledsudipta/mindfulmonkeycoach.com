// Mindful Monkey rig v4: adult, athletic outline monkey (front + side views).
// Small head, V-shaped chest, narrow waist, long lean limbs, fine line, minimal face.
// Angles: 0 = up, 90 = right, 180 = down. Arm spec = [upper, fore] or { to: name|[x,y], bend: 1|-1 } (two-bone IK).
(function (root) {
  const rad = (a) => (a * Math.PI) / 180;
  const dir = (a) => [Math.sin(rad(a)), -Math.cos(rad(a))];
  const add = (p, a, len) => { const d = dir(a); return [p[0] + d[0] * len, p[1] + d[1] * len]; };
  const ang = (a, b) => (Math.atan2(b[0] - a[0], -(b[1] - a[1])) * 180) / Math.PI;
  const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  const f = (n) => (+n).toFixed(1);
  const A = { up: 24, fore: 23, thigh: 22, shin: 21 };

  const FRONT = {
    leap:      { name: "Leap",           T: 0,   H: 0,   arms: [[-32, -14], [32, 14]],          legs: [[228, 160], [132, 200]], tail: [250, 0.9], face: "open" },
    ready:     { name: "Ready to jump",  T: 0,   H: 0,   arms: [[186, 178], [174, 182]],        legs: [[256, 186], [104, 174]], tail: [252, 1.0] },
    fall:      { name: "Whoops",         T: 6,   H: 8,   arms: [[-44, -12], [48, 84]],          legs: [[204, 150], [166, 214]], tail: [262, 1.1], face: "o" },
    land:      { name: "Landing",        T: 0,   H: -4,  arms: [[198, 184], [68, 36]],          legs: [[252, 184], [108, 176]], tail: [252, 1.0] },
    hang:      { name: "Hanging (logo)", T: 0,   H: 6,   arms: [[-10, -2], [10, 2]],            legs: [[188, 178], [150, 206]], tail: [250, 1.1] },
    handstand: { name: "Handstand",      T: 180, H: 0,   arms: [[204, 184], [156, 176]],        legs: [[-40, -24], [40, 24]],   tail: [70, 1.0] },
    sitwave:   { name: "Sitting wave",   T: 0,   H: -8,  arms: [[176, 168], [44, -6]],          legs: [[206, 182], [154, 178]], tail: [252, 1.2], face: "smile", sit: true },
    scratch:   { name: "Head scratch",   T: 0,   H: -12, arms: [[186, 178], { to: "headR", bend: 1 }], legs: [[190, 180], [170, 180]], tail: [252, 1.1], face: "hmm", armsFront: true },
    tree:      { name: "Tree pose",      T: 0,   H: 0,   arms: [{ to: "top", bend: -1 }, { to: "top", bend: 1 }], legs: [[180, 180], [124, 232]], tail: [250, 1.1], face: "calm" },
    hips:      { name: "Hands on hips",  T: 0,   H: 8,   arms: [{ to: "hipL", bend: 1 }, { to: "hipR", bend: -1 }], legs: [[194, 180], [166, 180]], tail: [250, 1.1], face: "smile", armsFront: true },
    peekaboo:  { name: "Peek-a-boo",     T: 0,   H: 0,   arms: [{ to: "eyeL", elbow: 222, k: 0.85 }, { to: "eyeR", elbow: 138, k: 0.85 }], legs: [[206, 182], [154, 178]], tail: [252, 1.2], face: "hidden", sit: true, armsFront: true },
    meditate:  { name: "Meditation",     T: 0,   H: 0,   arms: [{ to: "kneeL", elbow: 198 }, { to: "kneeR", elbow: 162 }], legs: [[266, 104], [94, 256]], tail: [250, -1.0], face: "calm", legsFront: true, armsFront: true },
  };
  const SIDE = {
    leap:      { name: "Leap",           T: 70,  C: 78,  H: 96,  arms: [[44, 58], [28, 44]],     legs: [[226, 262], [250, 286]], tail: [258, 0.7], face: "open" },
    ready:     { name: "Ready to jump",  T: 74,  C: 80,  H: 90,  arms: [[170, 178], [182, 186]], legs: [[138, 206], [154, 214]], tail: [262, 0.9] },
    fall:      { name: "Whoops",         T: -8,  C: -4,  H: 4,   arms: [[-36, -62], [36, 66]],   legs: [[124, 172], [236, 190]], tail: [190, 1.2], face: "o" },
    land:      { name: "Landing",        T: 36,  C: 54,  H: 86,  arms: [[150, 176], [84, 58]],   legs: [[56, 194], [76, 200]],   tail: [244, 0.9] },
    hang:      { name: "Hanging (logo)", T: 6,   C: 8,   H: 28,  arms: [[-6, 0], [10, 4]],       legs: [[172, 194], [128, 206]], tail: [212, 1.2] },
    handstand: { name: "Handstand",      T: 182, C: 180, H: 172, arms: [[178, 180], [186, 182]], legs: [[-40, -16], [40, 14]],   tail: [-6, 0.9] },
    sitwave:   { name: "Sitting wave",   T: -6,  C: 4,   H: 16,  arms: [[60, -6], [168, 152]],   legs: [[94, 176], [100, 184]],  tail: [196, 1.2], face: "smile" },
    scratch:   { name: "Head scratch",   T: 8,   C: 18,  H: -6,  arms: [{ to: "crown", bend: 1 }, [176, 164]], legs: [[168, 186], [196, 180]], tail: [222, 1.1], face: "hmm" },
    tree:      { name: "Tree pose",      T: 0,   C: 0,   H: 0,   arms: [{ to: "top", bend: 1 }, { to: "top", bend: -1 }], legs: [[180, 180], [116, 218]], tail: [206, 1.1], face: "calm" },
    lounge:    { name: "Lounging",       T: 90,  C: 86,  H: 34,  arms: [[152, 112], { to: "jaw", bend: 1 }], legs: [[264, 274], [300, 214]], tail: [330, 0.9], face: "smile" },
    peekaboo:  { name: "Peek-a-boo",     T: -4,  C: 6,   H: 12,  arms: [{ to: "eye", bend: -1 }, { to: "eye", bend: -1 }], legs: [[94, 178], [104, 186]], tail: [198, 1.2], face: "hidden" },
    meditate:  { name: "Meditation",     T: 0,   C: 0,   H: 0,   arms: [{ to: "knee", bend: 1 }, { to: "knee2", bend: -1 }], legs: [[100, 252], [260, 108]], tail: [150, -1.0], face: "calm" },
  };

  function draw(p, opt = {}) {
    const view = opt.view || "front";
    const line = opt.line || "currentColor", fill = opt.fill || "#fff", lw = opt.lw || 1.4;
    const pts = [], order = [], det = [];
    const tr = (q, r) => (pts.push([q[0] - r, q[1] - r], [q[0] + r, q[1] + r]), q);
    const layer = () => [];
    const seg = (l, a, b, w) => { tr(a, w / 2 + lw); tr(b, w / 2 + lw); l.push({ k: "l", a, b, w }); };
    const crv = (l, a, j, b, w) => { const c = [2 * j[0] - (a[0] + b[0]) / 2, 2 * j[1] - (a[1] + b[1]) / 2]; tr(a, w / 2 + lw); tr(j, w / 2 + lw); tr(b, w / 2 + lw); l.push({ k: "q", a, c, b, w }); };
    const circ = (l, c, r) => { tr(c, r + lw); l.push({ k: "c", c, r }); };
    const ell = (l, c, rx, ry, rot) => { tr(c, Math.max(rx, ry) + lw); l.push({ k: "e", c, rx, ry, rot }); };
    // tapered band along a quadratic a->j->b with width profile [[t,w],...]
    const band = (l, a, j, b, prof) => {
      const c = [2 * j[0] - (a[0] + b[0]) / 2, 2 * j[1] - (a[1] + b[1]) / 2];
      const P = (t) => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
      const W = (t) => { for (let i = 0; i < prof.length - 1; i++) if (t <= prof[i + 1][0]) { const u = (t - prof[i][0]) / (prof[i + 1][0] - prof[i][0]); return prof[i][1] + (prof[i + 1][1] - prof[i][1]) * u; } return prof[prof.length - 1][1]; };
      const L = [], R = [], n = 16;
      for (let i = 0; i <= n; i++) {
        const t = i / n, p0 = P(Math.max(0, t - 0.01)), p1 = P(Math.min(1, t + 0.01)), q = P(t);
        const dx = p1[0] - p0[0], dy = p1[1] - p0[1], m = Math.hypot(dx, dy) || 1, w = W(t) / 2;
        L.push([q[0] - (dy / m) * w, q[1] + (dx / m) * w]); R.push([q[0] + (dy / m) * w, q[1] - (dx / m) * w]);
        tr(q, w + lw);
      }
      l.push({ k: "p", pts: [...L, ...R.reverse()] });
      circ(l, a, prof[0][1] / 2); circ(l, b, prof[prof.length - 1][1] / 2);
    };
    const dot = (c, r) => det.push(`<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${r}" fill="${line}"/>`);
    const arc = (c, w, h, rot) => det.push(`<path d="M${f(c[0] - w / 2)} ${f(c[1])}q${f(w / 2)} ${f(h)} ${f(w)} 0" stroke="${line}" stroke-width="${f(lw * 0.75)}" fill="none" stroke-linecap="round" transform="rotate(${f(rot)} ${f(c[0])} ${f(c[1])})"/>`);
    const tail = (start, base, curl) => {
      const l = layer(); let tp = start, ta = base;
      for (let i = 0; i < 24; i++) { const nx = add(tp, ta, 4.3); seg(l, tp, nx, 3 - i * 0.055); tp = nx; ta += curl * (1.7 + i * i * 0.22); }
      return l;
    };
    const leg = (start, a, b, l1, l2, footA, sole) => {
      const l = layer(); const j = add(start, a, l1), e = add(j, b, l2);
      band(l, start, j, e, [[0, 8.4], [0.45, 5.8], [0.62, 6.4], [0.92, 4.2], [1, 4]]);
      if (sole) ell(l, add(e, 180, 2), 4.2, 5, 0); else ell(l, add(e, footA, 4), 7.4, 3.2, footA + 90);
      return { l, j, e };
    };
    const arm = (start, spec, T) => {
      const l = layer(); let j, e;
      if (Array.isArray(spec)) { j = add(start, spec[0], A.up); e = add(j, spec[1], A.fore); }
      else {
        const t = T(spec.to);
        if (spec.elbow !== undefined) { j = add(start, spec.elbow, A.up * (spec.k || 1)); e = t; }
        else {
        const d = Math.min(dist(start, t), A.up + A.fore - 0.5);
        const a0 = ang(start, t), al = (Math.acos((A.up * A.up + d * d - A.fore * A.fore) / (2 * A.up * d)) * 180) / Math.PI;
        j = add(start, a0 + al * spec.bend, A.up); e = add(j, ang(j, t), A.fore);
        }
      }
      band(l, start, j, e, [[0, 6.2], [0.48, 4.4], [0.62, 4.8], [1, 3.4]]);
      const ha = ang(j, e); ell(l, add(e, ha, 1.5), 2.9, 3.9, ha);
      return { l, j, e };
    };
    let hands = [], feet = [];

    if (view === "front") {
      const T = p.T, H = T + p.H;
      const hip = [0, 0];
      const up = (q, d) => add(q, T, d), side = (q, d) => add(q, T + 90, d);
      const neck = up(hip, 40), head = add(neck, H, 12.5);
      const shL = side(up(hip, 35.5), -10.5), shR = side(up(hip, 35.5), 10.5);
      const hpL = side(up(hip, 1), -5.5), hpR = side(up(hip, 1), 5.5);
      const tl = tail(side(up(hip, -2), 6), p.tail[0], p.tail[1]);
      const k = p.sit ? [7, 19] : [A.thigh, A.shin];
      const legs = p.legs.map(([a, b], i) => leg(i ? hpR : hpL, a, b, k[0], k[1], b + (i ? -84 : 84), p.sit));
      const body = layer();
      band(body, up(hip, -3), up(hip, 18), up(hip, 39), [[0, 13], [0.12, 16.5], [0.4, 12.4], [0.72, 22.5], [0.9, 21], [1, 11]]);
      const eL = add(side(head, -4.5), H, 1.8), eR = add(side(head, 4.5), H, 1.8);
      const targets = {
        eyeL: eL, eyeR: eR, kneeL: legs[0].j, kneeR: legs[1].j, hipL: side(up(hip, 6), -8), hipR: side(up(hip, 6), 8),
        top: add(head, H, 17), headR: add(add(head, H + 90, 8), H, 8),
      };
      const T_ = (n) => (Array.isArray(n) ? n : targets[n]);
      const arms = p.arms.map((s, i) => arm(i ? shR : shL, s, T_));
      const hd = layer();
      const earL = side(head, -12.6), earR = side(head, 12.6);
      circ(hd, earL, 4.4); circ(hd, earR, 4.4); ell(hd, head, 12.4, 11.6, H);
      const mask = layer();
      circ(mask, add(side(head, -4.6), H, 1.6), 5); circ(mask, add(side(head, 4.6), H, 1.6), 5);
      const muz = add(head, H + 180, 5.4); ell(mask, muz, 7.4, 5.2, H);
      order.push(tl);
      const L = legs.map((g) => g.l), R = arms.map((a) => a.l);
      if (p.legsFront) order.push(body, ...L); else order.push(...L, body);
      if (p.armsFront) order.push(hd, mask, ...R); else order.push(...R, hd, mask);
      det.push(`<circle cx="${f(earL[0])}" cy="${f(earL[1])}" r="1.8" fill="none" stroke="${line}" stroke-width="${f(lw * 0.6)}"/><circle cx="${f(earR[0])}" cy="${f(earR[1])}" r="1.8" fill="none" stroke="${line}" stroke-width="${f(lw * 0.6)}"/>`);
      const fk = p.face || "neutral";
      if (fk === "calm") { arc(eL, 3.6, 1.3, H); arc(eR, 3.6, 1.3, H); }
      else if (fk !== "hidden") { dot(eL, 1.3); dot(eR, 1.3); }
      const ns = add(muz, H, 1.6); dot(add(ns, H - 90, 1.3), 0.6); dot(add(ns, H + 90, 1.3), 0.6);
      const mo = add(muz, H + 180, 1.8);
      if (fk === "o") det.push(`<ellipse cx="${f(mo[0])}" cy="${f(mo[1])}" rx="1.2" ry="1.5" fill="${line}"/>`);
      else if (fk === "open" || fk === "smile") arc(mo, 4.6, 1.4, H);
      else arc(mo, 4, fk === "hmm" ? -0.4 : 0.6, H + (fk === "hmm" ? 8 : 0));
      hands = arms.map((a) => a.e); feet = legs.map((g) => ({ ankle: g.e, toe: add(g.e, 180, 3) }));
    } else {
      const hip = [0, 0];
      const waist = add(hip, p.T, 13), chest = add(waist, p.C, 9), neck = add(chest, p.C, 11), sh = add(chest, p.C, 6.5);
      const head = add(neck, p.H, 11);
      const tl = tail(add(hip, p.T + 205, 5), p.tail[0], p.tail[1]);
      const legs = p.legs.map(([a, b]) => leg(hip, a, b, A.thigh, A.shin, b - 82));
      const body = layer();
      band(body, add(hip, p.T, -4), waist, add(neck, p.C, 1), [[0, 11], [0.14, 14.5], [0.42, 11], [0.72, 18.5], [0.9, 16], [1, 9]]);
      const eye = add(add(head, p.H + 90, 5), p.H, 2);
      const muz = add(add(head, p.H + 90, 7.6), p.H + 180, 4.4);
      const targets = { eye, knee: legs[0].j, knee2: legs[1].j, top: add(head, p.H, 16), crown: add(add(head, p.H, 9), p.H - 90, 4), jaw: add(muz, p.H + 180, 6) };
      const arms = p.arms.map((s) => arm(sh, s, (n) => (Array.isArray(n) ? n : targets[n])));
      const hd = layer(); const ear = add(head, p.H - 90, 9.5);
      circ(hd, ear, 4.4); ell(hd, head, 11.2, 10.4, p.H);
      const mask = layer(); circ(mask, eye, 4.8); ell(mask, muz, 6.8, 4.8, p.H + 8);
      order.push(tl, legs[1].l, arms[1].l, body, legs[0].l, hd, mask, arms[0].l);
      det.push(`<circle cx="${f(ear[0])}" cy="${f(ear[1])}" r="1.8" fill="none" stroke="${line}" stroke-width="${f(lw * 0.6)}"/>`);
      const fk = p.face || "neutral";
      const ey = add(eye, p.H + 90, 1.2);
      if (fk === "calm") arc(ey, 3.6, 1.3, p.H); else if (fk !== "hidden") dot(ey, 1.3);
      dot(add(add(muz, p.H + 90, 5.6), p.H, 1.2), 0.7);
      const mo = add(add(muz, p.H + 180, 2), p.H + 90, 2.6);
      if (fk === "o") det.push(`<ellipse cx="${f(mo[0])}" cy="${f(mo[1])}" rx="1.1" ry="1.4" fill="${line}"/>`);
      else arc(mo, 4.2, fk === "smile" || fk === "open" ? 1.3 : fk === "hmm" ? -0.4 : 0.5, p.H);
      hands = arms.map((a) => a.e); feet = legs.map((g) => ({ ankle: g.e, toe: add(g.e, 180, 3) }));
    }

    const out = [];
    const prim = (s, g, col) => {
      if (s.k === "p") return `<path d="M${s.pts.map((q) => f(q[0]) + " " + f(q[1])).join("L")}Z" fill="${col}"${g ? ` stroke="${col}" stroke-width="${f(g * 2)}" stroke-linejoin="round"` : ""}/>`;
      if (s.k === "q") return `<path d="M${f(s.a[0])} ${f(s.a[1])}Q${f(s.c[0])} ${f(s.c[1])} ${f(s.b[0])} ${f(s.b[1])}" stroke="${col}" stroke-width="${f(s.w + g * 2)}" stroke-linecap="round" fill="none"/>`;
      if (s.k === "l") return `<path d="M${f(s.a[0])} ${f(s.a[1])}L${f(s.b[0])} ${f(s.b[1])}" stroke="${col}" stroke-width="${f(s.w + g * 2)}" stroke-linecap="round" fill="none"/>`;
      if (s.k === "c") return `<circle cx="${f(s.c[0])}" cy="${f(s.c[1])}" r="${f(s.r + g)}" fill="${col}"/>`;
      return `<ellipse cx="${f(s.c[0])}" cy="${f(s.c[1])}" rx="${f(s.rx + g)}" ry="${f(s.ry + g)}" transform="rotate(${f(s.rot)} ${f(s.c[0])} ${f(s.c[1])})" fill="${col}"/>`;
    };
    for (const l of order) { l.forEach((s) => out.push(prim(s, lw, line))); l.forEach((s) => out.push(prim(s, 0, fill))); }
    out.push(...det);
    const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
    return { svg: out.join(""), bbox: { x0: Math.min(...xs) - 2, y0: Math.min(...ys) - 2, x1: Math.max(...xs) + 2, y1: Math.max(...ys) + 2 }, hands, feet };
  }

  function mixA(a, b, t) { const d = ((b - a + 540) % 360) - 180; return a + d * t; }
  function blend(p, q, t) {
    const m = (X, Y) => X.map((pair, i) => (Array.isArray(pair) && Array.isArray(Y[i]) ? pair.map((v, j) => mixA(v, Y[i][j], t)) : t < 0.5 ? pair : Y[i]));
    const r = { ...(t < 0.5 ? p : q), T: mixA(p.T, q.T, t), H: mixA(p.H, q.H, t), arms: m(p.arms, q.arms), legs: m(p.legs, q.legs),
      tail: [mixA(p.tail[0], q.tail[0], t), p.tail[1] + (q.tail[1] - p.tail[1]) * t] };
    if (p.C !== undefined) r.C = mixA(p.C, q.C, t);
    return r;
  }
  const api = { FRONT, SIDE, POSES: FRONT, draw, blend };
  if (typeof module !== "undefined") module.exports = api; else root.MonkeyRig = api;
})(this);
