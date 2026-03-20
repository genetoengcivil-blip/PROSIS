import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PROSIS | Agent Launchpad",
  description: "Engenharia de SaaS guiada por IA sênior",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "PROSIS" },
};

export const viewport: Viewport = {
  themeColor: "#0f172a", // Match night-900
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className="dark">
      <head>
        <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/2592/2592201.png" />
      </head>
      <body className={`${inter.className} bg-night-950 text-slate-200 antialiased`}>
        <div className="min-h-screen flex flex-col">
          <nav className="border-b border-slate-800 bg-night-950/80 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <span className="text-2xl font-black italic tracking-tighter text-prosis-blue">PROSIS</span>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">
                <span>Engine v1.0</span>
              </div>
            </div>
          </nav>
          <main className="flex-1">
            {children}
          </main>
          <footer className="p-8 text-center text-[10px] font-bold text-slate-700 uppercase tracking-[0.4em] border-t border-slate-800 mt-12">
            © 2026 PROSIS ENGINE | High-Performance AI
          </footer>
        </div>
      </body>
    </html>
  );
}