(() => {
  "use strict";

  const SENTENCE_API_URL =
    "https://script.google.com/macros/s/AKfycbxgM2o5VJZwoY0OlY3c4FTSHcySIXnv3qoz5xWbwZnFx04EDLng56vQxjGwNS6H-2m9MA/exec";

  const API_TIMEOUT_MS = 8000;

  const FALLBACK_SENTENCES = [
    {
      id: 1,
      active: true,
      quote:
        "그러므로 나는 노력하기로 했지. 이 삶에 감사하기로. 타인에게 더 다정하기로. 어둠과 빛이 있다면 빛을 선택하기로.",
      author: "김연수",
      title: "이토록 평범한 미래",
      titleType: "book",
      work: "다시, 2100년의 바르바라에게",
      workType: "work"
    }
  ];

  const gacha = document.getElementById("sentence-gacha");
  const drawButton = document.getElementById("sentence-draw-button");
  const fallingCapsule = document.getElementById(
    "sentence-falling-capsule"
  );
  const status = document.getElementById("sentence-gacha-status");
  const modal = document.getElementById("sentence-modal");
  const modalBackdrop = document.getElementById(
    "sentence-modal-backdrop"
  );
  const closeButton = document.getElementById("sentence-close-button");
  const againButton = document.getElementById("sentence-again-button");
  const sentenceNumber = document.getElementById("sentence-number");
  const sentenceQuote = document.getElementById("sentence-quote");
  const sentenceSource = document.getElementById("sentence-source");

  if (
    !gacha ||
    !drawButton ||
    !fallingCapsule ||
    !status ||
    !modal ||
    !modalBackdrop ||
    !closeButton ||
    !againButton ||
    !sentenceNumber ||
    !sentenceQuote ||
    !sentenceSource
  ) {
    console.error("문장 자판기 구성 요소를 찾지 못했습니다.");
    return;
  }

  let sentences = [];
  let previousSentenceIndex = -1;
  let isLoading = true;
  let isDrawing = false;
  let lastFocusedElement = null;

  function normalizeBoolean(value) {
    if (typeof value === "boolean") {
      return value;
    }

    return String(value).trim().toUpperCase() === "TRUE";
  }

  function normalizeString(value, trim = true) {
    const result =
      value === null || value === undefined ? "" : String(value);

    return trim ? result.trim() : result;
  }

  function normalizeSentence(item) {
    if (!item || typeof item !== "object") {
      return null;
    }

    return {
      id: item.id,
      active:
        item.active === undefined
          ? true
          : normalizeBoolean(item.active),
      quote: normalizeString(item.quote, false),
      author: normalizeString(item.author),
      title: normalizeString(item.title),
      titleType: normalizeString(item.titleType).toLowerCase(),
      work: normalizeString(item.work),
      workType: normalizeString(item.workType).toLowerCase()
    };
  }

  async function fetchWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      return await fetch(url, {
        method: "GET",
        cache: "no-store",
        redirect: "follow",
        signal: controller.signal
      });
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  async function loadSentences() {
    isLoading = true;
    drawButton.disabled = true;
    gacha.setAttribute("aria-busy", "true");
    status.textContent = "문장을 불러오는 중입니다.";

    try {
      const response = await fetchWithTimeout(
        SENTENCE_API_URL,
        API_TIMEOUT_MS
      );

      if (!response.ok) {
        throw new Error(`문장 API 요청 실패: ${response.status}`);
      }

      const responseData = await response.json();
      const rawSentences = Array.isArray(responseData)
        ? responseData
        : responseData.sentences;

      if (!Array.isArray(rawSentences)) {
        throw new TypeError("문장 데이터 배열을 찾지 못했습니다.");
      }

      sentences = rawSentences
        .map(normalizeSentence)
        .filter(Boolean)
        .filter((sentence) => {
          return (
            sentence.active &&
            sentence.quote.trim().length > 0
          );
        });

      if (sentences.length === 0) {
        throw new Error("노출 가능한 문장이 없습니다.");
      }

      status.textContent =
        `${sentences.length}개의 문장이 준비되어 있습니다.`;
    } catch (error) {
      console.error("구글 시트 문장 불러오기 실패:", error);

      sentences = FALLBACK_SENTENCES
        .map(normalizeSentence)
        .filter(Boolean);

      status.textContent =
        "기본 문장으로 자판기를 준비했습니다.";
    } finally {
      isLoading = false;
      drawButton.disabled = false;
      gacha.setAttribute("aria-busy", "false");
    }
  }

  function formatSentenceNumber(id) {
    const numericId = Number(id);

    if (Number.isFinite(numericId)) {
      return String(numericId).padStart(3, "0");
    }

    return normalizeString(id) || "---";
  }

  function formatTitle(value, type) {
    const title = normalizeString(value);

    if (!title) {
      return "";
    }

    switch (type) {
      case "book":
        return `『${title}』`;

      case "work":
        return `「${title}」`;

      case "song":
      case "movie":
        return `〈${title}〉`;

      default:
        return title;
    }
  }

  function formatSource(sentence) {
    const sourceParts = [
      sentence.author,
      formatTitle(sentence.title, sentence.titleType),
      formatTitle(sentence.work, sentence.workType)
    ].filter(Boolean);

    if (sourceParts.length === 0) {
      return "";
    }

    return `— ${sourceParts.join(", ")} 中`;
  }

  function getRandomSentenceIndex() {
    if (sentences.length <= 1) {
      return 0;
    }

    let nextIndex;

    do {
      nextIndex = Math.floor(Math.random() * sentences.length);
    } while (nextIndex === previousSentenceIndex);

    return nextIndex;
  }

  function showSentence(sentence) {
    sentenceNumber.textContent =
      `Sentence #${formatSentenceNumber(sentence.id)}`;

    sentenceQuote.textContent = sentence.quote;

    const formattedSource = formatSource(sentence);
    sentenceSource.textContent = formattedSource;
    sentenceSource.hidden = formattedSource.length === 0;

    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("sentence-modal-open");

    window.setTimeout(() => {
      againButton.focus();
    }, 50);
  }

  function hideModal({ restoreFocus = true } = {}) {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("sentence-modal-open");


    if (
      restoreFocus &&
      lastFocusedElement instanceof HTMLElement
    ) {
      lastFocusedElement.focus();
    }
  }

  function resetAnimation() {
    gacha.classList.remove("is-drawing");
    fallingCapsule.classList.remove("is-falling");
    void gacha.offsetWidth;
  }

  function drawSentence(source = "draw") {
    if (
      isLoading ||
      isDrawing ||
      sentences.length === 0
    ) {
      return;
    }

    isDrawing = true;
    lastFocusedElement = document.activeElement;

    hideModal({ restoreFocus: false });
    resetAnimation();

    gacha.classList.add("is-drawing");
    fallingCapsule.classList.add("is-falling");

    drawButton.disabled = true;
    againButton.disabled = true;
    status.textContent = "문장을 뽑고 있습니다.";

    const sentenceIndex = getRandomSentenceIndex();
    previousSentenceIndex = sentenceIndex;

    window.setTimeout(() => {
      showSentence(sentences[sentenceIndex]);
    }, 900);

    window.setTimeout(() => {
      isDrawing = false;
      gacha.classList.remove("is-drawing");
      drawButton.disabled = false;
      againButton.disabled = false;
      status.textContent =
        `${sentences.length}개의 문장 중 하나를 뽑았습니다.`;
    }, 1200);
  }

  function getFocusableElements() {
    return modal.querySelectorAll(
      [
        "button:not([disabled])",
        "[href]",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])'
      ].join(",")
    );
  }

  function handleKeydown(event) {
    if (
      event.key === "Escape" &&
      modal.classList.contains("is-visible")
    ) {
      hideModal();
      return;
    }

    if (
      event.key !== "Tab" ||
      !modal.classList.contains("is-visible")
    ) {
      return;
    }

    const focusableElements = getFocusableElements();

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement =
      focusableElements[focusableElements.length - 1];

    if (
      event.shiftKey &&
      document.activeElement === firstElement
    ) {
      event.preventDefault();
      lastElement.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === lastElement
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  drawButton.addEventListener("click", () => {
    drawSentence("draw");
  });

  againButton.addEventListener("click", () => {
    drawSentence("again");
  });

  closeButton.addEventListener("click", () => {
    hideModal();
  });

  modalBackdrop.addEventListener("click", () => {
    hideModal();
  });

  document.addEventListener("keydown", handleKeydown);

  loadSentences();
})();

