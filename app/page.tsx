import { Suspense } from "react";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">오늘 배운 한 줄</h1>
        <p className="text-sm text-zinc-500">
          하루에 하나, 배운 것을 한 줄로 남겨 보세요.
        </p>
      </header>

      <PostForm />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">최근 기록</h2>
        <Suspense
          fallback={<p className="text-sm text-zinc-500">불러오는 중…</p>}
        >
          <PostList />
        </Suspense>
      </section>
    </main>
  );
}
