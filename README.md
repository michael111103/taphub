# TapHub

Website utama TapHub (taphub.id). Next.js 14 + Tailwind CSS.

## Menjalankan

```bash
npm install
npm run dev          # buka http://localhost:3000
npm run build        # build produksi
npm run start        # jalankan hasil build
npm run check-links  # cek link rusak (jalankan setelah npm run start)
```

## Struktur halaman

| Alamat | Isi |
| --- | --- |
| `taphub.id` | Company profile TapHub: ekosistem, produk, keunggulan, tentang, FAQ, kartu konsultasi |
| `pos.taphub.id` | Landing page TapPOS (kode di `src/app/pos/`), dengan sitemap dan robots sendiri |
| `taphub.id/blog` | Daftar artikel dengan pencarian dan filter kategori |
| `taphub.id/blog/<slug>` | Halaman artikel (SEO, daftar isi, artikel terkait) |
| `taphub.id/tentang-kami` | Tentang TapHub: cerita, visi misi, nilai, perjalanan, kantor |
| `taphub.id/hubungi-kami` | Halaman konsultasi + formulir WhatsApp |
| `taphub.id/kebijakan-privasi`, `taphub.id/syarat-ketentuan` | Halaman legal |

Pengaturan subdomain ada di `src/middleware.ts`:
- `pos.taphub.id` menampilkan halaman `src/app/pos`.
- `taphub.id/pos` dialihkan permanen ke `pos.taphub.id` supaya Google hanya mengindeks satu alamat.
- Di preview Vercel (`*.vercel.app`) TapPOS tetap bisa dibuka di `/pos`.
- Tes di komputer sendiri: `http://pos.localhost:3000`.

## Menyambungkan domain di Vercel

1. Vercel, buka project ini, Settings, Domains: tambahkan `taphub.id`, `www.taphub.id`, dan `pos.taphub.id`.
2. Di pengelola DNS domain, ikuti record yang diminta Vercel (biasanya A record untuk `taphub.id` dan CNAME `cname.vercel-dns.com` untuk `www` dan `pos`).
3. Settings, Environment Variables (Production), lalu redeploy:
   - `NEXT_PUBLIC_MAIN_URL` = `https://taphub.id`
   - `NEXT_PUBLIC_POS_URL` = `https://pos.taphub.id`

   Tanpa dua variabel ini, link antar `taphub.id` dan `pos.taphub.id` tidak akan benar.
4. Google Search Console: daftarkan `taphub.id` dan `pos.taphub.id`, lalu kirim sitemap masing-masing (`/sitemap.xml`).

## Menambah artikel blog

Semua artikel ada di `src/lib/articles.ts`. Salin satu objek artikel, ganti `slug`, judul, deskripsi, kategori, tanggal, kata kunci, dan isinya, lalu taruh gambar sampul (1200×630) di `public/images/`. Halaman artikel, kartu di `/blog`, filter kategori, sitemap, dan data SEO dibuat otomatis.

Tips SEO: pakai kata kunci utama di judul, deskripsi 140 sampai 160 karakter, dan subjudul yang menjawab pertanyaan pembaca.

## Testimoni

Semua testimoni ada di `src/lib/testimonials.ts`:
- `companyTestimonials`: carousel di beranda (berganti otomatis dengan efek fade, bisa digeser, tombol dan titik navigasi). Selama kosong, beranda menampilkan bagian "Tentang TapHub".
- `posTestimonials`: bagian testimoni di pos.taphub.id. Tersembunyi selama kosong.

Isi hanya dengan testimoni asli dan minta izin pengguna sebelum nama mereka ditampilkan.
Untuk melihat desain carousel dengan contoh testimoni, buka `/pratinjau/testimoni` (tidak diindeks Google dan tidak ditautkan di website). Contohnya ada di `sampleTestimonials`, jangan dipindah ke daftar asli.

## Data yang perlu dicek

Semua data perusahaan ada di `src/lib/site.ts`: domain, email, nomor WhatsApp, alamat PT, link Instagram.
Daftar produk Tap ada di `src/lib/products.ts`, FAQ di `src/lib/faq.ts`.

## Gambar yang perlu diganti

File di bawah masih gambar sementara. Timpa dengan gambar asli **dengan nama dan rasio yang sama**,
atau ganti nama filenya di kode (`src/app/pos/page.tsx`, `src/lib/articles.ts`, `src/app/tentang-kami/page.tsx`) lalu perbarui teks `alt`:

| File | Ukuran | Isi |
| --- | --- | --- |
| `public/images/taphubpos1.png` | 1200×900 (4:3) | Kasir & manajemen pesanan |
| `public/images/taphubpos2.png` | 1200×900 (4:3) | Dashboard multicabang |
| `public/images/taphubpos3.png` | 1200×900 (4:3) | Laporan & analisis bisnis |
| `public/images/taphubpos4.png` | 1200×900 (4:3) | Promo & loyalitas pelanggan |
| `public/images/taphubpos5.png` | 1200×900 (4:3) | Produk & stok |
| `public/images/taphubpos6.png` | 1200×800 (3:2) | Usaha F&B |
| `public/images/taphubpos7.png` | 1200×800 (3:2) | Retail & jasa |
| `public/images/artikel1.png` | 1200×630 | Sampul artikel aplikasi kasir cafe |
| `public/images/artikel2.png` | 1200×630 | Sampul artikel sistem POS |
| `public/images/tentang1.png` | 1600×900 (16:9) | Foto tim atau suasana kerja (halaman Tentang) |
| `public/images/tentang2.png` | 1200×900 (4:3) | Foto gedung atau kantor (halaman Tentang) |

Logo: `public/whitelogo.png` (asli, tulisan Tap hitam) dipotong jadi `public/taphub-logo-dark.png` untuk latar terang (header). `public/taphub.png` (asli, tulisan Tap putih) dipotong jadi `public/taphub-logo.png` untuk latar gelap (footer).

Tema warna: terang secara default. Bagian yang diberi class `theme-dark` (mockup dashboard, kartu konsultasi, footer) tetap gelap. Semua warna diatur di `src/app/globals.css`.
Favicon dan gambar share (WhatsApp/sosmed) dibuat otomatis dari kode: `src/app/icon.tsx`, `src/app/apple-icon.tsx`, `src/app/opengraph-image.tsx`.

## Google Analytics

Isi environment variable `NEXT_PUBLIC_GA_ID` (contoh `G-XXXXXXXXXX`) di hosting.
Analytics hanya aktif setelah pengunjung menekan "Setuju" di banner cookie.

## Checklist

1. Privacy policy: `/kebijakan-privasi`
2. Terms page: `/syarat-ketentuan`
3. CTA jelas: "Chat lewat WhatsApp" dan "Konsultasi sekarang" di beranda, "WhatsApp sales" dan "Jadwalkan demo" di TapPOS, "Hubungi kami" di header
4. FAQ: FAQ umum di beranda dan FAQ TapPOS di pos.taphub.id, keduanya dengan data terstruktur FAQPage
5. robots.txt: `src/app/robots.ts`
6. sitemap.xml: `src/app/sitemap.ts`
7. Custom 404: `src/app/not-found.tsx`
8. Alt text di semua gambar
9. Analytics: `src/components/Analytics.tsx` (GA4, setelah persetujuan)
10. Meta title: template `%s | TapHub` di `src/app/layout.tsx`
11. Meta description per halaman
12. Social share: Open Graph + Twitter card + gambar share otomatis
13. Favicon + Apple touch icon
14. Canonical URL per halaman
15. Cookie consent: `src/components/CookieConsent.tsx`
16. Versi mobile: menu mobile, tata letak responsif, tanpa scroll horizontal
17. Aksesibilitas: skip link, label form, fokus keyboard, mode gerak dikurangi
18. Form diuji: validasi nama, usaha, jenis usaha, nomor WhatsApp, lalu buka WhatsApp
19. Cek link rusak: `npm run check-links`
20. Performa: halaman statis, font self-hosted, `next/image` (AVIF/WebP), animasi CSS tanpa library tambahan

Teks Kebijakan Privasi dan Syarat & Ketentuan adalah draf awal. Sebaiknya ditinjau ahli hukum sebelum layanan berjalan.
