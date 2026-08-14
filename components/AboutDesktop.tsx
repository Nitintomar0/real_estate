"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
// import Lenis from "@studio-freight/lenis";
import Footer from "@/components/Footer";
gsap.registerPlugin(ScrollTrigger);
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);
import { useRouter } from "next/navigation";
import { useState } from "react";
import LeadPopup from "@/components/LeadPopup";
import FloatingContact from "@/components/FloatingContact";
import LuxuryNavbar from "@/components/LuxuryNavbar";
export default function About() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [popupOpen, setPopupOpen] = useState(false);


  useEffect(() => {
    ScrollTrigger.clearMatchMedia();
    ScrollTrigger.getAll().forEach(t => t.kill());
    ScrollTrigger.clearMatchMedia();
    ScrollTrigger.refresh(true);
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
    const ctx = gsap.context(() => {
      // NEW HERO ANIMATION
      gsap.from(".about-hero-text", {
        opacity: 0,
        x: -80,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".about-hero-img", {
        opacity: 0,
        x: 80,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });

      // NEW VISION ANIMATION
      // PATH DRAW ANIMATION
      gsap.from(".path", {
        strokeDasharray: 500,
        strokeDashoffset: 500,
        duration: 2,
        ease: "power2.out",
      });

      // DRAW ANIMATION
      gsap.from(".shape-path", {
        strokeDasharray: 500,
        strokeDashoffset: 500,
        duration: 2,
        ease: "power2.out",
      });

      // MOVING BOX


      // SLOW ROTATION (premium feel)
      gsap.to(".luxury-shape", {
        rotate: 360,
        duration: 40,
        repeat: -1,
        ease: "linear",
        transformOrigin: "center",
      });
      //     <path
      //       id="motionPath"
      //       className="shape-path"
      //       d="
      // M40,100
      // C40,40 160,40 160,100
      // C160,160 40,160 40,100
      // Z
      // M70,100
      // C70,70 130,70 130,100
      // C130,130 70,130 70,100
      // Z
      // "
      //       fill="none"
      //       stroke="#E5D3A3"
      //       strokeWidth="1.5"
      //     />
      // BOX MOVING ALONG PATH
      gsap.to(".moving-box", {
        motionPath: {
          path: "#motionPath",
          align: "#motionPath",
          alignOrigin: [0.5, 0.5],
        },
        duration: 20,
        ease: "none",
        repeat: -1,
      });
      gsap.from("#motionPath", {
        strokeDasharray: 500,
        strokeDashoffset: 500,
        duration: 2,
        ease: "power2.out",
      });



      // STORY TEXT ANIMATION
      gsap.from(".story-text", {
        opacity: 0,
        y: 100,
        duration: 1,
        scrollTrigger: {
          trigger: ".story-text",
          start: "top 80%",
        },
      });

      // IMAGE PARALLAX
      gsap.to(".story-img img", {
        y: -80,
        scrollTrigger: {
          trigger: ".story-img",
          scrub: true,
        },
      });
      // FOUNDER REVEAL
      gsap.from(".founder-card", {
        opacity: 0,
        y: 120,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".founder-card",
          start: "top 80%",
        },
      });

      // HOVER LIFT EFFECT
      gsap.utils.toArray(".founder-card").forEach((card: any) => {

        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -10, scale: 1.03, duration: 0.3 });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, scale: 1, duration: 0.3 });
        });
      });
      // STAGGER ENTRY
      gsap.from(".why-card", {
        opacity: 0,
        y: 100,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".why-card",
          start: "top 85%",
        },
      });

      // FLOATING LOOP (PREMIUM FEEL)
      gsap.utils.toArray(".why-card").forEach((card: any, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? -10 : 10,
          duration: 2 + i,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });






      // ===== TRUE INFINITE LOOP PINNING =====


      const panels = gsap.utils.toArray<HTMLElement>(".panel");
      // <div className="absolute inset-0 bg-black/40"></div>
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          end: "+=25%", // 🔥 FIXED
          pin: true,
          pinSpacing: true,
        });

        // 👇 ADD PREMIUM TRANSITION
        if (i !== panels.length - 1) {
          gsap.to(panel, {
            opacity: 0,
            filter: "blur(12px)",
            scale: 0.9,
            ease: "power2.out",
            duration: 0.8,
            scrollTrigger: {
              trigger: panel,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });

      gsap.from(".founder-content", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".founder-content",
          start: "top 80%",
        },
      });
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    });
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };

  }, []);

  return (

    <div className="bg-[#0B0B0B] text-white min-h-screen">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#D4AF37]/10 blur-[120px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-[#D4AF37]/10 blur-[120px]"></div>
      </div>
      <LuxuryNavbar />


      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center px-6 md:px-20 pt-28 bg-[#0B0B0B]">

        <div className="grid md:grid-cols-2 gap-16 items-center w-full">

          {/* LEFT CONTENT */}
          <div className="about-hero-text">

            <p className="text-[#D4AF37] mb-4 tracking-widest uppercase text-sm">
              About Paramshiv Estate
            </p>

            <h1
              ref={titleRef}
              className="text-4xl md:text-6xl font-bold leading-tight"
            >
              Crafting Spaces <br /> That Define Luxury
            </h1>

            <p
              ref={subtitleRef}
              className="mt-6 text-gray-400 text-lg max-w-lg"
            >
              We are redefining real estate by delivering premium properties
              that combine elegance, comfort, and timeless design.
            </p>

          </div>

          {/* RIGHT IMAGE */}
          <div className="about-hero-img relative overflow-hidden rounded-xl">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
              className="w-full h-[500px] object-cover"
            />

            {/* subtle overlay */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

        </div>

      </section>
      <section className="py-40 px-6 md:px-20 bg-[#0A0A0A] overflow-hidden">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="gsap-left">

            <h2 className="text-5xl md:text-7xl font-semibold leading-tight">
              <span className="bg-gradient-to-r from-[#F5B841] to-[#D4AF37] bg-clip-text text-transparent">
                Elevate Your
              </span>
              <br />
              <span className="text-white">Luxury Experience</span>
            </h2>

            <p className="mt-6 text-gray-400 max-w-md">
              Discover premium real estate with seamless technology,
              curated listings, and unmatched elegance.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 border border-[#D4AF37] rounded-full text-white hover:bg-[#D4AF37] hover:text-black transition"
              >
                Explore
              </button>

              <button
                onClick={() => router.push("/contact")}
                className="px-6 py-3 bg-[#D4AF37] rounded-full text-black"
              >
                Contact
              </button>
            </div>

          </div>

          {/* RIGHT (SVG AREA) */}
          <div className="flex justify-center items-center">

            <div className="relative w-[420px] h-[420px]">

              <svg
                id="svg-stage"
                viewBox="-4 -4 110 110"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="grad-1" x1="-4" y1="-4" x2="9" y2="9">
                    <stop offset="0.2" stopColor="rgb(255,135,9)" />
                    <stop offset="0.5" stopColor="rgb(247,189,248)" />
                  </linearGradient>
                </defs>

                {/* MAIN SHAPE */}
                <path
                  id="motionPath"
                  d="M50.5 50.5h50v50s-19.2 1.3-37.2-16.7S56 35.4 35.5 15.5C18.5-1 .5.5.5.5v50h50s25.6-.6 38-18 12-32 12-32h-50v100H.5S.2 80.7 11.8 68.2 40 49.7 50.5 50.5Z"
                  stroke="rgb(250,225,225)"
                  strokeWidth="1.5"
                  fill="none"
                />

                {/* MOVING BOX */}
                <rect
                  className="moving-box"
                  width="6"
                  height="6"
                  x="-3"
                  y="-3"
                  rx="1.5"
                  fill="url(#grad-1)"
                />
              </svg>

            </div>

          </div>

        </div>

      </section>
      <section className="founder-section bg-black text-white relative">
        {/* PANEL 1 */}
        <div className="panel h-screen flex items-center justify-center px-10">

          <div className="founder-card mx-auto max-w-[1200px] w-full">

            {/* IMAGE */}
            <div className="founder-image">
              <img src="ravi.png" />
            </div>

            {/* CONTENT */}
            <div className="founder-content">
              <span className="founder-role">Founder & Visionary</span>
              <h2 className="founder-name">Ravi Jadon</h2>
              <p className="founder-desc">
                With over a decade of experience in the real estate industry, Ravi Jadon leads Paramshiv Estate with a clear vision of delivering trust, quality, and excellence. His deep market expertise and client-first approach have helped shape premium property experiences, ensuring every project reflects integrity, precision, and long-term value.
              </p>
              <p className="founder-desc">
                Bringing over 10 years of expertise in the real estate sector, Ravi Jadon is the driving force behind Paramshiv Estate. Known for his strategic vision and commitment to excellence, he has built a reputation for delivering premium properties with trust, transparency, and unmatched quality in every detail.
              </p>
            </div>

          </div>

        </div>

        {/* PANEL 2 */}
        <div className="panel h-screen flex items-center justify-center px-10">

          <div className="founder-card reverse">

            <div className="founder-image">
              <img src="uday.png" />
            </div>

            <div className="founder-content">
  <span className="founder-role">Sales Head</span>
  <h2 className="founder-name">Uday</h2>

  <p className="founder-desc">
    At the heart of every successful real estate journey is the right
    understanding, the right opportunity, and the right guidance. Uday
    leads the sales vision at Paramshiv Estate with a sharp focus on
    connecting people with properties that truly match their aspirations.
  </p>

  <p className="founder-desc">
    With a strong understanding of the market and a relationship-driven
    approach, he transforms every client interaction into a seamless
    experience. From identifying high-value opportunities to guiding
    clients through important decisions, Uday brings energy, strategy,
    and a commitment to delivering results that go beyond just closing
    a deal — creating lasting confidence and value.
  </p>
</div>

          </div>

        </div>

        {/* PANEL 3 */}
        <div className="panel h-screen flex items-center justify-center px-10">

          <div className="founder-card">

            <div className="founder-image">
              <img src="https://res.cloudinary.com/dbl5y5rvh/image/upload/v1779716191/nitin_uoi9bn.png" />
            </div>

            <div className="founder-content">
              <span className="founder-role">Digital & Technology Lead</span>
              <h2 className="founder-name">Nitin Tomar</h2>
              <p className="founder-desc">
                Leading the digital vision of Paramshiv Estate, Nitin oversees website development, application systems, and the complete technology ecosystem. Focused on creating seamless, high-performance platforms, he ensures every digital interaction reflects the same level of precision, innovation, and luxury as the properties themselves.
              </p>
            </div>

          </div>

        </div>

      </section>

      <section className="py-32 px-6 md:px-20 bg-[#0B0B0B]">

        <h2 className="text-3xl md:text-5xl text-center text-[#D4AF37] mb-20">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {/* CARD 1 */}
          <div className="why-card p-8 bg-[#111] rounded-xl border border-white/10 text-center">
            <div className="text-[#D4AF37] text-4xl mb-4">🏡</div>
            <h3 className="text-xl mb-2">Exclusive Properties</h3>
            <p className="text-gray-400 text-sm">
              Carefully curated listings in prime locations.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="why-card p-8 bg-[#111] rounded-xl border border-white/10 text-center">
            <div className="text-[#D4AF37] text-4xl mb-4">🤝</div>
            <h3 className="text-xl mb-2">Trusted Network</h3>
            <p className="text-gray-400 text-sm">
              Verified properties with complete transparency.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="why-card p-8 bg-[#111] rounded-xl border border-white/10 text-center">
            <div className="text-[#D4AF37] text-4xl mb-4">✨</div>
            <h3 className="text-xl mb-2">Personalized Experience</h3>
            <p className="text-gray-400 text-sm">
              Tailored solutions for your dream lifestyle.
            </p>
          </div>

        </div>

      </section>

      <section
        id="book-slot"
        className="cta-section py-40 px-6 md:px-20 bg-[#0A0A0A] text-center relative"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-[#D4AF37]/10 blur-3xl"></div>

        <div className="relative z-10 max-w-3xl mx-auto">

          <h2 className="cta-title text-3xl md:text-5xl font-semibold text-[#D4AF37] mb-6">
            Let’s Find Your Dream Property
          </h2>

          <p className="cta-sub text-gray-400 mb-10">
            Connect with us and explore exclusive luxury spaces crafted just for you.
          </p>

          <button
            onClick={() => setPopupOpen(true)}
            className="cta-btn group px-10 py-4 border border-[#D4AF37] text-[#D4AF37] rounded-full relative overflow-hidden"
          >
            <span className="relative">Get in Touch</span>
            <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition duration-500"></span>
          </button>

        </div>


      </section>
      <FloatingContact setPopupOpen={setPopupOpen} />
      <LeadPopup isOpen={popupOpen} setIsOpen={setPopupOpen} />
      {/* FOOTER */}
      <Footer />
    </div>
  );
}