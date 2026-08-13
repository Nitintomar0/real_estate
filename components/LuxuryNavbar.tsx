"use client";
import Image from "next/image";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
    NavbarLogo,
} from "@/components/ui/resizable-navbar";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LuxuryNavbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);


    const navItems = [
    {
        name: "Home",
        link: "/",
        onClick: () => router.push("/")
    },

    {
        name: "About",
        link: "/about",
        onClick: () => router.push("/about")
    },

    {
name: "Commercial",
link: "#commercial",

onClick: () => {

    const section = document.getElementById("commercial-section");

    // IF SECTION EXISTS
    if (section) {

        section.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

        return;
    }

    // IF USER IS ON ABOUT/CONTACT PAGE
    sessionStorage.setItem("scrollToCommercial", "true");

    router.push("/");
}


},


    {
        name: "Contact",
        link: "/contact",
        onClick: () => router.push("/contact")
    },
];



useEffect(() => {

const shouldScroll = sessionStorage.getItem("scrollToCommercial");

if (shouldScroll) {


setTimeout(() => {

  const section = document.getElementById("commercial-section");

  if (section) {

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  }

  sessionStorage.removeItem("scrollToCommercial");

}, 500);


}

}, []);

    return (
        <div className="relative w-full">
            <Navbar>

                {/* DESKTOP */}
                <NavBody>
                    
                    <NavbarLogo />

                    <NavItems items={navItems} />

                    <div className="flex items-center gap-4">
                        
                        
                        <button
                            onClick={() => {
  const event = new CustomEvent("open-global-popup");
  window.dispatchEvent(event);
}}
                            className="px-6 py-2 rounded-full font-semibold text-[#2B2B2B]
bg-gradient-to-r
from-[#F9E7A7]
via-[#E5C45A]
to-[#C89A2B]
border border-[#D4AF37]/40
hover:scale-105
hover:shadow-[0_10px_25px_rgba(212,175,55,0.35)]
transition-all duration-300"
                        >
                            Book a call
                        </button>
                    </div>
                </NavBody>

                {/* MOBILE */}
                <MobileNav>
                    <MobileNavHeader>
                        <Image
  src="/logo.png"
  alt="Paramshiv Estate"
  width={140}
  height={40}
  className="object-contain"
/>

                        <MobileNavToggle
                            isOpen={isOpen}
                            onClick={() => setIsOpen(!isOpen)}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                    >
                        {navItems.map((item, i) => (
                            <p
                                key={i}
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(false);
                                }}
                                className="cursor-pointer text-white"
                            >
                                {item.name}
                            </p>
                        ))}
                    </MobileNavMenu>

                </MobileNav>

            </Navbar>
        </div>
    );
}