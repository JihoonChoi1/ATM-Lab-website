import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guard";
import TopicForm from "../_components/TopicForm";

export const metadata: Metadata = { title: "새 토픽 · ATM Lab" };

// Reads the session cookie → never cache.
export const dynamic = "force-dynamic";

export default async function NewTopicPage() {
  await requireAdmin("/admin/research/new");

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">새 토픽</h1>
        <p className="mt-1 text-sm text-ink-3">
          저장하면 목록에 추가됩니다. 이후 토픽을 열어 서브섹션을 추가하세요.
        </p>
      </div>
      <TopicForm cancelHref="/admin/research" />
    </div>
  );
}
