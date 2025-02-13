"use client";

import * as React from 'react';
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Meeting' | 'Call' | 'Follow-up';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  clientName: string;
}

export function AppointmentCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'Product Demo',
      date: '2024-02-15',
      time: '10:00 AM',
      type: 'Meeting',
      status: 'Scheduled',
      clientName: 'John Smith',
    },
    // Add more sample data as needed
  ]);

  const getStatusColor = (status: Appointment['status']) => {
    const colors = {
      Scheduled: 'bg-blue-100 text-blue-800',
      Completed: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  return (
    <div className="grid gap-4 md:grid-cols-[300px_1fr]">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {date ? formatDate(date) : 'Select a date'}
          </span>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </Card>
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-medium">
            Appointments for {date ? formatDate(date) : 'Selected Date'}
          </h3>
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div>
                <h4 className="font-medium">{appointment.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {appointment.time} with {appointment.clientName}
                </p>
              </div>
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 