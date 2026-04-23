"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Unlock } from "lucide-react";

type Props = {
  caseId: string;
  fiFormId: string;
  initialShared: boolean;
};

export default function CaseFIShareToggle({
  caseId,
  fiFormId,
  initialShared,
}: Props) {
  const router = useRouter();
  const [isShared, setIsShared] = useState(initialShared);
  const [saving, setSaving] = useState(false);

  const onToggle = async () => {
    if (saving) return;

    setSaving(true);

    try {
      const res = await fetch(`/api/cases/${caseId}/forms/fi/${fiFormId}/share`, {
        method: "PATCH",
      });

      const raw = await res.text();
      let data: any = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Failed to update FI sharing");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update FI sharing");
      }

      setIsShared(Boolean(data.isShared));
      router.refresh();
    } catch (error: any) {
      alert(error?.message || "Failed to update FI sharing");
    } finally {
      setSaving(false);
    }
  };

  const shared = isShared;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={saving}
      title={
        shared
          ? "Private: only you can access this FI form"
          : "Share: all users can see this FI form in the case"
      }
      className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
        shared
          ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      }`}
    >
      {saving ? (
        <span>...</span>
      ) : shared ? (
        <>
          <Unlock className="h-4 w-4" />
          <span>Shared</span>
        </>
      ) : (
        <>
          <Lock className="h-4 w-4" />
          <span>Private</span>
        </>
      )}
    </button>
  );
}