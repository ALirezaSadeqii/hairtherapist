/**
 * Timezone-safe calendar and date utility functions.
 * Operates purely on calendar components (year, month, day) and YYYY-MM-DD strings
 * to strictly avoid daylight savings or UTC shift errors.
 */

export interface CalendarDayCell {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
}

/**
 * Returns today's calendar date as YYYY-MM-DD in user's local calendar.
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns current month string as YYYY-MM.
 */
export function getCurrentMonthString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Formats year, monthIndex (0-11), and day (1-31) into YYYY-MM-DD.
 */
export function formatCalendarDate(year: number, monthIndex: number, day: number): string {
  const y = String(year).padStart(4, '0');
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formats year and monthIndex (0-11) into YYYY-MM.
 */
export function formatCalendarMonth(year: number, monthIndex: number): string {
  const y = String(year).padStart(4, '0');
  const m = String(monthIndex + 1).padStart(2, '0');
  return `${y}-${m}`;
}

/**
 * Parses YYYY-MM into year and monthIndex (0-11).
 */
export function parseMonthString(monthStr: string): { year: number; monthIndex: number } {
  const [yStr, mStr] = monthStr.split('-');
  const year = parseInt(yStr, 10);
  const monthIndex = parseInt(mStr, 10) - 1;
  return { year, monthIndex };
}

/**
 * Calculates previous month string YYYY-MM.
 */
export function getPrevMonthString(monthStr: string): string {
  const { year, monthIndex } = parseMonthString(monthStr);
  if (monthIndex === 0) {
    return formatCalendarMonth(year - 1, 11);
  }
  return formatCalendarMonth(year, monthIndex - 1);
}

/**
 * Calculates next month string YYYY-MM.
 */
export function getNextMonthString(monthStr: string): string {
  const { year, monthIndex } = parseMonthString(monthStr);
  if (monthIndex === 11) {
    return formatCalendarMonth(year + 1, 0);
  }
  return formatCalendarMonth(year, monthIndex + 1);
}

/**
 * Returns total days in a given calendar month.
 */
export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Generates calendar grid cells for a given month.
 * startOfWeek: 1 for Monday (standard for Turkey), 6 for Saturday (standard for Iran)
 */
export function generateMonthCalendarCells(
  monthStr: string,
  startOfWeek: 1 | 6 = 1,
  todayStr: string = '',
): CalendarDayCell[] {
  const { year, monthIndex } = parseMonthString(monthStr);
  const totalDays = getDaysInMonth(year, monthIndex);

  // Day of week of the 1st day of the month: 0 (Sun) to 6 (Sat)
  const firstDayWeekday = new Date(year, monthIndex, 1).getDay();

  // Calculate padding cells before day 1
  let leadingBlanks = 0;
  if (startOfWeek === 1) {
    // Week starts Monday (1). Sun (0) becomes 6.
    leadingBlanks = (firstDayWeekday + 6) % 7;
  } else {
    // Week starts Saturday (6). Sat=0, Sun=1, Mon=2, ... Fri=6.
    leadingBlanks = (firstDayWeekday + 1) % 7;
  }

  const cells: CalendarDayCell[] = [];

  // Previous month trailing days
  const prevMonthDays = monthIndex === 0 ? getDaysInMonth(year - 1, 11) : getDaysInMonth(year, monthIndex - 1);
  const prevMonthStr = getPrevMonthString(monthStr);
  const { year: prevYear, monthIndex: prevMonthIndex } = parseMonthString(prevMonthStr);

  for (let i = leadingBlanks - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const dateStr = formatCalendarDate(prevYear, prevMonthIndex, dayNum);
    cells.push({
      date: dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
    });
  }

  // Current month days
  for (let day = 1; day <= totalDays; day++) {
    const dateStr = formatCalendarDate(year, monthIndex, day);
    cells.push({
      date: dateStr,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
    });
  }

  // Next month leading days to complete the last row (up to multiple of 7)
  const remainingCells = (7 - (cells.length % 7)) % 7;
  const nextMonthStr = getNextMonthString(monthStr);
  const { year: nextYear, monthIndex: nextMonthIndex } = parseMonthString(nextMonthStr);

  for (let day = 1; day <= remainingCells; day++) {
    const dateStr = formatCalendarDate(nextYear, nextMonthIndex, day);
    cells.push({
      date: dateStr,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
    });
  }

  return cells;
}

const TR_MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

const FA_MONTHS = [
  'ژانویه',
  'فوریه',
  'مارس',
  'آوریل',
  'مه',
  'ژوئن',
  'ژوئیه',
  'اوت',
  'سپتامبر',
  'اکتبر',
  'نوامبر',
  'دسامبر',
];

/**
 * Format month header title (e.g. "Ekim 2026" or "اکتبر ۲۰۲۶")
 */
export function formatMonthHeader(monthStr: string, locale: 'tr' | 'fa'): string {
  const { year, monthIndex } = parseMonthString(monthStr);
  if (locale === 'fa') {
    const faYear = toPersianDigits(year.toString());
    const monthName = FA_MONTHS[monthIndex] || '';
    return `${monthName} ${faYear}`;
  }
  return `${TR_MONTHS[monthIndex]} ${year}`;
}

/**
 * Converts Western digits to Persian digits.
 */
export function toPersianDigits(num: string | number): string {
  const str = num.toString();
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (d) => persianDigits[parseInt(d, 10)]);
}

/**
 * Formats a calendar date for friendly display.
 */
export function formatDisplayDate(dateStr: string, locale: 'tr' | 'fa'): string {
  const [yStr, mStr, dStr] = dateStr.split('-');
  const year = parseInt(yStr, 10);
  const monthIndex = parseInt(mStr, 10) - 1;
  const day = parseInt(dStr, 10);

  if (locale === 'fa') {
    return `${toPersianDigits(day)} ${FA_MONTHS[monthIndex]} ${toPersianDigits(year)}`;
  }
  return `${day} ${TR_MONTHS[monthIndex]} ${year}`;
}
