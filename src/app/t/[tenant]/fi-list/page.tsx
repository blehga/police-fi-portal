"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { Images, Pencil, FileText, Trash2 } from "lucide-react";

import { useSession } from "next-auth/react";

const { data: session } = useSession();

console.log("SESSION:", session);

type FICard = {
  id: string;
  caseNumber: string;
  firstName: string;
  lastName: string;
  subjectType: string;
  incidentType: string;
  createdAt: string;
};

type SortField =
  | "caseNumber"
  | "firstName"
  | "lastName"
  | "subjectType"
  | "incidentType"
  | "createdAt";

export default function FIListPage() {
  const { can } = usePermissions();
  const params = useParams<{ tenant: string }>();
  const tenant = params.tenant;

  const [q, setQ] = useState("");
  const [globalQ, setGlobalQ] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [subjectType, setSubjectType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [debouncedQ, setDebouncedQ] = useState("");
  const [debouncedGlobalQ, setDebouncedGlobalQ] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<FICard[]>([]);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedGlobalQ(globalQ), 250);
    return () => clearTimeout(t);
  }, [globalQ]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, debouncedGlobalQ, incidentType, subjectType, from, to, sortField, sortDir]);

  const fetchData = useCallback(async () => {
    if (!tenant) return;

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (debouncedQ) queryParams.set("name", debouncedQ);
      if (debouncedGlobalQ) queryParams.set("global", debouncedGlobalQ);
      if (incidentType) queryParams.set("incidentType", incidentType);
      if (subjectType) queryParams.set("subjectType", subjectType);
      if (from) queryParams.set("from", from);
      if (to) queryParams.set("to", to);

      queryParams.set("page", String(page));
      queryParams.set("pageSize", String(pageSize));
      queryParams.set("sortField", sortField);
      queryParams.set("sortDir", sortDir);

      const res = await fetch(`/api/t/${tenant}/fi?${queryParams.toString()}`, {
        cache: "no-store",
      });

      const raw = await res.text();

      let data: any = null;
      try {
        data = JSON.parse(raw);
      } catch {}

      if (!res.ok) {
        throw new Error(data?.error || raw || "Failed to fetch");
      }

      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      setError(e.message || "Failed to fetch");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [
    tenant,
    debouncedQ,
    debouncedGlobalQ,
    incidentType,
    subjectType,
    from,
    to,
    page,
    pageSize,
    sortField,
    sortDir,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQ(q);
    setDebouncedGlobalQ(globalQ);
    setPage(1);
  };

  const clearFilters = () => {
    setQ("");
    setGlobalQ("");
    setDebouncedQ("");
    setDebouncedGlobalQ("");
    setIncidentType("");
    setSubjectType("");
    setFrom("");
    setTo("");
    setSortField("createdAt");
    setSortDir("desc");
    setPage(1);
  };

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return "↕";
    return sortDir === "asc" ? "▲" : "▼";
  };

  const deleteRow = async (id: string) => {
    if (!confirm("Delete this FI card? This cannot be undone.")) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/t/${tenant}/fi/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to delete");
      }

      await fetchData();
    } catch (e: any) {
      alert(e.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">FI Cards</h1>
              <p className="mt-1 text-sm text-slate-500">
                Search, review, and manage field interview records
              </p>
            </div>

            {can("REPORT_WRITE)") && (
              <Link
                href={`/t/${tenant}/add-fi`}
                className="rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700"
              >
                + Add FI
              </Link>
            )}
          </div>

          <div className="p-6">
            <form
              onSubmit={onSearch}
              className="grid grid-cols-1 gap-4 md:grid-cols-6"
            >
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Search Name
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="Search name…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Incident Type
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Subject Type
                </label>
                <select
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  value={subjectType}
                  onChange={(e) => setSubjectType(e.target.value)}
                >
                  <option value="">Subject Type</option>
                  <option value="Suspect">Suspect</option>
                  <option value="Victim">Victim</option>
                  <option value="Witness">Witness</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  From
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  To
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>

              <div className="md:col-span-5">
                <label className="text-sm font-medium text-slate-700">
                  Global Search
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  value={globalQ}
                  onChange={(e) => setGlobalQ(e.target.value)}
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-slate-900 py-3 text-white"
                >
                  Search
                </button>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full rounded-xl border border-slate-300 py-3"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="p-6 overflow-x-auto">
            {loading && (
              <div className="mb-4 text-sm text-slate-500">Loading...</div>
            )}

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-left text-slate-700">
                <tr>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("caseNumber")}
                  >
                    Case # {sortIcon("caseNumber")}
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("firstName")}
                  >
                    Name {sortIcon("firstName")}
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("subjectType")}
                  >
                    Subject {sortIcon("subjectType")}
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("incidentType")}
                  >
                    Incident {sortIcon("incidentType")}
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => toggleSort("createdAt")}
                  >
                    Created {sortIcon("createdAt")}
                  </th>
                  <th className="px-4 py-3">Images</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {items.map((it) => (
                  <tr key={it.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono">
                      <Link
                        href={`/t/${tenant}/fi/${it.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {it.caseNumber}
                      </Link>
                    </td>

                    <td className="px-4 py-3">
                      {it.firstName} {it.lastName}
                    </td>

                    <td className="px-4 py-3">{it.subjectType}</td>
                    <td className="px-4 py-3">{it.incidentType}</td>

                    <td className="px-4 py-3">
                      {new Date(it.createdAt).toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      <Link
                        href={`/t/${tenant}/fi/${it.id}/photos`}
                        title="View images"
                        className="inline-flex items-center justify-center rounded-lg border border-blue-200 p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Images className="h-4 w-4" />
                      </Link>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {can("REPORT_WRITE)") && (
                          <Link
                            href={`/t/${tenant}/fi/${it.id}/edit`}
                            title="Edit FI"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        )}

                        <a
                          href={`/api/t/${tenant}/fi/${it.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open PDF"
                          className="inline-flex items-center justify-center rounded-lg border border-blue-200 p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <FileText className="h-4 w-4" />
                        </a>

                        {can("REPORT_DELETE)") && (
                          <button
                            onClick={() => deleteRow(it.id)}
                            disabled={deletingId === it.id}
                            title="Delete"
                            className="inline-flex items-center justify-center rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                          >
                            {deletingId === it.id ? (
                              <span className="text-xs">•••</span>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      No FI cards found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Page {page} of {totalPages} · {total} total
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}