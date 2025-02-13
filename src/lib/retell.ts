import { getSupabase } from './supabase/client';
import { storeAnalyticsData } from './analytics';
import { z } from 'zod';
import Retell from 'retell-sdk';
import { voices } from './voices';

// Voice Profile Schema
const VoiceProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  voice: z.string(),
  speaking_rate: z.number().min(0.5).max(2.0),
  speaking_pitch: z.number().min(-20).max(20),
  voice_stability: z.number().min(0).max(100),
  voice_similarity: z.number().min(0).max(100),
  pause_duration: z.number().min(0),
  retell_config: z.record(z.unknown()).default({}),
  created_at: z.string().default(() => new Date().toISOString()),
  updated_at: z.string().default(() => new Date().toISOString())
});

export type VoiceProfile = z.infer<typeof VoiceProfileSchema>;

// Schemas based on Retell API V2 response formats
const RetellCallSchema = z.object({
  call_type: z.enum(['web_call', 'phone_call']),
  call_id: z.string(),
  agent_id: z.string(),
  call_status: z.enum(['registered', 'ongoing', 'ended', 'error']),
  metadata: z.record(z.unknown()).optional(),
  retell_llm_dynamic_variables: z.record(z.string()).optional(),
  opt_out_sensitive_data_storage: z.boolean().optional(),
  start_timestamp: z.number(),
  end_timestamp: z.number().optional(),
  transcript: z.string().optional(),
  transcript_object: z.array(z.object({
    role: z.enum(['agent', 'user']),
    content: z.string(),
    words: z.array(z.object({
      word: z.string(),
      start: z.number(),
      end: z.number()
    }))
  })).optional(),
  transcript_with_tool_calls: z.array(z.object({
    role: z.enum(['agent', 'user', 'tool_call_invocation', 'tool_call_result']),
    content: z.string().optional(),
    words: z.array(z.object({
      word: z.string(),
      start: z.number(),
      end: z.number()
    })).optional()
  })).optional(),
  recording_url: z.string().optional(),
  public_log_url: z.string().optional(),
  e2e_latency: z.object({
    p50: z.number(),
    p90: z.number(),
    p95: z.number(),
    p99: z.number(),
    max: z.number(),
    min: z.number(),
    num: z.number()
  }).optional(),
  llm_latency: z.object({
    p50: z.number(),
    p90: z.number(),
    p95: z.number(),
    p99: z.number(),
    max: z.number(),
    min: z.number(),
    num: z.number()
  }).optional(),
  llm_websocket_network_rtt_latency: z.object({
    p50: z.number(),
    p90: z.number(),
    p95: z.number(),
    p99: z.number(),
    max: z.number(),
    min: z.number(),
    num: z.number()
  }).optional(),
  disconnection_reason: z.enum([
    'user_hangup',
    'agent_hangup', 
    'call_transfer',
    'inactivity',
    'machine_detected',
    'concurrency_limit_reached',
    'dial_busy',
    'dial_failed',
    'dial_no_answer',
    'error_llm_websocket_open',
    'error_llm_websocket_lost_connection',
    'error_llm_websocket_runtime',
    'error_llm_websocket_corrupt_payload',
    'error_frontend_corrupted_payload',
    'error_twilio',
    'voicemail_reached',
    'max_duration_reached',
    'error'
  ]).optional(),
  call_analysis: z.object({
    call_summary: z.string().optional(),
    user_sentiment: z.enum(['Positive', 'Neutral', 'Negative', 'Unknown']).optional(),
    agent_sentiment: z.enum(['Friendly', 'Neutral', 'Unfriendly', 'Unknown']).optional(),
    agent_task_completion_rating: z.enum(['Complete', 'Partial', 'Incomplete']).optional(),
    agent_task_completion_rating_reason: z.string().optional(),
    call_completion_rating: z.enum(['Complete', 'Partial', 'Incomplete']).optional(),
    call_completion_rating_reason: z.string().optional(),
    custom_analysis_data: z.record(z.unknown()).optional()
  }).optional()
});

const RetellAgentSchema = z.object({
  agent_id: z.string(),
  agent_name: z.string().optional(),
  voice_id: z.string(),
  voice_profile_id: z.string().optional(),
  voice_model: z.enum(['eleven_turbo_v2', 'eleven_turbo_v2_5', 'eleven_multilingual_v2']).optional(),
  fallback_voice_ids: z.array(z.string()).optional(),
  voice_temperature: z.number().optional(),
  voice_speed: z.number().optional(),
  volume: z.number().optional(),
  responsiveness: z.number().optional(),
  interruption_sensitivity: z.number().optional(),
  enable_backchannel: z.boolean().optional(),
  backchannel_frequency: z.number().optional(),
  backchannel_words: z.array(z.string()).optional(),
  reminder_trigger_ms: z.number().optional(),
  reminder_max_count: z.number().optional(),
  ambient_sound: z.enum(['coffee-shop', 'convention-hall', 'summer-outdoor', 'mountain-outdoor', 'static-noise', 'call-center']).nullable().optional(),
  ambient_sound_volume: z.number().optional(),
  language: z.string().optional(),
  webhook_url: z.string().optional(),
  boosted_keywords: z.array(z.string()).optional(),
  opt_out_sensitive_data_storage: z.boolean().optional(),
  pronunciation_dictionary: z.array(z.object({
    word: z.string(),
    alphabet: z.string(),
    pronunciation: z.string()
  })).optional(),
  end_call_after_silence_ms: z.number().optional(),
  max_call_duration_ms: z.number().optional(),
  post_call_analysis_data: z.array(z.object({
    description: z.string(),
    examples: z.array(z.string())
  })).optional(),
  created_at: z.string().default(() => new Date().toISOString()),
  updated_at: z.string().default(() => new Date().toISOString())
});

export type RetellCall = z.infer<typeof RetellCallSchema>;
export type RetellAgent = z.infer<typeof RetellAgentSchema>;

let retellClient: Retell | null = null;

export async function getRetellClient() {
  const { data: { session } } = await getSupabase().auth.getSession();
  if (!session) throw new Error('No authenticated session');

  const apiKey = import.meta.env.VITE_RETELL_API_KEY;
  if (!apiKey) {
    throw new Error('Retell API key not found in environment variables');
  }
  return new Retell({
    apiKey: apiKey.trim()
  });
}

export async function listAgents(): Promise<RetellAgent[]> {
  const client = await getRetellClient();
  const response = await client.agent.list();
  return z.array(RetellAgentSchema).parse(response);
}

export async function createAgent(agentConfig: Partial<RetellAgent>): Promise<RetellAgent> {
  const client = await getRetellClient();
  
  // Get voice profile details
  const { data: profile } = await getSupabase()
    .from('voice_profiles')
    .select('*')
    .eq('id', agentConfig.voice_profile_id)
    .single();

  if (!profile) {
    throw new Error('Invalid voice profile ID');
  }

  // Add custom voice ID prefix for Retell API
  const configWithCustomVoice = {
    ...agentConfig,
    voice_id: `custom_${profile.voice}`,
    voice_temperature: profile.voice_stability / 100,
    voice_speed: profile.speaking_rate,
    volume: 1.0,
    responsiveness: 0.5,
    interruption_sensitivity: 0.5,
    enable_backchannel: true,
    ...profile.retell_config
  };

  const response = await client.agent.create(configWithCustomVoice as any);
  const agent = RetellAgentSchema.parse(response);
  
  try {
    // Store the agent ID and create voice agent record
    const userId = (await getSupabase().auth.getUser()).data.user?.id;
    
    await Promise.all([
      // Update user settings
      getSupabase()
        .from('user_settings')
        .upsert({
          user_id: userId,
          retell_agent_id: agent.agent_id
        }),
      // Create voice agent record
      getSupabase()
        .from('voice_agents')
        .insert({
          id: agent.agent_id,
          user_id: userId,
          agent_name: agent.agent_name,
          voice_id: profile.voice,
          voice_profile_id: profile.id,
          voice_model: agent.voice_model,
          voice_temperature: profile.voice_stability / 100,
          voice_speed: profile.speaking_rate,
          volume: 1.0,
          responsiveness: 0.5,
          interruption_sensitivity: 0.5,
          enable_backchannel: true,
          language: agent.language || 'en',
          webhook_url: agent.webhook_url,
          opt_out_sensitive_data_storage: agent.opt_out_sensitive_data_storage,
          end_call_after_silence_ms: agent.end_call_after_silence_ms,
          max_call_duration_ms: agent.max_call_duration_ms
        })
    ]);

    return agent;
  } catch (err) {
    // Cleanup on error
    await client.agent.delete(agent.agent_id);
    throw err;
  }
}

export async function updateAgent(id: string, agentConfig: Partial<RetellAgent>): Promise<RetellAgent> {
  const client = await getRetellClient();

  // Get voice profile details if profile ID is provided
  let profile = null;
  if (agentConfig.voice_profile_id) {
    const { data } = await getSupabase()
      .from('voice_profiles')
      .select('*')
      .eq('id', agentConfig.voice_profile_id)
      .single();
    profile = data;

    if (!profile) {
      throw new Error('Invalid voice profile ID');
    }
  }

  // Update config with voice profile settings
  const configWithVoice = profile ? {
    ...agentConfig,
    voice_id: `custom_${profile.voice}`,
    voice_temperature: profile.voice_stability / 100,
    voice_speed: profile.speaking_rate,
    volume: 1.0,
    responsiveness: 0.5,
    interruption_sensitivity: 0.5,
    enable_backchannel: true,
    ...profile.retell_config
  } : agentConfig;

  const response = await client.agent.update(id, configWithVoice as any);
  const agent = RetellAgentSchema.parse(response);

  // Update voice agent record
  const updateData = profile ? {
    agent_name: agent.agent_name,
    voice_id: profile.voice,
    voice_profile_id: profile.id,
    voice_model: agent.voice_model,
    voice_temperature: profile.voice_stability / 100,
    voice_speed: profile.speaking_rate,
    volume: 1.0,
    responsiveness: 0.5,
    interruption_sensitivity: 0.5,
    enable_backchannel: true,
    language: agent.language,
    webhook_url: agent.webhook_url,
    opt_out_sensitive_data_storage: agent.opt_out_sensitive_data_storage,
    end_call_after_silence_ms: agent.end_call_after_silence_ms,
    max_call_duration_ms: agent.max_call_duration_ms
  } : {
    agent_name: agent.agent_name,
    voice_model: agent.voice_model,
    language: agent.language,
    webhook_url: agent.webhook_url,
    opt_out_sensitive_data_storage: agent.opt_out_sensitive_data_storage,
    end_call_after_silence_ms: agent.end_call_after_silence_ms,
    max_call_duration_ms: agent.max_call_duration_ms
  };

  await getSupabase()
    .from('voice_agents')
    .update(updateData)
    .eq('id', id);

  return agent;
}

export async function deleteAgent(agentId: string): Promise<void> {
  const client = await getRetellClient();
  await client.agent.delete(agentId);
  
  try {
    // Remove agent ID from user settings if it matches
    const { data } = await getSupabase()
      .from('user_settings')
      .select('retell_agent_id')
      .single();
      
    if (data?.retell_agent_id === agentId) {
      await getSupabase()
        .from('user_settings')
        .update({ retell_agent_id: null })
        .eq('user_id', (await getSupabase().auth.getUser()).data.user?.id);
    }
  } catch (error) {
    console.error('Failed to update user settings:', error);
  }
}

export async function getAgentDetails(agentId?: string): Promise<RetellAgent> {
  const client = await getRetellClient();
  
  if (!agentId) {
    const { data: settings } = await getSupabase()
      .from('user_settings')
      .select('retell_agent_id')
      .single();

    if (!settings?.retell_agent_id) {
      throw new Error('Please configure your Retell Agent ID in Settings > Credentials & API Keys');
    }
    
    agentId = settings.retell_agent_id;
  }

  // Ensure agentId is defined before passing to API
  if (!agentId) {
    throw new Error('Agent ID is required');
  }

  const response = await client.agent.retrieve(agentId);
  return RetellAgentSchema.parse(response);
}

export async function fetchRecentCalls(limit: number = 50): Promise<RetellCall[]> {
  const client = await getRetellClient();
  const response = await client.call.list({ limit });
  const validatedCalls = z.array(RetellCallSchema).parse(response);

  // Store analytics data if response exists
  validatedCalls.forEach(call => {
    try {
      storeAnalyticsData('call', {
        call_id: call.call_id,
        agent_id: call.agent_id,
        start_time: call.start_timestamp,
        end_time: call.end_timestamp,
        status: call.call_status,
        transcript: call.transcript,
        sentiment: call.call_analysis?.user_sentiment,
        metrics: {
          e2e_latency: call.e2e_latency,
          llm_latency: call.llm_latency,
          llm_websocket_network_rtt_latency: call.llm_websocket_network_rtt_latency
        }
      });
    } catch (error) {
      console.error('Failed to store analytics data:', error);
    }
  });

  return validatedCalls;
}

export async function getCallDetails(callId: string): Promise<RetellCall> {
  const client = await getRetellClient();
  const response = await client.call.retrieve(callId);
  return RetellCallSchema.parse(response);
}

export async function testVoiceProfile(profileId: string): Promise<{ url: string }> {
  const client = await getRetellClient();
  
  // Get voice profile details
  const { data: profile } = await getSupabase()
    .from('voice_profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  if (!profile) {
    throw new Error('Voice profile not found');
  }

  // Create a temporary agent with the voice profile settings
  const tempAgent = await client.agent.create({
    agent_name: `test_${profile.name}`,
    voice_id: `custom_${profile.voice}`,
    voice_temperature: profile.voice_stability / 100,
    voice_speed: profile.speaking_rate,
    volume: 1.0,
    responsiveness: 0.5,
    interruption_sensitivity: 0.5,
    enable_backchannel: true,
    language: 'en-US',
    response_engine: {
      type: 'retell-llm',
      llm: {
        type: 'openai',
        prompt: 'You are a helpful AI assistant.'
      }
    }
  });

  try {
    // Make a test call to generate audio
    const response = await fetch(`https://api.retellai.com/v2/agents/${tempAgent.agent_id}/audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await getRetellClient()).apiKey}`
      },
      body: JSON.stringify({
        text: "Hello! This is a test of my voice profile. How do I sound?",
        voice_id: `custom_${profile.voice}`,
        voice_temperature: profile.voice_stability / 100,
        voice_speed: profile.speaking_rate
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate test audio');
    }

    const data = await response.json();
    return { url: data.audio_url };
  } finally {
    // Clean up the temporary agent
    await client.agent.delete(tempAgent.agent_id);
  }
}

export async function getRetellAgentId(): Promise<string | null> {
  const agentId = import.meta.env.VITE_RETELL_AGENT_ID;
  if (!agentId) {
    console.warn('Retell Agent ID not found in environment variables');
    return null;
  }
  return agentId;
}

export async function listRetellLLMs() {
  const client = await getRetellClient();
  const response = await client.listLLMs();
  return response;
}

export async function getRetellLLM(llmId: string) {
  const client = await getRetellClient();
  const response = await client.getLLM(llmId);
  return response;
}

export async function listCalls(filterCriteria: {
  agent_id?: string[];
  before_start_timestamp?: number;
  after_start_timestamp?: number;
  before_end_timestamp?: number;
  after_end_timestamp?: number;
  sort_order?: 'asc' | 'desc';
  limit?: number;
  pagination_key?: string;
}) {
  const client = await getRetellClient();
  try {
    const callResponses = await client.call.list({
      ...filterCriteria,
      sort_order: filterCriteria.sort_order === 'asc' ? 'ascending' : 
                  filterCriteria.sort_order === 'desc' ? 'descending' : 
                  undefined
    });
    return callResponses;
  } catch (error) {
    console.error('Failed to list calls:', error);
    throw new Error('Failed to retrieve call list');
  }
}

// Voice Profile Functions
export async function createVoiceProfile(profile: Omit<VoiceProfile, 'id' | 'created_at' | 'updated_at'>): Promise<VoiceProfile> {
  const { data, error } = await getSupabase()
    .from('voice_profiles')
    .insert([{
      ...profile,
      user_id: (await getSupabase().auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateVoiceProfile(id: string, profile: Partial<Omit<VoiceProfile, 'id' | 'created_at' | 'updated_at'>>): Promise<VoiceProfile> {
  const { data, error } = await getSupabase()
    .from('voice_profiles')
    .update(profile)
    .eq('id', id)
    .eq('user_id', (await getSupabase().auth.getUser()).data.user?.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteVoiceProfile(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from('voice_profiles')
    .delete()
    .eq('id', id)
    .eq('user_id', (await getSupabase().auth.getUser()).data.user?.id);

  if (error) throw error;
}

export async function listVoiceProfiles(): Promise<VoiceProfile[]> {
  const { data, error } = await getSupabase()
    .from('voice_profiles')
    .select('*')
    .eq('user_id', (await getSupabase().auth.getUser()).data.user?.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getVoiceProfile(id: string): Promise<VoiceProfile> {
  const { data, error } = await getSupabase()
    .from('voice_profiles')
    .select('*')
    .eq('id', id)
    .eq('user_id', (await getSupabase().auth.getUser()).data.user?.id)
    .single();

  if (error) throw error;
  return data;
}

// New function to sync agent data with database
export async function syncAgentWithDatabase(agent: RetellAgent) {
  try {
    const { error } = await getSupabase()
      .from('retell_agents')
      .upsert({
        id: agent.agent_id,
        name: agent.agent_name || 'Default Agent',
        description: agent.agent_name || 'Default Agent',
        voice_id: agent.voice_id,
        llm_id: agent.voice_model,
        created_at: agent.created_at,
        updated_at: agent.updated_at
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error syncing agent with database:', error);
    throw error;
  }
}
