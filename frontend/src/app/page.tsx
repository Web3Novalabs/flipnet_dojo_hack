"use client";

import React from "react";
import Header from "@/components/header_main";
import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="">
      <Header />
      <Hero />
      <HowItWorks />
      <Footer />
    </div>
  );
}
