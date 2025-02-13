import { Checkbox } from "../../ui/checkbox";
import {
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"; // Fixed casing
import { ArrowUp, ArrowDown } from "lucide-react";
import type { Lead } from "../../../lib/supabase/types";
import { FIELD_MAPPINGS } from "./constants";
import { SortState } from "./types";

interface TableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  sortState: SortState;
  onSort: (column: keyof Lead) => void;
  hasLeads: boolean;
}

export function LeadTableHeader({
  onSelectAll,
  allSelected,
  sortState,
  onSort,
  hasLeads,
}: TableHeaderProps) {
  return (
    <TableHeader className="bg-[hsl(var(--background))]/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-lg">
      <TableRow className="hover:bg-[hsl(var(--accent))]/5 transition-colors duration-200">
        <TableHead className="w-[50px] rounded-tl-lg">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onSelectAll}
            disabled={!hasLeads}
            className="shadow-sm hover:shadow-md transition-all duration-200"
          />
        </TableHead>
        {Object.entries(FIELD_MAPPINGS).map(([key, label], index) => (
          <TableHead
            key={key}
            className={`cursor-pointer select-none hover:bg-[hsl(var(--accent))]/10 transition-colors duration-200 ${
              index === Object.entries(FIELD_MAPPINGS).length - 1 ? 'rounded-tr-lg' : ''
            }`}
            onClick={() => onSort(key as keyof Lead)}
          >
            <div className="flex items-center space-x-2 px-4 py-3 font-medium text-[hsl(var(--foreground))]">
              <span className="font-plus-jakarta">{label}</span>
              {sortState.column === key && (
                <span className="ml-1 text-[hsl(var(--primary))]">
                  {sortState.direction === "asc" ? (
                    <ArrowUp className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                  ) : (
                    <ArrowDown className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
                  )}
                </span>
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
