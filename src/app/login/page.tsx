"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

type Tenant = {
  name: string;
  slug: string;
};

export default function LoginPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenant, setTenant] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [tenantsLoading, setTenantsLoading] = useState(true);

  useEffect(() => {
    async function loadTenants() {
      try {
        const res = await fetch("/api/tenants");
        const data = await res.json();

        setTenants(data);

        if (data.length > 0) {
          setTenant(data[0].slug);
        }
      } catch (error) {
        setMsg("❌ Failed to load organizations");
      } finally {
        setTenantsLoading(false);
      }
    }

    loadTenants();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const res = await signIn("credentials", {
      tenant,
      username,
      password,
      redirect: false,
      callbackUrl: "/cases",
    });

    setLoading(false);

    if (res?.error) {
      setMsg("❌ Invalid organization, username, or password");
      return;
    }

    window.location.href = "/cases";
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
              Police FI Portal
            </h1>
            <p className="mt-2 text-sm text-slate-500">Sign in to continue</p>
          </div>

          <form onSubmit={submit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Organization
              </label>

              <select
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white"
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
                disabled={tenantsLoading}
                required
              >
                {tenantsLoading ? (
                  <option value="">Loading organizations...</option>
                ) : (
                  <>
                    <option value="">Select organization</option>
                    {tenants.map((t) => (
                      <option key={t.slug} value={t.slug}>
                        {t.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || tenantsLoading || !tenant}
              className="w-full rounded-xl bg-blue-600 text-white py-3 font-medium shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          {msg && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}