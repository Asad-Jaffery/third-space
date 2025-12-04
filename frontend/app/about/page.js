"use client";

import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function About() {
  return (
    <div className="min-h-screen bg-[#3a3a3a]">
      <SiteHeader />
      <main className="bg-white pl-5 pr-5 px-6 py-8">
        <div className="bg-[#023020] rounded-lg px-8 py-10 mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#c8d5b9] mb-4">
            {/* Sage Green */}
            About Thyrd Spaces
          </h1>
          <p className="text-lg text-[#FFFFFF] leading-relaxed">
            Discover and share community third spaces in Seattle
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#023020] mb-4">Our goal</h2>
          <p className="text-base text-[#4a4a4a] leading-relaxed mb-4">
            Thyrd Spaces is dedicated to helping people discover and share their thoughts on spaces throughout Seattle. This will
            Help faciliate a more informed enviroment, about third spaces around Seattle.
            We believe that third spaces outside of home and work are essential for living life and has been stripped from communites because 
            of capitalism. 
          </p>
          <p className="text-base text-[#4a4a4a] leading-relaxed">
            Whether it's a cozy park, a quiet library, a scary altar, or a vibrant community center, 
            these spaces provide opportunities for people to gather, connect, and build meaningful relationships.
            These spaces exist but are unknown to the masses, so this website exists to give exposure
            and make third spaces be vieweable in one allocated area to parse through and pick for an event,
            regular hangout, or constant community meetings.
          </p>
        </section>

        <section className="mb-12 bg-[#c8d5b9] rounded-lg p-6">
          <h2 className="text-3xl font-bold text-[#023020] mb-4">
            What Are Third Spaces?
          </h2>
          <p className="text-base text-[#4a4a4a] leading-relaxed mb-4">
            We define third spaces as an area or place that has no price barrier i.e. pay to sit at a cafe. Any cost is a barrier even if
            it is sliding scale, all cost becomes a barrier. Our second criteria is that space should be able to faciliate a group existing in
            that area, i.e. a space could be free, but theres a lot of cops nearby and therefore the existing of people in that space cannot be.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}