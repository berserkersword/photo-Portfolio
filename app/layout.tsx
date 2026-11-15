import type { Metadata } from "next";
import { Instrument_Serif, Karla, Manrope } from "next/font/google";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PageLoader from "@/components/PageLoader";
import Reveal from "@/components/Reveal";
import VisitTracker from "@/components/VisitTracker";
import "./globals.css";

// Asl saytdagi pullik shriftlarga eng yaqin bepul muqobillar:
// Very Vogue Display → Instrument Serif, BR Firma → Manrope, Karla → Karla
const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Karla({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "islomVisual | Visual Storytelling",
    template: "%s | islomVisual",
  },
  description: "Films and photographs crafted with intention.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior: sahifalar orasida o'tganda Next.js silliq scroll'ni
    // vaqtincha o'chiradi (ichki #havolalarda esa silliq scroll qoladi)
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${serif.variable} ${sans.variable} ${body.variable}`}
    >
      <body>
        <PageLoader />
        <Nav />
        <main>{children}</main>
        <Footer />
        <Reveal />
        <VisitTracker />
      </body>
    </html>
  );
}
