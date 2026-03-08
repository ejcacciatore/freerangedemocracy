import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
        url: "/images/posts/cropped-freerangedemocracy_imagine2.jpg",
        width: 1280,
        height: 418,
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
    <html lang="en" className={inter.variable}>
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
