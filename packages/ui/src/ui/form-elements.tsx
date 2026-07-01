import { cn } from "@repo/lib/utils";
import { AlertCircle, CheckCircle, Eye, EyeOff, X } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Alert, AlertDescription } from "./alert";

export const inputClass =
  "w-full px-4 py-3 bg-transparent border border-input rounded-[var(--radius-input)] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all duration-200";
export const labelClass = "block text-sm font-semibold text-foreground mb-2";

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
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children || (
        <input
          id={id}
          name={id}
          required={required}
          className={cn(
            inputClass,
            error &&
              "border-destructive focus:ring-destructive/30 focus:border-destructive",
            className,
          )}
          {...props}
        />
      )}
      {error ? (
        <div className="absolute top-full left-1 mt-1 text-[11px] font-medium text-destructive">
          {error}
        </div>
      ) : description ? (
        <div className="absolute top-full left-1 mt-1 text-[11px] font-medium text-muted-foreground/90">
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
          error &&
            "border-destructive focus:ring-destructive/30 focus:border-destructive",
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
        <p className="absolute top-full left-1 mt-1 text-[11px] font-medium text-destructive">
          {error}
        </p>
      ) : description ? (
        <p className="absolute top-full left-1 mt-1 text-[11px] font-medium text-muted-foreground/90">
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
        "mb-10 flex items-start justify-between gap-3 border rounded-[var(--radius-card)] px-5 py-4 animate-in fade-in slide-in-from-top-2 !grid-cols-none",
        isSuccess
          ? "bg-card border-emerald-200 text-emerald-700"
          : "bg-card border-destructive/30 text-destructive",
      )}
    >
      <div className="flex gap-3 items-start flex-1 min-w-0">
        <Icon
          className={cn(
            "size-5 shrink-0 mt-0.5",
            isSuccess ? "text-emerald-600" : "text-destructive",
          )}
        />
        <AlertDescription className="text-sm font-medium leading-relaxed break-words">
          {message}
        </AlertDescription>
      </div>
      <button
        onClick={onClose}
        className={cn(
          "p-1 rounded-[var(--radius-button)] transition-colors duration-200 shrink-0 mt-0.5",
          isSuccess ? "hover:bg-emerald-100" : "hover:bg-destructive/10",
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
        {label} {required && <span className="text-destructive">*</span>}
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
              "border-destructive focus:ring-destructive/30 focus:border-destructive",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 p-0 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {error ? (
        <div className="absolute top-full left-1 mt-1 text-[11px] font-medium text-destructive">
          {error}
        </div>
      ) : description ? (
        <div className="absolute top-full left-1 mt-1 text-[11px] font-medium text-muted-foreground/90">
          {description}
        </div>
      ) : null}
    </div>
  );
}
