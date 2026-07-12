import { Button } from "@repo/ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/ui/dialog";
import { Download, QrCode, Share2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";

export function RegisterQRCode() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-[var(--radius-button)] text-slate-500 hover:text-slate-800"
          />
        }
      >
        <QrCode className="w-5 h-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md flex flex-col items-center">
        <DialogHeader className="w-full text-center mb-2">
          <DialogTitle>QR Code Pendaftaran</DialogTitle>
          <DialogDescription>
            Bagikan QR Code ini untuk membuka halaman pendaftaran.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-4 w-full">
          {isMounted ? (
            <QRCodeCanvas
              id="register-qr-code"
              value={window.location.href}
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"Q"}
              includeMargin={false}
            />
          ) : (
            <div className="w-[200px] h-[200px] bg-slate-100 animate-pulse rounded-md" />
          )}

          <div className="flex w-full mt-4 gap-2">
            <Button
              onClick={() => {
                const canvas = document.getElementById(
                  "register-qr-code",
                ) as HTMLCanvasElement;
                if (canvas) {
                  const pngUrl = canvas
                    .toDataURL("image/png")
                    .replace("image/png", "image/octet-stream");
                  const downloadLink = document.createElement("a");
                  downloadLink.href = pngUrl;
                  downloadLink.download = "register-qr-code.png";
                  document.body.appendChild(downloadLink);
                  downloadLink.click();
                  document.body.removeChild(downloadLink);
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-[var(--radius-button)]"
            >
              <Download className="w-4 h-4" /> Unduh
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (navigator.share) {
                  const canvas = document.getElementById(
                    "register-qr-code",
                  ) as HTMLCanvasElement;
                  if (canvas) {
                    canvas.toBlob(async (blob) => {
                      if (blob) {
                        const file = new File([blob], "qrcode.png", {
                          type: "image/png",
                        });
                        try {
                          if (
                            navigator.canShare &&
                            navigator.canShare({ files: [file] })
                          ) {
                            await navigator.share({
                              title: "QR Code Pendaftaran",
                              url: window.location.href,
                              files: [file],
                            });
                          } else {
                            await navigator.share({
                              title: "Link Pendaftaran",
                              url: window.location.href,
                            });
                          }
                        } catch (e) {
                          // User membatalkan share atau error lain, dibiarkan saja
                        }
                      }
                    });
                  }
                } else {
                  // Jika navigator.share tidak didukung (misal di PC / browser lawas),
                  // fallback hanya menyalin link ke clipboard
                  navigator.clipboard
                    .writeText(window.location.href)
                    .then(() => {
                      alert("Link pendaftaran berhasil disalin ke clipboard!");
                    });
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-[var(--radius-button)]"
            >
              <Share2 className="w-4 h-4" /> Bagikan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
