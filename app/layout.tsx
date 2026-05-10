import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { getAllCategories } from "@/lib/sanity/fetch";

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
  const categories = await getAllCategories()

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <ConditionalLayout
            header={<Header categories={categories} />}
            footer={<Footer categories={categories} />}
          >
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
