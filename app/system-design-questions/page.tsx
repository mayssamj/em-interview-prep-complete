
import { Metadata } from 'next';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { SystemDesignQuestionBankClient } from '@/components/system-design/system-design-question-bank-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'System Design Questions | EM Interview Prep',
  description: 'Practice system design questions for engineering manager interviews',
};

export default async function SystemDesignQuestionsPage() {
  // Mock user for testing - remove auth check temporarily
  const mockUser = {
    id: "cmbx5b4vc0000u41ugdwm5uxh",
    username: "admin",
    isAdmin: true
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">System Design Questions</h1>
          <p className="text-muted-foreground">
            Practice system design questions specifically curated for Engineering Manager roles. 
            Focus on architectural thinking, scalability, and leadership aspects of system design.
          </p>
        </div>
        
        <SystemDesignQuestionBankClient />
      </main>
    </div>
  );
}
