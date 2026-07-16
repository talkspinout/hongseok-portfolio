(() => {
  "use strict";

  const API_TIMEOUT_MS = 10000;

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
  const consentLabel = document.getElementById("lead-consent-label");
  const privacyDetail = document.getElementById("lead-privacy-detail");
  const copyrightNotice = document.getElementById("lead-copyright-notice");
  const formError = document.getElementById("lead-form-error");
  const submitButton = document.getElementById("lead-submit-button");

  const resultIcon = document.getElementById("lead-result-icon");
  const resultTitle = document.getElementById("lead-result-title");
  const resultDesc = document.getElementById("lead-result-desc");
  const resultCloseButton = document.getElementById("lead-result-close-button");

  if (
    !modal || !backdrop || !card || !closeButton || triggers.length === 0 ||
    !formPanel || !resultPanel || !form || !purposeSelect || !submitButton
  ) {
    return;
  }

  let lastFocusedElement = null;
  let isSubmitting = false;

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
      "보유 기간: " + LEAD_FORM.privacy.retention;

    copyrightNotice.textContent = LEAD_FORM.copyrightNotice;
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
    purposeOtherField.hidden = true;
    purposeOtherInput.required = false;
    formError.hidden = true;
    formError.textContent = "";
    formPanel.hidden = false;
    resultPanel.hidden = true;
    submitButton.disabled = false;
    submitButton.textContent = "신청하기";
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

  function trackSubmit(purposeValue) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "lead_form_submit",
      form_purpose: purposeValue,
      page_type: document.body.dataset.page || ""
    });
  }

  purposeSelect.addEventListener("change", function () {
    const isOther = purposeSelect.value === "other";
    purposeOtherField.hidden = !isOther;
    purposeOtherInput.required = isOther;
    if (!isOther) purposeOtherInput.value = "";
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    // 허니팟이 채워져 있으면 봇으로 간주하고, 정상 제출처럼 보이게만 처리합니다.
    if (websiteField && websiteField.value.trim().length > 0) {
      showResult("success", LEAD_FORM.successTitle, LEAD_FORM.successDesc);
      return;
    }

    if (!form.reportValidity()) return;

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
      submittedAt: new Date().toISOString()
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
