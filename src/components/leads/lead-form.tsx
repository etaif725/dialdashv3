import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '../ui/toast';
import { handleApiError } from '../../utils/errors';
import { api } from '../../lib/api/client';

const leadFormSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  notes: z.string().optional(),
  tags: z.array(z.string()),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

export const LeadForm = () => {
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      tags: [],
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      await api.createLead(data);
      toast({
        title: 'Success',
        description: 'Lead created successfully',
      });
    } catch (error) {
      toast(handleApiError(error));
    }
  };

  // Form JSX...
}; 