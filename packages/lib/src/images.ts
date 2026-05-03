/**
 * Utility for Cloudinary Image Optimization
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export interface CloudinaryOptions {
  width?: number;
  priority?: boolean;
  format?: string;
}

export const HERO_IMAGE_CONFIG = {
  width: 400,
  sizes: "(max-width: 768px) 256px, 320px",
};

/**
 * Generates a Cloudinary URL with transformations based on the source and options.
 */
export function getCloudinaryUrl(src: string, options: CloudinaryOptions = {}) {
  const { width, priority, format } = options;

  if (!src) return "";

  const isCloudinary = src.includes("res.cloudinary.com");
  const isLocal = src.startsWith("/") && !src.startsWith("//");
  const isSvg = src.toLowerCase().endsWith(".svg");
  const isExternal =
    (src.startsWith("http") || src.startsWith("//")) && !isCloudinary;

  // Domains known to block Cloudinary fetch
  const BLOCKED_DOMAINS = ["chinapress.com.my"];
  const isBlockedDomain =
    isExternal && BLOCKED_DOMAINS.some((domain) => src.includes(domain));

  const isPublicId = [!isExternal, !isCloudinary, !isLocal, !isSvg].every(
    Boolean,
  );

  if (
    !CLOUD_NAME ||
    isBlockedDomain ||
    (!isExternal && !isCloudinary && !isLocal && !isPublicId)
  ) {
    return src;
  }

  // Force explicit format (default to AVIF for extreme compression if not SEO)
  // SVGs are skipped to preserve vector elasticity
  const transformations = isSvg ? [] : [format ? `f_${format}` : "f_avif"];

  transformations.push(priority ? "q_auto" : "q_auto:eco");
  if (!priority) {
    transformations.push("dpr_auto");
  }
  // Only apply width and limit to non-SVG images to preserve vector proportions
  if (!isSvg) {
    if (width) {
      transformations.push(`w_${width}`);
    }
    transformations.push("c_limit");
  }

  // Case 1: YouTube
  const ytMatch = src.match(/(?:ytimg\.com|youtube\.com)\/vi\/([^/]+)/);
  if (ytMatch && ytMatch[1]) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/youtube/${transformations.join(",")}/${ytMatch[1]}.jpg`;
  }

  // Case 2: Existing Cloudinary
  if (isCloudinary) {
    const isUpload = src.includes("/upload/");
    const isFetch = src.includes("/fetch/");
    const token = isUpload ? "/upload/" : isFetch ? "/fetch/" : null;

    if (token) {
      const parts = src.split(token);
      return `${parts[0]}${token}${transformations.join(",")}/${parts[1]}`;
    }
  }

  // Case 3: Local Asset
  if (isLocal) {
    // In development or for SVGs, return local path directly.
    // Cloudinary cannot fetch relative local paths from localhost.
    if (import.meta.env.DEV || isSvg) {
      return src;
    }

    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : import.meta.env.VITE_SITE_URL || "https://mypublicgold.id";
    const fullUrl = `${origin}${src}`;
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${transformations.join(",")}/${encodeURIComponent(fullUrl)}`;
  }

  // Case 4: Public ID or External Fetch
  const fetchType = isPublicId ? "upload" : "fetch";
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/${fetchType}/${transformations.join(",")}/${isPublicId ? src : encodeURIComponent(src)}`;
}

/**
 * Generates a standard srcset for responsive images.
 */
export function getCloudinarySrcSet(
  src: string,
  options: Pick<CloudinaryOptions, "priority"> & { maxWidth?: number } = {},
) {
  const { maxWidth, ...rest } = options;

  // If we know the target width (e.g. for a logo), generate 1x, 2x, 3x versions
  // to avoid downloading massive 1600px versions for a 200px image.
  // Generate more granular sizes to satisfy PageSpeed Insights "Properly size images"
  // If the browser needs 445px, providing 500w saves bandwidth compared to forcing 800w.
  const widths = maxWidth
    ? [
        Math.round(maxWidth * 0.5),
        Math.round(maxWidth * 0.75),
        maxWidth,
        Math.round(maxWidth * 1.25),
        Math.round(maxWidth * 1.5),
        maxWidth * 2,
        maxWidth * 3,
      ].filter((w) => w <= 2000 && w >= 100)
    : [300, 400, 600, 800, 1200, 1600];

  return widths
    .map((w) => `${getCloudinaryUrl(src, { ...rest, width: w })} ${w}w`)
    .join(", ");
}
