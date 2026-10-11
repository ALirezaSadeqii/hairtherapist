'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { formatDisplayDate } from '@/lib/date';
import { Button } from '@/components/ui/Button';
import { PublicAppointmentResponse } from '@/types/api';

export interface BookingSuccessProps {
  appointment: PublicAppointmentResponse;
  onBookAnother: () => void;
}

export function BookingSuccess({ appointment, onBookAnother }: BookingSuccessProps) {
  const { language, t } = useLanguage();

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
      <p className="text-sm text-[#6E5F5A] leading-relaxed mb-8">
        {t.booking.successMessage}
      </p>

      {/* Appointment Summary Box */}
      <div className="bg-[#FAF6F3] border border-[#EAE0DA] rounded-md p-5 text-start mb-8 space-y-3">
        <div className="flex justify-between items-center text-xs border-b border-[#EAE0DA] pb-2.5">
          <span className="text-[#94847E]">{t.booking.summaryDate}:</span>
          <span className="font-semibold text-[#2A211D]">
            {formatDisplayDate(appointment.date, language)}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs border-b border-[#EAE0DA] pb-2.5">
          <span className="text-[#94847E]">{t.booking.summaryName}:</span>
          <span className="font-medium text-[#2A211D]">{appointment.customerName}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#94847E]">{t.booking.summaryEmail}:</span>
          <span className="font-medium text-[#2A211D]">{appointment.email}</span>
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
