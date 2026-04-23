"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type FICard = {
  id: string;
  caseNumber: string;
  firstName: string;
  lastName: string;
  subjectType: string;
  incidentType: string;
  canEdit?: boolean;
};

type Photo = {
  id: string;
  url: string;
};

export default function EditFIPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const fiId = String(params?.id || "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<FICard>({
    id: fiId,
    caseNumber: "",
    firstName: "",
    lastName: "",
    subjectType: "",
    incidentType: "",
    canEdit: false,
  });

  useEffect(() => {
    if (!fiId) return;
    setForm((f) => ({ ...f, id: fiId }));
  }, [fiId]);

  useEffect(() => {
    if (!fiId) return;
    let isMounted = true;

    const load = async () => {
      try {
        const res = await fetch(`/api/fi/${fiId}`, { cache: "no-store" });
        const raw = await res.text();

        let data: any = {};
        try {
          data = raw ? JSON.parse(raw) : {};
        } catch {
          throw new Error(raw || "Failed to load FI");
        }

        if (res.status === 403) {
          router.replace(`/fi/${fiId}`);
          return;
        }

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load FI");
        }

        if (!data?.canEdit) {
          router.replace(`/fi/${fiId}`);
          return;
        }

        if (!isMounted) return;

        setForm({
          id: fiId,
          caseNumber: data.caseNumber ?? "",
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          subjectType: data.subjectType ?? "",
          incidentType: data.incidentType ?? "",
          canEdit: !!data.canEdit,
        });
        setPhotos(data.photos || []);
      } catch (e: any) {
        if (isMounted) {
          setError(e.message || "Failed to load FI");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [fiId, router]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/fi/${fiId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          subjectType: form.subjectType,
          incidentType: form.incidentType,
        }),
      });

      const raw = await res.text();
      let data: any = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Failed to update FI");
      }

      if (res.status === 403) {
        router.replace(`/fi/${fiId}`);
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update FI");
      }

      router.push(`/fi/${fiId}`);
    } catch (e: any) {
      setError(e.message || "Network error");
    } finally {
      setSaving(false);
    }
  };

  const onRemovePhoto = async (photoId: string) => {
    if (!confirm("Remove this photo?")) return;

    setRemovingId(photoId);

    try {
      const res = await fetch(`/api/fi/photo/${photoId}`, { method: "DELETE" });
      const raw = await res.text();

      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Failed to delete photo");
      }

      if (res.status === 403) {
        router.replace(`/fi/${fiId}`);
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete photo");
      }

      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err: any) {
      alert(err.message || "Failed to delete photo");
    } finally {
      setRemovingId(null);
    }
  };

  const onUploadPhotos = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const list = inputEl.files;
    if (!list || list.length === 0) return;

    const remaining = Math.max(0, 3 - photos.length);
    const files = Array.from(list).slice(0, remaining);

    const formData = new FormData();
    for (const f of files) {
      formData.append("files", f);
    }

    try {
      setUploading(true);

      const res = await fetch(`/api/fi/${fiId}/upload`, {
        method: "POST",
        body: formData,
      });

      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json")
        ? await res.json()
        : await res.text();

      if (res.status === 403) {
        router.replace(`/fi/${fiId}`);
        return;
      }

      if (!res.ok) {
        throw new Error(
          typeof payload === "string"
            ? payload
            : payload?.error || "Upload failed"
        );
      }

      const newItems = Array.isArray((payload as any).items)
        ? (payload as any).items
        : [];

      setPhotos((prev) => [...prev, ...newItems]);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
      inputEl.value = "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl p-8 text-center text-slate-600">
            Loading…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-3">
                Edit FI Record
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Edit FI <span className="font-mono">#{form.caseNumber}</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Update field interview details and attached photos
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/fi/${fiId}`}
                className="rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </Link>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                ❌ {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6" autoComplete="off">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Case Number
                  </label>
                  <input
                    type="text"
                    value={form.caseNumber}
                    readOnly
                    className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Subject Type
                  </label>
                  <select
                    name="subjectType"
                    value={form.subjectType}
                    onChange={onChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option value="">Select subject type</option>
                    <option value="Suspect">Suspect</option>
                    <option value="Victim">Victim</option>
                    <option value="Witness">Witness</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    placeholder="Enter last name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Incident Type
                  </label>
                  <input
                    name="incidentType"
                    value={form.incidentType}
                    onChange={onChange}
                    required
                    placeholder="Traffic Stop, Disturbance, etc."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Photos</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Upload up to 3 photos for this FI record
                  </p>
                </div>

                {photos.length > 0 ? (
                  <div className="flex gap-4 flex-wrap">
                    {photos.map((p) => (
                      <div
                        key={p.id}
                        className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm"
                      >
                        <img
                          src={p.url}
                          alt="FI Photo"
                          className="w-32 h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => onRemovePhoto(p.id)}
                          disabled={removingId === p.id}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600 text-white text-sm flex items-center justify-center shadow hover:bg-red-700 disabled:opacity-50"
                          title="Remove photo"
                          aria-label="Remove photo"
                        >
                          {removingId === p.id ? "…" : "×"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600">
                    No photos uploaded yet.
                  </div>
                )}

                {photos.length < 3 && (
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Add photo(s)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
                      onChange={onUploadPhotos}
                    />
                    {uploading && (
                      <p className="mt-2 text-sm text-slate-500">Uploading…</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  href={`/fi/${fiId}`}
                  className="flex-1 rounded-xl border border-slate-300 text-slate-700 py-3 text-center font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-blue-600 text-white py-3 font-medium shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}