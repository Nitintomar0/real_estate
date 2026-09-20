"use client";

import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import PropertyInterestTracker from "@/components/tracking/PropertyInterestTracker";

import { properties } from "@/components/data/properties";

import HighriseLayout from "@/components/property-layouts/HighriseLayout";
import PlotLayout from "@/components/property-layouts/PlotLayout";
import VillaLayout from "@/components/property-layouts/VillaLayout";
import BuilderLayout from "@/components/property-layouts/BuilderLayout";
import FarmHouseLayout from "@/components/property-layouts/FarmHouseLayout";

type PropertyPageRecord = {
  id: string;
  title: string;
  location?: string;
  layout?: string;
};

export default function PropertyPage() {

  const params = useParams();
  const propertyId = Array.isArray(params.id) ? params.id[0] : params.id;

  const property = properties.find(
    (p) => p.id === propertyId
  ) as (PropertyPageRecord & Record<string, unknown>) | undefined;

  if (!property) {
    return (
      <div className="text-white p-10">
        Property Not Found
      </div>
    );
  }

  const withTracking = (content: ReactNode) => (
    <>
      <PropertyInterestTracker
        property={{
          id: property.id,
          title: property.title,
          location: property.location || "",
        }}
      />
      {content}
    </>
  );

  if (property.layout === "luxury") {
    return withTracking(
      <HighriseLayout property={property} />
    );
  }
  if (property.layout === "plot") {
  return withTracking(<PlotLayout property={property} />);
}

if (property.layout === "villa") {
  return withTracking(<VillaLayout property={property} />);
}

if (property.layout === "builder") {
  return withTracking(<BuilderLayout property={property} />);
}

if (property.layout === "farmhouse") {
  return withTracking(<FarmHouseLayout property={property} />);
}

  return withTracking(
    <div className="text-white p-10">
      No Layout Found
    </div>
  );
}
