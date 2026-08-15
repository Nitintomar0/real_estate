"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import BackButton from "@/components/BackButton";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const sections = [
    "Acceptance",
    "Services",
    "User Responsibilities",
    "Property Disclaimer",
    "Intellectual Property",
    "Liability",
    "Third Party",
    "Privacy",
    "Termination",
    "Updates",
];

const termDescriptions = [
    "By accessing this website, you agree to comply with all applicable terms and laws.",
    "We provide real estate listings and consultation services with high accuracy.",
    "Users must not misuse or manipulate platform data.",
    "All property listings are subject to change without notice.",
    "All content and branding are owned by Paramshiv Estate.",
    "We are not liable for losses arising from property transactions.",
    "External links are not controlled by us.",
    "Your data is handled securely as per our Privacy Policy.",
    "We may terminate access for misuse.",
    "Terms may change anytime without notice.",
];

export default function TermsPage() {
    const router = useRouter();
    const [active, setActive] = useState(0);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Fade animation
            // 🔥 FIX START
            gsap.set(".fade-up", { opacity: 1, y: 0 });

            gsap.from(".fade-up", {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                clearProps: "all",
            });
            // 🔥 FIX END

            // Scroll progress bar
            gsap.to(progressRef.current, {
                height: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                },
            });

            // Active section highlight
            sections.forEach((_, i) => {
                ScrollTrigger.create({
                    trigger: `.section-${i}`,
                    start: "top center",
                    onEnter: () => setActive(i),
                    onEnterBack: () => setActive(i),
                });
            });

        });

        setTimeout(() => ScrollTrigger.refresh(), 200);

        return () => ctx.revert();
    }, []);

    return (
        <>
        <div className="md:hidden min-h-screen bg-[#080808] px-4 pb-12 pt-24 text-white">
            <BackButton />

            <section className="fade-up rounded-[30px] border border-[#D4AF37]/20 bg-[linear-gradient(145deg,rgba(212,175,55,0.14),rgba(255,255,255,0.04))] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
                    Legal agreement
                </p>
                <h1 className="mt-3 text-4xl font-semibold leading-tight">
                    Terms & <span className="text-[#D4AF37]">Conditions</span>
                </h1>
                <p className="mt-4 text-sm leading-6 text-white/62">
                    These terms define how you interact with Paramshiv Estate.
                    We are committed to transparency, trust, and clarity in every
                    aspect of our services.
                </p>
            </section>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {sections.map((item, i) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => {
                            document
                                .querySelector(`.mobile-section-${i}`)
                                ?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-xs text-white/70"
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div className="mt-5 space-y-3">
                {termDescriptions.map((desc, i) => (
                    <article
                        key={sections[i]}
                        className={`mobile-section-${i} fade-up rounded-[24px] border border-white/10 bg-white/[0.045] p-5`}
                    >
                        <div className="mb-3 flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-sm font-bold text-black">
                                {i + 1}
                            </span>
                            <h2 className="text-lg font-semibold text-[#D4AF37]">
                                {sections[i]}
                            </h2>
                        </div>
                        <p className="text-sm leading-7 text-white/58">
                            {desc} This ensures a safe, transparent, and premium experience
                            for all users interacting with our platform.
                        </p>
                    </article>
                ))}
            </div>

            <div className="fade-up mt-8 rounded-[28px] border border-[#D4AF37]/20 bg-[#111] p-5 text-center">
                <h3 className="text-2xl font-semibold">
                    Need Clarification?
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/55">
                    Our team is always available to help you understand our policies.
                </p>
                <button
                    onClick={() => router.push("/contact")}
                    className="mt-5 rounded-full bg-[#D4AF37] px-7 py-3 font-semibold text-black active:scale-95"
                >
                    Contact Us
                </button>
            </div>
        </div>

        <div className="hidden md:flex bg-[#0B0B0B] text-white min-h-screen">

            <BackButton />

            {/* LEFT SIDEBAR */}
            <div className="hidden md:flex w-64 fixed top-0 left-0 h-screen border-r border-white/10 p-6 flex-col justify-center">

                {/* PROGRESS BAR */}
                <div className="absolute left-0 top-0 w-[2px] h-full bg-white/10">
                    <div
                        ref={progressRef}
                        className="w-full bg-[#D4AF37] h-0"
                    ></div>
                </div>

                <h3 className="text-[#D4AF37] mb-6 text-sm tracking-widest">
                    SECTIONS
                </h3>

                <div className="space-y-4">
                    {sections.map((item, i) => (
                        <p
                            key={i}
                            className={`cursor-pointer text-sm transition ${active === i
                                    ? "text-[#D4AF37] translate-x-2"
                                    : "text-gray-500"
                                }`}
                            onClick={() => {
                                document
                                    .querySelector(`.section-${i}`)
                                    ?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            {item}
                        </p>
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="md:ml-64 w-full px-6 md:px-16 py-16">

                {/* HERO */}
                <div className="max-w-4xl mx-auto text-center mb-20 fade-up">
                    <p className="text-[#D4AF37] tracking-widest text-sm mb-4">
                        LEGAL AGREEMENT
                    </p>

                    <h1 className="text-4xl md:text-6xl font-bold">
                        Terms & <span className="text-[#D4AF37]">Conditions</span>
                    </h1>

                    <p className="text-gray-400 mt-6">
                        These terms define how you interact with Paramshiv Estate.
                        We are committed to transparency, trust, and clarity in every
                        aspect of our services.
                    </p>
                </div>

                {/* SECTIONS */}
                <div className="max-w-4xl mx-auto space-y-16">

                    {termDescriptions.map((desc, i) => (
                        <div
                            key={i}
                            className={`section-${i} fade-up bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-md hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition`}
                        >
                            <h2 className="text-xl font-semibold text-[#D4AF37] mb-4">
                                {i + 1}. {sections[i]}
                            </h2>

                            <p className="text-gray-400 leading-relaxed">
                                {desc} This ensures a safe, transparent, and premium experience
                                for all users interacting with our platform.
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="max-w-3xl mx-auto text-center mt-24 fade-up">
                    <h3 className="text-2xl font-semibold mb-4">
                        Need Clarification?
                    </h3>

                    <p className="text-gray-400 mb-6">
                        Our team is always available to help you understand our policies.
                    </p>

                    <button
                        onClick={() => router.push("/contact")}
                        className="px-8 py-3 rounded-full bg-[#D4AF37] text-black font-semibold hover:scale-105 transition"
                    >
                        Contact Us
                    </button>
                </div>

            </div>
        </div>
        </>
    );
}
