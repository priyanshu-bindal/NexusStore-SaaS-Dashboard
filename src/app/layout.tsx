import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/components/Providers";
import CartSheet from "@/components/cart/CartSheet";
import AuthModal from "@/components/auth/AuthModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shopystore Landing Page",
  description: "Next.js e-commerce application",
  icons: {
    icon: "/icon.png",
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

        <Providers>
          {children}
          <CartSheet />
          <AuthModal />
        </Providers>
      </body>
    </html>
  );
}