import { useRef, useState, useEffect, useCallback } from "react";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  outputSize?: number; // output pixel size (square)
}

export function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel,
  outputSize = 512,
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCropping, setIsCropping] = useState(false);

  const CANVAS_SIZE = 280; // display canvas size

  // Load image
  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      setImg(image);
      // Reset state
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    image.src = imageSrc;
  }, [imageSrc]);

  // Draw image onto visible canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Calculate draw size: fit image to canvas then apply zoom
    const scale =
      Math.max(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height) * zoom;
    const drawW = img.width * scale;
    const drawH = img.height * scale;

    const x = (CANVAS_SIZE - drawW) / 2 + offset.x;
    const y = (CANVAS_SIZE - drawH) / 2 + offset.y;

    // Draw the image
    ctx.drawImage(img, x, y, drawW, drawH);

    // Draw circular overlay mask
    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw subtle ring border
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      CANVAS_SIZE / 2,
      CANVAS_SIZE / 2,
      CANVAS_SIZE / 2 - 1,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
    ctx.restore();
  }, [img, zoom, offset]);

  useEffect(() => {
    draw();
  }, [draw]);

  // --- Mouse / Touch drag ---
  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };
  const handlePointerUp = () => setDragging(false);

  // --- Mouse wheel zoom ---
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => {
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      return Math.min(Math.max(prev + delta, 0.5), 3);
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // --- Crop and output ---
  const handleCrop = async () => {
    if (!img) return;
    setIsCropping(true);

    try {
      // Create offscreen canvas at full output resolution
      const offscreen = document.createElement("canvas");
      offscreen.width = outputSize;
      offscreen.height = outputSize;
      const ctx = offscreen.getContext("2d");
      if (!ctx) return;

      const ratio = outputSize / CANVAS_SIZE;

      const scale =
        Math.max(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height) * zoom;
      const drawW = img.width * scale * ratio;
      const drawH = img.height * scale * ratio;
      const x = (outputSize - drawW) / 2 + offset.x * ratio;
      const y = (outputSize - drawH) / 2 + offset.y * ratio;

      ctx.drawImage(img, x, y, drawW, drawH);

      // Circular mask
      ctx.globalCompositeOperation = "destination-in";
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.fill();

      offscreen.toBlob(
        (blob) => {
          if (blob) {
            onCropComplete(blob);
          }
          setIsCropping(false);
        },
        "image/png",
        0.95,
      );
    } catch {
      setIsCropping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in">
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-lg font-bold text-gray-900">Atur Foto Profil</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Geser dan zoom untuk mengatur posisi gambar
          </p>
        </div>

        {/* Canvas area */}
        <div className="flex justify-center px-5 pb-4">
          <div
            ref={containerRef}
            className="relative rounded-full overflow-hidden cursor-grab active:cursor-grabbing"
            style={{
              width: CANVAS_SIZE,
              height: CANVAS_SIZE,
              background:
                "repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%) 50% / 20px 20px",
            }}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="touch-none"
            />
          </div>
        </div>

        {/* Zoom slider */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition text-lg font-bold shrink-0"
              aria-label="Zoom out"
            >
              −
            </button>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-yellow-500
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500 [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                  [&::-webkit-slider-thumb]:hover:bg-yellow-600 [&::-webkit-slider-thumb]:transition"
              />
            </div>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition text-lg font-bold shrink-0"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            {Math.round(zoom * 100)}% · Scroll mouse atau pinch untuk zoom
          </p>
        </div>

        {/* Actions */}
        <div className="flex border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <div className="w-px bg-gray-100" />
          <button
            type="button"
            onClick={handleCrop}
            disabled={isCropping || !img}
            className="flex-1 py-3.5 text-sm font-semibold text-yellow-600 hover:bg-yellow-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCropping ? "Memproses..." : "Terapkan"}
          </button>
        </div>
      </div>
    </div>
  );
}
