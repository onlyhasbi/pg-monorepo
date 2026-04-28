import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-600" />,
        info: <InfoIcon className="size-5 text-blue-600" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-600" />,
        error: <OctagonXIcon className="size-5 text-red-600" />,
        loading: <Loader2Icon className="size-5 animate-spin text-slate-400" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast !bg-white !text-slate-900 !border-slate-200 group-data-[type=success]:!text-emerald-700 group-data-[type=success]:!border-emerald-200 group-data-[type=error]:!text-red-700 group-data-[type=error]:!border-red-200 border rounded-xl shadow-none px-5 py-4 gap-3",
          description:
            "group-data-[type=success]:!text-emerald-600 group-data-[type=error]:!text-red-600",
          title: "text-sm font-semibold",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
