import { notFound } from "next/navigation";
import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import ImageGallery from "@/components/ImageGallery";
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
  firstName: string;
  lastName: string;
  subjectType: string;
  incidentType: string;
  createdAt: string | Date;
  yearYY: string | number;
  seq: string | number;
};

type FIPhotoRow = RowDataPacket & {
  id: string;
  url: string;
};

export default async function FIDetailPage({ params }: PageProps) {
  const { tenant, id } = await params;
  const { db } = await getTenantDbBySlug(tenant);

  const [fiResult] = await db.query(
    `
      SELECT
        id,
        caseNumber,
        firstName,
        lastName,
        subjectType,
        incidentType,
        createdAt,
        yearYY,
        seq
      FROM ficard
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  const fiRows = fiResult as FIRecordRow[];

  if (!fiRows.length) {
    notFound();
  }

  const fiRow = fiRows[0];

  const [photoResult] = await db.query(
    `
      SELECT id, url
      FROM fiphoto
      WHERE fiCardId = ?
      ORDER BY createdAt ASC, id ASC
    `,
    [id]
  );

  const photos = (photoResult as FIPhotoRow[]).map((p) => ({
    id: String(p.id),
    url: p.url,
  }));

  const fi = {
    id: String(fiRow.id),
    caseNumber: fiRow.caseNumber ?? "",
    firstName: fiRow.firstName ?? "",
    lastName: fiRow.lastName ?? "",
    subjectType: fiRow.subjectType ?? "",
    incidentType: fiRow.incidentType ?? "",
    createdAt: fiRow.createdAt,
    yearYY: fiRow.yearYY ?? "",
    seq: fiRow.seq ?? "",
    photos,
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-3">
                FI Record
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                FI #{fi.caseNumber}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Review field interview details and attached photos
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/t/${tenant}/fi/${fi.id}/edit`}
                className="rounded-xl bg-blue-600 text-white px-4 py-2.5 font-medium shadow-md hover:bg-blue-700 transition"
              >
                Edit
              </Link>

              <Link
                href={`/t/${tenant}/fi-list`}
                className="rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                ← Back to List
              </Link>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-sm font-medium text-slate-500">First Name</div>
                <div className="mt-1 text-base font-medium text-slate-900">
                  {fi.firstName}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-sm font-medium text-slate-500">Last Name</div>
                <div className="mt-1 text-base font-medium text-slate-900">
                  {fi.lastName}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-sm font-medium text-slate-500">Subject Type</div>
                <div className="mt-1 text-base font-medium text-slate-900">
                  {fi.subjectType}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-sm font-medium text-slate-500">Incident Type</div>
                <div className="mt-1 text-base font-medium text-slate-900">
                  {fi.incidentType}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-sm font-medium text-slate-500">Created</div>
                <div className="mt-1 text-base font-medium text-slate-900">
                  {new Date(fi.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-sm font-medium text-slate-500">Sequence</div>
                <div className="mt-1 text-base font-medium text-slate-900">
                  {fi.yearYY}-{String(fi.seq).padStart(4, "0")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {fi.photos.length ? (
          <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Photos</h2>
              <p className="mt-1 text-sm text-slate-500">
                Attached photo evidence for this FI record
              </p>
            </div>

            <div className="p-6">
              <ImageGallery photos={fi.photos} />
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Photos</h2>
              <p className="mt-1 text-sm text-slate-500">
                Attached photo evidence for this FI record
              </p>
            </div>

            <div className="p-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600">
                No photos uploaded for this FI record.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}