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

## Data yang perlu dicek

Semua data perusahaan ada di `src/lib/site.ts`: domain, email, nomor WhatsApp, alamat PT, link Instagram.
Daftar produk Tap ada di `src/lib/products.ts`, FAQ di `src/lib/faq.ts`.

## Gambar yang perlu diganti

File di bawah masih gambar sementara. Timpa dengan foto asli **dengan nama dan rasio yang sama**:

| File | Ukuran | Isi |
| --- | --- | --- |
| `public/images/taporder-scan.jpg` | 1000×1250 (4:5) | Pelanggan scan QR di meja |
| `public/images/usaha-cafe.jpg` | 1200×900 (4:3) | Suasana cafe |
| `public/images/usaha-restoran.jpg` | 1200×900 (4:3) | Restoran / rumah makan |
| `public/images/usaha-toko.jpg` | 1200×900 (4:3) | Toko / UMKM |

Kalau nama file diganti, ubah juga di `src/app/page.tsx`, dan perbarui teks `alt` supaya sesuai isi foto.

Logo: `public/taphub.png` (asli) dan `public/taphub-logo.png` (versi dipotong untuk header/footer).
Favicon dan gambar share (WhatsApp/sosmed) dibuat otomatis dari kode: `src/app/icon.tsx`, `src/app/apple-icon.tsx`, `src/app/opengraph-image.tsx`.

## Google Analytics

Isi environment variable `NEXT_PUBLIC_GA_ID` (contoh `G-XXXXXXXXXX`) di hosting.
Analytics hanya aktif setelah pengunjung menekan "Setuju" di banner cookie.

## Checklist

1. Privacy policy: `/kebijakan-privasi`
2. Terms page: `/syarat-ketentuan`
3. CTA jelas: "Daftar program pilot" di hero, harga, dan header
4. FAQ: bagian `#faq` + data terstruktur FAQPage
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
