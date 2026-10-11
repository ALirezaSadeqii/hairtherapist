'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/context';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6F3]">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-[#EAE0DA] bg-[#FAF6F3] py-16 sm:py-24 lg:py-28">
          {/* Subtle warm rose and alabaster glow */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-[#F5DFD9] rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-[#FCECE8] rounded-full blur-3xl opacity-70 pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Headline and CTAs */}
              <div className="lg:col-span-7 text-start space-y-6 sm:space-y-8">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7EBE7] border border-[#EED7D1] text-[#965B50] text-xs font-semibold tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C58B80]" />
                  {t.landing.heroBadge}
                </div>

                {/* Editorial Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-[#2A211D] leading-[1.16]">
                  {t.landing.heroTitle}
                </h1>

                {/* Subtitle */}
                <p className="max-w-xl text-base sm:text-lg text-[#6E5F5A] leading-relaxed font-sans font-light">
                  {t.landing.heroSubtitle}
                </p>

                {/* Hero CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link href="/book" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 tracking-wide uppercase text-xs">
                      {t.landing.bookCta}
                    </Button>
                  </Link>
                  <a href="#science" className="w-full sm:w-auto">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto tracking-wide uppercase text-xs">
                      {t.landing.learnMore}
                    </Button>
                  </a>
                </div>

                {/* Quiet Luxury Micro-features */}
                <div className="pt-4 border-t border-[#EAE0DA] flex flex-wrap gap-4 sm:gap-6 text-xs text-[#94847E]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C58B80]" />
                    <span>Bespoke 1-on-1 Sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C58B80]" />
                    <span>Evidence-Based Follicle Care</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C58B80]" />
                    <span>Serene Private Studio</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Salon Photo Frame */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative rounded-2xl overflow-hidden border border-[#EAE0DA] shadow-xl aspect-4/3 sm:aspect-5/4 group">
                    <Image
                      src="/images/salon-interior.jpg"
                      alt="Raha Hair Therapist Studio"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md border border-[#EAE0DA] rounded-xl p-3.5 sm:p-4 text-start shadow-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-[#2A211D] tracking-tight">Raha Hair Therapist Studio</p>
                          <p className="text-[11px] text-[#6E5F5A]">Private Atmosphere • Travertine & Linen Luxury</p>
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FACTUAL SCIENCE SECTION */}
        <section id="science" className="py-20 sm:py-28 border-b border-[#EAE0DA] bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Hair Treatment Photo */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden border border-[#EAE0DA] shadow-md aspect-4/5 group">
                  <Image
                    src="/images/hair-treatment.jpg"
                    alt="Restorative Follicle Care Session"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#EAE0DA] shadow-sm text-start">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#C58B80] block mb-0.5">
                      CLINICAL WELLNESS & THERAPY
                    </span>
                    <p className="text-xs font-medium text-[#2A211D]">
                      Restorative Scalp & Cellular Energy Session
                    </p>
                    <p className="text-[11px] text-[#6E5F5A] mt-0.5">
                      ATP synthesis, follicle cycle support & deep hydration.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Text */}
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-start">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C58B80] font-mono">
                  EVIDENCE-BASED PERSPECTIVE
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif text-[#2A211D] tracking-tight leading-snug">
                  {t.landing.scienceTitle}
                </h2>
                <p className="text-sm font-medium text-[#94847E]">
                  {t.landing.scienceSubtitle}
                </p>
                <div className="space-y-4 text-sm sm:text-base text-[#6E5F5A] leading-relaxed">
                  <p className="border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#C58B80] ps-4">
                    {t.landing.scienceP1}
                  </p>
                  <p>
                    {t.landing.scienceP2}
                  </p>
                </div>

                <div className="pt-2">
                  <Link href="/book">
                    <Button variant="secondary" size="md" className="tracking-wide uppercase text-xs">
                      {t.common.book} →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METHODOLOGY & PROCESS SECTION */}
        <section className="py-20 sm:py-28 border-b border-[#EAE0DA] bg-[#FAF6F3]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#94847E] font-mono">
                CONSULTATION PROTOCOL
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif text-[#2A211D] tracking-tight">
                {t.landing.processTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#6E5F5A]">
                {t.landing.processSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white border border-[#EAE0DA] rounded-lg p-7 text-start space-y-3 shadow-2xs hover:border-[#DCCEC7] transition-colors">
                <div className="w-8 h-8 rounded bg-[#F7EBE7] border border-[#EED7D1] flex items-center justify-center font-mono text-xs font-bold text-[#965B50]">
                  01
                </div>
                <h3 className="text-base font-semibold text-[#2A211D] tracking-tight">
                  {t.landing.step1Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5F5A] leading-relaxed">
                  {t.landing.step1Desc}
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white border border-[#EAE0DA] rounded-lg p-7 text-start space-y-3 shadow-2xs hover:border-[#DCCEC7] transition-colors">
                <div className="w-8 h-8 rounded bg-[#F7EBE7] border border-[#EED7D1] flex items-center justify-center font-mono text-xs font-bold text-[#965B50]">
                  02
                </div>
                <h3 className="text-base font-semibold text-[#2A211D] tracking-tight">
                  {t.landing.step2Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5F5A] leading-relaxed">
                  {t.landing.step2Desc}
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white border border-[#EAE0DA] rounded-lg p-7 text-start space-y-3 shadow-2xs hover:border-[#DCCEC7] transition-colors">
                <div className="w-8 h-8 rounded bg-[#F7EBE7] border border-[#EED7D1] flex items-center justify-center font-mono text-xs font-bold text-[#965B50]">
                  03
                </div>
                <h3 className="text-base font-semibold text-[#2A211D] tracking-tight">
                  {t.landing.step3Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5F5A] leading-relaxed">
                  {t.landing.step3Desc}
                </p>
              </div>
            </div>

            {/* Visual Formulation Showcase Card */}
            <div className="mt-12 rounded-2xl bg-white border border-[#EAE0DA] overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[260px]">
                <Image
                  src="/images/botanical-elixirs.jpg"
                  alt="Creatine Peptides and Botanical Formulations"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="lg:col-span-7 p-6 sm:p-10 text-start space-y-4 flex flex-col justify-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C58B80] font-mono">
                  FORMULATION & BIO-NUTRITION
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-[#2A211D] tracking-tight">
                  Science-Backed Care Meets Pure Botanicals
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5F5A] leading-relaxed">
                  Every consultation pairs cellular metabolic insights with customized hair therapy recommendations — balancing active creatine peptides, restorative jojoba lipids, and gentle scalp barrier hygiene.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-[#6E5F5A]">
                  <span className="px-3 py-1 rounded-full bg-[#FAF6F3] border border-[#EAE0DA]">✓ Creatine Peptide Synergy</span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF6F3] border border-[#EAE0DA]">✓ Pure Amber Botanicals</span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF6F3] border border-[#EAE0DA]">✓ Tailored Scalp Hygiene</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION BANNER */}
        <section className="py-20 bg-[#2A211D] text-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#E4C5BC] font-mono">
              RAHA HAIR THERAPIST
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-light tracking-tight">
              Quiet luxury for every strand
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
              {t.booking.pageSubtitle}
            </p>
            <div className="pt-2">
              <Link href="/book">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-[#C58B80] hover:bg-[#B4786D] text-white border-transparent font-medium tracking-wide uppercase text-xs"
                >
                  {t.common.book}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
