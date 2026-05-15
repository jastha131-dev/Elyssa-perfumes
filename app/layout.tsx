import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

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
  const locale = await getLocale();
  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      className={isArabic ? cairo.variable : ""}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
