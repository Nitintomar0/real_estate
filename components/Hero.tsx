"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(bgRef.current, {
      scale: 1.2,
      scrollTrigger: {
        trigger: bgRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section className="h-screen relative isolate flex items-center justify-center text-center overflow-hidden">
      {/* Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center brightness-[1.15] contrast-[1.08] saturate-[1.15]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30"></div>

      {/* Content */}
      <div className="relative z-[1] px-4 translate-y-12">

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.9)]"
        >
          Find Your Dream{" "}
          <span className="text-[#D4AF37] drop-shadow-[0_6px_20px_rgba(0,0,0,0.9)]">
            Luxury Home
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-6 text-lg text-white max-w-2xl mx-auto drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]"
        >
          Discover premium properties that define luxury, comfort, and elegance.
        </motion.p>

        <motion.button
          onClick={() => {
            const section = document.getElementById("featured-section");
            section?.scrollIntoView({ behavior: "smooth" });
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-6 px-8 py-3 bg-[#D4AF37] text-black rounded-xl font-semibold hover:scale-105 hover:shadow-[0_0_20px_#D4AF37] transition"
        >
          Residential Properties
        </motion.button>

      </div>
    </section>
  );
}