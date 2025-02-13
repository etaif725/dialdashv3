import { useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { AppointmentCalendar } from '@/components/appointments/AppointmentCalendar';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { AppointmentFilters } from '@/components/appointments/AppointmentFilters';
import { AddAppointmentDialog } from '@/components/appointments/AddAppointmentDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Appointments() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Heading>Appointments</Heading>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Appointment
        </Button>
      </div>
      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <AppointmentCalendar />
        </TabsContent>
        <TabsContent value="list">
          <AppointmentFilters />
          <AppointmentList />
        </TabsContent>
      </Tabs>
      <AddAppointmentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
} 