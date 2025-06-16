
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { MessageCircle } from 'lucide-react';
import { FAQClient } from '@/components/faq/faq-client';

export const dynamic = 'force-dynamic';

export default async function FAQPage() {
  const user = await getServerSession();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <MessageCircle className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Common questions and answers about Engineering Manager interview preparation
            </p>
          </div>

          {/* FAQ Content */}
          <FAQClient />
        </div>
      </main>
    </div>
  );
}
