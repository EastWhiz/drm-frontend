import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import { WishlistProvider } from "@/context/WishlistContext";

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans", 
});

export const metadata: Metadata = {
  title: "Doctor Report | Doctor Report Generator",
  description: "Generated Report of any Doctor.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jost.variable} font-sans antialiased`}>
        <WishlistProvider>
          <Header />
          {children}
        </WishlistProvider>
      </body>
    </html>
  );
}
