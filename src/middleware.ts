// src/middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // add paths that require login
    "/fi/:path*",
    "/admin/:path*",
  ],
};
