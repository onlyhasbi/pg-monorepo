import {
  useState,
  useEffect,
  useRef,
  useMemo,
  type ImgHTMLAttributes,
} from "react";
import { getCloudinaryUrl, getCloudinarySrcSet } from "@repo/lib/images";

export type OptimizedImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  priority?: boolean;
  width?: number;
  height?: number;
  aspectRatio?: number;
};

export function OptimizedImage(props: OptimizedImageProps) {
  const { src, className, priority, width, height, aspectRatio, ...rest } =
    props;

  if (!src) return null;

  const isSvg = src.toLowerCase().endsWith(".svg");
  const isAvif = src.toLowerCase().endsWith(".avif");
  const isLocal = src.startsWith("/") && !src.startsWith("//");

  const BLOCKED_DOMAINS = ["chinapress.com.my"];
  const isBlockedDomain =
    (src.startsWith("http") || src.startsWith("//")) &&
    BLOCKED_DOMAINS.some((domain) => src.includes(domain));

  const defaultWidth = width || 800;
  const canOptimizeLocal = isLocal && !isSvg && !isAvif && !import.meta.env.DEV;
  const canUseCloudinary =
    !isBlockedDomain && !isSvg && !isAvif && (!isLocal || canOptimizeLocal);

  const srcset = canUseCloudinary
    ? getCloudinarySrcSet(src, { priority, maxWidth: width })
    : undefined;

  // FAST PATH: Priority images render a bare <img> with no wrapper, no blur, no hydration delay.
  // This is critical for LCP — the browser can paint immediately without extra layout or JS.
  if (priority) {
    return (
      <img
        src={
          canUseCloudinary
            ? getCloudinaryUrl(src, { width: defaultWidth, priority: true })
            : src
        }
        srcSet={canUseCloudinary ? srcset : undefined}
        sizes={
          props.sizes ||
          (width ? `${width}px` : "(max-width: 768px) 100vw, 800px")
        }
        className={className}
        loading="eager"
        fetchPriority="high"
        width={width}
        height={height}
        style={{
          aspectRatio:
            aspectRatio || (width && height ? width / height : undefined),
        }}
        {...rest}
      />
    );
  }

  // LAZY PATH: Non-priority images get the full treatment (wrapper, blur placeholder, fade-in)
  return <LazyImage {...props} />;
}

function LazyImage(props: OptimizedImageProps) {
  const { src, className, width, height, aspectRatio, ...rest } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsClient(true);
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  const isSvg = src.toLowerCase().endsWith(".svg");
  const isAvif = src.toLowerCase().endsWith(".avif");
  const isLocal = src.startsWith("/") && !src.startsWith("//");

  const BLOCKED_DOMAINS = ["chinapress.com.my"];
  const isBlockedDomain =
    (src.startsWith("http") || src.startsWith("//")) &&
    BLOCKED_DOMAINS.some((domain) => src.includes(domain));

  const defaultWidth = width || 800;
  const canOptimizeLocal = isLocal && !isSvg && !isAvif && !import.meta.env.DEV;
  const useCloudinary =
    !hasError && !isBlockedDomain && !isSvg && !isAvif && (!isLocal || canOptimizeLocal);

  const srcset = useCloudinary
    ? getCloudinarySrcSet(src, { maxWidth: width })
    : undefined;

  const { wrapperClass, imgClass } = useMemo(() => {
    const classes = (className || "").split(" ");
    const objectCls = classes.filter((c) => c.startsWith("object-"));
    const wrapperCls = classes.filter((c) => !c.startsWith("object-"));
    return {
      wrapperClass: `relative overflow-hidden ${wrapperCls.join(" ")}`,
      imgClass: `w-full h-full ${objectCls.length > 0 ? objectCls.join(" ") : "object-cover object-center"}`,
    };
  }, [className]);

  return (
    <div
      className={wrapperClass}
      style={{
        aspectRatio:
          aspectRatio || (width && height ? width / height : undefined),
      }}
    >
      {!isLoaded && (
        <div
          className="absolute inset-0 w-full h-full bg-slate-200/60 animate-pulse"
          aria-hidden="true"
        />
      )}

      <img
        ref={imgRef}
        src={
          useCloudinary ? getCloudinaryUrl(src, { width: defaultWidth }) : src
        }
        srcSet={useCloudinary ? srcset : undefined}
        sizes={
          rest.sizes ||
          (width ? `${width}px` : "(max-width: 768px) 100vw, 800px")
        }
        className={`${imgClass} ${isClient ? "transition-opacity duration-700 ease-in-out" : ""} ${
          useCloudinary
            ? isLoaded || !isClient
              ? "opacity-100"
              : "opacity-0"
            : "opacity-100"
        }`}
        loading="lazy"
        fetchPriority="auto"
        decoding="async"
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...rest}
      />
    </div>
  );
}
