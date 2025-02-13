import React, { useState } from 'react';
import { Phone, Mail, User, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { LeadFormState } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LeadFormState) => void;
  initialData?: LeadFormState;
  mode?: "add" | "edit";
}

export function LeadFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData = {
    company_name: "",
    contact_name: "",
    phone: "",
    email: "",
    timezone: ""
  },
  mode = "add"
}: LeadFormDialogProps) {
  const [formData, setFormData] = useState<LeadFormState>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(var(--background))] rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold font-plus-jakarta">{mode === "add" ? "Add New Lead" : "Edit Lead"}</DialogTitle>
          <DialogDescription className="text-[hsl(var(--muted-foreground))] font-outfit">
            {mode === "add" 
              ? "Enter the lead's information below."
              : "Edit the lead's information below."
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))] font-plus-jakarta">
                  <User className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Company Name
                </label>
                <Input
                  id="company_name"
                  placeholder="Company Name"
                  value={formData.company_name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, company_name: e.target.value })
                  }
                  required
                  className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-sm hover:shadow-md focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))] font-plus-jakarta">
                  <User className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Contact Name
                </label>
                <Input
                  id="contact_name"
                  placeholder="Contact Name"
                  value={formData.contact_name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_name: e.target.value })
                  }
                  required
                  className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-sm hover:shadow-md focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))] font-plus-jakarta">
                  <Phone className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Phone
                </label>
                <Input
                  id="phone"
                  placeholder="Phone"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-sm hover:shadow-md focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))] font-plus-jakarta">
                  <Mail className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-sm hover:shadow-md focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))] font-plus-jakarta">
              <FileText className="h-4 w-4 text-[hsl(var(--primary))]" />
              Timezone
            </label>
            <Select
              value={formData.timezone || "America/Los_Angeles"}
              onValueChange={(value) => setFormData({ ...formData, timezone: value })}
            >
              <SelectTrigger className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-sm hover:shadow-md transition-all duration-200">
                <SelectValue placeholder="Select timezone"/>
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border border-border shadow-lg">
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Phoenix">Arizona Time (AZ)</SelectItem>
                <SelectItem value="Europe/London">London Time (UTC/BST)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))] font-plus-jakarta">
              <FileText className="h-4 w-4 text-[hsl(var(--primary))]" />
              Agent Notes
            </label>
            <textarea
              value={formData.summary || ""}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={2}
              className="w-full min-h-[80px] resize-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-sm hover:shadow-md focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all duration-200"
            />
          </div>

          <DialogFooter>
            <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                className="rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200 w-full sm:w-auto font-plus-jakarta"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200 w-full sm:w-auto font-plus-jakarta"
              >
                {mode === "add" ? "Add Lead" : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
