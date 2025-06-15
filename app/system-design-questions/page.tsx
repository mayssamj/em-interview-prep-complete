
import { Metadata } from 'next';
import { SystemDesignQuestionBankClient } from '@/components/system-design/system-design-question-bank-client';

export const metadata: Metadata = {
  title: 'System Design Questions | EM Interview Prep',
  description: 'Practice system design questions for engineering manager interviews',
};

export default function SystemDesignQuestionsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Design Questions</h1>
        <p className="text-muted-foreground">
          Practice system design questions specifically curated for Engineering Manager roles. 
          Focus on architectural thinking, scalability, and leadership aspects of system design.
        </p>
      </div>
      
      <SystemDesignQuestionBankClient />
    </div>
  );
}
