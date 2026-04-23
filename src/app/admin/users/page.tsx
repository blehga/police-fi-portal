"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePermissions } from "@/hooks/usePermissions";
import { Pencil, KeyRound, UserX, UserCheck } from "lucide-react";

type User = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string;
  username: string;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  roles: string[];
};

export default function UsersListPage() {
  const { data: session } = useSession();

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetUser, setResetUser] = useState<{ id: string; username: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { can, status } = usePermissions();
  const allowed = can("ADMIN_USERS");

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

  const roleOptions = useMemo(() => {
    const uniqueRoles = Array.from(
      new Set(users.flatMap((u) => u.roles || []))
    ).sort((a, b) => a.localeCompare(b));

    return uniqueRoles;
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return users.filter((u) => {
      const displayFullName =
        u.fullName || `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();

      const matchesSearch =
        !q ||
        displayFullName.toLowerCase().includes(q) ||
        (u.firstName ?? "").toLowerCase().includes(q) ||
        (u.lastName ?? "").toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q);

      const matchesRole =
        roleFilter === "all" || u.roles.includes(roleFilter);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.isActive) ||
        (statusFilter === "inactive" && !u.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter, pageSize]);

  const totalRecords = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, startIndex, endIndex]);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, safeCurrentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [safeCurrentPage, totalPages]);

  async function resetPassword() {
    if (!resetUser) return;
    if (!tenantSlug) {
      alert("❌ Missing tenant context");
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${resetUser.id}/reset-password`, {
        method: "POST",
        headers: tenantHeaders(),
        body: JSON.stringify({ newPassword }),
      });

      const raw = await res.text();
      let data: any = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Unexpected response");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to reset password");
      }

      alert(`✅ Password reset for ${resetUser.username}`);
      setResetUser(null);
      setNewPassword("");
      setShowPassword(false);
    } catch (err: any) {
      alert(`❌ ${err.message || "Failed to reset password"}`);
    }
  }

  async function toggleUserStatus(user: User) {
    if (!tenantSlug) {
      alert("❌ Missing tenant context");
      return;
    }

    try {
      setTogglingUserId(user.id);

      const res = await fetch(`/api/admin/users/${user.id}/status`, {
        method: "PATCH",
        headers: tenantHeaders(),
        body: JSON.stringify({ isActive: !user.isActive }),
      });

      const raw = await res.text();
      let data: any = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Unexpected response");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update status");
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isActive: data.user.isActive } : u
        )
      );
    } catch (err: any) {
      alert(`❌ ${err.message || "Failed to update status"}`);
    } finally {
      setTogglingUserId(null);
    }
  }

  useEffect(() => {
    if (status !== "authenticated" || !allowed || !tenantSlug) return;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/admin/users", {
          cache: "no-store",
          headers: tenantHeaders({ Accept: "application/json" }),
        });

        const raw = await res.text();
        let data: any = {};

        try {
          data = raw ? JSON.parse(raw) : {};
        } catch {
          throw new Error(raw || "Failed to fetch users");
        }

        if (!res.ok) {
          throw new Error(data?.error || "Failed to fetch users");
        }

        setUsers(data.items || []);
      } catch (e: any) {
        setError(e.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [status, allowed, tenantSlug]);

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
            ❌ You do not have permission to view users.
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

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">User Accounts</h1>
              <p className="mt-1 text-sm text-slate-500">
                View users, roles, and manage account access
              </p>
            </div>

            <Link
              href="/admin/users/new"
              className="rounded-xl bg-blue-600 text-white px-4 py-2.5 font-medium shadow-md hover:bg-blue-700 transition"
            >
              + Add User
            </Link>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600">
                Loading users…
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                ❌ {error}
              </div>
            ) : (
              <>
                <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Search by Name
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or username"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Role
                    </label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white"
                    >
                      <option value="all">All Roles</option>
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4 flex justify-end">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-slate-600">Rows per page</label>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                {paginatedUsers.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600">
                    No users match the selected filters.
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="min-w-full text-sm">
                        <thead className="bg-slate-100 text-slate-700">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold">Name</th>
                            <th className="px-4 py-3 text-left font-semibold">Email</th>
                            <th className="px-4 py-3 text-left font-semibold">Roles</th>
                            <th className="px-4 py-3 text-left font-semibold">Status</th>
                            <th className="px-4 py-3 text-left font-semibold">Created</th>
                            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {paginatedUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50 transition">
                              <td className="px-4 py-3">
                                <Link
                                  href={`/admin/users/${u.id}`}
                                  className="font-medium text-blue-600 hover:underline"
                                >
                                  {u.fullName ||
                                    `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
                                    u.username}
                                </Link>
                                <div className="text-xs text-slate-500 mt-0.5">
                                  @{u.username}
                                </div>
                              </td>

                              <td className="px-4 py-3 text-slate-700">
                                {u.email || "—"}
                              </td>

                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-2">
                                  {u.roles.map((role) => (
                                    <span
                                      key={role}
                                      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                                    >
                                      {role}
                                    </span>
                                  ))}
                                </div>
                              </td>

                              <td className="px-4 py-3">
                                {u.isActive ? (
                                  <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                                    Inactive
                                  </span>
                                )}
                              </td>

                              <td className="px-4 py-3 text-slate-700">
                                {new Date(u.createdAt).toLocaleDateString()}
                              </td>

                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/admin/users/${u.id}`}
                                    title="Edit user"
                                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Link>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setResetUser({ id: u.id, username: u.username });
                                      setNewPassword("");
                                      setShowPassword(false);
                                    }}
                                    title="Reset password"
                                    className="inline-flex items-center justify-center rounded-lg border border-blue-200 p-2 text-blue-600 hover:bg-blue-50 transition"
                                  >
                                    <KeyRound className="h-4 w-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => toggleUserStatus(u)}
                                    disabled={togglingUserId === u.id}
                                    title={u.isActive ? "Disable user" : "Enable user"}
                                    className={`inline-flex items-center justify-center rounded-lg border p-2 transition disabled:opacity-50 ${
                                      u.isActive
                                        ? "border-red-200 text-red-600 hover:bg-red-50"
                                        : "border-green-200 text-green-600 hover:bg-green-50"
                                    }`}
                                  >
                                    {togglingUserId === u.id ? (
                                      <span className="text-xs font-medium">...</span>
                                    ) : u.isActive ? (
                                      <UserX className="h-4 w-4" />
                                    ) : (
                                      <UserCheck className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="text-sm text-slate-500">
                        Page {safeCurrentPage} of {totalPages} · {totalRecords} total
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={safeCurrentPage === 1}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          Previous
                        </button>

                        {pageNumbers.map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            className={`rounded-lg px-3 py-2 text-sm transition ${
                              page === safeCurrentPage
                                ? "bg-blue-600 text-white"
                                : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={safeCurrentPage === totalPages}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {resetUser && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Reset Password
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Set a new password for <span className="font-medium text-slate-800">{resetUser.username}</span>
            </p>

            <div className="mt-5">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.89 1 12c.73-2.07 1.96-3.87 3.54-5.28" />
                      <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
                      <path d="M1 1l22 22" />
                      <path d="M9.88 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8a11.05 11.05 0 0 1-4.15 5.09" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setResetUser(null);
                  setNewPassword("");
                  setShowPassword(false);
                }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={resetPassword}
                className="rounded-xl bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 transition"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}