# later-you-said — AI 에이전트 가이드

저장만 해놓고 안 보는 글/영상/링크를 다시 보게 만드는 React Native + Expo 앱.
이 문서는 Claude Code가 이 저장소에서 작업할 때 따라야 할 룰을 정리한다.

---

## 코드 컨벤션

### 표시 ↔ 로직 분리

- **컴포넌트(`components/`, `screens/`)** 는 props만 받고 렌더링만 담당한다. 내부에서 직접 `AsyncStorage`나 `supabase`를 호출하지 않는다.
- **상태와 부수 효과**는 훅(`hooks/`)으로 분리한다.
  - `useItems` — AsyncStorage 하이드레이션/저장
  - `useItemMutations` — 추가/수정/삭제/상태 변경 + `trackEvent` 호출
  - `useNewItemForm` — 폼 상태만 (items와 무관)
  - `useFilteredItems` — 탭/카테고리/완료 필터 파이프라인
  - `useReminderPicker` — 캘린더/시간/반복 상태
- **외부 의존성**은 `lib/` 래퍼를 거쳐 호출한다. `expo-notifications`, `supabase`, `expo-file-system` 등을 컴포넌트에서 직접 import 하지 않는다.

### 디자인 토큰 강제

- 모든 색·라운드·spacing·typography는 `styles/tokens.ts`에서만 정의한다.
- 컴포넌트의 `StyleSheet.create` 안에서 색상 헥스(`"#XXXXXX"`)·radius 숫자·spacing 숫자를 직접 적지 않는다. 토큰을 import 해서 쓴다.
- 새 토큰을 추가하기 전에 **3회 이상 반복되는지** 확인한다. 1~2회만 쓰이는 값은 토큰화하지 않고 컴포넌트 로컬에 두되 주석으로 의미를 남긴다.
- 토큰 값을 변경하면 모든 사용처에 영향을 주므로, 변경 전 grep으로 영향 범위를 먼저 확인한다.

### Fail-safe 분석 패턴

- `lib/analytics.ts`의 `trackEvent`는 다음을 보장해야 한다.
  - 환경 변수가 없거나 placeholder(`your-project`, `your-anon-key`)이면 클라이언트를 만들지 않는다.
  - 호출은 항상 try/catch로 감싼다.
  - 첫 실패 시 세션 동안 `supabaseDisabled = true`로 마킹해 후속 호출을 막는다.
  - 개발 모드(`__DEV__`)에서는 매 호출을 `console.log("[mock-analytics]", ...)` 로 출력한다.
- 새 이벤트를 추가할 때는 카드 본문(`title`, `pressure` 등 사용자 자유 입력)을 **속성에 포함하지 않는다**. 카테고리·소요 시간 카테고리 등 메타데이터만 보낸다.

### 데이터 영속성

- 카드 본문은 `useItems`를 통해 `AsyncStorage`에 저장된다. `isHydrated` 가드 안에서만 저장이 일어나므로, 새 영속 상태를 추가할 때도 동일한 패턴을 따른다 (하이드레이션 끝나기 전 빈 값으로 덮어쓰지 않도록).
- 카드 본문은 서버로 보내지 않는다.

### 검증

코드 변경 후 항상 다음을 확인한다.

```bash
npx tsc --noEmit       # 타입 통과
npm run doctor         # react-doctor 진단 (선택, 큰 변경 시)
```

`SafeAreaView is deprecated` 경고는 기존 이슈이므로 무시한다. `react-native-safe-area-context`로 교체하는 작업은 별도 task로 진행한다.

---

## 카피 톤 가이드

사용자 노출 카피는 **MZ 친구 톤** 으로 통일한다. 알림·빈 상태·버튼 라벨·압박 옵션 모두 동일한 톤이어야 한다. 톤이 깨지면 차별점이 사라지므로 새 카피를 추가하거나 수정할 때 톤을 우선 확인한다.

### 톤 가이드라인

- 반말. 친근하지만 살짝 가시 있는 톤 ("야…", "묵힌다", "또 미루면 인간 아님").
- 명령조보다는 핀잔/투정 ("리마인더입니다" ✗ → "야… 오늘 안 보면 또 묵힌다" ✓).
- 짧고 리듬감 있게. 한 문장에 두 박자 이내.
- 욕설·비하·심한 표현은 금지. "친구가 가볍게 핀잔 주는" 정도.

### 현재 카피 예시 (참고)

| 위치 | 카피 |
|---|---|
| 빈 상태 | "다행인지 불행인지, 여긴 아직 안 묵혔네." |
| 알림 본문 | "야… 오늘 안 보면 또 묵힌다" |
| 압박 옵션 | "가볍게 봐도 됨", "안 보면 아까움", "진짜 봐야 함", "또 미루면 인간 아님" |
| 등록 버튼 | "추가하고 무조건 보기" |
| 카테고리 트리거 | "왜 할거야?" |
| 수정 헤더 | "묻어둔 것 고치기" / "내용 바꾸면 알림도 새 값으로 간다" |

### 절대 룰

- 기존 카피를 **요청 없이 임의 수정하지 않는다**. 톤은 점진적으로 다듬어지는 자산이다.
- 새 화면/기능을 추가할 때는 위 예시와 호환되는 톤으로 카피를 먼저 작성한다.

---

## superpowers Skill 발동 규칙

superpowers 스킬은 자동 트리거를 기본으로 두되, 아래 케이스에서만 발동을 억제한다.

- **`brainstorming`, `writing-plans` 자동 발동 금지** — 단순 코드 수정, 버그 픽스, 한 줄 추가, 변수명 변경, 단순 질문, UI 잔 작업(스타일·카피·간단 prop 추가). 이 경우 사용자가 명시적으로 "기획해줘"/"계획 세워줘"/"brainstorm" 등을 요청할 때만 발동.
- **`brainstorming`, `writing-plans` 자동 발동 OK** — 새 기능 추가, 큰 리팩토링, 아키텍처 결정, 다중 파일 변경, 모호한 요구사항(스펙 정리 필요).
- **`test-driven-development` 자동 발동 OK** — 동작 보존이 중요한 리팩토링, 로직 변경, 비즈니스 룰 수정.
- **`test-driven-development` 자동 발동 금지** — UI 스타일·카피만 바뀌는 변경, 설정 파일 수정.
- 그 외 superpowers 스킬(`systematic-debugging`, `verification-before-completion` 등)은 superpowers 기본 룰대로 자동 트리거.

---

## 설치된 플러그인 & 호출 가이드

### superpowers — 개발 워크플로우 전반 (자동)

대표 스킬과 트리거:

- `brainstorming` — 새 기능/모호한 요구사항이면 자동
- `writing-plans` — 다중 파일/큰 작업이면 자동
- `test-driven-development` — 로직 변경 시 자동
- `systematic-debugging` — 버그 추적 시 자동
- `using-git-worktrees` — 격리 작업 필요 시
- `dispatching-parallel-agents` — 병렬 작업 필요 시

수동 호출 예시: "이거 기획부터 다시 정리해줘" / "계획 세워줘" / "TDD로 짜줘" / "root cause 추적해줘".

### frontend-design — UI 작업 (자동)

UI 컴포넌트/페이지/스크린 만들거나 리디자인할 때 자동 발동. RN 컴포넌트도 커버.
이 앱은 **블랙·화이트·F5 그레이의 미니멀 모노톤** 방향을 유지한다 (라운드 14~16px, 굵은 700+ 타이포).

### claude-md-management — CLAUDE.md 유지보수 (수동)

`/revise-claude-md` 명령으로 호출하거나 "CLAUDE.md 점검해줘" / "프로젝트 메모리 정리" 등의 문구로 트리거.

### typescript-lsp — 타입 인텔리전스 (반자동)

`typescript-language-server` 글로벌 설치 완료. Claude가 필요 시 LSP 호출.
명시적 트리거: "이 변수 어디서 정의됐어?" / "이거 어디서 다 쓰여?" / "타입 에러 다 잡아줘" / "안전하게 리네임".

### context7 — 라이브러리 최신 문서 (반자동)

학습 데이터 대신 현재 공식 문서를 가져온다. Expo SDK / RN / React 신기능 확인에 유용.
명시적 트리거: "expo-notifications 최신 API 가져와줘" / "context7로 ... 문서 찾아줘".

---

## 빠른 참조

| 작업 | 자동 발동 | 수동 호출 예시 |
|---|---|---|
| 새 기능 기획 | superpowers brainstorming | "기획부터 정리해줘" |
| UI 리디자인 | frontend-design | "디자인 다시 해줘" |
| 버그 추적 | superpowers systematic-debugging | "root cause 추적" |
| 라이브러리 API 확인 | context7 (조건부) | "최신 공식 docs로" |
| 타입 에러 / 리네임 | typescript-lsp | "안전하게 리네임" |
| CLAUDE.md 갱신 | — | `/revise-claude-md` |
| 큰 리팩토링 | superpowers writing-plans + TDD | "계획 세워줘" |
| 잔 작업 (console.log, 카피 수정) | 어떤 스킬도 안 끼어들어야 | — |
