"use client";

import React, { useEffect, useState } from 'react';
import { Phone, Mail, FileText, Upload, Download, Plus, Edit2, Trash2, Search, Filter, PhoneCall, Users, UserPlus, ListFilter, Target, Award, XCircle, Brain, RefreshCw, Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getSupabase } from '@/lib/supabase/client';
import { ClientLeadTable } from '@/components/leads/client-lead-table';
import { Lead } from '@/lib/supabase/types';
import { usePageTitle } from '@/hooks/usePageTitle';
import { toast } from '@/hooks/use-toast';

const pipelineStatuses = [
  { name: 'All Leads', value: 'all', icon: Users },
  { name: 'Open', value: 'open', icon: Target },
  { name: 'Won', value: 'won', icon: Award },
  { name: 'Lost', value: 'lost', icon: XCircle },
];

export function Leads() {
  usePageTitle('Leads');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pipelineFilter, setPipelineFilter] = useState('all');

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      setLoading(true);
      const { data, error } = await getSupabase()
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading leads",
          description: error.message
        });
        throw error;
      }
      
      setLeads(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load leads';
      setError(errorMessage);
      toast({
        variant: "destructive", 
        title: "Error",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center p-4 glass-effect">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-[hsl(var(--muted-foreground))] mt-1">
            Manage your leads and opportunities
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in">
        <Card className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] font-outfit">
                  Total Leads
                </p>
                <p className="text-2xl font-bold text-[hsl(var(--foreground))] font-plus-jakarta">
                  {leads.length}
                </p>
              </div>
              <div 
                className="rounded-full p-2.5"
                style={{
                  backgroundColor: `hsl(var(--purple)/0.1)`,
                  color: `hsl(var(--purple))`
                }}
              >
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[hsl(var(--secondary))] rounded-lg p-2">
              <span className="text-sm font-semibold font-plus-jakarta text-[hsl(var(--success))]">
                +124
              </span>
              <span className="text-sm text-[hsl(var(--muted-foreground))] font-outfit">
                this month
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] font-outfit">
                  Pipeline Status
                </p>
                <p className="text-2xl font-bold text-[hsl(var(--foreground))] font-plus-jakarta">
                  68%
                </p>
              </div>
              <div 
                className="rounded-full p-2.5"
                style={{
                  backgroundColor: `hsl(var(--orange)/0.1)`,
                  color: `hsl(var(--orange))`
                }}
              >
                <Target className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[hsl(var(--secondary))] rounded-lg p-2">
              <span className="text-sm font-semibold font-plus-jakarta text-[hsl(var(--info-foreground))]">
                Open: 425 | Won: 283
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] font-outfit">
                  AI-Processed
                </p>
                <p className="text-2xl font-bold text-[hsl(var(--foreground))] font-plus-jakarta">
                  78%
                </p>
              </div>
              <div 
                className="rounded-full p-2.5"
                style={{
                  backgroundColor: `hsl(var(--cyan)/0.1)`,
                  color: `hsl(var(--cyan))`
                }}
              >
                <Brain className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[hsl(var(--secondary))] rounded-lg p-2">
              <span className="text-sm font-semibold font-plus-jakarta text-[hsl(var(--purple))]">
                2,220 leads enriched
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] font-outfit">
                  Last Sync
                </p>
                <p className="text-2xl font-bold text-[hsl(var(--foreground))] font-plus-jakarta">
                  2m ago
                </p>
              </div>
              <div 
                className="rounded-full p-2.5"
                style={{
                  backgroundColor: `hsl(var(--success)/0.1)`,
                  color: `hsl(var(--success))`
                }}
              >
                <RefreshCw className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[hsl(var(--secondary))] rounded-lg p-2">
              <span className="text-sm font-semibold font-plus-jakarta text-[hsl(var(--cyan))]">
                All systems synced
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Pipeline Status Tabs 
      <nav className="glass-effect p-4">
        <div>
          <h2 className="text-lg font-bold">Pipeline Status</h2>
        </div>
        <div className="flex space-x-2 mt-4 overflow-x-auto">
          {pipelineStatuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setPipelineFilter(status.value)}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full
                transition-all duration-300 hover-lift
                ${pipelineFilter === status.value
                  ? 'button-primary'
                  : 'button-secondary'
                }
              `}
            >
              <status.icon className="h-4 w-4" />
              {status.name}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </nav>*/}

      <Card className="border-none">
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-t-[hsl(var(--primary))] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <XCircle className="w-12 h-12 text-[hsl(var(--destructive))] mb-4" />
                <p className="text-[hsl(var(--destructive))] font-medium">{error}</p>
                <button
                  onClick={loadLeads}
                  className="mt-4 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <ClientLeadTable initialLeads={leads} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}