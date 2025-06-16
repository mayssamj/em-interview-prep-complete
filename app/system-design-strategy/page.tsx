
import { Metadata } from 'next';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { SystemDesignStrategyClient } from '@/components/system-design/system-design-strategy-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'System Design Strategy & Frameworks | EM Interview Prep',
  description: 'Learn system design frameworks and strategies for engineering manager interviews',
};

export default async function SystemDesignStrategyPage() {
  const user = await getServerSession();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">System Design Strategy & Frameworks</h1>
          <p className="text-muted-foreground">
            Master the frameworks and strategies essential for system design interviews. 
            Learn how to approach complex architectural problems with confidence.
          </p>
        </div>
        
        <SystemDesignStrategyClient />
      </main>
    </div>
  );
}
