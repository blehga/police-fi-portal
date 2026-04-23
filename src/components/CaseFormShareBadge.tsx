"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Unlock } from "lucide-react";

type SupportedFormType = "FI" | "NARRATIVE";

type Props = {
  caseId: string;
  formId: string;
  formType: SupportedFormType;
  initialShared: boolean;
};

function getShareUrl(
  caseId: string,
  formId: string,
  formType: SupportedFormType
) {
  if (formType === "FI") {
    return `/api/cases/${caseId}/forms/fi/${formId}/share`;
  }

  return `/api/cases/${caseId}/forms/narrative/${formId}/share`;
}

export default function CaseFormShareBadge({
  caseId,
  formId,
  formType,
  initialShared,
}: Props) {
  const router = useRouter();
  const [isShared, setIsShared] = useState(initialShared);
  const [saving, setSaving] = useState(false);

  const onToggle = async () => {
    if (saving) return;

    setSaving(true);

    try {
      const res = await fetch(getShareUrl(caseId, formId, formType), {
        method: "PATCH",
      });

      const raw = await res.text();
      let data: any = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Failed to update sharing");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update sharing");
      }

      setIsShared(Boolean(data.isShared));
      router.refresh();
    } catch (error: any) {
      alert(error?.message || "Failed to update sharing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={saving}
      title={
        isShared
          ? "Shared: click to make private"
          : "Private: click to share"
      }
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${
        isShared
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
      } ${saving ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {saving ? (
        <span className="text-xs">...</span>
      ) : isShared ? (
        <Unlock className="h-4 w-4" />
      ) : (
        <Lock className="h-4 w-4" />
      )}
    </button>
  );
}