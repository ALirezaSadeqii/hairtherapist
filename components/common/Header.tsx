'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const { t } = useLanguage();

  return (
    <div className="sticky top-0 z-40 w-full">
      {/* Editorial Top Announcement Bar (matching luxury reference screenshot) */}
      <div className="bg-[#E4C5BC] text-[#2A211D] text-[11px] sm:text-xs py-2 px-4 border-b border-[#D8B4AA]/60 flex items-center justify-between font-light tracking-wide">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <span>
            {t.landing.heroBadge} • Quiet luxury for every strand
          </span>
          <Link
            href="/book"
            className="hidden sm:inline-flex items-center gap-1 font-medium hover:underline text-[#2A211D]"
          >
            {t.common.book} →
          </Link>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="border-b border-[#EAE0DA] bg-[#FAF6F3]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand / Logo */}
          <Link
            href="/"
            className="group flex flex-col items-start focus:outline-none"
          >
            <span className="text-lg sm:text-2xl font-serif tracking-widest uppercase font-semibold text-[#2A211D] group-hover:text-[#C58B80] transition-colors">
              {t.common.brandName}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#94847E] tracking-widest uppercase font-sans hidden sm:inline">
              {t.common.brandTagline}
            </span>
          </Link>

          {/* Navigation & Language */}
          <div className="flex items-center gap-3 sm:gap-6">
            <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-[#6E5F5A]">
              <Link
                href="/"
                className="hover:text-[#2A211D] transition-colors py-1"
              >
                {t.common.home}
              </Link>
              <Link
                href="/book"
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded bg-[#C58B80] hover:bg-[#B4786D] text-white transition-colors shadow-2xs font-medium tracking-wide uppercase text-xs"
              >
                {t.common.book}
              </Link>
              <Link
                href="/admin"
                className="text-[#94847E] hover:text-[#2A211D] transition-colors py-1"
              >
                {t.common.admin}
              </Link>
            </nav>

            <div className="h-4 w-px bg-[#EAE0DA] hidden sm:block" />

            <LanguageSwitcher />
          </div>
        </div>
      </header>
    </div>
  );
}
