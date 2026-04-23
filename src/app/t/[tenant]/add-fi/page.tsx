"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type FormState = {
  firstName: string;
  lastName: string;
  subjectType: string;
  incidentType: string;
};

export default function AddFIPage() {
  const params = useParams<{ tenant: string }>();
  const tenant = params.tenant;

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    subjectType: "",
    incidentType: "",
  });

  const [saving, setSaving] = useState(false);
  const [createdCase, setCreatedCase] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setCreatedCase(null);

    try {
      const res = await fetch(`/api/t/${tenant}/fi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const raw = await res.text();
      let data: any = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Unexpected response from server");
      }

      if (!res.ok) {
        setError(data?.error ?? "Failed to save FI card.");
        return;
      }

      setCreatedCase(data.caseNumber as string);
      setForm({
        firstName: "",
        lastName: "",
        subjectType: "",
        incidentType: "",
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-3">
              New FI Record
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Add FI Card</h1>
            <p className="mt-1 text-sm text-slate-500">
              Create a new field interview record
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
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
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Subject Type
                  </label>
                  <select
                    name="subjectType"
                    value={form.subjectType}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
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
                    Incident Type
                  </label>
                  <input
                    type="text"
                    name="incidentType"
                    value={form.incidentType}
                    onChange={handleChange}
                    required
                    placeholder="Traffic Stop, Disturbance, etc."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  href={`/t/${tenant}/fi-list`}
                  className="flex-1 rounded-xl border border-slate-300 text-slate-700 py-3 text-center font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-blue-600 text-white py-3 font-medium shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {saving ? "Saving..." : "Save FI Card"}
                </button>
              </div>
            </form>

            {createdCase && (
              <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                ✅ Saved successfully. Case Number:{" "}
                <span className="font-semibold">{createdCase}</span>
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                ❌ {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}