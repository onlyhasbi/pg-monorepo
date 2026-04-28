import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "@repo/lib/api";
import { useToast } from "@repo/ui/toast";
import { useForm } from "react-hook-form";
import { requireAdminGuest } from "@repo/lib/auth";
import { queryClient } from "@repo/lib/queryClient";
import { authAdminQueryOptions } from "@repo/lib/queryOptions";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import { loginFn } from "@repo/services/api.functions";

export const Route = createFileRoute("/signup")({
  beforeLoad: async () => await requireAdminGuest(),
  component: AdminSignupPage,
});

const schema = v.object({
  email: v.pipe(
    v.string(),
    v.email("Format email tidak valid"),
    v.nonEmpty("Email wajib diisi"),
  ),
  katasandi: v.pipe(
    v.string(),
    v.minLength(6, "Password minimal 6 karakter"),
    v.nonEmpty("Password wajib diisi"),
  ),
  secretCode: v.pipe(
    v.string(),
    v.nonEmpty("Secret code wajib diisi untuk keamanan"),
  ),
});

function AdminSignupPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = "Daftar Super Admin | Public Gold Indonesia";
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    resolver: valibotResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      katasandi: "",
      secretCode: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // Pass role as admin to backend auth registration
      const res = await api.post("/auth/register", { ...data, role: "admin" });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        /**
         * USER REQUIREMENT: Post-register login fetch
         * After successful admin registration, we trigger a login fetch
         * to fully initialize the admin session and prime the cache.
         */
        const performAdminAutoLogin = async () => {
          try {
            const loginData = await loginFn({
              data: {
                identifier: getValues("email"),
                katasandi: getValues("katasandi"),
              },
            });

            if (loginData.success && loginData.user?.role === "admin") {
              // UNIFIED PERSISTENCE: Just set query data.
              queryClient.setQueryData(authAdminQueryOptions().queryKey, {
                user: loginData.user,
                token: loginData.token,
              });

              showToast("Admin account created and logged in!", "success");
              await router.invalidate();
              navigate({ to: "/" });
            } else {
              showToast("Account created, please login manually.", "info");
              navigate({ to: "/signin" });
            }
          } catch (error) {
            console.error("Auto login failed", error);
            showToast("Account created, please login manually.", "info");
            navigate({ to: "/signin" });
          }
        };

        performAdminAutoLogin();
      } else {
        showToast(data.message, "error");
      }
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || "Pendaftaran gagal", "error");
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-sm bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Buat Akun Admin</h2>
          <p className="text-slate-400 text-sm mt-1">
            Sistem Proteksi Lapis Ganda
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={mutation.isPending} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className={`w-full px-4 py-2 bg-slate-900 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-white ${errors.email ? "border-red-500" : "border-slate-600"}`}
                placeholder="admin@domain.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("katasandi")}
                  className={`w-full px-4 py-2 pr-10 bg-slate-900 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-white ${errors.katasandi ? "border-red-500" : "border-slate-600"}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 013.168-4.477M6.343 6.343A9.97 9.97 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.168 4.477M6.343 6.343L3 3m3.343 3.343l2.829 2.829m4.243 4.243l2.829 2.829M3 3l18 18M9.878 9.878a3 3 0 104.243 4.243"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.katasandi && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.katasandi.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Secret Code
              </label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  {...register("secretCode")}
                  autoComplete="off"
                  data-1p-ignore="true"
                  data-lpignore="true"
                  className={`w-full px-4 py-2 pr-10 bg-slate-900 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-white ${errors.secretCode ? "border-red-500" : "border-slate-600"}`}
                  placeholder="Kode Akses Pendaftaran"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  tabIndex={-1}
                >
                  {showSecret ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 013.168-4.477M6.343 6.343A9.97 9.97 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.168 4.477M6.343 6.343L3 3m3.343 3.343l2.829 2.829m4.243 4.243l2.829 2.829M3 3l18 18M9.878 9.878a3 3 0 104.243 4.243"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.secretCode && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.secretCode.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={mutation.isPending || !isValid}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {mutation.isPending ? "Verifikasi..." : "Daftar Admin"}
            </button>
          </fieldset>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          Sudah terdaftar?{" "}
          <a
            onClick={() => navigate({ to: "/signin" })}
            className="text-red-400 hover:text-white hover:underline cursor-pointer transition"
          >
            Masuk di sini
          </a>
        </p>
      </div>
    </div>
  );
}

export default AdminSignupPage;
