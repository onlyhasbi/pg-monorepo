import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { useState } from "react";
import { Button } from "@repo/ui/ui/button";
import { Spinner } from "@repo/ui/ui/spinner";
import { PasswordInput } from "@repo/ui/ui/form-elements";
import { signupSchema } from "@repo/schemas/auth.schema";
import { signupFn, loginFn, checkPageIdFn } from "@repo/services/api.functions";
import { setAuthToken } from "@repo/lib/auth";
import { useToast } from "@repo/ui/toast";
import { queryClient } from "@repo/lib/queryClient";
import { authDealerQueryOptions } from "@repo/lib/queryOptions";
import { cn } from "@repo/lib/utils";



export function SignUpForm({
  onSignupSuccess,
}: {
  onSignupSuccess: () => void;
}) {
  const navigate = useNavigate();
  const router = useRouter();
  const { showToast } = useToast();

  const [namaLengkap, setNamaLengkap] = useState<string | null>(null);
  const [isPgcodeValid, setIsPgcodeValid] = useState(false);
  const [isVerifyingPgcode, setIsVerifyingPgcode] = useState(false);

  const [pageIdError, setPageIdError] = useState<string | null>(null);
  const [isPageIdValid, setIsPageIdValid] = useState(false);
  const [isVerifyingPageId, setIsVerifyingPageId] = useState(false);

  const signupForm = useForm({
    resolver: valibotResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      pgcode: "",
      katasandi: "",
      pageid: "",
      country_code: "62",
      no_telpon: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      // MIGRATION: Using TanStack Server Function
      return signupFn({ data });
    },
    onSuccess: (data) => {
      if (data.success) {
        if (data.user?.role !== "pgbo") {
          showToast(
            "Registrasi berhasil, namun akses portal ditolak.",
            "error",
          );
          return;
        }

        // Check if user is active (waiting for admin)
        if (
          data.user?.is_active === false ||
          data.user?.is_active === 0 ||
          data.user?.is_active === undefined
        ) {
          showToast(
            "Registrasi berhasil. Tunggu verifikasi admin untuk aktif.",
            "success",
          );
          signupForm.reset();
          onSignupSuccess();
          return;
        }

        /**
         * USER REQUIREMENT: Post-register login fetch
         */
        const performAutoLogin = async () => {
          try {
            const loginData = await loginFn({
              data: {
                identifier: signupForm.getValues("pgcode"),
                katasandi: signupForm.getValues("katasandi"),
              },
            });

            if (loginData.success) {
              // 1. SET COOKIE
              setAuthToken(loginData.token);

              // 2. SET QUERY DATA
              queryClient.setQueryData(authDealerQueryOptions().queryKey, {
                user: loginData.user,
                token: loginData.token,
              });

              // 3. INVALIDATE AND NAVIGATE
              await router.invalidate();
              showToast("Registrasi berhasil dan Anda telah masuk!", "success");
              navigate({ to: "/overview" });
            } else {
              showToast("Registrasi berhasil, silakan login manual.", "info");
              onSignupSuccess();
            }
          } catch (err) {
            console.error("Auto login failure:", err);
            showToast("Registrasi berhasil, silakan login manual.", "info");
            onSignupSuccess();
          }
        };

        performAutoLogin();
      } else {
        showToast(data.message, "error");
      }
    },
    onError: (error: any) => {
      showToast(error.message || "Registrasi gagal", "error");
    },
  });

  const fetchIntroducerName = async (pgcode: string) => {
    if (isPgcodeValid || !pgcode || pgcode.length < 5) {
      if (!pgcode || pgcode.length < 5) {
        setNamaLengkap(null);
        setIsPgcodeValid(false);
      }
      return;
    }
    setIsVerifyingPgcode(true);
    try {
      const params = new URLSearchParams();
      params.append("pgcode", pgcode);
      const res = await fetch(
        "/api-proxy/index.php?route=account/register/getIntroducer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          body: params.toString(),
        },
      );
      const data = await res.json();
      if (data.success && data.name) {
        setNamaLengkap(data.name.trim());
        setIsPgcodeValid(true);
      } else {
        setNamaLengkap(null);
        setIsPgcodeValid(false);
      }
    } catch {
      setNamaLengkap(null);
      setIsPgcodeValid(false);
    } finally {
      setIsVerifyingPgcode(false);
    }
  };

  const checkPageId = async (pageid: string): Promise<boolean> => {
    if (!pageid || pageid.length < 3) return true;
    try {
      // MIGRATION: Using TanStack Server Function
      const data = await checkPageIdFn({ data: pageid });
      return data.isAvailable;
    } catch {
      return true;
    }
  };

  const onSubmit = (data: any) => {
    let finalPhone = undefined;
    if (data.no_telpon) {
      const cleanPhone = data.no_telpon.replace(/^0+/, "");
      finalPhone = `${data.country_code}${cleanPhone}`;
    }
    registerMutation.mutate({
      ...data,
      role: "pgbo",
      nama_lengkap: namaLengkap || undefined,
      no_telpon: finalPhone,
    });
  };

  return (
    <form
      key="signup-form"
      className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
      onSubmit={signupForm.handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        {/* PGCode Custom Input */}
        <div className="relative pb-0.5">
          <div className="flex justify-between items-center px-1 mb-2">
            <label
              htmlFor="reg_pgcode"
              className="block text-sm font-semibold text-slate-700"
            >
              PGCode
            </label>
            {namaLengkap && (
              <span className="text-[10px] text-emerald-600 tracking-tighter">
                {namaLengkap}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              id="reg_pgcode"
              {...signupForm.register("pgcode", {
                onChange: (e) => {
                  const value = e.target.value;
                  const sanitized = value.replace(/[^a-zA-Z0-9]/g, "");
                  if (value !== sanitized)
                    signupForm.setValue("pgcode", sanitized);
                  if (isPgcodeValid) {
                    setIsPgcodeValid(false);
                    setNamaLengkap(null);
                  }
                },
                onBlur: (e) => fetchIntroducerName(e.target.value),
              })}
              placeholder="PG123456"
              className={cn(
                "w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-all duration-200",
                signupForm.formState.errors.pgcode &&
                  "border-red-500 focus:ring-red-500/30 focus:border-red-500 bg-red-50/30",
              )}
            />
            <div className="absolute right-3 inset-y-0 flex items-center">
              {isVerifyingPgcode ? (
                <Spinner size={16} className="text-slate-300" />
              ) : (
                isPgcodeValid && <Check className="w-5 h-5 text-emerald-500" />
              )}
            </div>
          </div>
          {signupForm.formState.errors.pgcode && (
            <div className="absolute top-full left-1 mt-1 text-[11px] font-medium text-red-500">
              {signupForm.formState.errors.pgcode.message}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 relative pb-0.5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              WhatsApp
            </label>
            <div
              className={cn(
                "flex w-full bg-slate-50/80 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-red-500/30 focus-within:border-red-400 transition-all duration-200 overflow-hidden",
                signupForm.formState.errors.no_telpon &&
                  "border-red-500 focus-within:ring-red-500/30 focus-within:border-red-500",
              )}
            >
              <select
                {...signupForm.register("country_code")}
                className="w-[80px] bg-transparent border-none text-slate-600 pl-3 h-[46px] outline-none text-xs cursor-pointer appearance-none text-center"
              >
                <option value="62">🇮🇩 +62</option>
                <option value="60">🇲🇾 +60</option>
              </select>
              <div className="w-px bg-slate-200 my-2"></div>
              <input
                {...signupForm.register("no_telpon", {
                  onChange: (e) => {
                    const value = e.target.value;
                    const sanitized = value.replace(/[^0-9]/g, "");
                    if (value !== sanitized)
                      signupForm.setValue("no_telpon", sanitized);
                  },
                })}
                placeholder="812..."
                className="flex-1 bg-transparent border-none focus:outline-none h-[46px] px-3 text-slate-800 text-sm placeholder:text-slate-400"
              />
            </div>
            {signupForm.formState.errors.no_telpon && (
              <div className="absolute top-full left-1 mt-1 text-[11px] font-medium text-red-500">
                {signupForm.formState.errors.no_telpon.message}
              </div>
            )}
          </div>

          <div className="relative pb-0.5">
            <label
              htmlFor="pageid"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              ID Halaman
            </label>
            <div className="relative">
              <input
                id="pageid"
                {...signupForm.register("pageid", {
                  onChange: (e) => {
                    const value = e.target.value;
                    const sanitized = value.replace(/[^a-zA-Z0-9_\-]/g, "");
                    if (value !== sanitized) {
                      signupForm.setValue("pageid", sanitized);
                    }
                    if (isPageIdValid) setIsPageIdValid(false);
                    if (pageIdError) setPageIdError(null);
                  },
                  onBlur: async (e) => {
                    if (e.target.value.length >= 3) {
                      setIsVerifyingPageId(true);
                      const isAvailable = await checkPageId(e.target.value);
                      setIsVerifyingPageId(false);
                      if (!isAvailable) {
                        setPageIdError("Taken");
                        setIsPageIdValid(false);
                      } else {
                        setPageIdError(null);
                        setIsPageIdValid(true);
                      }
                    }
                  },
                })}
                placeholder="username"
                className={cn(
                  "w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-all duration-200",
                  (signupForm.formState.errors.pageid || pageIdError) &&
                    "border-red-500 focus:ring-red-500/30 bg-red-50/30",
                )}
              />
              <div className="absolute right-5 inset-y-0 flex items-center">
                {isVerifyingPageId ? (
                  <Spinner size={16} className="text-slate-300" />
                ) : (
                  isPgcodeValid &&
                  isPageIdValid &&
                  !pageIdError && <Check className="w-5 h-5 text-emerald-500" />
                )}
              </div>
            </div>
            {(signupForm.formState.errors.pageid || pageIdError) && (
              <div className="absolute top-full left-1 mt-1 text-[11px] font-medium text-red-500">
                {signupForm.formState.errors.pageid?.message || pageIdError}
              </div>
            )}
          </div>
        </div>

        <PasswordInput
          id="reg_katasandi"
          label="Password Baru"
          placeholder="Min. 6 Karakter"
          {...signupForm.register("katasandi")}
          error={signupForm.formState.errors.katasandi?.message}
        />
      </div>

      <div className="transition-all hover:-translate-y-0.5 active:scale-[0.98]">
        <Button
          type="submit"
          disabled={
            registerMutation.isPending ||
            !signupForm.formState.isValid ||
            !isPgcodeValid ||
            !isPageIdValid ||
            !!pageIdError
          }
          className="font-bold w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm shadow-xl shadow-slate-900/10 transition-all active:scale-[0.98] border-none"
        >
          {registerMutation.isPending ? (
            <Spinner size={20} className="text-white" />
          ) : (
            "Buat Akun"
          )}
        </Button>
      </div>
    </form>
  );
}

export default SignUpForm;
