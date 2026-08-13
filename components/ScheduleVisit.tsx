"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, CalendarDays, Phone, Building2 } from "lucide-react";
import { createPortal } from "react-dom";

export default function ScheduleVisit({ open, setOpen, property }: any) {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (typeof window === "undefined") return null;

  return createPortal(

    <AnimatePresence mode="wait">

      {open && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999999999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
        >

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md"></div>

          {/* MAIN BOX */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
            className="relative z-50 w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-[0_0_80px_rgba(212,175,55,0.15)] grid md:grid-cols-2"
          >

            {/* CLOSE */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
            >
              <X size={20} />
            </button>

            {/* LEFT SIDE */}
            <div className="relative hidden md:flex min-h-[650px]">

              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* CONTENT */}
              <div className="relative z-10 p-10 flex flex-col justify-end">

                <p className="text-[#D4AF37] uppercase tracking-[4px] text-sm mb-4">
                  Schedule Luxury Visit
                </p>

                <h2 className="text-5xl font-bold leading-tight mb-6">
                  Experience <br />
                  Premium Living
                </h2>

                <p className="text-gray-300 leading-relaxed mb-10">
                  Book an exclusive property tour and
                  discover luxury spaces crafted for modern living.
                </p>

                {/* FEATURES */}
                <div className="space-y-5">

                  <div className="flex items-center gap-3 text-gray-300">
                    <Building2 className="text-[#D4AF37]" size={18} />
                    Verified Luxury Properties
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="text-[#D4AF37]" size={18} />
                    Dedicated Property Consultant
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <CalendarDays className="text-[#D4AF37]" size={18} />
                    Flexible Site Visit Scheduling
                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="relative p-8 md:p-12 bg-black">

              {/* GLOW */}
              <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-[#D4AF37]/10 blur-[120px]" />

              <div className="relative z-10">

                <p className="text-[#D4AF37] uppercase tracking-[4px] text-xs mb-3">
                  Property Visit
                </p>

                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  Schedule Your Visit
                </h2>

                <p className="text-gray-400 leading-relaxed mb-8">
                  Property:
                  <span className="text-white font-medium ml-2">
                    {property}
                  </span>
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
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl bg-[#050505] border border-white/10 focus:border-[#D4AF37] outline-none transition-all"
                  />

                  {/* BUTTON */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}

                    onClick={async () => {

                      if (!name || !phone || !date) {
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
                          date,
                          property,
                          type: "Visit",
                        }),
                      });

                      setLoading(false);
                      setSuccess(true);

                      setName("");
                      setPhone("");
                      setDate("");

                      setTimeout(() => {
                        setSuccess(false);
                        setOpen(false);
                      }, 2500);

                    }}

                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black font-semibold text-lg shadow-[0_10px_40px_rgba(212,175,55,0.35)]"
                  >
                    {loading ? "Scheduling Visit..." : "Schedule Luxury Visit"}
                  </motion.button>

                </div>

                {/* SUCCESS */}
                <AnimatePresence>

                  {success && (

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4"
                    >
                      <p className="text-green-400 font-semibold">
                        Visit Scheduled Successfully
                      </p>

                      <p className="text-gray-400 text-sm mt-1">
                        Our team will contact you shortly.
                      </p>
                    </motion.div>

                  )}

                </AnimatePresence>

                {/* ERROR */}
                <AnimatePresence>

                  {error && (

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>

                  )}

                </AnimatePresence>

                {/* TEXT */}
                <p className="text-xs text-gray-500 mt-6 leading-relaxed">
                  By submitting this form you agree to receive
                  calls, WhatsApp messages and updates regarding
                  your property visit.
                </p>

              </div>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>,

    document.body

  );
}