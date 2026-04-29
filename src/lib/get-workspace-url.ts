// src/lib/get-workspace-url.ts

export function getWorkspaceUrl(slug: string) {
  const rootDomain =
    process.env.NEXT_PUBLIC_ROOT_DOMAIN || "reportrak.com";

  return `https://${slug}.${rootDomain}/login`;
}