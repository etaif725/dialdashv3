/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupabaseClient } from '@supabase/supabase-js'
import { getSupabase } from '../supabase/client'
import type { Database } from '../../types/database.types'

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
type CallLog = Tables<'call_logs'>

export class CallLogService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = getSupabase()
  }

  async createCallLog(leadId: string, vapiResponse: any): Promise<{ data: CallLog | null; error: any }> {
    const { data, error } = await this.supabase
      .from('call_logs')
      .insert([{
        lead_id: leadId,
        vapi_call_id: vapiResponse.id,
        initial_response: vapiResponse,
        initiated_at: vapiResponse.createdAt
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating call log:', error)
    }

    return { data, error }
  }

  async updateWithReport(vapiCallId: string, report: any): Promise<{ data: CallLog | null; error: any }> {
    const { data, error } = await this.supabase
      .from('call_logs')
      .update({
        ended_at: report.message.endedAt,
        ended_reason: report.message.endedReason,
        recording_url: report.message.artifact?.recordingUrl,
        stereo_recording_url: report.message.artifact?.stereoRecordingUrl,
        duration_seconds: report.message.durationSeconds,
        cost: report.message.cost,
        report
      })
      .eq('vapi_call_id', vapiCallId)
      .select()
      .single()

    if (error) {
      console.error('Error updating call log with report:', error)
    }

    return { data, error }
  }

  async getCallsForLead(leadId: string): Promise<{ data: CallLog[] | null; error: any }> {
    const { data, error } = await this.supabase
      .from('call_logs')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching calls for lead:', error)
    }

    return { data, error }
  }

  async getActiveCall(leadId: string): Promise<{ data: CallLog | null; error: any }> {
    const { data, error } = await this.supabase
      .from('call_logs')
      .select('*')
      .eq('lead_id', leadId)
      .is('ended_at', null)
      .single()

    if (error && error.code !== 'PGRST116') { // Ignore "no rows returned" error
      console.error('Error fetching active call:', error)
    }

    return { data, error }
  }
}

// Export a singleton instance with the default client for client-side use
export const callLogService = new CallLogService()
