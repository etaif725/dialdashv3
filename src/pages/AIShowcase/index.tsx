import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Phone, Trash2, RefreshCw, Settings } from 'lucide-react';
import { getSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AIAgent {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  type: string;
  last_active: string;
  calls_handled: number;
}

export function AIShowcase() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [vapiKey, setVapiKey] = useState('');

  useEffect(() => {
    fetchVapiKey();
    fetchAgents();
  }, [user?.id]);

  const fetchVapiKey = async () => {
    try {
      const { data, error } = await getSupabase()
        .from('user_settings')
        .select('vapi_api_key')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      if (data?.vapi_api_key) {
        setVapiKey(data.vapi_api_key);
      }
    } catch (error) {
      console.error('Error fetching VAPI key:', error);
    }
  };

  const fetchAgents = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual VAPI API call to fetch agents
      // For now using mock data
      const mockAgents: AIAgent[] = [
        {
          id: '1',
          name: 'Sales Agent',
          status: 'active',
          type: 'Sales',
          last_active: new Date().toISOString(),
          calls_handled: 145
        },
        {
          id: '2',
          name: 'Support Agent',
          status: 'inactive',
          type: 'Support',
          last_active: new Date().toISOString(),
          calls_handled: 89
        }
      ];
      setAgents(mockAgents);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to fetch AI agents');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async () => {
    if (!vapiKey) {
      toast.error('Please configure your VAPI API key in Settings > Credentials & API Keys first');
      return;
    }
    // TODO: Implement agent creation
    toast.info('Agent creation coming soon');
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      // TODO: Implement actual agent deletion
      setAgents(agents.filter(agent => agent.id !== agentId));
      toast.success('Agent deleted successfully');
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Failed to delete agent');
    }
  };

  if (!vapiKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Configure VAPI Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              To start using AI Employees, please configure your VAPI API key in Settings.
            </p>
            <Button 
              className="w-full"
              onClick={() => window.location.href = '/settings'}
            >
              <Settings className="mr-2 h-4 w-4" />
              Go to Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Employees</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI voice agents
          </p>
        </div>
        <Button onClick={handleCreateAgent}>
          <Plus className="mr-2 h-4 w-4" />
          New Agent
        </Button>
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">{agent.name}</h3>
                    </div>
                    <Badge 
                      variant={agent.status === 'active' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAgent(agent.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{agent.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Calls Handled:</span>
                    <span className="font-medium">{agent.calls_handled}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Active:</span>
                    <span className="font-medium">
                      {new Date(agent.last_active).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="w-full" variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 