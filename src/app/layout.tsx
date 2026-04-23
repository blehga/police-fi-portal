import "./globals.css";
import type { Metadata } from "next";
import { AuthSession } from "@/components/auth-session";
import Navbar from "@/components/Navbar";
import AppHeader from "@/components/app-header";

export const metadata: Metadata = {
  title: "Police FI Portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthSession>
          <AppHeader />
          <main className="min-h-[calc(100vh-56px)]">{children}</main>
        </AuthSession>
      </body>
    </html>
  );
}