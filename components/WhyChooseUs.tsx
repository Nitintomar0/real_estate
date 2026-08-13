"use client";

import { useEffect, useRef } from "react";
import { Shield, Star, MapPin, BadgeCheck, Phone, Scale } from "lucide-react";
import gsap from "gsap";
import Tilt from "react-parallax-tilt";

const features = [
    {
        icon: <Star size={26} />,
        title: "Exclusive Listings",
        desc: "Ultra-luxury curated villas & premium properties.",
    },
    {
        icon: <Shield size={26} />,
        title: "Trusted Agents",
        desc: "Verified professionals with deep expertise.",
    },
    {
        icon: <MapPin size={26} />,
        title: "Prime Locations",
        desc: "Only high-growth and elite locations selected.",
    },
    {
        icon: <BadgeCheck size={26} />,
        title: "Best Deals",
        desc: "We negotiate top value for your investment.",
    },
    {
        icon: <Scale size={26} />,
        title: "Legal Support",
        desc: "Complete documentation & verification help.",
    },
    {
        icon: <Phone size={26} />,
        title: "24/7 Support",
        desc: "Always available for your queries.",
    },
];

export default function WhyChooseUs() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;

        const animation = gsap.to(el, {
            xPercent: -50,
            ease: "none",
            duration: 25,
            repeat: -1,
        });

        // Pause on hover (premium feel)
        el?.addEventListener("mouseenter", () => animation.pause());
        el?.addEventListener("mouseleave", () => animation.play());

    }, []);

    return (
        <section className="pt-36 pb-28 bg-[#0B0B0B] overflow-hidden">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                Why Choose Us
            </h2>

            <div className="overflow-visible mt-10">
                <div
                    ref={containerRef}
                    className="flex gap-10 w-max px-10"
                >
                    {[...features, ...features].map((item, i) => (
                        <Tilt
                            key={i}
                            tiltMaxAngleX={8}
                            tiltMaxAngleY={8}
                            scale={1.02} // 🔥 reduced (important)
                            transitionSpeed={1500}
                        >
                            <div className="group min-w-[300px] relative p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-xl transition-all duration-500 ease-out hover:border-[#D4AF37] hover:-translate-y-3 overflow-hidden">

                                {/* Glow */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.25),transparent_70%)]"></div>

                                {/* INNER CONTENT (controlled zoom) */}
                                <div className="relative z-10 transition-transform duration-500 group-hover:scale-[1.03]">

                                    {/* Icon */}
                                    <div className="mb-4 text-[#D4AF37]">
                                        {item.icon}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold mb-2 text-white">
                                        {item.title}
                                    </h3>

                                    {/* Desc */}
                                    <p className="text-gray-400 text-sm">
                                        {item.desc}
                                    </p>

                                </div>

                            </div>
                        </Tilt>
                    ))}
                </div>
            </div>
        </section>
    );
}