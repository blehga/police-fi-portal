// src/app/forms/fi/[fiId]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";

type Person = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nickname: string;
  dob: string | null;
  age: string;
  sex: string;
  race: string;
  role: string;
  movementType: string;
  isPrimary: boolean;
};

type Photo = {
  id: string;
  url: string;
};

type FIFormDetail = {
  caseFormId: string;
  fiCardId: string;
  isShared: boolean;
  canEdit: boolean;
  canDelete: boolean;
  subjectType: string;
  agency: string;
  reasonForStop: string;
  locationOfStop: string;
  disposition: string;
  additionalComments: string;
  officerName: string;
  officerId: string;
  beat: string;
  fiDate: string;
  fiDay: string;
  fiTime: string;
  people: Person[];
  photos: Photo[];
};

async function getFi(fiId: string): Promise<FIFormDetail> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const host = headerStore.get("host");
  if (!host) {
    throw new Error("Missing host header");
  }

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/forms/fi/${fiId}`, {
    method: "GET",
    headers: {
      cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Failed to load FI form");
  }

  return res.json();
}

function fullName(person: Person) {
  return [person.firstName, person.middleName, person.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export default async function FIViewPage({
  params,
}: {
  params: Promise<{ fiId: string }>;
}) {
  const { fiId } = await params;
  const data = await getFi(fiId);

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white/95 px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">FI Form</h1>

              <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
                <span>Subject: {data.subjectType || "—"}</span>
                <span>Date: {data.fiDate || "—"}</span>
                <span>Time: {data.fiTime || "—"}</span>
                <span>{data.isShared ? "Public" : "Private"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/cases"
                className="inline-flex items-center rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                ← Back
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-800">
              FI Details
            </h2>

            <div className="grid grid-cols-1 gap-3 text-sm text-slate-700">
              <div>
                <span className="font-medium text-slate-900">Agency:</span>{" "}
                {data.agency || "—"}
              </div>
              <div>
                <span className="font-medium text-slate-900">
                  Reason For Stop:
                </span>{" "}
                {data.reasonForStop || "—"}
              </div>
              <div>
                <span className="font-medium text-slate-900">
                  Location Of Stop:
                </span>{" "}
                {data.locationOfStop || "—"}
              </div>
              <div>
                <span className="font-medium text-slate-900">Disposition:</span>{" "}
                {data.disposition || "—"}
              </div>
              <div>
                <span className="font-medium text-slate-900">Officer Name:</span>{" "}
                {data.officerName || "—"}
              </div>
              <div>
                <span className="font-medium text-slate-900">Officer ID:</span>{" "}
                {data.officerId || "—"}
              </div>
              <div>
                <span className="font-medium text-slate-900">Beat:</span>{" "}
                {data.beat || "—"}
              </div>
              <div>
                <span className="font-medium text-slate-900">Day:</span>{" "}
                {data.fiDay || "—"}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-800">
              Additional Comments
            </h2>

            <div className="min-h-[160px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {data.additionalComments || "—"}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
            <h2 className="text-sm font-semibold text-slate-800">People</h2>
            <span className="text-xs text-slate-500">{data.people.length}</span>
          </div>

          <div className="divide-y divide-slate-200">
            {data.people.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">No people added.</div>
            ) : (
              data.people.map((person) => (
                <div
                  key={person.id}
                  className="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[1fr_180px_180px]"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      {fullName(person) || "Unknown"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {person.nickname ? `Nickname: ${person.nickname}` : "—"}
                    </div>
                  </div>

                  <div className="text-xs text-slate-600">
                    <div>Role: {person.role || "—"}</div>
                    <div>Movement: {person.movementType || "—"}</div>
                    <div>{person.isPrimary ? "Primary" : "Secondary"}</div>
                  </div>

                  <div className="text-xs text-slate-600">
                    <div>DOB: {person.dob || "—"}</div>
                    <div>Sex: {person.sex || "—"}</div>
                    <div>Race: {person.race || "—"}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
            <h2 className="text-sm font-semibold text-slate-800">Photos</h2>
            <span className="text-xs text-slate-500">{data.photos.length}</span>
          </div>

          <div className="p-5">
            {data.photos.length === 0 ? (
              <div className="text-sm text-slate-500">No photos added.</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt="FI photo"
                    className="w-full rounded-xl border border-slate-200 object-cover shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}