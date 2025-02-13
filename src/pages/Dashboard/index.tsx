import { Card } from '@/components/ui/card';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { CallHistory } from '@/components/dashboard/CallHistory';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface Call {
  call_id: string;
  call_type: 'web_call' | 'phone_call';
  agent_id: string;
  call_status: 'error' | 'registered' | 'ongoing' | 'ended';
  start_timestamp: number;
  end_timestamp?: number;
  duration: number;
  client_name: string;
  client_phone: string;
  client_email: string;
  recording_url?: string;
  transcript?: string;
  summary?: string;
  sentiment?: string;
  metadata?: Record<string, unknown>;
  call_analysis?: {
    call_summary?: string;
    user_sentiment?: 'Positive' | 'Neutral' | 'Negative' | 'Unknown';
    agent_sentiment?: 'Neutral' | 'Unknown' | 'Friendly' | 'Unfriendly';
    topics?: string[];
    key_points?: string[];
    action_items?: string[];
    follow_ups?: string[];
    custom_analysis_data?: Record<string, unknown>;
  };
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export function Dashboard() {
  const { user, userProfile } = useAuth();
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        if (!user?.id) return;

        const { data, error } = await getSupabase()
          .from('calls')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          throw error;
        }

        // Transform the data to match the Call interface
        const transformedCalls: Call[] = (data || []).map(call => ({
          call_id: call.id,
          call_type: call.type || 'web_call',
          agent_id: call.agent_id,
          call_status: call.status || 'error',
          start_timestamp: new Date(call.created_at).getTime(),
          end_timestamp: call.ended_at ? new Date(call.ended_at).getTime() : undefined,
          duration: call.duration,
          client_name: call.client_name,
          client_phone: call.client_phone || '',
          client_email: call.client_email || '',
          recording_url: call.recording_url,
          transcript: call.transcript,
          summary: call.summary,
          sentiment: call.sentiment,
          metadata: call.metadata,
          call_analysis: call.analysis
        }));

        setRecentCalls(transformedCalls);
      } catch (error: any) {
        console.error('Error fetching calls:', error);
        toast.error(error.message || 'Failed to fetch recent calls');
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [user?.id]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center p-4 glass-effect">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="welcome-banner-icon">👋 </span>
            {getGreeting()}, {user?.user_metadata?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] mt-1">
            Here's what's happening with your AI Agents today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4">
        <DashboardStats />
      </div>
      
      {/* Call History & Recent Calls */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-[hsl(var(--card))] rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold font-plus-jakarta text-[hsl(var(--foreground))]">
              Call History
            </h2>
            <Button 
              variant="outline"
              className="rounded-full hover-lift bg-[hsl(var(--background))] text-[hsl(var(--primary))] border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.1)] transition-all duration-300"
            >
              <Phone className="mr-2 h-4 w-4" />
              View All
            </Button>
          </div>
          <div className="pb-12">
            <CallHistory calls={[]} />
          </div>
        </div>
      </div>

      {/* Activity and Appointments Grid */}
      <div className="flex flex-col md:grid md:grid-cols-8 gap-4">
        <Card className="md:col-span-4 p-4 md:p-3">
          <RecentActivity />
        </Card>
        <Card className="md:col-span-4 p-4 md:p-3">
          <UpcomingAppointments />
        </Card>
      </div>
    </div>
  );
} 