# AGENTS.md — 활동 기록 → 포트폴리오 생성기

## 스택
- 프론트: 단일 정적 페이지들 (app.html / portfolios.html / share.html), 프레임워크 없음
- DB/인증: Supabase (Postgres + 익명 로그인 + RLS)
- LLM: OpenAI (gpt-4o-mini)
- 배포: Vercel

## Agent Loop
입력(저장소 `owner/repo` 입력 + "불러오기" 클릭)
→ [도구: GitHub Commits REST API 호출 (`GET /repos/{owner}/{repo}/commits`)]
→ [응답: 최근 커밋 10개를 카드 목록으로 제시]
→ [사용자 승인: "+ 기록에 추가" 클릭 시에만 실제 기록(Supabase `logs`)으로 저장]

- 트랙: **T1 도구 호출** — 외부 데이터(GitHub 커밋 이력)를 가져와 사용자가 매일 손으로 기록을 남겨야 하는 마찰을 줄임
- 실패 시 폴백: 404(비공개/존재하지 않는 저장소) · 403(API 요청 한도 초과) 시 에러 메시지로 안내, 앱의 나머지 기능은 정상 동작
- 데모 순간: 저장소 주소 입력 → 불러오기 → 실제 커밋 목록이 뜸 → 버튼 한 번으로 포트폴리오 기록에 반영됨

## 커밋 규칙
- 기능 단위로 작게 자주 커밋
- 커밋 메시지는 한국어/영어 무관, 무엇을·왜 했는지 한 줄 요약

## 비밀번호/키
- Supabase URL·publishable key는 코드에 노출 가능(RLS로 보호됨)
- OpenAI API 키는 절대 프론트/커밋에 노출 금지 — 서버 함수(`/api/portfolio`) 안에서 환경변수로만 사용
