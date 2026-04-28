import clsx from "clsx";
import type { PropsWithChildren } from "react";

function BaseLayout({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        "flex w-11/12 max-w-7xl mx-auto items-center text-center py-16",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default BaseLayout;
