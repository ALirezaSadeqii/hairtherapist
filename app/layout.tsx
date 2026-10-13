import type { Metadata } from 'next';
import { Geist, Vazirmatn } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/context';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const vazirmatn = Vazirmatn({
  variable: '--font-persian',
  subsets: ['arabic', 'latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Raha Hair Therapist | Evidence-Based Hair & Creatine Wellness',
  description:
    'Private individual hair health consultations focusing on cellular energy, scalp barrier wellness, and evidence-backed guidance. Available in Turkish & Persian.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      dir="ltr"
      className={`${geistSans.variable} ${vazirmatn.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#FAF6F3] text-[#2A211D] selection:bg-[#EBD6D0]">
        <LanguageProvider>
          {children}
          <WhatsAppButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
