
'use client';

import { useState, useEffect } from 'react';
import { ProgressOverview } from '@/components/dashboard/progress-overview';
import { CompanyFilter } from '@/components/dashboard/company-filter';
import { FilteredCompanySelector } from '@/components/dashboard/filtered-company-selector';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';

interface DashboardClientProps {
  user: any;
}

export function DashboardClient({ user }: DashboardClientProps) {
  const [selectedCompany, setSelectedCompany] = useState('meta'); // Default to Meta

  // Load company preference from localStorage on mount
  useEffect(() => {
    const savedCompany = localStorage.getItem('selectedCompany');
    if (savedCompany) {
      setSelectedCompany(savedCompany);
    }
  }, []);

  // Save company preference to localStorage when changed
  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
    localStorage.setItem('selectedCompany', companyId);
  };

  return (
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

        {/* Company Filter */}
        <CompanyFilter 
          selectedCompany={selectedCompany}
          onCompanyChange={handleCompanyChange}
        />

        {/* Quick Actions - Moved to top */}
        <QuickActions />

        {/* Company Selection */}
        <FilteredCompanySelector selectedCompany={selectedCompany} />

        {/* Recent Activity */}
        <RecentActivity userId={user.id} />

        {/* Progress Overview - Moved to bottom */}
        <ProgressOverview userId={user.id} />
      </div>
    </main>
  );
}
