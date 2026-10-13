'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { formatDisplayDate } from '@/lib/date';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon';
import { PublicAppointmentResponse } from '@/types/api';

export interface BookingSuccessProps {
  appointment: PublicAppointmentResponse;
  onBookAnother: () => void;
}

export function BookingSuccess({ appointment, onBookAnother }: BookingSuccessProps) {
  const { language, t } = useLanguage();

  const formattedDate = formatDisplayDate(appointment.date, language);
  const prefilledMessage =
    language === 'fa'
      ? `سلام، من برای تاریخ ${formattedDate} (${appointment.date}) نوبت مشاوره ثبت کردم (${appointment.customerName}). جهت هماهنگی و صحبت با تراپیست پیام می‌دهم.`
      : `Merhaba, ${formattedDate} (${appointment.date}) tarihi için Raha Hair Therapist randevumu aldım (${appointment.customerName}). Seans detaylarını ve hazırlığı görüşmek istiyorum.`;

  const whatsappUrl = `https://wa.me/905436980541?text=${encodeURIComponent(prefilledMessage)}`;

  return (
    <div className="bg-white border border-[#EAE0DA] rounded-lg p-6 sm:p-10 shadow-sm text-center max-w-xl mx-auto">
      {/* Success Icon */}
      <div className="w-14 h-14 bg-[#F7EBE7] border border-[#EED7D1] rounded-full flex items-center justify-center mx-auto mb-5 text-[#C58B80]">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3 className="text-2xl font-serif font-bold text-[#2A211D] tracking-tight mb-2">
        {t.booking.successTitle}
      </h3>
      <p className="text-sm text-[#6E5F5A] leading-relaxed mb-6">
        {t.booking.successMessage}
      </p>

      {/* Appointment Summary Box */}
      <div className="bg-[#FAF6F3] border border-[#EAE0DA] rounded-md p-5 text-start mb-6 space-y-3">
        <div className="flex justify-between items-center text-xs border-b border-[#EAE0DA] pb-2.5">
          <span className="text-[#94847E]">{t.booking.summaryDate}:</span>
          <span className="font-semibold text-[#2A211D]">
            {formattedDate}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs border-b border-[#EAE0DA] pb-2.5">
          <span className="text-[#94847E]">{t.booking.summaryName}:</span>
          <span className="font-medium text-[#2A211D]">{appointment.customerName}</span>
        </div>
        <div className="flex justify-between items-center text-xs border-b border-[#EAE0DA] pb-2.5">
          <span className="text-[#94847E]">{t.booking.summaryPhone}:</span>
          <bdi dir="ltr" className="font-mono font-medium text-[#2A211D]">{appointment.phone}</bdi>
        </div>
        {appointment.email ? (
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#94847E]">{t.booking.summaryEmail}:</span>
            <span className="font-medium text-[#2A211D]">{appointment.email}</span>
          </div>
        ) : (
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#94847E]">{t.booking.summaryEmail}:</span>
            <span className="text-[#94847E] italic">{t.booking.notProvided}</span>
          </div>
        )}
      </div>

      {/* WhatsApp Follow-up & Arrangement Box */}
      <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-5 text-start mb-8 space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <WhatsAppIcon className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-semibold text-[#14532D] tracking-tight">
              {t.booking.whatsappNoticeTitle}
            </h4>
            <p className="text-xs text-[#166534] leading-relaxed">
              {t.booking.whatsappNoticeDesc}
            </p>
          </div>
        </div>

        <div className="pt-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#BBF7D0]/80">
          <div className="text-xs text-[#166534] flex items-center gap-1.5 self-start sm:self-center">
            <span className="font-semibold">WhatsApp:</span>
            <bdi dir="ltr" className="font-mono font-medium">+90 (543) 698 05 41</bdi>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>{t.booking.whatsappCta}</span>
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          variant="secondary"
          onClick={onBookAnother}
          className="w-full sm:w-auto"
        >
          {t.booking.bookAnother}
        </Button>
        <Link href="/" className="w-full sm:w-auto">
          <Button
            variant="primary"
            className="w-full sm:w-auto"
          >
            {t.common.backHome}
          </Button>
        </Link>
      </div>
    </div>
  );
}
