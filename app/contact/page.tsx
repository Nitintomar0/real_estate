"use client";

import { useState } from "react";
import LuxuryNavbar from "@/components/LuxuryNavbar";
import gsap from "gsap";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function ContactPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const handleChange = (e: any) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e: any) => {
  e.preventDefault();

  if (!form.firstName || !form.phone) {
    alert("Please fill required fields");
    return;
  }

  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.firstName + " " + form.lastName, // combine
        email: form.email,
        phone: form.phone,
        message: form.message,
        type: "Contact", // 🔥 IMPORTANT
      }),
    });

    const data = await res.json();

    if (data.success) {
      setSuccess(true);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });

      setTimeout(() => setSuccess(false), 4000);
    } else {
      alert("Failed to send");
    }

  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};
  
  const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
});

  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen">
      <div className="absolute top-6 left-6 z-50">
  <button
    onClick={() => router.back()}
    className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] bg-black/40 backdrop-blur-md hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:bg-[#D4AF37]/10 transition-all duration-300"  >
    ← Back
  </button>
</div>
      {/* NAVBAR */}
      {/* <LuxuryNavbar /> */}

      {/* MAIN SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT SIDE */}
        <div>
          <p className="text-[#D4AF37] tracking-widest text-sm mb-4">
            GET IN TOUCH
          </p>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Let’s Find Your{" "}
            <span className="text-[#D4AF37]">Dream Property</span>
          </h1>

          <p className="mt-6 text-gray-400 max-w-md">
            Have questions or need personalized assistance? Our team is here
            to help you find the perfect property.
          </p>

          {/* CONTACT INFO */}
          {/* CONTACT INFO */}
<div className="mt-12 space-y-8">

  {/* Phone */}
  <div className="flex items-start gap-5">
    <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center text-lg flex-shrink-0">
      📞
    </div>

    <div>
      <p className="text-[#D4AF37] font-medium mb-2">Call Us</p>

      <div className="space-y-1">
        <p className="text-gray-300 hover:text-white transition">
          +91 98182 23111
        </p>

        <p className="text-gray-300 hover:text-white transition">
          +91 73038 12111
        </p>
      </div>
    </div>
  </div>

  {/* Email */}
  <div className="flex items-start gap-5">
    <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center text-lg flex-shrink-0">
      ✉
    </div>

    <div>
      <p className="text-[#D4AF37] font-medium mb-2">Email Us</p>

      <p className="text-gray-300 hover:text-white transition break-all">
        paramshivrealty111@gmail.com
      </p>
    </div>
  </div>

  {/* Address */}
  <div className="flex items-start gap-5">
    <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center text-lg flex-shrink-0">
      📍
    </div>

    <div>
      <p className="text-[#D4AF37] font-medium mb-2">
        Corporate Office
      </p>

      <div className="space-y-1 text-gray-300 leading-7">
        <p>Office No. 1111, 11th Floor</p>
        <p>Fusion Ufairia Mall</p>
        <p>Ek Murti Chowk</p>
        <p>Greater Noida West, Uttar Pradesh</p>
      </div>
    </div>
  </div>

</div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(212,175,55,0.15)]">

  <h2 className="text-2xl font-semibold mb-6">
    Send Us a Message
  </h2>

  <form onSubmit={handleSubmit}>

    {/* FIRST + LAST NAME */}
    <div className="grid grid-cols-2 gap-4">
      <input
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        placeholder="First Name"
        className="input"
        required
      />
      <input
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        placeholder="Last Name (Optional)"
        className="input"
      />
    </div>

    {/* EMAIL */}
    <input
      name="email"
      value={form.email}
      onChange={handleChange}
      placeholder="Your Email"
      className="input mt-4"
      required
    />

    {/* PHONE */}
    <input
      name="phone"
      value={form.phone}
      onChange={handleChange}
      placeholder="Phone Number"
      className="input mt-4"
      required
    />

    {/* MESSAGE */}
    <textarea
      name="message"
      value={form.message}
      onChange={handleChange}
      placeholder="Your Message (Optional)"
      className="input mt-4 h-32"
    />

    <button
      type="submit"
      className="w-full mt-6 py-3 rounded-xl bg-[#D4AF37] text-black font-semibold hover:scale-105 transition"
    >
      Send Message →
    </button>

  </form>
</div>
      </section>

      {/* WHY SECTION */}
      <section className="text-center py-20 px-6">
        <p className="text-[#D4AF37] text-sm tracking-widest">
          WHY CONTACT US?
        </p>

        <h2 className="text-4xl font-bold mt-4">
          We’re Here to Help You
        </h2>

        <div className="grid md:grid-cols-4 gap-8 mt-12 max-w-6xl mx-auto">

          {[
            "Expert Guidance",
            "Premium Properties",
            "Best Deals",
            "24/7 Support",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 p-6 rounded-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] transition"
            >
              <p className="text-[#D4AF37] mb-2">★</p>
              <h3 className="font-semibold">{item}</h3>
              <p className="text-gray-400 text-sm mt-2">
                Premium service tailored for you.
              </p>
            </div>
          ))}
          
          
        </div>
        
      </section>
      
    {success && (
  <div className="fixed inset-0 flex items-start justify-center pt-10 z-50 pointer-events-none">
    
    <div className="success-box">
      <p className="text-[#D4AF37] font-semibold">
        ✅ Thank you for contacting us!
      </p>
      <p className="text-gray-300 text-sm">
        Our team will reach out to you soon.
      </p>
    </div>

  </div>
)}
    </div>
    
  );
}