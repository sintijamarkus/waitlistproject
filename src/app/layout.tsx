import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const display = Space_Grotesk({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SKYHOME X — Your home. Your world. Your freedom.",
  description:
    "A flying mobile home that drives, sails and flies. Don't just visit the world's most beautiful places. Live above them. Join the waitlist.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* suppressHydrationWarning: pārlūka paplašinājumi (piem. Grammarly) pieliek <body> savus
          atribūtus pirms React ielādējas. Ignorē tikai body atribūtus, ne bērnu elementus. */}
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${display.variable} bg-black text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
