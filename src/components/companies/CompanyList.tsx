"use client";

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { CompanyFilters } from './CompanyFilters';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { Database } from '@/types/database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type Company = Tables<'companies'>;
type SortField = keyof Company;

interface CompanyListProps {
  filters: CompanyFilters;
  onLoadingChange?: (isLoading: boolean) => void;
}

export function CompanyList({ filters, onLoadingChange }: CompanyListProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [sortField, setSortField] = useState<SortField>('company_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const { userProfile } = useAuth();
  const { getAll, remove } = useSupabase({
    handleError: (error) => {
      toast.error(error.message || 'An error occurred');
    }
  });

  const updateLoading = (loading: boolean) => {
    setIsLoading(loading);
    onLoadingChange?.(loading);
  };

  const fetchCompanies = async () => {
    if (!userProfile?.organization_id_main) return;

    try {
      updateLoading(true);
      const { data, count } = await getAll('companies', {
        filters: {
          organization_id: userProfile.organization_id_main,
          ...(filters.status !== 'all' && { status: filters.status }),
          ...(filters.industry !== 'all' && { company_niche: filters.industry }),
          ...(filters.size !== 'all' && { company_size: filters.size }),
        },
        ...(filters.search && {
          search: { column: 'company_name', query: filters.search }
        })
      });

      setCompanies(data as Company[]);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to fetch companies');
    } finally {
      updateLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [filters, sortField, sortOrder, userProfile?.organization_id_main]);

  const handleSort = async (field: SortField) => {
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality with dialog
    console.log('Edit company:', id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;

    try {
      updateLoading(true);
      await remove('companies', id);
      toast.success('Company deleted successfully');
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company');
    } finally {
      updateLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('company_name')}
                className="flex items-center gap-1"
              >
                Company Name
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">{company.company_name}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  Active
                </Badge>
              </TableCell>
              <TableCell>{company.company_niche || 'N/A'}</TableCell>
              <TableCell>{company.company_size || 'N/A'}</TableCell>
              <TableCell>{company.company_city || 'N/A'}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{company.company_email || 'N/A'}</span>
                  <span className="text-sm text-gray-500">{company.company_phone || 'N/A'}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(company.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(company.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 