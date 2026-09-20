import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Analytics } from '@vercel/analytics/next';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Typeshii — Pure Speed & Keystroke Precision',
  description:
    'A clean, responsive typing practice website measuring WPM, Raw WPM, accuracy, errors, and per-word performance without clutter.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-accent/20 selection:text-foreground font-poppins">
        <Navbar />
        <main className="flex-1 flex flex-col w-full px-3 sm:px-8 md:px-12 lg:px-16">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
