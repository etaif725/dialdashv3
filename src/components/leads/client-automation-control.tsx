'use client';

import { useCallback, useState, useEffect } from 'react';
import { AutomationControl } from './automation-control';
import { settingsService } from '../../lib/services/settings';
import type { AutomationSettings } from '../../lib/services/settings';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function ClientAutomationControl({ 
  initialSettings 
}: { 
  initialSettings: AutomationSettings | null 
}) {
  const [settings, setSettings] = useState<AutomationSettings | null>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const newSettings = await settingsService.getAutomationSettings();
        setSettings(newSettings);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Handle settings updates
  const handleSettingsUpdate = useCallback(async (enabled: boolean) => {
    setIsLoading(true);
    try {
      await settingsService.updateAutomationEnabled(enabled);
      const newSettings = await settingsService.getAutomationSettings();
      setSettings(newSettings);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AutomationControl 
      initialSettings={settings} 
      onSettingsUpdate={handleSettingsUpdate}
    />
  );
}
