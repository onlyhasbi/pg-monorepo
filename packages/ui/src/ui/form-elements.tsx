import { type ReactNode, useState } from "react";
import { AlertCircle, CheckCircle, X, Eye, EyeOff } from "lucide-react";
import { cn } from "@repo/lib/utils";
import { Alert, AlertDescription } from "./alert";

export const inputClass =
  "w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-all duration-200";
export const labelClass = "block text-sm font-semibold text-slate-700 mb-2";

export function InputField({
  label,
  id,
  required = false,
  description,
  error,
  children,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string | ReactNode;
  description?: ReactNode;
  error?: string | false;
}) {
  return (
    <div className="relative pb-0.5">
      <label htmlFor={id} className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children || (
        <input
          id={id}
          name={id}
          required={required}
          className={cn(
            inputClass,
            error &&
              "border-red-500 focus:ring-red-500/30 focus:border-red-500",
            className,
          )}
          {...props}
        />
      )}
      {error ? (
        <div className="absolute top-full left-1 mt-1 text-[11px] font-medium text-red-500">
          {error}
        </div>
      ) : description ? (
        <div className="absolute top-full left-1 mt-1 text-[11px] font-medium text-slate-400/90">
          {description}
        </div>
      ) : null}
    </div>
  );
}

export function SelectField({
  label,
  id,
  required = false,
  description,
  error,
  options,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string | ReactNode;
  description?: ReactNode;
  error?: string | false;
  options: { value: string; label: string; disabled?: boolean }[];
}) {
  return (
    <div className="relative pb-0.5">
      <label htmlFor={id} className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        name={id}
        required={required}
        className={cn(
          inputClass,
          "appearance-none cursor-pointer",
          error && "border-red-500 focus:ring-red-500/30 focus:border-red-500",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="absolute top-full left-1 mt-1 text-[11px] font-medium text-red-500">
          {error}
        </p>
      ) : description ? (
        <p className="absolute top-full left-1 mt-1 text-[11px] font-medium text-slate-400/90">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function AlertMessage({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) {
  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle : AlertCircle;

  return (
    <Alert
      variant={isSuccess ? "default" : "destructive"}
      className={cn(
        "mb-10 flex items-start justify-between gap-3 border rounded-xl px-5 py-4 animate-in fade-in slide-in-from-top-2 !grid-cols-none",
        isSuccess
          ? "bg-white border-emerald-200 text-emerald-700"
          : "bg-white border-red-200 text-red-700",
      )}
    >
      <div className="flex gap-3 items-start flex-1 min-w-0">
        <Icon
          className={cn(
            "size-5 shrink-0 mt-0.5",
            isSuccess ? "text-emerald-600" : "text-red-600",
          )}
        />
        <AlertDescription className="text-sm font-medium leading-relaxed break-words">
          {message}
        </AlertDescription>
      </div>
      <button
        onClick={onClose}
        className={cn(
          "p-1 rounded-lg transition-colors duration-200 shrink-0 mt-0.5",
          isSuccess ? "hover:bg-emerald-100" : "hover:bg-red-100",
        )}
        type="button"
        aria-label="Tutup"
      >
        <X className="size-[15px]" />
      </button>
    </Alert>
  );
}

export function PasswordInput({
  label,
  id,
  required = false,
  description,
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string | ReactNode;
  description?: ReactNode;
  error?: string | false;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative pb-0.5">
      <label htmlFor={id} className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          required={required}
          className={cn(
            inputClass,
            "pr-10",
            error &&
              "border-red-500 focus:ring-red-500/30 focus:border-red-500",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-transparent transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {error ? (
        <div className="absolute top-full left-1 mt-1 text-[11px] font-medium text-red-500">
          {error}
        </div>
      ) : description ? (
        <div className="absolute top-full left-1 mt-1 text-[11px] font-medium text-slate-400/90">
          {description}
        </div>
      ) : null}
    </div>
  );
}
