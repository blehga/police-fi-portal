import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTenantDbBySlug } from "@/lib/tenant-db";

export const dynamic = "force-dynamic";

type Photo = {
  id: string;
  url: string;
  createdAt: string | Date;
};

type FI = {
  id: string;
  caseNumber: string;
  photos: Photo[];
};

type QueryRow = {
  id: string;
  caseNumber: string;
  photoId: string | null;
  url: string | null;
  createdAt: string | Date | null;
};

export default async function FIPhotosPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm">
        <p className="text-red-600 font-semibold">❌ Unauthorized.</p>
        <Link
          href="/login"
          className="text-blue-600 hover:underline mt-3 inline-block"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const tenant =
    typeof (session as any).tenant === "string"
      ? (session as any).tenant.trim().toLowerCase()
      : "";

  if (!tenant) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm">
        <p className="text-red-600 font-semibold">
          ❌ Missing tenant context.
        </p>
      </div>
    );
  }

  const tenantDb = await getTenantDbBySlug(tenant);
  const db = tenantDb.db;

  const [rows] = await db.query(
    `
    SELECT
      f.id,
      f.caseNumber,
      p.id AS photoId,
      p.url,
      p.createdAt
    FROM ficard f
    LEFT JOIN fiphoto p
      ON p.fiCardId = f.id
    WHERE f.id = ?
    ORDER BY p.createdAt DESC
    `,
    [params.id]
  );

  const resultRows = (rows as QueryRow[]) ?? [];

  if (!resultRows.length) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm">
        <p className="text-red-600 font-semibold">❌ FI not found.</p>
        <Link
          href="/fi-list"
          className="text-blue-600 hover:underline mt-3 inline-block"
        >
          ← Back to List
        </Link>
      </div>
    );
  }

  const fi: FI = {
    id: resultRows[0].id,
    caseNumber: resultRows[0].caseNumber,
    photos: resultRows
      .filter((row) => !!row.photoId && !!row.url && !!row.createdAt)
      .map((row) => ({
        id: row.photoId as string,
        url: row.url as string,
        createdAt: row.createdAt as string | Date,
      })),
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Photos for FI <span className="font-mono">#{fi.caseNumber}</span>
        </h1>
        <Link href="/fi-list" className="text-blue-600 hover:underline">
          ← Back to List
        </Link>
      </div>

      {fi.photos.length === 0 ? (
        <p className="text-gray-600">No photos uploaded for this FI card.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {fi.photos.map((p: Photo) => (
            <div
              key={p.id}
              className="relative group border rounded-md overflow-hidden"
            >
              <Image
                src={p.url}
                alt="FI Photo"
                width={400}
                height={400}
                className="object-cover w-full h-64"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <p className="text-white text-sm">
                  {new Date(p.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}