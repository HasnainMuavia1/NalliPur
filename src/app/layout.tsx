import type { Metadata, Viewport } from "next";
import { Lilita_One, Lalezar, Poppins } from "next/font/google";
import { BRANCHES, FACEBOOK, INSTAGRAM, PHONE_DISPLAY } from "@/lib/brand";
import "./globals.css";

const display = Lilita_One({ variable: "--font-display", subsets: ["latin"], weight: "400" });
const urdu = Lalezar({ variable: "--font-urdu", subsets: ["arabic"], weight: "400" });
const body = Poppins({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Nalli Pur — Biryani & Pulao · Authentic Karachi Nalli Biryani in Lahore",
  description:
    "Karachi-style beef nalli biryani & pulao, chicken and beef biryani, pulao and charcoal BBQ. PIA Road (Johar Town) and Lakshmi Chowk, Lahore. Order: 0305-9555838.",
  icons: { icon: [{ url: "/favicon.ico" }, { url: "/brand/mark.webp", type: "image/webp" }] },
  openGraph: {
    title: "Nalli Pur — Biryani & Pulao",
    description: "Nalli di gall hi wakhri ae! Bone-deep flavor — biryani, pulao & BBQ in Lahore.",
    images: ["/dishes/beef-biryani.webp"],
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0a0807" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Nalli Pur — Biryani & Pulao",
  servesCuisine: ["Pakistani", "Biryani", "BBQ"],
  telephone: PHONE_DISPLAY,
  sameAs: [INSTAGRAM, FACEBOOK],
  priceRange: "PKR",
  department: BRANCHES.map((b) => ({
    "@type": "Restaurant",
    name: `Nalli Pur — ${b.name}`,
    address: { "@type": "PostalAddress", streetAddress: b.address, addressLocality: "Lahore", addressCountry: "PK" },
    telephone: PHONE_DISPLAY,
  })),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* the film engine fetch()es frames, so preload as fetch for the cache to match */}
        <link rel="preload" as="fetch" crossOrigin="anonymous" href="/film/serve/d/f_0001.webp" media="(min-width: 768px)" />
        <link rel="preload" as="fetch" crossOrigin="anonymous" href="/film/serve/m/f_0001.webp" media="(max-width: 767px)" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${display.variable} ${urdu.variable} ${body.variable} antialiased`}>{children}</body>
    </html>
  );
}
