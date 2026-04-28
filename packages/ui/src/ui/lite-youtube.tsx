import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@repo/lib/utils";
import { OptimizedImage } from "./optimized-image";

interface LiteYouTubeProps {
  src: string;
  title: string;
  className?: string;
  onPlay?: () => void;
}

export function LiteYouTube({
  src,
  title,
  className,
  onPlay,
}: LiteYouTubeProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = src.split("/").pop()?.split("?")[0];
  const thumbnailUrl = videoId
    ? `https://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : "";

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(true);
    if (onPlay) onPlay();
  };

  if (isPlaying) {
    return (
      <iframe
        src={`${src}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={cn("w-full h-full border-none", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative w-full h-full cursor-pointer group bg-slate-900",
        className,
      )}
      onClick={handlePlay}
    >
      <OptimizedImage
        src={thumbnailUrl}
        alt={title}
        width={640}
        height={360}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-90"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
          <div className="absolute -inset-4 border-2 border-white/30 rounded-full animate-[ping_3s_linear_infinite] opacity-0 group-hover:opacity-100" />
          <div className="relative w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
            <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-current ml-1" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <span className="text-white text-sm font-semibold tracking-wide drop-shadow-md">
          {title}
        </span>
      </div>
    </div>
  );
}
