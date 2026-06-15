import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import LegalTopics from "@/app/components/LegalTopics";
import HowItWorks from "@/app/components/HowItWorks";
import InquiryForm from "@/app/components/InquiryForm";
import FAQ from "@/app/components/FAQ";
import Resources from "@/app/components/Resources";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LegalTopics />
        <HowItWorks />
        <InquiryForm />
        <FAQ />
        <Resources />
      </main>
      <Footer />
    </>
  );
}
