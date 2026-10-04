# 새로운 삶의 시작 · The Beginning of a New Life

맨하탄선교교회(Manhattan Mission Church) 6주 새신자 제자양육 교재의 한국어·영어 인터랙티브 웹판입니다.

## 구성

1. 그리스도와 동행하는 새 삶의 시작
2. 그리스도와 교제하는 새 삶의 시작
3. 성령 안에서 살아가는 새 삶의 시작
4. 그리스도 안에서 자라가는 새 삶의 시작
5. 하나님의 말씀 안에서 사는 새 삶의 시작
6. 기도하는 새 삶의 시작

## 사용법

`index.html`을 브라우저에서 열면 바로 사용할 수 있습니다. 별도 서버나 설치가 필요하지 않습니다.

- 한국어·English 전환 및 한국어 + English 병렬 보기
- 병렬 보기: 데스크톱에서 페이지별 두 열, 휴대폰에서 한국어 다음 영어 표시
- 병렬 보기의 답안·인도자 메모는 기존 언어별 저장 기록을 사용하며 양쪽 답안을 하나의 문서로 저장
- 6주 과정 탐색
- 질문별 맞춤 답칸과 예/아니요 선택
- 짧은 답·문장 답·묵상 답에 맞춘 세 단계 답안 공간
- 답안 자동 저장
- YouVersion 본문 패널(한국어 현대인의 성경 KLB·영어 NIV)과 다른 한국어 번역본 링크
- 주차별 답안 JSON 내려받기
- 인쇄용 화면
- 모바일·태블릿·데스크톱 반응형 구성
- 역할별 여섯 단계 타이포그래피와 웹 전용 믿음의 기관차 도표

## 검수 정보

- 한국어 PDF: 48쪽
- 영어 PDF: 48쪽
- 웹 학습 범위: 한국어/영어 각각 1과 4–7쪽, 2과 10–13쪽, 3과 16–27쪽, 4과 30–33쪽, 5과 36–39쪽, 6과 42–47쪽
- 영어 성경 인용은 제공된 영문 원고의 NIV 표기를 그대로 유지했습니다.
- 교재 안 본문 패널은 한국어 KLB(86)와 영어 NIV(111)를 사용합니다. 새번역·개역한글·읽기 쉬운 성경·우리말성경은 Bible.com 공식 구절 링크로 제공합니다.

제공된 교재에 공식 정답지가 포함되어 있지 않아 웹판도 정답을 임의로 만들지 않습니다. 개인 답안은 브라우저 안에 저장되며 내려받기는 제출이 아닙니다.

## GitHub Pages 배포

이 폴더의 파일을 GitHub 저장소 `main` 브랜치의 최상위에 올립니다. 저장소의 **Settings → Pages**에서 **Deploy from a branch**, `main`, `/(root)`를 선택하면 웹사이트로 공개할 수 있습니다.

## YouVersion 본문 패널 설정

GitHub Pages의 JavaScript와 설정 파일은 누구나 읽을 수 있으므로 YouVersion 앱 키를 저장소나 브라우저 코드에 넣지 않습니다. 이 프로젝트의 Supabase Edge Function `youversion`이 허용된 성경 본문 요청만 대신 전송합니다.

1. `supabase/functions/youversion`을 연결된 Supabase 프로젝트에 배포합니다.
2. Supabase의 **Edge Functions → Secrets**에서 `YOUVERSION_APP_KEY`를 추가합니다.
3. `supabase/config.toml`의 `verify_jwt = false`를 유지하여 로그인하지 않은 학습자도 본문을 읽게 합니다.
4. `youversion-config.js`의 `apiBase`가 배포된 프로젝트의 Function URL을 가리키는지 확인합니다.

Edge Function은 다음 요청만 허용합니다.

- 현대인의 성경 KLB(86)와 NIV(111)
- 성경 버전 정보, 특정 구절, 장의 절 목록
- `https://hunsuk1977.github.io`에서 시작된 읽기 요청

앱 키를 `youversion-config.js`, HTML, JavaScript, GitHub Actions 파일 또는 Supabase 설정 파일에 넣지 마세요.
