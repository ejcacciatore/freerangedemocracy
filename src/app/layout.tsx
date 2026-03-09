import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-display", weight: ["400", "700", "900"] });

export const metadata: Metadata = {
  title: {
    default: "Free Range Democracy",
    template: "%s | Free Range Democracy",
  },
  description:
    "Unleashing Democracy, Empowering Freedom — exploring the interplay of government, business, and civic life.",
  keywords: ["democracy", "politics", "civic engagement", "freedom", "government"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://freerangedemocracy.com",
    siteName: "Free Range Democracy",
    title: "Free Range Democracy",
    description: "Unleashing Democracy, Empowering Freedom",
    images: [
      {
        url: "/images/grok-image-0eeadfcd-b17b-4705-b227-83e99053458c.png",
        width: 1200,
        height: 375,
        alt: "Free Range Democracy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Range Democracy",
    description: "Unleashing Democracy, Empowering Freedom",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body>
        <div className="page-shell">
          <Header />
          <main className="page-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
