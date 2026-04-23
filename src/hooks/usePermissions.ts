// src/hooks/usePermissions.ts
"use client";
import { useSession } from "next-auth/react";

export function usePermissions() {
  const { data, status } = useSession(); // 👈 include status
  const perms = (data as any)?.permissions as string[] | undefined; // permissions are at session root per your callbacks
  const can = (...need: string[]) => need.every((p) => perms?.includes(p));
  return { permissions: perms ?? [], can, status }; // 👈 return status
}