
import { Metadata } from 'next';
import { SystemDesignStrategyClient } from '@/components/system-design/system-design-strategy-client';

export const metadata: Metadata = {
  title: 'System Design Strategy & Frameworks | EM Interview Prep',
  description: 'Learn system design frameworks and strategies for engineering manager interviews',
};

export default function SystemDesignStrategyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Design Strategy & Frameworks</h1>
        <p className="text-muted-foreground">
          Master the frameworks and strategies essential for system design interviews. 
          Learn how to approach complex architectural problems with confidence.
        </p>
      </div>
      
      <SystemDesignStrategyClient />
    </div>
  );
}
