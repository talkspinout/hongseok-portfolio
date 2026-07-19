/* ============================================================
   main.js — 렌더링 로직. 콘텐츠 수정은 data.js에서만 하세요.
   ============================================================ */

(function () {
  "use strict";

  const PAGE = document.body.dataset.page; // "home" | "about" | "portfolio" | "lab" | "sentence" | "marketing-funnel" | "marketing-funnel-check"
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- GNB (햄버거 드로어) ---------- */
  function buildGNB() {
    const nav = document.getElementById("gnb");
    if (!nav) return;

    nav.innerHTML =
      '<a class="gnb-logo" href="index.html" data-track="navigation" data-track-id="brand_home" data-track-location="gnb"><span class="dot"></span>Portfolio</a>' +
      '<a class="nav-item" data-page="home" href="index.html" data-track="navigation" data-track-id="nav_home" data-track-location="gnb">하이라이트</a>' +
      '<a class="nav-item" data-page="about" href="about.html" data-track="navigation" data-track-id="nav_about" data-track-location="gnb">자기 소개</a>' +
      '<a class="nav-item" data-page="portfolio" href="portfolio.html" data-track="navigation" data-track-id="nav_portfolio" data-track-location="gnb">포트폴리오</a>' +
      '<a class="nav-item" data-page="lab" href="lab.html" data-track="navigation" data-track-id="nav_lab" data-track-location="gnb">개인 프로젝트</a>' +
      '<div class="gnb-separator" aria-hidden="true">·</div>' +
      '<a class="nav-item" data-page="sentence" href="sentence.html" data-track="navigation" data-track-id="nav_sentence_machine" data-track-location="gnb">문장 자판기</a>' +
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

    function setOpen(open, returnFocus) {
      nav.classList.toggle("open", open);
      scrim.classList.toggle("show", open);
      document.body.classList.toggle("menu-open", open);
      if (btn) {
        btn.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
        btn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      }
      if (open) {
        requestAnimationFrame(function () {
          const firstLink = nav.querySelector("a");
          if (firstLink) firstLink.focus();
        });
      } else if (returnFocus && btn) {
        btn.focus();
      }
    }

    if (btn) {
      btn.addEventListener("click", function () {
        setOpen(!nav.classList.contains("open"), false);
      });
    }
    scrim.addEventListener("click", function () { setOpen(false, true); });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false, false);
    });
    // 드로어가 열려 있을 때 포커스를 내부에 가둔다
    document.addEventListener("keydown", function (e) {
      if (!nav.classList.contains("open")) return;

      if (e.key === "Escape") {
        setOpen(false, true);
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = nav.querySelectorAll("a[href]");
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------- 홈: 숫자 보드 ---------- */
  function buildMetrics() {
    const grid = document.getElementById("metricGrid");
    if (!grid) return;
    grid.innerHTML = METRICS.map(function (m) {
      /* display가 있으면 구체 수치 대신 정성적 텍스트를 그대로 보여줍니다
         (카운트업 애니메이션 없음). value가 있는 카드만 숫자를 센다. */
      const numEl = m.display
        ? '<div class="metric-num metric-num-text">' + m.display + "</div>"
        : '<div class="metric-num" data-value="' + m.value + '" data-decimals="' + (m.decimals || 0) + '">' +
          '<span class="unit">' + (m.prefix || "") + "</span>" +
          '<span class="count">0</span>' +
          '<span class="unit">' + (m.suffix || "") + "</span>" +
          "</div>";
      return (
        '<div class="metric-card reveal">' +
        numEl +
        '<div class="metric-label">' + m.label + "</div>" +
        '<div class="metric-note">' + m.note + "</div>" +
        "</div>"
      );
    }).join("");
  }

  function animateCount(el) {
    const countEl = el.querySelector(".count");
    if (!countEl) return; /* metric-num-text처럼 카운트업 대상이 아닌 텍스트 카드는 건너뜀 */
    const target = Number(el.dataset.value);
    const decimals = Number(el.dataset.decimals) || 0;
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
  }

  /* ---------- 소개 ---------- */
  function buildAbout() {
    const heroT = document.getElementById("aboutTitle");
    if (heroT) heroT.textContent = ABOUT.heroTitle;
    const heroS = document.getElementById("aboutSub");
    if (heroS) heroS.textContent = ABOUT.heroSub;

    const directions = document.getElementById("careerDirections");
    if (directions) {
      directions.innerHTML = CAREER_DIRECTIONS.map(function (item, i) {
        return (
          '<article class="direction-card reveal">' +
          '<span class="direction-num">0' + (i + 1) + '</span>' +
          '<h3>' + item.title + '</h3>' +
          '<p>' + item.desc + '</p>' +
          '</article>'
        );
      }).join("");
    }

    const journeyDesc = document.getElementById("journeyDesc");
    if (journeyDesc) journeyDesc.textContent = CAREER_JOURNEY.desc;
    const journey = document.getElementById("careerJourney");
    if (journey) {
      journey.innerHTML = CAREER_JOURNEY.items.map(function (item) {
        return (
          '<article class="journey-item reveal">' +
          '<span class="journey-dot" aria-hidden="true"></span>' +
          '<span class="journey-period">' + item.period + '</span>' +
          '<strong>' + item.title + '</strong>' +
          '<span>' + item.desc + '</span>' +
          '</article>'
        );
      }).join("");
    }

    const experienceDesc = document.getElementById("experienceDesc");
    if (experienceDesc) experienceDesc.textContent = EXPERIENCE_INTRO;
    const experienceList = document.getElementById("experienceList");
    if (experienceList) {
      experienceList.innerHTML = CAREER.map(function (career) {
        const achievements = career.achievements && career.achievements.length
          ? '<div class="achievement-section"><h4>대표 성과</h4><div class="achievement-grid">' +
            career.achievements.map(function (item) {
              return (
                '<div class="achievement-item">' +
                (item.subject ? '<span>' + item.subject + '</span>' : '') +
                '<strong>' + item.result + '</strong>' +
                (item.note ? '<small>' + item.note + '</small>' : '') +
                '</div>'
              );
            }).join("") + '</div></div>'
          : "";

        const clients = career.clients && career.clients.length
          ? '<div class="client-section"><h4>' + career.highlightsTitle + '</h4><div class="client-grid">' +
            career.clients.map(function (client) {
              return (
                '<article class="client-item' + (client.featured ? ' featured' : '') + '">' +
                '<div class="client-heading">' +
                '<h5>' + client.name + '</h5>' +
                (client.clientType ? '<span class="client-type">' + client.clientType + '</span>' : '') +
                '</div>' +
                (client.companyStanding
                  ? '<p class="client-standing">' + client.companyStanding +
                    (client.standingNote ? '<small>' + client.standingNote + '</small>' : '') + '</p>'
                  : '') +
                '<p class="client-profile">' + client.companyProfile + '</p>' +
                '<p class="client-work">' + client.workSummary + '</p>' +
                (client.clientAchievements
                  ? '<div class="client-results">' + client.clientAchievements.map(function (result) {
                      return '<span>' + result + '</span>';
                    }).join("") + '</div>'
                  : '') +
                '</article>'
              );
            }).join("") + '</div>' +
            (career.otherClients
              ? '<div class="other-clients"><h5>기타 주요 클라이언트</h5><div class="other-client-grid">' +
                career.otherClients.map(function (client) {
                  return '<div class="other-client-item"><strong>' + client.name + '</strong><span>' + client.workSummary + '</span></div>';
                }).join("") + '</div></div>'
              : '') +
            '</div>'
          : "";

        return (
          '<article class="experience-card reveal">' +
          '<div class="experience-head">' +
          '<div><span class="tag">' + career.domain + '</span><h3>' + career.company + '</h3></div>' +
          '<div class="experience-meta"><strong>' + career.role + '</strong><span>' + career.period + '</span></div>' +
          '</div>' +
          '<p class="experience-summary">' + career.summary + '</p>' +
          '<div class="responsibility-section"><h4>주요 업무</h4><ul>' +
          career.responsibilities.map(function (item) { return '<li>' + item + '</li>'; }).join("") +
          '</ul></div>' +
          achievements +
          clients +
          '</article>'
        );
      }).join("");
    }

    const capabilityDesc = document.getElementById("capabilityDesc");
    if (capabilityDesc) capabilityDesc.textContent = CORE_CAPABILITIES_INTRO;
    const capabilities = document.getElementById("capabilityGrid");
    if (capabilities) {
      capabilities.innerHTML = CORE_CAPABILITIES.map(function (item, i) {
        return (
          '<article class="capability-card reveal">' +
          '<span>0' + (i + 1) + '</span>' +
          '<div><h3>' + item.title + '</h3><strong>' + item.keywords + '</strong><p>' + item.desc + '</p></div>' +
          '</article>'
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
      const isExternal = item.link && /^https?:\/\//.test(item.link);
      const btn = item.link
        ? '<a class="btn btn-ghost" href="' + item.link + '"' + (isExternal ? ' target="_blank" rel="noopener"' : "") +
          ' data-track="cta" data-track-id="view_framework" data-track-location="lab_card">' +
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
    const revealEls = Array.from(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in"); });
      return;
    }

    revealEls.forEach(function (el) { el.classList.add("reveal-pending"); });
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.remove("reveal-pending");
          e.target.classList.add("in");
          e.target.querySelectorAll(".metric-num").forEach(animateCount);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px 80px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });

    window.setTimeout(function () {
      revealEls.forEach(function (el) {
        el.classList.remove("reveal-pending");
        el.classList.add("in");
      });
    }, 1800);
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
