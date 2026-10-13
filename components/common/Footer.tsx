'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { WhatsAppIcon } from './WhatsAppIcon';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-[#EAE0DA] bg-[#F5ECE7] text-[#6E5F5A] text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-start">
          {/* Col 1: Studio Identity & Philosophy */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#2A211D] tracking-tight font-serif uppercase">
              {t.common.brandName}
            </h4>
            <p className="text-xs leading-relaxed text-[#94847E]">
              {t.landing.heroSubtitle}
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] text-[#94847E] bg-white border border-[#EAE0DA] px-2.5 py-1 rounded">
                {t.landing.studioNamePlaceholder}
              </span>
            </div>
          </div>

          {/* Col 2: Studio Information */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-semibold text-[#2A211D] tracking-tight">
              {t.landing.contactTitle}
            </h4>
            <p className="leading-relaxed flex items-start gap-2">
              <span className="font-medium text-[#2A211D] shrink-0">📍</span>
              <span>{t.landing.addressPlaceholder}</span>
            </p>
            <p className="leading-relaxed flex items-center gap-2">
              <span className="font-medium text-[#2A211D] shrink-0">📞</span>
              <a
                href="tel:+905436980541"
                className="hover:text-[#2A211D] transition-colors"
              >
                <bdi dir="ltr" className="font-mono text-[11px] inline-block">
                  {t.landing.phonePlaceholder}
                </bdi>
              </a>
            </p>
            <p className="leading-relaxed flex items-center gap-2">
              <span className="text-[#25D366] shrink-0">
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </span>
              <a
                href="https://wa.me/905436980541"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#25D366] transition-colors flex items-center gap-1.5"
              >
                <span className="font-medium">{t.landing.whatsappLabel}:</span>
                <bdi dir="ltr" className="font-mono text-[11px] font-medium inline-block">
                  +90 (543) 698 05 41
                </bdi>
              </a>
            </p>
            <p className="leading-relaxed text-[#94847E] flex items-start gap-2">
              <span className="font-medium text-[#2A211D] shrink-0">🕒</span>
              <span>{t.landing.hoursPlaceholder}</span>
            </p>
          </div>

          {/* Col 3: Ethical Disclaimer & Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#2A211D] tracking-tight">
              {t.landing.disclaimerTitle}
            </h4>
            <p className="text-[11px] leading-relaxed text-[#94847E] border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#C58B80] ps-3">
              {t.landing.disclaimerText}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-medium">
              <Link href="/book" className="text-[#C58B80] hover:underline">
                {t.common.book}
              </Link>
              <span>•</span>
              <Link href="/admin/login" className="text-[#94847E] hover:text-[#2A211D]">
                {t.common.adminLogin}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#EAE0DA] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#94847E]">
          <p dir="ltr">© 2026 {t.landing.studioNamePlaceholder}. All rights reserved.</p>
          <p className="tracking-wide">
            Quiet luxury for every strand • Raha Hair Therapist
          </p>
        </div>
      </div>
    </footer>
  );
}

