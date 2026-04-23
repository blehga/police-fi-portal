// app/page.tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect(
    "/api/auth/signin?callbackUrl=" + encodeURIComponent("/fi-list")
  );
}

