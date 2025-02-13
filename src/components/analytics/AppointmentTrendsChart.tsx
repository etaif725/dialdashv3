import { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

interface DataPoint {
  date: string;
  scheduled: number;
  completed: number;
  cancelled: number;
}

export function AppointmentTrendsChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userProfile?.organization_id_main) return;

        // Get data for the last 6 months
        const now = new Date();
        const months = Array.from({ length: 6 }, (_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          return {
            start: date.toISOString(),
            end: new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString(),
            label: date.toISOString().slice(0, 7) // YYYY-MM format
          };
        }).reverse();

        const monthlyData = await Promise.all(
          months.map(async ({ start, end, label }) => {
            const [scheduled, completed, cancelled] = await Promise.all([
              // Total scheduled appointments
              supabase
                .from('appointments')
                .select('id')
                .eq('organization_id', userProfile.organization_id_main)
                .gte('scheduled_at', start)
                .lte('scheduled_at', end),
              // Completed appointments
              supabase
                .from('appointments')
                .select('id')
                .eq('organization_id', userProfile.organization_id_main)
                .eq('status', 'completed')
                .gte('scheduled_at', start)
                .lte('scheduled_at', end),
              // Cancelled appointments
              supabase
                .from('appointments')
                .select('id')
                .eq('organization_id', userProfile.organization_id_main)
                .eq('status', 'cancelled')
                .gte('scheduled_at', start)
                .lte('scheduled_at', end)
            ]);

            if (scheduled.error) throw scheduled.error;
            if (completed.error) throw completed.error;
            if (cancelled.error) throw cancelled.error;

            return {
              date: label,
              scheduled: scheduled.data.length,
              completed: completed.data.length,
              cancelled: cancelled.data.length
            };
          })
        );

        setData(monthlyData);
      } catch (error) {
        console.error('Error fetching appointment trends data:', error);
        toast.error('Failed to fetch appointment trends data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userProfile?.organization_id_main, supabase]);

  if (loading) {
    return (
      <div className="space-y-4 rounded-lg p-6 border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-300">
        <div className="flex items-center justify-between">
          <Heading as="h3" size="sm" className="font-plus-jakarta">Appointment Trends</Heading>
        </div>
        <div className="flex justify-center items-center h-[300px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg p-6 border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-300">
      <div className="flex items-center justify-between">
        <Heading as="h3" size="sm" className="font-plus-jakarta">Appointment Trends</Heading>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--info-foreground))]" />
            <span className="text-[hsl(var(--muted-foreground))]">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--success))]" />
            <span className="text-[hsl(var(--muted-foreground))]">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--destructive))]" />
            <span className="text-[hsl(var(--muted-foreground))]">Cancelled</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-[hsl(var(--muted))]" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('default', { month: 'short' });
              }}
              className="text-xs text-[hsl(var(--muted-foreground))]"
            />
            <YAxis className="text-xs text-[hsl(var(--muted-foreground))]" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-effect p-3">
                      <div className="grid grid-cols-2 gap-3">
                        <span className="text-sm font-medium text-[hsl(var(--foreground))]">Scheduled:</span>
                        <span className="text-sm font-medium text-[hsl(var(--info-foreground))]">
                          {payload[0].value}
                        </span>
                        <span className="text-sm font-medium text-[hsl(var(--foreground))]">Completed:</span>
                        <span className="text-sm font-medium text-[hsl(var(--success))]">
                          {payload[1].value}
                        </span>
                        <span className="text-sm font-medium text-[hsl(var(--foreground))]">Cancelled:</span>
                        <span className="text-sm font-medium text-[hsl(var(--destructive))]">
                          {payload[2].value}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="scheduled" fill="hsl(var(--info-foreground))" radius={[6, 6, 0, 0]} />
            <Bar dataKey="completed" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
            <Bar dataKey="cancelled" fill="hsl(var(--destructive))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}