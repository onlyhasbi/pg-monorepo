import { motion } from "motion/react";
import { ArrowRight, ShieldAlert } from "lucide-react";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@repo/ui/ui/spinner";
import { verifyPortalFn } from "@repo/services/api.functions";
import {
  portalUnlockedOptions,
  portalLockoutOptions,
  portalAttemptsOptions,
} from "@repo/lib/portalOptions";

export function PortalGate() {
  const queryClient = useQueryClient();
  const [lockoutTime, setLockoutTime] = useState<number>(0);

  const { data: lockoutExpiry } = useQuery(portalLockoutOptions());
  const { data: attempts } = useQuery(portalAttemptsOptions());

  const setUnlocked = (val: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pg_portal_unlocked", val.toString());
    }
    queryClient.setQueryData(portalUnlockedOptions().queryKey, val);
  };
  const setLockoutExpiry = (val: number | null) =>
    queryClient.setQueryData(portalLockoutOptions().queryKey, val);
  const setAttempts = (val: number | ((prev: number) => number)) => {
    queryClient.setQueryData(portalAttemptsOptions().queryKey, (old: any) =>
      typeof val === "function" ? val(old ?? 0) : val,
    );
  };

  const [secretCode, setSecretCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  React.useEffect(() => {
    if (lockoutExpiry) {
      const now = Date.now();
      if (lockoutExpiry > now) {
        setLockoutTime(Math.ceil((lockoutExpiry - now) / 1000));
      } else {
        setLockoutExpiry(null);
      }
    }
  }, [lockoutExpiry]);

  React.useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setLockoutExpiry(null);
            setAttempts(0);
            setErrorMsg("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSecretSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0 || isVerifying) return;
    setIsVerifying(true);
    setErrorMsg("");
    try {
      // MIGRATION: Using TanStack Server Function
      const res = await verifyPortalFn({ data: secretCode });
      if (res.success) {
        setUnlocked(true);
        setErrorMsg("");
        setAttempts(0);
      }
    } catch (error: any) {
      const newAttempts = (attempts ?? 0) + 1;
      setAttempts(newAttempts);
      const isLockout = newAttempts >= 5;
      if (isLockout) {
        const expiryTime = Date.now() + 5 * 60 * 1000;
        setLockoutExpiry(expiryTime);
        setLockoutTime(300);
      }
      setErrorMsg(
        isLockout
          ? "Banyak percobaan yang salah"
          : error.message || "Secret code salah.",
      );
    } finally {
      setIsVerifying(false);
      setSecretCode("");
    }
  };

  return (
    <motion.div
      key="secret-gate"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-md mx-auto p-8 py-12 md:py-16 bg-white shadow-xl shadow-slate-200/40 rounded-[2rem] overflow-hidden ring-0"
    >
      {lockoutTime > 0 ? (
        <div className="flex flex-col items-center justify-center text-center space-y-8 py-8 transition-all duration-700">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-[40px] animate-pulse" />
            <div className="absolute inset-0 border-2 border-rose-500/30 rounded-full animate-ping [animation-duration:3s]" />
            <div className="relative p-7 bg-rose-50/80 rounded-full border border-rose-200 shadow-2xl shadow-rose-200/50">
              <ShieldAlert className="w-10 h-10 text-rose-600" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <span className="text-rose-600 font-mono text-5xl font-black tracking-[0.2em] tabular-nums drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                {formatTime(lockoutTime)}
              </span>
            </div>
            <div className="space-y-1.5 px-4">
              <p className="text-rose-600 text-xs tracking-[0.05em]">
                Banyak percobaan yang salah
              </p>
              <p className="text-slate-400 text-[11px] font-medium max-w-[200px] mx-auto leading-relaxed">
                Portal dikunci sementara demi keamanan akun Anda.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSecretSubmit}
          className="relative group max-w-xs mx-auto space-y-5"
        >
          <div className="relative flex items-center bg-white border border-slate-200 shadow-sm rounded-xl h-12 p-1 focus-within:border-slate-900 focus-within:ring-4 focus-within:ring-slate-900/5 transition-all duration-300">
            <input
              type="password"
              value={secretCode}
              onChange={(e) =>
                setSecretCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
              }
              placeholder="••••••"
              className="flex-1 bg-transparent text-slate-900 text-center pl-8 pr-1 h-full focus:outline-none placeholder:text-slate-200 text-sm font-black tracking-[0.5em] selection:bg-rose-100"
              autoFocus
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={lockoutTime > 0 || isVerifying || secretCode.length < 3}
              className="h-9 w-9 bg-slate-900 text-white rounded-md shadow-lg shadow-slate-900/20 transition-colors hover:bg-black disabled:opacity-20 flex items-center justify-center shrink-0"
            >
              {isVerifying ? (
                <Spinner size={14} className="text-white" />
              ) : (
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              )}
            </motion.button>
          </div>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-1 text-[10px] text-rose-500 mt-1"
            >
              <ShieldAlert className="w-3 h-3" />
              {errorMsg}{" "}
              {attempts > 0 && (attempts ?? 0) < 5 && (
                <span className="opacity-60">({attempts}/5)</span>
              )}
            </motion.div>
          )}
        </form>
      )}
    </motion.div>
  );
}

export default PortalGate;
