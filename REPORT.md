# 작업 보고서 — 번역문 표시 정규식 개인 확장

작성일: 2026-10-29
내부 키: `translation_regex_me`

아래 기존 내용은 0.1 작업 기록입니다. 최신 변경·검증·제한 사항은 마지막 **0.2.0 실사용 피드백 반영** 절을 기준으로 합니다.

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
