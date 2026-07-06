import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VehicleTypes from "@/components/VehicleTypes";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import TargetCustomers from "@/components/TargetCustomers";
import DownloadCTA from "@/components/DownloadCTA";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <VehicleTypes />
        <HowItWorks />
        <Features />
        <TargetCustomers />
        <DownloadCTA />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
