const fs = require("fs");
const path = require("path");

const SITE = "MindfulMonkey Coaching";
const WA = "https://wa.me/919711013282";
const IG_MAIN = "https://instagram.com/sudipta03";
const IG_GOA = "https://instagram.com/goaparkour";
const YT = "https://youtube.com/@mindfulmonkeycoach"; // placeholder — update with her real channel URL
const DISCOVERY_CTA_TEXT = "Still deciding? Book a 1-hour Discovery Video Call Session.";

const ICONS = {
  instagram: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.25.07 1.63.07 4.81s-.01 3.56-.07 4.81c-.15 3.23-1.66 4.77-4.92 4.92-1.25.06-1.63.07-4.85.07s-3.6-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.25-.07-1.63-.07-4.81s.01-3.56.07-4.81c.15-3.23 1.66-4.77 4.92-4.92C8.4 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.5.01-4.73.07-2.27.1-3.4 1.24-3.5 3.5-.06 1.23-.07 1.6-.07 4.73s.01 3.5.07 4.73c.1 2.26 1.23 3.4 3.5 3.5 1.23.06 1.59.07 4.73.07s3.5-.01 4.73-.07c2.27-.1 3.4-1.24 3.5-3.5.06-1.23.07-1.6.07-4.73s-.01-3.5-.07-4.73c-.1-2.26-1.24-3.4-3.5-3.5C15.5 4.01 15.14 4 12 4zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3zm5.15-1.98a1.16 1.16 0 1 1-2.32 0 1.16 1.16 0 0 1 2.32 0z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M23.5 6.8s-.23-1.64-.94-2.36c-.9-.94-1.9-.95-2.36-1C17 3.2 12 3.2 12 3.2h-.01s-5 0-8.2.24c-.46.05-1.46.06-2.36 1C.73 5.16.5 6.8.5 6.8S.27 8.73.27 10.67v1.8c0 1.94.23 3.87.23 3.87s.23 1.64.94 2.36c.9.95 2.08.92 2.6 1.02 1.88.18 8 .24 8 .24s5.01-.01 8.21-.25c.46-.06 1.46-.06 2.36-1.01.71-.72.94-2.36.94-2.36s.23-1.93.23-3.87v-1.8c0-1.94-.23-3.87-.23-3.87zM9.6 14.87V8.66l6.2 3.11-6.2 3.1z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 2.5a9.5 9.5 0 0 0-8.1 14.5L2.5 21.5l4.63-1.4a9.5 9.5 0 1 0 4.9-17.6zm0 17.3a7.78 7.78 0 0 1-3.97-1.08l-.28-.17-2.75.84.82-2.68-.18-.28a7.83 7.83 0 1 1 6.36 3.37z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm17.4 2H3.6l8.4 6.3L20.4 7zM4 8.3V17h16V8.3l-8 6-8-6z"/></svg>`,
};

function priceBlock(inr, label) {
  return `<div><strong>${label}: ₹${inr.toLocaleString("en-IN")}</strong><div class="price-fx" data-inr-parent>Loading conversion…</div></div>
  <span data-inr="${inr}" style="display:none"></span>`;
}
// Simpler: attach data-inr directly to the price line and let fx.js fill an adjacent .price-fx span.
function price(inr, label) {
  return `<p data-inr="${inr}" style="margin:4px 0 14px;"><strong>${label}: ₹${inr.toLocaleString("en-IN")}</strong><br><span class="price-fx">Loading live conversion…</span></p>`;
}

function igEmbed(url, label) {
  return `<a class="ig-embed" href="${url}" target="_blank" rel="noopener">
    <span class="ig-icon">${ICONS.instagram}</span>
    <span class="ig-text"><strong>${label}</strong><br><small>Watch on Instagram →</small></span>
  </a>`;
}

function faq(q, a) {
  return `<details class="faq"><summary>${q}</summary><p>${a}</p></details>`;
}

function head(title, description, depth) {
  const root = depth === 0 ? "" : "..";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · ${SITE}</title>
<meta name="description" content="${description}">
<link rel="icon" href="${depth === 0 ? "" : "../"}images/logo-blue.jpg">
<link rel="stylesheet" href="${depth === 0 ? "" : "../"}css/style.css">
</head>
<body>`;
}

function header(depth) {
  const p = depth === 0 ? "" : "../";
  const oc = depth === 0 ? "online-coaching/" : "";
  const here = (rel) => (depth === 0 ? rel : (rel.startsWith("online-coaching/") ? rel.replace("online-coaching/", "") : p + rel));
  return `
<header class="site-header">
  <div class="nav-row">
    <a class="brand" href="${p}index.html"><img src="${p}images/logo-blue.jpg" alt="MindfulMonkey Coaching logo">MindfulMonkey Coaching</a>
    <button class="menu-toggle" aria-label="Menu">☰</button>
    <nav class="primary-nav">
      <a href="${p}index.html">Home</a>
      <div class="dropdown">
        <a href="${p}online-coaching/leap.html">Online Coaching ▾</a>
        <div class="dropdown-menu">
          <a href="${p}online-coaching/leap.html">LEAP (1-on-1)</a>
          <a href="${p}online-coaching/playsophy.html">Playsophy (Group, Women Only)</a>
          <a href="${p}online-coaching/compare.html">Compare LEAP vs. Playsophy</a>
        </div>
      </div>
      <a href="${p}discovery.html">Discovery & Consultation</a>
      <a href="${p}group-classes.html">Group Classes</a>
      <a href="${p}about.html">About</a>
      <a href="${p}testimonials.html">Testimonials</a>
      <a href="${p}contact.html">Contact</a>
      <span class="icon-row">
        <a href="${IG_MAIN}" target="_blank" rel="noopener" title="Instagram">${ICONS.instagram}</a>
        <a href="${YT}" target="_blank" rel="noopener" title="YouTube">${ICONS.youtube}</a>
        <a href="${p}contact.html" title="Contact">${ICONS.mail}</a>
      </span>
    </nav>
  </div>
</header>`;
}

function footer(depth) {
  const p = depth === 0 ? "" : "../";
  return `
<footer class="site-footer">
  <div class="footer-grid">
    <div class="footer-col">
      <h4>MindfulMonkey Coaching</h4>
      <p style="color:#cfdae0; font-size:0.9rem; max-width:260px;">Strong body. Strong mind. Strong spirit. Online and in-person coaching with Sudipta Mondal.</p>
    </div>
    <div class="footer-col">
      <h4>Programs</h4>
      <a href="${p}online-coaching/leap.html">LEAP (1-on-1)</a>
      <a href="${p}online-coaching/playsophy.html">Playsophy (Group)</a>
      <a href="${p}discovery.html">Discovery & Consultation</a>
      <a href="${p}group-classes.html">Group Classes (Goa)</a>
    </div>
    <div class="footer-col">
      <h4>Site</h4>
      <a href="${p}about.html">About Sudipta</a>
      <a href="${p}testimonials.html">Testimonials</a>
      <a href="${p}contact.html">Contact</a>
    </div>
    <div class="footer-col">
      <h4>Legal</h4>
      <a href="${p}refund-policy.html">Refund & Cancellation</a>
      <a href="${p}privacy-policy.html">Privacy Policy</a>
      <a href="${p}terms.html">Terms & Conditions</a>
    </div>
    <div class="footer-col">
      <h4>Connect</h4>
      <a href="${IG_MAIN}" target="_blank" rel="noopener">Instagram — @sudipta03</a>
      <a href="${IG_GOA}" target="_blank" rel="noopener">Instagram — @goaparkour</a>
      <a href="${WA}" target="_blank" rel="noopener">WhatsApp</a>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© ${new Date().getFullYear()} MindfulMonkey Coaching. All rights reserved.</span>
    <span>Panjim, Goa, India</span>
  </div>
</footer>
<a class="wa-float" href="${WA}" target="_blank" rel="noopener" title="Chat on WhatsApp">${ICONS.whatsapp}</a>
<script src="${p}js/nav.js"></script>
<script src="${p}js/fx.js"></script>
</body>
</html>`;
}

function page(filepath, depth, title, description, bodyHtml) {
  const html = head(title, description, depth) + header(depth) + bodyHtml + footer(depth);
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, html);
  console.log("wrote", filepath);
}

const OUT = __dirname;

// ---------------- HOME ----------------
page(path.join(OUT, "index.html"), 0, "Home", "Online and in-person parkour & holistic health coaching with Sudipta Mondal — LEAP, Playsophy, and Goa group classes.", `
<div class="hero">
  <img src="images/hero-storm-jump.jpg" alt="Sudipta Mondal jumping on a stormy Goa beach">
  <div class="hero-overlay">
    <div class="hero-copy">
      <h1>Strong body. Strong mind. Strong spirit.</h1>
      <p>Parkour and holistic health coaching that meets you where you are — online, worldwide, or outdoors in Goa.</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="online-coaching/leap.html">Train with me online</a>
        <a class="btn btn-outline" href="discovery.html">Book a Discovery Call</a>
      </div>
    </div>
  </div>
</div>

<section class="tight">
  <div class="center">
    <ul class="check-list" style="max-width:640px;margin:0 auto;">
      <li>Started at 30, after divorce — first push-up at 31, first front-flip at 34</li>
      <li>First female Indian finalist, Discovery Channel's <em>Naked and Afraid</em> (Aadimanav)</li>
      <li>India's only Apex Movement Certified Parkour Coach (Dec 2026)</li>
    </ul>
  </div>
</section>

<section class="alt">
  <h2 class="section-title">Three ways to train with me</h2>
  <div class="grid-3">
    <div class="card">
      <h3>Online Coaching</h3>
      <p>1-on-1 LEAP or group Playsophy — structured, personal, and built around your life, wherever you are.</p>
      <a class="btn btn-primary" href="online-coaching/leap.html">Explore LEAP & Playsophy</a>
    </div>
    <div class="card">
      <h3>Discovery & Consultation</h3>
      <p>Not sure where to start? A focused 1-hour video call to map out the right path for you.</p>
      <a class="btn btn-primary" href="discovery.html">Book a session</a>
    </div>
    <div class="card">
      <h3>Group Classes, Goa</h3>
      <p>Outdoor parkour and movement, three mornings a week in Panjim. Drop in or commit to a package.</p>
      <a class="btn btn-primary" href="group-classes.html">See the schedule</a>
    </div>
  </div>
</section>
`);

// ---------------- LEAP ----------------
page(path.join(OUT, "online-coaching/leap.html"), 1, "LEAP — 1-on-1 Online Coaching", "LEAP: a 16-week, fully personalized 1-on-1 online coaching program with Sudipta Mondal.", `
<div class="page-hero">
  <span class="badge">1-on-1 · 16 weeks</span>
  <h1>LEAP</h1>
  <p class="lead">Transform your health in 4 months with tailored one-on-one coaching — movement, nutrition, mindset, and recovery, built around you.</p>
  <p><a href="https://drive.google.com/file/d/1jgNdTohze5hF_YPNC79KZZsPAYCUX4jS/view?usp=sharing" target="_blank" rel="noopener">Download the LEAP brochure (PDF) →</a></p>
</div>

<section class="tight">
  <div class="grid-2">
    <div>
      <img src="../images/leap-back-lever.jpg" alt="Back lever on beach parallel bars, Goa">
    </div>
    <div>
      <img src="../images/leap-tree-smile.jpg" alt="Playful movement in a tree, Sudipta smiling">
    </div>
  </div>
</section>

<section class="alt">
  <h2 class="section-title">The 4 pillars</h2>
  <div class="grid-2 narrow">
    <ul class="check-list">
      <li><strong>Learn</strong> — to move & play: personalized workouts, live coaching, breathwork, outdoor training</li>
      <li><strong>Nourish</strong> — progressive nutrition, no dieting or supplements</li>
    </ul>
    <ul class="check-list">
      <li><strong>Activate</strong> — growth mindset, self-talk, mental flexibility</li>
      <li><strong>Plug in to Plug out</strong> — rest, recovery, sleep hygiene</li>
    </ul>
  </div>
</section>

<section>
  <h2 class="section-title">What clients say</h2>
  <div class="narrow">
    ${igEmbed("https://www.instagram.com/reels/DRMgsxzCBZq/", "Lavinder's story")}
    <blockquote class="testimonial">"I first met Sudipta during a nutrition course, where she was my senior... At the time, I had diabetes, chronic knee pain, limited mobility and could barely squat. I joined her one-on-one training simply hoping to move better, but LEAP gave me so much more. Over nearly three years and five to six rounds of LEAP, I trained both in person and online whenever I travelled. Today, in my 50s, I can run, bend without breaking, swing, jump, climb and move more athletically than I did in my 40s! What made LEAP even more special was that Sudipta also included couple sessions for my wife and me. Training together improved our health, helped us align better and even strengthened our relationship."</blockquote>
    <p class="testimonial-author">— Lavinder Singh Duggal, 56, Mumbai</p>

    ${igEmbed("https://www.instagram.com/reel/DErCZXBoOgk/", "Bhavesh's story")}
    <blockquote class="testimonial">"I did Sudipta's four-month LEAP program with her in person in Bombay. Over those four months, I lost weight, felt less stressed and saw my cholesterol levels become more balanced. We worked on movement, mindful eating, sleep and rest. She also introduced me to another client, Lavinder. Training together showed me how good it feels to connect with someone through shared, healthy choices."</blockquote>
    <p class="testimonial-author">— Bhavesh, 62, Mumbai, India</p>
  </div>
</section>

<section class="alt">
  <h2 class="section-title">Pricing</h2>
  <div class="narrow" style="text-align:center;">
    ${price(40000, "Per 4-week cycle")}
    <p class="price-note">16-week (4-month) commitment — ₹1,60,000 total. INR is the billing currency; USD/GBP/EUR shown for reference only.</p>
  </div>
</section>

<section>
  <h2 class="section-title">FAQ</h2>
  <div class="narrow">
    ${faq("I have no fitness routine — is this for me?", "Yes. LEAP is built around where you are today, not where you \"should\" be.")}
    ${faq("I don't intend to become an athlete or pro — is this for me?", "Yes — most clients simply want to move, feel and function better in everyday life.")}
    ${faq("What if I miss or need to reschedule a class?", "Give at least 12 hours' notice. See the Refund & Cancellation Policy for full details.")}
    ${faq("What equipment do I need?", "Minimal — Sudipta will tell you exactly what's needed for your setup during onboarding.")}
    ${faq("Is there a refund policy?", "Fees are non-refundable once a program begins. See the full Refund & Cancellation Policy.")}
    ${faq("What if I have a current or past injury?", "Let her know upfront — the program is adapted around any injury history.")}
    ${faq("What commitment are you asking for?", "16 weeks, roughly 2+ hours of live coaching per week, plus daily movement/nutrition practice.")}
  </div>
</section>

<section class="alt" style="text-align:center;">
  <div class="btn-row" style="justify-content:center;">
    <a class="btn btn-outline dark" href="compare.html">Compare LEAP vs. Playsophy</a>
    <a class="btn btn-primary" href="../discovery.html">${DISCOVERY_CTA_TEXT}</a>
    <a class="btn btn-wa" href="${WA}" target="_blank" rel="noopener">Enroll via WhatsApp</a>
  </div>
</section>
`);

// ---------------- PLAYSOPHY ----------------
page(path.join(OUT, "online-coaching/playsophy.html"), 1, "Playsophy — Group Coaching for Women", "Playsophy: a 12-week, small-group, women-only online coaching journey through the 7 chakras.", `
<div class="page-hero">
  <span class="badge">Group · Women only · 12 weeks</span>
  <h1>Playsophy</h1>
  <p class="lead">A 12-week, small-group journey through the 7 chakras — movement, food, rest and play, for women who already move.</p>
  <p><a href="https://drive.google.com/file/d/1jJvOm31Bg5TxNpa6EKKLjHd-hn4rTFdc/view?usp=sharing" target="_blank" rel="noopener">Download the Playsophy brochure (PDF) →</a></p>
</div>

<section class="tight">
  <div class="center" style="max-width:640px;">
    <img src="../images/playsophy-tree.jpg" alt="Playful outdoor movement in a tree, part of the Playsophy energy">
  </div>
</section>

<section class="alt">
  <h2 class="section-title">Who it's for</h2>
  <div class="narrow">
    <p style="background:var(--accent-soft); border-radius:10px; padding:14px 18px; color:#8a4c1f;"><strong>Not a beginner program.</strong> Playsophy requires an intermediate level of movement discipline — yoga, running, or an otherwise active lifestyle — so it's worth being honest with yourself here before enrolling.</p>
    <ul class="check-list">
      <li>Women, diverse ages (at Sudipta's discretion)</li>
      <li>Past students, or anyone with prior movement experience</li>
    </ul>
  </div>
</section>

<section>
  <h2 class="section-title">Format</h2>
  <div class="narrow">
    <ul class="check-list">
      <li>Group of up to 10 participants</li>
      <li>24 Zoom sessions — Tue & Thu, 6:30–7:30 AM IST</li>
      <li>Sat: journaling / self-practice · Sun: group Q&A (WhatsApp voice notes/video review) · Mon/Wed/Fri: rest</li>
      <li>Recordings available for 6 months</li>
    </ul>
    <p style="color:var(--ink-soft); font-size:0.92rem;">Class time in other timezones: EST 8:00–9:00 PM (prev. day) · CST 7:00–8:00 PM (prev. day) · PST 5:00–6:00 PM (prev. day).</p>
  </div>
</section>

<section class="alt">
  <h2 class="section-title">The 7-chakra framework</h2>
  <p class="narrow" style="text-align:center;">3 sessions per chakra, each covering movement, food & seasonal lifestyle, rest & recovery, and dance & music.</p>
</section>

<section>
  <h2 class="section-title">Pricing</h2>
  <div class="narrow" style="text-align:center;">
    ${price(8000, "Per 4-week cycle")}
    <p class="price-note">12-week commitment — ₹24,000 total. INR is the billing currency; USD/GBP/EUR shown for reference only.</p>
  </div>
</section>

<section class="alt">
  <h2 class="section-title">FAQ</h2>
  <div class="narrow">
    ${faq("What if I miss a class?", "All sessions are recorded, with access for 6 months.")}
    ${faq("Am I too old or unfit to join?", "Playsophy is designed for intermediate movers, not total beginners — age is not the deciding factor, movement background is.")}
    ${faq("Can I continue my other fitness routine alongside this?", "Yes, Playsophy is designed to complement an existing active lifestyle.")}
    ${faq("Will this help with my mental health?", "Many participants report real benefits, though this is a movement and lifestyle program, not a substitute for clinical care.")}
    ${faq("What do I need for the sessions?", "A stable internet connection, space to move, and a willingness to show up consistently.")}
    ${faq("Is this a diet program?", "No — it's about seasonal, mindful food choices, not restriction or dieting.")}
  </div>
</section>

<section style="text-align:center;">
  <div class="btn-row" style="justify-content:center;">
    <a class="btn btn-outline dark" href="compare.html">Compare Playsophy vs. LEAP</a>
    <a class="btn btn-wa" href="${WA}" target="_blank" rel="noopener">Enroll via WhatsApp</a>
  </div>
</section>
`);

// ---------------- COMPARE ----------------
page(path.join(OUT, "online-coaching/compare.html"), 1, "Compare LEAP vs. Playsophy", "A side-by-side comparison of MindfulMonkey Coaching's two online programs: LEAP and Playsophy.", `
<div class="page-hero">
  <h1>LEAP vs. Playsophy</h1>
  <p class="lead">Two different paths to the same place — stronger, more capable, more at home in your body.</p>
</div>

<section class="tight">
  <div class="center">
    <table class="pricing">
      <tr><th></th><th>LEAP</th><th>Playsophy (Women only)</th></tr>
      <tr><td>Format</td><td>1-on-1, fully personalized</td><td>Group, up to 10 participants</td></tr>
      <tr><td>Duration</td><td>16 weeks</td><td>12 weeks</td></tr>
      <tr><td>Live sessions</td><td>Personalized, min. 2 hrs/week, timed around the client</td><td>24 Zoom sessions — Tue & Thu, 6:30–7:30 AM IST</td></tr>
      <tr><td>Recordings</td><td>Live 1-on-1 + reference material</td><td>Available for 6 months</td></tr>
      <tr><td>Core framework</td><td>4 pillars: Learn, Nourish, Activate, Plug in to Plug out</td><td>7-chakra framework — movement, food, rest, dance & music</td></tr>
      <tr><td>Prerequisite</td><td>None — beginners through advanced</td><td>Intermediate movement discipline required</td></tr>
      <tr><td>Audience</td><td>Anyone serious about a 4-month personal transformation</td><td>Women only, diverse ages (coach's discretion)</td></tr>
      <tr><td>Price</td><td>₹40,000/4-wk · 16-wk total ₹1,60,000</td><td>₹8,000/4-wk · 12-wk total ₹24,000</td></tr>
    </table>
  </div>
</section>

<section class="alt" style="text-align:center;">
  <div class="btn-row" style="justify-content:center;">
    <a class="btn btn-primary" href="leap.html">Enroll in LEAP</a>
    <a class="btn btn-primary" href="playsophy.html">Enroll in Playsophy</a>
    <a class="btn btn-outline dark" href="../discovery.html">${DISCOVERY_CTA_TEXT}</a>
  </div>
</section>
`);

// ---------------- DISCOVERY ----------------
page(path.join(OUT, "discovery.html"), 0, "Discovery & Consultation", "Book a 1-hour Discovery or Consultation video call with Sudipta Mondal before committing to a program.", `
<div class="page-hero">
  <h1>Discovery & Consultation</h1>
  <p class="lead">A 1-hour, 1-on-1 video call to get to know Sudipta's method before committing to LEAP — or to get focused help if you're a current or past client.</p>
</div>

<section class="tight">
  <div class="center">
    <table class="pricing">
      <tr><th>Session</th><th>Who it's for</th><th>Fee</th></tr>
      <tr><td>Discovery Session</td><td>New / prospective clients</td><td>₹2,500</td></tr>
      <tr><td>Consultation Session</td><td>Current / previous clients needing specific help</td><td>₹5,000</td></tr>
    </table>
    <p class="price-note">Chargeable — paid in advance, before your scheduled time slot.</p>
  </div>
</section>

<section class="alt">
  <h2 class="section-title">Why start here</h2>
  <div class="narrow">
    ${igEmbed("https://www.instagram.com/reels/DdlZQc7K8wg/", "Sarah Jane Dias — before LEAP")}
    <blockquote class="testimonial">"As an actress, TV host, model and former Femina Miss India World titleholder, I came to Sudipta looking for a program that could improve my endurance, intensity, energy and flexibility, along with real nutritional guidance and an honest look at habits I didn't even realize were holding me back — things like sleep quality and supplement use. The Discovery & Consultation session convinced me to sign up for LEAP, and I've now been with the program for over 3 years. Sudipta has been a constant presence throughout — mapping out the roadmap, setting goals, and providing the nudging I need to actually hit them."</blockquote>
    <p class="testimonial-author">— Sarah Jane Dias, former Femina Miss India World, Mumbai, India</p>
  </div>
</section>

<section style="text-align:center;">
  <p class="narrow">Book via Cal.com and pay via the Razorpay Payment Page (please pay before your scheduled time slot). Payment links are being finalized — for now, book directly via WhatsApp and Sudipta will confirm your slot.</p>
  <a class="btn btn-wa" href="${WA}" target="_blank" rel="noopener">Book via WhatsApp</a>
</section>
`);

// ---------------- GROUP CLASSES ----------------
page(path.join(OUT, "group-classes.html"), 0, "Group Classes — Goa", "Outdoor parkour and movement group classes in Panjim, Goa — three mornings a week.", `
<div class="page-hero">
  <h1>Group Classes, Goa</h1>
  <p class="lead">Outdoor parkour and movement classes in Panjim, Goa, three mornings a week — rain or shine, always outdoors.</p>
</div>

<section class="tight">
  <div class="center" style="max-width:640px;">
    <img src="images/groupclass-vault.jpg" alt="Parkour vault at an outdoor group class">
    <p style="font-size:0.85rem; color:var(--ink-soft); margin-top:6px;">Photo for illustration — swap for an actual Goa group-class photo once available.</p>
  </div>
</section>

<section class="alt">
  <h2 class="section-title">Schedule</h2>
  <p class="narrow" style="text-align:center;">Monday, Wednesday, Friday · 6:45–7:45/8:00 AM · Panjim, Goa (rotating outdoor locations, shared ahead of each class)</p>
</section>

<section>
  <h2 class="section-title">Pricing</h2>
  <div class="center">
    <table class="pricing">
      <tr><th>Package</th><th>Fee</th></tr>
      <tr><td>Drop-in</td><td>₹850</td></tr>
      <tr><td>6 sessions</td><td>₹4,200</td></tr>
      <tr><td>8 sessions</td><td>₹4,800</td></tr>
      <tr><td>10 sessions</td><td>₹6,000</td></tr>
      <tr><td>12 sessions</td><td>₹7,000</td></tr>
    </table>
    <p class="price-note">Billing is for the full month. Joining mid-month? A lower package or drop-in rate applies for that month.</p>
  </div>
</section>

<section class="alt" style="text-align:center;">
  <a class="btn btn-wa" href="${WA}" target="_blank" rel="noopener">Join via WhatsApp</a>
</section>
`);

// ---------------- ABOUT ----------------
page(path.join(OUT, "about.html"), 0, "About Sudipta", "Sudipta Mondal — parkour coach, holistic health coach, Naked and Afraid finalist, founder of MindfulMonkey Coaching.", `
<div class="page-hero">
  <h1>About Sudipta</h1>
  <p class="lead">Started at 30, after her divorce. First push-up at 31. First front-flip at 34.</p>
</div>

<section class="tight">
  <div class="grid-2">
    <img src="images/about-portrait.jpg" alt="Portrait of Sudipta Mondal">
    <ul class="check-list">
      <li>First female Indian finalist, Discovery Channel's <em>Naked and Afraid</em> (Aadimanav)</li>
      <li>Apex Movement Certified Parkour Coach (Dec 2026) — first Indian accepted into the program</li>
      <li>Founder, MindfulMonkey Coaching — LEAP, Playsophy, and Goa Group Classes</li>
    </ul>
  </div>
</section>

<section class="alt">
  <h2 class="section-title">Naked and Afraid: Aadimanav</h2>
  <div class="grid-2">
    <img src="images/about-na-portrait.jpg" alt="Personal photo from Sudipta's Naked and Afraid: Aadimanav experience">
    <img src="images/about-na-billboard.jpg" alt="Sudipta in front of the Naked and Afraid: Aadimanav billboard">
  </div>
</section>

<section>
  <h2 class="section-title">More</h2>
  <div class="gallery">
    <figure><img src="images/about-backbend.jpg" alt="Studio photo, backbend"><figcaption>Flexibility and control — studio.</figcaption></figure>
    <figure><img src="images/about-headstand.jpg" alt="Studio photo, headstand"><figcaption>Headstand — strength and balance.</figcaption></figure>
    <figure><img src="images/about-plank.jpg" alt="Plank on paralettes, studio"><figcaption>Plank on paralettes, studio.</figcaption></figure>
    <figure><img src="images/about-blue-dress.jpg" alt="Editorial portrait, blue dress"><figcaption>Editorial portrait.</figcaption></figure>
    <figure><img src="images/about-sunflower.jpg" alt="Sudipta in a Goa paddy field, holding a sunflower"><figcaption>Off-duty, in a Goa paddy field.</figcaption></figure>
  </div>
</section>

<section class="alt">
  <h2 class="section-title">Certifications</h2>
  <div class="narrow">
    <ul class="check-list">
      <li>Apex Movement Certified Parkour Coach (Dec 2026) — India's first</li>
      <li>Level 1 Parkour Coach, Parkour Generations London</li>
      <li>Level 1 Ashtanga & Hatha Yoga Teacher</li>
      <li>Certified Personal Trainer & Functional Strength Trainer — FSSA / AFAA</li>
      <li>CPR & AED — American Heart Association</li>
      <li>Certified in Care & Prevention of Sports/Fitness Injuries</li>
    </ul>
  </div>
</section>

<section>
  <h2 class="section-title">Press</h2>
  <div class="narrow">
    <ul class="check-list">
      <li>T2 Online — Survival show star Sudipta Mondal on Naked and Afraid</li>
      <li>Times Now News — Sudipta Mondal on Naked and Afraid</li>
      <li>Filmibeat — Naked and Afraid Aadimanav: who is Sudipta Mondal</li>
      <li>Indulge Express — topic page</li>
      <li>The Entrepreneurs of India — building a holistic health movement</li>
      <li>Icy Tales — Sudipta Mondal, holistic health & fitness coach</li>
      <li>Prime Video / IMDb — Naked and Afraid Aadimanav</li>
    </ul>
  </div>
</section>
`);

// ---------------- TESTIMONIALS ----------------
page(path.join(OUT, "testimonials.html"), 0, "Testimonials", "Real transformations from LEAP, Playsophy, and Group Class students at MindfulMonkey Coaching.", `
<div class="page-hero">
  <h1>Testimonials & Transformations</h1>
</div>

<section class="tight">
  <div class="narrow">
    <ul class="check-list">
      <li>Arata, 63, Washington D.C., USA — reversed inguinal hernia without surgery, gained the stamina to perform headstands</li>
      <li>Srishti, 24, Gurugram, India — knee pain gone completely; first-ever fitness program</li>
      <li>Vaishnavi, 34, Bangalore, India — Playsophy helped her support her daughter's natural movement instincts</li>
      <li>Rajni, 38, New Delhi, India — small daily habit shifts alongside training</li>
      <li>Parineeta, 36, USA — feels healthier, stronger, more self-aware after ~3 months</li>
    </ul>
  </div>
</section>

<section class="alt">
  <div class="narrow">
    <blockquote class="testimonial">"My experience of personal coaching with Sudipta — it was body, mind and life transformation experience. This mindful coaching not only changes your perspective towards your body it also upgrades your beliefs about movement and holistic health. It's highly recommended for females because no one can understand the female body and mind needs more than a female coach."</blockquote>
    <p class="testimonial-author">— Usha, 43, Pune, India</p>
  </div>
</section>

<section style="text-align:center;">
  <a class="btn btn-primary" href="online-coaching/leap.html">See LEAP</a>
  <a class="btn btn-outline dark" href="discovery.html">${DISCOVERY_CTA_TEXT}</a>
</section>
`);

// ---------------- CONTACT ----------------
page(path.join(OUT, "contact.html"), 0, "Contact", "Get in touch with MindfulMonkey Coaching via WhatsApp, Instagram, or the contact form.", `
<div class="page-hero">
  <h1>Contact</h1>
  <p class="lead">Fastest way to reach Sudipta is WhatsApp. You can also use the form below.</p>
</div>

<section class="tight" style="text-align:center;">
  <div class="btn-row" style="justify-content:center;">
    <a class="btn btn-wa" href="${WA}" target="_blank" rel="noopener">WhatsApp</a>
    <a class="btn btn-outline dark" href="${IG_MAIN}" target="_blank" rel="noopener">Instagram — @sudipta03</a>
    <a class="btn btn-outline dark" href="${IG_GOA}" target="_blank" rel="noopener">Instagram — @goaparkour (Goa classes)</a>
  </div>
</section>

<section class="alt">
  <!--
    Replace YOUR_ACCESS_KEY_HERE with a free Web3Forms access key (web3forms.com),
    tied to mindfulmonkeycoach@gmail.com. No backend needed — submissions land
    straight in that inbox, and the email itself is never printed on this page.
  -->
  <form class="contact-form" action="https://api.web3forms.com/submit" method="POST">
    <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
    <input type="checkbox" name="botcheck" class="hp-field" tabindex="-1" autocomplete="off">
    <label>Name<input type="text" name="name" required></label>
    <label>Email<input type="email" name="email" required></label>
    <label>Message<textarea name="message" rows="5" required></textarea></label>
    <button class="btn btn-primary" type="submit">Send message</button>
  </form>
</section>
`);

// ---------------- REFUND POLICY ----------------
page(path.join(OUT, "refund-policy.html"), 0, "Refund & Cancellation Policy", "Refund and cancellation policy for MindfulMonkey Coaching programs.", `
<div class="page-hero"><h1>Refund & Cancellation Policy</h1></div>
<section class="legal narrow">
  <p style="color:var(--ink-soft); font-style:italic;">Drafted from the existing LEAP/Playsophy/Group Class rules. Have this reviewed before relying on it as a legal document.</p>
  <h2>LEAP & Playsophy</h2>
  <ul>
    <li>All fees are non-refundable once a program begins.</li>
    <li>Rescheduling or cancelling a session requires 12 hours' notice; anything later counts as a session attended.</li>
    <li>If Sudipta cancels a session, a makeup class will be scheduled.</li>
    <li>No makeup sessions are offered for a client-side cancellation, except for a genuine emergency, at Sudipta's discretion.</li>
  </ul>
  <h2>Discovery & Consultation Sessions</h2>
  <ul>
    <li>Fees must be paid before the scheduled time slot.</li>
    <li>Non-refundable once booked; rescheduling is possible with reasonable notice, at Sudipta's discretion.</li>
  </ul>
  <h2>Group Classes (Goa)</h2>
  <ul>
    <li>Billing is monthly. Fees for the month are non-refundable once paid.</li>
    <li>Joining mid-month: a lower package or drop-in rate applies for that month only.</li>
  </ul>
</section>
`);

// ---------------- PRIVACY POLICY ----------------
page(path.join(OUT, "privacy-policy.html"), 0, "Privacy Policy", "Privacy policy for MindfulMonkey Coaching.", `
<div class="page-hero"><h1>Privacy Policy</h1></div>
<section class="legal narrow">
  <p style="color:var(--ink-soft); font-style:italic;">Basic draft for a small coaching business. Have this reviewed before relying on it as a legal document.</p>
  <ul>
    <li>MindfulMonkey Coaching collects only what's needed to respond to enquiries and process enrollments: name, email, phone/WhatsApp number, and payment details (handled directly by Razorpay/PayPal — we do not store card or bank details ourselves).</li>
    <li>Information submitted via the Contact form or booking pages is used only to communicate with you about your enquiry, session, or program, and is not sold or shared with third parties.</li>
    <li>Payment processing is handled by Razorpay and, where applicable, PayPal, under their own respective privacy and security policies.</li>
    <li>Session recordings (Playsophy) are for your personal reference only and are not shared publicly without consent.</li>
    <li>For any questions about your data, contact us via the <a href="contact.html">Contact page</a>.</li>
  </ul>
</section>
`);

// ---------------- TERMS ----------------
page(path.join(OUT, "terms.html"), 0, "Terms & Conditions", "Terms and conditions for MindfulMonkey Coaching programs.", `
<div class="page-hero"><h1>Terms & Conditions</h1></div>
<section class="legal narrow">
  <p style="color:var(--ink-soft); font-style:italic;">Basic draft. Have this reviewed before relying on it as a legal document.</p>
  <ul>
    <li>All coaching programs (LEAP, Playsophy, Discovery & Consultation, Group Classes) are provided by Sudipta Mondal / MindfulMonkey Coaching.</li>
    <li>Participation requires self-assessment of fitness for physical activity; consult a doctor before starting if you have a pre-existing condition.</li>
    <li>MindfulMonkey Coaching is not liable for injury arising from participation, to the extent permitted by law.</li>
    <li>Program content, brochures, and recordings are for the enrolled participant's personal use only and may not be redistributed.</li>
    <li>Fees and refund terms are governed by the <a href="refund-policy.html">Refund & Cancellation Policy</a>.</li>
    <li>These terms may be updated from time to time; continued use of the site or programs constitutes acceptance of the current terms.</li>
  </ul>
</section>
`);

console.log("\nDone.");
