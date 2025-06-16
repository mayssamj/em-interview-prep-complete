
'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Filter } from 'lucide-react';

interface CompanyFilterProps {
  onCompanyChange: (companyId: string) => void;
  selectedCompany: string;
}

const companies = [
  { id: 'all', name: 'All Companies' },
  { id: 'meta', name: 'Meta' },
  { id: 'amazon', name: 'Amazon' },
  { id: 'google', name: 'Google' },
  { id: 'microsoft', name: 'Microsoft' },
  { id: 'openai', name: 'OpenAI' },
  { id: 'netflix', name: 'Netflix' },
  { id: 'uber', name: 'Uber' },
  { id: 'airbnb', name: 'Airbnb' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'reddit', name: 'Reddit' },
  { id: 'snowflake', name: 'Snowflake' },
  { id: 'anthropic', name: 'Anthropic' },
  { id: 'scale-ai', name: 'Scale AI' },
  { id: 'startups', name: 'Startups & Scale-ups' },
];

export function CompanyFilter({ onCompanyChange, selectedCompany }: CompanyFilterProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filter by Company:</span>
          </div>
          <Select value={selectedCompany} onValueChange={onCompanyChange}>
            <SelectTrigger className="w-64 bg-background">
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {company.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
