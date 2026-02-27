// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";

/* ── Fuentes de Google (Next.js las sirve localmente) ────── */
const outfit = Outfit({
  subsets:  ["latin"],
  weight:   ["300","400","500","600","700","900"],
  variable: "--fuente-titulo",
  display:  "swap",
});

const spaceMono = Space_Mono({
  subsets:  ["latin"],
  weight:   ["400","700"],
  variable: "--fuente-mono",
  display:  "swap",
});

/* ── Metadatos ──────────────────────────────────────────── */
export const metadata: Metadata = {
  title:       "Neil Eyner Canaviri Huanca · Portafolio",
  description: "Desarrollador Web Front-End · Informático · La Paz, Bolivia",
  authors:     [{ name: "Neil Eyner Canaviri Huanca" }],
  keywords:    ["portafolio","desarrollador web","front-end","sistemas","La Paz","Bolivia"],
  openGraph: {
    title:       "Neil Eyner · Portafolio",
    description: "Desarrollador Web Front-End · Informático · La Paz, Bolivia",
    type:        "website",
    locale:      "es_BO",
  },
};

export const viewport: Viewport = {
  width:          "device-width",
  initialScale:   1,
  themeColor:     "#1a1d2e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-tema="oscuro" className={`${outfit.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}