"use client";

import AboutMobile from "@/components/AboutMobile";
import AboutDesktop from "@/components/AboutDesktop";

export default function AboutPage() {
  return (
    <>
      {/* MOBILE */}
      <div className="block md:hidden">
        <AboutMobile />
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <AboutDesktop />
      </div>
    </>
  );
}