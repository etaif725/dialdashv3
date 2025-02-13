import { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

interface DataPoint {
  date: string;
  revenue: number;
  target: number;
  deals: number;
}

export function SalesPerformanceChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();
  const { supabase } = useSupabase();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

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
            const [deals, revenue] = await Promise.all([
              // Completed deals (appointments)
              supabase
                .from('appointments')
                .select('id')
                .eq('organization_id', userProfile.organization_id_main)
                .eq('status', 'completed')
                .gte('scheduled_at', start)
                .lte('scheduled_at', end),
              // Revenue from deals
              supabase
                .from('appointments')
                .select('deal_value')
                .eq('organization_id', userProfile.organization_id_main)
                .eq('status', 'completed')
                .gte('scheduled_at', start)
                .lte('scheduled_at', end)
            ]);

            if (deals.error) throw deals.error;
            if (revenue.error) throw revenue.error;

            const totalRevenue = revenue.data.reduce((sum, deal) => sum + (deal.deal_value || 0), 0);
            const monthlyTarget = 50000; // TODO: Make this configurable per organization

            return {
              date: label,
              revenue: totalRevenue,
              target: monthlyTarget,
              deals: deals.data.length
            };
          })
        );

        setData(monthlyData);
      } catch (error) {
        console.error('Error fetching sales performance data:', error);
        toast.error('Failed to fetch sales performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userProfile?.organization_id_main, supabase]);

  if (loading) {
    return (
      <div className="space-y-4 p-6 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--card))] transition-all duration-300">
        <div className="flex items-center justify-between">
          <Heading as="h3" size="sm" className="font-plus-jakarta">Sales Performance</Heading>
        </div>
        <div className="flex justify-center items-center h-[300px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--card))] transition-all duration-300">
      <div className="flex items-center justify-between">
        <Heading as="h3" size="sm" className="font-plus-jakarta">Sales Performance</Heading>
        <div className="flex items-center gap-4 p-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--info-foreground))]" />
            <span className="text-[hsl(var(--muted-foreground))] font-medium">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--muted))]" />
            <span className="text-[hsl(var(--muted-foreground))] font-medium">Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--success))]" />
            <span className="text-[hsl(var(--muted-foreground))] font-medium">Deals</span>
          </div>
        </div>
      </div>
      <div className="h-[300px] rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
              className="text-xs font-medium text-[hsl(var(--muted-foreground))]"
            />
            <YAxis
              yAxisId="left"
              className="text-xs font-medium text-[hsl(var(--muted-foreground))]"
              tickFormatter={formatCurrency}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              className="text-xs font-medium text-[hsl(var(--muted-foreground))]"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-effect p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <span className="text-sm font-medium text-[hsl(var(--foreground))]">Revenue:</span>
                        <span className="text-sm font-medium text-[hsl(var(--info-foreground))]">
                          {formatCurrency(payload[0].value as number)}
                        </span>
                        <span className="text-sm font-medium text-[hsl(var(--foreground))]">Target:</span>
                        <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                          {formatCurrency(payload[1].value as number)}
                        </span>
                        <span className="text-sm font-medium text-[hsl(var(--foreground))]">Deals:</span>
                        <span className="text-sm font-medium text-[hsl(var(--success))]">
                          {payload[2].value}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--info-foreground))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="target"
              stroke="hsl(var(--muted))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="deals"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}