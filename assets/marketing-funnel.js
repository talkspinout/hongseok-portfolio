/* ============================================================
   marketing-funnel.js — marketing-funnel.html 렌더링 로직.
   콘텐츠 수정은 assets/marketing-funnel-data.js에서만 하세요.
   ============================================================ */

(function () {
  "use strict";

  if (typeof FUNNEL_INTRO === "undefined") return;

  function esc(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- 인트로 ---------- */
  function renderIntro() {
    const title = document.getElementById("funnelTitle");
    if (title) title.textContent = FUNNEL_INTRO.title;

    const byline = document.getElementById("funnelByline");
    if (byline) byline.textContent = FUNNEL_INTRO.byline;

    const lead = document.getElementById("funnelLead");
    if (lead) {
      lead.innerHTML =
        "<p>" + esc(FUNNEL_INTRO.lead) + "</p>" +
        "<p>" + esc(FUNNEL_INTRO.scope) + "</p>" +
        "<p class='funnel-footnote'>" + esc(FUNNEL_INTRO.scopeNote) + "</p>" +
        "<p>" + esc(FUNNEL_INTRO.principleNote) + "</p>";
    }

    const usage = document.getElementById("funnelUsage");
    if (usage) {
      usage.innerHTML =
        "<strong>사용법</strong>" +
        "<ol>" +
        FUNNEL_INTRO.usage.map(function (step) { return "<li>" + esc(step) + "</li>"; }).join("") +
        "</ol>";
    }
  }

  /* ---------- 비즈니스 모델별 퍼널 흐름 한눈에 보기 ---------- */
  function renderOverviewTable() {
    const wrap = document.getElementById("funnelOverviewTable");
    if (!wrap) return;

    const stageLabels = FUNNEL_DIAGRAM_STAGES[FUNNEL_MODELS[0].id].map(function (s) { return s.label; });

    let html = '<div class="overview-grid" style="--stage-count:' + stageLabels.length + '">';
    html += '<div class="overview-cell overview-head"></div>';
    stageLabels.forEach(function (label) {
      html += '<div class="overview-cell overview-head">' + esc(label) + "</div>";
    });

    FUNNEL_MODELS.forEach(function (model) {
      html += '<div class="overview-cell overview-model"><strong>' + esc(model.name) + '</strong><span>' + esc(model.coreKpi) + "</span></div>";
      FUNNEL_DIAGRAM_STAGES[model.id].forEach(function (stage) {
        html += '<div class="overview-cell">' + esc(stage.desc) + "</div>";
      });
    });
    html += "</div>";
    wrap.innerHTML = html;
  }

  /* ---------- 공통 진단 13원칙 ---------- */
  function renderPrinciples() {
    const wrap = document.getElementById("funnelPrinciples");
    if (!wrap) return;

    wrap.innerHTML = FUNNEL_COMMON_PRINCIPLES.map(function (group) {
      const items = group.items.map(function (item) {
        const tag = item.tag ? '<span class="tag funnel-badge">' + esc(item.tag) + "</span>" : "";
        const list = item.list
          ? "<ul>" + item.list.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>"
          : "";
        const note = item.note ? '<p class="funnel-footnote">' + esc(item.note) + "</p>" : "";
        return (
          '<article class="principle-card reveal">' +
          '<div class="principle-head"><span class="principle-num">' + item.num + "</span>" + tag + "</div>" +
          "<h4>" + esc(item.title) + "</h4>" +
          "<p>" + esc(item.body) + "</p>" +
          list + note +
          "</article>"
        );
      }).join("");
      return (
        '<div class="principle-group">' +
        "<h3>" + esc(group.group) + "</h3>" +
        '<div class="principle-grid">' + items + "</div>" +
        "</div>"
      );
    }).join("");
  }

  /* ---------- 퍼널 다이어그램 ---------- */
  function renderDiagram(modelId) {
    const stages = FUNNEL_DIAGRAM_STAGES[modelId];
    return (
      '<div class="funnel-diagram">' +
      stages.map(function (stage) {
        return (
          '<div class="funnel-diagram-col">' +
          '<div class="funnel-diagram-label">' + esc(stage.label) + "</div>" +
          '<div class="funnel-diagram-card">' +
          "<h5>" + esc(stage.desc) + "</h5>" +
          "<ul>" + stage.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>" +
          "</div>" +
          "</div>"
        );
      }).join('<div class="funnel-diagram-arrow" aria-hidden="true">→</div>') +
      "</div>"
    );
  }

  /* ---------- 단계별 상세(상황 + 활동 카드) ---------- */
  function renderStage(model, stage) {
    const activities = stage.activities.map(function (a) {
      return (
        '<article class="activity-card">' +
        "<h5>" + esc(a.activity) + "</h5>" +
        "<p>" + esc(a.purpose) + "</p>" +
        '<div class="activity-meta">' +
        '<div><span>판단 기준(KPI)</span><p>' + esc(a.kpi) + "</p></div>" +
        '<div><span>실패 시 분기</span><p>' + a.failurePath.map(esc).join(" → ") + "</p></div>" +
        "</div>" +
        "</article>"
      );
    }).join("");

    return (
      '<div class="stage-card reveal" id="' + model.id + "-" + stage.id + '">' +
      '<div class="stage-head">' +
      "<h4>" + esc(stage.name) + "</h4>" +
      '<a class="btn btn-ghost btn-sm" href="marketing-funnel-check.html?model=' + encodeURIComponent(model.id) + "&amp;stage=" + encodeURIComponent(stage.id) + '" data-track="cta" data-track-id="funnel_check_stage" data-track-location="funnel_stage_card">이 단계 체크하기 <span class="arrow">→</span></a>' +
      "</div>" +
      '<p class="stage-situation"><strong>상황</strong> — ' + esc(stage.situation) + "</p>" +
      '<div class="activity-grid">' + activities + "</div>" +
      "</div>"
    );
  }

  /* ---------- 비즈니스 모델 섹션 ---------- */
  function renderModels() {
    const wrap = document.getElementById("funnelModels");
    if (!wrap) return;

    let sectionIndex = 2;
    wrap.innerHTML = FUNNEL_MODELS.map(function (model) {
      const channels = model.channels.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");
      const specialNote = model.specialNote
        ? '<p class="notice">' + esc(model.specialNote) + "</p>"
        : "";
      const stages = model.stages.map(function (stage) { return renderStage(model, stage); }).join("");

      const html = (
        '<section id="' + model.id + '">' +
        "<h2 class=\"sec-title\">" + (sectionIndex) + ". " + esc(model.name) + " — 퍼널별 고려사항</h2>" +
        '<span class="tag funnel-badge">' + esc(model.badge) + "</span>" +
        '<p class="sec-desc"><strong>영역 정의</strong> — ' + esc(model.definition) + "</p>" +
        specialNote +
        '<div class="funnel-channels"><strong>한국 시장 채널·도구</strong><ul>' + channels + "</ul></div>" +
        renderDiagram(model.id) +
        '<div class="stage-list">' + stages + "</div>" +
        '<div class="cta-band reveal">' +
        "<div><h3>" + esc(model.name) + " 현황을 지금 체크해 보세요.</h3><p>핵심 KPI · " + esc(model.coreKpi) + "</p></div>" +
        '<div class="cta-actions"><a class="btn btn-mint" href="marketing-funnel-check.html?model=' + encodeURIComponent(model.id) + '" data-track="cta" data-track-id="funnel_check_model" data-track-location="funnel_model_bottom">' + esc(model.name) + ' 체크하기 <span class="arrow">→</span></a></div>' +
        "</div>" +
        "</section>"
      );
      sectionIndex += 1;
      return html;
    }).join("");
  }

  /* ---------- 부록 비교표 ---------- */
  function renderAppendix() {
    const wrap = document.getElementById("funnelAppendixTable");
    if (!wrap) return;

    let html = '<table class="funnel-appendix-table"><thead><tr><th>항목</th>';
    FUNNEL_MODELS.forEach(function (m) { html += "<th>" + esc(m.name) + "</th>"; });
    html += "</tr></thead><tbody>";
    FUNNEL_APPENDIX.rows.forEach(function (row) {
      html += "<tr><th>" + esc(row.label) + "</th>";
      row.values.forEach(function (v) { html += "<td>" + esc(v) + "</td>"; });
      html += "</tr>";
    });
    html += "</tbody></table>";
    wrap.innerHTML = html;
  }

  /* ---------- 적용 가이드 ---------- */
  function renderClosing() {
    const b1 = document.getElementById("funnelClosingBody1");
    if (b1) b1.textContent = FUNNEL_INTRO.closing.body;
    const b2 = document.getElementById("funnelClosingBody2");
    if (b2) b2.textContent = FUNNEL_INTRO.closing.body2;
  }

  /* 체크 도구("이 단계 전체 활동 보기")나 외부 링크로 해시(#model-stage)와 함께
     진입했을 때, 콘텐츠가 이 스크립트로 나중에 그려지므로 브라우저의 기본
     앵커 스크롤이 씹힙니다. 렌더링 후 수동으로 스크롤해 보정합니다. */
  function scrollToHash() {
    if (!window.location.hash) return;
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (target) target.scrollIntoView({ block: "start" });
  }

  renderIntro();
  renderOverviewTable();
  renderPrinciples();
  renderModels();
  renderAppendix();
  renderClosing();
  scrollToHash();
})();
