import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { BackgroundGlow } from "@/components/background-glow";
import { Navbar } from "@/components/navbar";
import { BannerRotativo } from "@/components/banner-rotativo";
import { Footer } from "@/components/footer";
import { FloatingSocials } from "@/components/floating-socials";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tesla Computación | Tu próxima PC",
  description:
    "Service técnico y armador de PCs gamer en Barrio Constituyentes, Santa Fe Capital. Armado a medida, upgrades, service de GPU y PlayStation 5, notebooks gaming y componentes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <BackgroundGlow />
          <BannerRotativo />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingSocials />
          <Toaster theme="dark" position="top-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
