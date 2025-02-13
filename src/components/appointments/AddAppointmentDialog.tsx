import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const appointmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.date({ required_error: 'Date is required' }),
  time: z.string().min(1, 'Time is required'),
  type: z.enum(['Meeting', 'Call', 'Follow-up']),
  clientName: z.string().min(1, 'Client name is required'),
  clientCompany: z.string().min(1, 'Client company is required'),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AddAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAppointmentDialog({
  open,
  onOpenChange,
}: AddAppointmentDialogProps) {
  const [date, setDate] = useState<Date>();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      title: '',
      time: '',
      type: 'Meeting',
      clientName: '',
      clientCompany: '',
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      // TODO: Implement appointment creation
      console.log('Appointment data:', data);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Failed to create appointment:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Enter appointment title"
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                    form.setValue('date', date as Date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              {...form.register('time')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              onValueChange={(value) => form.setValue('type', value as AppointmentFormValues['type'])}
              defaultValue={form.getValues('type')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Call">Call</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              {...form.register('clientName')}
              placeholder="Enter client name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientCompany">Client Company</Label>
            <Input
              id="clientCompany"
              {...form.register('clientCompany')}
              placeholder="Enter client company"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Create Appointment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 