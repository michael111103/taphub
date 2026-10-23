import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan website dan layanan TapHub, termasuk TapPOS.",
  alternates: { canonical: "/syarat-ketentuan" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Syarat & Ketentuan" updated="22 Oktober 2026">
      <p>
        Syarat dan ketentuan ini mengatur penggunaan website dan layanan yang disediakan oleh {site.company.legalName}
        (&ldquo;TapHub&rdquo;, &ldquo;kami&rdquo;). Dengan memakai layanan kami, kamu menyetujui ketentuan berikut.
      </p>

      <h2>Layanan</h2>
      <p>
        TapHub menyediakan software berbasis web untuk usaha, termasuk TapPOS untuk kasir, pesanan, stok, dan laporan penjualan.
        Fitur dan ketersediaan produk dapat berubah seiring pengembangan.
      </p>

      <h2>Akun merchant</h2>
      <ul>
        <li>Merchant wajib memberikan data usaha yang benar dan menjaga kerahasiaan akses akunnya.</li>
        <li>Merchant bertanggung jawab atas menu, harga, dan pesanan yang dijual melalui layanan.</li>
        <li>Merchant wajib mematuhi ketentuan payment gateway dan peraturan yang berlaku.</li>
      </ul>

      <h2>Pembayaran dan biaya</h2>
      <ul>
        <li>Pembayaran pelanggan diproses oleh payment gateway berlisensi dan masuk ke saldo akun merchant, bukan ke rekening TapHub.</li>
        <li>Biaya layanan setiap produk mengikuti paket atau penawaran yang disepakati dengan TapHub.</li>
        <li>Biaya metode pembayaran mengikuti tarif payment gateway yang berlaku.</li>
        <li>Pengembalian dana (refund) kepada pelanggan menjadi tanggung jawab merchant sesuai kebijakan usahanya.</li>
      </ul>

      <h2>Penggunaan yang dilarang</h2>
      <p>
        Layanan tidak boleh dipakai untuk menjual barang atau jasa yang melanggar hukum, melakukan penipuan, atau mengganggu
        keamanan sistem. Kami berhak menangguhkan akun yang melanggar ketentuan ini.
      </p>

      <h2>Ketersediaan layanan</h2>
      <p>
        Kami berupaya menjaga layanan tetap berjalan, namun tidak menjamin layanan bebas gangguan. Kami tidak bertanggung jawab
        atas kerugian tidak langsung akibat gangguan jaringan, perangkat, atau layanan pihak ketiga.
      </p>

      <h2>Hak kekayaan intelektual</h2>
      <p>Seluruh software, desain, dan konten di website ini milik {site.company.legalName}, kecuali disebutkan lain.</p>

      <h2>Privasi</h2>
      <p>
        Pengelolaan data pribadi diatur dalam <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>.
      </p>

      <h2>Hukum yang berlaku</h2>
      <p>Ketentuan ini tunduk pada hukum Republik Indonesia.</p>

      <h2>Perubahan dan kontak</h2>
      <p>
        Kami dapat memperbarui ketentuan ini sewaktu-waktu. Pertanyaan dapat dikirim ke{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
