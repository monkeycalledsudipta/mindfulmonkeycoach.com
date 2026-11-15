// Mindful Monkey site generator (v5: blue + white, blush accent, dark brown, gold monkey).
// Run: node generate.js  -> writes every .html page. Edit content here, not in the HTML.
// Shared styles: css/site.css. Behaviour: js/site.js. Storyline monkey: js/rig.js + js/monkeys.js.
const fs = require("fs");
const path = require("path");
const RIG = require("./js/rig.js");
const OUT = __dirname;
const V = Date.now().toString(36); // cache-buster so browsers fetch fresh CSS/JS after each update

const WA_NUM = "919711013282";
const wa = (text) => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(text)}`;
const waCourse = (c) => wa(`Hi I am interested in ${c}`);
const IG = "https://www.instagram.com/sudipta03/";
const IG_GOA = "https://www.instagram.com/goaparkour/";
const YT = "https://www.youtube.com/@mindfulmonkeycoach";
const FB = "https://www.facebook.com/sudiptababycool/";
const BROCHURE = {
  leap: "https://drive.google.com/file/d/1jgNdTohze5hF_YPNC79KZZsPAYCUX4jS/view?usp=sharing",
  playsophy: "https://drive.google.com/file/d/1jJvOm31Bg5TxNpa6EKKLjHd-hn4rTFdc/view?usp=sharing",
};
const PHONE = "+91 97110 13282";
const EMAIL = "mindfulmonkeycoach@gmail.com";

/* Sudipta's videos (from "Links for Website.docx"). short = YouTube Short (vertical), t = start second */
const V_ = {
  hero: { id: "ikum498DmQI", title: "Back to your roots" },
  fitness: { id: "Si7zwOeqJ_s", title: "To be motivated, you must be disciplined" },
  started: { id: "dNDzgkRulg4", title: "There is fire within me" },
  workout: { id: "d_9e7xTF6Dw", title: "The MOP workout" },
  arata: { id: "1WcoGN8Rtnc", t: 57, title: "Arata: healed hernia and knee pain with LEAP" },
  usha: { id: "BPhBPiDXTmo", short: true, title: "Usha trains with Sudipta" },
  goaParkour: { id: "VAX77Tc569U", title: "Parkour in Goa" },
  panjim: { id: "lVTysSQiOeI", title: "Exploring Panjim" },
  batch: { id: "LF9HbpPiQ4o", short: true, title: "The regular parkour batch" },
  podcast: { id: "4cw0-5gRD2w", t: 2974, title: "A raw conversation on devotion, Maya and inner awakening" },
};
const SPOTIFY = "https://open.spotify.com/episode/54Nv5suDxa9mOo6LTFc88x";
const ytUrl = (v) => v.short ? `https://www.youtube.com/shorts/${v.id}` : `https://www.youtube.com/watch?v=${v.id}${v.t ? `&t=${v.t}s` : ""}`;
const ytThumb = (v) => `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`;
// a link that opens the video in an on-page player (js/site.js); falls back to YouTube
const ytA = (v) => `href="${ytUrl(v)}" target="_blank" rel="noopener" data-yt="${v.id}"${v.t ? ` data-t="${v.t}"` : ""}${v.short ? " data-short" : ""}`;
const SYM = fs.readFileSync(path.join(__dirname, "site-src/monkey_sym.txt"), "utf8").trim();
const ext = `target="_blank" rel="noopener"`;

/* ---------- icons ---------- */
const I = {
  wa: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 2.5a9.5 9.5 0 0 0-8.1 14.5L2.5 21.5l4.63-1.4a9.5 9.5 0 1 0 4.9-17.6zm0 17.3a7.78 7.78 0 0 1-3.97-1.08l-.28-.17-2.75.84.82-2.68-.18-.28a7.83 7.83 0 1 1 6.36 3.37z"/></svg>`,
  yt: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.8 15.1V8.9L15.6 12l-5.8 3.1Z"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`,
  fb: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v1.9H8v3.2h2.6V22H14v-10.3h2.6l.4-3.2H14Z"/></svg>`,
  play: `<span class="play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>`,
};

/* ---------- helpers ---------- */
const inr = (n) => `<span data-inr="${n}">₹${n.toLocaleString("en-IN")}</span>`;
// first-design waves: tall asymmetric curve + a thin accent line; alternate direction per use
let waveN = 0;
const wave = (fill) => {
  const flip = waveN++ % 2 ? ' style="transform:scaleX(-1)"' : "";
  const line = fill === "#FFFFFF" || fill === "#FCEEF1" ? "#9CC2FF" : "#F4C9D2";
  return `<svg class="wave" viewBox="0 0 1440 150" preserveAspectRatio="none" aria-hidden="true"${flip}><path d="M0 95 C 240 30 420 30 720 85 S 1180 140 1440 60 L1440 150 L0 150Z" fill="${fill}"/><path d="M0 70 C 260 10 440 10 720 62 S 1180 120 1440 35" fill="none" stroke="${line}" stroke-width="2" opacity=".7" vector-effect="non-scaling-stroke"/></svg>`;
};
const C = { white: "#FFFFFF", blush: "#FCEEF1", blue: "#0F4A9A", brown: "#14213D" };
const sec = (cls, inner, w) => `<section class="${cls}${w ? " wave-top" : ""}">${w ? wave(C[w]) : ""}${inner}</section>`;
const faq = (q, a) => `<details class="faq"><summary>${q}</summary><p>${a}</p></details>`;
const logo = `<span class="badge"><svg viewBox="0 0 183 187.2" aria-hidden="true"><use href="#mk"/></svg></span>`;

/* footer meditating monkey, drawn at build time from the rig */
const med = RIG.draw(RIG.POSES.meditate, { line: "#D4A62A", fill: "#101B33", lw: 1.5 });
const MED_SVG = `<svg viewBox="${(med.bbox.x0 - 4).toFixed(1)} ${(med.bbox.y0 - 4).toFixed(1)} ${(med.bbox.x1 - med.bbox.x0 + 8).toFixed(1)} ${(med.bbox.y1 - med.bbox.y0 + 8).toFixed(1)}" aria-hidden="true">${med.svg}</svg>`;

/* ---------- data ---------- */
const COURSES = [
  { key: "leap", name: "LEAP", href: "online-coaching/leap.html", tag: "1-on-1 · twice a week", img: "leap-back-lever.jpg", feat: true,
    d: "Make the leap into a more intentional life. Movement, nutrition, mindset and recovery, fully personal.",
    p: 160000, u: "one-time · instalments available" },
  { key: "playsophy", name: "Playsophy", href: "online-coaching/playsophy.html", tag: "Women only · 12 weeks", img: "playsophy-tree.jpg",
    d: "Move with freedom. Learn through play. A chakra-rooted movement journey for women who already move.",
    p: 21600, u: "early bird · regular ₹24,000", u2: 24000 },
  { key: "group", name: "Group Classes", href: "group-classes.html", tag: "Panjim, Goa · Outdoors", img: "groupclass-vault.jpg",
    d: "Outdoor parkour and movement, Monday, Wednesday and Friday mornings. Rain or shine.",
    p: 850, u: "drop-in · packs from ₹4,200" },
  { key: "discovery", name: "Discovery Call", href: "discovery.html", tag: "1-hour video call", img: "leap-tree-smile.jpg",
    d: "Not sure where to start? A focused hour with Sudipta to map out the right path for you.",
    p: 2500, u: "per session" },
];
const unit = (c) => c.u.replace(/₹([\d,]+)/, (m, n) => inr(+n.replace(/,/g, "")));

const TESTI = [
  { q: "Today, in my 50s, I can run, bend without breaking, swing, jump, climb and move more athletically than I did in my 40s!", who: "Lavinder Singh Duggal", meta: "56 · Mumbai · nearly 3 years", c: "LEAP", hl: true,
    full: "I first met Sudipta during a nutrition course, where she was my senior. At the time, I had diabetes, chronic knee pain, limited mobility and could barely squat. I joined her one-on-one training simply hoping to move better, but LEAP gave me so much more. Over nearly three years and five to six rounds of LEAP, I trained both in person and online whenever I travelled. Today, in my 50s, I can run, bend without breaking, swing, jump, climb and move more athletically than I did in my 40s! What made LEAP even more special was that Sudipta also included couple sessions for my wife and me. Training together improved our health, helped us align better and even strengthened our relationship." },
  { q: "Over those four months, I lost weight, felt less stressed and saw my cholesterol levels become more balanced.", who: "Bhavesh", meta: "62 · Mumbai", c: "LEAP",
    full: "I did Sudipta's four-month LEAP program with her in person in Bombay. Over those four months, I lost weight, felt less stressed and saw my cholesterol levels become more balanced. We worked on movement, mindful eating, sleep and rest. She also introduced me to another client, Lavinder. Training together showed me how good it feels to connect with someone through shared, healthy choices." },
  { q: "The Discovery & Consultation session convinced me to sign up for LEAP, and I've now been with the program for over 3 years.", who: "Sarah Jane Dias", meta: "Former Femina Miss India World", c: "Discovery",
    full: "As an actress, TV host, model and former Femina Miss India World titleholder, I came to Sudipta looking for a program that could improve my endurance, intensity, energy and flexibility, along with real nutritional guidance and an honest look at habits I didn't even realize were holding me back, things like sleep quality and supplement use. The Discovery & Consultation session convinced me to sign up for LEAP, and I've now been with the program for over 3 years. Sudipta has been a constant presence throughout, mapping out the roadmap, setting goals, and providing the nudging I need to actually hit them." },
  { q: "She helped me develop a relationship with my body that I never had before. The whole experience has made me feel fitter, livelier, healthier and more active.", who: "Arata", meta: "63 · Washington D.C.", c: "4-month programme", v: V_.arata },
  { q: "It was a body, mind and life transformation experience. This mindful coaching not only changes your perspective towards your body, it also upgrades your beliefs about movement and holistic health.", who: "Usha", meta: "43 · Pune", c: "Personal coaching", v: V_.usha,
    full: "My experience of personal coaching with Sudipta: it was body, mind and life transformation experience. This mindful coaching not only changes your perspective towards your body it also upgrades your beliefs about movement and holistic health. It's highly recommended for females because no one can understand the female body and mind needs more than a female coach." },
];
const tcard = (t) => `<div class="t${t.hl ? " hl" : ""} rv"><q>“${t.q}”</q>${t.v ? `<a class="tw" ${ytA(t.v)}>${I.yt} Watch ${t.who}'s story</a>` : ""}<div class="who"><div><b>${t.who}</b>${t.meta}</div><span class="c">${t.c}</span></div></div>`;

/* ---------- layout ---------- */
function head(title, desc, p) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="https://mindfulmonkeycoach.com/images/hero-storm-jump.jpg">
<meta name="theme-color" content="#0F4A9A">
<link rel="icon" href="${p}images/logo-blue.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${p}css/site.css?v=${V}">
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">${SYM}</svg>`;
}
function header(p, on, over, waText) {
  const L = (href, label) => `<a href="${p}${href}"${on === label ? ' class="on"' : ""}>${label}</a>`;
  return `<header class="site-header${over ? " over" : ""}"><div class="wrap">
<a class="brand" href="${p}index.html" aria-label="Mindful Monkey home">${logo} mindful monkey</a>
<nav class="links" aria-label="Main">
${L("index.html", "Home")}${L("about.html", "About")}
<span class="has-sub">${L("courses.html", "Courses")}<span class="sub">
<a href="${p}online-coaching/leap.html">LEAP · 1-on-1</a><a href="${p}online-coaching/playsophy.html">Playsophy · women only</a><a href="${p}group-classes.html">Group Classes · Goa</a><a href="${p}discovery.html">Discovery Call</a><a href="${p}online-coaching/compare.html">Compare LEAP and Playsophy</a></span></span>
${L("testimonials.html", "Testimonials")}${L("contact.html", "Contact")}
</nav>
<a class="btn btn-blue hdr-cta" href="${wa(waText)}" ${ext}>${I.wa} Chat on WhatsApp</a>
<button class="menu-btn" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
</div></header>
<a class="wa-float" href="${wa(waText)}" ${ext} aria-label="Chat with Sudipta on WhatsApp">${I.wa}</a>`;
}
function footer(p) {
  return `<section class="workout"><div class="wrap" style="max-width:1360px">
<a class="banner" ${ytA(V_.workout)}><img src="${p}images/about-plank.jpg" alt="Sudipta holding a plank on paralettes"><div class="inner">
<p class="eyebrow" style="margin-bottom:16px">Free on YouTube</p>
<h2>Sudipta's <em>Home Work Out</em></h2>
<p>No gym, no equipment. Move with Sudipta from your living-room floor.</p>
<span class="btn btn-white">${I.yt} Watch the workout</span></div>${I.play}</a>
</div></section>
</main>
<footer class="site-footer"><div class="wrap" style="max-width:1360px"><div class="fcols">
<div><a class="brand" href="${p}index.html">${logo} mindful monkey</a><p style="font-size:15px;max-width:300px">Movement, play and mindful living with Sudipta Mondal. Online worldwide, outdoors in Goa.</p>
<ul class="fcontact"><li><a href="tel:${PHONE.replace(/\s/g, "")}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 3h3.5l1.8 4.6-2.3 1.5a11 11 0 0 0 6 6l1.5-2.3L20 14.5V18a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/></svg>${PHONE}</a></li>
<li><a href="mailto:${EMAIL}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 7 8.5-7"/></svg>${EMAIL}</a></li></ul>
<div class="soc"><a href="${IG}" ${ext} aria-label="Instagram">${I.ig}</a><a href="${YT}" ${ext} aria-label="YouTube">${I.yt}</a><a href="${FB}" ${ext} aria-label="Facebook">${I.fb}</a><a href="${wa("Hi Sudipta")}" ${ext} aria-label="WhatsApp">${I.wa}</a></div></div>
<div><h4>Courses</h4><ul><li><a href="${p}online-coaching/leap.html">LEAP</a></li><li><a href="${p}online-coaching/playsophy.html">Playsophy</a></li><li><a href="${p}group-classes.html">Group Classes</a></li><li><a href="${p}discovery.html">Discovery Call</a></li></ul></div>
<div><h4>Explore</h4><ul><li><a href="${p}about.html">About Sudipta</a></li><li><a href="${p}testimonials.html">Testimonials</a></li><li><a href="${YT}" ${ext}>YouTube</a></li><li><a href="${p}contact.html">Contact</a></li></ul></div>
<div><h4>Follow</h4><ul><li><a href="${IG}" ${ext}>Instagram · @sudipta03</a></li><li><a href="${IG_GOA}" ${ext}>Instagram · @goaparkour</a></li><li><a href="${YT}" ${ext}>YouTube · @mindfulmonkeycoach</a></li></ul></div>
<div class="mk-foot">${MED_SVG}<small>Breathe. Then play.</small></div>
</div><div class="base"><span>© ${new Date().getFullYear()} MindfulMonkey Coaching · Panjim, Goa</span><span><a href="${p}refund-policy.html">Refund policy</a> · <a href="${p}privacy-policy.html">Privacy</a> · <a href="${p}terms.html">Terms</a></span></div></div></footer>
<script src="${p}js/site.js?v=${V}"></script>
<script src="${p}js/rig.js?v=${V}"></script>
<script src="${p}js/monkeys.js?v=${V}"></script>
</body>
</html>`;
}
function page(file, { title, desc, on, over = false, waText = "Hi Sudipta, I would like to know more about your coaching" }, body) {
  const depth = file.split("/").length - 1, p = depth ? "../".repeat(depth) : "";
  const html = head(title, desc, p) + header(p, on, over, waText) + "\n<main>\n" + body(p) + footer(p);
  const fp = path.join(OUT, file);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, html);
  console.log("wrote", file);
}

const card = (c, p) => `<div class="card${c.feat ? " feat" : ""} rv"><a class="ph" href="${p}${c.href}"><img src="${p}images/${c.img}" alt="${c.name}"><span class="tag">${c.tag}</span></a>
<div class="bd"><h3><a href="${p}${c.href}">${c.name}</a></h3><p class="d">${c.d}</p><div class="price"><b>${inr(c.p)}</b><span>${unit(c)}</span></div>
<a class="btn btn-blue" href="${waCourse(c.name)}" ${ext}>${I.wa} Ask about ${c.name.split(" ")[0]}</a><a class="more" href="${p}${c.href}">See details →</a></div></div>`;

const ytStrip = (p, title, tiles, w) => sec("sec", `<div class="wrap">
<div class="head-row" style="margin-bottom:38px"><div><p class="eyebrow" style="margin-bottom:14px">On YouTube · @mindfulmonkeycoach</p><h2 class="h2" style="font-size:clamp(38px,4.4vw,56px)">${title}</h2></div>
<a class="text-link yt-sub" href="${YT}" ${ext}>${I.yt} Subscribe on YouTube</a></div>
<div class="yt-grid">${tiles.map(([src, k, c]) => typeof src === "object"
    ? `<a class="vid rv" ${ytA(src)}><img src="${ytThumb(src)}" alt="" loading="lazy">${I.play}<div class="cap"><small>${k}</small>${c}</div></a>`
    : `<a class="vid rv" href="${YT}" ${ext}><img src="${p}images/${src}" alt="">${I.play}<div class="cap"><small>${k}</small>${c}</div></a>`).join("")}</div>
</div>`, w);

/* =================== HOME =================== */
page("index.html", { title: "Mindful Monkey · Parkour and holistic coaching with Sudipta Mondal", desc: "Parkour, movement and holistic health coaching with Sudipta Mondal. LEAP, Playsophy, Goa group classes and Discovery calls, all booked on WhatsApp.", on: "Home", over: true }, (p) => `
<section class="hero"><img src="${p}images/hero-storm-jump.jpg" alt="Sudipta mid-jump on a stormy Goa beach">
<div class="hero-vid" data-yt-bg="${V_.hero.id}" aria-hidden="true"></div>
<div class="wrap"><p class="eyebrow">Parkour · Movement · Holistic health · Nature connection</p>
<h1 class="strong" aria-label="Strong body. Strong mind. Strong spirit."><span class="big" aria-hidden="true">STRONG</span><span class="three" aria-hidden="true"><span>body.</span><span>mind.</span><em>spirit.</em></span></h1>
<p class="lede">Coaching that meets you where you are, online anywhere in the world or outdoors in Goa.</p>
<div class="row-btns"><a class="btn btn-white" href="${wa("Hi Sudipta, I am interested in your coaching")}" ${ext}>${I.wa} Start on WhatsApp</a><a class="btn btn-line" href="courses.html">Explore courses</a></div></div>
</section>

${sec("creds", `<div class="wrap">
<div class="rv"><p class="eyebrow">01 · The late start</p><b>Started at 30</b><p>First push-up at 31, first front flip at 34.</p></div>
<div class="rv"><p class="eyebrow">02 · On screen</p><b>Naked and Afraid finalist</b><p>First Indian woman to reach the finale, Discovery Channel.</p></div>
<div class="rv"><p class="eyebrow">03 · In training</p><b>Apex Movement <span class="pill">Ongoing</span></b><p>Certification as an Apex parkour coach is in progress.</p></div>
</div>`, "white")}

<section class="sec" style="border-top:1px solid var(--line)"><div class="wrap">
<div class="head-row"><div><p class="eyebrow" style="margin-bottom:16px">Ways to train</p><h2 class="h2">Pick your path.<br><em>We'll talk on WhatsApp.</em></h2></div>
<p style="font-size:15px;max-width:320px">No checkout. Tap a course, say hi, and Sudipta replies personally.</p></div>
<div class="cards">${COURSES.map((c) => card(c, p)).join("")}</div>
<p class="fx-note"></p>
</div></section>

<section class="sec" style="border-top:1px solid var(--line)"><div class="wrap">
<div class="head-row"><div><p class="eyebrow" style="margin-bottom:16px">Real people, real change</p><h2 class="h2">In their <em>words.</em></h2></div><a class="text-link" href="testimonials.html">All stories →</a></div>
<div class="tgrid">${TESTI.slice(0, 3).map(tcard).join("")}</div>
</div></section>

${sec("sec bio bg-blush", `<div class="wrap">
<div class="ph"><img class="a" src="${p}images/about-portrait.jpg" alt="Portrait of Sudipta Mondal"><img class="b" src="${p}images/about-sunflower.jpg" alt="Sudipta in a Goa paddy field holding a sunflower"></div>
<div class="rv"><p class="eyebrow">Hey, I'm Sudipta</p><h2 class="h2">I didn't start young.<br><em>I started brave.</em></h2>
<p class="lede">I have spent many years working through my own insecurity, pain, financial struggles, confusion and fear. I found my way back to myself through play, movement, self-care, nature and joy.</p>
<div class="steps"><div><b>30</b><span>Started training</span></div><div><b>31</b><span>First push-up</span></div><div><b>34</b><span>First front flip</span></div></div>
<a class="text-link" href="about.html">Read my story →</a></div>
</div>`, "blush")}

<section class="sec"><div class="wrap">
<p class="eyebrow" style="margin-bottom:16px">Follow along</p><h2 class="h2" style="margin-bottom:40px">Play along <em>every day.</em></h2>
<div class="sgrid">
<div class="sc rv"><div class="top"><b>${I.ig} Instagram</b><a class="text-link" href="${IG}" ${ext}>@sudipta03 →</a></div>
<div class="ig">${["about-headstand", "leap-tree-smile", "about-backbend", "groupclass-vault", "about-blue-dress", "playsophy-tree"].map((i) => `<a href="${IG}" ${ext}><img src="${p}images/${i}.jpg" alt=""></a>`).join("")}</div></div>
<div class="sc rv"><div class="top"><b>${I.yt} YouTube</b><a class="text-link" href="${YT}" ${ext}>@mindfulmonkeycoach →</a></div>
<div class="ytl">${[[V_.fitness, "Discipline"], [V_.goaParkour, "Parkour in Goa"], [V_.workout, "Home workout"], [V_.podcast, "Podcast"]].map(([v, c]) => `<a class="vid" ${ytA(v)} style="aspect-ratio:16/11"><img src="${ytThumb(v)}" alt="" loading="lazy">${I.play}<div class="cap" style="font-size:16px">${c}</div></a>`).join("")}</div></div>
</div></div></section>

${sec("sec form-band bg-blue", `<div class="wrap">
<div class="rv"><p class="eyebrow" style="margin-bottom:18px">Not sure which one?</p><h2 class="h2">Tell Sudipta<br><em>where you are.</em></h2>
<p class="l">Leave your name and pick what you're curious about. This opens WhatsApp with your message ready, so Sudipta can help you choose.</p></div>
${formHtml()}
</div>`, "blue")}
`);

function formHtml() {
  return `<form class="form wa-form rv">
<label for="f-name">Your name</label><input id="f-name" type="text" name="name" placeholder="Your name" autocomplete="name">
<label for="f-phone">Your WhatsApp number</label><input id="f-phone" type="tel" name="phone" placeholder="+91 98xxx xxxxx" autocomplete="tel">
<label for="f-int">I'm interested in</label><select id="f-int" name="interest">
<option>LEAP</option><option>Playsophy</option><option>Group Classes in Goa</option><option>a Discovery Call</option><option>Not sure yet</option></select>
<label class="chk"><input type="checkbox" name="join" checked> Add me to Sudipta's daily WhatsApp group: fun facts, quick exercises and offers.</label>
<button class="btn btn-blue" type="submit">${I.wa} Send to Sudipta</button>
<small>Opens WhatsApp with your message ready. Nothing is stored on this website.</small>
</form>`;
}

/* =================== ABOUT =================== */
const BUBBLES = [
  ["Parkour", 50, 7, 128, "blue", "Learning to see walls, rails and trees as invitations to move."],
  ["Yoga", 85, 19, 108, "", "Breath, balance and stillness to steady the body and the mind."],
  ["Breathwork", 95, 50, 120, "", "Simple breathing practices to calm the nervous system."],
  ["Recovery", 83, 82, 112, "", "Rest, sleep and recovery, treated as part of the training."],
  ["Mindset", 50, 94, 116, "", "Growth mindset, kinder self-talk and mental flexibility."],
  ["Play", 16, 82, 118, "blue", "Curiosity that keeps you coming back long after motivation fades."],
  ["Mobility", 5, 50, 112, "", "Joints that move freely, so the body can meet life with ease."],
  ["Natural nutrition", 16, 18, 132, "", "Progressive, mindful eating. No crash diets, no supplements."],
];
page("about.html", { title: "About Sudipta Mondal · Mindful Monkey", desc: "Sudipta Mondal: movement educator, parkour and holistic lifestyle coach, Naked and Afraid finalist, founder of MindfulMonkey Coaching.", on: "About" }, (p) => `
<section class="phero"><div class="wrap grid">
<div><p class="eyebrow">About Sudipta</p><h1 style="font-size:clamp(48px,6.4vw,92px)">I didn't start young. <em>I started brave.</em></h1>
<p class="lede">Movement educator, parkour coach and holistic lifestyle coach, based in Goa and coaching people all over the world.</p>
<div class="row-btns" style="margin-top:32px"><a class="btn btn-blue" href="${wa("Hi Sudipta, I read your story and would love to talk")}" ${ext}>${I.wa} Say hi on WhatsApp</a></div></div>
<div class="im"><img src="${p}images/about-backbend.jpg" alt="Sudipta in a backbend"></div>
</div></section>

${sec("sec story bg-blush", `<div class="wrap">
<div><p class="eyebrow" style="margin-bottom:18px">My story</p><h2 class="h2" style="font-size:clamp(40px,4.6vw,60px)">The obstacle is <em>the way.</em></h2>
<div class="tl"><div><b>30</b><span>Started training</span></div><div><b>31</b><span>First push-up</span></div><div><b>34</b><span>First front flip</span></div>
<div><b>Naked and Afraid</b><span>First Indian woman finalist</span></div><div><b>Apex Movement</b><span>Coach certification, ongoing</span></div></div></div>
<div class="txt rv">
<p>I have spent many years working through my own insecurity, pain, financial struggles, confusion and fear. I found my way back to myself through play, movement, self-care, nature and joy.</p>
<p>As a woman, I understand that women often need a different kind of space to feel safe, strong and seen. And I believe men, too, deserve spaces where they can soften, reconnect with themselves and receive the love and support they may have spent years learning to live without.</p>
<p>My mission is to bring people back to the joy of being alive through movement, play, mindful living and the lessons life has taught me. To create a space where women and men can explore their strength, embrace their vulnerability and come home to themselves, with greater freedom, clarity and self-trust.</p>
<p>Because I believe that life is not about avoiding obstacles or constantly trying to fix ourselves. It is about learning to move through life with courage, curiosity and a little more play.</p>
<p class="k">The obstacle is the way. And sometimes, the way forward is to play.</p>
<p class="sig">Sudipta</p>
</div></div>`, "blush")}

<section class="sec method"><div class="wrap">
<div class="rv"><p class="eyebrow">The Sudipta Method</p><h2 class="h2" style="margin:20px 0 26px">Many disciplines.<br><em>One whole human.</em></h2>
<p class="lede">A practical, person-first framework. Your practice is shaped around where you are today and what you want your life to make possible.</p>
<p style="margin-top:22px;font-size:14px;color:var(--brown-mute)">Tap a bubble to see how it fits in.</p></div>
<div class="orbit"><div class="ring" style="width:78%;height:76%"></div><div class="ring" style="width:100%;height:98%;opacity:.6"></div>
<div class="me"><img src="${p}images/about-portrait.jpg" alt="Sudipta Mondal"></div>
${BUBBLES.map(([t, x, y, d, cl, tip]) => `<span class="bub" style="left:${x}%;top:${y}%;--d:${d}px" tabindex="0">${t}<span class="tip">${tip}</span></span>`).join("")}
</div></div></section>

${sec("sec bg-brown", `<div class="wrap">
<div class="two"><div><p class="eyebrow">My philosophy</p><h2 class="h2" style="margin-top:20px">Simple principles<br><em>for a complex life.</em></h2></div>
<div><p style="color:rgba(255,255,255,.82)">No quick fixes and no aesthetic ideals. Just practical ways to become stronger, steadier and more alive, for the long term.</p>
<div class="status"><span class="dot"></span><div><b>Apex Movement certification: ongoing</b><span>I'm currently training towards my Apex Movement parkour coach certification.</span></div></div></div></div>
<div class="pr"><div><span>01</span><h3>Movement is medicine</h3><p>Not punishment. We train for a body that can meet life with confidence, strength and ease.</p></div>
<div><span>02</span><h3>Play is serious work</h3><p>Curiosity makes us adaptable. Play reconnects us to our instincts and makes practice last.</p></div>
<div><span>03</span><h3>Nature is a teacher</h3><p>Light, rest, real food and time outdoors are not extras. They are the foundations.</p></div>
<div><span>04</span><h3>Small is sustainable</h3><p>Lasting transformation is built in ordinary moments, through choices you can return to.</p></div></div>
</div>`, "brown")}

<section class="sec na"><div class="wrap">
<div class="rv"><p class="eyebrow">On screen</p><h2 class="h2" style="font-size:clamp(40px,4.4vw,56px);margin:18px 0">Naked and Afraid: <em>Aadimanav.</em></h2><p class="lede">The first Indian woman to reach the finale of Discovery Channel's <em>Naked and Afraid</em>.</p></div>
<img src="${p}images/about-na-portrait.jpg" alt="Sudipta during Naked and Afraid: Aadimanav"><img src="${p}images/about-na-billboard.jpg" alt="Sudipta in front of the Naked and Afraid: Aadimanav billboard"></div></section>

<section class="sec bg-blush"><div class="wrap two" style="align-items:start">
<div class="rv"><p class="eyebrow" style="margin-bottom:18px">Training and certifications</p><ul class="ticks">
<li>Apex Movement parkour coach certification (ongoing)</li><li>Level 1 Parkour Coach, Parkour Generations London</li><li>Level 1 Ashtanga and Hatha Yoga Teacher</li>
<li>Certified Personal Trainer and Functional Strength Trainer, FSSA / AFAA</li><li>CPR and AED, American Heart Association</li><li>Certified in Care and Prevention of Sports and Fitness Injuries</li></ul></div>
<div class="rv"><p class="eyebrow" style="margin-bottom:18px">In the press</p><ul class="ticks">
<li><a href="https://zeezest.com/episodes/health-healing-ep-5-763" ${ext}>Zee Zest: Parkour with Sudipta Mondal</a></li>
<li><a href="https://www.indulgexpress.com/wellness/2026/Jul/27/parkour-mindfulness-and-the-wild-how-sudipta-mondal-turned-palawans-jungle-into-a-lesson" ${ext}>Indulge Express: Parkour, mindfulness and the wild</a></li>
<li><a href="https://t2online.in/screen/streaming/survival-show-star--sudipta-mondal-on-naked-survival-and-her-ultimate-life-hacks/2006961" ${ext}>T2 Online: survival show star Sudipta Mondal on Naked and Afraid</a></li><li>Times Now News: Sudipta Mondal on Naked and Afraid</li>
<li><a href="https://www.theentrepreneursofindia.in/post/how-sudipta-mondal-is-building-a-holistic-health-movement-rooted-in-science-and-nature" ${ext}>The Entrepreneurs of India: building a holistic health movement</a></li><li><a href="https://www.imdb.com/name/nm18615165/" ${ext}>IMDb: Sudipta Mondal</a></li></ul>
<p class="eyebrow" style="margin:34px 0 18px">Podcasts</p><ul class="ticks">
<li><a ${ytA(V_.podcast)}>On YouTube: a raw conversation on devotion, Maya and inner awakening</a></li>
<li><a href="${SPOTIFY}" ${ext}>Listen on Spotify</a></li></ul></div>
</div></section>

${ytStrip(p, "Watch my <em>journey.</em>", [[V_.started, "Where it began", "When I started parkour"], [V_.fitness, "Strength", "Physical capacity and fitness"], [V_.podcast, "Podcast", "In conversation"]], "white")}
`);

/* =================== COURSES =================== */
const DETAIL = {
  leap: { long: "Four months, fully personal. Movement, nutrition, mindset and recovery come together in a practice built around your life, without crash diets, supplements or a one-size-fits-all plan.", pts: ["Live 1-on-1 sessions twice a week", "Customised daily movement routines", "Progressive nutrition and habit support", "Rest practices and meditation"] },
  playsophy: { long: "A joyful, chakra-rooted movement experience for women aged 25 to 50 with prior movement experience. Explore play, strength, rhythm and recovery through the seven chakras.", pts: ["24 live Zoom sessions in 12 weeks", "Recordings for 6 months", "Food, seasons, music and voice", "Weekly group Q&A"] },
  group: { long: "Outdoor parkour and movement classes in Panjim, three mornings a week. Rotating outdoor locations, shared ahead of each class.", pts: ["Mon · Wed · Fri mornings", "6:45 to 7:45/8:00 AM", "Drop-in or monthly packs", "Rain or shine, always outdoors"] },
  discovery: { long: "One hour with Sudipta on video. Get to know her method before committing to LEAP, or get focused help as a current or past client.", pts: ["60-minute 1-on-1 video call", "Discovery ₹2,500 · Consultation ₹5,000", "Paid before your slot", "A clear next step"] },
};
page("courses.html", { title: "Courses · Mindful Monkey", desc: "LEAP, Playsophy, Goa group classes and Discovery calls with Sudipta Mondal.", on: "Courses" }, (p) => `
<section class="phero" style="padding-bottom:40px"><div class="wrap">
<p class="eyebrow">Courses · Online worldwide · Outdoors in Goa</p><h1>Find your <em>way in.</em></h1>
<p class="lede">Every course starts with a WhatsApp message. Tap the one that speaks to you and Sudipta will reply personally.</p>
<p class="fx-note"></p>
</div></section>
<section style="padding-bottom:80px"><div class="wrap">
${COURSES.map((c, i) => `<div class="crow${i % 2 ? " r" : ""}"><a class="im" href="${p}${c.href}"><img src="${p}images/${c.img}" alt="${c.name}"><span class="tag">${c.tag}</span></a>
<div class="rv"><p class="eyebrow" style="margin-bottom:14px">0${i + 1}</p><h2><a href="${p}${c.href}">${c.name}</a></h2><p class="l">${DETAIL[c.key].long}</p>
<ul class="dots">${DETAIL[c.key].pts.map((x) => `<li>${x.replace(/₹([\d,]+)/g, (m, n) => inr(+n.replace(/,/g, "")))}</li>`).join("")}</ul>
<div class="bot"><div class="price"><b>${inr(c.p)}</b><span>${unit(c)}</span></div><a class="btn btn-blue" href="${waCourse(c.name)}" ${ext}>${I.wa} Ask about ${c.name}</a><a class="text-link" href="${p}${c.href}">Details →</a></div></div></div>`).join("")}
</div></section>
${ytStrip(p, "Try a class <em>first.</em>", [[V_.batch, "Group class", "The regular parkour batch"], ["playsophy-tree.jpg", "Playsophy", "Move with freedom"], ["leap-back-lever.jpg", "LEAP", "Strength, step by step"]], "blush").replace('class="sec wave-top"', 'class="sec bg-blush wave-top"')}
`);

/* =================== COURSE TEMPLATE =================== */
function coursePage(file, o) {
  page(file, { title: `${o.name} · Mindful Monkey`, desc: o.desc, on: "Courses", waText: `Hi I am interested in ${o.name}` }, (p) => `
<section class="phero"><div class="wrap grid">
<div><p class="eyebrow">${o.eyebrow}</p><h1>${o.h1 || o.name}</h1>
<p class="lede" style="font-size:22px;color:var(--brown)">${o.lead}</p>
<p style="margin-top:16px;max-width:560px">${o.intro}</p>
<div class="meta">${o.meta.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("")}</div>
<div class="row-btns"><a class="btn btn-blue" href="${waCourse(o.name)}" ${ext}>${I.wa} I'm interested in ${o.name}</a>${o.brochure ? `<a class="text-link" href="${o.brochure}" ${ext}>Download the brochure ↗</a>` : ""}</div>
<p class="fx-note"></p></div>
<div class="im"><img src="${p}images/${o.img}" alt="${o.imgAlt}"></div>
</div></section>
${o.sections(p)}`);
}
const priceSection = (o, inner) => sec("sec bg-brown", `<div class="wrap pbox">
<div class="rv"><p class="eyebrow">${o.pe || "Investment"}</p><h2 class="h2" style="margin-top:18px">${o.ph}</h2>${inner}</div>
<div class="rv" style="display:flex;flex-direction:column;gap:16px;align-items:flex-start">
<p style="color:rgba(255,255,255,.82);max-width:440px">${o.pn}</p>
<a class="btn btn-white" href="${waCourse(o.name)}" ${ext}>${I.wa} I'm interested in ${o.name}</a>
${o.extra || ""}</div></div>`, "brown");

/* LEAP */
coursePage("online-coaching/leap.html", {
  name: "LEAP", desc: "LEAP: a 4-month, fully personal 1-on-1 transformation with Sudipta Mondal. Movement, nutrition, mindset and recovery.",
  eyebrow: "Course 01 · 4-month personal transformation", lead: "For the person ready to change more than a routine.",
  intro: "LEAP brings movement, nutrition, mindset and recovery together in a deeply personalised practice, without crash diets, supplements or a one-size-fits-all plan.",
  meta: [["Investment", inr(160000)], ["Duration", "4 months"], ["Sessions", "Twice a week"]],
  img: "leap-back-lever.jpg", imgAlt: "Sudipta holding a back lever on beach bars", brochure: BROCHURE.leap,
  sections: (p) => `
${sec("sec bg-blush", `<div class="wrap">
<p class="eyebrow">What's inside</p><h2 class="h2" style="margin:18px 0 50px">Four pillars, <em>one you.</em></h2>
<div class="igrid"><div class="rv"><span>01</span><h3>Learn</h3><p>To move and play: personalised workouts, live coaching, breathwork and outdoor training.</p></div>
<div class="rv"><span>02</span><h3>Nourish</h3><p>Progressive nutrition and habit support. No dieting, no supplements.</p></div>
<div class="rv"><span>03</span><h3>Activate</h3><p>Growth mindset, self-talk and brain-flexibility tools.</p></div>
<div class="rv"><span>04</span><h3>Plug in to plug out</h3><p>Rest practices, recovery, sleep hygiene and meditation.</p></div></div>
<ul class="dots" style="margin-top:44px;max-width:900px"><li>Live 1-on-1 sessions twice a week</li><li>Customised daily movement routines</li><li>Online, or in person</li><li>Limited places</li></ul>
</div>`, "blush")}
<section class="sec fit"><div class="wrap">
<div class="rv"><p class="eyebrow">Is it for you?</p><h2 class="h2" style="font-size:clamp(38px,4.4vw,58px);margin-top:18px">LEAP is for you <em>if…</em></h2>
<ul class="big"><li>You have no fitness routine yet. LEAP starts from where you are today.</li><li>You don't want to become an athlete. You want to move, feel and function better.</li><li>You can commit to 4 months of live sessions twice a week, plus daily practice.</li></ul></div>
<a class="vid rv" href="https://www.instagram.com/reels/DRMgsxzCBZq/" ${ext} style="aspect-ratio:auto;height:460px;border-radius:22px"><img src="${p}images/leap-tree-smile.jpg" alt="">${I.play}<div class="cap"><small>Instagram</small>Lavinder's LEAP story</div></a>
</div></section>
${priceSection({ name: "LEAP", ph: `${inr(160000)} <em>one-time.</em>`, pn: "Instalments are available and places are limited. Message Sudipta to check the next start date.",
  extra: `<a class="text-link" href="../discovery.html" style="color:#fff">Still deciding? Book a Discovery Call →</a><a class="text-link" href="compare.html" style="color:#fff">Compare LEAP and Playsophy →</a>` }, "")}
<section class="sec"><div class="wrap">
<p class="eyebrow" style="margin-bottom:16px">From LEAP clients</p><h2 class="h2" style="margin-bottom:40px">In their <em>words.</em></h2>
<div class="tgrid" style="grid-template-columns:1fr 1fr">${TESTI.slice(0, 2).map((t) => tcard({ ...t, q: t.full })).join("")}</div>
</div></section>
<section class="sec bg-blush"><div class="wrap narrow">
<p class="eyebrow" style="margin-bottom:16px">Questions</p><h2 class="h2" style="margin-bottom:36px">Good to <em>know.</em></h2>
${faq("I have no fitness routine. Is this for me?", "Yes. LEAP is built around where you are today, not where you think you should be.")}
${faq("I don't intend to become an athlete. Is this for me?", "Yes. Most clients simply want to move, feel and function better in everyday life.")}
${faq("What if I miss or need to reschedule a class?", "Give at least 12 hours' notice. See the <a href=\"../refund-policy.html\" style=\"color:var(--blue)\">refund and cancellation policy</a> for full details.")}
${faq("What equipment do I need?", "Very little. Sudipta will tell you exactly what you need for your setup during onboarding.")}
${faq("Is there a refund policy?", "Fees are non-refundable once a programme begins.")}
${faq("What if I have a current or past injury?", "Tell Sudipta upfront. The programme is adapted around your injury history.")}
${faq("What commitment are you asking for?", "Four months of live 1-on-1 sessions twice a week, plus daily movement and nutrition practice.")}
</div></section>`,
});

/* PLAYSOPHY */
coursePage("online-coaching/playsophy.html", {
  name: "Playsophy", desc: "Playsophy: a 12-week, chakra-rooted movement programme for women with prior movement experience. Live on Zoom with Sudipta Mondal.",
  eyebrow: "Course 02 · 12-week women's programme", lead: "For the person who wants movement to feel like freedom.",
  intro: "A joyful, chakra-rooted movement experience for women aged 25 to 50 with prior movement experience. Explore play, strength, rhythm and recovery through the seven chakras.",
  meta: [["Early bird", inr(21600)], ["Regular", inr(24000)], ["Live", "Tue & Thu"]],
  img: "playsophy-tree.jpg", imgAlt: "Playful movement in a tree", brochure: BROCHURE.playsophy,
  sections: (p) => `
${sec("sec bg-blush", `<div class="wrap">
<p class="eyebrow">What's inside</p><h2 class="h2" style="margin:18px 0 18px">Seven chakras. <em>Twelve weeks.</em></h2>
<p class="lede" style="margin-bottom:50px">Three sessions for each chakra, each one covering movement, food and seasonal lifestyle, rest and recovery, and dance and music.</p>
<div class="igrid"><div class="rv"><span>01</span><h3>24 live sessions</h3><p>On Zoom, Tuesday and Thursday, 6:30 to 7:30 AM IST.</p></div>
<div class="rv"><span>02</span><h3>Recordings</h3><p>Every session is recorded and stays available for 6 months.</p></div>
<div class="rv"><span>03</span><h3>Beyond movement</h3><p>Food, seasonal living, music and voice practices.</p></div>
<div class="rv"><span>04</span><h3>Support</h3><p>Weekly notes, self-practice and group Q&amp;A on WhatsApp.</p></div></div>
<ul class="dots" style="margin-top:44px;max-width:900px"><li>Small group, up to 10 women</li><li>Sat: journaling and self-practice</li><li>Sun: group Q&amp;A (voice notes, video review)</li><li>Mon, Wed, Fri: rest</li></ul>
<p style="font-size:14px;color:var(--brown-mute);margin-top:18px">Class time elsewhere: EST 8:00 to 9:00 PM, CST 7:00 to 8:00 PM, PST 5:00 to 6:00 PM (the previous day).</p>
</div>`, "blush")}
<section class="sec fit"><div class="wrap">
<div class="rv"><p class="eyebrow">Who it's for</p><h2 class="h2" style="font-size:clamp(38px,4.4vw,58px);margin-top:18px">Playsophy is for you <em>if…</em></h2>
<ul class="big"><li>You're a woman, roughly 25 to 50 (other ages at Sudipta's discretion).</li><li>You already move: yoga, running, or an otherwise active life.</li><li>You want movement to feel like play again, not punishment.</li></ul>
<p class="callout"><b>Not a beginner programme.</b> Playsophy needs an intermediate level of movement discipline, so be honest with yourself before you enrol.</p></div>
<div class="im rv" style="border-radius:22px;overflow:hidden;height:520px"><img src="${p}images/about-blue-dress.jpg" alt="Sudipta" style="width:100%;height:100%;object-fit:cover"></div>
</div></section>
${priceSection({ name: "Playsophy", ph: `${inr(21600)} <em>early bird.</em>`, pn: `Regular price ${inr(24000)} for the full 12 weeks. Message Sudipta for the next batch dates and the early-bird deadline.`,
  extra: `<a class="text-link" href="compare.html" style="color:#fff">Compare Playsophy and LEAP →</a>` }, "")}
<section class="sec bg-blush"><div class="wrap narrow">
<p class="eyebrow" style="margin-bottom:16px">Questions</p><h2 class="h2" style="margin-bottom:36px">Good to <em>know.</em></h2>
${faq("What if I miss a class?", "All sessions are recorded, and you keep access for 6 months.")}
${faq("Am I too old or unfit to join?", "Playsophy is designed for intermediate movers, not total beginners. Your movement background matters more than your age.")}
${faq("Can I keep my other fitness routine?", "Yes. Playsophy is designed to complement an active lifestyle.")}
${faq("Will this help my mental health?", "Many women find real benefits, but this is a movement and lifestyle programme, not a substitute for clinical care.")}
${faq("What do I need for the sessions?", "A stable internet connection, space to move, and the willingness to show up.")}
${faq("Is this a diet programme?", "No. It's about seasonal, mindful food choices, not restriction.")}
</div></section>`,
});

/* GROUP CLASSES */
coursePage("group-classes.html", {
  name: "Group Classes", desc: "Outdoor parkour and movement group classes in Panjim, Goa, three mornings a week with Sudipta Mondal.",
  eyebrow: "Outdoors in Panjim, Goa", lead: "Parkour and movement, three mornings a week.",
  intro: "Outdoor classes in Panjim, rain or shine. Locations rotate and are shared ahead of each class.",
  meta: [["Days", "Mon · Wed · Fri"], ["Time", "6:45 AM"], ["Drop-in", inr(850)]],
  img: "groupclass-vault.jpg", imgAlt: "A parkour vault at an outdoor class",
  sections: (p) => `
${sec("sec bg-blush", `<div class="wrap">
<p class="eyebrow">How it works</p><h2 class="h2" style="margin:18px 0 50px">Show up. <em>Play outside.</em></h2>
<div class="igrid" style="grid-template-columns:repeat(3,1fr)"><div class="rv"><span>When</span><h3>Mon · Wed · Fri</h3><p>6:45 to 7:45/8:00 AM.</p></div>
<div class="rv"><span>Where</span><h3>Panjim, Goa</h3><p>Rotating outdoor locations, shared ahead of each class.</p></div>
<div class="rv"><span>Updates</span><h3>@goaparkour</h3><p>Follow on <a href="${IG_GOA}" ${ext} style="color:var(--blue);border-bottom:1px solid">Instagram</a> for locations and news.</p></div></div>
</div>`, "blush")}
${sec("sec bg-blue", `<div class="wrap pbox">
<div class="rv"><p class="eyebrow">Packages</p><h2 class="h2" style="margin:18px 0 22px">Drop in, or <em>commit.</em></h2>
<p style="color:rgba(255,255,255,.82);max-width:440px">Billing is for the full month. Joining mid-month? A lower package or the drop-in rate applies for that month.</p>
<div style="margin-top:28px"><a class="btn btn-white" href="${waCourse("Group Classes")}" ${ext}>${I.wa} I'm interested in Group Classes</a></div></div>
<table class="ptable rv"><tr><th>Package</th><th>Fee</th></tr>
${[["Drop-in", 850], ["6 sessions", 4200], ["8 sessions", 4800], ["10 sessions", 6000], ["12 sessions", 7000]].map(([k, v]) => `<tr><td>${k}</td><td><b>${inr(v)}</b></td></tr>`).join("")}</table>
</div>`, "blue")}
${ytStrip(p, "See a class <em>in action.</em>", [[V_.goaParkour, "Parkour in Goa", "Parkour for women in India"], [V_.panjim, "Panjim", "Exploring Panjim"], [V_.batch, "Group class", "The regular parkour batch"]], "white")}`,
});

/* DISCOVERY */
coursePage("discovery.html", {
  name: "Discovery Call", desc: "Book a 1-hour Discovery or Consultation video call with Sudipta Mondal before committing to a programme.",
  eyebrow: "1-hour, 1-on-1 video call", lead: "Not sure where to start? Start here.",
  intro: "Get to know Sudipta's method before committing to LEAP, or get focused help if you're a current or past client.",
  meta: [["Discovery", inr(2500)], ["Consultation", inr(5000)], ["Length", "60 minutes"]],
  img: "leap-tree-smile.jpg", imgAlt: "Sudipta smiling in a tree",
  sections: (p) => `
${sec("sec bg-blush", `<div class="wrap pbox">
<div class="rv"><p class="eyebrow">Two kinds of session</p><h2 class="h2" style="margin:18px 0 22px">Pick the one <em>that fits.</em></h2>
<p style="max-width:440px">Both are paid in advance, before your scheduled slot. Message Sudipta on WhatsApp to pick a time.</p></div>
<table class="ptable rv"><tr><th>Session</th><th>Who it's for</th><th>Fee</th></tr>
<tr><td>Discovery</td><td>New and prospective clients</td><td><b>${inr(2500)}</b></td></tr>
<tr><td>Consultation</td><td>Current or previous clients who need specific help</td><td><b>${inr(5000)}</b></td></tr></table>
</div>`, "blush")}
<section class="sec bigq center"><div class="wrap">
<p class="eyebrow" style="margin-bottom:28px">Why start here</p>
<q>“The Discovery &amp; Consultation session convinced me to sign up for LEAP, and I've now been with the program for over 3 years.”</q>
<p>Sarah Jane Dias · former Femina Miss India World · <a href="https://www.instagram.com/reels/DdlZQc7K8wg/" ${ext} style="color:var(--blue);border-bottom:1px solid">watch on Instagram</a></p>
<div style="margin-top:36px"><a class="btn btn-blue" href="${waCourse("a Discovery Call")}" ${ext}>${I.wa} Book a Discovery Call</a></div>
</div></section>`,
});

/* =================== COMPARE =================== */
page("online-coaching/compare.html", { title: "LEAP vs Playsophy · Mindful Monkey", desc: "A side-by-side comparison of LEAP and Playsophy, Sudipta Mondal's two online programmes.", on: "Courses" }, (p) => `
<section class="phero" style="padding-bottom:50px"><div class="wrap"><p class="eyebrow">Compare</p><h1>LEAP <em>or</em> Playsophy?</h1>
<p class="lede">Two different paths to the same place: stronger, more capable, more at home in your body.</p><p class="fx-note"></p></div></section>
<section style="padding-bottom:110px"><div class="wrap" style="overflow-x:auto">
<table class="ptable"><tr><th></th><th>LEAP</th><th>Playsophy (women only)</th></tr>
<tr><td>Format</td><td>1-on-1, fully personal</td><td>Small group, up to 10</td></tr>
<tr><td>Duration</td><td>4 months</td><td>12 weeks</td></tr>
<tr><td>Live sessions</td><td>Live 1-on-1 sessions twice a week, timed around you</td><td>24 Zoom sessions, Tue &amp; Thu, 6:30 to 7:30 AM IST</td></tr>
<tr><td>Framework</td><td>Learn, Nourish, Activate, Plug in to plug out</td><td>The seven chakras: movement, food, rest, dance and music</td></tr>
<tr><td>Who it's for</td><td>Beginners to advanced</td><td>Women 25 to 50 with prior movement experience</td></tr>
<tr><td>Price</td><td><b>${inr(160000)}</b><br>one-time, instalments available</td><td><b>${inr(21600)}</b> early bird<br>${inr(24000)} regular</td></tr>
<tr><td></td><td><a class="btn btn-blue" href="${waCourse("LEAP")}" ${ext}>${I.wa} LEAP</a></td><td><a class="btn btn-blue" href="${waCourse("Playsophy")}" ${ext}>${I.wa} Playsophy</a></td></tr>
</table>
<p style="margin-top:24px">Still deciding? <a class="text-link" href="../discovery.html">Book a 1-hour Discovery Call →</a></p>
</div></section>`);

/* =================== TESTIMONIALS =================== */
page("testimonials.html", { title: "Testimonials · Mindful Monkey", desc: "Real stories from LEAP, Playsophy and group-class students of Sudipta Mondal.", on: "Testimonials" }, (p) => `
<section class="phero" style="padding-bottom:70px"><div class="wrap"><p class="eyebrow">Real people, real change</p><h1>In their <em>words.</em></h1></div></section>
${sec("sec bg-blush", `<div class="wrap"><div class="tgrid" style="grid-template-columns:1fr 1fr">${TESTI.map((t) => tcard({ ...t, q: t.full || t.q })).join("")}</div></div>`, "blush")}
<section class="sec"><div class="wrap">
<p class="eyebrow" style="margin-bottom:16px">On video</p><h2 class="h2" style="margin-bottom:40px;font-size:clamp(38px,4.4vw,56px)">Hear it <em>from them.</em></h2>
<div class="yt-grid" style="grid-template-columns:1fr 1fr">${[[V_.arata, "Arata · 63 · Washington D.C.", "Healed hernia and knee pain, no surgery"], [V_.usha, "Usha · 43 · Pune", "Training with Sudipta"]].map(([v, k, c]) => `<a class="vid rv" ${ytA(v)}><img src="${ytThumb(v)}" alt="" loading="lazy">${I.play}<div class="cap"><small>${k}</small>${c}</div></a>`).join("")}</div>
</div></section>
<section class="sec"><div class="wrap two" style="align-items:start">
<div class="rv"><p class="eyebrow" style="margin-bottom:18px">More transformations</p><h2 class="h2" style="font-size:clamp(36px,4vw,52px)">Small shifts, <em>big change.</em></h2></div>
<ul class="ticks rv"><li><b>Arata, 63, Washington D.C.</b> Reversed an inguinal hernia without surgery and gained the stamina for headstands.</li>
<li><b>Srishti, 24, Gurugram.</b> Knee pain gone completely, in her first-ever fitness programme.</li>
<li><b>Vaishnavi, 34, Bangalore.</b> Playsophy helped her support her daughter's natural movement instincts.</li>
<li><b>Rajni, 38, New Delhi.</b> Small daily habit shifts alongside training.</li>
<li><b>Parineeta, 36, USA.</b> Healthier, stronger and more self-aware after about three months.</li></ul>
</div></section>`);

/* =================== CONTACT =================== */
page("contact.html", { title: "Contact · Mindful Monkey", desc: "Reach Sudipta Mondal on WhatsApp or Instagram.", on: "Contact" }, (p) => `
<section class="phero"><div class="wrap"><p class="eyebrow">Contact</p><h1>Say hi on <em>WhatsApp.</em></h1>
<p class="lede">It's the fastest way to reach Sudipta, and she replies personally.</p>
<div class="row-btns" style="margin-top:32px"><a class="btn btn-blue" href="${wa("Hi Sudipta")}" ${ext}>${I.wa} WhatsApp Sudipta</a>
<a class="btn btn-line" href="${IG}" ${ext}>${I.ig} @sudipta03</a><a class="btn btn-line" href="${IG_GOA}" ${ext}>${I.ig} @goaparkour</a></div></div></section>
${sec("sec form-band bg-blue", `<div class="wrap">
<div class="rv"><p class="eyebrow" style="margin-bottom:18px">Prefer a form?</p><h2 class="h2">Tell Sudipta<br><em>where you are.</em></h2>
<p class="l">Fill this in and WhatsApp opens with your message ready to send.</p></div>
${formHtml()}
</div>`, "blue")}`);

/* =================== LEGAL =================== */
const legal = (file, title, html) => page(file, { title: `${title} · Mindful Monkey`, desc: `${title} for MindfulMonkey Coaching.` }, () => `
<section class="phero" style="padding-bottom:40px"><div class="wrap"><p class="eyebrow">MindfulMonkey Coaching</p><h1 style="font-size:clamp(44px,6vw,80px)">${title}</h1></div></section>
<section style="padding-bottom:110px"><div class="wrap legal">${html}</div></section>`);
legal("refund-policy.html", "Refund and cancellation policy", `
<h2>LEAP and Playsophy</h2><ul><li>All fees are non-refundable once a programme begins.</li><li>Rescheduling or cancelling a session needs 12 hours' notice; anything later counts as a session attended.</li><li>If Sudipta cancels a session, a make-up class will be scheduled.</li><li>No make-up sessions are offered for a client-side cancellation, except for a genuine emergency, at Sudipta's discretion.</li></ul>
<h2>Discovery and Consultation sessions</h2><ul><li>Fees must be paid before the scheduled time slot.</li><li>Non-refundable once booked; rescheduling is possible with reasonable notice, at Sudipta's discretion.</li></ul>
<h2>Group Classes (Goa)</h2><ul><li>Billing is monthly. Fees for the month are non-refundable once paid.</li><li>Joining mid-month: a lower package or drop-in rate applies for that month only.</li></ul>`);
legal("privacy-policy.html", "Privacy policy", `<ul>
<li>This website does not store your personal information. The enquiry form only opens WhatsApp with your message pre-written; nothing is sent until you press send in WhatsApp.</li>
<li>Information you share with MindfulMonkey Coaching on WhatsApp (such as your name and number) is used only to communicate with you about your enquiry, session or programme, and is never sold or shared with third parties.</li>
<li>Prices may be shown in your local currency using a public exchange-rate service; your time-zone setting is read in your browser and is not stored.</li>
<li>Session recordings (Playsophy) are for participants' personal reference only and are not shared publicly without consent.</li>
<li>For any questions about your data, message Sudipta on <a href="${wa("Hi Sudipta, I have a question about my data")}" ${ext}>WhatsApp</a>.</li></ul>`);
legal("terms.html", "Terms and conditions", `<ul>
<li>All coaching programmes (LEAP, Playsophy, Discovery and Consultation sessions, Group Classes) are provided by Sudipta Mondal / MindfulMonkey Coaching.</li>
<li>Participation requires your own assessment of your fitness for physical activity. Please consult a doctor before starting if you have a pre-existing condition.</li>
<li>Coaching supports wellbeing and movement education. It does not replace individual medical assessment, diagnosis or treatment.</li>
<li>MindfulMonkey Coaching is not liable for injury arising from participation, to the extent permitted by law.</li>
<li>Programme content, brochures and recordings are for the enrolled participant's personal use only and may not be redistributed.</li>
<li>Fees and refunds are governed by the <a href="refund-policy.html">refund and cancellation policy</a>.</li>
<li>These terms may be updated from time to time.</li></ul>`);

/* 404 */
page("404.html", { title: "Page not found · Mindful Monkey", desc: "Page not found." }, () => `
<section class="phero"><div class="wrap"><p class="eyebrow">404</p><h1>This monkey <em>wandered off.</em></h1>
<p class="lede">The page you're looking for isn't here.</p><div class="row-btns" style="margin-top:30px"><a class="btn btn-blue" href="/index.html">Back to home</a></div></div></section>`);

console.log("\nDone.");
