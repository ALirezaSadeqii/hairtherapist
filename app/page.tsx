'use client';

import React from 'react';
import Link from 'next/link';
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
        <section className="relative overflow-hidden border-b border-[#EAE0DA] bg-[#FAF6F3] py-20 sm:py-32">
          {/* Subtle warm rose and alabaster glow */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-[#F5DFD9] rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-[#FCECE8] rounded-full blur-3xl opacity-70 pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7EBE7] border border-[#EED7D1] text-[#965B50] text-xs font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C58B80]" />
              {t.landing.heroBadge}
            </div>

            {/* Editorial Title - Quiet luxury style */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium tracking-tight text-[#2A211D] leading-[1.18]">
              {t.landing.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#6E5F5A] leading-relaxed font-sans font-light">
              {t.landing.heroSubtitle}
            </p>

            {/* Hero CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
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
          </div>
        </section>

        {/* FACTUAL SCIENCE SECTION */}
        <section id="science" className="py-20 sm:py-28 border-b border-[#EAE0DA] bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Visual Tasteful Placeholder */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative rounded-lg border border-[#EAE0DA] bg-[#FAF6F3] p-8 aspect-4/5 flex flex-col justify-between overflow-hidden shadow-xs">
                  <div className="flex items-center justify-between text-xs text-[#94847E] border-b border-[#EAE0DA] pb-3">
                    <span className="tracking-widest uppercase font-mono text-[10px]">BIOLOGY & ENERGY</span>
                    <span>ATP / 380 kDa</span>
                  </div>

                  {/* Abstract Botanical & Molecular Diagram in Dusty Rose */}
                  <div className="my-auto py-6 flex flex-col items-center justify-center text-center">
                    <svg
                      className="w-36 h-36 text-[#C58B80]"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    >
                      <circle cx="50" cy="50" r="42" strokeDasharray="3 3" opacity="0.4" />
                      <circle cx="50" cy="50" r="28" opacity="0.6" />
                      <circle cx="50" cy="50" r="14" fill="#F7EBE7" />
                      <path d="M50 8 V92" strokeWidth="0.8" opacity="0.4" />
                      <path d="M8 50 H92" strokeWidth="0.8" opacity="0.4" />
                      <path d="M50 22 C65 22 75 35 75 50 C75 65 65 78 50 78" strokeWidth="1.5" />
                      <path d="M50 22 C35 22 25 35 25 50 C25 65 35 78 50 78" strokeWidth="1.5" />
                    </svg>
                    <p className="mt-4 text-xs font-serif text-[#2A211D] italic">
                      Hücresel Enerji & Folikül Metabolizması
                    </p>
                  </div>

                  <div className="text-[11px] text-[#94847E] bg-white border border-[#EAE0DA] rounded p-3">
                    <p className="font-semibold text-[#2A211D] mb-0.5">Metabolik Odak:</p>
                    <p>Hücresel adenozin trifosfat (ATP) seviyeleri ve saç folikül döngüsü.</p>
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
