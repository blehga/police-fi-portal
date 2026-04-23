"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (!tenantSlug) {
      setMsg("❌ Missing tenant context.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: tenantHeaders(),
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const raw = await res.text();
      let data: any = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Unexpected response from server");
      }

      if (res.status === 401 || data?.error === "Session expired") {
        setMsg("❌ Session expired. Signing out...");
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 700);
        return;
      }

      if (res.status === 403 && data?.error === "User inactive") {
        setMsg("❌ Your account is inactive. Signing out...");
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 700);
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to change password");
      }

      setMsg("✅ Password changed successfully. Signing out...");
      setOldPassword("");
      setNewPassword("");

      setTimeout(() => {
        signOut({ callbackUrl: "/login" });
      }, 1000);
    } catch (err: any) {
      setMsg(`❌ ${err.message || "Failed to change password"}`);
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl p-8 text-center text-slate-600">
            Loading session...
          </div>
        </div>
      </div>
    );
  }

  if (!tenantSlug) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur border border-red-200 rounded-2xl shadow-xl p-8 text-center text-red-600">
            ❌ Missing tenant context in session.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
              FI
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Change Password
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Update your password and sign in again
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Current Password
              </label>

              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowOldPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  aria-label={showOldPassword ? "Hide current password" : "Show current password"}
                  title={showOldPassword ? "Hide current password" : "Show current password"}
                >
                  {showOldPassword ? (
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
                New Password
              </label>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  title={showNewPassword ? "Hide new password" : "Show new password"}
                >
                  {showNewPassword ? (
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

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-blue-600 text-white py-3 font-medium shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {saving ? "Saving..." : "Change Password"}
            </button>
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