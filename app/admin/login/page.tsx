'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { login, ApiError } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage(t.adminLogin.authError);
      return;
    }

    setIsLoading(true);
    try {
      await login({
        email: trimmedEmail.toLowerCase(),
        password,
      });

      // Login sets the HTTP-only cookie in backend with credentials: include
      router.push('/admin');
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        setErrorMessage(t.adminLogin.authError);
      } else if (err instanceof ApiError) {
        setErrorMessage(err.messages.join('. '));
      } else {
        setErrorMessage(t.adminLogin.authError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F3] flex flex-col justify-between py-12 px-4 sm:px-6">
      {/* Top Header with Back Link & Language Switcher */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-8">
        <Link
          href="/"
          className="text-xs text-[#94847E] hover:text-[#2A211D] transition-colors"
        >
          {t.adminLogin.backToSite}
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-white border border-[#EAE0DA] rounded-lg p-8 sm:p-10 shadow-xs">
        <div className="text-center mb-8 space-y-2">
          <div className="w-10 h-10 rounded bg-[#F7EBE7] border border-[#EED7D1] flex items-center justify-center mx-auto text-[#C58B80] mb-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-[#2A211D] tracking-tight">
            {t.adminLogin.pageTitle}
          </h1>
          <p className="text-xs text-[#6E5F5A]">
            {t.adminLogin.pageSubtitle}
          </p>
        </div>

        {errorMessage && (
          <Alert
            type="error"
            className="mb-6"
            onClose={() => setErrorMessage(null)}
          >
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            label={t.adminLogin.emailLabel}
            type="email"
            placeholder={t.adminLogin.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={isLoading}
          />

          <Input
            label={t.adminLogin.passwordLabel}
            type="password"
            placeholder={t.adminLogin.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={isLoading}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full tracking-wide uppercase text-xs"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? t.adminLogin.loggingIn : t.adminLogin.loginButton}
            </Button>
          </div>
        </form>
      </div>

      {/* Footer minimal info */}
      <div className="max-w-md w-full mx-auto text-center pt-8 text-[11px] text-[#94847E]">
        Raha Hair Therapist • Secure Management
      </div>
    </div>
  );
}
