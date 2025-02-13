"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { DEFAULTS } from "./constants";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;
    
    const pageNum = parseInt(value);
    if (pageNum > 0 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Only allow numeric keys, backspace, delete, and arrow keys
    if (
      !/^\d$/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col items-center justify-between px-4 py-2 space-y-2 md:flex-row md:space-y-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg transition-all duration-200">
      <div className="flex items-center space-x-3">
        <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
          Rows per page
        </p>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(parseInt(value))}
        >
          <SelectTrigger className="h-9 w-[70px] rounded-full shadow-sm hover:shadow-md transition-all duration-200">
            <SelectValue placeholder={pageSize.toString()} />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg shadow-lg border border-border">
            {DEFAULTS.PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
          {`${((currentPage - 1) * pageSize) + 1}-${Math.min(currentPage * pageSize, totalRecords)} of ${totalRecords}`}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="rounded-full shadow-sm hover:shadow-md transition-all duration-200"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-full shadow-sm hover:shadow-md transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-2">
          <Input
            className="h-9 w-[60px] text-center text-[hsl(var(--background))] bg-[hsl(var(--background))] rounded-full shadow-sm hover:shadow-md transition-all duration-200 font-medium"
            value={currentPage}
            onChange={handlePageInput}
            onKeyDown={handleKeyDown}
          />
          <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">of {totalPages}</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-full shadow-sm hover:shadow-md transition-all duration-200"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="rounded-full shadow-sm hover:shadow-md transition-all duration-200"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
