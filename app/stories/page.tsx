
import { Suspense } from 'react';
import { StoriesManager } from '@/components/stories/stories-manager';
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

export default async function StoriesPage() {
  // Mock user for now - in real app, get from session
  const user = { id: 'user-1', username: 'demo' };
  const stories = await getUserStories(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Suspense fallback={<div>Loading stories...</div>}>
          <StoriesManager stories={stories} userId={user.id} />
        </Suspense>
      </main>
    </div>
  );
}
