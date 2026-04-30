"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    company: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

 if (data.organizationId) {
  localStorage.setItem("orgId", String(data.organizationId));

  if (data.organizationSlug) {
    localStorage.setItem("organizationSlug", data.organizationSlug);
  }

window.location.href = `/pricing?orgId=${data.organizationId}&slug=${data.organizationSlug}`;
  return;
}

    alert(data.error || "Registration failed");
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 bg-white/5 p-8 rounded-2xl"
      >
        <h1 className="text-2xl font-bold">Create Account</h1>

        <input
          placeholder="Company Name"
          required
          className="w-full p-3 rounded bg-slate-800"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full p-3 rounded bg-slate-800"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 rounded bg-slate-800"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 py-3 rounded"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </main>
  );
}