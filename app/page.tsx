"use client";

import MobileHome from "@/components/MobileHome";
import LuxuryNavbar from "@/components/LuxuryNavbar";
import Hero from "@/components/Hero";
import Featured from "@/components/Featured";
import WhyChooseUs from "@/components/WhyChooseUs";
import CTA from "@/components/CTA";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import LeadPopup from "@/components/LeadPopup";
import { useState } from "react";
import { useEffect } from "react";

export default function Home() {
  
  
      return (
  <>
    {/* MOBILE */}
    <div className="block md:hidden">
      <MobileHome />
    </div>

    {/* DESKTOP */}
    <div className="hidden md:block">
      <LuxuryNavbar />
      <Hero />
      <Featured />
      <WhyChooseUs />
      <ContactForm />
      <CTA />
      <Footer />
    </div>

  
  </>
);
}