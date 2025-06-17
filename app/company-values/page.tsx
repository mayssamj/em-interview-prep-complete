
import { Suspense } from 'react';
import { CompanyValuesClient } from '@/components/company-values/company-values-client';
import { prisma } from '@/lib/prisma';
import { safeJsonToStringArray } from '@/lib/type-utils';

async function getCompanies() {
  try {
    const companies = await prisma.companies.findMany({
      orderBy: { name: 'asc' }
    });
    
    return companies.map(c => ({
      ...c,
      values: safeJsonToStringArray(c.values),
      evaluation_criteria: safeJsonToStringArray(c.evaluation_criteria),
      success_tips: safeJsonToStringArray(c.success_tips),
      red_flags: safeJsonToStringArray(c.red_flags)
    }));
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

export default async function CompanyValuesPage() {
  const companies = await getCompanies();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Company Values & Culture
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Understand the core values and evaluation criteria for top tech companies
            </p>
          </div>

          {/* Company Values Content */}
          <Suspense fallback={<div>Loading companies...</div>}>
            <CompanyValuesClient companies={companies} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
