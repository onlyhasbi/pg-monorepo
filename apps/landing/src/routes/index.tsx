import { createFileRoute } from "@tanstack/react-router";
import { OptimizedImage } from "@repo/ui/ui/optimized-image";

const ADMIN_PGBO_URL = import.meta.env.DEV
  ? "http://localhost:3003/signin"
  : "https://admin.mypublicgold.id/signin";

export const Route = createFileRoute("/")({
  component: LandingHomePage,
});

function LandingHomePage() {
  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center bg-slate-950 overflow-hidden px-6">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* 5G Logo — Click to go to Admin PGBO */}
        <a
          href={ADMIN_PGBO_URL}
          className="group relative flex items-center justify-center cursor-pointer"
        >
          <div className="absolute inset-0 bg-red-600/20 rounded-3xl blur-2xl scale-110 group-hover:bg-red-600/30 group-hover:scale-125 transition-all duration-700" />
          <div className="relative p-4 bg-[#000856] rounded-3xl shadow-[0_0_30px_rgba(220,38,38,0.15)] border border-white/10 group-hover:border-red-500/30 group-hover:scale-105 transition-all duration-500">
            <OptimizedImage
              src="https://mypublicgold.com/5g/logo/logo_gold.png"
              alt="5G Associates"
              width={50}
              height={50}
              priority
              className="w-16 h-16 sm:w-18 sm:h-18 object-contain"
            />
          </div>
        </a>
      </div>
    </div>
  );
}
