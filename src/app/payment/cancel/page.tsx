export default function CancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Payment Cancelled</h1>
        <p className="mt-4 text-slate-300">
          You can try again anytime.
        </p>
        <a
          href="/pricing"
          className="mt-6 inline-block rounded-xl bg-blue-500 px-6 py-3"
        >
          Back to Pricing
        </a>
      </div>
    </main>
  );
}