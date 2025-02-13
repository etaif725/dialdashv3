import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'email-notifications',
      title: 'Email Notifications',
      description: 'Receive email notifications for important updates',
      enabled: true,
    },
    {
      id: 'push-notifications', 
      title: 'Push Notifications',
      description: 'Receive push notifications in your browser',
      enabled: true,
    },
    {
      id: 'lead-notifications',
      title: 'New Lead Alerts',
      description: 'Get notified when new leads are assigned to you',
      enabled: true,
    },
    {
      id: 'appointment-reminders',
      title: 'Appointment Reminders', 
      description: 'Receive reminders before scheduled appointments',
      enabled: true,
    },
    {
      id: 'task-notifications',
      title: 'Task Updates',
      description: 'Get notified about task assignments and updates',
      enabled: false,
    },
    {
      id: 'marketing-notifications',
      title: 'Marketing Updates',
      description: 'Receive updates about marketing campaigns',
      enabled: false,
    },
  ]);

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const handleSave = async () => {
    try {
      // TODO: Implement save logic
      console.log('Saving preferences:', preferences);
    } catch (error) {
      // Show error toast
    }
  };

  return (
    <div className="space-y-8 animate-in">
      <div className="grid gap-4">
        {preferences.map((preference) => (
          <div
            key={preference.id}
            className="flex items-center justify-between space-x-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm hover:shadow-md hover:bg-[hsl(var(--muted))] transition-all duration-300"
          >
            <div className="space-y-2">
              <Label 
                htmlFor={preference.id}
                className="text-base font-semibold font-plus-jakarta text-[hsl(var(--foreground))]"
              >
                {preference.title}
              </Label>
              <p className="text-sm font-outfit text-[hsl(var(--muted-foreground))]">
                {preference.description}
              </p>
            </div>
            <Switch
              id={preference.id}
              checked={preference.enabled}
              onCheckedChange={() => togglePreference(preference.id)}
              className="data-[state=checked]:bg-[hsl(var(--primary))] data-[state=unchecked]:bg-[hsl(var(--muted))] transition-colors duration-300"
            />
          </div>
        ))}
      </div>

      <Button 
        onClick={handleSave}
        className="button-primary font-plus-jakarta font-medium hover-lift"
      >
        Save Preferences
      </Button>
    </div>
  );
}