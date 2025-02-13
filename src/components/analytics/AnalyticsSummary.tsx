import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import {
  TrendingUp,
  Users,
  Calendar,
  PhoneCall,
  Target,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

interface Metric {
  id: string;
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

function calculateChange(current: number, previous: number): { value: number; trend: 'up' | 'down' | 'neutral' } {
  if (previous === 0) return { value: 0, trend: 'neutral' };
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(change)),
    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
  };
}

export function AnalyticsSummary() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        if (!userProfile?.organization_id_main) return;

        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

        // Fetch current month's data
        const [currentLeads, currentAppointments, currentCalls, currentQualified] = await Promise.all([
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
            .lte('last_called_at', currentMonthEnd),
          supabase
            .from('leads')
            .select('id')
            .eq('organization_id', userProfile.organization_id_main)
            .eq('status', 'qualified')
            .gte('created_at', currentMonthStart)
            .lte('created_at', currentMonthEnd)
        ]);

        // Fetch last month's data
        const [lastLeads, lastAppointments, lastCalls, lastQualified] = await Promise.all([
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
            .lte('last_called_at', lastMonthEnd),
          supabase
            .from('leads')
            .select('id')
            .eq('organization_id', userProfile.organization_id_main)
            .eq('status', 'qualified')
            .gte('created_at', lastMonthStart)
            .lte('created_at', lastMonthEnd)
        ]);

        if (currentLeads.error) throw currentLeads.error;
        if (currentAppointments.error) throw currentAppointments.error;
        if (currentCalls.error) throw currentCalls.error;
        if (currentQualified.error) throw currentQualified.error;
        if (lastLeads.error) throw lastLeads.error;
        if (lastAppointments.error) throw lastAppointments.error;
        if (lastCalls.error) throw lastCalls.error;
        if (lastQualified.error) throw lastQualified.error;

        const currentCallsCount = currentCalls.data.reduce((sum, lead) => sum + (lead.call_attempts || 0), 0);
        const lastCallsCount = lastCalls.data.reduce((sum, lead) => sum + (lead.call_attempts || 0), 0);

        // Calculate conversion rate (qualified leads / total leads)
        const currentConversionRate = currentLeads.data.length > 0 
          ? (currentQualified.data.length / currentLeads.data.length) * 100 
          : 0;
        const lastConversionRate = lastLeads.data.length > 0 
          ? (lastQualified.data.length / lastLeads.data.length) * 100 
          : 0;

        const newMetrics: Metric[] = [
          {
            id: 'conversion-rate',
            name: 'Conversion Rate',
            value: `${currentConversionRate.toFixed(1)}%`,
            change: calculateChange(currentConversionRate, lastConversionRate).value,
            trend: calculateChange(currentConversionRate, lastConversionRate).trend,
            icon: <TrendingUp className="h-5 w-5" />,
            color: 'var(--primary)'
          },
          {
            id: 'total-leads',
            name: 'Total Leads',
            value: currentLeads.data.length.toString(),
            change: calculateChange(currentLeads.data.length, lastLeads.data.length).value,
            trend: calculateChange(currentLeads.data.length, lastLeads.data.length).trend,
            icon: <Users className="h-5 w-5" />,
            color: 'var(--purple)'
          },
          {
            id: 'appointments',
            name: 'Appointments',
            value: currentAppointments.data.length.toString(),
            change: calculateChange(currentAppointments.data.length, lastAppointments.data.length).value,
            trend: calculateChange(currentAppointments.data.length, lastAppointments.data.length).trend,
            icon: <Calendar className="h-5 w-5" />,
            color: 'var(--success)'
          },
          {
            id: 'calls-made',
            name: 'Calls Made',
            value: currentCallsCount.toString(),
            change: calculateChange(currentCallsCount, lastCallsCount).value,
            trend: calculateChange(currentCallsCount, lastCallsCount).trend,
            icon: <PhoneCall className="h-5 w-5" />,
            color: 'var(--cyan)'
          },
          {
            id: 'qualified-leads',
            name: 'Qualified Leads',
            value: currentQualified.data.length.toString(),
            change: calculateChange(currentQualified.data.length, lastQualified.data.length).value,
            trend: calculateChange(currentQualified.data.length, lastQualified.data.length).trend,
            icon: <Target className="h-5 w-5" />,
            color: 'var(--orange)'
          }
        ];

        setMetrics(newMetrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        toast.error('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [userProfile?.organization_id_main, supabase]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Heading as="h2" size="md">Key Metrics</Heading>
        <div className="flex justify-center items-center min-h-[200px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Heading as="h2" size="md">Key Metrics</Heading>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in">
        {metrics.map((metric) => (
          <Card 
            key={metric.id} 
            className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] font-outfit">
                    {metric.name}
                  </p>
                  <p className="text-2xl font-bold text-[hsl(var(--foreground))] font-plus-jakarta">
                    {metric.value}
                  </p>
                </div>
                <div 
                  className="rounded-full p-2.5"
                  style={{
                    backgroundColor: `${metric.color}10`,
                    color: metric.color
                  }}
                >
                  {metric.icon}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[hsl(var(--secondary))] rounded-lg p-2">
                <span
                  className={`text-sm font-semibold font-plus-jakarta ${
                    metric.trend === 'up'
                      ? 'text-[hsl(var(--success))]'
                      : metric.trend === 'down'
                      ? 'text-[hsl(var(--destructive))]'
                      : 'text-[hsl(var(--muted-foreground))]'
                  }`}
                >
                  {metric.trend === 'neutral' ? '--' : `${metric.trend === 'up' ? '+' : '-'}${metric.change}%`}
                </span>
                <span className="text-sm text-[hsl(var(--muted-foreground))] font-outfit">
                  vs last month
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}