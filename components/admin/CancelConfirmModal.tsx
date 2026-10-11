'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { formatDisplayDate } from '@/lib/date';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AdminAppointment } from '@/types/api';

export interface CancelConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AdminAppointment | null;
  onConfirm: () => Promise<void>;
  isCancelling: boolean;
}

export function CancelConfirmModal({
  isOpen,
  onClose,
  appointment,
  onConfirm,
  isCancelling,
}: CancelConfirmModalProps) {
  const { language, t } = useLanguage();

  if (!appointment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isCancelling) onClose();
      }}
      title={t.adminDashboard.confirmCancelTitle}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isCancelling}
          >
            {t.adminDashboard.confirmCancelKeep}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isCancelling}
            disabled={isCancelling}
          >
            {isCancelling
              ? t.adminDashboard.cancelling
              : t.adminDashboard.confirmCancelButton}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-[#6E5F5A] leading-relaxed">
          {t.adminDashboard.confirmCancelBody}
        </p>

        <div className="bg-[#FAECEE] border-[#ECC3C8] rounded p-3 text-xs text-[#943A47]">
          <p className="font-semibold mb-1">
            {formatDisplayDate(appointment.date, language)}
          </p>
          <p>
            {appointment.customerName} ({appointment.email})
          </p>
        </div>
      </div>
    </Modal>
  );
}
