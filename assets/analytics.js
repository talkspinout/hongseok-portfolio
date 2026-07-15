/* ============================================================
   analytics.js — GTM/GA4 초기화.
   data.js 로드 직후 head에서 실행되어 트래킹 타이밍을 최대한 앞당깁니다.
   ============================================================ */

(function () {
  "use strict";

  if (SITE.GTM_ID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    const g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtm.js?id=" + SITE.GTM_ID;
    document.head.appendChild(g);
  }

  if (SITE.GA_ID) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + SITE.GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", SITE.GA_ID);
  }
})();
