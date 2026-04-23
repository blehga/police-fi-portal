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
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PersonCard, { type PersonInput } from "@/components/PersonCard";

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

type NewPhoto = {
  file: File;
  preview: string;
  name: string;
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

function getDayFromDate(dateStr: string) {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return "";

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", { weekday: "long" });
}

const getCurrentDateString = () => {
  return new Date().toISOString().split("T")[0];
};

const getCurrentTimeString = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));

    reader.readAsDataURL(file);
  });
}

export default function AddFIPage() {
  const params = useParams();
  const caseId = params.id as string;
  const router = useRouter();
  const { data: session, status } = useSession();

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
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FIFormState>(initialForm);
  const [people, setPeople] = useState<PersonInput[]>([]);
  const [newPhotos, setNewPhotos] = useState<NewPhoto[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadCase() {
      try {
        setLoadingPage(true);
        setError(null);

        const caseRes = await fetch(`/api/cases/${caseId}`, { cache: "no-store" });

        if (!caseRes.ok) {
          throw new Error("Failed to load case");
        }

        const caseJson = await caseRes.json();

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
      } catch (err: any) {
        setError(err.message || "Failed to load case");
      } finally {
        setLoadingPage(false);
      }
    }

    if (caseId) {
      loadCase();
    }
  }, [caseId]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const firstName = String((session as any)?.user?.firstName ?? "").trim();
    const lastName = String((session as any)?.user?.lastName ?? "").trim();
    const badgeId = String((session as any)?.user?.badgeId ?? "").trim();

    const fullName = `${firstName} ${lastName}`.trim();
    const fiDate = getCurrentDateString();

    setForm((prev) => ({
      ...prev,
      officerName: fullName,
      officerId: badgeId,
      fiDate: prev.fiDate || fiDate,
      fiDay: prev.fiDay || getDayFromDate(prev.fiDate || fiDate),
      fiTime: prev.fiTime || getCurrentTimeString(),
    }));
  }, [session, status]);

  useEffect(() => {
    return () => {
      newPhotos.forEach((photo) => {
        if (photo.preview.startsWith("blob:")) {
          URL.revokeObjectURL(photo.preview);
        }
      });
    };
  }, [newPhotos]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updatePerson = (index: number, updated: PersonInput) => {
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
    setPeople((prev) => {
      const next = prev.filter((_, i) => i !== index);

      if (next.length === 1 && !next.some((person) => person.isPrimary)) {
        next[0] = { ...next[0], isPrimary: true };
      }

      return next;
    });
  };

  const addPerson = () => {
    setPeople((prev) => [
      ...prev,
      {
        ...blankPerson(),
        isPrimary: prev.length === 0,
      },
    ]);
  };

  const canAddMorePhotos = newPhotos.length < MAX_PHOTOS;

  const handleAddPhoto = (file?: File | null) => {
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

  const removeNewPhoto = (index: number) => {
    setNewPhotos((prev) => {
      const target = prev[index];
      if (target?.preview.startsWith("blob:")) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const viewerPhotos = useMemo(
    () =>
      newPhotos.map((photo, index) => ({
        key: `new-${index}`,
        src: photo.preview,
        label: photo.name || `New photo ${index + 1}`,
      })),
    [newPhotos]
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
  return (
    !loading &&
    !!caseFormData.incidentType.trim() &&
    !!caseFormData.incidentDate &&
    !!caseFormData.incidentTime &&
    !!caseFormData.incidentLocation.trim()
  );
}, [
  loading,
  caseFormData.incidentType,
  caseFormData.incidentDate,
  caseFormData.incidentTime,
  caseFormData.incidentLocation,
]);

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (
  !caseFormData.incidentType.trim() ||
  !caseFormData.incidentDate ||
  !caseFormData.incidentTime ||
  !caseFormData.incidentLocation.trim()
) {
  setError("Incident Type, Incident Date, Incident Time, and Incident Location are required.");
  return;
}
  setLoading(true);
  setError(null);

  try {
    // 1) Save editable case fields first
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

    const caseRaw = await caseRes.text();
    let casePayload: any = {};

    try {
      casePayload = caseRaw ? JSON.parse(caseRaw) : {};
    } catch {
      throw new Error(caseRaw || "Failed to update case.");
    }

    if (!caseRes.ok) {
      throw new Error(casePayload?.error || "Failed to update case.");
    }

    // 2) Encode FI photos
    const encodedPhotos = await Promise.all(
      newPhotos.map((photo) => readFileAsDataUrl(photo.file))
    );

    // 3) Create FI record
   const fiRes = await fetch(`/api/cases/${caseId}/forms/fi`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    ...form,
    incidentType: caseFormData.incidentType,
    incidentDate: caseFormData.incidentDate,
    incidentTime: caseFormData.incidentTime,
    incidentLocation: caseFormData.incidentLocation,
    people,
    photos: encodedPhotos,
  }),
});

    const fiRaw = await fiRes.text();
    let fiPayload: any = {};

    try {
      fiPayload = fiRaw ? JSON.parse(fiRaw) : {};
    } catch {
      throw new Error(fiRaw || "Unexpected response from server");
    }

    if (!fiRes.ok) {
      throw new Error(fiPayload?.error || "Failed to create FI form.");
    }

    router.push(`/cases/${caseId}`);
    router.refresh();
  } catch (err: any) {
    setError(err.message || "Network error. Please try again.");
  } finally {
    setLoading(false);
  }
};

  if (loadingPage) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur">
            <div className="text-sm text-slate-500">Loading case...</div>
          </div>
        </div>
      </main>
    );
  }

  if (!caseData) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-xl">
            Failed to load case.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-8 pb-32">
      <div className="mx-auto w-full max-w-5xl space-y-5">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur">
          <div className="border-b border-slate-200 px-6 py-5">
  <div className="flex items-start justify-between">
    
    <div className="inline-flex items-center rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-base font-semibold tracking-tight text-blue-800 shadow-sm">
      Add FI Record
    </div>

    <Link
      href={`/cases/${caseId}`}
      className="inline-flex items-center rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      ← Back to Case
    </Link>

  </div>
</div>

          <div className="px-6 py-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-semibold text-slate-800">
                Case Information
              </div>
           
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
  <div>
    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
      Case Number
    </label>
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900">
      {caseFormData.caseNumber}
    </div>
  </div>

  <div>
    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
      Incident Type
    </label>
    <input
      type="text"
      value={caseFormData.incidentType}
      required
      onChange={(e) =>
        setCaseFormData((prev) => ({
          ...prev,
          incidentType: e.target.value,
        }))
      }
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      placeholder="Incident type"
    />
  </div>

  <div>
    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
      Incident Date
    </label>
    <input
      type="date"
      value={caseFormData.incidentDate}
      required
      onChange={(e) =>
        setCaseFormData((prev) => ({
          ...prev,
          incidentDate: e.target.value,
        }))
      }
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        setCaseFormData((prev) => ({
          ...prev,
          incidentDate: getCurrentDateString(),
        }));
      }}
      title="Double-click to use current date"
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    />
  </div>

  <div>
    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
      Incident Time
    </label>
    <input
      type="time"
      value={caseFormData.incidentTime}
      required
      onChange={(e) =>
        setCaseFormData((prev) => ({
          ...prev,
          incidentTime: e.target.value,
        }))
      }
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        setCaseFormData((prev) => ({
          ...prev,
          incidentTime: getCurrentTimeString(),
        }));
      }}
      title="Double-click to use current time"
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    />
  </div>

  <div>
    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
      Incident Location
    </label>
    <input
      type="text"
      value={caseFormData.incidentLocation}
      required
      onChange={(e) =>
        setCaseFormData((prev) => ({
          ...prev,
          incidentLocation: e.target.value,
        }))
      }
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      placeholder="Enter incident location"
    />
  </div>
</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur">
            <div className="mb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Person Involved</h2>
                
                </div>

                <button
                  type="button"
                  onClick={addPerson}
                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  + Add Person
                </button>
              </div>
            </div>

            <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Subject Type
                  </label>
                  <select
                    name="subjectType"
                    value={form.subjectType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select subject type</option>
                    <option value="Suspect">Suspect</option>
                    <option value="Victim">Victim</option>
                    <option value="Witness">Witness</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {people.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                No people added yet.
              </div>
            ) : (
              <div className="space-y-4">
                {people.map((person, index) => (
                  <PersonCard
                    key={index}
                    person={person}
                    index={index}
                    subjectType={form.subjectType}
                    onChange={updatePerson}
                    onRemove={removePerson}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Reason for Stop
              </label>
              <input
                type="text"
                name="reasonForStop"
                value={form.reasonForStop}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Reason for stop"
              />
            </div>

            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Location of Stop
              </label>
              <input
                type="text"
                name="locationOfStop"
                value={form.locationOfStop}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Location of stop"
              />
            </div>

            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Disposition
              </label>
              <input
                type="text"
                name="disposition"
                value={form.disposition}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Disposition"
              />
            </div>

            <div className="mt-6">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-slate-900">FI Photos</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add up to 3 photos for this FI card.
                </p>
              </div>

              {viewerPhotos.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  No photos added yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {newPhotos.map((photo, index) => (
                    <div
                      key={`${photo.name}-${index}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-3 text-sm font-medium text-slate-700">
                        New Photo {index + 1}
                      </div>

                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => {
                            const viewerIndex = viewerPhotos.findIndex(
                              (item) => item.src === photo.preview
                            );
                            if (viewerIndex >= 0) openPhotoViewer(viewerIndex);
                          }}
                          className="relative block h-48 w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
                        >
                          <Image
                            src={photo.preview}
                            alt={`New FI photo ${index + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </button>

                        <div className="truncate text-xs text-slate-500">
                          {photo.name}
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => removeNewPhoto(index)}
                            className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {canAddMorePhotos && (
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
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Additional Comments
              </h2>
            </div>

            <textarea
              name="additionalComments"
              rows={6}
              value={form.additionalComments}
              onChange={handleChange}
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter comments"
            />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Officer Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
These values are auto-filled from the logged-in user.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Officer Name
                </label>
                <input
                  type="text"
                  name="officerName"
                  value={form.officerName}
                  readOnly
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
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
                  readOnly
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Beat"
                />
              </div>

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

      const today = getCurrentDateString();

      setForm((prev) => ({
        ...prev,
        fiDate: today,
        fiDay: getDayFromDate(today), // ✅ keep day in sync
      }));
    }}
    title="Double-click to use current date"
    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Monday"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  FI Time
                </label>

                <input
                  type="time"
                  name="fiTime"
                  value={form.fiTime || ""}
                  onChange={handleChange}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    setForm((prev) => ({
                      ...prev,
                      fiTime: getCurrentTimeString(),
                    }));
                  }}
                  title="Double-click to use current time"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              ❌ {error}
            </div>
          )}

          <div className="sticky bottom-0 z-30 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex items-center justify-end gap-3">
  <Link
    href={`/cases/${caseId}`}
    className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
  >
    Cancel
  </Link>

  <button
    type="submit"
    disabled={!canSubmit}
    className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {loading ? "Saving..." : "Save FI Card"}
  </button>
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