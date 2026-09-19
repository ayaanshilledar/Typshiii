'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SettingsModal } from '@/components/settings/SettingsModal';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <SettingsModal
        isOpen={true}
        onClose={() => router.push('/')}
      />
    </div>
  );
}
