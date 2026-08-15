"use client";

import { motion } from "framer-motion";
import {
  Dumbbell,
  ShieldCheck,
  Trees,
  Waves,
  Building2,
  ParkingCircle,
  Gamepad2,
  Baby,
  Sparkles,
  Landmark,
} from "lucide-react";

import ScheduleVisit from "@/components/ScheduleVisit";
import MobilePropertyDetails from "@/components/mobile/MobilePropertyDetails";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function FarmHouseLayout({ property }: any) {
  const featureIcons: any = {
    clubhouse: <Building2 size={28} />,
    swimming: <Waves size={28} />,
    pool: <Waves size={28} />,
    gym: <Dumbbell size={28} />,
    fitness: <Dumbbell size={28} />,
    security: <ShieldCheck size={28} />,
    landscaped: <Trees size={28} />,
    green: <Trees size={28} />,
    garden: <Trees size={28} />,
    kids: <Baby size={28} />,
    games: <Gamepad2 size={28} />,
    parking: <ParkingCircle size={28} />,
    premium: <Sparkles size={28} />,
    senior: <Landmark size={28} />,
  };

  const sectionRef = useRef(null);
  const afterRef = useRef(null);
  const afterImgRef = useRef(null);

  const [visitOpen, setVisitOpen] = useState(false);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const [showGallery, setShowGallery] = useState(false);
  const [index, setIndex] = useState(0);

  const handleTouchStart = (e: any) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: any) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      setIndex((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }

    if (touchEnd - touchStart > 50) {
      setIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const section = sectionRef.current;
    const after = afterRef.current;
    const afterImg = afterImgRef.current;

    if (!section || !after || !afterImg) return;

    ScrollTrigger.getAll().forEach((t) => t.kill());

    gsap.set(after, { xPercent: 100 });
    gsap.set(afterImg, { xPercent: -100 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=150%",
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    });

    tl.to(after, { xPercent: 0 }).to(afterImg, { xPercent: 0 }, 0);

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [property.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [property.id]);

  if (!property) {
    return (
      <div className="text-white p-10">
        Property Not Found
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-[#0B0B0B] text-white"
      >
        {/* HERO */}
        <div className="relative h-[60vh] md:h-[90vh]">

          {/* BACK BUTTON */}
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => window.history.back()}
              className="bg-black/50 backdrop-blur px-3 py-2 rounded-lg text-sm"
            >
              ← Back
            </button>
          </div>

          {/* HERO IMAGE */}
          <div className="relative w-full h-full">
            <img
              src={property.images[index]}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-500"
            />

            {/* LEFT BUTTON */}
            <button
              onClick={() => {
                setIndex((prev) =>
                  prev === 0
                    ? property.images.length - 1
                    : prev - 1
                );
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 px-3 py-2 rounded-lg text-2xl"
            >
              ‹
            </button>

            {/* RIGHT BUTTON */}
            <button
              onClick={() => {
                setIndex((prev) =>
                  prev === property.images.length - 1
                    ? 0
                    : prev + 1
                );
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 px-3 py-2 rounded-lg text-2xl"
            >
              ›
            </button>
          </div>

          {/* HERO OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

          {/* HERO CONTENT */}
          <div className="absolute bottom-6 left-4 md:left-10 max-w-4xl">

            <p className="text-sm text-gray-300 mb-2">
              Premium Farm House
            </p>

            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-5xl font-bold leading-tight"
            >
              {property.title}
            </motion.h1>

            <p className="text-gray-300 mt-3">
              📍 {property.location}
            </p>

            <p className="text-[#D4AF37] text-2xl mt-3 font-semibold">
              {property.price}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full">
                Verified Property
              </span>

              {property.possession && (
                <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                  {property.possession}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

          {/* LEFT CONTENT */}
          <div className="md:col-span-2">

            {/* HIGHLIGHTS */}
            <div className="flex flex-wrap gap-6 text-gray-300 border-b border-gray-800 pb-6">

              {property.beds && (
                <span>🛏 {property.beds}</span>
              )}

              {property.baths && (
                <span>🛁 {property.baths} Bathrooms</span>
              )}

              {property.area && (
                <span>📐 {property.area}</span>
              )}

              <span>🌿 Premium Farm Living</span>
            </div>

            {/* GALLERY */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
              {property.images?.map(
                (img: string, i: number) => (
                  <motion.img
                    key={i}
                    src={img}
                    alt={`${property.title} ${i + 1}`}
                    onClick={() => {
                      setIndex(i);
                      setShowGallery(true);
                    }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className={`rounded-xl cursor-pointer border-2 ${
                      index === i
                        ? "border-[#D4AF37]"
                        : "border-transparent"
                    }`}
                  />
                )
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">
                Description
              </h2>

              <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* AMENITIES */}
            {property.features?.length > 0 && (
              <div className="mt-12">

                <h2 className="text-2xl font-semibold mb-6">
                  Amenities & Highlights
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  {property.features.map(
                    (feature: string, i: number) => (
                      <motion.div
                        key={i}
                        whileHover={{
                          y: -5,
                          scale: 1.02,
                        }}
                        className="
                          bg-white/5
                          border
                          border-white/10
                          rounded-2xl
                          px-5
                          py-5
                          backdrop-blur-xl
                          hover:border-[#D4AF37]/40
                          transition-all
                          duration-300
                          text-center
                          min-h-[120px]
                          flex
                          flex-col
                          justify-center
                        "
                      >
                        <div className="flex justify-center mb-4 text-[#D4AF37]">
                          {feature.toLowerCase().includes("club")
                            ? featureIcons.clubhouse
                            : feature.toLowerCase().includes("pool")
                            ? featureIcons.pool
                            : feature
                                .toLowerCase()
                                .includes("fitness") ||
                              feature.toLowerCase().includes("gym")
                            ? featureIcons.fitness
                            : feature
                                .toLowerCase()
                                .includes("security")
                            ? featureIcons.security
                            : feature
                                .toLowerCase()
                                .includes("green") ||
                              feature
                                .toLowerCase()
                                .includes("garden")
                            ? featureIcons.green
                            : feature.toLowerCase().includes("kids")
                            ? featureIcons.kids
                            : feature.toLowerCase().includes("games")
                            ? featureIcons.games
                            : feature.toLowerCase().includes("parking")
                            ? featureIcons.parking
                            : feature.toLowerCase().includes("senior")
                            ? featureIcons.senior
                            : featureIcons.premium}
                        </div>

                        <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                          {feature}
                        </p>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="mt-10 md:mt-0 md:sticky md:top-24 h-fit self-start">

            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(212,175,55,0.1)]"
            >
              <h2 className="text-xl font-semibold mb-4">
                Interested in this property?
              </h2>

              <div className="mb-4">
                <p className="text-[#D4AF37] text-2xl font-bold">
                  {property.price}
                </p>

                <p className="text-xs text-gray-400">
                  Limited availability
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => setVisitOpen(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black font-semibold shadow-lg"
              >
                Schedule Visit
              </motion.button>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full">
                  Verified
                </span>

                {property.possession && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                    {property.possession}
                  </span>
                )}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold">
                  P
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Property Advisor
                  </p>

                  <p className="text-xs text-gray-400">
                    +91 9818223111
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 space-y-2 text-sm text-gray-300">

                {property.propertyType && (
                  <p>
                    Type: {property.propertyType}
                  </p>
                )}

                {property.area && (
                  <p>
                    Area: {property.area}
                  </p>
                )}

                {property.beds && (
                  <p>
                    Configuration: {property.beds}
                  </p>
                )}

                {property.baths && (
                  <p>
                    Bathrooms: {property.baths}
                  </p>
                )}

              </div>
            </motion.div>
          </div>
        </div>
        <MobilePropertyDetails
          property={property}
          onSchedule={() => setVisitOpen(true)}
        />

        {/* IMAGE COMPARISON */}
        {property.images?.length >= 2 && (
          <div className="hidden w-full bg-black py-20 md:block">

            <section
              ref={sectionRef}
              className="comparisonSection"
            >
              <div className="comparisonImage beforeImage">
                <img src={property.images[0]} />
              </div>

              <div
                ref={afterRef}
                className="comparisonImage afterImage"
              >
                <img
                  ref={afterImgRef}
                  src={property.images[1]}
                />
              </div>
            </section>
          </div>
        )}

        {/* FULLSCREEN GALLERY */}
        {showGallery && (
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur z-[9999] flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-5 right-5 text-white text-xl"
            >
              ✕
            </button>

            <button
              onClick={() =>
                setIndex((prev) =>
                  prev === 0
                    ? property.images.length - 1
                    : prev - 1
                )
              }
              className="absolute left-5 text-4xl"
            >
              ‹
            </button>

            <img
              src={property.images[index]}
              className="max-h-[90%] max-w-[90%] rounded-xl transition-all duration-300"
            />

            <button
              onClick={() =>
                setIndex((prev) =>
                  prev === property.images.length - 1
                    ? 0
                    : prev + 1
                )
              }
              className="absolute right-5 text-4xl"
            >
              ›
            </button>

            <div className="absolute bottom-6 flex gap-2">
              {property.images.map(
                (_: any, i: number) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      index === i
                        ? "bg-[#D4AF37]"
                        : "bg-gray-500"
                    }`}
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* WHY THIS FARM HOUSE */}
        <section className="relative hidden py-32 overflow-hidden bg-[#0B0B0B] md:block">

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#D4AF37]/10 blur-[160px] rounded-full" />

          <div className="relative max-w-7xl mx-auto px-6">

            <div className="max-w-3xl mb-20">
              <p className="text-[#D4AF37] tracking-[5px] uppercase text-sm mb-5">
                Premium Farm Living
              </p>

              <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
                Why This Farm House <br />
                Stands Out
              </h2>

              <p className="text-gray-400 text-lg leading-relaxed">
                Experience a lifestyle surrounded by open spaces, greenery,
                privacy, comfort, and premium living.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

              <motion.div
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10"
              >
                <div className="text-5xl mb-8">🌿</div>

                <h3 className="text-2xl font-semibold mb-5">
                  Nature & Privacy
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  Enjoy peaceful surroundings, green landscapes and the privacy
                  of an exclusive farm living experience.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10"
              >
                <div className="text-5xl mb-8">🏡</div>

                <h3 className="text-2xl font-semibold mb-5">
                  Premium Lifestyle
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  A perfect combination of luxury, comfort, spacious living and
                  a relaxing weekend lifestyle.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10"
              >
                <div className="text-5xl mb-8">📈</div>

                <h3 className="text-2xl font-semibold mb-5">
                  Investment Potential
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  A premium land-based asset with strong potential for future
                  value appreciation and long-term investment.
                </p>
              </motion.div>

            </div>
          </div>
        </section>

        {/* STATS */}
        {property.stats?.length > 0 && (
          <section className="relative hidden py-32 bg-gradient-to-b from-[#0B0B0B] to-[#111] overflow-hidden md:block">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#D4AF37]/10 blur-[180px]" />

            <div className="relative max-w-7xl mx-auto px-6">

              <div className="text-center mb-20">
                <p className="text-[#D4AF37] uppercase tracking-[6px] text-sm mb-5">
                  Property Highlights
                </p>

                <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  A Premium Farm <br />
                  Living Experience
                </h2>
              </div>

              <div className="grid md:grid-cols-4 gap-8">

                {property.stats.map(
                  (item: any, i: number) => (
                    <motion.div
                      key={i}
                      whileHover={{
                        y: -12,
                        scale: 1.03,
                      }}
                      className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-3xl p-10 text-center"
                    >
                      <h2 className="text-5xl md:text-6xl font-bold text-[#D4AF37] mb-5">
                        {item.number}
                      </h2>

                      <p className="text-gray-300 text-lg">
                        {item.label}
                      </p>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </section>
        )}

      </motion.div>

      {/* SCHEDULE VISIT POPUP */}
      {visitOpen && (
        <ScheduleVisit
          property={property}
          onClose={() => setVisitOpen(false)}
        />
      )}
    </>
  );
}
