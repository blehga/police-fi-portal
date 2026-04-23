"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ShareToggle from "@/components/ShareToggle";
import RichTextEditor from "@/components/RichTextEditor";

type CaseHeader = {
  id: string;
  caseNumber: string;
  incidentType: string;
  incidentDate: string | null;
  incidentTime: string | null;
  incidentLocation: string | null;
};

type CaseSharedState = {
  caseNumber: string;
  incidentType: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
};

type NarrativeFormState = {
  content: string;
  officerName: string;
  officerId: string;
  beat: string;
  narrativeDate: string;
  narrativeDay: string;
  narrativeTime: string;
};

type EditNarrativeResponse = {
  caseFormId: string;
  narrativeId: string;
  isShared?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  content: string;
  officerName: string;
  officerId: string;
  beat: string;
  narrativeDate: string;
  narrativeDay: string;
  narrativeTime: string;
};

const initialForm: NarrativeFormState = {
  content: "",
  officerName: "",
  officerId: "",
  beat: "",
  narrativeDate: "",
  narrativeDay: "",
  narrativeTime: "",
};

function getCurrentTimeString() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

const getCurrentDateString = () => {
  return new Date().toISOString().split("T")[0];
};

function getDayFromDate(dateStr: string) {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return "";

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export default function EditNarrativePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const caseId = params.id as string;
  const narrativeId = params.narrativeId as string;
  const router = useRouter();

  const isViewMode = searchParams.get("view") === "1";

  const [caseData, setCaseData] = useState<CaseHeader | null>(null);
  const [caseFormData, setCaseFormData] = useState<CaseSharedState>({
    caseNumber: "",
    incidentType: "",
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
  });

  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [shareSaving, setShareSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<NarrativeFormState>(initialForm);
  const [canEditRecord, setCanEditRecord] = useState(true);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingPage(true);
        setError(null);

        const [caseRes, narrativeRes] = await Promise.all([
          fetch(`/api/cases/${caseId}`, { cache: "no-store" }),
          fetch(`/api/cases/${caseId}/forms/narrative/${narrativeId}`, {
            cache: "no-store",
          }),
        ]);

        if (!caseRes.ok) {
          throw new Error("Failed to load case");
        }

        if (!narrativeRes.ok) {
          const raw = await narrativeRes.text();
          let payload: any = {};

          try {
            payload = raw ? JSON.parse(raw) : {};
          } catch {
            throw new Error(raw || "Failed to load Narrative form");
          }

          throw new Error(payload?.error || "Failed to load Narrative form");
        }

        const caseJson = await caseRes.json();
        const narrativeJson: EditNarrativeResponse = await narrativeRes.json();

        setCaseData({
          id: caseJson.id,
          caseNumber: caseJson.caseNumber,
          incidentType: caseJson.incidentType ?? "",
          incidentDate: caseJson.incidentDate ?? null,
          incidentTime: caseJson.incidentTime ?? null,
          incidentLocation: caseJson.incidentLocation ?? null,
        });

        setCaseFormData({
          caseNumber: caseJson.caseNumber,
          incidentType: caseJson.incidentType ?? "",
          incidentDate: caseJson.incidentDate ?? "",
          incidentTime: caseJson.incidentTime ?? "",
          incidentLocation: caseJson.incidentLocation ?? "",
        });

        const narrativeDateValue = narrativeJson.narrativeDate ?? "";

        setForm({
          content: narrativeJson.content ?? "",
          officerName: narrativeJson.officerName ?? "",
          officerId: narrativeJson.officerId ?? "",
          beat: narrativeJson.beat ?? "",
          narrativeDate: narrativeDateValue,
          narrativeDay: narrativeDateValue
            ? getDayFromDate(narrativeDateValue)
            : narrativeJson.narrativeDay ?? "",
          narrativeTime: narrativeJson.narrativeTime ?? "",
        });

        setCanEditRecord(Boolean(narrativeJson.canEdit ?? true));
        setIsShared(Boolean(narrativeJson.isShared ?? false));
      } catch (err: any) {
        setError(err.message || "Failed to load Narrative form");
      } finally {
        setLoadingPage(false);
      }
    }

    if (caseId && narrativeId) {
      loadData();
    }
  }, [caseId, narrativeId]);

  const readOnlyMode = isViewMode || !canEditRecord;

  const incidentDay = useMemo(
    () => getDayFromDate(caseFormData.incidentDate),
    [caseFormData.incidentDate]
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (readOnlyMode) return;

    const { name, value } = e.target;

    if (name === "narrativeDate") {
      setForm((prev) => ({
        ...prev,
        narrativeDate: value,
        narrativeDay: getDayFromDate(value),
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const canSubmit = useMemo(() => {
    return !readOnlyMode && !loading && !!form.content.trim();
  }, [readOnlyMode, loading, form.content]);

  const handleToggleShare = async () => {
    if (!canEditRecord || shareSaving) return;

    setShareSaving(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/cases/${caseId}/forms/narrative/${narrativeId}/share`,
        {
          method: "PATCH",
        }
      );

      const raw = await res.text();
      let payload: any = {};

      try {
        payload = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Failed to update Narrative sharing");
      }

      if (!res.ok) {
        throw new Error(payload?.error || "Failed to update Narrative sharing");
      }

      setIsShared(Boolean(payload.isShared));
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update Narrative sharing");
    } finally {
      setShareSaving(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (readOnlyMode) return;

    setLoading(true);
    setError(null);

    try {
      const caseRes = await fetch(`/api/cases/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentType: caseFormData.incidentType,
          incidentDate: caseFormData.incidentDate || null,
          incidentTime: caseFormData.incidentTime || null,
          incidentLocation: caseFormData.incidentLocation || null,
        }),
      });

      const caseRaw = await caseRes.text();
      let casePayload: any = {};

      try {
        casePayload = caseRaw ? JSON.parse(caseRaw) : {};
      } catch {
        throw new Error(caseRaw || "Failed to update case");
      }

      if (!caseRes.ok) {
        throw new Error(casePayload?.error || "Failed to update case");
      }

      const narrativeRes = await fetch(
        `/api/cases/${caseId}/forms/narrative/${narrativeId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: form.content,
            beat: form.beat,
            narrativeDate: form.narrativeDate || null,
            narrativeDay:
              form.narrativeDay || getDayFromDate(form.narrativeDate || ""),
            narrativeTime: form.narrativeTime || null,
          }),
        }
      );

      const narrativeRaw = await narrativeRes.text();
      let narrativePayload: any = {};

      try {
        narrativePayload = narrativeRaw ? JSON.parse(narrativeRaw) : {};
      } catch {
        throw new Error(narrativeRaw || "Unexpected response from server");
      }

      if (!narrativeRes.ok) {
        throw new Error(
          narrativePayload?.error || "Failed to update Narrative form."
        );
      }

      router.push(`/cases/${caseId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingPage) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-xl backdrop-blur">
            <div className="text-sm text-slate-500">
              Loading Narrative form...
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!caseData) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-xl">
            Failed to load Narrative form.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-6 pb-28">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-base font-semibold tracking-tight text-amber-800 shadow-sm">
                  {readOnlyMode ? "View Narrative Record" : "Edit Narrative Record"}
                </div>
              </div>

              <div className="flex flex-wrap items-start gap-2">
                {!canEditRecord && (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    View only
                  </span>
                )}

                <Link
                  href={`/api/cases/${caseId}/forms/narrative/${narrativeId}/pdf`}
                  target="_blank"
                  className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  View PDF
                </Link>

                {canEditRecord && (
                  <ShareToggle
                    checked={isShared}
                    onChange={handleToggleShare}
                    disabled={shareSaving}
                  />
                )}

                <Link
                  href={`/cases/${caseId}`}
                  className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  ← Back to Case
                </Link>
              </div>
            </div>
          </div>

      <div className="px-5 py-4">
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Case Number
        </label>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900">
          {caseData.caseNumber}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Incident Type
        </label>
        <input
          type="text"
          value={caseFormData.incidentType}
          onChange={(e) =>
            setCaseFormData((prev) => ({
              ...prev,
              incidentType: e.target.value,
            }))
          }
          readOnly={readOnlyMode}
          className={`mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition ${
            readOnlyMode
              ? "bg-slate-100 text-slate-600"
              : "bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          }`}
          placeholder="Incident type"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Incident Date
        </label>
        <input
          type="date"
          value={caseFormData.incidentDate}
          onChange={(e) =>
            setCaseFormData((prev) => ({
              ...prev,
              incidentDate: e.target.value,
            }))
          }
          onDoubleClick={(e) => {
            if (readOnlyMode) return;
            e.preventDefault();
            e.stopPropagation();

            setCaseFormData((prev) => ({
              ...prev,
              incidentDate: getCurrentDateString(),
            }));
          }}
          readOnly={readOnlyMode}
          title={readOnlyMode ? undefined : "Double-click to use current date"}
          className={`mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition ${
            readOnlyMode
              ? "bg-slate-100 text-slate-600"
              : "bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          }`}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Incident Day
        </label>
        <div className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          {incidentDay || "—"}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Incident Time
        </label>
        <input
          type="time"
          value={caseFormData.incidentTime}
          onChange={(e) =>
            setCaseFormData((prev) => ({
              ...prev,
              incidentTime: e.target.value,
            }))
          }
          onDoubleClick={(e) => {
            if (readOnlyMode) return;
            e.preventDefault();
            e.stopPropagation();

            setCaseFormData((prev) => ({
              ...prev,
              incidentTime: getCurrentTimeString(),
            }));
          }}
          readOnly={readOnlyMode}
          title={readOnlyMode ? undefined : "Double-click to use current time"}
          className={`mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition ${
            readOnlyMode
              ? "bg-slate-100 text-slate-600"
              : "bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          }`}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Incident Location
        </label>
        <input
          type="text"
          value={caseFormData.incidentLocation}
          onChange={(e) =>
            setCaseFormData((prev) => ({
              ...prev,
              incidentLocation: e.target.value,
            }))
          }
          readOnly={readOnlyMode}
          className={`mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition ${
            readOnlyMode
              ? "bg-slate-100 text-slate-600"
              : "bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          }`}
          placeholder="Enter incident location"
        />
      </div>
    </div>
  </div>
</div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
             
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                            <RichTextEditor
                  value={form.content}
                  onChange={(value) => {
                    if (readOnlyMode) return;
                    setForm((prev) => ({ ...prev, content: value }));
                  }}
                  readOnly={readOnlyMode}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur">
           
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Officer Name
                </label>
                <input
                  type="text"
                  name="officerName"
                  value={form.officerName}
                  readOnly
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
                  placeholder="Officer name"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Badge ID
                </label>
                <input
                  type="text"
                  name="officerId"
                  value={form.officerId}
                  readOnly
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
                  placeholder="Badge ID"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Beat
                </label>
                <input
                  type="text"
                  name="beat"
                  value={form.beat}
                  onChange={handleChange}
                  readOnly={readOnlyMode}
                  className={`w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition ${
                    readOnlyMode
                      ? "bg-slate-50"
                      : "focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  }`}
                  placeholder="Beat"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Date
                </label>
                <input
                  type="date"
                  name="narrativeDate"
                  value={form.narrativeDate}
                  onChange={handleChange}
                  onDoubleClick={(e) => {
                    if (readOnlyMode) return;
                    e.preventDefault();
                    e.stopPropagation();

                    const today = getCurrentDateString();

                    setForm((prev) => ({
                      ...prev,
                      narrativeDate: today,
                      narrativeDay: getDayFromDate(today),
                    }));
                  }}
                  readOnly={readOnlyMode}
                  title={readOnlyMode ? undefined : "Double-click to use current date"}
                  className={`w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition ${
                    readOnlyMode
                      ? "bg-slate-50"
                      : "focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  }`}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Day
                </label>
                <input
                  type="text"
                  name="narrativeDay"
                  value={form.narrativeDay}
                  readOnly
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
                  placeholder="Monday"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Time
                </label>
                <input
                  type="time"
                  name="narrativeTime"
                  value={form.narrativeTime}
                  onChange={handleChange}
                  onDoubleClick={(e) => {
                    if (readOnlyMode) return;
                    e.preventDefault();
                    e.stopPropagation();

                    setForm((prev) => ({
                      ...prev,
                      narrativeTime: getCurrentTimeString(),
                    }));
                  }}
                  readOnly={readOnlyMode}
                  title={readOnlyMode ? undefined : "Double-click to use current time"}
                  className={`w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition ${
                    readOnlyMode
                      ? "bg-slate-50"
                      : "focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  }`}
                />
              </div>
            </div>
          </section>

          {!readOnlyMode && (
            <div className="flex items-center justify-end gap-3">
              <Link
                href={`/cases/${caseId}`}
                className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Narrative"}
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}