# later-you-said

저장만 해놓고 안 보는 글·영상·링크를 **나중의 내가 다시 보게 만드는** React Native 앱.
앱 안에서는 "나중에본다며..⭐️"라는 이름으로 깐족거린다.

## 어떤 앱인데

- **묻어두기**: 링크·메모·카테고리·소요 시간·압박 문구·알림 시간을 한 화면에서 입력
- **세 가지 탭**: `쌓인 것` (전체) / `오늘 볼 것` / `내정보`
- **카테고리 필터**: 이직 취업, 공부, 프로젝트, 영감, 사고싶은것, 위로/재미 — 다중 선택 가능
- **알림 미리보기 캐러셀**: 저장한 항목별 알림이 어떻게 뜰지 가로 페이저로 미리보기
- **풀스크린 일정 선택**: 월별 캘린더 + 시간 칩 + 반복 옵션(없음/매일/매주/매월)
- **로컬 푸시 알림**: `expo-notifications` 기반. 개발 모드에선 3초 후 테스트 알림 버튼 노출
- **카드 메뉴**: 항목별 수정/삭제
- **iCloud 백업/복원**: JSON 파일로 내보내서 파일 앱/iCloud Drive에 저장하고 다시 가져오기
- **Markdown export**: Obsidian/Notion에서 읽기 좋은 `.md` 파일로 내보내기

## 데이터 구조

이 앱은 **로그인 없이 로컬 핸드폰 환경에서 쓰는 개인용 앱**을 기본으로 한다.

- 저장한 카드/링크 본문: `AsyncStorage`로 기기 내부 저장
- 백업/복원: `expo-file-system` + `expo-sharing` + `expo-document-picker`로 JSON 파일 내보내기/가져오기
- 알림: `expo-notifications`로 기기 로컬 알림 예약
- 사용 분석: Supabase에 **익명 이벤트만** 저장

즉, 개인 콘텐츠는 서버에 올리지 않고 사용 흐름만 본다. 필요할 때만 백업 파일을 파일 앱/iCloud Drive에 저장한다.

수집하는 이벤트 예시:

- `app_opened`
- `item_added`
- `item_updated`
- `item_deleted`
- `item_opened`
- `item_status_updated`
- `backup_exported`
- `backup_imported`
- `obsidian_markdown_exported`
- `notion_markdown_exported`

### iCloud Drive 백업 사용법

앱 안의 `iCloud 백업` 영역에서:

- `백업 내보내기`: 현재 카드 목록을 `later-you-said-backup-YYYY-MM-DD.json` 파일로 만든 뒤 공유/저장 창을 연다. iPhone에서는 `파일에 저장` → `iCloud Drive`를 선택하면 된다.
- `가져오기`: 파일 앱/iCloud Drive에서 이전 백업 JSON을 선택해 현재 목록으로 복원한다.
- `Obsidian용 Markdown 내보내기`: 현재 카드 목록을 `나중에본다며-YYYY-MM-DD.md` 파일로 만든다. Obsidian vault가 iCloud Drive에 있으면 그 폴더에 저장하면 바로 노트처럼 볼 수 있다.
- `Notion용 Markdown 내보내기`: 현재 카드 목록을 `나중에본다며-notion-YYYY-MM-DD.md` 파일로 만든다. Notion에서 Import 또는 페이지에 드래그해서 표/상세 노트 형태로 볼 수 있다.

복원은 현재 목록을 교체하므로, 앱에서 한 번 더 확인창을 띄운다. Obsidian/Notion용 Markdown은 읽기용 export라 앱으로 다시 가져오는 백업 파일은 아니다.

Supabase 설정은 선택사항이다. `.env`가 없으면 앱은 정상 작동하고 분석 이벤트만 스킵된다.

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Supabase SQL은 `supabase/schema.sql` 참고.

## 톤 & 보이스

사용자 노출 카피는 **MZ 깐족톤** 유지가 핵심 차별점. 새 카피 추가할 때 톤 깨지 말 것.

예시:
- 빈 상태: "다행인지 불행인지, 여긴 아직 안 묵혔네."
- 알림 카피: "야… 오늘 안 보면 또 묵힌다"
- 압박 문구 옵션: "또 미루면 인간 아님"
- 등록 버튼: "추가하고 무조건 보기"

## 기술 스택

- React 19.1 / React Native 0.81.5 / Expo SDK 54
- `@react-native-async-storage/async-storage` — 온디바이스 저장
- `expo-notifications` — 로컬 알림 스케줄링
- `expo-file-system` / `expo-sharing` / `expo-document-picker` — iCloud Drive 백업/복원
- `@supabase/supabase-js` — 익명 사용 이벤트 수집
- `react-native-web` — 웹 미리보기
- TypeScript 5.9

현재는 `App.tsx` 단일 파일 구조. 화면 추가되면 컴포넌트 분리 예정.

## 실행

```bash
npm install
npm run web              # 브라우저 미리보기 (알림은 브라우저 권한 필요)
npm start                # Expo Dev Tools
npm run ios              # iOS 시뮬레이터
npm run android          # 안드로이드 에뮬레이터
```

모바일 실기기에서 보려면 Expo Go 앱으로 QR 스캔.

## React Doctor

리팩토링 전 코드 품질 점검:

```bash
npm run doctor
```

`package.json`의 `doctor` 스크립트는 로컬 npm 캐시 권한 이슈를 피하려고 프로젝트 내부 캐시(`.npm-cache`)를 쓰도록 설정돼 있다.

```json
"doctor": "npm_config_cache=.npm-cache npx -y react-doctor@latest ."
```

React Doctor는 상태 관리, effect 사용, 성능, 구조, 접근성, dead code 등을 진단한다. 리팩토링 전후로 한 번씩 돌려서 점수/경고 기준으로 정리하면 된다.

## AI 에이전트 가이드

이 저장소는 Claude Code 사용을 전제로 한 가이드 파일이 같이 있다:

- `CLAUDE.md` — superpowers 스킬 자동 발동 규칙 등 에이전트 행동 룰
- `.claude/agents/` — refactorer / planner / designer 등 전문 서브에이전트 정의

Superpowers는 npm 의존성이 아니라 **Claude Code 플러그인**으로 설치한다:

```
/plugin install superpowers@claude-plugins-official
```

## 디렉토리

```
.
├── App.tsx                 # 메인 화면 전부 (추후 분리 예정)
├── .env.example            # Supabase 익명 이벤트 설정 예시
├── supabase/schema.sql     # 익명 이벤트 테이블 SQL
├── CLAUDE.md               # AI 에이전트용 룰
├── .claude/agents/         # 서브에이전트 정의
├── app.json, tsconfig.json
└── package.json
```
