'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/context';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center rounded border border-[#EAE0DA] bg-[#FAF6F3] p-0.5 text-xs font-medium shadow-2xs ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('tr')}
        className={`px-2.5 py-1 rounded transition-colors ${
          language === 'tr'
            ? 'bg-[#C58B80] text-white font-semibold shadow-2xs'
            : 'text-[#6E5F5A] hover:text-[#2A211D] hover:bg-[#F5ECE7]'
        }`}
        aria-pressed={language === 'tr'}
      >
        TR
      </button>
      <button
        type="button"
        onClick={() => setLanguage('fa')}
        className={`px-2.5 py-1 rounded transition-colors font-medium ${
          language === 'fa'
            ? 'bg-[#C58B80] text-white font-semibold shadow-2xs'
            : 'text-[#6E5F5A] hover:text-[#2A211D] hover:bg-[#F5ECE7]'
        }`}
        aria-pressed={language === 'fa'}
      >
        فارسی
      </button>
    </div>
  );
}
