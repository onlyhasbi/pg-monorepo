import { Skeleton } from "./skeleton";

interface SectionSkeletonProps {
  type?: "grid" | "list" | "price";
  cardCount?: number;
}

export function SectionSkeleton({ type = "grid", cardCount = 3 }: SectionSkeletonProps) {
  return (
    <div className="w-11/12 max-w-7xl mx-auto py-16 space-y-12">
      {/* Section Title Skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-8 md:h-10 w-48 md:w-64 mx-auto rounded-lg" />
        <Skeleton className="h-4 w-64 md:w-96 mx-auto rounded" />
      </div>

      {type === "price" && (
        <div className="space-y-16">
          {/* Price Stats Skeleton */}
          <div className="flex flex-row items-center justify-center gap-4 md:gap-16">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-10 md:h-14 w-40 md:w-56 rounded-xl" />
            </div>
            <div className="w-px h-12 bg-slate-100" />
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-10 md:h-14 w-40 md:w-56 rounded-xl" />
            </div>
          </div>
          {/* Carousel Placeholder */}
          <div className="flex gap-6 overflow-hidden">
             <Skeleton className="h-[400px] w-full md:w-[60%] shrink-0 rounded-[2.5rem]" />
             <Skeleton className="h-[400px] w-[40%] hidden md:block shrink-0 rounded-[2.5rem]" />
          </div>
        </div>
      )}

      {type === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: cardCount }).map((_, i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-50 bg-white/50 flex gap-4 items-start">
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-5 w-2/3 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-5/6 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === "list" && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <Skeleton className="h-4 flex-1 rounded" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
