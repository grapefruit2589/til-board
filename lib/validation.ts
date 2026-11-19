export const NICKNAME_MAX = 20;
export const CONTENT_MAX = 140;

export type ValidPost = { nickname: string; content: string };

export type ValidationResult =
  | { ok: true; value: ValidPost }
  | { ok: false; error: string };

// Count code points (matches Postgres char_length), so emoji count as 1.
function charLength(value: string): number {
  return Array.from(value).length;
}

export function validatePost(
  rawNickname: unknown,
  rawContent: unknown,
): ValidationResult {
  const nickname = typeof rawNickname === "string" ? rawNickname.trim() : "";
  const content = typeof rawContent === "string" ? rawContent.trim() : "";

  if (charLength(nickname) === 0) {
    return { ok: false, error: "닉네임을 입력해 주세요." };
  }
  if (charLength(nickname) > NICKNAME_MAX) {
    return { ok: false, error: `닉네임은 ${NICKNAME_MAX}자 이하로 입력해 주세요.` };
  }
  if (charLength(content) === 0) {
    return { ok: false, error: "내용을 입력해 주세요." };
  }
  if (charLength(content) > CONTENT_MAX) {
    return { ok: false, error: `내용은 ${CONTENT_MAX}자 이하로 입력해 주세요.` };
  }

  return { ok: true, value: { nickname, content } };
}
