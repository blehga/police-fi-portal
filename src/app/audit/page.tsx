"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type AuditItem = {
  id: number;
  user_id: number | null;
  actor_user_id: string | null;
  actor_name?: string | null;
  actor_username?: string | null;
  actor_role?: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  caseNumber: string | null;
  details: any;
  created_at: string;
};

type AuditResponse = {
  items: AuditItem[];
  total: number;
  page: number;
  pageSize: number;
};

function labelForField(field: string) {
  switch (field) {
    case "firstName":
      return "First Name";
    case "lastName":
      return "Last Name";
    case "subjectType":
      return "Subject Type";
    case "incidentType":
      return "Incident Type";
    case "caseNumber":
      return "Case Number";
    default:
      return field;
  }
}

function actionBadge(action: string) {
  const base = "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold";

  switch (action) {
    case "CREATE":
      return <span className={`${base} bg-green-100 text-green-700`}>{action}</span>;
    case "UPDATE":
      return <span className={`${base} bg-blue-100 text-blue-700`}>{action}</span>;
    case "DELETE":
      return <span className={`${base} bg-red-100 text-red-700`}>{action}</span>;
    case "LOGIN_SUCCESS":
      return <span className={`${base} bg-emerald-100 text-emerald-700`}>{action}</span>;
    case "LOGIN_FAILED":
      return <span className={`${base} bg-amber-100 text-amber-700`}>{action}</span>;
    case "ACCESS_DENIED":
      return <span className={`${base} bg-orange-100 text-orange-700`}>{action}</span>;
    case "LOGOUT":
      return <span className={`${base} bg-slate-200 text-slate-700`}>{action}</span>;
    default:
      return <span className={`${base} bg-slate-100 text-slate-700`}>{action}</span>;
  }
}

function renderChangeDetails(details: any) {
  if (!details || typeof details !== "object") {
    return <span className="text-slate-400">—</span>;
  }

  const entries = Object.entries(details);

  if (entries.length === 0) {
    return <span className="text-slate-400">—</span>;
  }

  return (
    <div className="space-y-2">
      {entries.map(([field, value]: [string, any]) => (
        <div
          key={field}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {labelForField(field)}
          </div>
          <div className="mt-1 text-xs text-slate-700">
            <span className="font-medium text-red-600">
              {value?.from ?? "—"}
            </span>
            <span className="mx-2 text-slate-400">→</span>
            <span className="font-medium text-green-600">
              {value?.to ?? "—"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function renderAuthDetails(details: any) {
  if (!details || typeof details !== "object") {
    return <span className="text-slate-400">—</span>;
  }

  return (
    <div className="space-y-1 text-xs text-slate-700">
      {details.username && (
        <div>
          <span className="font-semibold text-slate-500">Username:</span>{" "}
          {details.username}
        </div>
      )}
      {details.reason && (
        <div>
          <span className="font-semibold text-slate-500">Reason:</span>{" "}
          {details.reason}
        </div>
      )}
      {details.permission && (
        <div>
          <span className="font-semibold text-slate-500">Permission:</span>{" "}
          {details.permission}
        </div>
      )}
      {details.route && (
        <div>
          <span className="font-semibold text-slate-500">Route:</span>{" "}
          {details.route}
        </div>
      )}
      {details.method && (
        <div>
          <span className="font-semibold text-slate-500">Method:</span>{" "}
          {details.method}
        </div>
      )}
      {details.tenant && (
        <div>
          <span className="font-semibold text-slate-500">Tenant:</span>{" "}
          {details.tenant}
        </div>
      )}
      {details.ip && (
        <div>
          <span className="font-semibold text-slate-500">IP:</span>{" "}
          {details.ip}
        </div>
      )}
    </div>
  );
}

function renderCreateDeleteDetails(item: AuditItem) {
  if (!item.details || typeof item.details !== "object") {
    return (
      <span className="text-xs font-medium text-slate-500">
        {item.action === "CREATE" ? "Record created" : "Record deleted"}
      </span>
    );
  }

  return (
    <div className="space-y-1 text-xs text-slate-700">
      {item.details.caseNumber && (
        <div>
          <span className="font-semibold text-slate-500">Case:</span>{" "}
          {item.details.caseNumber}
        </div>
      )}
      {item.details.firstName && (
        <div>
          <span className="font-semibold text-slate-500">First Name:</span>{" "}
          {item.details.firstName}
        </div>
      )}
      {item.details.lastName && (
        <div>
          <span className="font-semibold text-slate-500">Last Name:</span>{" "}
          {item.details.lastName}
        </div>
      )}
      {item.details.subjectType && (
        <div>
          <span className="font-semibold text-slate-500">Subject Type:</span>{" "}
          {item.details.subjectType}
        </div>
      )}
      {item.details.incidentType && (
        <div>
          <span className="font-semibold text-slate-500">Incident Type:</span>{" "}
          {item.details.incidentType}
        </div>
      )}
    </div>
  );
}

function renderActor(item: AuditItem) {
  const name = item.actor_name?.trim();
  const username = item.actor_username?.trim();
  const role = item.actor_role?.trim();

  if (!name && !username) {
    return <span className="text-slate-400">System</span>;
  }

  return (
    <div className="text-sm text-slate-900">
      <span className="font-medium">{name || username}</span>
      {name && username ? (
        <span className="text-slate-500"> ({username})</span>
      ) : null}
      {role ? (
        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {role}
        </span>
      ) : null}
    </div>
  );
}

export default function AuditPage() {
  const searchParams = useSearchParams();

  const [items, setItems] = useState<AuditItem[]>([]);
  const [total, setTotal] = useState(0);

  const [entity, setEntity] = useState("ficard");
  const [entityIdFilter, setEntityIdFilter] = useState("");
  const [caseNumberInput, setCaseNumberInput] = useState("");
  const [actor, setActor] = useState("");
  const [action, setAction] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [loading, setLoading] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    const entityParam = searchParams.get("entity") ?? "";
    const entityIdParam = searchParams.get("entityId") ?? "";
    const actorParam =
      searchParams.get("actor") ??
      searchParams.get("actorUserId") ??
      "";
    const actionParam = searchParams.get("action") ?? "";

    const resolvedEntity = entityParam || "ficard";

    setEntity(resolvedEntity);
    setEntityIdFilter(entityIdParam);
    setActor(actorParam);
    setAction(actionParam);
    setPage(1);

    if (
      resolvedEntity === "ficard" &&
      entityIdParam &&
      entityIdParam.length > 20
    ) {
      setCaseNumberInput("");
    } else {
      setCaseNumberInput(entityIdParam);
    }
  }, [searchParams]);

  const query = useMemo(() => {
    const params = new URLSearchParams();

    if (entity) params.set("entity", entity);
    if (entityIdFilter) params.set("entityId", entityIdFilter);
    if (actor) params.set("actor", actor);
    if (action) params.set("action", action);

    params.set("page", String(page));
    params.set("pageSize", String(pageSize));

    return params.toString();
  }, [entity, entityIdFilter, actor, action, page]);

  const exportUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (entity) params.set("entity", entity);
    if (entityIdFilter) params.set("entityId", entityIdFilter);
    if (actor) params.set("actor", actor);
    if (action) params.set("action", action);

    return `/api/audit/export?${params.toString()}`;
  }, [entity, entityIdFilter, actor, action]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setForbidden(false);

      try {
        const res = await fetch(`/api/audit?${query}`, {
          cache: "no-store",
        });

        const data: AuditResponse | { error: string } = await res.json();

        if (res.status === 403) {
          if (!cancelled) {
            setForbidden(true);
            setItems([]);
            setTotal(0);
          }
          return;
        }

        if (!res.ok) {
          throw new Error("error" in data ? data.error : "Failed to load audit");
        }

        if (!cancelled && "items" in data) {
          setItems(Array.isArray(data.items) ? data.items : []);
          setTotal(Number(data.total ?? 0));

          if (
            entity === "ficard" &&
            entityIdFilter &&
            entityIdFilter.length > 20 &&
            !caseNumberInput &&
            data.items.length > 0
          ) {
            const firstCaseNumber = data.items[0]?.caseNumber ?? "";
            if (firstCaseNumber) {
              setCaseNumberInput(String(firstCaseNumber));
            }
          }
        }
      } catch (err) {
        console.error("Failed to load audit logs", err);
        if (!cancelled) {
          setItems([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [query, entity, entityIdFilter, caseNumberInput]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function applyFilters() {
    setEntityIdFilter(caseNumberInput.trim());
    setPage(1);
  }

  function clearFilters() {
    setEntity("ficard");
    setEntityIdFilter("");
    setCaseNumberInput("");
    setActor("");
    setAction("");
    setPage(1);
  }

  return (
    <div
      suppressHydrationWarning
      className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-8"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur">
          <div className="border-b border-slate-200 px-6 py-5">
            <h1 className="text-2xl font-bold text-slate-900">Audit Log</h1>
            <p className="mt-1 text-sm text-slate-500">
              Review FI changes and security events like login, logout, and access denial
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Entity
                </label>
                <input
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="form"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Case Number / Entity ID
                </label>
                <input
                  value={caseNumberInput}
                  onChange={(e) => setCaseNumberInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="26-0016"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  User / Username
                </label>
                <input
                  value={actor}
                  onChange={(e) => setActor(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="john smith or jsmith"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Action
                </label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white"
                >
                  <option value="">All</option>
                  <option value="CREATE">CREATE</option>
                  <option value="UPDATE">UPDATE</option>
                  <option value="DELETE">DELETE</option>
                  <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
                  <option value="LOGIN_FAILED">LOGIN_FAILED</option>
                  <option value="ACCESS_DENIED">ACCESS_DENIED</option>
                  <option value="LOGOUT">LOGOUT</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={applyFilters}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
              >
                Apply
              </button>

              <button
                onClick={clearFilters}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium"
              >
                Clear
              </button>

              <a
                href={exportUrl}
                className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
              >
                Export CSV
              </a>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="overflow-x-auto p-6">
            {forbidden ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Access denied. You do not have permission to view audit logs.
              </div>
            ) : (
              <>
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 text-left text-slate-700">
                    <tr>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Action</th>
                      <th className="px-4 py-3">Entity</th>
                      <th className="px-4 py-3">Case Number</th>
                      <th className="px-4 py-3">User (username)</th>
                      <th className="px-4 py-3">Details</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {loading ? (
                      <tr>
                        <td
                          className="px-4 py-6 text-center text-slate-500"
                          colSpan={6}
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : items.length === 0 ? (
                      <tr>
                        <td
                          className="px-4 py-6 text-center text-slate-500"
                          colSpan={6}
                        >
                          No audit records found.
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.id} className="align-top hover:bg-slate-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            {item.created_at
                              ? new Date(item.created_at).toLocaleString()
                              : "—"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {actionBadge(item.action)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {item.entity || "—"}
                          </td>
                          <td className="px-4 py-3">
                            {item.entity === "ficard"
                              ? item.caseNumber || item.details?.caseNumber || "—"
                              : "—"}
                          </td>
                          <td className="px-4 py-3">
                            {renderActor(item)}
                          </td>
                          <td className="px-4 py-3">
                            {item.action === "UPDATE" ? (
                              renderChangeDetails(item.details?.changes)
                            ) : item.action === "CREATE" || item.action === "DELETE" ? (
                              renderCreateDeleteDetails(item)
                            ) : item.entity === "auth" ? (
                              renderAuthDetails(item.details)
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Page {page} of {totalPages} · {total} total
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}