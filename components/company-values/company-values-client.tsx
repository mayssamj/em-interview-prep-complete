
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Target, CheckCircle, AlertTriangle } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  values: string[];
  evaluationCriteria: string[];
  interviewFormat: string;
  successTips: string[];
  redFlags: string[];
}

interface CompanyValuesClientProps {
  companies: Company[];
}

export function CompanyValuesClient({ companies }: CompanyValuesClientProps) {
  const [selectedCompany, setSelectedCompany] = useState<string>('all');

  const filteredCompanies = selectedCompany === 'all' 
    ? companies 
    : companies.filter(company => company.name.toLowerCase() === selectedCompany);

  const getCompanyColor = (companyName: string) => {
    switch (companyName.toLowerCase()) {
      case 'meta': return 'bg-blue-500';
      case 'amazon': return 'bg-orange-500';
      case 'google': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Filter */}
      <div className="flex justify-center">
        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.name.toLowerCase()}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Companies Grid */}
      <div className="grid gap-8">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${getCompanyColor(company.name)}`} />
                <CardTitle className="text-2xl">{company.name}</CardTitle>
              </div>
              <CardDescription>
                Core values and evaluation framework for {company.name} interviews
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Company Values */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Core Values</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {company.values.map((value, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Evaluation Criteria */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Evaluation Criteria</h3>
                </div>
                <div className="grid gap-2">
                  {company.evaluationCriteria.map((criteria, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{criteria}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Format */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Interview Format</h3>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  {company.interviewFormat}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Success Tips */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold">Success Tips</h3>
                  </div>
                  <div className="space-y-2">
                    {company.successTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Red Flags */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h3 className="text-lg font-semibold">Red Flags to Avoid</h3>
                  </div>
                  <div className="space-y-2">
                    {company.redFlags.map((flag, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
