import type { Metadata } from "next";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { sampleTestimonials } from "@/lib/testimonials";

// Halaman internal untuk melihat desain carousel dengan contoh testimoni.
// Tidak diindeks Google, tidak masuk sitemap, dan tidak ditautkan dari halaman mana pun.
export const metadata: Metadata = {
  title: "Pratinjau testimoni",
  robots: { index: false, follow: false },
};

export default function PratinjauTestimoni() {
  return (
    <TestimonialCarousel
      id="testimoni"
      title="Cerita dari pengguna TapHub"
      description="Pemilik usaha di berbagai kota memakai TapHub untuk merapikan penjualan, stok, dan laporan."
      items={sampleTestimonials}
      isSample
    />
  );
}
