'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { WhatsAppIcon } from './WhatsAppIcon';

export function WhatsAppButton() {
  const { t } = useLanguage();
  const whatsappUrl = 'https://wa.me/905436980541';

  return (
    <div className="fixed bottom-6 end-6 z-50 flex items-center group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.common.chatOnWhatsApp}
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      >
        <WhatsAppIcon className="w-5 h-5 shrink-0" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide whitespace-nowrap">
          {t.common.chatOnWhatsApp}
        </span>
      </a>
    </div>
  );
}
