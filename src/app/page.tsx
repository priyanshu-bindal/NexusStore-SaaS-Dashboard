
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { TrustedBy } from "@/components/landing/TrustedBy";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <TrustedBy />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}
