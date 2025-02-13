import { useState } from 'react';
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
import { formatDate } from '@/lib/utils';

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Meeting' | 'Call' | 'Follow-up';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  clientName: string;
  clientCompany: string;
}

export function AppointmentList() {
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'Product Demo',
      date: '2024-02-15',
      time: '10:00 AM',
      type: 'Meeting',
      status: 'Scheduled',
      clientName: 'John Smith',
      clientCompany: 'Tech Corp',
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell className="font-medium">
                {appointment.title}
              </TableCell>
              <TableCell>
                {formatDate(appointment.date)} at {appointment.time}
              </TableCell>
              <TableCell>{appointment.type}</TableCell>
              <TableCell>
                {appointment.clientName}
                <br />
                <span className="text-sm text-muted-foreground">
                  {appointment.clientCompany}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  className={getStatusColor(appointment.status)}
                  variant="secondary"
                >
                  {appointment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 