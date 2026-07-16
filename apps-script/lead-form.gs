/**
 * 포트폴리오 열람 신청 폼 백엔드 (Google Apps Script)
 *
 * 배포 방법
 * 1. 새 Google 스프레드시트를 만들고, 첫 행에 아래 헤더를 입력합니다.
 *    Timestamp | Email | Name | Company | Purpose | PurposeOther | Message | PageUrl |
 *    Consent | ConsentedAt | PrivacyVersion | TermsAccepted | RequestId
 * 2. 확장 프로그램 > Apps Script에서 이 파일 내용을 붙여넣습니다.
 * 3. 아래 NOTIFY_EMAIL을 실제 알림 받을 이메일로 바꿉니다.
 * 4. 배포 > 배포 관리 > 수정 > 버전: 새 버전으로 배포합니다.
 *    - 실행 계정: 나
 *    - 액세스 권한: 모든 사용자
 * 5. 기존 웹 앱 URL을 유지하고, data.js의 SITE.LEAD_API_URL과 일치하는지 확인합니다.
 */

const SHEET_NAME = "Leads";
const NOTIFY_EMAIL = "hs5431@gmail.com";
const CURRENT_PRIVACY_VERSION = "2026-07-16";

const PURPOSE_LABELS = {
  hiring_review: "채용 검토",
  interview_prep: "면접 또는 미팅 전 검토",
  collab_proposal: "프로젝트·외주 협업 제안",
  partnership: "비즈니스·파트너십 제안",
  headhunting: "헤드헌팅 또는 인재 추천",
  reference: "마케팅 사례 및 업무 방식 참고",
  other: "기타"
};

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: "error", message: "요청 데이터가 없습니다." });
    }

    const payload = JSON.parse(e.postData.contents);
    const email = String(payload.email || "").trim();
    const name = String(payload.name || "").trim();
    const company = String(payload.company || "").trim();
    const purpose = String(payload.purpose || "").trim();
    const purposeOther = String(payload.purposeOther || "").trim();
    const message = String(payload.message || "").trim();
    const pageUrl = String(payload.pageUrl || "").trim();
    const consent = payload.consent === true;
    const consentedAt = String(payload.consentedAt || "").trim();
    const privacyVersion = String(payload.privacyVersion || "").trim();
    const termsAccepted = payload.termsAccepted === true;
    const requestId = String(payload.requestId || "").trim();

    if (!isValidEmail(email) || !name || !company || !purpose) {
      return jsonResponse({ status: "error", message: "필수 항목이 누락되었습니다." });
    }

    if (!Object.prototype.hasOwnProperty.call(PURPOSE_LABELS, purpose)) {
      return jsonResponse({ status: "error", message: "유효하지 않은 열람 목적입니다." });
    }

    if (purpose === "other" && !purposeOther) {
      return jsonResponse({ status: "error", message: "기타 열람 목적을 입력해 주세요." });
    }

    if (!consent || !termsAccepted || !consentedAt || !requestId) {
      return jsonResponse({
        status: "error",
        message: "개인정보 수집·이용 동의와 자료 이용 조건 확인이 필요합니다."
      });
    }

    if (privacyVersion !== CURRENT_PRIVACY_VERSION) {
      return jsonResponse({
        status: "error",
        message: "개인정보 안내가 변경되었습니다. 페이지를 새로고침한 뒤 다시 신청해 주세요."
      });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const sheet = getSheet();

      if (hasRequestId(sheet, requestId)) {
        return jsonResponse({ status: "ok", duplicate: true });
      }

      sheet.appendRow([
        new Date(),
        safeCell(email),
        safeCell(name),
        safeCell(company),
        safeCell(purpose),
        safeCell(purposeOther),
        safeCell(message),
        safeCell(pageUrl),
        consent,
        safeCell(consentedAt),
        safeCell(privacyVersion),
        termsAccepted,
        safeCell(requestId)
      ]);
    } finally {
      lock.releaseLock();
    }

    try {
      sendNotification({
        email,
        name,
        company,
        purpose,
        purposeOther,
        message,
        consentedAt,
        privacyVersion,
        requestId
      });
    } catch (mailError) {
      console.error("신청 알림 메일 발송 실패:", mailError);
    }

    return jsonResponse({ status: "ok" });
  } catch (error) {
    console.error("포트폴리오 열람 신청 처리 실패:", error);
    return jsonResponse({
      status: "error",
      message: "신청 처리 중 오류가 발생했습니다."
    });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Email",
      "Name",
      "Company",
      "Purpose",
      "PurposeOther",
      "Message",
      "PageUrl",
      "Consent",
      "ConsentedAt",
      "PrivacyVersion",
      "TermsAccepted",
      "RequestId"
    ]);
  }

  return sheet;
}

function hasRequestId(sheet, requestId) {
  const firstDataRow = 2;
  const requestIdColumn = 13;
  const rowCount = sheet.getLastRow() - firstDataRow + 1;

  if (rowCount <= 0) return false;

  return sheet
    .getRange(firstDataRow, requestIdColumn, rowCount, 1)
    .createTextFinder(requestId)
    .matchEntireCell(true)
    .findNext() !== null;
}

function sendNotification(data) {
  const purposeLabel = PURPOSE_LABELS[data.purpose] || data.purpose;
  const purposeLine = data.purposeOther
    ? purposeLabel + " (" + data.purposeOther + ")"
    : purposeLabel;

  const body = [
    "포트폴리오 열람 신청이 접수되었습니다.",
    "",
    "이름: " + data.name,
    "회사/소속: " + data.company,
    "이메일: " + data.email,
    "목적: " + purposeLine,
    "전달 내용: " + (data.message || "(없음)"),
    "",
    "동의 시각: " + data.consentedAt,
    "개인정보 안내 버전: " + data.privacyVersion,
    "요청 ID: " + data.requestId
  ].join("\n");

  const subjectName = singleLine(data.name);
  const subjectCompany = singleLine(data.company);

  MailApp.sendEmail(
    NOTIFY_EMAIL,
    "[포트폴리오 신청] " + subjectName + " · " + subjectCompany,
    body
  );
}

function safeCell(value) {
  const text = String(value || "").trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function singleLine(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
