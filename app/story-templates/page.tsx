
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Header } from '@/components/layout/header';
import { BookOpen } from 'lucide-react';
import { StoryTemplatesClient } from '@/components/story-templates/story-templates-client';

export const dynamic = 'force-dynamic';

export default async function StoryTemplatesPage() {
  const user = await getSession();
  
  if (!user) {
    redirect('/login');
  }

  // Get user's stories
  const userStories = await prisma.story.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Story Templates</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create and manage your STAR stories for behavioral interview questions
            </p>
          </div>

          {/* Story Templates Content */}
          <StoryTemplatesClient userStories={userStories} userId={user.id} />
        </div>
      </main>
    </div>
  );
}
