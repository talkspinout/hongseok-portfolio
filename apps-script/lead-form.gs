/**
 * 포트폴리오 열람 신청 폼 백엔드
 * Google Apps Script
 *
 * 시트 헤더:
 * Timestamp | Email | Name | Company | Purpose | PurposeOther |
 * Message | PageUrl | Consent | ConsentedAt | PrivacyVersion |
 * TermsAccepted | RequestId
 */

const SHEET_NAME = "Leads";
const NOTIFY_EMAIL = "hs5431@gmail.com";
const CURRENT_PRIVACY_VERSION = "2026-07-16";

const HEADERS = [
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
];

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
      return jsonResponse({
        status: "error",
        message: "요청 데이터가 없습니다."
      });
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
      return jsonResponse({
        status: "error",
        message: "필수 항목이 누락되었습니다."
      });
    }

    if (!Object.prototype.hasOwnProperty.call(PURPOSE_LABELS, purpose)) {
      return jsonResponse({
        status: "error",
        message: "유효하지 않은 열람 목적입니다."
      });
    }

    if (purpose === "other" && !purposeOther) {
      return jsonResponse({
        status: "error",
        message: "기타 열람 목적을 입력해 주세요."
      });
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
        return jsonResponse({
          status: "ok",
          duplicate: true
        });
      }

      const nextRow = getNextDataRow(sheet);

      const rowData = [[
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
      ]];

      /*
       * appendRow()를 사용하지 않습니다.
       * 체크박스가 아래 행까지 생성돼 있어도 A열을 기준으로
       * 실제 마지막 신청 다음 행에 저장합니다.
       */
      sheet
        .getRange(nextRow, 1, 1, HEADERS.length)
        .setValues(rowData);

      applyCheckboxes(sheet, nextRow);
    } finally {
      lock.releaseLock();
    }

    /*
     * 시트 저장이 끝난 뒤 메일을 발송합니다.
     * 메일 발송에 실패해도 이미 저장된 신청은 유지됩니다.
     */
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

    return jsonResponse({
      status: "ok"
    });
  } catch (error) {
    console.error("포트폴리오 열람 신청 처리 실패:", error);

    return jsonResponse({
      status: "error",
      message: "신청 처리 중 오류가 발생했습니다."
    });
  }
}

/**
 * Leads 시트를 가져오고 헤더를 정상 상태로 유지합니다.
 */
function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error("연결된 스프레드시트를 찾을 수 없습니다.");
  }

  const sheet =
    spreadsheet.getSheetByName(SHEET_NAME) ||
    spreadsheet.insertSheet(SHEET_NAME);

  sheet
    .getRange(1, 1, 1, HEADERS.length)
    .setValues([HEADERS]);

  return sheet;
}

/**
 * A열 Timestamp를 기준으로 실제 데이터의 마지막 행을 구합니다.
 * 다른 열에 미리 생성된 체크박스나 서식은 무시됩니다.
 */
function getLastDataRow(sheet) {
  const maxRows = sheet.getMaxRows();

  const lastRow = sheet
    .getRange(maxRows, 1)
    .getNextDataCell(SpreadsheetApp.Direction.UP)
    .getRow();

  return Math.max(lastRow, 1);
}

/**
 * 실제 마지막 신청 다음 행을 반환합니다.
 */
function getNextDataRow(sheet) {
  return Math.max(getLastDataRow(sheet) + 1, 2);
}

/**
 * 동일한 RequestId가 이미 저장됐는지 확인합니다.
 */
function hasRequestId(sheet, requestId) {
  const firstDataRow = 2;
  const lastDataRow = getLastDataRow(sheet);
  const rowCount = lastDataRow - firstDataRow + 1;

  if (rowCount <= 0) {
    return false;
  }

  return sheet
    .getRange(firstDataRow, 13, rowCount, 1)
    .createTextFinder(requestId)
    .matchEntireCell(true)
    .findNext() !== null;
}

/**
 * 새로 저장된 행의 Consent와 TermsAccepted 셀에만
 * 체크박스 데이터 규칙을 적용합니다.
 */
function applyCheckboxes(sheet, rowNumber) {
  const checkboxRule = SpreadsheetApp
    .newDataValidation()
    .requireCheckbox()
    .build();

  sheet
    .getRange(rowNumber, 9)
    .setDataValidation(checkboxRule);

  sheet
    .getRange(rowNumber, 12)
    .setDataValidation(checkboxRule);
}

/**
 * 신청 알림 메일을 발송합니다.
 */
function sendNotification(data) {
  const purposeLabel =
    PURPOSE_LABELS[data.purpose] || data.purpose;

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
    "[포트폴리오 신청] " +
      subjectName +
      " · " +
      subjectCompany,
    body
  );
}

/**
 * 스프레드시트 수식으로 해석될 수 있는 입력을 방어합니다.
 */
function safeCell(value) {
  const text = String(value || "").trim();

  return /^[=+\-@]/.test(text)
    ? "'" + text
    : text;
}

/**
 * 이메일 제목에 줄바꿈이 들어가지 않도록 처리합니다.
 */
function singleLine(value) {
  return String(value || "")
    .replace(/[\r\n]+/g, " ")
    .trim();
}

/**
 * 이메일 형식만 간단히 검사합니다.
 */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * JSON 응답을 반환합니다.
 */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
