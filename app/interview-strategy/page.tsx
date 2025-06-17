
import { Suspense } from 'react';
import { InterviewStrategyClient } from '@/components/interview-strategy/interview-strategy-client';
import { prisma } from '@/lib/prisma';
import { safeJsonToStringArray } from '@/lib/type-utils';

async function getCompanies() {
  try {
    const companies = await prisma.companies.findMany({
      orderBy: { name: 'asc' }
    });
    
    return companies.map(c => ({
      ...c,
      evaluationCriteria: safeJsonToStringArray(c.evaluation_criteria),
      interviewFormat: c.interview_format,
      successTips: safeJsonToStringArray(c.success_tips),
      redFlags: safeJsonToStringArray(c.red_flags),
      values: safeJsonToStringArray(c.values)
    }));
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

export default async function InterviewStrategyPage() {
  const companies = await getCompanies();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Interview Strategy & Preparation
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Master your interview strategy with company-specific insights and proven frameworks
            </p>
          </div>

          {/* Interview Strategy Content */}
          <Suspense fallback={<div>Loading interview strategies...</div>}>
            <InterviewStrategyClient companies={companies} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
