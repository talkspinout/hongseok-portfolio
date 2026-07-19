/* ============================================================
   marketing-funnel-check.js — marketing-funnel-check.html 로직.
   모델 선택 → 문제 상황 단일 선택 → 진단 → 결과(상태 배지 + 실패 시 분기)
   → 다음 우선순위 선택 or 종료, 를 반복하는 단일 화면 플로우입니다.
   상태는 localStorage와 URL 쿼리(공유용)에 함께 저장합니다.
   ============================================================ */

(function () {
  "use strict";

  if (typeof FUNNEL_MODELS === "undefined") return;

  const APP = document.getElementById("mfcApp");
  if (!APP) return;

  const STORAGE_KEY = "mf_check_state_v1";
  const STAGE_ORDER = ["awareness", "consideration", "conversion", "retention", "advocacy"];

  let state = { model: null, pendingStage: null, rounds: [], finished: false };
  let statusMessage = "";

  /* ---------- 유틸 ---------- */
  function esc(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function findModel(id) {
    return FUNNEL_MODELS.filter(function (m) { return m.id === id; })[0] || null;
  }
  function findStage(model, stageId) {
    if (!model) return null;
    return model.stages.filter(function (s) { return s.id === stageId; })[0] || null;
  }
  function findResponse(key) {
    return FUNNEL_CHECK_RESPONSES.filter(function (r) { return r.key === key; })[0] || null;
  }
  function validRounds(model, rounds) {
    if (!Array.isArray(rounds)) return [];

    const seen = [];
    return rounds.filter(function (round) {
      if (!round || typeof round !== "object") return false;
      if (!findStage(model, round.stageId) || !findResponse(round.response)) return false;
      if (seen.indexOf(round.stageId) !== -1) return false;
      seen.push(round.stageId);
      return true;
    });
  }
  function answeredStageIds() {
    return state.rounds.map(function (r) { return r.stageId; });
  }
  function remainingStages(model) {
    const answered = answeredStageIds();
    return model.stages.filter(function (s) { return answered.indexOf(s.id) === -1; });
  }

  /* stage.activities에서 우선 활동 하나를 뽑아 "우선 활동(목적+KPI) → 실패
     시 분기" 형태로 체크 도구 결과에 씁니다. 여러 활동의 실패 시 분기를
     하나로 합치면 서로 다른 경로가 마치 한 순서처럼 보이므로, 대표
     활동 하나만 상세히 보여주고 KPI·실패 시 분기도 그 활동 자신의
     값을 그대로 씁니다. 나머지 활동은 이름·목적만 가볍게 후보로
     노출해 퍼널 표에 있는 선택지가 하나뿐이 아님을 보여줍니다. */
  function stageSummary(stage) {
    const lead = stage.activities[0];
    const others = stage.activities.slice(1);
    return {
      leadActivity: lead,
      otherActivities: others,
    };
  }

  /* ---------- 저장 · URL 동기화 ---------- */
  function saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* localStorage 미지원 환경은 URL 공유로만 대체 */ }
    syncUrl();
  }

  function syncUrl() {
    let query = "";
    if (state.model) {
      const params = new URLSearchParams();
      params.set("model", state.model);
      if (state.pendingStage) params.set("stage", state.pendingStage);
      if (state.rounds.length) {
        params.set(
          "r",
          state.rounds.map(function (r) { return r.stageId + ":" + r.response; }).join(",")
        );
      }
      query = "?" + params.toString();
    }
    const newUrl = window.location.pathname + query;
    window.history.replaceState(null, "", newUrl);
  }

  function parseQuery() {
    const params = new URLSearchParams(window.location.search);
    const model = params.get("model");
    const stage = params.get("stage");
    const rParam = params.get("r");
    const rounds = [];
    if (rParam) {
      rParam.split(",").forEach(function (pair) {
        const parts = pair.split(":");
        if (parts[0] && parts[1]) rounds.push({ stageId: parts[0], response: parts[1] });
      });
    }
    return { model: model, stage: stage, rounds: rounds };
  }

  function loadInitialState() {
    const q = parseQuery();
    const model = q.model ? findModel(q.model) : null;

    if (model) {
      if (q.rounds.length) {
        const rounds = validRounds(model, q.rounds);
        state = { model: model.id, pendingStage: null, rounds: rounds, finished: true };
        saveState();
        return;
      }
      const pendingStage = q.stage && findStage(model, q.stage) ? q.stage : null;
      state = { model: model.id, pendingStage: pendingStage, rounds: [], finished: false };
      saveState();
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.model && findModel(saved.model)) {
          const savedModel = findModel(saved.model);
          const pendingStage = findStage(savedModel, saved.pendingStage) ? saved.pendingStage : null;
          state = {
            model: savedModel.id,
            pendingStage: pendingStage,
            rounds: validRounds(savedModel, saved.rounds),
            finished: !!saved.finished,
          };
          return;
        }
      }
    } catch (e) { /* 무시하고 빈 상태로 시작 */ }

    state = { model: null, pendingStage: null, rounds: [], finished: false };
  }

  /* ---------- 렌더 ---------- */
  function render() {
    if (!state.model) {
      APP.innerHTML = renderModelPicker();
      return;
    }
    const model = findModel(state.model);
    if (!model) {
      state = { model: null, pendingStage: null, rounds: [], finished: false };
      APP.innerHTML = renderModelPicker();
      return;
    }

    let html = renderModelHeader(model);

    /* 다음 질문에 답하는 중에도 지금까지의 결과가 계속 보여야 "이전에 뭘
       골랐는지" 잃어버리지 않습니다. pendingStage가 있어도 결과를 먼저
       넣고, 그 아래에 새 질문을 붙입니다. */
    if (state.rounds.length) html += renderResults(model);

    if (state.pendingStage) {
      const stage = findStage(model, state.pendingStage);
      if (stage) {
        html += renderQuestion(model, stage);
        APP.innerHTML = html;
        return;
      }
      state.pendingStage = null;
    }

    if (!state.rounds.length) {
      html += '<p class="mfc-empty">아직 진단한 단계가 없습니다. 아래에서 지금 가장 문제라고 느끼는 상황을 골라 주세요.</p>';
    }

    html += renderNextArea(model);
    APP.innerHTML = html;
  }

  function accentStyle(model) {
    return 'style="--model-accent:' + model.accent + ";--model-accent-soft:" + model.accentSoft + ';"';
  }

  function renderModelHeader(model) {
    if (state.rounds.length === 0 && !state.pendingStage) return "";
    return (
      '<div class="mfc-model-header" ' + accentStyle(model) + ">" +
      '<span class="tag mfc-model-chip">' + esc(model.name) + "</span>" +
      '<button type="button" class="mfc-link-btn" data-action="change-model" data-track="cta" data-track-id="mfc_change_model" data-track-location="mfc_header">다른 모델로 다시 시작</button>' +
      "</div>"
    );
  }

  function renderModelPicker() {
    const cards = FUNNEL_MODELS.map(function (m) {
      return (
        '<button type="button" class="mfc-model-card" ' + accentStyle(m) + ' data-action="select-model" data-model="' + esc(m.id) + '" data-track="cta" data-track-id="mfc_select_model_' + esc(m.id) + '" data-track-location="mfc_model_picker">' +
        "<h3>" + esc(m.name) + "</h3>" +
        "<p>" + esc(m.definition) + "</p>" +
        '<span class="mfc-model-kpi">핵심 KPI · ' + esc(m.coreKpi) + "</span>" +
        "</button>"
      );
    }).join("");
    return (
      '<div class="mfc-step">' +
      "<h2>어떤 비즈니스 모델을 체크할까요?</h2>" +
      '<div class="mfc-model-grid">' + cards + "</div>" +
      "</div>"
    );
  }

  function renderQuestion(model, stage) {
    const options = FUNNEL_CHECK_RESPONSES.map(function (r) {
      const example = r.example ? '<span>' + esc(r.example) + "</span>" : "";
      return (
        '<button type="button" class="mfc-response-btn" data-action="answer" data-response="' + esc(r.key) + '" data-track="cta" data-track-id="mfc_answer_' + esc(r.key) + '" data-track-location="mfc_question">' +
        "<strong>" + esc(r.label) + "</strong>" + example +
        "</button>"
      );
    }).join("");

    return (
      '<div class="mfc-step" ' + accentStyle(model) + ">" +
      '<span class="mfc-stage-eyebrow">' + esc(stage.name) + " 단계</span>" +
      '<p class="mfc-situation"><strong>상황</strong> — ' + esc(stage.situation) + "</p>" +
      "<h2>" + esc(stage.checkQuestion) + "</h2>" +
      '<div class="mfc-response-grid">' + options + "</div>" +
      "</div>"
    );
  }

  function statusClass(key) {
    return "mfc-status-" + key;
  }

  function renderResults(model) {
    const leakyMsg = leakyBucketMessage(model);
    const cards = state.rounds.map(function (round, index) {
      const stage = findStage(model, round.stageId);
      if (!stage) return "";
      const response = findResponse(round.response);
      const summary = stageSummary(stage);
      const lead = summary.leadActivity;
      const others = summary.otherActivities;
      return (
        '<article class="mfc-result-card" ' + accentStyle(model) + ">" +
        '<div class="mfc-result-head">' +
        '<span class="mfc-rank">' + (index + 1) + "순위</span>" +
        "<h3>" + esc(stage.name) + "</h3>" +
        '<span class="mfc-status ' + statusClass(response.key) + '">' + esc(response.statusLabel) + "</span>" +
        "</div>" +
        '<p class="mfc-situation">' + esc(stage.situation) + "</p>" +
        (lead
          ? '<div class="mfc-lead-activity">' +
            "<span>우선 활동</span>" +
            "<p><strong>" + esc(lead.activity) + "</strong> — " + esc(lead.purpose) + "</p>" +
            '<div class="mfc-lead-meta">' +
            '<div><span>판단 기준(KPI)</span><p>' + esc(lead.kpi) + "</p></div>" +
            (lead.failurePath && lead.failurePath.length
              ? '<div><span>실패 시 분기</span><p>' + lead.failurePath.map(esc).join(" → ") + "</p></div>"
              : "") +
            "</div>" +
            "</div>"
          : "") +
        (others.length
          ? '<div class="mfc-other-activities"><span>다른 활동 후보</span><ul>' +
            others.map(function (a) { return "<li><strong>" + esc(a.activity) + "</strong> — " + esc(a.purpose) + "</li>"; }).join("") +
            "</ul></div>"
          : "") +
        '<a class="mfc-link-btn" href="marketing-funnel.html#' + esc(model.id) + "-" + esc(stage.id) + '" data-track="navigation" data-track-id="mfc_view_full_stage" data-track-location="mfc_result_card">이 단계 전체 활동 보기 →</a>' +
        "</article>"
      );
    }).join("");

    return (
      '<div class="mfc-results">' +
      (leakyMsg ? '<div class="notice mfc-leaky-note">' + esc(leakyMsg) + "</div>" : "") +
      cards +
      "</div>"
    );
  }

  /* 인지 단계를 문제로 지목했는데 전환 단계가 아직 확인 전이면 공통 진단
     1번을 짧게 안내합니다. 원칙 전문을 그대로 붙이지 않고, 실제로 선택한
     모델의 전환 단계 이름을 넣어 그 상황에 맞게 한 문장으로 조립합니다. */
  function leakyBucketMessage(model) {
    const awarenessRound = state.rounds.filter(function (r) { return r.stageId === "awareness"; })[0];
    if (!awarenessRound || awarenessRound.response === "good") return "";
    const hasConversion = state.rounds.some(function (r) { return r.stageId === "conversion"; });
    if (hasConversion) return "";
    const conversionStage = findStage(model, "conversion");
    if (!conversionStage) return "";
    return (
      FUNNEL_LEAKY_BUCKET_LABEL + " — 인지를 늘리기 전에 \"" + conversionStage.name +
      "\" 단계 게이트가 막혀 있는지부터 점검해 보세요."
    );
  }

  function renderNextArea(model) {
    const remaining = remainingStages(model);
    const hasResults = state.rounds.length > 0;

    let utilityBar = "";
    if (hasResults) {
      utilityBar =
        '<div class="mfc-utility-bar">' +
        '<button type="button" class="btn btn-ghost btn-sm" data-action="copy" data-track="cta" data-track-id="mfc_copy_result" data-track-location="mfc_utility">결과 텍스트 복사</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-action="copy-link" data-track="cta" data-track-id="mfc_copy_link" data-track-location="mfc_utility">공유 링크 복사</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-action="reset" data-track="cta" data-track-id="mfc_reset" data-track-location="mfc_utility">처음부터 다시 하기</button>' +
        (statusMessage ? '<span class="mfc-status-msg">' + esc(statusMessage) + "</span>" : "") +
        "</div>";
    }

    if (remaining.length === 0) {
      return utilityBar + '<p class="mfc-empty">' + esc(model.name) + '의 모든 단계를 확인했습니다.</p>';
    }

    if (hasResults && state.finished) {
      return (
        utilityBar +
        '<button type="button" class="mfc-link-btn mfc-continue-btn" data-action="continue" data-track="cta" data-track-id="mfc_continue" data-track-location="mfc_next">다른 단계도 이어서 확인하기 →</button>'
      );
    }

    const cards = remaining.map(function (s) {
      return (
        '<button type="button" class="mfc-model-card mfc-stage-card-btn" ' + accentStyle(model) + ' data-action="select-stage" data-stage="' + esc(s.id) + '" data-track="cta" data-track-id="mfc_select_stage_' + esc(s.id) + '" data-track-location="mfc_next">' +
        "<h3>" + esc(s.name) + "</h3>" +
        "<p>" + esc(s.situation) + "</p>" +
        "</button>"
      );
    }).join("");

    return (
      '<div class="mfc-step mfc-next-step" ' + accentStyle(model) + ">" +
      "<h2>" + (hasResults ? "다음으로 문제라고 느끼는 상황이 있나요?" : "지금 가장 문제라고 느끼는 상황은?") + "</h2>" +
      '<div class="mfc-model-grid">' + cards + "</div>" +
      (hasResults ? '<button type="button" class="mfc-link-btn" data-action="finish" data-track="cta" data-track-id="mfc_finish" data-track-location="mfc_next">여기까지 확인할게요</button>' : "") +
      "</div>" +
      utilityBar
    );
  }

  /* ---------- 결과 텍스트 · 공유 ---------- */
  function buildResultText(model) {
    const lines = [model.name + " 마케팅 퍼널 현황 체크 결과", ""];
    state.rounds.forEach(function (round, index) {
      const stage = findStage(model, round.stageId);
      const response = findResponse(round.response);
      if (!stage || !response) return;
      const summary = stageSummary(stage);
      const lead = summary.leadActivity;
      lines.push((index + 1) + "순위 · " + stage.name + " — " + response.statusLabel);
      lines.push("  상황: " + stage.situation);
      if (lead) {
        lines.push("  우선 활동: " + lead.activity + " — " + lead.purpose);
        lines.push("  판단 기준(KPI): " + lead.kpi);
        if (lead.failurePath && lead.failurePath.length) {
          lines.push("  실패 시 분기: " + lead.failurePath.join(" → "));
        }
      }
      if (summary.otherActivities.length) {
        lines.push("  다른 활동 후보: " + summary.otherActivities.map(function (a) { return a.activity; }).join(", "));
      }
      lines.push("");
    });
    lines.push("전체 프레임워크: " + window.location.origin + window.location.pathname.replace("marketing-funnel-check.html", "marketing-funnel.html"));
    return lines.join("\n");
  }

  function showStatusMessage(msg) {
    statusMessage = msg;
    render();
    window.setTimeout(function () {
      statusMessage = "";
      render();
    }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { showStatusMessage("복사했습니다."); },
        function () { showStatusMessage("복사에 실패했습니다."); }
      );
      return;
    }
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showStatusMessage("복사했습니다.");
    } catch (e) {
      showStatusMessage("복사에 실패했습니다.");
    }
  }

  /* ---------- 이벤트 ---------- */
  APP.addEventListener("click", function (event) {
    const el = event.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;
    const model = findModel(state.model);

    if (action === "select-model") {
      state = { model: el.dataset.model, pendingStage: null, rounds: [], finished: false };
      saveState();
      render();
      return;
    }

    if (action === "change-model") {
      state = { model: null, pendingStage: null, rounds: [], finished: false };
      saveState();
      render();
      return;
    }

    if (action === "select-stage") {
      state.pendingStage = el.dataset.stage;
      state.finished = false;
      saveState();
      render();
      return;
    }

    if (action === "answer") {
      if (!model || !state.pendingStage) return;
      state.rounds.push({ stageId: state.pendingStage, response: el.dataset.response });
      state.pendingStage = null;
      saveState();
      render();
      return;
    }

    if (action === "finish") {
      state.finished = true;
      saveState();
      render();
      return;
    }

    if (action === "continue") {
      state.finished = false;
      saveState();
      render();
      return;
    }

    if (action === "copy") {
      if (!model) return;
      copyText(buildResultText(model));
      return;
    }

    if (action === "copy-link") {
      copyText(window.location.href);
      return;
    }

    if (action === "reset") {
      state = { model: null, pendingStage: null, rounds: [], finished: false };
      try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) { /* 무시 */ }
      window.history.replaceState(null, "", window.location.pathname);
      render();
      return;
    }
  });

  loadInitialState();
  render();
})();
