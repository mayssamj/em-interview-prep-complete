
import { prisma } from '@/lib/db';
import { Header } from '@/components/layout/header';
import { HelpCircle } from 'lucide-react';
import { QuestionBankClient } from '@/components/question-bank/question-bank-client';

export const dynamic = 'force-dynamic';

// Mock user for testing
const mockUser = {
  id: "cmbx5b4vc0000u41ugdwm5uxh",
  username: "admin",
  isAdmin: true
};

export default async function QuestionBankPage() {
  // Get all questions with company information
  const questions = await prisma.questions.findMany({
    include: {
      companies: true
    },
    orderBy: [
      { is_critical: 'desc' }, // Critical questions first
      { usage_count: 'desc' }, // Then by popularity
      { category: 'asc' },
      { difficulty: 'asc' }
    ]
  });

  // Get user's answers for progress tracking
  const userAnswers = await prisma.answers.findMany({
    where: { user_id: mockUser.id },
    select: { question_id: true }
  });

  const answeredQuestionIds = new Set(userAnswers.map((answer: any) => answer.question_id)) as Set<string>;

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <HelpCircle className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Question Bank</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive collection of Engineering Manager interview questions from top tech companies
            </p>
          </div>

          {/* Question Bank Content */}
          <QuestionBankClient 
            questions={questions} 
            answeredQuestionIds={answeredQuestionIds}
            userId={mockUser.id}
          />
        </div>
      </main>
    </div>
  );
}
