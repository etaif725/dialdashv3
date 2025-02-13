'use client'

import { useEffect, useState } from 'react'
import { settingsService } from '../../lib/services/settings'
import { useToast } from '../../hooks/use-toast'
import { LoadingSwitch } from '../../components/ui/loading-switch'

// Define the type for AutomationSettings
type AutomationSettings = {
  automation_enabled: boolean;
}

// Update the component to accept initialSettings and onSettingsUpdate props
export function AutomationControl({ 
  initialSettings,
  onSettingsUpdate
}: { 
  initialSettings: AutomationSettings | null;
  onSettingsUpdate?: (enabled: boolean) => void;
}) {
  const [enabled, setEnabled] = useState(initialSettings?.automation_enabled ?? false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  // Update local state when initialSettings changes
  useEffect(() => {
    if (initialSettings !== null) {
      setEnabled(initialSettings.automation_enabled)
    }
  }, [initialSettings])

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await settingsService.getAutomationSettings()
      setEnabled(settings.automation_enabled)
    }

    if (!initialSettings) {
      fetchSettings()
    }
  }, [initialSettings])

  const handleToggle = async (newState: boolean) => {
    setIsUpdating(true)
    
    try {
      const result = await settingsService.updateAutomationEnabled(newState)
      
      if (result.success) {
        setEnabled(newState)
        if (onSettingsUpdate) {
          onSettingsUpdate(newState)
        }
        toast({
          title: newState ? "Outbound Calling Enabled" : "Outbound Calling Disabled",
          description: newState 
            ? "System is now making calls to leads" 
            : "Outbound calling has been paused",
          variant: "success",
        })
      } else {
        toast({
          title: "Error",
          description: `Failed to update settings: ${result.error}`,
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center justify-between transition-all duration-300">
      <div className="space-y-1">
        <div className="text-lg font-semibold text-[hsl(var(--foreground))]">Outbound Call System</div>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {enabled ? 'System is actively making calls' : 'System is paused'}
        </p>
      </div>
      <div className="flex items-center space-x-12 ml-12">
        <LoadingSwitch
          checked={enabled}
          onCheckedChange={handleToggle}
          disabled={isUpdating}
          isLoading={isUpdating}
          aria-label="Toggle outbound calling"
          className="border-2 border-[hsl(var(--border))] shadow-sm rounded-full py-4 px-2 transition-colors duration-200 hover:bg-[hsl(var(--accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--background))]"
        />
        <span className={`text-lg font-medium min-w-[3.5rem] ${enabled ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--muted-foreground))]'}`}>
          {enabled ? 'Active' : 'Paused'}
        </span>
      </div>
    </div>
  )
}
