import React, { useState, useEffect } from 'react';
import { Phone, Clock, User, X, MessageSquare, BarChart2, Heart, PlayCircle } from 'lucide-react';
import { Pagination } from '../leads/lead-table/pagination';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { getSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Database } from '@/types/database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type CallLog = Tables<'call_logs'>;

interface Call {
  call_id: string;
  call_type: 'web_call' | 'phone_call';
  agent_id: string;
  call_status: 'error' | 'registered' | 'ongoing' | 'ended';
  start_timestamp: number;
  end_timestamp?: number;
  duration: number;
  client_name: string;
  client_phone: string;
  client_email: string;
  recording_url?: string;
  transcript?: string;
  summary?: string;
  sentiment?: string;
  metadata?: Record<string, unknown>;
  call_analysis?: {
    call_summary?: string;
    user_sentiment?: 'Positive' | 'Neutral' | 'Negative' | 'Unknown';
    agent_sentiment?: 'Neutral' | 'Unknown' | 'Friendly' | 'Unfriendly';
    topics?: string[];
    key_points?: string[];
    action_items?: string[];
    follow_ups?: string[];
    custom_analysis_data?: Record<string, unknown>;
  };
}

interface CallHistoryProps {
  calls: Call[];
}

export function CallHistory({ calls: initialCalls }: CallHistoryProps) {
  const { userProfile } = useAuth();
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [allCalls, setAllCalls] = useState<Call[]>(initialCalls);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchCalls = async () => {
      if (!userProfile?.organization_id_main) return;

      try {
        const { data, error } = await getSupabase()
          .from('call_logs')
          .select('*')
          .eq('organization_id', userProfile.organization_id_main)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setAllCalls(data.map(call => ({
          call_id: call.id,
          call_type: call.type || 'web_call',
          agent_id: call.agent_id,
          call_status: call.status || 'ended',
          start_timestamp: new Date(call.created_at).getTime(),
          end_timestamp: call.ended_at ? new Date(call.ended_at).getTime() : undefined,
          duration: call.duration,
          client_name: call.lead_name || 'Unknown Lead',
          client_phone: call.client_phone || '',
          client_email: call.client_email || '',
          recording_url: call.recording_url,
          transcript: call.transcript,
          summary: call.summary,
          sentiment: call.sentiment,
          metadata: call.metadata,
          call_analysis: {
            call_summary: call.analysis?.summary,
            user_sentiment: call.analysis?.user_sentiment || 'Unknown',
            agent_sentiment: call.analysis?.agent_sentiment || 'Unknown',
            topics: call.analysis?.topics || [],
            key_points: call.analysis?.key_points || [],
            action_items: call.analysis?.action_items || [],
            follow_ups: call.analysis?.follow_ups || [],
            custom_analysis_data: call.analysis?.custom_data
          }
        })));
        setTotalRecords(data.length);
      } catch (error) {
        console.error('Error fetching calls:', error);
        toast.error('Failed to fetch call history');
        setAllCalls([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [userProfile?.organization_id_main]);

  function formatDuration(startTime: number, endTime?: number): string {
    if (!endTime) return '--:--';
    const durationSeconds = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(durationSeconds / 60);
    const remainingSeconds = durationSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const totalPages = Math.ceil(totalRecords / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="rounded-lg animate-in">
      <div className="rounded-lg pb-12">
        <div className="space-y-6">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-4">
                <LoadingSpinner size="sm" />
              </div>
            ) : allCalls.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-4">
                <Phone className="h-16 w-16 text-[hsl(var(--muted-foreground))] opacity-50" />
                <p className="text-sm text-[hsl(var(--muted-foreground))]">No call history found.</p>
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-[hsl(var(--border))]">
                  <thead>
                    <tr className="bg-[hsl(var(--muted))]/50 backdrop-blur-sm">
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                        Sentiment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[hsl(var(--border))]">
                    {allCalls.map((call) => (
                      <tr
                        key={call.call_id}
                        onClick={() => setSelectedCall(call)}
                        className="hover:bg-[hsl(var(--accent)/.05)] cursor-pointer transition-all duration-200"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--foreground))]">
                          {new Date(call.start_timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--muted-foreground))]">
                          {call.client_name}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[hsl(var(--muted-foreground))]">
                          {formatDuration(call.start_timestamp, call.end_timestamp)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            call.call_status === 'ended'
                              ? 'bg-[hsl(var(--success-muted))] text-[hsl(var(--success))]'
                              : call.call_status === 'error'
                              ? 'bg-[hsl(var(--error-muted))] text-[hsl(var(--error))]'
                              : 'bg-[hsl(var(--warning-muted))] text-[hsl(var(--warning))]'
                          }`}>
                            {call.call_status}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            call.call_analysis?.user_sentiment === 'Positive'
                              ? 'bg-[hsl(var(--success-muted))] text-[hsl(var(--success))]'
                              : call.call_analysis?.user_sentiment === 'Negative'
                              ? 'bg-[hsl(var(--error-muted))] text-[hsl(var(--error))]'
                              : 'bg-[hsl(var(--warning-muted))] text-[hsl(var(--warning))]'
                          }`}>
                            {call.call_analysis?.user_sentiment || 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalRecords={totalRecords}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div> 
      {/* Sliding Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 glass-morphism transform transition-transform duration-300 ease-in-out ${
          selectedCall ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
      >
        {selectedCall && (
          <div className="h-full flex flex-col">
            <div className="px-4 py-6 bg-[hsl(var(--muted))]/50 backdrop-blur-sm border-b border-[hsl(var(--border))]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold gradient-text">Call Details</h3>
                <button
                  onClick={() => setSelectedCall(null)}
                  className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors p-2 rounded-full hover:bg-[hsl(var(--accent))]/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-6">
                {/* Call Info */}
                <div className="rounded-lg p-4 transition-all duration-200">
                  <h4 className="text-sm font-semibold gradient-text mb-3">Basic Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-[hsl(var(--foreground))]">
                      <Clock className="h-4 w-4 mr-2 text-[hsl(var(--primary))]" />
                      {new Date(selectedCall.start_timestamp).toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-[hsl(var(--foreground))]">
                      <User className="h-4 w-4 mr-2 text-[hsl(var(--primary))]" />
                      {selectedCall.client_name}
                    </div>
                    <div className="flex items-center text-sm text-[hsl(var(--foreground))]">
                      <Phone className="h-4 w-4 mr-2 text-[hsl(var(--primary))]" />
                      Duration: {formatDuration(selectedCall.start_timestamp, selectedCall.end_timestamp)}
                    </div>
                  </div>
                </div>

                {/* Call Analysis */}
                {selectedCall.call_analysis && (
                  <div className="rounded-lg p-4 transition-all duration-200">
                    <h4 className="text-sm font-semibold gradient-text mb-3 flex items-center">
                      <BarChart2 className="h-4 w-4 mr-2 text-[hsl(var(--primary))]" />
                      Call Analysis
                    </h4>
                    <div className="space-y-4">
                      {selectedCall.call_analysis.call_summary && (
                        <div>
                          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Summary</p>
                          <p className="text-sm text-[hsl(var(--foreground))]">
                            {selectedCall.call_analysis.call_summary}
                          </p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">User Sentiment</p>
                          <div className="flex items-center">
                            <Heart className={`h-4 w-4 mr-1 ${
                              selectedCall.call_analysis.user_sentiment === 'Positive'
                                ? 'text-[hsl(var(--success))]'
                                : selectedCall.call_analysis.user_sentiment === 'Negative'
                                ? 'text-[hsl(var(--error))]'
                                : 'text-[hsl(var(--warning))]'
                            }`} />
                            <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                              {selectedCall.call_analysis.user_sentiment}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">Agent Sentiment</p>
                          <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                            {selectedCall.call_analysis.agent_sentiment}
                          </p>
                        </div>
                      </div>
                      {selectedCall.call_analysis.topics && selectedCall.call_analysis.topics.length > 0 && (
                        <div>
                          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">Topics Discussed</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedCall.call_analysis.topics.map((topic, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs font-medium rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recording */}
                {selectedCall.recording_url && (
                  <div className="rounded-lg p-4 transition-all duration-200">
                    <h4 className="text-sm font-semibold gradient-text mb-3 flex items-center">
                      <PlayCircle className="h-4 w-4 mr-2 text-[hsl(var(--primary))]" />
                      Recording
                    </h4>
                    <audio controls className="w-full">
                      <source src={selectedCall.recording_url} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                {/* Transcript */}
                {selectedCall.transcript && (
                  <div className="rounded-lg p-4 transition-all duration-200">
                    <h4 className="text-sm font-semibold gradient-text mb-3 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-[hsl(var(--primary))]" />
                      Transcript
                    </h4>
                    <div className="text-sm text-[hsl(var(--foreground))] whitespace-pre-wrap">
                      {selectedCall.transcript}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}