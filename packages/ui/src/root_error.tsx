import type { ErrorComponentProps } from "@tanstack/react-router";

export function RootError({ error, reset }: ErrorComponentProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-50 text-center animate-in fade-in duration-500">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] border border-slate-100">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-slate-800">
            Terjadi Gangguan Sistem
          </h1>
          <p className="text-slate-500 leading-relaxed text-sm">
            {error.message ||
              "Mohon maaf, sistem sedang mengalami kendala teknis sementara."}
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all hover:scale-[1.02] active:scale-95"
          >
            Coba Segarkan
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
