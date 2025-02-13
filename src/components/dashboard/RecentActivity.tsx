import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Phone, Calendar, User, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/hooks/useSupabase';
import { toast } from 'sonner';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { Database } from '@/types/database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type Lead = Tables<'leads'>;
type Appointment = Tables<'appointments'>;

interface Activity {
  id: string;
  type: 'lead' | 'appointment';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

function getActivityIcon(type: Activity['type']) {
  switch (type) {
    case 'lead':
      return <User className="h-4 w-4" />;
    case 'appointment':
      return <Calendar className="h-4 w-4" />;
  }
}

export function RecentActivity() {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (!userProfile?.organization_id_main) return;

        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

        // Fetch recent leads and appointments
        const [leads, appointments] = await Promise.all([
          supabase
            .from('leads')
            .select('*')
            .eq('organization_id', userProfile.organization_id_main)
            .gte('created_at', thirtyDaysAgo.toISOString())
            .order('created_at', { ascending: false })
            .limit(10),
          supabase
            .from('appointments')
            .select('*')
            .eq('organization_id', userProfile.organization_id_main)
            .gte('scheduled_at', thirtyDaysAgo.toISOString())
            .order('scheduled_at', { ascending: false })
            .limit(10)
        ]);

        if (leads.error) throw leads.error;
        if (appointments.error) throw appointments.error;

        // Transform and combine activities
        const allActivities: Activity[] = [
          ...(leads.data || []).map((lead: Lead) => ({
            id: lead.id,
            type: 'lead' as const,
            title: `New Lead: ${lead.full_name}`,
            description: lead.source || 'No source specified',
            timestamp: new Date(lead.created_at),
            metadata: {
              status: lead.status,
              email: lead.email,
              phone: lead.phone
            }
          })),
          ...(appointments.data || []).map((apt: Appointment) => ({
            id: apt.id,
            type: 'appointment' as const,
            title: 'Appointment Scheduled',
            description: `Duration: ${apt.duration} minutes`,
            timestamp: new Date(apt.scheduled_at),
            metadata: {
              status: apt.status,
              notes: apt.notes
            }
          }))
        ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
         .slice(0, 10);

        setActivities(allActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast.error('Failed to fetch recent activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userProfile?.organization_id_main, supabase]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="text-center p-8 text-muted-foreground">
          No recent activity found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 rounded-lg border bg-card"
          >
            <div className="p-2 rounded-full bg-primary/10">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </p>
            </div>
            <Badge variant={activity.type === 'lead' ? 'default' : 'secondary'}>
              {activity.type}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}