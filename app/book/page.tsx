'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/context';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { MonthlyCalendar } from '@/components/calendar/MonthlyCalendar';
import { BookingForm } from '@/components/booking/BookingForm';
import { BookingSuccess } from '@/components/booking/BookingSuccess';
import { Alert } from '@/components/ui/Alert';
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon';
import { getCurrentMonthString } from '@/lib/date';
import { getAvailability, ApiError } from '@/lib/api';
import { DayAvailability, PublicAppointmentResponse } from '@/types/api';

export default function BookingPage() {
  const { t } = useLanguage();

  const clientMonth = React.useSyncExternalStore(
    () => () => {},
    getCurrentMonthString,
    () => '2026-10',
  );
  const [userSelectedMonth, setUserSelectedMonth] = useState<string | null>(null);
  const currentMonth = userSelectedMonth ?? clientMonth;

  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [conflictNotice, setConflictNotice] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] =
    useState<PublicAppointmentResponse | null>(null);

  // Fetch monthly availability asynchronously inside effect
  useEffect(() => {
    let ignore = false;
    getAvailability(currentMonth)
      .then((response) => {
        if (!ignore) {
          setAvailability(response.days);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          if (err instanceof ApiError) {
            setFetchError(err.messages.join('. '));
          } else {
            setFetchError(t.booking.genericError);
          }
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [currentMonth, t]);

  const refreshAvailability = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAvailability(currentMonth);
      setAvailability(res.days);
    } catch {
      // Background refresh error ignored
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth]);

  const handleMonthChange = (newMonth: string) => {
    setUserSelectedMonth(newMonth);
    // If the selected date is not in this new month, reset selection
    if (selectedDate && !selectedDate.startsWith(newMonth)) {
      setSelectedDate(null);
    }
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setConflictNotice(null);
  };

  const handleConflict = async () => {
    setConflictNotice(t.booking.conflictError);
    setSelectedDate(null);
    // Refresh current month's availability immediately so the calendar reflects the booking
    await refreshAvailability();
  };

  const handleSuccess = (appointment: PublicAppointmentResponse) => {
    setConfirmedAppointment(appointment);
    // Refresh availability in the background
    refreshAvailability();
  };

  const handleBookAnother = () => {
    setConfirmedAppointment(null);
    setSelectedDate(null);
    setConflictNotice(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12 sm:py-20 bg-[#FAF6F3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Page Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#2A211D] tracking-tight">
              {t.booking.pageTitle}
            </h1>
            <p className="text-sm sm:text-base text-[#6E5F5A] leading-relaxed">
              {t.booking.pageSubtitle}
            </p>
          </div>

          {/* If appointment successfully booked, show success confirmation */}
          {confirmedAppointment ? (
            <BookingSuccess
              appointment={confirmedAppointment}
              onBookAnother={handleBookAnother}
            />
          ) : (
            <div className="space-y-8">
              {/* Conflict / Error alerts */}
              {conflictNotice && (
                <Alert
                  type="warning"
                  title={t.common.error}
                  onClose={() => setConflictNotice(null)}
                >
                  {conflictNotice}
                </Alert>
              )}

              {fetchError && (
                <Alert
                  type="error"
                  title={t.common.error}
                  onClose={() => setFetchError(null)}
                >
                  {fetchError}
                </Alert>
              )}

              {/* Grid: Calendar on Left, Booking Form or Studio Atmosphere on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7">
                  <MonthlyCalendar
                    currentMonth={currentMonth}
                    onMonthChange={handleMonthChange}
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                    availability={availability}
                    isLoading={isLoading}
                    showLegend={true}
                  />

                  {!selectedDate && (
                    <div className="mt-4 p-4 rounded-lg bg-white border border-[#EAE0DA] text-center text-xs text-[#94847E]">
                      💡 {t.booking.selectDatePrompt}
                    </div>
                  )}
                </div>

                {/* Right Column: Form if date chosen, otherwise Studio Experience Card */}
                <div className="lg:col-span-5">
                  {selectedDate ? (
                    <div className="animate-in fade-in duration-200">
                      <BookingForm
                        selectedDate={selectedDate}
                        onSuccess={handleSuccess}
                        onConflict={handleConflict}
                      />
                    </div>
                  ) : (
                    <div className="bg-white border border-[#EAE0DA] rounded-2xl overflow-hidden shadow-xs text-start">
                      <div className="relative h-48 sm:h-56 w-full">
                        <Image
                          src="/images/salon-interior.jpg"
                          alt="Raha Hair Therapist Studio"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#E4C5BC] block">
                            RAHA STUDIO ATMOSPHERE
                          </span>
                          <p className="text-sm font-serif font-medium">Bespoke 1-on-1 Consultation</p>
                        </div>
                      </div>
                      <div className="p-6 space-y-3.5 text-xs text-[#6E5F5A]">
                        <p className="leading-relaxed">
                          {t.booking.whatsappInfoDesc}
                        </p>
                        <div className="pt-2 border-t border-[#EAE0DA] space-y-2 text-[#94847E]">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C58B80]" />
                            <span>{t.booking.whatsappInfoBadge}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C58B80]" />
                            <span>{t.booking.phoneLabel}: <bdi dir="ltr" className="font-mono">523 434 1223</bdi></span>
                          </div>
                        </div>

                        {/* Direct WhatsApp Quick Contact */}
                        <div className="pt-3 border-t border-[#EAE0DA]">
                          <a
                            href="https://wa.me/905436980541"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#166534] hover:text-[#25D366] transition-colors font-medium"
                          >
                            <span className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                              <WhatsAppIcon className="w-3.5 h-3.5" />
                            </span>
                            <span>{t.common.chatOnWhatsApp}:</span>
                            <bdi dir="ltr" className="font-mono font-medium">+90 (543) 698 05 41</bdi>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
