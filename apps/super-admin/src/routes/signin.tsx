import { valibotResolver } from "@hookform/resolvers/valibot";
import { requireAdminGuest, setAuthToken } from "@repo/lib/auth";
import { queryClient } from "@repo/lib/queryClient";
import { authAdminQueryOptions } from "@repo/lib/queryOptions";
import { loginFn } from "@repo/services/api.functions";
import { useToast } from "@repo/ui/toast";
import { Button } from "@repo/ui/ui/button";
import { Card, CardContent } from "@repo/ui/ui/card";
import { InputField, PasswordInput } from "@repo/ui/ui/form-elements";
import { Spinner } from "@repo/ui/ui/spinner";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as v from "valibot";

const MotionCard = motion.create(Card);

export const Route = createFileRoute("/signin")({
  beforeLoad: async () => await requireAdminGuest(),
  component: AdminLoginPage,
});

const schema = v.object({
  email: v.pipe(
    v.string(),
    v.email("Format email tidak valid"),
    v.nonEmpty("Email wajib diisi"),
  ),
  katasandi: v.pipe(v.string(), v.nonEmpty("Password wajib diisi")),
});

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function AdminLoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = "Login Super Admin | Public Gold Indonesia";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: valibotResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      katasandi: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { email: string; katasandi: string }) => {
      return loginFn({
        data: {
          identifier: data.email,
          katasandi: data.katasandi,
        },
      });
    },
    onSuccess: async (data) => {
      if (data.success && data.user?.role === "admin") {
        setAuthToken(data.token, true);
        queryClient.setQueryData(authAdminQueryOptions().queryKey, {
          user: data.user,
          token: data.token,
        });

        navigate({ to: "/" });
      } else if (data.success && data.user?.role !== "admin") {
        showToast("Akses ditolak. Akun ini bukan admin.", "error");
      } else {
        showToast(data.message, "error");
      }
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      showToast(error.response?.data?.message || "Login gagal", "error");
    },
  });

  const onSubmit = (data: { email: string; katasandi: string }) => {
    mutation.mutate(data);
  };

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center bg-background overflow-hidden px-6 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-rose-50/50 via-background to-background pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/3 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-8 md:gap-10"
      >
        <AnimatePresence mode="wait">
          <MotionCard
            key="auth-content"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            className="bg-card rounded-[1.5rem] overflow-hidden shadow-2xl shadow-foreground/5 border-none ring-0 max-w-lg mx-auto w-full"
          >
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-6 sm:px-10 pb-8 pt-10">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <fieldset disabled={mutation.isPending} className="space-y-5">
                    <InputField
                      id="email"
                      label="Email"
                      type="email"
                      placeholder="admin@domain.com"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                    <PasswordInput
                      id="katasandi"
                      label="Password"
                      placeholder="••••••••"
                      error={errors.katasandi?.message}
                      {...register("katasandi")}
                    />
                    <motion.div
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="font-bold w-full"
                      >
                        {mutation.isPending ? (
                          <Spinner
                            size={20}
                            className="text-primary-foreground"
                          />
                        ) : (
                          "Secure Login"
                        )}
                      </Button>
                    </motion.div>
                  </fieldset>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Super Admin Baru?{" "}
                  <Link
                    to="/signup"
                    className="text-primary font-bold hover:underline"
                  >
                    Daftar di sini
                  </Link>
                </div>
              </div>
            </CardContent>
          </MotionCard>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default AdminLoginPage;
