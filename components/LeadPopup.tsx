"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  Loader2,
  Phone,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import {
  normalizeIndianMobileNumber,
  validateVisitorName,
} from "@/components/visitor-interest/validation";
import { submitLeadWithVisitorInterest } from "@/components/visitor-interest/submit";

type LeadPopupProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onDismiss?: () => void;
};

type FormErrors = {
  name?: string;
  phone?: string;
  submit?: string;
};

function Confetti({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => ({
        id: index,
        x: (index % 10) * 18 - 80,
        drift: ((index * 37) % 120) - 60,
        delay: index * 0.012,
        color: ["#D4AF37", "#F5D061", "#FFFFFF", "#6EE7B7"][index % 4],
      })),
    []
  );

  if (!active || reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-24 z-30 flex justify-center overflow-visible">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          initial={{ opacity: 0, x: piece.x, y: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: piece.x + piece.drift,
            y: [0, -90, 120],
            rotate: 220 + piece.id * 24,
          }}
          transition={{
            duration: 1.55,
            delay: piece.delay,
            ease: "easeOut",
          }}
          className="absolute h-2.5 w-1.5 rounded-[2px]"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
}

export default function LeadPopup({
  isOpen,
  setIsOpen,
  onDismiss,
}: LeadPopupProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);

    return () => {
      if (closeTimer.current) {
        window.clearTimeout(closeTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setSuccess(false);
    }
  }, [isOpen]);

  const closePopup = () => {
    setIsOpen(false);
    onDismiss?.();
  };

  const validateForm = () => {
    const nameResult = validateVisitorName(name);
    const normalizedPhone = normalizeIndianMobileNumber(phone);
    const nextErrors: FormErrors = {};

    if (nameResult.error) {
      nextErrors.name = nameResult.error;
    }

    if (!normalizedPhone) {
      nextErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !normalizedPhone) {
      return null;
    }

    return {
      name: nameResult.value,
      phone: normalizedPhone,
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const validated = validateForm();

    if (!validated) return;

    setLoading(true);
    setErrors({});

    try {
      await submitLeadWithVisitorInterest({
        lead: {
          name: validated.name,
          phone: validated.phone,
          type: "Lead",
        },
        activity: {
          source: "smart_visitor_interest",
          sourceLabel: "Smart Visitor Interest",
          details: {
            leadType: "Lead",
          },
        },
      });
      setSuccess(true);
      setName("");
      setPhone("");

      closeTimer.current = window.setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 2600);
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="sync">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 flex items-center justify-center bg-black/82 p-4 text-white backdrop-blur-xl"
          style={{
            zIndex: 999999999,
            position: "fixed",
            isolation: "isolate",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-[#D4AF37]/25 bg-[#050505]/95 shadow-[0_24px_90px_rgba(0,0,0,0.72),0_0_42px_rgba(212,175,55,0.12)] md:min-h-[620px] md:grid-cols-[0.95fr_1fr] md:overflow-hidden"
          >
            <button
              type="button"
              onClick={closePopup}
              aria-label="Close contact popup"
              className="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/80 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
            >
              <X size={20} />
            </button>

            <div className="relative hidden min-h-full overflow-hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop"
                alt=""
                fill
                sizes="(min-width: 768px) 46vw, 0px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.10),rgba(0,0,0,0.82)),linear-gradient(90deg,rgba(0,0,0,0.20),rgba(0,0,0,0.78))]" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.08)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />

              <div className="relative z-10 flex h-full flex-col justify-between p-9">
                <div className="inline-flex w-fit items-center gap-3 rounded-full border border-[#D4AF37]/25 bg-black/45 px-4 py-2 backdrop-blur-xl">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37] text-sm font-bold text-black">
                    PE
                  </span>
                  <span className="text-sm font-semibold">
                    Paramshiv Estate
                  </span>
                </div>

                <div className="max-w-sm">
                  <div className="mb-5 flex items-center gap-3 text-[#F5D061]">
                    <Building2 size={19} />
                    <span className="text-sm">Curated property guidance</span>
                  </div>
                  <p className="text-4xl font-semibold leading-tight">
                    A sharper shortlist starts with a quick conversation.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden px-5 py-7 sm:px-8 md:px-11 md:py-12">
              <Confetti active={success} />

              <div className="relative z-10">
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-3 py-2 text-sm text-[#F5D061]">
                  <Sparkles size={16} />
                  Property Interest
                </div>

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 24, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -18 }}
                      transition={{ duration: 0.32 }}
                      className="flex min-h-[390px] flex-col items-center justify-center text-center"
                    >
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.36, ease: "easeOut" }}
                        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/15 text-emerald-300 shadow-[0_0_38px_rgba(52,211,153,0.22)]"
                      >
                        <Check size={38} />
                      </motion.div>

                      <h2 className="text-3xl font-semibold">
                        You&apos;re All Set!
                      </h2>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-white/62">
                        Thank you for sharing your details. Our property expert
                        will connect with you soon.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.28 }}
                    >
                      <h2 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
                        Your Next Property Could Be the Right One.
                      </h2>
                      <p className="mt-4 max-w-xl text-sm leading-6 text-white/58 sm:text-base sm:leading-7">
                        You&apos;ve explored some exceptional properties. Share your
                        details and let our property experts help you discover
                        opportunities that match your interest.
                      </p>

                      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                        <div>
                          <label className="mb-2 block text-sm text-white/72">
                            Full Name
                          </label>
                          <div className="relative">
                            <UserRound
                              size={18}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                            />
                            <input
                              value={name}
                              onChange={(event) => setName(event.target.value)}
                              autoComplete="name"
                              placeholder="Enter your full name"
                              className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.035] pl-12 pr-4 text-white outline-none transition focus:border-[#D4AF37]/70 focus:bg-white/[0.055] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.08)]"
                            />
                          </div>
                          {errors.name && (
                            <p className="mt-2 text-sm text-red-300">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-white/72">
                            Mobile / WhatsApp Number
                          </label>
                          <div className="relative">
                            <Phone
                              size={18}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                            />
                            <input
                              value={phone}
                              onChange={(event) =>
                                setPhone(event.target.value)
                              }
                              inputMode="tel"
                              autoComplete="tel"
                              placeholder="9876543210"
                              className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.035] pl-12 pr-4 text-white outline-none transition focus:border-[#D4AF37]/70 focus:bg-white/[0.055] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.08)]"
                            />
                          </div>
                          {errors.phone && (
                            <p className="mt-2 text-sm text-red-300">
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        {errors.submit && (
                          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {errors.submit}
                          </div>
                        )}

                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileHover={{ scale: loading ? 1 : 1.015 }}
                          whileTap={{ scale: loading ? 1 : 0.985 }}
                          className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#D4AF37] px-5 text-base font-semibold text-black shadow-[0_12px_38px_rgba(212,175,55,0.28)] transition hover:bg-[#F5D061] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {loading ? (
                            <>
                              <Loader2 size={19} className="animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              Connect With a Property Expert
                              <ArrowRight size={19} />
                            </>
                          )}
                        </motion.button>
                      </form>

                      <p className="mt-5 text-xs leading-5 text-white/42">
                        We only save your property interest after you submit
                        this form.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
