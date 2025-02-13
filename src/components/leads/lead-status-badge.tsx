import { Badge } from '@/components/ui/badge';
import type { CallStatus } from '@/types/database';

const statusColors: Record<CallStatus, {
  color: string;
  label: string;
}> = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  calling: { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
  no_answer: { color: 'bg-red-100 text-red-800', label: 'No Answer' },
  scheduled: { color: 'bg-green-100 text-green-800', label: 'Scheduled' },
  bad_lead: { color: 'bg-gray-100 text-gray-800', label: 'Bad Lead' },
  error: { color: 'bg-red-100 text-red-800', label: 'Error' },
};

interface LeadStatusBadgeProps {
  status: CallStatus;
}

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const { color, label } = statusColors[status];
  
  return (
    <Badge className={color}>
      {label}
    </Badge>
  );
} 