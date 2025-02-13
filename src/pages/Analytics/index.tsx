import { Heading } from '@/components/ui/heading';
import { Card } from '@/components/ui/card';
import { LeadConversionChart } from '@/components/analytics/LeadConversionChart';
import { AppointmentTrendsChart } from '@/components/analytics/AppointmentTrendsChart';
import { SalesPerformanceChart } from '@/components/analytics/SalesPerformanceChart';
import { AnalyticsSummary } from '@/components/analytics/AnalyticsSummary';
import { DateRangePicker } from '@/components/ui/date-range-picker';

export function Analytics() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Heading>Analytics</Heading>
        <DateRangePicker />
      </div>

      {/* Analytics Summary */}
      <div className="grid gap-4">
        <AnalyticsSummary />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4 md:p-6">
          <LeadConversionChart />
        </Card>
        <Card className="p-4 md:p-6">
          <AppointmentTrendsChart />
        </Card>
        <Card className="p-4 md:p-6 md:col-span-2">
          <SalesPerformanceChart />
        </Card>
      </div>
    </div>
  );
} 