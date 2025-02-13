"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  User,
  Building2,
  Phone,
  Mail,
  Calendar,
  Tag,
  Edit,
  Trash2,
  PhoneCall,
} from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { useLeads } from '@/hooks/useLeads';
import { useAppointments } from '@/hooks/useAppointments';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Database } from '@/types/database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type Lead = Tables<'leads'>;
type Appointment = Tables<'appointments'>;

interface LeadCardProps {
  lead: Lead;
  onUpdate?: () => void;
}

export function LeadCard({ lead, onUpdate }: LeadCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { updateLead, deleteLead, incrementCallAttempts } = useLeads();
  const { createAppointment } = useAppointments();
  const { userProfile } = useAuth();

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsLoading(true);
      await updateLead(lead.id, { status: newStatus });
      toast.success('Lead status updated');
      onUpdate?.();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = async () => {
    try {
      setIsLoading(true);
      await incrementCallAttempts(lead.id);
      toast.success('Call attempt recorded');
      onUpdate?.();
    } catch (error) {
      console.error('Error recording call:', error);
      toast.error('Failed to record call attempt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!userProfile?.organization_id_main) {
      toast.error('Organization ID is required');
      return;
    }

    try {
      setIsLoading(true);
      const appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'> = {
        organization_id: userProfile.organization_id_main,
        user_id: userProfile.id,
        lead_id: lead.id,
        status: 'scheduled',
        scheduled_at: new Date().toISOString(),
        duration: 30,
        notes: `Initial consultation with ${lead.full_name}`,
        event_settings_id: null,
        appointment_id: null,
        appointment_url: null
      };
      await createAppointment(appointment);
      toast.success('Appointment scheduled');
      onUpdate?.();
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast.error('Failed to schedule appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      setIsLoading(true);
      await deleteLead(lead.id);
      toast.success('Lead deleted');
      onUpdate?.();
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold font-plus-jakarta text-[hsl(var(--foreground))]">{lead.full_name}</CardTitle>
        <Badge variant={lead.status === 'qualified' ? 'success' : 'default'}>
          {lead.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center space-x-4 text-sm text-[hsl(var(--muted-foreground))] font-outfit">
            <Building2 className="h-4 w-4" />
            <span>Source: {lead.source || 'Not specified'}</span>
          </div>
          {lead.email && (
            <div className="flex items-center space-x-4 text-sm text-[hsl(var(--muted-foreground))] font-outfit">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${lead.email}`} className="hover:underline">
                {lead.email}
              </a>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center space-x-4 text-sm text-[hsl(var(--muted-foreground))] font-outfit">
              <Phone className="h-4 w-4" />
              <a href={`tel:${lead.phone}`} className="hover:underline">
                {lead.phone}
              </a>
            </div>
          )}
          <div className="flex items-center space-x-4 text-sm text-[hsl(var(--muted-foreground))] font-outfit">
            <Calendar className="h-4 w-4" />
            <span>Created: {format(new Date(lead.created_at), 'PPP')}</span>
          </div>
          {lead.notes && (
            <div className="mt-4 text-sm font-outfit">
              <p className="font-medium mb-1 text-[hsl(var(--foreground))]">Notes:</p>
              <p className="text-[hsl(var(--muted-foreground))]">{lead.notes}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            className="rounded-full hover-lift bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm hover:shadow-md transition-all duration-300"
            size="sm"
            onClick={handleCall}
            disabled={isLoading}
          >
            <PhoneCall className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button
            className="rounded-full hover-lift bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/.8)] shadow-sm hover:shadow-md transition-all duration-300"
            size="sm"
            onClick={handleSchedule}
            disabled={isLoading}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          {lead.status !== 'qualified' && (
            <Button
              className="rounded-full hover-lift bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/.8)] shadow-sm hover:shadow-md transition-all duration-300"
              size="sm"
              onClick={() => handleStatusChange('qualified')}
              disabled={isLoading}
            >
              Qualify
            </Button>
          )}
          <Button
            className="rounded-full hover-lift bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive)/.8)] shadow-sm hover:shadow-md transition-all duration-300"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}