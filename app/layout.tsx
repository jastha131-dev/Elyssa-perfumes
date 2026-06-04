import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import localFont from "next/font/local";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { getSiteSettings } from "@/lib/sanity/fetch";
import { buildGoogleFontsUrl, buildTypographyCss } from "@/lib/typography";
import CurrencyProvider from "@/components/layout/CurrencyProvider";

// Satoshi — loaded locally (covers all weights 300–900)
const satoshi = localFont({
  src: [
    { path: "../public/fonts/Satoshi-Variable.woff2", style: "normal" },
    { path: "../public/fonts/Satoshi-VariableItalic.woff2", style: "italic" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  weight: "300 900",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Luxe Parfum — The Art of Fragrance",
    template: "%s | Luxe Parfum",
  },
  description:
    "Discover handcrafted luxury fragrances inspired by the world's finest perfumery traditions. Premium scents for the discerning connoisseur.",
  keywords: [
    "luxury perfume",
    "fragrance",
    "eau de parfum",
    "designer perfume",
    "luxury scent",
  ],
  authors: [{ name: "Luxe Parfum" }],
  creator: "Luxe Parfum",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://luxeparfum.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Luxe Parfum",
    title: "Luxe Parfum — The Art of Fragrance",
    description:
      "Discover handcrafted luxury fragrances inspired by the world's finest perfumery traditions.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Luxe Parfum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxe Parfum — The Art of Fragrance",
    description:
      "Discover handcrafted luxury fragrances inspired by the world's finest perfumery traditions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, settings] = await Promise.all([
    getLocale(),
    getSiteSettings(),
  ]);
  const isArabic = locale === "ar";

  const fontsUrl = buildGoogleFontsUrl(settings?.fontPairing ?? "satoshi");
  const typographyCss = buildTypographyCss(settings);

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      className={`${satoshi.variable} ${isArabic ? cairo.variable : ""}`.trim()}
    >
      <head>
        {/* Only load Google Fonts when NOT using local Satoshi pairing */}
        {fontsUrl && !fontsUrl.includes('Satoshi') && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href={fontsUrl} rel="stylesheet" />
          </>
        )}
        <style dangerouslySetInnerHTML={{ __html: typographyCss }} />
      </head>
      <body>
        <CurrencyProvider
          currencies={settings?.currencies ?? [
            { code: 'USD', symbol: '$', rate: 1, position: 'before' },
            { code: 'AED', symbol: 'AED', rate: 3.67, position: 'after' },
            { code: 'INR', symbol: '₹', rate: 83.5, position: 'before' },
          ]}
          defaultCurrency={settings?.defaultCurrency ?? 'USD'}
        />
        {children}
      </body>
    </html>
  );
}
