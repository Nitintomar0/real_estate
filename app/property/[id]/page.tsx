"use client";

import { useParams } from "next/navigation";

import { properties } from "@/components/data/properties";

import HighriseLayout from "@/components/property-layouts/HighriseLayout";
import PlotLayout from "@/components/property-layouts/PlotLayout";
import VillaLayout from "@/components/property-layouts/VillaLayout";
import BuilderLayout from "@/components/property-layouts/BuilderLayout";
import FarmHouseLayout from "@/components/property-layouts/FarmHouseLayout";

export default function PropertyPage() {

  const params = useParams();

  const property = properties.find(
    (p) => p.id === params.id
  );

  if (!property) {
    return (
      <div className="text-white p-10">
        Property Not Found
      </div>
    );
  }

  if (property.layout === "luxury") {
    return (
      <HighriseLayout property={property} />
    );
  }
  if (property.layout === "plot") {
  return <PlotLayout property={property} />;
}

if (property.layout === "villa") {
  return <VillaLayout property={property} />;
}

if (property.layout === "builder") {
  return <BuilderLayout property={property} />;
}

if (property.layout === "farmhouse") {
  return <FarmHouseLayout property={property} />;
}

  return (
    <div className="text-white p-10">
      No Layout Found
    </div>
  );
}