# AGENTS.md

## 운영 원칙

- GitHub `main` 브랜치가 현재 배포 사이트의 기준이다.
- 작업 시작 전에 최신 `main`과 대상 파일을 다시 확인한다.
- Claude는 `claude/*`, Codex는 `agent/*` 브랜치를 사용한다.
- 같은 파일이나 기능을 두 에이전트가 동시에 수정하지 않는다.
- 순차 작업이라면 같은 파일도 자유롭게 수정할 수 있다.
- 별도 승인이나 리뷰는 필수가 아니다. 작업한 에이전트가 검증 후 병합할 수 있다.
- 파일 저장 시 최신 blob SHA를 사용한다. SHA가 달라졌다면 최신 파일을 다시 읽고 변경사항을 합친다.
- force push와 오래된 파일 전체 덮어쓰기를 금지한다.

## 사이트 주요 구조

- `data.js`: 콘텐츠, 링크, GTM·GA 설정
- `analytics.js`: GTM·GA4 초기화
- `main.js`: GNB, 공통 렌더링, 클릭 추적
- `style.css`: 사이트 공통 디자인
- `sentence.js`, `sentence.css`: 문장 자판기 전용
- `lead-form.js`, `lead-form.css`: 포트폴리오 열람 신청 모달 폼 전용
- `apps-script/lead-form.gs`: 열람 신청 폼의 Apps Script 백엔드 코드. **Google Apps Script 편집기에 실제로 배포되어 있는 코드와 항상 동일해야 한다.** 이 파일은 실행되지 않고 참고·백업 용도이므로, Apps Script 편집기에서 코드를 고치면 그 내용을 그대로 이 파일에도 반영해야 한다 (반대 방향도 마찬가지: 이 파일을 고쳤다면 Apps Script 편집기에 붙여넣고 새 버전으로 재배포해야 실제로 반영된다).
  - 배포 절차: Google 스프레드시트에서 확장 프로그램 → Apps Script → 코드 붙여넣기 → 배포 → 배포 관리 → 새 버전으로 배포 (실행 계정: 나, 액세스 권한: 모든 사용자) → 웹 앱 URL을 `data.js`의 `SITE.LEAD_API_URL`과 대조.
  - 시트 헤더: `Timestamp | Email | Name | Company | Purpose | PurposeOther | Message | PageUrl | Consent | ConsentedAt | PrivacyVersion | TermsAccepted | RequestId`
- `index.html`: 하이라이트
- `about.html`: 자기 소개
- `portfolio.html`: 포트폴리오 (열람 신청 모달 포함)
- `lab.html`: 개인 프로젝트
- `sentence.html`: 문장 자판기

기능별 CSS와 JavaScript 분리를 유지하고, 특별한 이유 없이 인라인 `<style>`·`<script>`로 합치지 않는다.

## 임의 변경 금지

다음 값은 사용자의 명시적인 요청이 있을 때만 변경한다.

- 경력 내용, 회사명, 기간, 성과 수치
- 포트폴리오 안내 문구
- Apps Script URL (`SITE.LEAD_API_URL`, 문장 자판기 API 등)
- GTM ID와 GA4 ID
- `ui_click`, `lead_form_submit` 이벤트 구조와 기존 `element_id`
- 메뉴명과 페이지 구성
- 문장 자판기의 인용문과 출처 표기
- 열람 신청 폼의 개인정보 수집·이용 문구와 저작권 안내 문구 (실제 수집 필드와 반드시 일치해야 하므로, 필드를 바꾸면 이 문구도 함께 검토한다)
- `assets/data.js`의 `LEAD_FORM.privacy.version`과 `apps-script/lead-form.gs`의 `CURRENT_PRIVACY_VERSION`은 항상 동일한 값이어야 한다. 개인정보 안내 문구를 바꿔서 버전을 올릴 때는 두 파일을 함께 수정하고, `.gs`는 Apps Script 편집기에서 새 버전으로 재배포해야 반영된다. 하나만 바뀌면 제출이 "개인정보 안내가 변경되었습니다" 오류로 조용히 전부 실패한다.

## 디자인 기준

- 공통 색상은 `style.css`의 기존 디자인 토큰을 사용한다.
- 검정·흰색·민트 중심의 현재 톤을 유지한다.
- 데스크톱과 모바일에서 기존 콘텐츠 흐름을 훼손하지 않는다.
- 전역 CSS 선택자와 전역 변수를 불필요하게 추가하지 않는다.

## 작업 완료 기준

변경 범위에 맞춰 다음을 확인한다.

- JavaScript 문법과 브라우저 콘솔 오류
- 관련 페이지 및 공통 GNB 동작
- 모바일 좌우 잘림과 레이아웃
- GTM·GA4 중복 로드 및 클릭 이벤트 중복
- 문장 자판기 변경 시 API 정상·실패 처리
- 열람 신청 폼 변경 시 제출 성공·실패·API 미설정 상태, 개인정보 동의 필수 여부, 스팸 방지(허니팟) 동작
- 병합 후 GitHub Pages 실제 화면

검증에 문제가 없으면 작업한 에이전트가 PR을 병합하고 배포 결과를 확인할 수 있다.
