import Link from "next/link";
import { cookies, headers } from "next/headers";
import {
  Eye,
  Pencil,
  Trash2,
  FileText,
  Printer,
  Images,
  FilePlus2,
  Users,
  CalendarDays,
  Clock3,
  Shield,
} from "lucide-react";
import CaseFormShareBadge from "@/components/CaseFormShareBadge";
import CasePeopleForms from "./CasePeopleForms";

type FormPerson = {
  id: string;
  fullName: string;
  dob: string | null;
  role: string;
};

type FIPhotoSummary = {
  id: string;
  url: string;
};

type FIData = {
  subjectType: string | null;
  photoCount?: number;
  photos?: FIPhotoSummary[];
} | null;

type NarrativeData = {
  narrativeText: string;
} | null;

type CaseForm = {
  id: string;
  formType: "FI" | "NARRATIVE";
  createdAt: string;
  updatedAt?: string;
  isShared?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  fiCard: FIData;
  narrative: NarrativeData;
  people: FormPerson[];
};

type CasePerson = {
  id: string;
  fullName: string;
};

type CaseDetail = {
  id: string;
  caseNumber: string;
  incidentType: string;
  incidentDate: string | null;
  incidentTime: string | null;
  incidentLocation: string;
  updatedAt: string;
  formCount: number;
  persons: CasePerson[];
  forms: CaseForm[];
};

function getFormTypeLabel(type: string) {
  return type === "FI"
    ? "Field Interview Report"
    : "Narrative Report";
}

async function getCase(id: string): Promise<CaseDetail> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const host = headerStore.get("host");
  if (!host) {
    throw new Error("Missing host header");
  }

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/cases/${id}`, {
    method: "GET",
    headers: {
      cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load case");
  }

  return res.json();
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function getFormSummary(form: CaseForm) {
  if (form.formType === "NARRATIVE") {
    const raw = form.narrative?.narrativeText || "";

    const cleanText = raw
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return cleanText.length > 140
      ? `${cleanText.slice(0, 140)}...`
      : cleanText || "No Summary";
  }
}

function getPeopleSummary(
  people: FormPerson[],
  subjectType?: string | null
): React.ReactNode {
  if (!people.length) return "No people";

  return (
    <span className="block truncate">
      {people.map((p, index) => (
        <span key={index}>
          <span className="font-semibold">{p.fullName || "Unknown"}</span>{" "}
          {subjectType && <span>({subjectType})</span>}
          {index < people.length - 1 && ", "}
        </span>
      ))}
    </span>
  );
}

function getOpenHref(caseId: string, form: CaseForm) {
  return form.formType === "FI"
    ? `/cases/${caseId}/edit-fi/${form.id}?view=1`
    : `/cases/${caseId}/edit-narrative/${form.id}?view=1`;
}

function getEditHref(caseId: string, form: CaseForm) {
  if (form.formType === "FI") {
    return `/cases/${caseId}/edit-fi/${form.id}`;
  }

  return `/cases/${caseId}/edit-narrative/${form.id}`;
}

function getPdfHref(caseId: string, form: CaseForm, print = false) {
  const base =
    form.formType === "FI"
      ? `/api/cases/${caseId}/forms/fi/${form.id}/pdf`
      : `/api/cases/${caseId}/forms/narrative/${form.id}/pdf`;

  return print ? `${base}?print=1` : base;
}

function getImagesHref(caseId: string, form: CaseForm) {
  return `/cases/${caseId}/edit-fi/${form.id}?view=1&tab=images`;
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/90 px-3 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-500">{label}</div>
          <div className="truncate text-base font-semibold text-slate-900">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormVisibilityBadge({
  isShared,
}: {
  isShared: boolean | undefined;
}) {
  return (
    <span
      title={isShared ? "Shared" : "Private"}
      className={`inline-flex h-9 items-center rounded-full border px-3 text-xs font-medium ${
        isShared
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      {isShared ? "Shared" : "Private"}
    </span>
  );
}

function ActionIconLink({
  href,
  title,
  className,
  children,
  target,
}: {
  href: string;
  title: string;
  className: string;
  children: React.ReactNode;
  target?: string;
}) {
  return (
    <Link
      href={href}
      title={title}
      target={target}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${className}`}
    >
      {children}
    </Link>
  );
}

function ActionIconDisabled({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <span
      title={title}
      className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-400"
    >
      {children}
    </span>
  );
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getCase(id);

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-3 py-4 text-[15px] xl:px-4">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur">
          <div className="border-b border-slate-200 px-4 py-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-base font-semibold tracking-tight text-blue-800 shadow-sm">
                    Case Information
                  </div>

                  <h1 className="truncate text-xl font-semibold text-slate-900">
                    {data.caseNumber}
                  </h1>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                    Updated {formatDateTime(data.updatedAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/cases"
                  className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  ← Back to Cases
                </Link>

                <Link
                  href={`/cases/${data.id}/add-fi`}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                  <FilePlus2 className="h-4 w-4" />
                  Add FI
                </Link>

                <Link
                  href={`/cases/${data.id}/add-narrative`}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  <FilePlus2 className="h-4 w-4" />
                  Add Narrative
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2 xl:grid-cols-[250px_240px_220px_minmax(420px,1fr)_130px_130px]">
            <StatCard
              icon={<Shield className="h-4 w-4" />}
              label="Incident Type"
              value={data.incidentType || "—"}
            />
            <StatCard
              icon={<CalendarDays className="h-4 w-4" />}
              label="Incident Date"
              value={data.incidentDate || "—"}
            />
            <StatCard
              icon={<Clock3 className="h-4 w-4" />}
              label="Incident Time"
              value={data.incidentTime || "—"}
            />
           <div className="rounded-xl border border-slate-200 bg-white/90 px-3 py-3 shadow-sm">
  <div className="flex items-center gap-3 min-w-0">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
      📍
    </div>

    <div className="min-w-0">
      <div className="text-xs font-medium text-slate-500">
        Incident Location
      </div>
      <div className="truncate text-base font-semibold text-slate-900">
        {data.incidentLocation || "—"}
      </div>
    </div>
  </div>
</div>
          <div className="rounded-xl border border-slate-200 bg-white/90 px-2 py-2 shadow-sm">
  <div className="flex items-center gap-2">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
      <Users className="h-4 w-4" />
    </div>

    <div>
      <div className="text-xs text-slate-500">People</div>
      <div className="text-sm font-semibold text-slate-900">
        {data.persons.length}
      </div>
    </div>
  </div>
</div>
            <div className="rounded-xl border border-slate-200 bg-white/90 px-2 py-2 shadow-sm">
  <div className="flex items-center gap-2">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
      <FileText className="h-4 w-4" />
    </div>

    <div>
      <div className="text-xs text-slate-500">Forms</div>
      <div className="text-sm font-semibold text-slate-900">
        {data.formCount}
      </div>
    </div>
  </div>
</div>
          </div>
        </section>

       <CasePeopleForms
  caseId={data.id}
  persons={data.persons}
  forms={data.forms}
  formCount={data.formCount}
/>
        </div>
    </main>
  );
}