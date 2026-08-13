"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Sparkles,
  X,
  Check,
  Loader2,
} from "lucide-react";

const messages = [
  "Looking for luxury properties?",
  "Book your free consultation.",
  "Find your dream property today.",
  "Discover premium villas in Noida.",
  "Luxury living starts here.",
  "Schedule your private property tour.",
  "Exclusive properties curated for you.",
  "Experience modern luxury real estate.",
  "Your dream home is waiting.",
  "Get personalized property assistance.",
  "Find elite homes with expert guidance.",
  "Luxury investment opportunities await.",
];

export default function FloatingContact({ setPopupOpen }: any) {
  const [miniOpen, setMiniOpen] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [typedText, setTypedText] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkMobile();

  window.addEventListener("resize", checkMobile);

  return () => {
    window.removeEventListener("resize", checkMobile);
  };

}, []);
  useEffect(() => {
    const firstTimer = setTimeout(() => {
      setMiniOpen(true);

      setTimeout(() => {
        setMiniOpen(false);
      }, 12000);
    }, 8000);

    const interval = setInterval(() => {
      setMiniOpen(true);

      setMessageIndex((prev) => (prev + 1) % messages.length);

      setTimeout(() => {
        setMiniOpen(false);
      }, 12000);
    }, 120000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

useEffect(() => {

  const handleClickOutside = (e: MouseEvent) => {

    const target = e.target as HTMLElement;

    if (
  !target.closest(".floating-ai-container") &&
  !target.closest(".floating-ai-button")
) {
      setMiniOpen(false);
    }

  };

  document.addEventListener("pointerdown", handleClickOutside);

  return () => {
    document.removeEventListener(
  "pointerdown",
  handleClickOutside
);
  };

}, []);

  useEffect(() => {

  if (!miniOpen) {
    setTypedText("");
    return;
  }

  const currentText = messages[messageIndex];

  let index = 0;

  setTypedText("");

  const typingInterval = setInterval(() => {

    setTypedText(currentText.slice(0, index));

    index++;

    if (index > currentText.length) {
      clearInterval(typingInterval);
    }

  }, 40);

  const messageTimeout = setTimeout(() => {

    setMessageIndex((prev) =>
      (prev + 1) % messages.length
    );

  }, 4000);

  return () => {
    clearInterval(typingInterval);
    clearTimeout(messageTimeout);
  };

}, [miniOpen, messageIndex]);

  return (
<div className="floating-contact-fix">
      {/* FORM */}
      <AnimatePresence>

        {miniOpen && !isMobile ? (

          <motion.div
          onClick={(e) => e.stopPropagation()}
       

            initial={{
  opacity: 0,
  scale: 0.2,
  borderRadius: "999px",
  y: 100,
}}

            animate={{
  opacity: 1,
  scale: 1,
  borderRadius: "38px",
  y: 0,
}}

            exit={{
  opacity: 0,
  scale: 0.2,
  borderRadius: "999px",
  y: 100,
}}

            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}

            className="
            floating-ai-container
              absolute bottom-[35px] right-[10px]
              w-[420px]
              rounded-[38px]
              border border-[#D4AF37]/10
              bg-[#050505]/95
              backdrop-blur-3xl
              p-7
              shadow-[0_25px_120px_rgba(0,0,0,0.85)]
              overflow-hidden
            "
          >

            {/* GLOW */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#D4AF37]/20 via-transparent to-transparent pointer-events-none" />

            {/* TOP */}
            <div className="relative flex items-start justify-between mb-5">

              <div>

                <div className="flex items-center gap-2 mb-3">

                  <div className="w-7 h-7 rounded-full bg-[#D4AF37]/15 flex items-center justify-center border border-[#D4AF37]/20">

                    <Sparkles
                      size={14}
                      className="text-[#D4AF37]"
                    />

                  </div>

                  <p className="text-[#D4AF37] text-[10px] tracking-[3px] uppercase font-medium">
                    Luxury Assistant
                  </p>

                </div>

                <h3 className="
text-[34px]
font-semibold
text-white
leading-[1.1]
tracking-[-1px]
max-w-[320px]
">
                  {typedText}

<motion.span
  animate={{
    opacity: [0, 1, 0],
  }}
  transition={{
    repeat: Infinity,
    duration: 1,
  }}
  className="text-[#D4AF37]"
>
  |
</motion.span>
                </h3>

              </div>

              <button
                onClick={() => setMiniOpen(false)}
                className="text-white/40 hover:text-white transition"
              >
                <X size={18} />
              </button>

            </div>

            {/* FORM */}
            <div
  className="relative space-y-3"
  onClick={(e) => e.stopPropagation()}
>

              <input
              onClick={(e) => e.stopPropagation()}
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  w-full h-14 rounded-[20px]
                  bg-white/[0.03]
                  border border-[#D4AF37]/10
                  px-5
                  text-white
                  placeholder:text-white/30
                  outline-none
                  transition-all
                  focus:border-[#D4AF37]/40
                  focus:bg-white/[0.05]
                "
              />

              <input
              onClick={(e) => e.stopPropagation()}
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="
                  w-full h-14 rounded-2xl
                  bg-white/[0.03]
                  border border-[#D4AF37]/10
                  px-5
                  text-white
                  placeholder:text-white/30
                  outline-none
                  transition-all
                  focus:border-[#D4AF37]/40
                  focus:bg-white/[0.05]
                "
              />

              <input
              onClick={(e) => e.stopPropagation()}
                placeholder="Your City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="
                  w-full h-14 rounded-2xl
                  bg-white/[0.03]
                  border border-[#D4AF37]/10
                  px-5
                  text-white
                  placeholder:text-white/30
                  outline-none
                  transition-all
                  focus:border-[#D4AF37]/40
                  focus:bg-white/[0.05]
                "
              />

              {/* BUTTON */}
              <button
                onClick={async (e) => {
                  e.stopPropagation();

                  if (!name || !phone || !city) {
                    return;
                  }
                  setIsSubmitting(true);
                  await fetch("/api/leads", {
                    
                    method: "POST",
                    body: JSON.stringify({
                      name,
                      phone,
                      city,
                      type: "Mini Floating Lead",
                    }),
                  });

                  setName("");
                  setPhone("");
                  setCity("");

                  setIsSubmitting(false);

setSubmitted(true);

setTimeout(() => {

  setSubmitted(false);

  setMiniOpen(false);

}, 2600);

                }}

                className="
relative overflow-hidden
w-full h-14
rounded-[20px]
bg-gradient-to-r
from-[#D4AF37]
to-[#F5D061]
text-black
font-semibold
text-[15px]
tracking-wide
transition-all duration-500
hover:scale-[1.02]
hover:shadow-[0_10px_40px_rgba(212,175,55,0.35)]
"
              >

                <span className="relative z-10 flex items-center justify-center gap-2">

  {isSubmitting ? (

    <Loader2
      size={18}
      className="animate-spin"
    />

  ) : submitted ? (

    <>
      <Check size={18} />
      Request Sent
    </>

  ) : (

    "Schedule Callback"

  )}

</span>

              </button>
              <AnimatePresence>

  {submitted && (

    <motion.div
    onClick={(e) => e.stopPropagation()}

      initial={{
        opacity: 0,
        y: 10,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      exit={{
        opacity: 0,
        y: 10,
      }}

      className="
      mt-4
      flex items-center justify-center gap-2
      text-[#D4AF37]
      text-sm
      font-medium
      "
    >

      <Check size={16} />

      Your request has been submitted successfully

    </motion.div>

  )}

</AnimatePresence>

            </div>

          </motion.div>
          

        ) : null}

      </AnimatePresence>

      {/* FLOAT BUTTON */}
      <AnimatePresence>
      {!miniOpen && (

<motion.button

        animate={{
          y: [0, -10, 0],
        }}

        transition={{
          repeat: Infinity,
          duration: 2.2,
        }}

        whileTap={{
          scale: 0.92,
        }}

        onClick={() => {

  if (isMobile) {

    setPopupOpen(true);

    return;
  }

  setMiniOpen((prev) => !prev);

}}

        className="
floating-ai-button
fixed
bottom-[90px]
right-4
md:bottom-6
md:right-6
z-[999999999]

w-[70px]
h-[70px]

rounded-[24px]

bg-[rgba(10,10,10,0.75)]

border border-[#D4AF37]/20

backdrop-blur-2xl

flex items-center justify-center

shadow-[0_20px_80px_rgba(0,0,0,0.85)]

transition-all duration-500

hover:scale-110
hover:border-[#D4AF37]/40
hover:shadow-[0_20px_90px_rgba(212,175,55,0.18)]

group
overflow-hidden
"
      >

        {/* RING */}
        {/* GOLD GLOW */}
<div className="
absolute inset-0
bg-gradient-to-br
from-[#D4AF37]/20
via-transparent
to-transparent
opacity-70
" />

{/* PULSE */}
<div className="
absolute inset-0
rounded-[24px]
border border-[#D4AF37]/20
animate-pulse
" />

{/* ICON */}
<MessageCircle
  size={26}
  className="
text-[#F5D061]
relative z-10
transition-all duration-300
group-hover:scale-110
group-hover:text-white
"
/>



      </motion.button>

)}
  </AnimatePresence>
    </div>
  );
}