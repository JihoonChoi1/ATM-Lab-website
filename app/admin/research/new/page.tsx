import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guard";
import TopicForm from "../_components/TopicForm";

export const metadata: Metadata = { title: "New topic · ATM Lab" };

// Reads the session cookie → never cache.
export const dynamic = "force-dynamic";

export default async function NewTopicPage() {
  await requireAdmin("/admin/research/new");

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">New topic</h1>
        <p className="mt-1 text-sm text-ink-3">
          Saving adds it to the list. Then open the topic to add subsections.
        </p>
      </div>
      <TopicForm cancelHref="/admin/research" />
    </div>
  );
}
