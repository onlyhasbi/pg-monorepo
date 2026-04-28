import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import type { ReactNode } from "react";

type ToastType = "success" | "error" | "warning" | "info";

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          duration: 4000,
        }}
      />
    </>
  );
}

export function useToast() {
  const showToast = (message: string, type: ToastType = "info") => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "info":
        toast.info(message);
        break;
    }
  };

  return { showToast };
}
