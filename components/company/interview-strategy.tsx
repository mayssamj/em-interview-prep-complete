
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Lightbulb,
  Clock
} from 'lucide-react';

interface InterviewStrategyProps {
  company: {
    name: string;
    interviewFormat: string;
    successTips: string[];
    redFlags: string[];
  };
}

export function InterviewStrategy({ company }: InterviewStrategyProps) {
  const strategyTips = [
    {
      title: 'STAR Method Mastery',
      description: 'Structure every behavioral answer using Situation, Task, Action, Result format',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Quantify Your Impact',
      description: 'Use specific metrics and numbers to demonstrate your achievements',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Prepare Multiple Examples',
      description: 'Have 2-3 stories ready for each competency area',
      icon: Lightbulb,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Practice Out Loud',
      description: 'Rehearse your stories verbally to improve delivery and timing',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          {company.name} Interview Strategy
        </h2>
        <p className="text-muted-foreground">
          Proven strategies and best practices for success
        </p>
      </div>

      {/* Interview Format */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            Interview Process Overview
          </CardTitle>
          <CardDescription>
            Understanding the {company.name} interview structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-line m-0">
                {company.interviewFormat}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Strategy Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Universal Success Strategies
          </CardTitle>
          <CardDescription>
            Core strategies that work across all interview types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {strategyTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className={`p-2 rounded-md ${tip.bgColor} flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${tip.color}`} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Success Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              {company.name} Success Tips
            </CardTitle>
            <CardDescription>
              Company-specific strategies for success
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {company.successTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
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
              Common Pitfalls
            </CardTitle>
            <CardDescription>
              Mistakes to avoid during {company.name} interviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {company.redFlags.map((flag, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{flag}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* STAR Framework Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            STAR Framework Guide
          </CardTitle>
          <CardDescription>
            Master the behavioral interview format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">S</Badge>
                <h4 className="font-medium">Situation</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Set the context and background. Where and when did this take place?
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">T</Badge>
                <h4 className="font-medium">Task</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Describe the challenge or goal. What needed to be accomplished?
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">A</Badge>
                <h4 className="font-medium">Action</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Explain the specific steps you took. Focus on your individual contributions.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">R</Badge>
                <h4 className="font-medium">Result</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Share the outcomes and what you learned. Use metrics when possible.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
