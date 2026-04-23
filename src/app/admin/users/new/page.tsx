"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePermissions } from "@/hooks/usePermissions";

export default function NewUserPage() {
  const { data: session } = useSession();
  const { can } = usePermissions();
  const allowed = can("ADMIN_USERS");

  const [firstName, setF] = useState("");
  const [lastName, setL] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [username, setU] = useState("");
  const [email, setE] = useState("");
  const [password, setP] = useState("");
  const [roleName, setR] = useState("viewer");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  useEffect(() => {
    setF("");
    setL("");
    setBadgeId("");
    setU("");
    setE("");
    setP("");
    setR("viewer");
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!allowed) {
      setMsg("You do not have permission.");
      return;
    }

    if (!tenantSlug) {
      setMsg("❌ Missing tenant context.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: tenantHeaders(),
        body: JSON.stringify({
          firstName,
          lastName,
          badgeId,
          username,
          email,
          password,
          roleName,
        }),
      });

      const raw = await res.text();
      let data: any = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || `Request failed with status ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create user");
      }

      const fullName = `${data.user.firstName ?? ""} ${data.user.lastName ?? ""}`.trim();
      setMsg(`✅ Created user ${fullName || data.user.username}`);

      setF("");
      setL("");
      setBadgeId("");
      setU("");
      setE("");
      setP("");
      setR("viewer");
      setShowPassword(false);
    } catch (err: any) {
      setMsg(`❌ ${err.message || "Failed to create user"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
              FI
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Add User</h1>
            <p className="mt-2 text-sm text-slate-500">
              Create a new user account and assign a role
            </p>
          </div>

          {!allowed && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              You do not have permission to create users.
            </div>
          )}

          {allowed && !tenantSlug && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Missing tenant context in session.
            </div>
          )}

          <form onSubmit={submit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                First Name
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setF(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Last Name
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setL(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Badge ID
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Enter badge ID"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setU(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setE(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Temporary Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  placeholder="Enter temporary password"
                  value={password}
                  onChange={(e) => setP(e.target.value)}
                  autoComplete="new-password"
                  required
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Role
              </label>
              <select
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white"
                value={roleName}
                onChange={(e) => setR(e.target.value)}
              >
                <option value="viewer">viewer</option>
                <option value="officer">officer</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <div className="flex gap-3 pt-1">
              <Link
                href="/admin/users"
                className="flex-1 rounded-xl border border-slate-300 text-slate-700 py-3 text-center font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={!allowed || loading || !tenantSlug}
                className="flex-1 rounded-xl bg-blue-600 text-white py-3 font-medium shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>

          {msg && (
            <div
              className={`mt-5 rounded-lg px-3 py-2 text-sm border ${
                msg.startsWith("✅")
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}