import { Card, CardContent } from "@repo/ui/ui/card";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { requireGuest } from "@repo/lib/auth";
import { PortalGate } from "@repo/ui/auth/PortalGate";
import {
  portalUnlockedOptions,
  portalLockoutOptions,
} from "@repo/lib/portalOptions";
import { OptimizedImage } from "@repo/ui/ui/optimized-image";
import { authDealerQueryOptions } from "@repo/lib/queryOptions";

import SignInForm from "@repo/ui/auth/SignInForm";
import { useIsMounted } from "@repo/hooks/useIsMounted";



export const Route = createFileRoute("/signin")({
  beforeLoad: () => requireGuest(),
  component: LoginPage,
});

function LoginPage() {
  const [animationParent] = useAutoAnimate();
  const isMounted = useIsMounted();
  const navigate = useNavigate();

  const { data: authData } = useQuery(authDealerQueryOptions());
  const user = authData?.user;
  const token = authData?.token;

  const { data: isUnlocked } = useQuery(portalUnlockedOptions());
  const { data: lockoutExpiry } = useQuery(portalLockoutOptions());
  const lockoutTime =
    lockoutExpiry && lockoutExpiry > Date.now() ? lockoutExpiry : 0;

  useEffect(() => {
    if (isMounted && token && user) {
      navigate({ to: "/overview", replace: true });
    }
  }, [isMounted, token, user, navigate]);

  if (token && user) {
    return null;
  }



  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center bg-slate-50 overflow-hidden px-6 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-rose-50/50 via-slate-50 to-slate-50 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div
        ref={animationParent}
        className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-8 md:gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        {!lockoutTime && !isUnlocked && (
          <div
            className="flex flex-col items-center text-center gap-4 lg:gap-6 w-full max-w-lg mb-4 animate-in fade-in slide-in-from-top-4 duration-500"
          >
            <div
              className="p-3 bg-[#000856] rounded-2xl shadow-sm border border-slate-100 transition-transform hover:scale-105"
            >
              <OptimizedImage
                src="/5g.webp"
                alt="Logo"
                width={48}
                height={48}
                priority
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
        )}

        {!isUnlocked ? (
          <PortalGate key="secret-gate" />
        ) : (
          <Card
            key="auth-content"
            className="bg-white rounded-[1.5rem] overflow-hidden shadow-2xl shadow-slate-200/40 border-none ring-0 max-w-lg mx-auto w-full animate-in fade-in zoom-in-95 duration-500"
          >
              <CardContent className="p-0 flex flex-col h-full">
                <div className="p-6 sm:px-10 pb-8 pt-10">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                    Selamat Datang
                  </h1>
                  <p className="text-slate-500 text-sm text-center mb-8">
                    Masuk ke portal agen Anda
                  </p>
                  <SignInForm />

                  <div className="mt-6 text-center text-sm text-slate-500">
                    Belum punya akun?{" "}
                    <Link
                      to="/signup"
                      className="text-red-600 font-bold hover:underline"
                    >
                      Daftar Sekarang
                    </Link>
                  </div>
                </div>

                <AuthFooter />
              </CardContent>
            </Card>
        )}

        <AuthSecurityNote lockoutTime={lockoutTime} isUnlocked={isUnlocked} />
      </div>
    </div>
  );
}

function AuthFooter() {
  return (
    <div className="p-4 sm:p-5 pt-3 border-t border-slate-50 flex flex-col items-center gap-3 bg-transparent">
      <a
        href="https://wa.me/628979901844"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <div className="p-1.5 bg-emerald-50 rounded-full">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
        </div>
        <span className="text-[9px] text-slate-400 tracking-wider">
          Butuh Bantuan? Hubungi Admin
        </span>
      </a>
      <div className="flex items-center gap-3 text-[9px] text-slate-300">
        <Link
          to="/legal"
          search={{ tab: "terms" }}
          className="hover:text-slate-500 transition-colors no-underline"
        >
          Syarat & Ketentuan
        </Link>
        <span>•</span>
        <Link
          to="/legal"
          search={{ tab: "privacy" }}
          className="hover:text-slate-500 transition-colors no-underline"
        >
          Privasi
        </Link>
      </div>
    </div>
  );
}

function AuthSecurityNote({
  lockoutTime,
  isUnlocked,
}: {
  lockoutTime: number;
  isUnlocked: boolean | undefined;
}) {
  const [parent] = useAutoAnimate();
  return (
    <div ref={parent}>
      {!lockoutTime && !isUnlocked && (
        <div
          className="flex flex-col items-center gap-3 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <div className="flex items-center justify-center gap-2 opacity-30 text-[9px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Portal
            Keamanan Terpusat Public Gold
          </div>
          <div className="flex items-center gap-3 text-[9px] text-slate-300 opacity-40">
            <Link
              to="/legal"
              search={{ tab: "terms" }}
              className="hover:text-slate-500 transition-colors no-underline"
            >
              Syarat & Ketentuan
            </Link>
            <span>•</span>
            <Link
              to="/legal"
              search={{ tab: "privacy" }}
              className="hover:text-slate-500 transition-colors no-underline"
            >
              Privasi
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
