/**
 * Design tokens — 기존 하드코딩 값을 의미 단위로 추출.
 * 값은 컴포넌트 원본과 100% 동일. 시각 변화 없음.
 *
 * 토큰화 기준: 코드베이스 전체에서 3회 이상 등장한 값.
 * 1~2회 사용된 값은 각 컴포넌트 로컬 주석 처리 유지.
 */

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------
//
// 컨벤션:
//   - `black` — 배경, 보더, 버튼 배경, 그림자 등 "면" 용도
//   - `textPrimary` (= black 값) — 텍스트 색상 용도
//   동일 값이지만 역할로 구분. 이후 다크모드 도입 시 분기 쉬워짐.
//
// 회색 계열 사용처 가이드:
//   - text*는 텍스트 전용. surface*는 배경 전용. border*는 보더 전용.
//   - #555 textMuted vs #777 textSubtle: 칩/옵션 내부 본문은 muted,
//     설명·보조 텍스트(부제, source URL)는 subtle.
//   - 장기 TODO: text 9단계 grayscale은 과함.
//     사용 데이터 쌓이면 3~4단계로 축약 검토.
// ---------------------------------------------------------------------------

export const colors = {
  // 베이스
  /** 앱 배경, 카드 배경, 오버레이 배경 (41회) */
  black: "#111111",
  /** 텍스트 역전(버튼 라벨, 활성 칩), 배경 화이트 (23회) */
  white: "#FFFFFF",

  // 텍스트 계열 (어두운 → 밝은 순)
  /** 본문 제목, 강조 텍스트, 입력값 — black과 동일값, 텍스트 용도 */
  textPrimary: "#111111",
  /** 카드 메뉴 아이템 텍스트, 날짜 기본 텍스트, 달력 화살표 (5회) */
  textSecondary: "#222222",
  /** meta 텍스트, 카드 secondary action 텍스트 (2회) */
  textTertiary: "#333333",
  /** time chip 텍스트, footer cancel 텍스트 (2회) */
  textQuaternary: "#444444",
  /** 칩/옵션 내부 본문 텍스트 (5회) */
  textMuted: "#555555",
  /** 섹션 레이블 — 1회 사용, 의미 참고용 */
  textSection: "#666666",
  /** 카테고리 버튼 비활성, empty description, preview meta, 보조 텍스트 (6회) */
  textSubtle: "#777777",
  /** 로고 서브, reminder copy 배경 설명 (3회) */
  textFaint: "#888888",
  /** nav 비활성, source URL, header subtitle (3회) */
  textDisabled: "#999999",

  // 배경 서피스
  /** 칩 비활성 배경, preview card 배경 (4회) */
  surface: "#F5F5F5",
  /** reminder box 배경 — 1회 사용 */
  surfaceAlt: "#F7F7F7",
  /** secondary action, footer cancel 배경 (2회) */
  surfaceMuted: "#F2F2F2",

  // 보더
  /** bottom nav 구분선, 카드 테두리, empty state, backup (5회) */
  border: "#E7E7E7",
  /** category button, close button, input underline (4회) */
  borderStrong: "#E2E2E2",
  /** time chip border, card menu border (2회) */
  borderSubtle: "#E5E5E5",
  /** reminder icon button border, backup secondary button (2회) */
  borderMuted: "#DCDCDC",

  // 구분선 / 분리자
  /** 헤더 하단, submit bar 상단, section divider, divider bg (6회) */
  divider: "#F0F0F0",

  // 별 / 도트 장식
  /** card star, empty star (2회) */
  starMuted: "#D8D8D8",
  /** logo star — 1회 사용 */
  starSubtle: "#CFCFCF",
  /** preview star — 1회 사용 */
  starFaint: "#D3D3D3",
  /** carousel dot 기본 (1회) */
  dot: "#D9D9D9",
  /** card menu 점 3개 (1회) */
  menuDot: "#AAAAAA",

  // 플레이스홀더
  /** TextInput placeholder (2회) */
  placeholder: "#B5B5B5",

  // 액센트 (캘린더 요일)
  /** 일요일 텍스트, 위험 액션 (3회) */
  accentSun: "#D14D4D",
  /** 토요일 텍스트 (2회) */
  accentSat: "#3D6FB6",

  // 그림자
  /** FAB shadow color (1회) */
  shadowDark: "#000000",
} as const;

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------
//
// 컨벤션: sm < md < lg 순서 = 작을수록 작은 값.
// 1회 사용 값은 의미 네이밍(button, circle, fab, pill)으로 분리.
// ---------------------------------------------------------------------------

export const radius = {
  /** 가장 많이 쓰이는 기본 radius — 카드, 칩, 아이콘 등 (26회) */
  sm: 12,
  /** reminder box, category dropdown, submit button, footer button (6회) */
  md: 14,
  /** preview pager, notification preview (3회) */
  lg: 16,
  /** close icon, pill 형태 (1회) */
  pill: 999,
  /** 42×42 원형 버튼 (2회) */
  circle: 21,
  /** backup 버튼 — 의미 분리된 작은 radius (3회) */
  button: 10,
  /** FAB 29 radius (1회) */
  fab: 29,
} as const;

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------
//
// 컨벤션:
//   - 일반 spacing은 xs(4) < sm(6) < md(8) < lg(10) < xl(12) < xxl(14) < xxxl(18) 순.
//   - paddingHSm/Md 는 칩·옵션·태그처럼 좁은 가로 패딩 전용.
//   - pageH(22), section(24) 등은 의미 분리된 큰 단위.
// ---------------------------------------------------------------------------

export const spacing = {
  /** 4px — marginTop, gap 등 소단위 (6회) */
  xs: 4,
  /** 6px — marginTop, gap, marginLeft (3회) */
  sm: 6,
  /** 7px — chip gap (3회) */
  chipGap: 7,
  /** 8px — gap, padding, marginBottom 등 (6회) */
  md: 8,
  /** 10px — paddingVertical, marginBottom 등 (9회) */
  lg: 10,
  /** 11px — 좁은 가로 패딩 (칩, 옵션 등) (3회) */
  paddingHSm: 11,
  /** 12px — paddingVertical, paddingHorizontal, margin (6회) */
  xl: 12,
  /** 13px — 중간 가로 패딩 (좀 더 큰 칩) (2회) */
  paddingHMd: 13,
  /** 14px — padding, marginBottom, paddingBottom (11회) */
  xxl: 14,
  /** 15px — paddingVertical footer (3회) */
  footerV: 15,
  /** 18px — paddingTop header, card padding (7회) */
  xxxl: 18,
  /** 22px — 전체 수평 패딩 기준 (9회) */
  pageH: 22,
  /** 24px — paddingBottom modal/submit (3회) */
  section: 24,
  /** 11px — 버튼 paddingVertical (backup primary, obsidian, submit) (3회) */
  buttonV: 11,
} as const;

// ---------------------------------------------------------------------------
// Typography — 3회 이상 사용된 size+weight 조합
// ---------------------------------------------------------------------------

export const typography = {
  /** 앱 페이지 제목 (App.tsx pageTitle) */
  pageTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    letterSpacing: -0.6,
  },
  /** 로고, 카드 제목 (16/700) */
  heading: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  /** form 헤더 제목 (18/700) */
  formTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  /** 본문 — 라벨, nav active, 카드 primary button (13/700) */
  bodyBold: {
    fontSize: 13,
    fontWeight: "700" as const,
  },
  /** 본문 — 카테고리, chip, nav item (13/600) */
  bodySemibold: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  /** 소형 본문 — source, meta, tag (12/600) */
  captionSemibold: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  /** 소형 본문 — source, preview meta (12/400) */
  captionRegular: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
} as const;
