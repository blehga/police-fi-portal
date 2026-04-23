"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ShareToggle from "@/components/ShareToggle";

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

function getFormLabel(formType: SupportedFormType) {
  return formType === "FI" ? "FI" : "Narrative";
}

export default function CaseFormShareToggle({
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
        throw new Error(raw || `Failed to update ${getFormLabel(formType)} sharing`);
      }

      if (!res.ok) {
        throw new Error(
          data?.error || `Failed to update ${getFormLabel(formType)} sharing`
        );
      }

      setIsShared(Boolean(data.isShared));
      router.refresh();
    } catch (error: any) {
      alert(
        error?.message || `Failed to update ${getFormLabel(formType)} sharing`
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ShareToggle
      checked={isShared}
      onChange={onToggle}
      disabled={saving}
    />
  );
}