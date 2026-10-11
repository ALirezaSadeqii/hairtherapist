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
  const [phoneError, setPhoneError] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to format raw phone input into '523 434 1223'
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    let formatted = digits;
    if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)} ${digits.slice(3)}`;
    }
    setPhone(formatted);
    if (phoneError) setPhoneError('');
  };

  const validate = (): boolean => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setSubmitError(null);

    const trimmedName = customerName.trim();
    if (!trimmedName || trimmedName.length > 100) {
      setNameError(t.booking.nameError);
      isValid = false;
    }

    const trimmedPhone = phone.trim();
    const phoneRegex = /^\d{3} \d{3} \d{4}$/;
    if (!trimmedPhone || !phoneRegex.test(trimmedPhone)) {
      setPhoneError(t.booking.phoneError);
      isValid = false;
    }

    const trimmedEmail = email.trim();
    if (trimmedEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
        setEmailError(t.booking.emailError);
        isValid = false;
      }
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
        email: email.trim() ? email.trim().toLowerCase() : null,
        phone: phone.trim(),
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

        {/* Mandatory Phone Number */}
        <Input
          label={t.booking.phoneLabel}
          type="tel"
          placeholder={t.booking.phonePlaceholder}
          value={phone}
          onChange={handlePhoneChange}
          error={phoneError}
          required
          maxLength={12}
          disabled={isSubmitting}
        />

        {/* Optional Email Address */}
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
          maxLength={255}
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
