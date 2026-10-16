// Cookieless, DNT-aware Matomo (self-hosted at mt.marcopontili.com, site 3).
// Served as a first-party file so the CSP needs no 'unsafe-inline'; loaded by
// src/main.tsx on the app and by a <script src> tag on the static pages.
// Mirrors the marcopontili.com snippet. See /privacy.
var _paq = (window._paq = window._paq || []);
_paq.push(["setDoNotTrack", true]);
_paq.push(["disableCookies"]);
_paq.push(["setRequestMethod", "POST"]);
_paq.push(["trackPageView"]);
_paq.push(["enableLinkTracking"]);
(function () {
  var u = "https://mt.marcopontili.com/";
  var p = "m/";
  _paq.push(["setTrackerUrl", u + p]);
  _paq.push(["setSiteId", "3"]);
  var d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0];
  g.async = true;
  g.src = u + p;
  s.parentNode.insertBefore(g, s);
})();
