"use client";
import { useState } from "react";


export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });


  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.message) {
      alert("Please fill required fields");
      return;
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ MUST
        },
        body: JSON.stringify({
          ...form,
          type: "Contact", // ✅ MUST
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Message sent successfully!");

        setForm({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        alert("Failed to send");
      }

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };


  return (

    <section className="bg-[#0B0B0B] text-white py-20 px-6">
      <h2 className="text-3xl font-bold text-center mb-10">
        Get in Touch
      </h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto space-y-6"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          placeholder="Your Name"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:border-[#D4AF37] outline-none"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Your Email"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:border-[#D4AF37] outline-none"
        />

        <input
          type="text"
          name="phone"
          value={form.phone}
          placeholder="Phone Number"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:border-[#D4AF37] outline-none"
        />

        <textarea
          name="message"
          value={form.message}
          placeholder="Your Message"
          rows={4}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:border-[#D4AF37] outline-none"
        ></textarea>

        <button
          type="submit"
          className="w-full py-3 bg-[#D4AF37] text-black rounded-lg hover:scale-105 transition"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
