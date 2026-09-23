// Live INR -> USD/GBP/EUR conversion for on-page pricing.
// No API key needed (open.er-api.com). Cached per tab via sessionStorage.
// Fails gracefully to INR-only if the API is unreachable.
(function () {
  var CACHE_KEY = "mm_fx_rates_v1";
  var CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

  function getCached() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (Date.now() - data.fetchedAt > CACHE_TTL_MS) return null;
      return data.rates;
    } catch (e) { return null; }
  }

  function setCached(rates) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ rates: rates, fetchedAt: Date.now() }));
    } catch (e) {}
  }

  function fetchRates() {
    var cached = getCached();
    if (cached) return Promise.resolve(cached);
    return fetch("https://open.er-api.com/v6/latest/INR")
      .then(function (r) { if (!r.ok) throw new Error("fx fetch failed"); return r.json(); })
      .then(function (data) {
        if (!data || !data.rates) throw new Error("bad fx payload");
        setCached(data.rates);
        return data.rates;
      });
  }

  function formatMoney(amount, symbol) {
    return symbol + Math.round(amount).toLocaleString("en-US");
  }

  function applyRates(rates) {
    var nodes = document.querySelectorAll("[data-inr]");
    nodes.forEach(function (node) {
      var inr = parseFloat(node.getAttribute("data-inr"));
      if (!inr || !rates) return;
      var usd = inr * (rates.USD || 0);
      var gbp = inr * (rates.GBP || 0);
      var eur = inr * (rates.EUR || 0);
      var fxNode = node.querySelector(".price-fx");
      if (fxNode && rates.USD) {
        fxNode.textContent =
          "≈ " + formatMoney(usd, "$") + " / " + formatMoney(gbp, "£") + " / " + formatMoney(eur, "€") +
          " (approx., billed in INR)";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fetchRates()
      .then(applyRates)
      .catch(function () {
        document.querySelectorAll(".price-fx").forEach(function (n) {
          n.textContent = "Billed in INR. Live USD/GBP/EUR conversion unavailable right now.";
        });
      });
  });
})();
