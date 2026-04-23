"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  FileText,
  Printer,
  Images,
  Users,
} from "lucide-react";
import CaseFormShareBadge from "@/components/CaseFormShareBadge";

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
  createdByName?: string;
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

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function getFormSummary(form: CaseForm) {
  if (form.formType === "NARRATIVE") {
    const raw = form.narrative?.narrativeText || "";

    const cleanText = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    return cleanText.length > 140
      ? `${cleanText.slice(0, 140)}...`
      : cleanText || "No Summary";
  }

  return "No Summary";
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
  return form.formType === "FI"
    ? `/cases/${caseId}/edit-fi/${form.id}`
    : `/cases/${caseId}/edit-narrative/${form.id}`;
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

export default function CasePeopleForms({
  caseId,
  persons,
  forms,
  formCount,
}: {
  caseId: string;
  persons: CasePerson[];
  forms: CaseForm[];
  formCount: number;
}) {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  const filteredForms = useMemo(() => {
    if (!selectedPersonId) return forms;
    return forms.filter((form) =>
      form.people.some((person) => person.id === selectedPersonId)
    );
  }, [forms, selectedPersonId]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
      <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">People</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              People currently linked to this case.
            </p>
          </div>

          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {persons.length}
          </span>
        </div>

        <div className="p-4">
          {persons.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-500">
              No people added yet.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedPersonId(null)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  selectedPersonId === null
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Show All
              </button>

              {persons.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => setSelectedPersonId(person.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    selectedPersonId === person.id
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {person.fullName || "Unknown"}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Case Forms
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Field interviews and narratives visible to you.
            </p>
          </div>

          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {selectedPersonId ? filteredForms.length : formCount}
          </span>
        </div>

        <div className="divide-y divide-slate-200">
          {filteredForms.length === 0 ? (
            <div className="p-4">
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-500">
                No forms added yet.
              </div>
            </div>
          ) : (
            filteredForms.map((form) => {
              const hasImages =
                form.formType === "FI" &&
                ((form.fiCard?.photoCount ?? 0) > 0 ||
                  (form.fiCard?.photos?.length ?? 0) > 0);

              return (
                <div key={form.id} className="px-4 py-3">
                  <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            form.formType === "FI"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {form.formType === "FI"
                            ? "Field Interview Report"
                            : "Narrative Report"}
                        </span>

                        <span className="text-xs text-slate-500">
  Created By:{" "}
  <span className="font-medium text-slate-700">
    {form.createdByName || "Unknown"}
  </span>{" "}
  • {formatDateTime(form.createdAt)}
  {form.updatedAt && form.updatedAt !== form.createdAt && (
    <>
      {" "}• Updated {formatDateTime(form.updatedAt)}
    </>
  )}
</span>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                        <div className="text-sm font-semibold leading-snug text-slate-900">
                          {getFormSummary(form)}
                        </div>

                        <div className="mt-2 flex min-w-0 items-start gap-2 text-sm text-slate-600">
                          <Users className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                          <div className="min-w-0 max-w-[240px] flex-1 text-sm">
                            {getPeopleSummary(
                              form.people,
                              form.fiCard?.subjectType
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-nowrap items-start gap-2 xl:justify-end">
                      {form.canEdit ? (
                        <CaseFormShareBadge
                          caseId={caseId}
                          formId={form.id}
                          formType={form.formType}
                          initialShared={Boolean(form.isShared)}
                        />
                      ) : (
                        <FormVisibilityBadge
                          isShared={Boolean(form.isShared)}
                        />
                      )}

                      <ActionIconLink
                        href={getOpenHref(caseId, form)}
                        title="Open"
                        className="border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      >
                        <Eye className="h-4 w-4" />
                      </ActionIconLink>

                      {form.canEdit ? (
                        <ActionIconLink
                          href={getEditHref(caseId, form)}
                          title="Edit"
                          className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </ActionIconLink>
                      ) : (
                        <ActionIconDisabled title="View only">
                          <Pencil className="h-4 w-4" />
                        </ActionIconDisabled>
                      )}

                      <ActionIconLink
                        href={getPdfHref(caseId, form)}
                        target="_blank"
                        title="View PDF"
                        className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        <FileText className="h-4 w-4" />
                      </ActionIconLink>

                      <ActionIconLink
                        href={getPdfHref(caseId, form, true)}
                        target="_blank"
                        title="Print"
                        className="border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      >
                        <Printer className="h-4 w-4" />
                      </ActionIconLink>

                      {hasImages ? (
                        <ActionIconLink
                          href={getImagesHref(caseId, form)}
                          title="View Images"
                          className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          <Images className="h-4 w-4" />
                        </ActionIconLink>
                      ) : (
                        <ActionIconDisabled
                          title={
                            form.formType === "FI"
                              ? "No images"
                              : "Images only available for FI"
                          }
                        >
                          <Images className="h-4 w-4" />
                        </ActionIconDisabled>
                      )}

                      {form.canDelete ? (
                        <button
                          type="button"
                          title="Delete"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <ActionIconDisabled title="Cannot delete">
                          <Trash2 className="h-4 w-4" />
                        </ActionIconDisabled>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}