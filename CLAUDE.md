# CLAUDE.md — TIL Board (오늘 배운 한 줄)

## 프로젝트
닉네임(1~20자)과 한 줄 메모(1~140자)를 Supabase에 저장하고 최신순(최대 50개)으로 보여주는 초간단 웹앱.
기획은 `IDEA.md`, 단계별 절차는 `업무지침서.md`를 따른다.

## 스택
- Next.js (App Router) + TypeScript(strict) + Tailwind CSS
- Supabase (Postgres + RLS, `@supabase/supabase-js`)
- Vercel (GitHub 연동 자동 배포)

## 명령어
- `npm run dev` — 개발 서버 (http://localhost:3000)
- `npm run build` — 프로덕션 빌드 (배포 전 반드시 통과)
- `npm run lint` — ESLint 검사

## 환경변수 (.env.local, Vercel에 같은 이름으로 등록)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (없으면 `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 작업 규칙
1. 새 작업은 Plan 모드로 계획을 먼저 제시하고, 승인 후 구현한다.
2. 한 번에 한 기능만 변경한다.
3. 에러는 로그를 읽고 수정·재실행을 반복하되, 3회 연속 실패하면 상황을 요약해 사용자에게 보고한다.
4. 요구하지 않은 기능과 라이브러리를 추가하지 않는다 (MVP 범위 유지).
5. DB 스키마 변경은 `supabase/schema.sql`에 반영하고 이유를 설명한다.
6. 사용자 입력은 서버와 DB 양쪽에서 검증한다 (닉네임 20자 이하, 내용 140자 이하, 직전 글과 같은 내용 거부).
7. 비밀키(secret, service_role)는 코드·저장소·채팅 어디에도 넣지 않는다. `.env.local`은 커밋하지 않는다.
8. 보안 검사를 끄는 방식의 해결책은 쓰지 않는다.
9. 커밋, 푸시, 배포는 사용자가 요청할 때만 한다.

## 코딩 컨벤션
- TypeScript strict, 함수형 컴포넌트, 파일당 컴포넌트 하나
- UI 문구는 한국어, 코드와 변수명은 영어

## 완료 기준 (Definition of Done)
- [ ] `npm run build` 성공, 린트 오류 없음
- [ ] 글 작성 후 목록에 즉시 반영
- [ ] 빈 값이나 길이 초과 시 오류 메시지 표시
- [ ] 모바일 폭(375px)에서 레이아웃 정상
- [ ] 비밀키가 저장소에 없음
