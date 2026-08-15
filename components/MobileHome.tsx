"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  FileText,
  Filter,
  Home,
  Info,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { properties } from "@/components/data/properties";

type PropertyRecord = {
  id: string;
  title: string;
  location: string;
  category: string;
  price?: string;
  images?: string[];
  propertyType?: string;
  area?: string;
  areaSize?: string;
  status?: string;
  possession?: string;
  developer?: string;
  description?: string;
  features?: string[];
  configurations?: string[];
  unitOptions?: string[];
  nearbyLocations?: string[];
};

const allProperties = properties as PropertyRecord[];
const WHATSAPP_NUMBER = "919818223111";
const TYPE_ORDER = [
  "highrise",
  "villa",
  "commercial",
  "plot",
  "farmhouse",
  "builder",
  "freehold",
];

const TYPE_LABELS: Record<string, string> = {
  highrise: "High Rise",
  villa: "Villas",
  commercial: "Commercial",
  plot: "Plots",
  farmhouse: "Farmhouses",
  builder: "Builder Floors",
  freehold: "Freehold",
};

const CITY_HINTS = [
  "Greater Noida West",
  "Noida Extension",
  "Noida Expressway",
  "Greater Noida",
  "Yamuna Authority",
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Noida",
  "Goa",
  "Pune",
];

function normalize(value: unknown) {
  return String(value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function getCity(location = "") {
  const normalized = normalize(location);
  const hintedCity = CITY_HINTS.find((city) =>
    normalized.includes(city.toLowerCase())
  );

  if (hintedCity) return hintedCity;

  const parts = location.split(",").map((part) => part.trim()).filter(Boolean);
  return parts[parts.length - 1] || location;
}

function getCategoryLabel(category: string) {
  return TYPE_LABELS[category] || category;
}

function getSearchText(property: PropertyRecord) {
  return normalize(
    [
      property.title,
      property.location,
      getCity(property.location),
      property.category,
      getCategoryLabel(property.category),
      property.propertyType,
      property.area,
      property.areaSize,
      property.status,
      property.possession,
      property.developer,
      property.description,
      ...(property.features || []),
      ...(property.configurations || []),
      ...(property.unitOptions || []),
      ...(property.nearbyLocations || []),
    ].join(" ")
  );
}

function getWhatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function MobilePropertyCard({
  property,
  compact = false,
  onOpen,
}: {
  property: PropertyRecord;
  compact?: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(property.id)}
      className={`group snap-start overflow-hidden rounded-[24px] border border-white/10 bg-[#111111] text-left shadow-[0_18px_45px_rgba(0,0,0,0.35)] active:scale-[0.98] transition ${
        compact ? "min-w-[250px]" : "min-w-[286px]"
      }`}
    >
      <div className="relative h-[190px] overflow-hidden">
        <img
          src={property.images?.[0]}
          alt={property.title}
          className="h-full w-full object-cover transition duration-500 group-active:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
        <div className="absolute left-3 top-3 rounded-full border border-[#D4AF37]/35 bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F4D779] backdrop-blur">
          {getCategoryLabel(property.category)}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div>
            <p className="line-clamp-1 text-xs text-white/70">
              {property.location}
            </p>
            <p className="mt-1 text-base font-semibold leading-tight text-white">
              {property.title}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#D4AF37]">
            {property.price}
          </p>
          <ChevronRight size={18} className="text-white/50" />
        </div>

        <div className="flex gap-2 overflow-hidden">
          {[property.area, property.possession || property.status]
            .filter((item): item is string => Boolean(item))
            .slice(0, 2)
            .map((item: string) => (
              <span
                key={item}
                className="min-w-0 truncate rounded-full bg-white/[0.06] px-3 py-1 text-[11px] text-white/65"
              >
                {item}
              </span>
            ))}
        </div>
      </div>
    </button>
  );
}

export default function MobileHome() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  const typeOptions = useMemo(
    () =>
      TYPE_ORDER.filter((type) =>
        allProperties.some((property) => property.category === type)
      ),
    []
  );

  const cityOptions = useMemo(() => {
    return Array.from(
      new Set(allProperties.map((property) => getCity(property.location)))
    ).filter(Boolean);
  }, []);

  const query = normalize(search);
  const isFiltering = Boolean(query || selectedCity || selectedType);

  const filteredProperties = useMemo(() => {
    return allProperties.filter((property) => {
      const matchesSearch = query ? getSearchText(property).includes(query) : true;
      const matchesCity = selectedCity
        ? getCity(property.location) === selectedCity
        : true;
      const matchesType = selectedType
        ? property.category === selectedType
        : true;

      return matchesSearch && matchesCity && matchesType;
    });
  }, [query, selectedCity, selectedType]);

  const spotlightProperties = useMemo(
    () => allProperties.filter((property) => property.images?.[0]).slice(0, 8),
    []
  );

  const spotlight =
    spotlightProperties[spotlightIndex % Math.max(spotlightProperties.length, 1)];

  const suggestions = useMemo(() => {
    if (!query) return [];
    return allProperties
      .filter((property) => getSearchText(property).includes(query))
      .slice(0, 4);
  }, [query]);

  const categorySections = useMemo(() => {
    return typeOptions
      .map((type) => ({
        type,
        properties: allProperties.filter((property) => property.category === type),
      }))
      .filter((section) => section.properties.length > 0);
  }, [typeOptions]);

  useEffect(() => {
    if (isFiltering || spotlightProperties.length <= 1) return;

    const timer = window.setInterval(() => {
      setSpotlightIndex((current) => (current + 1) % spotlightProperties.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [isFiltering, spotlightProperties.length]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCity("");
    setSelectedType("");
  };

  const openProperty = (id: string) => {
    router.push(`/property/${id}`);
  };

  const focusSearch = () => {
    const el = document.getElementById("searchBar");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => searchInputRef.current?.focus(), 350);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] pb-24 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080808]/88 px-4 pb-3 pt-4 backdrop-blur-2xl">
        <div className="grid grid-cols-[44px_1fr_44px] items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] active:scale-95"
          >
            <Menu size={22} />
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex min-w-0 flex-col items-center justify-center"
          >
            <Image
              src="/logo1.png"
              alt="Paramshiv Estate"
              width={154}
              height={44}
              priority
              className="h-9 w-auto object-contain"
            />
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Paramshiv Estate
            </span>
          </button>

          <a
            href={getWhatsappUrl("Hi Paramshiv Estate, I want to explore properties.")}
            aria-label="Chat on WhatsApp"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-500/15 text-emerald-300 shadow-[0_8px_24px_rgba(16,185,129,0.18)] active:scale-95"
          >
            <MessageCircle size={21} />
          </a>
        </div>
      </header>

      <main>
        <section className="px-4 pt-5">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,#151515,#0B0B0B)] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
              Premium discovery
            </p>
            <h1 className="mt-3 text-[30px] font-semibold leading-[1.05]">
              Find NCR properties with clarity.
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Curated high-rise homes, villas, plots and commercial opportunities
              from the Paramshiv Estate portfolio.
            </p>

            <div className="relative mt-5">
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
              />
              <input
                id="searchBar"
                ref={searchInputRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => window.setTimeout(() => setSearchFocused(false), 180)}
                placeholder="Search Noida, villa, commercial..."
                className="h-14 w-full rounded-2xl border border-white/10 bg-black/55 pl-12 pr-11 text-[15px] outline-none transition focus:border-[#D4AF37]/70 focus:shadow-[0_0_0_4px_rgba(212,175,55,0.08)]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/70"
                >
                  <X size={16} />
                </button>
              )}

              <AnimatePresence>
                {searchFocused && (query || cityOptions.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute left-0 right-0 top-[62px] z-30 overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-2xl"
                  >
                    {query ? (
                      suggestions.length > 0 ? (
                        suggestions.map((property) => (
                          <button
                            key={property.id}
                            type="button"
                            onClick={() => openProperty(property.id)}
                            className="flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left last:border-b-0"
                          >
                            <img
                              src={property.images?.[0]}
                              alt=""
                              className="h-12 w-12 rounded-xl object-cover"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold">
                                {property.title}
                              </span>
                              <span className="block truncate text-xs text-white/50">
                                {property.location}
                              </span>
                            </span>
                            <ArrowRight size={16} className="text-[#D4AF37]" />
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-5 text-sm text-white/55">
                          No matching properties yet.
                        </div>
                      )
                    ) : (
                      <div className="p-3">
                        <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                          Popular locations
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {cityOptions.slice(0, 6).map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => setSelectedCity(city)}
                              className="rounded-full bg-white/[0.06] px-3 py-2 text-xs text-white/75"
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="px-4 pt-4">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {cityOptions.slice(0, 5).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(selectedCity === city ? "" : city)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                  selectedCity === city
                    ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                    : "border-white/10 bg-white/[0.06] text-white/75"
                }`}
              >
                {city}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOpenFilter(true)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                selectedType
                  ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#F5D86B]"
                  : "border-white/10 bg-white/[0.06] text-white/75"
              }`}
            >
              <Filter size={15} />
              Filters
            </button>
          </div>
        </section>

        {isFiltering ? (
          <section className="px-4 pt-5">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#D4AF37]">
                  Matching properties
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  {filteredProperties.length} result
                  {filteredProperties.length === 1 ? "" : "s"}
                </h2>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70"
              >
                Clear
              </button>
            </div>

            {filteredProperties.length > 0 ? (
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <MobilePropertyCard
                    key={property.id}
                    property={property}
                    onOpen={openProperty}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-7 text-center">
                <Search className="mx-auto text-[#D4AF37]" size={28} />
                <h3 className="mt-4 text-lg font-semibold">
                  No properties found
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Try a broader location, a different property type, or clear
                  filters to see the full portfolio.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black"
                >
                  Reset search
                </button>
              </div>
            )}
          </section>
        ) : (
          <>
            {spotlight && (
              <section className="px-4 pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#D4AF37]">
                      Spotlight
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      Featured property
                    </h2>
                  </div>
                  <div className="flex gap-1">
                    {spotlightProperties.slice(0, 4).map((property, index) => (
                      <span
                        key={property.id}
                        className={`h-1.5 rounded-full transition-all ${
                          index === spotlightIndex % spotlightProperties.length
                            ? "w-6 bg-[#D4AF37]"
                            : "w-1.5 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openProperty(spotlight.id)}
                  className="relative block h-[360px] w-full overflow-hidden rounded-[30px] border border-[#D4AF37]/20 bg-[#111] text-left shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={spotlight.id}
                      src={spotlight.images?.[0]}
                      alt={spotlight.title}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75 backdrop-blur">
                    {getCategoryLabel(spotlight.category)}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="flex items-center gap-1.5 text-sm text-white/70">
                      <MapPin size={15} className="text-[#D4AF37]" />
                      {spotlight.location}
                    </p>
                    <h3 className="mt-2 text-3xl font-semibold leading-tight">
                      {spotlight.title}
                    </h3>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-lg font-semibold text-[#D4AF37]">
                        {spotlight.price}
                      </p>
                      <span className="flex items-center gap-2 rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black">
                        View
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </button>
              </section>
            )}

            <section className="pt-8">
              {categorySections.map((section) => (
                <div key={section.type} className="mb-8">
                  <div className="mb-3 flex items-end justify-between px-4">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {getCategoryLabel(section.type)}
                      </h2>
                      <p className="mt-1 text-sm text-white/50">
                        {section.properties.length} curated listing
                        {section.properties.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <div className="flex snap-x gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
                    {section.properties.map((property) => (
                      <MobilePropertyCard
                        key={property.id}
                        property={property}
                        compact
                        onOpen={openProperty}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="space-y-5 px-4 pb-8">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">
                  Why Paramshiv Estate
                </p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight">
                  Curated real estate guidance for premium decisions.
                </h2>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    ["Curated properties", Building2],
                    ["Verified opportunities", ShieldCheck],
                    ["Expert guidance", PhoneCall],
                    ["Premium locations", MapPin],
                  ].map(([label, Icon]) => {
                    const ValueIcon = Icon as typeof Building2;
                    return (
                      <div
                        key={label as string}
                        className="rounded-2xl border border-white/10 bg-black/35 p-4"
                      >
                        <ValueIcon size={18} className="text-[#D4AF37]" />
                        <p className="mt-3 text-sm font-medium text-white/82">
                          {label as string}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#D4AF37]/18 bg-[linear-gradient(145deg,rgba(212,175,55,0.13),rgba(255,255,255,0.035))] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">
                  Buying journey
                </p>
                <div className="mt-5 space-y-4">
                  {[
                    ["Discover", "Explore curated locations and property types."],
                    ["Shortlist", "Compare listings that match your intent."],
                    ["Visit", "Schedule a guided property visit."],
                    ["Decide", "Move ahead with clarity and support."],
                  ].map(([title, desc], index) => (
                    <div key={title} className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-sm font-bold text-black">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{title}</h3>
                        <p className="mt-1 text-sm leading-6 text-white/55">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#111]">
                <img
                  src={allProperties[0]?.images?.[0]}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-25"
                />
                <div className="relative bg-gradient-to-t from-black via-black/78 to-black/45 p-6">
                  <Sparkles size={22} className="text-[#D4AF37]" />
                  <h2 className="mt-4 text-2xl font-semibold leading-tight">
                    Talk to an advisor before you shortlist.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/60">
                    Get focused property guidance from the Paramshiv Estate team.
                  </p>
                  <a
                    href={getWhatsappUrl(
                      "Hi Paramshiv Estate, I would like to speak with a property advisor."
                    )}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black"
                  >
                    WhatsApp advisor
                    <MessageCircle size={16} />
                  </a>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <div className="fixed bottom-0 left-0 z-50 flex w-full justify-around border-t border-white/10 bg-black/90 py-3 backdrop-blur-xl">
        <div className="flex flex-col items-center text-[#D4AF37]">
          <Home size={20} />
          <span className="text-xs">Home</span>
        </div>

        <button
          type="button"
          onClick={focusSearch}
          className="flex flex-col items-center text-white"
        >
          <Search size={20} />
          <span className="text-xs">Search</span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/contact")}
          className="flex flex-col items-center text-white"
        >
          <Phone size={20} />
          <span className="text-xs">Contact</span>
        </button>

        <button
          type="button"
          onClick={() => setOpenProfile(true)}
          className="flex flex-col items-center text-white active:scale-95"
        >
          <Menu size={20} />
          <span className="text-xs">More</span>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex flex-col bg-[#080808] text-white"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-lg font-semibold text-[#D4AF37]">
                  Paramshiv Estate
                </p>
                <p className="mt-1 text-xs text-white/45">Premium Real Estate</p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 px-6 py-7">
              {[
                ["Home", "/", Home],
                ["About", "/about", Info],
                ["Privacy Policy", "/privacy", ShieldCheck],
                ["Terms & Conditions", "/terms", FileText],
                ["Contact Us", "/contact", PhoneCall],
              ].map(([label, href, Icon]) => {
                const ItemIcon = Icon as typeof Home;
                return (
                  <button
                    key={href as string}
                    type="button"
                    onClick={() => {
                      router.push(href as string);
                      setMenuOpen(false);
                    }}
                    className="mb-3 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <ItemIcon size={18} className="text-[#D4AF37]" />
                      <span>{label as string}</span>
                    </span>
                    <ChevronRight size={18} className="text-white/35" />
                  </button>
                );
              })}
            </div>

            <div className="px-6 pb-8">
              <a
                href={getWhatsappUrl("Hi Paramshiv Estate, I want to explore properties.")}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-4 font-semibold text-black"
              >
                <MessageCircle size={18} />
                WhatsApp Support
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openFilter && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenFilter(false)}
          >
            <motion.div
              className="absolute bottom-0 left-0 w-full rounded-t-[30px] border border-white/10 bg-[#111] p-5 shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 280 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) setOpenFilter(false);
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/25" />
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#D4AF37]">
                    Refine
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Search filters
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-white/55"
                >
                  Reset
                </button>
              </div>

              <div className="mb-5">
                <p className="mb-3 text-sm font-semibold text-white/70">City</p>
                <div className="flex flex-wrap gap-2">
                  {cityOptions.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() =>
                        setSelectedCity(selectedCity === city ? "" : city)
                      }
                      className={`rounded-full border px-4 py-2 text-sm ${
                        selectedCity === city
                          ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                          : "border-white/10 bg-white/[0.05] text-white/70"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-white/70">
                  Property type
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {typeOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setSelectedType(selectedType === type ? "" : type)
                      }
                      className={`flex items-center justify-between rounded-2xl border p-3 text-left text-sm ${
                        selectedType === type
                          ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#F5D86B]"
                          : "border-white/10 bg-white/[0.05] text-white/70"
                      }`}
                    >
                      {getCategoryLabel(type)}
                      {selectedType === type && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpenFilter(false)}
                className="w-full rounded-2xl bg-[#D4AF37] py-4 font-semibold text-black"
              >
                Show {filteredProperties.length} Properties
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openProfile && (
          <motion.div
            className="fixed inset-0 z-[999] bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenProfile(false)}
          >
            <motion.div
              className="absolute bottom-0 left-0 w-full rounded-t-3xl border border-white/10 bg-[#111] p-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.32 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 300 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) setOpenProfile(false);
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/25" />
              <div className="mb-5 text-center">
                <h2 className="text-lg font-semibold text-[#D4AF37]">
                  Paramshiv Estate
                </h2>
                <p className="text-xs text-white/45">Premium Real Estate</p>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  ["About Us", "/about", Info],
                  ["Contact Us", "/contact", PhoneCall],
                  ["Privacy Policy", "/privacy", ShieldCheck],
                  ["Terms & Conditions", "/terms", FileText],
                ].map(([label, href, Icon]) => {
                  const SheetIcon = Icon as typeof Info;
                  return (
                    <button
                      key={href as string}
                      type="button"
                      onClick={() => {
                        router.push(href as string);
                        setOpenProfile(false);
                      }}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-4 text-left active:scale-95"
                    >
                      <SheetIcon className="text-[#D4AF37]" size={18} />
                      <span>{label as string}</span>
                    </button>
                  );
                })}
                <a
                  href={getWhatsappUrl("Hi Paramshiv Estate, I need property support.")}
                  className="flex items-center gap-3 rounded-xl bg-emerald-500 p-4 font-semibold text-black active:scale-95"
                >
                  <MessageCircle size={18} />
                  WhatsApp Support
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
