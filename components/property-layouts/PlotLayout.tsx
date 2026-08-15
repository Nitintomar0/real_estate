"use client";
import { motion } from "framer-motion";
import ScheduleVisit from "@/components/ScheduleVisit";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useLayoutEffect } from "react";
import { useRef } from "react";

import Footer from "@/components/Footer";
import MobilePropertyDetails from "@/components/mobile/MobilePropertyDetails";

export default function HighriseLayout({ property }: any) {
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
            // swipe left 👉 next image
            setIndex((prev) =>
                prev === property.images.length - 1 ? 0 : prev + 1
            );
        }

        if (touchEnd - touchStart > 50) {
            // swipe right 👉 previous image
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

        // 🔥 KILL OLD GSAP (fix navigation issue)
        ScrollTrigger.getAll().forEach(t => t.kill());

        // 🔥 RESET POSITIONS
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
            }
        });

        tl.to(after, { xPercent: 0 })
            .to(afterImg, { xPercent: 0 }, 0);

        // 🔥 FORCE UPDATE
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };

    }, [property.id]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [property.id]);

    if (!property) return <div className="text-white p-10">Not Found</div>;
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-[#0B0B0B] text-white"
            >
            </motion.div>

            {/* HERO */}
            <div className="relative h-[60vh] md:h-[90vh]">
                <div className="absolute top-4 left-4 z-10">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-black/50 backdrop-blur px-3 py-2 rounded-lg text-sm"
                    >
                        ← Back
                    </button>
                </div>
                <div className="relative w-full h-full">

                    <img
                        src={property.images[index]}
                        className="w-full h-full object-cover transition-all duration-500 cursor-pointer"
                    />

                    {/* LEFT BUTTON */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIndex((prev) =>
                                prev === 0 ? property.images.length - 1 : prev - 1
                            );
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 px-3 py-2 rounded-lg"
                    >
                        ‹
                    </button>

                    {/* RIGHT BUTTON */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIndex((prev) =>
                                prev === property.images.length - 1 ? 0 : prev + 1
                            );
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 px-3 py-2 rounded-lg"
                    >
                        ›
                    </button>

                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-4 md:left-10 max-w-4xl">
                    <p className="text-sm text-gray-300 mb-2">
                        Home / Bangalore / Whitefield
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

                    <p className="text-[#D4AF37] text-2xl mt-3 font-semibold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                        {property.price}
                    </p>
                    <div className="mt-4 flex gap-2">
                        <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full">
                            Verified Property
                        </span>
                        <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                            {property.possession}
                        </span>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                {/* LEFT */}
                <div className="md:col-span-2">

                    {/* HIGHLIGHTS */}
                    <div className="flex flex-wrap gap-6 text-gray-300 border-b border-gray-800 pb-6">

    <span>📍 {property.location}</span>

    <span>📐 {property.area}</span>

    <span>🏗️ {property.status}</span>

    <span>📈 High Investment Potential</span>

</div>

                    {/* GALLERY */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
                        {property.images.map((img: string, i: number) => (
                            <motion.img
                                key={i}
                                src={img}
                                onClick={() => {
                                    setIndex(i);          // show clicked image
                                    setShowGallery(true); // open fullscreen
                                }}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                className={`rounded-xl cursor-pointer border-2 ${index === i ? "border-[#D4AF37]" : "border-transparent"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* DESCRIPTION */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold mb-4">Description</h2>
                        <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                            {property.description}
                        </p>
                    </div>

                    {/* AMENITIES */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold mb-6">Amenities</h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

    {property.features?.map((feature: string, i: number) => (

        <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-5 text-center backdrop-blur-xl"
        >

            <p className="text-gray-300 text-sm md:text-base">
                📍 {feature}
            </p>

        </motion.div>

    ))}

</div>
                    </div>

                    {/* LOCATION */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold mb-4">Location</h2>

                        <iframe
                            src="https://maps.google.com/maps?q=28.603417,77.450639&z=15&output=embed"
                            className="w-full h-[350px] rounded-xl"
                        />
                    </div>


                </div>


                {/* RIGHT SIDEBAR */}
                <div className="mt-10 md:mt-0 md:sticky md:top-24 h-fit self-start">

                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(212,175,55,0.1)]"
                    >

                        {/* TITLE */}
                        <h2 className="text-xl font-semibold mb-4">
                            Interested in this property?
                        </h2>

                        {/* 🔥 PRICE HIGHLIGHT */}
                        <div className="mb-4">
                            <p className="text-[#D4AF37] text-2xl font-bold drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]">
                                {property.price}
                            </p>
                            <p className="text-xs text-gray-400">Negotiable • Limited availability</p>
                        </div>

                        {/* 🔥 MAIN CTA BUTTON */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.03 }}
                            onClick={() => setVisitOpen(true)}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black font-semibold shadow-lg transition-all duration-300"
                        >
                            Schedule Visit
                        </motion.button>

                        {/* 🔥 TRUST BADGES */}
                        <div className="flex gap-2 mt-4">
                            <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full">
                                Verified
                            </span>
                            <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                                {property.possession}
                            </span>
                        </div>

                        {/* 🔥 CONTACT */}
                        <div className="mt-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold">
                                A
                            </div>
                            <div>
                                <p className="text-sm font-medium">Property Advisor</p>
                                <p className="text-xs text-gray-400">+91 98765 43210</p>
                            </div>
                        </div>

                        {/* 🔥 DIVIDER */}
                        <div className="mt-6 border-t border-white/10 pt-4 space-y-2 text-sm text-gray-300">
                            <p>Type: {property.propertyType}</p>

<p>Status: {property.possession}</p>

<p>Area: {property.area}</p>

<p>Developer: {property.developer}</p>

<p>Location: {property.location}</p>
                        </div>

                    </motion.div>

                </div>


            </div>
            <MobilePropertyDetails
                property={property}
                onSchedule={() => setVisitOpen(true)}
            />
            
            {/* 🔥 ADD THIS HERE */}
            < ScheduleVisit
                open={visitOpen}
                setOpen={setVisitOpen}
                property={property.title}
            />


        </>
        
    );

}
