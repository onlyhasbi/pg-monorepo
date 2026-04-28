import { Loader2 } from "lucide-react";
import { cn } from "@repo/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  show?: boolean;
}

/**
 * A consistent, professional circle spinner component.
 * Used to replace legacy pulse animations for loading states.
 */
export function Spinner({
  size = 16,
  show = true,
  className,
  ...props
}: SpinnerProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "animate-spin text-current opacity-70 inline-block",
        className,
      )}
      {...props}
    >
      <Loader2 size={size} strokeWidth={2.5} />
    </div>
  );
}
