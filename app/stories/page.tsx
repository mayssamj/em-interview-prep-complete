
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Header } from '@/components/layout/header';
import { StoriesManager } from '@/components/stories/stories-manager';

export default async function StoriesPage() {
  const user = await getSession();
  
  if (!user) {
    redirect('/login');
  }

  // Get user's stories
  const stories = await prisma.story.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <StoriesManager stories={stories} userId={user.id} />
      </main>
    </div>
  );
}
