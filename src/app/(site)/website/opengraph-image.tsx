import { renderOg, ogSize } from "@/lib/og";

export const alt = "TapWebsite, jasa pembuatan website untuk usaha dari TapHub";
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg({
    title: "Website profesional untuk usahamu, siap online dalam hitungan hari.",
    subtitle: "TapWebsite · website.taphub.id",
  });
}
