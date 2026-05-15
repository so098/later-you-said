# later-you-said

저장만 해놓고 결국 보지 않는 글·영상·링크를 다시 보게 만드는 React Native 앱입니다.
앱 이름은 "나중에본다며..⭐️"입니다.

## 만든 이유

링크를 저장만 하고 다시 열어보지 않는 행동을 자주 반복하게 됩니다. 북마크 앱과 read-later 서비스가 많지만 대부분 "저장"만 도와줄 뿐 "다시 보게 만들지"는 못합니다.

이 앱은 두 가지 가설로 출발했습니다.

1. **저장 시점에 가벼운 마찰**을 주면 무분별한 수집을 줄일 수 있습니다.
   예를 들어, 카드를 만들 때 "왜 할거야?"(카테고리)와 "안 보면 손해 보는 이유"(압박 강도)를 함께 입력하도록 강제합니다.
2. **알림 카피에 친구가 핀잔주는 톤**을 쓰면 무덤덤한 시스템 알림보다 행동을 유도할 수 있습니다.
   예를 들어, 일반적인 "리마인더입니다" 대신 "야… 오늘 안 보면 또 묵힌다"와 같이 표현합니다.

이 두 가설을 검증하기 위해 필요한 최소 기능만 구현했습니다.

## 주요 기능

- 카드 등록 시 카테고리·소요 시간·압박 강도·알림 시각을 한 화면에서 입력
- 세 가지 뷰: `쌓인 것` (전체), `오늘 볼 것` (당일 알림 대상), `내정보` (백업·복원)
- 카테고리 다중 필터와 완료 항목 필터
- 알림 미리보기 캐러셀 — 등록한 항목이 어떻게 알림으로 표시될지 가로 페이저로 확인
- 풀스크린 일정 선택기 — 월별 캘린더·시간·반복 옵션(없음/매일/매주/매월)
- 로컬 푸시 알림 (`expo-notifications`)
- JSON 백업/복원 — iCloud Drive 또는 기기 파일 시스템 경유
- Obsidian / Notion용 Markdown export

## 제품 결정

| 결정 | 의도 |
|---|---|
| 일관된 친구 톤 카피 | 시스템 알림의 무덤덤함을 깨고 미루는 자신을 가볍게 자극합니다. 빈 상태부터 알림 카피, 압박 옵션까지 동일한 톤을 유지합니다. |
| 로그인 없는 온디바이스 우선 | 저장 콘텐츠는 개인 행동 데이터에 가깝다고 보고, 카드 본문은 `AsyncStorage`를 통해 기기 내부에만 둡니다. 서버에는 익명 사용 이벤트만 전송합니다. |
| 분석은 옵션 | Supabase 없이도 앱을 정상 실행할 수 있도록 `lib/analytics.ts`에서 환경 변수 미설정 또는 placeholder 값을 감지해 콘솔 mock 로깅으로 폴백합니다. |
| 백업은 사용자 트리거 | 자동 클라우드 동기화는 신뢰·복잡도 비용이 크다고 판단했습니다. 대신 JSON export → 파일 앱/iCloud Drive 저장 → 파일 선택을 통한 import 흐름을 채택했습니다. |

## 아키텍처

`App.tsx`는 화면 조립에만 책임을 두고, 나머지는 도메인 단위로 분리했습니다.

```
.
├── App.tsx                       # 최상위 조립부 (≈ 249 LOC)
├── components/                   # 표시 컴포넌트
│   ├── PageHeader.tsx
│   ├── AppHeader.tsx
│   ├── ReminderPreviewCarousel.tsx
│   ├── CategoryFilter.tsx
│   ├── SavedItemCard.tsx
│   ├── BackupPanel.tsx
│   ├── AddPageChipGroup.tsx
│   └── ...
├── screens/                      # 전체 화면 단위
│   ├── AddItemForm.tsx
│   └── ReminderPickerModal.tsx
├── hooks/                        # 상태/로직
│   ├── useItems.ts               # AsyncStorage 하이드레이션
│   ├── useItemMutations.ts       # 추가·수정·삭제·상태 변경 + 이벤트 전송
│   ├── useNewItemForm.ts         # 폼 상태
│   ├── useFilteredItems.ts       # 탭·카테고리·완료 필터링 파이프라인
│   └── useReminderPicker.ts      # 캘린더·시간·반복 상태
├── lib/                          # 외부 의존성 래퍼
│   ├── analytics.ts              # Supabase 클라이언트 + mock 폴백
│   ├── notifications.ts          # expo-notifications 래퍼
│   └── backup.ts                 # JSON / Markdown export-import
├── styles/tokens.ts              # 색·라운드·spacing·typography 토큰
├── constants/                    # 카테고리·탭·storage key 등 도메인 상수
├── types/                        # 도메인 타입
└── supabase/schema.sql           # 익명 이벤트 테이블 정의
```

설계 원칙

- **표시 ↔ 로직 분리** — 컴포넌트는 props만 받고, 상태와 부수 효과는 훅(`useItemMutations`, `useFilteredItems` 등)에서 처리합니다.
- **디자인 토큰 일원화** — 색·라운드·spacing은 `styles/tokens.ts`에만 정의합니다.
- **Fail-safe 분석** — 분석 호출은 try/catch로 감싸고, 첫 실패 시 세션 동안 자동으로 비활성화합니다. 개발 모드에서는 매 호출을 콘솔에 mock 출력해 백엔드 없이도 이벤트 흐름을 확인할 수 있습니다.

코드 작성·수정 시 따라야 할 규칙은 `CLAUDE.md`에 더 자세히 정리되어 있습니다.

## 기술 스택

- React Native 0.81.5 + Expo SDK 54
- React 19.1
- TypeScript 5.9 (strict)
- `@react-native-async-storage/async-storage` — 온디바이스 영속 저장
- `expo-notifications` — 로컬 푸시 스케줄링
- `expo-file-system` / `expo-sharing` / `expo-document-picker` — 파일 시스템·공유 시트·파일 선택
- `@supabase/supabase-js` — 익명 사용 이벤트 수집 (선택)
- `react-native-web` — 웹 미리보기

## 데이터 처리

| 데이터 | 저장 위치 | 보존 정책 |
|---|---|---|
| 카드 본문 (제목·링크·메모·카테고리 등) | `AsyncStorage` (기기 내부) | 사용자가 직접 백업하지 않으면 기기 외부로 나가지 않습니다 |
| 알림 일정 | `expo-notifications` 로컬 스케줄 | 기기 OS가 관리합니다 |
| 사용 이벤트 | Supabase (`usage_events` 테이블) | 익명 ID·이벤트명·메타 속성만 저장합니다 |

수집 이벤트는 다음과 같습니다: `app_opened`, `item_added`, `item_updated`, `item_deleted`, `item_opened`, `item_status_updated`, `backup_exported`, `backup_imported`, `obsidian_markdown_exported`, `notion_markdown_exported`.

이벤트에는 카드 본문이 포함되지 않습니다. 카테고리·소요 시간 카테고리 등 메타데이터만 전송합니다.

## 실행

```bash
npm install
npm run web              # 브라우저 미리보기
npm start                # Expo Dev Tools
npm run ios              # iOS 시뮬레이터
npm run android          # 안드로이드 에뮬레이터
```

실기기에서는 Expo Go 앱으로 QR을 스캔합니다.

### Supabase 연동 (선택)

`.env.example`을 복사하여 `.env`로 저장한 뒤 키를 채웁니다.

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

테이블 스키마는 `supabase/schema.sql`을 참고합니다. 환경 변수를 채우지 않거나 placeholder를 그대로 두면 앱은 mock 분석 모드로 정상 작동합니다.

### 코드 품질 점검

```bash
npm run doctor
```

`react-doctor`로 상태 관리·effect 사용·성능·접근성·dead code 등을 점검합니다. 캐시 권한 이슈를 피하기 위해 프로젝트 내부 캐시(`.npm-cache`)를 사용하도록 스크립트가 구성되어 있습니다.

## 백업 / 복원

`내정보` 탭에서 다음 동작을 제공합니다.

- **백업 내보내기** — 현재 카드 목록을 `later-you-said-backup-YYYY-MM-DD.json` 파일로 만든 뒤 공유 시트를 엽니다. iOS에서는 `파일에 저장` → `iCloud Drive`로 보낼 수 있습니다.
- **가져오기** — 파일 앱에서 이전 백업 JSON을 선택하여 현재 목록을 교체합니다 (확인 다이얼로그를 거칩니다).
- **Obsidian용 Markdown 내보내기** — 카드 목록을 `.md` 파일로 변환합니다. Obsidian vault가 iCloud Drive에 있다면 해당 폴더로 보내 노트처럼 사용할 수 있습니다.
- **Notion용 Markdown 내보내기** — Notion Import 또는 페이지 드래그로 표·노트로 변환할 수 있는 형식입니다.

Markdown export는 읽기 전용이며, 앱으로 다시 가져올 수 있는 백업 포맷은 아닙니다.
