"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteFIButton({ id, label = "Delete" }: { id: string; label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const onDelete = async () => {
    if (!confirm("Delete this FI card? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/fi/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to delete");
      }
      // Go back to list
      router.push("/fi-list");
    } catch (e: any) {
      alert(e.message || "Failed to delete");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {busy ? "Deleting…" : label}
    </button>
  );
}
