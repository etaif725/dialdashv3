"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Edit,
  Trash2,
} from 'lucide-react';

interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    industry: string;
    location: string;
    employees: number;
    status: 'Active' | 'Inactive';
    phone?: string;
    email?: string;
    website?: string;
    lastContact: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{company.name}</CardTitle>
        <Badge
          variant={company.status === 'Active' ? 'success' : 'secondary'}
        >
          {company.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center space-x-4 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span>{company.industry}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{company.employees} employees</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{company.location}</span>
          </div>
          {company.phone && (
            <div className="flex items-center space-x-4 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{company.phone}</span>
            </div>
          )}
          {company.email && (
            <div className="flex items-center space-x-4 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{company.email}</span>
            </div>
          )}
          {company.website && (
            <div className="flex items-center space-x-4 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {company.website}
              </a>
            </div>
          )}
          <div className="flex items-center space-x-4 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Last Contact: {company.lastContact}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(company.id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(company.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 