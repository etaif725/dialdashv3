"use client";

import * as React from 'react';
import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { toast } from 'sonner';
import type { Database } from '@/types/database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type Appointment = Tables<'appointments'>;

interface AppointmentCardProps {
  appointment: Appointment;
  onUpdate?: () => void;
}

export function AppointmentCard({ appointment, onUpdate }: AppointmentCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { updateAppointment, deleteAppointment } = useAppointments();

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsLoading(true);
      await updateAppointment(appointment.id, { status: newStatus });
      toast.success('Appointment status updated');
      onUpdate?.();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
      setIsLoading(true);
      await deleteAppointment(appointment.id);
      toast.success('Appointment deleted');
      onUpdate?.();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">Scheduled Appointment</h3>
          <Badge variant={appointment.status === 'completed' ? 'success' : 'default'}>
            {appointment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(appointment.scheduled_at), 'PPP')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{format(new Date(appointment.scheduled_at), 'p')} ({appointment.duration} minutes)</span>
        </div>
        {appointment.appointment_url && (
          <div className="flex items-center gap-2 text-sm">
            <a 
              href={appointment.appointment_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Join Meeting
            </a>
          </div>
        )}
        {appointment.notes && (
          <p className="text-sm mt-2">{appointment.notes}</p>
        )}
      </CardContent>
      <div className="px-6 pb-4 flex gap-2">
        {appointment.status !== 'completed' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('completed')}
            disabled={isLoading}
          >
            Mark as Completed
          </Button>
        )}
        {appointment.status === 'completed' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('scheduled')}
            disabled={isLoading}
          >
            Mark as Scheduled
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isLoading}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
} 