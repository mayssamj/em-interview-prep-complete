
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Header } from '@/components/layout/header';
import { TrendingUp } from 'lucide-react';
import { ProgressTrackerClient } from '@/components/progress-tracker/progress-tracker-client';

export default async function ProgressTrackerPage() {
  const user = await getSession();
  
  if (!user) {
    redirect('/login');
  }

  // Get comprehensive user progress data
  const [userStories, userAnswers, companies, questions] = await Promise.all([
    prisma.story.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.answer.findMany({
      where: { userId: user.id },
      include: {
        question: {
          include: {
            company: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.company.findMany({
      include: {
        questions: true
      }
    }),
    prisma.question.findMany({
      include: {
        company: true
      }
    })
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Progress Tracker</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Track your interview preparation progress across companies and question categories
            </p>
          </div>

          {/* Progress Tracker Content */}
          <ProgressTrackerClient 
            userStories={userStories}
            userAnswers={userAnswers}
            companies={companies}
            questions={questions}
            userId={user.id}
          />
        </div>
      </main>
    </div>
  );
}
