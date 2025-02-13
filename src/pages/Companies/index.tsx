"use client";

import { useState } from "react";
import { CompanyFilters } from "@/components/companies/CompanyFilters";
import { CompanyList } from "@/components/companies/CompanyList";
import { AddCompanyDialog } from "@/components/companies/AddCompanyDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";

interface CompanyFormData {
  name: string;
  industry: string;
  size: string;
  location: string;
}

export default function CompaniesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddCompany = (data: CompanyFormData) => {
    // TODO: Implement API call to add company
    const { data: userData } = getSupabase()
      .from('users')
      .select('organization_id_main')
      .eq('id', user?.id)
      .single();
    console.log("Adding company:", data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Company
        </Button>
      </div>
      <CompanyFilters onFilterChange={() => {}} />
      <CompanyList filters={{ search: '', status: '', industry: '', size: '' }} />
      <AddCompanyDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddCompany}
      />
    </div>
  );
} 