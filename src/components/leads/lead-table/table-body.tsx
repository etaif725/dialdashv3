import { Checkbox } from "../../ui/checkbox";
import {
  TableBody,
  TableCell,
  TableRow,
} from "../../ui/table";
import type { Lead } from "../../../lib/supabase/types";
import { FIELD_MAPPINGS } from "./constants";
import { CellRenderer } from "./cell-renderer";
import { EditingCell } from "./types";

interface TableBodyProps {
  leads: Lead[];
  selectedLeads: string[];
  editingCell: EditingCell | null;
  onToggleLead: (id: string) => void;
  onEdit: (id: string, field: keyof Lead, value: string) => void;
  onStartEdit: (id: string | null, field: keyof Lead | null) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    field: keyof Lead,
    value: string
  ) => void;
  setEditingCell: (editingCell: EditingCell | null) => void;
}

export function LeadTableBody({
  leads,
  selectedLeads,
  editingCell,
  onToggleLead,
  onEdit,
  onStartEdit,
  onKeyDown,
  setEditingCell,
}: TableBodyProps) {
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    field: keyof Lead,
    value: string
  ) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onStartEdit(null, null);
      return;
    }

    // Let the parent component handle all other key navigation
    onKeyDown(e, id, field, value);
  };

  if (leads.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell 
            colSpan={Object.keys(FIELD_MAPPINGS).length + 1} 
            className="h-24 text-center rounded-lg bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] font-medium"
          >
            No leads available. Add a new lead or import from CSV.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {leads.map((lead) => (
        <TableRow 
          key={lead.id}
          className="hover:bg-[hsl(var(--accent))/5 transition-colors duration-200"
        >
          <TableCell className="rounded-l-lg">
            <Checkbox
              checked={selectedLeads.includes(lead.id)}
              onCheckedChange={() => onToggleLead(lead.id)}
              className="shadow-sm hover:shadow-md transition-all duration-200"
            />
          </TableCell>
          {Object.keys(FIELD_MAPPINGS).map((field, index) => (
            <TableCell
              key={field}
              className={`p-0 ${index === Object.keys(FIELD_MAPPINGS).length - 1 ? 'rounded-r-lg' : ''}`}
            >
              <div className="px-4 py-2 min-h-[2.5rem] flex items-center">
                <CellRenderer
                  key={field}
                  lead={lead}
                  field={field as keyof Lead}
                  editingCell={editingCell}
                  onEdit={onEdit}
                  onStartEdit={onStartEdit}
                  onKeyDown={(e) => handleKeyDown(e, lead.id, field as keyof Lead, String(lead[field as keyof Lead] ?? ''))}
                  setEditingCell={setEditingCell}
                />
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
