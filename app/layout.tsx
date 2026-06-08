import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Extrava",
  description:
    "Extrava is a smart wearable sensor that catches IV drug extravasation in real time — protecting cancer patients during chemotherapy and infusion therapy.",
  keywords: [
    "extravasation",
    "IV monitoring",
    "chemotherapy safety",
    "wearable medical sensor",
    "oncology",
    "patient monitoring",
    "Extrava",
  ],
  openGraph: {
    title: "Extrava",
    description:
      "A smart wearable sensor that catches IV drug extravasation in real time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink-950 text-ink-100 antialiased">
        <Navbar />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
