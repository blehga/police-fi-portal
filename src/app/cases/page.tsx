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
  const [incidentDateQuery, setIncidentDateQuery] = useState("");
  const [loadingCases, setLoadingCases] = useState(true);
  const [casesError, setCasesError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.closest("[data-case-menu]")) {
      return;
    }

    setOpenMenuId(null);
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

const filteredCases = useMemo(() => {
  const searchTerms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return cases.filter((item) => {
    const searchableText = [
      item.caseNumber,
      item.incidentType,
      item.incidentLocation ?? "",
      item.createdByName ?? "",
      item.incidentDate ?? "",
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      searchTerms.length === 0 ||
      searchTerms.every((term) => searchableText.includes(term));

    const matchesIncidentDate =
      !incidentDateQuery || item.incidentDate === incidentDateQuery;

    return matchesSearch && matchesIncidentDate;
  });
}, [cases, query, incidentDateQuery]);

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
        <section className="overflow-visible rounded-2xl border border-slate-200 bg-white/95 shadow-sm">
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
           <div className="flex flex-wrap items-end gap-3">
  {/* 🔍 Search Cases */}
  <div className="relative flex-[3] min-w-[280px]">
    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search by case number, incident type, incident location, created by..."
      autoComplete="off"
      className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    />
  </div>

  {/* 📅 Incident Date */}
  <div className="flex flex-col">
    <label className="mb-1 text-xs font-semibold text-slate-600">
      Incident Date
    </label>
    <input
      type="date"
      value={incidentDateQuery}
      onChange={(e) => setIncidentDateQuery(e.target.value)}
      className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    />
  </div>

  {/* ❌ Clear Filters */}
 <button
  type="button"
  onClick={() => {
    setQuery("");
    setIncidentDateQuery("");
  }}
  disabled={!query && !incidentDateQuery}
  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
    !query && !incidentDateQuery
      ? "border-slate-200 text-slate-400 cursor-not-allowed"
      : "border-slate-300 text-slate-600 hover:bg-slate-50"
  }`}
>
  Clear
</button>

</div>
          </div>
        </section>

        <section className="overflow-visible rounded-2xl border border-slate-200 bg-white/95 shadow-sm">
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
            <div className="overflow-visible divide-y divide-slate-200">
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

                      <div className="grid grid-cols-1 gap-1 text-xs text-slate-500 md:grid-cols-2 xl:grid-cols-[120px_90px_minmax(360px,1fr)_80px_90px]">
                        <div className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700">{item.incidentDate ?? "—"}</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700">{item.incidentTime ?? "—"}</span>
                        </div>

<div className="inline-flex min-w-0 items-center gap-1.5">
  <span className="shrink-0 text-slate-400">📍</span>
  <span className="truncate font-semibold text-slate-700">
    {item.incidentLocation ?? "—"}
  </span>
</div>

                        <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
                          <FileText className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {item.formCount} form{item.formCount === 1 ? "" : "s"}
                          {/*   {item.formTypes.length > 0
                              ? ` • ${item.formTypes.join(", ")}`
                              : ""} */}
                          </span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          <span>{item.personCount} people</span>
                        </div>
                      </div>
                      
<div className="mt-1 text-[12px] text-slate-400">
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

                     <div className="relative z-50" data-case-menu>
                      <button
  type="button"
  onClick={() => {
  setOpenMenuId(openMenuId === item.id ? null : item.id);
}}
  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-50"
>
  <MoreHorizontal className="h-4 w-4" />
</button>

                        {openMenuId === item.id && (
<div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
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

                           <Link
  href={`/api/cases/${item.id}/reports/public/pdf`}
  target="_blank"
  className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50"
>
  Print Reports
</Link>

                          
                          </div>
                        </div>
                        )}
                      </div>
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