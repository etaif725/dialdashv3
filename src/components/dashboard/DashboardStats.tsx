import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Users, Calendar, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/hooks/useSupabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

interface Stat {
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: JSX.Element;
}

function calculateChange(current: number, previous: number): { value: number; trend: 'up' | 'down' | 'neutral' } {
  if (previous === 0) return { value: 0, trend: 'neutral' };
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(change)),
    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
  };
}

export function DashboardStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const { userProfile } = useAuth();
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!userProfile?.organization_id_main) return;

        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

        // Fetch current month's data
        const [currentLeads, currentAppointments, currentCalls] = await Promise.all([
          supabase
            .from('leads')
            .select('id')
            .eq('organization_id', userProfile.organization_id_main)
            .gte('created_at', currentMonthStart)
            .lte('created_at', currentMonthEnd),
          supabase
            .from('appointments')
            .select('id')
            .eq('organization_id', userProfile.organization_id_main)
            .gte('scheduled_at', currentMonthStart)
            .lte('scheduled_at', currentMonthEnd),
          supabase
            .from('leads')
            .select('call_attempts')
            .eq('organization_id', userProfile.organization_id_main)
            .gte('last_called_at', currentMonthStart)
            .lte('last_called_at', currentMonthEnd)
        ]);

        // Fetch last month's data
        const [lastLeads, lastAppointments, lastCalls] = await Promise.all([
          supabase
            .from('leads')
            .select('id')
            .eq('organization_id', userProfile.organization_id_main)
            .gte('created_at', lastMonthStart)
            .lte('created_at', lastMonthEnd),
          supabase
            .from('appointments')
            .select('id')
            .eq('organization_id', userProfile.organization_id_main)
            .gte('scheduled_at', lastMonthStart)
            .lte('scheduled_at', lastMonthEnd),
          supabase
            .from('leads')
            .select('call_attempts')
            .eq('organization_id', userProfile.organization_id_main)
            .gte('last_called_at', lastMonthStart)
            .lte('last_called_at', lastMonthEnd)
        ]);

        if (currentLeads.error) throw currentLeads.error;
        if (currentAppointments.error) throw currentAppointments.error;
        if (currentCalls.error) throw currentCalls.error;
        if (lastLeads.error) throw lastLeads.error;
        if (lastAppointments.error) throw lastAppointments.error;
        if (lastCalls.error) throw lastCalls.error;

        const currentCallsCount = currentCalls.data.reduce((sum, lead) => sum + (lead.call_attempts || 0), 0);
        const lastCallsCount = lastCalls.data.reduce((sum, lead) => sum + (lead.call_attempts || 0), 0);

        const newStats: Stat[] = [
          {
            title: 'New Leads',
            value: currentLeads.data.length,
            change: calculateChange(currentLeads.data.length, lastLeads.data.length).value,
            trend: calculateChange(currentLeads.data.length, lastLeads.data.length).trend,
            icon: <Users className="h-4 w-4" />
          },
          {
            title: 'Appointments',
            value: currentAppointments.data.length,
            change: calculateChange(currentAppointments.data.length, lastAppointments.data.length).value,
            trend: calculateChange(currentAppointments.data.length, lastAppointments.data.length).trend,
            icon: <Calendar className="h-4 w-4" />
          },
          {
            title: 'Calls Made',
            value: currentCallsCount,
            change: calculateChange(currentCallsCount, lastCallsCount).value,
            trend: calculateChange(currentCallsCount, lastCallsCount).trend,
            icon: <Phone className="h-4 w-4" />
          }
        ];

        setStats(newStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to fetch dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userProfile?.organization_id_main, supabase]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex justify-center items-center p-6">
              <LoadingSpinner />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                {stat.icon}
                <span className="text-sm font-medium">{stat.title}</span>
              </div>
              {stat.trend !== 'neutral' && (
                <span className={`flex items-center text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  {stat.change}%
                </span>
              )}
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}