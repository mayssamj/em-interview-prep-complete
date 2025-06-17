
import { Suspense } from 'react';
import { StoryTemplatesClient } from '@/components/story-templates/story-templates-client';
import { prisma } from '@/lib/prisma';
import { safeJsonToStringArray } from '@/lib/type-utils';

async function getUserStories(userId: string) {
  try {
    const stories = await prisma.user_stories.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return stories.map(s => ({
      id: s.id,
      title: s.title,
      situation: s.situation,
      task: s.task,
      action: s.action,
      result: s.result,
      reflection: s.reflection,
      tags: safeJsonToStringArray(s.tags),
      categories: safeJsonToStringArray(s.categories),
      createdAt: s.created_at
    }));
  } catch (error) {
    console.error('Error fetching user stories:', error);
    return [];
  }
}

export default async function StoryTemplatesPage() {
  // Mock user for now - in real app, get from session
  const mockUser = { id: 'user-1', username: 'demo' };
  const userStories = await getUserStories(mockUser.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Story Templates & Examples
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn from proven STAR method examples and create compelling interview stories
            </p>
          </div>

          {/* Story Templates Content */}
          <Suspense fallback={<div>Loading story templates...</div>}>
            <StoryTemplatesClient userStories={userStories} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
