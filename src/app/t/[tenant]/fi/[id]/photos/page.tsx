import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { getTenantDbBySlug } from "@/lib/tenant-db";

type PageProps = {
  params: Promise<{
    tenant: string;
    id: string;
  }>;
};
type FIRecordRow = RowDataPacket & {
  id: string;
  caseNumber: string;
};

type FIPhotoRow = RowDataPacket & {
  id: string;
  url: string;
  createdAt: string | Date;
};

export default async function FIPhotosPage({ params }: PageProps) {
  const { tenant, id } = await params;

  const { db } = await getTenantDbBySlug(tenant);

  const [fiResult] = await db.query(
    `
      SELECT id, caseNumber
      FROM ficard
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  const fiRows = fiResult as FIRecordRow[];

  if (!fiRows.length) {
    return notFound();
  }

  const fi = fiRows[0];

  const [photoResult] = await db.query(
    `
      SELECT id, url, createdAt
      FROM fiphoto
      WHERE fiCardId = ?
      ORDER BY createdAt DESC
    `,
    [id]
  );

  const photos = (photoResult as FIPhotoRow[]).map((p) => ({
    id: String(p.id),
    url: p.url,
    createdAt: p.createdAt,
  }));

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Photos for FI <span className="font-mono">#{fi.caseNumber}</span>
        </h1>

        <Link
          href={`/t/${tenant}/fi-list`}
          className="text-blue-600 hover:underline"
        >
          ← Back to List
        </Link>
      </div>

      {photos.length === 0 ? (
        <p className="text-gray-600">
          No photos uploaded for this FI card.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((p) => (
          <div
  key={p.id}
  className="relative group border rounded-md overflow-hidden bg-slate-100"
>
  <div className="relative w-full aspect-[4/3]">
    <Image
      src={p.url}
      alt="FI Photo"
      fill
      className="object-contain"
    />
  </div>

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