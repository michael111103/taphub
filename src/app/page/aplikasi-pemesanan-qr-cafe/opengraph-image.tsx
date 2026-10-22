import { renderOg, ogSize } from "@/lib/og";

export const alt = "TapOrder, aplikasi pemesanan scan QR untuk cafe dan restoran";
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg({
    title: "Pesanan masuk sendiri. Kamu fokus melayani.",
    subtitle: "TapOrder: scan QR, pesan, dan bayar dari meja",
  });
}
