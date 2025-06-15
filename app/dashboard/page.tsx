
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { ProgressOverview } from '@/components/dashboard/progress-overview';
import { EnhancedCompanySelector } from '@/components/dashboard/enhanced-company-selector';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';

export default async function DashboardPage() {
  const user = await getSession();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back, <span className="text-primary">{user.username}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master your Engineering Manager interviews with structured preparation and proven frameworks
            </p>
          </div>

          {/* Progress Overview */}
          <ProgressOverview userId={user.id} />

          {/* Company Selection */}
          <EnhancedCompanySelector />

          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Activity */}
          <RecentActivity userId={user.id} />
        </div>
      </main>
    </div>
  );
}
