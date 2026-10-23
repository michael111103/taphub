import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: { default: "TapHub App", template: "%s | TapHub" },
  description: "Aplikasi TapHub untuk penjualan, pembelian, biaya, persediaan, dan laporan keuangan.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F6FA" },
    { media: "(prefers-color-scheme: dark)", color: "#070B14" },
  ],
};

// Tema dipasang sebelum halaman tampil supaya tidak berkedip
const themeScript = `(function(){try{var t=localStorage.getItem('taphub-theme');var el=document.getElementById('app-root');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){el.classList.add('theme-dark')}}catch(e){}})();`;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="app-root" className="app-root min-h-screen font-sans antialiased" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      {children}
    </div>
  );
}
