"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
export default function PropertyCard({ property }: any) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const router = useRouter();
  return (
    <motion.div
  whileHover={{ scale: 1.05 }}
  onClick={() => router.push(`/property/${property.id}`)}
  className="cursor-pointer bg-[#111] rounded-xl overflow-hidden border border-gray-800 hover:border-[#D4AF37] transition duration-300"
>
      <div className="property-card overflow-hidden">
        <Image
  src={property.image}
  alt="property"
  width={500}
  height={300}
  className="w-full h-60 object-cover"
/>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold">{property.title}</h2>

        <p className="text-gray-400 text-sm mt-1">
          {property.location}
        </p>

        <div className="flex justify-between text-sm mt-3 text-gray-300">
          <span>🛏 {property.beds} Beds</span>
          <span>📐 {property.area}</span>
        </div>

        <button className="mt-4 w-full border border-[#D4AF37] py-2 rounded-lg hover:bg-[#D4AF37] hover:text-black transition">
          View Details
        </button>
      </div>
    </motion.div>
  );
}