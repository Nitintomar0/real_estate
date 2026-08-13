"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-6 left-6 z-[9999] flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/40 text-white/80 hover:text-[#D4AF37] bg-black/40 backdrop-blur-md hover:bg-[#D4AF37]/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300"
    >
      <ArrowLeft size={18} />
      <span className="text-sm">Back</span>
    </button>
  );
}