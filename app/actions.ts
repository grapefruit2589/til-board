"use server";

import { refresh } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import { validatePost } from "@/lib/validation";

export type PostFormState = {
  status: "idle" | "success" | "error";
  message: string;
  values: { nickname: string; content: string };
};

const DUPLICATE_MESSAGE = "직전 글과 같은 내용은 올릴 수 없어요.";

export async function createPost(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const rawNickname = formData.get("nickname");
  const rawContent = formData.get("content");
  const values = {
    nickname: typeof rawNickname === "string" ? rawNickname : "",
    content: typeof rawContent === "string" ? rawContent : "",
  };

  const result = validatePost(rawNickname, rawContent);
  if (!result.ok) {
    return { status: "error", message: result.error, values };
  }
  const { nickname, content } = result.value;

  try {
    const supabase = getSupabase();

    const { data: latest, error: latestError } = await supabase
      .from("til_posts")
      .select("content")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (latestError) throw latestError;

    if (latest && latest.content.trim() === content) {
      return { status: "error", message: DUPLICATE_MESSAGE, values };
    }

    const { error } = await supabase
      .from("til_posts")
      .insert({ nickname, content });

    if (error) {
      if (error.message.includes("duplicate_content")) {
        return { status: "error", message: DUPLICATE_MESSAGE, values };
      }
      if (error.code === "23514") {
        return {
          status: "error",
          message: "입력값이 올바르지 않아요. 길이를 확인해 주세요.",
          values,
        };
      }
      throw error;
    }
  } catch (err) {
    console.error("createPost failed:", err);
    return {
      status: "error",
      message: "저장에 실패했어요. 잠시 후 다시 시도해 주세요.",
      values,
    };
  }

  refresh();
  return {
    status: "success",
    message: "기록했어요!",
    values: { nickname, content: "" },
  };
}
