import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogSize = { width: 1200, height: 630 };

/** Gambar share (WhatsApp, Instagram, X, dll.) dengan gaya TapHub. */
export async function renderOg({ title, subtitle }: { title: string; subtitle: string }) {
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
          <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>{title}</div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#8E98AA" }}>{subtitle}</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
