/* ============================================================
   marketing-funnel-data.js
   "마케팅 퍼널 운영 프레임워크: B2C부터 B2B SaaS까지" 원문(수정본_v2.md)을
   콘텐츠 페이지(marketing-funnel.html)와 체크 도구(marketing-funnel-check.html)가
   공유하는 데이터 구조로 옮긴 파일입니다.
   원문 내용을 바꿀 때는 이 파일만 수정하면 두 페이지에 함께 반영됩니다.
   ============================================================ */

/* ------------------------------------------------------------
   0. 문서 메타 · 들어가며 · 사용법
   ------------------------------------------------------------ */
const FUNNEL_INTRO = {
  title: "마케팅 퍼널 운영 프레임워크: B2C부터 B2B SaaS까지",
  byline: "By 고홍석 / 2026.05",
  lead:
    "마케터가 실제 운영 단계에서 의사결정에 활용할 수 있도록 퍼널별 진단 기준과 실행 활동을 정리했습니다. 일반적인 마케팅 이론을 설명하기보다, 여러 비즈니스 모델을 운영하며 반복적으로 마주친 패턴과 실패 분기를 정리한 실무 노트에 가깝습니다.",
  scope:
    "이 문서는 마케팅 관점에서 고객의 유입부터 전환·잔류·추천까지를 진단하는 범위를 다룹니다. 서비스 기획이나 제품 운영 전반을 포괄하지 않으며, 온보딩·활성화처럼 제품 안에서 일어나는 항목도 마케터가 직접 기능을 설계한다는 의미가 아닙니다. 해당 항목은 행동 데이터를 분석하고, 메시지와 캠페인을 운영하며, 발견한 문제와 VOC를 제품·서비스 기획팀에 전달해 개선에 협업하는 범위에서 기술했습니다.",
  scopeNote:
    "'제품·서비스 기획팀'은 협업 대상을 통칭하는 표현입니다. 커머스는 상품기획팀, 앱·SaaS는 프로덕트팀 등 조직에 따라 실제 명칭은 다를 수 있습니다.",
  principleNote:
    "아래 원칙과 수치는 절대적인 업계 표준이 아니라 제 실무 경험에서 도출한 점검 기준입니다. 사업 단계, 제품 특성, 예산과 조직의 역할에 따라 적용 순서와 기준은 달라질 수 있습니다.",
  usage: [
    "문제 상황을 보고 어떤 단계의 게이트가 막혔는지 진단한다.",
    "공통 진단 원칙으로 진단 방향을 점검한다(특히 “깨진 양동이 원칙”과 “실패 분기 우선순위”).",
    "해당 영역의 매트릭스에서 후보 활동을 선택한다.",
    "KPI로 측정하고, 실패 시 분기 컬럼대로 점검 순서를 적용한다.",
  ],
  closing: {
    body:
      "문제 진단 → 공통 원칙으로 방향 점검 → 영역별 매트릭스에서 실행 후보 선택 → 마케팅 KPI로 측정 → 실패 시 분기 순서대로 점검합니다.",
    body2:
      "제품 안에서 발생한 문제가 의심될 경우에는 마케터가 기능 해법을 단정하기보다, 행동 데이터와 VOC를 근거로 문제를 정의해 제품·서비스 기획팀에 전달합니다. 이후 개선 전후의 전환·활성화·잔류 변화를 함께 확인합니다. 실무 케이스를 추가하면서 계속 보강할 예정입니다.",
  },
};

/* ------------------------------------------------------------
   1. 공통 진단 - 영역을 가로지르는 운영 원칙 (13개)
   tag: 실무 경험 기반임을 나타내는 배지 문구 (없으면 표시 안 함)
   ------------------------------------------------------------ */
const FUNNEL_COMMON_PRINCIPLES = [
  {
    group: "A. 진단의 순서",
    items: [
      {
        num: 1,
        title: "깨진 양동이 원칙",
        body: "인지·유입 활동을 늘리기 전에 전환 게이트가 막혀 있는지부터 점검한다. 광고비 낭비의 1순위 원인.",
      },
      {
        num: 2,
        title: "마케팅 실행의 실패 분기: 메시지 → 타겟 → 매체 순으로 우선 점검",
        body:
          "마케팅 실행에서 조정 비용이 비교적 낮은 메시지부터 타겟·매체 순으로 점검한다. 전환 이후 활성화와 잔류가 함께 낮다면 마케팅 변수만으로 판단하지 않고, 제품 가치와 사용 경험의 문제 가능성을 제품·서비스 기획팀과 함께 검토한다.",
      },
      {
        num: 3,
        title: "KPI는 활동 단위가 아니라 단계 게이트 단위로",
        body:
          "CTR이 좋아도 다음 단계로의 전환이 막히면 그 활동은 실패다. 활동 자체 지표보다 단계 이동률을 본다.",
      },
    ],
  },
  {
    group: "B. 채널과 매체",
    items: [
      {
        num: 4,
        title: "채널 매출 의존도 점검",
        tag: "B2C 커머스 운영 경험 기반",
        body:
          "특정 매체의 매출 의존도가 지나치게 높아지면 채널 분산 필요성을 점검한다. 실무적으로는 단일 매체 의존도가 약 70%를 넘는 시점을 위험 신호로 활용했지만, 이는 절대 기준이 아니다. 단일 의존은 경쟁 심화나 매체 로직 변경 시 매출 변동성을 키울 수 있다.",
        note:
          "초기 제품 검증 단계이거나 예산이 낮은 경우에는 무리한 분산보다 고효율 매체 안에서 유효한 타겟 세그먼트를 찾는 데 집중",
      },
      {
        num: 5,
        title: "인플루언서 평가는 팔로워 수가 아니라 댓글 톤",
        body:
          "댓글창에서 광고 거부감이 강하게 나타나면 전환 효율이 낮아질 가능성이 크다. 매칭 적합도는 정량보다 정성으로 본다.",
      },
      {
        num: 6,
        title: "자사몰 vs 외부 플랫폼은 ROAS만이 아니라 데이터 소유권으로",
        body:
          "CRM 자산이 장기 ROAS에 들어간다. 단기 효율만 비교하면 자사몰의 가치를 과소평가하게 된다.",
      },
    ],
  },
  {
    group: "C. 메시지와 타겟",
    items: [
      {
        num: 7,
        title: "다기능 제품의 인지 함정 (Hero Feature 원칙)",
        tag: "B2C 앱 런칭 케이스 기반",
        body:
          "고객은 꼼꼼하게 제품을 살피지 않는 경우가 많다. 하나의 소재에 한 가지 핵심 기능에 집중해서 메시지를 만든다.",
      },
      {
        num: 8,
        title: "광고 캠페인 목적과 소재 메시지를 정렬한다",
        body:
          "인지 캠페인에 가격·할인 메시지를 넣거나, 전환 캠페인에 추상적 가치 메시지를 넣으면 두 캠페인 모두 비효율이다. 캠페인 목적(인지·트래픽·전환)이 정해지면 소재 메시지 톤도 그에 맞춘다.",
      },
      {
        num: 9,
        title: "타겟 분리 운영",
        body: "타겟에 따라 메시지가 다르다",
        list: ["B2B: 의사결정권자 vs 실무 사용자", "B2C: 제품별 소구점"],
      },
    ],
  },
  {
    group: "D. 가격과 리워드",
    items: [
      {
        num: 10,
        title: "가격 테스트 시 기존 고객 노출을 분리한다",
        body: "기존 고객 노출 시 신뢰 손상이 ROAS 개선분을 상쇄할 수 있다.",
      },
      {
        num: 11,
        title: "리워드·할인의 회수 불가능성",
        body: "도입은 쉽고 회수는 어렵다. 도입 전 retention 효과를 분리 측정해야 한다.",
      },
    ],
  },
  {
    group: "E. 자산과 루프",
    items: [
      {
        num: 12,
        title: "CRM은 retention 단계가 아니라 첫날부터",
        body:
          "초기 사용자의 행동 데이터가 가장 가치 있는 1차 자산이다. 늦게 시작하면 데이터 손실이 누적된다.",
      },
      {
        num: 13,
        title: "마케팅 ↔ 제품 피드백 루프",
        tag: "B2B SaaS 인하우스 운영 경험",
        body:
          "캠페인·CRM·상담 과정에서 발견한 VOC와 행동 신호를 구조화해 제품·서비스 기획팀에 전달하는 것도 마케터의 역할이다. 마케팅은 고객 반응을 가장 먼저 발견하는 접점 중 하나이며, 제품 개선을 위한 입력값을 제공한다.",
      },
    ],
  },
];

/* ------------------------------------------------------------
   2~5. 비즈니스 모델별 퍼널 - stage.id는 4개 모델 공통(awareness/
   consideration/conversion/retention/advocacy), stage.name·situation은
   모델별 실제 문구를 그대로 사용합니다.
   checkQuestion은 체크 도구용으로 상황(situation)을 근거로 새로 작성한
   단계 단위 진단 질문입니다 (원문에는 없음).
   ------------------------------------------------------------ */
const FUNNEL_MODELS = [
  {
    id: "b2c-commerce",
    name: "B2C 커머스",
    accent: "#b5562a",
    accentSoft: "#fbeee6",
    badge: "B2C 커머스 운영 경험 기반",
    definition:
      "실물 상품의 단발 또는 세트 구매가 핵심인 비즈니스 모델 (D2C 브랜드, 화장품, 패션, 식품 등). 사이클이 짧고 재구매 주기 관리가 retention의 핵심.",
    channels: [
      "오픈마켓: 네이버 스마트스토어, 쿠팡",
      "카테고리 플랫폼: 무신사, 29CM, 올리브영, 컬리",
      "결제: 카카오페이, 네이버페이, 토스페이먼츠",
      "광고: 메타·구글·카카오 비즈보드 / 라이브커머스: 그립, 네이버 쇼핑라이브",
    ],
    coreKpi: "ROAS, 재구매율",
    stages: [
      {
        id: "awareness",
        name: "인지",
        situation: "브랜드·제품에 대한 인지가 부족해 검색 자체가 발생하지 않음",
        checkQuestion:
          "브랜드·제품 인지 활동(ATL·인플루언서·온라인 Paid 광고 등)의 효과를 검색량 변화 같은 지표로 확인하며 운영하고 있습니까?",
        activities: [
          { activity: "ATL 광고", purpose: "넓은 타겟 인지 / TVCF, 지하철·옥외", kpi: "집행 후 검색량 증가, VoC", failurePath: ["메시지", "타겟", "매체"] },
          { activity: "인플루언서·라이브커머스", purpose: "신뢰 기반 인지 / 그립, 네이버 쇼핑라이브", kpi: "라이브 동시 시청자, 클릭률", failurePath: ["인플루언서 댓글 톤", "메시지 점검"] },
          { activity: "온라인 Paid 광고", purpose: "정교한 타겟 인지 / 유튜브 프리롤, 메타·인스타그램", kpi: "도달, 영상 시청률, 검색량 변화", failurePath: ["카테고리 키워드", "타겟·제품 fit"] },
          { activity: "어필리에이트", purpose: "후기 기반 유입 / 블로그 제휴, 네이버 카페", kpi: "제휴 통한 유입, 전환율, 기간 내 유입 증가 확인", failurePath: ["매체 신뢰도", "보상 구조"] },
        ],
      },
      {
        id: "consideration",
        name: "고려",
        situation: "검색·유입은 발생하지만 전환이 일어나지 않음",
        checkQuestion: "상세 페이지·리뷰 등 전환 요소를 정기적으로 점검·개선하고 있습니까?",
        activities: [
          { activity: "검색 광고(SA)", purpose: "구매 의향 타겟 포획 / 네이버·구글 SA", kpi: "검색 통한 유입, 전환율", failurePath: ["키워드 점검", "랜딩 적합도"] },
          { activity: "비교 콘텐츠", purpose: "신뢰 형성 / 블로그 후기, 유튜브 리뷰", kpi: "유입 후 체류 시간, 전환율", failurePath: ["콘텐츠 톤·신뢰도 점검"] },
          { activity: "상세 페이지 A/B", purpose: "전환율 개선 / GA4·Clarity 기반 테스트", kpi: "전환율의 유의미한 차이", failurePath: ["결제 흐름", "가격 점검"] },
          { activity: "리뷰 자산화", purpose: "구매 트리거 / 리뷰 이벤트, 영상 후기 수집", kpi: "리뷰 등록률, 리뷰 탭 체류 시간", failurePath: ["단순 리뷰만 모이는지", "인센티브 재설계"] },
        ],
      },
      {
        id: "conversion",
        name: "구매",
        situation: "첫 구매 또는 추가 구매를 늘리고 싶다",
        checkQuestion: "첫 구매 혜택·CRM 트리거 등 전환 촉진 활동을 운영하고, 전환율로 효과를 확인하고 있습니까?",
        activities: [
          { activity: "첫 구매 혜택", purpose: "신규 전환 + CRM DB 확보 / 가입 쿠폰, 무료배송", kpi: "첫 구매자 수, 가입 전환율", failurePath: ["타 플랫폼 가격 비교", "결제 편의성"] },
          { activity: "묶음·세트·구독", purpose: "객단가 인상, 락인 / 2+1, 정기 구독", kpi: "세트 판매율, 객단가", failurePath: ["묶음 적합도(소비 시기 차이)"] },
          { activity: "신규 한정 가격 A/B", purpose: "가격 최적점 탐색 / 신규 고객 세그먼트 대상 A/B 테스트", kpi: "가격별 전환율, BEP", failurePath: ["정상가 조정", "광고 비중"] },
          { activity: "CRM 트리거(푸시·메일)", purpose: "광고비 절감 / 카카오 알림톡, 이메일 자동화", kpi: "푸시 통한 전환율, 재방문률", failurePath: ["메시지 톤·시점", "발송 빈도"] },
          { activity: "챗봇·VOC 응대", purpose: "결제 직전 이탈 방지 / 채널톡, 카카오 상담", kpi: "응대 후 전환율", failurePath: ["응대 SOP", "응대 시간"] },
        ],
      },
      {
        id: "retention",
        name: "잔류·재구매",
        situation: "1회 구매 후 재방문이 없거나 재구매 주기가 늦음",
        checkQuestion: "등급제·정기구독 등 재구매 장치를 운영하고 재구매율로 효과를 확인하고 있습니까?",
        activities: [
          { activity: "등급제·리워드", purpose: "로열티 강화 / 멤버십 등급, 적립금", kpi: "재구매율, 등급 분포", failurePath: ["타 플랫폼 리워드 대비", "등급 진입 난이도"] },
          { activity: "매거진·뉴스레터", purpose: "체류 시간, SEO 유입 / 자사 매거진, 큐레이션 메일", kpi: "체류 시간, 매거진 통한 재방문", failurePath: ["콘텐츠와 고객 fit", "발행 주기"] },
          { activity: "패키지 경험·QC 이슈 전달", purpose: "정성적 로열티 강화 + 품질 신호 수집 / 박스·엽서 기획, A/S·리뷰 기반 QC 이슈 구조화", kpi: "리뷰 정성 평가, NPS, 품질 관련 VOC 빈도", failurePath: ["이슈 반복 시 → 상품기획팀 전달"] },
          { activity: "정기구독·자동 재주문", purpose: "재구매 자동화 / 정기배송", kpi: "정기구독 비율, 1회차 이탈률", failurePath: ["1회차 이탈 분석", "가격·주기"] },
        ],
      },
      {
        id: "advocacy",
        name: "지지",
        situation: "우리 제품을 사랑하는 고객이 늘어났으면 좋겠다",
        checkQuestion: "추천·UGC·앰배서더 등 자발적 확산을 유도하는 활동을 운영하고 있습니까?",
        activities: [
          { activity: "추천 코드·리워드", purpose: "viral loop / 친구 초대 적립금", kpi: "추천 통한 가입 비율", failurePath: ["추천 동기", "인센티브 재설계"] },
          { activity: "UGC 캠페인", purpose: "자발적 확산 / 해시태그 챌린지, 사용자 영상", kpi: "참여 수, 공유 수", failurePath: ["인센티브 의존도", "자발성 검증"] },
          { activity: "앰배서더·코어 팬 운영", purpose: "깊은 충성도 / VIP 그룹, 베타 테스터", kpi: "코어 팬 수, 이탈 방지율", failurePath: ["응대 리소스", "코어 팬 정의"] },
        ],
      },
    ],
  },
  {
    id: "b2c-app",
    name: "B2C 앱",
    accent: "#3b6ea5",
    accentSoft: "#eaf1f8",
    badge: "B2C 앱 런칭 케이스 기반",
    definition:
      "무료 또는 부분 유료의 모바일 앱 (커뮤니티, 라이프스타일, 게임, 미디어 등). 핵심 KPI는 설치(가입) / Retention curve(D7/D30).",
    specialNote:
      "“구매” 이전에 활성화(Activation) 단계가 별도로 존재. 첫 핵심 행동(가입, 첫 콘텐츠 소비, 첫 게시, 알림 권한 동의 등) 도달이 retention의 가장 큰 결정 요인.",
    channels: [
      "인스톨 광고: UAC, ASA, 카카오 비즈보드, MOLOCO",
      "어트리뷰션: 앱스플라이어, 에어브릿지",
      "친구 초대: 카카오톡 공유",
    ],
    coreKpi: "설치(가입) / Retention curve(D7·D30)",
    stages: [
      {
        id: "awareness",
        name: "인지",
        situation: "카테고리 자체를 모르거나, 비슷한 앱들 사이에서 본 앱이 들리지 않음",
        checkQuestion: "ASO·인스톨 광고 등 인지 활동을 CPI·인스톨률 같은 지표로 확인하며 운영하고 있습니까?",
        activities: [
          { activity: "ASO", purpose: "검색 시 노출 / 앱스토어·구글 플레이 키워드, 스크린샷 최적화", kpi: "검색 노출, 검색 키워드 순위", failurePath: ["키워드 점검", "스크린샷 카피·이미지"] },
          { activity: "UAC·MOLOCO·메타 인스톨 광고", purpose: "신규 다운로드 / 영상 광고, 정적 배너", kpi: "CPI, 인스톨률", failurePath: ["소재 메시지", "매체 mix"] },
          { activity: "인플루언서·릴스 광고", purpose: "자연스러운 노출 / 10·20대 릴스, 숏폼", kpi: "도달, 인스톨 전환율", failurePath: ["매칭(댓글 톤)", "소재 형식"] },
          { activity: "카카오 비즈보드", purpose: "한국 시장 도달 확장 / 카카오톡 채팅 리스트 노출", kpi: "클릭률, 인스톨률", failurePath: ["소재·랜딩 fit"] },
        ],
      },
      {
        id: "consideration",
        name: "고려·전환(첫 가입)",
        situation: "다운로드는 되는데 가입 또는 첫 행동이 일어나지 않음",
        checkQuestion: "온보딩 이탈 지점을 분석해 제품팀과 개선 협업을 하고 있습니까?",
        activities: [
          { activity: "온보딩 이탈 분석·개선 협업", purpose: "가입 마찰 발견 / 단계별 이탈 분석, 소셜 로그인·단계 축소 제안", kpi: "다운로드→가입 전환율", failurePath: ["이탈 지점 분석", "제품·서비스 기획팀과 개선 협업"] },
          { activity: "랜딩·소재 큐레이션(Hero Feature)", purpose: "소재 진입 시 핵심 가치 노출 / 단일 기능 소구 소재로 전환", kpi: "첫 세션 길이, 핵심 행동 도달률", failurePath: ["다기능 소구 분산 여부 점검", "소재 내 Hero Feature 단일화"] },
          { activity: "딥링크·디퍼드 딥링크", purpose: "광고 → 기능 직결 / 광고 클릭 → 특정 화면", kpi: "광고 유입의 가입률", failurePath: ["매체별 딥링크 작동 점검"] },
        ],
      },
      {
        id: "conversion",
        name: "활성화",
        situation: "가입은 했지만 핵심 행동 도달 전 이탈",
        checkQuestion: "첫 행동 보상·인앱 메시지 등으로 핵심 행동 도달을 유도하고 도달률로 확인하고 있습니까?",
        activities: [
          { activity: "푸시 동의 메시지·시점 최적화", purpose: "retention 채널 확보 / 가치 노출 후 동의 요청", kpi: "푸시 동의율", failurePath: ["요청 시점", "사전 가치 전달", "노출 방식 개선 협업"] },
          { activity: "첫 행동 보상", purpose: "핵심 행동 강화 / 첫 게시·첫 친구 추가 시 리워드", kpi: "첫 행동 도달률", failurePath: ["첫 행동 정의", "보상 적정성"] },
          { activity: "출석체크·데일리 보상", purpose: "재방문 습관화 / 7일 연속 출석", kpi: "D7 retention", failurePath: ["보상 위계", "습관화 트리거"] },
          { activity: "인앱 메시지 운영", purpose: "미사용 기능 안내 / 인앱 가이드·배너·알림", kpi: "기능 도달률, 메시지 클릭률", failurePath: ["메시지 톤", "노출 타이밍", "기능 진입 경로 개선 협업"] },
        ],
      },
      {
        id: "retention",
        name: "잔류·재방문",
        situation: "활성 사용자의 재방문 간격이 늘어나거나 dormant 상태",
        checkQuestion: "재방문 트리거(푸시 시나리오·리타게팅 등)를 운영하고 재방문률로 확인하고 있습니까?",
        activities: [
          { activity: "푸시 시나리오 운영", purpose: "재방문 트리거 / 행동 기반 시나리오", kpi: "푸시 통한 재방문률", failurePath: ["발송 빈도·톤", "세그먼트 재정의"] },
          { activity: "리타게팅 광고", purpose: "dormant 회수 / MOLOCO, 구글 UAC 리타게팅", kpi: "회수율, 회수 후 retention", failurePath: ["회수 후 이탈 시점 분석"] },
          { activity: "콘텐츠·기능 업데이트 알림", purpose: "가치 재인식 / 신기능 노티, 콘텐츠 큐레이션", kpi: "업데이트 후 7일 retention", failurePath: ["업데이트 가치 점검"] },
        ],
      },
      {
        id: "advocacy",
        name: "지지",
        situation: "사용자가 자발적으로 앱을 알리거나 친구를 데려오게 하고 싶음",
        checkQuestion: "친구 초대·UGC 등 자발적 확산 장치를 운영하고 있습니까?",
        activities: [
          { activity: "친구 초대 트리거", purpose: "viral loop / 카카오톡 공유, 초대 코드", kpi: "초대 발신율, 초대 통한 가입률", failurePath: ["인센티브 위계", "공유 마찰"] },
          { activity: "UGC·소셜 공유 활성화", purpose: "자연 확산 / 결과 공유 카드의 메시지·디자인, 공유 캠페인", kpi: "공유율, 공유 통한 유입", failurePath: ["공유 동기", "메시지·카드 개선", "기능 개선 협업"] },
          { activity: "코어 사용자 운영", purpose: "깊은 retention / 베타 그룹, 사용자 컨퍼런스", kpi: "코어 사용자 수, NPS", failurePath: ["운영 리소스", "코어 정의"] },
        ],
      },
    ],
  },
  {
    id: "b2b-traditional",
    name: "B2B 전통",
    accent: "#5b4b8a",
    accentSoft: "#f1edf7",
    badge: "글로벌 IT 기업 마케팅 대행 경험",
    definition:
      "라이센스·패키지 영업 중심, 영업팀이 closing하는 구조 (엔터프라이즈 SW, 산업재, 컨설팅 등). 자율 가입·trial이 제한적이며, 사이클이 수개월~1년 이상.",
    specialNote:
      "마케팅의 핵심은 lead 획득 + nurturing이고, closing은 영업이 담당. 성과는 인계 후 응답 속도와 MQL→SQL 전환 관리에 크게 영향을 받는다.",
    channels: [
      "업계 미디어: 더브이씨, 플래텀, 아웃스탠딩",
      "업계지: CAD&Graphics, 머니투데이 산업면 (산업별 상이)",
      "협회·세미나 후원",
      "비즈니스 매체: LinkedIn, 리멤버, 블라인드",
    ],
    coreKpi: "MQL→SQL 전환율, 재계약률",
    stages: [
      {
        id: "awareness",
        name: "인지",
        situation: "카테고리 또는 회사를 의사결정권자가 모름",
        checkQuestion: "업계지·컨퍼런스·ABM 등으로 의사결정권자 인지를 넓히고 후속 미팅 요청으로 확인하고 있습니까?",
        activities: [
          { activity: "업계지 광고·기고", purpose: "권위 인지 / 산업별 전문지", kpi: "노출, 후속 검색량", failurePath: ["매체 영향력", "기고 톤"] },
          { activity: "컨퍼런스·박람회 부스", purpose: "의사결정권자 직접 노출 / 산업별 박람회, 자체 세미나", kpi: "명함 수, 후속 미팅 전환", failurePath: ["부스 위치", "데모 형식"] },
          { activity: "협회·세미나 후원", purpose: "신뢰 기반 인지 / 산업 협회 후원", kpi: "후원 통한 미팅 요청 수", failurePath: ["후원 격", "콘텐츠 동반"] },
          { activity: "비즈니스 매체 ABM", purpose: "특정 기업 직접 도달 / 업종·직급·기업 타겟팅", kpi: "노출 → 미팅 요청 전환율", failurePath: ["메시지 사례 적합성(국내 vs 해외)"] },
        ],
      },
      {
        id: "consideration",
        name: "고려",
        situation: "인지는 있지만 영업 미팅으로 연결이 안 됨",
        checkQuestion: "백서·웨비나 등 검토 자료를 운영하고 다운로드·미팅 요청으로 효과를 확인하고 있습니까?",
        activities: [
          { activity: "백서·케이스 스터디", purpose: "도입 검토 자료 / 산업별 도입 사례, ROI 분석", kpi: "다운로드 수, 다운로드 후 미팅 요청", failurePath: ["자료 깊이", "산업 적합성"] },
          { activity: "웨비나·온라인 세미나", purpose: "의사결정권자 직접 교육 / 업계 트렌드 + 자사 사례", kpi: "등록률, 시청 완료율, 후속 미팅", failurePath: ["발표자 권위", "주제 선정"] },
          { activity: "eBook·튜토리얼 lead magnet", purpose: "실무자 lead 확보 / 페이스북 잠재고객용 광고", kpi: "다운로드당 비용, 리드 품질", failurePath: ["타겟 분리", "자료 깊이"] },
          { activity: "행동 기반 리타게팅", purpose: "관심 표명 lead 회수 / 영상 시청자, 백서 다운로더", kpi: "리타게팅 통한 미팅 요청", failurePath: ["픽셀·이벤트 셋업 점검", "유효 타겟 모수(Audience Size) 확인"] },
        ],
      },
      {
        id: "conversion",
        name: "구매(영업 closing)",
        situation: "lead는 충분한데 영업 closing이 늦음",
        checkQuestion: "MQL→SQL 인계 SLA·어카운트 매핑 등으로 영업 인계 속도를 관리하고 있습니까?",
        activities: [
          { activity: "MQL→SQL handoff SLA", purpose: "영업 인계 속도 / 점수 기준, 인계 폼", kpi: "MQL→SQL 전환율, 24시간 응답률", failurePath: ["점수 기준", "영업팀 인입 한계"] },
          { activity: "어카운트 매핑", purpose: "ABM 정밀화 / 의사결정자·관여자 매핑", kpi: "타겟 기업당 도달 인원 수", failurePath: ["매핑 정확도", "연락 채널"] },
          { activity: "결정권자·실무자 분리 메시지", purpose: "타겟별 설득 / 결정권자: ROI / 실무자: 사용성", kpi: "결정권자 미팅 전환율", failurePath: ["페르소나 점검"] },
          { activity: "IMC 캠페인(제품 출시)", purpose: "시장 인식 변경 / 티저+이벤트+라이브+잡지+SNS 통합", kpi: "캠페인 기간 미팅 요청 수", failurePath: ["IMC 채널 통합도"] },
        ],
      },
      {
        id: "retention",
        name: "잔류·확장",
        situation: "기존 고객이 이탈하거나 추가 라이센스 도입이 정체",
        checkQuestion: "사용자 교육·컨퍼런스·업셀 자료로 재계약·확장을 관리하고 있습니까?",
        activities: [
          { activity: "사용자 교육 콘텐츠", purpose: "retention 기반 / 강좌 영상, YouTube 채널", kpi: "영상 시청 → 재계약률", failurePath: ["콘텐츠와 사용 단계 fit"] },
          { activity: "사용자 컨퍼런스", purpose: "락인 강화 / 자사 연례 컨퍼런스", kpi: "참여 기업 수, 참여 후 재계약률", failurePath: ["컨퍼런스 콘텐츠 깊이"] },
          { activity: "업셀·크로스셀 자료", purpose: "추가 라이센스 / 다른 제품군 비교 자료", kpi: "업셀 발생 비율", failurePath: ["영업팀과 sync", "우선순위"] },
        ],
      },
      {
        id: "advocacy",
        name: "지지",
        situation: "고객이 다른 기업에 추천하게 하고 싶음",
        checkQuestion: "고객 사례·커뮤니티·추천 인센티브로 추천을 유도하고 있습니까?",
        activities: [
          { activity: "사례 인터뷰·영상", purpose: "고객사 노출 + 추천 자산화 / 도입사 인터뷰", kpi: "인터뷰 통한 lead 수", failurePath: ["인터뷰 진실성", "연출 자제"] },
          { activity: "사용자 커뮤니티", purpose: "자발적 공유 / 프라이빗 슬랙·잔디 그룹", kpi: "활성 멤버 수, 추천 발생률", failurePath: ["운영 리소스", "커뮤니티 가치"] },
          { activity: "추천 인센티브", purpose: "viral loop / 도입사 추천 시 라이센스 할인", kpi: "추천 통한 신규 도입 수", failurePath: ["인센티브 가치 점검"] },
        ],
      },
    ],
  },
  {
    id: "b2b-saas",
    name: "B2B SaaS",
    accent: "#17918d",
    accentSoft: "#eafaf9",
    badge: "B2B SaaS 인하우스 운영 경험",
    definition:
      "자율 가입·trial이 가능한 SaaS 모델. self-serve와 sales-assisted가 혼합되는 경우가 많음 (관리회계, 협업툴, AI 솔루션 등). 핵심 KPI는 trial→paid 전환율 + 평균 유지 기간.",
    specialNote:
      "제품군이 복수일 때 Layer별 포지셔닝(Awareness → Growth → Foundation Layer)으로 lock-in 구조를 설계해 볼 수 있고, 이 구조 위에서 Cross-product upsell이 핵심 성장 동력으로 작동한다. (Awareness Layer = 시장 진입용 / Growth Layer = 핵심 유료 / Foundation Layer = 기반 데이터·인프라)",
    channels: [
      "인앱 채팅: 채널톡(국내 SaaS 사실상 표준)",
      "결제: 토스페이먼츠, 포트원",
      "뉴스레터: 스티비",
      "인앱 가이드: Pendo, Appcues 또는 자체 구현",
      "광고: 구글 SA, LinkedIn (B2B 타겟에 유효)",
    ],
    coreKpi: "trial→paid 전환율, 평균 유지 기간",
    stages: [
      {
        id: "awareness",
        name: "인지",
        situation: "카테고리 자체가 새롭거나, 잠재 사용자가 자사 제품을 모름",
        checkQuestion: "SEO 구조화·비교 콘텐츠 등으로 자율 검색 유입을 확보하고 있습니까?",
        activities: [
          { activity: "SEO 구조화", purpose: "자율 검색 포획 / 키워드 클러스터, 카테고리 페이지", kpi: "키워드 노출, 자연 검색 유입", failurePath: ["키워드 적합성", "구조 설계"] },
          { activity: "비교 콘텐츠·백서", purpose: "권위·신뢰 형성 / vs 경쟁 솔루션 비교 자료", kpi: "다운로드 수, 다운로드→trial 전환", failurePath: ["비교 축", "차별화 메시지"] },
          { activity: "검색 광고·SNS 광고", purpose: "빠른 인지 / 구글 SA, LinkedIn 광고", kpi: "CPL, 클릭 후 행동", failurePath: ["메시지·랜딩 fit"] },
          { activity: "뉴스레터·아티클", purpose: "점진적 인지 / 가치 제공 콘텐츠", kpi: "구독자 수, 오픈률", failurePath: ["발행 주기", "콘텐츠 톤"] },
        ],
      },
      {
        id: "consideration",
        name: "고려·전환(trial)",
        situation: "인지는 있지만 trial 또는 데모 신청이 일어나지 않음",
        checkQuestion: "trial·데모 전환 마찰(가입 흐름, 신청 폼)을 분석해 개선 협업을 하고 있습니까?",
        activities: [
          { activity: "Free trial·freemium 전환 분석·개선 협업", purpose: "자율 도입 마찰 완화 / trial 전환 데이터 분석, 기간·기능 제한 조정 제안", kpi: "trial 가입률, 가입 후 첫 행동 도달률", failurePath: ["trial 가치 노출 부족", "제품팀과 기능 제한 적정성 검토"] },
          { activity: "데모 신청 전환 최적화", purpose: "sales-assisted 입구 / 데모 신청 폼, 사전 자격 질문", kpi: "데모 신청 수, 신청→완료율", failurePath: ["폼 마찰", "자격 질문 단순화"] },
          { activity: "Pain-Point 기반 메시지 단계화", purpose: "단계별 설득 / 인지→이해→trial 도입 메시지 분리", kpi: "단계별 전환율", failurePath: ["단계 정의", "메시지 분리"] },
          { activity: "외부 데이터 연동 가치 전달", purpose: "자율 온보딩 활성화 / 연동 효용 메시지, 활용 사례 안내", kpi: "연동률, 연동 후 retention", failurePath: ["연동 가치 노출", "UX 마찰 분석", "제품팀 전달"] },
        ],
      },
      {
        id: "conversion",
        name: "활성화(첫 가치 도달)",
        situation: "trial 가입은 했지만 핵심 가치 경험 전 이탈",
        checkQuestion: "온보딩 메일 시퀀스·인앱 가이드 등으로 첫 가치 도달을 유도하고 있습니까?",
        activities: [
          { activity: "온보딩 자동 메일 시퀀스", purpose: "첫 가치 유도 / 가입 후 일별 안내 메일", kpi: "메일 오픈률, CTA 클릭률", failurePath: ["메일 시점", "콘텐츠 가치"] },
          { activity: "인앱 가이드 메시지 운영", purpose: "핵심 기능 사용 유도 / Pendo·Appcues, 자체 투어", kpi: "가이드 완료율, 핵심 기능 도달률", failurePath: ["가이드 길이", "시작 시점", "진입 경로 개선 협업"] },
          { activity: "CS·세일즈 핸드오프", purpose: "고가치 lead 인계 / 행동 기반 lead 점수", kpi: "핸드오프 후 trial→paid 전환율", failurePath: ["점수 기준", "CS 응답 속도"] },
          { activity: "VOC 구조화·제품팀 전달", purpose: "반복되는 요구·이탈 원인 정리 / 제품 개선의 입력값 제공 (마케팅이 product feedback loop의 입구로 작동)", kpi: "VOC 유형·빈도, 개선 반영 후 행동 변화", failurePath: ["VOC 신호 부족", "고객 인터뷰·CS 데이터 보완"] },
        ],
      },
      {
        id: "retention",
        name: "잔류·확장(paid 전환·업셀)",
        situation: "trial→paid 전환율이 낮거나 paid 후 이탈",
        checkQuestion: "churn 알림·업셀 트리거 등으로 전환·확장을 관리하고 있습니까?",
        activities: [
          { activity: "활성도 기반 churn 알림", purpose: "이탈 사전 차단 / 사용 빈도 하락 트리거", kpi: "알림 후 회수율", failurePath: ["알림 시점", "회수 채널"] },
          { activity: "업셀·크로스셀 트리거", purpose: "확장 매출 / 사용량 도달 시 상위 플랜 안내", kpi: "업셀 발생 비율", failurePath: ["업셀 시점", "트리거 정확도"] },
          { activity: "Cross-product upsell", purpose: "3-tier 활용 / Awareness 제품→Growth 제품 유도", kpi: "제품 간 전환율", failurePath: ["제품 간 가치 흐름 점검"] },
          { activity: "갱신 시점 알림", purpose: "자율 갱신 유도 / 30일 전 안내", kpi: "자율 갱신율", failurePath: ["가격 변동 안내", "CS 인계"] },
        ],
      },
      {
        id: "advocacy",
        name: "지지",
        situation: "고객사가 다른 기업에 추천하게 하고 싶음",
        checkQuestion: "커뮤니티·인티그레이션 공동 마케팅·추천 인센티브를 운영하고 있습니까?",
        activities: [
          { activity: "사용자 커뮤니티", purpose: "자발적 공유 / 슬랙·잔디·디스코드 그룹", kpi: "활성 멤버, 멤버 통한 lead, CS 문의 방어율, 제품 피드백 수집", failurePath: ["운영 리소스", "커뮤니티 가치"] },
          { activity: "인티그레이션 공동 마케팅", purpose: "연동 기능 인지·활성화 / 파트너 공동 콘텐츠, 활용 사례, 통합 페이지 유입", kpi: "통합 페이지 유입, 연동 사용 비율", failurePath: ["파트너 메시지 정렬", "사용 가치 노출", "연동 UX 개선 협업"] },
          { activity: "사용자 컨퍼런스", purpose: "깊은 retention / 자체 컨퍼런스", kpi: "참여사 수, 참여 후 retention", failurePath: ["참여 가치 점검"] },
          { activity: "추천 인센티브", purpose: "viral loop / 도입사 추천 시 크레딧", kpi: "추천 통한 신규 가입", failurePath: ["추천 회계 처리"] },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------
   6. 부록 - 영역 간 비교 요약
   ------------------------------------------------------------ */
const FUNNEL_APPENDIX = {
  rows: [
    { label: "핵심 KPI", values: ["ROAS, 재구매율", "retention curve(D7/D30)", "MQL→SQL 전환율, 재계약률", "trial→paid, 평균 유지 기간"] },
    { label: "활성화 단계", values: ["(구매와 통합)", "첫 핵심 행동 도달", "(영업 미팅으로 통합)", "첫 가치 도달"] },
    { label: "핵심 채널", values: ["네이버·쿠팡·SNS·라이브커머스", "UAC·MOLOCO·릴스·ASA", "업계지·컨퍼런스·비즈니스 매체(LinkedIn, 리멤버 등)", "SEO·뉴스레터·LinkedIn"] },
    { label: "사이클", values: ["즉시~수일", "즉시 다운로드, retention 1~3개월로 판가름", "수개월~1년", "14일 trial→paid, retention 6개월~"] },
    { label: "가격 정책", values: ["묶음·세트·구독", "무료+부분 유료·구독", "라이센스·계약", "구독 + 사용량"] },
    { label: "CRM 시점", values: ["첫 구매 직후", "가입 직후", "lead 인입 직후", "trial 가입 직후"] },
    { label: "핵심 전환에서의 역할", values: ["구매 전환", "가입·활성화 유도", "MQL 확보·영업 인계", "Trial·Paid 전환 또는 영업 인계"] },
  ],
};

/* ------------------------------------------------------------
   퍼널 다이어그램 (섹션 상단 요약 카드용) - 첨부 이미지의 정보를
   사이트 톤(민트/잉크 단색 카드)에 맞게 재구성한 요약 데이터입니다.
   ------------------------------------------------------------ */
const FUNNEL_DIAGRAM_STAGES = {
  "b2c-commerce": [
    { label: "인지", desc: "브랜드·제품 검색 유도", items: ["ATL 광고", "인플루언서·라이브커머스", "온라인 Paid 광고", "어필리에이트"] },
    { label: "고려", desc: "검색·비교·상세페이지", items: ["검색 광고(SA)", "비교 콘텐츠", "상세 페이지 A/B", "리뷰 자산화"] },
    { label: "구매", desc: "첫 구매·객단가·CRM 확보", items: ["첫 구매 혜택", "묶음·세트·구독", "CRM 트리거", "챗봇·VOC 응대"] },
    { label: "잔류·재구매", desc: "재구매·정기구독", items: ["등급제·리워드", "매거진·뉴스레터", "패키지·QC", "정기구독"] },
    { label: "지지", desc: "리뷰·추천·UGC", items: ["추천 코드·리워드", "UGC 캠페인", "앰배서더·코어 팬"] },
  ],
  "b2c-app": [
    { label: "인지", desc: "앱 노출·설치 유도", items: ["ASO", "UAC·MOLOCO·메타 광고", "인플루언서·릴스 광고", "카카오 비즈보드"] },
    { label: "고려·전환", desc: "다운로드 → 가입", items: ["온보딩 이탈 분석", "Hero Feature 큐레이션", "딥링크·디퍼드 딥링크"] },
    { label: "활성화", desc: "첫 핵심 행동 도달", items: ["푸시 권한 동의", "첫 행동 보상", "출석체크·데일리 보상", "인앱 메시지"] },
    { label: "잔류·재방문", desc: "재방문·dormant 회수", items: ["푸시 시나리오 운영", "리타게팅 광고", "콘텐츠·기능 업데이트 알림"] },
    { label: "지지", desc: "친구 초대·공유", items: ["친구 초대 트리거", "UGC·소셜 공유 기능", "코어 사용자 운영"] },
  ],
  "b2b-traditional": [
    { label: "인지", desc: "카테고리·회사 인지", items: ["업계지 광고·기고", "컨퍼런스·박람회", "협회·세미나 후원", "비즈니스 매체 ABM"] },
    { label: "고려", desc: "리드 확보·nurturing", items: ["백서·케이스 스터디", "웨비나·온라인 세미나", "eBook lead magnet", "행동 기반 리타게팅"] },
    { label: "구매", desc: "영업 미팅·SQL 전환", items: ["MQL→SQL handoff SLA", "어카운트 매핑", "결정권자·실무자 분리 메시지", "IMC 캠페인"] },
    { label: "잔류·확장", desc: "재계약·업셀", items: ["사용자 교육 콘텐츠", "사용자 컨퍼런스", "업셀·크로스셀 자료"] },
    { label: "지지", desc: "사례·추천", items: ["사례 인터뷰·영상", "사용자 커뮤니티", "추천 인센티브"] },
  ],
  "b2b-saas": [
    { label: "인지", desc: "카테고리 검색·콘텐츠 유입", items: ["SEO 구조화", "비교 콘텐츠·백서", "검색 광고·SNS 광고", "뉴스레터·아티클"] },
    { label: "고려·전환", desc: "Trial·데모 신청", items: ["Free trial·freemium 설계", "데모 신청 흐름", "Pain-Point 메시지 단계화", "외부 데이터 연동"] },
    { label: "활성화", desc: "첫 가치 도달", items: ["온보딩 자동 메일 시퀀스", "인앱 가이드", "CS·세일즈 핸드오프", "VOC 기반 제품 개선"] },
    { label: "잔류·확장", desc: "Paid 전환·업셀", items: ["활성도 기반 churn 알림", "업셀·크로스셀 트리거", "Cross-product upsell", "갱신 시점 알림"] },
    { label: "지지", desc: "커뮤니티·추천", items: ["사용자 커뮤니티", "인티그레이션 공동 마케팅", "사용자 컨퍼런스", "추천 인센티브"] },
  ],
};

/* ------------------------------------------------------------
   깨진 양동이 원칙 안내: 인지 단계를 우선 지목했는데 전환 단계가 아직
   확인되지 않았을 때 공통 진단 1번을 짧게 안내합니다. 실제 문장은
   marketing-funnel-check.js에서 선택한 모델의 전환 단계 이름을 넣어
   상황에 맞게 조립합니다(원칙 전문을 그대로 붙여넣지 않습니다).
   ------------------------------------------------------------ */
const FUNNEL_LEAKY_BUCKET_LABEL = "공통 진단 1. 깨진 양동이 원칙";

/* ------------------------------------------------------------
   현황 체크 도구 - 응답 5단계
   statusLabel: 결과 화면 상태 배지 문구 (단일 합산 점수 대신 사용)
   ------------------------------------------------------------ */
const FUNNEL_CHECK_RESPONSES = [
  { key: "good", label: "잘 운영 중", example: "지표로 확인하며 운영 중", statusLabel: "양호" },
  { key: "partial", label: "일부 운영 중", example: "하고는 있으나 측정·개선은 안 함", statusLabel: "점검 필요" },
  { key: "none", label: "미운영", example: "", statusLabel: "우선 개선" },
  { key: "unknown", label: "확인 필요", example: "운영 여부 자체를 모름 — 담당자 확인 필요", statusLabel: "확인 필요" },
  { key: "na", label: "해당 없음", example: "", statusLabel: "후순위" },
];
