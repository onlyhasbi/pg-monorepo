import { Skeleton } from "./ui/skeleton";

export function AgentLandingSkeleton() {
  return (
    <div className="pg-header-shell relative flex flex-col md:flex-row min-h-[40rem] lg:min-h-[50rem] w-full items-center justify-center bg-white gap-8 md:gap-16 px-6 pt-28 pb-12 md:p-0 overflow-hidden">
      {/* Hero Image Skeleton */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 z-10 shrink-0">
        <Skeleton className="w-full h-full rounded-full shadow-2xl shadow-slate-100" />
        {/* Small badge skeleton */}
        <Skeleton className="w-20 h-20 md:w-24 md:h-24 absolute bottom-0 right-0 z-20 rounded-full border-4 border-white shadow-xl" />
      </div>

      {/* Content Skeleton */}
      <div className="max-w-[540px] w-full space-y-6 z-10 flex flex-col items-center md:items-start px-4 md:px-0">
        <div className="w-full space-y-4">
          {/* Title Lines */}
          <Skeleton className="h-10 md:h-12 w-3/4 md:w-full rounded-lg mx-auto md:mx-0" />
          <Skeleton className="h-10 md:h-12 w-1/2 md:w-2/3 rounded-lg mx-auto md:mx-0" />
          
          {/* Subtitle Lines */}
          <div className="pt-4 space-y-2">
            <Skeleton className="h-4 w-full rounded mx-auto md:mx-0" />
            <Skeleton className="h-4 w-5/6 rounded mx-auto md:mx-0" />
            <Skeleton className="h-4 w-4/6 rounded mx-auto md:mx-0" />
          </div>
        </div>

        {/* Buttons Skeleton */}
        <div className="pt-6 flex flex-wrap items-center justify-center md:justify-start gap-4 w-full">
          <Skeleton className="h-14 w-44 rounded-full" /> {/* WhatsApp Button */}
          <Skeleton className="h-12 w-12 rounded-full" /> {/* Share Button */}
        </div>
      </div>
    </div>
  );
}
