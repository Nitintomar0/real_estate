"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import { Phone, Mail, MapPin } from "lucide-react";
export default function Footer() {
  const router = useRouter();
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-item", {
  opacity: 0,
  y: 40,
  stagger: 0.15,
  duration: 0.8,
  ease: "power3.out",
  clearProps: "transform",
});
    });

    return () => ctx.revert(); // 🔥 fixes navigation bug
  }, []);

  return (

    <footer className="relative z-[1] bg-[#0B0B0B] text-white border-t border-white/10">


      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-12">

        {/* BRAND */}
        <div className="footer-item">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4 tracking-wide">
            Paramshiv Estate
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Discover premium properties crafted for luxury living.
            We help you find your dream home with elegance, comfort, and trust.
          </p>
        </div>

        {/* NAVIGATION */}
        <div className="footer-item">
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <div className="flex flex-col gap-2 text-gray-400 text-sm">
            <p
              onClick={() => {
                router.push("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="cursor-pointer hover:text-[#D4AF37] transition"
            >
              Home
            </p>

            <p
              onClick={() => router.push("/about")}
              className="cursor-pointer hover:text-[#D4AF37] transition"
            >
              About
            </p>

            <p
              onClick={() => router.push("/contact")}
              className="cursor-pointer hover:text-[#D4AF37] transition"
            >
              Contact
            </p>
          </div>
        </div>

        {/* LEGAL (SEO IMPORTANT) */}
        <div className="footer-item">
          <h3 className="text-lg font-semibold mb-4">Legal</h3>
          <div className="flex flex-col gap-2 text-gray-400 text-sm">
            <span onClick={() => router.push("/privacy")} className="cursor-pointer hover:text-[#D4AF37] transition-all duration-300 hover:translate-x-1">Privacy Policy</span>
            <span onClick={() => router.push("/terms")} className="cursor-pointer hover:text-[#D4AF37] transition-all duration-300 hover:translate-x-1">Terms & Conditions</span>
          </div>
        </div>

      
        {/* CONTACT */}
<div className="footer-item">
  <h3 className="text-lg font-semibold mb-5">Contact</h3>

  <div className="space-y-4 text-sm">

    {/* Phone */}
    <div className="flex items-center gap-3">
      <span className="text-[#D4AF37]">📞</span>
      <p className="text-gray-400 hover:text-[#D4AF37] transition">
        +91 98182 23111 <span className="mx-2 text-gray-600">|</span> +91 73038 12111
      </p>
    </div>

    {/* Email */}
    <div className="flex items-center gap-3">
      <span className="text-[#D4AF37]">✉</span>
      <p className="text-gray-400 hover:text-[#D4AF37] transition break-all">
        paramshivrealty111@gmail.com
      </p>
    </div>

    {/* Address */}
    <div className="flex items-start gap-3">
      <span className="text-[#D4AF37] mt-1">📍</span>

      <div className="text-gray-400 leading-6">
        <p>
          Office No. 1111, 11th Floor
        </p>

        <p>
          Fusion Ufairia Mall, Ek Murti Chowk
        </p>

        <p>
          Greater Noida West, Uttar Pradesh
        </p>
      </div>
    </div>

  </div>
</div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 text-center py-6 text-gray-500 text-sm tracking-wide">
        © 2026 Paramshiv Estate. All rights reserved.
      </div>

    </footer>
  );
}