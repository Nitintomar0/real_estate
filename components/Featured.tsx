"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import PropertyCard from "./PropertyCard";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { properties } from "@/components/data/properties";

export default function Featured() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".property-card", {
        opacity: 0,
        y: 80,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    });

    return () => {
      ctx.revert(); // 🔥 VERY IMPORTANT (fixes your bug)
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-6 bg-[#0B0B0B] text-white"
    >
      {[
  { title: "Residential", key: "highrise" },

  { title: "Commercial", key: "commercial" },

  { title: "Villas", key: "villa" },

  { title: "Builder Floor", key: "builder" },

  { title: "Freehold", key: "freehold" },

  { title: "Plots", key: "plot" },

  { title: "Farm House", key: "farmhouse" },
].map((section, index) => {
        const filtered = properties.filter(
          (p) => p.category === section.key
        );

        if (filtered.length === 0) return null;

        return (
          <div
            key={index}
            className="mb-16"
            id={
  section.key === "highrise"
    ? "featured-section"
    : section.key === "commercial"
    ? "commercial-section"
    : ""
}
          >
            <h2 className="text-3xl font-bold mb-8 text-[#D4AF37]">
              {section.title}
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filtered.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={{
                    ...p,
                    image: p.images[0],
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}