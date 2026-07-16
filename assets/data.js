/* ============================================================
   data.js — 사이트의 모든 콘텐츠는 이 파일에서 관리합니다.
   HTML/CSS를 건드리지 않고 이 파일만 수정하면 됩니다.
   수정 후 GitHub에 커밋하면 사이트에 반영됩니다.
   ============================================================ */

/* ------------------------------------------------------------
   1. 기본 설정
   - GA_ID: GA4 측정 ID (예: "G-XXXXXXXXXX"). 비워두면 GA가 로드되지 않습니다.
   - FORM_URL: 포트폴리오 열람 신청용 Google Form 주소.
   - NOTION_URL: 마케팅 퍼널 운영 프레임워크 Notion 문서 주소.
   ------------------------------------------------------------ */
const SITE = {
  name: "고홍석",
  title: "마케팅 기획자 고홍석",
  tagline: "GTM 전략부터 콘텐츠, 퍼포먼스, CRM, SEO까지\n마케팅 전 과정을 연결해 성과 구조로 만드는 마케터입니다.",
  GA_ID: "",            // ← GA4 측정 ID 입력 (GTM을 쓰는 경우 비워두고 GTM 안에서 GA4 태그 설정)
  GTM_ID: "GTM-NPBTB82",           // ← Google Tag Manager 컨테이너 ID 입력 (예: "GTM-XXXXXXX")
  FORM_URL: "https://docs.google.com/forms/d/e/1FAIpQLSfIGT8marmIPqCx9RYL0HOBU5G7wh4ZrRjuQsKBTqIIu57sbQ/viewform?usp=header",         // ← (미사용) 이전 Google Form 주소. 현재는 LEAD_API_URL의 사이트 내 신청 폼으로 대체됨
  LEAD_API_URL: "https://script.google.com/macros/s/AKfycbwctKcoRwoByOTpqyFr5hQvW68KNGo6r02oB5PVpPJy5zMv8090DgS-wEUXt3-LXfSL/exec",     // ← 포트폴리오 열람 신청 폼을 처리할 Google Apps Script 웹앱 주소 입력 (비워두면 폼이 "준비 중" 상태로 표시됩니다)
  NOTION_URL: "https://app.notion.com/p/B2C-B2B-SaaS-333103889f8d8092bf21e5a15a43f7c6",
  LINKTREE_URL: "https://linktr.ee/talkspinout",

  /* 연락처 · 소셜: 비워두면 해당 아이콘/버튼이 표시되지 않습니다. */
  EMAIL: "hs5431@gmail.com",            // ← 컨택 이메일 입력 (예: "hello@example.com")
  INSTAGRAM_URL: "https://www.instagram.com/talkspinout/",    // ← 인스타그램 프로필 주소 입력
  LINKEDIN_URL: "https://www.linkedin.com/in/%ED%99%8D%EC%84%9D-%EA%B3%A0-108895b0/",     // ← 링크드인 프로필 주소 입력
};

/* ------------------------------------------------------------
   2. 하이라이트 수치 (메인 상단 숫자 보드)
   - value: 카운트업 애니메이션에 쓰이는 숫자 (숫자만)
   - decimals: 소수점 자릿수 (1.7배 등. 없으면 생략)
   - prefix / suffix: 숫자 앞뒤에 붙는 문자
   - label: 수치 이름
   - note: 한 줄 맥락
   항목을 추가/삭제하면 보드가 자동으로 다시 배열됩니다.
   ------------------------------------------------------------ */
const METRICS = [
  { value: 80,   suffix: "%",  label: "CPL 개선",     note: "리드 비용 약 50만 원 → 약 10만 원 · B2B SaaS" },
  { value: 75,   suffix: "%",  label: "1차 영업 연결", note: "확보 리드의 온라인 미팅 전환 · B2B SaaS" },
  { value: 1.7,  suffix: "배", decimals: 1, label: "ROAS 향상", note: "150% → 230~250% · B2C 커머스" },
  { value: 1000, prefix: "₩",  label: "CPI 달성",     note: "900~1,000원 · Non-incentive · B2C 앱" },
];

/* ------------------------------------------------------------
   3. 개별 프로젝트 (메인 하단 + 좌측 GNB에 자동 등록)
   - id: 영문 소문자, 페이지 내 앵커로 사용 (중복 금지)
   - nav: GNB에 표시될 짧은 이름
   - domain: 도메인 태그
   - period / role: 기간과 역할
   - problem / action / result: 문제 → 실행 → 성과
   항목을 추가하면 GNB와 본문에 자동으로 나타납니다.
   ------------------------------------------------------------ */
const PROJECTS = [
  {
    id: "aicy",
    nav: "Aicy",
    name: "Aicy — GTM 전략 리드 및 통합 퍼널 구조 구축",
    domain: "B2B SaaS · 인하우스",
    period: "2025.02 – 2025.11",
    role: "마케팅 리드",
    problem: "FP&A 인지 부족과 경쟁사 대비 낮은 신뢰도. 3개 제품 분리에 따른 일관된 브랜드 퍼널 부재.",
    action: "제품별 포지셔닝 계층화(진입–성장–기반), 퍼널 통합 설계, GTM 전략 수립, SEO 구조화, CRM 시나리오, 콘텐츠·광고 전체 운영.",
    result: "finex CPL 80% 개선 · 1차 영업 연결률 75% / Fiela.ai 출시 후 2개월간 리드 800개+ 확보",
  },
  {
    id: "familytown",
    nav: "패밀리타운",
    name: "패밀리타운 — 원포인트 소재 마케팅",
    domain: "B2C 앱 · 인하우스",
    period: "2023.08 – 2024.04",
    role: "퍼포먼스 마케터",
    problem: "다기능 구조로 핵심 가치 인식 저조. 기존 사용자 이탈과 신규 유입 정체.",
    action: "사용 패턴 분석으로 원포인트 Hero Feature 전략 수립. 10~20대 타깃 릴스 광고, 실제 당첨 영상 활용 숏폼 제작.",
    result: "자연 CPI 900~1,000원 · 3만 다운로드 · 커뮤니케이션 카테고리 순위 진입",
  },
  {
    id: "heybro",
    nav: "헤이브로",
    name: "헤이브로 — 사용자 퍼널 분석을 통한 전환율 개선",
    domain: "B2C 커머스 · 인하우스",
    period: "2021.12 – 2022.07",
    role: "마케팅 운영 관리",
    problem: "단일 매체(팟캐스트) 의존과 페이스북 단독 운영. 경쟁 브랜드 등장으로 판매량 하락.",
    action: "다매체 확장(트래픽+전환 병행). GA4·Clarity 퍼널 분석으로 랜딩페이지 구조 개선과 타깃 리포지셔닝.",
    result: "ROAS 150% → 230~250% 달성",
  },
  {
    id: "autodesk",
    nav: "Autodesk",
    name: "Autodesk Korea — 온라인 리드 파이프라인 확장",
    domain: "B2B SaaS · 에이전시",
    period: "2016.04 – 2021.10",
    role: "AE → PM",
    problem: "오프라인 영업 중심 구조. 구독형 전환 후 온라인 리드 파이프라인 부재.",
    action: "SNS·YouTube 소셜 채널 확장, 교육형 콘텐츠 제작, LinkedIn 기반 ABM 마케팅 도입.",
    result: "리드 비용 50%↓ · MQL→SQL 전환 다수 · 재계약 2회 달성",
  },
  {
    id: "lovepropose",
    nav: "러브프로포즈",
    name: "러브프로포즈 — 커뮤니티의 미디어 플랫폼화",
    domain: "자사 미디어 · 사내 프로젝트",
    period: "2013.10 – 2015.04",
    role: "PM",
    problem: "단일 페이스북 커뮤니티에 머물러 있던 채널. 미디어로서의 확장 구조와 수익 모델 부재.",
    action: "웹사이트·유튜브 등 멀티 채널 구축, '연애 콘텐츠 미디어'로 플랫폼화. 타 대행사 의뢰 기반 광고 상품 기획과 클라이언트 콘텐츠 협업.",
    result: "팔로워 40만 달성(국내 100위 권) · 운영 기간 팬 35만 증가 · 법인 분리 후 매각",
  },
];

/* ------------------------------------------------------------
   4. 소개 페이지 (about.html)
   ------------------------------------------------------------ */
const ABOUT = {
  heroTitle: "문제를 정의하고,\n해결 방식을 설계해\n성과로 연결합니다.",
  heroSub: "인하우스와 에이전시를 오가며\nB2C 커머스·앱부터 B2B 엔터프라이즈·SaaS까지,\n다양한 제품과 시장의 성장 과제를 해결해왔습니다.\n\n채널 단위의 실행에 머무르지 않고\n사용자 여정과 성과 구조를 함께 설계합니다.",
  skills: [
    "GTM 전략 · 브랜드 포지셔닝",
    "퍼포먼스 · 콘텐츠 마케팅",
    "데이터 분석 · 성과 최적화",
    "SEO · CRM · 트래킹 인프라",
    "팀 리딩 · 프로젝트 관리",
  ],
};

/* ------------------------------------------------------------
   5. 경력 타임라인 (최신순. 이직·경력 추가 시 맨 위에 항목 추가)
   - company / role / period: 회사, 직책, 기간
   - desc: 한 줄 역할 정의
   - result: 대표 성과 1개
   ------------------------------------------------------------ */
const CAREER_DIRECTIONS = [
  {
    title: "에이전시 → 인하우스",
    desc: "다양한 클라이언트의 과제를 해결한 경험을 바탕으로,\n제품과 브랜드의 성장을 직접 책임지는 역할로 확장했습니다.",
  },
  {
    title: "B2C → B2B SaaS",
    desc: "사용자의 구매·가입 전환부터\n기업 고객의 리드 파이프라인까지 설계해왔습니다.",
  },
  {
    title: "실행 → 전략·리딩",
    desc: "채널 운영과 캠페인 실행에서 출발해\nGTM과 통합 마케팅 전략을 총괄하는 역할로 확장했습니다.",
  },
];

const CAREER_JOURNEY = {
  desc: "SNS와 콘텐츠 운영에서 시작해\n퍼포먼스와 전환 퍼널 개선을 거쳐,\nB2B SaaS의 GTM과 통합 마케팅으로 영역을 확장해왔습니다.",
  items: [
    { period: "2013.07 – 2015.04", title: "콘텐츠·SNS", desc: "채널 운영과 콘텐츠 기획" },
    { period: "2016.02 – 2021.11", title: "디지털 마케팅·PM", desc: "B2B 리드 캠페인과 프로젝트 운영" },
    { period: "2021.12 – 2022.07", title: "브랜드·전환 퍼널", desc: "커머스 광고와 구매 경험 개선" },
    { period: "2023.04 – 2024.05", title: "앱 그로스", desc: "제품 특성에 맞춘 신규 유입 최적화" },
    { period: "2025.02 – 2025.11", title: "B2B SaaS GTM", desc: "시장 진입과 통합 마케팅 퍼널 설계" },
  ],
};

const EXPERIENCE_INTRO = "산업과 제품이 달라도 핵심 문제를 파악하고,\n상황에 맞는 실행 구조를 설계해 성과로 연결해왔습니다.";

const CAREER = [
  {
    domain: "B2B SaaS · GTM",
    company: "㈜아이씨",
    role: "마케팅 리드",
    period: "2025.02 – 2025.11",
    summary: "3개 B2B SaaS 제품의 GTM 전략을 총괄하고,\n인지부터 전환까지 이어지는 통합 마케팅 퍼널을 구축했습니다.",
    responsibilities: [
      "finex·Fiela.ai·CBOOK의 제품별 포지셔닝과 GTM 전략 수립",
      "SEO·콘텐츠·퍼포먼스·CRM 마케팅 체계 구축",
      "트래킹 인프라 및 웹사이트 구조 설계",
      "시장 분석과 KPI 설정, 제품 개선 제안",
    ],
    achievements: [
      { subject: "finex", result: "CPL 80% 절감", note: "약 50만 원 → 약 10만 원" },
      { subject: "finex", result: "확보 리드 중 약 75% 영업 연결" },
      { subject: "Fiela.ai", result: "출시 2개월간 기업 가입 800개+" },
    ],
  },
  {
    domain: "B2C App · Growth",
    company: "㈜비밀리",
    role: "퍼포먼스 마케터 · 과장",
    period: "2023.04 – 2024.05",
    summary: "패밀리타운의 핵심 가치를 하나의 기능으로 압축하고,\n광고 소재와 신규 유입 전략을 재설계했습니다.",
    responsibilities: [
      "앱 런칭 초기 퍼포먼스 마케팅 체계 구축",
      "사용자 패턴 분석을 통한 Hero Feature 전략 수립",
      "릴스·숏폼 중심 광고 소재 기획",
      "매체 운영 및 CPI 최적화",
    ],
    achievements: [
      { result: "Non-incentive CPI 900~1,000원" },
      { result: "신규 가입자 3만 명 확보" },
      { result: "커뮤니케이션 앱 카테고리 순위 진입" },
    ],
  },
  {
    domain: "B2C Commerce · Brand Growth",
    company: "㈜디토나인",
    role: "마케터 · 파트장(책임)",
    period: "2021.12 – 2022.07",
    summary: "자사 브랜드 헤이브로의 광고·구매 퍼널을 개선하고,\n클라이언트 마케팅 프로젝트 운영을 담당했습니다.",
    responsibilities: [
      "남성 코스메틱 브랜드 헤이브로 마케팅 운영",
      "GA4·Clarity 기반 광고 유입 및 사용자 행동 분석",
      "랜딩페이지 구조와 제품 포지셔닝 개선",
      "현대렌탈케어 SNS·온라인 마케팅 운영 관리",
    ],
    achievements: [
      { subject: "헤이브로", result: "ROAS 150% → 230~250%" },
      { subject: "현대렌탈케어", result: "프로젝트 재계약 달성" },
    ],
  },
  {
    domain: "B2B · Agency Project Leadership",
    company: "㈜리시드",
    role: "AE · 과장",
    period: "2016.02 – 2021.11",
    summary: "글로벌·IT 클라이언트의 디지털 마케팅을 기획하고,\n장기 프로젝트의 실행과 커뮤니케이션을 담당했습니다.",
    responsibilities: [
      "디지털 마케팅 및 캠페인 전략 기획",
      "콘텐츠·퍼포먼스·리드 캠페인 통합 운영",
      "클라이언트 커뮤니케이션 및 프로젝트 PM",
    ],
    highlightsTitle: "Client Highlights",
    clients: [
      {
        name: "Autodesk Korea",
        featured: true,
        companyStanding: "NASDAQ 상장 · 시가총액 약 440억 달러 규모",
        standingNote: "2026.07 기준",
        companyProfile: "글로벌 설계·제작 소프트웨어 기업",
        workSummary: "온라인 리드 파이프라인 구축과\n교육형 콘텐츠·LinkedIn ABM 캠페인 운영",
        clientAchievements: [
          "리드 획득 비용 50% 이상 절감",
          "MQL→SQL 전환",
          "장기 운영 및 2회 재계약",
        ],
      },
      {
        name: "Bespin Global",
        companyProfile: "클라우드·AI·데이터·보안 영역의\n디지털 전환을 지원하는 기술 기업",
        workSummary: "AlertNow의 제품 인지도 확대와\nTrial 참여 유도 캠페인 기획",
      },
      {
        name: "SK 행복얼라이언스",
        companyProfile: "기업·지자체·시민이 함께하는\n아동 문제 해결 사회공헌 네트워크",
        workSummary: "사회공헌 활동을 참여형·스토리텔링 콘텐츠로 재구성",
      },
      {
        name: "삼성 멀티캠퍼스",
        companyProfile: "삼성 계열의 기업교육·HRD 전문기업",
        workSummary: "페이스북 채널 운영 및 콘텐츠 기획",
      },
    ],
    otherClients: [
      { name: "SCK", workSummary: "온라인 마케팅 운영" },
      { name: "대한빙상경기연맹", workSummary: "웹사이트 운영·유지보수" },
      { name: "동진레저", workSummary: "카카오스토리·서포터즈 운영" },
    ],
  },
  {
    domain: "Content · SNS Agency",
    company: "㈜골드넥스",
    role: "AE · 사원",
    period: "2013.07 – 2015.04",
    summary: "SNS와 블로그 운영, 콘텐츠 기획에서 시작해\n사내 미디어 프로젝트의 사업화까지 경험했습니다.",
    responsibilities: [
      "SNS·블로그 채널 운영 및 콘텐츠 기획",
      "제품 바이럴과 SEO 콘텐츠 제작",
      "클라이언트 커뮤니케이션",
      "사내 미디어 프로젝트 기획 및 운영",
    ],
    highlightsTitle: "Project & Client Highlights",
    clients: [
      {
        name: "LovePropose",
        featured: true,
        clientType: "사내 프로젝트",
        companyProfile: "페이스북 커뮤니티에서 출발한\n사내 연애 콘텐츠 미디어 프로젝트",
        workSummary: "웹사이트·유튜브로 채널을 확장하고\n광고 상품과 제휴 콘텐츠를 기획",
        clientAchievements: [
          "팔로워 40만 확보",
          "운영 기간 팬 35만 증가",
          "법인 분리 후 매각",
        ],
      },
      {
        name: "Haier Korea",
        companyProfile: "글로벌 가전 그룹 Haier의 한국 법인",
        workSummary: "SNS·블로그 운영 및 제품 바이럴 콘텐츠 기획",
      },
      {
        name: "PMC Production",
        companyProfile: "공연 콘텐츠 ‘난타’를 제작한 공연기획사",
        workSummary: "공연 홍보를 위한 SNS 채널 운영 및 콘텐츠 기획",
      },
      {
        name: "서울시 상수도사업본부",
        clientType: "공공기관",
        companyProfile: "서울시 수돗물 ‘아리수’의\n생산·공급과 시민 서비스를 담당한 공공기관",
        workSummary: "아리수 블로그 콘텐츠 제작 및\n검색 노출을 위한 SEO 운영",
      },
    ],
  },
];

const CORE_CAPABILITIES_INTRO = "전략을 문서로 제안하는 데 그치지 않고,\n직접 실행하고 데이터를 확인하며 구조를 개선합니다.";

const CORE_CAPABILITIES = [
  {
    title: "전략 설계",
    keywords: "GTM · 브랜드 포지셔닝 · 퍼널 · KPI",
    desc: "시장과 제품의 구조를 분석하고\n목표와 실행 방향을 설계합니다.",
  },
  {
    title: "통합 실행",
    keywords: "콘텐츠 · 퍼포먼스 · CRM · SEO",
    desc: "채널별 활동을 분리하지 않고\n하나의 사용자 여정으로 연결합니다.",
  },
  {
    title: "데이터 최적화",
    keywords: "트래킹 · 행동 분석 · 전환 개선",
    desc: "정량·정성 데이터를 바탕으로\n병목을 찾고 성과 구조를 개선합니다.",
  },
  {
    title: "프로젝트 리딩",
    keywords: "협업 · 일정 · 예산 · 클라이언트 커뮤니케이션",
    desc: "인하우스와 에이전시 경험을 바탕으로\n여러 이해관계자와 프로젝트를 운영합니다.",
  },
];

/* ------------------------------------------------------------
   6. Lab 페이지 (프레임워크 · 개인 프로젝트)
   - type: "framework" | "project" (배지 색 구분용)
   - link: 없으면 생략 가능 (버튼이 표시되지 않음)
   ------------------------------------------------------------ */
const LAB_ITEMS = [
  {
    type: "framework",
    title: "마케팅 퍼널 운영 프레임워크: B2C부터 B2B SaaS까지",
    desc: "B2C 커머스·앱, B2B 전통·SaaS 네 개 도메인의 퍼널 운영 방식을 하나의 구조로 정리한 문서입니다. 업무 방식 참고용으로 공개합니다.",
    link: SITE.NOTION_URL,
    linkLabel: "Notion에서 보기",
  },
  {
    type: "project",
    title: "개인 프로젝트",
    desc: "진행 중인 개인 프로젝트를 순차적으로 공개할 예정입니다.",
  },
];

/* ------------------------------------------------------------
   7. 포트폴리오 게이트 페이지 문구
   ------------------------------------------------------------ */
const GATE = {
  headline: "포트폴리오 파일은\n신청 후 열람 권한을 부여하고 있습니다.",
  steps: [
    { title: "열람 신청", desc: "아래 버튼으로 신청 폼을 작성해 주세요. 소속과 연락처를 남겨 주시면 됩니다." },
    { title: "확인", desc: "신청 내용을 확인합니다. 영업일 기준 1일 이내에 처리됩니다." },
    { title: "열람 권한 공유", desc: "작성하신 이메일로 Google Docs 열람 권한을 공유해 드립니다." },
  ],
};

/* ------------------------------------------------------------
   8. 포트폴리오 열람 신청 폼 (portfolio.html 내 모달)
   - purposes: 열람 목적 선택지. value는 Apps Script로 전송되는 값
   - privacy: 개인정보 수집·이용 동의 문구. 실제 수집 필드와 항목이 일치해야 합니다.
   - copyrightNotice: 제출 버튼 위에 고지문으로만 노출 (별도 동의 체크박스 없음)
   ------------------------------------------------------------ */
const LEAD_FORM = {
  title: "포트폴리오 열람 신청",
  desc: "아래 정보를 남겨 주시면 확인 후 이메일로 열람 권한을 공유해 드립니다.",
  purposes: [
    { value: "hiring_review", label: "채용 검토" },
    { value: "interview_prep", label: "면접 또는 미팅 전 검토" },
    { value: "collab_proposal", label: "프로젝트·외주 협업 제안" },
    { value: "partnership", label: "비즈니스·파트너십 제안" },
    { value: "headhunting", label: "헤드헌팅 또는 인재 추천" },
    { value: "reference", label: "마케팅 사례 및 업무 방식 참고" },
    { value: "other", label: "기타" },
  ],
  privacy: {
    items: "이메일 주소, 이름, 회사명 또는 소속, 열람 목적, 전달하실 내용(작성 시)",
    purpose: "포트폴리오 열람 신청 확인, 권한 제공 및 관련 연락",
    retention: "열람 권한 제공일로부터 3개월 또는 신청자의 삭제 요청 시까지",
    consentLabel: "포트폴리오 열람 권한 제공을 위한 개인정보 수집 및 이용에 동의합니다.",
  },
  copyrightNotice:
    "본 포트폴리오의 편집·구성 및 직접 작성한 콘텐츠의 저작권은 고홍석에게 있습니다. 열람 자료는 채용 검토 및 협업 논의를 위한 참고 목적으로만 제공되며, 사전 동의 없는 복제, 배포, 외부 공유, 캡처 게시 및 2차 이용을 금합니다.",
  successTitle: "신청이 접수되었습니다.",
  successDesc: "영업일 기준 1일 이내에 확인 후, 작성하신 이메일로 열람 권한을 공유해 드립니다.",
  errorDesc: "신청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도하시거나, 아래 이메일로 직접 문의해 주세요.",
  notReadyDesc: "신청 폼 준비 중입니다. data.js의 LEAD_API_URL에 Apps Script 웹앱 주소를 입력해 주세요.",
};
