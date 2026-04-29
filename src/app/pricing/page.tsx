"use client";

import { useState } from "react";

export default function PricingPage() {
  const [loading, setLoading] = useState<"monthly" | "yearly" | null>(null);
  function getLocalOrganizationSlug() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("organizationSlug");
}

  async function startCheckout(billingCycle: "monthly" | "yearly") {
    setLoading(billingCycle);

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
body: JSON.stringify({
  organizationId: Number(localStorage.getItem("orgId")),
  organizationSlug: getLocalOrganizationSlug(),
  billingCycle,
}),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    alert(data.error || "Unable to start checkout");
    setLoading(null);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold">Choose your Reportrak plan</h1>
          <p className="mt-4 text-slate-300">
            Start with monthly billing or save with yearly billing.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">Monthly</h2>
            <p className="mt-4 text-5xl font-bold">$49</p>
            <p className="mt-2 text-slate-400">per month</p>

            <button
              onClick={() => startCheckout("monthly")}
              disabled={loading !== null}
              className="mt-8 w-full rounded-2xl bg-blue-500 px-5 py-4 font-semibold hover:bg-blue-400 disabled:opacity-60"
            >
              {loading === "monthly" ? "Redirecting..." : "Select Monthly"}
            </button>
          </div>

          <div className="rounded-3xl border border-blue-400/40 bg-blue-500/10 p-8">
            <h2 className="text-2xl font-semibold">Yearly</h2>
            <p className="mt-4 text-5xl font-bold">$499</p>
            <p className="mt-2 text-slate-400">per year</p>

            <button
              onClick={() => startCheckout("yearly")}
              disabled={loading !== null}
              className="mt-8 w-full rounded-2xl bg-blue-500 px-5 py-4 font-semibold hover:bg-blue-400 disabled:opacity-60"
            >
              {loading === "yearly" ? "Redirecting..." : "Select Yearly"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}