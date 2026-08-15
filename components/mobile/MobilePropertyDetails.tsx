"use client";

import { useRouter } from "next/navigation";
import {
  Baby,
  Building2,
  CalendarDays,
  CheckCircle2,
  Dumbbell,
  Gem,
  Landmark,
  MapPin,
  MessageCircle,
  ParkingCircle,
  Route,
  ShieldCheck,
  Sparkles,
  Trees,
  Waves,
} from "lucide-react";
import { properties } from "@/components/data/properties";

type StatItem = {
  number: string;
  label: string;
};

type PropertyRecord = {
  id: string;
  title: string;
  location: string;
  category: string;
  price?: string;
  images?: string[];
  beds?: string | number;
  baths?: string | number;
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
  paymentPlan?: string[];
  nearbyLocations?: string[];
  stats?: StatItem[];
  contact?: {
    phone?: string;
  };
};

const allProperties = properties as PropertyRecord[];
const DEFAULT_WHATSAPP_NUMBER = "919818223111";

const TYPE_LABELS: Record<string, string> = {
  highrise: "High Rise",
  villa: "Villa",
  commercial: "Commercial",
  plot: "Plot",
  farmhouse: "Farmhouse",
  builder: "Builder Floor",
  freehold: "Freehold",
};

function getCategoryLabel(category = "") {
  return TYPE_LABELS[category] || category;
}

function cleanPhoneNumber(phone?: string) {
  const digits = String(phone || "").replace(/\D/g, "");

  if (!digits) return DEFAULT_WHATSAPP_NUMBER;
  if (digits.startsWith("91")) return digits;
  if (digits.length === 10) return `91${digits}`;

  return digits;
}

function getWhatsappUrl(property: PropertyRecord) {
  const number = cleanPhoneNumber(property.contact?.phone);
  const message = `Hi Paramshiv Estate, I am interested in ${property.title}.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function shortDescription(property: PropertyRecord) {
  const firstSentence = String(property.description || "")
    .split(".")
    .map((sentence) => sentence.trim())
    .find(Boolean);

  return firstSentence || `${property.title} in ${property.location}`;
}

function iconForFeature(feature = "") {
  const value = feature.toLowerCase();

  if (value.includes("pool")) return Waves;
  if (value.includes("gym") || value.includes("fitness")) return Dumbbell;
  if (value.includes("security") || value.includes("cctv")) return ShieldCheck;
  if (value.includes("green") || value.includes("garden")) return Trees;
  if (value.includes("kids") || value.includes("play")) return Baby;
  if (value.includes("parking")) return ParkingCircle;
  if (value.includes("club")) return Building2;
  if (value.includes("senior")) return Landmark;

  return Sparkles;
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-sm leading-6 text-white/55">{subtitle}</p>
      )}
    </div>
  );
}

export default function MobilePropertyDetails({
  property,
  onSchedule,
}: {
  property: PropertyRecord;
  onSchedule: () => void;
}) {
  const router = useRouter();
  const stats = property.stats ?? [];
  const features = property.features ?? [];
  const nearbyLocations = property.nearbyLocations ?? [];

  const summaryItems = [
    { label: "Type", value: property.propertyType || getCategoryLabel(property.category), icon: Building2 },
    { label: "Area", value: property.area || property.areaSize, icon: Gem },
    { label: "Configuration", value: property.beds || property.configurations?.[0], icon: Landmark },
    { label: "Bathrooms", value: property.baths ? `${property.baths} Bathrooms` : "", icon: Waves },
    { label: "Status", value: property.status || property.possession, icon: CheckCircle2 },
    { label: "Developer", value: property.developer, icon: ShieldCheck },
  ].filter((item) => item.value);

  const specGroups: Array<{ title: string; items: string[] }> = [
    { title: "Configurations", items: property.configurations },
    { title: "Unit Options", items: property.unitOptions },
    { title: "Payment Plan", items: property.paymentPlan },
  ].filter((group): group is { title: string; items: string[] } =>
    Boolean(group.items?.length)
  );

  const related = allProperties
    .filter(
      (item) => item.id !== property.id && item.category === property.category
    )
    .concat(allProperties.filter((item) => item.id !== property.id))
    .filter((item, index, arr) => arr.findIndex((entry) => entry.id === item.id) === index)
    .slice(0, 6);

  const whyItems = [
    {
      icon: Building2,
      title: property.propertyType || getCategoryLabel(property.category),
      text: property.area || shortDescription(property),
    },
    {
      icon: MapPin,
      title: property.location,
      text: property.nearbyLocations?.[0]
        ? `Connected with ${property.nearbyLocations[0]}`
        : shortDescription(property),
    },
    {
      icon: CalendarDays,
      title: property.possession || property.status || property.price,
      text: property.price,
    },
  ].filter((item) => item.title && item.text);

  return (
    <section className="md:hidden bg-[#080808] px-4 pb-10 pt-2 text-white">
      <div className="space-y-8">
        {summaryItems.length > 0 && (
          <div>
            <SectionHeader
              eyebrow="Property highlights"
              title="Key details at a glance"
              subtitle="A compact view of the specifications already shared for this property."
            />
            <div className="grid grid-cols-2 gap-3">
              {summaryItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={`${item.label}-${item.value}`}
                    className="min-h-[118px] rounded-[22px] border border-white/10 bg-white/[0.045] p-4"
                  >
                    <Icon size={18} className="text-[#D4AF37]" />
                    <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-white/38">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-5 text-white/85">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {stats.length > 0 && (
          <div className="overflow-hidden rounded-[28px] border border-[#D4AF37]/20 bg-[linear-gradient(145deg,rgba(212,175,55,0.14),rgba(255,255,255,0.04))] p-5">
            <SectionHeader
              eyebrow="Project signals"
              title="Numbers that matter"
            />
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div key={`${stat.number}-${stat.label}`} className="rounded-2xl bg-black/35 p-4">
                  <p className="text-2xl font-semibold text-[#D4AF37]">
                    {stat.number}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/62">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {features.length > 0 && (
          <div>
            <SectionHeader
              eyebrow="Amenities"
              title="Lifestyle and project features"
            />
            <div className="flex snap-x gap-3 overflow-x-auto pb-1 no-scrollbar">
              {features.map((feature) => {
                const Icon = iconForFeature(feature);

                return (
                  <div
                    key={feature}
                    className="min-w-[150px] snap-start rounded-[22px] border border-white/10 bg-[#111] p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D4AF37]/12 text-[#D4AF37]">
                      <Icon size={19} />
                    </div>
                    <p className="mt-4 text-sm font-medium leading-5 text-white/78">
                      {feature}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {nearbyLocations.length > 0 && (
          <div className="rounded-[28px] border border-white/10 bg-[#111] p-5">
            <SectionHeader
              eyebrow="Connectivity"
              title="Nearby location advantages"
            />
            <div className="space-y-3">
              {nearbyLocations.map((location) => (
                <div key={location} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/12">
                    <Route size={17} className="text-[#D4AF37]" />
                  </div>
                  <p className="text-sm text-white/72">{location}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {whyItems.length > 0 && (
          <div>
            <SectionHeader
              eyebrow="Why this property"
              title="What stands out"
              subtitle={shortDescription(property)}
            />
            <div className="space-y-3">
              {whyItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={`${item.title}-${item.text}`}
                    className="rounded-[22px] border border-white/10 bg-white/[0.045] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/12">
                        <Icon size={18} className="text-[#D4AF37]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold leading-5">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-white/55">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {specGroups.length > 0 && (
          <div>
            <SectionHeader
              eyebrow="Specifications"
              title="Available options"
            />
            <div className="space-y-4">
              {specGroups.map((group) => (
                <div key={group.title} className="rounded-[24px] border border-white/10 bg-[#111] p-4">
                  <h3 className="font-semibold text-[#D4AF37]">{group.title}</h3>
                  <div className="mt-3 space-y-2">
                    {group.items.map((item: string) => (
                      <div key={item} className="flex gap-2 text-sm leading-6 text-white/68">
                        <CheckCircle2 size={16} className="mt-1 shrink-0 text-[#D4AF37]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div>
            <SectionHeader
              eyebrow="Similar properties"
              title="Continue exploring"
            />
            <div className="flex snap-x gap-4 overflow-x-auto pb-2 no-scrollbar">
              {related.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => router.push(`/property/${item.id}`)}
                  className="min-w-[245px] snap-start overflow-hidden rounded-[24px] border border-white/10 bg-[#111] text-left"
                >
                  <div className="relative h-[165px]">
                    <img
                      src={item.images?.[0]}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[11px] text-[#D4AF37]">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="truncate text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 truncate text-xs text-white/50">
                      {item.location}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-[#D4AF37]">
                      {item.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="relative overflow-hidden rounded-[30px] border border-[#D4AF37]/20 bg-[#111]">
          <img
            src={property.images?.[0]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative bg-gradient-to-t from-black via-black/82 to-black/50 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Next step
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight">
              Shortlist this property with an advisor.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/58">
              Schedule a visit or continue the conversation on WhatsApp.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={onSchedule}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-4 font-semibold text-black"
              >
                Schedule Visit
                <CalendarDays size={18} />
              </button>
              <a
                href={getWhatsappUrl(property)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.06] py-4 font-semibold text-white"
              >
                WhatsApp Advisor
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
