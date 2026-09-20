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
    <header className="w-full px-3 sm:px-8 lg:px-16 pt-3 sm:pt-6 pb-2 sm:pb-4 flex items-center justify-between font-poppins">
      <Link href="/" className="group py-1 flex items-center gap-2 sm:gap-3 select-none">
        <BrandLogo size={24} name="TYPESHII" />
        <span className="text-base sm:text-xl font-bold tracking-wider text-foreground group-hover:opacity-90 transition-opacity font-poppins">
          TYPESHII
        </span>
      </Link>

      <nav className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/results"
          title="Results"
          aria-label="Results"
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-poppins transition-all duration-150 ${
            pathname === '/results'
              ? 'text-accent bg-accent/10 font-medium'
              : 'text-muted hover:text-foreground hover:bg-surface/70'
          }`}
        >
          <BarChart2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span className="hidden xs:inline capitalize">results</span>
        </Link>

        <Link
          href="/history"
          title="History"
          aria-label="History"
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-poppins transition-all duration-150 ${
            pathname === '/history'
              ? 'text-accent bg-accent/10 font-medium'
              : 'text-muted hover:text-foreground hover:bg-surface/70'
          }`}
        >
          <History className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span className="hidden xs:inline capitalize">history</span>
        </Link>

        <button
          type="button"
          onClick={handleOpenSettings}
          title="Settings"
          aria-label="Settings"
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-poppins text-muted hover:text-foreground hover:bg-surface/70 transition-all duration-150 focus:outline-none"
        >
          <SettingsIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span className="hidden xs:inline capitalize">settings</span>
        </button>
      </nav>
    </header>
  );
}
