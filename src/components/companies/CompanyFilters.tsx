"use client";

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface CompanyFilters {
  search: string;
  status: string;
  industry: string;
  size: string;
}

interface FilterProps {
  onFilterChange: (filters: CompanyFilters) => void;
  isLoading?: boolean;
}

const statuses = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
];

const industries = [
  { label: 'All', value: 'all' },
  { label: 'Technology', value: 'technology' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Retail', value: 'retail' },
];

const companySizes = [
  { label: 'All', value: 'all' },
  { label: '1-10', value: '1-10' },
  { label: '10-50', value: '10-50' },
  { label: '50-100', value: '50-100' },
  { label: '100-500', value: '100-500' },
  { label: '500+', value: '500+' },
];

export function CompanyFilters({ onFilterChange, isLoading }: FilterProps) {
  const [open, setOpen] = useState({
    status: false,
    industry: false,
    size: false,
  });
  const [filters, setFilters] = useState<CompanyFilters>({
    search: '',
    status: 'all',
    industry: 'all',
    size: 'all',
  });

  const handleFilterChange = (key: keyof CompanyFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search companies..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full"
            disabled={isLoading}
          />
        </div>

        <Popover
          open={open.status}
          onOpenChange={(isOpen) => setOpen({ ...open, status: isOpen })}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open.status}
              className="w-[200px] justify-between"
              disabled={isLoading}
            >
              {filters.status === 'all'
                ? 'Select status'
                : statuses.find((status) => status.value === filters.status)?.label}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search status..." />
              <CommandEmpty>No status found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    onSelect={() => {
                      handleFilterChange('status', status.value);
                      setOpen({ ...open, status: false });
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        filters.status === status.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {status.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover
          open={open.industry}
          onOpenChange={(isOpen) => setOpen({ ...open, industry: isOpen })}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open.industry}
              className="w-[200px] justify-between"
              disabled={isLoading}
            >
              {filters.industry === 'all'
                ? 'Select industry'
                : industries.find((industry) => industry.value === filters.industry)?.label}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search industry..." />
              <CommandEmpty>No industry found.</CommandEmpty>
              <CommandGroup>
                {industries.map((industry) => (
                  <CommandItem
                    key={industry.value}
                    onSelect={() => {
                      handleFilterChange('industry', industry.value);
                      setOpen({ ...open, industry: false });
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        filters.industry === industry.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {industry.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover
          open={open.size}
          onOpenChange={(isOpen) => setOpen({ ...open, size: isOpen })}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open.size}
              className="w-[200px] justify-between"
              disabled={isLoading}
            >
              {filters.size === 'all'
                ? 'Select size'
                : companySizes.find((size) => size.value === filters.size)?.label}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search size..." />
              <CommandEmpty>No size found.</CommandEmpty>
              <CommandGroup>
                {companySizes.map((size) => (
                  <CommandItem
                    key={size.value}
                    onSelect={() => {
                      handleFilterChange('size', size.value);
                      setOpen({ ...open, size: false });
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        filters.size === size.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {size.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
} 