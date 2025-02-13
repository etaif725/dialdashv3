import { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import {
  Area,
  AreaChart,
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
  totalLeads: number;
  qualifiedLeads: number;
  conversions: number;
}

export function LeadConversionChart() {
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
            const [totalLeads, qualifiedLeads, conversions] = await Promise.all([
              // Total leads for the month
              supabase
                .from('leads')
                .select('id')
                .eq('organization_id', userProfile.organization_id_main)
                .gte('created_at', start)
                .lte('created_at', end),
              // Qualified leads
              supabase
                .from('leads')
                .select('id')
                .eq('organization_id', userProfile.organization_id_main)
                .eq('status', 'qualified')
                .gte('created_at', start)
                .lte('created_at', end),
              // Converted leads (with appointments)
              supabase
                .from('appointments')
                .select('id')
                .eq('organization_id', userProfile.organization_id_main)
                .gte('scheduled_at', start)
                .lte('scheduled_at', end)
            ]);

            if (totalLeads.error) throw totalLeads.error;
            if (qualifiedLeads.error) throw qualifiedLeads.error;
            if (conversions.error) throw conversions.error;

            return {
              date: label,
              totalLeads: totalLeads.data.length,
              qualifiedLeads: qualifiedLeads.data.length,
              conversions: conversions.data.length
            };
          })
        );

        setData(monthlyData);
      } catch (error) {
        console.error('Error fetching lead conversion data:', error);
        toast.error('Failed to fetch lead conversion data');
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
          <Heading as="h3" size="sm" className="font-plus-jakarta">Lead Conversion</Heading>
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
        <Heading as="h3" size="sm" className="font-plus-jakarta">Lead Conversion</Heading>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--info-foreground))]" />
            <span className="text-[hsl(var(--muted-foreground))] font-medium">Total Leads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--cyan))]" />
            <span className="text-[hsl(var(--muted-foreground))] font-medium">Qualified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--orange))]" />
            <span className="text-[hsl(var(--muted-foreground))] font-medium">Conversions</span>
          </div>
        </div>
      </div>
      <div className="h-[300px] rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
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
            <YAxis className="text-xs font-medium text-[hsl(var(--muted-foreground))]" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-effect p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <span className="text-sm font-medium text-[hsl(var(--foreground))]">Total:</span>
                        <span className="text-sm font-medium text-[hsl(var(--info-foreground))]">
                          {payload[0].value}
                        </span>
                        <span className="text-sm font-medium text-[hsl(var(--foreground))]">Qualified:</span>
                        <span className="text-sm font-medium text-[hsl(var(--cyan))]">
                          {payload[1].value}
                        </span>
                        <span className="text-sm font-medium text-[hsl(var(--foreground))]">Converted:</span>
                        <span className="text-sm font-medium text-[hsl(var(--orange))]">
                          {payload[2].value}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="totalLeads"
              stroke="hsl(var(--info-foreground))"
              fill="hsl(var(--info-foreground))"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="qualifiedLeads"
              stroke="hsl(var(--cyan))"
              fill="hsl(var(--cyan))"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="conversions"
              stroke="hsl(var(--orange))"
              fill="hsl(var(--orange))"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}