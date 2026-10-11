'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/context';
import {
  generateMonthCalendarCells,
  formatMonthHeader,
  getPrevMonthString,
  getNextMonthString,
  getCurrentMonthString,
  getTodayDateString,
  toPersianDigits,
} from '@/lib/date';
import { DayAvailability } from '@/types/api';

export interface MonthlyCalendarProps {
  currentMonth: string; // YYYY-MM
  onMonthChange: (newMonth: string) => void;
  selectedDate?: string | null; // YYYY-MM-DD
  onSelectDate?: (date: string) => void;
  availability?: DayAvailability[];
  isLoading?: boolean;
  adminAppointmentsByDate?: Record<string, { total: number; confirmed: number; cancelled: number }>;
  showLegend?: boolean;
}

export function MonthlyCalendar({
  currentMonth,
  onMonthChange,
  selectedDate,
  onSelectDate,
  availability = [],
  isLoading = false,
  adminAppointmentsByDate,
  showLegend = true,
}: MonthlyCalendarProps) {
  const { language, t } = useLanguage();

  // Create availability lookup map: "YYYY-MM-DD" -> boolean
  const availabilityMap = React.useMemo(() => {
    const map = new Map<string, boolean>();
    availability.forEach((day) => {
      map.set(day.date, day.available);
    });
    return map;
  }, [availability]);

  const todayDate = React.useSyncExternalStore(
    () => () => {},
    getTodayDateString,
    () => '',
  );

  // Generate grid cells (1 = Monday-first)
  const cells = React.useMemo(() => {
    return generateMonthCalendarCells(currentMonth, 1, todayDate);
  }, [currentMonth, todayDate]);

  const handlePrev = () => {
    onMonthChange(getPrevMonthString(currentMonth));
  };

  const handleNext = () => {
    onMonthChange(getNextMonthString(currentMonth));
  };

  const handleToday = () => {
    onMonthChange(getCurrentMonthString());
  };

  const weekdays = t.calendar.weekdays;

  return (
    <div className="w-full bg-white border border-[#EAE0DA] rounded-lg shadow-xs overflow-hidden">
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#EAE0DA] bg-[#FAF6F3]">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-serif font-semibold text-[#2A211D] tracking-tight">
            {formatMonthHeader(currentMonth, language)}
          </h3>
          {isLoading && (
            <div className="inline-block animate-spin rounded-full border-2 border-[#C58B80] border-r-transparent w-4 h-4 ms-2" />
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleToday}
            className="px-2.5 py-1 text-xs font-medium text-[#6E5F5A] hover:text-[#2A211D] bg-white border border-[#EAE0DA] rounded hover:bg-[#F5ECE7] transition-colors"
          >
            {t.booking.today}
          </button>
          <div className="flex items-center rounded border border-[#EAE0DA] bg-white">
            <button
              type="button"
              onClick={handlePrev}
              aria-label={t.booking.prevMonth}
              className="p-1.5 text-[#6E5F5A] hover:text-[#2A211D] hover:bg-[#F5ECE7] transition-colors rounded-s"
            >
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-px h-4 bg-[#EAE0DA]" />
            <button
              type="button"
              onClick={handleNext}
              aria-label={t.booking.nextMonth}
              className="p-1.5 text-[#6E5F5A] hover:text-[#2A211D] hover:bg-[#F5ECE7] transition-colors rounded-e"
            >
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 border-b border-[#EAE0DA] bg-[#F5ECE7] text-center text-xs font-semibold text-[#94847E] py-2.5">
        {weekdays.map((w, idx) => (
          <div key={idx} className="tracking-wide">
            {w}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-[#F2E8E3] rtl:divide-x-reverse border-b border-[#EAE0DA]">
        {cells.map((cell) => {
          const isSelected = selectedDate === cell.date;
          const isAdmin = !!adminAppointmentsByDate;
          const isCurrentMonth = cell.isCurrentMonth;
          const isPast = cell.isPast;

          const isAvailableFromApi = availabilityMap.get(cell.date);
          const isBooked = isCurrentMonth && !isPast && isAvailableFromApi === false;
          const isSelectable = isCurrentMonth && !isPast && isAvailableFromApi !== false;

          const adminInfo = adminAppointmentsByDate?.[cell.date];

          const displayDayNumber =
            language === 'fa'
              ? toPersianDigits(cell.dayNumber)
              : cell.dayNumber.toString();

          let cellBg = 'bg-white hover:bg-[#FAF6F3]';
          let textColor = 'text-[#2A211D]';
          let cursorStyle = 'cursor-pointer';

          if (!isCurrentMonth) {
            cellBg = 'bg-[#FAF6F3]/60';
            textColor = 'text-[#C7BAB4]';
            cursorStyle = 'cursor-default';
          } else if (isPast) {
            cellBg = 'bg-[#F7F0EC]/80';
            textColor = 'text-[#B8AAA4]';
            cursorStyle = isAdmin ? 'cursor-pointer hover:bg-[#F5ECE7]' : 'cursor-not-allowed';
          } else if (isBooked && !isAdmin) {
            cellBg = 'bg-[#FAECEE]/50';
            textColor = 'text-[#8C7A75]';
            cursorStyle = 'cursor-not-allowed';
          }

          if (isSelected) {
            cellBg = 'bg-[#C58B80] text-white';
            textColor = 'text-white';
          }

          const handleClick = () => {
            if (isAdmin) {
              if (onSelectDate) onSelectDate(cell.date);
              return;
            }
            if (isSelectable && onSelectDate) {
              onSelectDate(cell.date);
            }
          };

          return (
            <button
              key={cell.date}
              type="button"
              disabled={!isAdmin && !isSelectable}
              onClick={handleClick}
              aria-label={`${cell.date} - ${
                isSelected
                  ? t.booking.legendSelected
                  : isBooked
                  ? t.booking.legendBooked
                  : isSelectable
                  ? t.booking.legendAvailable
                  : t.booking.legendPast
              }`}
              className={`relative min-h-[60px] sm:min-h-[82px] p-1.5 sm:p-2 text-start flex flex-col justify-between transition-colors focus:outline-none focus:ring-1 focus:ring-[#C58B80] ${cellBg} ${cursorStyle}`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    cell.isToday && !isSelected
                      ? 'inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#EAD9D4] font-bold text-[#2A211D]'
                      : textColor
                  }`}
                >
                  {displayDayNumber}
                </span>

                {/* Status Dot / Pill for Public */}
                {!isAdmin && isCurrentMonth && !isPast && (
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      isSelected
                        ? 'bg-white'
                        : isBooked
                        ? 'bg-[#943A47]'
                        : 'bg-[#C58B80]'
                    }`}
                    title={isBooked ? t.booking.legendBooked : t.booking.legendAvailable}
                  />
                )}
              </div>

              {/* Public Booking status hint */}
              {!isAdmin && isCurrentMonth && (
                <div className="mt-auto pt-1">
                  {isSelected ? (
                    <span className="text-[10px] font-semibold tracking-wide text-white uppercase">
                      {t.booking.legendSelected}
                    </span>
                  ) : isBooked ? (
                    <span className="text-[10px] font-medium text-[#943A47] truncate block">
                      {t.booking.legendBooked}
                    </span>
                  ) : isPast ? (
                    <span className="text-[10px] text-[#B8AAA4] truncate block">
                      {t.booking.legendPast}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-[#965B50] truncate block">
                      {t.booking.legendAvailable}
                    </span>
                  )}
                </div>
              )}

              {/* Admin Badges */}
              {isAdmin && adminInfo && adminInfo.total > 0 && (
                <div className="mt-auto pt-1 flex flex-wrap gap-1">
                  {adminInfo.confirmed > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-[#F7EBE7] text-[#965B50]'
                      }`}
                    >
                      {language === 'fa'
                        ? toPersianDigits(adminInfo.confirmed)
                        : adminInfo.confirmed}{' '}
                      {t.adminDashboard.confirmedCount}
                    </span>
                  )}
                  {adminInfo.cancelled > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-[#FAECEE] text-[#943A47]'
                      }`}
                    >
                      {language === 'fa'
                        ? toPersianDigits(adminInfo.cancelled)
                        : adminInfo.cancelled}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Calendar Legend */}
      {showLegend && (
        <div className="px-4 sm:px-6 py-3 bg-[#FAF6F3] border-t border-[#EAE0DA] flex flex-wrap items-center justify-between gap-3 text-xs text-[#6E5F5A]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C58B80]" />
              <span>{t.booking.legendAvailable}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#943A47]" />
              <span>{t.booking.legendBooked}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C58B80] ring-2 ring-[#C58B80] ring-offset-1" />
              <span>{t.booking.legendSelected}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DCCEC7]" />
              <span>{t.booking.legendPast}</span>
            </div>
          </div>

          <div className="text-[11px] text-[#94847E]">
            {t.booking.noSlotsHelp}
          </div>
        </div>
      )}
    </div>
  );
}
