import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { ServiceHighlights } from "@/components/landing/service-highlights"
import { StatsSection } from "@/components/landing/stats-section"
import { FooterSection } from "@/components/landing/footer-section"

export default function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {" "}
        {/* Added padding-top to account for fixed header */}
        <HeroSection />
        <ServiceHighlights />
        <StatsSection />
      </main>
      <FooterSection />
    </div>
  )
}
