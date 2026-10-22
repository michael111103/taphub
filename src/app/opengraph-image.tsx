import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "TapHub — software untuk menjalankan usaha di Indonesia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Gambar yang muncul saat link website dibagikan di WhatsApp, Instagram, X, dll.
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public", "taphub-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#04060A",
          backgroundImage:
            "radial-gradient(circle at 85% 10%, rgba(27,91,255,0.5), rgba(4,6,10,0) 55%), radial-gradient(circle at 0% 100%, rgba(56,200,248,0.2), rgba(4,6,10,0) 45%)",
          color: "#E8EDF5",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={330} height={72} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
            Pesanan masuk sendiri. Kamu fokus melayani.
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#8E98AA" }}>
            TapOrder · scan QR, pesan, dan bayar dari meja
          </div>
        </div>
      </div>
    ),
    size,
  );
}
