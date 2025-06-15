
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { StoryForm } from '@/components/stories/story-form';

export default async function NewStoryPage() {
  const user = await getSession();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Create New Story</h1>
            <p className="text-muted-foreground">
              Use the STAR format to create a compelling interview story
            </p>
          </div>
          
          <StoryForm userId={user.id} />
        </div>
      </main>
    </div>
  );
}
