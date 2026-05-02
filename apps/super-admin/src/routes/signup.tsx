import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

import { useToast } from "@repo/ui/toast";
import { useForm } from "react-hook-form";
import { requireAdminGuest } from "@repo/lib/auth";
import { queryClient } from "@repo/lib/queryClient";
import { authAdminQueryOptions } from "@repo/lib/queryOptions";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import { loginFn, signupFn } from "@repo/services/api.functions";

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
      const res = await signupFn({ data: { ...data, role: "admin" } });
      return res;
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
            <ShieldCheck className="w-8 h-8" />
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
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
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
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
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
