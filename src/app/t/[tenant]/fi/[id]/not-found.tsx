import Link from "next/link";

export default function NotFound({
  params,
}: {
  params: { tenant: string };
}) {
  return (
    <div className="max-w-xl mx-auto mt-16 text-center">
      <h1 className="text-2xl font-bold mb-2">FI not found</h1>

      <p className="text-gray-600 mb-4">
        The record you’re looking for doesn’t exist.
      </p>

      <Link
        href={`/t/${params.tenant}/fi-list`}
        className="text-blue-600 hover:underline"
      >
        Back to list
      </Link>
    </div>
  );
}