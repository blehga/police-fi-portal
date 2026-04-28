"use client";

import React from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const benefits = [
    "Secure access for authorized officers and staff",
    "Simple onboarding for security companies and police agencies",
    "Centralized portal for incident reports, records, and workflows",
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 ring-1 ring-blue-300/30">
            <span className="text-xl">🛡️</span>
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">
              Police Incident Portal
            </p>
            <p className="text-xs text-slate-400">
              Incident Reporting Access
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <a
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            Sign in
          </a>
          <a
            href="/register"
            className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
          >
            Create account
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-100">
            🔒 Secure incident reporting portal
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Streamline incident reporting for officers and security teams.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Sign in to continue managing incident reports, or create a new
            agency or company account to help your team document, review, and
            organize incidents in one secure place.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:bg-blue-400"
            >
              Sign in →
            </a>

            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Create agency account
            </a>
          </div>

          <div className="mt-10 grid gap-3">
            {benefits.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-slate-300"
              >
                <span className="text-blue-300">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SIDE CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-blue-500/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur">
            <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15">
                    🏢
                  </div>
                  <div>
                    <p className="font-semibold">Incident Reporting Portal</p>
                    <p className="text-sm text-slate-400">
                      Protected reporting workspace
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Secure
                </span>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">
                    Active agency / company
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    Your Organization
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Reports</p>
                    <p className="mt-1 text-2xl font-bold">24</p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Users</p>
                    <p className="mt-1 text-2xl font-bold">8</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-300/20 bg-blue-400/10 p-4">
                  <p className="text-sm font-medium text-blue-100">
                    Ready to continue?
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Authenticate to access incident reports, workflows, and
                    organization records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}