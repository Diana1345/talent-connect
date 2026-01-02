import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <footer className="border-t border-border/50 py-8 bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © 2024 AI VidCV. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
