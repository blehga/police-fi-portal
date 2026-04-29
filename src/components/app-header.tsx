"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePermissions } from "@/hooks/usePermissions";
import { usePathname } from "next/navigation";

export default function AppHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { can } = usePermissions();

  const firstName = (session as any)?.user?.firstName;
const lastName = (session as any)?.user?.lastName;
const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();

  const navLink = (href: string, label: string, disabled = false) => {
    const isActive = pathname === href;

    if (disabled) {
      return (
        <span className="px-3 py-2 text-sm font-medium text-slate-400 cursor-not-allowed rounded-md">
          {label}
        </span>
      );
    }

    return (
      <Link
        href={href}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? "bg-slate-800 text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-slate-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
              PF
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight text-slate-900">
                Reportrak
              </div>
        <div className="text-sm font-medium text-slate-700">
  {(session as any)?.tenantName}
</div>
            </div>
          </Link>

         {status === "authenticated" && (
  <nav className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-sm md:flex">
    {navLink("/cases", "Cases")}
    {navLink("/cases/new", "+ New Case", !can("REPORT_WRITE"))}
    {can("ADMIN_USERS") && navLink("/admin/users", "Users")}
  </nav>
)}
        </div>

        <div className="flex items-center gap-3">
          {status === "authenticated" ? (
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                {(firstName?.charAt(0) || (session as any)?.username?.charAt(0) || "U").toUpperCase()}
                </span>
              <span>
  {fullName || (session as any)?.username || "Signed in"}
</span>
                <span className="text-slate-400">▼</span>
              </button>

              <div className="absolute right-0 top-full hidden pt-2 group-hover:block">
                <div className="w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Account
                    </p>
                   <p className="mt-1 text-sm font-medium text-slate-800">
  {fullName || (session as any)?.username || "Signed in"}
</p>
                  </div>

                  <Link
                    href="/change-password"
                    className="block px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    Change Password
                  </Link>

                  <button
  onClick={async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout audit request failed", err);
    }

    await signOut({ callbackUrl: "/login" });
  }}
  className="block w-full px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
>
  Logout
</button>
                </div>
              </div>
            </div>
          ) : (
            pathname !== "/login" && (
              <Link
                href="/login"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>

      {status === "authenticated" && (
        <div className="border-t border-slate-200 bg-white px-4 py-2 md:hidden">
          <nav className="flex flex-wrap gap-2">
            {navLink("/fi-list", "FI List")}
            {navLink("/add-fi", "+ Add FI", !can("REPORT_WRITE)"))}
            {can("ADMIN_USERS") && navLink("/admin/users", "Users")}
          </nav>
        </div>
      )}
    </header>
  );
}