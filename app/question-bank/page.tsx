
import { Suspense } from 'react';
import { QuestionBankClient } from '@/components/question-bank/question-bank-client';
import { prisma } from '@/lib/prisma';
import { safeJsonToStringArray } from '@/lib/type-utils';

async function getQuestions() {
  try {
    const questions = await prisma.behavioral_questions.findMany({
      include: {
        companies: true
      },
      orderBy: { created_at: 'desc' }
    });

    return questions.map(q => ({
      ...q,
      tags: safeJsonToStringArray(q.tags)
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

async function getAnsweredQuestionIds(userId: string) {
  try {
    const responses = await prisma.user_question_responses.findMany({
      where: { user_id: userId },
      select: { question_id: true }
    });
    
    return responses.map(r => r.question_id);
  } catch (error) {
    console.error('Error fetching answered questions:', error);
    return [];
  }
}

export default async function QuestionBankPage() {
  // Mock user for now - in real app, get from session
  const mockUser = { id: 'user-1', username: 'demo' };
  
  const [questions, answeredQuestionIds] = await Promise.all([
    getQuestions(),
    getAnsweredQuestionIds(mockUser.id)
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Question Bank
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Practice with curated behavioral and technical questions from top tech companies
            </p>
          </div>

          {/* Question Bank Content */}
          <Suspense fallback={<div>Loading questions...</div>}>
            <QuestionBankClient 
              questions={questions} 
              answeredQuestionIds={answeredQuestionIds}
              userId={mockUser.id}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
