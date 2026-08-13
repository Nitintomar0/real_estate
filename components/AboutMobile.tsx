"use client";

import BackButton from "./BackButton";
import { motion } from "framer-motion";

export default function AboutMobile() {
  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen px-5 py-8 space-y-12">

      {/* BACK */}
      <BackButton />

      {/* HERO SECTION */}
      <section className="text-center space-y-4">
        <p className="text-[#D4AF37] text-xs tracking-widest">
          ABOUT PARAMSHIV ESTATE
        </p>

        <h1 className="text-4xl font-light leading-tight">
          Crafting{" "}
          <span className="text-[#D4AF37] font-semibold">
            Luxury Living
          </span>
        </h1>

        <p className="text-gray-400 text-sm max-w-sm mx-auto">
          We redefine real estate with premium properties designed for
          elegance, comfort, and long-term value.
        </p>
      </section>

      {/* IMAGE HERO */}
      <section>
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          className="rounded-2xl object-cover w-full h-[220px]"
        />
      </section>




      <section className="py-20 px-6 bg-[#0B0B0B] text-white">

        <div className="max-w-3xl mx-auto">

          {/* QUOTE */}
          <h2 className="font-serif-luxury text-2xl leading-relaxed text-gray-200">
            “The house you looked at today and wanted to think about until tomorrow
            may be the same house someone looked at yesterday and will buy today.”
          </h2>

          {/* LINE (luxury touch) */}
          <div className="w-16 h-[2px] bg-[#D4AF37] my-8"></div>

          {/* PROFILE */}
          <div className="flex items-center gap-4 mb-6">

            <img
              src="https://res.cloudinary.com/dbl5y5rvh/image/upload/v1779716185/founder_zzfima.png"
              className="w-14 h-14 rounded-full object-cover border border-[#D4AF37]"
            />

            <div>
              <p className="text-sm font-semibold tracking-wide">
                Ravi Jadon
              </p>
              <p className="text-xs text-gray-400">
                Managing Director
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-400 text-sm leading-relaxed space-y-4">
            Paramshiv Estate is a premium real estate platform dedicated to helping
            individuals and families discover luxury homes, modern villas, and
            high-value investment properties across prime locations in India.
            We specialize in curated real estate solutions that combine
            architectural excellence, strategic location advantages, and long-term
            value appreciation.

            <br /><br />

            With a deep understanding of the real estate market, our team focuses on
            delivering personalized property recommendations tailored to each
            client’s lifestyle, preferences, and investment goals. Whether you are
            looking to buy your dream home, invest in premium real estate, or explore
            high-growth property opportunities, Paramshiv Estate ensures a seamless
            and transparent experience at every step.

            <br /><br />

            Our portfolio includes luxury villas, gated community homes, premium
            apartments, and investment-driven plots designed for both comfort and
            future returns. We collaborate with trusted developers and verified
            projects to ensure that every property listed on our platform meets the
            highest standards of quality, legal compliance, and modern living.

            <br /><br />

            At Paramshiv Estate, trust, transparency, and customer satisfaction are
            at the core of everything we do. Our mission is to redefine the real
            estate experience by combining technology, market expertise, and
            personalized service to help you make confident property decisions.

            <br /><br />

            If you are searching for luxury real estate in Bangalore, premium villas,
            or high-return investment properties, Paramshiv Estate is your trusted
            partner in finding the perfect property that matches your vision and
            lifestyle.
          </p>

        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      {/* <section className="text-center space-y-6">
        <h2 className="text-xl font-light">
          Experience That Defines Excellence
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {[
            { number: "100+", label: "Properties" },
            { number: "50+", label: "Clients" },
            { number: "3+", label: "Years" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <h3 className="text-lg font-semibold text-[#D4AF37]">
                {item.number}
              </h3>
              <p className="text-xs text-gray-400">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section> */}
      <section className="space-y-12">

        <h2 className="text-2xl text-center text-[#D4AF37] font-light tracking-wide">
          Board of Directors
        </h2>

        {/* MEMBER 1 */}
        <div className="space-y-4">
          <img
            src="https://res.cloudinary.com/dbl5y5rvh/image/upload/v1779716185/founder_zzfima.png"
            className="w-full h-[280px] object-cover rounded-xl"
          />

          <div className="mt-6">

            {/* NAME */}
            <h3 className="text-lg font-luxury tracking-wide text-white">
              Ravi Jadon
            </h3>

            {/* DESIGNATION */}
            <p className="text-[#D4AF37] text-xs tracking-widest mt-1 uppercase">
              Managing Director
            </p>

            {/* LINE (luxury divider) */}
            <div className="w-12 h-[1px] bg-[#D4AF37] mt-4 mb-4"></div>

            {/* DESCRIPTION */}
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              With over 30 years of experience in real estate, land development,
              and construction, he has played a key role in shaping premium
              residential developments across Bangalore. His strategic vision,
              commitment to quality, and deep industry expertise have helped
              Paramshiv Estate deliver projects that stand for trust,
              long-term value, and architectural excellence.
            </p>

          </div>
        </div>

        {/* MEMBER 2 */}
        <div className="space-y-4">
          <img
            src="https://res.cloudinary.com/dbl5y5rvh/image/upload/v1779716191/nitin_uoi9bn.png"
            className="w-full h-[280px] object-cover rounded-xl"
          />

          <div className="mt-6">

            {/* NAME */}
            <h3 className="text-lg font-luxury tracking-wide text-white">
              Nitin Tomar
            </h3>

            {/* DESIGNATION */}
            <p className="text-[#D4AF37] text-xs tracking-widest mt-1 uppercase">
              Digital & Technology Lead
            </p>

            {/* LINE (luxury divider) */}
            <div className="w-12 h-[1px] bg-[#D4AF37] mt-4 mb-4"></div>

            {/* DESCRIPTION */}
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              Leading the digital vision of Paramshiv Estate, Nitin oversees website development, application systems, and the complete technology ecosystem. Focused on creating seamless, high-performance platforms, he ensures every digital interaction reflects the same level of precision, innovation, and luxury as the properties themselves.
            </p>

          </div>
        </div>

      </section>

      <section className="py-16 px-6 space-y-16">

        {/* EXPERIENCE */}
        <div className="text-center space-y-4">

          <p className="text-xs tracking-widest text-[#D4AF37]">
            EXPERIENCE
          </p>

          <h2 className="text-2xl font-light leading-snug">
            30+ Years of Excellence in
            <span className="text-[#D4AF37]"> Real Estate</span>
          </h2>

          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mt-4"></div>

          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Delivering premium developments with a focus on trust,
            innovation, and long-term value creation across prime locations.
          </p>

        </div>


        {/* COMMITMENT */}
        <div className="space-y-4">

          <h3 className="text-lg font-light">
            Our <span className="text-[#D4AF37]">  Commitment</span>
          </h3>

          <div className="w-12 h-[1px] bg-[#D4AF37]"></div>

          <p className="text-gray-400 text-sm leading-relaxed">
            At Paramshiv Estate, we are committed to delivering
            transparency, quality, and long-term value in every project.
            From property selection to final ownership, we ensure a seamless,
            trustworthy, and premium experience for every client.
          </p>

        </div>


        {/* WHY CHOOSE US */}
        <div className="space-y-6">

          <h3 className="text-lg font-light">
            Why <span className="text-[#D4AF37]">Choose Us</span>
          </h3>

          <div className="w-12 h-[1px] bg-[#D4AF37]"></div>

          <div className="space-y-4">

            {[
              "Premium locations across high-growth areas",
              "Trusted by clients with proven track record",
              "Luxury-focused architectural design approach",
              "Transparent and hassle-free buying process",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3"
              >
                {/* GOLD DOT */}
                <div className="w-2 h-2 mt-2 rounded-full bg-[#D4AF37]" />

                <p className="text-gray-400 text-sm leading-relaxed">
                  {item}
                </p>
              </div>
            ))}

          </div>

        </div>

      </section>



      {/* CTA */}
      <section className="text-center space-y-4 pb-10">
        <h2 className="text-lg font-light">
          Let’s Build Your Dream Together
        </h2>

        <button className="px-6 py-3 bg-[#D4AF37] text-black rounded-full font-semibold">
          Contact Us
        </button>
      </section>

    </div>
  );
}