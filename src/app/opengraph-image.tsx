import { renderOg, ogSize } from "@/lib/og";

export const alt = "TapHub, software yang saling terhubung untuk usaha Indonesia";
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg({
    title: "Software yang saling terhubung untuk usaha Indonesia.",
    subtitle: "Penjualan, keuangan, operasional, dan gaya hidup dalam satu ekosistem",
  });
}
