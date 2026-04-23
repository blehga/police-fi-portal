import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
    username?: string;
    tenant?: string;
    permissions?: string[];
  }

  interface User {
    id: string;
    username?: string;
    tenant?: string;
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    tenant?: string;
    permissions?: string[];
  }
}