"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PersonCard, { type PersonInput } from "@/components/PersonCard";
import ShareToggle from "@/components/ShareToggle";

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

type FIFormState = {
  subjectType: string;
  agency: string;
  reasonForStop: string;
  locationOfStop: string;
  disposition: string;
  officerName: string;
  officerId: string;
  beat: string;
  fiDate: string;
  fiDay: string;
  fiTime: string;
  additionalComments: string;
};

type ExistingPhoto = {
  id: string;
  url: string;
};

type NewPhoto = {
  file: File;
  preview: string;
  name: string;
};

type EditFIResponse = {
  caseFormId: string;
  fiCardId: string;
  isShared?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  subjectType: string;
  agency: string;
  reasonForStop: string;
  locationOfStop: string;
  disposition: string;
  additionalComments: string;
  officerName: string;
  officerId: string;
  beat: string;
  fiDate: string;
  fiDay: string;
  fiTime: string;
  people: PersonInput[];
  photos: ExistingPhoto[];
};

const MAX_PHOTOS = 3;

const initialForm: FIFormState = {
  subjectType: "",
  agency: "",
  reasonForStop: "",
  locationOfStop: "",
  disposition: "",
  officerName: "",
  officerId: "",
  beat: "",
  fiDate: "",
  fiDay: "",
  fiTime: "",
  additionalComments: "",
};

const blankPerson = (): PersonInput => ({
  firstName: "",
  middleName: "",
  lastName: "",
  nickname: "",
  dob: "",
  age: "",
  sex: "",
  race: "",

  role: "Subject",
  movementType: "",
  isPrimary: false,

  address: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  email: "",

  primaryLanguage: "",
  description: "",

  height: "",
  weight: "",
  build: "",
  hairColor: "",
  hairLength: "",
  hairStyle: "",
  eyeColor: "",
  complexion: "",
  teeth: "",
  handPreference: "",

  tattoos: "",
  scars: "",
  needleMarks: "",
  tracks: "",
  glasses: "",
  mustache: "",
  beard: "",

  socialSecurity: "",
  driverLicense: "",
  driverLicenseState: "",
  otherId: "",
  otherIdType: "",
  otherIdState: "",

  school: "",
  schoolAddress: "",
  schoolCity: "",
  schoolState: "",
  schoolZip: "",
  schoolPhone: "",

  parentName: "",
  parentAddress: "",
  parentCity: "",
  parentState: "",
  parentZip: "",
  parentPhone: "",

  occupation: "",
  employerName: "",
  employerAddress: "",
  employerCity: "",
  employerState: "",
  employerZip: "",
  employerPhone: "",

  gangName: "",
  gangMembershipLength: "",

  onParole: false,
  paroleOfficer: "",
  parolePhone: "",
  onProbation: false,
  probationOfficer: "",
  probationPhone: "",

  vehicleLicense: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleStyle: "",
  vehicleYear: "",
  vehicleColor: "",
  vehicleState: "",
  vehicleOddities: "",

  comments: "",
});

const getCurrentTimeString = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getCurrentDateString = () => {
  return new Date().toISOString().split("T")[0];
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));

    reader.readAsDataURL(file);
  });
}

function getDayFromDate(dateStr: string) {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return "";

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export default function EditFIPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const caseId = params.id as string;
  const fiId = params.fiId as string;
  const router = useRouter();

  const isViewMode = searchParams.get("view") === "1";

  const [caseData, setCaseData] = useState<CaseHeader | null>(null);
  const [caseFormData, setCaseFormData] = useState<CaseSharedState>({
    caseNumber: "",
    incidentType: "",
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
  });

  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [shareSaving, setShareSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FIFormState>(initialForm);
  const [people, setPeople] = useState<PersonInput[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<NewPhoto[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const [canEditRecord, setCanEditRecord] = useState(true);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingPage(true);
        setError(null);

        const [caseRes, fiRes] = await Promise.all([
          fetch(`/api/cases/${caseId}`, { cache: "no-store" }),
          fetch(`/api/cases/${caseId}/forms/fi/${fiId}`, { cache: "no-store" }),
        ]);

        if (!caseRes.ok) {
          throw new Error("Failed to load case");
        }

        if (!fiRes.ok) {
          throw new Error("Failed to load FI form");
        }

        const caseJson = await caseRes.json();
        const fiJson: EditFIResponse = await fiRes.json();

        setCaseData({
          id: caseJson.id,
          caseNumber: caseJson.caseNumber,
          incidentType: caseJson.incidentType ?? "",
          incidentDate: caseJson.incidentDate ?? null,
          incidentTime: caseJson.incidentTime ?? null,
          incidentLocation: caseJson.incidentLocation ?? null,
        });

        setCaseFormData({
          caseNumber: caseJson.caseNumber,
          incidentType: caseJson.incidentType ?? "",
          incidentDate: caseJson.incidentDate ?? "",
          incidentTime: caseJson.incidentTime ?? "",
          incidentLocation: caseJson.incidentLocation ?? "",
        });

        const fiDateValue = fiJson.fiDate ?? "";
        setForm({
          subjectType: fiJson.subjectType ?? "",
          agency: fiJson.agency ?? "",
          reasonForStop: fiJson.reasonForStop ?? "",
          locationOfStop: fiJson.locationOfStop ?? "",
          disposition: fiJson.disposition ?? "",
          officerName: fiJson.officerName ?? "",
          officerId: fiJson.officerId ?? "",
          beat: fiJson.beat ?? "",
          fiDate: fiDateValue,
          fiDay: fiDateValue ? getDayFromDate(fiDateValue) : fiJson.fiDay ?? "",
          fiTime: fiJson.fiTime ?? "",
          additionalComments: fiJson.additionalComments ?? "",
        });

        setPeople(
          Array.isArray(fiJson.people) && fiJson.people.length > 0
            ? fiJson.people.map((person) => ({
                ...blankPerson(),
                ...person,
              }))
            : []
        );

        setExistingPhotos(fiJson.photos ?? []);
        setCanEditRecord(Boolean(fiJson.canEdit ?? true));
        setIsShared(Boolean(fiJson.isShared ?? false));
      } catch (err: any) {
        setError(err.message || "Failed to load FI form");
      } finally {
        setLoadingPage(false);
      }
    }

    if (caseId && fiId) {
      loadData();
    }
  }, [caseId, fiId]);

  useEffect(() => {
    return () => {
      newPhotos.forEach((photo) => {
        if (photo.preview.startsWith("blob:")) {
          URL.revokeObjectURL(photo.preview);
        }
      });
    };
  }, [newPhotos]);

  const readOnlyMode = isViewMode || !canEditRecord;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (readOnlyMode) return;

    const { name, value } = e.target;

    if (name === "fiDate") {
      setForm((prev) => ({
        ...prev,
        fiDate: value,
        fiDay: getDayFromDate(value),
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updatePerson = (index: number, updated: PersonInput) => {
    if (readOnlyMode) return;

    setPeople((prev) =>
      prev.map((person, i) => {
        if (i === index) {
          return updated;
        }

        if (updated.isPrimary) {
          return { ...person, isPrimary: false };
        }

        return person;
      })
    );
  };

  const removePerson = (index: number) => {
    if (readOnlyMode) return;

    setPeople((prev) => {
      const next = prev.filter((_, i) => i !== index);

      if (next.length === 1 && !next.some((person) => person.isPrimary)) {
        next[0] = { ...next[0], isPrimary: true };
      }

      return next;
    });
  };

  const addPerson = () => {
    if (readOnlyMode) return;

    setPeople((prev) => [
      ...prev,
      {
        ...blankPerson(),
        isPrimary: prev.length === 0,
      },
    ]);
  };

  const totalPhotoCount = existingPhotos.length + newPhotos.length;
  const canAddMorePhotos = totalPhotoCount < MAX_PHOTOS;

  const handleAddPhoto = (file?: File | null) => {
    if (readOnlyMode) return;
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed for FI photos.");
      return;
    }

    if (!canAddMorePhotos) {
      setError(`A maximum of ${MAX_PHOTOS} photos is allowed.`);
      return;
    }

    const preview = URL.createObjectURL(file);

    setNewPhotos((prev) => [
      ...prev,
      {
        file,
        preview,
        name: file.name,
      },
    ]);

    setError(null);
  };

  const removeExistingPhoto = (photoId: string) => {
    if (readOnlyMode) return;

    setDeletedPhotoIds((prev) =>
      prev.includes(photoId) ? prev : [...prev, photoId]
    );
    setExistingPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  const removeNewPhoto = (index: number) => {
    if (readOnlyMode) return;

    setNewPhotos((prev) => {
      const target = prev[index];
      if (target?.preview.startsWith("blob:")) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const viewerPhotos = useMemo(
    () => [
      ...existingPhotos.map((photo, index) => ({
        key: `existing-${photo.id}`,
        src: photo.url,
        label: `Photo ${index + 1}`,
        type: "existing" as const,
        id: photo.id,
      })),
      ...newPhotos.map((photo, index) => ({
        key: `new-${index}`,
        src: photo.preview,
        label: photo.name || `New photo ${index + 1}`,
        type: "new" as const,
        index,
      })),
    ],
    [existingPhotos, newPhotos]
  );

  const openPhotoViewer = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closePhotoViewer = () => {
    setSelectedPhotoIndex(null);
  };

  const showPrevPhoto = () => {
    setSelectedPhotoIndex((prev) => {
      if (prev === null || viewerPhotos.length === 0) return null;
      return prev === 0 ? viewerPhotos.length - 1 : prev - 1;
    });
  };

  const showNextPhoto = () => {
    setSelectedPhotoIndex((prev) => {
      if (prev === null || viewerPhotos.length === 0) return null;
      return prev === viewerPhotos.length - 1 ? 0 : prev + 1;
    });
  };

  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePhotoViewer();
      } else if (e.key === "ArrowLeft") {
        showPrevPhoto();
      } else if (e.key === "ArrowRight") {
        showNextPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex, viewerPhotos.length]);

  const canSubmit = useMemo(() => {
    return !readOnlyMode && !loading && !!form.subjectType;
  }, [readOnlyMode, loading, form.subjectType]);

  const incidentDay = useMemo(
    () => getDayFromDate(caseFormData.incidentDate),
    [caseFormData.incidentDate]
  );

  const primaryPerson = useMemo(
    () => people.find((person) => person.isPrimary) ?? people[0] ?? null,
    [people]
  );

  const handleToggleShare = async () => {
    if (!canEditRecord || shareSaving) return;

    setShareSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/cases/${caseId}/forms/fi/${fiId}/share`, {
        method: "PATCH",
      });

      const raw = await res.text();
      let payload: any = {};

      try {
        payload = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Failed to update FI sharing");
      }

      if (!res.ok) {
        throw new Error(payload?.error || "Failed to update FI sharing");
      }

      setIsShared(Boolean(payload.isShared));
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update FI sharing");
    } finally {
      setShareSaving(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (readOnlyMode) return;

    setLoading(true);
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

      const caseJson = await caseRes.json();

      if (!caseRes.ok) {
        throw new Error(caseJson?.error || "Failed to update case");
      }

      const encodedNewPhotos = await Promise.all(
        newPhotos.map((photo) => readFileAsDataUrl(photo.file))
      );

      const fiRes = await fetch(`/api/cases/${caseId}/forms/fi/${fiId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          people,
          deletedPhotoIds,
          newPhotos: encodedNewPhotos,
        }),
      });

      const fiJson = await fiRes.json();

      if (!fiRes.ok) {
        throw new Error(fiJson?.error || "Failed to update FI");
      }

      router.push(`/cases/${caseId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  if (loadingPage) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-xl backdrop-blur">
            <div className="text-sm text-slate-500">Loading FI form...</div>
          </div>
        </div>
      </main>
    );
  }

  if (!caseData) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-xl">
            Failed to load FI form.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-6 pb-28">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-base font-semibold tracking-tight text-amber-800 shadow-sm">
                  {readOnlyMode ? "View FI Record" : "Edit FI Record"}
                </div>
              </div>

              <div className="flex flex-wrap items-start gap-2">
                {!canEditRecord && (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    Read Only
                  </span>
                )}

                <Link
                  href={`/api/cases/${caseId}/forms/fi/${fiId}/pdf`}
                  target="_blank"
                  className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  View PDF
                </Link>

                {canEditRecord && (
                  <ShareToggle
                    checked={isShared}
                    onChange={handleToggleShare}
                    disabled={shareSaving}
                  />
                )}

                <Link
                  href={`/cases/${caseId}`}
                  className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  ← Back to Case
                </Link>
              </div>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
                <div className="min-w-0">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Case Number
                  </label>
                  <div className="truncate rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900">
                    {caseFormData.caseNumber}
                  </div>
                </div>

                <div className="min-w-0">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Incident Type
                  </label>
                  <input
                    type="text"
                    value={caseFormData.incidentType}
                    onChange={
                      readOnlyMode
                        ? undefined
                        : (e) =>
                            setCaseFormData((prev) => ({
                              ...prev,
                              incidentType: e.target.value,
                            }))
                    }
                    readOnly={readOnlyMode}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 read-only:bg-slate-100"
                    placeholder="Incident type"
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Incident Date
                  </label>
                  <input
                    type="date"
                    value={caseFormData.incidentDate}
                    onChange={
                      readOnlyMode
                        ? undefined
                        : (e) =>
                            setCaseFormData((prev) => ({
                              ...prev,
                              incidentDate: e.target.value,
                            }))
                    }
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (!readOnlyMode) {
                        setCaseFormData((prev) => ({
                          ...prev,
                          incidentDate: getCurrentDateString(),
                        }));
                      }
                    }}
                    readOnly={readOnlyMode}
                    title="Double-click to use current date"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 read-only:bg-slate-100"
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Incident Day
                  </label>
                  <div className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-900">
                    {incidentDay || "—"}
                  </div>
                </div>

                <div className="min-w-0">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Incident Time
                  </label>

                  <input
                    type="time"
                    value={caseFormData.incidentTime}
                    onChange={
                      readOnlyMode
                        ? undefined
                        : (e) =>
                            setCaseFormData((prev) => ({
                              ...prev,
                              incidentTime: e.target.value,
                            }))
                    }
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (!readOnlyMode) {
                        setCaseFormData((prev) => ({
                          ...prev,
                          incidentTime: getCurrentTimeString(),
                        }));
                      }
                    }}
                    readOnly={readOnlyMode}
                    title="Double-click to use current time"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 read-only:bg-slate-100"
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Incident Location
                  </label>
                  <input
                    type="text"
                    value={caseFormData.incidentLocation}
                    onChange={
                      readOnlyMode
                        ? undefined
                        : (e) =>
                            setCaseFormData((prev) => ({
                              ...prev,
                              incidentLocation: e.target.value,
                            }))
                    }
                    readOnly={readOnlyMode}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 read-only:bg-slate-100"
                    placeholder="Incident location"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(330px,0.95fr)]">
            <div className="space-y-4">
              <section className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-xl backdrop-blur">
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 className="text-lg font-semibold text-slate-900">
        Person Involved
      </h2>
    </div>

    <div className="flex items-center gap-3">
      <div className="w-[220px]">
        <select
          name="subjectType"
          value={form.subjectType}
          onChange={handleChange}
          required
          disabled={readOnlyMode}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="">Select subject type</option>
          <option value="Suspect">Suspect</option>
          <option value="Victim">Victim</option>
          <option value="Witness">Witness</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {!readOnlyMode && (
        <button
          type="button"
          onClick={addPerson}
          className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
        >
          + Add Person
        </button>
      )}
    </div>
  </div>

  {people.length === 0 ? (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
      No people added yet.
    </div>
  ) : (
    <div className="space-y-4">
      {people.map((person, index) => (
        <div
          key={index}
          className={readOnlyMode ? "opacity-95" : ""}
        >
          <PersonCard
            person={person}
            index={index}
            subjectType={form.subjectType}
            readOnlyMode={readOnlyMode}
            onChange={updatePerson}
            onRemove={removePerson}
          />
        </div>
      ))}
    </div>
  )}
</section>

              <section className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Reason for Stop
                    </label>
                    <input
                      type="text"
                      name="reasonForStop"
                      value={form.reasonForStop}
                      onChange={handleChange}
                      readOnly={readOnlyMode}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 read-only:bg-slate-100"
                      placeholder="Reason for stop"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Location of Stop
                    </label>
                    <input
                      type="text"
                      name="locationOfStop"
                      value={form.locationOfStop}
                      onChange={handleChange}
                      readOnly={readOnlyMode}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 read-only:bg-slate-100"
                      placeholder="Location of stop"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Disposition
                    </label>
                    <input
                      type="text"
                      name="disposition"
                      value={form.disposition}
                      onChange={handleChange}
                      readOnly={readOnlyMode}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 read-only:bg-slate-100"
                      placeholder="Disposition"
                    />
                  </div>
                   </div>
                  </section>

                  <section className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-xl backdrop-blur">
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {/* Row 1 */}
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Officer Name
      </label>
      <input
        type="text"
        name="officerName"
        value={form.officerName}
        onChange={handleChange}
        readOnly={readOnlyMode}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 read-only:bg-slate-100"
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
        onChange={handleChange}
        readOnly={readOnlyMode}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 read-only:bg-slate-100"
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
        readOnly={readOnlyMode}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 read-only:bg-slate-100"
        placeholder="Beat"
      />
    </div>

    {/* Row 2 */}
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Date
      </label>
      <input
        type="date"
        name="fiDate"
        value={form.fiDate}
        onChange={handleChange}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!readOnlyMode) {
            const today = getCurrentDateString();
            setForm((prev) => ({
              ...prev,
              fiDate: today,
              fiDay: getDayFromDate(today),
            }));
          }
        }}
        readOnly={readOnlyMode}
        title="Double-click to use current date"
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 read-only:bg-slate-100"
      />
    </div>

    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Day
      </label>
      <input
        type="text"
        name="fiDay"
        value={form.fiDay}
        readOnly
        className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none"
        placeholder="Day"
      />
    </div>

    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Time
      </label>
      <input
        type="time"
        name="fiTime"
        value={form.fiTime}
        onChange={handleChange}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!readOnlyMode) {
            setForm((prev) => ({
              ...prev,
              fiTime: getCurrentTimeString(),
            }));
          }
        }}
        readOnly={readOnlyMode}
        title="Double-click to use current time"
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 read-only:bg-slate-100"
      />
    </div>
  </div>
</section>
            </div>

            <aside className="self-start space-y-4 xl:sticky xl:top-4">
              <section className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-xl backdrop-blur">
                <div className="mb-3">
                  <h3 className="text-base font-semibold text-slate-900">Photos</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {readOnlyMode
                      ? "Viewing photos for this FI card."
                      : "Manage up to 3 FI photos."}
                  </p>
                </div>

                {viewerPhotos.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    No photos added yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {viewerPhotos.map((photo, index) => (
                      <div
                        key={photo.key}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-2"
                      >
                        <button
                          type="button"
                          onClick={() => openPhotoViewer(index)}
                          className="relative block aspect-square w-full overflow-hidden rounded-lg border border-slate-200 bg-white"
                        >
                          <Image
                            src={photo.src}
                            alt={photo.label}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </button>

                        {!readOnlyMode && (
                          <div className="mt-2 flex justify-end">
                            {photo.type === "existing" ? (
                              <button
                                type="button"
                                onClick={() => removeExistingPhoto(photo.id)}
                                className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeNewPhoto(photo.index)}
                                className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {!readOnlyMode && canAddMorePhotos && (
                  <div className="mt-4">
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100">
                      + Add Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          handleAddPhoto(e.target.files?.[0] ?? null);
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-xl backdrop-blur">
                <div className="mb-3">
                  <h3 className="text-base font-semibold text-slate-900">
                    Additional Comments
                  </h3>
                </div>

                <textarea
                  name="additionalComments"
                  rows={5}
                  value={form.additionalComments}
                  onChange={handleChange}
                  readOnly={readOnlyMode}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 read-only:bg-slate-100 read-only:text-slate-700"
                  placeholder="Enter comments"
                />
              </section>
            </aside>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              ❌ {error}
            </div>
          )}

          <div className="sticky bottom-0 z-30 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-3">
              <Link
                href={`/cases/${caseId}`}
                className="inline-flex min-w-[160px] items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {readOnlyMode ? "Back to Case" : "Cancel"}
              </Link>

              {!readOnlyMode && (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex min-w-[180px] items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Update FI Card"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {selectedPhotoIndex !== null && viewerPhotos[selectedPhotoIndex] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4">
          <button
            type="button"
            onClick={closePhotoViewer}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Close
          </button>

          {viewerPhotos.length > 1 && (
            <button
              type="button"
              onClick={showPrevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-2xl text-white transition hover:bg-white/20"
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}

          <div className="relative flex h-[80vh] w-full max-w-6xl items-center justify-center">
            <Image
              src={viewerPhotos[selectedPhotoIndex].src}
              alt={viewerPhotos[selectedPhotoIndex].label}
              fill
              unoptimized
              className="object-contain"
            />
          </div>

          {viewerPhotos.length > 1 && (
            <button
              type="button"
              onClick={showNextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-2xl text-white transition hover:bg-white/20"
              aria-label="Next photo"
            >
              ›
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
            {selectedPhotoIndex + 1} / {viewerPhotos.length}
          </div>
        </div>
      )}
    </main>
  );
}