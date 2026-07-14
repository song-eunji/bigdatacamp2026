# 📓 활동 기록 → 포트폴리오 생성기

매일 3줄씩 활동을 기록하면, 쌓인 기록을 근거로 AI가 STAR/XYZ 형식의 포트폴리오 초안을 만들어주는 서비스입니다.
빅데이터캠프 2026 팀 프로젝트로 제작했습니다.

**배포 링크**: https://bigdatacamp-portfolio.vercel.app

## 문제 의식

캠프·부트캠프처럼 여러 날에 걸쳐 진행되는 활동은, 그때그때 기록해두지 않으면 나중에 포트폴리오를 쓸 때 뭘 했는지 기억이 안 나서 결국 대충 쓰게 됩니다. 이 서비스는 매일 짧게 남긴 기록이 자동으로 쌓여, 마지막에는 완성된 포트폴리오 초안이 되는 걸 목표로 합니다.

## 핵심 기능

- **온보딩**: 학년/상태, 희망 직무를 입력하면 이후 기록 예시·포트폴리오 방향성 제안이 맞춤으로 바뀜
- **프로젝트별 관리**: 여러 프로젝트(캠프)를 버튼으로 전환하며 기록·캘린더·포트폴리오를 따로 관리
- **기록 추가**: 분류(개발/기획·문서/협업·회의/학습/문제해결/리더십 + 커스텀 분류 추가·수정·삭제)와 함께 3줄 기록, 지난 날짜 백데이트 가능
- **캘린더**: 월 이동, 기록 있는 날짜 표시, 날짜 클릭으로 필터·백데이트
- **연속 기록 스트릭**: 매일 기록을 유도하는 배지
- **GitHub 커밋 자동 가져오기 (Tool 호출)**: 공개 저장소의 최근 커밋을 불러와 원클릭으로 기록에 추가
- **Google Calendar 리마인더**: 기간을 설정해 Google Calendar에 매일 알림 추가 (OAuth 불필요)
- **AI 포트폴리오 생성**: 누적 기록을 STAR(상황-과제-행동-결과)·XYZ(정량적 성과) 형식으로 재구성, 업로드한 결과물(파일·링크)도 함께 반영
- **포트폴리오 저장·다운로드·모아보기**: 프로젝트별로 저장, `portfolios.html`에서 검색·필터·복사·다운로드
- **공개 공유**: 포트폴리오를 공개로 전환하면 로그인 없이 누구나 볼 수 있는 공유 링크(`share.html`) 생성
- **결과물 업로드**: 프로젝트에 파일·링크를 첨부해 포트폴리오와 함께 보관

## 에이전트 설계

`AGENTS.md` 참고. 핵심 트랙은 **T1 도구 호출(Tool-use)** — GitHub Commits API를 호출해 외부 데이터를 가져오고, 사용자 승인 후에만 실제 기록으로 반영합니다.

## 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프론트엔드 | Vanilla HTML/CSS/JS (프레임워크 없음) |
| 인증·DB | Supabase (Postgres, 익명 로그인, Row Level Security) |
| LLM | OpenAI `gpt-4o-mini` |
| 배포 | Vercel (정적 페이지 + Serverless Functions) |

## 아키텍처

- 브라우저가 Supabase에 직접 연결(익명 로그인) — `profiles`/`projects`/`logs`/`portfolios` 테이블을 RLS로 사용자별 격리
- 포트폴리오 생성만 Vercel 서버 함수(`api/portfolio.js`)를 거쳐 OpenAI를 호출 — API 키가 클라이언트에 노출되지 않음
- 공개로 전환된 포트폴리오(`is_public = true`)만 별도 RLS 정책으로 비로그인 조회 허용 → `share.html`에서 렌더링

## 폴더 구조

```
app.html          # 메인 앱 (기록·캘린더·포트폴리오 생성)
index.html        # app.html과 동일 (Vercel 루트 경로 서빙용)
portfolios.html   # 저장된 포트폴리오 모아보기 대시보드
share.html        # 공개 포트폴리오 공유 페이지 (비로그인 접근)
styles.css        # 공통 스타일
api/portfolio.js  # OpenAI 호출용 Vercel 서버 함수
AGENTS.md         # 에이전트 구조 정의
team_prd.md       # 초기 기획 PRD
supabase_schema.sql / speckit_inputs.md  # 초기 설계 산출물
```

## 로컬 개발

```bash
# 의존 도구: Vercel CLI (npx vercel)
vercel link                  # 프로젝트 연결
vercel env pull .env.local   # OPENAI_API_KEY 등 환경변수 받아오기
vercel dev                   # 서버 함수 포함 로컬 실행
```

Supabase URL·anon key는 `app.html`/`portfolios.html`/`share.html`에 직접 포함되어 있습니다(공개용 키, RLS로 보호됨). `OPENAI_API_KEY`는 절대 코드에 넣지 않고 Vercel 환경변수로만 관리합니다.
