
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Header } from '@/components/layout/header';
import { StoriesManager } from '@/components/stories/stories-manager';

export const dynamic = 'force-dynamic';

export default async function StoriesPage() {
  const user = await getSession();
  
  if (!user) {
    redirect('/login');
  }

  // Get user's stories
  const stories = await prisma.story.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <StoriesManager stories={stories.map(s => ({
          ...s,
          createdAt: s.created_at
        }))} userId={user.id} />
      </main>
    </div>
  );
}
