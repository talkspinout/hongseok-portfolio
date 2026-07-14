/* ============================================================
   main.js — 렌더링 로직. 콘텐츠 수정은 data.js에서만 하세요.
   ============================================================ */

(function () {
  "use strict";

  const PAGE = document.body.dataset.page; // "home" | "portfolio" | "lab"
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Google Tag Manager (컨테이너 ID가 있을 때만 로드) ---------- */
  if (SITE.GTM_ID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    const g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtm.js?id=" + SITE.GTM_ID;
    document.head.appendChild(g);
  }

  /* ---------- GA4 (측정 ID가 있을 때만 로드) ---------- */
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

  /* ---------- GNB (햄버거 드로어) ---------- */
  function buildGNB() {
    const nav = document.getElementById("gnb");
    if (!nav) return;

    nav.innerHTML =
      '<div class="gnb-logo"><span class="dot"></span>' + SITE.name + "</div>" +
      '<a class="nav-item" data-page="home" href="index.html" data-track="navigation" data-track-id="nav_home" data-track-location="gnb">홈 · 하이라이트</a>' +
     
      '<div class="gnb-label">개별 항목</div>' +
      '<a class="nav-item" data-page="about" href="about.html" data-track="navigation" data-track-id="nav_about" data-track-location="gnb">간단한 자기 소개</a>' +
      '<a class="nav-item" data-page="portfolio" href="portfolio.html" data-track="navigation" data-track-id="nav_portfolio" data-track-location="gnb">자세한 포트폴리오</a>' +
      '<a class="nav-item" data-page="lab" href="lab.html" data-track="navigation" data-track-id="nav_lab" data-track-location="gnb">Lab · 프레임워크</a>' +
      '<div class="gnb-foot">© ' + new Date().getFullYear() + " Hongseok Ko</div>";

    // 현재 페이지 표시
    nav.querySelectorAll("[data-page]").forEach(function (a) {
      if (a.dataset.page === PAGE) a.classList.add("active");
    });

    // 배경 스크림
    const scrim = document.createElement("div");
    scrim.className = "scrim";
    document.body.appendChild(scrim);

    const btn = document.getElementById("menuBtn");

    function setOpen(open) {
      nav.classList.toggle("open", open);
      scrim.classList.toggle("show", open);
      if (btn) btn.setAttribute("aria-expanded", String(open));
    }

    if (btn) {
      btn.addEventListener("click", function () {
        setOpen(!nav.classList.contains("open"));
      });
    }
    scrim.addEventListener("click", function () { setOpen(false); });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ---------- 홈: 숫자 보드 ---------- */
  function buildMetrics() {
    const grid = document.getElementById("metricGrid");
    if (!grid) return;
    grid.innerHTML = METRICS.map(function (m) {
      return (
        '<div class="metric-card reveal">' +
        '<div class="metric-num" data-value="' + m.value + '" data-decimals="' + (m.decimals || 0) + '">' +
        '<span class="unit">' + (m.prefix || "") + "</span>" +
        '<span class="count">0</span>' +
        '<span class="unit">' + (m.suffix || "") + "</span>" +
        "</div>" +
        '<div class="metric-label">' + m.label + "</div>" +
        '<div class="metric-note">' + m.note + "</div>" +
        "</div>"
      );
    }).join("");
  }

  function animateCount(el) {
    const target = Number(el.dataset.value);
    const decimals = Number(el.dataset.decimals) || 0;
    const countEl = el.querySelector(".count");
    function fmt(n) {
      return decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString();
    }
    if (reduceMotion) { countEl.textContent = fmt(target); return; }
    const dur = 900;
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      countEl.textContent = fmt(target * eased);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- 홈: 프로젝트 카드 ---------- */
  function buildProjects() {
    const wrap = document.getElementById("projectList");
    if (!wrap) return;
    wrap.innerHTML = PROJECTS.map(function (p) {
      return (
        '<article class="project-card reveal" id="' + p.id + '">' +
        '<div class="project-head">' +
        '<span class="tag">' + p.domain + "</span>" +
        '<span class="tag dim">' + p.period + "</span>" +
        '<span class="tag dim">' + p.role + "</span>" +
        "</div>" +
        '<h3 class="project-name">' + p.name + "</h3>" +
        '<div class="par-grid">' +
        '<div class="par-item"><h4>문제</h4><p>' + p.problem + "</p></div>" +
        '<div class="par-item"><h4>실행</h4><p>' + p.action + "</p></div>" +
        '<div class="par-item result"><h4>성과</h4><p>' + p.result + "</p></div>" +
        "</div>" +
        "</article>"
      );
    }).join("");
  }

  /* ---------- 포트폴리오: 게이트 ---------- */
  function buildGate() {
    const headline = document.getElementById("gateHeadline");
    if (headline) headline.textContent = GATE.headline;

    const steps = document.getElementById("stepGrid");
    if (steps) {
      steps.innerHTML = GATE.steps.map(function (s, i) {
        return (
          '<div class="step-card reveal">' +
          '<div class="step-num">' + (i + 1) + "</div>" +
          "<h4>" + s.title + "</h4><p>" + s.desc + "</p></div>"
        );
      }).join("");
    }

    document.querySelectorAll("[data-form-link]").forEach(function (a) {
      if (SITE.FORM_URL) {
        a.href = SITE.FORM_URL;
        a.target = "_blank";
        a.rel = "noopener";
      } else {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          alert("신청 폼 준비 중입니다. data.js의 FORM_URL에 Google Form 주소를 입력해 주세요.");
        });
      }
    });
  }

  /* ---------- 소개 ---------- */
  function buildAbout() {
    const skills = document.getElementById("skillTags");
    if (skills) {
      skills.innerHTML = ABOUT.skills.map(function (s) {
        return '<span class="tag skill">' + s + "</span>";
      }).join("");
    }
    const heroT = document.getElementById("aboutTitle");
    if (heroT) heroT.textContent = ABOUT.heroTitle;
    const heroS = document.getElementById("aboutSub");
    if (heroS) heroS.textContent = ABOUT.heroSub;
    const edu = document.getElementById("eduLine");
    if (edu) edu.textContent = ABOUT.education;

    const list = document.getElementById("careerList");
    if (list) {
      list.innerHTML = CAREER.map(function (c) {
        return (
          '<div class="career-item reveal">' +
          '<div class="career-dot" aria-hidden="true"></div>' +
          '<div class="career-body">' +
          '<div class="career-head">' +
          '<strong>' + c.company + "</strong>" +
          '<span class="tag dim">' + c.role + "</span>" +
          '<span class="career-period">' + c.period + "</span>" +
          "</div>" +
          '<p class="career-desc">' + c.desc + "</p>" +
          '<p class="career-result">' + c.result + "</p>" +
          "</div></div>"
        );
      }).join("");
    }
  }

  /* ---------- Lab ---------- */
  function buildLab() {
    const wrap = document.getElementById("labList");
    if (!wrap) return;
    wrap.innerHTML = LAB_ITEMS.map(function (item) {
      const badge = item.type === "framework" ? "프레임워크" : "개인 프로젝트";
      const btn = item.link
        ? '<a class="btn btn-ghost" href="' + item.link + '" target="_blank" rel="noopener" data-track="cta" data-track-id="view_framework" data-track-location="lab_card">' +
          (item.linkLabel || "보러 가기") + ' <span class="arrow">→</span></a>'
        : "";
      return (
        '<article class="lab-card reveal">' +
        '<span class="tag">' + badge + "</span>" +
        "<h3>" + item.title + "</h3>" +
        "<p>" + item.desc + "</p>" +
        btn +
        "</article>"
      );
    }).join("");
  }

  /* ---------- 공통 텍스트 주입 ---------- */
  function fillCommon() {
    document.querySelectorAll("[data-site-tagline]").forEach(function (el) {
      el.textContent = SITE.tagline;
    });
  }

  /* ---------- 푸터 소셜 · 컨택 ---------- */
  const ICONS = {
    instagram:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.49 2.49 0 1 1 0 4.98 2.49 2.49 0 0 1 0-4.98zM3 9h4v12H3zM9.5 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21h-4z"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/></svg>',
  };

  function buildFooterSocial() {
    document.querySelectorAll("[data-social]").forEach(function (slot) {
      let html = "";
      if (SITE.INSTAGRAM_URL) {
        html += '<a class="icon" href="' + SITE.INSTAGRAM_URL + '" target="_blank" rel="noopener" aria-label="Instagram" data-track="social" data-track-id="social_instagram" data-track-location="footer">' + ICONS.instagram + "</a>";
      }
      if (SITE.LINKEDIN_URL) {
        html += '<a class="icon" href="' + SITE.LINKEDIN_URL + '" target="_blank" rel="noopener" aria-label="LinkedIn" data-track="social" data-track-id="social_linkedin" data-track-location="footer">' + ICONS.linkedin + "</a>";
      }
      if (SITE.EMAIL) {
  html += '<a class="icon" href="mailto:' + SITE.EMAIL + '" title="' + SITE.EMAIL + '" aria-label="이메일 보내기" data-track="contact" data-track-id="contact_email" data-track-location="footer">' + ICONS.mail + "</a>";
}
      slot.innerHTML = html;
    });
  }

  /* ---------- 공통 클릭 추적 (Google Tag Manager) ---------- */
  function initTracking() {
    document.addEventListener("click", function (event) {
      const element = event.target.closest("[data-track]");
      if (!element) return;

      const href = element.href || "";
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "ui_click",
        element_type: element.dataset.track || "",
        element_id: element.dataset.trackId || "",
        element_location: element.dataset.trackLocation || "",
        element_text: (element.textContent || "").trim().replace(/\s+/g, " "),
        link_url: href.indexOf("mailto:") === 0 ? "mailto" : href,
        page_type: PAGE || ""
      });
    });
  }

  /* ---------- 스크롤 리빌 + 카운트업 ---------- */
  function observe() {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          e.target.querySelectorAll(".metric-num").forEach(animateCount);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }

  buildGNB();
  fillCommon();
  buildFooterSocial();
  buildMetrics();
  buildProjects();
  buildAbout();
  buildGate();
  buildLab();
  initTracking();
  observe();
})();
