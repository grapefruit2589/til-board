"use client";

import { useActionState } from "react";
import { createPost, type PostFormState } from "@/app/actions";
import { CONTENT_MAX, NICKNAME_MAX } from "@/lib/validation";

const initialState: PostFormState = {
  status: "idle",
  message: "",
  values: { nickname: "", content: "" },
};

export default function PostForm() {
  const [state, formAction, pending] = useActionState(createPost, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <label className="flex flex-col gap-1 text-sm font-medium">
        닉네임 <span className="sr-only">(최대 {NICKNAME_MAX}자)</span>
        <input
          name="nickname"
          required
          defaultValue={state.values.nickname}
          placeholder={`최대 ${NICKNAME_MAX}자`}
          className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-base font-normal outline-none focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-200"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        오늘 배운 한 줄 <span className="sr-only">(최대 {CONTENT_MAX}자)</span>
        <textarea
          name="content"
          required
          rows={2}
          defaultValue={state.values.content}
          placeholder={`최대 ${CONTENT_MAX}자`}
          className="resize-none rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-base font-normal outline-none focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-200"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {pending ? "저장 중…" : "남기기"}
      </button>

      {state.message && (
        <p
          role="status"
          className={
            state.status === "error"
              ? "text-sm text-red-600 dark:text-red-400"
              : "text-sm text-green-700 dark:text-green-400"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
