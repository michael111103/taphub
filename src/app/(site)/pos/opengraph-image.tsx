import { renderOg, ogSize } from "@/lib/og";

export const alt = "TapPOS, aplikasi kasir dan sistem POS untuk F&B, retail, dan jasa";
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg({
    title: "Aplikasi kasir dan sistem POS terpusat untuk usaha yang terus tumbuh.",
    subtitle: "TapPOS · pos.taphub.id",
  });
}
