import { connection } from "next/server";
import { getSupabase, type TilPost } from "@/lib/supabase";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Seoul",
});

export default async function PostList() {
  await connection();

  let posts: TilPost[] = [];
  try {
    const { data, error } = await getSupabase()
      .from("til_posts")
      .select("id, nickname, content, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    posts = (data ?? []) as TilPost[];
  } catch (err) {
    console.error("PostList fetch failed:", err);
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        목록을 불러오지 못했어요. 잠시 후 새로고침해 주세요.
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-center text-sm text-zinc-500">
        아직 기록이 없어요. 첫 번째 한 줄을 남겨 보세요!
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {posts.map((post) => (
        <li
          key={post.id}
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <p className="whitespace-pre-wrap break-words">{post.content}</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 text-xs text-zinc-500">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {post.nickname}
            </span>
            <time dateTime={post.created_at}>
              {dateFormatter.format(new Date(post.created_at))}
            </time>
          </div>
        </li>
      ))}
    </ul>
  );
}
