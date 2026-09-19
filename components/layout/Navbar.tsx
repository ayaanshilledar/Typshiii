'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, History, Settings as SettingsIcon } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function Navbar() {
  const pathname = usePathname();

  const handleOpenSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-settings'));
  };

  return (
    <header className="w-full px-6 sm:px-12 lg:px-16 pt-8 pb-4 flex items-center justify-between font-poppins">
      <Link href="/" className="group py-1 flex items-center gap-3 select-none">
        <BrandLogo size={28} name="TYPESHII" />
        <span className="text-xl font-bold tracking-wider text-foreground group-hover:opacity-90 transition-opacity font-poppins">
          TYPESHII
        </span>
      </Link>

      <nav className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/results"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-poppins transition-all duration-150 ${
            pathname === '/results'
              ? 'text-accent bg-accent/10 font-medium'
              : 'text-muted hover:text-foreground hover:bg-surface/70'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span className="capitalize">results</span>
        </Link>

        <Link
          href="/history"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-poppins transition-all duration-150 ${
            pathname === '/history'
              ? 'text-accent bg-accent/10 font-medium'
              : 'text-muted hover:text-foreground hover:bg-surface/70'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span className="capitalize">history</span>
        </Link>

        <button
          type="button"
          onClick={handleOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-poppins text-muted hover:text-foreground hover:bg-surface/70 transition-all duration-150 focus:outline-none"
        >
          <SettingsIcon className="w-3.5 h-3.5" />
          <span className="capitalize">settings</span>
        </button>
      </nav>
    </header>
  );
}
