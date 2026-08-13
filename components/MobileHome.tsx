"use client";
import {
    Home,
    Search,
    Heart,
    Phone,
    Menu,
    Building,
    Key,
    IndianRupee,
    MessageCircle
} from "lucide-react";

import {
    FileText,
    ShieldCheck,
    Info,
    PhoneCall
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { properties } from "@/components/data/properties";


export default function MobileHome() {
    const [menuOpen, setMenuOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);



        return () => clearTimeout(timer);
    }, []);
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [openFilter, setOpenFilter] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState("");
    const isFiltering =
        search.length > 0 ||
        selectedLocation !== "" ||
        selectedPrice !== "";

    const locations = ["Bangalore", "Mumbai", "Goa", "Delhi", "Pune"];
    const [openProfile, setOpenProfile] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const PropertySection = ({
        title,
        category,
    }: {
        title: string;
        category: string;
    }) => {
        const filtered = properties.filter((property) => {
            const titleText = property.title.toLowerCase();
            const locationText = property.location.toLowerCase();
            const query = search.toLowerCase();

            const matchSearch =
                titleText.includes(query) || locationText.includes(query);

            const matchLocation = selectedLocation
                ? locationText === selectedLocation.toLowerCase()
                : true;

            let matchPrice = true;

            if (selectedPrice === "<2Cr") {
                matchPrice = (property.priceValue ?? 0) < 2;
            } else if (selectedPrice === "2-5Cr") {
                matchPrice =
                    (property.priceValue ?? 0) >= 2 &&
(property.priceValue ?? 0) <= 5;
            } else if (selectedPrice === "5Cr+") {
                (property.priceValue ?? 0) > 5;
            }


            return (
                matchSearch &&
                matchLocation &&
                matchPrice &&
                property.category === category
            );;
        });
        if (loading) {



            return (
                <div className="bg-[#0B0B0B] min-h-screen p-4 animate-pulse">

                    {/* Top */}
                    <div className="h-6 w-32 bg-white/10 rounded mb-6"></div>

                    {/* Search */}
                    <div className="h-12 bg-white/10 rounded-xl mb-6"></div>

                    {/* Featured */}
                    <div className="h-[250px] bg-white/10 rounded-2xl mb-6"></div>

                    {/* Cards */}
                    <div className="flex gap-4">
                        <div className="h-[180px] w-[250px] bg-white/10 rounded-xl"></div>
                        <div className="h-[180px] w-[250px] bg-white/10 rounded-xl"></div>
                    </div>

                </div>
            );
        }
        if (filtered.length === 0) {
            return null;
        }
        return (

            <div className="px-4 mb-8">
                <h2 className="text-lg font-semibold mb-3">{title}</h2>

                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">

                    {filtered.length === 0 ? (
                        <div className="w-full text-center py-16">
                            <p className="text-lg font-semibold">No Properties Found</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Try different filters
                            </p>
                        </div>
                    ) : (
                        filtered.map((property) => (
    <div
        key={property.id}
        onClick={() => router.push(`/property/${property.id}`)}
        className="min-w-[260px] bg-[#111] rounded-2xl overflow-hidden border border-white/10 shadow-md active:scale-95 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
    >
        <div className="relative">

            <img
                src={property.images?.[0]}
                className="h-[170px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-3 left-3">
                <p className="text-xs text-gray-300">
                    {property.location}
                </p>
            </div>

        </div>

        <div className="p-4">

            <h3 className="text-sm font-semibold mb-1">
                {property.title}
            </h3>

            <p className="text-xs text-gray-400 mb-1">
                Prime Location
            </p>

            <p className="text-[#D4AF37] font-bold text-sm">
                {property.price}
            </p>

        </div>
    </div>
))
                    )}

                </div>

            </div>

        );

    };

    return (
        <div className="bg-[#0B0B0B] text-white min-h-screen pb-24">

            {/* 🔝 TOP BAR */}
            <div className="flex propertys-center justify-between px-4 pt-6 pb-4">
                <button onClick={() => setMenuOpen(true)}>
                    <Menu />
                </button>
                <h1 className="text-lg font-bold text-[#D4AF37]">
                    Paramshiv Estate
                </h1>
                <div className="bg-green-500 p-2 rounded-full">💬</div>
            </div>

            {/* 🔍 SEARCH */}
            <div className="px-4 mb-4">
                <input
                    id="searchBar"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search villas, apartments..."
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                />
            </div>

            {/* 🏷 FILTERS */}

            <div className="px-4 mb-5">

                <div className="flex propertys-center gap-3 overflow-x-auto">

                    {["Bangalore", "Delhi", "Noida"].map((loc) => (
                        <button
                            key={loc}
                            onClick={() => setSelectedLocation(loc)}
                            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300
        ${selectedLocation === loc
                                    ? "bg-[#D4AF37] text-black shadow-lg scale-105"
                                    : "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:border-[#D4AF37]"
                                }`}
                        >
                            {loc}
                        </button>
                    ))}

                    {/* FILTER BUTTON */}
                    <button
                        onClick={() => setOpenFilter(true)}
                        className="flex propertys-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm hover:border-[#D4AF37] transition-all"
                    >
                        ⚙
                        Filters
                    </button>

                </div>

            </div>


            {/* ⭐ FEATURED */}
            {!isFiltering && (
                <div className="px-4 mb-8">
                    <div className="relative rounded-3xl overflow-hidden">

                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                            className="w-full h-[280px] object-cover"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Text
                        <div className="absolute bottom-4 left-4">
                            <p className="text-xs text-gray-300 mb-1">
                                Whitefield, Bangalore
                            </p>

                            <h2 className="text-xl font-semibold">
                                Luxury Villa
                            </h2>

                            <p className="text-[#D4AF37] font-bold mt-1">
                                ₹ 5.5 Crore
                            </p>
                        </div> */}

                    </div>

                </div>
            )}
            {/* 🔥 RECOMMENDED */}

            {!isFiltering && (
                <div className="px-4 mb-8">

                    <h2 className="text-lg font-semibold mb-3">
                        Recommended For You
                    </h2>

                    <div className="grid grid-cols-1 gap-4">

                        {properties.slice(0, 3).map((property) => (
                            <div
                                key={property.id}
                                onClick={() => router.push(`/property/${property.id}`)}
                                className="min-w-[240px] bg-[#111] rounded-2xl overflow-hidden border border-white/10 active:scale-95 transition"
                            >

                                <img
                                    src={property.images?.[0]}
                                    className="h-[150px] w-full object-cover"
                                />

                                <div className="p-3">

                                    <p className="text-xs text-gray-400">
                                        {property.location}
                                    </p>

                                    <h3 className="text-sm font-semibold mt-1">
                                        {property.title}
                                    </h3>

                                    <p className="text-[#D4AF37] text-sm mt-2 font-semibold">
                                        {property.price}
                                    </p>

                                </div>

                            </div>
                        ))}

                    </div>

                </div>
            )}

            {/* 🏡 PROPERTY LIST */}
            <div className="px-4">

                {/* 🔍 FILTER MODE */}
                {isFiltering ? (
                    <>
                        {/* RESULT HEADER */}
                        <div className="mb-4 flex propertys-center justify-between">
                            <p className="text-sm text-gray-400">
                                Showing results
                                {search && ` for "${search}"`}
                                {selectedLocation && ` in ${selectedLocation}`}
                            </p>


                            <button
                                onClick={() => {
                                    setSearch("");
                                    setSelectedLocation("");
                                    setSelectedPrice("");
                                }}
                                className="text-xs text-[#D4AF37]"
                            >
                                Clear
                            </button>
                        </div>

                        {/* SINGLE RESULT LIST */}
                        <PropertySection
    title="Results"
    category="all"
/>
                    </>
                ) : (
                    <>
                        {/* NORMAL HOME */}
                        <PropertySection
                            title="High Rise"
                            category="highrise"
                        />

                        <PropertySection
                            title="Villas"
                            category="villa"
                        />

                        <PropertySection
                            title="Builder Floor"
                            category="builder"
                        />

                        <PropertySection
                            title="Free Hold"
                            category="freehold"
                        />

                        <PropertySection
                            title="Plots"
                            category="plot"
                        />
                        <PropertySection
    title="Commercial"
    category="commercial"
/>
                    </>
                )}

            </div>


            {/* 🔻 BOTTOM NAV */}
            <div className="fixed bottom-0 left-0 w-full bg-black/90 border-t border-white/10 flex justify-around py-3">
                <div className="flex flex-col propertys-center text-[#D4AF37]">
                    <Home size={20} />
                    <span className="text-xs">Home</span>
                </div>

                <div className="flex flex-col propertys-center">
                    <button
                        onClick={() => {
                            const el = document.getElementById("searchBar");
                            el?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="flex flex-col propertys-center text-white"
                    >
                        <Search size={20} />
                        <p className="text-xs">Search</p>
                    </button>
                </div>

                <div className="flex flex-col propertys-center">
                    <button
                        onClick={() => router.push("/contact")}
                        className="flex flex-col propertys-center text-white"
                    >
                        <Phone size={20} />
                        <p className="text-xs">Contact</p>
                    </button>
                </div>

                <div
                    onClick={() => setOpenProfile(true)}
                    className="flex flex-col propertys-center active:scale-95 transition cursor-pointer"
                >
                    <Menu size={20} />
                    <span className="text-xs">More</span>
                </div>
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            className="fixed inset-0 bg-black z-[999] flex propertys-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                        >
                            <motion.img
                                src={selectedImage}
                                className="max-h-[90%] rounded-xl"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {openProfile && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-[999]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpenProfile(false)}
                        >
                            <motion.div
                                className="absolute bottom-0 left-0 w-full bg-[#111] rounded-t-3xl p-6 backdrop-blur-xl"
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ duration: 0.4 }}
                                drag="y"
                                dragConstraints={{ top: 0, bottom: 300 }}
                                onDragEnd={(e, info) => {
                                    if (info.offset.y > 100) {
                                        setOpenProfile(false);
                                    }
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* HANDLE */}
                                <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4"></div>

                                <div className="text-center mb-5">
                                    <h2 className="text-lg font-semibold text-[#D4AF37]">
                                        Paramshiv Estate
                                    </h2>
                                    <p className="text-xs text-gray-400">Premium Real Estate</p>
                                </div>

                                {/* OPTIONS */}
                                <div className="flex flex-col gap-3">

                                    {/* About */}
                                    <div
                                        onClick={() => router.push("/about")}
                                        className="flex propertys-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 active:scale-95 transition"
                                    >
                                        <Info className="text-[#D4AF37]" size={18} />
                                        <span>About Us</span>
                                    </div>

                                    {/* Contact */}
                                    <div
                                        onClick={() => router.push("/contact")}
                                        className="flex propertys-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 active:scale-95 transition"
                                    >
                                        <PhoneCall className="text-[#D4AF37]" size={18} />
                                        <span>Contact Us</span>
                                    </div>

                                    {/* Privacy */}
                                    <div
                                        onClick={() => router.push("/privacy")}
                                        className="flex propertys-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 active:scale-95 transition"
                                    >
                                        <ShieldCheck className="text-[#D4AF37]" size={18} />
                                        <span>Privacy Policy</span>
                                    </div>

                                    {/* Terms */}
                                    <div className="flex propertys-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 active:scale-95 transition">
                                        <FileText className="text-[#D4AF37]" size={18} />
                                        <span>Terms & Conditions</span>
                                    </div>

                                    {/* WhatsApp */}
                                    <div className="flex propertys-center gap-3 p-4 rounded-xl bg-green-500 text-black font-semibold active:scale-95 transition">
                                        <MessageCircle size={18} />
                                        <span>WhatsApp Support</span>
                                    </div>

                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="fixed inset-0 z-[9999] bg-[#0B0B0B] text-white flex flex-col"
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >

                        {/* TOP BAR */}
                        <div className="flex justify-between propertys-center px-6 py-5 border-b border-white/10">
                            <h2 className="text-lg font-semibold tracking-wide text-[#D4AF37]">
                                Paramshiv Estate
                            </h2>

                            <button
                                onClick={() => setMenuOpen(false)}
                                className="text-2xl opacity-70 hover:opacity-100 transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* PROFILE */}
                        <div className="px-6 py-6 border-b border-white/10 flex propertys-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex propertys-center justify-center text-black font-bold text-lg">
                                N
                            </div>

                            <div>
                                <p className="font-semibold text-base">Welcome Back</p>
                                <p className="text-sm text-gray-400">Find your dream home</p>
                            </div>
                        </div>

                        {/* MENU propertyS */}
                        <div className="flex-1 px-6 py-8 flex flex-col gap-8">

                            <button
                                onClick={() => {
                                    router.push("/");
                                    setMenuOpen(false);
                                }}
                                className="flex justify-between propertys-center text-lg font-medium group"
                            >
                                <span className="group-hover:text-[#D4AF37]">Home</span>
                                <span>›</span>
                            </button>

                            {/* About */}
                            <button
                                onClick={() => {
                                    router.push("/about");
                                    setMenuOpen(false);
                                }}
                                className="flex justify-between propertys-center text-lg font-medium group"
                            >
                                <span className="group-hover:text-[#D4AF37]">About</span>
                                <span>›</span>
                            </button>

                            {/* Privacy */}
                            <button
                                onClick={() => {
                                    router.push("/privacy");
                                    setMenuOpen(false);
                                }}
                                className="flex justify-between propertys-center text-lg font-medium group"
                            >
                                <span className="group-hover:text-[#D4AF37]">Privacy Policy</span>
                                <span>›</span>
                            </button>

                            {/* Terms */}
                            <button
                                onClick={() => {
                                    router.push("/terms");
                                    setMenuOpen(false);
                                }}
                                className="flex justify-between propertys-center text-lg font-medium group"
                            >
                                <span className="group-hover:text-[#D4AF37]">Terms & Conditions</span>
                                <span>›</span>
                            </button>

                            <button
                                onClick={() => {
                                    router.push("/contact");
                                    setMenuOpen(false);
                                }}
                                className="flex justify-between propertys-center text-lg font-medium group"
                            >
                                <span className="group-hover:text-[#D4AF37]">Contact Us</span>
                                <span>›</span>
                            </button>

                        </div>

                        {/* BOTTOM */}
                        <div className="px-6 pb-8">

                            <button
                                onClick={() => {
                                    router.push("/");
                                    setMenuOpen(false);
                                }}
                                className="w-full py-3 rounded-xl bg-[#D4AF37] text-black font-semibold active:scale-95 transition"
                            >
                                Explore Properties
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                Premium Real Estate Experience
                            </p>

                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {openFilter && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-[9999]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpenFilter(false)}
                    >

                        <motion.div
                            className="absolute bottom-0 left-0 w-full bg-[#111] rounded-t-3xl p-6 backdrop-blur-xl"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 300 }}
                            onDragEnd={(e, info) => {
                                if (info.offset.y > 100) setOpenFilter(false);
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >

                            {/* HANDLE */}
                            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4"></div>

                            {/* TITLE */}
                            <h2 className="text-lg font-semibold mb-6 text-center text-[#D4AF37]">
                                Filters
                            </h2>

                            {/* LOCATION */}
                            <div className="mb-6">
                                <p className="text-sm text-gray-400 mb-2">Location</p>

                                <div className="flex flex-wrap gap-2">
                                    {["Bangalore", "Delhi", "Noida", "Mumbai", "Goa"].map((loc) => (
                                        <button
                                            key={loc}
                                            onClick={() => setSelectedLocation(loc)}
                                            className={`px-4 py-2 rounded-full text-sm transition
                ${selectedLocation === loc
                                                    ? "bg-[#D4AF37] text-black"
                                                    : "bg-white/5 border border-white/10"
                                                }`}
                                        >
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* PRICE */}
                            <div className="mb-6">
                                <p className="text-sm text-gray-400 mb-2">Price Range</p>

                                <div className="flex gap-2">
                                    {["<2Cr", "2-5Cr", "5Cr+"].map((price) => (
                                        <button
                                            key={price}
                                            onClick={() => setSelectedPrice(price)}
                                            className={`px-4 py-2 rounded-full text-sm transition
      ${selectedPrice === price
                                                    ? "bg-[#D4AF37] text-black"
                                                    : "bg-white/5 border border-white/10"
                                                }`}
                                        >
                                            {price}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* APPLY BUTTON */}
                            <button
                                onClick={() => setOpenFilter(false)}
                                className="w-full py-3 rounded-xl bg-[#D4AF37] text-black font-semibold active:scale-95 transition"
                            >
                                Apply Filters
                            </button>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>

    );

}
