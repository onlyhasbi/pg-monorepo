import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Button } from "@repo/ui/ui/button";
import { Spinner } from "@repo/ui/ui/spinner";
import { InputField, PasswordInput } from "@repo/ui/ui/form-elements";
import { signinSchema } from "@repo/schemas/auth.schema";
import { loginFn } from "@repo/services/api.functions";
import { setAuthToken } from "@repo/lib/auth";
import { useToast } from "@repo/ui/toast";
import { queryClient } from "@repo/lib/queryClient";
import { authDealerQueryOptions } from "@repo/lib/queryOptions";

const formVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.4 } },
};

export function SignInForm() {
  const navigate = useNavigate();
  const router = useRouter();
  const { showToast } = useToast();

  const signinForm = useForm({
    resolver: valibotResolver(signinSchema),
    mode: "onChange",
    defaultValues: { pgcode: "", katasandi: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      // MIGRATION: Using TanStack Server Function
      return loginFn({
        data: {
          identifier: data.pgcode,
          katasandi: data.katasandi,
        },
      });
    },
    onSuccess: async (data) => {
      if (data.success) {
        if (data.user?.role !== "pgbo") {
          showToast("Akses ditolak. Akun ini bukan Dealer PGBO.", "error");
          return;
        }
        if (
          data.user?.is_active === false ||
          data.user?.is_active === 0 ||
          !data.user?.is_active
        ) {
          showToast(
            "Akun Anda sedang dinonaktifkan atau belum aktif. Silakan hubungi admin.",
            "error",
          );
          return;
        }

        // 1. SET COOKIE (For SSR Auth support)
        setAuthToken(data.token);

        // 2. SET QUERY DATA (For Client state)
        queryClient.setQueryData(authDealerQueryOptions().queryKey, {
          user: data.user,
          token: data.token,
        });

        // 3. INVALIDATE AND NAVIGATE
        await router.invalidate();
        (navigate as any)({ to: "/overview" });
      } else {
        showToast(data.message, "error");
      }
    },
    onError: (error: any) => {
      showToast(
        error.message || "Login gagal, periksa kredensial Anda",
        "error",
      );
    },
  });

  return (
    <motion.form
      key="signin-form"
      className="space-y-6"
      variants={formVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onSubmit={signinForm.handleSubmit((data) => loginMutation.mutate(data))}
    >
      <div className="space-y-5">
        <InputField
          id="pgcode"
          label="PGCode"
          placeholder="PG123456"
          {...signinForm.register("pgcode", {
            onChange: (e) => {
              const value = e.target.value;
              const sanitized = value.replace(/[^a-zA-Z0-9]/g, "");
              if (value !== sanitized) signinForm.setValue("pgcode", sanitized);
            },
          })}
          error={signinForm.formState.errors.pgcode?.message}
        />
        <PasswordInput
          id="katasandi"
          label="Password"
          placeholder="••••••••"
          {...signinForm.register("katasandi")}
          error={signinForm.formState.errors.katasandi?.message}
        />
      </div>
      <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          disabled={loginMutation.isPending || !signinForm.formState.isValid}
          className="font-bold w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm shadow-xl shadow-slate-900/10 transition-all border-none"
        >
          {loginMutation.isPending ? (
            <Spinner size={20} className="text-white" />
          ) : (
            "Masuk"
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}

export default SignInForm;
