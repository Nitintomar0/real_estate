"use client";

import BackButton from "@/components/BackButton";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useRouter } from "next/navigation";

const privacySections = [
  {
    title: "1. Information We Collect",
    body: "We collect personal information such as your name, email address, phone number, and property preferences when you interact with our website, fill out forms, or contact our team. Additionally, we may collect technical data such as browser type, device information, and usage patterns.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used to provide tailored property recommendations, respond to your inquiries, improve our services, and enhance your overall experience. We ensure all communications are relevant and beneficial to you.",
  },
  {
    title: "3. Data Protection & Security",
    body: "We use industry-standard encryption, secure servers, and strict access controls to protect your personal data from unauthorized access, misuse, or disclosure. Your trust is the foundation of our business.",
  },
  {
    title: "4. Sharing of Information",
    body: "We do not sell, rent, or trade your personal information. Data is only shared when necessary to provide services or comply with legal obligations.",
  },
  {
    title: "5. Cookies & Tracking",
    body: "We use cookies to improve website performance, analyze traffic, and deliver a personalized browsing experience. You can control cookie settings through your browser preferences.",
  },
  {
    title: "6. Your Rights",
    body: "You have the right to access, update, or request deletion of your personal data at any time. You can contact us directly for any privacy-related requests.",
  },
  {
    title: "7. Updates to This Policy",
    body: "This policy may be updated periodically to reflect changes in our services or legal requirements. We encourage users to review this page regularly.",
  },
];

export default function Privacy() {
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-up", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });
    });

    setTimeout(() => {
      ScrollTrigger.refresh(); // 🔥 IMPORTANT FIX
    }, 200);

    return () => ctx.revert(); // cleanup
  }, []);

  return (
    <>
      <div className="md:hidden min-h-screen bg-[#080808] px-4 pb-12 pt-24 text-white">
        <BackButton />

        <section className="fade-up rounded-[30px] border border-[#D4AF37]/20 bg-[linear-gradient(145deg,rgba(212,175,55,0.14),rgba(255,255,255,0.04))] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
            Legal information
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight">
            Privacy <span className="text-[#D4AF37]">Policy</span>
          </h1>
          <p className="mt-4 text-sm leading-6 text-white/62">
            At Paramshiv Estate, your privacy is our priority. We are committed to
            safeguarding your personal information while delivering a seamless and
            personalized real estate experience. This policy explains how we collect,
            use, and protect your data.
          </p>
        </section>

        <div className="mt-6 space-y-3">
          {privacySections.map((section) => (
            <article
              key={section.title}
              className="fade-up rounded-[24px] border border-white/10 bg-white/[0.045] p-5"
            >
              <h2 className="text-lg font-semibold leading-snug text-[#D4AF37]">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/58">
                {section.body}
              </p>
            </article>
          ))}
        </div>

        <div className="fade-up mt-6 rounded-[28px] border border-[#D4AF37]/20 bg-[#111] p-5 text-center">
          <h3 className="text-2xl font-semibold text-[#D4AF37]">
            Your Trust Matters
          </h3>
          <p className="mt-3 text-sm leading-6 text-white/58">
            At Paramshiv Estate, we don’t just build properties — we build trust.
            Your data is handled with complete transparency, integrity, and care.
          </p>
        </div>

        <div className="fade-up mt-8 text-center">
          <h3 className="text-2xl font-semibold">
            Have Questions About Your Data?
          </h3>
          <p className="mt-3 text-sm leading-6 text-white/55">
            Feel free to contact us anytime. We’re here to help you with full transparency.
          </p>
          <button
            onClick={() => {
              router.push("/contact");
              window.scrollTo({ top: 0 });
            }}
            className="mt-5 rounded-full bg-[#D4AF37] px-7 py-3 font-semibold text-black active:scale-95"
          >
            Contact Us
          </button>
        </div>
      </div>

    <div className="hidden md:block bg-[#0B0B0B] text-white min-h-screen px-6 md:px-16 py-10 relative overflow-hidden">

      {/* BACK BUTTON */}
      <BackButton />

      {/* HERO */}
      <div className="max-w-5xl mx-auto text-center mb-16 fade-up">
        <p className="text-[#D4AF37] tracking-widest text-sm mb-4">
          LEGAL INFORMATION
        </p>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Privacy <span className="text-[#D4AF37]">Policy</span>
        </h1>

        <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
          At Paramshiv Estate, your privacy is our priority. We are committed to
          safeguarding your personal information while delivering a seamless and
          personalized real estate experience. This policy explains how we collect,
          use, and protect your data.
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto space-y-12">

        {/* SECTION */}
        <div className="fade-up bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-[#D4AF37] mb-3">
            1. Information We Collect
          </h2>
          <p className="text-gray-400 leading-relaxed">
            We collect personal information such as your name, email address, phone
            number, and property preferences when you interact with our website,
            fill out forms, or contact our team. Additionally, we may collect
            technical data such as browser type, device information, and usage patterns.
          </p>
        </div>

        {/* SECTION */}
        <div className="fade-up bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-[#D4AF37] mb-3">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Your information is used to provide tailored property recommendations,
            respond to your inquiries, improve our services, and enhance your overall
            experience. We ensure all communications are relevant and beneficial to you.
          </p>
        </div>

        {/* SECTION */}
        <div className="fade-up bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-[#D4AF37] mb-3">
            3. Data Protection & Security
          </h2>
          <p className="text-gray-400 leading-relaxed">
            We use industry-standard encryption, secure servers, and strict access
            controls to protect your personal data from unauthorized access, misuse,
            or disclosure. Your trust is the foundation of our business.
          </p>
        </div>

        {/* SECTION */}
        <div className="fade-up bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-[#D4AF37] mb-3">
            4. Sharing of Information
          </h2>
          <p className="text-gray-400 leading-relaxed">
            We do not sell, rent, or trade your personal information. Data is only
            shared when necessary to provide services or comply with legal obligations.
          </p>
        </div>

        {/* SECTION */}
        <div className="fade-up bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-[#D4AF37] mb-3">
            5. Cookies & Tracking
          </h2>
          <p className="text-gray-400 leading-relaxed">
            We use cookies to improve website performance, analyze traffic, and deliver
            a personalized browsing experience. You can control cookie settings through
            your browser preferences.
          </p>
        </div>

        {/* SECTION */}
        <div className="fade-up bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-[#D4AF37] mb-3">
            6. Your Rights
          </h2>
          <p className="text-gray-400 leading-relaxed">
            You have the right to access, update, or request deletion of your personal
            data at any time. You can contact us directly for any privacy-related requests.
          </p>
        </div>

        {/* SECTION */}
        <div className="fade-up bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-[#D4AF37] mb-3">
            7. Updates to This Policy
          </h2>
          <p className="text-gray-400 leading-relaxed">
            This policy may be updated periodically to reflect changes in our services
            or legal requirements. We encourage users to review this page regularly.
          </p>
        </div>

        <div className="fade-up bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-xl p-8 mt-16 text-center">
          <h3 className="text-2xl font-semibold text-[#D4AF37] mb-3">
            Your Trust Matters
          </h3>
          <p className="text-gray-400 max-w-xl mx-auto">
            At Paramshiv Estate, we don’t just build properties — we build trust.
            Your data is handled with complete transparency, integrity, and care.
          </p>
        </div>

      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto mt-20 text-center fade-up">
        <h3 className="text-2xl font-semibold mb-4">
          Have Questions About Your Data?
        </h3>

        <p className="text-gray-400 mb-6">
          Feel free to contact us anytime. We’re here to help you with full transparency.
        </p>

        <button
          onClick={() => {
            router.push("/contact");
            window.scrollTo({ top: 0 });
          }}
          className="px-8 py-3 rounded-full bg-[#D4AF37] text-black font-semibold hover:scale-105 transition"

        >
          Contact Us

        </button>

      </div>

    </div>
    </>
  );
}
