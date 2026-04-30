import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/pricing",
  "/payment/success",
  "/payment/cancel",
  "/api/auth",
  "/api/stripe/webhook",
  "/_next",
  "/favicon.ico",
  "/favicon.png",
  "/robots.txt",
  "/sitemap.xml",
  "/uploads",
  "/public",
];

function isPublic(req: NextRequest) {
  const { pathname } = req.nextUrl;
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(req: NextRequest) {
  if (isPublic(req)) return NextResponse.next();

  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set(
      "callbackUrl",
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};