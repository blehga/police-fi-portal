"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";

type Props = {
  fiId: string;
  initialShared: boolean;
};

export default function FiShareToggle({ fiId, initialShared }: Props) {
  const router = useRouter();
  const [isShared, setIsShared] = useState(initialShared);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tooltip = isShared
    ? "Shared: Click to make it private (only you can access it)"
    : "Private: Click to share with other FI users (view only)";

  const onToggle = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/fi/${fiId}/share`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isShared: !isShared }),
      });

      const raw = await res.text();
      let data: any = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Failed to update share status");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update share status");
      }

      setIsShared(!!data.isShared);
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Failed to update share status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        disabled={saving}
        title={tooltip}
        className={`inline-flex items-center justify-center h-10 rounded-xl px-3 font-medium shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed ${
          isShared
            ? "bg-amber-500 text-white hover:bg-amber-600"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        }`}
      >
        {saving ? "Saving..." : isShared ? "Private" : "Share"}

        <HelpCircle className="ml-2 h-4 w-4 opacity-70" />
      </button>

      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </div>
  );
}