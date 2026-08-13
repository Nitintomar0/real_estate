"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";


export function Navbar({ children }: any) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) setScrolled(true);
    else setScrolled(false);
  });

  return (
    <motion.nav
      animate={{
        width: scrolled ? "60%" : "90%",
        borderRadius: scrolled ? "999px" : "16px",
        y: scrolled ? 10 : 20,
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed left-1/2 top-0 z-50 -translate-x-1/2
backdrop-blur-2xl
bg-[rgba(255,255,255,0.88)]
border border-[#E5E7EB]
shadow-[0_15px_45px_rgba(0,0,0,0.12)]"
    >
      {children}
    </motion.nav>
  );
}

export function NavBody({ children }: any) {
  return (
    <div className="flex items-center justify-between px-6 py-3">
      {children}
    </div>
  );
}

export function NavItems({ items }: any) {
  return (
    <div className="hidden md:flex gap-8 text-gray-300">
      {items.map((item: any, i: number) => (
        <p
          key={i}
          onClick={item.onClick}
          className="cursor-pointer text-[#1F2937] text-[17px] font-semibold tracking-wide hover:text-[#C79A2E] transition-all duration-300"
        >
          {item.name}
        </p>
      ))}
    </div>
  );
}


import Link from "next/link";
import Image from "next/image";

export function NavbarLogo() {
  return (
    <Link href="/">
      <Image
        src="/logo1.png"
        alt="Paramshiv Estate"
        width={210}
        height={60}
        priority
        className="h-14 w-auto object-contain"
      />
    </Link>
  );
}
export function NavbarButton({ children, onClick, className }: any) {
  return (
    <button
      onClick={onClick}   // 🔥 THIS IS THE FIX
      className={`px-5 py-2 rounded-full cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

/* MOBILE (KEEP SAME) */
export function MobileNav({ children }: any) {
  return <div className="md:hidden">{children}</div>;
}

export function MobileNavHeader({ children }: any) {
  return <div className="flex justify-between p-4">{children}</div>;
}

export function MobileNavToggle({ isOpen, onClick }: any) {
  return (
    <button onClick={onClick}>{isOpen ? "✕" : "☰"}</button>
  );
}

export function MobileNavMenu({ isOpen, children }: any) {
  if (!isOpen) return null;
  return (
  <div className="bg-[rgba(15,18,24,0.92)] backdrop-blur-xl rounded-2xl m-3 p-5 border border-white/10">
    {children}
  </div>
);
}