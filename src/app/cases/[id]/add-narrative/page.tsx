"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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

type FormState = {
  content: string;
  officerName: string;
  officerId: string;
  beat: string;
  narrativeDate: string;
  narrativeDay: string;
  narrativeTime: string;
};

function getDayFromDate(dateStr: string) {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return "";

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", { weekday: "long" });
}

const getCurrentDateString = () => {
  return new Date().toISOString().split("T")[0];
};

const getCurrentTimeString = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function AddNarrativePage() {
  const params = useParams();
  const caseId = params.id as string;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [caseData, setCaseData] = useState<CaseHeader | null>(null);
  const [caseFormData, setCaseFormData] = useState<CaseSharedState>({
    caseNumber: "",
    incidentType: "",
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
  });

  const [loadingCase, setLoadingCase] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    content: "",
    officerName: "",
    officerId: "",
    beat: "",
    narrativeDate: "",
    narrativeDay: "",
    narrativeTime: "",
  });

  useEffect(() => {
    async function loadCase() {
      try {
        setLoadingCase(true);
        setError(null);

        const res = await fetch(`/api/cases/${caseId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load case");
        }

        const data = await res.json();

        setCaseData({
          id: data.id,
          caseNumber: data.caseNumber,
          incidentType: data.incidentType ?? "",
          incidentDate: data.incidentDate ?? null,
          incidentTime: data.incidentTime ?? null,
          incidentLocation: data.incidentLocation ?? null,
        });

        setCaseFormData({
          caseNumber: data.caseNumber,
          incidentType: data.incidentType ?? "",
          incidentDate: data.incidentDate ?? "",
          incidentTime: data.incidentTime ?? "",
          incidentLocation: data.incidentLocation ?? "",
        });

        setForm((prev) => {
          const nextDate = prev.narrativeDate || (data.incidentDate ?? "");
          return {
            ...prev,
            narrativeDate: nextDate,
            narrativeDay: prev.narrativeDay || getDayFromDate(nextDate),
            narrativeTime: prev.narrativeTime || (data.incidentTime ?? ""),
          };
        });
      } catch (err: any) {
        setError(err.message || "Failed to load case");
      } finally {
        setLoadingCase(false);
      }
    }

    if (caseId) loadCase();
  }, [caseId]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const firstName = String((session as any)?.user?.firstName ?? "").trim();
    const lastName = String((session as any)?.user?.lastName ?? "").trim();
    const badgeId = String((session as any)?.user?.badgeId ?? "").trim();
    const username =
      String((session as any)?.username ?? "").trim() ||
      String((session as any)?.user?.name ?? "").trim();

    const fullName = `${firstName} ${lastName}`.trim();
    const officerName = fullName || username;

    setForm((prev) => ({
      ...prev,
      officerName,
      officerId: badgeId,
      narrativeDate: prev.narrativeDate || getCurrentDateString(),
      narrativeDay:
        prev.narrativeDay ||
        getDayFromDate(prev.narrativeDate || getCurrentDateString()),
      narrativeTime: prev.narrativeTime || getCurrentTimeString(),
    }));
  }, [session, status]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const canSubmit = !saving && form.content.trim().length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
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

      const res = await fetch(`/api/cases/${caseId}/forms/narrative`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: form.content,
          beat: form.beat,
          narrativeDate: form.narrativeDate || null,
          narrativeDay:
            form.narrativeDay || getDayFromDate(form.narrativeDate || ""),
          narrativeTime: form.narrativeTime || null,
        }),
      });

      const raw = await res.text();
      let data: any = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Unexpected response from server");
      }

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to save narrative.");
      }

      router.push(`/cases/${caseId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingCase) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur">
            <div className="text-sm text-slate-500">Loading case...</div>
          </div>
        </div>
      </main>
    );
  }

  if (!caseData) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-xl">
            Failed to load case.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-8 pb-32">
      <div className="mx-auto w-full max-w-5xl space-y-5">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur">
         <div className="border-b border-slate-200 px-6 py-5">
  <div className="flex items-start justify-between">
             <div className="inline-flex items-center rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-base font-semibold tracking-tight text-blue-800 shadow-sm">
              Add Narrative
            </div>
                <Link
                  href={`/cases/${caseId}`}
                  className="inline-flex items-center rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  ← Back to Case
                </Link>
              </div>
            </div>


          <div className="px-6 py-5">
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Case Number
        </label>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900">
          {caseData?.caseNumber || caseFormData.caseNumber}
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
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
            e.preventDefault();
            e.stopPropagation();

            setCaseFormData((prev) => ({
              ...prev,
              incidentDate: getCurrentDateString(),
            }));
          }}
          title="Double-click to use current date"
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
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
            e.preventDefault();
            e.stopPropagation();

            setCaseFormData((prev) => ({
              ...prev,
              incidentTime: getCurrentTimeString(),
            }));
          }}
          title="Double-click to use current time"
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, content: value }))
                  }
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                    e.preventDefault();
                    e.stopPropagation();

                    const today = getCurrentDateString();

                    setForm((prev) => ({
                      ...prev,
                      narrativeDate: today,
                      narrativeDay: getDayFromDate(today),
                    }));
                  }}
                  title="Double-click to use current date"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                    e.preventDefault();
                    e.stopPropagation();

                    setForm((prev) => ({
                      ...prev,
                      narrativeTime: getCurrentTimeString(),
                    }));
                  }}
                  title="Double-click to use current time"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </section>

          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4">
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
                {saving ? "Saving..." : "Save Narrative"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}