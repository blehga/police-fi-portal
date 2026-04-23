"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, FilePlus2 } from "lucide-react";

type FormChoice = "FI" | "NARRATIVE";

export default function NewCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCaseAndRedirect = async (formType: FormChoice) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create case");
      }

      if (formType === "FI") {
        router.push(`/cases/${data.id}/add-fi`);
      } else {
        router.push(`/cases/${data.id}/add-narrative`);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-56px)] bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl space-y-4">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-base font-semibold tracking-tight text-blue-800 shadow-sm">
            Start A New Case
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Select how you want to begin this case.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">

          {/* Info note */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
            ⚠️ A case will be created automatically when you select a report type.
          </div>

          {/* Form options */}
          <div className="grid gap-4 md:grid-cols-2">

            {/* FI */}
            <button
              type="button"
              disabled={loading}
              onClick={() => createCaseAndRedirect("FI")}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                  <FilePlus2 className="h-4 w-4" />
                </div>
                <div className="font-semibold text-slate-900">
                  Field Interview Report
                </div>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Begin with a field interview report.
              </p>
            </button>

            {/* Narrative */}
            <button
              type="button"
              disabled={loading}
              onClick={() => createCaseAndRedirect("NARRATIVE")}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-200 p-2 text-slate-700">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="font-semibold text-slate-900">
                  Narrative Report
                </div>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Begin with a narrative report.
              </p>
            </button>
          </div>

          {/* Footer */}
          <div className="flex">
            <Link
              href="/cases"
              className="w-full rounded-xl border border-slate-300 bg-white py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
            ❌ {error}
          </div>
        )}
      </div>
    </main>
  );
}