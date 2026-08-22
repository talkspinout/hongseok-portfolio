/* ============================================================
   analytics.js — GTM/GA4 초기화 + 사이트 공통 노출 보정.
   data.js 로드 직후 head에서 실행됩니다.
   ============================================================ */

(function () {
  "use strict";

  const site = typeof SITE !== "undefined" ? SITE : {
    GTM_ID: "GTM-NPBTB82",
    GA_ID: "",
    EMAIL: "hs5431@gmail.com",
    INSTAGRAM_URL: "https://www.instagram.com/talkspinout/",
    LINKEDIN_URL: "https://www.linkedin.com/in/%ED%99%8D%EC%84%9D-%EA%B3%A0-108895b0/",
  };

  /* ---------- Marketing Lab 항목 순서 ---------- */
  if (typeof LAB_ITEMS !== "undefined" && Array.isArray(LAB_ITEMS)) {
    const byTitle = function (keyword) {
      return LAB_ITEMS.find(function (item) { return item.title && item.title.indexOf(keyword) !== -1; });
    };
    const think = byTitle("Think2Brief");
    const funnel = byTitle("마케팅 퍼널 운영 프레임워크");
    const creepy = byTitle("괴담통보망");
    const ai = byTitle("AI Workspace") || {
      type: "project",
      title: "AI Workspace",
      desc: "여러 AI를 오가며 작업할 때 맥락이 끊기는 문제에서 시작한 Task 중심 Workspace입니다. Handoff로 다음 Agent에게 작업을 넘겨 연속성을 잃지 않고 작업을 이어갈 수 있도록 만들었습니다.",
      link: "aiworkspace.html",
      linkLabel: "제작기 보기",
      banner: "assets/aiworkspace-lab-banner.svg",
      bannerAlt: "Discord에서 Task와 Handoff를 거쳐 다음 AI가 작업을 이어받는 AI Workspace 흐름",
    };
    if (think && funnel && creepy) LAB_ITEMS.splice(0, LAB_ITEMS.length, think, ai, funnel, creepy);
  }

  /* ---------- GTM / GA4 ---------- */
  if (site.GTM_ID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    const g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtm.js?id=" + site.GTM_ID;
    document.head.appendChild(g);
  }

  if (site.GA_ID) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + site.GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", site.GA_ID);
  }

  /* ---------- Home / Marketing Lab surface ---------- */
  function installPortfolioSurfaceStyles() {
    if (document.getElementById("aiworkspace-portfolio-surface-style")) return;
    const style = document.createElement("style");
    style.id = "aiworkspace-portfolio-surface-style";
    style.textContent = `
      body[data-page="home"] .cta-band[data-aiworkspace-home-cta="1"]{
        padding:30px 36px!important;
        display:grid!important;
        grid-template-columns:minmax(0,1fr) auto!important;
        align-items:center!important;
        gap:24px!important;
      }
      body[data-page="home"] .cta-band[data-aiworkspace-home-cta="1"] h3{
        max-width:740px!important;
        white-space:normal!important;
      }
      body[data-page="home"] .cta-band[data-aiworkspace-home-cta="1"] p{
        max-width:800px!important;
      }
      body[data-page="home"] .cta-band[data-aiworkspace-home-cta="1"] .cta-actions{
        justify-self:end!important;
        flex-wrap:nowrap!important;
      }
      body[data-page="home"] .cta-band[data-aiworkspace-home-cta="1"] .cta-actions .btn{
        width:auto!important;
        min-width:168px!important;
        padding:14px 22px!important;
      }

      body[data-page="lab"] .lab-card:has(.lab-card-banner){
        display:grid!important;
        grid-template-columns:minmax(0,1fr) minmax(250px,330px)!important;
        grid-template-areas:
          "tag banner"
          "title banner"
          "desc banner"
          "button banner"!important;
        column-gap:32px!important;
        row-gap:8px!important;
        align-items:start!important;
        padding:26px 30px!important;
      }
      body[data-page="lab"] .lab-card:has(.lab-card-banner)>.tag{grid-area:tag!important;width:max-content!important}
      body[data-page="lab"] .lab-card:has(.lab-card-banner)>h3{grid-area:title!important;margin:0!important}
      body[data-page="lab"] .lab-card:has(.lab-card-banner)>p{grid-area:desc!important;margin:0!important;max-width:720px!important}
      body[data-page="lab"] .lab-card:has(.lab-card-banner)>.btn{grid-area:button!important;width:max-content!important;margin-top:4px!important}
      body[data-page="lab"] .lab-card:has(.lab-card-banner)>.lab-card-banner{
        grid-area:banner!important;
        width:100%!important;
        max-width:none!important;
        align-self:center!important;
        aspect-ratio:16/9!important;
        border-radius:14px!important;
        overflow:hidden!important;
        background:#fff!important;
      }
      body[data-page="lab"] .lab-card:has(.lab-card-banner)>.lab-card-banner img{
        width:100%!important;
        height:100%!important;
        object-fit:cover!important;
        object-position:center!important;
      }

      @media(max-width:860px){
        body[data-page="home"] .cta-band[data-aiworkspace-home-cta="1"]{
          grid-template-columns:1fr!important;
          padding:28px!important;
        }
        body[data-page="home"] .cta-band[data-aiworkspace-home-cta="1"] .cta-actions{
          justify-self:start!important;
          width:100%!important;
        }
        body[data-page="home"] .cta-band[data-aiworkspace-home-cta="1"] .cta-actions .btn{
          width:100%!important;
        }
        body[data-page="lab"] .lab-card:has(.lab-card-banner){
          grid-template-columns:1fr!important;
          grid-template-areas:
            "tag"
            "title"
            "desc"
            "banner"
            "button"!important;
          gap:12px!important;
          padding:24px!important;
        }
        body[data-page="lab"] .lab-card:has(.lab-card-banner)>.lab-card-banner{
          width:100%!important;
          margin-top:4px!important;
          aspect-ratio:auto!important;
        }
        body[data-page="lab"] .lab-card:has(.lab-card-banner)>.lab-card-banner img{
          height:auto!important;
          object-fit:contain!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureIndexCTA() {
    if (document.body.dataset.page !== "home") return;
    let card = document.querySelector('[data-aiworkspace-home-cta="1"]');
    if (!card) {
      const targetTitle = Array.from(document.querySelectorAll(".cta-band h3")).find(function (el) {
        return el.textContent.indexOf("생년월일과 오늘 날짜가") !== -1;
      });
      const target = targetTitle && targetTitle.closest(".cta-band");
      if (!target) return;
      const holder = document.createElement("div");
      holder.innerHTML = '<div class="cta-band reveal" data-aiworkspace-home-cta="1"></div>';
      card = holder.firstElementChild;
      target.before(card);
    }

    card.innerHTML = '<div>' +
      '<h3>하나의 Task를 여러 AI에서 이어갈 수 있는 Workspace를 만들었습니다.</h3>' +
      '<p>Handoff로 다음 Agent에게 작업을 넘겨서 연속성을 잃지 않고 작업을 계속할 수 있습니다.</p>' +
      '</div>' +
      '<div class="cta-actions">' +
      '<a class="btn btn-mint" href="aiworkspace.html" data-track="cta" data-track-id="view_aiworkspace_story" data-track-location="home_bottom">제작기 보기 <span class="arrow">→</span></a>' +
      '</div>';
  }

  /* ---------- Common GNB ---------- */
  function syncCommonGNB() {
    const nav = document.getElementById("gnb");
    if (!nav) return;
    const labLink = nav.querySelector('a[href="lab.html"]');
    if (!labLink) return;

    let ai = nav.querySelector('a[href="aiworkspace.html"]');
    if (!ai) {
      ai = document.createElement("a");
      ai.className = "nav-item nav-subitem";
      ai.dataset.page = "aiworkspace";
      ai.href = "aiworkspace.html";
      ai.dataset.track = "navigation";
      ai.dataset.trackId = "nav_aiworkspace";
      ai.dataset.trackLocation = "gnb";
      ai.innerHTML = '<span aria-hidden="true">-</span> AI Workspace 제작기';
    }

    const think = nav.querySelector('a[href="think2brief-story.html"]');
    const funnel = nav.querySelector('a[href="marketing-funnel.html"]');
    const creepy = nav.querySelector('a[href="creepypasta-story.html"]');
    const ordered = [think, ai, funnel, creepy].filter(Boolean);
    const frag = document.createDocumentFragment();
    ordered.forEach(function (el) { frag.appendChild(el); });
    labLink.after(frag);

    if (document.body.dataset.page === "aiworkspace") ai.classList.add("active");
  }

  function addSharedStyleBeforeAIStyles() {
    if (document.querySelector('link[data-aiworkspace-shared-style="1"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "assets/style.css";
    link.dataset.aiworkspaceSharedStyle = "1";
    const aiCss = document.querySelector('link[href="assets/aiworkspace.css"]');
    if (aiCss) aiCss.before(link); else document.head.appendChild(link);
  }

  function aiWorkspaceShellStyles() {
    if (document.getElementById("aiworkspace-site-shell-style")) return;
    const style = document.createElement("style");
    style.id = "aiworkspace-site-shell-style";
    style.textContent = 'body[data-page="aiworkspace"]{background:#fff!important}' +
      'body[data-page="aiworkspace"] .topbar{display:flex!important;position:sticky!important;top:0!important;z-index:110!important;height:auto!important;min-height:0!important;background:rgba(255,255,255,.94)!important;backdrop-filter:blur(8px)!important;border-bottom:1px solid var(--line)!important;padding:14px 24px!important;align-items:center!important;gap:14px!important}' +
      'body[data-page="aiworkspace"] .topbar .gnb-logo{margin:0!important;font-size:17px!important;font-weight:800!important;letter-spacing:-.03em!important;display:flex!important;align-items:center!important;gap:8px!important;text-decoration:none!important}' +
      'body[data-page="aiworkspace"] .topbar .gnb-logo .dot{width:10px!important;height:10px!important;border-radius:50%!important;background:var(--mint)!important;flex:none!important}' +
      'body[data-page="aiworkspace"] .aiworkspace-site-footer-wrap{max-width:1180px!important;margin:0 auto!important;padding:0 30px!important}' +
      '@media(max-width:640px){body[data-page="aiworkspace"] .topbar{padding:12px 16px!important}body[data-page="aiworkspace"] .topbar .gnb-logo{font-size:14px!important}body[data-page="aiworkspace"] .aiworkspace-site-footer-wrap{padding:0 18px!important}}';
    document.head.appendChild(style);
  }

  function buildStandaloneGNB(nav) {
    nav.innerHTML = '<a class="gnb-logo" href="index.html" data-track="navigation" data-track-id="brand_home" data-track-location="gnb"><span class="dot"></span>Portfolio</a>' +
      '<a class="nav-item" data-page="home" href="index.html">하이라이트</a>' +
      '<a class="nav-item" data-page="about" href="about.html">자기 소개</a>' +
      '<a class="nav-item" data-page="portfolio" href="portfolio.html">포트폴리오</a>' +
      '<a class="nav-item" data-page="lab" href="lab.html">마케팅 랩</a>' +
      '<a class="nav-item nav-subitem" data-page="think2brief" href="think2brief-story.html"><span aria-hidden="true">-</span> Think2Brief 제작기</a>' +
      '<a class="nav-item nav-subitem active" data-page="aiworkspace" href="aiworkspace.html"><span aria-hidden="true">-</span> AI Workspace 제작기</a>' +
      '<a class="nav-item nav-subitem" data-page="marketing-funnel" href="marketing-funnel.html"><span aria-hidden="true">-</span> 마케팅 퍼널 운영 프레임워크</a>' +
      '<a class="nav-item nav-subitem" data-page="creepypasta" href="creepypasta-story.html"><span aria-hidden="true">-</span> 괴담통보망 제작기</a>' +
      '<div class="gnb-separator" aria-hidden="true">·</div>' +
      '<a class="nav-item" data-page="sentence" href="sentence.html">문장 자판기</a>' +
      '<div class="gnb-foot">© ' + new Date().getFullYear() + ' Hongseok Ko</div>';

    let scrim = document.querySelector(".scrim");
    if (!scrim) {
      scrim = document.createElement("div");
      scrim.className = "scrim";
      document.body.appendChild(scrim);
    }
    const btn = document.getElementById("menuBtn");
    function setOpen(open) {
      nav.classList.toggle("open", open);
      scrim.classList.toggle("show", open);
      document.body.classList.toggle("menu-open", open);
      if (btn) {
        btn.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
        btn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      }
    }
    if (btn) btn.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    scrim.addEventListener("click", function () { setOpen(false); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  function footerSocialHTML() {
    const mail = site.EMAIL ? '<a class="mail" href="mailto:' + site.EMAIL + '">' + site.EMAIL + '</a>' : "";
    const instagram = site.INSTAGRAM_URL ? '<a class="icon" href="' + site.INSTAGRAM_URL + '" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>' : "";
    const linkedin = site.LINKEDIN_URL ? '<a class="icon" href="' + site.LINKEDIN_URL + '" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.4 8.1H2.2V21h3.2V8.1ZM3.8 3A1.9 1.9 0 1 0 3.8 6.8 1.9 1.9 0 0 0 3.8 3ZM21 13.5c0-3.9-2.1-5.7-4.9-5.7-2.3 0-3.3 1.3-3.9 2.1V8.1H9V21h3.2v-6.4c0-1.7.3-3.4 2.5-3.4 2.1 0 2.1 2 2.1 3.5V21H20v-7.5Z"/></svg></a>' : "";
    return mail + instagram + linkedin;
  }

  /* ---------- AI Workspace page shell ---------- */
  function setupAIWorkspaceShell() {
    const isAI = /(?:^|\/)aiworkspace\.html$/.test(location.pathname) || document.title.indexOf("AI Workspace") !== -1;
    if (!isAI) return false;

    document.body.dataset.page = "aiworkspace";
    addSharedStyleBeforeAIStyles();
    aiWorkspaceShellStyles();

    const oldHeader = document.querySelector("header.topbar");
    if (oldHeader && !oldHeader.querySelector("#menuBtn")) {
      oldHeader.outerHTML = '<header class="topbar"><button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="gnb" aria-label="메뉴 열기"><span></span><span></span><span></span></button><a class="gnb-logo" href="index.html" data-track="navigation" data-track-id="brand_home" data-track-location="topbar" aria-label="홈으로 이동"><span class="dot"></span>고홍석 · Marketing Portfolio</a></header>';
    }

    let nav = document.getElementById("gnb");
    if (!nav) {
      nav = document.createElement("nav");
      nav.className = "gnb";
      nav.id = "gnb";
      nav.setAttribute("aria-label", "사이트 메뉴");
      const header = document.querySelector("header.topbar");
      if (header) header.after(nav);
    }
    buildStandaloneGNB(nav);

    const oldFooter = document.querySelector("footer.footer");
    if (oldFooter) {
      const shell = document.createElement("div");
      shell.className = "wrap aiworkspace-site-footer-wrap";
      shell.innerHTML = '<footer><div>© 2026 Hongseok Ko. All rights reserved.</div><div class="social-row">' + footerSocialHTML() + '</div></footer>';
      oldFooter.replaceWith(shell);
    }
    return true;
  }

  /* ---------- AI Workspace screenshot fidelity ---------- */
  function fixAIWorkspaceScreenshots() {
    if (document.body.dataset.page !== "aiworkspace") return;

    if (!document.getElementById("aiworkspace-image-fidelity-style")) {
      const style = document.createElement("style");
      style.id = "aiworkspace-image-fidelity-style";
      style.textContent = `
        body[data-page="aiworkspace"] .task-focus-crop{
          width:100%!important;
          max-width:1246px!important;
          margin-left:auto!important;
          margin-right:auto!important;
        }
        body[data-page="aiworkspace"] .task-focus-crop img{
          display:block!important;
          width:100%!important;
          height:auto!important;
          max-height:none!important;
          object-fit:contain!important;
          object-position:center top!important;
          image-rendering:auto!important;
        }
        body[data-page="aiworkspace"] .proof-shot img{
          display:block!important;
          width:100%!important;
          height:auto!important;
          aspect-ratio:auto!important;
          object-fit:contain!important;
          object-position:center top!important;
          image-rendering:auto!important;
        }
      `;
      document.head.appendChild(style);
    }

    const proofSources = {
      handoff: "assets/aiworkspace-handoff.webp?v=20260822-fidelity2",
      overview: "assets/aiworkspace-overview.webp?v=20260822-fidelity2",
      newtask: "assets/aiworkspace-newtask.webp?v=20260822-fidelity2",
    };

    function refreshProofImages() {
      document.querySelectorAll('.proof-shot img[data-img]').forEach(function (img) {
        const src = proofSources[img.dataset.img];
        if (src && img.getAttribute("src") !== src) img.src = src;
      });
    }

    const taskChunkUrls = Array.from({ length: 11 }, function (_, i) {
      return "https://raw.githubusercontent.com/talkspinout/hongseok-portfolio/main/.png8/task." + String(i).padStart(3, "0") + ".b64?v=20260822";
    });
    let taskDataPromise = null;

    function loadOriginalTaskData() {
      if (taskDataPromise) return taskDataPromise;
      taskDataPromise = Promise.all(taskChunkUrls.map(function (url) {
        return fetch(url, { cache: "no-store" }).then(function (res) {
          if (!res.ok) throw new Error("Task source chunk unavailable: " + res.status);
          return res.text();
        });
      })).then(function (parts) {
        const base64 = parts.join("").replace(/\s+/g, "");
        return "data:image/png;base64," + base64;
      }).catch(function (err) {
        console.warn("AI Workspace source Task image fallback:", err);
        return null;
      });
      return taskDataPromise;
    }

    function applyOriginalTask() {
      const img = document.querySelector(".task-hires img");
      if (!img || img.dataset.originalSourceApplied === "1") return;
      loadOriginalTaskData().then(function (dataUrl) {
        const current = document.querySelector(".task-hires img");
        if (!dataUrl || !current || current.dataset.originalSourceApplied === "1") return;
        current.src = dataUrl;
        current.dataset.originalSourceApplied = "1";
        current.decoding = "async";
      });
    }

    function apply() {
      refreshProofImages();
      applyOriginalTask();
    }

    apply();
    setTimeout(apply, 80);
    setTimeout(apply, 350);
    setTimeout(apply, 1000);

    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { observer.disconnect(); }, 5000);
  }

  function onReady() {
    installPortfolioSurfaceStyles();
    const ai = setupAIWorkspaceShell();
    if (!ai) {
      setTimeout(function () {
        syncCommonGNB();
        ensureIndexCTA();
      }, 0);
    } else {
      fixAIWorkspaceScreenshots();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", onReady);
  else onReady();
})();
