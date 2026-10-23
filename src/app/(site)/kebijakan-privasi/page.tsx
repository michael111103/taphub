import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Cara TapHub mengumpulkan, memakai, dan melindungi data pribadi pengguna website dan layanan TapHub.",
  alternates: { canonical: "/kebijakan-privasi" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Kebijakan Privasi" updated="22 Oktober 2026">
      <p>
        Kebijakan ini menjelaskan bagaimana {site.company.legalName} (&ldquo;TapHub&rdquo;, &ldquo;kami&rdquo;) mengumpulkan,
        memakai, menyimpan, dan melindungi data pribadi saat kamu memakai website {site.url.replace("https://", "")} dan
        layanan TapHub, termasuk TapPOS. Kami mengelola data pribadi dengan mengacu pada Undang-Undang Nomor 27 Tahun 2022
        tentang Pelindungan Data Pribadi.
      </p>

      <h2>Data yang kami kumpulkan</h2>
      <ul>
        <li>Data yang kamu berikan langsung, seperti nama, nama usaha, jenis usaha, nomor WhatsApp, email, dan isi pesan.</li>
        <li>Data akun merchant saat memakai layanan, seperti data usaha, menu, dan informasi rekening untuk pencairan dana.</li>
        <li>Data transaksi yang diproses melalui layanan kami, seperti item pesanan, nominal, nomor meja, dan status pembayaran.</li>
        <li>Data teknis, seperti jenis perangkat, browser, dan halaman yang dikunjungi, hanya jika kamu menyetujui cookie analitik.</li>
      </ul>

      <h2>Untuk apa data dipakai</h2>
      <ul>
        <li>Menyediakan, menjalankan, dan meningkatkan layanan TapHub.</li>
        <li>Memproses pesanan dan pembayaran bersama payment gateway berlisensi.</li>
        <li>Menghubungi kamu terkait permintaan, dukungan, atau informasi layanan.</li>
        <li>Memenuhi kewajiban hukum, perpajakan, dan pencegahan penipuan.</li>
      </ul>

      <h2>Pembayaran</h2>
      <p>
        Pembayaran pelanggan diproses oleh penyedia payment gateway berlisensi. TapHub tidak menyimpan data kartu atau kredensial
        pembayaran pelanggan. Data yang diproses oleh payment gateway tunduk pada kebijakan privasi penyedia tersebut.
      </p>

      <h2>Cookie</h2>
      <p>
        Kami memakai penyimpanan lokal di browser untuk mengingat pilihan persetujuan cookie. Cookie analitik (Google Analytics)
        hanya aktif jika kamu menekan &ldquo;Setuju&rdquo; pada banner cookie. Kamu bisa menghapus pilihan ini kapan saja lewat
        pengaturan browser.
      </p>

      <h2>Berbagi data dengan pihak lain</h2>
      <p>
        Kami tidak menjual data pribadi. Data hanya dibagikan kepada pihak yang membantu menjalankan layanan, seperti payment
        gateway, penyedia hosting, dan penyedia analitik, atau jika diwajibkan oleh hukum.
      </p>

      <h2>Penyimpanan dan keamanan</h2>
      <p>
        Data disimpan selama diperlukan untuk tujuan di atas atau selama diwajibkan oleh peraturan. Kami menerapkan langkah
        keamanan yang wajar untuk melindungi data dari akses yang tidak sah.
      </p>

      <h2>Hak kamu</h2>
      <p>
        Kamu berhak meminta akses, perbaikan, penghapusan, atau penarikan persetujuan atas data pribadimu. Kirim permintaan ke{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>Perubahan kebijakan</h2>
      <p>Kami dapat memperbarui kebijakan ini. Tanggal pembaruan terakhir selalu tercantum di bagian atas halaman.</p>

      <h2>Kontak</h2>
      <p>
        {site.company.legalName}
        <br />
        {site.company.address.join(", ")}
        <br />
        Email: <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
      <p>
        Lihat juga <Link href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link>.
      </p>
    </LegalPage>
  );
}
