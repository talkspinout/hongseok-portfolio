(() => {
  "use strict";

  // Apps Script 쪽 LockService 대기(최대 10초) + 시트 기록 + 메일 발송 시간을 감안해
  // 여유 있게 잡는다. 너무 짧으면 서버는 정상 처리 중인데 클라이언트만 먼저 실패로
  // 판단해 사용자가 재시도 → 중복 신청으로 이어질 수 있다.
  const API_TIMEOUT_MS = 20000;

  // 제출이 성공하기 전까지는 모달을 닫았다 다시 열어도 같은 requestId를 재사용한다.
  // (서버가 "이미 처리된 요청인지"를 판단하는 기준이라, 모달 단위로 매번 새로 만들면
  // 서버는 성공했는데 클라이언트만 실패로 본 경우 재시도 시 중복이 그대로 생긴다.)
  const REQUEST_ID_STORAGE_KEY = "leadFormRequestId";

  const modal = document.getElementById("lead-modal");
  const backdrop = document.getElementById("lead-modal-backdrop");
  const card = document.getElementById("lead-card");
  const closeButton = document.getElementById("lead-close-button");
  const triggers = document.querySelectorAll("[data-lead-form-trigger]");

  const formPanel = document.getElementById("lead-form-panel");
  const resultPanel = document.getElementById("lead-result-panel");
  const formTitle = document.getElementById("lead-form-title");
  const formDesc = document.getElementById("lead-form-desc");
  const form = document.getElementById("lead-form");
  const websiteField = document.getElementById("lead-website");
  const purposeSelect = document.getElementById("lead-purpose");
  const purposeOtherField = document.getElementById("lead-purpose-other-field");
  const purposeOtherInput = document.getElementById("lead-purpose-other");
  const privacyConsent = document.getElementById("lead-consent");
  const consentLabel = document.getElementById("lead-consent-label");
  const privacyDetail = document.getElementById("lead-privacy-detail");
  const copyrightNotice = document.getElementById("lead-copyright-notice");
  const usageConsent = document.getElementById("lead-usage-consent");
  const usageConsentLabel = document.getElementById("lead-usage-consent-label");
  const formError = document.getElementById("lead-form-error");
  const submitButton = document.getElementById("lead-submit-button");

  const resultIcon = document.getElementById("lead-result-icon");
  const resultTitle = document.getElementById("lead-result-title");
  const resultDesc = document.getElementById("lead-result-desc");
  const resultCloseButton = document.getElementById("lead-result-close-button");

  if (
    !modal || !backdrop || !card || !closeButton || triggers.length === 0 ||
    !formPanel || !resultPanel || !form || !purposeSelect || !submitButton ||
    !privacyConsent || !usageConsent
  ) {
    return;
  }

  let lastFocusedElement = null;
  let isSubmitting = false;
  let currentRequestId = null;

  function fillContent() {
    if (typeof LEAD_FORM === "undefined") return;

    formTitle.textContent = LEAD_FORM.title;
    formDesc.textContent = LEAD_FORM.desc;

    purposeSelect.innerHTML =
      '<option value="" disabled selected>선택해 주세요</option>' +
      LEAD_FORM.purposes.map(function (p) {
        return '<option value="' + p.value + '">' + p.label + "</option>";
      }).join("");

    consentLabel.textContent = LEAD_FORM.privacy.consentLabel;
    privacyDetail.innerHTML =
      "수집 항목: " + LEAD_FORM.privacy.items + "<br>" +
      "목적: " + LEAD_FORM.privacy.purpose + "<br>" +
      "보유 기간: " + LEAD_FORM.privacy.retention + "<br>" +
      "동의 거부 안내: " + LEAD_FORM.privacy.refusal;

    copyrightNotice.textContent = LEAD_FORM.copyrightNotice;
    usageConsentLabel.textContent = LEAD_FORM.usageConsentLabel;
  }

  function getFocusableElements() {
    return card.querySelectorAll(
      [
        "button:not([disabled])",
        "input:not([disabled]):not([tabindex='-1'])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])'
      ].join(",")
    );
  }

  function trapFocus(e) {
    if (e.key === "Escape" && modal.classList.contains("is-visible")) {
      hideModal();
      return;
    }

    if (e.key !== "Tab" || !modal.classList.contains("is-visible")) return;

    const focusable = Array.from(getFocusableElements()).filter(function (el) {
      return el.offsetParent !== null;
    });
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
  }

  function resetForm() {
    form.reset();
    privacyConsent.setCustomValidity("");
    usageConsent.setCustomValidity("");
    purposeOtherField.hidden = true;
    purposeOtherInput.required = false;
    formError.hidden = true;
    formError.textContent = "";
    formPanel.hidden = false;
    resultPanel.hidden = true;
    submitButton.disabled = false;
    submitButton.textContent = "신청하기";
    ensureRequestId();
  }

  function showModal() {
    lastFocusedElement = document.activeElement;
    resetForm();
    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("lead-modal-open");
    window.setTimeout(function () {
      const emailField = document.getElementById("lead-email");
      if (emailField) emailField.focus();
    }, 50);
  }

  function hideModal() {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lead-modal-open");
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  }

  function showResult(kind, title, desc) {
    formPanel.hidden = true;
    resultPanel.hidden = false;
    resultPanel.classList.toggle("is-error", kind === "error");
    resultIcon.textContent = kind === "success" ? "✓" : "!";
    resultTitle.textContent = title;
    resultDesc.textContent = desc;
    window.setTimeout(function () {
      resultCloseButton.focus();
    }, 50);
  }

  async function fetchWithTimeout(url, options, timeoutMs) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(function () { controller.abort(); }, timeoutMs);
    try {
      return await fetch(url, Object.assign({}, options, { signal: controller.signal }));
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function createRequestId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  }

  function readStoredRequestId() {
    try {
      return window.sessionStorage.getItem(REQUEST_ID_STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function writeStoredRequestId(id) {
    try {
      window.sessionStorage.setItem(REQUEST_ID_STORAGE_KEY, id);
    } catch (e) {
      // 시크릿 모드 등으로 sessionStorage를 못 쓰면 메모리 값만으로 동작한다.
    }
  }

  function clearStoredRequestId() {
    try {
      window.sessionStorage.removeItem(REQUEST_ID_STORAGE_KEY);
    } catch (e) {}
  }

  // 아직 성공하지 못한 제출 시도가 있으면 그 ID를 이어서 쓰고,
  // 없으면(=이전 제출이 성공했거나 처음 신청하는 경우) 새로 만든다.
  function ensureRequestId() {
    const stored = readStoredRequestId();
    if (stored) {
      currentRequestId = stored;
      return;
    }
    currentRequestId = createRequestId();
    writeStoredRequestId(currentRequestId);
  }

  function trackSubmit(purposeValue) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "lead_form_submit",
      form_purpose: purposeValue,
      page_type: document.body.dataset.page || ""
    });
  }

  function validateConsent() {
    privacyConsent.setCustomValidity(
      privacyConsent.checked
        ? ""
        : "개인정보 수집·이용에 동의해야 포트폴리오 열람을 신청할 수 있습니다."
    );
    usageConsent.setCustomValidity(
      usageConsent.checked
        ? ""
        : "열람 자료의 비공개·비배포 조건을 확인해야 신청할 수 있습니다."
    );

    if (!privacyConsent.checked) {
      privacyConsent.reportValidity();
      privacyConsent.focus();
      return false;
    }
    if (!usageConsent.checked) {
      usageConsent.reportValidity();
      usageConsent.focus();
      return false;
    }
    return true;
  }

  purposeSelect.addEventListener("change", function () {
    const isOther = purposeSelect.value === "other";
    purposeOtherField.hidden = !isOther;
    purposeOtherInput.required = isOther;
    if (!isOther) purposeOtherInput.value = "";
  });

  privacyConsent.addEventListener("change", function () {
    privacyConsent.setCustomValidity("");
  });

  usageConsent.addEventListener("change", function () {
    usageConsent.setCustomValidity("");
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    // 허니팟이 채워져 있으면 봇으로 간주하고, 정상 제출처럼 보이게만 처리합니다.
    if (websiteField && websiteField.value.trim().length > 0) {
      showResult("success", LEAD_FORM.successTitle, LEAD_FORM.successDesc);
      return;
    }

    if (!validateConsent() || !form.reportValidity()) return;

    if (!SITE.LEAD_API_URL) {
      formError.textContent = LEAD_FORM.notReadyDesc;
      formError.hidden = false;
      return;
    }

    const purposeValue = purposeSelect.value;
    const payload = {
      email: document.getElementById("lead-email").value.trim(),
      name: document.getElementById("lead-name").value.trim(),
      company: document.getElementById("lead-company").value.trim(),
      purpose: purposeValue,
      purposeOther: purposeOtherInput.value.trim(),
      message: document.getElementById("lead-message").value.trim(),
      pageUrl: window.location.href,
      consent: privacyConsent.checked,
      consentedAt: new Date().toISOString(),
      privacyVersion: LEAD_FORM.privacy.version,
      termsAccepted: usageConsent.checked,
      requestId: currentRequestId
    };

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "신청 중...";
    formError.hidden = true;

    try {
      const response = await fetchWithTimeout(
        SITE.LEAD_API_URL,
        {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        },
        API_TIMEOUT_MS
      );

      if (!response.ok) {
        throw new Error("신청 API 요청 실패: " + response.status);
      }

      const result = await response.json();
      if (!result || result.status !== "ok") {
        throw new Error((result && result.message) || "신청 처리에 실패했습니다.");
      }

      clearStoredRequestId();
      trackSubmit(purposeValue);
      showResult("success", LEAD_FORM.successTitle, LEAD_FORM.successDesc);
    } catch (error) {
      console.error("포트폴리오 열람 신청 실패:", error);
      showResult("error", "신청에 실패했습니다.", LEAD_FORM.errorDesc);
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.textContent = "신청하기";
    }
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", showModal);
  });

  closeButton.addEventListener("click", hideModal);
  backdrop.addEventListener("click", hideModal);
  resultCloseButton.addEventListener("click", hideModal);
  form.addEventListener("submit", handleSubmit);
  document.addEventListener("keydown", trapFocus);

  fillContent();
})();
