# 캠페인 전략 설계 OS

포스트잇처럼 쌓고 → 하나로 승격하고 → 전략과 활동의 연결을 점검한 뒤 → 브리프 한 장으로 내보내는 캠페인 전략 설계 도구.

## 구조

- 정적 SPA — 서버·DB 없음. 저장은 브라우저(localStorage) + 프로젝트 JSON 파일.
- 외부 마케팅 프레임워크의 결과를 카드로 받아 목표·근거·전략·활동·성공 신호의 연결만 점검한다. 프레임워크 자체는 탑재하지 않는다.
- 활동 라이브러리는 역할과 실행 수단을 분리하고, 활동별 다음 행동과 성공 신호를 기록한다.
- 채워진 예시는 실제 제안 구조를 익명 재구성한 사례와 학습용 가상 사례를 구분하고, 대표안·대안·제외안을 함께 보여준다.
- `src/App.jsx` — 앱 전체 (템플릿 정의, 보드, 문서 export 포함)
- `scripts/verify-project-data.mjs` — 템플릿·스냅샷·v2 마이그레이션·미상 섹션 복구 검증
- `docs/example-source-map.md` — 예시별 참고 구조, 재작성 범위, 익명화·제외 항목 기록
- `AUTHOR_NAME` 상수(App.jsx 상단) — 작성자 브랜딩. 여기만 바꾸면 전체 반영.

## 실행

```bash
npm install
npm run dev      # 로컬 개발
npm run build    # dist/ 에 정적 빌드
npm run verify:data # 저장 데이터와 템플릿 회귀 검증
```

## 배포 (GitHub Pages)

1. 저장소 Settings → Pages → Source를 **GitHub Actions**로 설정
2. main 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동 빌드·배포
3. 기존 포트폴리오 저장소의 하위 경로에 넣을 경우: 이 폴더를 별도 저장소로 두고 배포된 URL을 포트폴리오에서 링크하거나, 포트폴리오 빌드 산출물에 `dist/`를 `os/` 폴더로 복사 (base가 상대 경로라 어느 위치에서든 동작)

## 관리 메모 (Claude / Codex 협업용)

- 템플릿 추가·수정: `src/App.jsx`의 `TEMPLATES` 객체. `section(id, 제목, 질문, 도움말, 역할, kind)` 형식.
- 데이터 스키마 변경 시 `SCHEMA_VERSION`을 올리고 `migrate` 로직 확인.
- 프로젝트 관리는 추후 Notion 등 외부 도구에서 진행 — 이 앱은 브리프 작성과 기획·실행의 논리 연결 점검까지가 경계.
- 현재 작업은 로컬 검토 단계다. 사용자 확인과 Claude 리뷰가 끝나기 전에는 배포하지 않는다.
