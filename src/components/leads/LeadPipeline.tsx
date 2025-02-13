"use client";

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

interface Lead {
  id: string;
  name: string;
  company: string;
  value: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
}

const pipelineStages = [
  { 
    id: 'new', 
    title: 'New Leads', 
    color: 'bg-[hsl(var(--info)/.15)] border-[hsl(var(--info)/.2)]' 
  },
  { 
    id: 'contacted', 
    title: 'Contacted', 
    color: 'bg-[hsl(var(--warning)/.15)] border-[hsl(var(--warning)/.2)]'
  },
  { 
    id: 'qualified', 
    title: 'Qualified', 
    color: 'bg-[hsl(var(--success)/.15)] border-[hsl(var(--success)/.2)]'
  },
  { 
    id: 'lost', 
    title: 'Lost', 
    color: 'bg-[hsl(var(--destructive)/.15)] border-[hsl(var(--destructive)/.2)]'
  },
];

export function LeadPipeline() {
  const [leads, setLeads] = React.useState<Lead[]>([
    {
      id: '1',
      name: 'John Doe',
      company: 'Tech Corp',
      value: 5000,
      status: 'New',
    },
    // Add more sample leads
  ]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedLeads = Array.from(leads);
    const lead = updatedLeads.find((l) => l.id === draggableId);
    if (!lead) return;

    lead.status = destination.droppableId as Lead['status'];

    setLeads(updatedLeads);
  };

  const getLeadsByStatus = (status: Lead['status']) => {
    return leads.filter((lead) => lead.status === status);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {pipelineStages.map((stage) => (
          <div key={stage.id} className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold font-plus-jakarta text-[hsl(var(--foreground))]">
                {stage.title}
              </h3>
              <Badge className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]">
                {getLeadsByStatus(stage.id as Lead['status']).length}
              </Badge>
            </div>
            <Droppable droppableId={stage.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 rounded-lg p-4 border ${stage.color} min-h-[500px] transition-all duration-300`}
                >
                  {getLeadsByStatus(stage.id as Lead['status']).map(
                    (lead, index) => (
                      <Draggable
                        key={lead.id}
                        draggableId={lead.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-3 p-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <h4 className="font-medium font-plus-jakarta text-[hsl(var(--foreground))]">
                              {lead.name}
                            </h4>
                            <p className="text-sm text-[hsl(var(--muted-foreground))] font-outfit">
                              {lead.company}
                            </p>
                            <div className="mt-2 text-sm font-medium text-[hsl(var(--primary))]">
                              ${lead.value.toLocaleString()}
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}