"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    pathname === path
      ? "px-3 py-2 rounded-md bg-blue-600 text-white"
      : "px-3 py-2 rounded-md text-gray-700 hover:bg-gray-200";

  return (
    <nav className="bg-gray-100 p-4 shadow-sm">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className={linkStyle("/")}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/add-fi" className={linkStyle("/add-fi")}>
            Add FI Card
          </Link>
        </li>
        <li>
  <Link href="/fi-list" className={linkStyle("/fi-list")}>
    FI List
  </Link>
</li>
      </ul>
    </nav>
  );
}
