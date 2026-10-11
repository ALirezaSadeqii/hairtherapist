'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { formatDisplayDate } from '@/lib/date';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AdminAppointment } from '@/types/api';

export interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AdminAppointment | null;
  onInitiateCancel: (appointment: AdminAppointment) => void;
}

export function AppointmentDetailModal({
  isOpen,
  onClose,
  appointment,
  onInitiateCancel,
}: AppointmentDetailModalProps) {
  const { language, t } = useLanguage();

  if (!appointment) return null;

  const isConfirmed = appointment.status === 'CONFIRMED';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.adminDashboard.modalTitle}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            {isConfirmed && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onClose();
                  onInitiateCancel(appointment);
                }}
              >
                {t.adminDashboard.cancelAppointment}
              </Button>
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {t.common.close}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Status banner */}
        <div className="flex items-center justify-between p-3.5 bg-[#FAF6F3] border border-[#EAE0DA] rounded">
          <span className="text-xs font-semibold text-[#6E5F5A]">
            {t.adminDashboard.modalStatus}:
          </span>
          <Badge variant={isConfirmed ? 'success' : 'danger'}>
            {isConfirmed
              ? t.adminDashboard.statusConfirmed
              : t.adminDashboard.statusCancelled}
          </Badge>
        </div>

        {/* Details List */}
        <div className="divide-y divide-[#F2E8E3] text-sm">
          <div className="py-2.5 flex justify-between">
            <span className="text-[#94847E]">{t.adminDashboard.modalDate}:</span>
            <span className="font-semibold text-[#2A211D]">
              {formatDisplayDate(appointment.date, language)} ({appointment.date})
            </span>
          </div>

          <div className="py-2.5 flex justify-between">
            <span className="text-[#94847E]">{t.adminDashboard.modalCustomer}:</span>
            <span className="font-medium text-[#2A211D]">{appointment.customerName}</span>
          </div>

          <div className="py-2.5 flex justify-between">
            <span className="text-[#94847E]">{t.adminDashboard.modalEmail}:</span>
            {appointment.email ? (
              <a
                href={`mailto:${appointment.email}`}
                className="text-[#C58B80] hover:underline font-mono text-xs"
              >
                {appointment.email}
              </a>
            ) : (
              <span className="text-xs text-[#94847E] italic">{t.booking.notProvided}</span>
            )}
          </div>

          <div className="py-2.5 flex justify-between">
            <span className="text-[#78716C]">{t.adminDashboard.modalPhone}:</span>
            <span className="font-mono text-xs text-[#1C1917]">
              {appointment.phone || t.booking.notProvided}
            </span>
          </div>

          <div className="py-2.5 flex justify-between">
            <span className="text-[#78716C]">{t.adminDashboard.modalCreatedAt}:</span>
            <span className="text-xs text-[#78716C]">
              {new Date(appointment.createdAt).toLocaleString(
                language === 'fa' ? 'fa-IR' : 'tr-TR',
              )}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
