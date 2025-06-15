
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { InterviewNotesClient } from '@/components/interview-notes/interview-notes-client';

export default async function InterviewNotesPage() {
  const user = await getSession();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Interview Notes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track your interview experiences and learnings
            </p>
          </div>

          {/* Interview Notes Client */}
          <InterviewNotesClient userId={user.id} />
        </div>
      </main>
    </div>
  );
}
