
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Target, 
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface CompanyOverviewProps {
  company: {
    name: string;
    values: string[];
    evaluationCriteria: string[];
    interviewFormat: string;
    successTips: string[];
    redFlags: string[];
  };
}

export function CompanyOverview({ company }: CompanyOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Company Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Company Values
          </CardTitle>
          <CardDescription>
            Core values that {company.name} looks for in Engineering Managers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {company.values.map((value, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Evaluation Criteria
          </CardTitle>
          <CardDescription>
            Key areas where {company.name} evaluates Engineering Manager candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {company.evaluationCriteria.map((criteria, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm leading-relaxed">{criteria}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interview Format */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            Interview Format
          </CardTitle>
          <CardDescription>
            Typical interview process structure at {company.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {company.interviewFormat}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Success Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Success Tips
            </CardTitle>
            <CardDescription>
              Best practices for {company.name} interviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {company.successTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Red Flags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Red Flags to Avoid
            </CardTitle>
            <CardDescription>
              Common mistakes that can hurt your chances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {company.redFlags.map((flag, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{flag}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
