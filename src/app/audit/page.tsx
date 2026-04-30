"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

/* --- KEEP ALL YOUR TYPES + HELPERS EXACTLY AS IS --- */
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

/* --- KEEP ALL YOUR HELPER FUNCTIONS (unchanged) --- */
// (I’m not repeating them here — leave them exactly as you pasted)

/* ================================================= */
/* MOVE YOUR PAGE LOGIC INTO INNER COMPONENT */
/* ================================================= */

function AuditPageContent() {
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
  }, [query]);

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

  /* --- KEEP YOUR JSX EXACTLY THE SAME --- */
  return (
    <div className="p-6">
      {/* your full JSX stays unchanged */}
      Audit page content...
    </div>
  );
}

/* ================================================= */
/* WRAP WITH SUSPENSE (THIS FIXES BUILD) */
/* ================================================= */

export default function AuditPage() {
  return (
    <Suspense fallback={null}>
      <AuditPageContent />
    </Suspense>
  );
}