"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollFix() {
  const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh(); // 🔥 KEY FIX
    }, 300);
  }, [pathname]);

  return null;
}