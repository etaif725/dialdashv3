import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { Calendar, Mail, MessageSquare, Phone, Video } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  apiKey?: string;
}

export function IntegrationSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync your appointments with Google Calendar',
      icon: <Calendar className="h-6 w-6" />,
      connected: true,
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Host video meetings with Zoom',
      icon: <Video className="h-6 w-6" />,
      connected: false,
    },
    {
      id: 'twilio',
      name: 'Twilio',
      description: 'Send SMS notifications via Twilio',
      icon: <Phone className="h-6 w-6" />,
      connected: false,
      apiKey: '',
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      description: 'Send emails via SendGrid',
      icon: <Mail className="h-6 w-6" />,
      connected: false,
      apiKey: '',
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications in Slack',
      icon: <MessageSquare className="h-6 w-6" />,
      connected: false,
    },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );
  };

  const updateApiKey = (id: string, apiKey: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, apiKey } : integration
      )
    );
  };

  const handleConnect = async (id: string) => {
    try {
      // TODO: Implement OAuth flow or API key validation
      console.log('Connecting:', id);
    } catch (error) {
      // Show error toast
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="grid gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="flex items-start justify-between space-x-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm hover:shadow-md hover:bg-[hsl(var(--muted))] transition-all duration-300"
          >
            <div className="flex items-start space-x-6">
              <div className="mt-1 rounded-lg bg-[hsl(var(--primary)/.1)] p-3 text-[hsl(var(--primary))] transition-colors duration-300">
                {integration.icon}
              </div>
              <div className="space-y-2">
                <Label className="font-plus-jakarta text-lg font-semibold text-[hsl(var(--foreground))]">
                  {integration.name}
                </Label>
                <p className="text-sm font-outfit text-[hsl(var(--muted-foreground))]">
                  {integration.description}
                </p>
                {integration.apiKey !== undefined && (
                  <div className="mt-4">
                    <Label 
                      htmlFor={`${integration.id}-api-key`} 
                      className="font-plus-jakarta text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      API Key
                    </Label>
                    <Input
                      id={`${integration.id}-api-key`}
                      type="password"
                      value={integration.apiKey}
                      onChange={(e) => updateApiKey(integration.id, e.target.value)}
                      className="input-field mt-2"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {integration.apiKey !== undefined ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConnect(integration.id)}
                  disabled={!integration.apiKey}
                  className="rounded-full font-plus-jakarta text-[hsl(var(--primary))] border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.1)] hover:text-[hsl(var(--primary))] hover-lift transition-all duration-300"
                >
                  {integration.connected ? 'Update' : 'Connect'}
                </Button>
              ) : (
                <Switch
                  id={integration.id}
                  checked={integration.connected}
                  onCheckedChange={() => toggleIntegration(integration.id)}
                  className="data-[state=checked]:bg-[hsl(var(--primary))] data-[state=unchecked]:bg-[hsl(var(--muted))] transition-colors duration-300"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}