# later-you-said

저장만 해놓고 안 보는 글/영상/링크를 다시 보게 만드는 React Native + Expo 앱. 사용자 노출 카피는 **MZ 깐족톤** 유지.

---

## superpowers Skill 사용 규칙

superpowers 스킬들은 **자동 트리거를 기본으로 유지**하되, 아래 케이스에서만 발동 억제:

- **`brainstorming`, `writing-plans` 자동 발동 금지** — 단순 코드 수정, 버그 픽스, 한 줄 추가, 변수명 변경, 단순 질문, UI 잔 작업(스타일·카피·간단 prop 추가). 이 경우 사용자가 명시적으로 "기획해줘"/"계획 세워줘"/"brainstorm" 요청할 때만 발동.
- **`brainstorming`, `writing-plans` 자동 발동 OK** — 새 기능 추가, 큰 리팩토링, 아키텍처 결정, 다중 파일 변경, 모호한 요구사항(스펙 정리 필요).
- **`test-driven-development` 자동 발동 OK** — 동작 보존이 중요한 리팩토링, 로직 변경, 비즈니스 룰 수정.
- **`test-driven-development` 자동 발동 금지** — UI 스타일·카피만 바뀌는 변경, 설정 파일 수정.
- 그 외 superpowers 스킬(`systematic-debugging`, `verification-before-completion` 등)은 superpowers 기본 룰대로 자동 트리거.

---

## 설치된 플러그인 & 사용법

이 저장소에서 활용 가능한 Claude Code 플러그인 (user scope 설치됨). 각 플러그인을 **효과적으로 발동시키는 트리거 문구**도 같이 적어둠.

### 1. superpowers — 개발 워크플로우 전반

자동 트리거 기본값. 위 "superpowers Skill 사용 규칙" 따름.

**대표 스킬:**
- `brainstorming` — 새 기능/모호한 요구사항이면 자동
- `writing-plans` — 다중 파일/큰 작업이면 자동
- `test-driven-development` — 로직 변경 시 자동
- `systematic-debugging` — 버그 추적 시 자동
- `using-git-worktrees` — 격리 작업 필요 시
- `dispatching-parallel-agents` — 병렬 작업 필요 시

**수동 호출 트리거 문구 예시:**
- "이거 기획부터 다시 정리해줘" → brainstorming
- "계획 세워줘" / "스펙 정리해줘" → writing-plans
- "TDD로 짜줘" → test-driven-development
- "이 버그 왜 나는지 root cause 추적해줘" → systematic-debugging

---

### 2. frontend-design — UI 작업 (자동)

UI 컴포넌트/페이지/스크린 만들거나 리디자인할 때 **자동 발동**. RN 컴포넌트도 커버.

**자동 발동되는 트리거 문구:**
- "이 카드 디자인 다시 해줘"
- "새 화면 만들자 — 알림 설정 페이지"
- "FAB 버튼 스타일 톤 맞춰서 다시"
- "빈 상태 UI 더 멋있게"

**원칙 (스킬이 강제하는 것):**
- BOLD aesthetic direction 선택 (brutally minimal / maximalist / retro 등 한 방향 선언)
- 디테일 정밀하게 (타이포, 여백, 모션, 색 토큰)
- 제너릭 AI UI 회피
- 이 앱에선 **MZ 깐족톤 + 미니멀** 방향 유지 (블랙·화이트·F5 그레이, 둥근 14~16px 라운드, 굵은 700+ 타이포)

---

### 3. claude-md-management — CLAUDE.md 유지보수 (반자동)

**자동 발동 X** — 명시적으로 호출해야 함.

**호출 방법:**
- 슬래시 명령: `/revise-claude-md` → 현재 세션에서 배운 것 CLAUDE.md에 반영
- 트리거 문구: "CLAUDE.md 점검해줘" / "CLAUDE.md 감사" / "프로젝트 메모리 정리"

**쓸 만한 타이밍:**
- 새 컨벤션 정해진 직후 ("앞으로는 이렇게 가자" 결정 후)
- 큰 리팩토링/구조 변경 후
- 자주 까먹는 룰 발견하면

---

### 4. typescript-lsp — 타입 인텔리전스 (반자동)

`typescript-language-server@5.2.0` 글로벌 설치 완료. Claude가 필요 시 LSP 호출.

**자동으로 LSP 호출하는 경우:**
- 타입 에러 찾기/고치기
- 변수·함수 정의 위치 찾기
- 사용처 추적 (find references)
- 리네임 안전성 검증
- 임포트 자동 정리

**명시적으로 LSP 사용 유도하고 싶을 때:**
- "이 변수 어디서 정의됐어?" → go-to-definition
- "이거 어디서 다 쓰여?" → find references
- "타입 에러 다 잡아줘" → diagnostics
- "이거 안전하게 리네임" → LSP rename

---

### 5. context7 — 라이브러리 최신 문서 (반자동)

Upstash Context7 MCP 서버. 학습 데이터 대신 **현재 공식 문서**를 가져옴.

**자동 호출되는 경우:**
- 라이브러리 API/사용법 질문에서 학습 컷오프 이후 변경 가능성 있을 때
- 사용자가 "최신"/"공식 docs" 언급

**명시적 트리거 문구:**
- "expo-notifications 최신 API 가져와줘"
- "React Native 0.81 공식 docs 기준으로 답해줘"
- "context7로 expo-router 문서 찾아줘"

**이 프로젝트에서 자주 쓸 케이스:**
- Expo SDK 버전 올릴 때 breaking changes
- `expo-notifications` 신규 API (지금 코드의 `SchedulableTriggerInputTypes` 같은 거)
- React Native 0.81 / React 19 신기능

---

## 빠른 참조 — 어떤 작업에 뭐 쓰나

| 작업 | 자동 발동 | 수동 호출 |
|---|---|---|
| 새 기능 기획 | superpowers brainstorming | "기획부터 정리해줘" |
| UI 리디자인 | frontend-design | "디자인 다시 해줘" |
| 버그 추적 | superpowers systematic-debugging | "root cause 추적" |
| 라이브러리 API 확인 | context7 (조건부) | "최신 공식 docs로" |
| 타입 에러 / 리네임 | typescript-lsp | "안전하게 리네임" |
| CLAUDE.md 갱신 | — | `/revise-claude-md` |
| 큰 리팩토링 | superpowers writing-plans + TDD | "계획 세워줘" |
| 잔 작업 (console.log, 카피 수정) | 어떤 스킬도 안 끼어들어야 | — |
