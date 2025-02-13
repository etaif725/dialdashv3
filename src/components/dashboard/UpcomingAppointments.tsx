import { format } from 'date-fns';
import { Calendar, Video, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface Appointment {
  id: string;
  title: string;
  scheduled_at: Date;
  type: 'video' | 'phone';
  status: 'confirmed' | 'pending' | 'cancelled';
  attendees: string[];
  description?: string;
  meeting_url?: string;
  metadata?: Record<string, unknown>;
}

const getStatusColor = (status: Appointment['status']) => {
  switch (status) {
    case 'confirmed':
      return 'bg-[hsl(var(--success)/.15)] text-[hsl(var(--success))] border-[hsl(var(--success)/.2)]';
    case 'pending':
      return 'bg-[hsl(var(--warning)/.15)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/.2)]';
    case 'cancelled':
      return 'bg-[hsl(var(--destructive)/.15)] text-[hsl(var(--destructive))] border-[hsl(var(--destructive)/.2)]';
  }
};

export function UpcomingAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!user?.id) return;

        const { data, error } = await getSupabase()
          .from('appointments')
          .select(`
            id,
            title,
            scheduled_at,
            type,
            status,
            description,
            meeting_url,
            metadata,
            appointment_attendees (
              attendee_name,
              attendee_email
            )
          `)
          .eq('user_id', user.id)
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(4);

        if (error) throw error;

        const transformedAppointments: Appointment[] = (data || []).map(apt => ({
          id: apt.id,
          title: apt.title,
          scheduled_at: new Date(apt.scheduled_at),
          type: apt.type || 'video',
          status: apt.status || 'pending',
          description: apt.description,
          meeting_url: apt.meeting_url,
          metadata: apt.metadata,
          attendees: apt.appointment_attendees?.map(
            (attendee: { attendee_name: string; attendee_email: string }) => 
              attendee.attendee_name || attendee.attendee_email
          ) || []
        }));

        setAppointments(transformedAppointments);
      } catch (error: any) {
        console.error('Error fetching appointments:', error);
        toast.error(error.message || 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.id]);

  const handleJoinMeeting = (appointment: Appointment) => {
    if (appointment.meeting_url) {
      window.open(appointment.meeting_url, '_blank');
    } else {
      toast.error('No meeting URL available');
    }
  };

  return (
    <div className="bg-[hsl(var(--card))] rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold font-plus-jakarta text-[hsl(var(--foreground))]">
          Upcoming Appointments
        </h2>
        <Button 
          variant="outline"
          className="rounded-full hover-lift bg-[hsl(var(--background))] text-[hsl(var(--primary))] border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.1)] transition-all duration-300"
        >
          <Calendar className="mr-2 h-4 w-4" />
          View Calendar
        </Button>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <LoadingSpinner size="sm" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-4">
            <img src="/2d8256c9773cUOchai4e.svg" alt="No activities" width={100} height={100} />
            <p className="text-sm text-[hsl(var(--muted-foreground))]">No upcoming appointments found.</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-[hsl(var(--muted))]"
            >
              <div className="flex items-start justify-between space-x-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold font-plus-jakarta text-[hsl(var(--foreground))]">
                      {appointment.title}
                    </span>
                    <Badge
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] font-outfit">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(appointment.scheduled_at, "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] font-outfit">
                    {appointment.type === 'video' ? (
                      <Video className="h-4 w-4" />
                    ) : (
                      <Phone className="h-4 w-4" />
                    )}
                    <span>
                      {appointment.type === 'video' ? 'Video Call' : 'Phone Call'}
                    </span>
                  </div>
                  {appointment.description && (
                    <div className="text-sm text-[hsl(var(--muted-foreground))] font-outfit">
                      {appointment.description}
                    </div>
                  )}
                  {appointment.attendees.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {appointment.attendees.map((attendee) => (
                        <Badge 
                          key={attendee}
                          variant="secondary"
                          className="bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted)/.8)] px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200"
                        >
                          {attendee}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {appointment.status === 'confirmed' && (
                  <Button 
                    onClick={() => handleJoinMeeting(appointment)}
                    className="rounded-full hover-lift bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/.9)] shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    Join
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}