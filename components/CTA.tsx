"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".cta-content", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".cta-content",
          start: "top 80%",
        },
      });
    });

    return () => ctx.revert(); // 🔥 IMPORTANT
  }, []);

  return (
    <section
  ref={sectionRef}
  className="relative py-32 flex items-center justify-center text-center"
>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c')",
        }}
      ></div>

      {/* Overlay */}
      <div className="cta-content absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-[1] px-6">
        <h2 className="text-4xl md:text-5xl font-bold">
          Ready to Find Your{" "}
          <span className="text-[#D4AF37]">Dream Home?</span>
        </h2>

        <p className="text-gray-300 mt-4 max-w-xl mx-auto">
          Let us help you discover the finest properties tailored to your lifestyle.
        </p>

        <button
          onClick={() => router.push("/contact")}
          className="mt-6 px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:scale-105 transition"
        >
          Contact Us
        </button>
      </div>
    </section>
  );
}