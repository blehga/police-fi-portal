"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

type UserDetail = {
  id: string;
  firstName: string;
  lastName: string;
  badgeId: string | null;
  username: string;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  roles: string[];
  permissions: string[];
};

type RoleItem = {
  id: string;
  name: string;
};

export default function UserDetailPage() {
  const { data: session } = useSession();
  const { can, status } = usePermissions();
  const allowed = can("ADMIN_USERS");
  const params = useParams<{ id: string }>();

  const [data, setData] = useState<UserDetail | null>(null);
  const [rolesCatalog, setRolesCatalog] = useState<RoleItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editBadgeId, setEditBadgeId] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingRoles, setSavingRoles] = useState(false);

  const tenantSlug =
    typeof (session as any)?.tenant === "string"
      ? (session as any).tenant.trim().toLowerCase()
      : "";

  function tenantHeaders(extra?: HeadersInit): HeadersInit {
    return {
      "Content-Type": "application/json",
      ...(tenantSlug ? { "x-tenant-slug": tenantSlug } : {}),
      ...(extra ?? {}),
    };
  }

  async function loadUser() {
    if (!tenantSlug) {
      throw new Error("Missing tenant context");
    }

    const res = await fetch(`/api/admin/users/${params.id}`, {
      cache: "no-store",
      headers: tenantHeaders({ Accept: "application/json" }),
    });

    const raw = await res.text();
    let json: any = {};

    try {
      json = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error(raw || "Failed to load user");
    }

    if (!res.ok) {
      throw new Error(json?.error || "Failed to load user");
    }

    setData(json);
    setEditFirstName(json.firstName || "");
    setEditLastName(json.lastName || "");
    setEditBadgeId(json.badgeId || "");
    setEditUsername(json.username || "");
    setEditEmail(json.email || "");
    setSelectedRoles(json.roles || []);
  }

  async function loadRoles() {
    if (!tenantSlug) {
      throw new Error("Missing tenant context");
    }

    const res = await fetch("/api/admin/roles", {
      cache: "no-store",
      headers: tenantHeaders({ Accept: "application/json" }),
    });

    const raw = await res.text();
    let json: any = {};

    try {
      json = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error(raw || "Failed to load roles");
    }

    if (!res.ok) {
      throw new Error(json?.error || "Failed to load roles");
    }

    setRolesCatalog(json.items || []);
  }

  useEffect(() => {
    if (status !== "authenticated" || !allowed || !tenantSlug) return;

    (async () => {
      try {
        setError(null);
        await Promise.all([loadUser(), loadRoles()]);
      } catch (e: any) {
        setError(e.message || "Failed to load user");
      }
    })();
  }, [status, allowed, params.id, tenantSlug]);

  function toggleRole(roleName: string) {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  }

  async function saveProfile() {
    if (!tenantSlug) {
      setError("Missing tenant context");
      return;
    }

    try {
      setSavingProfile(true);
      setError(null);

      const res = await fetch(`/api/admin/users/${params.id}`, {
        method: "PATCH",
        headers: tenantHeaders(),
        body: JSON.stringify({
          firstName: editFirstName,
          lastName: editLastName,
          badgeId: editBadgeId,
          username: editUsername,
          email: editEmail,
        }),
      });

      const raw = await res.text();
      let json: any = {};

      try {
        json = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Failed to update user");
      }

      if (!res.ok) {
        throw new Error(json?.error || "Failed to update user");
      }

      setData((prev) =>
        prev
          ? {
              ...prev,
              firstName: json.user.firstName,
              lastName: json.user.lastName,
              badgeId: json.user.badgeId ?? null,
              username: json.user.username,
              email: json.user.email,
            }
          : prev
      );
    } catch (e: any) {
      setError(e.message || "Failed to update user");
    } finally {
      setSavingProfile(false);
    }
  }

  async function toggleUserStatus() {
    if (!data) return;
    if (!tenantSlug) {
      setError("Missing tenant context");
      return;
    }

    try {
      setSavingStatus(true);
      setError(null);

      const res = await fetch(`/api/admin/users/${params.id}/status`, {
        method: "PATCH",
        headers: tenantHeaders(),
        body: JSON.stringify({ isActive: !data.isActive }),
      });

      const raw = await res.text();
      let json: any = {};

      try {
        json = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Failed to update status");
      }

      if (!res.ok) {
        throw new Error(json?.error || "Failed to update status");
      }

      setData((prev) =>
        prev ? { ...prev, isActive: json.user.isActive } : prev
      );
    } catch (e: any) {
      setError(e.message || "Failed to update status");
    } finally {
      setSavingStatus(false);
    }
  }

  async function saveRoles() {
    if (!tenantSlug) {
      setError("Missing tenant context");
      return;
    }

    try {
      setSavingRoles(true);
      setError(null);

      const res = await fetch(`/api/admin/users/${params.id}/roles`, {
        method: "PATCH",
        headers: tenantHeaders(),
        body: JSON.stringify({ roles: selectedRoles }),
      });

      const raw = await res.text();
      let json: any = {};

      try {
        json = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Failed to update roles");
      }

      if (!res.ok) {
        throw new Error(json?.error || "Failed to update roles");
      }

      await loadUser();
    } catch (e: any) {
      setError(e.message || "Failed to update roles");
    } finally {
      setSavingRoles(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl p-8 text-center text-slate-600">
            Loading session…
          </div>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <div className="bg-white/95 backdrop-blur border border-red-200 rounded-2xl shadow-xl p-8 text-center text-red-600">
            ❌ You do not have permission to view this user.
          </div>
        </div>
      </div>
    );
  }

  if (!tenantSlug) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <div className="bg-white/95 backdrop-blur border border-red-200 rounded-2xl shadow-xl p-8 text-center text-red-600">
            ❌ Missing tenant context in session.
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <div className="bg-white/95 backdrop-blur border border-red-200 rounded-2xl shadow-xl p-8 text-center text-red-600">
            ❌ {error}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
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

  const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
  const displayName = fullName || data.username;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            ❌ {error}
          </div>
        )}

        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-3">
                User Profile
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                {displayName}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Edit account details, roles, and access
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleUserStatus}
                disabled={savingStatus}
                className={`rounded-xl px-4 py-2.5 font-medium text-white transition disabled:opacity-50 ${
                  data.isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {savingStatus
                  ? "Saving..."
                  : data.isActive
                  ? "Disable User"
                  : "Enable User"}
              </button>

              <Link
                href="/admin/users"
                className="rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                ← Back to Users
              </Link>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <label className="text-sm font-medium text-slate-500">
                  First Name
                </label>
                <input
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <label className="text-sm font-medium text-slate-500">
                  Last Name
                </label>
                <input
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <label className="text-sm font-medium text-slate-500">
                  Badge ID
                </label>
                <input
                  value={editBadgeId}
                  onChange={(e) => setEditBadgeId(e.target.value)}
                  placeholder="Enter badge ID"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <label className="text-sm font-medium text-slate-500">
                  Username
                </label>
                <input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <label className="text-sm font-medium text-slate-500">
                  Email
                </label>
                <input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="No email"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-sm font-medium text-slate-500">Status</div>
                <div className="mt-2">
                  {data.isActive ? (
                    <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-sm font-medium text-slate-500">Created</div>
                <div className="mt-1 text-base font-medium text-slate-900">
                  {new Date(data.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={saveProfile}
                disabled={savingProfile}
                className="rounded-xl bg-blue-600 text-white px-4 py-2.5 font-medium hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Roles</h2>
            <p className="mt-1 text-sm text-slate-500">
              Assign roles to control this user’s permissions
            </p>
          </div>

          <div className="p-6 space-y-5">
            {rolesCatalog.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rolesCatalog.map((role) => {
                  const checked = selectedRoles.includes(role.name);

                  return (
                    <label
                      key={role.id}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                        checked
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRole(role.name)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-medium text-slate-800">
                        {role.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600">
                No roles found.
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={saveRoles}
                disabled={savingRoles}
                className="rounded-xl bg-blue-600 text-white px-4 py-2.5 font-medium hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {savingRoles ? "Saving..." : "Save Roles"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Effective Access</h2>
            <p className="mt-1 text-sm text-slate-500">
              Permissions inherited from the assigned roles
            </p>
          </div>

          <div className="p-6 space-y-5">
            {data.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.permissions.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                  >
                    {p}
                  </span>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600">
                No permissions assigned.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                  data.permissions.includes("REPORT_READ")
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                ✔ Read
              </div>

              <div
                className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                  data.permissions.includes("REPORT_WRITE")
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                ✔ Write
              </div>

              <div
                className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                  data.permissions.includes("REPORT_DELETE")
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                ✔ Delete
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}