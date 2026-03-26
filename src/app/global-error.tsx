'use client'; // Global error must be a Client Component

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
        <div className="text-center max-w-lg">
          <h1 className="text-4xl font-black mb-4 tracking-tight">System Error</h1>
          <p className="text-slate-400 mb-8 border border-slate-800 bg-slate-900/50 p-4 rounded-xl text-sm font-mono break-words">
            {error.message || 'A catastrophic global layout block occurred.'}
          </p>
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full font-bold transition-all shadow-lg shadow-cyan-500/20"
          >
            Restart TrekBuddy
          </button>
        </div>
      </body>
    </html>
  );
}
