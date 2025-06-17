
import { notFound } from 'next/navigation';
import { CompanyDetailClient } from '@/components/company/company-detail-client';
import { prisma } from '@/lib/prisma';
import { safeJsonToStringArray } from '@/lib/type-utils';

interface CompanyPageProps {
  params: {
    company: string;
  };
}

async function getCompanyData(companyName: string) {
  try {
    const company = await prisma.companies.findFirst({
      where: {
        name: {
          equals: companyName,
          mode: 'insensitive'
        }
      },
      include: {
        questions: {
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!company) {
      return null;
    }

    return {
      ...company,
      evaluation_criteria: safeJsonToStringArray(company.evaluation_criteria),
      success_tips: safeJsonToStringArray(company.success_tips),
      red_flags: safeJsonToStringArray(company.red_flags),
      questions: company.questions.map(q => ({
        ...q,
        tags: safeJsonToStringArray(q.tags)
      }))
    };
  } catch (error) {
    console.error('Error fetching company data:', error);
    return null;
  }
}

async function getUserStories(userId: string) {
  try {
    const stories = await prisma.user_stories.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return stories.map(s => ({
      ...s,
      tags: safeJsonToStringArray(s.tags),
      categories: safeJsonToStringArray(s.categories),
      createdAt: s.created_at
    }));
  } catch (error) {
    console.error('Error fetching user stories:', error);
    return [];
  }
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const companyName = decodeURIComponent(params.company);
  const company = await getCompanyData(companyName);
  
  if (!company) {
    notFound();
  }

  // Mock user for now - in real app, get from session
  const mockUser = { id: 'user-1', username: 'demo' };
  const userStories = await getUserStories(mockUser.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {company.name} Interview Preparation
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive preparation guide for {company.name} engineering manager interviews
            </p>
          </div>

          {/* Company Detail Content */}
          <CompanyDetailClient 
            company={{
              ...company,
              evaluationCriteria: company.evaluation_criteria,
              interviewFormat: company.interview_format,
              successTips: company.success_tips,
              redFlags: company.red_flags,
              questions: company.questions.map(q => ({
                id: q.id,
                category: q.category,
                questionText: q.question_text,
                difficulty: q.difficulty,
                tags: q.tags,
                isCritical: q.is_critical
              }))
            }}
            userStories={userStories.map(s => ({
              ...s,
              createdAt: s.created_at
            }))}
          />
        </div>
      </main>
    </div>
  );
}
