import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { Calendar, Mail, MessageSquare, Phone } from 'lucide-react';
import { getSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  credentials?: {
    [key: string]: string;
  };
}

export function CredentialsApiSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [credentialsApi, setCredentialsApi] = useState<Integration[]>([
    {
      id: 'cal-com',
      name: 'Cal.com',
      description: 'Sync your appointments with Cal.com',
      icon: <Calendar className="h-6 w-6" />,
      connected: false,
      credentials: {
        calcom_api_key: '',
      }
    },
    {
      id: 'vapi-ai',
      name: 'Vapi',
      description: 'Receive agent data from Vapi',
      icon: <Phone className="h-6 w-6" />,
      connected: false,
      credentials: {
        vapi_api_key: '',
      }
    },
    {
      id: 'twilio',
      name: 'Twilio',
      description: 'Send SMS notifications via Twilio',
      icon: <Phone className="h-6 w-6" />,
      connected: false,
      credentials: {
        twilio_account_sid: '',
        twilio_auth_token: '',
        twilio_phone_number: ''
      }
    },
    {
      id: 'resend',
      name: 'Resend',
      description: 'Send emails via Resend',
      icon: <Mail className="h-6 w-6" />,
      connected: false,
      credentials: {
        resend_api_key: '',
      }
    },
    {
      id: 'retell',
      name: 'Retell',
      description: 'Receive agent data from Retell',
      icon: <MessageSquare className="h-6 w-6" />,
      connected: false,
      credentials: {
        retell_api_key: '',
      }
    },
  ]);

  useEffect(() => {
    const fetchCredentials = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        // Fetch existing credentials
        const { data, error } = await getSupabase()
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          // Update local state with existing credentials
          setCredentialsApi(prev => prev.map(integration => {
            const credentials = integration.credentials ? 
              Object.keys(integration.credentials).reduce((acc, key) => {
                acc[key] = data[key] || '';
                return acc;
              }, {} as Record<string, string>) : {};

            return {
              ...integration,
              connected: Object.values(credentials).some(val => val !== ''),
              credentials
            };
          }));
        }
      } catch (error) {
        console.error('Error fetching credentials:', error);
        toast.error('Failed to fetch credentials');
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, [user?.id]);

  const updateCredential = (id: string, key: string, value: string) => {
    setCredentialsApi((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              credentials: {
                ...integration.credentials,
                [key]: value
              }
            }
          : integration
      )
    );
  };

  const handleConnect = async (integration: Integration) => {
    if (!user?.id) {
      toast.error('Please sign in to save credentials');
      return;
    }

    try {
      // Validate that at least one credential field is filled
      if (!integration.credentials || Object.values(integration.credentials).every(val => !val)) {
        throw new Error('At least one credential field is required');
      }

      // Get existing settings first
      const { data: existingSettings } = await getSupabase()
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Prepare update data, preserving existing values
      const settingsData = {
        user_id: user.id,
        ...(existingSettings || {}),
        ...integration.credentials
      };

      // Remove null/empty values to prevent overwriting existing values
      Object.keys(integration.credentials).forEach(key => {
        if (!integration.credentials?.[key]) {
          delete settingsData[key];
        }
      });

      // Save credentials to user_settings table
      const { error } = await getSupabase()
        .from('user_settings')
        .upsert(settingsData, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      // Update local state
      setCredentialsApi((prev) =>
        prev.map((item) =>
          item.id === integration.id
            ? { ...item, connected: true }
            : item
        )
      );

      toast.success('Credentials saved successfully');
    } catch (error: any) {
      console.error('Error saving credentials:', error);
      toast.error(typeof error.message === 'string' ? error.message : 'Error saving credentials');
    }
  };

  const handleGenerateKey = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const newApiKey = generateApiKey(); // Implement this function to generate a secure key
      
      const { error } = await getSupabase()
        .from('api_credentials')
        .upsert({
          user_id: user.id,
          api_key: newApiKey,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setApiKey(newApiKey);
      toast.success('API key generated successfully');
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error('Failed to generate API key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="grid gap-4">
        {credentialsApi.map((integration) => (
          <div
            key={integration.id}
            className="flex flex-col space-y-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm"
          >
            <div className="flex items-start space-x-6">
              <div className="rounded-lg bg-[hsl(var(--primary)/.1)] p-3 text-[hsl(var(--primary))]">
                {integration.icon}
              </div>
              <div className="space-y-2">
                <Label className="font-plus-jakarta text-lg font-semibold text-[hsl(var(--foreground))]">
                  {integration.name}
                </Label>
                <p className="text-sm font-outfit text-[hsl(var(--muted-foreground))]">
                  {integration.description}
                </p>
              </div>
            </div>

            {integration.credentials && (
              <div className="grid gap-4 pt-4">
                {Object.entries(integration.credentials).map(([key, value]) => (
                  <div key={key}>
                    <Input
                      id={`${integration.id}-${key}`}
                      type="password"
                      value={value}
                      onChange={(e) => updateCredential(integration.id, key, e.target.value)}
                      className="mt-2 input-field"
                    />
                  </div>
                ))}
                <div className="mt-6">
                  <Button
                    variant="outline"
                    
                    onClick={() => handleConnect(integration)}
                    disabled={integration.connected}
                    className="button-primary hover-lift w-full sm:w-auto font-plus-jakarta"
                  >
                    {integration.connected ? 'Connected' : 'Save Credentials'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function generateApiKey(): string {
  // Generate a random string of 32 characters
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 32;
  let result = '';
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return `dk_${result}`;
}
