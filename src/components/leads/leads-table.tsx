import { useState, useEffect } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell,
  TableHead
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Database } from '@/types/database.types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { LeadActions } from './lead-actions';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type Lead = Tables<'leads'>;

interface LeadsTableProps {
  initialLeads?: Lead[];
}

function LeadStatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, string> = {
    new: 'bg-yellow-100 text-yellow-800',
    contacted: 'bg-blue-100 text-blue-800',
    qualified: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800'
  };

  return (
    <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
      {status.replace('_', ' ')}
    </Badge>
  );
}

export function LeadsTable({ initialLeads = [] }: LeadsTableProps) {
  const { userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);

  const {
    loading,
    getLeads
  } = useLeads({
    organizationId: userProfile?.organization_id_main || undefined,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch leads');
    }
  });

  useEffect(() => {
    async function fetchLeads() {
      if (userProfile?.organization_id_main) {
        const result = await getLeads({
          page,
          limit: pageSize,
          search: debouncedSearch || undefined,
        });
        setLeads(result.leads);
        setTotal(result.total);
      }
    }
    fetchLeads();
  }, [userProfile?.organization_id_main, page, pageSize, debouncedSearch, getLeads]);

  const totalPages = Math.ceil((total || 0) / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setPage(1)}>Refresh</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : leads?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No leads found
                </TableCell>
              </TableRow>
            ) : (
              leads?.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    {lead.full_name}
                  </TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>
                    <LeadStatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell>
                    <LeadActions lead={lead} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <span className="py-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
} 