export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto mt-16 text-center">
      <h1 className="text-2xl font-bold mb-2">FI not found</h1>
      <p className="text-gray-600 mb-4">The record you’re looking for doesn’t exist.</p>
      <a href="/fi-list" className="text-blue-600 hover:underline">Back to list</a>
    </div>
  );
}
