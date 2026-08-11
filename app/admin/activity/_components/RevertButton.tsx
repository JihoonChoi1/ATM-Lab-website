"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { revertAudit } from "../actions";

// Lives inside an audit row's details disclosure. Only the log id crosses the
// wire — the action re-reads the log row server-side.

export default function RevertButton({
  logId,
  kind,
}: {
  logId: string;
  kind: "revert" | "restore";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const revert = kind === "revert";

  return (
    <button
      onClick={() => {
        if (
          !window.confirm(
            revert
              ? "Revert this change to its previous value?"
              : "Restore the deleted row?",
          )
        )
          return;
        startTransition(async () => {
          const error = await revertAudit(logId);
          if (error) window.alert(error);
          router.refresh();
        });
      }}
      disabled={isPending}
      className="mt-2 rounded-xl border border-accent/30 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent-soft disabled:opacity-50"
    >
      {isPending ? "Processing…" : revert ? "Revert to previous value" : "Restore this row"}
    </button>
  );
}
