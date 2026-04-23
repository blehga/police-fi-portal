"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EditFICardPage() {
  const { id, fiId } = useParams<{ id: string; fiId: string }>();
  const { data: session } = useSession();

  const [form, setForm] = useState<any>({
    officerName: "",
    officerId: "",
    beat: "",
    fiDate: "",
    fiDay: "",
    fiTime: "",
  });

  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch(`/api/cases/${id}/forms/fi/${fiId}`);
      const data = await res.json();

      setForm({
        officerName: data.officerName || "",
        officerId: data.officerId || "",
        beat: data.beat || "",
        fiDate: data.fiDate || "",
        fiDay: data.fiDay || "",
        fiTime: data.fiTime || "",
      });

      setCanEdit(data.canEdit === true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!canEdit) return;

    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    if (!canEdit) return;

    await fetch(`/api/cases/${id}/forms/fi/${fiId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Officer Section */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Officer Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Officer Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Officer Name
            </label>
            <input
              name="officerName"
              value={form.officerName}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Badge ID */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Badge ID
            </label>
            <input
              name="officerId"
              value={form.officerId}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Beat */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Beat
            </label>
            <input
              name="beat"
              value={form.beat}
              onChange={handleChange}
              readOnly={!canEdit}
              className={`w-full border rounded px-3 py-2 ${
                canEdit ? "" : "bg-gray-100"
              }`}
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Date
            </label>
            <input
              type="date"
              name="fiDate"
              value={form.fiDate}
              onChange={handleChange}
              readOnly={!canEdit}
              className={`w-full border rounded px-3 py-2 ${
                canEdit ? "" : "bg-gray-100"
              }`}
            />
          </div>

          {/* Day */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Day
            </label>
            <input
              name="fiDay"
              value={form.fiDay}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Time
            </label>
            <input
              type="time"
              name="fiTime"
              value={form.fiTime}
              onChange={handleChange}
              readOnly={!canEdit}
              className={`w-full border rounded px-3 py-2 ${
                canEdit ? "" : "bg-gray-100"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      {canEdit && (
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      )}

      {!canEdit && (
        <div className="text-sm text-gray-500">
          You can only view this FI card.
        </div>
      )}
    </div>
  );
}