# 작업 보고서 — 번역문 표시 정규식 개인 확장

작성일: 2026-10-29
내부 키: `translation_regex_me`

아래 기존 내용은 0.1 작업 기록입니다. 최신 변경·검증·제한 사항은 마지막 **0.3.2 Marinara Engine 2.5.2 재동기화** 절을 기준으로 합니다.

## 결과 (0.1 기록)

`translation_regex_me.personal-extension.zip`을 생성했습니다. 루트에 `manifest.json`, `extension.js`, 한국어 `README.md`, `NOTICE` 네 파일이 들어 있습니다. 설치 시 기본 비활성 상태이며, 켜면 롤플레이 번역문에 기존 표시 정규식을 적용합니다. 대화 모드는 기본 비활성입니다.

- ZIP 크기: 95,357바이트
- SHA-256: `3fe9a846d684e8646616368d14e1d2e9b8b8fb51ee75a471fa93c22e30156f82`
- ZIP CRC, 네 파일의 루트 배치, `dist/`와의 바이트 일치 검증: 통과
- git commit, push, 저장소 생성: 수행하지 않음

## 구현한 내용

### 정규식과 매크로

참조 경로의 실제 구조인 `marinara-engine-ref/packages/`를 읽었습니다. `use-apply-regex.ts:21-160`을 React 없이 실행하도록 옮겼고 `src/regex.ts`의 각 판정 분기에 원본 파일·줄 주석을 남겼습니다. 원본 파일은 `vendor/upstream/`, 원본 SHA-256은 `vendor/UPSTREAM.json`에 보관했습니다.

서버 규칙 순서, 문자열 활성화 필드, ai_output 배치, display/both 및 구형 promptOnly, 캐릭터 대상, disabled/exclusive/chat, 채팅 metadata 우선과 프리셋 기본값, 채팅 promptPresetId 대상, min/maxDepth, isPatternSafe, 캡처 치환, trimStrings를 유지했습니다. 깊이는 DOM에 보이는 개수가 아니라 시간순 API 메시지에서 계산합니다.

원본 매크로 엔진과 표시용 resolver를 사용합니다. 패턴의 매크로는 정규식 리터럴로 이스케이프하고, 치환 문자열의 매크로는 캡처 치환과 구분합니다. 패턴·치환·trim 처리 후 호스트와 같은 최종 표시 매크로 처리와 인용부호 형식을 적용합니다. 메시지·스와이프 기반 난수 시드, 캐릭터·선택 페르소나·프리셋 선택 변수도 반영합니다. 연결 프리셋은 변수 기본값에만 사용하며 정규식 대상 프리셋과 혼동하지 않습니다. 표시 경로에 없는 카드 systemPrompt/postHistoryInstructions나 서버 전용 프롬프트 문맥은 추가하지 않습니다.

### API·DOM·경쟁 처리

- `.translation-text`의 등장·자식·텍스트·속성 변경을 MutationObserver로 감지합니다.
- 가장 가까운 `data-message-id`로 메시지를 찾습니다. 변환 입력은 DOM이 아닌 `/api/chats/:id/messages`의 `extra.translation`입니다.
- 참조 저장소의 `chats.storage.ts:3533-3542`에서 현재 스와이프의 extra가 메시지에 복사됨을 확인했습니다. 채팅·메시지·activeSwipeIndex로 조회하며, 번역 변경 시 캐시를 무효화합니다.
- 요청 공유, 요청 중단, 세대 번호, 활성 채팅·노드 연결·내용 재검증으로 지연 응답의 잘못된 삽입을 막습니다. DOM이 동일한 스와이프 변경도 주기적인 API 갱신으로 감지합니다.
- 정규식과 새니타이즈가 성공한 뒤 형제 노드를 삽입하고 원래 노드의 display만 숨깁니다. React 관리 자식은 수정하지 않습니다.
- 실패, 빈 새니타이즈 결과, 적용 규칙 없음, 스트리밍, 설정 끄기, 확장 제거 시 원래 번역문을 표시합니다. 원래 inline display 및 우선순위를 복원하며 React가 새로 변경한 display는 보존합니다.
- cleanup에서 observer·타이머·구독·요청·삽입 노드·설정 UI를 정리합니다.

### 대화 모드와 설정

`ConversationMessage.tsx:396-405,765`는 이미 표시 정규식이 적용된 renderedContent를 번역합니다. 기본적으로 대화 모드에 적용하지 않으며, 사용자가 켜더라도 `translationSource === message.content`로 원문 번역임이 확인되는 경우만 처리합니다. 가공된 HTML이나 출처 미상의 번역은 기존 표시를 유지합니다.

작은 Shadow DOM 설정 패널에 켜기/끄기, 대화 모드 적용, 규칙 새로고침을 제공했습니다. 설정 두 개만 로컬 저장소에 보관합니다. 키보드 이동·Escape 닫기를 지원합니다. 360px을 고려한 `calc(100vw - 24px)` 폭 제한, 내부 스크롤, 줄바꿈을 적용했습니다. crypto.randomUUID 및 보안 컨텍스트 전용 API에 의존하지 않습니다.

### HTML·CSS와 의존성

호스트 `chat-html.ts:31-116,129-179`의 HTML 허용 목록, ALLOW_DATA_ATTR false, 금지 태그/속성을 사용합니다. DOMPurify 3.4.13을 `vendor/dompurify/`에 고정 포함하고 최종 JS에 번들했습니다. 라이선스는 NOTICE에 포함했습니다.

style 블록을 분리하고 호스트 CSS 처리기를 재사용해 `.translation-content` 범위를 붙였습니다. 메시지별 Shadow DOM과 레이아웃·페인트 격리도 적용했습니다. 추가로 원격 이미지·CSS 리소스·외부 링크를 차단하며, 인라인 래스터 이미지 데이터만 허용합니다. 런타임 네트워크 코드는 `marinara.fetch`로 전달되는 same-origin `/api/…` GET뿐입니다.

manifest, Shadow DOM UI, 빌드·정리·ZIP 구성은 지정된 slowplot/anywhere 선례를 참고했습니다. 결정적 ZIP 작성기는 anywhere 선례에서 경로·이름과 함수 구조를 조정해 재사용했습니다. 의존성 설치는 로컬 npm 캐시를 `/tmp`에 복사해 offline 모드로 수행했습니다.

## 검증 완료

`npm test`: **74개 통과, 실패 0개**. 결과: `qa/test-results.txt`.

- 스코프 표와 활성화·배치·표시 모드·프리셋 대상·깊이 경계·trim·안전하지 않은 패턴 처리.
- 수정하지 않은 원본 함수와 스코프 우선순위 49조합 및 스코프/대상/프리셋/깊이 720조합 비교.
- DEM 형태의 `<status>` 및 Sola 형태 샘플 → HTML 상태 패널 변환.
- 매크로 이스케이프·캡처·대소문자 명령·고정 난수·API 문맥·프롬프트 전용 필드 배제.
- script/on*/SVG/data 속성 정리, style 스코프, 원격 리소스 차단.
- 형제 삽입, 원래 자식 보존, React 노드 교체·형제 삭제 복구, 번역 갱신·스와이프 변경.
- 스트리밍 중 복원, API 실패와 재시도, 지연 응답 후 채팅 이동·cleanup 경쟁.
- 대화 모드 기본값과 중복 적용 방지, 설정 저장, HTTP/UUID 없음, 저장소 접근 실패 시 복원.
- 타이머·요청 deadline·구독 정리, 다중 메시지 요청 공유, 원본/DOMPurify 해시 검증.
- 360px용 CSS 제한 및 설정 패널 조작 검증. 이는 실제 레이아웃 검증을 대체하지 않습니다.
- ZIP 재빌드 결과의 결정성 및 내용 검증.

최종 산출물에 `node --check`, Python zipfile CRC/내용 확인을 실행했습니다. `git diff --check`도 오류가 없었습니다. 마지막에 참조 소스의 SHA-256을 다시 확인했고 모두 최초 기록과 일치했습니다.

## 미확인 및 적용 범위

1. **실제 마리나라 설치·가져오기·실서버 API 연동은 실행하지 않았습니다.** 테스트는 가짜 API와 jsdom 기반입니다.
2. **360px 실제 브라우저/휴대폰 화면은 미확인입니다.** Playwright로 시스템 Chromium을 실행했으나 샌드박스가 crashpad의 socket setsockopt를 거부했고, 페이지 생성 전 SIGTRAP으로 종료했습니다. 승인 우회 없이 중단했습니다. 재실행 스크립트: `npm run qa:browser`, 기록: `qa/browser-results.json`.
3. DEM·Sola 검증은 직접 만든 대표 구조 샘플입니다. 실제 DEM v3·Sola 전체 규칙 파일, 장문의 실사용 번역문 및 대규모 채팅 성능은 미확인입니다.
4. `.translation-text`와 조상 `data-message-id`가 없는 화면은 변경하지 않습니다. 일부 비주얼노벨/번역만 표시 경로처럼 이 표식이 없는 경우도 기존 표시를 유지합니다.
5. HTML 패널과 주변 텍스트를 출력하지만, 호스트의 전체 Markdown 렌더링·화자 색상·카드 이미지 해석 파이프라인까지 재구현하지는 않았습니다. 원격 리소스는 요구사항에 따라 차단되므로 해당 리소스에 의존하는 패널 외관은 달라질 수 있습니다.

## 금지 사항 준수

금지된 Lumiverse 경로·context 텍스트 및 지정된 포트/호스트에 접근하지 않았습니다. 마리나라 참조 소스는 읽기만 했습니다. 외부 네트워크 요청을 하지 않았으며, 런타임 코드의 요청은 same-origin API 읽기로 제한했습니다. git 저장 영역을 수정하지 않았고 commit·push·저장소 생성도 하지 않았습니다.


## 0.2.0 실사용 피드백 반영

### 소스 진단과 재현

확장 코드를 수정하기 전에 읽기 전용 Marinara 참조 소스를 확인했습니다. 아래 경로는 참조 저장소 기준입니다.

| 확인 항목 | 소스 근거 | 진단 |
| --- | --- | --- |
| 본문을 번역으로 교체 | `packages/client/src/components/chat/ChatMessage.tsx:3329-3345` | 채팅 metadata의 `translationDisplayOnly`, 현재 원문과 같은 `translationSource`, 번역 완료 여부로 `showTranslationOnly`를 결정합니다. |
| 별도 번역 칸과 본문 DOM | `packages/client/src/components/chat/ChatMessage.tsx:3516-3546`, `4562-4596` | 번역 전용 표시는 `.mari-message-content` 안에 `renderedTranslationOnly`를 넣습니다. `.translation-text`는 `!showTranslationOnly`일 때만 생성됩니다. |
| 번역 표시의 정규식 누락 | `packages/client/src/components/chat/ChatMessage.tsx:3296-3313` | 번역은 `renderContent(effectiveTranslationText, …)`로 바로 전달되며 표시 정규식을 통과하지 않습니다. |
| 번역 저장 위치와 완료 순서 | `packages/client/src/hooks/use-translate.ts:105-118`, `147-151` | `extra.translation`, `translationSource`, `translationHidden`을 저장한 뒤 번역 스토어에 게시합니다. 저장 실패를 catch하므로 **화면에는 보이지만 API에는 없는 경우도 가능**합니다. 이번 사용자 세션의 저장 실패 여부는 미확인입니다. |
| 메시지·스와이프 매칭 | `packages/client/src/components/chat/ChatMessage.tsx:3908-3909`, `packages/server/src/services/storage/chats.storage.ts:3533-3542` | DOM은 실제 `message.id`를 사용하고 서버가 활성 스와이프의 content·extra를 메시지로 복사합니다. 기존 API 메시지 + activeSwipeIndex 매칭 방식 자체의 오류는 확인되지 않았습니다. |
| 대화 모드 | `packages/client/src/components/chat/ConversationMessage.tsx:455-461`, `765`, `packages/client/src/components/chat/ConversationMessageShared.tsx:646-666` | 대화 모드도 번역 전용 본문을 사용하지만 번역 입력이 이미 가공된 `renderedContent`일 수 있습니다. 기본 비활성 및 원문 출처 확인 조건을 유지했습니다. |
| 액션 줄 | `packages/client/src/components/chat/ChatMessage.tsx:4262-4287`, `4723-4747`, `packages/client/src/components/chat/ConversationMessageActions.tsx:131-157` | 복사·번역·편집 버튼은 공통 `.mari-message-actions`에 있습니다. |
| 아이콘·모바일 스타일 | `packages/client/src/components/chat/MessageActionButton.tsx:4`, `42-44`, `packages/client/src/styles/globals.css:6829-6844` | 아이콘 크기는 1em, 색·hover는 호스트 CSS 변수입니다. 모바일은 nowrap 및 자식 flex 분배를 사용합니다. |

**확인한 직접 원인:** 0.1의 `src/runtime.ts:121-123`은 `.translation-text`가 없으면 API 조회 전에 “번역문을 기다리는 중”으로 반환했습니다. 폴링이 2초마다 실행되어도 동일한 DOM 조건으로 종료하므로 완료된 본문 번역을 영원히 발견하지 못했습니다. 한국어가 들어 있는 `.mari-message-content`만 두고 API 번역 완료 후 2초 폴링을 기다리는 회귀 테스트를 **수정 전에 실패시켰습니다**. 기록: `qa/regression-0.2-before.txt`.

### 변경 내용

- 메시지 루트를 기준으로 API를 먼저 읽고 별도 번역 칸 또는 번역 전용 본문을 선택합니다. 본문 경로는 metadata·번역 출처·현재 원문이 일치할 때만 적용합니다. 입력은 계속 API의 원래 태그 포함 번역문입니다.
- “기다리는 중” 한 문구 대신 수동 실행, API 번역 없음, 숨긴 번역, 스와이프 출처 불일치, 미지원 표시 영역, 중복 적용 방지, 실패를 구분합니다. 메시지 캐시 TTL은 1.5초로 낮춰 2초 폴링 경계에서 이전 캐시가 재사용되는 지연을 줄였습니다.
- `src/actions.ts`에 점선 아이소메트릭 큐브 버튼을 추가했습니다. 1em / currentColor / 호스트 hover 변수, 툴팁, `aria-pressed`, `aria-busy`, 진행·완료 점 및 실패 표시를 제공합니다.
- 기존 액션 줄의 자식은 수정하지 않습니다. 액션 줄 **형제**로 버튼을 넣고 줄의 끝에 48px 공간을 예약하며 44×44px 클릭 영역을 제공합니다. 모바일 nowrap을 유지하고 부모 flex/grid 간격을 보정합니다. MutationObserver와 주기 확인으로 액션 줄 교체·버튼 삭제 후 재부착합니다.
- 수동 버튼은 메시지·스와이프별 적용/원래 번역 토글입니다. 적용 중 재클릭은 취소하며 실패 후 클릭은 재시도합니다. 스와이프 이동 시 다른 스와이프에 수동 선택이 전파되지 않고 돌아오면 이전 선택을 복원합니다.
- **자동 적용 기본 꺼짐**. 기존 `enabled`를 자동 실행으로 승계하지 않고 새 `autoApply` 설정을 명시적으로 켠 경우만 자동 적용합니다. 패널은 설정용으로 유지했습니다. 수동 기본 상태에서는 API를 호출하지 않습니다.
- 본문 노드 교체, 별도/본문 번역 전환, API 실패, 숨김, 생성 중, 설정 해제, cleanup에 원래 노드를 복원합니다. 편집기·여러 본문 조각·본문의 대화형 명령 결과는 보존을 위해 적용하지 않습니다.
- package / lock / manifest 확장 버전을 0.2.0으로 맞췄습니다. manifest 최상위 `version: 1`은 가져오기 스키마 버전이므로 유지했습니다. README를 새 사용법으로 갱신했고 README·NOTICE에 로컬 절대경로를 넣지 않았습니다.

### 검증

- `npm test`: **90개 통과, 실패 0개, 생략 0개**. 기존 74개에 0.2 회귀·버튼 검증 16개를 추가했습니다. 결과: `qa/test-results.txt`.
- 새 검증: 번역 전용 완료 → 2초 폴링 → 적용 전이, 수동 대기 후 API 저장 완료, 신규/구 설정의 자동 적용 꺼짐, 점선 SVG/형제 배치, 메시지별 토글, 본문 자식 보존, 표시 모드 전환·본문 교체, 액션 줄 교체·버튼 삭제 복구, 스와이프별 선택/복귀, 진행·실패·재시도·취소, 잘못된 출처·숨김·편집·상호작용 본문 보호, 상태 문구 및 CSS 예약 공간, 재번역 진행 중의 원문을 이전 API 번역으로 오인하지 않는 처리.
- `npm run package`: 성공. ZIP 루트 네 파일·CRC·dist 바이트 일치·0.2.0 manifest·README/NOTICE 절대경로 부재 확인. `node --check` 및 `git diff --check` 통과. 기록된 참조 소스 SHA-256 모두 일치.
- 산출물: `translation_regex_me.personal-extension.zip`, **98,637바이트**.
- SHA-256: `dda8f5094c77379a6733a4987612d4274ba853ae1eb87ef004a0f220a0ea96fb`.
- 검증 요약: `qa/final-verification.json`. 브라우저 실행 차단은 아래 미확인 절에 별도 기재했습니다.

### 미확인과 제한

- 실제 사용자 Marinara에 설치하거나 실서버에 요청하지 않았습니다. 실제 화면의 DOM·metadata·API 저장 실패 여부는 직접 수집하지 않았으며, 소스에서 확인한 경로를 가짜 API와 DOM으로 재현했습니다.
- `npm run qa:browser`를 실행했으나 Chromium이 페이지 생성 전에 crashpad `setsockopt: Operation not permitted` / SIGTRAP으로 종료했습니다. 360px의 44px 터치 영역·액션 줄 겹침/줄바꿈·색상 크기 검사를 스크립트에 추가했지만 **실제 브라우저 레이아웃 통과로 주장하지 않습니다**. 기록: `qa/browser-results.json`, `qa/browser-log.txt`.
- 저장에 실패해 API에 없는 번역은 DOM에서 태그를 복원할 수 없으므로 “API에 저장된 번역문 없음”을 표시하고 재확인합니다. 원문 노드는 계속 표시합니다.
- `.mari-message-actions`가 없는 화면에는 수동 버튼을 넣지 않습니다. 메시지 ID 없는 VN 화면, 여러 본문 조각, 편집기, 대화형 명령 결과가 본문에 포함된 경우는 적용하지 않습니다. 모든 테마·대화 모드 변형·실제 DEM/Sola 전체 규칙은 미확인입니다.
- 외부 요청 및 금지 경로 접근 없이 작업했습니다. 참조 저장소와 `.git`은 읽기만 했으며 **git commit·push·저장소 생성은 수행하지 않았습니다**.

## 0.2.1 플로팅 버튼 제거

### 변경 내용과 이벤트 근거

- 오른쪽 아래의 **번역 정규식** 플로팅 버튼, 버튼 전용 열기/닫기 이벤트, `right:12px; bottom:12px` 고정 위치 CSS를 제거했습니다. 닫힌 설정 UI 전체는 `hidden`으로 숨겨 입력창·전송 버튼의 클릭 영역을 차지하지 않습니다. 기존 코드에는 별도 플로팅 위치 저장 키나 드래그 코드가 없었습니다.
- 액션 줄 점선 큐브의 **짧은 탭은 해당 메시지 적용/원래 번역 토글**, **600ms 터치 길게 누르기 또는 우클릭은 설정 열기**입니다. 툴팁과 접근성 이름에 “길게 눌러 설정 (우클릭 가능)”을 추가했고, 상태별 툴팁에서도 안내를 유지합니다.
- `src/actions.ts:25-74`: 터치 시작·이동·종료, `contextmenu`, `selectstart`의 기본 동작과 전파를 차단합니다. 터치 시작에서 브라우저 기본 동작을 취소하므로 짧은 탭은 `touchend`에서 한 번 처리합니다. 뒤따르는 호환 클릭은 무시하며 길게 누르기 뒤에는 번역 토글을 실행하지 않습니다. 600ms 이전에 발생하는 터치 컨텍스트 메뉴는 취소하되 설정을 미리 열지는 않습니다. `src/actions.ts:14`의 `user-select:none`, `-webkit-user-select:none`, `-webkit-touch-callout:none`도 선택·네이티브 팝업 억제를 보완합니다.
- 손가락이 10px 넘게 이동하거나 다중 터치·취소·버튼 이탈이 발생하면 길게 누르기를 취소합니다. 액션 줄 교체·버튼 제거·확장 cleanup에서는 타이머와 이벤트 리스너를 해제합니다. 다음 정상 터치·마우스·키보드 입력은 다시 사용할 수 있습니다.
- 참조 근거는 읽기 전용 `marinara-engine-ref`의 `packages/client/src/components/chat/ChatMessage.tsx:2301-2315`(문서의 `touchstart`로 액션 닫기), `3911-3912`(조상 메시지의 클릭·더블클릭), `MariSuggestionChips.tsx:354-379`(길게 누르기 타이머, 취소, 네이티브 메뉴 및 후속 클릭 억제)입니다. 큐브의 이벤트가 호스트 조상 핸들러로 전파되지 않도록 했습니다. 참조 메시지 루트에서 별도 길게 누르기 메뉴 타이머는 확인되지 않았으며, 모든 실사용 호스트 변형의 메뉴 동작을 직접 검증했다는 의미는 아닙니다.
- `src/runtime.ts:26-70`: 설정을 화면 중앙 모달로 변경했습니다. 폭 320px 및 `100vw - 24px` 제한, 동적 뷰포트 높이 제한, 내용 내부 스크롤을 적용했습니다. 닫기는 스크롤 영역 밖에 두고 최소 44×44px을 보장합니다. 닫기·바깥 영역 탭·Escape, 모달 내 Tab 순환, 원래 큐브로 초점 복귀를 제공합니다.
- `translation_regex_me.settings`의 `autoApply`, `conversation` 읽기/쓰기 형식을 유지했습니다. 패널을 열고 닫는 동작은 저장값을 변경하지 않습니다. 자동 적용 기본 꺼짐과 이전 `enabled`를 승계하지 않는 0.2.0 동작도 유지합니다.
- package/lock/manifest 확장 버전을 **0.2.1**로 맞췄습니다. manifest 최상위 스키마 버전은 1을 유지합니다. README와 dist의 사용법도 갱신했습니다.

### 검증과 산출물

- `npm test`: **94개 통과, 실패 0개, 생략 0개**. 결과: `qa/test-results.txt`.
- 0.2.1 회귀 테스트 4개에서 플로팅 실행 버튼 미생성, 짧은 터치와 후속 클릭의 단일 토글, 600ms 타이머 등록 및 실행, 이른 컨텍스트 메뉴 억제, 길게 누르기·우클릭의 설정 열기, 호스트 조상으로의 전파 차단, 텍스트 선택 기본 동작 취소, 닫기·바깥 클릭·Escape, 초점 순환·복귀, 설정 보존, 이동·다중 터치·취소·제거 시 타이머 정리를 확인했습니다. 기존 패널 CSS 검증도 중앙 배치·뷰포트 제한·44px 닫기에 맞춰 갱신했습니다.
- `scripts/browser-qa.mjs`는 360×780 가짜 호스트에 입력창과 전송 버튼을 추가하고, 닫힌 UI의 전송 버튼 히트 테스트, 실제 터치 이벤트의 짧은 탭/길게 누르기, 우클릭, 닫기, 모달 중앙 배치·뷰포트 포함·입력창과의 비겹침·44px 닫기를 검사하도록 갱신했습니다. 외부 요청은 차단하도록 구성했습니다.
- **브라우저 레이아웃 검증은 미완료입니다.** `npm run qa:browser` 실행 시 Chromium이 페이지 생성 전에 crashpad `setsockopt: Operation not permitted` / SIGTRAP으로 종료했습니다. 브라우저 검사 완료 개수는 0이며, CSS/jsdom 검증을 실제 휴대폰 검증으로 대체해 주장하지 않습니다. 기록: `qa/browser-results.json`, `qa/browser-log.txt`.
- `npm run package`: 성공. ZIP 루트 네 파일, CRC, dist와 바이트 일치, 0.2.1 버전, 산출물의 사용자 로컬 절대경로 부재를 확인했습니다. `node --check`(번들 및 브라우저 QA 스크립트), `git diff --check` 통과. 동봉 참조 소스 SHA-256도 모두 일치합니다.
- 산출물: `translation_regex_me.personal-extension.zip`, **99,748바이트**.
- SHA-256: `2f5fea1def724ecfba2ed59ecc2f89ca90cf59fbcb8ff4c83c81a269fdb306c6`.
- 검증 요약: `qa/final-verification.json`. QA 로그의 로컬 경로는 `<repo>`로 치환했습니다.

실제 Marinara 설치·실서버·휴대폰 Safari/Chrome 및 가상 키보드가 열린 화면은 검증하지 않았습니다. 액션 줄이 없는 화면에는 설정 진입용 큐브도 없다는 기존 적용 범위는 유지됩니다. 외부 요청과 지정된 금지 경로·포트 접근 없이 작업했으며 **git commit·push를 수행하지 않았습니다**.

## 0.3.0 큐브 배치·번역 복구·다듬기 공존

현재 미커밋 0.2.1 변경사항 위에 구현했습니다. package/lock/manifest 확장 버전은 **0.3.0**, manifest 최상위 가져오기 스키마 버전은 1입니다. Fetchy의 **`dist/manifest.json` + `dist/extension.js` 폴더 구조**와 ZIP 루트 네 파일을 유지했습니다. 아래 근거에서 `packages/…`는 읽기 전용 마리나라 참조 저장소, `polisher-ref/…`는 제공된 참고용 확장 사본 기준입니다. 로컬 절대경로는 기록하지 않았습니다.

### 큐브 위치

- `src/actions.ts:67`: 큐브를 `.mari-message-actions`의 **직접 마지막 자식 button**으로 넣습니다. 설정 슬라이더·다듬기 버튼 뒤에 붙으며, 뒤늦게 호스트 자식이 추가되면 큐브만 끝으로 옮깁니다. 기존 형제 wrapper, 48px 예약 패딩, 음수 마진, 부모 gap 보정은 제거했습니다.
- `src/actions.ts:5`, `src/actions.ts:80`: `packages/client/src/components/chat/MessageActionButton.tsx:4,42-44`의 버튼 구조와 실제 클래스 문자열, 1em 아이콘, 색·hover·focus 변수를 따릅니다. 데스크톱 36×36px, 모바일 기본 28×32px이며 `packages/client/src/styles/globals.css:6829-6844`의 기존 모바일 flex 분배와 줄 간격을 그대로 받습니다. 큐브 전용 44px 공간을 강제하지 않습니다.
- `src/runtime.ts:149`, `src/runtime.ts:185`: MutationObserver와 주기 확인으로 행 교체·버튼 삭제·새 형제 추가 후 복구합니다. 복제된 낡은 큐브만 제거하고 호스트·다듬기 컨트롤은 보존합니다. 0.2.1의 600ms 길게 누르기, 우클릭, 터치 이벤트 전파 억제, 모달 초점·닫기 동작을 유지했습니다.

### 번역 API·진행·저장

- `src/runtime.ts:42`, `src/runtime.ts:53`, `src/runtime.ts:81`: 기존 설정 진입에 **이어서 번역**, **나눠서 다시 번역**을 추가했습니다. 자동 이어 번역은 기본 꺼짐이며 정규식 자동 적용과 별도로 저장됩니다. 청크 n/m, 취소, 오류·취소 후 부분 결과 저장/버리기와 부분 저장 시 기존 번역을 대체한다는 안내를 제공합니다. 한 번에 한 작업을 실행하고 미처리 부분 결과가 있으면 다음 작업을 막습니다.
- `src/translation.ts:94`: 공급자·출력 언어·연결·프롬프트·DeepL 키·DeepLX URL은 현재 채팅 metadata를 읽습니다. `packages/shared/src/utils/translator-defaults.ts:64-99`와 같은 구형 공통 언어/프롬프트 fallback 및 명시적 프롬프트 초기화 의미를 유지합니다. 호스트에 번역 스토어가 공개되지 않아 임의 내부 스토어 접근 없이 API metadata를 사용했습니다.
- `src/translation.ts:114`, `src/translation.ts:195`: 마리나라 `POST /api/translate`에 `chatId,text,provider,targetLanguage,connectionId,systemPrompt,deeplApiKey,deeplxUrl`을 보내고 `{translatedText}`를 읽습니다. 근거는 `packages/client/src/hooks/use-translate.ts:94-104`, `packages/server/src/routes/translate.routes.ts:6-7`, `packages/server/src/services/translation.service.ts:29-60`입니다. 헤더는 `packages/client/src/lib/api-client.ts:284-317`, `packages/shared/src/constants/security.ts:1-5`에 맞춰 JSON 및 `x-marinara-csrf:1`, 존재하는 관리자 인증 헤더를 사용합니다. 요청은 same-origin `/api`로 제한하고 키를 추가 저장·로그 출력하지 않습니다.
- `src/translation.ts:137`, `src/translation.ts:148`: 청크 요청 전과 저장 직전에 원문·활성 스와이프·번역·출처·숨김·longSource를 재확인합니다. 저장은 `PATCH /api/chats/:id/messages/:mid/extra`에 **`translation`, `translationSource: 현재 message.content`, `translationHidden:false`** 세 필드만 보냅니다. `use-translate.ts:105-118`과 같으며, `packages/server/src/routes/chats.routes.ts:2833-2844,2917-2918`에서 지원하는 `swipeIndex` 쿼리를 함께 보내 다른 스와이프로 잘못 저장되는 것을 방지합니다. 다듬기 필드 등 다른 extra는 부분 병합으로 유지됩니다.
- `src/runtime.ts:87`, `src/runtime.ts:285`: 성공한 API 결과를 다시 읽어 정규식을 적용하고 호스트 메시지 쿼리를 무효화합니다(`packages/client/src/hooks/use-chats.ts:58`). 정규식 매칭이 없어도 새로 저장한 번역은 표시합니다. 실패 시 자동으로 부분 PATCH하지 않으며 기존 번역을 유지합니다. 부분 결과 저장은 명시적 버튼으로만 수행하고 동일성 검사를 다시 거칩니다.
- `src/translation.ts:118`, `src/translation.ts:209`: POST 120초, 읽기/저장 15초 제한, 취소 신호, 늦은 응답 배제, 채팅 이동·cleanup 시 중단을 구현했습니다. 부분 결과는 메모리에만 보존하며 채팅 이동/종료 시 버립니다. 서버 공급자가 이미 처리 중인 호출의 비용·처리까지 취소된다고 보장하지 않습니다.

### 청크·태그·끊김 휴리스틱

- `src/translation.ts:7`, `src/translation.ts:24`: 약 3,000자에서 문단 → 문장 → 공백 경계를 우선합니다. 공백 없는 긴 문자열은 UTF-16 surrogate pair를 보존하며 나눕니다. 표시 정규식 대상의 상위집합인 **모든 태그 블록**을 원자적으로 취급해 중첩 태그·따옴표 속성의 `>`·닫히지 않은 블록도 청크 경계에서 나누지 않습니다. 큰 블록은 3,000자를 넘겨 한 청크로 두고 Google 5,000자/서비스 50,000자 요청 한도를 넘으면 오류로 중단합니다.
- `src/translation.ts:45`: 태그와 속성을 충돌 없는 자리표시자로 감추고 내부 텍스트만 번역합니다. 자리표시자의 개수·순서·누락·중복 및 새 태그 삽입을 검사합니다. 복원 실패 시 **원문 태그 블록을 포함한 해당 청크 전체**를 그대로 보존하고 개수를 표시합니다. 청크 구분 공백은 원문 기준으로 복원해 순서대로 결합합니다.
- `src/translation.ts:67`: 태그 제거 후 원문 600자 이상에서 번역/원문 길이 비율 `<0.45`, 또는 원문 300자·번역 40자 이상에서 원문은 문장부호로 끝나지만 번역은 그렇지 않으면 끊김을 의심합니다. 짧은 라벨은 제외합니다. 언어별 압축률·문체로 인한 오탐 가능성이 있으며, 자동 설정을 켰더라도 이 판정만으로 원문 위치를 결정하지 않습니다.
- `src/translation.ts:74`: 번역이 원문의 정확한 앞부분이거나 번역 끝의 동일한 태그 블록(16자 이상)이 원문에 유일하게 존재할 때만 그 다음 원문을 이어 번역합니다. 반복 블록, 태그 중간 위치, 일반적인 서로 다른 언어의 문장 중간 종료는 위치가 불확실하므로 **나눠서 다시 번역**을 제안합니다. 임의 길이 비율로 앞부분을 생략하지 않습니다.
- `src/translation.ts:177`, `src/translation.ts:211`, `src/runtime.ts:233`: 같은 채팅·메시지·스와이프·원문·번역의 자동 시도와 자신의 저장 결과를 기억해 무한 자동 요청을 막습니다. 최신 API에서 끊김·숨김·출처를 다시 확인합니다. 자동 적용이 꺼져 있어도 자동 이어 번역 설정만 켜서 사용할 수 있습니다.

### 번역 다듬기 충돌 진단과 대응

- **확인한 동작:** `polisher-ref/extension.js:69`의 `applyVisible`은 번역 노드의 `textContent`와 클래스를 바꿉니다. `:85-86`은 API translation 및 translationPolisher 필드를 읽고, `:192-193`은 translation·translationSource와 `translationPolisherLongSource` 등 보조 필드를 저장한 다음 DOM을 갱신합니다. `:226`은 다듬기 그룹의 설정 슬라이더를 추가합니다. 이 참고 사본에서는 longSource와 source가 같을 수 있어, 모든 실사용 출처 불일치가 그 필드 때문이라고 확정하지는 않았습니다.
- `src/translation.ts:89`, `src/runtime.ts:245`: API **`extra.translation` 자체**를 정규식 입력으로 사용합니다. 출처가 다르더라도 `translationPolisherLongSource`가 **현재 원문과 정확히 같은 경우만** 허용하고 다른 스와이프의 긴 원문은 거부합니다. 별도 번역 칸·번역 전용 본문·대화 모드의 출처 검사에 동일하게 반영했습니다.
- `src/runtime.ts:135`, `src/runtime.ts:174`, `src/runtime.ts:271`: fingerprint가 같은 다듬기 DOM 변경은 무시하며, 달라지면 API를 새로 읽고 렌더를 갱신합니다. DOM-only 변경마다 무조건 원본을 보였다 숨기는 처리를 제거했습니다. `[data-translation-polisher-ui]` 컨트롤은 건드리지 않고, 번역 영역 안에 컨트롤이 있으면 그 전체 영역을 숨기지 않습니다. 다듬기가 만든 번역 텍스트 노드는 계속 관찰합니다.
- 참고용 확장의 **동작·필드만 조사했으며 코드를 복사하지 않았습니다.** 청크 처리·복원·작업 관리 코드는 새로 작성했습니다. 다듬기 UI/보조 필드를 삭제하거나 덮어쓰지 않습니다.

### 검증과 산출물

- `npm test`: **113개 통과, 실패 0개, 생략 0개**. 기존 94개를 새 배치에 맞춰 갱신하고 19개 테스트를 추가했습니다. 결과: `qa/test-results.txt`.
- `tests/translation.test.mjs:29`: 청크 원문 완전 보존, 문단·문장 경계, 큰/중첩/비정상 태그 블록, Unicode 경계, 속성 보호, 자리표시자 손상·중복·재정렬 fallback, 끊김 판정, 보수적 이어 번역 위치와 불확실성 거부.
- `tests/translation.test.mjs:75`: 기존 공급자/언어/연결/프롬프트·CSRF·same-origin 요청, 순차 호출과 세 저장 필드, 성공 후 정규식 재적용, 실패 시 기존 번역 유지, 부분 저장·버리기·재시도, 취소 후 늦은 응답, cleanup의 타이머 해제, 원문/스와이프/다듬기 변경과 채팅 이동 경쟁.
- `tests/translation.test.mjs:146`: 자동 이어 번역 기본 꺼짐·독립 설정·반복 방지, longSource 출처 허용과 잘못된 출처 거부, 다듬기 DOM 변경 직후 API 결과 반영 및 동일 fingerprint의 렌더/요청 안정성, 두 확장 버튼 공존, 태그 복원 실패·공급자 한도, 빈 응답·진행 중 생성, 정규식이 없어도 새 번역 표시, 컨트롤 보존, 마지막 자식 재부착, 불확실한 자동 요청 반복 방지.
- `npm run package`: 성공. ZIP **106,315바이트**, SHA-256 **`599aa62144d013074a354d0c871a5145cc0b6c3aed57733c7ebf4c4a17cc2812`**. ZIP CRC·루트 네 파일·dist 바이트 일치·0.3.0 버전·사용자 로컬 절대경로 부재 확인. `node --check` 번들/브라우저 QA 스크립트 및 `git diff --check` 통과. 기록된 마리나라 참조 원본 SHA-256 모두 일치했습니다. 요약: `qa/final-verification.json`, `qa/package.json`.
- `scripts/browser-qa.mjs:60`: 360px에서 마지막 자식·호스트와 같은 버튼 크기·겹침/줄바꿈 검사를 새 배치에 맞게 갱신했습니다. **실행은 차단됨**: `npm run qa:browser`에서 Chromium이 페이지 생성 전에 crashpad `setsockopt: Operation not permitted` / SIGTRAP으로 종료했습니다. 완료된 브라우저 검사 0개이며 기록은 `qa/browser-results.json`, `qa/browser-log.txt`입니다. QA 로그의 로컬 경로는 `<repo>`로 치환했습니다.

### 미확인·제한 및 준수 사항

1. 실제 마리나라/Fetchy 설치, 실서버 공급자 번역 품질·CSRF 연동·React 화면 갱신, 실제 다듬기 확장과의 동시 실행, 휴대폰 브라우저의 간격·hover·터치·가상 키보드는 **미확인**입니다. 테스트는 가짜 API와 jsdom이며 실제 브라우저 레이아웃 통과를 주장하지 않습니다.
2. 일반적인 다른 언어의 문장 중간 끊김은 안전한 대응 위치가 없으면 이어 붙이지 않고 전체 나눠 번역으로 유도합니다. 자리표시자를 훼손하는 공급자는 원문 청크가 남고, 5,000/50,000자를 넘는 단일 태그 블록은 분할하지 않습니다. 모든 실제 DEM/Sola 규칙·언어 조합 검증은 미완료입니다.
3. 저장 직전 재조회와 명시적 스와이프 번호를 사용하지만 이 API에는 원문/번역의 조건부 원자 갱신이 없습니다. 마지막 GET과 PATCH 사이의 같은 스와이프 동시 편집, 서버가 저장한 뒤 응답이 유실되는 경우까지 완전히 해결하지는 못합니다. 두 확장의 번역 작업은 순차 실행을 권합니다. 호스트 쿼리 공개 인터페이스가 없는 환경에서는 확장의 새 번역 표시만 즉시 갱신하며 호스트 자체 캐시 갱신은 실사용 확인이 필요합니다.
4. 기존 `.translation-text`/번역 전용 단일 본문·메시지 ID·액션 줄 적용 범위를 유지합니다. 편집기, 상호작용 본문, 번역 영역 내부의 다듬기 컨트롤은 숨기지 않습니다.
5. 외부 네트워크 요청, 지정된 금지 경로·포트 접근, 참고 소스 수정 없이 작업했습니다. **git commit·push는 수행하지 않았으며 기존 미커밋 변경사항을 유지했습니다.**


## 0.3.1 설정 런처·말랑 리모콘 호환

기존 미커밋 0.3.0 변경 위에 구현했습니다. 제공된 `REMOTE-COMPAT.md`의 동작 계약을 읽고 적용했으며 참고용 리모콘 코드를 복사하지 않았습니다. package/lock/manifest 확장 버전은 **0.3.1**, manifest 스키마 버전은 1입니다.

### 변경 내용

- `src/launcher.ts`: 문서 본문에 아이콘형 점선 큐브 런처를 하나 유지합니다. 고정 `id`와 `data-testid`는 모두 **`translation-regex-launcher`**입니다. 44×44px 터치 영역, 오른쪽 가장자리, 기본 화면 중간 높이, 세로 드래그, **700ms 길게 누르면 기본 위치 초기화**를 제공합니다. 위치는 세션 내 메모리에만 유지합니다.
- 표시된 composer wrapper와 textarea/contenteditable/role=textbox의 form 또는 편집 영역을 감지해 **입력창 위 8px**까지 이동을 제한합니다. ResizeObserver, DOM 변경, 창 크기·스크롤 및 visualViewport 크기·오프셋 변경에 대응합니다. 44px 영역을 둘 공간이 없으면 잠시 숨깁니다. 메시지 내부 편집기는 composer 후보에서 제외합니다.
- 열기/닫기는 **click 이벤트**로 처리하므로 리모콘의 `element.click()`으로도 작동합니다. 드래그·길게 누르기·취소 직후의 클릭은 억제하고, 억제 상태는 다음 포인터 입력 또는 500ms 후 해제합니다. 모달은 화면 중앙에 배치되며 숨겨진 버튼의 좌표를 읽지 않습니다.
- 위치 변경에는 top/right만 갱신하고, 자체 표시 설정에는 전용 data 속성만 사용합니다. 외부 클래스 목록, display/visibility 스타일, hidden 속성은 덮어쓰지 않습니다. 호스트가 버튼을 제거하면 같은 노드를 재부착하며 복제본은 제거합니다. 확장 재시작 뒤에도 동일 ID의 버튼은 하나입니다. cleanup에서 관찰자·타이머·이벤트·스타일·버튼을 제거합니다.
- `src/runtime.ts`: **플로팅 런처 표시** 설정은 기본 켜짐이며 `showLauncher`로 기존 설정 객체에 추가 저장합니다. 이 옵션만 바꾸면 메시지별 정규식 적용 선택은 유지합니다. 꺼도 메시지 큐브의 600ms 길게 누르기·우클릭 설정 진입은 유지합니다. 리모콘의 숨김 상태는 별도로 보존합니다. 런처로 연 전역 설정에서는 특정 메시지가 필요한 번역 작업 메뉴를 숨기며 Tab 순환에서도 제외합니다.
- `scripts/build.mjs`: 빌드·패키징 시 루트 manifest를 dist에 복사하고 dist 번들을 루트 **`extension.js`**로 복사합니다. 루트와 dist의 `manifest.json`, `extension.js`는 각각 바이트가 같습니다. 저장소 기본 주소를 사용하는 GitHub 확장 관리용 구조를 제공하며 기존 dist 폴더와 ZIP 루트 네 파일도 유지합니다.

### 검증과 산출물

- `tests/launcher.test.mjs`: 고정 ID/testid와 아이콘·44px CSS, 프로그램적 클릭 토글, 숨김 상태 클릭, 외부 숨김 클래스·스타일 보존, 재부착 시 노드 재사용·중복 제거, 설정 저장·재시작, 런처를 꺼도 메시지 큐브 길게 누르기로 설정 진입, 세로 드래그·composer/viewport 클램프, 후속 클릭 억제, 700ms 초기화·취소·cleanup 타이머 정리, composer 크기 변경·form fallback·visualViewport 대응을 검증합니다. 위치 검증은 jsdom의 가짜 측정값을 사용합니다.
- 패키지 테스트에 **루트/dist 설치 파일 바이트 일치** 검증을 추가했습니다. 기존 새니타이즈 테스트는 확장이 직접 만든 런처 스타일만 예외로 인정하며 사용자 번역 CSS의 head 유출 금지는 유지합니다.
- `scripts/browser-qa.mjs`: 360px에서 런처 44px·오른쪽 정렬·전송 버튼 히트 테스트, 세로 드래그·composer 비겹침, 숨겨진 런처의 프로그램적 클릭과 중앙 모달 검사를 추가했습니다. **브라우저 검증은 차단됨**: Chromium이 페이지 생성 전 crashpad `setsockopt: Operation not permitted` / SIGTRAP으로 종료했습니다. 완료된 브라우저 검사 0개이며 실제 모바일 레이아웃 통과를 주장하지 않습니다. 기록: `qa/browser-results.json`, `qa/browser-log.txt`.

- `npm test`: **120개 통과, 실패 0개, 생략 0개**. 기존 113개와 새 테스트 7개가 모두 통과했습니다. 기록: `qa/test-results.txt`.
- `npm run package`: 성공. ZIP **108,624바이트**, SHA-256 **`780324e571c7e2a6e912023d4a5667d4c033b77a790d6a8eb997c471c62c8c7c`**. ZIP CRC·루트 네 파일·dist 및 루트 설치 파일 바이트 일치·0.3.1 버전·참조 소스 SHA-256·로컬 절대경로 부재를 확인했습니다. `node --check` 번들/브라우저 QA 스크립트와 `git diff --check` 통과. 요약: `qa/final-verification.json`, `qa/package.json`.

### 제한 및 준수 사항

실제 Marinara·GitHub 확장 관리·말랑 리모콘 설치와 휴대폰 가상 키보드 환경은 미검증입니다. 알려진 wrapper와 편집기 fallback으로 composer를 감지하므로 다른 호스트 구조에서는 추가 확인이 필요합니다. CSS/jsdom 검증은 실제 기기 검증을 대체하지 않습니다.

외부 요청과 지정된 금지 경로·포트 접근 없이 작업했습니다. 산출물과 QA 로그에 로컬 절대경로를 남기지 않으며 QA 경로는 `<repo>`로 치환합니다. 기존 미커밋 변경을 유지했고 **git commit·push는 수행하지 않았습니다**.

## 0.3.2 Marinara Engine 2.5.2 재동기화

작성일: 2026-11-06. 참조: 읽기 전용 `marinara-engine-ref`, 태그 **v2.5.2**, 커밋 `fc0333c3fe978cda5e0b919bd6faec985901704e`. 확장 package/lock/manifest 버전은 **0.3.2**이며 manifest 스키마는 1입니다. 이 절은 이전 절의 출처 fallback 설명을 대체합니다.

### 변경 파일과 동작

- `scripts/import-reference.py`, `vendor/UPSTREAM.json`, `vendor/upstream/`: 문서의 import → test → package 절차를 따랐습니다. 기존 10개 중 `use-apply-regex.ts`, `chat-macros.ts`, `chat-html.ts`, `regex-safety.ts`, `macro-engine.ts` 5개가 변경되고 나머지 5개는 바이트가 같습니다. 새 매크로 엔진 의존성 `dice-notation.ts`와 그 런타임 의존성 `vendor/features/tactical-combat/rng.ts`를 원본 그대로 추가해 **12개 SHA-256**을 기록했습니다. RNG 위치는 dice 파일의 상대 import를 유지하기 위한 것입니다. 타입 전용 import는 esbuild가 제거합니다.
- `src/regex.ts`, `src/macros.ts`, `src/html-policy.ts`: 고정 줄 번호로 자르면 새 함수가 잘리는 문제를 해결하기 위해 importer를 이름 기반 경계 추출로 변경했습니다. 경계 검증은 쓰기 전에 수행하고 원본 줄 주석을 재생성합니다. 정규식 컴파일 캐시와 sticky lastIndex 초기화, 새 주사위 표기·안전성 검사가 반영되었습니다. 메시지 allowlist 내용은 동일하며 아티팩트 전용 SVG 허용은 번역 HTML에 추가하지 않았습니다.
- `src/data.ts`: 호스트 `ChatMessage.tsx:2840-2863`과 같이 채팅 변수(문자열만), 프리셋 변수 우선순위, 비활성 캐릭터 제외 그룹 문맥을 연결했습니다. 변수 쓰기는 resolver 내부 복사본에만 적용하며 서버/채팅 metadata를 변경하지 않습니다.
- `src/runtime.ts`, `src/translation.ts`: 호스트 `ChatMessage.tsx:2220-2223`의 `!isStreaming && (translationSource === undefined || translationSource === message.content)` 규칙에 맞췄습니다. 정의된 출처는 null/잘못된 타입을 포함해 정확히 일치해야 합니다. 별도 번역 칸에서만 출처 없는 구형 번역을 허용하고, 번역 전용 본문은 `:3509-3510`과 같이 정확한 출처 일치가 필요합니다. `translationPolisherLongSource`는 불일치 우회로 사용하지 않습니다. 자동 이어 번역의 출처 확인도 같은 기준을 사용합니다.
- 관련 DOM 변경을 감지한 MutationObserver에서 이전 확장 표시를 즉시 제거합니다. 새 스와이프/본문이 바뀌었는데 API 재조회가 지연되는 동안 이전 패널이 남지 않도록 했습니다. 호스트 스토어 생성 이벤트는 동기적으로 제거하며, 공개 스토어가 없으면 기존 same-origin 생성 상태 폴링으로 확인합니다. DOM/스토어 이벤트 없이 API만 바뀌는 경우에는 기존 약 2초 폴링 지연이 남습니다.
- `ChatMessage.tsx:3513-3517`은 번역 뒤에 인라인 명령 결과를 붙입니다. `RoleplayCommandResults.tsx`와 `ChatMessage.tsx:3314-3357`의 주사위·귓속말·삽화·아티팩트 data 표식을 감지하면 **호스트 본문 전체를 유지**합니다. 비대화형 주사위/SVG 아티팩트도 숨기지 않으며 결과 순서·노드·이벤트를 보존합니다. 이런 본문에는 정규식을 적용하지 않는 보수적 fallback이고, 별도 번역 칸은 계속 적용할 수 있습니다.
- `tests/resync.test.mjs` 회귀 9개 추가, `tests/package.test.mjs` 해시 경로/버전 갱신, `tests/translation.test.mjs` 출처 기준 갱신. `README.md`, `CHANGELOG.md`, `NOTICE`, package/lock/manifest, 브라우저 QA 버전과 로그를 갱신하고 루트·dist·ZIP을 재생성했습니다.

### 검증

- **`npm test`: 129개 통과, 실패 0, 생략 0.** 기존 120개 + 새 회귀 9개. 기록: `qa/test-results.txt`. 스코프 49조합 및 스코프/대상/프리셋/깊이 720조합의 원본 함수 비교도 기존 테스트에 포함됩니다.
- 새 회귀: 별도/번역 전용의 출처 누락·일치·불일치·null·잘못된 타입, polisher 우회 차단, 지연 API 동안 새 스와이프의 이전 표시 제거, 스트리밍 중 지연 응답 거부, 완료 후 출처 재확인, 네 명령 결과의 원래 노드·순서·이벤트 보존, 별도 번역 칸과 명령 결과 공존, sticky 캐시 재사용, 중첩 대안 안전성, 주사위 표기·시드, 채팅 변수/그룹 문맥을 검증했습니다.
- 로컬 의존성이 없어 임시 디렉터리에 복사한 npm 캐시만 사용했습니다. `npm ci --offline`은 기존 lockfile의 선택 의존성 누락으로 실패했고, `npm install --offline --ignore-scripts --no-audit --no-fund`는 성공했습니다. 의존성 버전은 바꾸지 않았습니다. 테스트 API는 메모리 fixture이며 외부 네트워크 요청 없이 실행했습니다.
- importer 재실행의 **멱등성 통과**. 참조 원본/동봉 파일/기록된 해시 **12개 모두 일치**, 기존 파일 변경 **5개**, 새 의존성 **2개** 확인.
- **`npm run package` 성공.** ZIP 112,345바이트, SHA-256 `18be478141df7d0ab64256e7c18052714a0f09b25885598eaed9661072d6207c`. ZIP CRC·루트 네 파일·root/dist 바이트 일치·0.3.2 버전·산출물의 로컬 절대경로 부재 확인. 패키지 테스트의 결정성 검사 통과. `node --check` 루트/dist 번들·브라우저 QA 스크립트 및 `git diff --check` 통과. 요약: `qa/final-verification.json`, `qa/package.json`.
- **`npm run qa:browser`: 차단, 완료 검사 0개.** Chromium이 페이지 생성 전에 crashpad `setsockopt: Operation not permitted` / SIGTRAP으로 종료했습니다. `qa/browser-results.json`, `qa/browser-log.txt`에 기록했습니다. 실제 브라우저 레이아웃 통과를 주장하지 않습니다.

### 찹쌀의 QA 확인 항목

1. QA 인스턴스 2.5.2에서 0.3.2 ZIP을 가져오고 별도 번역 칸/번역 전용 모드 각각 수동 큐브와 자동 적용을 확인합니다. DEM/Sola 등의 실제 규칙이 현재 번역에 적용되는지 확인합니다.
2. 번역된 메시지에서 새 스와이프 생성·기존 스와이프 이동·원문 편집을 수행합니다. 생성 중 또는 출처 불일치 상태에 이전 번역 패널이 남거나 지연 응답으로 다시 나타나지 않아야 합니다. 완료 후 현재 원문으로 새 번역하면 다시 적용되어야 합니다.
3. 번역 전용 본문에 주사위·귓속말·삽화·아티팩트를 각각 포함합니다. 호스트 번역 뒤 결과 순서가 유지되고 누락/중복 없이 표시되며 귓속말/이미지 컨트롤이 동작해야 합니다. 이 경우 확장은 본문 정규식을 건너뛰는 것이 의도된 동작입니다.
4. 다듬기 결과의 `translationSource`가 현재 원문과 같은 경우 적용하고, `translationPolisherLongSource`만 같은 경우 이전 번역을 강제로 표시하지 않는지 확인합니다. 대화 모드의 기존 중복 적용 방지와 이어서/나눠 번역 저장도 확인합니다.
5. 실제 휴대폰/360px에서 큐브·런처·설정 모달·가상 키보드 및 말랑 리모콘 숨김 상태 클릭을 확인합니다. 실제 React 갱신·공급자 연동·모바일 배치는 여기서 실행하지 않았습니다.

QA 인스턴스는 접근/수정하지 않았습니다. 변경은 이 저장소와 임시 디렉터리에만 했고 참조 소스는 읽기 전용으로 사용했습니다. 금지 경로·context 텍스트·포트·호스트에 접근하지 않았으며 **commit/push는 수행하지 않았습니다**.
