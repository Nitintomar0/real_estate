"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MapPin, Sparkles } from "lucide-react";
import { createPortal } from "react-dom";
export default function LeadPopup({ isOpen, setIsOpen }: any) {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [success, setSuccess] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [mounted, setMounted] = useState(false);
  useEffect(() => {

  setMounted(true);

  const alreadyShown = localStorage.getItem("popupShown");

  if (!alreadyShown) {

    const timer = setTimeout(() => {
      setIsOpen(true);
      localStorage.setItem("popupShown", "true");
    }, 8000);

    return () => clearTimeout(timer);
  }

}, []);

  if (!mounted) return null;

return createPortal(

  <AnimatePresence mode="sync">

    {isOpen && (

      <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
  className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
  style={{
    zIndex: 999999999,
    position: "fixed",
    isolation: "isolate",
  }}
>
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md"></div>
        <div className="relative z-50 w-full max-w-4xl md:h-[620px] overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-[0_0_80px_rgba(212,175,55,0.15)] grid md:grid-cols-2">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
            >
              <X size={20} />
            </button>

            {/* LEFT SIDE */}
            <div className="relative hidden md:flex items-end">

              <img
  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop"
  className="absolute inset-0 w-full h-full object-cover"
/>

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* CONTENT */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end">

                <div className="mb-6">

                  

                  

                  

                </div>

                {/* MINI FEATURES */}
                

              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="relative p-8 md:p-12 bg-black">

              {/* GOLD GLOW */}
              <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-[#D4AF37]/10 blur-[120px]" />

              <div className="relative z-10 w-full">

                <p className="text-[#D4AF37] uppercase tracking-[4px] text-xs mb-3">
                  Get Consultation
                </p>

                <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
                  Find Your Dream Property
                </h2>

                <p className="text-gray-400 mb-8 leading-relaxed">
                  Get exclusive deals, site visits,
                  pricing details, and expert consultation.
                </p>

                {/* FORM */}
                <div className="space-y-4">

                  <input
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl bg-[#050505] border border-white/10 focus:border-[#D4AF37] outline-none transition-all"
                  />

                  <input
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl bg-[#050505] border border-white/10 focus:border-[#D4AF37] outline-none transition-all"
                  />

                  <input
                    placeholder="Your City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl bg-[#050505] border border-white/10 focus:border-[#D4AF37] outline-none transition-all"
                  />

                  {/* BUTTON */}
                  <motion.button

                    whileHover={{
                      scale: 1.02
                    }}

                    whileTap={{
                      scale: 0.97
                    }}

                    onClick={async () => {

                      if (!name || !phone || !city) {
                        setError("Please fill all fields");
setTimeout(() => setError(""), 3000);
                        return;
                      }
                      setLoading(true);
                      await fetch("/api/leads", {
                        method: "POST",
                        body: JSON.stringify({
                          name,
                          phone,
                          city,
                          type: "Lead",
                        }),
                      });
                      setLoading(false);
                      setSuccess(true);

setTimeout(() => {
  setSuccess(false);
  setIsOpen(false);
}, 2500);

                      setName("");
                      setPhone("");
                      setCity("");

                    }}

                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black font-semibold text-lg shadow-[0_10px_40px_rgba(212,175,55,0.35)]"
                  >
                    {loading ? "Booking Consultation..." : "Book Free Consultation"}
                  </motion.button>

                </div>
                {/* SUCCESS MESSAGE */}
<AnimatePresence>

  {success && (

    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4"
    >
      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
          ✓
        </div>

        <div>
          <p className="text-green-400 font-semibold">
            Consultation Booked Successfully
          </p>

          <p className="text-gray-400 text-sm">
            Our luxury property expert will contact you shortly.
          </p>
        </div>

      </div>
    </motion.div>

  )}

</AnimatePresence>

{/* ERROR */}
<AnimatePresence>

  {error && (

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 text-sm"
    >
      {error}
    </motion.div>

  )}

</AnimatePresence>

                {/* BOTTOM TEXT */}
                <p className="text-xs text-gray-500 mt-6 leading-relaxed">
                  By submitting this form you agree to receive
                  calls, WhatsApp messages and updates regarding
                  premium property opportunities.
                </p>

              </div>

            </div>

         </div>

      </motion.div>

    )}

  </AnimatePresence>,

  document.body

);
}