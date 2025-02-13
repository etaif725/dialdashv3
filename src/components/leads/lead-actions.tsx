import { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash, Phone } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { toast } from 'sonner';
import type { Database } from '@/types/database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type Lead = Tables<'leads'>;

interface LeadActionsProps {
  lead: Lead;
}

export function LeadActions({ lead }: LeadActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { updateLead, deleteLead, incrementCallAttempts } = useLeads({
    onError: (error) => {
      toast.error(error.message || 'Operation failed');
    }
  });

  const handleCall = async () => {
    try {
      await updateLead(lead.id, { status: 'contacted' });
      await incrementCallAttempts(lead.id);
      toast.success('Call status updated');
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLead(lead.id);
      toast.success('Lead deleted successfully');
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCall}>
          <Phone className="mr-2 h-4 w-4" />
          Call
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600"
          disabled={isDeleting}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 