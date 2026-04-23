"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";
import {
  Images,
  Pencil,
  FileText,
  Trash2,
  Shield,
  Lock,
  Unlock,
} from "lucide-react";
import { useSession } from "next-auth/react";

type FICard = {
  id: string;
  caseNumber: string;
  firstName: string;
  lastName: string;
  subjectType: string;
  incidentType: string;
  createdAt: string;
  createdById: string;
  isShared: boolean;
  canEdit: boolean;
  hasImages?: boolean;
  imageCount?: number;
  previewImageUrl?: string | null;
};

type SortField =
  | "caseNumber"
  | "firstName"
  | "lastName"
  | "subjectType"
  | "incidentType"
  | "createdAt";

export default function FIListPage() {
  const { data: session, status } = useSession();
  const { can } = usePermissions();

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
  const [sharingId, setSharingId] = useState<string | null>(null);

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
  }, [
    debouncedQ,
    debouncedGlobalQ,
    incidentType,
    subjectType,
    from,
    to,
    sortField,
    sortDir,
  ]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (debouncedQ) params.set("name", debouncedQ);
      if (debouncedGlobalQ) params.set("global", debouncedGlobalQ);
      if (incidentType) params.set("incidentType", incidentType);
      if (subjectType) params.set("subjectType", subjectType);
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      params.set("sortField", sortField);
      params.set("sortDir", sortDir);

      const res = await fetch(`/api/fi?${params.toString()}`, {
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
    debouncedQ,
    debouncedGlobalQ,
    incidentType,
    subjectType,
    from,
    to,
    page,
    sortField,
    sortDir,
  ]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [fetchData, status]);

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

  const deleteRow = async (id: string) => {
    if (!confirm("Delete this FI card? This cannot be undone.")) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/fi/${id}`, { method: "DELETE" });

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

  const toggleShare = async (item: FICard) => {
    const nextShared = !item.isShared;

    if (
      item.isShared &&
      !confirm("Unshare this FI card? Other FI users will lose access.")
    ) {
      return;
    }

    setSharingId(item.id);

    try {
      const res = await fetch(`/api/fi/${item.id}/share`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isShared: nextShared }),
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

      setItems((prev) =>
        prev.map((row) =>
          row.id === item.id ? { ...row, isShared: !!data.isShared } : row
        )
      );
    } catch (e: any) {
      alert(e.message || "Failed to update share status");
    } finally {
      setSharingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (status === "loading") {
    return null;
  }

  if (!session || !(session as any).permissions?.includes("REPORT_READ)")) {
    return <div className="p-6 text-red-600">Access denied</div>;
  }

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
                href="/add-fi"
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
          <div className="overflow-x-auto p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-left text-slate-700">
                <tr>
                  <th className="px-4 py-3">Case #</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Incident</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Images</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {items.map((it) => {
                  const hasImages =
                    typeof it.hasImages === "boolean"
                      ? it.hasImages
                      : (it.imageCount ?? 0) > 0;

                  return (
                    <tr key={it.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono">
                        <Link
                          href={`/fi/${it.id}`}
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
                        {hasImages ? (
                          <div className="group relative inline-block">
                            <Link
                              href={`/fi/${it.id}/photos`}
                              title={`View images (${it.imageCount ?? 0})`}
                              className="inline-flex items-center justify-center rounded-lg border border-blue-200 p-2 text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Images className="h-4 w-4" />
                            </Link>

                            {it.previewImageUrl && (
                              <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl group-hover:block">
                                <img
                                  src={it.previewImageUrl}
                                  alt="Preview"
                                  className="h-24 w-24 rounded-lg object-cover"
                                />
                                <div className="mt-1 text-center text-xs text-slate-500">
                                  {it.imageCount} image
                                  {it.imageCount === 1 ? "" : "s"}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span
                            title="No images available"
                            aria-disabled="true"
                            className="inline-flex cursor-not-allowed items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-400 opacity-60"
                          >
                            <Images className="h-4 w-4" />
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                       {it.canEdit && (
  <button
    type="button"
    onClick={() => toggleShare(it)}
    disabled={sharingId === it.id}
    title={it.isShared ? "Unshare" : "Share"}
    className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 transition ${
      it.isShared
        ? "border-amber-200 text-amber-600 hover:bg-amber-50"
        : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
    } disabled:opacity-50`}
  >
    {sharingId === it.id ? (
      <span className="text-xs">•••</span>
    ) : (
      <>
        {it.isShared ? (
          <Unlock className="h-4 w-4" />
        ) : (
          <Lock className="h-4 w-4" />
        )}
        <span className="text-xs font-medium">
          {it.isShared ? "Shared" : "Private"}
        </span>
      </>
    )}
  </button>
)}

                          {it.canEdit && (
                            <Link
                              href={`/fi/${it.id}/edit`}
                              title="Edit FI"
                              className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          )}

                          <a
                            href={`/api/fi/${it.id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open PDF"
                            className="inline-flex items-center justify-center rounded-lg border border-blue-200 p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <FileText className="h-4 w-4" />
                          </a>

                          {can("AUDIT_READ") && (
                            <Link
                              href={`/audit?entity=ficard&entityId=${it.id}`}
                              title="View audit log"
                              className="inline-flex items-center justify-center rounded-lg border border-purple-200 p-2 text-purple-600 hover:bg-purple-50"
                            >
                              <Shield className="h-4 w-4" />
                            </Link>
                          )}

                          {can("REPORT_DELETE)") && it.canEdit && (
                            <button
                              onClick={() => deleteRow(it.id)}
                              disabled={deletingId === it.id}
                              title="Delete"
                              className="inline-flex items-center justify-center rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
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
                  );
                })}
              </tbody>
            </table>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Page {page} of {totalPages} · {total} total
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            {loading && (
              <div className="mt-4 text-sm text-slate-500">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}