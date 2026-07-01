import { Spinner } from "./spinner";

interface FullPageLoaderProps {
  message?: string;
}

export function FullPageLoader({ message = "Memuat..." }: FullPageLoaderProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={40} className="text-red-600 opacity-100" />
        <p className="text-slate-500 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
