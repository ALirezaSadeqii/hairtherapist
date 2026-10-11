'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* Editorial Top Announcement Bar */}
      <div className="bg-[#E4C5BC] text-[#2A211D] text-[10px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#D8B4AA]/60 font-light tracking-wide">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-3">
          <span className="truncate text-center sm:text-start flex-1 sm:flex-initial">
            {t.landing.heroBadge} • Quiet luxury for every strand
          </span>
          <Link
            href="/book"
            className="hidden sm:inline-flex items-center gap-1 font-medium hover:underline text-[#2A211D] shrink-0 text-xs"
          >
            {t.common.book} →
          </Link>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="border-b border-[#EAE0DA] bg-[#FAF6F3]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Brand / Logo */}
          <Link
            href="/"
            className="group flex flex-col items-start focus:outline-none min-w-0 shrink"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="text-[13px] xs:text-sm sm:text-xl lg:text-2xl font-serif tracking-wider sm:tracking-widest uppercase font-semibold text-[#2A211D] group-hover:text-[#C58B80] transition-colors whitespace-nowrap">
              {t.common.brandName}
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#94847E] tracking-widest uppercase font-sans hidden sm:inline -mt-0.5">
              {t.common.brandTagline}
            </span>
          </Link>

          {/* Desktop Navigation & Language Switcher */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6 text-xs sm:text-sm font-medium text-[#6E5F5A]">
              <Link
                href="/"
                className={`hover:text-[#2A211D] transition-colors py-1 ${
                  pathname === '/' ? 'text-[#2A211D] font-semibold' : ''
                }`}
              >
                {t.common.home}
              </Link>
              <Link
                href="/book"
                className="px-4 py-2 rounded bg-[#C58B80] hover:bg-[#B4786D] text-white transition-colors shadow-2xs font-medium tracking-wide uppercase text-xs"
              >
                {t.common.book}
              </Link>
              <Link
                href="/admin"
                className={`text-[#94847E] hover:text-[#2A211D] transition-colors py-1 ${
                  pathname?.startsWith('/admin') ? 'text-[#2A211D] font-semibold' : ''
                }`}
              >
                {t.common.admin}
              </Link>
            </nav>

            <div className="h-4 w-px bg-[#EAE0DA]" />

            <LanguageSwitcher />
          </div>

          {/* Mobile Right Controls: Compact Book CTA + Hamburger Menu Toggle */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            {/* Quick Book CTA on Mobile Header if not already on /book */}
            {pathname !== '/book' && (
              <Link
                href="/book"
                className="hidden sm:inline-flex px-3 py-1.5 rounded bg-[#C58B80] hover:bg-[#B4786D] text-white transition-colors shadow-2xs font-medium tracking-wide uppercase text-[11px] whitespace-nowrap"
              >
                {t.common.book}
              </Link>
            )}

            {/* Language Switcher visible directly on mobile header */}
            <LanguageSwitcher className="scale-90 origin-right" />

            {/* Mobile Hamburger / Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? t.common.close : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              className="p-2 rounded-md border border-[#EAE0DA] bg-white text-[#2A211D] hover:bg-[#FAF6F3] focus:outline-none focus:ring-2 focus:ring-[#C58B80] transition-colors"
            >
              {isMobileMenuOpen ? (
                // Close 'X' icon
                <svg className="w-5 h-5 text-[#2A211D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg className="w-5 h-5 text-[#2A211D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation-menu"
            className="md:hidden border-t border-[#EAE0DA] bg-[#FAF6F3]/98 backdrop-blur-lg px-5 py-5 space-y-4 shadow-lg animate-in slide-in-from-top-1 duration-150"
          >
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between text-sm py-2.5 px-3 rounded-lg transition-colors ${
                  pathname === '/'
                    ? 'bg-[#F7EBE7] text-[#965B50] font-semibold'
                    : 'text-[#2A211D] hover:bg-white'
                }`}
              >
                <span>{t.common.home}</span>
                <span className="text-xs text-[#94847E]">→</span>
              </Link>
              <Link
                href="/book"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between text-sm py-2.5 px-3 rounded-lg transition-colors ${
                  pathname === '/book'
                    ? 'bg-[#F7EBE7] text-[#965B50] font-semibold'
                    : 'text-[#2A211D] hover:bg-white'
                }`}
              >
                <span className="font-semibold">{t.common.book}</span>
                <span className="text-[10px] font-sans bg-[#C58B80] text-white px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                  Online
                </span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between text-sm py-2.5 px-3 rounded-lg transition-colors ${
                  pathname?.startsWith('/admin')
                    ? 'bg-[#F7EBE7] text-[#965B50] font-semibold'
                    : 'text-[#94847E] hover:text-[#2A211D] hover:bg-white'
                }`}
              >
                <span>{t.common.admin}</span>
                <span className="text-[11px] font-mono text-[#94847E]">Console</span>
              </Link>
            </nav>

            <div className="pt-3 border-t border-[#EAE0DA] flex items-center justify-between text-xs text-[#94847E]">
              <span>{t.common.brandTagline}</span>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
