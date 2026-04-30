import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTenantDbBySlug } from "@/lib/tenant-db";
import ImageGallery from "@/components/ImageGallery";
import FiShareToggle from "@/components/FiShareToggle";

export const dynamic = "force-dynamic";

type Photo = {
  id: string;
  url: string;
};

type FIRecord = {
  id: string;
  caseNumber: string;
  firstName: string;
  lastName: string;
  subjectType: string;
  incidentType: string;
  createdAt: string | Date;
  yearYY: number;
  seq: number;
  createdById: string;
  isShared: boolean;
  canEdit: boolean;
  photos: Photo[];
};

type QueryRow = {
  id: string;
  caseNumber: string;
  firstName: string;
  lastName: string;
  subjectType: string;
  incidentType: string;
  createdAt: string | Date;
  yearYY: number;
  seq: number;
  createdById: string;
  isShared: number | boolean;
  photoId: string | null;
  photoUrl: string | null;
};

export default async function FIDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }

  const tenant =
    typeof (session as any).tenant === "string"
      ? (session as any).tenant.trim().toLowerCase()
      : "";

  const currentUserId =
    typeof (session as any)?.user?.id === "string"
      ? (session as any).user.id
      : "";

  if (!tenant || !currentUserId) {
    notFound();
  }

  const tenantDb = await getTenantDbBySlug(tenant);
  const db = tenantDb.db;

  const [rows] = await db.query(
    `
    SELECT
      f.id,
      f.caseNumber,
      f.firstName,
      f.lastName,
      f.subjectType,
      f.incidentType,
      f.createdAt,
      f.yearYY,
      f.seq,
      f.createdById,
      f.isShared,
      p.id AS photoId,
      p.url AS photoUrl
    FROM ficard f
    LEFT JOIN fiphoto p
      ON p.fiCardId = f.id
    WHERE f.id = ?
    ORDER BY p.createdAt DESC
    `,
    [id]
  );

  const resultRows = (rows as QueryRow[]) ?? [];

  if (!resultRows.length) {
    notFound();
  }

  const createdById = resultRows[0].createdById;
  const isShared = !!resultRows[0].isShared;
  const canView = createdById === currentUserId || isShared;
  const canEdit = createdById === currentUserId;

  if (!canView) {
    notFound();
  }

  const fi: FIRecord = {
    id: resultRows[0].id,
    caseNumber: resultRows[0].caseNumber,
    firstName: resultRows[0].firstName,
    lastName: resultRows[0].lastName,
    subjectType: resultRows[0].subjectType,
    incidentType: resultRows[0].incidentType,
    createdAt: resultRows[0].createdAt,
    yearYY: Number(resultRows[0].yearYY),
    seq: Number(resultRows[0].seq),
    createdById,
    isShared,
    canEdit,
    photos: resultRows
      .filter((row) => !!row.photoId && !!row.photoUrl)
      .map((row) => ({
        id: row.photoId as string,
        url: row.photoUrl as string,
      })),
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

            <div className="flex items-center gap-3 flex-wrap">
              {fi.canEdit && (
                <>
                  <FiShareToggle fiId={fi.id} initialShared={fi.isShared} />

                  <a
                    href={`/fi/${fi.id}/edit`}
                    className="inline-flex items-center justify-center h-10 rounded-xl bg-blue-600 text-white px-3 font-medium shadow-md hover:bg-blue-700 transition"
                  >
                    Edit
                  </a>
                </>
              )}

              <a
                href="/fi-list"
                className="inline-flex items-center justify-center h-10 rounded-xl border border-slate-300 px-4 font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                ← Back to List
              </a>
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