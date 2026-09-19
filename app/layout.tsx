import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-accent/20 selection:text-foreground font-poppins">
        <Navbar />
        <main className="flex-1 flex flex-col w-full px-6 sm:px-12 lg:px-16">
          {children}
        </main>
      </body>
    </html>
  );
}
