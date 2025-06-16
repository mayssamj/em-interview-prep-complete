
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Header } from '@/components/layout/header';
import { BookOpen } from 'lucide-react';
import { StoryTemplatesClient } from '@/components/story-templates/story-templates-client';

export const dynamic = 'force-dynamic';

export default async function StoryTemplatesPage() {
  // Mock user for testing - remove auth check temporarily
  const mockUser = {
    id: "cmbx5b4vc0000u41ugdwm5uxh",
    username: "admin",
    isAdmin: true
  };

  // Get user's stories
  const userStories = await prisma.story.findMany({
    where: { user_id: mockUser.id },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />
      
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
          <StoryTemplatesClient userStories={userStories.map(s => ({
            id: s.id,
            title: s.title,
            situation: s.situation,
            task: s.task,
            action: s.action,
            result: s.result,
            reflection: s.reflection,
            tags: s.tags || [],
            categories: s.categories || [],
            createdAt: s.created_at
          }))} userId={mockUser.id} />
        </div>
      </main>
    </div>
  );
}
