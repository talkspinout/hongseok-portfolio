/**
 * 포트폴리오 열람 신청 폼 백엔드 (Google Apps Script)
 *
 * 배포 방법
 * 1. 새 Google 스프레드시트를 만들고, 첫 행에 아래 헤더를 입력합니다.
 *    Timestamp | Email | Name | Company | Purpose | PurposeOther | Message | PageUrl
 * 2. 확장 프로그램 > Apps Script 에서 이 파일 내용을 붙여넣습니다.
 * 3. 아래 NOTIFY_EMAIL을 실제 알림 받을 이메일로 바꿉니다.
 * 4. 배포 > 새 배포 > 유형: 웹 앱
 *    - 실행 계정: 나
 *    - 액세스 권한: 모든 사용자
 * 5. 배포 후 생성되는 웹 앱 URL을 data.js의 SITE.LEAD_API_URL에 입력합니다.
 */

const SHEET_NAME = "Leads";
const NOTIFY_EMAIL = "hs5431@gmail.com"; // ← 신청 알림을 받을 이메일 주소

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const email = String(payload.email || "").trim();
    const name = String(payload.name || "").trim();
    const company = String(payload.company || "").trim();
    const purpose = String(payload.purpose || "").trim();
    const purposeOther = String(payload.purposeOther || "").trim();
    const message = String(payload.message || "").trim();
    const pageUrl = String(payload.pageUrl || "").trim();

    if (!isValidEmail(email) || !name || !company || !purpose) {
      return jsonResponse({ status: "error", message: "필수 항목이 누락되었습니다." });
    }

    const sheet = getSheet();
    sheet.appendRow([
      new Date(),
      email,
      name,
      company,
      purpose,
      purposeOther,
      message,
      pageUrl
    ]);

    sendNotification({ email, name, company, purpose, purposeOther, message });

    return jsonResponse({ status: "ok" });
  } catch (error) {
    return jsonResponse({ status: "error", message: String(error) });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", "Email", "Name", "Company", "Purpose", "PurposeOther", "Message", "PageUrl"
    ]);
  }
  return sheet;
}

function sendNotification(data) {
  const purposeLine = data.purposeOther
    ? data.purpose + " (" + data.purposeOther + ")"
    : data.purpose;

  const body = [
    "포트폴리오 열람 신청이 접수되었습니다.",
    "",
    "이름: " + data.name,
    "회사/소속: " + data.company,
    "이메일: " + data.email,
    "목적: " + purposeLine,
    "전달 내용: " + (data.message || "(없음)")
  ].join("\n");

  MailApp.sendEmail(NOTIFY_EMAIL, "[포트폴리오 신청] " + data.name + " · " + data.company, body);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
