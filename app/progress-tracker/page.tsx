
import { Suspense } from 'react';
import { ProgressTrackerClient } from '@/components/progress-tracker/progress-tracker-client';
import { prisma } from '@/lib/prisma';
import { safeJsonToStringArray } from '@/lib/type-utils';

async function getUserStories(userId: string) {
  try {
    const stories = await prisma.user_stories.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return stories.map(s => ({
      ...s,
      tags: safeJsonToStringArray(s.tags),
      categories: safeJsonToStringArray(s.categories),
      createdAt: s.created_at
    }));
  } catch (error) {
    console.error('Error fetching user stories:', error);
    return [];
  }
}

async function getQuestionStats(userId: string) {
  try {
    const totalQuestions = await prisma.behavioral_questions.count();
    const answeredQuestions = await prisma.user_question_responses.count({
      where: { user_id: userId }
    });

    return {
      total: totalQuestions,
      answered: answeredQuestions,
      remaining: totalQuestions - answeredQuestions
    };
  } catch (error) {
    console.error('Error fetching question stats:', error);
    return { total: 0, answered: 0, remaining: 0 };
  }
}

export default async function ProgressTrackerPage() {
  // Mock user for now - in real app, get from session
  const mockUser = { id: 'user-1', username: 'demo' };
  
  const [userStories, questionStats] = await Promise.all([
    getUserStories(mockUser.id),
    getQuestionStats(mockUser.id)
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Progress Tracker
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Track your interview preparation progress and identify areas for improvement
            </p>
          </div>

          {/* Progress Tracker Content */}
          <Suspense fallback={<div>Loading progress data...</div>}>
            <ProgressTrackerClient 
              userStories={userStories}
              questionStats={questionStats}
              userId={mockUser.id}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
