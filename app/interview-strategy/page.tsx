
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Header } from '@/components/layout/header';
import { Target } from 'lucide-react';
import { InterviewStrategyClient } from '@/components/interview-strategy/interview-strategy-client';

export const dynamic = 'force-dynamic';

export default async function InterviewStrategyPage() {
  const user = await getServerSession();
  
  if (!user) {
    redirect('/login');
  }

  // Get all companies with their strategy information
  const companies = await prisma.company.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Interview Strategy</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Master your Engineering Manager interviews with proven strategies and frameworks
            </p>
          </div>

          {/* Interview Strategy Content */}
          <InterviewStrategyClient companies={companies.map(c => ({
            ...c,
            evaluationCriteria: c.evaluation_criteria,
            interviewFormat: c.interview_format,
            successTips: c.success_tips,
            redFlags: c.red_flags
          }))} />
        </div>
      </main>
    </div>
  );
}
