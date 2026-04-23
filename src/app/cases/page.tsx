"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FilePlus2,
  Search,
  CalendarDays,
  Clock3,
  FileText,
  Users,
  MoreHorizontal,
} from "lucide-react";

type CaseListItem = {
  id: string;
  caseNumber: string;
  incidentType: string;
  incidentDate: string | null;
  incidentTime: string | null;
  incidentLocation: string | null
   createdByName: string;
  createdAt: string;
  updatedAt: string;
  formCount: number;
  formTypes: string[];
  personCount: number;
};

export default function CasesPage() {
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [query, setQuery] = useState("");
  const [loadingCases, setLoadingCases] = useState(true);
  const [casesError, setCasesError] = useState<string | null>(null);

  const filteredCases = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cases;

    return cases.filter((item) => {
      return (
        item.caseNumber.toLowerCase().includes(q) ||
        item.incidentType.toLowerCase().includes(q)||
        (item.incidentLocation ?? "").toLowerCase().includes(q)
      );
    });
  }, [cases, query]);

  useEffect(() => {
    async function loadCases() {
      try {
        setLoadingCases(true);
        setCasesError(null);

        const res = await fetch("/api/cases", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load cases");
        }

        const data: CaseListItem[] = await res.json();
        setCases(data);
      } catch (error) {
        console.error(error);
        setCasesError("Failed to load cases.");
      } finally {
        setLoadingCases(false);
      }
    }

    loadCases();
  }, []);

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-6">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="inline-flex items-center rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-base font-semibold tracking-tight text-blue-800 shadow-sm">
                  Case Management Dashboard
                </div>
               
              </div>

              <Link
                href="/cases/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
              >
                <FilePlus2 className="h-4 w-4" />
                New Case
              </Link>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <label className="mb-1.5 block text-sm font-semibold  text-slate-700">
                  Search Cases
                </label>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Case number or incident type..."
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {loadingCases ? "—" : filteredCases.length}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Case Records
            </h2>
            <span className="text-xs text-slate-500">
              {loadingCases ? "—" : filteredCases.length} shown
            </span>
          </div>

          {loadingCases ? (
            <div className="px-5 py-8 text-sm text-slate-500">Loading cases...</div>
          ) : casesError ? (
            <div className="px-5 py-8 text-sm text-red-600">{casesError}</div>
          ) : filteredCases.length === 0 ? (
            <div className="px-5 py-8 text-sm text-slate-500">No cases found.</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredCases.map((item) => (
                <div
                  key={item.id}
                  className="px-5 py-4 transition hover:bg-slate-50"
                >
                  <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_210px] xl:items-center">
                    <div className="min-w-0">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <Link
                          href={`/cases/${item.id}`}
                          className="text-sm font-semibold text-blue-700 hover:underline"
                        >
                          {item.caseNumber}
                        </Link>
<span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[12px] font-semibold tracking-tight text-slate-600">
                        
                          {item.incidentType || "Unknown"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-1 text-xs text-slate-500 md:grid-cols-2 xl:grid-cols-5">
                        <div className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          <span>{item.incidentDate ?? "—"}</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                          <span>{item.incidentTime ?? "—"}</span>
                        </div>

<div className="inline-flex items-center gap-1.5">
  <span className="text-slate-400">📍</span>
  <span>{item.incidentLocation ?? "—"}</span>
</div>

                        <div className="inline-flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {item.formCount} form{item.formCount === 1 ? "" : "s"}
                          {/*   {item.formTypes.length > 0
                              ? ` • ${item.formTypes.join(", ")}`
                              : ""} */}
                          </span>
                        </div>

                        <div className="inline-flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          <span>{item.personCount} people</span>
                        </div>
                      </div>
                      
<div className="mt-1 text-[11px] text-slate-400">
  <span className="text-slate-500">Created By:</span>{" "}
  <span className="font-medium text-slate-700">
    {item.createdByName ?? "Unknown"}
  </span>{" "}
  • <span></span>{" "}
  {new Date(item.createdAt).toLocaleString()} •{" "}
  <span>Updated</span>{" "}
  {new Date(item.updatedAt).toLocaleString()}
</div>
                    </div>

                    <div className="flex items-center gap-2 xl:justify-end">
                      <Link
                        href={`/cases/${item.id}`}
                        className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        View Case
                      </Link>

                      <details className="relative">
                        <summary className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-50">
                          <MoreHorizontal className="h-4 w-4" />
                        </summary>

                        <div className="absolute right-0 z-10 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                          <div className="flex flex-col text-sm">
                            <Link
                              href={`/cases/${item.id}/add-fi`}
                              className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50"
                            >
                              Add FI
                            </Link>

                            <Link
                              href={`/cases/${item.id}/add-narrative`}
                              className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50"
                            >
                              Add Narrative
                            </Link>

                            <button
                              type="button"
                              className="rounded-lg px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
                            >
                              Print Reports
                            </button>

                            <button
                              type="button"
                              className="rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50"
                            >
                              Delete Case
                            </button>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}