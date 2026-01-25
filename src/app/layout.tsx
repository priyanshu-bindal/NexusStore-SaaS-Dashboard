import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartSheet from "@/components/cart/CartSheet";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexusStore Landing Page",
  description: "Built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background-light text-[#111318] transition-colors duration-200`}
      >
        <CartProvider>
          {children}
          <CartSheet />
        </CartProvider>
      </body>
    </html>
  );
}
