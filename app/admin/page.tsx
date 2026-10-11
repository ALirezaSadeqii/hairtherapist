'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { MonthlyCalendar } from '@/components/calendar/MonthlyCalendar';
import { AppointmentDetailModal } from '@/components/admin/AppointmentDetailModal';
import { CancelConfirmModal } from '@/components/admin/CancelConfirmModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import {
  getMe,
  getAdminAppointments,
  cancelAppointment,
  logout,
  ApiError,
} from '@/lib/api';
import { getCurrentMonthString, formatDisplayDate, toPersianDigits } from '@/lib/date';
import { AdminAppointment, AdminProfile } from '@/types/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const clientMonth = React.useSyncExternalStore(
    () => () => {},
    getCurrentMonthString,
    () => '2026-10',
  );
  const [userSelectedMonth, setUserSelectedMonth] = useState<string | null>(null);
  const currentMonth = userSelectedMonth ?? clientMonth;

  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Filters & selection
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  // Modals state
  const [inspectedAppointment, setInspectedAppointment] = useState<AdminAppointment | null>(null);
  const [cancellingAppointment, setCancellingAppointment] = useState<AdminAppointment | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 1. Authenticate admin on entry via GET /auth/me
  useEffect(() => {
    let ignore = false;
    getMe()
      .then((profile) => {
        if (!ignore) {
          setAdminProfile(profile);
          setIsAuthChecking(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          router.push('/admin/login');
        }
      });
    return () => {
      ignore = true;
    };
  }, [router]);

  // 2. Fetch appointments for selected month
  useEffect(() => {
    if (isAuthChecking || !adminProfile) return;
    let ignore = false;

    getAdminAppointments(currentMonth)
      .then((data) => {
        if (!ignore) {
          setAppointments(data);
          setIsLoadingAppointments(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          if (err instanceof ApiError && err.statusCode === 401) {
            router.push('/admin/login');
          } else if (err instanceof ApiError) {
            setErrorNotice(err.messages.join('. '));
          } else {
            setErrorNotice('Failed to load appointments.');
          }
          setIsLoadingAppointments(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [currentMonth, isAuthChecking, adminProfile, router]);

  const reloadAppointments = useCallback(async () => {
    setIsLoadingAppointments(true);
    try {
      const data = await getAdminAppointments(currentMonth);
      setAppointments(data);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        router.push('/admin/login');
      } else if (err instanceof ApiError) {
        setErrorNotice(err.messages.join('. '));
      }
    } finally {
      setIsLoadingAppointments(false);
    }
  }, [currentMonth, router]);

  // Map appointments by calendar date for calendar badges
  const adminAppointmentsByDate = useMemo(() => {
    const map: Record<string, { total: number; confirmed: number; cancelled: number }> = {};
    appointments.forEach((app) => {
      if (!map[app.date]) {
        map[app.date] = { total: 0, confirmed: 0, cancelled: 0 };
      }
      map[app.date].total += 1;
      if (app.status === 'CONFIRMED') {
        map[app.date].confirmed += 1;
      } else {
        map[app.date].cancelled += 1;
      }
    });
    return map;
  }, [appointments]);

  // Monthly summary metrics
  const counts = useMemo(() => {
    const total = appointments.length;
    const confirmed = appointments.filter((a) => a.status === 'CONFIRMED').length;
    const cancelled = appointments.filter((a) => a.status === 'CANCELLED').length;
    return { total, confirmed, cancelled };
  }, [appointments]);

  // Filtered appointments list
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      // Date filter from calendar click
      if (selectedCalendarDate && app.date !== selectedCalendarDate) {
        return false;
      }
      // Status filter
      if (filterStatus === 'CONFIRMED' && app.status !== 'CONFIRMED') {
        return false;
      }
      if (filterStatus === 'CANCELLED' && app.status !== 'CANCELLED') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = app.customerName.toLowerCase().includes(query);
        const matchesEmail = app.email ? app.email.toLowerCase().includes(query) : false;
        const matchesPhone = app.phone?.toLowerCase().includes(query) ?? false;
        const matchesDate = app.date.includes(query);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesDate) {
          return false;
        }
      }
      return true;
    });
  }, [appointments, filterStatus, searchQuery, selectedCalendarDate]);

  // Handle Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // Ignore network failure on logout
    } finally {
      router.push('/admin/login');
    }
  };

  // Handle Cancellation confirmation
  const handleConfirmCancel = async () => {
    if (!cancellingAppointment) return;

    setIsCancelling(true);
    setErrorNotice(null);
    try {
      await cancelAppointment(cancellingAppointment.id);
      setSuccessNotice(t.adminDashboard.cancelSuccess);
      setCancellingAppointment(null);
      // Refresh monthly appointments
      await reloadAppointments();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorNotice(err.messages.join('. '));
      } else {
        setErrorNotice('Cancellation failed.');
      }
    } finally {
      setIsCancelling(false);
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <p className="text-xs text-[#78716C] tracking-wide">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F3] flex flex-col text-start">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#EAE0DA] bg-[#FAF6F3]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-base sm:text-xl text-[#2A211D] tracking-wider uppercase">
              {t.common.brandName}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#F7EBE7] text-[#965B50] border border-[#EED7D1] font-medium hidden sm:inline">
              {t.common.adminDashboard}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {adminProfile && (
              <span className="text-xs text-[#94847E] hidden md:inline">
                {t.adminDashboard.welcomePrefix}{' '}
                <strong className="text-[#2A211D] font-medium">{adminProfile.email}</strong>
              </span>
            )}

            <LanguageSwitcher />

            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              isLoading={isLoggingOut}
            >
              {isLoggingOut ? t.common.loggingOut : t.common.logout}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Page Title & Status Counters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE0DA] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#2A211D] tracking-tight">
              {t.adminDashboard.pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#6E5F5A] mt-1">
              {t.adminDashboard.pageSubtitle}
            </p>
          </div>

          {/* Metric Badges */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white border border-[#EAE0DA] rounded-md shadow-2xs">
              <span className="text-[11px] text-[#94847E] block">{t.adminDashboard.totalCount}</span>
              <span className="text-lg font-bold text-[#2A211D]">
                {language === 'fa' ? toPersianDigits(counts.total) : counts.total}
              </span>
            </div>
            <div className="px-4 py-2 bg-[#F7EBE7] border border-[#EED7D1] rounded-md shadow-2xs">
              <span className="text-[11px] text-[#965B50] block">{t.adminDashboard.confirmedCount}</span>
              <span className="text-lg font-bold text-[#965B50]">
                {language === 'fa' ? toPersianDigits(counts.confirmed) : counts.confirmed}
              </span>
            </div>
            <div className="px-4 py-2 bg-[#FAECEE] border border-[#ECC3C8] rounded-md shadow-2xs">
              <span className="text-[11px] text-[#943A47] block">{t.adminDashboard.cancelledCount}</span>
              <span className="text-lg font-bold text-[#943A47]">
                {language === 'fa' ? toPersianDigits(counts.cancelled) : counts.cancelled}
              </span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {errorNotice && (
          <Alert
            type="error"
            title={t.common.error}
            onClose={() => setErrorNotice(null)}
          >
            {errorNotice}
          </Alert>
        )}

        {successNotice && (
          <Alert
            type="success"
            title={t.common.success}
            onClose={() => setSuccessNotice(null)}
          >
            {successNotice}
          </Alert>
        )}

        {/* Dashboard Grid: Calendar & Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Monthly Calendar View */}
          <div className="lg:col-span-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#2A211D] tracking-tight font-serif">
                  {t.booking.calendarTitle}
                </h3>
                {selectedCalendarDate && (
                  <button
                    type="button"
                    onClick={() => setSelectedCalendarDate(null)}
                    className="text-xs text-[#C58B80] hover:underline"
                  >
                    ✕ {t.adminDashboard.filterAll}
                  </button>
                )}
              </div>
              <MonthlyCalendar
                currentMonth={currentMonth}
                onMonthChange={(m) => {
                  setUserSelectedMonth(m);
                  setSelectedCalendarDate(null);
                }}
                selectedDate={selectedCalendarDate}
                onSelectDate={(date) => {
                  setSelectedCalendarDate((prev) => (prev === date ? null : date));
                }}
                adminAppointmentsByDate={adminAppointmentsByDate}
                isLoading={isLoadingAppointments}
                showLegend={false}
              />
            </div>
          </div>

          {/* Appointments Management Table */}
          <div className="lg:col-span-7 space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-[#EAE0DA] rounded-lg p-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t.adminDashboard.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-[#EAE0DA] rounded bg-[#FAF6F3] focus:outline-none focus:border-[#C58B80]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute end-2 top-2 text-[#94847E] hover:text-[#2A211D] text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterStatus('ALL')}
                  className={`px-2.5 py-1.5 rounded transition-colors ${
                    filterStatus === 'ALL'
                      ? 'bg-[#C58B80] text-white font-medium'
                      : 'text-[#6E5F5A] hover:bg-[#F5ECE7]'
                  }`}
                >
                  {t.adminDashboard.filterAll}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('CONFIRMED')}
                  className={`px-2.5 py-1.5 rounded transition-colors ${
                    filterStatus === 'CONFIRMED'
                      ? 'bg-[#C58B80] text-white font-medium'
                      : 'text-[#6E5F5A] hover:bg-[#F5ECE7]'
                  }`}
                >
                  {t.adminDashboard.filterConfirmed}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('CANCELLED')}
                  className={`px-2.5 py-1.5 rounded transition-colors ${
                    filterStatus === 'CANCELLED'
                      ? 'bg-[#C58B80] text-white font-medium'
                      : 'text-[#6E5F5A] hover:bg-[#F5ECE7]'
                  }`}
                >
                  {t.adminDashboard.filterCancelled}
                </button>
              </div>
            </div>

            {/* Selected Date Filter Notification */}
            {selectedCalendarDate && (
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#FAF6F3] border border-[#EAE0DA] rounded text-xs text-[#6E5F5A]">
                <span>
                  Filtre: <strong>{formatDisplayDate(selectedCalendarDate, language)}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCalendarDate(null)}
                  className="text-[#943A47] hover:underline"
                >
                  {t.adminDashboard.filterAll}
                </button>
              </div>
            )}

            {/* Appointment Table / Cards */}
            <div className="bg-white border border-[#EAE0DA] rounded-lg shadow-xs overflow-hidden">
              {isLoadingAppointments ? (
                <div className="py-16 text-center space-y-3">
                  <Spinner size="md" />
                  <p className="text-xs text-[#94847E]">{t.common.loading}</p>
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="py-16 text-center text-[#94847E] text-xs space-y-2">
                  <p>📭 {t.adminDashboard.emptyList}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#EAE0DA] bg-[#FAF6F3] text-[#94847E] font-semibold">
                        <th className="py-3 px-4 text-start">{t.adminDashboard.colDate}</th>
                        <th className="py-3 px-4 text-start">{t.adminDashboard.colCustomer}</th>
                        <th className="py-3 px-4 text-start">{t.adminDashboard.colEmail}</th>
                        <th className="py-3 px-4 text-start">{t.adminDashboard.colPhone}</th>
                        <th className="py-3 px-4 text-start">{t.adminDashboard.colStatus}</th>
                        <th className="py-3 px-4 text-end">{t.adminDashboard.colActions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2E8E3]">
                      {filteredAppointments.map((app) => {
                        const isConfirmed = app.status === 'CONFIRMED';
                        return (
                          <tr
                            key={app.id}
                            className="hover:bg-[#FAF6F3] transition-colors"
                          >
                            <td className="py-3.5 px-4 font-mono font-medium text-[#2A211D] whitespace-nowrap">
                              {app.date}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-[#2A211D] whitespace-nowrap">
                              {app.customerName}
                            </td>
                            <td className="py-3.5 px-4 text-[#6E5F5A] font-mono text-[11px] whitespace-nowrap">
                              {app.email || <span className="text-[#94847E] italic">{t.booking.notProvided}</span>}
                            </td>
                            <td className="py-3.5 px-4 text-[#94847E] font-mono text-[11px] whitespace-nowrap">
                              {app.phone || '—'}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <Badge variant={isConfirmed ? 'success' : 'danger'}>
                                {isConfirmed
                                  ? t.adminDashboard.statusConfirmed
                                  : t.adminDashboard.statusCancelled}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4 text-end whitespace-nowrap space-x-2 rtl:space-x-reverse">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setInspectedAppointment(app)}
                              >
                                {t.adminDashboard.viewDetails}
                              </Button>

                              {isConfirmed && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => setCancellingAppointment(app)}
                                >
                                  {t.adminDashboard.cancelAppointment}
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        isOpen={!!inspectedAppointment}
        onClose={() => setInspectedAppointment(null)}
        appointment={inspectedAppointment}
        onInitiateCancel={(app) => setCancellingAppointment(app)}
      />

      {/* Cancel Confirmation Modal */}
      <CancelConfirmModal
        isOpen={!!cancellingAppointment}
        onClose={() => setCancellingAppointment(null)}
        appointment={cancellingAppointment}
        onConfirm={handleConfirmCancel}
        isCancelling={isCancelling}
      />
    </div>
  );
}
