'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { formatDisplayDate } from '@/lib/date';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { createAppointment, ApiError } from '@/lib/api';
import { PublicAppointmentResponse } from '@/types/api';

export interface BookingFormProps {
  selectedDate: string; // YYYY-MM-DD
  onSuccess: (appointment: PublicAppointmentResponse) => void;
  onConflict: () => void;
}

export function BookingForm({ selectedDate, onSuccess, onConflict }: BookingFormProps) {
  const { language, t } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setSubmitError(null);

    const trimmedName = customerName.trim();
    if (!trimmedName || trimmedName.length > 100) {
      setNameError(t.booking.nameError);
      isValid = false;
    }

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
      setEmailError(t.booking.emailError);
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await createAppointment({
        customerName: customerName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() ? phone.trim() : null,
        date: selectedDate,
      });

      onSuccess(response);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 409) {
        // Handled by parent: refresh availability and show 409 error
        onConflict();
      } else if (err instanceof ApiError) {
        setSubmitError(err.messages.join('. ') || t.booking.genericError);
      } else {
        setSubmitError(t.booking.genericError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#EAE0DA] rounded-lg p-6 sm:p-8 shadow-xs text-start">
      <div className="border-b border-[#EAE0DA] pb-5 mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94847E] block mb-1">
          {t.booking.selectedDatePrefix}
        </span>
        <h4 className="text-xl font-serif font-bold text-[#2A211D] tracking-tight">
          {formatDisplayDate(selectedDate, language)}
        </h4>
        <p className="text-xs text-[#6E5F5A] mt-1.5">{t.booking.formSubtitle}</p>
      </div>

      {submitError && (
        <Alert
          type="error"
          className="mb-6"
          onClose={() => setSubmitError(null)}
        >
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Customer Name */}
        <Input
          label={t.booking.nameLabel}
          placeholder={t.booking.namePlaceholder}
          value={customerName}
          onChange={(e) => {
            setCustomerName(e.target.value);
            if (nameError) setNameError('');
          }}
          error={nameError}
          required
          maxLength={100}
          disabled={isSubmitting}
        />

        {/* Email Address */}
        <Input
          label={t.booking.emailLabel}
          type="email"
          placeholder={t.booking.emailPlaceholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          error={emailError}
          required
          maxLength={255}
          disabled={isSubmitting}
        />

        {/* Optional Phone */}
        <Input
          label={t.booking.phoneLabel}
          type="tel"
          placeholder={t.booking.phonePlaceholder}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={30}
          disabled={isSubmitting}
        />

        {/* Submit CTA */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? t.booking.submitting : t.booking.submitButton}
          </Button>
        </div>
      </form>
    </div>
  );
}
