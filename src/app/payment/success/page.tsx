"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function getWorkspaceUrl(slug: string) {
  const rootDomain =
    process.env.NEXT_PUBLIC_ROOT_DOMAIN || "reportrak.com";

  // local dev support
  if (rootDomain.includes("localhost")) {
    return `http://${slug}.localhost:3000/login`;
  }

  return `https://${slug}.${rootDomain}/login`;
}

function SuccessPageContent() {
  const params = useSearchParams();
  const slug = params.get("slug");

  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      setUrl(getWorkspaceUrl(slug));
    }
  }, [slug]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-bold">Payment Successful 🎉</h1>

        <p className="mt-4 text-slate-300">
          Your workspace is ready.
        </p>

        {url && (
          <div className="mt-6 p-4 bg-white/5 rounded-xl">
            <p className="text-slate-400 text-sm">Your workspace URL</p>
            <p className="mt-2 font-semibold break-all">{url}</p>
          </div>
        )}

        {url && (
          <a
            href={url}
            className="mt-6 inline-block rounded-xl bg-blue-500 px-6 py-3"
          >
            Go to your workspace
          </a>
        )}
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessPageContent />
    </Suspense>
  );
}